# DealNote — Design Notes

**Product:** DealNote (white-label website teardown + proposal generator, $49 one-time).
**Date:** 27 Nov 2026. **Status:** Design system only. No code, no build.
**Companion doc:** `PLAN.md` in the same folder. If this file and `PLAN.md` disagree, `PLAN.md` wins on product scope and this file wins on visual decisions.

## 1. Design stance

Clean, plain, businesslike. The buyer sells to local business owners who distrust jargon and hype; the product should look like a well-made business document, not a startup landing page. No AI slop: no gradients, no glows, no glass, no aurora backgrounds, no floating blobs, no emoji anywhere (UI, reports, or marketing), no stock photos, no decorative illustration. Every visual element earns its place by explaining something or by being the product itself.

## 2. Colour

### Accent: deep teal `#0F766E` (Tailwind teal-700)

**Why this colour, deliberately chosen (not a default):**
- The default for this kind of tool is indigo/blue. Indigo says "another SaaS dashboard" and is what every competitor in RESEARCH.md looks like. Teal is distinct in this market without being loud.
- It reads as "go / money / growth" to a sales tool's buyer, which fits a product whose job is winning clients — without using gold (money cliché) or red (alarm, and red already means "fail" in the report grades).
- It prints well. A teardown is a PDF a business owner prints or reads on a phone; teal-700 stays legible on white paper and on screen, where a lighter teal would wash out.
- Contrast: `#0F766E` on white is about 5.0:1, which passes WCAG AA for normal text. That matters because the accent is used for headings, links, and buttons, not just decoration.
- It is not a Sortes token. No navy `#141b2e`, no gold `#d4af37`, no cream `#ede6d6`, no Cinzel, no Jost anywhere in this product.

### Palette (the whole product: app UI, report HTML, PDF)

| Token | Value | Use |
|---|---|---|
| Background | `#FFFFFF` white | Page background everywhere |
| Surface muted | `#F8FAFC` slate-50 | Panels, table header rows, code/evidence blocks |
| Border | `#E2E8F0` slate-200 | Cards, tables, dividers, inputs |
| Text primary | `#0F172A` slate-900 | Headings, body text, scores |
| Text secondary | `#475569` slate-600 | Supporting copy, captions, metadata |
| Text faint | `#94A3B8` slate-400 | Timestamps, "could not check" labels only — never body copy |
| Accent | `#0F766E` teal-700 | Primary buttons, links, active states, score bars, section headings in reports |
| Accent soft | `#F0FDFA` teal-50 | Accent backgrounds (callouts, highlighted rows) |
| Accent border | `#99F6E4` teal-200 | Borders on accent callouts only |
| Grade A/B | `#15803D` green-700 | Good grades and passes |
| Grade C | `#B45309` amber-700 | Needs improvement |
| Grade D/F | `#B91C1C` red-700 | Poor / fail |
| Focus ring | `#0F766E` teal-700, 2 px offset | Keyboard focus on every interactive element |

**Rules:**
- One accent only. No second brand colour in the product chrome. (The *buyer's* brand colours appear inside their white-labelled reports — that is their brand, not DealNote's. DealNote's own chrome never takes on the buyer's colours.)
- Grade colours are semantic, muted, and text-safe. Never use bright green/amber/red fills; use coloured text or a thin left border on a white card.
- No gradients anywhere, including buttons, headers, and the PDF cover. Solid colours only.
- No shadows except one restrained card shadow (`0 1px 2px rgb(15 23 42 / 0.06)`) on elevated cards. No glow, no blur, no drop-shadow text.
- Print: `print-color-adjust: exact` on report templates so the accent and grade colours print as shown. Test the PDF in black-and-white too — grades must still read from their letters (A–F), not from colour alone.

## 3. Type

**Typeface: Inter, throughout (UI, reports, PDF).**

**Why Inter, deliberately:** it is designed for user-interface text at small sizes, which is exactly what a dense audit report is — small labels, numbers, and evidence quotes. It renders consistently in Chromium (the PDF renderer), has a full weight range so hierarchy comes from weight and size rather than a second font, and it is open-licence with no cost. One family keeps the report, the app, and the PDF visually identical, and it keeps the PDF font embedding simple (one family, two weights).

