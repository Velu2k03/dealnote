# DealNote — Live UI/UX Audit, 28 Nov 2026

**Product:** DealNote, white-label website teardown + proposal generator, $49 one-time.
**Live:** https://dealnote-blue.vercel.app — **Repo:** ~/workspace/ship-or-die-100k/teardown-generator
**Commit audited:** main `d331073` (Loop 3 fix report: live verification 28 Nov 2026, merge `1ce3e47`).
**Auditor:** live UI/UX subagent, 28 Nov 2026, ~14:26–14:45 Manila (06:26–06:45 UTC).
**Scope:** report only. No code changed, no commit, no deploy, no payment work.
No live audit POST was run (needs Velu's approval; not retried), so the
post-audit result flow (findings, proposal generator, PDF download) was **not**
exercised live; it is assessed from the pre-run state + source + Loop 3's local
runtime verification.
**Method:** real headless Chrome 158 (`chrome-headless-shell`, the same engine
family as the PDF renderer) through the Kane egress forward proxy
(`127.0.0.1:8888`, restarted this round; its pid file was stale). All 6 pages
fetched live, all HTTP 200, then screenshotted full-page at 1280 and 390, with
in-browser measurements (`scrollWidth` vs `clientWidth`, header/nav geometry,
heading order, active element, form behaviour). Viewport-only screenshot and a
menu interaction probe were run to separate real defects from full-page
stitching artifacts. Live HTML + live CSS (`/_next/static/css/e015ca70a93cdbdf.css`)
checked by hand. Design skills applied: ui-ux-pro-max, frontend-design,
design-taste-frontend, unslop, web-design-guidelines, modern-web-guidance
(`navbar` popover pattern — see P0-1, where following it went wrong).
Official guides used, not memory: WCAG 2.2 (target size 24px minimum, inline
exception; contrast AA 4.5:1 normal text), Baymard/Nielsen Norman line-length
guidance (45–75 characters), Neon's science rules (landing → audit in 2
interactions, audit → proposal 1–2 taps, proposal → PDF 1 tap).
**Prior docs read first:** `docs/design-notes.md`,
`docs/dealnote-loop3-audit-2026-11-28.md`,
`docs/dealnote-loop3-fix-report-2026-11-28.md`,
`docs/dealnote-loop2-slop-2026-11-27.md`,
`docs/dealnote-loop4-slop-2026-11-28.md` (Loop 4, same commit, same live
byte sizes — this audit agrees with its slop scores).

## Verdict: NO-SHIP on UI/UX alone

One P0, and it is on every desktop page: the header is broken above 640px.
The closed mobile-menu popover renders visibly in the top layer at the top-left
of the viewport, in a black-bordered box, on top of the DealNote wordmark, which
is clipped to its bottom half. This is the first thing a desktop buyer sees, on
all 6 pages, and it makes the home link effectively unclickable where the box
overlaps it. Mobile is clean and shippable; the rest of the desktop UI is clean
and shippable. Fix P0-1 and this becomes **ship with fixes** (P1-1, P1-2, P2s).

Readiness scores (0–10; Loop 3 visual/design was 10 — this round revises it):

| Area | Score | Basis |
|---|---|---|
| Layout / overflow | 10 | 0 px overflow on all 12 captures, both widths |
| Desktop header | 0 | P0-1: popover box + clipped wordmark on all 6 pages |
| Mobile header + menu | 10 | One row, Menu opens a 312×210 popover, Escape closes |
| First screen / CTA | 9 | Hero form + "Run a free audit" clear in 5 s; sample card beside it |
| Flow (landing → audit) | 9 | 1 tap + typing; prefill + autofocus verified (see §4) |
| Flow (audit → proposal → PDF) | — | Not exercised live (no POST, payment on hold) |
| Readability | 8 | Inter 16px, contrast passes AA; desktop line length too long (P1-2) |
| Trust / honesty | 9 | 0 "verified", 0 future dates, disclaimers present; sample placeholders (P1-1) |
| Slop (Briskly-style) | ~5/100 | Unchanged: only the uniform 8px card rule half-fires |
| Slop (Jev-style) | ~3–5/100 | Only the frozen BuyButton em dash (1 partial tell) |
| Design-system compliance | 8 | Teal-only, solid colours, 8px cards — except the header popover's UA black border |

