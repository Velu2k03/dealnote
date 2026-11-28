# Phase 5 Test & Refinement Results — DealNote

> **Method:** Two full test-and-refine loops (`-v1` → `-v2` / finals) using `svg_audit.py`, `preview_sheet.py --name "DealNote" --brand-color "#DB2777" --refs-industry design-creative`, Chrome headless PNG renders (`512`, `128`, `32`, `16` px + inverted `#181024`), and side-by-side HTML scale/header lockup inspection (`docs/logo/scale-header-test.html` beside `Inter 600` `"DealNote"`).

---

## Loop 1 (`-v1` Baseline Build)

### `svg_audit.py` Output (Loop 1)

```text
=== concept-a-notched-note.svg  (244 bytes)
viewBox 0 0 24 24 · aspect 1.0 (square)
colours 1: #000000 · gradients 0 · anchors 10
margins L4.0 R4.0 T2.0 B2.0 · bbox fill 0.556
✔ no issues found
production-readiness score: 100/100 (heuristic)

=== concept-b-capital-d-folio.svg  (314 bytes)
viewBox 0 0 24 24 · aspect 1.0 (square)
colours 1: #000000 · gradients 0 · anchors 16
margins L3.0 R3.0 T2.0 B2.0 · bbox fill 0.625
✔ no issues found
production-readiness score: 100/100 (heuristic)

=== concept-c-clipped-index-tab.svg  (253 bytes)
viewBox 0 0 24 24 · aspect 1.0 (square)
colours 1: #000000 · gradients 0 · anchors 12
margins L2.0 R2.0 T4.0 B4.0 · bbox fill 0.556
✔ no issues found
production-readiness score: 100/100 (heuristic)

=== concept-a-notched-note-inverted.svg  (303 bytes)
viewBox 0 0 24 24 · aspect 1.0 (square)
colours 2: #181024 #ffffff · gradients 0 · anchors 15
margins L0.0 R0.0 T0.0 B0.0 · bbox fill 1.0
· INFO [on-tile] White artwork on a full-canvas tile/container — fine for app icons and avatars; make sure a version without the tile exists for other uses.
production-readiness score: 99/100 (heuristic)

=== concept-b-capital-d-folio-inverted.svg  (373 bytes)
viewBox 0 0 24 24 · aspect 1.0 (square)
colours 2: #181024 #ffffff · gradients 0 · anchors 21
margins L0.0 R0.0 T0.0 B0.0 · bbox fill 1.0
· INFO [on-tile] White artwork on a full-canvas tile/container — fine for app icons and avatars; make sure a version without the tile exists for other uses.
production-readiness score: 99/100 (heuristic)

=== concept-c-clipped-index-tab-inverted.svg  (312 bytes)
viewBox 0 0 24 24 · aspect 1.0 (square)
colours 2: #181024 #ffffff · gradients 0 · anchors 17
margins L0.0 R0.0 T0.0 B0.0 · bbox fill 1.0
· INFO [on-tile] White artwork on a full-canvas tile/container — fine for app icons and avatars; make sure a version without the tile exists for other uses.
production-readiness score: 99/100 (heuristic)
```

### Loop 1 Visual Inspection Findings (What Failed & Why)
1. **Concept A (`Notched Note`, `v1`):** Clean silhouette at `128px` and `32px`, but at `16px` (`scale-header-test-v1.png` 8× pixel zoom) the `7×7` detached corner triangle softened at its apex (`~4.6px` legs) and felt slightly small relative to the `14×18` block.
2. **Concept B (`Capital D Folio`, `v1`):** **16px gap failure/softening** — the `2`-unit spine gap (`x=7..9`) landed on fractional `16px` pixel boundaries (`4.67..6.0px`), creating a greyed, muddied channel in the `16px` pixel test and blurring under the `2px` squint test. The straight horizontal arms (`x=9..11`, `2` units) also felt slightly pinched horizontally.
3. **Concept C (`Clipped Index Tab`, `v1`):** **Form / literal reading failure** — each split half (`9×16` left, `9×13` right) was taller than wide, making the mark read too closely to **two vertical bar-chart columns** (off-limits cliché) rather than a horizontal index card. Also, the `45°` tab shoulder `(6,4)->(9,7)` left only `2` units before the cut, nearly colliding with the center split at `16px`.
4. **Render pipeline note (Loop 1):** Direct Chrome headless screenshots at `--window-size=128,128` via `render_png.py` truncated the lower ~35% of the `128×128` PNGs (`bottom_row_alpha=0`), caught immediately by reading the images. Fixed in Loop 2 by supersampling from verified `512×512` Chrome renders down to `128×128` (4× Lanczos) and verifying full alpha coverage (`255`) on every render.

