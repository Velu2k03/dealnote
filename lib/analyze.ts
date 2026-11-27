// >>> rust-anything: analyze-page-rs is on. `rust-anything disable ../rust/analyze-page-rs` removes this block.
// @ts-ignore
const __rustAnything_analyze_page_rs = ((p) => p && p.env.RUST_ANYTHING_MODE !== 'old' && p.env.RUST_ANYTHING_UNIT_ANALYZE_PAGE !== 'original' && (() => { try { const m = p.getBuiltinModule('node:module'); const at = p.getBuiltinModule('node:path').join(import.meta.dirname, "../rust/analyze-page-rs/index.cjs"); return m.createRequire(at)(at) } catch (e) { if (p.env.RUST_ANYTHING_MODE === 'new') throw e } })())(globalThis.process)
// @ts-ignore
if (__rustAnything_analyze_page_rs) { analyzePage = __rustAnything_analyze_page_rs.analyzePage }
// <<< rust-anything: analyze-page-rs
// DealNote pure audit analysis: HTML in, scores and issues out.
// Extracted from app/api/audit/route.ts so the analysis can be
// characterized, tested, and ported piece by piece (rust-anything).
// No network, no I/O: the route does the fetching and passes in what
// it measured. Behavior must stay identical to the route version.
import * as cheerio from "cheerio";
import {
  gradeFor,
  type AuditResult,
  type CategoryKey,
  type CategoryScore,
  type Issue,
  type Severity,
} from "@/lib/audit";

export interface AnalyzeInput {
  html: string;
  finalUrl: string;
  loadMs: number;
  hasRobots: boolean | null;
  hasSitemap: boolean | null;
  brokenLinks: { url: string; status: number | string }[];
}

export interface AnalyzeOutput {
  title: string;
  metaDescription: string;
  h1Count: number;
  imageCount: number;
  imagesMissingAlt: number;
  internalLinks: number;
  externalLinks: number;
  hasViewport: boolean;
  hasSchema: boolean;
  hasTel: boolean;
  hasMailto: boolean;
  hasForm: boolean;
  formFields: number;
  hasFavicon: boolean;
  hasCanonical: boolean;
  overallScore: number;
  overallGrade: string;
  categories: CategoryScore[];
  issues: Issue[];
  couldNotCheck: string[];
}

// Internal link URLs only, for the route's broken-link checks.
// Same link classification as analyzePage; kept separate so the route
// can check links without running the full analysis twice.
export function internalLinksOf(html: string, finalUrl: string): string[] {
  const $ = cheerio.load(html);
  const out: string[] = [];
  const pageOrigin = new URL(finalUrl).origin;
  $("a[href]").each((_, el) => {
    const href = $(el).attr("href") || "";
    if (href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) return;
    try {
      const resolved = new URL(href, finalUrl);
      if (resolved.origin === pageOrigin) out.push(resolved.toString());
    } catch {
      // Ignore unparseable hrefs.
    }
  });
  return out;
}

function scoreFromChecks(passed: number, total: number): number {
  if (total === 0) return 50;
  return Math.round((passed / total) * 100);
}