**Do not use:** Cinzel, Jost (Sortes tokens), any serif display face, any rounded/geometric "friendly" face, or a second font for headings. Hierarchy is weight + size + spacing, not font switching.

**Scale (desktop; mobile scales down one step):**

| Element | Size / weight / line-height |
|---|---|
| Page title (landing H1) | 36 px / 700 / 1.15, letter-spacing −0.02em |
| Section heading (H2) | 24 px / 700 / 1.25 |
| Card heading (H3) | 18 px / 650 / 1.3 |
| Body | 16 px / 400 / 1.6 |
| Small / caption / metadata | 13 px / 400 / 1.5, slate-600 |
| Score numbers (large) | 48 px / 700 / 1, tabular numbers |
| Buttons | 15 px / 600 |
| Report cover title | 30 px / 700 |
| Report body | 14 px / 400 / 1.6 (PDF reads smaller on paper) |

**Rules:**
- Numbers that are compared (scores, timings, counts) always use tabular figures so columns align.
- Maximum line length for reading copy: 68 characters. Landing-page body copy is left-aligned, never centred, except the hero headline block.
- Never set body copy below 14 px on screen, 13 px in PDF. Never use all-caps for more than a short label (eyebrow text, max 12 px, letter-spacing 0.08em).
- Evidence quotes (the actual title text, the actual broken URL) are shown in a slate-50 block, 14 px, with the source labelled ("Found on the homepage, 27 Nov 2026"). Evidence is never paraphrased without showing the source text.

## 4. Icons

**Lucide only. Size 18 px, stroke 1.5, slate-600 by default, teal-700 when the icon is the primary action of a control.**

**Rules:**
- One icon per control, never icon + emoji, never emoji alone.
- Icons are labels' helpers, not replacements: every icon button has a visible text label or an accessible label; icon-only buttons are limited to close/dismiss.
- Report category icons (fixed set, so the PDF and the app match): Speed — `gauge`; Mobile — `smartphone`; On-page SEO — `search`; Technical — `wrench`; Conversion — `mouse-pointer-click`; Trust/local/social — `shield-check`. Severity: Critical — `alert-octagon`; Fix soon — `alert-triangle`; Nice to have — `info`. Do not invent new category icons per report.
- No custom-drawn icons in v1. No icon fills; stroke only.

## 5. Layout and responsive rules

- **Mobile-first.** Design at 390 px first, then widen. The buyer runs audits from a phone between client visits; the business owner reads the PDF on a phone.
- **No horizontal overflow at 390 px.** No element may exceed the viewport width: tables become stacked definition rows under 640 px, score bars are full-width, the URL input and button stack vertically, and long URLs / broken-link URLs wrap with `overflow-wrap: anywhere`. Test at 390 px on every page before shipping; a horizontal scrollbar is a launch blocker.
- **Container:** max-width 1120 px for the app, 720 px for reading copy (landing body, sample report text). Generous vertical spacing (64–96 px section gaps on desktop, 48 px on mobile).
- **Cards:** white, 1 px slate-200 border, 8 px radius, restrained shadow only. No coloured card backgrounds except teal-50 callouts and slate-50 evidence blocks.
- **Tables:** header row slate-50, 13 px uppercase label, row dividers slate-200, no zebra striping, no coloured fills. A finding row is: severity mark, finding, evidence, fix — in that order.
- **Forms:** labels above inputs, 14 px/600, inputs 44 px tall minimum (touch target), 1 px slate-200 border, focus ring teal-700 2 px. Error text red-700, 13 px, with the field named ("Enter a full URL starting with https://").
- **Buttons:** primary = solid teal-700, white text, 8 px radius, 44 px tall. Secondary = white, 1 px slate-200 border, slate-900 text. Destructive (delete brand profile) = white with red-700 text and border. No gradient buttons, no pill buttons (radius stays 8 px), no uppercase button text.
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
- Colour 1: teal-700 `#0F766E` — the page shape.
- Colour 2: white `#FFFFFF` — the check mark and the three text lines, cut out of the page shape (negative space, not a second fill).
- Page: rounded rectangle, 6 × 4 to 26 × 28, 3 px corner radius, folded top-right corner (a small triangle in the background colour, i.e. the page colour cut away — no third colour).
- Three horizontal lines on the page (white, 2 px tall, 10 px wide, spaced 4 px apart) standing in for the report text.
- Check mark: white, stroke 2.5 px, across the lower half of the page, slightly oversized so it reads at favicon size.
- Wordmark: "DealNote" in Inter 700, slate-900, with no icon lockup variations in v1. The SVG mark + wordmark side by side is the only lockup; never set the wordmark in another typeface.
- The logo never appears on a white-labelled client report. Client reports carry the buyer's logo only. The DealNote mark appears on the app chrome, the landing page, and the sample report cover (labelled as the sample's producer).

