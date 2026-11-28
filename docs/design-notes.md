# DealNote — Design Notes

**Product:** DealNote (white-label website teardown + proposal generator, $49 one-time).
**Date:** 27 Nov 2026. **Status:** Design system, updated in the fixes round of 27 Nov 2026 to match the slop fixes (see §11). No code, no build in this file itself; the code changes live in `app/` and `components/` and are verified separately.
**Companion doc:** `PLAN.md` in the same folder. If this file and `PLAN.md` disagree, `PLAN.md` wins on product scope and this file wins on visual decisions.

## 1. Design stance

Clean, plain, businesslike, now with Apple-style glass and motion (Velu, 28 Nov 2026 — this replaces the old plain-only rule). The buyer sells to local business owners who distrust jargon and hype; the product should look like a well-made business document, not a startup landing page. No AI slop: no colour gradients as decoration, no glows, no aurora backgrounds, no floating blobs, no emoji anywhere (UI, reports, or marketing), no stock photos, no decorative illustration. Every visual element earns its place by explaining something or by being the product itself. Glass is the one deliberate exception: frosted translucent panels (see §12), in the Apple style — clean, light, airy, lots of whitespace, large clear type, smooth spring motion.

## 2. Colour

### Accent: pink `#BE185D` (pink-700) — Sakuga direction, 28 Nov 2026

Velu ordered the site redesigned like the Sakuga VFX look: white paper, lavender surfaces, violet line, pink accents. This **supersedes** the deep-teal-only rule below (kept in the history of this file). The pink is deliberately chosen, not a default:

- The Sakuga palette is white paper, two-tone effects (white, lavender, violet line), pink accents (`#ff5fa8`), impact burst on every confirm. DealNote now uses that palette as its site palette: pink accent, lavender surfaces, violet borders.
- Readable pink, not decorative pink: the Sakuga accent `#ff5fa8` is ~2.9:1 on white, so it is decorative only (wedges, checks, bursts). The site accent `#BE185D` is 6.04:1 on white and white on it is 6.04:1, so it passes WCAG AA for normal text, links, and buttons.
- Ink is the Sakuga ink `#1D1A4A` (dark violet-slate, 16.17:1 on white), muted `#55507A` (7.46:1), faint `#6E6890` (5.19:1) — all AA.
- It prints well. A teardown is a PDF a business owner prints or reads on a phone; pink-700 stays legible on white paper, where the lighter Sakuga pink would wash out.
- It is not a Sortes token. No navy `#141b2e`, no gold `#d4af37`, no cream `#ede6d6`, no Cinzel, no Jost anywhere in this product. The old teal `#0F766E` is retired as the site accent (buyer brand colours in white-label reports are the buyer's own, not DealNote's).

### Palette (the whole product: app UI, report HTML, PDF)

| Token | Value | Use |
|---|---|---|
| Background | `#FFFFFF` white | Page background everywhere |
| Surface muted | `#F4F3FC` lavender tint | Panels, table header rows, code/evidence blocks |
| Border | `#DDD6FE` violet-200 | Cards, tables, dividers, inputs |
| Text primary | `#1D1A4A` Sakuga ink | Headings, body text, scores |
| Text secondary | `#55507A` | Supporting copy, captions, metadata |
| Text faint | `#6E6890` | Timestamps, "could not check" labels only — never body copy |
| Accent | `#BE185D` pink-700 | Primary buttons, links, active states, score bars, section headings in reports |
| Accent soft | `#FDF2F8` pink-50 | Accent backgrounds (callouts, highlighted rows) |
| Accent border | `#F9A8D4` pink-300 | Borders on accent callouts only |
| Sakuga accent (decorative) | `#FF5FA8` | Sakuga effect wedges, checks, bursts; never body text |
| Sakuga primary | `#8F8DF7` violet | Sakuga effect primary fills |
| Sakuga soft / line | `#B8B3FF` / `#5A4FD8` | Sakuga effect shadow tone / violet outline |
| Grade A/B | `#15803D` green-700 | Good grades and passes |
| Grade C | `#B45309` amber-700 | Needs improvement |
| Grade D/F | `#B91C1C` red-700 | Poor / fail |
| Focus ring | `#BE185D` pink-700, 2 px offset | Keyboard focus on every interactive element |

