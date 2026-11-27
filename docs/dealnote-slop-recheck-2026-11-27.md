# DealNote — Slop Re-check, 27 Nov 2026

**Product:** DealNote, white-label website teardown + proposal generator, $49 one-time.
**Repo:** `~/workspace/ship-or-die-100k/teardown-generator`, branch `dealnote-fixes-nov27`.
**Base commit:** `3706d51`. **Commit:** `50697eb`.
**Scope:** re-ran the slop check from `docs/dealnote-slop-check-2026-11-27.md` (HIGH 3, MEDIUM 7, LOW 8;
replicated Briskly ~29/100, Jev-style ~15–25/100) against the fixed code at commit `3706d51`,
fixed what was still open, and re-scored. No branch switch, no merge, no deploy, no accounts,
nothing sent externally, no payment code touched, no nosite-leads touched.

## Method

- Local replication of the Briskly AI Slop Detector rules
  (https://briskly.tools/tools/ai-slop-detector, 11 rules, weights total 70) and the Jev-style
  checklist (https://madewithjev.com/free-tools/ai-slop-detector, 34 tells) over `app/`,
  `components/`, `lib/`, `app/globals.css`, and the fresh `next build` output
  (`.next/server/app/*.html`, `.next/static/css/*.css`). No URL was submitted to any external
  detector; no live browser was used.
- Impeccable skill v4.9.2: `impeccable detect` ran twice, once on `app/ components/` source
  (regex-only, 0 findings) and once on the six built HTML pages (see below). No dual-agent
  Assessment B (depth-2 subagent, no sub-agent tool); the critique rubric was applied inline
  as Assessment A in the original check and is not re-derived here.
- Unslop skill (`~/.claude/skills/unslop/`, `references/signs.md`): applied group by group
  (type, copy, components, layout, icons, motion) as a checklist over the same source.
- `npm run build` re-run after every edit round; final build clean (see below).

## Scores, before and after this re-run

| Score | Original check (27 Nov, pre-fix code) | Re-run BEFORE (commit 3706d51) | Re-run AFTER (this commit) |
|---|---|---|---|
| Briskly-style (/100) | ~29 (Inter 8 + cards 7 + caps 5 = 20/70) | ~5 (card rule half-counted, 3.5/70) | ~5 (same; see note) |
| Jev-style (tells of 34, est. /100) | ~5–6 tells, est. 15–25 | ~4–5 tells, est. ~12–18 | ~1 partial tell, est. ~3–5 |

Briskly note: the three rules that made the original 29 are all fixed at 3706d51 except the
card rule, which is unchanged by design. Inter is now really loaded via `next/font/google`
(rule 1 clean, verified: `__Inter_176161` + woff2 in the built CSS). The uppercase eyebrow
is gone (rule 7 clean: one sentence-case eyebrow left, on `/` only). The card rule still
half-fires because the site still uses uniform white 8px-radius bordered cards everywhere;
the M1 fix changed the layout rhythm (vertical steps flow, unequal two-col), not the card
style itself, and the brief mandates the 8px card. Half-counted it is 3.5/70 ≈ 5/100, inside
the original report's expected post-fix band of ~0–7/100. Nothing in this round could move
it further without changing the design system itself, so it is left.

Jev note: the before-count at 3706d51 was 3 firing tells (whole-sentence H1, staccato
triples, em dashes — new, see below) plus 2 partials (SAMPLE repeat, equal tier cards).
After this round only the equal tier cards remain, as a partial: the three pricing tiers on
`/templates` are genuinely parallel content, which is the documented exception. Everything
else is fixed.

## What the re-run found already fixed at 3706d51 (verified, no change needed)

| Item | Verification |
|---|---|
| H1 Inter loaded | `app/layout.tsx` uses `next/font/google`, weights 400/500/600/700, `variable: --font-inter`; built CSS contains `__Inter_176161` and a woff2. |
| H2 eyebrows | One eyebrow left (`app/page.tsx:16`, sentence case, 13px, no `text-transform`); the only remaining `text-transform: uppercase` in `app/globals.css` is table headers + mobile stacked-table labels. |
| H3 weights | h1/h2/h3 all 600; 0 occurrences of weight 700 in `app/` + `components/` CSS/TSX (700 survives only in `lib/pdf-html.ts` PDF styling and in the `next/font` weight list — see "Left" below). |
| M1/M2 equal cards + numbered steps | "How it works" is a vertical `.steps-flow` with numbered `.step-row`s; `.two-col` is 1.2fr/1fr. Equal widths survive only for the genuinely parallel pricing tiers. |
| M3 CTA arrows | `ArrowRight`: 0 hits in `app/ components/ lib/`. |
| M5 transitions | One shared 120ms hover transition on `.btn` and nav links, plus `prefers-reduced-motion` handling. |
| M6 "Payment coming soon" | 0 hits. |
| M8 teal icons | 0 `color="#0F766E"` icon props; step/tier/category icons use `#475569` (slate-600). Severity icons keep semantic grade colours (red/amber), which is correct. |
| L1 glyphs | `✓` and `…`: 0 hits. Progress dots use Lucide `Check` at 18px/1.5; button reads "Running audit" with the `Loader2` spinner. |
| L2 h3 650 | Gone with H3. |
| L4 inner radius | `.grade-badge`, `.sample-stamp`, `.tag` already 6px inside 8px cards. |
| L6 nav touch target | Nav links `padding: 12px 10px` at 15px/1.6 line-height ≈ 48px tall. |
| L7 `--faint` | `#64748B` (slate-500). |
| L3 tinted boxes, L8 score bars | Left as-is per the task and the original report: muted semantic tints; score bars are data visualisation with letter grades printed. |

## What was still open at 3706d51 and is fixed in this round

| Item | Before | Fix |
|---|---|---|
| M4 middle-dot meta strings | 2 lines left, both in `app/templates/page.tsx`: the covering-email signature `[Phone] · [Email] · [Website]` (in the copy-to-clipboard string and in the rendered preview). ScoreSummary caption and footer dots were already fixed. | Signature is now three separate lines (`[Phone]`, `[Email]`, `[Website]`) in both the copied text and the preview. Middle-dot count in `app/ components/ lib/`: 2 → 0. |
| M6 repetition (residual) | "30 audits per month" 7× (hero caption, pricing list, FAQ, terms ×2, footer, API message). | Dropped the footer instance only — the footer restated the pricing card verbatim. Count: 7 → 6. The rest are each the operative statement in their own context (pricing terms, FAQ answer, legal terms, API message) and stay. |
| M7 SAMPLE stamp | `/sample`: 2 stamps (top + "Next step" card). `/audit`: 2 stamps stacked (page-level stamp + `ScoreSummary` `sampleLabel` stamp). | Removed the "Next step" card stamp on `/sample` and the page-level stamp on `/audit` (the `ScoreSummary` stamp inside the card stays). Exactly 1 visible stamp per page now: `/sample` top, `/audit` in the score card, `/` hero in the score card. |
| L5 headline + staccato copy | H1 was two full sentences at 36px/600. "One payment. No subscription. No per-report fee." appeared as a staccato triple in the hero caption, the pricing card, and the FAQ. | H1 is now "Paste any business website URL." — the second clause moved to the subhead. Pricing line is one plain sentence ("One payment of $49, with no subscription and no per-report fee."). Hero caption and FAQ answer reworded into flowing sentences. Staccato-triple count: 3 → 0. |
| L4 residual (new in this re-run) | `.callout` and `.evidence` still had 8px radius while sitting inside 8px `.card`s (the stamp/tag/badge radii had been fixed, these two had not). | Both dropped to 6px in `app/globals.css`. |
| NEW: em dashes in rendered copy | 15 hits in `app/ components/ lib/` at 3706d51; the original check recorded 0, so these were introduced by the fixes round's new copy (OG alt text, pricing caption, checklist items, terms, audit-page copy, covering-email placeholders). Jev flags em dashes as an AI-copy tell. | 13 of 15 replaced with commas, periods, or colons (exact replacements, no meaning changed). Remaining 2 are in `components/audit-ui.tsx` — see "Left" below. Em-dash count outside that file: 0. Built-HTML check confirms the only remaining rendered em dashes come from that one frozen file. |
| NEW: skipped headings (Impeccable `detect` on built HTML) | `/audit`: h1 "Run a teardown" → h3 "No audit yet" (and the same pattern in the transient "Running the audit" / "Audit could not read that page" cards). `/templates`: h1 → h3 tier names. | Promoted the three `/audit` status/empty-state headings h3 → h2, and the three tier names h3 → h2 with the h3 visual size preserved inline (`fontSize: 18, lineHeight: 1.3`) so the card design is unchanged. `impeccable detect` skipped-heading findings: 2 → 0. |

## Impeccable `detect` on built HTML

- Before the heading fix: 11 anti-patterns (2 skipped-heading, 3 cramped-padding, 6 flat-type-hierarchy).
- After: 8 anti-patterns, all in two categories that are detector artifacts, not real findings:
  - `flat-type-hierarchy` (5 pages): the detector could not read the linked stylesheet
    (it warns on every file) and therefore reads every role as 16px. Real CSS: h1 36px, h2 24px,
    h3 18px, body 16px. Not a finding; the type scale is the documented design system.
  - `cramped-padding` (3 sections on `/`): same cause — without the stylesheet the detector
    sees no inset. Real CSS: `section { padding: 64px 0; }`, `.container { padding: 0 20px; }`.
    Not a finding.
- Source-only `detect` (`app/ components/`): 0 findings (regex-only, undercount — the built-HTML
  run above is the real one).

## Left with reason

- **L3 tinted boxes, L8 score bars:** unchanged, documented correct (muted semantic tints;
  score bars are the product's data visualisation with letter grades printed).
- **2 em dashes in `components/audit-ui.tsx`:** the BuyButton label "Buy DealNote — $49
  one-time" and the `CHECKOUT_NOT_CONFIGURED_MESSAGE` ("Checkout is not connected yet —
  payment opens…"). Both live in the frozen payment component; the task forbids touching
  payment code, so they stay. They are the only rendered em dashes left on the site (they
  appear in the footer BuyButton on every page). Fix by rewording those two strings when the
  payment freeze lifts.
- **`lib/pdf-html.ts` 700 weights + uppercase tracked `.brand`:** PDF report styling, not web
  UI. `docs/design-notes.md` §8 prescribes the cover brand in Inter 700; the PDF is a printed
  document with different conventions. Left; revisit only if the PDF gets its own slop pass.
- **Briskly card rule (half, ~5/100):** uniform 8px white cards are the documented design
  system; changing the card style to chase the last 3.5 points would break the brief.
- **"30 audits per month" 6 remaining mentions:** each is the operative statement in its own
  context (see M6 above). Further cuts would remove information, not repetition.
- **Tier cards stay equal-width:** genuinely parallel content; the documented exception.

## Files changed (this round)

- `app/page.tsx` — H1 shortened, subhead extended, hero caption / pricing line / FAQ reworded, em dash in pricing caption fixed.
- `app/layout.tsx` — em dashes in OG alt text and tracker TODO comment fixed.
- `app/templates/page.tsx` — signature middle dots → separate lines (copy string + preview), 3 em dashes fixed, tier names h3 → h2 (visual size preserved).
- `app/audit/page.tsx` — duplicate SAMPLE stamp removed, 2 em dashes fixed, 3 status headings h3 → h2.
- `app/sample/page.tsx` — per-section SAMPLE stamp removed.
- `app/terms/page.tsx` — 2 em dashes fixed.
- `components/footer.tsx` — "30 audits" clause removed from the footer paragraph.
- `app/globals.css` — `.callout` and `.evidence` radius 8px → 6px.
- `docs/design-notes.md` — §11 addendum recording this round.
- `docs/dealnote-slop-recheck-2026-11-27.md` — this file.

No files under `app/api/`, `lib/` (licence/checkout/webhook/PDF), or nosite-leads were touched.
`git diff --stat` at commit time: 10 files, all in the list above.

## Build result

`npm run build` clean, twice (once after the copy fixes, once after the heading fixes).
Zero type errors. Routes: 6 pages (`/`, `/audit`, `/sample`, `/templates`, `/terms`, `/privacy`)
+ 6 dynamic API routes, unchanged from the fixes round. No dev server was run.

## Unslop signs.md pass (summary)

Type: Inter now really loaded; headings 600; one sentence-case eyebrow; no uppercase
tracked kickers in UI. Copy: no hype words, no "Get Started / Learn More", no em dashes
outside the frozen payment component, no emoji, H1 now a few words with the rest in the
subline. Components: Lucide 18px/1.5 only, icons inherit slate-600, no announcement pills,
SAMPLE reduced to one quiet stamp per page. Layout: asymmetric hero split, vertical steps
flow, unequal two-col, equal widths only for parallel tiers. Colour: white/slate + deep teal
`#0F766E` only, no gradients/glows, no Sortes tokens, no NoSite indigo. Motion: one shared
120ms hover transition, reduced-motion handled. Remaining known gap is the frozen
payment-component copy (2 em dashes) and the half-counted Briskly card rule, both
documented above.
