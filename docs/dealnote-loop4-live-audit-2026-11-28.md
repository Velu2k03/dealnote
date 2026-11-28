# DealNote Loop 4 Audit (stream 1: live site + code) — 28 Nov 2026

**Product:** DealNote, white-label website teardown + proposal generator, $49 one-time.
**Live:** https://dealnote-blue.vercel.app — **Repo:** ~/workspace/ship-or-die-100k/teardown-generator
**Commit audited:** main `d331073` (Loop 3 merge `1ce3e47` + report commit; no code change since the Loop 3 fix merge).
**Auditor:** Loop 4 stream-1 subagent, 28 Nov 2026, ~14:20–16:40 Manila.
**Scope:** report only. No code changed, no deploy, no commit, no payment work
(`app/api/checkout`, `app/api/webhook`, `lib/license.ts`, BuyButton not modified;
no Polar/Lemon Squeezy/TrustMRR/Stripe account or product created; no test purchase).
**Live POST checks NOT done** (free audit teaser, checkout 503, PDF 402 live) — needs
Velu's approval, timed out twice before. Not retried.
**Prior docs read first:** `docs/dealnote-loop3-audit-2026-11-28.md`,
`docs/dealnote-loop3-fix-report-2026-11-28.md`.

## Verdict: NO-SHIP (as a paid product) — 1 new P1 in code, 0 new P0

All four Loop 3 P1s are verified fixed, and eleven of the thirteen Loop 3 P2s are
verified fixed (the two remainders are the known carried items: PageSpeed
unmeasured, BuyButton em dash). The local funnel is fully proven end to end:
free audit, paid audit, both PDFs, rate-limit refund, brand 400, edit-loss in a
real browser.

The verdict is NO-SHIP for two reasons, one old and one new:

1. **The same two carried P0s as Loops 2–3, both NEEDS VELU, not code** (live free
   audit POST still unproven; payment still on hold, no live purchase path).
2. **One NEW P1 in code: the desktop header is visibly broken on every page.**
   At any viewport wider than 640px the nav list renders as a black-bordered box
   pinned to the top-left corner of the viewport, covering the DealNote wordmark.
   It was present but unreported in Loops 2–3 (it is visible in Loop 3's own
   `loop3-live-home-1280.png` and `loop3fix-home-1280.png`, top strip). Mobile
   (390px) is unaffected and correct.

Code-side, this round is **SHIP WITH FIXES**: 0 new P0, 1 new P1, 6 P2
(2 carried, 1 new nit, 3 carried open items). The P1 is a one-component fix
(the `popover` attribute must not share an element with the desktop inline nav);
nothing else in the funnel blocks a paid launch once the two Velu-gated P0s clear.

## Readiness scores (0–10; Loop 3 in brackets)

| Area | Score | Basis |
|---|---|---|
| Build | 9 [10] | Clean on retry, Next.js 14.2.35, zero type errors, BUILD_ID `nidhlwOCLto1aSRW0rsKC`; first attempt failed on a stale `.next/export` (ENOTEMPTY), second on a transient `next/font` Google fetch — both environmental, see §Build notes |
| Pages live (GET) | 10 [10] | All 6 pages 200 live + local, byte-identical sizes to the Loop 3 live build |
| Free audit, local | 10 [10] | 45/F, teaser keys exact, 3.9 s |
| Free audit, live | 0 [0] | Not verified (NEEDS VELU) |
| Paid audit, local | 10 [10] | 45/F, 10 issues severity-sorted, quota 1 used / 29 left |
| Phase 1 features | 10 [9] | All 8 present; edit-loss, finding toggles, section toggles, `?url=` prefill + autofocus all runtime-verified in a real browser this round |
| PDFs, local | 10 [9] | Both valid A4, footer exactly 1x per page; brand 400; 0 placeholder leaks; quickfix 4 pp / 1x `$____` by design, redesign 5 pp / 3x `$____` |
| PDFs, live | 0 [0] | Not verified: needs a real licence key (payment on hold) |
| Copy / honesty | 9 [9] | 0 "verified", 0 future dates, 0 invented figures; 2 alternate email subjects run 7 words (new nit, P2-3) |
| Scoring engine | 10 [9] | Weighted math re-verified by hand against example.com (44.95 → 45) |
| Security / SSRF | 9 [9] | `test-ssrf.ts` 29/29 pass; redirect re-validation in code; DNS rebinding still theoretically open |
| Paywall / quota | 10 [8] | Teaser server-enforced; rate-limit refund behavior-proven; `x-real-ip` first; PDF cache reuse proven (0 burn) |
| Visual / design | 7 [10] | 0 px overflow on all 24 captures; desktop header broken on all pages (P1-1); mobile header correct |
| Slop (Briskly/Jev) | not re-measured | No new slop observed; only the carried BuyButton em dash remains |

