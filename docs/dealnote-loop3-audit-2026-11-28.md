# DealNote Loop 3 Audit — 28 Nov 2026

**Product:** DealNote, white-label website teardown + proposal generator, $49 one-time.
**Live:** https://dealnote-blue.vercel.app — **Repo:** ~/workspace/ship-or-die-100k/teardown-generator
**Commit audited:** main `c1f2d47` (Loop 2 merge `18487aa` + report commit, live and verified).
**Auditor:** Loop 3 subagent, 28 Nov 2026, ~09:37–10:05 Manila.
**Scope:** report only. No code changed, no deploy, no commit. Payment untouched
(`app/api/checkout`, `app/api/webhook`, `lib/license.ts`, BuyButton not modified;
no Polar/Lemon Squeezy/TrustMRR/Stripe account or product created; no test purchase).
**Live POST checks NOT done** (free audit teaser, checkout 503, PDF 402 live) — needs
Velu's approval, timed out twice before. Not retried.
**Claude Opus miss-check NOT done** — quota exhausted, resets ~3 Dec 2026.
See `docs/claude-loop3-misscheck-2026-11-28.md`.
**Prior docs read first:** `docs/dealnote-loop2-fix-report-2026-11-28.md`,
`docs/dealnote-loop2-live-audit-2026-11-27.md`,
`docs/dealnote-loop2-legal-endpoints-2026-11-27.md`,
`docs/dealnote-loop2-slop-2026-11-27.md`, `docs/dealnote-loop2-science-2026-11-27.md`,
`docs/neon-high-guide-2026-11-27.md`.

## Verdict: NO-SHIP (as a paid product) — no new P0 in code

The site and code are in markedly better shape than Loop 2: the SSRF holes are closed,
the teaser leak is closed, the edit-loss bug is now **runtime-verified fixed**, the
templates first screen is fixed, the mobile header is fixed, and every Loop 2 P1 is
closed except the two known remainders. There is **no new P0 in the code**.

The NO-SHIP verdict is carried by the same two pre-existing P0s as Loop 2, both
NEEDS VELU, not code:

1. **P0-1 (carried). Live free audit POST still unproven.** Not retried (needs Velu's
   approval). Local POST path re-proven this round (200 in ~5.5 s, 45/F, exact teaser
   keys). Live GETs are fast and byte-identical to the local build, so this is still
   most likely an egress-path quirk, but the funnel's front door remains unproven live.
2. **P0-2 (carried). Payment still on hold — no live purchase path.** Checkout still
   503 `notConfigured` locally; no live licence key exists; live paid audit and live
   PDFs remain unproven. Needs Velu to resume payment + a live $49 test purchase +
   refund.

Code-side, this round is **SHIP WITH FIXES**: 0 new P0, 4 P1 (2 carried remainders,
1 legal carry, 1 new stale count), 13 P2. The fix round should clear P1-1–P1-4
before the 1 Dec launch decision; none of them needs Velu except the payment call.

## Readiness scores (0–10; Loop 2 in brackets)

| Area | Score | Basis |
|---|---|---|
| Build | 10 [9] | Clean first try, Next.js 14.2.35, zero type errors, BUILD_ID `asfEHTNe7FFhQtute-yd8` |
| Pages live (GET) | 10 [10] | All 6 pages 200 live + local, byte-identical sizes |
| Free audit, local | 10 [9] | 45/F, teaser keys exact, categories leak closed, Critical first |
| Free audit, live | 0 [0] | Not verified (NEEDS VELU) |
| Paid audit, local | 10 [9] | 45/F, 10 issues severity-sorted, quota 1 used / 29 left |
| Phase 1 features | 9 [8] | All 8 present; edit-loss now runtime-verified; 0-findings gating verified |
| PDFs, local | 9 [9] | Both valid A4, footer every page; last-page duplication cosmetic; P2-9 placeholders |
| PDFs, live | 0 [0] | Not verified: needs a real licence key (payment on hold) |
| Copy / honesty | 9 [8] | Stale "Six" count, Re: subjects, cold "3" hardcode are the remaining nits |
| Scoring engine | 9 [7] | Math re-verified; robots wildcards 6/6; HEAD 405 retry in code; quirks fixed |
| Security / SSRF | 9 [5] | `test-ssrf.ts` 29/29 pass; redirect re-validation; DNS rebinding still theoretically open |
| Paywall / quota | 8 [6] | Teaser server-enforced; PDF cache reuse proven (0 burn); rate-limit consume-on-fail remains |
| Visual / design | 10 [9] | 0 px overflow on all 24 captures; mobile header + templates first screen fixed |
| Slop (Briskly-style) | ~5/100 [~5] | Unchanged: only the uniform 8px card rule half-fires |
| Slop (Jev-style) | ~3–5/100 [~6–10] | Improved: only the BuyButton em dash (partial tell) remains |