**Rules:**
- One accent only. No second brand colour in the product chrome. (The *buyer's* brand colours appear inside their white-labelled reports — that is their brand, not DealNote's. DealNote's own chrome never takes on the buyer's colours.)
- Grade colours are semantic, muted, and text-safe. Never use bright green/amber/red fills; use coloured text or a thin left border on a white card. Grades are never pink-washed: the A–F letter is always shown next to the number.
- No colour gradients as decoration anywhere, including buttons, headers, and the PDF cover. Solid colours only. One narrow exception: the pricing-card spotlight (see §12) is a faint pink radial wash that follows the pointer, 7% opacity, hover only — a highlight, not a coloured gradient.
- Shadows: one restrained card shadow (`0 1px 2px rgb(29 26 74 / 0.06)`) on plain cards; glass panels use the softer Apple shadow (`0 8px 32px rgb(29 26 74 / 0.08), 0 1px 2px rgb(29 26 74 / 0.06)`). No glow, no drop-shadow text.
- Print: `print-color-adjust: exact` on report templates so the accent and grade colours print as shown. Test the PDF in black-and-white too — grades must still read from their letters (A–F), not from colour alone.

## 3. Type

**Typeface: Inter, throughout (UI, reports, PDF), loaded via `next/font/google` (weights 400/500/600/700).**

**Why Inter, deliberately:** it is designed for user-interface text at small sizes, which is exactly what a dense audit report is — small labels, numbers, and evidence quotes. It renders consistently in Chromium (the PDF renderer), has a full weight range so hierarchy comes from weight and size rather than a second font, and it is open-licence with no cost. One family keeps the report, the app, and the PDF visually identical, and it keeps the PDF font embedding simple (one family, the weights above).

The 27 Nov 2026 audit found Inter was named in the font stack but never loaded, so the site rendered in system-ui while detectors flagged it as Inter. That is fixed in this round by loading it properly via `next/font/google`. A named-but-unloaded font must never be left in the stack.

**Do not use:** Cinzel, Jost (Sortes tokens), any serif display face, any rounded/geometric "friendly" face, or a second font for headings. Hierarchy is weight + size + spacing, not font switching.

**Scale (desktop; mobile scales down one step):**

| Element | Size / weight / line-height |
|---|---|
| Page title (landing H1) | 36 px / 600 / 1.15, letter-spacing −0.02em |
| Section heading (H2) | 24 px / 600 / 1.25 |
| Card heading (H3) | 18 px / 600 / 1.3 |
| Body | 16 px / 400 / 1.6 |
| Small / caption / metadata | 13 px / 400 / 1.5, slate-600 |
| Score numbers (large) | 48 px / 600 / 1, tabular numbers |
| Buttons | 15 px / 600 |
| Report cover title | 30 px / 600 |
| Report body | 14 px / 400 / 1.6 (PDF reads smaller on paper) |

**Rules:**
- Numbers that are compared (scores, timings, counts) always use tabular figures so columns align.
- Maximum line length for reading copy: 68 characters. Landing-page body copy is left-aligned, never centred, except the hero headline block.
- Never set body copy below 14 px on screen, 13 px in PDF. Eyebrows: at most one per page/section, in sentence case, never repeating the heading it sits above. Delete any eyebrow that duplicates its heading (the 27 Nov 2026 audit found 6 uses, including "Proposal templates" above "Proposal templates"). No all-caps tracked kickers above nearly every heading.
- The 650 heading weight is deleted. Headings are 600 (h1/h2/h3). Do not reintroduce 650 or 700 heading weights.
- Evidence quotes (the actual title text, the actual broken URL) are shown in a slate-50 block, 14 px, with the source labelled ("Found on the homepage, 27 Nov 2026"). Evidence is never paraphrased without showing the source text.

## 4. Icons

**Lucide only. Size 18 px, stroke 1.5, violet-slate by default. Icons inherit text colour; pink is used only for primary-action controls, never for decorative section icons.**

**Rules:**
- One icon per control, never icon + emoji, never emoji alone.
- Icons are labels' helpers, not replacements: every icon button has a visible text label or an accessible label; icon-only buttons are limited to close/dismiss.
- Report category icons (fixed set, so the PDF and the app match): Speed — `gauge`; Mobile — `smartphone`; On-page SEO — `search`; Technical — `wrench`; Conversion — `mouse-pointer-click`; Trust/local/social — `shield-check`. Severity: Critical — `alert-octagon`; Fix soon — `alert-triangle`; Nice to have — `info`. Do not invent new category icons per report.
- No custom-drawn icons in v1. No icon fills; stroke only.

