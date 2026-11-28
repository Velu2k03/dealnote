# DealNote — Loop 4: Legal Labels + Endpoints Check (Stream 3)

**Date:** 28 Nov 2026, ~14:20 Manila
**Product:** DealNote — white-label website teardown + proposal generator, $49 one-time
**Repo:** `~/workspace/ship-or-die-100k/teardown-generator`, branch `main`, commit `d331073`
**Live site:** https://dealnote-blue.vercel.app
**Status of this document:** REPORT ONLY. No code changed, nothing deployed, no payment work, no test purchase, no accounts created, no email sent, no live POSTs.
**Read first:** `docs/dealnote-legal-research-2026-11-27.md` (labels L1–L9, Terms T1–T6), `docs/dealnote-loop2-legal-endpoints-2026-11-27.md`, `docs/dealnote-loop3-fix-report-2026-11-28.md`.

## 0. What was actually verified, and how

| Check | Method |
|---|---|
| Live pages (6) | `curl` GET of `/`, `/audit`, `/sample`, `/templates`, `/terms`, `/privacy` — all HTTP 200, saved to `/tmp/dnloop4/live_*.html`; visible-text extraction + raw-HTML grep for each label's exact wording |
| Repo source | `main` at `d331073`; greps over `app/`, `components/`, `lib/` |
| Local endpoints | Fresh `npm run build` (see §5 — build packaging failed twice, partial `.next` still served correctly), `next start` on 127.0.0.1:3105 with throwaway dev key `DEALNOTE_DEV_LICENSE_KEY=dev-test-key-123` (env only, never committed), no Polar env |
| Live endpoints | **NOT PERFORMED — approval required.** Same standing position as Loops 2 and 3. No live POST was attempted. |
| PDFs | Generated locally with the dev key (teardown 82,669 bytes / 4 pages; proposal 86,079 bytes / 4 pages); per-page `pdftotext -layout` checks |
| Refund channel "working" | Presence verified on site; **live deliverability NOT re-proven in this run** — no test email sent (per task). Last verified delivery is the 20 Nov 2026 Zoho test send/receive on record in MEMORY.md. |

**Live build identity check:** all 6 live pages returned byte sizes identical to the Loop 3 live verification (home 49,769; /audit 17,788; /sample 52,096; /templates 38,747; /terms 26,419; /privacy 22,494), confirming the Loop 3 build (merge `1ce3e47`, main `d331073`) is the build live now.

## 1. L1–L9 label verification

Grading: **PASS** = label present in the right place with the required substance; **PARTIAL** = present but with a placement/wording gap (details below); **FAIL** = absent.

