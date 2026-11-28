# Neon Whole-Site Audit — DealNote — 28 Nov 2026

**Auditor:** Gemini 4 Neon, Task mode, account velu2k03@gmail.com.
**Chat:** https://gemini.google.com/app/4b48280eb43a59f2
**When:** 28 Nov 2026, about 8 minutes, live-browsing all 6 pages at
1280px desktop.
**Site audited:** https://dealnote-blue.vercel.app (main before the
Lemon Squeezy merge 85bdde6; the audit ran while payment was still
Polar code, pre-Lemon Squeezy swap).
**Scope note:** Mobile 390px was UNVERIFIED by Neon, its browser
could not resize. Mobile must be verified separately.
**Record note:** This file was transcribed from the audit summary
handed to the payment agent. The full Neon chat text lives at the
chat URL above; the scores and findings below are the verdict as
reported, quoted faithfully, not re-scored here.

## Verdict: NO-SHIP

## Scores (out of 10)
- Design/UI: 5.5
- Tap Flow: 4.5
- Trust: 8.0
- Legal: 8.5
- Copy/Slop: 7.5

## P0 — fix all three

### P0-1. Client-side navigation drops all CSS on /sample and /terms, then crashes
Clicking "Sample report" or "Terms" from the header renders
unstyled Times New Roman HTML, no teal/glass. Clicking "Proposal
templates" from /sample or "Privacy Policy" from /terms throws
"Application error: a client-side exception has occurred". Direct
navigation loads styled, no crash. Suspected causes to check:
Next.js App Router layout / error boundaries and client components
on /sample and /terms; missing root layout wrapper; mismatched CSS
chunk imports; unguarded window / localStorage / Framer Motion hook
throwing during a soft transition. Fix and test every header/footer
Link transition in `next build && next start` and on Vercel
production with the console open until zero hydration/runtime errors.

### P0-2. PDF export still says "coming with payment" on / and /audit
Fix by wiring real PDF export with the Lemon Squeezy payment,
remove that copy, and add a 1-click Download sample PDF button
on /sample.

### P0-3. /terms exposes unfinished Upstash Redis plumbing
"/terms exposes unfinished Upstash Redis plumbing: 'the count is
durable once the Upstash Redis store is configured; until then it
may reset when the hosting restarts.'" Fix: provision and wire
Upstash Redis (free tier via Vercel Marketplace, $0, no card) so
the 30/month counter is durable, replace the sentence with plain
operational wording.

## P1 — fix all five

1. **Hero URL form does not auto-run the audit on /audit?url=...**
   Fix: read searchParams url in a useEffect guarded by a ref,
   auto-trigger once.
2. **Free audit does not pass its 2 findings to /templates,**
   unlocking forces a re-run. Fix: persist latest free-audit URL,
   score, top 2 findings to localStorage so /templates auto-fills
   a live preview.
3. **Duplicate hero sentence on /:** H1 "Show the prospect what is
   wrong with their site, then sell the fix." repeated verbatim in
   subcopy. Rewrite subcopy to the concrete mechanism/deliverable,
   keep H1.
4. **/templates exposes raw internal keys** (cover, found, fix,
   investment, nextstep) and double list markers. Map to human
   labels (Cover, Findings, Proposed Fix, Investment, Next Step),
   add list-none pl-0 to checklist ul.
5. **/terms and /privacy contradict on Lemon Squeezy and the
   hackathon tracker; /terms lacks governing law.** In /terms add
   Lemon Squeezy as Merchant of Record, add a concise Governing
   Law clause. In /privacy add Ship or Die verify.js under Who
   data is shared with.

## P2 — fix all three

1. **/sample SAMPLE banner twice, score animates 82 to 83.**
   Single banner + footer notice, fix counter easing/rounding to
   land cleanly.
2. **UK vs US spelling drift.** Pick US English site-wide
   (colors, license, labeled, Customize).
3. **/privacy over-exposes localStorage keys**
   (dealnote-brand-v1, dealnote-proposals-v1) and "$100K
   Hackathon" framing. Replace keys with plain language, name
   verify.js as traffic script, drop "$100K Hackathon" wording.

## Missing before launch — add

- Mobile 390px verification on all 6 routes in DevTools,
  scrollWidth <= 390, header drawer, hero stacking,
  templates/sample readability.
- Interactive white-label brand preview before checkout (upload
  dummy logo or pick hex colour, see it on /sample or on the
  2 free findings).
- Post-purchase licence key delivery/recovery flow: clarify on /
  and /audit how a buyer retrieves a lost key (Lemon Squeezy
  receipt email or murugan@drvelu.com).