## 5. Layout and responsive rules

- **Mobile-first.** Design at 390 px first, then widen. The buyer runs audits from a phone between client visits; the business owner reads the PDF on a phone.
- **No horizontal overflow at 390 px.** No element may exceed the viewport width: tables become stacked definition rows under 640 px, score bars are full-width, the URL input and button stack vertically, and long URLs / broken-link URLs wrap with `overflow-wrap: anywhere`. Test at 390 px on every page before shipping; a horizontal scrollbar is a launch blocker.
- **Container:** max-width 1120 px for the app, 720 px for reading copy (landing body, sample report text). Generous vertical spacing (64–96 px section gaps on desktop, 48 px on mobile).
- **Cards:** white, 1 px violet-200 border, 8 px radius, restrained shadow only. No coloured card backgrounds except pink-50 callouts and lavender evidence blocks.
- **Tables:** header row lavender, 13 px uppercase label, row dividers violet-200, no zebra striping, no coloured fills. A finding row is: severity mark, finding, evidence, fix — in that order.
- **Forms:** labels above inputs, 14 px/600, inputs 44 px tall minimum (touch target), 1 px violet-200 border, focus ring pink-700 2 px. Error text red-700, 13 px, with the field named ("Enter a full URL starting with https://").
- **Buttons:** primary = solid pink-700, white text, 8 px radius, 44 px tall. Secondary = white, 1 px violet-200 border, violet-slate text. Destructive (delete brand profile) = white with red-700 text and border. No gradient buttons, no pill buttons (radius stays 8 px), no uppercase button text. Sakuga buttons (see §14) are the exception: white card, violet ink, pink wedges and check, same 44 px minimum height.
- **Motion:** see §12. Buttons add a 120 ms lift on hover (`translateY(-1px)`) and a press scale (0.98); the shared colour transition stays 120 ms. No `transition-all`.
- **Nav links:** 44 px minimum touch target (padding raised so links reach 44 px tall). The audit found nav links at about 37 px.
- **Equal-card grids:** equal widths only where content is truly parallel (pricing tiers). "How it works" is now a numbered vertical flow, not three equal cards; the numbered steps earn their place in a real sequential flow. The two-column "checks / does not check" pair uses unequal widths.
- **Score display:** one large number + letter grade + a thin horizontal bar (track slate-200, fill accent for the overall score, grade colour for category bars). The letter grade is always shown next to the number so the score reads without colour.

## 6. Hero visual (landing page)

**The hero visual is real product UI built in code, not a stock photo and not a mockup image.**

Build a static, non-interactive rendering of an actual audit result using the real components: a score card (overall grade B, 82/100) for a fictional business, the six category bars with the weights from PLAN.md, and the top 3 findings with evidence. It is the same layout the buyer sees after running an audit, filled with fictional data and labelled "Sample report — fictional business". This does three jobs a stock photo cannot: it shows the buyer exactly what they are buying, it proves the product exists, and it sets the visual standard for the real reports.

**Rules for the hero:**
- Fictional business only (invented name, e.g. "Harbor & Pine Plumbing, Santa Rosa" — invented, not a real business; check it is not real before publishing).
- Clearly labelled SAMPLE on the visual itself.
- No fake customer quotes, no fake logos of real companies, no invented statistics about the product.
- On mobile the hero stacks below the headline; the score card stays fully visible at 390 px with no overflow.

## 7. Logo plan (flat SVG, 2 colours max, no gradients)

**Concept:** a document page (the note) with a folded corner and a check mark. The page is the teardown + proposal; the check is the deal won. It reads at 16 px as a favicon and at 120 px on the report cover without redrawing.

