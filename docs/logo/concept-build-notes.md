# Phase 4 Concept Build Notes — DealNote

> **Canvas & Grid:** `viewBox="0 0 24 24"`, `width="24"`, `height="24"` on a strict integer `24×24` coordinate grid (supersedes the skill's usual `256×256` canvas per Neon's specification).  
> **Colour discipline (Phase 4):** Primary concepts built black-first in pure `#000000` solid fills on a transparent canvas (rendered on `#FFFFFF` white in test/concept sheets). Companion inverted versions use a full-canvas `#181024` background `<rect>` with pure `#FFFFFF` mark geometry. Zero `<text>`, zero strokes, zero gradients, zero filters, zero rasters.

---

## 1. Pre-Build Library Check (Avoiding Recreating Existing Marks)

Before drafting geometry, `scripts/search_library.py` was run against the 1,432-logo reference library for each of the three selected subjects (plus targeted follow-ups to verify related marks):

### Concept A (`Notched Note`): `search_library.py --subject note`
- **Matches (2):**
  - `tiktok-icon.svg` (★ exemplary, pictorial, 3c): chromatic cyan/red/black musical eighth note doubling as a lowercase `d`.
  - `tiktok.svg` (combination/pictorial, 3c): glitch music note beside wordmark.
- **Follow-up (`--query page`, `--query fold`, `google-keep.svg`, `pagekit.svg`, `framer.svg`):**
  - `google-keep.svg` is a yellow rounded vertical rectangle with an attached top-right dog-ear fold triangle and a centered white lightbulb.
  - `pagekit.svg` is a continuous rectangular outline frame with an inner `P` notch.
  - `framer.svg` constructs an `F` from two squares and two 45° triangles touching edge-to-edge.
- **Distinctness verdict:** None of the library marks depict a solid vertical sheet with a cleanly **detached** 45° corner chip floating across an open negative-space void. Concept A explicitly drops the rounded corners, folded-flap triangle, and inner lightbulb/text bars.

### Concept B (`Capital D Folio`): `search_library.py --subject letter-d` & `--subject "letter d"` & `--query "letter d"`
- **`--subject letter-d` matches:** `0` matches (catalog uses spaces in subject tags).
- **`--subject "letter d"` matches (2):**
  - `dashlane-icon.svg` (★ exemplary, letterform, 1c): letter `D` constructed from 6 perspective-skewed vertical rounded pill bars.
  - `disqus.svg` (letterform, 1c): capital `D` centered inside a speech bubble container.
- **Related technique reference (`precursor.svg`, `design-creative` ★ exemplary):**
  - `precursor.svg` builds a lowercase/uppercase `P` by separating a vertical stem bar from a circular open `C`-bowl with a crisp gap.
- **Distinctness verdict:** No library mark builds a full-height capital `D` folio from a flat vertical spine bar separated by a clean vertical channel from an open-sided geometric `D`-bowl (nor uses `D` as an open two-page folio). Our design keeps exact horizontal top/bottom arms and uniform vertical/curved weights on an integer `24×24` grid, avoiding skewed pill arrays (`dashlane-icon`) and speech-bubble containers (`disqus`).

### Concept C (`Clipped Index Tab`): `search_library.py --subject card` (plus `--query "tab"`)
- **`--subject card` matches (6):**
  - `trello.svg` (★ exemplary, pictorial, 3c): two vertical Kanban cards of unequal length inside a rounded blue gradient square tile.
  - `aws-iam.svg`, `aws-cognito.svg`, `aws-kms.svg`: detailed outline ID cards with padlocks, user+checkmark icons, or keys on gradient tiles.
  - `jruby.svg` (cardinal bird) and `parcel-icon.svg` (open cardboard box).
- **Related pink book/tab mark (`storybook-icon.svg`):**
  - Skewed pink rounded book cover using `<mask>` with a top-right notched bookmark ribbon and a white `S`.
