//! The Rust port of `analyzePage` (`lib/analyze.ts`).
//!
//! Behavior notes (JS semantics preserved, not cleaned up):
//! - `String.length` counts UTF-16 code units, so title/meta lengths use
//!   `utf16_len`, not byte or char counts.
//! - `Math.round` rounds halves toward positive infinity (`crate::js::math_round`).
//! - `Number.prototype.toFixed(1)` rounds halves away from zero (`js_to_fixed_1`).
//! - The phone regex is JS without the `u` flag, so `\d` is ASCII-only:
//!   the pattern spells out `[0-9]` and runs with Unicode mode off.
//! - `new URL(...)` failures surface as `Err("Invalid URL")`; a null input
//!   surfaces the exact JS destructuring error; a non-string `html`
//!   surfaces cheerio's exact error.
//! - Numbers that JSON cannot express cross the wire as `{"$num": "..."}`;
//!   `crate::js::as_number` decodes them, and broken-link `status` values
//!   are stringified for issue text with JS `Number.prototype.toString`
//!   semantics (`crate::js::number_to_string`).

#![forbid(unsafe_code)]

use regex::RegexBuilder;
use scraper::{Html, Selector};
use serde_json::{Map, Value};

use crate::js;

/// UTF-16 code units, as JS `String.length` counts them.
fn utf16_len(s: &str) -> usize {
    s.encode_utf16().count()
}

/// JS `Number.prototype.toFixed(1)`: one decimal, halves away from zero,
/// `NaN` stays `NaN`, `-0` prints as `0.0`.
fn js_to_fixed_1(x: f64) -> String {
    if x.is_nan() {
        return "NaN".to_string();
    }
    if x.is_infinite() {
        return if x > 0.0 {
            "Infinity".to_string() // recorded-literal: JS Number.prototype.toString for +Infinity
        } else {
            "-Infinity".to_string() // recorded-literal: JS Number.prototype.toString for -Infinity
        };
    }
    if x == 0.0 {
        return "0.0".to_string();
    }
    let sign = if x < 0.0 { "-" } else { "" };
    let scaled = (x.abs() * 10.0).round();
    format!(
        "{sign}{}.{}",
        (scaled / 10.0).floor() as u64,
        (scaled % 10.0) as u64
    )
}

/// JS truthiness for the `hasSitemap` check.
fn js_truthy(v: Option<&Value>) -> bool {
    match v {
        None => false,
        Some(Value::Null) => false,
        Some(Value::Bool(b)) => *b,
        Some(Value::Number(n)) => n.as_f64().is_some_and(|f| f != 0.0 && !f.is_nan()),
        Some(Value::String(s)) => utf16_len(s) > 0,
        Some(Value::Object(o)) => {
            js::as_number(&Value::Object(o.clone())).is_none_or(|n| n != 0.0 && !n.is_nan())
        }
        Some(Value::Array(_)) => true,
    }
}

/// JS strict `=== false`.
fn is_strict_false(v: Option<&Value>) -> bool {
    matches!(v, Some(Value::Bool(false)))
}

/// JS `ToNumber` for the `loadMs` field: wire `{"$num": ...}` markers,
/// plain numbers, and the coercions JS applies to other shapes.
fn js_to_number(v: Option<&Value>) -> f64 {
    match v {
        None => f64::NAN,
        Some(Value::Number(n)) => n.as_f64().unwrap_or(f64::NAN),
        Some(Value::Object(_)) => js::as_number(v.unwrap_or(&Value::Null)).unwrap_or(f64::NAN),
        Some(Value::Bool(b)) => *b as u8 as f64,
        Some(Value::Null) => 0.0,
        Some(Value::String(s)) => js_string_to_number(s),
        Some(Value::Array(_)) => f64::NAN,
    }
}