| Label | Verdict | Evidence |
|---|---|---|
| **L1 — Score disclaimer** (hero, /audit result, /sample, PDF) | **PASS** (was PARTIAL in Loop 2) | Landing hero now carries the FULL text live: "Scores are DealNote's own measurements from this run, on the run date shown. They are not Lighthouse, PageSpeed, or search-ranking scores. Scores can vary between runs. Weights: Speed 20, Mobile 15, On-page SEO 20, Technical 15, Conversion 15, Trust & local 15. This is DealNote's scoring model, not an industry standard. Grades: A 90-100, B 80-89, C 70-79, D 60-69, F below 60." (live home HTML; source `components/audit-ui.tsx:179`, `ScoreSummary`). /sample: same full text (`app/sample/page.tsx:34`). /audit result: same `ScoreSummary` caption, code-verified, renders once a result exists. PDF: footer on every page now (see L9). Loop 2 gap #4 (hero missing the "not Lighthouse" sentence) is **closed**. |
| **L2 — Price disclaimer** (under $49) | **PASS** | Live home pricing card: "Teardown PDF and proposal PDF (coming with payment)"; caption: "$49 once is less than two months of a $39-per-month subscription. SEOptimer White Label, $39/mo on its public pricing page, checked 27 Nov 2026. Example only. Compare current prices before you buy. No guarantee of client wins." Word "cheapest": 0 hits site-wide in live HTML (all 6 pages). |
| **L3 — SAMPLE stamp** | **PASS (site) / PARTIAL (print + server PDF)** | /sample top: "SAMPLE: fictional business, fictional data" (`app/sample/page.tsx:14`, live HTML); body: "This business is invented. The address, phone number, and website are fictional, and the findings are sample findings written to show the report format. Nothing on this page describes a real business."; footer: "SAMPLE footer: this sample report is produced by DealNote for demonstration only." (6 `SAMPLE` hits in source). **Still open:** (a) browser print — `@media print` in `app/globals.css:195-200` hides header/footer/`.no-print` but has no repeating print header, so the stamp prints on page 1 only; (b) server PDFs — the stamp mechanism exists in `lib/pdf-html.ts:140` (`isSample` branch) and the PDF routes pass `result.isSample` through, but `isSample: true` exists only in `sampleAudit()` (`lib/audit.ts:240`) while `/api/audit` sets `isSample: false` (`app/api/audit/route.ts:386`) and the PDF routes re-run a live audit, so no server PDF can ever carry the stamp today. Loop 2 gap #2 is **not closed**. |
| **L4 — Audit-method note** (robots line) | **PASS** | Live /audit static HTML, under the URL box: "Public http or https addresses only. The audit reads the homepage and checks up to 10 internal links. It never submits forms, logs in, or bypasses a login page. If the site's robots.txt asks automated tools not to fetch the page, the audit will not run and no score will be given." (`app/audit/page.tsx:422`). Same sentence in /terms Acceptable Use (T3). |
| **L5 — Refund pointer** | **PASS** (was PARTIAL in Loop 2) | Pricing card now carries it: "Bad report? Report it within 14 days for a replacement or refund. Email murugan@drvelu.com with the report URL, the finding, and why. See the refund section in the terms." (live home HTML). FAQ answer unchanged and present: "Report a bad report within 14 days and we will replace it or refund it. Email murugan@drvelu.com with the report URL, the finding you say is wrong, and why. See the refund section in the terms." Loop 2 gap #3 is **closed**. |
| **L6 — Outreach responsibility** | **PASS** | /templates top, live HTML: "You are responsible for your own outreach law, including spam, consent, and local rules where you operate." + "DealNote provides no cold SMS scripts." (`app/templates/page.tsx:129`). /audit proposal section: same line at `app/audit/page.tsx:751` (renders with the result). /terms T4 carries the full paragraph. Caveat (unchanged from Loop 2, by design): the /audit copy renders only after a result exists, so it is absent from static /audit HTML. |
| **L7 — No-data-about-prospects** | **PASS** | Landing FAQ, live HTML: "No. The audit reads the public homepage only. Contact details in a report come only from what is visibly published on that page. There is no cold SMS in this product, and you are responsible for your own outreach law." Also in /terms ("Do not use the tool to collect personal data…"). |
| **L8 — Local-storage notice** | **PASS** (was PASS-with-caveat in Loop 2; caveat now closed) | Exact text now present in **static** live /audit HTML (1 hit): "Your brand profile and outreach tracker are stored only in this browser's local storage. Nothing is sent to DealNote or anyone else. Clear them in your browser settings to delete them." Source: `LOCAL_STORAGE_NOTICE` (`app/audit/page.tsx:62`) rendered in the form card (line 466, unconditional) plus under the brand (636) and tracker (984) sections post-result. Keys `dealnote-brand-v1` / `dealnote-proposals-v1` named in /privacy. Loop 3 fix confirmed live; Loop 2 gap #6 is **closed**. |
| **L9 — PDF footer** | **PASS** (was PARTIAL in Loop 2) | Footer content complete and verbatim: "Prepared by [brand] on [run date] for [prospect URL]. Scores are DealNote's own measurements from this run, not Lighthouse or PageSpeed scores, and can vary between runs. This report checks the public homepage only. It does not estimate traffic, rankings, or lost revenue. No guarantee of client wins." (`lib/pdf-html.ts:75-84`, `FOOTER_DISCLAIMER` / `footerLine`). Rendered via Puppeteer `displayHeaderFooter` (`lib/pdf-html.ts:62-64`), the only footer (in-body footer div removed in Loop 3). Verified per page by `pdftotext`: footer exactly **1× on each page** of both locally generated PDFs (teardown 4 pages, proposal 4 pages). Loop 2 gap #1 is **closed**. |

