# DealNote Loop 2 Live Audit — 27 Nov 2026

**Product:** DealNote, white-label website teardown + proposal generator, $49 one-time.
**Live:** https://dealnote-blue.vercel.app — **Repo:** ~/workspace/ship-or-die-100k/teardown-generator
**Commit audited:** main `19c3b65` (merge of `dealnote-templates-phase1`, Phase 1 shipped on main).
**Scope:** report only. No code changed, no deploy, no payment work. `app/api/checkout`,
`app/api/webhook`, `lib/license.ts` not touched (read `lib/license.ts` only for the dev-key mechanism).
**Auditor:** Loop 2 subagent, 27 Nov 2026, ~13:42–14:30 PST (05:42–06:30 UTC).

## Verdict: NO-SHIP (for the 1 Dec launch as a paid product)

The code is in good shape locally: the build is clean, all 6 pages serve live, the free
and paid audits work locally with correct scores, all 8 Phase 1 features are present and
mostly working, and both PDFs render correctly locally. But three things block a launch
verdict:

1. **The live free audit could not be proven to work at all.** Two POSTs to the live
   `/api/audit` timed out (90 s, then 150 s, HTTP 000, zero bytes back). The free teaser
   is the top of the funnel; an unproven live POST path is not shippable.
2. **SSRF guard has real holes.** `169.254.169.254` (cloud metadata link-local) and
   IPv4-mapped IPv6 loopback (`[::ffff:127.0.0.1]`) both pass `isValidAuditUrl`.
   The fix is small, but it must land before strangers can point the audit fetcher
   at arbitrary addresses.
3. **Payment is still on hold** (pre-existing, NEEDS VELU). Nobody can buy, so no live
   licence key exists, so the live paid audit and live PDFs are unproven too.

If the parent re-verifies (1) from a real browser/network and (2) is fixed, this becomes
**ship with fixes** (the P1 list below). Nothing else in this audit is a launch-stopper
on its own.

## Readiness scores (0–10)

| Area | Score | Basis |
|---|---|---|
| Build | 9 | Clean twice; first run's `.next` was briefly incomplete (see §1) |
| Pages live (GET) | 10 | All 6 pages 200 locally and live, byte-identical |
| Free audit, local | 9 | Correct 45/F, teaser enforced; categories leak (P1-5) |
| Free audit, live | 0 | Not verified: timed out twice, no response |
| Paid audit, local | 9 | Correct full result, quota 1 used / 29 left |
| Phase 1 features | 8 | All 8 present; edit-loss bug (P1-1), 0-findings contradiction (P1-2) |
| PDFs, local | 9 | Both render, valid, brand applied; quota cost undisclosed (P1-6) |
| PDFs, live | 0 | Not verified: needs a real licence key (payment on hold) |
| Copy / honesty | 8 | Mostly honest; severity-order claim false (P1-3), screenshot promise (P2-7) |
| Scoring engine | 7 | Math verified against example.com; 3 scoring quirks (P2-1/2/3) + HEAD 405 (P1-4) |
| Security / SSRF | 5 | Redirect re-validation good; link-local + mapped-v6 holes (P0-2) |
| Paywall / quota | 6 | Teaser server-enforced; in-memory quota best-effort on Vercel |
| Visual / design | 9 | Clean, 0 px overflow everywhere, SAMPLE correct, no slop found |

## P0 — 3

### P0-1. Live free audit POST is unresponsive (core funnel unproven live)
- `POST https://dealnote-blue.vercel.app/api/audit {"url":"https://example.com"}`:
  attempt 1 timed out at 90 s (HTTP 000, 0 bytes); attempt 2 timed out at 150 s
  (HTTP 000, 0 bytes). The second attempt also hit a runtime approval timeout and
  was **not retried** after that, per the runtime instruction.
- Local equivalent completes in 3.2 s with the correct result, and live GETs are
  fast (~1.1 s), so this is specific to the live POST path (or to this VM's egress
  path to Vercel for POSTs). It is not proven to be a live defect — but it is
  equally not proven to work, and the free teaser is the product's front door.