## P0 — 0 new (2 carried, NEEDS VELU)

### P0-1 (carried). Live free audit POST unproven
- Same as Loop 2. Not retried this round per task (needs Velu's approval; timed out
  twice before). Local equivalent: 200, 45/F, exact teaser keys, ~5.5 s.
- Unblocker: run the same free audit from a real browser/network and record status + body.

### P0-2 (carried). Payment on hold, no live purchase path
- Unchanged by design. Checkout POST locally → 503 `notConfigured`, never a fake
  success. Site honestly says "Teardown PDF and proposal PDF (coming with payment)".
- Unblocker: Velu resumes payment, then a live $49 purchase + refund is proven end to end.

## P1 — 4

### P1-1 (carried, Loop 2 P2-9). Default brand placeholders still reach a real paid PDF
- `lib/audit.ts:330-343` `DEFAULT_BRAND` still ships `Alex Rivera`,
  `hello@yourstudio.example`, `(555) 010-4471`, `https://cal.com/yourstudio/intro`.
- **Proven in output this round:** both locally generated PDFs (dev key, no brand sent)
  contain `Alex Rivera`, `hello@yourstudio.example`, `(555) 010-4471`
  (`/tmp/dnloop3/teardown.txt`, `proposal.txt`, 1 hit each). A buyer who skips brand
  setup sends a proposal signed by a fictional person. The same placeholders render in
  the `/templates` CAN-SPAM footer preview (visible in `loop3-live-templates-1280.png`).
- The intro line itself is fixed ("found several quick wins", `lib/audit.ts:341`).
- Fix: refuse to generate a PDF (or watermark the preview) until brand name + contact
  name + contact email are non-default; at minimum strip the fake phone/cal.com link
  from the fallback. Escalated P2 → P1 because it is now the last honesty gap in a
  paid deliverable.

### P1-2 (carried, Loop 2 P2-6). Free rate limit still consumes on failed fetches; XFF still the IP source
- **Behavior-proven this round:** free audit (call 1, 200) + robots-blocked
  `google.com/search` (403) + 3 more free audits (200) → 6th call 429. The robots 403
  consumed 1 of 5. Code confirms it: `checkFreeRateLimitAsync` increments at check
  time (`lib/ratelimit.ts:56-110`, INCR / `count += 1`) and the route calls it before
  `runFullAudit` (`app/api/audit/route.ts:543-556`). `getClientIp` still takes the
  first `X-Forwarded-For` entry (`lib/ratelimit.ts:42-50`), documented as a throttle,
  not a security boundary.
- Private-URL 400 correctly does NOT consume (validation precedes the limit check).
- Fix: count only on successful fetch (decrement/refund on 403/fetch failure), or move
  the check after `runFullAudit` starts; do not trust XFF without the platform header.

### P1-3 (carried, Loop 2 legal gap #8). /privacy still describes Polar payments in the present tense
- Live `/privacy` visible text: "Payments are handled by Polar, the merchant of record.
  Polar collects the buyer's name, email, card details, and billing address at checkout."
  Checkout is 503 `notConfigured`; no buyer can pay, and Polar collects nothing today.
- Fix: add "(coming soon)" / future tense until Polar is live. One paragraph.

### P1-4 (NEW). /audit generator card still says "Six structurally different documents"
- `app/audit/page.tsx:756`: "Six structurally different documents, not one skeleton with
  a word swapped." There are now **8** proposal kinds (`lib/templates.ts:55-125`:
  quickfix, redesign, retainer, localseo, landing, fastclose, newbuild, ecommerce).
  The card renders on every paid audit result, under "1. Choose a proposal".
- Fix: change "Six" to "Eight". One word. (No other stale counts found: 0 hits for
  "5 emails" / "3 proposals" in `app/`, `components/`, `lib/`.)

## P2 — 13

1. **PDF last-page footer duplication (cosmetic, carried).** `lib/pdf-html.ts:62-64`
   (`displayHeaderFooter` + `footerTemplate`) plus the in-body `.footer` div (`:142`).
   Verified per page with `pdftotext`: teardown 4 pages, footer on p1–p4, **twice on p4**;
   proposal 5 pages, footer on p1–p5, **twice on p5**. Fix: drop the in-body div when
   the header/footer template is used.
