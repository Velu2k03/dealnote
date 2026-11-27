# DealNote — Plan

**Product:** White-label local-business website teardown and proposal generator.
**Date:** 27 Nov 2026. **Status:** Name + plan only. No code written, nothing built, nothing deployed.

## 1. Name

**DealNote** (one word, two plain words joined: Deal + Note).

**Why it was picked**
- It names the outcome, not the mechanism. The buyer is a web-design freelancer or small agency trying to win a client; the product hands them the note that wins the deal: what is wrong with the prospect's site, and what the freelancer would fix, for how much, by when.
- Short (8 letters), easy to say on a sales call, easy to type, easy to spell with no silent letters or unusual spelling.
- It covers both halves of the product in one word: the teardown findings and the proposal are one document, one note.
- It avoids the crowded audit-name cluster. It contains no "audit", "site", "pitch", "leak", "fix", "close", "grade", "score" or "proof", so it does not read as the tenth clone in a row of lookalike tools.
- Search-checked 27 Nov 2026 (web search only, not a trademark search): no known live product called DealNote in the website-audit / proposal space, no big brand with that name, and no live competing product returned for dealnote.com. The only same-spelling hit is "Dealnote", a mobile agreement-records app shown as a portfolio project page (Venzpire portfolio, published 2025-01-01), not a live product in this market. Nearby names that are different products: DealNoty (small-business management app), note2deal (deal tracker app), DocuDeal (proposal drafting). None is a website teardown tool.
- Caveats, stated plainly: this was a web-search check only. No trademark search was done, and domain availability / ownership was not verified through a registrar. Before launch, check dealnote.com (or the chosen domain) at a registrar and run a basic trademark check. Do not buy or register anything until that check is done.

**3 rejected names (with reasons)**
1. **PitchProof** — REJECTED, direct collision. pitchproof.ca is a live product doing exactly this job: white-label website audit reports for agencies, $19.99–$79.99/month, same buyer, same pitch ("turn any prospect's website into the business case for hiring you"). Using it would be confusion at best.
2. **SiteVerdict** — REJECTED, taken. Live WordPress plugin and MCP server (siteverdict) that audits websites and gives A–F grades per area, the same scoring idea as this product. Taken in the same niche.
3. **LeadLeak** — REJECTED, taken several times over, including at the same price. Live uses found 27 Nov 2026: "Lead Leak Report" $49 (same price point), "Lead Leak Audit" free audit tool (leadleakaudit.floot.app), Young Digital "Lead Leak Audit" $179, and leadleakcheck.com. Using it would look like a copy.

**Other names checked and rejected in the same pass:** AuditMint (live compliance tool, audit-mint.vercel.app); SiteBrief (two live products: sitebrief.net agency monitoring, sitebrief.bozarthsoftware.com $5 audit); OpenSign (OpenSign Labs eSignature, 6,700 GitHub stars, plus opensignos.com business OS using the same "OPEN sign" metaphor); Doorstep (UK agency building websites for trades/local businesses); SiteCloser / AuditCloser (live agency audit tools, AuditCloser is a near-identical white-label audit + proposal product); Tearsheet (fintech media brand tearsheet.co, founded 2007); PitchSheet (listed as a hackathon idea in the same Ship or Die idea ecosystem, and confusable with Pitchsite, a live proposal tool); QuoteKit (taken three times: freelance proposal tool, WordPress plugin, $14 quote calculator); SecondSite (genealogy website builder, secondsite8.com); Fixfolio (no exact product, but crowded by Folioo, a proposal tool launched 19 Nov 2026, and Folio portfolio builders; also says nothing about audits); SiteSpar (no exact product found, but "spar" is unclear and the Site* cluster — SiteSpin, SiteSpec, Sitewalk, SiteCurl, SiteRevive, SiteBrief, SiteVerdict — is so crowded the name would blur into the pack); WinSheet (no exact product, but "Win*" proposal tools crowd it — Winbrief, WinProposal, Winzi — and it sounds like a spreadsheet, not a teardown).

**Names this product must NOT be called:** TeardownPro, PitchAudit, Teardown Generator (per brief), and none of the competitors in RESEARCH.md (GTmetrix, PageSpeed Insights, Lighthouse, Woorank, SEOptimer, Ubersuggest, AuditPilot, VibeAudit, Roast My Web, PitchSEO).

## 2. One-line pitch

Paste any business website URL. Get a white-label teardown report plus a ready-to-send proposal under your own brand in about a minute. Show the prospect what is wrong, then sell the fix.