## P0 — 0 new (2 carried, NEEDS VELU)

### P0-1 (carried). Live free audit POST unproven
- Same as Loops 2–3. Not retried this round per task (needs Velu's approval; timed out
  twice before). Local equivalent re-proven this round: 200, 45/F, exact teaser keys,
  ~3.9 s. Live GETs are byte-identical to the local build.
- Unblocker: run the same free audit from a real browser/network and record status + body.

### P0-2 (carried). Payment on hold, no live purchase path
- Unchanged by design. Checkout POST locally → 503 `notConfigured`, never a fake
  success. Site honestly says "Teardown PDF and proposal PDF (coming with payment)".
- Unblocker: Velu resumes payment, then a live $49 purchase + refund is proven end to end.

## P1 — 1 (NEW)

### P1-1 (NEW, pre-existing since the popover header, missed in Loops 2–3). Desktop header nav renders as a detached black-bordered box covering the wordmark
- **What a buyer sees:** at 1280px on every page, the four nav links
  ("Run an audit / Sample report / Proposal templates / Terms") sit inside a
  black-bordered white box pinned to the top-left corner of the viewport, and the
  DealNote wordmark + logo underneath it are hidden (only the bottom edge of the
  logo peeks out). Screenshots: `docs/screenshots/loop4-home-1280.png`,
  `loop4-templates-1280.png`, `loop4-header-1280.png` (viewport-only, all live).
  At 390px the header is correct (wordmark + Menu button, one row):
  `docs/screenshots/loop4-header-390.png`.
- **Measured, live, 1280px:** `#site-menu` bounding rect `{x: 0, y: 0, w: 476, h: 32}`,
  `display: flex`, `:popover-open` **false**, `offsetParent` null. Wordmark rect
  `{x: 100, y: 12, w: 124, h: 32}` — directly underneath the box. Computed style
  on `#site-menu`: `position: fixed; top/left/right/bottom: 0; border: 3px solid
  rgb(0, 0, 0)` — the browser's own popover stylesheet. The mobile menu still
  works (clicking Menu at 390px opens the popover, `:popover-open` true).
- **Root cause:** `components/site.tsx:33` puts `popover="auto"` on the same `<ul>`
  that `app/globals.css:132` turns into the desktop inline nav
  (`.site-menu { display: flex; ... }`). The author `display: flex` overrides the
  user-agent `[popover]:not(:popover-open) { display: none }` rule, so the closed
  popover is painted — and the remaining user-agent popover styles
  (`position: fixed; inset: 0; width: fit-content; 3px border`) place it in the
  top layer at the viewport corner instead of inside the `<nav>`. A popover
  element cannot be restyled into an inline nav with plain `display`.
- **History:** the defect is visible in Loop 3's own captures — the top 80px of
  `docs/screenshots/loop3-live-home-1280.png` (5 links incl. Privacy) and
  `docs/screenshots/loop3fix-home-1280.png` (4 links) show the identical box.
  Loop 3 visually checked home mobile, /audit mobile and /templates desktop body,
  not the desktop header strip, so it went unreported.
- **Reproduction:** open https://dealnote-blue.vercel.app/ in desktop Chrome at
  any width > 640px; no interaction needed — the box is there on first paint.
  Also reproduced against the local production build (identical screenshots).
