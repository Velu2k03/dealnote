# DealNote Loop 4 Fix Report — 28 Nov 2026

**Product:** DealNote, white-label website teardown + proposal generator, $49 one-time.
**Live:** https://dealnote-blue.vercel.app — **Repo:** ~/workspace/ship-or-die-100k/teardown-generator
**Branch:** `dealnote-loop4-fixes` → merged to main (see §9 for the merge hash).
**Base:** main `d331073` (Loop 3 fix report, merge `1ce3e47`).
**Fix coordinator:** Loop 4 fix subagent, 28 Nov 2026, ~14:42–15:30 Manila.
**Payment:** ON HOLD throughout. No payment code touched, no Polar/Lemon Squeezy/TrustMRR/Stripe account or product created, no test purchase, no live POSTs against the live site (none were run in this round at all; all endpoint evidence is local).
**Frozen, untouched:** BuyButton em dash (`components/audit-ui.tsx:55`).
**No agy/Opus used:** Opus quota exhausted until ~Thu 3 Dec 2026 ~22:06 Manila.

## 0. What Velu changed mid-round (and what it overrode)

After the four Loop 4 audit streams landed, Velu ordered the plain look elevated: **Apple glass + motion**, built immediately with no permission gate between report and build. That direction replaces the old "no glass" rule in `docs/design-notes.md` (updated §12, dated 28 Nov 2026). The motion brief and the original Loop 4 fix list both stand; the glass work is additional, done after the header P1. All hard constraints from both briefs held: PDFs and print output unchanged, no motion/glass on /terms or /privacy beyond a simple fade, nothing delaying the audit form or the buy path, Lucide only, teal `#0F766E` only accent, Inter only.

## 1. Verdict after fixes

**Code-side: SHIP WITH FIXES, all fixes applied and verified locally and live.**
The consolidated audit verdict stays **NO-SHIP as a paid product** for the same two Velu-gated reasons only (see §8): live free-audit POST unproven and payment on hold. There are no code blockers left from Loop 4: the desktop header P1 is fixed and proven, the build is clean, and every fixable science/slop/legal gap in the four streams (plus the fifth live UI/UX audit, `docs/dealnote-live-uiux-audit-2026-11-28.md`, which was also in hand and agrees with the live-audit stream) is fixed or recorded with a reason below.

## 2. Fix list — what was done

### 2.1 P1-1 (NEW, top priority): desktop header fixed
- **Defect:** at any viewport > 640px the nav `<ul>` rendered as a black-bordered box pinned top-left, hiding the DealNote wordmark; home link unclickable at desktop width. Root cause: `components/site.tsx:33` put `popover="auto"` on the same `<ul>` that `app/globals.css:132` turned into the desktop inline nav; author `display: flex` overrode the UA closed-popover `display: none`, and the remaining UA popover styles (`position: fixed; inset: 0; 3px border`) painted it in the top layer.
- **Fix (proper, not a display hack):** the two modes are now two separate lists in `components/site.tsx` — a plain inline `<ul class="site-menu site-menu-desktop">` for desktop and the `<ul id="site-menu" class="site-menu site-menu-mobile" popover="auto">` for mobile. Each is `display: none` at the other size, so only one is ever in layout or tab order. CSS in `app/globals.css` moved the mobile popover positioning rules onto `.site-menu-mobile` only.
- **Proof (local, chrome-headless-shell 158):** at 1280px the mobile popover is `display: none`, 0x0, `:popover-open` false; the desktop nav is `display: flex` at x=710, w=470; the wordmark is at x=100, y=12, 124x32, and the element at its centre is the wordmark link itself; clicking the wordmark from /sample lands on `/`. Header height 57px, overflow 0px. At 390px the desktop list is hidden, the header is one row (wordmark + Menu, 61px), Menu opens the popover (`:popover-open` true, `display: flex`) and Escape closes it. Screenshots: `docs/screenshots/loop4fix-header-1280.png`, `loop4fix-header-390.png`, `loop4fix-menu-open-390.png` (visually checked: wordmark + 4 links inline, no black box).
- **Caveat (carried from the audit):** proven in chrome-headless-shell 158 only; the system Chrome at `/opt/meta-chromium/chrome` refuses to launch in this sandbox ("Hatch WebGL domain policy is required for browser startup"). A 30-second check in real desktop Chrome is still recommended before calling the header fully closed.