## 3. Buyer

Web-design freelancers and small agencies (1–10 people) who pitch redesigns to local businesses (trades, clinics, restaurants, salons, professional firms). They already do this pitch manually with free tools plus a Google Doc; they pay to skip the manual work and to look prepared.

## 4. Price

**$49 one-time.** No subscription. No per-report fee. One stated fair-use limit, printed at checkout and on the landing page: **30 audits per month** per buyer. Never use the word "unlimited" anywhere. "Lifetime" means the lifetime of the product, stated in the terms. Refund: replace or refund a bad report reported within 14 days (see §10).

Price comparison for the sales page (from RESEARCH.md, re-verify before publishing): $49 once is less than two months of the cheapest white-label audit subscription (SEOptimer White Label $39/mo). That is arithmetic on published prices, not an earnings claim.

## 5. System architecture

```
Buyer browser (Next.js App Router pages)
  |
  |  POST /api/audit { url }            (buyer URL only; no stored lists)
  v
Next.js server (Vercel, Node runtime, NO static export)
  |
  +-- Audit orchestrator (server only)
  |     |
  |     +-- 1. Direct fetch (undici/fetch) -> status, headers, HTML
  |     |     -> cheerio parse: title, meta, headings, images, links,
  |     |        schema JSON-LD, viewport, tel:/mailto:, CTA, phone/address/hours
  |     +-- 2. PageSpeed Insights API (parallel, mobile + desktop)
  |     |     -> Lighthouse Performance/SEO/Best Practices, LCP, CLS, TBT
  |     +-- 3. Broken-link checker (HEAD, fall back to GET, 5 s timeout,
  |            first 40 internal links, sample of external links)
  |     +-- 4. Scorer -> per-category 0-100 -> A-F grade -> weighted total
  |
  +-- Entitlement check (server only)
  |     Free teaser: overall grade + top 3 findings only.
  |     Full report JSON + PDF: only after Stripe webhook confirms $49 payment.
  |     Full report is NEVER shipped to the browser before payment.
  |
  +-- PDF renderer (server only)
  |     Primary: puppeteer-core + @sparticuz/chromium (pinned versions)
  |     Fallback: @react-pdf/renderer (second layout, kept ready)
  |     Same branded HTML template as the on-screen preview.
  |     PDF cached per audit (24 h) so re-download does not re-render.
  |
  +-- Brand profile store (per buyer: logo, name, colours, contact)
        One profile, reused across all reports. Stored server-side.
        No vendor name in any PDF, share link, or PDF metadata.

External services (all server-side, keys never in the browser):
  - PageSpeed Insights API (Google, free tier, key restricted to PSI API)
  - Stripe Checkout + webhooks (payments, $49 one-time)
  - Vercel hosting (Next.js 14, Node runtime; PDF route needs a
    long-running / high-memory function config, not Edge)
  - No database of businesses. No Google Maps / Places. No analytics
    or tracking of prospects. Buyer audit history kept only for the
    buyer who ran it, and only as long as needed to re-download a report.
```

**Why server-side, why no static export:** the audit fetches third-party URLs, calls the PSI API with a secret key, and generates the PDF. None of that can run in the browser, and the full report must not reach the browser before payment. A static export would put the report logic and the paywall in client code, which is trivially bypassed. Server API routes are the paywall: the browser only ever receives the teaser until the server confirms payment.

**Request flow (happy path):**
1. Buyer pastes a URL on /audit, optionally picks their saved brand profile.
2. Server validates the URL (public http/https only; reject localhost, private IPs, non-http schemes), fetches the page, runs PSI mobile + desktop in parallel, checks links, scores.
3. Server returns the teaser: overall grade, category grades, top 3 findings. Full findings, evidence quotes, proposal draft and PDF download stay locked.
4. Buyer pays $49 once via Stripe Checkout. Webhook marks the buyer entitled.
5. Server returns the full report JSON and a short-lived signed PDF download link. Buyer edits the proposal draft (prices, timeline, intro), then downloads the teardown PDF, the proposal PDF, or one combined PDF.

**Failure handling:** PSI takes 15–40 s per strategy; run mobile + desktop in parallel, show progress steps, cache per URL for 24 h so a repeat audit is instant. If a site blocks the fetch, returns an error, or is heavily JS-rendered so the HTML crawl cannot see the content, say so plainly on the report ("Could not read — the site blocked the check / the page loads content with JavaScript") and never score what was not measured. Never invent a finding for an unreadable page. Time out cleanly; never leave a blank screen.