### Terms T1–T6 (live /terms, all present, verified verbatim)

- **T1 Refund policy:** "If a report is bad, report it within 14 days of the run date shown on the report and we will replace it or refund the $49, our choice." + "A bad report is one with a wrong finding, for example a check that contradicts the fetched page." + report-by-email with (1) report URL (2) finding (3) why + "We will reply within 3 business days." + "Refunds are for bad reports, not for a prospect declining your proposal, and not for a report you have not read." + "If a feature you paid for stops working, report it the same way and the same rule applies."
- **T2 Contact:** email `murugan@drvelu.com` for refund requests, bad reports, and questions; "There is no phone support in v1."; 3-business-day reply aim.
- **T3 Acceptable use:** "Respect robots.txt." bullet present (plus the "do not try to work around that" wording).
- **T4 Outreach:** full paragraph incl. "CAN-SPAM Act (honest headers and subject line, identification as an advertisement, your postal address, and an opt-out honoured within 10 business days)", "Canada, the UK/EU, and Australia require consent before most cold commercial email", "Do not send marketing texts unless you already have the recipient's prior express written consent."
- **T5 Data and privacy:** "DealNote collects no account or payment information in v1." + "we do not build or sell lists of businesses, and we do not sell personal information." + localStorage-only brand/tracker + Vercel logs.
- **T6 Lifetime:** "Lifetime means the lifetime of the product." + "If DealNote is discontinued, lifetime access ends with it, and the refund rule below applies to purchases made within the preceding 14 days." — **trivial wording variant:** the research draft said "refund rule above applies"; live says "below" (placement-dependent, substantively identical). Not a fail.
- Bonus (unchanged): 18+ / age-of-majority line present; "Last updated: 28 Nov 2026" on /terms and /privacy; footer "Last updated 28 Nov 2026".

### Other live-site checks

- "verified": **0 hits** on all 6 pages. No "2027" dates anywhere. The "27 Nov 2026" hits are all legitimate (sample run date, SEOptimer check date, tracker install date).
- /privacy Polar wording: future tense confirmed live — "coming soon and will be handled by Polar", "No payment is taken today"; 0 present-tense "Payments are handled by Polar" hits. Loop 2 gap #8 **closed** (Loop 3 fix).
- /privacy "Changes" section: fixed — "The Ship or Die tracker is now installed (27 Nov 2026)." Loop 2 gap #9 **closed** (Loop 3 fix).
- Tracker snippet byte-present, executed-tag count 1 per page, all 6 pages (same check as Loops 2–3).

## 2. Refund promise — is it claimable now?

**Yes, by channel presence — with one caveat (unchanged).**

- `murugan@drvelu.com` is present as a `mailto:` link in the footer of **all 6 live pages** ("Contact: murugan@drvelu.com"), in the landing FAQ refund answer, in the pricing card refund line, in /terms Refund policy + Contact section, and in /privacy. It is also in the audit User-Agent string: `DealNote/1.0 (website teardown; contact murugan@drvelu.com)`.
- **Pre-filled mailto subject is now present** — Loop 2 gap #5 **closed**. `mailto:murugan@drvelu.com?subject=DealNote%20refund%20request` on: landing FAQ refund link, landing pricing-card refund link, /terms refund section (T1) and Contact section. The footer mailto remains bare (`mailto:murugan@drvelu.com` with no subject) — acceptable, it is a generic contact link, not a refund link. Note the pre-filled subject does not include the report URL or date placeholders the research draft suggested ("DealNote refund request — [report URL] — [date]"); the three required items are stated in prose next to every link.
- `docs/refund-log.md` exists on main and is current: "No refunds yet. No sales yet, so no refund requests exist." Rule, 3-business-day reply, and required request contents are recorded. Correct empty-log state pre-sale.
- **Caveat — deliverability not re-proven this run.** No test email was sent (per task). Last proven delivery is the 20 Nov 2026 Zoho verification (test send/receive, MX/SPF/DKIM green) on record in MEMORY.md. If the parent wants fresh proof, a single test email from the operator is the only way.

## 3. Phase 1 template content vs legal guardrails — NO VIOLATIONS FOUND

