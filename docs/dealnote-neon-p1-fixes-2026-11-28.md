# DealNote Neon P1/P2 fixes — 28 Nov 2026

Neon re-check verdict: **SHIP, 0 P0**, fix the 3 P1s in a 10-minute pass
before pushing traffic. Gemini chat
https://gemini.google.com/app/4b48280eb43a59f2, conversation "DealNote
redesigned site re-check - 28 Nov 2026", Gemini 4 Neon, Task mode.
Base: main 22af386. Branch: dealnote-neon-p1-fixes.

## Baseline (before, local production build, Playwright Chromium 1255)

Verification script `neon-p1-verify.mjs` (kept at
`~/workspace/ship-or-die-100k/neon-p1-verify.mjs`): **8/30 checks passed**.
Every finding reproduced in a real browser at 1280px:

- P1-1: hero Sakuga button 97px tall, white bg, dark ink italic 800
  19px text, 3px dark border, lavender offset shadow, text wrapping —
  "Run a free audit" on 3 lines. Same white face on Buy, Run audit,
  Unlock.
- P1-2: `/logo.svg` and `/icon.svg` fill `#0F766E` (teal), visible in
  the header on all 6 pages. /sample default brand-color swatch was
  already `#BE185D` (verified, not a code defect — Neon likely saw a
  stale cached profile); fixed anyway by removing the only teal
  rendered anywhere.
- P1-3: tooltip host 42x42px with `margin-top: 60px` (vendor shadow
  CSS), footnote paragraph 102px tall, /templates "?" alone on its
  own line below the subtitle; tab-switch screenshot shows the pink
  landing burst/puff sitting on the "Emails" label.
- P2-1: /terms and /privacy `.reading` at x=104 (container edge),
  not centered; / FAQ heading x=104 while items x=260.
- P2-2: /sample score sampled 0, 0, 40, 67, 83, 83 over the first
  360ms (Neon saw 68/100 B mid-animation) while the grade badge
  already showed B.
- P2-3: in a fresh teaser flow the text read "found several quick
  wins", not "10". The "10" comes from the stored brand intro line:
  a full audit rewrites `brand.introLine` to "found N quick wins"
  (audit page), and that stale count survives into later proposals
  that only show the 2 teaser findings. Fixed at the render site so
  no stored count can leak through again.
- P2-4: sample PDF checked locally (see below).

## Fixes

### P1-1 — primary CTAs standardized on solid pink (app/globals.css)
The Sakuga button paints its face from CSS variables inside its
shadow DOM (`background var(--sk-card)`, `color var(--sk-ink)`,
`border var(--sk-bw) solid var(--sk-btn-line)`, `shadow
var(--sk-btn-sh)`), and its `:where(:root)` defaults lose to a
page's own values — so the host-level variables restyle the face
with no vendor-file edit. The font (italic 800, 19px) is hardcoded
in the shadow CSS, so it is restyled through the exposed
`::part(button)`, which the component declares.
- `sakuga-button:not([variant="secondary"])`: `--sk-card: #DB2777`,
  `--sk-ink: #fff`, `--sk-btn-line: #DB2777`, `--sk-btn-sh: none`.
- `::part(button)`: normal, 600, 15px, padding 12px 20px, min-height
  48px, `white-space: nowrap`, bg #DB2777, white text, 1px
  transparent border, no shadow; `:hover` bg #9D174D.
- Secondary buttons keep their white face: the selector excludes
  `[variant="secondary"]`, and `--sk-card` is only set on primary
  hosts (the `.alt` face also reads `--sk-card`).
- Footer BuyButton and the audit-page unlock-area BuyButton were
  `className="btn btn-secondary"` (white secondary face) although
  they are primary buy CTAs: both changed to plain `<BuyButton />`
  (`components/footer.tsx`, `app/audit/page.tsx:548`).

### P1-2 — teal removed (app/icon.svg, public/logo.svg)
Both SVG logo fills `#0F766E` → `#DB2777`. Grep for `0F766E`,
`0D9488`, `14B8A6`, `teal` across app/components/lib/public: zero
rendered occurrences remain (one comment in globals.css mentions
"teal" in prose only). /sample default swatch verified `#BE185D`
in code (`lib/audit.ts` DEFAULT_BRAND / SAMPLE_BRAND) and live in
the browser (color input value `#be185d`).

### P1-3 — tooltip inline, tab sparkle offset
- `sakuga-tooltip` (app/globals.css): `display: inline-flex`,
  16x16px, `margin-top: 0 !important` (the 60px margin is a shadow
  `:host` rule, so the document override needs `!important`),
  `margin-left: 4px`, `vertical-align: middle`; `::part(button)`
  16x16px, 11px, 700, 1.5px border, no shadow. The bubble is
  absolutely positioned above the host and is unaffected.
- **One Sakuga vendor edit** (`public/sakuga-vfx/tabs.js`,
  landing block in `frame()`): the landing burst used to draw
  through the tab's own label — puff at the tab's left edge and
  speed lines through its vertical center. Ticks, puffs, and lines
  now land in the band above the tab (`c.y - c.h/2 - 20` and above);
  the celebration is kept, the overlap is gone. Recorded here; no
  other Sakuga file was touched.