2. **Cold Intro subject breaks the under-6-words rule and hardcodes "3".**
   `lib/templates.ts:236`: "Your website, reviewed: 3 quick wins for [Business]" = 8 words
   (Neon Rule 5: subject under 6 words). Body also hardcodes "the three biggest items"
   (`:243`, `findingList(findings, 3)`): if the buyer selects 1 or 5 findings, subject
   and body still say 3. Warm (6 words) and Referral (6 words) sit exactly on the limit.
   Fix: shorten the cold subject (e.g. "3 quick wins for [Business]" is 5 words with the
   count, or drop the count) and make the count follow the selection.
3. **Two "Re:" subjects contradict the site's own checklist.**
   `lib/templates.ts:300` (Day 3: "Re: Your website review") and `:372` (Post-Proposal:
   "Re: Your website proposal"), while the /templates 60-second checklist claims "The
   subject line matches the body (no fake 'Re:' or 'Fwd:')". Same-thread defense noted
   (both are follow-ups "same thread"), but the templates ship subject text only, no
   threading headers, so a copy-pasted "Re:" on a fresh send is a fake reply prefix.
   Fix: reword the checklist or drop "Re:" from the two subjects.
4. **Header still 5 nav links** (`components/site.tsx:5-9`: Run an audit / Sample report /
   Proposal templates / Terms / Privacy). Science R2 says max 4 (Privacy to footer only).
5. **Proposal default still Redesign, not Quick-Fix pre-selected**
   (`app/audit/page.tsx:90`: `useState<ProposalKind>("redesign")`). Science C1/R2: make
   the likely choice fastest.
6. **"See proposal templates" label unchanged** (`app/audit/page.tsx:957`). Science A2:
   rename to "Open the proposal templates page" (it does not say the templates open on
   another page).
7. **L8 local-storage notice renders only after an audit result.**
   `app/audit/page.tsx:627` and `:975` sit inside the `{displayed ? (...)}` block (`:489`),
   so a fresh /audit visit shows no storage notice (0 hits in live static HTML).
   The same notice is in /privacy. Fix: render it under the brand/tracker area
   unconditionally.
8. **"Last updated 27 Nov 2026" is now 1 day stale.** Loop 2 merged to main on 28 Nov,
   but the footer (`components/footer.tsx:26`), /terms (`app/terms/page.tsx:7`) and
   /privacy (`app/privacy/page.tsx:7`) still say 27 Nov. Bump when the fix round ships.
9. **R8 load budget still unmeasured.** No PageSpeed Insights run this round. Live home
   curl took 2.9 s server-side; LCP on a mid-range phone is unknown. Measure live with
   PageSpeed Insights on mobile and record the number.
10. **R1 partial: no embedded URL input in the hero and no autofocus on /audit.**
    Home hero links out ("Run a free audit", `app/page.tsx:25`); `/audit` has no
    `autoFocus` anywhere. Landing → audit result costs one extra tap vs the Neon rule
    (embed the input in the hero, or pre-focus the /audit field).
11. **Day 3 email body is 49 words vs the 50-word floor.** Unit-measured bodies:
    cold 83, warm 54, referral 63, day3 **49**, day7 64, breakup 56, postcall 60,
    postproposal 55. Trivial; one word.
12. **Orphaned `.steps-grid` CSS remains** (`app/globals.css:170-171`). Zero uses in
    `app/` + `components/` + `lib/` (verified by grep). Harmless; delete.
13. **Em dash still in the BuyButton (frozen payment component).**
    `components/audit-ui.tsx:55`: "Buy DealNote — $49 one-time", 1–2 per live page; the
    only em dash on the site. Fix when the payment freeze lifts (reword to a comma).
    The second em dash in that file (`:19`, checkout error message) never renders live.

## What passed (verified this round)

- **Build:** `npm run build` clean, Next.js 14.2.35, zero type errors, 6 pages + 6 API
  routes + `/robots.txt` + `/sitemap.xml`. BUILD_ID `asfEHTNe7FFhQtute-yd8`.
- **Pages live + local:** all 6 pages 200 on both; sizes **byte-identical**
  (home 49,293 B; /audit 17,705 B; /sample 52,269 B; /templates 39,017 B; /terms
  26,571 B; /privacy 22,296 B). `/robots.txt` 200 (78 B, `Allow: /` + sitemap line),
  `/sitemap.xml` 200 (1,098 B, all 6 URLs, lastmod 2026-11-27), `verify.js` 200.
- **Tracker:** exact snippet
  `<script defer src="https://www.ship-or-die.com/hackathon/verify.js" data-site="d40c7a78322ccb335a973aa331f31294d5cbddcb"></script>`
  byte-present **exactly once per page** on all 6 live pages (the second raw ID hit is
  the escaped copy inside the RSC payload, as in prior rounds).