Checked `lib/templates.ts`, `app/templates/page.tsx`, `lib/pdf-html.ts`, served live `/templates` HTML, and the locally generated proposal PDF.

| Guardrail | Result |
|---|---|
| Blank `$____` prices only | **PASS.** `priceOrBlank` (`lib/templates.ts:174`) maps blank, `0`, `$0`, `$0.00`, `____`, and any non-numeric value to `$____`. The only `$[0-9]` hits in `lib/templates.ts` are inside a comment (lines 172–173) explaining the blanking. Served live `/templates` HTML contains only `$49` (the product price). Generated proposal PDF (dev key, Quick-Fix) shows `$____`. |
| No fake testimonials | **PASS.** `TESTIMONIAL_SLOT_TEXT` is an explicit placeholder: "[PAST PROJECT - Replace with a real project or delete this section] … Never invent a client, a quote, or a result." (`lib/templates.ts:149`). No testimonial text exists anywhere else. |
| No invented guarantees / dollar-loss figures | **PASS.** No "will double", guarantee (except "No guarantee of client wins"), or dollar-loss string in templates or the /templates page. Checklist on /templates states: "The findings quoted are the real findings from the audit, no invented figures, no invented dollar loss, no fake case studies." |
| Non-binding acceptance wording | **PASS.** Present in proposal text (`lib/templates.ts:137`: "This proposal is for discussion purposes. It is not a contract, and signing it does not create one. A separate agreement will be provided before work begins.") and in the generated proposal PDF ("not a contract", 1 hit in full text). 0 "signature" hits. |
| CAN-SPAM footer on every email incl. follow-ups | **PASS.** Single builder `buildEmailText` appends `canSpamFooter(brand)` to **all 8** email kinds — Cold, Warm, Referral, Day 3, Day 7, Breakup, Post-Call, Post-Proposal (`lib/templates.ts:232–368` kinds, builder at 387–394). Footer contains name/brand, postal address (or an explicit `[Add your postal address…]` placeholder + a visible "Your postal address is missing" warning on /templates when unset), phone/email/website, "This is an advertisement", and "reply with 'unsubscribe'… I will stop within 10 business days." Live /templates shows the full footer preview plus the missing-address warning. |
| No cold SMS anywhere | **PASS.** Repo-wide grep for `sms|text message` returns only the "no cold SMS scripts" disclaimer lines (`app/templates/page.tsx`, `app/audit/page.tsx:751`, /terms). No SMS script, template, or instruction exists. |
| "Not legal advice" note | **PASS.** Present in the proposal Terms section in text (`lib/templates.ts:139,516,531`: "This is not legal advice." / "This template is a starting point, not legal advice.") and in the PDF (`lib/pdf-html.ts:270`), plus "These templates are starting text you adapt, not legal advice" on /templates and the caption on /terms and /privacy ("This text is general information, not legal advice."). |
| 60-second checklist | **PASS**, live on /templates: subject-line honesty (no fake "Re:" or "Fwd:"), footer completeness, real findings only, country-consent rule (US vs Canada/UK/EU/Australia), do-not-contact check, "You are sending email only. No SMS." |
| Email subjects (Loop 3 fixes hold) | **PASS.** Cold subjects: "3 quick wins for [Business]" (5 words), "Your website: 3 quick wins", "[Business] website quick audit". Day 3: "Your website review" (no fake "Re:"). Post-Proposal: "Your website proposal". The single "Re:" hit in live /templates text is the checklist line itself ("no fake 'Re:' or 'Fwd:'"). |

## 4. Endpoints — local production server (all PASS, with one build caveat in §5)

Local server: `next start` 127.0.0.1:3105 (from the partially built `.next`, see §5), no Polar env, dev key only. Server stopped after testing; port 3105 confirmed closed. All 6 local pages GET 200.

