# White-Label Local-Business Website Teardown and Proposal Generator — Research

**Product:** Buyer (web-design freelancer / small agency) pastes any business website URL. Tool fetches that public page directly, generates a branded teardown report plus a ready-to-send proposal, under the buyer's own logo, brand name, colours and contact info.
**Price:** $49 one-time.
**Context:** Ship or Die $100K Hackathon, 16 Nov–16 Dec 2026, solo, ranked by verified profit, brand-new product, launch target 1 Dec 2026. Research date: 27 Nov 2026.
**Scope of this document:** General research only, not legal advice. No claim is made that this product is "Verified", and no fill rates or earnings claims are made or invented in this document.

**Audit method in scope (per brief):** Direct page crawling only — fetch the URL the buyer pastes, parse the HTML, check speed / mobile / SEO / meta / broken links / SSL / schema. No Google Maps / Places data, no stored business lists, no resale of third-party data, no personal data. Do not pull a business's Google listing, reviews, or contact details from Google Maps/Places. Contact info in the report comes only from what is visible on the fetched page itself.

---

## 1. Competitors

### 1.1 Summary table — prices checked Nov 2026

| Tool | Price (as found Nov 2026) | What it audits | White-label? | Proposal? | What it misses for this buyer |
|---|---|---|---|---|---|
| **Google PageSpeed Insights (PSI) / Lighthouse** | Free, no account. PSI API: free, no paid tier; default quota commonly cited as 25,000 requests/day with an API key, ~240/min; keyless quota is shared and in practice often exhausted (429) | Performance, accessibility, best practices, SEO (lab + CrUX field data where available) | No | No | No branding, no proposal, no plain-English "what I would fix for you", no contact/CTA/trust checks, one URL at a time, slow (15–40 s per run) |
| **GTmetrix** | Free Basic; PRO Lite $5.99/mo ($4.99/mo billed yearly), Core $11.99/mo ($9.99/yr), Advanced $29.99/mo ($24.99/yr), Expert $59.99/mo ($49.99/yr); 14-day money-back guarantee | Lighthouse + its own Structure Score (Performance 60% / Structure 40%), waterfall, filmstrip, monitoring, locations/devices | No white-label PDF branding on listed plans; custom PDF reports noted as an add-on / higher-tier feature in some listings | No | Speed-only. No SEO meta/headings depth, no local-business conversion teardown, no proposal, subscription |
| **SEOptimer** | DIY SEO $29/mo, White Label $39/mo, Lead Generation $59/mo; annual ~25% off ($21.75 / $29.25 / $44.25 per mo). Free: 1 audit/day, no account. 14-day trial (card required). API $100–$500/mo extra | ~100 data points: title, meta description, H1–H6, keyword consistency, image alt, canonical, SSL/HTTPS redirect, robots.txt, sitemap, schema.org, on-page links, Core Web Vitals / PSI mobile+desktop, social, local SEO, GEO/AI-visibility (new) | **Yes, from $39/mo:** logo, colours, fonts, intro text, custom domain, 3–6 templates, reports in 15 languages | No built-in ready-to-send web-design proposal; it is an SEO audit, not a redesign pitch | SEO-only framing; single-page grade, crawler only 4–50 crawls/mo by plan; no Search Console/GA4 connection; no conversion/CTA/form/trust teardown for a redesign sale; $468/yr for white label alone |
| **WooRank (WooRank by Bridgeline)** | Lite $19.99/mo ($12.99/mo billed yearly, 100 page reviews, PDFs, no projects/crawl); Pro $89.99/mo ($53.25/mo yearly, 1 project, 50 keywords, 2,500-page crawl); Premium $199.99/mo ($133.25/mo yearly, 5 projects, 250 keywords, ~10,000–10,500-page crawl); Enterprise from ~$249.99/mo / custom. 14-day trial; no-refund policy once paid subscription begins (per 2026 reviews) | Instant Website Review on 70+ factors: title/meta (chars + pixels), SERP preview, headings, image alt, canonical, hreflang, robots, 404, mobile, accessibility (accessScan), Site Crawl, keyword tool, competitor comparison | **Yes, but only Premium ($199.99/mo) and above:** unlimited white-label PDFs; Pro PDFs are not white-label. LeadGen widget Premium+ only | No | White label is gated behind the most expensive tier ($2,400/yr monthly billing). No proposal generator, no redesign pricing/timeline, no local conversion checks. Blog/release notes stale (no blog posts after Apr 2025 per one review) — a freshness risk to note, not a verdict |
| **Ubersuggest (Neil Patel / NP Digital)** | Free (3 searches/day); Individual $29/mo ($192/yr, $290 lifetime), Business $49/mo ($326/yr, $490 lifetime), Agency/Enterprise $99/mo ($657/yr, $990 lifetime). Add-ons $5/mo each. 7-day trial on monthly plans; lifetime purchases described as final/non-refundable (EU/UK 14-day cancellation carve-out noted) | All-in-one SEO: keyword research, rank tracking (125–300 keywords/project), backlink data, site audit (1,000 / 5,000 / 10,000 pages per weekly crawl by plan), AI search visibility | No white-label reports on listed plans | No | Audit is one module inside a general SEO suite, not a client-facing teardown; no branding, no proposal, no local-business CTA/trust audit. Lifetime $290 is 6x this product's $49 |
| **VibeAudit (vibeauditapp.com — AI UX & CRO audits)** | Starter $29/mo (3 audits/mo, no white label, no screenshots); Pro $99/mo (10 audits/mo, no white label); **Agency $299/mo (unlimited audits, fair use, white label, annotated screenshots, revenue-impact projections, AI-generated client proposals)**. Free account, no card | UX/CRO heuristics by vertical (e-commerce, SaaS, local), PageSpeed signals, screenshots, Vibe Score, prioritised findings, 30/60/90-day roadmap | Yes, Agency only ($299/mo) | **Yes — Agency only:** "AI-generated client proposals (pitch-ready)" / "Client Proposal Generator" (problem, impact, solution) | Closest direct competitor on proposal + white label, but white label + proposal are locked behind $299/mo ($3,588/yr). Starter/Pro buyers get no branding at all. AI/UX framing, not a deterministic HTML teardown (speed/SEO/meta/broken links/schema) |
| **AuditPilot (auditpilot.us — Chrome extension + online scanner)** | Starter Hustler $29.99/mo (30 audits/mo, cold-email generator, PDF exports, basic pipeline); **Agency Pro $79.99/mo (unlimited audits, 100% white-label, Loom pitch generator, two-tier proposal & pricing builder, full CRM Kanban, Stripe portal)**; Enterprise (price not listed in search result). 14-day free trial | SEO, CRO, Core Web Vitals, tracking pixels (GA4, Meta), revenue-leak calculator | Yes, Agency Pro only: logo, brand accent colours, consultant notes, Calendly URL, zero mention of AuditPilot | **Yes — Agency Pro:** two-tier proposal & pricing builder, cold-email sequences, Loom video scripts | Closest direct competitor overall. But: $79.99/mo = $960/yr; white label + proposal gated behind Agency Pro; Chrome-extension-first workflow; "estimated dollar leakage" figures are estimates, not measured revenue — a claim-risk to avoid copying |
| **Roast My Web (roastmyweb.com — AI site audit)** | Pay-per-roast, no subscription: from $0.30/roast in bulk; packs $12 (16 reviews, $0.75/audit), $50 (100 reviews, $0.50/audit, recommended Freelancer), $299 (1,000 reviews, $0.30/audit, Agency). 30-day money-back guarantee | AI audit across UX, copy, SEO, mobile, performance in one consolidated PDF; proof behind every finding; manual editor; batch audits | Yes, on paid packs: logo + "Book a call" button, branded PDF or neutral share link (audits.page, no Roast My Web name) | No dedicated proposal builder (report is the pitch asset; "send a free audit… with your Book a call button") | AI-generated, not deterministic checks; cannot access login/captcha pages; no proposal/timeline/pricing section; per-audit credits still cost per use, unlike a flat $49 |
| **PitchSEO (pitchseo.com)** | No verifiable pricing found in search on 27 Nov 2026 — pricing page not returned; do not quote a price for PitchSEO. (Note: PitchSEO.com is a different product from Pitchbox, $300/mo, and Pitchsite, $29–$49/mo — do not confuse them.) | 85+ agency templates; AI SEO audits, proposals, sales pitch decks; page/technical/content/link/schema/speed checks; export PDF/Word/PPT/Excel | Yes: logo, colours, company profile | **Yes:** proposal + pitch-deck builder from audit findings | SEO-agency framing, not local-business website redesign; pricing not publicly verifiable from search — a buyer cannot compare it without signing up / contacting sales |

