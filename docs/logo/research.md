# Category Research & Word Map — DealNote

---

## 1. Reference Library Search Findings

Searches were executed against the bundled 1,432-logo SVG reference library using `scripts/search_library.py`.

### Closest Industry Summaries

Because `saas-software` is not a catalog industry tag in the library (and `--industry design` maps to `design-creative`), four adjacent sectors were analyzed alongside `design-creative`:

| Industry | Matches | Top Mark Types | Top Colours | Top Techniques | Top Geometries | Exemplary Marks |
|---|---:|---|---|---|---|---|
| `design-creative` (`--industry design`) | 35 | Wordmark (25.7%), Abstract (20.0%), Pictorial (17.1%), Letterform (14.3%) | Mono (31.4%), Multi (28.6%), Blue (20.0%), **Pink (0%)** | Containment (28.6%), Colour segments (20.0%), Dimensional shading (17.1%), Geometric construction (14.3%), Negative space (14.3%) | Circle (22.9%), Square (14.3%), Triangle (14.3%) | `framer.svg`, `precursor.svg`, `figma.svg`, `sketch.svg`, `squarespace.svg` |
| `productivity-collaboration` | 81 | Abstract (25.9%), Combination (19.8%), Letterform (18.5%), Wordmark (14.8%) | Multi (35.8%), Blue (25.9%), Cyan (12.3%), **Pink (0%)** | Containment (27.2%), Colour segments (24.7%), Negative space (22.2%), Modular repetition (14.8%) | Circle (24.7%), Radial (13.6%), Rounded-square (12.3%) | `zendesk-icon.svg`, `atlassian.svg`, `basecamp.svg`, `dropbox.svg`, `trello.svg`, `slack-icon.svg` |
| `marketing-analytics` | 78 | Abstract (32.1%), Combination (23.1%), Pictorial (14.1%), Wordmark (14.1%) | Multi (30.8%), Blue (26.9%), Mono (16.7%), **Pink (0%)** | Containment (24.4%), Colour segments (19.2%), Negative space (17.9%), Modular repetition (17.9%) | Circle (38.5%), Grid-modular (14.1%), Organic (11.5%) | `kissmetrics.svg`, `buffer.svg`, `botanalytics.svg`, `amplitude-icon.svg`, `metabase.svg`, `hubspot.svg` |
| `testing-monitoring` | 89 | Pictorial (27.0%), Abstract (22.5%), Combination (18.0%), Letterform (14.6%) | Blue (27.0%), Multi (23.6%), Red (16.9%), **Pink (1.1%)** | Containment (34.8%), Line-monoline (28.1%), Negative space (18.0%), Gradient (12.4%) | Circle (29.2%), Organic (14.6%), Freeform (13.5%), Square (13.5%) | `loader.svg`, `cucumber.svg`, `codecov.svg`, `playwright.svg` |
| `developer-tools` | 295 | Abstract (24.7%), Pictorial (21.7%), Combination (21.7%), Letterform (10.8%) | Multi (27.8%), Blue (19.3%), Mono (15.9%), **Pink (0.7%)** | Containment (34.2%), Negative space (19.0%), Line-monoline (16.9%), Colour segments (13.6%) | Circle (26.4%), Freeform (15.6%), Organic (14.6%), Square (12.2%) | `pagekit.svg`, `npm-icon.svg`, `snowpack.svg`, `houndci.svg`, `circleci.svg`, `codesandbox.svg` |

**Key strategic takeaway from `--summary` data:**
- Blue and multi-colour icons inside circles or rounded-square containers are overwhelming category wallpaper (~25–39% circles, ~24–35% containment).
- Pink is nearly non-existent (`--primary-color pink` returns only **12 files out of 1,432**, led by `graphql.svg`, `fuchsia.svg`, `modernizr.svg`, `jamstack-icon.svg`, `sass.svg`, `envoy-icon.svg`, `ampersand.svg`). DealNote's `#DB2777` / `#BE185D` palette is an immediate distinction advantage.
- Geometric sans lowercase dominates type (17–31% overall, ~49% of text-bearing marks).

### Subject & Query Searches