## 6. Tech stack

| Layer | Choice | Why |
|---|---|---|
| Framework | Next.js 14 (App Router), TypeScript | Matches the brief; App Router route handlers are the server API; TypeScript catches the scoring/PDF data-shape bugs early |
| Hosting | Vercel, Node runtime | Fast deploy; but PDF generation needs function config that fits Chromium (memory/timeout), tested before launch, not assumed |
| Static export | NO | Server API routes are the product (audit, paywall, PDF). Static export would break all three |
| HTML parse | cheerio | Deterministic, no browser needed for the parse half of the audit |
| Speed data | PageSpeed Insights API | Google runs Lighthouse; no Chrome to babysit on v1. Cache 24 h per URL. Key restricted to the PSI API only |
| PDF | Primary: Puppeteer (`puppeteer-core` + `@sparticuz/chromium`, pinned versions). Fallback: `@react-pdf/renderer` | Best fidelity (one HTML template for screen + PDF, selectable text, real page breaks). React-PDF is the serverless-safe fallback if Chromium proves flaky in testing. Never jsPDF/html2canvas for the client report (image PDF, no selectable text) |
| Payments | Stripe Checkout (one-time $49) + webhooks | Standard, and webhook confirmation is what unlocks the full report server-side |
| Styling | Tailwind CSS, design system in docs/design-notes.md | Single source of truth for app UI, report HTML, and PDF |
| Icons | Lucide, 18 px, 1.5 stroke | Only icon set allowed (see design notes) |
| Fonts | Inter (UI + report), system fallback in PDF if embed fails | Legible at small sizes, renders consistently in Chromium PDF, open licence |
| State | One brand profile per buyer, server-stored | Set once, reused on every report |
| No | No database of businesses, no Google Maps/Places, no stored lead lists, no CRM, no email sequences in v1 | Out of scope and a legal risk; see §9 |

## 7. Pages

| Route | Purpose |
|---|---|
| `/` (landing) | One-line pitch, how it works (paste URL, get teardown, send proposal), sample report link, price $49 one-time with the 30-audit/month fair-use limit printed next to it, comparison line vs $39/mo white-label subscriptions (arithmetic, not an earnings claim), FAQ, no earnings claims, no "Verified" claims |
| `/audit` | Interactive audit tool. URL input, brand-profile picker, progress steps while the audit runs, teaser result (overall grade + top 3 findings), locked full report with paywall, edit step for the proposal draft, PDF download after payment |
| `/sample` | Full sample teardown report, on screen and as a downloadable PDF. Clearly marked SAMPLE on every page. Fictional business only (invented name, invented address/phone, invented site content) — never a real business presented as a sample |
| `/templates` | Proposal templates. The proposal structure in §8 as editable templates (Essential / Growth / Premium tiers, blank prices). Templates are starting text the freelancer adapts, not legal advice |
| `/terms` | Terms, Acceptable Use, Refund policy. Includes: lifetime means the lifetime of the product; refund rule (replace or refund bad reports reported in 14 days); no guarantee of client wins; data provided as-is; buyer is responsible for their own outreach law; no cold SMS scripts anywhere in the product; no personal data collection; audit limit; what the tool does and does not check (no traffic/ranking estimates, no Google Maps/Places data) |

## 8. Audit engine design

**Scope:** homepage only on v1, stated plainly on the sales page and on every report. One public URL the buyer pastes. Direct fetch + parse only.

**Steps (server-side, in order):**
1. Validate URL: public http/https, reject localhost / private / link-local IPs, reject non-http schemes, follow at most 3 redirects, 10 s fetch timeout.
2. Fetch the page: record HTTP status, final URL after redirects, HTTPS certificate validity, HTTP→HTTPS redirect, response size, load time.
3. Parse HTML with cheerio: title (text + length), meta description (text + length), H1 count and text, H2–H6 hierarchy and skipped levels, images (count, missing/empty alt, oversized above the fold), links (internal/external, first 40 internal checked), canonical tag, Open Graph tags, viewport meta tag, JSON-LD schema (LocalBusiness or subtype, name/address/phone/hours), `tel:` links, `mailto:` links, phone/address/hours visible in page text, CTA button text and position, contact/booking form (present, field count, submit action), social links (check status 200, do not scrape the platform), testimonials/reviews visible on the page, trust marks mentioned (licence, guarantee, years in business), favicon, copyright year.
4. PageSpeed Insights API, mobile + desktop in parallel: Lighthouse Performance, SEO, Best Practices scores; LCP, CLS, TBT (lab). Label lab vs field data separately; if no CrUX field data exists, say "No field data available for this URL yet" — never invent it, never silently fall back to origin-level data. Check `lhr.runtimeError` before reading scores.
5. Broken links: HEAD, fall back to GET, 5 s timeout each, cap 40 internal links, sample of external links. Report URL + status code. Do not follow links behind logins.
6. Score, then render. Every finding shows: (a) what was found (the actual title text, the actual LCP value, the actual broken URL), (b) why it matters in one plain sentence tied to a lost call/booking/visit, (c) severity (Critical / Fix soon / Nice to have), (d) the fix in one line. Anything the engine could not read gets its own "Could not check" state and never lowers the score.