- **Free audit, local:** 200, **45/F**, teaser keys **exactly**
  `fetchedAt, issues, message, overallGrade, overallScore, teaser, url` — categories
  leak closed (Loop 2 P1-5), `totalIssues` gone. 2 issues returned, both Critical,
  severity order holds (i1 Meta description, i2 No phone number). Copy matches payload.
- **Robots 403:** `google.com/search` → 403 with the exact "asks automated tools not to
  fetch this page" message. Private URL `169.254.169.254` → 400. Checkout `{}` → 503
  `notConfigured`. PDF teardown/proposal with no key → 402 with licence-required errors.
- **Rate limit:** 5 free audits then 429 with the limit message (see P1-2 for the
  consume-on-fail proof).
- **SSRF:** `npx tsx scripts/test-ssrf.ts` → **29/29 pass** (23 blocked, 6 allowed),
  same as Loop 2.
- **Paid audit, local (dev key via env only):** 200, **45/F, 10 issues**, title
  "Example Domain", `license: {auditsUsed: 1, auditsRemaining: 29, auditsPerMonth: 30}`.
  Severities sorted: Critical, Critical, Fix soon ×5, Nice to have ×3. Category scores
  Speed 100/A, Mobile 50/F, SEO 25/F, Technical 50/F, Conversion 0/F, Trust 33/F —
  weighted 20/15/20/15/15/15 → 44.95 → 45. Matches.
- **Robots parser (unit):** 6/6 — `/*.pdf$` blocks `/x.pdf`, allows `/x.html`;
  `Disallow: /` blocks `/`; `/search` blocks `/search` not `/`; longest Allow wins.
  (First run returned false on all cases because my test text omitted the `User-agent:`
  line; retested properly — the code was correct, the test was wrong.)
- **0-findings (unit):** `buildProposalText` with 0 issues → "good shape" note present,
  "No material issues were found", 0 hits for "found 7" / "found 0". Proposal PDF route
  forces `template=retainer` on 0 issues (`app/api/pdf/proposal/route.ts:154`).
- **Edit-loss merge — RUNTIME-VERIFIED this round (Loop 2 had only code-verified it).**
  Real browser against the local production build: paid audit on example.com, edited fix
  #1 title to `LOOP3 BROWSER EDIT`, ticked finding i4. Result: fix list 3 → 4 items,
  checked 3 → 4, edited title **kept**. PASS.
- **PDFs, local (dev key):** teardown 200, 84,777 B, valid PDF 1.4, **4 pages A4**;
  proposal (Quick-Fix) 200, 101,027 B, **5 pages A4**. Footer present on **every page**
  of both (per-page `pdftotext`). 0 hits for "found 7" in either. Proposal: "not a
  contract" present, `$____` ×3. **Quota cache reuse proven:** 2nd paid audit after
  both PDFs showed 2 used / 28 left — the 2 PDFs consumed 0 audits.
- **Screenshots:** 24 files, desktop 1280 + mobile 390, local + live, **0 px horizontal
  overflow on all 24** (measured `scrollWidth == clientWidth` in-browser).
  `docs/screenshots/loop3-local-*.png`, `docs/screenshots/loop3-live-*.png`.
  Live shots needed the Kane egress forward proxy (`127.0.0.1:8888`, restarted this
  round — its pid file was stale) plus `--ignore-certificate-errors` for the egress
  TLS MITM. Visually checked: /templates desktop + mobile, home mobile, /audit mobile.
- **Copy / honesty (live visible text):** 0 "verified", 0 future dates (2027/2028),
  0 middle dots in source, dollar figures only $49 / $39 (named SEOptimer comparator,
  dated 27 Nov 2026) / $1.63 per audit; "$100" hit is "$100K Hackathon" in /privacy;
  "found 7" on /sample is "The audit found 7 issues on the homepage" (the sample's own
  true count, not the old intro-line bug). "30 audits" now 1 visible instance on home
  (pricing card only — hero clause removed) and 2 operative instances in /terms.
  "Most clients pick the middle tier": 0 hits. "cheapest": 0 hits.
- **Headings:** exactly one `<h1>` per page, no skipped levels in static HTML on any
  of the 6 pages. /sample has all 10 template sections (Scope, Timeline, About, Terms
  present). /templates shows "8 proposals + 8 emails".