### 1.2 What the free tools do well, and where they stop

- **PageSpeed Insights / Lighthouse:** the credibility anchor. Free, Google-run, lab + field data. Every serious teardown should cite or embed its scores — but on its own it is a developer report, not a sales document. A local business owner cannot read it and decide to hire the freelancer.
- **GTmetrix:** best waterfall/filmstrip for speed diagnosis, plus monitoring. Still speed-only, still unbranded.
- **SEOptimer / WooRank:** the white-label incumbents. Both prove freelancers will pay for branded PDFs — SEOptimer from $39/mo, WooRank from $199.99/mo for white label. Both are SEO audits, not redesign pitches, and both charge every month forever.

### 1.3 The gap for a $49 one-time freelancer tool

1. **Price cliff:** White label currently starts at $39/mo (SEOptimer, $468/yr) and the proposal feature starts at $79.99/mo (AuditPilot) or $299/mo (VibeAudit). A freelancer who pitches 2–3 local businesses a month pays $468–$3,588/yr for branding + proposal. $49 once is 1.25 months of SEOptimer White Label, 0.6 months of AuditPilot Agency Pro, and 0.16 months of VibeAudit Agency. Break-even against the cheapest white-label subscription is just over one month of use — after that, every report is free to the buyer. (That is arithmetic on published prices, not an earnings claim.)
2. **Job-to-be-done gap:** No incumbent sells *teardown + proposal in one step* for a *website redesign* (not SEO). SEOptimer/WooRank/Ubersuggest sell SEO audits. GTmetrix/PSI sell speed. VibeAudit/AuditPilot sell audit + proposal but only on $80–$299/mo plans and with AI-estimated revenue-leak figures. The $49 tool's job is narrower and clearer: "paste URL → branded PDF that shows the problems → proposal page that says what I would fix, when, and for how much (freelancer fills in price)."
3. **Local-business specificity gap:** Incumbents check generic SEO. None of the tools above, in their public feature lists, systematically checks the local-conversion items that decide a redesign sale: phone number / tap-to-call visible without scrolling on mobile, address + hours on the page, one obvious CTA above the fold, working contact/booking form, trust signals (reviews, testimonials, licences, guarantees), and social links. That is the teardown's differentiator — see §2.
4. **Ownership gap:** Roast My Web proves pay-per-use works ($0.30–$0.75/audit), but credits still meter every pitch. A flat $49 with no per-report meter and no renewal is a different promise: buy once, pitch as much as you like (subject to fair-use / rate limits the seller must state plainly at checkout — do not promise "unlimited" without a stated limit).
5. **Risk to respect:** The gap is real but narrow. If the $49 tool is only a prettier PSI score, buyers will churn to free PSI. It must ship the two things free tools do not: (a) the local-conversion checks in §2, and (b) the editable proposal in §6. Without both, it is a commodity wrapper.