**Scoring (weights from RESEARCH.md, total 100):**

| Category | Weight | What decides it |
|---|---|---|
| Speed | 20 | Lighthouse Performance score; LCP ≤ 2.5 s, CLS ≤ 0.1, TBT ≤ 200 ms = good. Score from the Performance score, not one metric |
| Mobile | 15 | Viewport tag present; no horizontal scroll at 390 px; tap targets pass; body text readable without zoom; `tel:` link present; phone + main CTA visible above the fold on mobile |
| On-page SEO | 20 | Title 50–60 chars with service + city; meta description 120–160 chars; exactly one H1; heading hierarchy; canonical; OG tags; thin-content flag. Partial credit for length, not binary |
| Technical | 15 | Valid HTTPS + redirect; robots.txt; sitemap; noindex check; broken internal links; redirect chains/loops; duplicate www/non-www. SSL failure caps this category at 0 |
| Conversion | 15 | One obvious primary CTA above the fold (desktop + mobile); phone, address, hours visible on the homepage; contact/booking form present and working; flag > 6 form fields |
| Trust / local / social | 15 | LocalBusiness JSON-LD with name/address/phone/hours; `sameAs` social links returning 200; testimonials/reviews on the page; trust marks; current copyright year; favicon |

Per-category score 0–100, then grade bands (all categories, same bands as Lighthouse): **90–100 A, 80–89 B, 70–79 C, 60–69 D, below 60 F**. Overall score = weighted sum of the six categories; overall grade uses the same bands. Weights are printed on the report so the freelancer can explain them. They are this product's scoring model, not an industry standard — say so.

**What the engine does NOT check:** no Google Maps / Places / Business Profile lookup, no review-rating import, no NAP comparison against Google, no backlinks, no keyword rankings, no traffic estimates, no multi-page crawl on v1, no accessibility score presented as a legal/WCAG compliance claim. The sales page says this plainly: "We audit the page you paste. We do not estimate traffic or rankings."

## 9. White-label fields

One brand profile per buyer, set once, reused on every report. No vendor name anywhere on the PDF, share link, or PDF metadata — that is the definition of white label here.

| Field | Required | Notes |
|---|---|---|
| Brand / business name | Yes | Cover, header, footer, proposal |
| Logo upload (PNG/JPG, transparent PNG preferred, min 400 px wide) | Yes | Cover + header; fall back to brand name in text if no logo. Stored, not hotlinked |
| Primary brand colour | Yes | Cover, headings, score bars, CTA buttons |
| Accent / secondary colour | Yes | Highlights, badges, charts |
| Contact name | Yes | "Prepared by …" on cover + proposal signature |
| Contact email | Yes | Footer + proposal CTA |
| Contact phone | Recommended | Click-to-call on the proposal |
| Website URL | Yes | Footer, "See more of my work" link |
| Call-to-action text + link | Yes | e.g. "Book a free 15-minute call" → Calendly / contact page. This is the conversion point of the document |
| Report intro / cover line | Optional | One editable sentence, e.g. "I reviewed [Business] and found 7 quick wins." |
| Currency | Yes, default USD | Proposal prices show the freelancer's currency |
| Footer disclaimer | Fixed, not editable | "Lab measurement on [date]. Scores can vary between runs. This report audits the public homepage only." |

Rules: preview the branded cover + first page on screen before download so the buyer can check logo/colours. Do not promise a custom domain on v1; a neutral share link with no vendor name is the v1 equivalent.

## 10. Proposal structure

