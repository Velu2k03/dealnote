# Design Brief — DealNote (Logo Redesign)

> **Status:** Brief **decided by Neon** (2026-11-28). **Pending checkpoint:** Velu (owner / decision-maker) to review the Phase 6 concept overview and select a direction before any Phase 7 kit assets or production logo replacements (`app/icon.svg`, `public/logo.svg`) are created.

---

## Decision Record

- **Decided by:** Neon in Task mode (`Gemini 4 Neon High`)
- **Chat URL:** `https://gemini.google.com/app/4b48280eb43a59f2`
- **Conversation title:** `"DealNote logo brief - 28 Nov 2026"`
- **Scope note:** This brief supersedes the earlier Phase 1 draft brief wherever they differ. Phases 4–6 stop at the concept checkpoint under `docs/logo/`; no Phase 7 kit or production site file changes are permitted until Velu approves a concept.

---

## Discovery Brief (Verbatim)

> "DealNote is a white-label website teardown and proposal generator built for web design freelancers and small agencies who turn a prospect's public URL into a scored audit and client-ready proposal in about a minute. The brand mark must feel sharp, trustworthy, and fast, grounded in paper, ink, and a freelancer's desk rather than noisy SaaS marketing, and pair cleanly with an Inter wordmark (400-600). The final mark will run in solid #DB2777 or #BE185D on white (and invert cleanly to pure black or white), must remain unmistakable at a 16px favicon, and must work strictly as a single-color flat vector with zero gradients, zero gradient tiles, zero sparkles, zero personal details, and none of the navy, gold, or Cinzel tokens from other products."

---

## Strategic Summary

- **Brand name & casing:** `DealNote` (paired in lockups with an `Inter` 400–600 wordmark)
- **Category & offering:** White-label website teardown and proposal generator turning a prospect's public URL into a scored audit and client-ready proposal in ~60 seconds
- **Audience:** Independent web design freelancers and small agencies with high visual standards who meet the DealNote brand in the browser tab favicon (`16px`), app header (`28x28`–`32x32`), and product interface (end-client PDFs are white-labeled)
- **Brand adjectives:** Sharp, trustworthy, fast
- **Visual grounding:** Paper, ink, and a freelancer's desk rather than noisy SaaS marketing
- **Colour & technical discipline:**
  - Final production mark runs in solid `#DB2777` or `#BE185D` on `#FFFFFF` white and inverts cleanly to pure `#000000` black or `#FFFFFF` white (verified against `#181024` dark ground)
  - Strictly single-color flat vector
  - Must remain unmistakable at a `16px` favicon
  - Phase 4 exploration built black-first (`#000000`) on a strict integer `24x24` grid (`viewBox="0 0 24 24"`), solid fills only, zero `<text>`, zero filters, zero rasters
- **Hard exclusions:**
  - Zero gradients
  - Zero gradient tiles or soft glass blobs
  - Zero sparkles / four-point AI stars
  - Zero personal details
  - None of the navy, gold, or Cinzel tokens from other products

---

## Clichés to Avoid (All Off-Limits)

1. Generic checkmark inside a rounded square tile
2. Magnifying glass / radar / binoculars
3. Speedometer / dial / percentage ring
4. Dog-eared paper sheet with 3 horizontal lines
5. Four-point AI sparkles / stars
6. Upward zigzag arrow / rising bar chart
7. Fountain pen nib / handshake / briefcase
8. Gradient squircle tiles or soft glass blobs

---

## Correction to Neon's Premise (Live Header Audit)

Neon claimed the live header shows no pink check tile, only the dark Inter wordmark. **That claim is factually wrong and must not be repeated.**

- A browser worker checked the live site directly with a 3x enlarged crop and confirmed the pink check tile **is live**: a pink rounded-square tile with a white document/clipboard shape and check mark, rendered at `28x28` to the left of the `DealNote` wordmark.
- Neon's browser evidently could not load the image asset.
- Direct inspection of `app/icon.svg` and `public/logo.svg` in this repository matches the live observation: both files are identical `32x32` SVGs (`567` bytes) containing a `#DB2777` rounded vertical rectangle (`x="6" y="4" width="20" height="24" rx="3"`), a white top-right dog-ear corner triangle, two `8x2` white horizontal bars, and a white stroked checkmark (`stroke-width="2.5"`).
- **Conclusion:** The current mark exists live, and Neon's `"generic checkmark in a rounded square tile"` cliché describes the exact live mark — confirming why it must be replaced.