- **Legal L1–L9 / T1–T6 (live HTML spot re-check):** L1 hero now carries the full
  "not Lighthouse, PageSpeed, or search-ranking scores" sentence (Loop 2 gap closed);
  L2 named + dated comparator; L3 SAMPLE stamp top + footer; L4 audit-method note on
  /audit; L5 refund pointer now on the pricing card **with pre-filled
  `mailto:?subject=DealNote%20refund%20request`** (Loop 2 gap closed); L6 outreach line
  on /templates + /audit; L7 no-prospect-data FAQ; L8 in /privacy (post-result-only
  render on /audit, see P2-7); L9 footer on every PDF page (last-page duplication, see
  P2-1). T1–T6 all present in live /terms (refund 14 days, 3 business days, acceptable
  use, outreach responsibility, lifetime sentence). /privacy Changes section fixed:
  "The Ship or Die tracker is now installed (27 Nov 2026)".
- **Science R1–R8:** R3 fixed (/templates: H1 + 1 line + steps-flow; warnings now sit
  below the emails, before the CAN-SPAM footer); R4 fixed (3 brand fields visible, 8
  behind `<details>` "More brand details", `app/audit/page.tsx:649`); R5 price story
  once on the pricing card ("$49 one-time. 30 audits a month. About $1.63 per audit.
  No subscription, no per-report fee."); R6 maker + date in the footer ("DealNote is
  made by Velu Murugan (DrVelu), Santa Rosa City, Laguna, Philippines. Last updated
  27 Nov 2026."); R7 mobile header fixed (wordmark + Menu button, one row at 390px —
  confirmed in `loop3-live-home-390.png` and `loop3-live-audit-390.png`); R1/R2/R8
  partial (see P2-4/5/6/9/10).
- **Slop re-run (Briskly/Jev rules replicated locally):** Briskly ~5/100 unchanged
  (only the uniform white 8px card rule half-fires; radius is 8px, not shadcn 2xl).
  Jev improved to ~3–5/100 (was ~6–10): M-N1 three-card grids fixed (vertical
  `.steps-flow` + numbered `<ol>` for the 8 emails), M-N2 weights duplication fixed
  (one "Weights:" hit, `components/audit-ui.tsx:180`), M-N4 "30 audits" repetition
  fixed (hero clause gone), L-N1 mobile header fixed, L-N2/L-N3 templates first
  screen fixed, L-N4 "Most clients pick" deleted, L-N5 screenshot card deleted,
  L-N6 "Trust & local" label shortened. Remaining: M-N3 em dash in BuyButton only
  (1 partial tell) + orphaned `.steps-grid` CSS (P2-12).

## What I could NOT verify

- **Live free audit / checkout / PDFs** — not probed (NEEDS VELU, see P0-1).
- **Live paid audit / live PDFs** — need a real licence key; payment on hold.
- **Claude Opus miss-check** — quota exhausted until ~3 Dec 2026 (see
  `docs/claude-loop3-misscheck-2026-11-28.md`). Neon-guide conflicts (PDF engine,
  blank `$____` vs pre-filled presets, loop scoring formula) remain undecided by Opus;
  Loop 2 defaults (keep Puppeteer, keep blank prices) stand.
- **PageSpeed / LCP** — no measurement this round (P2-9).
- **Proposal PDF rendering at 390px** — the PDF is A4 single-column by construction;
  not rendered at phone width.
- **OG image on opengraph.xyz** — not tested (same as prior rounds).
- **0-findings UI path end to end** — no public 0-issue site was available; verified at
  unit level + route code (see above).
- **Quota behaviour on Vercel** — in-memory fallback still per-instance; KV adapter
  exists but no Upstash account is configured by code. Live 30/month enforcement is
  best-effort until KV is wired.
- **Refund-channel live deliverability** — not re-proven (no test email sent); last
  proven delivery is the 20 Nov 2026 Zoho test on record. `docs/refund-log.md`
  current ("No refunds yet").

## Files

- This report: `docs/dealnote-loop3-audit-2026-11-28.md` (uncommitted, per task).
- Opus miss-check record: `docs/claude-loop3-misscheck-2026-11-28.md` (uncommitted).
- Screenshots: `docs/screenshots/loop3-local-*.png` (12), `docs/screenshots/loop3-live-*.png` (12) — uncommitted.
- Evidence (ephemeral, not in repo): `/tmp/dnloop3/` — live/local HTML + visible text,
  `free1.json`, `paid1.json`, `paid2.json`, `teardown.pdf`, `proposal.pdf`,
  `teardown.txt`, `proposal.txt`, `ssrf.log`, `build.log`, `server.log`.
- No code was changed. Local test server (port 3105) stopped after testing; Kane
  egress forward proxy (127.0.0.1:8888) restarted and left running for browser-session
  tooling. Dev licence key used was `dev-test-key-123`, the documented throwaway,
  passed via env only, never committed. Nothing committed to main.