- **Distinctness verdict:** None of the library marks depict a flat, sharp-cornered horizontal index card with a top-left beveled file tab bisected by a crisp vertical cut through the center. Concept C eliminates rounded tiles, masks, gradients, inner lines, and bookmark ribbons.

---

## 2. Construction Descriptions (Words First, Before Writing SVG)

### Concept A — `Notched Note` (`docs/logo/concept-a-notched-note.svg`)
- **Mark type:** Pictorial geometric reduction.
- **Ownable detail:** A crisp 45° corner slice cleanly detached up-and-right from the main vertical note silhouette, creating an active negative-space cut rather than a passive dog-ear fold.
- **Grid & Primitives (v1 on `24×24`):**
  - **Overall envelope:** `x ∈ [4, 20]` (width `16`), `y ∈ [2, 22]` (height `20`), aspect `0.80:1`, margins `L=4, R=4, T=2, B=2`, bounding-box fill `55.6%`.
  - **Subpath 1 (Main vertical note body):** `14×18` vertical rectangle covering `x ∈ [4, 18]`, `y ∈ [4, 22]` with a `7×7` 45° chamfer removed from its top-right corner from `(11, 4)` to `(18, 11)`:
    `M 4 4 H 11 L 18 11 V 22 H 4 Z` (5 vertices).
  - **Subpath 2 (Detached corner triangle):** `7×7` right triangle translated `(+2, -2)` along the 45° normal out from the chamfer:
    `M 13 2 H 20 V 9 Z` (3 vertices).
  - **Angles & Gaps:** All edges strictly `0°`, `90°`, and `45°`. Perpendicular separation between parallel 45° lines `x - y = 7` and `x - y = 11` is `4 / √2 ≈ 2.83` units (`1.89 px` at `16px` favicon), engineered to hold crisp white separation at small sizes.

### Concept B — `Capital D Folio` (`docs/logo/concept-b-capital-d-folio.svg`)
- **Mark type:** Letterform / negative-space dual reading (`D` + open two-page proposal).
- **Ownable detail:** An unjoined vertical spine gap separating a solid left folio bar from a continuous-weight open `D`-bowl, allowing both forms to read immediately without a container box.
- **Grid & Primitives (v1 on `24×24`):**
  - **Overall envelope:** `x ∈ [3, 21]` (width `18`), `y ∈ [2, 22]` (height `20`), aspect `0.90:1`, margins `L=3, R=3, T=2, B=2`, bounding-box fill `62.5%`.
  - **Stroke weight unit:** Uniform `4` units (`2.67 px` at `16px`).
  - **Subpath 1 (Left stem / left folio page):** Solid vertical rectangle `x ∈ [3, 7]`, `y ∈ [2, 22]`:
    `M 3 2 H 7 V 22 H 3 Z`.
  - **Spine gap:** `2`-unit clear negative-space channel `x ∈ [7, 9]` (`1.33 px` at `16px`; tested in Phase 5 against a `3`-unit `x ∈ [7, 10]` gap to ensure zero fill-in at `16px`).
  - **Subpath 2 (Curved right bowl / right folio page):** Starts at `(9, 2)`, horizontal top arm to `(11, 2)`, outer semicircle of radius `10` centered at `(11, 12)` passing through `(21, 12)` to `(11, 22)`, horizontal bottom arm to `(9, 22)`, steps up `4` units to `(9, 18)`, horizontal inner arm to `(11, 18)`, inner semicircle of radius `6` centered at `(11, 12)` back through `(17, 12)` to `(11, 6)`, and horizontal return to `(9, 6)` then `Z`:
    `M 9 2 H 11 A 10 10 0 0 1 21 12 A 10 10 0 0 1 11 22 H 9 V 18 H 11 A 6 6 0 0 0 17 12 A 6 6 0 0 0 11 6 H 9 Z`.
  - **Counter & Angles:** Open interior counter is `12` units tall (`y=6..18`) and `8` units deep (`x=9..17`, `10` units from stem). All straights `0°`/`90°`; curves exact circular arcs `r=10` and `r=6`.