**Sources:** GTmetrix pricing — https://gtmetrix.com/plans.html ; https://recaply.co/tools/gtmetrix ; SEOptimer — https://www.aiignitions.com/seoptimer-review ; https://www.g2.com/products/seoptimer/pricing ; https://crawlraven.com/blog/seoptimer-review ; WooRank — https://websites2know.com/woorank-review/ ; https://www.aiocopilot.com/blog/woorank-alternatives-seo-audit-tools-2026 ; Ubersuggest — https://hearsmart.org/review/ubersuggest ; https://seoaudit.w3ctrl.com/blog/seoauditpro-vs-ubersuggest-2026 ; PSI API — https://glentenorio.com/blog/pagespeed-insights-api-guide/ ; https://busyless.space/seo-apis/pagespeed-insights ; VibeAudit — https://www.vibeauditapp.com/ ; AuditPilot — https://auditpilot.us/ ; Roast My Web — https://www.roastmyweb.com/landing/site-audit-report ; PitchSEO — https://pitchseo.com/

---

## 2. Audit criteria — what a teardown must check to be worth $49

Weights sum to 100. They are a recommendation for this product, not an industry standard — no incumbent publishes an identical weighting, and the product should state its weights on the report so a buyer can explain them.

### 2.1 Recommended scoring model (total 100)