**Construction (for the builder):**
- Canvas 32 × 32, flat, no gradients, no shadows, no strokes thinner than 2 px at that size.
- Colour 1: pink-700 `#BE185D` — the page shape.
- Colour 2: white `#FFFFFF` — the check mark and the three text lines, cut out of the page shape (negative space, not a second fill).
- Page: rounded rectangle, 6 × 4 to 26 × 28, 3 px corner radius, folded top-right corner (a small triangle in the background colour, i.e. the page colour cut away — no third colour).
- Three horizontal lines on the page (white, 2 px tall, 10 px wide, spaced 4 px apart) standing in for the report text.
- Check mark: white, stroke 2.5 px, across the lower half of the page, slightly oversized so it reads at favicon size.
- Wordmark: "DealNote" in Inter 600, slate-900, with no icon lockup variations in v1. The SVG mark + wordmark side by side is the only lockup; never set the wordmark in another typeface.
- The logo never appears on a white-labelled client report. Client reports carry the buyer's logo only. The DealNote mark appears on the app chrome, the landing page, and the sample report cover (labelled as the sample's producer).

**Do not:** add a magnifying glass (says "search tool"), a lightning bolt (says "speed tool"), a roof/house (says "real estate"), or a third colour. If the check mark does not read at 16 px, thicken the stroke before adding anything else.

## 8. Report design (the PDF the client receives)

The report is the product the buyer is judged on, so its design rules are stricter than the app's:

- **Cover:** white, buyer's logo (or brand name in Inter 700 if no logo), business name being audited, "Website Teardown & Proposal" as the document title, "Prepared by [freelancer brand]" and the run date. One pink rule (2 px, full width) under the title. No cover photo, no gradient band.
- **Score page:** overall grade + number, six category bars with weights printed next to each category name, top 3 findings in plain language. One page, no scrolling past the point.
- **Category sections:** one section per category, in the order Speed, Mobile, On-page SEO, Technical, Conversion, Trust/local/social. Each opens with the category name, weight, grade, and score, then findings in severity order (Critical first). Each finding: what was found (with evidence quoted), why it matters (one sentence, lost call/booking/visit), severity, fix (one line). No finding without evidence.
- **Proposal section:** starts on a fresh page, same typography, same header/footer as the teardown. Problem before price. Prices are the freelancer's filled-in values or visible blank placeholders (`$____`) — never a number the tool invented.
- **Header/footer (every page after the cover):** header = buyer's brand name (small, slate-600); footer = "Prepared by [brand] · [date] · Lab measurement on [date]. Scores can vary between runs. This report audits the public homepage only." + page number. No DealNote name anywhere.
- **Page breaks:** never split a finding across pages; never leave a section heading alone at the bottom of a page; tables break only between rows. Test with a 6–10-page report end to end.
- **Sample reports:** the word SAMPLE in pink-700, 13 px, 600 weight, at the top of every page, and fictional data only. On the /sample web page, the SAMPLE stamp appears at the top of the page and in the footer only — not once per section (the audit found 7 stamps on /sample).

## 9. What this design system is NOT

- Not Sortes: no navy/gold/cream, no Cinzel/Jost, no tarot or mystical styling, no dark backgrounds.
- Not a generic SaaS template: no indigo, no gradient hero, no emoji, no stock photos, no "AI-powered" badge, no fake social proof.
- Not a developer tool: no monospace everywhere, no terminal aesthetic, no dark mode in v1. The audience is a business owner reading on a phone, not an engineer reading a log.

## 11. Fixes round — 27 Nov 2026 (what changed, and what stays)

Changed in this round (code in `app/` and `components/`, verified separately by the coordinator):

- Inter loaded via `next/font/google` (weights 400/500/600/700); no named-but-unloaded font left in the stack.
- Heading weights 600 (h1/h2) and 600 (h3); the 650 value deleted; wordmark 600.
- Eyebrows: at most one, sentence case, never repeating the heading.
- Equal-card grids: "How it works" is now a numbered vertical flow; equal widths only where content is truly parallel (pricing tiers).
- Icons inherit text colour (slate-600); teal only for primary-action controls.
- One shared hover transition, 120 ms; no `transition-all`.
- Nav links 44 px minimum.
- `--faint` darkened to `#64748B`.
- SAMPLE stamp on /sample at the top of the page and in the footer only.

Slop re-check round, 27 Nov 2026 (branch `dealnote-fixes-nov27`, after commit `3706d51`):
- H1 shortened to "Paste any business website URL." with the rest moved to the subhead;
  pricing/hero/FAQ staccato triples reworded into plain sentences.