Problem before price, always. The proposal is generated from the teardown findings and is editable before sending. **Never auto-fill a price, a timeline promise, or a results promise.** Prices and dates are blank placeholders the freelancer fills in.

1. **Cover** — Client business name, "Website redesign proposal for [Business]", freelancer brand/logo, date, one-line summary.
2. **What I found (executive summary)** — 3–5 sentences, top 3 findings from the teardown, each tied to a business cost (lost calls, slow load, no booking path). Auto-filled from Critical findings; freelancer can edit.
3. **Understanding the problem** — Restate the problem + business impact with the actual numbers from the audit (slowest metric, missing CTA, missing schema, broken links). No invented impact numbers: never write "you are losing $X/month" unless the freelancer types it.
4. **What I would fix** — Fix list mapped 1:1 to findings, grouped by phase: Quick wins (speed, meta, alt text, SSL), Redesign (mobile layout, CTA, forms, trust), Ongoing (schema, sitemap, monitoring). Every feature tied to an outcome, not a tech spec.
5. **Scope & deliverables** — Concrete, checkable list: number of pages, custom vs template design, CMS, responsive breakpoints, integrations, revision rounds, post-launch support. Always include a "Not included" row (hosting, domain, copywriting, ongoing maintenance unless priced).
6. **Timeline & milestones** — Numbered milestones with durations, editable week numbers (e.g. Week 1 Discovery, Weeks 2–3 Design, Weeks 4–6 Development, Week 7 QA + Launch). Freelancer fills in the start date.
7. **Pricing (Investment)** — Three tiers (Essential / Growth / Premium; most clients pick the middle). Each tier: pages, design level, SEO setup, support period, price. All prices are blank placeholders (`$____`) the freelancer fills in before sending. Payment terms placeholder: 50% upfront / 50% on launch, or milestone-based 25/25/25/25. Use the word "Investment", not "Cost".
8. **About / social proof** — Short paragraph + 2–3 past-project slots the freelancer fills in. Blank slots only, never fake case studies. Optional testimonial slot.
9. **Terms** — Payment structure, revision limits, what happens beyond scope, usage rights, how to contact. Template text, clearly marked as a template the freelancer should adapt. General information, not legal advice.
10. **Next step & acceptance** — One clear next step ("Reply to this email / Book a 15-minute call [link] / Sign below"), expiry placeholder ("This proposal is valid until [date]"), signature lines for both parties, date.

Delivery: teardown PDF and proposal PDF as separate downloads, plus one combined PDF (teardown first, proposal second). Freelancers send the teardown free to open the conversation and the proposal when the prospect replies — or both together for a warm lead.

## 11. PDF design

- **Primary:** Puppeteer HTML→PDF. Render the report as the same branded HTML the buyer previews on screen, print with headless Chromium via a route handler returning `Content-Type: application/pdf`. Full CSS (flex, grid, tables, charts), selectable text, correct page breaks. Set `@page` size/margins in CSS; `print-color-adjust: exact` so brand colours print; embed fonts (do not rely on system fonts on serverless). Test a 6–10-page report end to end (cover + score summary + 6 category sections + proposal) before promising a page count. Cache the generated PDF per audit (24 h).
- **Vercel notes:** stock `puppeteer` exceeds the old 250 MB function limit; use `puppeteer-core` + `@sparticuz/chromium` with pinned versions and the `outputFileTracingIncludes` fix for the `bin` folder. Cold start unpacks Chromium to `/tmp`; test it on the real host before launch. If Puppeteer proves flaky in pre-launch testing (cold starts, timeouts, font issues), ship the fallback.
- **Fallback:** `@react-pdf/renderer`. No Chrome, works on serverless, fast — but it is a second layout to maintain (its own layout engine, not HTML/CSS; charts must be pre-rendered as images). Keep it ready, do not build both layouts in parallel on day one.
- **Do not use:** jsPDF + html2canvas for the client report (produces an image PDF with no selectable text); wkhtmltopdf (deprecated).
- **White-label rule for PDFs:** no vendor name in the PDF content, footer, share link, or PDF metadata.

## 12. Data rules