/// JS `String` to `Number`: trim, empty is 0, `Infinity`, hex, decimal.
fn js_string_to_number(s: &str) -> f64 {
    let t = s.trim_matches(|c: char| {
        c.is_whitespace()
            || c == '\u{00a0}'
            || c == '\u{feff}'
            || ('\u{2000}'..='\u{200a}').contains(&c)
    });
    if t.is_empty() {
        return 0.0;
    }
    match t {
        "Infinity" | "+Infinity" => return f64::INFINITY, // recorded-literal: JS Number("Infinity") spelling
        "-Infinity" => return f64::NEG_INFINITY, // recorded-literal: JS Number("-Infinity") spelling
        _ => {}
    }
    let (neg, hex) = {
        let (mut neg, mut hex) = (false, None);
        for (prefix, is_neg) in [
            ("0x", false),
            ("0X", false),
            ("+0x", false),
            ("+0X", false),
            ("-0x", true),
            ("-0X", true),
        ] {
            if let Some(h) = t.strip_prefix(prefix) {
                neg = is_neg;
                hex = Some(h);
                break;
            }
        }
        (neg, hex)
    };
    if let Some(hex) = hex {
        return match u64::from_str_radix(hex, 16) {
            Ok(n) => {
                if neg {
                    -(n as f64)
                } else {
                    n as f64
                }
            }
            Err(_) => f64::NAN,
        };
    }
    t.parse::<f64>().unwrap_or(f64::NAN)
}

/// JS template-literal stringification for a broken-link `status` value.
fn js_stringify(v: &Value) -> String {
    match v {
        Value::Null => "null".to_string(),
        Value::Bool(b) => {
            if *b {
                "true".to_string()
            } else {
                "false".to_string()
            }
        }
        Value::Number(n) => js::number_to_string(n.as_f64().unwrap_or(f64::NAN)),
        Value::String(s) => s.clone(),
        Value::Object(o) => {
            if let Some(n) = js::as_number(&Value::Object(o.clone())) {
                js::number_to_string(n)
            } else if js::is_undefined(&Value::Object(o.clone())) {
                "undefined".to_string()
            } else {
                "[object Object]".to_string()
            }
        }
        Value::Array(_) => "[object Object]".to_string(),
    }
}

fn grade_for(score: i64) -> &'static str {
    match score {
        90.. => "A",
        80..=89 => "B",
        70..=79 => "C",
        60..=69 => "D",
        _ => "F",
    }
}

fn score_from_checks(passed: i64, total: i64) -> i64 {
    if total == 0 {
        return 50;
    }
    js::math_round((passed as f64 / total as f64) * 100.0) as i64
}

fn sel(pattern: &str) -> Result<Selector, String> {
    Selector::parse(pattern).map_err(|e| format!("{e:?}"))
}