| Query | Matches | Notable Results |
|---|---:|---|
| `--subject check` | 15 | `todoist-icon.svg`, `wakatime.svg`, `vitest.svg`, `survicate.svg`, `selenium.svg`, `todomvc.svg`, `proofy.svg`, `unitjs.svg`, `codeception.svg`, `cachet.svg`, `aws-cognito.svg`, `github-actions.svg`, `mparticle-icon.svg` |
| `--subject document` | 3 | `aws-cloudformation.svg`, `aws-documentdb.svg`, `docusaurus.svg` |
| `--subject note` | 2 | `tiktok-icon.svg` (★ exemplary — chromatic offset music note doubling as `d`), `tiktok.svg` |
| `--query page` | 8 | `pagekit.svg` (★), `google-keep.svg`, `pagerduty-icon.svg`, `statuspage.svg`, `pagekite.svg`, `google-calendar.svg`, `aws-codecommit.svg` |
| `--query fold` | 28 | `fastly.svg` (★), `google-keep.svg`, `strapi-icon.svg`, `buildkite-icon.svg`, `visual-studio-code.svg`, `brandfolder-icon.svg`, `haiku-icon.svg` |
| `--query tear` / `audit` / `seal` / `bookmark` | 2 / 0 / 0 / 1 | `doctrine.svg` (★ arrow cut from teardrop), `compass.svg`; `storybook-icon.svg` (pink bookmarked book with `S`) |
| `--query letter D` / `DN` | 80 / 7 | `dashlane-icon.svg` (★ skewed bars forming `D`), `pagerduty-icon.svg`, `delighted-icon.svg`, `designernews.svg` (`DN` in circle) |

### Actual SVG Inspections (Geometry & Technique Notes)

1. **`todoist-icon.svg`** (`subject: check`, `256x256`): Rounded square tile (`rx=32`, `#E44332`) with three white stacked chevron/check bars bleeding off the left edge (`x=0`), clipped via `<clipPath>`. Lesson: repeating one check angle gives rhythm, but relying on a rounded tile container + `<clipPath>` feels app-icon-generic and fails our no-tile-dependency goal.
2. **`google-keep.svg`** (`query: page / fold`, `256x352`): Yellow rounded rectangle with a dog-ear corner (`M168 0 L256 88 H168 Z`) and a white lightbulb (`fill` shape) centered inside. Lesson: almost identical structural cliché to current DealNote (page + dog-ear + inner symbol), proving why a folded-corner rectangle looks like a stock Android note-taking utility rather than a sharp B2B design tool.
3. **`aws-cloudformation.svg`** (`subject: document`, `256x256`): Uses a gradient tile and draws an actual outline document (`width=80`) filled with five 6.4-unit horizontal line slivers beside a cloud. Lesson: literal text-line documents collapse visually below 32 px and look like diagram clipart.
4. **`wakatime.svg`** (`subject: check`, `256x256`): Single black compound `<path>` (`256x256`): thick outer ring (`33.8` unit wall) enclosing a stylized `w` whose two right strokes read as a crisp checkmark. Lesson: single-path solid geometry with clean negative margins reads strongly in 1-colour, though placing a complex glyph inside a thick ring loses inner breathing room at 16 px.
5. **`survicate.svg`** (`subject: check`, `256x202`): Three flat geometric paths — an asymmetric folded ribbon arch over a diamond/triangle eye and a thick 45° angular check stroke (`#E8A824`) acting as a smile. Lesson: breaking a checkmark into crisp 45° mitered bars feels sharper and less clipart than round-capped strokes.
6. **`framer.svg`** (`design-creative` ★ exemplary, `256x384`): One single `<path>` (`#000000`) built strictly on a `128`-unit tessellation grid (`0, 128, 256, 384`): two squares and two 45° right triangles merge into an unmistakable `F`. Lesson: zero curves and pure 45°/90° geometric cuts yield razor-sharp legibility at 16 px and instant authority with web designers.
7. **`pagekit.svg`** (`query: page`, ★ exemplary, `256x320`): One single `<path>` (`#212121`) on an integer grid (`48`-unit frame thickness): a rectangular frame with a single horizontal-vertical inner notch reads as `P` and as a page layout at once. Lesson: implies "page + initial" using just **10 vertices** and zero inner clipart lines.
8. **`precursor.svg`** (`design-creative` ★ exemplary, `256x299`): One `<path>` (`#333333`) combining a `C`-shaped open arc (`r=128`, inner `r=85.3`) and a separate vertical bar (`42.7` wide) to form `P`. Lesson: negative space and an unjoined gap between two pure primitives turn a common letter into an architectural mark.
9. **`dashlane-icon.svg`** (`query: letter D`, ★ exemplary, `256x346`): One `<path>` (`#10363D`) of six perspective-skewed vertical rounded pills arranged along an implied `D` silhouette. Lesson: builds a `D` purely from modular vertical bars with no closed loop, though thin rounded gaps can tighten at 16 px.
10. **`graphql.svg`** (`primary_family: pink`, ★ exemplary, `256x288`): One `fill-rule="evenodd"` `<path>` (`#E535AB`): regular hexagon + inscribed equilateral triangle + six vertex circles. Lesson: shows how electric magenta-pink feels technical, architectural, and authoritative when built from exact geometric rules.
11. **`storybook-icon.svg`** (`query: bookmark`, `256x319`): Pink (`#FF4785`) slightly skewed rounded book silhouette using `<mask>` with a top-right bookmark ribbon and white `S`. Lesson: closest existing pink-book/page mark in the library — explicitly reinforces why DealNote should **avoid** a pink page/book tile with a corner bookmark/tab (`mask` + white-on-pink tile looks too close to Storybook and current DealNote).
12. **`gatsby.svg` & `auth0-icon.svg` & `doctrine.svg`** (★ exemplary negative space): Each uses a single compound `<path>` (true cutouts, zero white paint overlays) where one bold outer silhouette is carved by one geometric void (diagonal bar in `gatsby`, 5-point star in `auth0`, crisp upward arrow in `doctrine`).