---

## Loop 2 (`-v2` Refined Build & Final Concept Marks)

### Fixes Applied
- **Concept A (`v2`):** Enlarged the detached 45° chip from `7×7` to `8×8` (`M4 4H10L18 12V22H4ZM12 2H20V10Z`), preserving the `2.83`-unit perpendicular void while snapping the chip start to `x=12` (`8.0px` exact at `16px`).
- **Concept B (`v2`):** Widened the vertical spine gap from `2` to `3` units (`x=6..9`, exact integer pixels `4.0..6.0px` at `16px` and `8.0..12.0px` at `32px`), placed stem at `x=2..6`, extended horizontal arms to `3` units (`x=9..12`), and centered outer/inner arcs (`r=10, r=6`) at `(12,12)` reaching `x=22`: `M2 2H6V22H2ZM9 2H12A10 10 0 0 1 22 12A10 10 0 0 1 12 22H9V18H12A6 6 0 0 0 18 12A6 6 0 0 0 12 6H9Z`.
- **Concept C (`v2`):** Rebuilt as a genuinely wide horizontal card (`x=1..23`, body `y=8..18` = `22×10`, `2.2:1` ratio) with a `3`-unit beveled top-left tab (`y=5..8`, `1..5` flat, `5..8` 45° slope) leaving a clean `3`-unit flat card deck (`8..11`) before the `2`-unit center cut (`11..13`), optically centered slightly high (`T=5, B=6`).

### `svg_audit.py` Output (Loop 2 / Finals)

```text
=== concept-a-notched-note.svg  (245 bytes)
viewBox 0 0 24 24 · aspect 1.0 (square)
colours 1: #000000 · gradients 0 · anchors 10
margins L4.0 R4.0 T2.0 B2.0 · bbox fill 0.556
✔ no issues found
production-readiness score: 100/100 (heuristic)

=== concept-b-capital-d-folio.svg  (314 bytes)
viewBox 0 0 24 24 · aspect 1.0 (square)
colours 1: #000000 · gradients 0 · anchors 16
margins L2.0 R2.0 T2.0 B2.0 · bbox fill 0.694
✔ no issues found
production-readiness score: 100/100 (heuristic)

=== concept-c-clipped-index-tab.svg  (253 bytes)
viewBox 0 0 24 24 · aspect 1.0 (square)
colours 1: #000000 · gradients 0 · anchors 12
margins L1.0 R1.0 T5.0 B6.0 · bbox fill 0.497
· INFO [off-centre-y] Vertical margins differ (top 5.0, bottom 6.0). Remember the optical centre sits slightly above the geometric centre.
production-readiness score: 99/100 (heuristic)

=== concept-a-notched-note-inverted.svg  (304 bytes)
viewBox 0 0 24 24 · aspect 1.0 (square)
colours 2: #181024 #ffffff · gradients 0 · anchors 15
margins L0.0 R0.0 T0.0 B0.0 · bbox fill 1.0
· INFO [on-tile] White artwork on a full-canvas tile/container — fine for app icons and avatars; make sure a version without the tile exists for other uses.
production-readiness score: 99/100 (heuristic)

=== concept-b-capital-d-folio-inverted.svg  (373 bytes)
viewBox 0 0 24 24 · aspect 1.0 (square)
colours 2: #181024 #ffffff · gradients 0 · anchors 21
margins L0.0 R0.0 T0.0 B0.0 · bbox fill 1.0
· INFO [on-tile] White artwork on a full-canvas tile/container — fine for app icons and avatars; make sure a version without the tile exists for other uses.
production-readiness score: 99/100 (heuristic)

=== concept-c-clipped-index-tab-inverted.svg  (312 bytes)
viewBox 0 0 24 24 · aspect 1.0 (square)
colours 2: #181024 #ffffff · gradients 0 · anchors 17
margins L0.0 R0.0 T0.0 B0.0 · bbox fill 1.0
· INFO [on-tile] White artwork on a full-canvas tile/container — fine for app icons and avatars; make sure a version without the tile exists for other uses.
production-readiness score: 99/100 (heuristic)
```