/// Port of `analyzePage` (`lib/analyze.ts:73`).
pub fn analyze_page(input: Value) -> Result<Value, String> {
    // JS destructuring: `const { html, finalUrl, loadMs, ... } = input`.
    // A null input throws the destructuring error; any other non-object
    // has no named fields, so `html` is undefined.
    if input.is_null() {
        return Err(
            "Cannot destructure property 'html' of 'input' as it is null.".to_string(), // recorded-literal: V8's TypeError message for destructuring null
        );
    }
    let empty;
    let fields: &Map<String, Value> = match input.as_object() {
        Some(m) => m,
        None => {
            empty = Map::new();
            &empty
        }
    };
    let get = |name: &str| fields.get(name);

    // cheerio.load(html) throws unless html is a string.
    let html = match get("html") {
        Some(Value::String(s)) => s.clone(),
        _ => return Err("cheerio.load() expects a string".to_string()), // recorded-literal: cheerio's error message for a non-string html
    };

    // `new URL(finalUrl)` throws "Invalid URL" for anything unparseable.
    let final_url = match get("finalUrl") {
        Some(Value::String(s)) => s.clone(),
        _ => return Err("Invalid URL".to_string()), // recorded-literal: the WHATWG URL constructor's TypeError message
    };
    let base = url::Url::parse(&final_url).map_err(|_| {
        "Invalid URL".to_string() // recorded-literal: same URL constructor TypeError as above
    })?;
    let page_origin = base.origin().ascii_serialization();

    let load_ms = js_to_number(get("loadMs"));
    let has_sitemap = js_truthy(get("hasSitemap"));
    let has_sitemap_raw = get("hasSitemap");
    // `brokenLinks` is only ever read for `.length` and `.map` in the
    // original; non-arrays surface the JS errors for those accesses.
    let broken_links: Vec<Value> = match get("brokenLinks") {
        None => {
            return Err("Cannot read properties of undefined (reading 'length')".to_string());
        }
        Some(Value::Array(a)) => a.clone(),
        Some(Value::Null) => {
            return Err("Cannot read properties of null (reading 'length')".to_string());
        }
        Some(Value::String(s)) if utf16_len(s) == 0 => Vec::new(),
        Some(_) => return Err("brokenLinks.map is not a function".to_string()),
    };

    let document = Html::parse_document(&html);
    let title_sel = sel("title")?;
    let meta_desc_sel = sel("meta[name=\"description\"]")?;
    let h1_sel = sel("h1")?;
    let img_sel = sel("img")?;
    let link_sel = sel("a[href]")?;
    let viewport_sel = sel("meta[name=\"viewport\"]")?;
    let canonical_sel = sel("link[rel=\"canonical\"]")?;
    let favicon_sel = sel("link[rel=\"icon\"], link[rel=\"shortcut icon\"]")?;
    let tel_sel = sel("a[href^=\"tel:\"]")?;
    let mailto_sel = sel("a[href^=\"mailto:\"]")?;
    let form_sel = sel("form")?;
    let form_field_sel = sel("input, select, textarea")?;
    let jsonld_sel = sel("script[type=\"application/ld+json\"]")?;
    let body_sel = sel("body")?;

    let text_of =
        |el: scraper::ElementRef<'_>| -> String { el.text().collect::<Vec<_>>().join("") };
    // First match's text, or its named attribute when one is given.
    let first = |s: &Selector, attr: Option<&str>| -> String {
        let Some(el) = document.select(s).next() else {
            return String::new();
        };
        match attr {
            Some(a) => el.value().attr(a).unwrap_or("").trim().to_string(),
            None => text_of(el).trim().to_string(),
        }
    };

    let title = first(&title_sel, None);
    let meta_description = first(&meta_desc_sel, Some("content"));
    let h1_count = document.select(&h1_sel).count() as i64;

    let mut image_count: i64 = 0;
    let mut images_missing_alt: i64 = 0;
    for img in document.select(&img_sel) {
        image_count += 1;
        match img.value().attr("alt") {
            None => images_missing_alt += 1,
            Some(a) if a.trim().is_empty() => images_missing_alt += 1,
            Some(_) => {}
        }
    }

    let mut internal_links: Vec<String> = Vec::new();
    let mut external_links: Vec<String> = Vec::new();
    for a in document.select(&link_sel) {
        let href = a.value().attr("href").unwrap_or("");
        if href.starts_with('#') || href.starts_with("mailto:") || href.starts_with("tel:") {
            continue;
        }
        let resolved = match base.join(href) {
            Ok(u) => u,
            Err(_) => continue,
        };
        if resolved.origin().ascii_serialization() == page_origin {
            internal_links.push(resolved.to_string());
        } else if resolved.scheme() == "http" || resolved.scheme() == "https" {
            external_links.push(resolved.to_string());
        }
    }

    let has_viewport = document.select(&viewport_sel).next().is_some();
    let has_canonical = document.select(&canonical_sel).next().is_some();
    let has_favicon = document.select(&favicon_sel).next().is_some();
    let has_tel = document.select(&tel_sel).next().is_some();
    let has_mailto = document.select(&mailto_sel).next().is_some();
    let mut has_form = false;
    let mut form_fields: i64 = 0;
    for form in document.select(&form_sel) {
        has_form = true;
        form_fields += form.select(&form_field_sel).count() as i64;
    }

    let mut has_schema = false;
    for script in document.select(&jsonld_sel) {
        let text = text_of(script);
        if let Ok(data) = serde_json::from_str::<Value>(&text)
            && let Ok(serialized) = serde_json::to_string(&data)
            && (serialized.contains("LocalBusiness") || serialized.contains("Organization"))
        {
            has_schema = true;
        }
    }

    let body_text = document
        .select(&body_sel)
        .next()
        .map(text_of)
        .unwrap_or_default();
    let phone_re = RegexBuilder::new(r"(\+?1[-. ]?)?(\(?[0-9]{3}\)?[-. ]?)[0-9]{3}[-. ]?[0-9]{4}")
        .unicode(false)
        .build()
        .map_err(|e| e.to_string())?;
    let phone_visible = phone_re.is_match(&body_text);
    let https = final_url.starts_with("https://");

    // ---- Scoring (weights: Speed 20, Mobile 15, SEO 20, Technical 15, Conversion 15, Trust 15)
    let mut issues: Vec<Value> = Vec::new();
    let mut n: i64 = 0;
    let mut add_issue = |category: &'static str,
                         severity: &'static str,
                         title: String,
                         found: String,
                         why: &str,
                         fix: &str| {
        n += 1;
        issues.push(serde_json::json!({
            "id": format!("i{n}"),
            "category": category,
            "severity": severity,
            "title": title,
            "found": found,
            "why": why,
            "fix": fix,
        }));
    };

    // One check: count the total, count the pass, or record the issue.
    macro_rules! check {
        ($passed:ident, $total:ident, $ok:expr, $cat:expr, $sev:expr, $title:expr, $found:expr, $why:expr, $fix:expr $(,)?) => {
            $total += 1;
            if $ok {
                $passed += 1;
            } else {
                add_issue($cat, $sev, $title, $found, $why, $fix);
            }
        };
    }

    let page_mb = html.len() as f64 / 1024.0 / 1024.0;
    // Speed
    let mut speed_passed: i64 = 0;
    let mut speed_total: i64 = 0;
    check!(
        speed_passed,
        speed_total,
        load_ms <= 2500.0,
        "speed",
        if load_ms > 5000.0 {
            "Critical"
        } else {
            "Fix soon"
        },
        "Homepage loads slowly".to_string(),
        format!(
            "The homepage took about {} seconds to fetch in this run.",
            js_to_fixed_1(load_ms / 1000.0)
        ),
        "Visitors on a phone leave slow pages before they read anything, so fewer of them call.",
        "Compress large images, remove unused scripts, and ask the host about caching.",
    );
    check!(
        speed_passed,
        speed_total,
        page_mb <= 2.0,
        "speed",
        "Fix soon",
        "Homepage is heavy".to_string(),
        format!(
            "The homepage HTML and page weight measured about {} MB in this run.",
            js_to_fixed_1(page_mb)
        ),
        "Heavy pages cost mobile visitors time and data, and some leave before the page finishes.",
        "Compress images and remove resources the homepage does not need.",
    );
    // The original counts this check in the total but records no issue
    // when it fails (alt text is covered by the SEO check instead).
    speed_total += 1;
    if images_missing_alt == 0 || image_count == 0 {
        speed_passed += 1;
    }
    let speed_score = score_from_checks(speed_passed, speed_total);

    // Mobile
    let mut mobile_passed: i64 = 0;
    let mut mobile_total: i64 = 0;
    check!(
        mobile_passed,
        mobile_total,
        has_viewport,
        "mobile",
        "Critical",
        "No mobile viewport tag".to_string(),
        "No viewport meta tag was found on the homepage.".to_string(),
        "Without it, phones show a shrunken desktop page that visitors must pinch and zoom.",
        "Add <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\"> to the page head.",
    );
    check!(
        mobile_passed,
        mobile_total,
        has_tel,
        "mobile",
        "Fix soon",
        "No tap-to-call link".to_string(),
        "No tel: link was found on the homepage.".to_string(),
        "Mobile visitors expect to tap the phone number and call straight away.",
        "Make the phone number a tel: link in the header.",
    );
    let mobile_score = score_from_checks(mobile_passed, mobile_total);

    // On-page SEO
    let mut seo_passed: i64 = 0;
    let mut seo_total: i64 = 0;
    let title_len = utf16_len(&title) as i64;
    seo_total += 1;
    if (30..=65).contains(&title_len) {
        seo_passed += 1;
    } else if title_len == 0 {
        add_issue(
            "seo",
            "Critical",
            "Page title is missing".to_string(),
            "No title tag was found on the homepage.".to_string(),
            "The title is what shows in search results, so a missing title means a weak first impression.",
            "Write a title of about 50 to 60 characters naming the service and the city.",
        );
    } else {
        add_issue(
            "seo",
            "Fix soon",
            "Page title is too short or too long".to_string(),
            format!("The title is {title_len} characters: \"{title}\"."),
            "Titles that are too short say too little in search results, and long titles get cut off.",
            "Rewrite the title to about 50 to 60 characters with the service and the city.",
        );
    }
    let meta_len = utf16_len(&meta_description) as i64;
    seo_total += 1;
    if (120..=160).contains(&meta_len) {
        seo_passed += 1;
    } else if meta_len == 0 {
        add_issue(
            "seo",
            "Critical",
            "Meta description is missing".to_string(),
            "No meta description was found on the homepage.".to_string(),
            "Search results show a random snippet instead of a sentence written to win the click.",
            "Write a meta description of 120 to 160 characters with a clear reason to call.",
        );
    } else {
        add_issue(
            "seo",
            "Fix soon",
            "Meta description length is off".to_string(),
            format!("The meta description is {meta_len} characters."),
            "Descriptions outside 120 to 160 characters get cut off or leave space unused in search results.",
            "Rewrite the meta description to 120 to 160 characters.",
        );
    }
    seo_total += 1;
    if h1_count == 1 {
        seo_passed += 1;
    } else if h1_count == 0 {
        add_issue(
            "seo",
            "Fix soon",
            "No H1 heading".to_string(),
            "No H1 heading was found on the homepage.".to_string(),
            "The H1 tells visitors and search engines what the page is about.",
            "Add one H1 naming the main service and city.",
        );
    } else {
        add_issue(
            "seo",
            "Fix soon",
            "More than one H1 heading".to_string(),
            format!("{h1_count} H1 headings were found on the homepage."),
            "Several H1s split the message about what the page is for.",
            "Keep one H1 and turn the rest into H2 headings.",
        );
    }
    check!(
        seo_passed,
        seo_total,
        images_missing_alt == 0,
        "seo",
        "Fix soon",
        format!("{images_missing_alt} of {image_count} images have no alt text"),
        format!("{images_missing_alt} images have missing or empty alt text."),
        "Search engines and screen readers cannot tell what those images show.",
        "Write one short alt description per image, naming the service shown.",
    );
    let seo_score = score_from_checks(seo_passed, seo_total);

    // Technical
    let mut tech_passed: i64 = 0;
    let mut tech_total: i64 = 0;
    check!(
        tech_passed,
        tech_total,
        https,
        "technical",
        "Critical",
        "Site does not use HTTPS".to_string(),
        "The final URL is not HTTPS.".to_string(),
        "Browsers warn visitors away from non-HTTPS sites, and some will not stay.",
        "Move the site to HTTPS and redirect all HTTP traffic to HTTPS.",
    );
    tech_total += 1;
    if broken_links.is_empty() {
        tech_passed += 1;
    } else {
        let list = broken_links
            .iter()
            .map(|b| {
                let u = b.get("url").map(js_stringify).unwrap_or_default();
                let s = b.get("status").map(js_stringify).unwrap_or_default();
                format!("{u} ({s})")
            })
            .collect::<Vec<_>>()
            .join(", ");
        add_issue(
            "technical",
            "Critical",
            format!(
                "{} checked link{} failed",
                broken_links.len(),
                if broken_links.len() == 1 { "" } else { "s" }
            ),
            format!("These links did not return a working page: {list}."),
            "A visitor who taps a link and lands on an error page is unlikely to try again.",
            "Fix or remove each broken link.",
        );
    }
    check!(
        tech_passed,
        tech_total,
        has_canonical,
        "technical",
        "Nice to have",
        "No canonical tag".to_string(),
        "No canonical link tag was found.".to_string(),
        "Search engines may treat similar pages as duplicates without one.",
        "Add a canonical tag pointing at the page itself.",
    );
    tech_total += 1;
    if has_sitemap {
        tech_passed += 1;
    } else if is_strict_false(has_sitemap_raw) {
        add_issue(
            "technical",
            "Nice to have",
            "No sitemap file found".to_string(),
            "No sitemap.xml file was found at the usual address.".to_string(),
            "A sitemap helps search engines find every page on the site.",
            "Add a sitemap.xml and list it in robots.txt.",
        );
    }
    let technical_score = if https {
        score_from_checks(tech_passed, tech_total)
    } else {
        0
    };

    // Conversion
    let mut conv_passed: i64 = 0;
    let mut conv_total: i64 = 0;
    check!(
        conv_passed,
        conv_total,
        phone_visible || has_tel,
        "conversion",
        "Critical",
        "No phone number visible on the homepage".to_string(),
        "No phone number was found in the visible page text.".to_string(),
        "Visitors who cannot see a number cannot call, and most will not hunt for a contact page.",
        "Put the phone number in the header and near the main call to action.",
    );
    check!(
        conv_passed,
        conv_total,
        has_form,
        "conversion",
        "Fix soon",
        "No contact or booking form".to_string(),
        "No form was found on the homepage.".to_string(),
        "Visitors who prefer to write rather than call have no way to enquire.",
        "Add a short contact form with name, phone, and message.",
    );
    conv_total += 1;
    if has_form && form_fields <= 6 {
        conv_passed += 1;
    } else if has_form {
        add_issue(
            "conversion",
            "Fix soon",
            "Contact form asks for too much up front".to_string(),
            format!("The contact form has {form_fields} fields."),
            "Long forms put people off, so fewer visitors send an enquiry.",
            "Cut the form to name, phone, and message, and ask for the rest later.",
        );
    }
    let conversion_score = score_from_checks(conv_passed, conv_total);

    // Trust, local and social
    let mut trust_passed: i64 = 0;
    let mut trust_total: i64 = 0;
    check!(
        trust_passed,
        trust_total,
        has_schema,
        "trust",
        "Fix soon",
        "No LocalBusiness details for search engines".to_string(),
        "No LocalBusiness or Organization schema was found on the homepage.".to_string(),
        "Search engines use that structured detail to show the business correctly in local results.",
        "Add LocalBusiness schema with name, address, phone, and opening hours.",
    );
    check!(
        trust_passed,
        trust_total,
        has_favicon,
        "trust",
        "Nice to have",
        "No favicon".to_string(),
        "No favicon was found.".to_string(),
        "A missing favicon makes the site look unfinished in browser tabs and bookmarks.",
        "Add a favicon for the site.",
    );
    check!(
        trust_passed,
        trust_total,
        !external_links.is_empty(),
        "trust",
        "Nice to have",
        "No social or external links found".to_string(),
        "No external links were found on the homepage.".to_string(),
        "Links to social profiles help visitors check that the business is real and active.",
        "Add links to the business social profiles.",
    );
    let trust_score = score_from_checks(trust_passed, trust_total);

    let categories_json: Vec<Value> = [
        ("speed", speed_score),
        ("mobile", mobile_score),
        ("seo", seo_score),
        ("technical", technical_score),
        ("conversion", conversion_score),
        ("trust", trust_score),
    ]
    .iter()
    .map(|(k, s)| serde_json::json!({"key": k, "score": s, "grade": grade_for(*s)}))
    .collect();
    let overall = js::math_round(
        speed_score as f64 * 0.20
            + mobile_score as f64 * 0.15
            + seo_score as f64 * 0.20
            + technical_score as f64 * 0.15
            + conversion_score as f64 * 0.15
            + trust_score as f64 * 0.15,
    ) as i64;

    Ok(serde_json::json!({
        "title": title,
        "metaDescription": meta_description,
        "h1Count": h1_count,
        "imageCount": image_count,
        "imagesMissingAlt": images_missing_alt,
        "internalLinks": internal_links.len() as i64,
        "externalLinks": external_links.len() as i64,
        "hasViewport": has_viewport,
        "hasSchema": has_schema,
        "hasTel": has_tel,
        "hasMailto": has_mailto,
        "hasForm": has_form,
        "formFields": form_fields,
        "hasFavicon": has_favicon,
        "hasCanonical": has_canonical,
        "overallScore": overall,
        "overallGrade": grade_for(overall),
        "categories": categories_json,
        "issues": issues,
        "couldNotCheck": [
            "Field speed data for real visitors. This run measures the page as fetched by the server, not real-user data.",
            "PageSpeed Insights / Lighthouse scores. No PageSpeed API key is wired in v1, so speed is scored from measured load time and page size.",
        ],
    }))
}