## Per-page table

All pages: HTTP 200 live. Overflow 0 px at both widths (measured
`documentElement.scrollWidth - clientWidth` in-browser). Exactly one `<h1>`,
one `<header>`, one `<footer>` per page (live HTML). Body font 16px Inter
(`__Inter_176161`) on all pages. Tracker snippet present on all 6 pages
(raw HTML: 2 hits for the site ID = 1 rendered + 1 RSC-payload copy, as in
prior rounds).

| Page | 1280 | 390 | First screen | Heading order |
|---|---|---|---|---|
| `/` home | 0 px, P0-1 header | 0 px, header clean | Eyebrow + H1 "Paste any business website URL." + hero form + "Run a free audit" + sample 83/B card | H1 + 5 H2 + 14 H3, no skips |
| `/audit` | 0 px, P0-1 header | 0 px, header clean | H1 "Run a teardown" + URL input (autofocused) + "Run audit" + licence-key + L8 notice + "No audit yet" card | H1 + 1 H2 ("No audit yet"), no skips |
| `/sample` | 0 px, P0-1 header | 0 px, header clean | SAMPLE stamp + H1 "Website Teardown and Proposal" + fictional-business note + "Print sample report to PDF" + 83/B card | H1 + 10 H2 + 11 H3, no skips |
| `/templates` | 0 px, P0-1 header | 0 px, header clean | H1 "Proposal templates" + 1-line intro + 3-step vertical flow + "Proposals: 8 documents" | H1 + 10 H2 + 16 H3, no skips |
| `/terms` | 0 px, P0-1 header | 0 px, header clean | H1 + "Last updated: 28 Nov 2026" + "What DealNote is" | H1 + 10 H2, no skips |
| `/privacy` | 0 px, P0-1 header | 0 px, header clean | H1 + "Last updated: 28 Nov 2026" + operator + "What is collected" | H1 + 8 H2, no skips |

Screenshots (12 + 1 flow shot): `docs/screenshots/live-uiux-{home,audit,sample,templates,terms,privacy}-{1280,390}.png`,
plus `docs/screenshots/live-uiux-audit-prefill-1280.png`.

## P0 — 1

### P0-1. Desktop header broken: the closed mobile-menu popover renders on top of the wordmark
- **Where:** every page, viewport width above 640px. Visible in
  `live-uiux-home-1280.png`, `live-uiux-templates-1280.png`, and in a separate
  viewport-only (non-fullPage) screenshot `/tmp/header-viewport-1280.png` —
  so this is **not** a full-page stitching artifact (the Loop 2 note about a
  duplicated header mid-page does not apply here; this box is at the very top
  of a normal viewport shot).