export function analyzePage(input: AnalyzeInput): AnalyzeOutput {
  const { html, finalUrl, loadMs, hasRobots, hasSitemap, brokenLinks } = input;
  const $ = cheerio.load(html);

  const title = ($("title").first().text() || "").trim();
  const metaDescription = ($('meta[name="description"]').attr("content") || "").trim();
  const h1s = $("h1");
  const h1Count = h1s.length;
  const images = $("img");
  const imageCount = images.length;
  let imagesMissingAlt = 0;
  images.each((_, el) => {
    const alt = $(el).attr("alt");
    if (alt === undefined || alt.trim() === "") imagesMissingAlt += 1;
  });

  const links = $("a[href]");
  const internalLinks: string[] = [];
  const externalLinks: string[] = [];
  const pageOrigin = new URL(finalUrl).origin;
  links.each((_, el) => {
    const href = $(el).attr("href") || "";
    if (href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) return;
    try {
      const resolved = new URL(href, finalUrl);
      if (resolved.origin === pageOrigin) internalLinks.push(resolved.toString());
      else if (resolved.protocol === "http:" || resolved.protocol === "https:") externalLinks.push(resolved.toString());
    } catch {
      // Ignore unparseable hrefs; they are not counted as links.
    }
  });

  const hasViewport = $('meta[name="viewport"]').length > 0;
  const hasCanonical = $('link[rel="canonical"]').length > 0;
  const hasFavicon = $('link[rel="icon"], link[rel="shortcut icon"]').length > 0;
  const hasTel = $('a[href^="tel:"]').length > 0;
  const hasMailto = $('a[href^="mailto:"]').length > 0;
  const forms = $("form");
  const hasForm = forms.length > 0;
  let formFields = 0;
  forms.each((_, form) => {
    formFields += $(form).find("input, select, textarea").length;
  });

  let hasSchema = false;
  $('script[type="application/ld+json"]').each((_, el) => {
    try {
      const data = JSON.parse($(el).text() || "");
      const text = JSON.stringify(data);
      if (/LocalBusiness|Organization/.test(text)) hasSchema = true;
    } catch {
      // Invalid JSON-LD is ignored; a missing-schema finding covers it.
    }
  });

  const bodyText = $("body").text();
  const phoneVisible = /(\+?1[-. ]?)?(\(?\d{3}\)?[-. ]?)\d{3}[-. ]?\d{4}/.test(bodyText);
  const https = finalUrl.startsWith("https://");

  // ---- Scoring (weights: Speed 20, Mobile 15, SEO 20, Technical 15, Conversion 15, Trust 15)
  const issues: Issue[] = [];
  const couldNotCheck: string[] = [
    "Field speed data for real visitors. This run measures the page as fetched by the server, not real-user data.",
    "PageSpeed Insights / Lighthouse scores. No PageSpeed API key is wired in v1, so speed is scored from measured load time and page size.",
  ];
  let n = 0;
  const addIssue = (
    category: CategoryKey,
    severity: Severity,
    title: string,
    found: string,
    why: string,
    fix: string,
  ) => {
    n += 1;
    issues.push({ id: `i${n}`, category, severity, title, found, why, fix });
  };

  const pageMB = Buffer.byteLength(html, "utf8") / 1024 / 1024;
  // Speed: load time and page weight as a lab proxy, labelled as such.
  let speedPassed = 0;
  let speedTotal = 0;
  speedTotal += 1; if (loadMs <= 2500) speedPassed += 1; else addIssue("speed", loadMs > 5000 ? "Critical" : "Fix soon", "Homepage loads slowly", `The homepage took about ${(loadMs / 1000).toFixed(1)} seconds to fetch in this run.`, "Visitors on a phone leave slow pages before they read anything, so fewer of them call.", "Compress large images, remove unused scripts, and ask the host about caching.");
  speedTotal += 1; if (pageMB <= 2) speedPassed += 1; else addIssue("speed", "Fix soon", "Homepage is heavy", `The homepage HTML and page weight measured about ${pageMB.toFixed(1)} MB in this run.`, "Heavy pages cost mobile visitors time and data, and some leave before the page finishes.", "Compress images and remove resources the homepage does not need.");
  speedTotal += 1; if (imagesMissingAlt === 0 || imageCount === 0) speedPassed += 1;
  const speedScore = scoreFromChecks(speedPassed, speedTotal);

  // Mobile
  let mobilePassed = 0;
  let mobileTotal = 0;
  mobileTotal += 1; if (hasViewport) mobilePassed += 1; else addIssue("mobile", "Critical", "No mobile viewport tag", "No viewport meta tag was found on the homepage.", "Without it, phones show a shrunken desktop page that visitors must pinch and zoom.", "Add <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\"> to the page head.");
  mobileTotal += 1; if (hasTel) mobilePassed += 1; else addIssue("mobile", "Fix soon", "No tap-to-call link", "No tel: link was found on the homepage.", "Mobile visitors expect to tap the phone number and call straight away.", "Make the phone number a tel: link in the header.");
  const mobileScore = scoreFromChecks(mobilePassed, mobileTotal);

  // On-page SEO
  let seoPassed = 0;
  let seoTotal = 0;
  seoTotal += 1;
  if (title.length >= 30 && title.length <= 65) seoPassed += 1;
  else if (title.length === 0) addIssue("seo", "Critical", "Page title is missing", "No title tag was found on the homepage.", "The title is what shows in search results, so a missing title means a weak first impression.", "Write a title of about 50 to 60 characters naming the service and the city.");
  else addIssue("seo", "Fix soon", "Page title is too short or too long", `The title is ${title.length} characters: "${title}".`, "Titles that are too short say too little in search results, and long titles get cut off.", "Rewrite the title to about 50 to 60 characters with the service and the city.");
  seoTotal += 1;
  if (metaDescription.length >= 120 && metaDescription.length <= 160) seoPassed += 1;
  else if (metaDescription.length === 0) addIssue("seo", "Critical", "Meta description is missing", "No meta description was found on the homepage.", "Search results show a random snippet instead of a sentence written to win the click.", "Write a meta description of 120 to 160 characters with a clear reason to call.");
  else addIssue("seo", "Fix soon", "Meta description length is off", `The meta description is ${metaDescription.length} characters.`, "Descriptions outside 120 to 160 characters get cut off or leave space unused in search results.", "Rewrite the meta description to 120 to 160 characters.");
  seoTotal += 1;
  if (h1Count === 1) seoPassed += 1;
  else if (h1Count === 0) addIssue("seo", "Fix soon", "No H1 heading", "No H1 heading was found on the homepage.", "The H1 tells visitors and search engines what the page is about.", "Add one H1 naming the main service and city.");
  else addIssue("seo", "Fix soon", "More than one H1 heading", `${h1Count} H1 headings were found on the homepage.`, "Several H1s split the message about what the page is for.", "Keep one H1 and turn the rest into H2 headings.");
  seoTotal += 1;
  if (imagesMissingAlt === 0) seoPassed += 1;
  else addIssue("seo", "Fix soon", `${imagesMissingAlt} of ${imageCount} images have no alt text`, `${imagesMissingAlt} images have missing or empty alt text.`, "Search engines and screen readers cannot tell what those images show.", "Write one short alt description per image, naming the service shown.");
  const seoScore = scoreFromChecks(seoPassed, seoTotal);

  // Technical
  let techPassed = 0;
  let techTotal = 0;
  techTotal += 1; if (https) techPassed += 1; else addIssue("technical", "Critical", "Site does not use HTTPS", "The final URL is not HTTPS.", "Browsers warn visitors away from non-HTTPS sites, and some will not stay.", "Move the site to HTTPS and redirect all HTTP traffic to HTTPS.");
  techTotal += 1; if (brokenLinks.length === 0) techPassed += 1; else addIssue("technical", "Critical", `${brokenLinks.length} checked link${brokenLinks.length === 1 ? "" : "s"} failed`, `These links did not return a working page: ${brokenLinks.map((b) => `${b.url} (${b.status})`).join(", ")}.`, "A visitor who taps a link and lands on an error page is unlikely to try again.", "Fix or remove each broken link.");
  techTotal += 1; if (hasCanonical) techPassed += 1; else addIssue("technical", "Nice to have", "No canonical tag", "No canonical link tag was found.", "Search engines may treat similar pages as duplicates without one.", "Add a canonical tag pointing at the page itself.");
  techTotal += 1; if (hasSitemap) techPassed += 1; else if (hasSitemap === false) addIssue("technical", "Nice to have", "No sitemap file found", "No sitemap.xml file was found at the usual address.", "A sitemap helps search engines find every page on the site.", "Add a sitemap.xml and list it in robots.txt.");
  const technicalScore = https ? scoreFromChecks(techPassed, techTotal) : 0;

  // Conversion
  let convPassed = 0;
  let convTotal = 0;
  convTotal += 1; if (phoneVisible || hasTel) convPassed += 1; else addIssue("conversion", "Critical", "No phone number visible on the homepage", "No phone number was found in the visible page text.", "Visitors who cannot see a number cannot call, and most will not hunt for a contact page.", "Put the phone number in the header and near the main call to action.");
  convTotal += 1; if (hasForm) convPassed += 1; else addIssue("conversion", "Fix soon", "No contact or booking form", "No form was found on the homepage.", "Visitors who prefer to write rather than call have no way to enquire.", "Add a short contact form with name, phone, and message.");
  convTotal += 1;
  if (hasForm && formFields <= 6) convPassed += 1;
  else if (hasForm) addIssue("conversion", "Fix soon", "Contact form asks for too much up front", `The contact form has ${formFields} fields.`, "Long forms put people off, so fewer visitors send an enquiry.", "Cut the form to name, phone, and message, and ask for the rest later.");
  const conversionScore = scoreFromChecks(convPassed, convTotal);

  // Trust, local and social
  let trustPassed = 0;
  let trustTotal = 0;
  trustTotal += 1; if (hasSchema) trustPassed += 1; else addIssue("trust", "Fix soon", "No LocalBusiness details for search engines", "No LocalBusiness or Organization schema was found on the homepage.", "Search engines use that structured detail to show the business correctly in local results.", "Add LocalBusiness schema with name, address, phone, and opening hours.");
  trustTotal += 1; if (hasFavicon) trustPassed += 1; else addIssue("trust", "Nice to have", "No favicon", "No favicon was found.", "A missing favicon makes the site look unfinished in browser tabs and bookmarks.", "Add a favicon for the site.");
  trustTotal += 1; if (externalLinks.length > 0) trustPassed += 1; else addIssue("trust", "Nice to have", "No social or external links found", "No external links were found on the homepage.", "Links to social profiles help visitors check that the business is real and active.", "Add links to the business social profiles.");
  const trustScore = scoreFromChecks(trustPassed, trustTotal);

  const categories: CategoryScore[] = [
    { key: "speed", score: speedScore, grade: gradeFor(speedScore) },
    { key: "mobile", score: mobileScore, grade: gradeFor(mobileScore) },
    { key: "seo", score: seoScore, grade: gradeFor(seoScore) },
    { key: "technical", score: technicalScore, grade: gradeFor(technicalScore) },
    { key: "conversion", score: conversionScore, grade: gradeFor(conversionScore) },
    { key: "trust", score: trustScore, grade: gradeFor(trustScore) },
  ];
  const weights: Record<CategoryKey, number> = { speed: 20, mobile: 15, seo: 20, technical: 15, conversion: 15, trust: 15 };
  const overallScore = Math.round(
    categories.reduce((sum, c) => sum + c.score * (weights[c.key] / 100), 0),
  );

  return {
    title,
    metaDescription,
    h1Count,
    imageCount,
    imagesMissingAlt,
    internalLinks: internalLinks.length,
    externalLinks: externalLinks.length,
    hasViewport,
    hasSchema,
    hasTel,
    hasMailto,
    hasForm,
    formFields,
    hasFavicon,
    hasCanonical,
    overallScore,
    overallGrade: gradeFor(overallScore),
    categories,
    issues,
    couldNotCheck,
  };
}

// Keep the AuditResult type import used (route assembles the full result).
export type { AuditResult };