### 2.2 Build failure — investigated, clean exit 0
- **History:** the legal stream's `npm run build` failed twice at final packaging (exit 1 after successful compile + 17/17 static pages: ENOENT `_not-found/page.js.nft.json`, then a JSON parse error in `loadManifest`).
- **Investigation:** the first build in this round failed for a different, self-inflicted reason — a bad edit that dropped the How-it-works `<div class="container">` and `<h2>` (webpack syntax error in `app/page.tsx:8/58`), fixed immediately and re-verified by reading the file. After that, `rm -rf .next` + `npm run build` gave a **clean exit 0, 18/18 static pages**, on the first try, and again after the motion changes. No stale-artifact, parallel-build, or disk cause was found in this round: disk 95 GB free, no other build was running, and the Loop 4 audit streams' failures were both at the same late packaging stage on a tree whose `.next` had been left by an earlier round (Loop 4 live-audit stream 1 had the same pattern: stale `.next/export` ENOTEMPTY, then a transient `next/font` Google fetch failure, then clean). Conclusion: the two legal-stream failures look environmental/transient (stale `.next` + packaging race), not a code defect — the same source now builds clean twice in a row from a clean `.next`. Do not ship without a clean build remains the rule; this round ships with one (BUILD_ID `2JxSUH3wxvxLUSxFm8_u0` at merge time; see §9 for the live build).
- **Build sizes (before motion / after Loop 4 fixes, pre-motion build):** home 972 B / 103 kB, /audit 11.4 kB / 119 kB, /sample 1.81 kB / 94.1 kB, /templates 6.73 kB / 109 kB, /terms + /privacy 142 B / 87.4 kB, shared 87.3 kB. After motion, see §6.