- Middle-dot separators removed entirely (covering-email signature is now three lines).
- SAMPLE stamp exactly once per page (top of /sample; inside the score card on /audit and /).
- Em dashes removed from all rendered copy except two strings inside the frozen payment
  component (`components/audit-ui.tsx`, BuyButton label + checkout message) — those stay until
  the payment freeze lifts.
- `.callout` and `.evidence` inner radius 8px → 6px (nested-radius rule, matching the
  stamp/tag/badge fix).
- Heading order fixed: /audit status/empty-state headings and /templates tier names are h2
  (tier names keep the 18px h3 visual size inline).
- Replicated scores after this round: Briskly-style ~5/100 (only the uniform 8px card rule,
  half-counted — the card style is the documented design system), Jev-style ~1 partial tell
  of 34, est. ~3–5/100 (equal pricing-tier cards only, genuinely parallel content).

Unchanged — the core system stays:

- White/slate pages, one accent deep teal `#0F766E`, Lucide 18 px / 1.5 stroke only, no gradients, no glows, no glass, no emoji, no stock photos, no decorative illustration.
- No Sortes tokens (no navy `#141b2e`, no gold `#d4af37`, no cream `#ede6d6`, no Cinzel, no Jost) and no NoSite indigo.
- Semantic grade colours only (green-700 / amber-700 / red-700), letter grade always shown next to the number.
- One card, one button pair, 8 px radius, restrained shadow only; print `print-color-adjust: exact`.

## 12. Pre-launch design checklist

- [ ] Landing, /audit, /sample, /templates, /terms render with no horizontal overflow at 390 px.
- [ ] Every button and link has a visible focus ring; keyboard-only pass through /audit works.
- [ ] Grade letters (A–F) are legible in a black-and-white print of the sample PDF.
- [ ] Sample PDF is 6–10 pages, no finding split across a page break, SAMPLE on every page.
- [ ] Hero is the real audit UI in code with fictional data, labelled SAMPLE.
- [ ] Logo reads at 16 px (favicon) and 120 px (cover); only 2 colours; no gradients.
- [ ] No emoji, no gradients, no glows, no stock photos anywhere in the app, reports, or landing page.
- [ ] Contrast check: pink-700 on white (6.04:1), violet-slate on white, grade colours on white — all pass AA for their text sizes.
- [ ] Buyer's brand colours render correctly in a test white-labelled PDF (logo, primary, accent) with no DealNote name in the content, footer, share link, or PDF metadata.

## 12. Apple glass + motion — 28 Nov 2026 (Velu's new direction, replaces the old "no glass" rule)

Velu ordered the plain look elevated after the Loop 4 reports: Apple glass style + MotionDev motion, built immediately with no permission gate between report and build. The plain rules above still stand except where this section explicitly replaces them (glass; motion beyond the 120 ms hover).

### Glass

- **Recipe (`.glass` in `app/globals.css`):** `background: rgb(255 255 255 / 0.72)`, `backdrop-filter: blur(20px) saturate(180%)`, `border: 1px solid rgb(255 255 255 / 0.65)`, soft shadow `0 8px 32px rgb(15 23 42 / 0.08), 0 1px 2px rgb(15 23 42 / 0.06)`.
- **Where:** sticky header (translucent white, 80% + blur), hero score card, finding cards, How-it-works step rows, the two "checks / does not check" cards, the pricing card, all /sample content cards.
- **Where NOT:** /terms and /privacy (plain white, opacity fade only), the PDF report templates in `lib/pdf-html.ts` (plain white, untouched), print (the print stylesheet forces plain white cards, no blur, no shadow).
- **Readability guardrails:** dark slate text on light frosted panels only, never over images or busy backgrounds (there are no images behind any panel); contrast stays AA because the text colours did not change. No text over the glass header's blur — the header contains only the wordmark and nav links.
- **Spotlight (React Bits SpotlightCard pattern, adapted):** pricing card only. A faint pink radial wash (`rgb(190 24 93 / 0.07)`, 240px circle) follows the pointer and fades to transparent; it is a hover highlight, not a decorative gradient, and it disappears on touch devices (no pointer) and in print.

### Motion (Motion, npm `motion` 14.14.0, MIT, formerly Framer Motion)