- **Fix (suggested, not applied):** do not share one element between the two
  modes — e.g. render the desktop list without the `popover` attribute (or add
  the attribute only under 640px via a matchMedia effect), and keep the popover
  only for the mobile menu; or guard the desktop rule with
  `.site-menu:not(:popover-open)` handling that keeps a closed popover hidden.
  Verify with a viewport-only (not full-page) desktop screenshot after the fix.
- **Severity note:** P1, not P0 — the four links inside the box are clickable and
  the rest of every page works, but the brand wordmark / home link is unclickable
  at desktop width and the first thing a buyer sees is a broken header.

## P2 — 6

1. **BuyButton em dash (carried, Loop 3 P2-13).** `components/audit-ui.tsx:55`:
   "Buy DealNote — $49 one-time", rendered twice per page (content + footer);
   the only em dash in live visible text. The second em dash in that file (`:19`,
   checkout error message) never renders live. Fix when the payment freeze lifts.
2. **R8 load budget still unmeasured (carried, Loop 3 P2-9).** No PageSpeed
   Insights run this round (no API key; anonymous quota 429 in Loop 3). Live home
   curl is fast; LCP on a mid-range phone is unknown.
3. **(NEW) Two alternate email subjects run 7 words vs the under-6-words rule.**
   Unit-measured (`scripts/loop4-unit-check.ts`, since deleted after the run):
   all 8 first subjects are ≤ 6 words (cold 5, warm 6, referral 6, day3 3, day7 4,
   breakup 4, postcall 5, postproposal 3), but two *second* subjects exceed it:
   `lib/templates.ts:318` day7 "Is this on your list this month?" (7 words) and
   `:354` postcall "Following up on our call - [Business].com" (7 words counting
   the dash token, 6 without). Fix: trim both alternates to ≤ 6 words.
4. **DNS rebinding still theoretically open (carried).** SSRF guard is
   blocklist-based; no `dns.lookup`/`resolve` anywhere in `lib/` or `app/`, so a
   hostname that resolves to a private IP after validation is not re-checked.
   Unit suite covers literal/decimal/hex/mapped forms (29/29); a rebinding
   hostname is the remaining theoretical hole.