*(Note on Concept C `INFO [off-centre-y]`: intentional `0.5`-unit upward optical centering (`T=5, B=6`) so the `22×10` bottom body balances the top-left tab alongside header text.)*

---

## Final Verdicts Across Scale, Context & Shelf Tests (Loop 2)

| Test | Concept A (`Notched Note`) | Concept B (`Capital D Folio`) | Concept C (`Clipped Index Tab`) |
|---|---|---|---|
| **16px Favicon Verdict** | **PASS** — Solid body and `8×8` detached corner slice hold crisp diagonal separation; strong silhouette in browser tab (`scale-header-test-v2.png`, `concept-a-16.png`). | **PASS (Best at 16px)** — `3`-unit gap (`x=6..9`) snaps to 2 full pure-white pixel columns (`4.0..6.0px`) with zero muddying; stem, bowl, and counter stay unmistakable (`concept-b-16.png`). | **PASS (Tighter gap)** — Reads as a horizontal tabbed card with center split at `16px`; the `2`-unit center cut (`1.33px`) shows mild antialiasing on adjacent pixel columns (`concept-c-16.png`). |
| **32px Header Test Verdict** *(beside Inter 600 `"DealNote"`)* | **PASS** — Bold, high-contrast anchor on both `#FFFFFF` and `#181024`; slightly heavy rectangular mass relative to letterforms. | **PASS (Strongest pairing)** — Stroke weight (`4` units) and curved geometry harmonize cleanly with `Inter 600` (`D DealNote`) on both light and `#181024` surfaces. | **PASS** — Horizontal card silhouette aligns comfortably with the wordmark baseline and sits dead-level with optical `T=5, B=6` offset. |
| **128px / 512px Verdict** | **PASS** — Razor-clean 0°/45°/90° edges; zero wobbles or near-miss angles; irradiation on `#181024` does not close the `2.83`-unit channel. | **PASS** — Smooth circular arcs (`r=10, r=6`), uniform `4`-unit thickness, and clean open folio counter on both `#FFFFFF` and `#181024`. | **PASS** — Reads clearly as a horizontal desk index card with a beveled top-left tab and clean center cut; bar-chart ambiguity from v1 resolved. |
| **Mirror / 180° / Blur Verdict** | **PASS** — Mirrored/180° rotations remain clean geometric notched rectangles; silhouette survives `2px` blur. | **PASS** — Mirrored/180° reads as clean reversed `CI` geometry; `3`-unit spine gap survives `1px`/`2px` squint blur cleanly. | **PASS** — Mirrored/180° shows clean tabbed card geometry; tab step and split survive squint blur. |
| **Shelf / Distinctness Verdict** *(`design-creative`, 11 refs)* | **PASS** — Distinct silhouette alongside `framer.svg`, `basekit.svg`, `sketch.svg`, `figma.svg`, `squarespace.svg`; avoids folded dog-ear clichés. | **PASS (Peer-tier standout)** — Sits naturally beside exemplary studio marks (`framer.svg`, `precursor.svg`) while clearly distinct from `precursor`'s `P` (`D` vs `P`, straight arms vs closed ring). | **PASS** — Unmistakable desk-file geometry; stands apart from circles/badges on the shelf, though simpler/quieter than B and A. |

### Checked Artifacts
- `docs/logo/preview.html` (generated via `preview_sheet.py --refs-industry design-creative --brand-color "#DB2777"`)
- `docs/logo/scale-header-test.html` + screenshots `docs/logo/renders/scale-header-test-v1.png`, `docs/logo/renders/scale-header-test-v2.png`
- `docs/logo/renders/shelf-test-v2.png`
- Individual PNG renders at `512`, `128`, `32`, `16` px and `inverted-128` px under `docs/logo/renders/`
- Preserved v1/v2 iterations: `concept-*-v1.svg` and `concept-*-v2.svg`