- **Library:** `npm install motion`, imported from `motion/react`. App Router: motion lives in client components only (`components/motion-ui.tsx`, `components/audit-ui.tsx` which is already `"use client"`); server pages import those client wrappers. No `framer-motion` package (deprecated alias).
- **Vetting (28 Nov 2026):** SkillSpector scan of the published 14.14.0 tarball returned CAUTION, score 39, MEDIUM — its single MEDIUM finding is a README badge URL (`api.motion.dev` score badge image in README.md), a false positive: no code in the package transmits data, and the badge is not shipped. The scanner's supply-chain analyzer crashed with its known `InvalidURL` quirk (0% coverage, same failure mode as earlier scans), so the verdict rests on manual checks too: MIT licence, no install/postinstall scripts in the published package, dependencies only `tslib` + `framer-motion` 14.14.0, official motiondivision package from the npm registry. Proceeded on that basis; recorded here so a future loop can re-check.
- **Primitives (`components/motion-ui.tsx`):** `MotionProvider` (`<MotionConfig reducedMotion="user">` in the layout), `Reveal` (fade + 12px rise, 350 ms, once, on scroll into view), `Stagger`/`StaggerItem` (finding cards enter 70 ms apart), `CountUp` (overall score counts 0 to the score in 350 ms), `SpotlightCard` (above).
- **React Bits:** at most 3 components, copy/adapt, no heavy dependency for one effect. Used: CountUp pattern (re-implemented against Motion — the component source tab on reactbits.dev is JS-rendered and could not be fetched from this sandbox) and SpotlightCard pattern (adapted, pink, faint). No gradient text (readability), no other React Bits components. No `three`/`ogl`/`gsap` pulled in.
- **Budgets, all honoured:** every element animates in at most 350 ms; hero stagger is 0 ms / 80 ms delays; nothing autoplays; no looping video; nothing delays the audit form (the hero form is usable during its 350 ms entrance) or the buy path (BuyButton has no entrance animation, only the 120 ms hover/press).
- **Reduced motion:** `<MotionConfig reducedMotion="user">` disables transform/layout animation site-wide for users who ask; CountUp jumps straight to the final value; the CSS fade on /terms and /privacy is disabled by `@media (prefers-reduced-motion: reduce)`; button lift/press is disabled there too.
- **Print/PDF:** motion wrappers carry class `motion-fade`; the print stylesheet forces `opacity: 1, transform: none` on them and hides the spotlight overlay. PDF HTML never imports motion.
- **Bundle cost (measured 28 Nov 2026, `next build` First Load JS):** home 103 kB → 161 kB, /audit 119 kB → 177 kB, /sample 94.1 kB → 152 kB (+58 kB on pages that use Motion); /templates unchanged at 109 kB; /terms and /privacy unchanged at ~87.5 kB (CSS-only fade, no Motion JS). Shared chunks unchanged at 87.3 kB.
- **Screenshot caveat:** `whileInView` reveals start at opacity 0, so a full-page screenshot taken without scrolling photographs below-fold sections blank. That is a capture artifact, not a live defect: scrolling through the page first (as a user does) reveals every section at opacity 1, verified in-browser 28 Nov 2026. The screenshot script scrolls through each page before capturing.
- **Slop re-run (28 Nov 2026, after glass + motion):** Briskly-style ~5/100 and Jev-style ~3–5/100, unchanged from Loop 3. The only new slop-adjacent items are the hover-only spotlight wash and the glass blur, neither of which fires a Briskly/Jev rule in static screenshots; the frozen BuyButton em dash remains the single Jev partial tell.

## 13. Loop 5 — 25-skill polish rules (28 Nov 2026)

All 25 skills from https://recent.design/skills, applied or recorded with evidence in `docs/dealnote-loop5-skills-2026-11-28.md`. Standing rules from this pass:

### Motion tokens (review-animations + userinterface-wiki + apple-design)

