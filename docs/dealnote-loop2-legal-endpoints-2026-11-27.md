# DealNote — Loop 2: Legal Labels + Endpoints Check

**Date:** 27 Nov 2026
**Product:** DealNote — white-label website teardown + proposal generator, $49 one-time
**Repo:** `~/workspace/ship-or-die-100k/teardown-generator`, branch `main`, commit `19c3b65`
**Live site:** https://dealnote-blue.vercel.app
**Status of this document:** REPORT ONLY. No code changed, nothing deployed, no payment work, no test purchase, no accounts created, no email sent.
**Read first:** `docs/dealnote-legal-research-2026-11-27.md` (labels L1–L9, Terms T1–T6), `docs/TRUSTMRR-POLAR-CORRECTION.md`, `docs/dealnote-templates-phase1-2026-11-27.md`.

## 0. What was actually verified, and how

| Check | Method |
|---|---|
| Live pages (6) | `curl` GET of `/`, `/audit`, `/sample`, `/templates`, `/terms`, `/privacy` — all HTTP 200, saved to `/tmp/dnloop2/live_*.html`; visible-text extraction + raw-HTML grep for each label's exact wording |
| Repo source | `main` at `19c3b65` (Phase 1 merged); greps over `app/`, `components/`, `lib/` |
| Local endpoints | Fresh `npm run build` (exit 0), `next start` on 127.0.0.1:3105 with throwaway dev key `DEALNOTE_DEV_LICENSE_KEY=dev-test-key-123` (env only, never committed), no Polar env |
| Live endpoints | **NOT PERFORMED — approval required.** The live POST test run needed an approval that timed out; all four live `curl` POSTs returned HTTP 000 (connection never made). See §6. Live GETs above were unaffected. |
| PDFs | Generated locally with the dev key (teardown 71,173 bytes / 4 pages; proposal 86,571 bytes / 5 pages); per-page `pdftotext -layout` checks |
| SSRF / robots parser | `tsx` unit run against the exported `fetchPublicWithRedirects` / `isPathDisallowedByRobots` from `app/api/audit/route.ts`, plus a live-behaviour robots test locally (Google `/search`) |
| Refund channel "working" | Presence verified on site; **live deliverability NOT re-proven in this run** — no test email sent (per task) and sandbox DNS refused MX lookups (`dig @8.8.8.8` empty, `host -t MX` REFUSED). Last verified delivery is the 20 Nov 2026 Zoho test send/receive on record in MEMORY.md. |

## 1. L1–L9 label verification

Grading: **PASS** = label present in the right place with the required substance; **PARTIAL** = present but with a placement/wording gap (details below); **FAIL** = absent.

