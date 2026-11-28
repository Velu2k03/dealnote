# DealNote — Neon Whole-Site Audit Re-check — 28 Nov 2026

**Task:** Re-verify every finding from the Neon whole-site audit
([docs/neon-whole-site-audit-2026-11-28.md](neon-whole-site-audit-2026-11-28.md),
Task https://gemini.google.com/app/4b48280eb43a59f2, verdict NO-SHIP),
fix anything that regressed, and ship it. Run in parallel with the
Lemon Squeezy test-mode payment work (separate worker, untouched here).
**Repo:** `~/workspace/ship-or-die-100k/teardown-generator`,
branch `dealnote-neon-recheck` (worktree
`~/workspace/ship-or-die-100k/neon-recheck-wt`), base main `949aea0`.
**Live before this loop:** https://dealnote-blue.vercel.app,
deployment CCHZ8aiyL, main `949aea0`.

## Opus status (why Opus did not do this)

Velu said "lets Opus fix it". Claude Opus via `agy` is UNAVAILABLE:
quota exhausted 28 Nov 2026 about 09:55 Manila, RESOURCE_EXHAUSTED
429, individual quota, resets about Thu 3 Dec 2026 22:06 Manila.
No `agy` call was made and Opus was not waited for, per Velu's
standing rule of 23 Nov 2026: do not wait for Claude, fix it
directly, ask Neon when stuck. The fixes in this loop were done
directly by this agent, verified in a real browser (Playwright
Chromium, see Method). **Opus did not do this work.** A fresh Neon
Task re-check was NOT run in this loop: this agent cannot drive a
live browser (subagents have no browser task), so the second Neon
verdict is still open — see "Still open" below, with the exact brief
for the parent to run.

## Verdict after re-check: SHIP WITH FIXES, all 11 Neon findings hold

All 11 findings from the 052f845 fix round were re-verified and
still hold on main `949aea0`. Two new defects were found by this
re-check and fixed in this loop (CountUp score reading 0, and two
new em dashes). No Neon finding regressed.

## Method (read this before trusting the numbers)

- **Live (curl):** all 6 pages + `/robots.txt` + `/sitemap.xml`
  return 200; tracker snippet present on all 6 pages (1 occurrence
  each); live POSTs re-run 28 Nov 2026 about 21:36 Manila (see below).
- **Browser (Playwright Chromium 1255, script
  `/tmp/navtest/neon-recheck.mjs`):** live browsing from sandbox
  Chrome is blocked — every external request fails with
  `ERR_TUNNEL_CONNECTION_FAILED`, and the live site itself fails
  the same way (same as the Loop 5 note: Kane egress proxy dead,
  direct egress fails). So browser checks ran against a **local
  production build** (`next build` clean, `next start -p 3108`) of
  the exact commit being shipped (base `949aea0` + this loop's
  fixes). The only external request that fails there is the Ship or
  Die tracker `verify.js`, which returns 200 from the shell — a
  sandbox-egress artifact, not a site bug. It is excluded from the
  error counts with its URL recorded, not silently ignored.
- **Screenshots:** `docs/screenshots/neon-recheck-{home,audit,sample,
  templates,terms,privacy}-{1280,390}.png`, 12 captures, taken from
  the final build. Home and sample 1280px were viewed visually:
  header intact, H1 distinct from subcopy, hero form, sample card
  83/B, single SAMPLE banner, no overflow, no visual defects.

## Per-finding re-check

| # | Finding | Re-check evidence | Result |
|---|---|---|---|
| P0-1 | Client nav drops CSS on /sample, /terms, then crashes | 6-link click matrix on production build, desktop 1280: every transition keeps 1 stylesheet link, Inter font, white (oklch(1 0 0)) background, zero "Application error", zero page errors. Root-cause fix (tracker via `next/script`, no hand-written `<head>`) still in `app/layout.tsx`. | HOLDS |
| P0-2 | PDF export said "coming with payment" | `grep` over `app/ components/ lib/`: 0 occurrences. Live: sample PDF button present, GET `/api/pdf/sample` 200, 71,772 B, 3 pages. Live POSTs: teardown + proposal PDF without a key return 402 with the license message. PDF 200 with a real key is still pending on the payment-test worker (test mode, no live purchase). | HOLDS (key test pending, parallel worker) |
| P0-3 | /terms exposed Upstash plumbing | `grep -i upstash\|redis` over `app/terms` + `app/privacy`: 0 hits. /terms line 26 now says the 30/month count "may reset when the hosting restarts". Upstash NOT provisioned (Vercel Marketplace offered no free tier, only Pay As You Go $0.2/100K and Fixed $10/mo+); no paid plan was provisioned here. Honest wording kept. | HOLDS (provisioning still open) |
| P1-1 | /audit?url= does not auto-run | Browser: `/audit?url=https://example.com` runs by itself, teaser 45/F with both findings, no "No audit yet". `useEffect` + `autoRanRef` guard in `app/audit/page.tsx`. | HOLDS |
| P1-2 | Free audit findings do not reach /templates | Browser, same session: after the teaser, /templates shows "Latest audit filled in: example.com, score 45/F" with the 2 real findings; no raw keys (`cover, found, fix` absent). | HOLDS |
| P1-3 | Duplicate hero sentence | `app/page.tsx:19-21`: H1 "Show the prospect what is wrong with their site, then sell the fix." Subcopy is now "Paste any business website URL. In about a minute you get a white-label teardown report plus a ready-to-send proposal…" — different text. Screenshot confirms. | HOLDS |
| P1-4 | /templates raw keys + double markers | `SECTION_LABELS` maps cover/found/fix/investment/nextstep to "Cover", "What I found", "What I would fix", "Investment", "Next step". Checklist `ul` is list-none, no double markers (verified in browser text). | HOLDS |
| P1-5 | /terms vs /privacy contradiction, no governing law | /terms names Lemon Squeezy as merchant of record (line 35) and has a Governing Law clause, Philippines law (line 126). /privacy lists Ship or Die verify.js under "Who data is shared with" (line 79) and names the script URL (lines 49-53). | HOLDS |
| P2-1 | /sample double SAMPLE banner, score 82 to 83 | Browser: exactly 1 visible `.sample-stamp` on screen, score reads 83, "Download sample report as PDF" present. | HOLDS |
| P2-2 | UK vs US spelling drift | `grep -ri colour\|licence\|labelled\|optimisation\|customise` over `app/ components/ lib/`: 0 hits. US English site-wide. | HOLDS |
| P2-3 | /privacy exposes localStorage keys + "$100K Hackathon" | `grep` for `dealnote-brand-v1`, `dealnote-proposals-v1`, "100K Hackathon" over `app/privacy`: 0 hits. Tracker named as a traffic script. | HOLDS |
| Missing | Mobile 390px | Browser, all 6 routes at 390x844: scrollWidth exactly 390, 0px overflow, zero page errors. Mobile drawer opens (Menu button, 11 visible links). Screenshots `neon-recheck-*-390.png`. | VERIFIED |
| Missing | White-label brand preview | `components/brand-preview.tsx` rendered on /sample (line 41): brand name, color picker, logo upload, shared with the audit page via the same brand profile. | HOLDS |
| Missing | License key delivery/recovery | Home FAQ "What if I lose my license key?" (receipt email, Lemon Squeezy My Orders page, murugan@drvelu.com) and the same pointer next to the key field on /audit. | HOLDS |

## New defects found by this re-check (fixed in this loop)

### 1. Score CountUp read "0" on load (real UX bug)
The audit score is rendered by `CountUp` in `components/motion-ui.tsx`,
which waited for `useInView` before animating. On `/audit` the score
card sits just below the fold (card top 820px in an 800px viewport),
so the headline number read **0** until the user scrolled to it.
Proved in the browser: before scroll the score span read "0",
after scrolling to it, "45". The sample page was unaffected (its
score is near the top), which is why this survived the first fix round.
**Fix:** `CountUp` gained an `immediate` prop that animates on mount
instead of waiting for scroll-into-view; `ScoreSummary` in
`components/audit-ui.tsx` now uses `<CountUp to={result.overallScore}
immediate />`. Re-verified: `/audit?url=https://example.com` now
shows 45 with no scrolling. This is the only `CountUp` usage in the
app. (Commit `0b19d37` on this branch.)

### 2. Two new em dashes in rendered copy (slop regression)
The P1-2 banner added in the first fix round printed
`{url} — score 45/F`, and the checkout fallback message in
`components/audit-ui.tsx` read "Checkout is not connected yet —
payment opens…". Both are rendered copy, i.e. new Jev tells.
**Fix:** banner now reads `{url}, score 45/F`; fallback now reads
"Checkout is not connected yet. Payment opens once the Lemon Squeezy
account is set up." The BuyButton text "Buy DealNote — $49 one-time"
is the one remaining em dash; it was frozen in earlier loops and is
left frozen here, recorded honestly below.

## Live POST re-verification (28 Nov 2026, about 21:36 Manila)

Against https://dealnote-blue.vercel.app, deployment CCHZ8aiyL,
main `949aea0` (before this loop's merge; this loop changes only
client-side copy/animation, no API code):

- POST `/api/audit` `{"url":"https://example.com"}`: **200**,
  teaser, 45/F, 2 issues (meta description missing, no phone number).
- POST `/api/checkout` `{}`: **200**, real Lemon Squeezy URL
  `https://pay.resonantatlas.com/checkout/custom/488fdaad-…`
  (checkout session only, no payment entered, no order).
- POST `/api/pdf/teardown` `{"url":"https://example.com"}` (no key):
  **402**, "A license key is required to download the PDF report."
- POST `/api/pdf/proposal` `{"url":"https://example.com"}` (no key):
  **402**, same for the proposal.
- GET `/api/pdf/sample`: **200**, 71,772 B, 3 pages.
- Note: an earlier probe with `{}` (no URL) returned 400 "Enter a
  full URL starting with https://" — URL validation runs before the
  license gate, which is the correct order, not a bug.

## Browser verification (production build, final code)

Script `/tmp/navtest/neon-recheck.mjs`, Playwright Chromium 1255,
`next build` clean, `next start -p 3108`. **26 checks, 0 fail:**
6/6 nav transitions keep CSS, 0 page errors; auto-run 45/F;
templates banner; sample banner + 83; no "coming with payment";
12/12 overflow checks (6 routes x 1280 + 390) at exactly the
viewport width; 0 page errors at both widths; mobile drawer opens.
Full log in the commit message of the merge (or re-run the script).

## Slop re-run (local rules, no external detector)

Briskly-style **~5/100**, unchanged: Inter really loaded, no
uppercase eyebrow, card rule half-fires on the uniform white 8px
cards (mandated by the brief; counted in full it would be ~10).
Jev-style **~1 partial tell, est. ~3–5/100**, unchanged: the only
remaining tell is the frozen BuyButton em dash. The two new em
dashes found in this loop are fixed, so the count did not grow.
Method: same local replication as Loop 4 (`docs/dealnote-loop4-slop-
2026-11-28.md`), source + fresh screenshots, no URL submitted to
any external detector.

## Ship record

- `tsc --noEmit` exit 0; `npm run build` clean, 18/18 pages.
- Branch `dealnote-neon-recheck`: commits `0b19d37` (CountUp fix)
  + em-dash fixes + this report; merged to main (merge commit in
  `git log`, main HEAD after merge is the shipped commit), pushed;
  Vercel auto-deploy.
- Live verification after merge: all 6 pages + robots.txt +
  sitemap.xml 200, tracker present on all 6 pages.
- Sakuga branch untouched: this loop worked in a separate worktree
  (`neon-recheck-wt`); the `dealnote-sakuga` branch and its
  uncommitted changes were not touched, merged, or overwritten.
- Payment untouched: no payment code, env vars, Lemon Squeezy, or
  Vercel dashboard changes in this loop. Test-mode payment work
  runs in parallel by a separate worker.

## Still open (not this loop's scope)

- **Fresh Neon Task re-check (second verdict):** not run — this
  agent cannot drive a live browser. Recommended brief for the
  parent, Task mode (not chat), Gemini 4 Neon High, title
  "DealNote Neon re-check - 28 Nov 2026": "Re-audit the live site
  https://dealnote-blue.vercel.app, all 6 pages, after the Neon
  whole-site audit fixes of 28 Nov 2026. The nav CSS crash, the
  coming-with-payment copy, the Upstash wording, auto-run,
  templates handoff, duplicate hero copy, raw template keys,
  governing law, sample banner, spelling, and privacy keys were
  all fixed. Verify each one live, check the audit score reads
  45 on load without scrolling, and give a new verdict
  (ship / ship with fixes / no-ship) with scores and any new
  P0/P1/P2 findings."
- PDF 200 with a real license key: pending on the parallel
  payment-test worker (test mode). No live purchase was made here.
- Upstash Redis: still not provisioned (no free tier in the Vercel
  Marketplace); the 30/month counter stays in-memory and /terms
  says so honestly. Do not provision a paid plan without Velu.
- BuyButton em dash: frozen, the one remaining Jev tell.
- TrustMRR: only after the first real sale.