| # | Category | Weight | What to check (direct fetch + parse only) | Pass / fail rule (example — tune before launch) |
|---|---|---|---|---|
| 1 | **Speed & Core Web Vitals** | **20** | Lighthouse Performance score; LCP, CLS, TBT (lab proxy for INP); page size, request count, unoptimised images, render-blocking resources | LCP ≤2.5 s, CLS ≤0.1, TBT ≤200 ms = good (see §3). Score the category from the Lighthouse Performance score, not from a single metric |
| 2 | **Mobile usability** | **15** | Viewport meta tag present; responsive layout (no horizontal scroll at 390 px); tap targets ≥48 px / not too close; text readable without zoom (≥16 px body); tap-to-call `tel:` link present; phone + main CTA visible without scrolling on mobile screenshot | Fail if no viewport tag, or phone/CTA not visible above the fold on mobile, or tap targets fail Lighthouse `tap-targets` audit |
| 3 | **On-page SEO — title, meta, headings, content** | **20** | Title present, 50–60 chars, primary service + city; meta description present, 120–160 chars, with CTA/USP; exactly one H1, H2–H6 hierarchy, no skipped levels; keyword consistency across title/meta/H1/body; word count / thin content flag; canonical tag; OG tags (title/description/image) | SEOptimer's published pass conditions are a useful reference: title 50–60 chars, meta description 120–160 chars. Score partial credit, not binary, for length |
| 4 | **Technical health — SSL, crawlability, links** | **15** | HTTPS valid certificate + HTTP→HTTPS redirect; robots.txt present and not blocking key pages; XML sitemap present; noindex check; broken internal links (first 40, status ≠200); broken external links (sample); redirect chains/loops; 404 handling; duplicate www/non-www | Any broken internal link on the homepage or main nav = fail for that sub-check; SSL failure = category capped at 0 for trust reasons |
| 5 | **Conversion — CTA, contact visibility, forms** | **15** | One obvious primary CTA (Call / Book / Get a quote / Order) above the fold on desktop + mobile; phone number, address, hours visible on the page (not only in footer or only on contact page); contact/booking form present, fields counted, submit action present; form requires no excessive fields (flag >6 fields); booking link works (status 200) | Fail if no CTA above the fold, or no phone on the homepage, or form missing/broken. This is the category most incumbents miss |
| 6 | **Trust, local & social signals** | **15** | LocalBusiness (or subtype: Plumber, Dentist, Restaurant, etc.) JSON-LD schema with name/address/phone/hours; `Organization` `sameAs` links; social links present and returning 200 (Facebook, Instagram, etc. — check the link, do not scrape the platform); testimonials/reviews visible on page; trust marks (licence, guarantee, years in business, awards) mentioned; copyright year current; favicon present | Schema missing is the single most common local-business gap in the sources: one guide cites missing/incorrect schema on 72% of local business sites, slow speed on 82%, missing/duplicate meta on 63%, broken internal links on 42% (Semrush 2024 study of 100,000+ sites, as cited by Nertz Digital — treat as directional, not as this product's own measurement) |

**Total: 20 + 15 + 20 + 15 + 15 + 15 = 100.**

### 2.2 Per-check detail the report should show

For each check, show: (a) what was found (the actual title text, the actual LCP value, the actual broken URL), (b) why it matters in one plain sentence tied to a lost call/booking/visit, (c) severity (Critical / Fix soon / Nice to have), and (d) the fix in one line. SEOptimer's ~100-check list is the depth reference — title, meta, H1, H2–H6, heading structure, keyword consistency, content amount, image alt, canonical, SSL, HTTPS redirect, robots.txt, noindex, sitemap, analytics presence, schema.org, on-page links, anchor text, Core Web Vitals, PSI mobile/desktop, image optimisation, browser caching, minification, deprecated HTML, inline styles, favicon, email privacy, Facebook page linked. This product does not need all 100 on day one; it needs the ~30 checks in the table above, done accurately, with evidence.

### 2.3 Checks to include, with thresholds

- **Images:** every `<img>` has alt text (flag missing/empty, excluding decorative); largest images by bytes listed; oversized images (>200 KB above the fold, >500 KB anywhere) flagged; width/height attributes present (prevents CLS).
- **Headings:** exactly one H1; H1 contains service + city where sensible; no empty headings; hierarchy not skipped.
- **Meta:** title 50–60 chars; description 120–160 chars; OG title/description/image present; canonical present and self-referential.
- **Schema:** JSON-LD parsed; `LocalBusiness` or subtype present; address/phone/hours inside it; `Review`/`AggregateRating` only if testimonials are actually on the page (do not invent ratings).
- **SSL:** certificate valid, not expired, HTTPS redirect, no mixed-content warnings in Lighthouse Best Practices.
- **Broken links:** fetch each internal link's status (HEAD, fall back to GET, timeout ~5 s, cap at 40 links on v1); report URL + status code; do not follow links behind logins.
- **Contact/CTA:** phone (tel:), email (mailto:), address, hours extracted from visible page text/HTML only; CTA button text + position (above/below fold on mobile screenshot).

### 2.4 What NOT to check (out of scope, per brief)

- No Google Maps / Places / Google Business Profile lookup, no review-rating import, no NAP comparison against Google. If the brief changes, that is a separate feature with separate data-source terms.
- No backlink profile, no keyword rankings, no traffic estimates — those need third-party data licences (Ahrefs/Semrush/DataForSEO) and are what make incumbents expensive. State this plainly on the sales page: "We audit the page you paste. We do not estimate traffic or rankings."
- No multi-page crawl on v1 (homepage + up to 2–3 linked pages if time allows; homepage-only is defensible for a $49 pitch tool, but say so).
- No accessibility score as a legal-compliance claim. Lighthouse Accessibility is an automated check, not a WCAG certification.

**Sources:** SEOptimer check list — https://www.seoptimer.com/blog/understanding-report-checks/ ; https://www.seodev5.com/automated-seo-reports/ ; local audit checklist — https://localboostly.co/tools/website-audit ; https://nertzdigital.com/resources/ai-technical-seo-audit-local/ ; Cursor local-audit workflow (direct-fetch checker: SSL, viewport, tel: links, title/meta/H1, robots, sitemap, JSON-LD, NAP, CTA, broken links first 40) — http://cursor.directory/plugins/local-website-audit

---

## 3. Lighthouse — running it server-side in Node

### 3.1 Three ways to get Lighthouse data

| Method | How | Cost | Best for this product |
|---|---|---|---|
| **PageSpeed Insights API** | `GET https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=…&strategy=mobile&category=performance&key=…` — Google runs Lighthouse on its servers, returns JSON (`lighthouseResult` + `loadingExperience` CrUX field data where available) | Free, no paid tier, no billing account. Default quota commonly cited as 25,000/day with a key, ~240/min; keyless quota is shared and in Sep 2026 tests returned 429. Each call takes 15–40 s; up to 120 s max. Both mobile + desktop = 2 quota units | **Recommended for v1.** No Chrome to run, no server to babysit. One API key, restricted to the PSI API. Run mobile + desktop in parallel. Cache results per URL (e.g. 24 h) so repeat audits do not burn quota |
| **Lighthouse Node module + chrome-launcher** | `npm install lighthouse chrome-launcher`; launch headless Chrome, `lighthouse(url, { port: chrome.port, onlyCategories: ['performance','accessibility','best-practices','seo'] })`, read `result.lhr`, kill Chrome | Free (open source). Needs Node 22 LTS or later for current Lighthouse; needs a Chrome/Chromium binary on the machine | Full control, no quota, works offline. But: heavy on serverless (see §4), scores vary by machine CPU, parallel runs slow each other down — run sequentially, one at a time, fresh Chrome per run |
| **Lighthouse CLI** | `npm install -g lighthouse; lighthouse https://example.com --only-categories=performance,seo` | Free | Local testing / CI, not for a web product |

Current version note: PSI/Lighthouse moved to Lighthouse 13.0 (Oct 2025; 13.4.1 in public reports when checked late 2026). The PWA category was removed. A new Agentic Browsing category appears in some docs. Pin the version you test against and expect the JSON shape to change between majors — one guide notes Lighthouse 13 changed some `details.items` from arrays to nested objects.

### 3.2 What the scores mean

- **Category scores (Performance, Accessibility, Best Practices, SEO):** 0–100. Bands, all categories: **90–100 good (green), 50–89 needs improvement (orange), 0–49 poor (red).**
- **Performance score weights (Lighthouse 10, still cited in 2026 sources; confirm for the version you run):** Total Blocking Time 30%, Largest Contentful Paint 25%, Cumulative Layout Shift 25%, First Contentful Paint 10%, Speed Index 10%. LCP + CLS + TBT = 80% of the score.
- **Core Web Vitals — field thresholds (real users, 75th percentile, 28-day CrUX window):**

| Metric | Good | Needs improvement | Poor |
|---|---|---|---|
| LCP (Largest Contentful Paint) | ≤ 2.5 s | 2.5–4.0 s | > 4.0 s |
| INP (Interaction to Next Paint) | ≤ 200 ms | 200–500 ms | > 500 ms |
| CLS (Cumulative Layout Shift) | ≤ 0.1 | 0.1–0.25 | > 0.25 |

- **Lab vs field:** Lighthouse reports *lab* estimates of LCP and CLS, and TBT as a stand-in for INP — it does **not** measure INP (INP needs real interaction). A page can score 98 in the lab and still fail the field assessment, and vice versa. The field assessment passes only when LCP, INP and CLS are *all* good at the 75th percentile.
- **Score variability:** The same URL scores differently on different machines and different runs (one test: Wikipedia mobile Performance 98 on a laptop, 92 on a 2 GB cloud container; LCP 1,379 ms vs 1,497 ms). Mobile preset applies CPU throttling, so hardware matters. Always show the run conditions on the report: date/time, mobile vs desktop, Lighthouse version, lab vs field label.

### 3.3 What not to promise

- **Do not promise a ranking improvement, a traffic increase, or a specific score after the fix.** Lighthouse SEO is a page-level technical check, not a ranking prediction. Say: "This is a lab measurement on [date] under [conditions]."
- **Do not present a lab score as a real-user measurement.** Label lab and field data separately; if there is no CrUX field data (new/low-traffic site), say "No field data available for this URL yet" — do not invent it, do not fall back silently to origin-level data without labelling it.
- **Do not promise INP.** Report TBT and label it as a lab proxy.
- **Do not treat one run as a verdict.** Offer "re-run" and show the date; consider averaging two runs or showing the range on v1 if cheap to do.
- **Accessibility:** Lighthouse Accessibility catches detectable issues only. Do not claim WCAG compliance or legal compliance.
- **Check `lhr.runtimeError` before reading scores** — a page that failed to load still returns an LHR with meaningless scores.

**Sources:** Lighthouse Node — https://github.com/aalmada/aalmada.github.io/blob/HEAD/.agents/skills/lighthouse/SKILL.md ; https://geekchamp.com/lighthouse-api-to-audit-performance-seo-and-agentic-browsing/ ; https://dev.to/swiftkit_dev/run-lighthouse-on-hundreds-of-pages-from-node-no-pagespeed-api-key-and-why-the-scores-move-2dk4 ; PSI API — https://glentenorio.com/blog/pagespeed-insights-api-guide/ ; https://www.lighthouse-aimetrics.com/blog/lighthouse-api ; scores/thresholds — https://www.nostra.ai/learn/lighthouse-core-web-vitals ; https://detmore.tr/en/journal/core-web-vitals-how-to-read-lcp-inp-cls/ ; https://www.xenonstack.com/blog/google-lighthouse-tool

---

## 4. PDF report — best way to generate a clean branded PDF in Next.js

### 4.1 Comparison

| Approach | How it works | Pros | Cons | Verdict for this product |
|---|---|---|---|---|
| **Puppeteer / Playwright `page.pdf()` (HTML → PDF via headless Chromium)** | Render the report as HTML/CSS in the app, print it with headless Chrome. In Next.js: a Route Handler returns `new Response(pdf, { 'Content-Type': 'application/pdf' })` | Full CSS (flex, grid, tables, charts), pixel-perfect fidelity to the on-screen report, selectable text, correct page breaks (in a Nov 2026 benchmark: 103 KB, 3,451 selectable chars, no row cut at page break for a 45-row invoice). One template serves both screen and PDF | Needs Chrome (~150–650 MB). On Vercel serverless: stock `puppeteer` exceeds the 250 MB function limit; must use `puppeteer-core` (6 MB) + `@sparticuz/chromium` (~70 MB unpacked, 153.0.0 pairs with `puppeteer-core` 25.11.0 / Chrome 153) + `outputFileTracingIncludes` for the `bin` folder; cold start unpacks Chromium to `/tmp`; fonts beyond basics are your job; 4.5 MB request-body limit if you POST HTML; pin exact versions (sparticuz does not follow semver strictly). Playwright is now preferred over Puppeteer in several 2026 guides — same API, better stability | **Recommended primary.** Best fidelity for a branded, chart-heavy teardown. Mitigate serverless pain by: (a) generating the PDF in a separate long-running service / VPS rather than a Vercel function if possible, or (b) `puppeteer-core` + `@sparticuz/chromium` with cached executable path + single shared download promise, or (c) a hosted HTML→PDF API for v1. Note: Vercel raised the function bundle limit to 5 GB (large-functions beta, 30 Jun 2026) — that removes the size problem but not cold start / memory / font issues |
| **`@react-pdf/renderer`** | Build the PDF from React components (`Document`, `Page`, `View`, `Text`) — its own layout engine, not HTML/CSS | No Chrome, ~2 MB, works on serverless/edge, fast (median 33 ms in the Nov 2026 benchmark, smallest file 7.5 KB), selectable text | Partial CSS only (flexbox gap + grid added in 4.x, but still not full HTML/CSS); you maintain a *second copy* of the report layout; page-break bugs (a row split until `wrap={false}` added); charts must be pre-rendered as images | **Recommended fallback / v1 safety net.** If Puppeteer on Vercel proves flaky in testing, ship `@react-pdf/renderer` first — it always works on serverless — and add Puppeteer fidelity later. Do not confuse with `react-pdf` (a viewer, not a generator) |
| **jsPDF (+ html2canvas)** | Programmatic PDF in JS; `react-to-pdf` renders the component to canvas then embeds as JPEG in jsPDF | Lightweight, client-side, no server round-trip, ~50 ms for a 5-page doc | Worst fidelity for this use: in the Nov 2026 benchmark the canvas route produced a 1.74 MB PDF with **2 characters of selectable text** (it is a picture), cuts at fixed heights, no real text selection/search | **Do not use for the client report.** Fine for a simple data export, wrong for a branded document the client should be able to search, copy from, and print cleanly |
| **pdfkit / pdfmake / pdf-lib** | Programmatic, low-level (pdfkit) or declarative JSON (pdfmake); pdf-lib for editing/filling existing PDFs | Fast (~20 ms), no Chrome, precise control, good for invoices/simple docs | No HTML/CSS — every element positioned by hand; slow to build a rich branded report; charts/tables are manual work | Useful for a simple one-page summary or for filling a proposal template, not for the full teardown report |

### 4.2 Recommendation

**Primary: Puppeteer (or Playwright) HTML→PDF, rendering the same branded HTML the buyer previews on screen.** One template, one source of truth, selectable text, proper page breaks, charts render in the browser. Deploy it where Chrome can live: a small VPS / container is simpler and cheaper to reason about than fighting Vercel serverless limits on day one; if the product must live on Vercel, use `puppeteer-core` + `@sparticuz/chromium` exactly as in §4.1, with pinned versions and the `outputFileTracingIncludes` fix.

**Fallback: `@react-pdf/renderer`.** If the Puppeteer route fails in pre-launch testing (cold starts, timeouts, font issues), ship the React-PDF version. It is the reliable serverless choice and the report will still look professional — it just costs a second layout to maintain.

**Avoid:** jsPDF/html2canvas for the main report (image-PDF, no selectable text); wkhtmltopdf (deprecated — do not start new projects with it).

**Practical notes:** set `@page` size/margins in CSS; use `print-color-adjust: exact` so brand colours print; embed fonts (do not rely on system fonts on serverless); test a 6–10-page report end-to-end (cover + score summary + 6 category sections + proposal) before promising a page count; cache the generated PDF per audit so a re-download does not re-render.

**Sources:** https://www.runxbuild.com/blog/react-js-pdf/ ; https://dev.pdfshift.io/guides/react-to-pdf/ (Nov 2026 benchmark, 4 methods measured); https://byteledger.vizleo.com/blog/how-to-generate-a-pdf-2026 ; https://www.nutrient.io/blog/javascript-pdf-libraries/ ; Vercel Puppeteer — https://pagedpdf.com/guides/puppeteer-pdf-on-vercel/ ; https://www.ventura-digital.de/blog/rendering-pdfs-on-vercel-with-nextjs ; https://shareglint.com/en/guides/website-screenshots-nextjs

---

## 5. White-label — how freelancers brand reports, what fields they need

What incumbents actually let buyers brand (from their public feature lists):

- **SEOptimer ($39/mo):** logo, colours, fonts, intro/title text, which checks are enabled and how they are scored, depth of explainer text, custom domain/subdomain, favicon, HTML title/meta.
- **WooRank Premium ($199.99/mo):** logo/colours on PDF, custom report domain (via LeadGen/white-label tier).
- **VibeAudit Agency ($299/mo):** logo, colours, brand on PDFs.
- **AuditPilot Agency Pro ($79.99/mo):** agency logo, brand accent colours, consultant notes, Calendly booking URL on every PDF header/cover/proposal.
- **Roast My Web (paid packs):** logo + "Book a call" button text/link on web report and cover; neutral share link with no vendor name.

### 5.1 Minimum white-label fields for this product (v1)

| Field | Required? | Notes |
|---|---|---|
| Brand / business name | Yes | Appears on cover, header, footer, proposal |
| Logo upload (PNG, transparent, min 400 px wide) | Yes | Cover + header; fall back to brand name in text if no logo |
| Primary brand colour | Yes | Cover, headings, score bars, CTA buttons |
| Accent / secondary colour | Yes | Highlights, badges, charts |
| Contact name | Yes | "Prepared by …" on cover + proposal signature |
| Contact email | Yes | Footer + proposal CTA |
| Contact phone | Optional but recommended | Click-to-call on proposal; local businesses expect a phone |
| Website URL | Yes | Footer, "See more of my work" link |
| Call-to-action text + link | Yes | e.g. "Book a free 15-minute call" → Calendly / contact page (AuditPilot/Roast My Web both do this — it is the conversion point of the whole document) |
| Report intro / cover line | Optional | One editable sentence, e.g. "I reviewed [Business] and found 7 quick wins." |
| Currency | Yes (default USD) | Proposal prices must show the freelancer's currency |
| Footer disclaimer | Fixed text, not editable | e.g. "Lab measurement on [date]. Scores can vary between runs. This report audits the public homepage only." — protects against over-claiming |

### 5.2 White-label rules to enforce

- **No vendor name anywhere on the PDF or share link.** That is the definition of white label in this category — SEOptimer, WooRank, AuditPilot and Roast My Web all sell it as "client never sees our name". If the product name appears in the PDF metadata, footer, or share URL, it is not white-label.
- **One brand profile, reused across all reports.** Freelancers should set it once and have every report pick it up; per-report override (different intro line) is a nice-to-have, not v1.
- **Preview before download.** Show the branded cover + first page on screen so the buyer can check the logo/colours before sending.
- **Logo handling:** accept PNG/JPG, store it, render it at print resolution; do not hotlink a logo URL that may break in the PDF renderer.
- **Do not promise a custom domain on v1** (SEOptimer/WooRank sell that as a higher-tier feature; it adds DNS/SSL work). A neutral share link (no vendor name) is the cheaper v1 equivalent.

---

## 6. Proposal — what a ready-to-send web design proposal must contain

Structure from the proposal guides (Propal, dric.be, DEV, Squarespace Circle), adapted to "proposal generated from a teardown":

| # | Section | What goes in it (for this product) |
|---|---|---|
| 1 | **Cover page** | Client business name, project title ("Website redesign proposal for [Business]"), freelancer brand/logo, date, one-line summary. Confidential note optional |
| 2 | **Executive summary / What I found** | 3–5 sentences, in the client's words where possible: the top 3 findings from the teardown, each tied to a business cost (lost calls, slow load, no booking path). Auto-filled from the audit's Critical findings; freelancer can edit |
| 3 | **Understanding the problem** | Restate the problem + business impact. Auto-fill: slowest metric, missing CTA, missing schema, broken links — with the actual numbers from the audit. Do not invent impact numbers (no "you are losing $X/month" unless the freelancer types it) |
| 4 | **Proposed solution / What I would fix** | Fix list mapped 1:1 to findings, grouped by phase: Quick wins (speed, meta, alt text, SSL), Redesign (mobile layout, CTA, forms, trust), Ongoing (schema, sitemap, monitoring). Tie every feature to an outcome, not a tech spec |
| 5 | **Scope & deliverables** | Concrete, checkable list: number of pages, custom vs template design, CMS, responsive breakpoints, integrations, revision rounds, post-launch support. **Always include a "Not included" row** (hosting, domain, copywriting, ongoing maintenance unless priced) — every guide stresses this prevents scope creep |
| 6 | **Timeline & milestones** | Numbered milestones with durations, not just "6–8 weeks": e.g. Week 1 Discovery, Weeks 2–3 Design, Weeks 4–6 Development, Week 7 QA + Launch. Template with editable week numbers; freelancer fills in start date |
| 7 | **Pricing — placeholders the freelancer fills in** | **Three tiers work best** (Essential / Growth / Premium — most clients pick the middle). Each tier: pages, design level, SEO setup, support period, price. All prices are **blank placeholders** (`$____`) the freelancer fills in before sending — the tool must never invent a price for the freelancer's work. Include payment terms placeholder: common structure 50% upfront / 50% on launch, or milestone-based 25/25/25/25 for longer projects. Use the word "Investment" in the template, not "Cost" (per dric.be) |
| 8 | **About / social proof** | Short paragraph + 2–3 relevant past projects (freelancer fills in; tool provides blank slots, not fake case studies). Testimonial slot optional |
| 9 | **Terms** | Payment structure, revision limits, what happens beyond scope, usage rights, how to contact. Template text, clearly marked as a template the freelancer should adapt — this is general information, not legal advice, and the freelancer should get their own contract reviewed if they need one |
| 10 | **Next step & acceptance** | One clear next step ("Reply to this email / Book a 15-minute call [link] / Sign below"), expiry date placeholder ("This proposal is valid until [date]"), signature lines for both parties, date |

**Key rules for the generator:**
- **Problem before price.** Every guide orders the document problem → solution → timeline → price. Do not put pricing first.
- **Never auto-fill a price, a timeline promise, or a results promise.** Placeholders only. The freelancer is the seller; the tool is the draft.
- **Editable before send.** Roast My Web's "manual report editor" is the right model: the audit is a first draft, the freelancer rewrites summaries, removes findings that do not fit, and adds context only they know. Ship an edit step.
- **One document or two?** Offer both: teardown PDF + proposal as separate PDFs, and a combined PDF (teardown first, proposal second). Freelancers send the teardown free to open the conversation and the proposal when the prospect replies — or both together for a warm lead.

**Sources:** https://www.propal.io/blog/web-design-proposal-template ; https://www.dric.be/how-to-write-a-web-design-proposal-that-wins-clients-structure-and-examples/ ; https://dev.to/brenohal/freelance-web-design-proposal-template-what-to-include-why-423o ; https://pros.squarespace.com/blog/how-to-write-a-proposal

---

## 7. Pricing and buyers — $49 one-time

### 7.1 Why freelancers pay

- **The math is the pitch.** $49 once vs $39/mo (SEOptimer White Label, $468/yr), $79.99/mo (AuditPilot Agency Pro, $960/yr), $99/mo (VibeAudit Pro, no white label) / $299/mo (VibeAudit Agency, $3,588/yr), $199.99/mo (WooRank Premium, $2,400/yr). A freelancer who would otherwise pay any of those recoups $49 in well under two months of subscription cost. Lifetime-deal buyers in general pay $49–$299 once for a single-purpose utility and expect break-even in ~5–6 months against a subscription; at $49 against a $29–$39/mo equivalent, break-even is under two months.
- **One client covers it — but do not claim that as a guarantee.** The honest framing is cost comparison, not income: "$49 is less than two months of the cheapest white-label audit subscription." Do not say "one client pays for it" as a promise; a freelancer may pitch ten businesses and close none. No earnings claim is made in this document.
- **No renewal anxiety.** Lifetime-deal research consistently finds the appeal is "pay once, no monthly bill, no price hikes, no renewal reminders" — and the risk buyers weigh is vendor survival, tier limits, and frozen features. At $49 the downside is small, which is itself a selling point: the risk of trying it is one cheap dinner, not a $468/yr commitment.
- **It replaces 3–5 hours of manual work per pitch** (VibeAudit's own framing: manual audits take 3–5 hours). That time claim belongs to VibeAudit, not to this product — this product should measure its own time saving in testing and only then quote it.
- **"Lifetime" means the lifetime of the product, not the buyer's life.** Say that plainly in the terms, as AppSumo and lifetime-deal guides do. Do not oversell it.

### 7.2 What kills a sale

1. **Looking like a free-tool wrapper.** If the report is just PSI scores with a logo, buyers will use PSI free. The local-conversion checks (§2.5) and the proposal (§6) are the moat — if either is thin, the sale dies.
2. **AI-estimated revenue claims.** AuditPilot/VibeAudit show "estimated dollar leakage" / "revenue impact projections". Those are estimates, not measurements. Copying them invites refund demands and disputes. Do not invent a dollar loss for the prospect's business.
3. **"Unlimited" without a stated limit.** Lifetime-deal guides flag tier limits as the #1 real risk (seats, usage caps, features that never arrive). State the audit limit plainly at checkout (e.g. "X audits/month" or "fair-use limit of Y audits/month") and honour it.
4. **No sample report before purchase.** Every incumbent offers a free audit, a free account, or a 14-day trial. A $49 one-time tool with no preview will convert poorly. Ship a public sample PDF (on a fictional business) and ideally one free audit before paywall.
5. **Slow or failed audits.** PSI takes 15–40 s per strategy; a naive implementation that runs mobile + desktop + HTML crawl serially can take 2+ minutes and time out on serverless (Vercel default 300 s max, Hobby memory 2 GB). Show progress, run calls in parallel, cache results, and fail gracefully with a clear message — not a blank screen.
6. **Vendor-survival fear.** A $49 one-time product from an unknown seller triggers "will this exist in 6 months?" — the standard lifetime-deal objection. Mitigate with: a clear refund window (e.g. 14 or 30 days — Roast My Web offers 30 days), a public sample, and honest terms about what "lifetime" covers.
7. **Subscription confusion.** Buyers must understand in one line that $49 is once, not per month and not per report. Put "One-time payment. No subscription. No per-report fee." on the checkout, and repeat the audit limit next to it.
8. **Generic, jargon-heavy reports.** The Cursor local-audit guide's rule is the right one: write for a busy owner, not a developer — no jargon without a plain explanation, no scare tactics, every problem tied to a lost call, visit, booking or order.

### 7.3 Price positioning

- $49 sits **below** every white-label subscription's first month except SEOptimer DIY ($29/mo, no white label) and **below** Ubersuggest Individual lifetime ($290) by 6x. It is **above** Roast My Web's per-audit cost ($0.50–$0.75) — so the pitch is not "cheapest per audit" but "cheapest way to own the tool": after ~65–98 Roast My Web audits, $49 flat is cheaper, and unlike credits it never runs out (within the stated fair-use limit).
- Do not raise the price to match incumbents. The gap *is* the product. A $99 or $149 tier could exist later for agencies (more audits, team seats), but v1 should be one price, one promise.

**Sources:** lifetime-deal economics — https://www.riskverdict.com/guides/lifetime-deal-vs-subscription ; https://internal-blog.contentstudio.io/saas-lifetime-deals/ ; https://kanha5.medium.com/appsumo-lifetime-deals-vs-saas-subscriptions-what-i-learned-after-comparing-both-technicalstudies-555abfc571ce ; VibeAudit manual-audit time — https://www.vibeauditapp.com/ ; Roast My Web refund — https://www.roastmyweb.com/landing/site-audit-report

---

## 8. Build implications (for the parent / builder — not a build spec)

- **v1 architecture that follows from the research:** Next.js; PSI API for speed (no Chrome to run); direct `fetch` + HTML parse (cheerio or equivalent) for SEO/meta/headings/images/links/schema/contact; Puppeteer/Playwright HTML→PDF for the branded report, with `@react-pdf/renderer` as the serverless fallback; one brand profile per buyer; proposal as an editable draft with blank price/timeline placeholders.
- **Biggest technical risks:** (1) PSI latency/timeouts — parallelise, cache, show progress; (2) PDF on serverless — test Puppeteer on the actual host before launch, keep the React-PDF fallback ready; (3) Lighthouse score variance — label run conditions, do not promise a number; (4) broken-link checking at scale — cap links, time-box fetches, handle JS-rendered pages honestly (state "homepage HTML only" if the page is heavily JS-rendered and the crawl cannot see rendered content).
- **What to verify before launch (live, not from memory):** current PSI quota on the project's own Google Cloud key; current `@sparticuz/chromium` / `puppeteer-core` version pairing; a full 6–10-page branded PDF end-to-end; one free sample audit on a real local-business site, read by a human, checking every claim against the fetched HTML.

---

## 9. Sources — full list

- GTmetrix pricing: https://gtmetrix.com/plans.html ; https://recaply.co/tools/gtmetrix ; https://www.wplegible.com/guides/pagespeed-insights-vs-gtmetrix/
- SEOptimer pricing/review: https://www.aiignitions.com/seoptimer-review ; https://www.g2.com/products/seoptimer/pricing ; https://crawlraven.com/blog/seoptimer-review ; https://www.marketraa.com/tools/seoptimer/
- SEOptimer checks: https://www.seoptimer.com/blog/understanding-report-checks/ ; https://www.seodev5.com/automated-seo-reports/
- WooRank: https://websites2know.com/woorank-review/ ; https://www.aiocopilot.com/blog/woorank-alternatives-seo-audit-tools-2026 ; https://www.digimarketlabs.com/tools/woorank-pricing-cost-guide.html ; https://seoaudit.software/woo-rank/
- Ubersuggest: https://hearsmart.org/review/ubersuggest ; https://seoaudit.w3ctrl.com/blog/seoauditpro-vs-ubersuggest-2026 ; https://recaply.co/tools/ubersuggest
- PageSpeed Insights API: https://glentenorio.com/blog/pagespeed-insights-api-guide/ ; https://busyless.space/seo-apis/pagespeed-insights ; https://www.lighthouse-aimetrics.com/blog/lighthouse-api ; https://github.com/harlan-zw/unlighthouse.dev/blob/HEAD/content/learn-lighthouse/pagespeed-insights-api/0.index.md
- Lighthouse Node: https://github.com/aalmada/aalmada.github.io/blob/HEAD/.agents/skills/lighthouse/SKILL.md ; https://geekchamp.com/lighthouse-api-to-audit-performance-seo-and-agentic-browsing/ ; https://dev.to/swiftkit_dev/run-lighthouse-on-hundreds-of-pages-from-node-no-pagespeed-api-key-and-why-the-scores-move-2dk4
- Lighthouse scores / Core Web Vitals: https://www.nostra.ai/learn/lighthouse-core-web-vitals ; https://detmore.tr/en/journal/core-web-vitals-how-to-read-lcp-inp-cls/ ; https://www.xenonstack.com/blog/google-lighthouse-tool
- PDF generation: https://www.runxbuild.com/blog/react-js-pdf/ ; https://dev.pdfshift.io/guides/react-to-pdf/ ; https://byteledger.vizleo.com/blog/how-to-generate-a-pdf-2026 ; https://www.nutrient.io/blog/javascript-pdf-libraries/
- Puppeteer on Vercel: https://pagedpdf.com/guides/puppeteer-pdf-on-vercel/ ; https://www.ventura-digital.de/blog/rendering-pdfs-on-vercel-with-nextjs ; https://shareglint.com/en/guides/website-screenshots-nextjs
- Audit checklists: https://localboostly.co/tools/website-audit ; https://nertzdigital.com/resources/ai-technical-seo-audit-local/ ; http://cursor.directory/plugins/local-website-audit
- White-label / proposal competitors: https://www.vibeauditapp.com/ ; https://auditpilot.us/ ; https://www.roastmyweb.com/landing/site-audit-report ; https://pitchseo.com/
- Proposal structure: https://www.propal.io/blog/web-design-proposal-template ; https://www.dric.be/how-to-write-a-web-design-proposal-that-wins-clients-structure-and-examples/ ; https://dev.to/brenohal/freelance-web-design-proposal-template-what-to-include-why-423o ; https://pros.squarespace.com/blog/how-to-write-a-proposal
- Lifetime-deal / pricing psychology: https://www.riskverdict.com/guides/lifetime-deal-vs-subscription ; https://internal-blog.contentstudio.io/saas-lifetime-deals/ ; https://kanha5.medium.com/appsumo-lifetime-deals-vs-saas-subscriptions-what-i-learned-after-comparing-both-technicalstudies-555abfc571ce

*Prices and feature lists were found via public web search on 27 Nov 2026 and change frequently. Re-verify every price on the vendor's own pricing page before putting it on the sales page. PitchSEO pricing was not verifiable from search and is not quoted in this document.*