- Buyer URL only. The tool audits the single public URL the buyer pastes, in that moment. No stored business lists, no pre-scraped packs, no resale of third-party data.
- No storage of third-party data: audit results are kept only for the buyer who ran them, only as long as needed to re-download a report, and are never sold, shared, or used to build a list.
- No personal data: the tool does not collect, store, or display personal data about the prospect (no names, emails, or phone numbers pulled from anywhere except what is visibly published on the fetched page itself, and that only inside the buyer's own report).
- No Google Maps / Places data at all: no Business Profile lookup, no review import, no NAP comparison against Google, no Maps/Places API calls anywhere in the product.
- No cold SMS scripts anywhere in the product or templates. Outreach templates, if any, are email only, and the buyer is responsible for their own outreach law.
- Respect robots.txt for the fetch where applicable; never submit forms, never log in, never bypass a captcha or paywall to read a page. If a page cannot be read, say so and do not score it.

## 13. Legal labels (copy rules for every page, report, and template)

- No "Verified" claims anywhere — not on the product, not on reports, not on the landing page.
- No future dates on reports or proposals except placeholders the freelancer fills in themselves.
- No invented fill rates, no invented traffic/ranking/revenue figures, no estimated dollar-loss figures for the prospect's business.
- No earnings claims. Where a cost comparison is shown, a disclaimer sits next to the claim (e.g. "Arithmetic on published prices, not an earnings claim" / "No guarantee of client wins").
- Sample reports are clearly marked SAMPLE on every page, with fictional data only (invented business, invented address/phone, invented site content).
- Refund: replace or refund bad reports reported within 14 days. A "bad report" is one with wrong findings (e.g. a check that contradicts the fetched page) — the buyer reports it, support re-runs or refunds.
- No guarantee of client wins. The tool improves the pitch; it does not promise the prospect signs.
- Data provided as-is. Scores are lab measurements on the run date under stated conditions; scores vary between runs. Accessibility checks are automated checks, not a WCAG certification.
- Buyer is responsible for their own outreach law (spam, consent, and local rules where they operate).
- No cold SMS scripts. No personal data collection.
- "Lifetime" means the lifetime of the product, stated in the terms.

## 14. Launch plan (27 Nov – 1 Dec 2026)

| Day | Work |
|---|---|
| Thu 27 Nov | Name + plan + design notes (this document). Set up project skeleton. PSI API key (restricted to PSI API), Stripe account check. |
| Fri 28 Nov | Audit engine: fetch + parse + PSI parallel calls + broken-link checks + scorer. Teaser result on screen. Test on 5 real local-business sites; read every finding against the fetched HTML by hand. |
| Sat 29 Nov | Report + white-label: brand profile, preview, PDF (Puppeteer primary, React-PDF fallback ready), proposal generator with blank placeholders, edit-before-send step. Full sample report on a fictional business. |
| Sun 30 Nov | Payment + landing: Stripe Checkout $49 one-time, webhook entitlement, server-side paywall (full report never shipped before payment), landing page, /sample, /templates, /terms. Deploy on Vercel. End-to-end test: free audit → pay (test mode) → full PDF. |
| Mon 1 Dec | Launch. Demo video (2 min, Loom). Launch posts: r/webdev, r/freelance, r/webdesign, r/Entrepreneur, Indie Hackers, X/Twitter, Facebook freelancer groups. Three sample teardowns (fictional businesses) as social proof. Daily distribution from 1 Dec: one new post/day, reply to every comment. |

## 15. What is still missing (do not claim these are done)

- Payment: Stripe Checkout + webhook + entitlement logic not built; no test purchase made yet.
- Ship or Die tracker: product not registered/logged in the hackathon tracker yet.
- TrustMRR: not set up; no verified-profit tracking wired in.
- Custom domain: none bought or attached (do not buy until the registrar + trademark check in §1 is done). Launch domain is a Vercel subdomain until then.
- Real test purchases: zero. No real $49 purchase has been made or refunded in test.
- PSI API key: not created; quota not verified on the project's own key.
- PDF on Vercel: Puppeteer + Chromium pairing not tested on the real host; React-PDF fallback not built.
- Sample report: fictional-business sample not written yet.
- Legal review: terms/refund/acceptable-use text is drafted from research, not reviewed by a lawyer. General information, not legal advice.
- Trademark/domain check for DealNote: web-search only so far (§1).

## Sources

- Research: `RESEARCH.md` in this folder (competitors, scoring weights, Lighthouse, PDF options, white-label fields, proposal structure, pricing; research date 27 Nov 2026).
- Debate: `~/workspace/ship-or-die-100k/nosite-leads/docs/claude-debate-room-2026-11-27.md` (Idea 6 winner, $49 one-time, buyer web-design freelancers and small agencies).
- Name checks: web search, 27 Nov 2026 (see §1 for per-name findings).