| Label | Verdict | Evidence |
|---|---|---|
| **L1 — Score disclaimer** (hero, /audit result, /sample, PDF) | **PARTIAL** | /sample: full text present, live HTML: "Scores are DealNote's own measurements from this run, on the run date shown. They are not Lighthouse, PageSpeed, or search-ranking scores. Scores can vary between runs. Weights: Speed 20, Mobile 15, On-page SEO 20, Technical 15, Conversion 15, Trust, local and social 15. This is DealNote's scoring model, not an industry standard. Grades: A 90–100, B 80–89, C 70–79, D 60–69, F below 60." (`app/sample/page.tsx:34`). /audit result: same sentence as `SCORE_DISCLAIMER` (`app/audit/page.tsx:64`, rendered line 476) — code-verified, renders only once a result exists. Landing hero: **short form only** — weights + "not an industry standard" + grades + run date are present (`components/audit-ui.tsx:180`, live home HTML), but the "They are not Lighthouse, PageSpeed, or search-ranking scores" sentence is **absent from the hero** (0 hits in live home HTML). The hero page does carry the separate line "Scores are lab measurements on the run date under stated conditions. Scores can vary between runs." PDF: footer disclaimer present but **only on the last page** (see L9). The placement map allows the short form under the hero score, so the hero gap is minor, but the PDF per-page gap is real. |
| **L2 — Price disclaimer** (under $49) | **PASS** | Live home pricing card: "Teardown PDF and proposal PDF (coming with payment)"; caption: "$49 once is less than two months of a $39-per-month subscription. SEOptimer White Label, $39/mo on its public pricing page, checked 27 Nov 2026. Example only. Compare current prices before you buy. No guarantee of client wins." Word "cheapest" is gone (0 hits site-wide in live HTML). Comparator is now named + dated, exactly the P0-4 option (a) fix. |
| **L3 — SAMPLE stamp** | **PASS** (site) / **not repeated per print page** | /sample top: "SAMPLE: fictional business, fictional data" (`app/sample/page.tsx:13`, live HTML); body: "This business is invented. The address, phone number, and website are fictional, and the findings are sample findings written to show the report format. Nothing on this page describes a real business." (lines 18–20); footer: "SAMPLE footer: this sample report is produced by DealNote for demonstration only." (line 97). Substantively the full L3 text (wording differs slightly from the draft — "This business is invented" instead of "Harbor & Pine Plumbing is invented"). Print: `@media print` in `app/globals.css:162` hides header/footer/`.no-print` but does **not** hide the stamp, so it prints on page 1 of a browser print-to-PDF; it is **not repeated on every printed page** (no print header). Server PDFs never carry the stamp because `isSample` is only true for the sample audit object and the PDF routes re-run a live audit (`lib/pdf-html.ts:132,185,278`). |
| **L4 — Audit-method note** (robots line) | **PASS** | Live /audit static HTML, under the URL box: "Public http or https addresses only. The audit reads the homepage and checks up to 10 internal links. It never submits forms, logs in, or bypasses a login page. If the site's robots.txt asks automated tools not to fetch the page, the audit will not run and no score will be given." (`app/audit/page.tsx:422`). Same sentence in /terms Acceptable Use (T3). |
| **L5 — Refund pointer** | **PARTIAL** | Landing FAQ "What if the report gets something wrong?": "Report a bad report within 14 days and we will replace it or refund it. Email murugan@drvelu.com with the report URL, the finding you say is wrong, and why. See the refund section in the terms." (live home HTML, `app/page.tsx:188`). **Gap:** the pricing card carries no refund pointer — `grep refund app/page.tsx` hits only the FAQ lines. Placement map asked for FAQ + pricing card. |
| **L6 — Outreach responsibility** | **PASS** | /templates top, live HTML: "You are responsible for your own outreach law. Only email people in line with the rules that apply to you and to them. See the sending checklist below. DealNote provides no cold SMS scripts. Do not send marketing texts to a prospect unless you already have their prior express written consent." (`app/templates/page.tsx:129`). /audit proposal section: same line at `app/audit/page.tsx:723` (renders with the result). /terms T4 carries the full paragraph. |
| **L7 — No-data-about-prospects** | **PASS** | Landing FAQ, live HTML: "No. The audit reads the public homepage only. Contact details in a report come only from what is visibly published on that page. There is no cold SMS in this product, and you are responsible for your own outreach law." Also in /terms ("Do not use the tool to collect personal data…"). |
| **L8 — Local-storage notice** | **PASS** (with render caveat) | Exact text in `app/audit/page.tsx:67` (`LOCAL_STORAGE_NOTICE`): "Your brand profile and outreach tracker are stored only in this browser's local storage. Nothing is sent to DealNote or anyone else. Clear them in your browser settings to delete them." Rendered under both the brand section (line 622) and the tracker section (line 944). **Caveat:** both render sites sit inside the `{displayed ? …}` block, so the notice is invisible on a fresh /audit visit until an audit result exists; it is therefore absent from the static served /audit HTML (0 hits for "Nothing is sent to DealNote" in live HTML). Same notice is also in /privacy (keys `dealnote-brand-v1` / `dealnote-proposals-v1` named). |
| **L9 — PDF footer** | **PARTIAL** | Footer content is complete and verbatim: "Prepared by [brand] on [run date] for [prospect URL]. Scores are DealNote's own measurements from this run, not Lighthouse or PageSpeed scores, and can vary between runs. This report checks the public homepage only. It does not estimate traffic, rankings, or lost revenue. No guarantee of client wins." (`lib/pdf-html.ts:68-74`, `footerLine`). **Gap: it renders once, at the end of the HTML, so it appears only on the LAST page of each PDF** — verified by per-page `pdftotext`: teardown 4 pages (footer only p.4), proposal 5 pages (footer only p.5). `page.pdf()` uses no `displayHeaderFooter` (`lib/pdf-html.ts:55-60`). Placement map requires the footer on every page. The same applies to the L1-in-PDF requirement, which rides on this footer. |

### Terms T1–T6 (live /terms, all present)