- **What it looks like:** the four nav links ("Run an audit / Sample report /
  Proposal templates / Terms") sit in a black-bordered box at the top-left of
  the viewport, and the "DealNote" wordmark below it is clipped to roughly its
  bottom half. The header is 57px tall; the box overlaps it.
- **Measured, in-browser (1280×900):** the `<nav>` element's box is 0×0 at
  x=1180 (it is empty in flow — its child `<ul>` has been taken out of flow);
  the four nav links' rects are x=3..473, y=-6..37, i.e. they start **6px above
  the viewport top** and paint at the viewport's top-left corner, not inside
  the centred 1120px header. The wordmark is at x=100, y=12, 124×32 — inside
  the box's footprint. A click on "Sample report" at its measured position did
  not navigate (the click point y=-1 is off-viewport; the links' visible 37px
  strip is clickable in principle, but the top is clipped and the wordmark
  underneath is not reliably clickable where the box covers it).
- **Root cause (source):** `components/site.tsx:22-31` puts
  `popover="auto"` on the `<ul id="site-menu" className="site-menu">`, and
  `app/globals.css:133` sets `.site-menu { display: flex; ... }` at **all**
  widths. Author `display: flex` beats the UA stylesheet's
  `[popover]:not(:popover-open) { display: none }`, so the closed popover
  displays; the UA popover rules (`position: fixed; inset: 0; border: solid`,
  top layer) then paint it at the viewport top-left with the black border.
  The mobile media query (`max-width: 640px`) sets `.site-menu { display:
  none; }` and only re-shows it on `:popover-open` — which is why mobile is
  unaffected and this slipped through: Loop 3 verified the header at 390px
  only ("mobile header fixed", `loop3-live-home-390.png`), and the desktop
  full-page shots were read as if the box were the header itself.
- **Why it matters:** the wordmark is the brand; a clipped wordmark + a black
  UA-bordered box is the first thing every desktop visitor sees, on every
  page. It reads as a broken site, not a styled one, and it breaks the design
  system's "one restrained shadow, no black borders" rule with a browser
  default border.
- **Fix (exact):** do not share one `<ul>` between the always-visible desktop
  nav and the mobile popover. Either (a) render two lists — a plain inline
  `<ul>` for desktop and the `popover="auto"` `<ul>` for mobile, toggled by
  the existing 640px media query; or (b) drop `popover="auto"` /
  `popoverTarget` and drive the mobile menu with a class toggle. Do not fix it
  by adding `display: none` to the closed popover at desktop width — that
  hides the desktop nav too. After the fix, re-screenshot home at 1280
  viewport-only and confirm: wordmark fully visible, four links inline at the
  right of the header, no black box, `<nav>` box non-zero in flow.

## P1 — 2

### P1-1. The public sample page leads with raw bracket placeholders
- **Where:** `/sample`, first screen, both widths
  (`live-uiux-sample-390.png`): "Prepared by [Your studio], [Your name],
  [your email]. Run date: 27 Nov 2026." and further down "About [Your Studio
  Name]", "[Your Studio Name] is a web design studio run by [Your Name],
  based in [Your City]", "[PAST PROJECT - Replace with a real project or
  delete this section. Never invent a client, a quote, or a result.]".
- **Why it matters:** Loop 3 P1-1 fixed placeholders reaching *paid PDFs*
  (400 until a real brand is entered), but the *public sample* — the page a
  prospect judges the product by — still shows them. A first-time visitor
  reads "[Your studio]" as an unfinished template, not as a deliberate
  placeholder, and the sample's job is to sell the format.
- **Fix:** fill the sample with the fictional Harbor & Pine brand throughout
  (the business is already fictional: name, address, phone, website are all
  invented, so a fictional studio name/email is consistent), or keep the
  brackets but add one quiet line under the H1: "Your brand goes here — this
  sample uses placeholders on purpose." Do not leave bare brackets as the
  first thing under the H1.

### P1-2. Desktop prose lines run ~110–130 characters, roughly double the readable measure
- **Where:** `/` findings cards, FAQ answers, `/sample` finding bodies,
  `/templates` intro — all full-width inside the 1120px container at 1280px.
  Example: home "What was found" paragraphs span the whole card width.
- **Rules hit:** Baymard / Nielsen Norman guidance (45–75 characters per
  line for body text); long measures slow reading and hurt scanning, which is
  the freelancer's main job on this page (skim findings, skim the proposal).
- **Fix:** cap the prose measure, e.g. `.card p, .faq p { max-width: 65ch; }`
  or narrow the content column on the findings/FAQ sections. One CSS rule;
  verify at 1280 that no card looks emptier than intended.

## P2 — 6

### P2-1. Sample run date is 1 day stale against the site's own "Last updated"
- `/sample` and the home hero sample card say "Run on 27 Nov 2026"; the
  footer, `/terms` and `/privacy` say "Last updated 28 Nov 2026". The sample's
  run date is its own datum, so this is cosmetic — but the flagship demo
  carrying yesterday's date while the footer claims today invites a
  "is this maintained?" read. Fix: re-stamp the sample run date when a fix
  round ships, or drop the run date from the hero card to "Sample run".

### P2-2. Em dash still in the BuyButton (frozen payment component, carried)
- `components/audit-ui.tsx:55`: "Buy DealNote — $49 one-time". Live HTML raw
  counts: 2 em dashes on `/` and `/audit` (rendered 2: pricing + footer
  BuyButton), 1 on the other four pages (footer only; the raw count includes
  the RSC-payload copy). The only em dash on the site. Fix when the payment
  freeze lifts: "Buy DealNote, $49 one-time". One string, all 6 pages.

### P2-3. Footer inline links are 16–20px tall text links
- Footer links ("Run an audit", "Privacy Policy", "Contact:
  murugan@drvelu.com") measure ~17px tall as inline text. WCAG 2.2's 24px
  minimum target size **exempts inline links**, so this is not a violation —
  but the footer is a tap target area on phones, and the links sit on one
  wrapping line with 16px text. Fix (optional, cheap): give footer links
  `display: inline-block; padding: 4px 0;` so the hit area clears 24px without
  changing the look.

### P2-4. `/templates` warnings are H2s, and they sit far down the page
- "No audit findings found" and "Your postal address is missing" are H2s
  placed below the 8 emails, before the CAN-SPAM footer (Loop 3's R3 fix held
  — they no longer greet a first-time visitor). Correct placement, but an H2
  for a conditional warning overstates it in the outline and in a screen
  reader's heading list. Fix: demote both to a styled `<p>`/`<div>` with
  `role="status"`, keeping the amber styling and the "Run an audit first"
  button.

### P2-5. Home hero sample card repeats the full score disclaimer in small type
- The 83/B card carries the whole weights + grades paragraph ("Scores are
  DealNote's own measurements… Grades: A 90–100, B 80–89, C 70–79, D 60–69,
  F below 60.") in ~13px text under the score bars. It is honest and it is
  the required L1 disclaimer — but it is the densest text on the first screen
  and it duplicates the shorter line under "What DealNote checks" ("Scores are
  lab measurements on the run date…"). Fix: keep the full text on `/sample`
  and in the PDF footer; on the home card, trim to the one-line "Scores are
  DealNote's own measurements, not Lighthouse or PageSpeed scores." with a
  link to the sample for the weights.

### P2-6. No loading or error state was verifiable live for the audit run
- `/audit` pre-run state is good ("No audit yet" card + "View the sample
  report"). The running state ("Running audit", `Loader2`) and error states
  (robots 403, private URL 400, rate-limit 429) exist in code and were proven
  locally in Loop 3, but were not exercised live here because a live run is a
  POST that needs Velu's approval. Not a defect — a coverage gap. Close it
  when the live POST check is approved: run one free audit from a real
  browser, screenshot the running state, a 403 (google.com/search) and the
  result state.

## What passed (verified this round)

- **Overflow:** 0 px on all 12 captures, both widths, measured in-browser.
- **Mobile header + menu:** one row (wordmark + Menu, 61px tall at 390px) on
  all pages. Menu probe at 390px: closed (`display: none`,
  `:popover-open` false) → click → open (`display: flex`, 312×210 at
  x=62, y=60) → Escape → closed. The mobile popover works exactly as designed.
- **Header nav count:** 4 links + wordmark on desktop (Run an audit, Sample
  report, Proposal templates, Terms); Privacy is footer-only. Correct per
  science rule R2 (max 4).
- **First screen, home:** eyebrow + H1 + subhead + URL input + "Run a free
  audit" + "See a sample report" + $49 line + 83/B sample card, all above the
  fold at both widths. The offer is clear in 5 seconds.
- **Flow, landing → audit (verified, no POST):** the hero form is a GET form
  (`action="/audit"`, `method="get"`, input `name="url"`,
  placeholder `https://www.example-plumbing.com`, submit "Run a free audit").
  Following it to `/audit?url=https://example.com` prefills the audit URL
  field with `https://example.com` and focuses it (`autofocus`, active element
  is the URL input). So landing → audit is type + 1 tap, and the audit field
  is ready to type in. (Note: the `/audit` URL input has **no `name`
  attribute** — the prefill works through React state, not the form field;
  harmless, but a plain form submit from `/audit` would send no `url` param.
  Worth one line in the fix round if the audit form is ever submitted as GET.)
- **Flow, audit → proposal → PDF:** not exercised live (see P2-6).
- **Readability:** Inter 16px body on all pages; contrast passes WCAG AA —
  teal `#0F766E` ≈ 5.0:1, slate-600 `#475569` ≈ 7.0:1, slate-500 `#64748B` ≈
  4.8:1 on white; grade colours are muted semantic text + letter grades, so
  they read without colour. Heading order: exactly one H1 per page, no skipped
  levels, on all 6 pages at both widths.
- **Trust / honesty (live HTML):** 0 occurrences of "verified", 0 of 2027 /
  2028, on all 6 pages. Score disclaimer (L1) present on home, `/audit`
  result area and `/sample`, including the "not Lighthouse, PageSpeed, or
  search-ranking scores" sentence. Price disclaimer (L2) present with the
  named + dated SEOptimer comparator (checked 27 Nov 2026). Refund pointer
  (L5) on the pricing card with pre-filled mailto subject. SAMPLE stamp (L3)
  exactly once per sample surface (hero card, `/sample` top + footer).
  Outreach responsibility (L6) and no-prospect-data (L7) present. No hype
  words, no fake urgency, no invented figures, no dollar-loss claims.
- **Templates page (visual):** the Loop 3 slop fixes held — the 3-step
  vertical flow ("Audit done / Customize / Export PDF"), the 8 proposals as a
  vertical list of structurally different documents, and the 8 emails as a
  numbered sequence (1 Cold → 8 Post-Proposal Nudge). No equal-card grids
  remain. The two warning cards sit below the emails, before the CAN-SPAM
  footer, as intended.
- **Design system (`docs/design-notes.md`):** deep teal `#0F766E` is the only
  accent; solid colours only; 8px cards; one restrained shadow
  (`0 1px 2px rgb(15 23 42 / 0.06)`); Inter throughout; no Sortes tokens in
  the live CSS (0 hits for `#141b2e`, `#d4af37`, Cinzel, Jost); 0 gradients,
  0 `backdrop-filter`/glass, 0 emoji in live HTML/CSS; no stock photos, no
  decorative illustration. The **only** design-system break is P0-1's UA
  black popover border.
- **Footer:** present on all 6 pages, both widths; maker + date ("DealNote is
  made by Velu Murugan (DrVelu), Santa Rosa City, Laguna, Philippines. Last
  updated 28 Nov 2026."), contact `murugan@drvelu.com`, 6 nav links,
  "$49 one-time" line, BuyButton.

## Slop re-run (Briskly / Jev rules replicated locally, as in prior rounds)

| Score | Loop 2 | Loop 3 | This round (live, main `d331073`) |
|---|---|---|---|
| Briskly-style (/100) | ~5 | ~5 | **~5** (unchanged) |
| Jev-style (est. /100) | ~6–10 | ~3–5 | **~3–5** (unchanged) |

Briskly detail (11 rules, weights total 70): only rule 5 (shadcn-style rounded
card) half-fires at 3.5/70 — uniform white 8px cards everywhere; radius is 8px,
not 2xl, same judgement as all prior rounds. All other 10 rules clean: Inter
really loaded, no gradient, no dark mode, left-aligned hero, no all-caps
labels, no orbs/glow, no marketing speak, no "Trusted by", hand-written CSS.
Jev detail (34 tells): 1 partial tell firing — the em dash in the BuyButton
(P2-2). The three-card feature grid is gone (templates are a vertical flow +
numbered sequence). No colour, type, component or layout tells otherwise.
These are replications from the public rule lists, as before — no URL was
submitted to any detector, and no Impeccable `detect` run was made in this
round (no build was run, per the report-only constraint).

## What I could NOT verify

- **Live free audit / checkout / PDFs** — not probed (NEEDS VELU, see P2-6).
- **Live paid audit / live PDFs** — need a real licence key; payment on hold.
- **Audit-result flow live** — findings list, proposal generator, edit-loss
  behaviour, 0-findings state: verified locally in Loop 3 only.
- **"View full text" / "View and edit email" buttons on `/templates`** — not
  clicked live; their expand/edit behaviour was not exercised.
- **PageSpeed / LCP** — no measurement this round (needs the PageSpeed
  Insights API key).
- **Real-Chrome confirmation of P0-1** — observed in headless Chrome 158 with
  matching element metrics (nav 0×0 in flow, links at viewport top-left) and
  the exact CSS cause in source. The mechanism (author `display: flex`
  beating the UA `display: none` on a closed popover) is engine behaviour,
  not a screenshot artifact, but a 30-second check in real desktop Chrome
  would close it completely.
- **Quota behaviour on Vercel / DNS rebinding** — out of scope for a UI/UX
  audit; see Loop 3.

## Fix order (do in this sequence)

1. **P0-1 — Desktop header.** Split the nav: plain inline list for desktop,
   popover list for mobile (or drop `popover` for a class toggle). Re-shoot
   home at 1280 viewport-only and confirm the wordmark, the four inline
   links, and no black box.
2. **P1-1 — Sample placeholders.** Fill the sample with the fictional Harbor
   & Pine brand, or add the one-line "your brand goes here" note.
3. **P1-2 — Prose measure.** Cap body copy at ~65ch.
4. **P2-1, P2-4, P2-5, P2-3** — sample date stamp, warning H2s → status
   regions, home-card disclaimer trim, footer link hit area. All small.
5. **P2-2 — BuyButton em dash** when the payment freeze lifts.
6. **P2-6 — Live POST check** when Velu approves it: one free audit from a
   real browser, screenshot running / 403 / result states.

## Files

- This report: `docs/dealnote-live-uiux-audit-2026-11-28.md`.
- Screenshots: `docs/screenshots/live-uiux-{home,audit,sample,templates,terms,privacy}-{1280,390}.png`
  (12), plus `docs/screenshots/live-uiux-audit-prefill-1280.png`.
- Evidence (ephemeral, not in repo): `/tmp/live-uiux-metrics.json` (per-page
  measurements), `/tmp/live-uiux-*.html` (live HTML), `/tmp/live-uiux.css`
  (live CSS), `/tmp/header-viewport-1280.png`, `/tmp/menu-open-390.png`.
- No code was changed, nothing committed, nothing deployed, no payment work.
  The Kane egress proxy (`127.0.0.1:8888`, pid 8275) was restarted for this
  round and left running, as Loop 3 did. The temporary probe scripts
  (`scripts/live-uiux-shot.tmp.mjs`, `scripts/check-header.tmp.mjs`,
  `scripts/check-menu.tmp.mjs`) were deleted after use; `git status` shows
  only this report + the 13 screenshots as new files (plus Loop 4's own
  untracked docs, untouched).

## Sources applied

- Prior rounds: `docs/dealnote-slop-check-2026-11-27.md`,
  `docs/dealnote-slop-recheck-2026-11-27.md`,
  `docs/dealnote-loop2-slop-2026-11-27.md`,
  `docs/dealnote-loop3-audit-2026-11-28.md`,
  `docs/dealnote-loop3-fix-report-2026-11-28.md`,
  `docs/dealnote-loop4-slop-2026-11-28.md`.
- Briskly AI Slop Detector — https://briskly.tools/tools/ai-slop-detector
  (11 rules + weights + score bands).
- Jev AI Slop Detector — https://madewithjev.com/free-tools/ai-slop-detector
  (34 tells).
- Unslop (Damir Sokolovsky, CC BY 4.0) — signs.md.
- Product brief — `docs/design-notes.md`.
- Science rules — `docs/neon-high-guide-2026-11-27.md`,
  `docs/dealnote-loop2-science-2026-11-27.md`.
- WCAG 2.2 — target size (2.5.8, 24px minimum, inline exception),
  contrast (1.4.3, 4.5:1).
- Live site — https://dealnote-blue.vercel.app (headless Chrome 158,
  28 Nov 2026, all 6 pages HTTP 200).