### 2.3 Science gaps (all fixed, small and safe)
- **(a) $696/yr anchor:** NOT claimed as $696. The second comparator could not be verified cleanly: Better Proposals' own pricing page (fetched 28 Nov 2026, crawled <1 min before) shows only a bare "$13" with no plan/billing basis in the extracted text, and secondary sources disagree on whether the Starter annual figure is $13/mo billed annually ($156/yr) or $19/mo monthly ($228/yr) — the $696 figure ($468 + $228) rests on the $19 reading, which the vendor page as fetched does not support. So the home pricing card now carries an honest one-comparator block instead: DealNote $49 once vs SEOptimer White Label $39/mo = **$468 over 12 monthly payments ($39 x 12); $351 billed annually** on its public pricing page. SEOptimer $39/mo was re-checked 28 Nov 2026 on the vendor's own pricing page (https://www.seoptimer.com/pricing/, crawled copy 6 Sep 2026, $39/mo monthly, $29.25/mo / $351 billed annually) and corroborated by G2's SEOptimer pricing page ($39 White Label). The block sits in the pricing card, directly above the BuyButton, with the existing "Example only. Compare current prices before you buy. No guarantee of client wins." line plus a new "Example only, using the SEOptimer prices checked 28 Nov 2026" caption. No price was invented.
- **(b) Sample PDF 1-click download:** new `GET /api/pdf/sample` (`app/api/pdf/sample/route.ts`) renders the fictional `sampleAudit()` through the same teardown template as the paid PDF (Puppeteer, `lib/pdf-html.ts`), so the file carries the SAMPLE stamp and the sample disclaimer. No licence key, no live audit, no payment. The /sample page now has a "Download sample report as PDF" button next to the print button. Verified locally: 200, 76,521 B, valid PDF 1.4, 3 pages, SAMPLE stamp present (1 hit in extracted text), footer exactly 1x per page on all 3 pages. The old print-to-PDF path still works.
- **(c) Blank $____ x3 in /sample tiers:** NOT pre-filled (blank-only guardrail stands, Opus conflict undecided). The three tier cells now read "To be quoted" and the caption reads "Prices are quoted in the proposal, not shown here: the freelancer fills in the price for each tier before sending." The audit-page proposal generator's `$____` blanks are untouched (verified: /templates still carries the intentional blank-price copy).
- **(d) Scroll cue:** home hero now has "See how it works below" with a Lucide ChevronDown icon, linking to `#how-it-works` (the section now has that id). Small, honest, no fake urgency.
- **(e) TL;DR boxes:** labelled 4-bullet plain-English Summary boxes at the top of /terms and /privacy (short, accurate, no new claims).
- **(f) /terms long paragraphs:** the two 123-word paragraphs ("What DealNote is", outreach responsibility) are split at sentence boundaries into shorter paragraphs with identical wording. Max paragraph is now 117 words (/terms) and 74 (/privacy).

### 2.4 Slop LOWs (honest dates only)
- **L-N8 "60-second checklist":** renamed to "Before you send: checklist" (`app/templates/page.tsx:302`). No time claim remains.
- **L-N7 stale 27 Nov dates:** the sample run date (`lib/audit.ts:214`, `app/sample/page.tsx:24,143`) is **kept at 27 Nov 2026** — it is the sample audit's genuine run date, and re-stamping it without re-running the sample would falsify a measurement. The SEOptimer check date (`app/page.tsx:132`) is bumped to **28 Nov 2026** because the price was genuinely re-checked today (see §2.3a). The tracker install dates in /privacy stay 27 Nov 2026 (true install date). No check date was falsified.

### 2.5 P2 email subjects
- day7 alternate: "Is this on your list this month?" (7 words) → "On your list this month?" (5).
- postcall alternate: "Following up on our call - [Business].com" (7 words) → "Following up on our call" (5).
- All 16 subjects (8 kinds x 2) now measure ≤ 6 words (max 6: warm "Following up: I looked at [Business].com", referral x2). No fake "Re:" anywhere.

### 2.6 L3 SAMPLE stamp print — FIXED, not skipped
- Added a print-only repeating header: `<p class="print-stamp">SAMPLE: fictional business, fictional data</p>` on /sample, hidden on screen, `position: fixed; top: 0` inside `@media print`, so the print engine repeats it on every page. Print CSS also forces glass/motion to final state (see §6).
- **Proof:** /sample rendered to PDF in print mode (headless Chrome): 6 pages, SAMPLE present on pages 1–6 (page 1 has 2 hits: repeating header + in-page stamp). Server PDFs were already stamped via `isSample` (sample PDF verified above); the remaining server-PDF note from the legal stream (no PDF route ever receives a sample result) is now closed by the new `/api/pdf/sample` route.

### 2.7 Anything else small and safe (from the four streams + the UI/UX audit)
- **UI/UX P1-1 sample placeholders:** the bare "[Your studio]" first line now carries the quiet explanation "The bracketed names are placeholders on purpose: your brand goes here on a real report." (Filling the sample with a fictional studio brand was not done — the brackets are the product's own placeholder convention, and the line makes the intent explicit.)
- **UI/UX P1-2 prose measure:** `.card p, .reading p { max-width: 65ch; }` in `app/globals.css` (Baymard/Nielsen Norman 45–75ch guidance).
- **UI/UX P2-3 footer hit area:** footer links get `display: inline-block; padding: 4px 0` (clears the 24px WCAG target size).
- **UI/UX P2-4 warning headings:** the two /templates warning H2s ("No audit findings found", "Your postal address is missing") are now styled `<p>` elements inside the existing `role="alert"` cards — same amber styling, no longer overstated in the heading outline.
- **Legal open item L1/L6 on /audit:** the short score disclaimer ("Scores are DealNote's own measurements from this run, not Lighthouse, PageSpeed, or search-ranking scores… Weights: …") now renders unconditionally under the URL box on /audit, so a fresh visitor sees it before running anything. The outreach line already renders with the result; no change there.
- **NOT done, with reasons:** UI/UX P2-5 (trim the home score-card disclaimer) — skipped, the full text is the required L1 label; trimming it would reopen a legal gap. UI/UX P2-2 BuyButton em dash — frozen per task. P2-6 live POST states — Velu-gated. PageSpeed/LCP — no API key, carried. DNS rebinding, in-memory quota, KV unwired, governing-law review, Vercel log-retention number, custom domain — all carried, none is a code fix in this round.

## 3. Local verification (production build, port 3105, BUILD_ID 2JxSUH3wxvxLUSxFm8_u0)

| Check | Result |
|---|---|
| `npm run build` (clean `.next`) | exit 0, 18/18 static pages, Next.js 14.2.35 |
| SSRF suite `scripts/test-ssrf.ts` | 29/29 pass |
| Free audit POST (example.com) | 200, 45/F, teaser keys exactly `teaser, url, fetchedAt, overallScore, overallGrade, issues, message`, 2 Critical issues |
| Robots POST (`google.com/search`) | 403, exact robots message; did not burn quota |
| Rate limit | 5 free 200s, 6th 429 with limit message |
| Private URL POST (`127.0.0.1:9`) | 400, validation before rate-limit counting |
| Checkout POST `{}` | 503 `notConfigured`, never a fake success |
| PDF teardown / proposal, no key | 402 both |
| PDF teardown / proposal, dev key + real brand | 200 both, 82,669 B / 4 pp and 86,079 B / 4 pp, footer exactly 1x per page, 0 placeholder hits |
| PDF with placeholder brand | 400, names the missing brand fields |
| Sample PDF `GET /api/pdf/sample` | 200, 76,521 B, 3 pp, SAMPLE stamp, footer 1x per page |
| Paid audit, dev key | 200, 45/F, 10 issues, quota 1 used / 29 left |
| Screenshots, all 6 pages x 1280 + 390 | `docs/screenshots/loop4fix-{page}-{1280,390}.png`, 0px overflow everywhere |
| Header (see §2.1) | desktop + mobile correct, wordmark clickable, menu opens/closes |
| Print stamp (see §2.6) | SAMPLE on all 6 printed pages |
| Copy honesty (local HTML, all 6 pages) | 0 "verified", 0 future dates (2027/2028), 0 "60-second", sample `$____` 0 |
| Email subjects | all 16 ≤ 6 words, no fake "Re:" |
| /terms paragraphs | max 117 words; /privacy max 74 |
| Tracker snippet | exact snippet, 1 live script tag per page, all 6 pages |

## 4. Slop re-run (after fixes + glass + motion)

Briskly-style **~5/100** and Jev-style **~3–5/100**, unchanged from Loop 3. Method: same replicated rule lists applied to live HTML + source + the new screenshots. The uniform 8px card rule still half-fires (3.5/70); glass blur and the hover-only spotlight wash fire no Briskly/Jev rule in static screenshots. The only Jev tell remains the frozen BuyButton em dash (1 partial). No new gradients in UI source except the spotlight's faint teal radial wash (see §6); no linear gradients anywhere; 0 emoji; Inter really loaded.

## 5. What was NOT verified (carried, Velu-gated or out of scope)

- Live free audit / checkout / PDF POSTs — not probed, needs Velu's approval (P0-1).
- Live paid audit / live PDFs — need a real licence key; payment on hold (P0-2).
- Real desktop Chrome check of the header fix — chrome-headless-shell 158 only (see §2.1 caveat).
- PageSpeed / LCP — no API key (anonymous quota 429 in Loop 3).
- Claude Opus miss-check — quota exhausted until ~3 Dec 2026; Neon-guide conflicts (PDF engine Puppeteer stays, blank prices stay) undecided, Loop 2 defaults stand.
- Refund-channel live deliverability — no test email sent; last proof 20 Nov 2026 Zoho test.
- OG image on opengraph.xyz — not tested. 0-findings UI end to end — unit-level only (Loop 3).

## 6. Apple glass + motion (Velu's new direction, 28 Nov 2026)

### Research (official docs, not memory)
- **Motion:** motion.dev install guide — `npm install motion`, import from `"motion/react"`, React 18.2+ (repo is React 18.3.1), App Router needs `"use client"` or the `motion/react-client` entry; no special config. Reduced motion: `MotionConfig reducedMotion="user"` disables transform/layout animation while keeping opacity; `useReducedMotion()` for bespoke branches (motion.dev accessibility guide + MotionConfig docs).
- **Lucide:** already installed (`lucide-react` 0.454.0) and used throughout; no change in icon set. Category icons unchanged (gauge / smartphone / search / wrench / mouse-pointer-click / shield-check).
- **React Bits:** reactbits.dev — copy-and-own components, no package to install; CountUp via `npx shadcn add @react-bits/CountUp-TS-TW`. The CountUp source tab is JS-rendered and could not be fetched from this sandbox, so the pattern was re-implemented against Motion (see below), not copied verbatim.

### Vetting — SkillSpector on `motion` 14.14.0
Ran SkillSpector 2.12.0 (`--no-llm`) against the published tarball (`npm pack motion@14.14.0`, `/tmp/motion-scan/report.json`). Verdict: **CAUTION, score 39, MEDIUM**, max severity MEDIUM. Its single MEDIUM finding (confidence 0.5) is a README badge URL (`https://api.motion.dev/` score badge image in README.md) flagged as "external transmission" — a false positive: it is a badge image in documentation, not code, and nothing in the package transmits data. The scanner's supply-chain analyzer crashed with its known `InvalidURL` quirk (0% coverage, same failure mode as the mastering-audio and freehire scans), so the verdict rests on manual checks too: MIT licence, no install/postinstall scripts in the published package, dependencies only `tslib` + `framer-motion` 14.14.0, official motiondivision package from the npm registry. Proceeded on that basis.

### What was added, where
- `components/motion-ui.tsx` (new, `"use client"`): `MotionProvider` (`MotionConfig reducedMotion="user"` in `app/layout.tsx`), `Reveal` (fade + 12px rise, 350 ms, once, on scroll into view), `Stagger`/`StaggerItem` (finding cards enter 70 ms apart), `CountUp` (overall score counts 0 → score in 350 ms; adapted React Bits CountUp pattern via MotionValue + `animate` + `useInView`, jumps to the final value under reduced motion), `SpotlightCard` (React Bits SpotlightCard pattern, restrained: one faint teal radial wash, 7% opacity, 240px circle following the pointer, pricing card only).
- Glass (`.glass` in `app/globals.css`): translucent white 72%, `backdrop-filter: blur(20px) saturate(180%)`, white 65% border, soft Apple shadow. Applied to: sticky header (80% white + blur), hero score card, finding cards, How-it-works step rows, the two "checks" cards, the pricing card (inside SpotlightCard), all /sample content cards.
- Hero: staggered entrance (left column, then score card at +80 ms), score count-up, animated category bars (width 0 → score%, 350 ms, on view), scroll cue (see §2.3d). Buttons: 120 ms lift on hover (`translateY(-1px)`), press scale 0.98. Section reveals on the home page's lower sections. /terms and /privacy: CSS-only opacity fade (`.fade-in`, 300 ms), no Motion JS on those pages.
- **Not done:** no page transitions (would need layout-level routing work and risks delaying navigation — recorded, not silently skipped); no gradient text; no SpotlightCard anywhere else; no autoplay, no looping video, no decorative illustration, no emoji, no second accent colour.
- **PDFs/print:** `lib/pdf-html.ts` untouched. Print stylesheet forces glass to plain white, hides the spotlight overlay, and forces `.motion-fade` elements to opacity 1 / no transform. Browser print of /sample verified (SAMPLE on all 6 pages, §2.6).

### Bundle before/after (First Load JS, `next build`)
| Page | Before motion (Loop 4 fixes) | After glass + motion | Delta |
|---|---|---|---|
| / | 103 kB | 161 kB | +58 kB |
| /audit | 119 kB | 177 kB | +58 kB |
| /sample | 94.1 kB | 152 kB | +58 kB |
| /templates | 109 kB | 109 kB | 0 |
| /terms | 87.4 kB | 87.5 kB | ~0 |
| /privacy | 87.4 kB | 87.5 kB | ~0 |
| Shared chunks | 87.3 kB | 87.3 kB | 0 |

The +58 kB is the Motion runtime on pages that use it; /templates (no motion) and /terms + /privacy (CSS fade only) are unchanged. `docs/design-notes.md` §12 records the new glass + motion rules, replacing the old "no glass" rule, dated 28 Nov 2026.

### Screenshot caveat (important for future loops)
`whileInView` reveals start at opacity 0, so a full-page screenshot taken without scrolling photographs below-fold sections blank. That is a capture artifact, not a live defect: scrolling through the page first (as a user does) reveals every section at opacity 1 — verified in-browser 28 Nov 2026 (all 5 home H2 sections opacity 1, all 3 finding cards visible after a scroll-through). The screenshot script (`scripts/shot-loop4fix.mjs`) now scrolls through each page before capturing.

## 7. Files changed

- `components/site.tsx` — header split (desktop list + mobile popover list).
- `app/globals.css` — popover scoping, glass, button lift/press, prose 65ch, footer hit area, print stamp + print overrides, CSS fade, reduced-motion rules.
- `app/page.tsx` — scroll cue + `#how-it-works` id, SEOptimer comparison block + 28 Nov re-check, hero Reveal, section Reveals, pricing SpotlightCard + glass, checks cards glass.
- `app/sample/page.tsx` — sample PDF download button, print stamp element, tiers "To be quoted", placeholder explanation line, glass cards, caption update.
- `app/api/pdf/sample/route.ts` (new) — GET sample teardown PDF, SAMPLE-stamped, no key.
- `app/templates/page.tsx` — "Before you send: checklist", warning H2s demoted to styled `<p>` in `role="alert"` cards.
- `app/terms/page.tsx`, `app/privacy/page.tsx` — TL;DR Summary boxes, terms paragraphs split, CSS fade-in.
- `app/audit/page.tsx` — unconditional short score disclaimer under the URL box.
- `lib/templates.ts` — day7 + postcall alternate subjects shortened to 5 words.
- `components/audit-ui.tsx` — ScoreSummary glass + CountUp, animated score bars, IssueList glass + stagger.
- `components/motion-ui.tsx` (new) — Motion primitives (see §6).
- `app/layout.tsx` — MotionProvider wrapper.
- `package.json`, `package-lock.json` — `motion` 14.14.0 added (exact).
- `docs/design-notes.md` — §12 glass + motion rules (old "no glass" rule replaced).
- `scripts/shot-loop4fix.mjs`, `scripts/verify-loop4fix.mjs` (new, untracked helpers) — screenshots + header/print verification.
- `docs/dealnote-loop4-fix-report-2026-11-28.md` (this report), `docs/dealnote-loop4-audit-2026-11-28.md` (consolidated audit).
- Screenshots: `docs/screenshots/loop4fix-*.png` (12 pages + header probes + menu-open).
- The four Loop 4 audit stream reports + the live UI/UX audit are committed with this round (they were uncommitted inputs).

## 8. What remains — Velu-gated only

1. **P0-1 Live free-audit POST unproven.** One real-browser run of the free audit against the live site, record status + body. Needs Velu's approval; timed out twice before.
2. **P0-2 Payment on hold.** Velu resumes payment, then a live $49 purchase + refund is proven end to end. No code in this round touches payment.
3. **Real-Chrome header check** (30 seconds, §2.1 caveat) — recommended, not blocking: the mechanism is specified UA behaviour and headless-shell proof is strong.
4. **Carried, not blocking:** PageSpeed/LCP measurement (needs an API key), governing-law legal review, Vercel log-retention number, custom domain, KV wiring for durable quota, DNS-rebinding hardening, OG image check, refund-deliverability re-proof (last proven 20 Nov 2026).

## 9. Merge + deploy + live verification

- **Commit:** `93cd2fd` on branch `dealnote-loop4-fixes` (all Loop 4 audit reports, fix code, glass + motion, screenshots, both reports).
- **Merge:** `ba46893` — merge to main, pushed to GitHub Velu2k03/dealnote (main + branch both pushed 28 Nov 2026 ~07:00 Manila).
- **Live verification (28 Nov 2026 ~07:02 Manila, after Vercel auto-deploy):**
  - All 6 pages + `/robots.txt` + `/sitemap.xml` return **200** (home 55,695 B; /audit 19,410 B; /sample 55,168 B; /templates 40,109 B; /terms 29,186 B; /privacy 25,102 B; robots 78 B; sitemap 1,098 B).
  - Tracker snippet byte-verbatim on all 6 pages (2 hits per page: 1 script tag + 1 escaped RSC-payload copy, as in prior rounds).
  - 0 "verified", 0 future dates (2027/2028) in live HTML.
  - New content live: "Download sample report as PDF" + "To be quoted" on /sample; SEOptimer "$468 over 12" block on home; Summary boxes on /terms and /privacy; "Before you send: checklist" on /templates.
  - Live sample PDF: `GET /api/pdf/sample` 200, 71,632 B, valid PDF 1.4, 3 pages; SAMPLE stamp present (renders as spaced "S AMP LE" in pdftotext because the stamp uses letter-spacing, same as the local build) plus the sample disclaimer sentence.
  - Header live: **HTML + CSS check, not a live screenshot.** Headless Chrome via the Kane egress proxy timed out on the live site (`net::ERR_TIMED_OUT`, three attempts; curl reaches the site fine at 200). The proxy restart needs `PROXY_AUTH_BASIC`, which this round did not have. Live HTML confirms the fix is deployed: exactly one `popover=` attribute in the page (on the mobile list only), the plain `.site-menu-desktop` list present with all 4 links, the wordmark present, and the live CSS contains `.site-menu-mobile{display:none}` and the glass rules. Local proof (chrome-headless-shell 158, §2.1) stands. A live screenshot / real-Chrome check remains recommended.
  - No live POSTs were run (Velu-gated P0-1); no payment touched (P0-2).

## 10. 25-skill polish pass — Loop 5 scope (Velu, 28 Nov 2026)

After this round shipped, Velu ordered a polish pass using all 25 skills from https://recent.design/skills, with no permission gate. Per his fallback instruction, the Loop 4 round shipped first; the skill pass is named Loop 5 scope. Per-skill table (skill, source, SkillSpector verdict, used/skipped with evidence, what changed) is recorded in `docs/dealnote-loop5-skills-2026-11-28.md` as the pass runs; no skill is silently skipped. Skills already installed from earlier loops (canvas-design, frontend-design, web-design-guidelines, unslop, impeccable, logo-design, image-prompt-design, image-qc, modern-web-guidance, prompt-engineering, ui-ux-pro-max, design-taste-frontend, extract-design, theme-factory, brand-guidelines) are re-used, not reinstalled blindly.