---

## 2. Category Clichés — Explicitly Off-Limits

Unless completely reinvented into an unmistakable dual-meaning geometric form, the following category clichés are **off-limits**:

1. **Rounded document / paper sheet with folded dog-ear corner** (the current DealNote mark, Google Keep, AWS CloudFormation, generic file icons).
2. **Miniature horizontal text lines inside a rectangle** (impossible at 16 px; screams "placeholder document icon").
3. **Standalone checkmark inside a rounded square or circle tile** (generic to-do / form-builder / validation badge cliché: Todoist, TodoMVC, Cachet, generic UI icons).
4. **Speedometer / Lighthouse gauge arcs** (overused across web-performance and SEO audit tools).
5. **Magnifying glass over a webpage / chart** (literal "audit/search" clipart).
6. **Sparkles, magic wands, or four-point AI stars** (explicit brief constraint + generic AI-wrapper trope).
7. **Gradient app-icon tiles (`rx=32` / `rx=56`)** (explicit brief constraint; masks weak silhouettes).
8. **Literal rising bar charts, pie wedges, or globe icons** (marketing-analytics / enterprise SaaS wallpaper).
9. **Literal handshake or fountain-pen nib clip art** ("deal" / "proposal" cliché).
10. **SaaS corporate blue (`#0061FF`–`#0385CD`) or multi-hue rainbow gradients** (fails palette equity and category standout).

---

## 3. Word Map (Language → Visual Symbols)

```
CORE INPUTS
  Name:     DealNote  (Deal + Note | initials D, N | "seal the deal" + "margin note")
  Offering: Website teardown + audit + white-label proposal in ~60 seconds
  Tone:     Sharp · Trustworthy · Fast
  Promise:  Turn any prospect's flawed website into a send-ready deal in one minute.
```

### Branching into Nouns, Metaphors & Opposites

- **DEAL** *(closing, agreement, value)*
  - *Nouns:* clasp, dovetail joint, interlocked blocks, hallmark stamp, diamond bevel, angled check/tick, notched tally, seal, bridge, key
  - *Metaphors:* two halves locking cleanly into one whole; a green-lighted confirmation stroke; a precision miter corner
  - *Opposites:* loose ends, scattered puzzle, open fracture
- **NOTE** *(annotation, insight, brief)*
  - *Nouns:* margin callout, editorial bracket `]`, chisel-tip marker, folded tab, bookmark pennant, redline slash, caret `^`, headline bar, sticky flag
  - *Metaphors:* highlighting the exact flaw; a sharp editorial mark in the margin; a concise dispatch
  - *Opposites:* blank canvas, cluttered essay, dense grid