Verified verbatim in live `/terms` HTML: **T1** Refund policy (14 days from run date, replace-or-refund seller's choice, email `murugan@drvelu.com` with (1) report URL (2) finding (3) why, reply within 3 business days, exclusions for prospect-declined and unread reports, paid-feature-failure clause); **T2** Contact section (email only, no phone support in v1, 3-business-day aim); **T3** robots bullet in Acceptable Use; **T4** outreach paragraph (CAN-SPAM elements, CASL/PECR/Spam Act warning, no cold SMS, prior express written consent for texts); **T5** Data and privacy section; **T6** lifetime sentence ("Lifetime means the lifetime of the product…"). Bonus: 18+ / age-of-majority line present (P2-1 done early).

## 2. Refund promise — is it claimable now?

**Yes, by channel presence — with two caveats.**

- `murugan@drvelu.com` is present as a `mailto:` link in the footer of **all 6 live pages** (footer "Contact: murugan@drvelu.com"), in the landing FAQ refund answer, in /terms Refund policy + Contact section, and in /privacy (operator + log-deletion contact). It is also in the audit User-Agent string: `DealNote/1.0 (website teardown; contact murugan@drvelu.com)` (`app/api/audit/route.ts`).
- `docs/refund-log.md` exists, is committed on main (`3706d51`), and is current: "No refunds yet. No sales yet, so no refund requests exist." Rule, 3-business-day reply, and required request contents are recorded. It is maintained as an empty log, which is the correct state pre-sale.
- **Caveat 1 — no pre-filled mailto subject.** The research P0-2 minimum was a `mailto:` with pre-filled subject ("DealNote refund request — [report URL] — [date]"). All three live mailto links are bare `mailto:murugan@drvelu.com` (footer, /terms x2, FAQ). The three required items are stated in prose next to the links, so a buyer can still comply, but the one-click pre-fill is missing.
- **Caveat 2 — deliverability not re-proven this run.** No test email was sent (per task) and sandbox DNS refused MX lookups, so `murugan@drvelu.com` was not freshly proven to receive mail. The last proven delivery is the 20 Nov 2026 Zoho verification (test send/receive, MX/SPF/DKIM green) on record in MEMORY.md. If the parent wants a fresh proof, a single test email from the operator is the only way.

## 3. Phase 1 template content vs legal guardrails — NO VIOLATIONS FOUND

Checked `lib/templates.ts`, `app/templates/page.tsx`, `lib/pdf-html.ts`, served live `/templates` HTML, and the locally generated proposal PDF.

| Guardrail | Result |
|---|---|
| Blank `$____` prices only | **PASS.** `priceOrBlank` maps blank, `0`, `$0`, `$0.00`, `____`, and any non-numeric value to `$____` (`lib/templates.ts:124`). Zero `$[0-9]` figures anywhere in `lib/templates.ts` except comments explaining the blanking. Served live `/templates` HTML contains only `$49` (the product price, x3); the one `$6` hit was a false positive — the React Flight chunk id `"$6"`, not a price. Generated proposal PDF (dev key, Quick-Fix) shows `$____` on p.4. |
| No fake testimonials | **PASS.** `TESTIMONIAL_SLOT_TEXT` is an explicit placeholder: "[PAST PROJECT - Replace with a real project or delete this section] … Never invent a client, a quote, or a result." (`lib/templates.ts:99`). No testimonial text exists anywhere else. |
| No invented guarantees / dollar-loss figures | **PASS.** No "will double", "guarantee" (except "No guarantee of client wins"), or dollar-loss string in templates or the /templates page. Checklist on /templates states: "The findings quoted are the real findings from the audit, no invented figures, no invented dollar loss, no fake case studies." Proposal text uses the blank-formula wording "These issues may be turning away visitors" per the Phase 1 report. |
| Non-binding acceptance wording | **PASS.** Present in proposal text (`lib/templates.ts:87`: "This proposal is for discussion purposes. It is not a contract, and signing it does not create one. A separate agreement will be provided before work begins.") and in the generated proposal PDF (p.5, `pdftotext` confirms "not a contract"). 0 "sign below"/"signature" hits per Phase 1 report; re-confirmed no `signature` string in generated PDF text. |
| CAN-SPAM footer on every email incl. Nudge/Breakup | **PASS.** Single builder `buildEmailText` appends `canSpamFooter(brand)` to all 5 emails — Cold, Warm, Referral, Nudge, Breakup (`lib/templates.ts:281-288`, kinds at lines 180/202/223/244/262). Footer contains name/brand, postal address (or an explicit `[Add your postal address…]` placeholder + a visible "Your postal address is missing" warning on /templates when unset), phone/email/website, "This is an advertisement", and "reply with 'unsubscribe'… I will stop within 10 business days." Live /templates shows the full footer preview. |
| No cold SMS anywhere | **PASS.** Repo-wide grep for `sms|text message` returns only the "no cold SMS scripts" disclaimer lines (`app/templates/page.tsx`, `app/audit/page.tsx:723-725`, /terms). No SMS script, template, or instruction exists. |
| "Not legal advice" note on terms outline | **PASS.** Present in the proposal Terms section in text (`lib/templates.ts:395,410`: "This is not legal advice.") and in the PDF (`lib/pdf-html.ts:229,267`), plus "These templates are starting text you adapt, not legal advice" on /templates and the caption on /terms and /privacy ("This text is general information, not legal advice."). |
| 60-second checklist | **PASS**, live on /templates: subject-line honesty, footer completeness, real findings only, country-consent rule (US vs Canada/UK/EU/Australia), do-not-contact check, "You are sending email only. No SMS." |

## 4. Endpoints — local production server (all PASS)

Local server: fresh `npm run build` (exit 0) + `next start` 127.0.0.1:3105, no Polar env, dev key only. Server stopped after testing; port 3105 confirmed closed.

| Endpoint | Test | Result |
|---|---|---|
| `POST /api/audit` free, no key (example.com) | Teaser shape | **200.** Keys exactly: `teaser, url, fetchedAt, overallScore, overallGrade, categories, issues, totalIssues, message`. Score 45/F, **2 issues of 10 total**. **Note:** the teaser is NOT "score+grade+top 2 only" — it also returns all **6 category scores/grades** (`categories: [{key, score, grade}…]`) plus `fetchedAt` and `url`. It does NOT leak full findings, title, `couldNotCheck`, `brokenLinks`, or any other full-result field. By design (`teaserFor`, `app/api/audit/route.ts`); decide whether category scores in the free teaser are intended. |
| `POST /api/audit` robots disallow | `https://www.google.com/search?q=test` (Google robots.txt disallows `/search`) | **403**, exact message: "This site asks automated tools not to fetch this page (robots.txt). No score was given." |
| `POST /api/audit` rate limit | 6 free calls in one hour from one IP | Calls 1–5 → **200**; call 6 → **429** with `Retry-After` header and message "Free audits are limited to 5 per hour from one address. Try again later, or use a licence key for the full report." (`lib/ratelimit.ts`: in-memory per-instance map; note it resets on Vercel cold start and is not shared between instances — documented in the file as a throttle, not a billing control.) |
| `POST /api/audit` private URL | `http://127.0.0.1:9/admin` | **400**: "That address is not a public website. Paste a public business website URL." (input validation, before rate-limit counting) |
| `POST /api/checkout` no env | `{}` | **503** `{notConfigured: true, error: "Checkout is not configured yet. The $49 one-time licence is coming soon; the free preview still works."}` — never a fake success or URL. |
| `POST /api/pdf/teardown` no key | `{"url": "https://example.com"}` | **402**: "A licence key is required to download the PDF report. Buy DealNote ($49 one-time) to get one." |
| `POST /api/pdf/proposal` no key | same | **402**: "A licence key is required to download the PDF proposal. …" |
| `POST /api/pdf/teardown` bad key | `licenseKey: "wrong-key"` | **402** (invalid key mapped to payment-required, not 401). |
| `POST /api/pdf/teardown` dev key | valid dev key | **200**, valid PDF, 71,173 bytes, 4 pages. |
| `POST /api/pdf/proposal` dev key | Quick-Fix template | **200**, valid PDF, 86,571 bytes, 5 pages. `$____` present (p.4), non-binding wording present (p.5). |
| SSRF redirect re-validation | `tsx` unit: local server 302 → `http://127.0.0.1:9/` | **Refused**: throws "redirect to non-public address" (`fetchPublicWithRedirects` re-validates every hop with `isValidAuditUrl`; final URL re-validated again in `runFullAudit`). Direct fetch of a private URL through the bare helper returns 200 — expected, the helper is not the guard; the route validates input first (proven by the 400 above). |
| Robots parser | `tsx` unit on `isPathDisallowedByRobots` | `Disallow: /` on `/` → true; `Disallow: /search` on `/search` → true, on `/` → false; DealNote-specific group beats `*`; longer `Allow` beats `Disallow`. All correct. |

## 5. Tracker snippet — byte-verbatim, all 6 live pages: PASS

Exact string checked:
`<script defer src="https://www.ship-or-die.com/hackathon/verify.js" data-site="d40c7a78322ccb335a973aa331f31294d5cbddcb"></script>`

| Page | Exact-match count in raw served HTML |
|---|---|
| `/` | 1 |
| `/audit` | 1 |
| `/sample` | 1 |
| `/templates` | 1 |
| `/terms` | 1 |
| `/privacy` | 1 |

Additional `verify.js` occurrences in the raw HTML (2 per page, 4 on /privacy) are escaped copies of the same tag inside the React Flight (RSC) payload and the /privacy prose that names the tracker URL — not additional executed script tags. The executed tag count is 1 per page.

Side note: `GET /robots.txt` on the live site returns **404** (the app's 404 page, which itself carries the tracker + footer). DealNote has no robots.txt of its own. This is unrelated to the audit engine honouring *target* sites' robots.txt (§4, passing), but worth knowing if anyone checks the site's own crawler file.

## 6. LIVE endpoint tests — NOT PERFORMED, approval needed

The live POST checks (free teaser, robots 403, checkout 503, PDF 402s) were **not performed**. The exec run covering them required an approval that timed out, and every live `curl` POST in that run returned HTTP 000 (no connection made). Per instructions the unapproved part was not retried. **The parent agent needs to re-run or approve the live POST checks** (or accept the local results in §4, which exercise the identical code paths on the identical commit `19c3b65`, plus the live GET label checks in §1). No test purchase was attempted at any point, live or local.

## 7. Open gaps (all minor except the PDF footer placement)

1. **PDF footer only on the last page, not every page** (L1-in-PDF + L9). Fix: use Puppeteer's `displayHeaderFooter` with a header/footer template, or repeat the footer div per page. This is the one placement-map requirement that is structurally unmet.
2. **SAMPLE stamp not repeated on every printed page** (L3 print, P1-7). Same root cause as (1) for browser print-to-PDF; server PDFs never carry the stamp at all because `isSample` is always false on the PDF routes.
3. **No refund pointer on the landing pricing card** (L5). One line under the price fixes it.
4. **Landing hero lacks the "not Lighthouse, PageSpeed" sentence** (L1 short form). The sentence lives on /sample, /audit result, and the PDF footer; adding it to the hero `ScoreSummary` caption would close it.
5. **No pre-filled mailto subject on refund links** (P0-2 minimum). Add `?subject=DealNote refund request` to the FAQ/Terms/footer refund mailto.
6. **/audit L1/L6/L8 render only after a result exists.** By design (those sections only exist post-audit), but a fresh visitor sees no score disclaimer, outreach line, or storage notice until they run an audit. Consider showing L8 under the brand/tracker area unconditionally — the sections themselves are post-audit today.
7. **Free teaser includes all 6 category scores/grades** in addition to overall score/grade/top 2. Confirm this is intended; if the teaser should be score+grade+top-2 only, drop `categories` from `teaserFor`.
8. **/privacy describes Polar payments in the present tense** ("Payments are handled by Polar… Polar collects the buyer's name, email, card details…") while checkout is still 503-notConfigured. Add "(coming soon)" or equivalent until Polar is live.
9. **/privacy "Changes" section still says "including when the Ship or Die tracker is installed"** — the tracker IS installed (27 Nov 2026) and is disclosed two paragraphs above. Stale future-tense wording; one-word fix ("now installed").
10. **Rate limit is in-memory per Vercel instance** (documented in `lib/ratelimit.ts`). On serverless it resets on cold start and is not shared between instances. Acceptable as a throttle, not a billing control — but live 5/hour enforcement will be softer than the local test suggests.

## 8. Files

- This report: `docs/dealnote-loop2-legal-endpoints-2026-11-27.md` (not committed, per task)
- Evidence (ephemeral, not in repo): `/tmp/dnloop2/live_*.html`, `text_*.txt`, `local_teaser.json`, `local_teardown.pdf`, `local_proposal.pdf`, `local_build.log`, `ssrf_test.mjs`