5. **Quota enforcement is best-effort until Upstash KV is wired (carried).**
   In-memory fallback is per-instance; `/terms` discloses this honestly
   ("the count is durable once the Upstash Redis store is configured; until then
   it may reset when the hosting restarts"). Live 30/month enforcement is
   best-effort. No code change in this round either way; needs a KV account.
6. **Legal / privacy open items (carried, Loop 3 fix-report §Still open 5).**
   No legal review of the terms (governing law, liability, Business Opportunity
   Rule); `/privacy` still carries no Vercel log-retention number ("Retention
   follows Vercel's current plan"); no custom domain bought. None blocks the
   funnel, all need Velu / a reviewer, not a code fix.

## Loop 3 P1s — all 4 verified fixed

| # | Loop 3 finding | Loop 4 verification |
|---|---|---|
| P1-1 | Default brand placeholders reached real PDFs | `lib/audit.ts:331-343` now ships `[Your studio]` / `[Your name]` / `[your email]`, phone/website/call-link blank. Both PDF routes return **400** with the fill-in message when brand is default (re-proven this round); with a real brand both return 200 and `pdftotext` shows **0** hits for Alex Rivera / yourstudio / 555 / cal.com. `brandValidationError` at `lib/audit.ts:361`, enforced at `app/api/pdf/teardown/route.ts:68` and `app/api/pdf/proposal/route.ts:143`. |
| P1-2 | Rate limit consumed on failed fetches; XFF trusted | Behavior-proven this round: free 200, robots 403, then 4 more free 200, 6th call **429** — the 403 did not burn one of the 5. `refundFreeRateLimit` (`lib/ratelimit.ts:107`) + `getClientIp` prefers `x-real-ip` (`lib/ratelimit.ts:42-50`). Private-URL 400 after the 429 still returns 400 (validation precedes the limit check). |
| P1-3 | /privacy described Polar in the present tense | Live /privacy: "Payments are coming soon and will be handled by Polar… No payment is taken today." Future tense throughout. |
| P1-4 | /audit card said "Six structurally different documents" | `app/audit/page.tsx:765` now "Eight structurally different documents"; confirmed rendered in a real browser after a paid audit. 0 other stale counts in `app/` + `components/` + `lib/`. |

## Loop 3 P2s — 11 of 13 verified fixed

Fixed and re-verified: PDF last-page footer duplication (footer exactly 1x per
page on both PDFs, per-page `pdftotext`); cold subject 8 words + hardcoded "3"
(cold subjects now 5/5/4 words, body de-counted); fake "Re:" subjects (day3 →
"Your website review", postproposal → "Your website proposal"; the one remaining
"Re:" hit in live /templates text is the checklist sentence itself, which is now
true); header 5 links → 4 (`components/site.tsx:5-9`, Privacy footer-only);
default template Redesign → Quick-Fix (`app/audit/page.tsx:90`, confirmed as the
checked radio in a real browser); "See proposal templates" → "Open the proposal
templates page" (`app/audit/page.tsx:966`); L8 notice only after a result (now
renders in the form card, `app/audit/page.tsx:466`; confirmed present on a fresh
/audit visit in a real browser); "Last updated 27 Nov 2026" stale (footer, /terms,
/privacy all say 28 Nov 2026; sitemap `lastmod` 2026-11-28); hero input + autofocus
(hero `<form method="get" action="/audit">` with `name="url"` in live home HTML;
`/audit?url=` prefills and `#audit-url` is `document.activeElement` in a real
browser); Day 3 email 49 words (body-only now **51** words; all 8 bodies 51–84
words); orphaned `.steps-grid` CSS deleted.
Carried: P2-9 PageSpeed (P2-2 above) and P2-13 BuyButton em dash (P2-1 above).

## What passed (verified this round)

- **Build:** `npm run build` clean on retry, Next.js 14.2.35, zero type errors,
  6 pages + 6 API routes + `/robots.txt` + `/sitemap.xml`, BUILD_ID
  `nidhlwOCLto1aSRW0rsKC`. See §Build notes for the two failed first attempts.
- **Pages live + local:** all 6 pages 200 on both; sizes **byte-identical** to the
  Loop 3 live build (home 49,769 B; /audit 17,788 B; /sample 52,096 B;
  /templates 38,747 B; /terms 26,419 B; /privacy 22,494 B). `/robots.txt` 200
  (78 B, `Allow: /` + sitemap line), `/sitemap.xml` 200 (1,098 B, all 6 URLs,
  lastmod 2026-11-28).
- **Tracker:** data-site `d40c7a78322ccb335a973aa331f31294d5cbddcb` byte-present on
  all 6 live pages — 2 raw hits per page (1 script tag + 1 escaped copy inside
  the RSC payload), same as prior rounds.
- **Free audit, local:** 200 in ~3.9 s, **45/F**, teaser keys **exactly**
  `fetchedAt, issues, message, overallGrade, overallScore, teaser, url`,
  2 issues, both Critical, severity order holds.
- **Robots 403:** `google.com/search` → 403 with the exact "asks automated tools
  not to fetch this page" message. Robots are fetched before the homepage
  (`app/api/audit/route.ts:229-236`); parser unit 6/6 in Loop 3, unchanged code.
  Private URL `169.254.169.254` → 400. Checkout `{}` → 503 `notConfigured`.
  PDF teardown/proposal with no key → 402.
- **Rate limit:** 5 successful free audits then 429 with the limit message; the
  interleaved robots 403 was refunded (see P1-2 row above).
- **SSRF:** `npx tsx scripts/test-ssrf.ts` → **29/29 pass** (23 blocked, 6
  allowed), including 169.254/16, 100.64/10, `::ffff:`-mapped loopback/private,
  decimal `2130706433` and hex `0x7f000001` loopback, localhost, all private
  ranges. Redirect re-validation present in code.
- **Paid audit, local (dev key via env only):** 200 in ~1.9 s, **45/F, 10 issues**,
  severity order Critical ×2, Fix soon ×5, Nice to have ×3; `license:
  {auditsUsed: 1, auditsRemaining: 29, auditsPerMonth: 30}`; no `teaser` key in
  the paid payload. Category scores Speed 100/A, Mobile 50/F, SEO 25/F,
  Technical 50/F, Conversion 0/F, Trust 33/F — weighted 20/15/20/15/15/15 →
  20 + 7.5 + 5 + 7.5 + 0 + 4.95 = 44.95 → **45. Matches.**
- **Quota cache reuse:** 2nd paid audit after both PDFs showed 2 used / 28 left
  — the 2 PDFs consumed 0 audits (same numbers as Loop 3).
- **PDFs, local (dev key + real brand):** teardown 200, 83,264 B, valid PDF 1.4,
  **4 pages A4**; proposal Quick-Fix 200, 86,649 B, **4 pages A4**; proposal
  Redesign 200, 99,360 B, **5 pages A4**. Footer present **exactly 1x** on every
  page of all three (per-page `pdftotext`, brand-name hit count = 1 per page).
  0 placeholder hits in any PDF. Teardown footer text confirms the lab-score
  disclaimer + "Page N of N". Proposal: "not a contract" present, `$____` ×1 on
  Quick-Fix (single Essential tier, by design — `lib/pdf-html.ts:267`) and ×3 on
  Redesign (three tiers, `:270`). 0 hits for "found 7" / "found 0".
- **Phase 1 features, runtime-verified in a real browser** (local production
  build, script since deleted): `/audit?url=https://example.com` prefills the URL
  field and `#audit-url` is focused; licence-key paid audit returns Findings (10)
  at 45/F; **edit-loss: edited fix #1 title to `LOOP4 BROWSER EDIT`, kept**;
  ticking finding i4 moves fix items 3 → 4 and checked findings 3 → 4;
  Quick-Fix is the default checked template; "Eight structurally different
  documents" card renders; section toggles flip (5 → first unchecked, rest
  unchanged); L8 storage notice visible on a fresh visit. Result screenshot:
  `docs/screenshots/loop4-local-audit-result-1280.png`.