#[cfg(test)]
mod port_tests {
    use super::*;

    #[test]
    fn rejects_bad_inputs_with_the_original_errors() {
        assert_eq!(
            analyze_page(Value::Null),
            Err("Cannot destructure property 'html' of 'input' as it is null.".to_string())
        );
        assert_eq!(
            analyze_page(serde_json::json!({"html": 42, "finalUrl": "https://example.com"})),
            Err("cheerio.load() expects a string".to_string())
        );
        assert_eq!(
            analyze_page(serde_json::json!({"html": "hello", "finalUrl": "hello world"})),
            Err("Invalid URL".to_string())
        );
    }

    #[test]
    fn grades_an_empty_page_as_the_original_does() {
        let input = serde_json::json!({
            "html": "",
            "finalUrl": "https://example.com",
            "loadMs": 100,
            "hasRobots": true,
            "hasSitemap": false,
            "brokenLinks": []
        });
        let out = analyze_page(input).expect("empty page analyzes");
        assert_eq!(out["overallScore"], 33);
        assert_eq!(out["overallGrade"], "F");
        assert_eq!(out["issues"].as_array().map(|a| a.len()), Some(12));
    }

    #[test]
    fn title_length_counts_utf16_units() {
        assert_eq!(utf16_len("😀"), 2);
        assert_eq!(utf16_len("hello"), 5);
        assert_eq!(js_to_fixed_1(2.25), "2.3");
        assert_eq!(js_to_fixed_1(-0.0), "0.0");
        assert_eq!(js_to_fixed_1(f64::NAN), "NaN");
    }
}