---

## Equity Audit of Current Mark (`app/icon.svg` & `public/logo.svg`)

### Current Asset Anatomy
- **Files:** `app/icon.svg` and `public/logo.svg` (`viewBox="0 0 32 32"`, `width="32"`, `height="32"`, `567` bytes).
- **Live header usage (`components/site.tsx`):** `28x28` `/logo.svg` beside `DealNote` in `Inter` (`font-weight: 600`, `#181024`).
- **Construction flaws:** White shapes (`path`, `rect`, stroked check `path`) are painted on top of `#DB2777` rather than cut out via `fill-rule="evenodd"` or negative-space subtraction, and the `8x2` bars + corner triangle + stroked check compete inside a `20x24` rectangle, degrading at `16px`.

### Equity Decision Table

| Equity Element | Function / Signal | Verdict | Rationale |
|---|---|---|---|
| **Pink `#DB2777` / `#BE185D` on `#FFFFFF`** | Primary brand color equity; unifies with live UI tokens and stands out in a blue-dominated category | **KEEP (Phase 7 Production)** | Near-zero pink usage (<1%) in adjacent library categories (`design-creative`, `productivity-collaboration`, `marketing-analytics`, `developer-tools`). Explored black-first in Phases 4–6; applied in Phase 7. |
| **Dark ink `#181024` & `Inter` (400–600) wordmark** | Live header typography and inverted/dark-surface anchor | **KEEP (Pairing Target)** | Concept symbols are tested beside `Inter` 600 at `32px` header scale in Phase 5 and against `#181024` in `-inverted.svg` checks. |
| **Paper / ink / desk precision cue** | Anchors "Deal" and "Note" in tactile editorial craft | **REPLACE VIA NEW FORM** | Expressed through clean geometric subtraction (notched corner, split folio, index tab cut) rather than a literal document tile. |
| **Rounded vertical document tile (`rect rx=3`)** | Generic container cliché | **DROP** | Directly triggers the off-limits `"generic checkmark inside a rounded square tile"` cliché. |
| **Dog-ear corner + horizontal bars** | Literal paper/text clipart | **DROP** | Off-limits cliché (`dog-eared paper sheet with 3 horizontal lines`); collapses into visual noise at `16px`. |
| **White-knockout overlay + unexpanded stroke** | Non-portable SVG construction | **DROP** | Replaced by single-color solid vector geometry (`fill-rule="evenodd"` or distinct solid subpaths) that works cleanly in pure `#000000`, `#FFFFFF`, and `#DB2777`/`#BE185D`. |

---

## Assumptions (Explicit)

1. **Brief authority:** Neon's verbatim brief and 10 concepts from `"DealNote logo brief - 28 Nov 2026"` are the binding design direction for Phases 4–6.
2. **Grid override for Phases 4–6:** Concepts are constructed on a strict integer `24x24` grid (`viewBox="0 0 24 24"`) per Neon's specification, superseding the skill's usual `256x256` symbol canvas for these concept SVGs.
3. **Black-first + inverted checks:** Primary concept SVGs (`concept-a-*`, `concept-b-*`, `concept-c-*`) use pure `#000000` solid fills on a transparent canvas so they render cleanly on `#FFFFFF` and pass `preview_sheet.py` / `concept_sheet.py` inversion and background tests; companion `*-inverted.svg` files add an explicit `#181024` full-canvas background `<rect>` with pure `#FFFFFF` mark geometry.
4. **No Phase 7 deliverables yet:** Brand color variants (`#DB2777`/`#BE185D`), outlined `Inter` lockup masters, `app/icon.svg` / `public/logo.svg` replacements, and presentation boards wait until Velu selects one direction at the Phase 6 checkpoint.
5. **Library and competitor check:** No proprietary competitor SVGs were supplied; distinctness is benchmarked against the bundled 1,432-logo SVG reference library (`docs/logo/research.md` + Phase 4 targeted library searches).