- **0-findings (unit):** `buildProposalText` with 0 issues → good-shape note
  present, no "found 0" / "found 7". Proposal PDF route forces
  `template=retainer` on 0 issues (`app/api/pdf/proposal/route.ts:154`).
- **Emails (unit):** 8 proposals + 8 emails; all 8 first subjects ≤ 6 words;
  body-only word counts cold 84, warm 55, referral 64, day3 **51**, day7 65,
  breakup 57, postcall 61, postproposal 56 — all clear the 50-word floor.
  Non-binding wording present in proposal text; prices blank `$____` only.
- **Screenshots:** 25 files — live 12 + local 12 + 1 audit-result, desktop 1280
  + mobile 390, **0 px horizontal overflow on all 24** (measured
  `scrollWidth == clientWidth` in-browser). `docs/screenshots/loop4-*.png`,
  `docs/screenshots/loop4-local-*.png`. Plus viewport-only header probes
  `loop4-header-1280.png` / `loop4-header-390.png`. Script:
  `scripts/shot-loop4.mjs` (puppeteer-core + cached chrome-headless-shell,
  Kane egress proxy `127.0.0.1:8888` + `--ignore-certificate-errors` for live).
  Visually checked: home desktop + mobile, /templates desktop, audit result.
- **Copy / honesty (live visible text, all 6 pages):** 0 "verified", 0 future
  dates (2027/2028), 0 "cheapest", 0 "Most clients pick", 0 "Six". Dollar
  figures only $49 / $39 (named SEOptimer comparator, dated 27 Nov 2026) /
  $1.63 per audit; "$100" hit is "$100K Hackathon" in /privacy. "found 7" on
  /sample is "The audit found 7 issues on the homepage" (the sample's own true
  count). /sample has all 10 template sections (Scope, Timeline, About, Terms).
  /templates shows "8 proposals + 8 emails". Exactly one `<h1>` per page
  (Loop 3, unchanged pages). /privacy "coming soon and will be handled by Polar"
  present; "No payment is taken today" present.
- **Header links:** 4 in the header nav (Run an audit / Sample report / Proposal
  templates / Terms); Privacy in the footer only. (Rendering of those 4 links at
  desktop width is P1-1.)

## Build notes (environmental, not code defects)