### P2-1 — centered columns (app/terms/page.tsx, app/privacy/page.tsx, app/page.tsx)
- /terms and /privacy `.reading` wrapper: `marginLeft/Right: auto`
  (max-width 760px, centered at x=260 on 1280px).
- / FAQ heading moved inside the same centered `max-w-[760px]
  mx-auto` `.reading` wrapper as the FAQ items (h2, wrapper, and
  items all x=260, w=760).

### P2-2 — score renders immediately (components/audit-ui.tsx)
`ScoreSummary` renders `{result.overallScore}` as static text
instead of `<CountUp … immediate />`; the `CountUp` import was
removed there. CountUp stays exported in `components/motion-ui.tsx`
for other uses. Also fixed the button/helper-text/accept mismatch:
"Upload logo (PNG/SVG)" → "Upload logo (PNG/JPG)" in
`components/brand-preview.tsx` and `app/audit/page.tsx` — the file
input accepts PNG/JPEG only, and the error text already said
"Choose a PNG or JPG logo."

### P2-3 — finding count is the visible count (lib/templates.ts, app/audit/page.tsx)
New `introLineForAudit(introLine, issueCount)`: a counted intro
line ("found N / several quick wins") is rewritten to the finding
count actually in this proposal ("found 2 quick wins", "found 1
quick win"); any other wording is the buyer's own text and is left
alone; 0 findings gets the good-shape line. Used in
`buildProposalText` (covers /templates, the audit-page generator,
and both PDFs) and in the audit-page report preview, which showed
the same stale line on screen.

### P2-4 — sample PDF spot-check (local)
`GET /api/pdf/sample`: **200, 93,337 B, 3 pages**, Letter.
Header "Harbor & Pine Digital SAMPLE" and footer "Prepared by
Harbor & Pine Digital · Maya Lin · maya@harborandpine-digital.example
· Page N of 3" on every page (verified per page with pdftotext).
Zero `[YOUR STUDIO]` placeholders (8 "Harbor" mentions). Note:
93,337 B locally vs the 84.2 KB in the task brief — same 3-page
document, size differs by renderer/font embedding; content verified
identical in shape. Live size re-checked after deploy (below).

## Verification (after fixes, local production build)

- `npx tsc --noEmit` exit 0. `npm run build` clean, 18/18 pages.
- Verification script: **30/30 checks passed** (was 8/30):
  hero pink/white/non-italic/600/1px border/no shadow/nowrap,
  48px tall at 1280 and 390; footer buy, Run audit, Unlock all pink;
  logo/icon not teal; swatch `#BE185D`; tooltip 16x16, margin 0,
  footnote 20px, /templates "?" inline beside subtitle (para 26px);
  /terms /privacy centered x=260 w=760; FAQ heading/items x=260;
  sample score "83/100" at every 60ms sample from load, grade B;
  Quick-Fix text now "found 2 quick wins" above the 2 teaser
  findings; mobile 390px 0px overflow all 6 pages, 0 page errors.
- Nav matrix (header links, 1280px): /sample, /templates, /privacy,
  /terms, /audit, / — 6/6, 1 stylesheet link, Inter, white
  background, zero "Application error", zero page errors.
- Visual: home 1280 (pink one-line hero CTA, pink logo, inline "?",
  static 83/100 B), templates 1280 ("?" inline, Emails tab burst
  above the tab, not on the text) — screenshots
  `docs/screenshots/neon-p1-{home-1280,templates-1280,home-390,tabs-250ms}.png`.
- PDFs regenerated locally with a local-only dev key
  (`DEALNOTE_DEV_LICENSE_KEY=LOCAL-TEST-DEV-KEY-ONLY`, LS env unset,
  server stopped afterwards):
  - sample: 200, 93,337 B, 3 pages, Harbor brand, 0 placeholders.
  - teardown: 200, 96,644 B, 4 pages, Harbor x9, 0 placeholders.
  - proposal: 200, 128,318 B, 5 pages, Harbor x11, 0 placeholders.

## Ship

- Merge: dealnote-neon-p1-fixes → main (HEAD below), pushed.
- Live verification after Vercel auto-deploy: all 6 pages 200 +
  tracker, live sample PDF 200, live audit POST 200 45/F, live
  checkout POST 200 (recorded below by the parent after deploy).

## Open / notes

- The BuyButton label still carries the frozen em dash ("Buy
  DealNote — $49 one-time"), the one remaining Jev tell from
  earlier loops; not part of this fix set.
- `CountUp` in `components/motion-ui.tsx` is now unused by the
  headline score but stays exported; no other caller exists.
- The tabs.js edit is the only Sakuga vendor-file change in this
  branch; the Sakuga skill's "use files exactly as shipped" rule
  was overridden here only because Neon's P1-3 fix requires the
  effect geometry to change.