- **TEARDOWN / AUDIT** *(diagnosis, dissection, truth)*
  - *Nouns:* scalpel slice, split frame, architectural blueprint corner, crop mark / viewport bracket, prism, caliper jaw, X-ray notch, diagnostic beam
  - *Metaphors:* slicing open a live site to expose what is broken underneath; peeling back one layer cleanly
  - *Opposites:* surface gloss, opaque wall, guesswork
- **SHARP** *(precision, design-literate, decisive)*
  - *Nouns:* 45° bevel, acute wedge, razor miter, geometric facet, chisel edge, crisp vertex
  - *Opposites:* rounded pill mush, soft cloud, fuzzy blur
- **TRUSTWORTHY** *(credible, B2B-ready, reliable)*
  - *Nouns:* balanced monolith, solid corner pillar, verified notch, anchored square, clean alignment
  - *Opposites:* fragile hairlines, tilted instability, playful wobble
- **FAST** *(60 seconds, immediate)*
  - *Nouns:* forward diagonal shear, split chevron, single continuous fold, kinetic slice, stepped wedge
  - *Opposites:* multi-step maze, heavy frame, stacked layers

### Circled Intersections (High-Signal Concept Territory)

1. **`D` + `Teardown Slice` + `Check Angle`** → A solid architectural **`D`** sliced cleanly at 45°, where the diagonal void or lower facet forms an unmistakable upward check/chevron (merges brand initial + teardown dissection + verified approval with zero box).
2. **`Note` (Margin Callout / Folded Tab) + `Check` + `Fast`** → One crisp geometric ribbon/pennant that turns through a 45° miter into a bold **check/tick**, reading simultaneously as a sharp **note flag** and an **approved deal** (no document outline needed).
3. **`D` + `N` (`DN` Monogram) + `Dovetail / Interlock`** → Two interlocking geometric wedges/strokes (`D` bowl + `N` diagonal shear) locking across a sharp negative-space seam—representing teardown (split) and deal (lock).
4. **`Website Viewport` (Crop Corner / Bracket) + `Teardown Cut` + `N`/`D`** → Minimal architectural viewport brackets or an open square frame sliced diagonally to expose a crisp inner angle (nods to web design craft without drawing a literal browser window).
5. **`Deal` (Diamond/Seal) + `Teardown` (Split Facet) + `Check`** → A faceted geometric seal or diamond-cornered hallmark cleaved by one negative-space slash that resolves into a sharp check wedge.
6. **`Note` (Chisel Stroke / Pen) + `Deal` (Clasp) + `Sharp`** → A bold chisel-cut `D` whose negative counter is a diagonal speech/callout wedge (`Note`) pointing right—turning the initial into an editorial annotation mark.

---

## 4. Candidate Mark Types (per `mark-types.md` §12)

Evaluating the decision guide in order for **DealNote**:
- *Short, distinctive name (8 letters), heavy 16 px favicon / 28 px UI usage, needs an ownable standalone symbol that pairs with a clean wordmark in Phase 7:*

| Candidate Mark Type | Why It Fits DealNote (1-line rationale) |
|---|---|
| **1. Letterform (`D`)** *(primary candidate)* | Anchors the unique initial `D` in a compact 16 px–256 px silhouette while embedding the "teardown cut" or "verified angle" inside the letter's geometry. |
| **2. Negative-Space / Abstract Mark** *(primary candidate)* | Fuses two related ideas (e.g. teardown slice + deal lock, or note callout + check angle) into one unboxed silhouette with high memorability and zero cliché container. |
| **3. Lettermark / Monogram (`DN`)** *(secondary candidate)* | Capitalizes on the structural contrast of `D` + `N` (shared vertical stem + diagonal slash) to create a bespoke agency-grade architectural emblem. |
| **4. Pictorial Reduction (Non-Cliché Object)** *(exploratory candidate)* | Strips an editorial/web-craft sign (bookmark pennant, crop-mark clasp, or chisel-cut tab) to pure 45°/90° primitives so it evokes "note + deal" without drawing a document. |

*(In Phase 4+, any chosen symbol is designed to pair into a **horizontal combination lockup** beside the refined `DealNote` wordmark, while surviving completely standalone at 16 px as `app/icon.svg`.)*