| Endpoint | Test | Result |
|---|---|---|
| `POST /api/audit` free, no key (example.com) | Teaser shape | **200.** Keys exactly: `teaser, url, fetchedAt, overallScore, overallGrade, issues, message`. Score 45/F, **2 issues** (top 2 only). **Change since Loop 2:** `categories` and `totalIssues` are GONE from the teaser — `teaserFor` (`app/api/audit/route.ts:496-507`) now returns score + grade + top 2 issues only. Loop 2 gap #7 is **closed**; the teaser is now exactly the intended shape. It does NOT leak full findings, title, `couldNotCheck`, `brokenLinks`, or any other full-result field. Message: "This is a free preview: the overall score and the top 2 findings. The full report, including every finding and the ready-to-send proposal, needs a DealNote licence ($49 one-time)." |
| `POST /api/audit` robots disallow | `https://www.google.com/search?q=test` (Google robots.txt disallows `/search`) | **403**, exact message: "This site asks automated tools not to fetch this page (robots.txt). No score was given." |
| `POST /api/audit` rate limit + refund | Free 200, robots 403, then 4 more free 200, 6th call | Calls 1–5 → **200**; the interleaved robots 403 did **not** consume quota (Loop 3 `refundFreeRateLimit` proven again); 6th call → **429** with `Retry-After: 3574` and message "Free audits are limited to 5 per hour from one address. Try again later, or use a licence key for the full report." |
| `POST /api/audit` private URL | `http://127.0.0.1:9/admin` | **400**: "That address is not a public website. Paste a public business website URL." (input validation, before rate-limit counting) |
| `POST /api/checkout` no env | `{}` | **503** `{notConfigured: true, error: "Checkout is not configured yet. The $49 one-time licence is coming soon; the free preview still works."}` — never a fake success or URL. |
| `POST /api/pdf/teardown` no key | `{"url": "https://example.com"}` | **402**: "A licence key is required to download the PDF report. Buy DealNote ($49 one-time) to get one." |
| `POST /api/pdf/proposal` no key | same | **402**: "A licence key is required to download the PDF proposal. …" |
| `POST /api/pdf/teardown` bad key | `licenseKey: "wrong-key"` | **402** (invalid key mapped to payment-required, not 401). Message: "Licence keys are not configured on this build yet. That key was not recognised." |
| `POST /api/pdf/teardown` dev key + real brand | Quick-Fix path, brand Loop4 Test Studio / Test Person / loop4test@example.com | **200**, valid PDF, 82,669 bytes, 4 pages. Footer exactly 1× per page (see §4.1). 0 placeholder hits. |
| `POST /api/pdf/proposal` dev key + real brand | template `quickfix` | **200**, valid PDF, 86,079 bytes, 4 pages. `$____` present, non-binding wording present. Footer exactly 1× per page. 0 placeholder hits. |
| `POST /api/pdf/teardown` dev key, NO brand | placeholder `DEFAULT_BRAND` | **400**: "Fill in your brand profile first: your studio name, your name, your contact email are still a placeholder. A PDF must not go out signed by a placeholder." (Loop 3 guard holds.) |
| `POST /api/pdf/proposal` dev key, NO brand | same | **400**, same message. |
| SSRF redirect re-validation | — | **Not re-run in Loop 4.** Last proven: Loop 2 `tsx` unit run + Loop 3 `scripts/test-ssrf.ts` 29/29 pass. No code changed in that path since (`fetchPublicWithRedirects`, `isValidAuditUrl` untouched at `d331073`). Prior results stand; re-run if the parent wants a fresh proof. |

### 4.1 PDF footer per page (L9 proof)

`pdftotext -f N -l N -layout` on both locally generated PDFs: the footer sentence ("Scores are DealNote's own measurements…") appears exactly **1× on each page** — teardown pp. 1–4, proposal pp. 1–4. Full footer line on p.1: "Prepared by Loop4 Test Studio on 28 Nov 2026 for https://example.com/. Scores are DealNote's own measurements from this run, not Lighthouse or PageSpeed scores, and can vary…"

**Observation (not a gap):** the proposal PDF is 4 pages / 86,079 bytes this run vs 5 pages / 99,324 bytes in Loop 3 (teardown 82,669 vs 82,622 bytes, still 4 pages). Same template (`quickfix`), same test URL (example.com). Likely fewer findings/content in this run's audit; no legal content is missing (`$____`, non-binding wording, footer all present).