1. First `npm run build` failed with `ENOTEMPTY: rmdir '.next/export'` — a stale
   `.next` directory left by Loop 3 (whose test server was still bound to port
   3105 when this round started). `rm -rf .next` cleared it; the directory is
   git-ignored build output, no source was touched.
2. The rebuild then failed in `next/font` (`Cannot read properties of null
   (reading '1')` fetching the Inter stylesheet from Google Fonts). A retry
   ~10 minutes later built clean; `fonts.googleapis.com` returned 200 in between.
   Transient network flakiness to Google Fonts, not a code issue. Note for the
   fix round: if the build ever fails in `next/font` again, retry before
   diagnosing.
3. The Loop 3 test server was still listening on port 3105 at the start of this
   round (EADDRINUSE for the new server), then died mid-round; the fresh-build
   server was started afterwards and all local GET/POST/screenshot evidence after
   that point is against BUILD_ID `nidhlwOCLto1aSRW0rsKC`. Local GET sizes match
   live exactly; the only byte differences vs live HTML are chunk content-hashes.

## What I could NOT verify

- **Live free audit / checkout / PDFs** — not probed (NEEDS VELU, see P0-1).
- **Live paid audit / live PDFs** — need a real licence key; payment on hold.
- **Claude Opus miss-check** — quota exhausted until ~3 Dec 2026 (see
  `docs/claude-loop3-misscheck-2026-11-28.md`). Neon-guide conflicts (PDF engine,
  blank `$____` vs pre-filled presets, loop scoring formula) remain undecided by
  Opus; Loop 2 defaults (keep Puppeteer, keep blank prices) stand.
- **PageSpeed / LCP** — no measurement this round (P2-2).
- **Full-Chrome cross-check of P1-1** — the system Chrome at
  `/opt/meta-chromium/chrome` (157.0.8103.81) refuses to launch in this sandbox
  ("Hatch WebGL domain policy is required for browser startup"), so P1-1 is
  proven in chrome-headless-shell 158 only. The mechanism is the browser's own
  popover stylesheet (computed `position: fixed; inset: 0; 3px solid border` on a
  closed popover whose `display: none` was overridden by author CSS), which is
  specified UA behavior shared by desktop Chrome — but a 30-second check in a
  real desktop Chrome before the fix round ships would close this caveat.
- **Proposal PDF rendering at 390px** — the PDF is A4 single-column by
  construction; not rendered at phone width.
- **OG image on opengraph.xyz** — not tested (same as prior rounds).
- **0-findings UI path end to end** — no public 0-issue site was available;
  verified at unit level + route code (see above).
- **Quota behaviour on Vercel** — in-memory fallback still per-instance; KV
  adapter exists but no Upstash account is configured. Live 30/month enforcement
  is best-effort until KV is wired (P2-5).
- **Refund-channel live deliverability** — not re-proven (no test email sent);
  last proven delivery is the 20 Nov 2026 Zoho test on record. `docs/refund-log.md`
  current ("No refunds yet").

## Files

- This report: `docs/dealnote-loop4-live-audit-2026-11-28.md` (uncommitted, per task).
- Screenshots: `docs/screenshots/loop4-*.png` (12 live + 2 header probes),
  `docs/screenshots/loop4-local-*.png` (12 + 1 audit result) — uncommitted.
- Screenshot script: `scripts/shot-loop4.mjs` (uncommitted; same pattern as
  `scripts/shot-loop3fix.mjs`).
- Evidence (ephemeral, not in repo): `/tmp/dnloop4/` — live/local HTML + visible
  text, `free1-6.json`, `paid1.json`, `paid2.json`, `robots.json`, `priv.json`,
  `checkout.json`, `teardown.pdf`, `proposal.pdf`, `proposal-redesign.pdf`,
  `teardown.txt`, `proposal.txt`, `proposal-redesign.txt`, `ssrf.log`,
  `build*.log`, `server*.log`.
- No product code was changed. Local test server (port 3105, fresh build) stopped
  after testing. Dev licence key used was `dev-test-key-123`, the documented
  throwaway, passed via env only, never committed. Nothing committed to main.