**Do not:** add a magnifying glass (says "search tool"), a lightning bolt (says "speed tool"), a roof/house (says "real estate"), or a third colour. If the check mark does not read at 16 px, thicken the stroke before adding anything else.

## 8. Report design (the PDF the client receives)

The report is the product the buyer is judged on, so its design rules are stricter than the app's:

- **Cover:** white, buyer's logo (or brand name in Inter 700 if no logo), business name being audited, "Website Teardown & Proposal" as the document title, "Prepared by [freelancer brand]" and the run date. One teal rule (2 px, full width) under the title. No cover photo, no gradient band.
- **Score page:** overall grade + number, six category bars with weights printed next to each category name, top 3 findings in plain language. One page, no scrolling past the point.
- **Category sections:** one section per category, in the order Speed, Mobile, On-page SEO, Technical, Conversion, Trust/local/social. Each opens with the category name, weight, grade, and score, then findings in severity order (Critical first). Each finding: what was found (with evidence quoted), why it matters (one sentence, lost call/booking/visit), severity, fix (one line). No finding without evidence.
- **Proposal section:** starts on a fresh page, same typography, same header/footer as the teardown. Problem before price. Prices are the freelancer's filled-in values or visible blank placeholders (`$____`) — never a number the tool invented.
- **Header/footer (every page after the cover):** header = buyer's brand name (small, slate-600); footer = "Prepared by [brand] · [date] · Lab measurement on [date]. Scores can vary between runs. This report audits the public homepage only." + page number. No DealNote name anywhere.
- **Page breaks:** never split a finding across pages; never leave a section heading alone at the bottom of a page; tables break only between rows. Test with a 6–10-page report end to end.
- **Sample reports:** the word SAMPLE in teal-700, 13 px, 600 weight, at the top of every page, and fictional data only.

## 9. What this design system is NOT

- Not Sortes: no navy/gold/cream, no Cinzel/Jost, no tarot or mystical styling, no dark backgrounds.
- Not a generic SaaS template: no indigo, no gradient hero, no emoji, no stock photos, no "AI-powered" badge, no fake social proof.
- Not a developer tool: no monospace everywhere, no terminal aesthetic, no dark mode in v1. The audience is a business owner reading on a phone, not an engineer reading a log.

## 10. Pre-launch design checklist

- [ ] Landing, /audit, /sample, /templates, /terms render with no horizontal overflow at 390 px.
- [ ] Every button and link has a visible focus ring; keyboard-only pass through /audit works.
- [ ] Grade letters (A–F) are legible in a black-and-white print of the sample PDF.
- [ ] Sample PDF is 6–10 pages, no finding split across a page break, SAMPLE on every page.
- [ ] Hero is the real audit UI in code with fictional data, labelled SAMPLE.
- [ ] Logo reads at 16 px (favicon) and 120 px (cover); only 2 colours; no gradients.
- [ ] No emoji, no gradients, no glows, no stock photos anywhere in the app, reports, or landing page.
- [ ] Contrast check: teal-700 on white, slate-600 on white, grade colours on white — all pass AA for their text sizes.
- [ ] Buyer's brand colours render correctly in a test white-labelled PDF (logo, primary, accent) with no DealNote name in the content, footer, share link, or PDF metadata.