## Fix status (filled in by the payment agent, branch dealnote-neon-fixes, 28 Nov 2026)
- P0-1: FIXED AND VERIFIED. Neon was right, and the bug was wider
  than reported: EVERY client-side navigation dropped all CSS
  (stylesheet link count 1 to 0, Times New Roman, transparent
  background), and some transitions crashed with "Application
  error" (React removeChild null). Root cause: app/layout.tsx
  rendered a hand-written <head> with dangerouslySetInnerHTML
  holding the Ship or Die tracker script; React's head management
  then removed Next's own stylesheet <link> on soft navigation.
  Fix: the tracker now loads through next/script (same src, same
  data-site value, byte-identical snippet). Verified in headless
  Chrome on a production build: 10-route click matrix, all
  transitions keep Inter + white background + 1 stylesheet link,
  zero page errors, zero application errors (scripts in
  /tmp/navtest/nav3.mjs).
- P0-2: FIXED. "Coming with payment" copy was already gone from
  the home page in the Lemon Squeezy merge; the audit-page PDF
  flow is license-gated and live. The 1-click sample PDF button
  on /sample works: GET /api/pdf/sample returns 200, 76,635 B,
  3 pages, SAMPLE stamped.
- P0-3: COPY FIXED, PROVISIONING PENDING (browser task). /terms no
  longer mentions Upstash Redis plumbing; it now says plainly
  the 30/month count may reset when the hosting restarts. The
  code already supports Upstash via UPSTASH_REDIS_REST_URL /
  UPSTASH_REDIS_REST_TOKEN; provisioning the free tier in the
  Vercel Marketplace ($0, no card) still needs the Vercel
  dashboard, which a subagent cannot open. Until then the
  counter stays in-memory best-effort, as the terms now say.
- P1-1: FIXED AND VERIFIED. /audit?url=... now auto-runs the
  audit once (useEffect + ref guard, runAudit refactored to
  runAuditFor(targetUrl)). Verified live locally:
  /audit?url=https://example.com ran by itself, teaser 45/F.
- P1-2: FIXED AND VERIFIED. Teaser findings are now stored too
  (URL + score + grade + findings as one record under
  dealnote-last-findings-v1); /templates reads both the new
  object shape and the old plain-array shape and shows a
  "Latest audit filled in" banner. Verified: after the free
  example.com teaser, /templates showed the banner with
  example.com, score 45/F, and the 2 real findings.
- P1-3: FIXED. Home subcopy rewritten to the concrete
  mechanism/deliverable; H1 unchanged.
- P1-4: FIXED AND VERIFIED. /templates sections now render
  through SECTION_LABELS (Cover, What I found, What I would
  fix, Investment, Next step) and the sending checklist ul is
  list-none with no left padding (no double markers).
- P1-5: FIXED. /terms names Lemon Squeezy as merchant of record
  and adds a concise Governing Law clause (Philippines law).
  /privacy lists Ship or Die (the hackathon traffic script) under
  Who data is shared with.
- P2-1: FIXED AND VERIFIED. /sample now has one visible SAMPLE
  banner on screen (screen-only, hidden in print) plus the
  fixed print stamp on printed pages plus the footer notice.
  CountUp now uses ceiling rounding so the sample score lands
  cleanly on 83 (verified: score element reads 83). Run dates
  updated 27 to 28 Nov 2026.
- P2-2: FIXED. US English site-wide: license, color, labeled,
  optimization across app/, components/, lib/ (73 occurrences
  of "licence" replaced; no code identifiers changed, they were
  already US spelling).
- P2-3: FIXED. /privacy no longer prints localStorage key names
  and no longer says "$100K Hackathon"; the tracker is named as
  a traffic script for the Ship or Die hackathon.
- Missing items:
  - Mobile 390px: VERIFIED. All 6 routes scrollWidth exactly
    390, no horizontal overflow, no application errors, menu
    button present, drawer opens 312x210 with 4 links.
    Screenshots: docs/screenshots/neon-mobile-*-390.png.
  - Interactive white-label brand preview before checkout:
    ADDED. New components/brand-preview.tsx on /sample: brand
    name, color picker, logo upload (PNG/JPG under 512 KB),
    live preview header, shared with the audit page through
    the same brand profile in localStorage.
  - License key delivery/recovery: CLARIFIED on home (new FAQ
    "What if I lose my license key?") and on /audit next to the
    license key field: receipt email from Lemon Squeezy, My
    Orders page, or murugan@drvelu.com.
- Also fixed while verifying: favicon.ico returned 404 on every
  page. Added app/icon.svg (copy of the existing logo) and a
  generated public/favicon.ico (teal square, white D); both now
  return 200.
- Still NOT done (browser-gated, same as the payment work):
  Lemon Squeezy product creation, API key, webhook, Vercel env
  vars, Upstash Redis provisioning, live POST verification
  (approval timed out on the last attempt, must not be retried
  unless Velu asks again), live $49 test purchase + refund.