- Unblocker: run the same free audit from a real browser/network and record
  status + body. If it works there, this P0 clears and the verdict flips.

### P0-2. SSRF guard allows link-local and IPv4-mapped loopback
Unit-tested `isValidAuditUrl` (`lib/audit.ts`) with `npx tsx`:
- `http://169.254.169.254/latest/meta-data/` → `{ok: true}` — ALLOWED.
- `http://[::ffff:127.0.0.1]/` → `{ok: true}` (normalised to `[::ffff:7f00:1]`) — ALLOWED.
- `http://100.64.0.1/` (CGNAT shared space) → `{ok: true}` — ALLOWED.
- Blocked correctly: `localhost`, `192.168.1.1`, `127.x` (including decimal
  `2130706433` and hex `0x7f000001`, which Node's URL parser normalises to
  `127.0.0.1`), `0.0.0.0`, `10.x`, `172.16–31.x`.
- The redirect re-validation in `fetchPublicWithRedirects` is good and uses the
  same blocklist, so fixing the blocklist fixes both paths. Fix: block
  `169.254.0.0/16`, `100.64.0.0/10`, `::ffff:0:0/96` mapped addresses, and ideally
  resolve-and-check the hostname (DNS rebinding is otherwise still open).

### P0-3. Payment still on hold — no live purchase path (pre-existing, NEEDS VELU)
- No Polar account/product, no live test purchase, no real licence key. The Buy
  button cannot be verified live in this audit (checkout was not probed, per the
  task's payment freeze). Home page honestly says "Teardown PDF and proposal PDF
  (coming with payment)" and the FAQ says "PDF downloads are coming with payment",
  so the site does not mis-sell — but a 1 Dec launch cannot happen until Velu
  resumes payment and a live $49 purchase + refund is proven end to end.

## P1 — 6

### P1-1. Ticking a finding wipes the buyer's edits to the fix list (REPRODUCED)
- `app/audit/page.tsx`, `toggleFinding`: every tick rebuilds `fixItems` from the
  selected findings (`proposalItemsFromIssues(...)`), discarding any edits.
- Reproduced in a real browser against the local production build: ran a paid
  audit on example.com (dev key), edited fix #1's title to `LOOP2 BROWSER EDIT`
  (confirmed in the form), then ticked finding #4. Result: fix list went 3 → 4
  items, but the edited title reverted to `No tap-to-call link`; the downloaded
  proposal PDF (3 pages, 66,534 bytes) contains `No H1 heading` (finding #4) and
  **0** occurrences of `LOOP2 BROWSER EDIT`.
- The UI caption even documents it ("Changing the selected findings above rebuilds
  this list"), but documenting data loss is not fixing it. Fix: merge — keep
  edited items, add/remove only the item for the toggled finding.

### P1-2. 0-findings handling is UI-card only, and the generated text contradicts itself
- The "This site is in good shape" card says "no fix proposal is generated for
  this site", but the Proposal generator section below it renders unconditionally
  (line 721, no `issues.length` gate), and `buildProposalText` / the proposal PDF
  still emit a full Redesign Proposal for a clean site.
- Verified at unit level (`npx tsx`, 0 issues): the text contains the good-shape
  note and the non-binding wording, no signature lines, `priceOrBlank("0")` →
  `$____` — but the cover line still reads `I reviewed your website and found 7
  quick wins.` (the `DEFAULT_BRAND.introLine` hardcode) directly above
  `No material issues were found on the homepage`. In the UI flow after a real
  audit the intro line is auto-corrected to the real count — which for a clean
  site would read `found 0 quick wins`, still contradictory.
- No live 0-issue site was available to test the UI path end to end; this is a
  code + unit finding. Fix: gate the generator/PDF on 0 issues (Retainer Opener
  only, as the card promises) and drop the hardcoded count from the intro line.

### P1-3. "Findings are ordered by severity: Critical first" is false
- `/audit` copy says findings are ordered by severity, Critical first.
  `IssueList` (`components/audit-ui.tsx:187`) renders in array order, and
  `analyzePage` appends issues in category order (speed, mobile, SEO, technical,
  conversion, trust), not severity order.
- example.com proves it: i1 `No tap-to-call link` (Fix soon), i2 `Page title…`
  (Fix soon), i3 `Meta description is missing` (Critical) — Critical is third,
  and i7 `No phone number visible` (Critical) is seventh. Fix: sort by severity
  or reword the copy.

### P1-4. A link whose HEAD returns 405 is flagged as a broken link (false Critical)
- `app/api/audit/route.ts` broken-link check: HEAD first; `if (head.status >= 400)
  return {broken}`. The GET fallback only runs on a network exception, not on a
  4xx HEAD response. Many servers legitimately return 405 for HEAD, so a working
  link can produce a Critical "N checked links failed" finding. Fix: retry with
  GET on 405 (and 403/501) before calling a link broken.

### P1-5. The free teaser leaks more than the advertised "score, grade, top 2 findings"
- `teaserFor` returns `overallScore`, `overallGrade`, `issues.slice(0, 2)` — plus
  the full `categories` array (all 6 category scores + grades) and `totalIssues`.
- example.com free teaser (local, 200, 3.2 s): `teaser: true, 45/F, totalIssues:
  10`, 2 issues, and categories Speed 100/A, Mobile 50/F, SEO 25/F, Technical
  50/F, Conversion 0/F, Trust 33/F. The `/audit` page copy ("The free result shows
  the overall score, grade, and top 2 findings") does not mention category scores.
  Either the copy or the payload should change; the leak is small, the mismatch
  is the issue. (No title, no findings 3–10, no proposal — the paywall itself
  holds.)

### P1-6. Every PDF download re-runs the audit and burns one of the 30 monthly audits
- Both PDF routes call `runPaidAudit`, which consumes quota on success — on top
  of the `/api/audit` call that produced the report. One workflow (audit +
  teardown PDF + proposal PDF) costs 3 audits. Nothing on the site discloses
  this. Fix: disclose it, or reuse the already-paid audit result for the PDFs.

## P2 — 9

1. **Technical score forced to 0 for any HTTP site** (`lib/analyze.ts`:
   `https ? scoreFromChecks(...) : 0`). A site with canonical + sitemap + no
   broken links still scores Technical 0/F for lacking HTTPS, while every other
   category reports its real pass rate.
2. **Speed score silently penalises alt text.** Speed has 3 checks; the third
   (alt text) never raises a speed issue, but a site with missing alt text scores
   at most 2/3 on Speed while the issue is reported under SEO. Double-counts one
   defect across two categories.
3. **"Page weight" is HTML bytes only.** `pageMB = Buffer.byteLength(html)` — no
   images, scripts, or stylesheets are fetched — yet the finding text says
   "Homepage HTML and page weight measured about X MB". Understates real weight.
4. **Robots parser ignores wildcards.** `isPathDisallowedByRobots` uses
   `startsWith` only: `Disallow: /*.pdf$` on `/x.pdf` returns `false` (unit-tested).
   Plain `Disallow: /` is honoured. Sites whose robots.txt relies on wildcards
   are audited when they asked not to be.
5. **robots.txt / sitemap fetches follow redirects without re-validation.**
   `fetchWithTimeout` uses `redirect: "follow"`, unlike the main fetch, which
   re-validates every hop. Only robots/sitemap text is consumed, so impact is
   low, but the "every hop re-validated" claim does not cover these two fetches.
6. **Free rate limit trusts client-supplied `X-Forwarded-For`.**
   `getClientIp` takes the first XFF entry; anyone can rotate it and bypass the
   5/hour free limit. Also, the limit is consumed before the audit runs, so a
   robots-blocked (403) or failed fetch still burns one of the 5.
7. **`/audit` promises screenshots that do not exist.** "Paid reports will include
   a mobile and desktop screenshot of the homepage. For now, the findings above
   are drawn from the fetched page itself." Screenshot capture is not built in v1.
   Reword until it ships.
8. **No `robots.txt` / sitemap for DealNote itself** (live `/robots.txt` → 404),
   and **`/sample` still omits 4 of the 10 template sections** (Scope, Timeline,
   About, Terms — headings present: What we found, All findings, What we would
   fix, Investment). The sample gap is the pre-existing Neon finding, still open.
9. **Default brand placeholders can reach a real PDF via the API.**
   `DEFAULT_BRAND` ships `Alex Rivera`, `hello@yourstudio.example`,
   `(555) 010-4471`, `https://cal.com/yourstudio/intro`, and the intro line
   `I reviewed your website and found 7 quick wins.` A direct
   `/api/pdf/proposal` call with no brand (as I ran) produces a PDF stating
   "found 7 quick wins" for a 10-issue audit. The browser UI auto-corrects the
   intro line after a real audit; the API does not. Also note: the dev licence
   key value `dev-test-key-123` is printed in
   `docs/dealnote-templates-phase1-2026-11-27.md` in the repo — harmless while it
   is local-only, but it must never be set as `DEALNOTE_DEV_LICENSE_KEY` on
   Vercel.

## What passed (verified)

- **Build:** `npm run build` clean on Next.js 14.2.35, zero type errors, 6 pages +
  6 API routes. (Note: the first build in this run reported success but `.next`
  briefly lacked `BUILD_ID` when checked; a rebuild produced a complete
  `.next` with `BUILD_ID`. Likely a filesystem-sync delay, not a code issue.)
- **Pages, local + live:** all 6 (`/`, `/audit`, `/sample`, `/templates`,
  `/terms`, `/privacy`) HTTP 200 on both, byte-identical sizes
  (e.g. home 47,389 B, `/sample` 45,027 B). Live HTML matches the local build of
  main `19c3b65` (build IDs differ only because Vercel built separately).
- **Free audit, local:** example.com → 200, `teaser: true`, **45/F, 10 issues
  total, exactly 2 issues returned** (i1 No tap-to-call, i2 Page title too
  short/long). No title field. Keys: categories, fetchedAt, issues, message,
  overallGrade, overallScore, teaser, totalIssues, url.
- **Paid audit, local (dev key `dev-test-key-123` from the repo docs, via env
  only):** example.com → 200, **45/F, 10 issues**, title `Example Domain`,
  `license: {auditsUsed: 1, auditsRemaining: 29, auditsPerMonth: 30}`.
  Scoring math independently rechecked: category scores
  100/50/25/50/0/33 weighted 20/15/20/15/15/15 → 44.95 → 45. Matches.
- **Phase 1 features, browser-tested locally (Puppeteer + cached Chromium):**
  10 finding checkboxes, top 3 checked by default; ticking #4 raises the fix
  list 3 → 4 items; About toggle off by default, Terms on; section toggles
  present; postal address field saves to localStorage (`dealnote-brand-v1`) and
  auto-fills into the `/templates` CAN-SPAM footer (verified: `1 Loop2 Way…`
  appears, warning banner disappears, findings fill with real titles);
  `/templates` fresh-browser warning banner present; copy of a template with
  `[finding 1]` placeholders is **refused** with the warning
  "This text still has [finding 1] placeholders in it…"; proposal PDF downloads
  from the browser ("Proposal PDF downloaded.", 66,534 bytes, 3 pages).
- **PDFs, local (curl, dev key):** teardown PDF 200, 70,990 B, valid `%PDF-1.4`,
  4 pages, brand name + score present; proposal PDF (Quick-Fix, edited fix item,
  selected findings i1+i4 only, price `"0"`, brand colour `#155E75`) 200,
  46,249 B, 2 pages; `pdftotext` confirms edited fix title present, only i1+i4
  findings present (i3 Meta description absent), `$____` for the $0 price,
  non-binding wording present, 0 signature lines, brand name present.
  Teardown PDF with no key → 402 with a clear licence-required error.
- **0-findings text builder:** unit-verified via `tsx` — good-shape note,
  non-binding wording, no signature lines, `$____` prices (see P1-2 for the
  contradiction that remains).
- **Copy checks on live HTML (all 6 pages):** headline
  "3 proposals + 5 emails + editable blocks" present on `/templates`; all 8
  template names present (Quick-Fix Pitch, Redesign Proposal, Retainer Opener,
  Cold Intro, Warm Intro, Referral Intro, Nudge, Breakup); 0 "verified"; no
  future dates (no 2027/2028); 0 middle dots in visible copy; heading order
  clean (no skipped levels in static HTML); no AI-slop markers found
  (no "leverage/elevate/seamless/cutting-edge/best-in-class/Dear Business Owner",
  no repeating uppercase eyebrows — the only all-caps runs are CAN-SPAM, HTTP(S),
  SAMPLE, WCAG, UK/EU). The only em dashes anywhere are the single known
  BuyButton string `Buy DealNote — $49 one-time` (frozen payment component,
  already documented). SAMPLE stamps: 2 visible on `/sample` (top + footer, as
  designed), 1 each on home and `/audit`; the raw-HTML count of 4 on `/sample`
  is the RSC payload duplicating the same 2 stamps. OG tags present live,
  `og.png` 200 (1200×630 per prior verification; not re-measured here).
- **Robots handling (unit):** `Disallow: /` correctly refuses; a missing or
  unreadable robots.txt correctly proceeds.
- **Quota/rate-limit code (read):** server-side paywall holds — the full result
  is never sent without a valid key; keys are SHA-256 hashed, never stored raw;
  dev-key comparison is timing-safe; quota consumes only on successful audit.

## Screenshots (live site, real browser)

12 files, desktop 1280 + mobile 390, full page, Puppeteer + cached
chrome-headless-shell 158 via the workspace egress forward proxy
(`127.0.0.1:8888`). **Horizontal overflow: 0 px on all 6 pages at both widths**
(`scrollWidth == innerWidth` measured in the browser). Visually checked: home,
`/templates` (desktop + mobile), `/audit`, `/sample` — clean white/slate +
teal, no defects seen. (Note: the full Chrome binary in the puppeteer cache lost
its execute bit, so headless-shell was used; the sticky-header repeat in
full-page captures is a screenshot artifact, as noted in prior rounds.)

- `docs/screenshots/loop2-home-1280.png`, `loop2-home-390.png`
- `docs/screenshots/loop2-audit-1280.png`, `loop2-audit-390.png`
- `docs/screenshots/loop2-sample-1280.png`, `loop2-sample-390.png`
- `docs/screenshots/loop2-templates-1280.png`, `loop2-templates-390.png`
- `docs/screenshots/loop2-terms-1280.png`, `loop2-terms-390.png`
- `docs/screenshots/loop2-privacy-1280.png`, `loop2-privacy-390.png`

## What I could NOT verify

- **Live free audit** — timed out twice (90 s, 150 s, HTTP 000); second attempt
  also hit a runtime approval timeout and was not retried per that instruction.
- **Live paid audit / live PDFs** — need a real licence key; payment is on hold
  and the dev key is local-only by design.
- **Live checkout** — not probed (payment freeze in the task).
- **PDF generation on Vercel serverless** — `@sparticuz/chromium` rendering
  proven locally only.
- **0-findings UI path live** — no public 0-issue site was available; verified at
  unit level and by reading the card/generator code (which disagree — see P1-2).
- **Quota behaviour on Vercel** — in-memory store resets on cold start and is
  not shared between instances (documented in `lib/entitlements.ts`); the
  30/month limit is best-effort/permissive live, and webhook dedupe shares the
  same limit. Not re-proven here.
- **OG image on opengraph.xyz** — not tested (same as prior rounds).
- **TrustMRR / Ship or Die ranking for a $0-MRR one-time product** — out of
  scope for this audit; still open from the site-whole report.

## Files

- This report: `docs/dealnote-loop2-live-audit-2026-11-27.md` (not committed).
- Screenshots: `docs/screenshots/loop2-*.png` (12 files, not committed).
- No code was changed. Local test server (port 3103) and the egress forward
  proxy started for this audit were stopped afterwards. Dev licence key used
  was `dev-test-key-123`, the documented throwaway from the Phase 1 report,
  passed via env only, never committed.