### Concept C — `Clipped Index Tab` (`docs/logo/concept-c-clipped-index-tab.svg`)
- **Mark type:** Pictorial geometric reduction (freelancer's desk file).
- **Ownable detail:** A sharp horizontal index-card silhouette with a beveled top-left file tab bisected cleanly by one central vertical cut.
- **Grid & Primitives (v1 on `24×24`):**
  - **Overall envelope:** `x ∈ [2, 22]` (width `20`), `y ∈ [4, 20]` (height `16`), aspect `1.25:1`, margins `L=2, R=2, T=4, B=4`, bounding-box fill `55.6%`.
  - **Subpath 1 (Left card half with top-left file tab):** Covers `x ∈ [2, 11]`, `y ∈ [4, 20]`. Flat top tab `x ∈ [2, 6]` at `y = 4`, sharp `45°` tab shoulder `(6, 4) -> (9, 7)`, flat horizontal deck `x ∈ [9, 11]` at `y = 7`, down to `y = 20`:
    `M 2 4 H 6 L 9 7 H 11 V 20 H 2 Z` (6 vertices).
  - **Vertical center cut:** `2`-unit clear channel `x ∈ [11, 13]` centered at `x = 12` (`1.33 px` at `16px`; checked in Phase 5 for 16px separation and to verify the silhouette clearly reads as one split index card rather than two vertical bars).
  - **Subpath 2 (Right card half):** Sharp horizontal rectangle `x ∈ [13, 22]`, `y ∈ [7, 20]`:
    `M 13 7 H 22 V 20 H 13 Z` (4 vertices).
  - **Angles:** Strictly `0°`, `90°`, and `45°` (`(6,4)->(9,7)`).

---

## 3. Phase 5 Refinement Revisions (`v1` → `v2` / Final)

Following two Phase 5 visual inspection and scale test loops (detailed in `docs/logo/test-results.md`), all three marks were refined on the strict integer `24×24` grid (`-v1.svg` archived alongside `-v2.svg` and un-suffixed finals):

- **Concept A (`Notched Note`, `v2` final):**
  - Enlarged the detached 45° corner slice from `7×7` (`(13,2)-(20,2)-(20,9)`) to `8×8` (`M12 2H20V10Z`, chamfer `M4 4H10L18 12V22H4Z`) while preserving the `(+2,-2)` diagonal separation (`2.83` units perpendicular gap). The larger triangle prevents tip softening at `16px` and lands the chip apex on `x=12` (`8.0px` exact at `16px`).
- **Concept B (`Capital D Folio`, `v2` final):**
  - Widened the spine gap from `2` units (`x=7..9`) to `3` units (`x=6..9`, landing on exact pixel boundaries `4.0..6.0px` at `16px`), moved stem to `x ∈ [2, 6]`, extended top/bottom horizontal arms from `2` to `3` units (`x=9..12`), and centered concentric arcs (`r=10`, `r=6`) at `(12, 12)` reaching `x=22`: `M2 2H6V22H2ZM9 2H12A10 10 0 0 1 22 12A10 10 0 0 1 12 22H9V18H12A6 6 0 0 0 18 12A6 6 0 0 0 12 6H9Z`. Footprint `20×20` (`1.00:1`), `L=2, R=2, T=2, B=2`.
- **Concept C (`Clipped Index Tab`, `v2` final):**
  - Re-proportioned from a tall-halved `20×16` footprint (`9×13` right block) to a true horizontal `22×10` index-card body (`x ∈ [1, 23]`, `y ∈ [8, 18]`) with a `3`-unit top-left beveled tab (`y ∈ [5, 8]`, `M1 5H5L8 8H11V18H1ZM13 8H23V18H13Z`), giving a `3`-unit flat deck (`x=8..11`) before the `2`-unit center cut (`x=11..13`) and optical vertical centering (`T=5, B=6`).