- **One shared duration:** `DURATION` 0.25s in `components/motion-ui.tsx`; every element animates in at most 250 ms (Velu's under-400 ms, and under the 300 ms cap). No per-element durations.
- **One shared easing:** `EASE = [0.23, 1, 0.32, 1]` (`cubic-bezier(0.23, 1, 0.32, 1)`) in MotionProvider and CountUp. Never a built-in named easing for entrances.
- **Stagger 40 ms** between siblings (`Stagger` in `motion-ui.tsx`). Resolves the 30–80 ms (STANDARDS), <50 ms (wiki) and ~100 ms (make-interfaces-feel-better) conflict.
- **Transform/opacity only.** Never animate `width`/`height` (layout). ScoreBars use `scaleX` with `transformOrigin: "left"`.
- **One orchestrated entrance:** hero only. Below-fold sections do NOT each fade-and-slide-up (that is a generic AI tell, frontend-design). `Reveal` is used in the hero and nowhere else.
- **Hover motion only where hover exists:** lift/press inside `@media (hover: hover) and (pointer: fine)`.
- **Press feedback:** `:active` scale 0.98 on buttons (apple-design 0.95–0.98).
- **Effect names (animation-vocabulary):** Stagger, Count-up, Fade + rise, Spotlight hover.

### Tokens (oklch-skill + tailwind-design-system + extract-design-system)

- **Colour tokens live in `:root` in `app/globals.css`, in OKLCH, one semantic name per role** (bg, surface, border, text, muted, faint, accent, accent-soft, accent-border, green, amber, red). Same colours as the hex originals, which stay in the `:root` comment. Contrast table in the Loop 5 doc §5 — all AA.
- **Token scope:** `app/globals.css` only. `lib/audit.ts` grade colours and `lib/pdf-html.ts` stay hex (PDF path, hex-only brand-colour regex). One-off inline hex in TSX (icon colours, borders) is not a token and stays.
- **No second styling system.** No Tailwind, no shadcn (DO_NOT_INSTALL, score 100 — see Loop 5 doc §2 row 16). Plain CSS + semantic tokens only.

### Composition (vercel-composition-patterns)

- **No boolean props that switch a variant.** Pass a `children` slot instead (e.g. `ScoreSummary` takes `children` for the SAMPLE stamp, not a `sampleLabel` boolean). A numeric `size` prop is a scale, not a boolean mode — fine.

### Accessibility (web-design-guidelines + ui-skills)

- **Skip link first in the DOM** (`<a href="#main" className="skip-link">` before Header; `<main id="main">`); hidden off-screen until focused.
- **Anchored sections get `scroll-margin-top: 80px`** (sticky header height).
- **Loading states end with "…"** ("Running audit…", "Opening checkout…").
- **Buttons get `touch-action: manipulation`** (no double-tap zoom delay).
- **Headings `text-wrap: balance`, paragraphs `text-wrap: pretty`, links `text-underline-offset: 3px`.**
- **Recorded P3s (not fixed):** `aria-current` on nav links; menu button `aria-expanded` — both need client-component/JS state for a minor screen-reader cue.

### Copy (critique + distill + quieter)

- **H1 is the value proposition, not an instruction:** "Show the prospect what is wrong with their site, then sell the fix."
- **One comparison line, not two captions:** the pricing card carries the SEOptimer anchor once, as a single footnote line ($39/mo, $468/12, checked 28 Nov 2026, example only).
- **Mobile hero:** the score card's category bars are hidden under 640px (`.hero-score.score-bars`) so the steps are not pushed ~2.5 screens down.
- **Pricing card (prototype winner, Checklist-first):** benefits as a 4-item check-icon list, then $49, then BuyButton, then the one-line anchor. The full comparison table was traded for a shorter buy path; no verified figure was lost.

### Prototype discipline (prototype skill)

- Divergent variants live on an isolated, unlinked route with the verbatim picker; the winner is picked against recorded criteria; **the prototype surface is deleted after promotion**. A prototype route must stay static (read `?v=` client-side inside Suspense) — a `searchParams` prop forces dynamic rendering, and on a dynamic route the CSS link only arrives via flight hints, which headless Chrome never inserted (variants rendered unstyled).

## 14. Sakuga VFX controls + pinkish redesign — 28 Nov 2026 (Velu: "make our site design like that color pinkish")

Velu ordered the site redesigned in the Sakuga VFX colours (white paper, lavender, violet line, pink accents) and all twelve Sakuga controls added to the site. This section supersedes the teal-only rule in §2 and the teal references in §§7–8; the old values stay in §11 as history.

### Palette (exact values, OKLCH in `app/globals.css` `:root`, hex in the comment there)

| Token | Hex | OKLCH | Contrast on white |
|---|---|---|---|
| Background | `#FFFFFF` | `oklch(1 0 0)` | — |
| Surface | `#F4F3FC` | `oklch(0.967 0.012 291.3)` | text on it 14.68 |
| Border | `#DDD6FE` | `oklch(0.894 0.055 293.3)` | — |
| Text | `#1D1A4A` | `oklch(0.253 0.086 281.1)` | 16.17 |
| Muted | `#55507A` | `oklch(0.454 0.068 288.8)` | 7.46 |
| Faint | `#6E6890` | `oklch(0.538 0.062 291)` | 5.19 |
| Accent (readable pink) | `#BE185D` | `oklch(0.525 0.199 4)` | 6.04; white on it 6.04 |
| Accent hover | `#9D174D` | `oklch(0.459 0.17 3.8)` | 7.88 |
| Accent soft | `#FDF2F8` | `oklch(0.971 0.014 343.2)` | accent on it 5.53 |
| Accent border | `#F9A8D4` | `oklch(0.823 0.11 346)` | — |
| Sakuga accent (decorative) | `#FF5FA8` | `oklch(0.713 0.205 355.3)` | ~2.9, decorative only |
| Sakuga primary | `#8F8DF7` | `oklch(0.691 0.153 282.5)` | decorative only |
| Sakuga soft / line | `#B8B3FF` / `#5A4FD8` | `oklch(0.799 0.107 286.7)` / `oklch(0.521 0.202 280.4)` | decorative only |

All text colours pass WCAG AA. Grade colours stay green `#15803D` / amber `#B45309` / red `#B91C1C`, always with the A–F letter, never pink-washed. PDFs follow the brand colour: the default brand colour is now pink `#BE185D` (`lib/audit.ts` DEFAULT_BRAND, `lib/pdf-html.ts` fallback), with a pink header/footer rule; PDFs stay clean and printable, no effects in PDFs.

### Sakuga controls (`components/sakuga.tsx`, scripts in `public/sakuga-vfx/`)

- **Source:** https://github.com/finktheartist/sakuga-vfx, commit `c3dabb1`, MIT. SkillSpector scan 28 Nov 2026: score 50, MEDIUM, CAUTION — HIGH findings are AE1 parser-limit false positives on `look.mjs` references, plus one MEDIUM for no declared tool scope; no network/credential/exfiltration findings. Skill installed at `~/workspace/custom-skills/sakuga-vfx/`; the repo's own scripts (`tools/build.mjs`, `tools/test.mjs`, `look.mjs`) are never run. Component files are used exactly as shipped, plain script tags, never split or rewritten.
- **The twelve:** the repo's README says twelve but ships eleven elements; the twelfth gallery card is the button's secondary variant. All eleven elements are wired into real flows (see `docs/dealnote-sakuga-2026-11-28.md` for the per-control table).
- **Loading:** button/toast/tooltip load `afterInteractive` in the layout (every page uses them); the rest load `lazyOnload` per page. Toggle is ~506 KB (43 painted frames) and loads lazily only on /audit and /sample. Scripts are static assets, not webpack bundle: First Load JS grew only +4 kB home, +5 kB /audit, +12 kB /sample, +5 kB /templates (React wrapper code); /terms and /privacy unchanged at 87.5 kB.
- **Recolor:** the page's `:root` `--sk-*` variables win over the core's `:where()` defaults. `--sk-acc` stays Sakuga pink `#ff5fa8` (decorative), `--sk-pri` `#8f8df7`, `--sk-soft` `#b8b3ff`, `--sk-line` `#5a4fd8`, `--sk-ink` `#1d1a4a`. The Sakuga button is a white card with violet ink and pink wedges/check — it does not take the site's solid pink button style, and that is deliberate: it is the Sakuga control, not a restyled native button.
- **Rules:** one sound-effect word per reaction at most (the controls ship their own); effects never carry information the user needs to read; `done()` is called only when the action actually worked (audit run, never a failure); no Sakuga element on /terms or /privacy (simple fade only); no effects in PDFs or print; motion under 400 ms; `prefers-reduced-motion` turns every Sakuga effect off (core behaviour, verified) while state changes still happen.
- **Glass, pink tint:** `.glass` is now `oklch(0.99 0.01 340 / 0.72)` with a lavender border, still dark text on light frosted panels only, never over images or busy backgrounds.