**Operator note:** my first branded-PDF attempt used the wrong brand field name (`email` instead of `contactEmail`) and got a 400 naming only the email placeholder. That 400 was my error, not a product fault — corrected field name returned 200. It also incidentally proves the validator names the specific missing field.

## 5. NEW FINDING — local `npm run build` fails at the final packaging stage (twice)

Loop 3 reported a clean build on 28 Nov. In this run, `npm run build` at `d331073` failed **twice in a row, at the same late stage, with different errors**:

- **Build 1** (pre-existing `.next`): exit 1 — `Error: ENOENT: no such file or directory, open '…/.next/server/app/_not-found/page.js.nft.json'` in `collect-build-traces.js`, after "✓ Compiled successfully" and "✓ Generating static pages (17/17)".
- **Build 2** (after `rm -rf .next`, fully clean): exit 1 — `SyntaxError: Unexpected end of JSON input` in `loadManifest` during `moveExportedPage`, again after "✓ Compiled successfully" and "✓ Generating static pages (17/17)".

Both failures are **after** successful compile, type-check, and static generation — the failure is in Next.js's final manifest/trace packaging. Disk is fine (95 GB free). The partially built `.next` still served correctly (`next start` Ready in 3.3 s, all pages + endpoints 200), so the endpoint results above are valid, but **no clean exit-0 build was obtained in this run**. This is not a legal issue, but it is a build-reproducibility flag for the parent: re-run `npm run build` (possibly a third clean attempt, or check whether another agent/process was touching the tree concurrently) before trusting a local build. No repo files were changed by this audit (`git status` shows only other streams' untracked Loop 4 docs/screenshots).

## 6. LIVE endpoint tests — NOT PERFORMED, approval needed

Same standing position as Loops 2 and 3: the live POST checks (free teaser, robots 403, checkout 503, PDF 402s) were **not performed** — they need Velu's approval. No live POST was attempted and no test purchase was made at any point, live or local. The local results in §4 exercise the identical code paths on the identical commit `d331073`, plus the live GET label checks in §1.

## 7. Open gaps (all minor; the Loop 2 list is nearly closed)

Loop 2 gaps status: #1 PDF footer per page — **closed** (§1 L9). #2 SAMPLE stamp per printed page / server PDF — **still open** (§1 L3). #3 refund pointer on pricing card — **closed**. #4 hero "not Lighthouse" sentence — **closed**. #5 pre-filled mailto subject — **closed**. #6 L8 unconditional render — **closed** (Loop 3). #7 teaser categories — **closed** (§4). #8 /privacy Polar present tense — **closed** (Loop 3). #9 /privacy tracker future tense — **closed** (Loop 3). #10 in-memory rate limit — **inherent, carried** (per-instance map, resets on Vercel cold start; a throttle, not a billing control — live 5/hour enforcement will be softer than the local test).

Remaining:

1. **SAMPLE stamp not repeated on every printed page, and never on server PDFs** (L3). Browser print: add a repeating print header, or accept page-1-only. Server PDFs: no PDF route ever receives a sample result; wiring a sample-PDF path (or stamping when the audited URL is the sample domain) is a small product decision, not just a label fix.
2. **/audit L1/L6 render only after a result exists.** By design, but a fresh visitor sees no score disclaimer or outreach line until they run an audit. L8 is now unconditional in the form card; L1/L6 are not. Consider showing the L1 short form under the URL box unconditionally.
3. **Local build packaging flakiness** (§5) — needs a re-run/investigation; not a legal blocker.
4. **Live POST verification** still pending Velu's approval (see §6).
5. **Refund deliverability not re-proven** (no test email sent; last proof 20 Nov 2026 Zoho).
6. **Trivial:** footer mailto has no pre-filled subject (refund-specific links all do); T6 says "refund rule below" vs the draft's "above" (placement wording, substantively identical).

## 8. Files

- This report: `docs/dealnote-loop4-legal-endpoints-2026-11-28.md` (not committed, per task)
- Evidence (ephemeral, not in repo): `/tmp/dnloop4/live_*.html`, `text_*.txt`, `local_teaser.json`, `local_teardown.pdf`, `local_proposal.pdf`, `local_build.log`, `local_build2.log`, `local_server.log`
