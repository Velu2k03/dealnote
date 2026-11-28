# DealNote — Slop Re-check, Loop 2, 27 Nov 2026

**Product:** DealNote, white-label website teardown + proposal generator, $49 one-time.
**Repo:** `~/workspace/ship-or-die-100k/teardown-generator`, branch `main`, commit `19c3b65`
(Merge dealnote-templates-phase1).
**Live:** https://dealnote-blue.vercel.app — all 6 pages fetched with curl, all HTTP 200
(`/` 47,389 bytes; `/audit` 16,593; `/sample` 45,027; `/templates` 27,167; `/terms` 25,077;
`/privacy` 21,196).
**Scope:** re-ran the check from `docs/dealnote-slop-check-2026-11-27.md` and
`docs/dealnote-slop-recheck-2026-11-27.md` against the live site at main `19c3b65`,
which adds templates Phase 1 (3 proposals + 5 emails, merged after the recheck).
**Mode:** report only. No code changed, no build run, no deploy, no commit, nothing sent
externally. No URL submitted to any external detector; Briskly and Jev rule lists were
replicated locally against live HTML + source + screenshots, as before. No live browser
was used (subagent has none); screenshots reviewed are the existing
`docs/screenshots/phase1-*.png` (audit desktop + mobile, templates desktop + mobile).

## Method note: live HTML counts are inflated by the RSC payload

Next.js embeds a serialized React Server Component payload in the served HTML, so a
plain `grep -o` on live HTML counts most copy strings twice (once rendered, once in
the payload). Rendered counts in this report are therefore taken from **source +
screenshots**, and live HTML is used only for structure (headings, single header/footer,
em-dash contexts, SAMPLE stamp presence). Where a live-HTML count is quoted, it is
labelled as raw HTML, not rendered copy.

## Scores

| Score | Original check | Recheck (ec33765) | Loop 2 (19c3b65, live) |
|---|---|---|---|
| Briskly-style (/100) | ~29 | ~5 | **~5** (unchanged) |
| Jev-style (tells of 34, est. /100) | ~5–6 tells, est. 15–25 | ~1 partial, est. ~3–5 | **~2 tells (1 full + 1 partial), est. ~6–10** |

Briskly is unchanged: Inter is really loaded, the uppercase eyebrow is gone, and the
card rule still half-fires on the uniform white 8px-radius bordered cards (the brief
mandates the 8px card). If the card rule were counted in full because `/templates`
now adds two more equal-card grids, the score would be ~10/100; it is kept at ~5
because the radius is 8px, not shadcn's 2xl, same judgement as the recheck.

Jev went **up** from ~3–5 to ~6–10: the three-card feature grid tell, fixed in the
earlier rounds for `/`, is back in full on `/templates` (3 equal proposal cards +
5 equal email cards), and the em-dash partial is unchanged. Nothing else regressed.

## Severity counts

| Severity | Count |
|---|---|
| HIGH | 0 |
| MEDIUM | 4 (2 new, 2 carried) |
| LOW | 6 (5 new, 1 carried) |
| **Total findings** | **10** |
| Clean / verified-absent checks | 22 (listed in §5) |

---

## MEDIUM

### M-N1. NEW: the three-card feature grid is back, twice, on /templates
- **Where:** `app/templates/page.tsx:164` (`<div className="steps-grid">` wrapping the 3
  proposal cards) and `:215` (same grid wrapping the 5 email cards, rendered 3 + 2);
  `.steps-grid` is `grid-template-columns: repeat(3, 1fr)` (`app/globals.css:135`).
  Visible in `docs/screenshots/phase1-templates-desktop.png` and
  `phase1-templates-mobile.png`: three identical white 8px cards (FileText icon +
  bold name + tagline + Length/Deal/Sections lines + button), then five identical
  email cards (Mail icon + name + purpose + When + Subject lines + button).
- **Rules hit:** Jev "The three-card feature grid" ("Pick the most important thing and
  show it fully instead of equal boxes"); Unslop §7 / signs.md Components (equal cards
  side by side with the same kind of content read as a template).
- **Why it matters:** this is the exact tell the M1 fix removed from `/` ("How it
  works" became a vertical flow). Templates Phase 1 reintroduced it on a new page,
  and doubled it: 8 equal cards in two grids. The proposal cards are arguably
  parallel content (three genuinely different documents), but the email cards are
  not parallel — Cold/Warm/Referral are alternative first touches and Nudge/Breakup
  are follow-ups, yet all five get identical cards. The 3 + 2 wrap on the email grid
  also leaves a visibly uneven second row.
- **Fix:** keep equal widths only for the 3 proposal cards (documented parallel
  exception, as with pricing tiers); restructure the 5 emails as a numbered sequence
  list (1. Cold → 2. Warm / Referral → 3. Nudge → 4. Breakup) or a vertical flow,
  since they are a sequence, not a set of equals.

### M-N2. NEW: the weights / scoring-model sentence is printed twice in audit results
- **Where:** `components/audit-ui.tsx:179` — the ScoreBars caption ("Weights: Speed 20,
  Mobile 15, On-page SEO 20, Technical 15, Conversion 15, Trust, local and social 15.
  This is DealNote's scoring model, not an industry standard. Grades: A 90–100, …")
  — and `app/audit/page.tsx:64` — the disclaimer paragraph, which contains the same
  weights sentence inside a longer "Scores are DealNote's own measurements…" text.
- **Evidence:** both paragraphs are visible one after the other in
  `docs/screenshots/phase1-audit-desktop.png` and `phase1-audit-mobile.png`
  (the weights sentence appears twice in full, back to back, under the score bars).
  Live `/audit` HTML does not show it because the audit result renders client-side
  after "Run audit"; the screenshots are the post-audit state, so they are the
  evidence here.
- **Rules hit:** Unslop §4 (claims/copy repetition); Jev "AI copywriting voice"
  (partial — the copy is specific, but the same sentence is stamped twice in one
  viewport).
- **Fix:** delete the weights sentence from one of the two places (keep it in the
  ScoreBars caption, where it belongs; trim the disclaimer to the "not Lighthouse /
  scores can vary" part only).

### M-N3. CARRIED: em dash still in the BuyButton on every page (frozen payment component)
- **Where:** `components/audit-ui.tsx:55` — `Buy DealNote — $49 one-time`.
  Live HTML: exactly this one em dash per page on `/sample`, `/templates`, `/terms`,
  `/privacy`; 2 per page on `/` and `/audit` (hero/pricing BuyButton + footer
  BuyButton). The second em dash in that file (`audit-ui.tsx:19`,
  `CHECKOUT_NOT_CONFIGURED_MESSAGE`, "Checkout is not connected yet — payment
  opens…") does **not** appear in any live page HTML — it renders only on a
  checkout error.
- **Rules hit:** Jev em-dash tell (AI-copy marker); Unslop §4.
- **Why it matters:** it is now the *only* em dash on the live site, which makes it
  more visible, not less: the same "— $49" string is the most repeated punctuation
  on the site, on the purchase button itself. Unchanged since the recheck because
  the payment component is frozen.
- **Fix:** reword to "Buy DealNote, $49 one-time" (or "Buy DealNote · $49" — no,
  middle dots are also flagged; use a comma) when the payment freeze lifts. One
  string change fixes all 6 pages.

### M-N4. CARRIED (reduced): "30 audits per month" still repeated 4×
- **Where:** `app/page.tsx:32` (hero caption: "Fair-use limit: 30 audits per month."),
  `app/page.tsx:115` (pricing list), `app/terms/page.tsx:14` (pricing terms),
  `app/terms/page.tsx:75` (acceptable-use list). Down from 6 in the recheck (footer
  instance deleted) and 7 before that; the remaining 4 are each the operative
  statement in their own context.
- **Rules hit:** Unslop §4 (claims/copy repetition).
- **Why it matters (partial):** the hero-caption instance is the only one that is
  pure repetition — it restates the pricing card two screens below on the same page.
  The other three are the pricing term, the legal term, and the use rule.
- **Fix:** delete the clause from the hero caption only (`app/page.tsx:32`); keep the
  pricing-list, terms, and acceptable-use instances. That takes it to 3, all
  operative.

---

## LOW

### L-N1. NEW: mobile header wraps to three rows at 390px
- **Where:** `docs/screenshots/phase1-audit-mobile.png` and
  `phase1-templates-mobile.png`: the header shows wordmark on row 1, "Run an audit /
  Sample report" on row 2, "Proposal templates / Terms / Privacy" on row 3 — roughly
  100px of header before any page content. Desktop is one row.
- **Rules hit:** UI-UX Pro Max Layout & Responsive (P5) — navigation should not
  consume the first screen on the primary device.
- **Why it matters:** the primary user is on her phone between client visits; the
  first thing she sees on every page is three rows of navigation. The nav links
  themselves are now 44px+ (L6 fix held), so this is a layout issue, not a target
  issue.
- **Fix:** collapse to wordmark + a compact menu (or wordmark + only "Run an audit")
  under ~640px; keep the full 5-link row for desktop.

### L-N2. NEW: /templates opens with two stacked warning cards before any template
- **Where:** `app/templates/page.tsx:137-152` (amber "No audit findings found" alert,
  h2) and `:154-161` ("Your postal address is missing" alert, h2) — both render
  above the "Proposals: 3 documents, 3 deals" heading on a first visit (no audit run
  yet, no postal address saved). Visible at the top of
  `phase1-templates-desktop.png` and `phase1-templates-mobile.png`.
- **Why it matters:** the first screen of the templates page is two warnings, not
  the product. Both warnings are correct and useful, but they are preconditions,
  not content; a first-time visitor meets failure states before value.
- **Fix:** collapse the two alerts into one quiet line under the H1 (or move them to
  just above the section they affect — findings alert above Proposals, postal alert
  above the CAN-SPAM footer). Do not delete them; they prevent sending a template
  with placeholders in it.

### L-N3. NEW: /templates H1 is followed by two long paragraphs before any template
- **Where:** `app/templates/page.tsx:121-135` — H1 "Proposal templates", then a
  4-line intro paragraph ("3 proposals + 5 emails + editable blocks…") and a second
  4-line legal paragraph ("You are responsible for your own outreach law…"). The
  first template card starts below the fold on desktop and well below it on mobile.
- **Why it matters:** first-impression research (see the companion science report,
  `docs/dealnote-loop2-science-2026-11-27.md`, finding S4) says visual appeal is
  judged in ~50ms and half of new site visits last under 12 seconds; this page
  spends its first screen on preamble. The legal paragraph is important, but it
  does not need to be the second thing on the page.
- **Fix:** cut the intro to one line ("3 proposals + 5 emails. Pick one, fill in
  the blanks, send it.") and move the outreach-law paragraph to just above the
  "Before you send" checklist at the bottom, where it is actionable.

### L-N4. NEW: "Most clients pick the middle tier" is an unsubstantiated claim
- **Where:** `lib/templates.ts:72` — the Redesign proposal's `investmentNote`:
  "Three tiers (Essential / Growth / Premium). Most clients pick the middle tier."
  Rendered on the Redesign card on `/templates` (visible in both phase1 screenshots).
- **Rules hit:** Unslop §4 (invented claims); the site's own standard — "No invented
  figures" — is otherwise kept everywhere else.
- **Why it matters:** DealNote has no clients yet and no data on what they pick; the
  sentence presents a behavioural fact that does not exist. It is also a
  centre-stage / compromise-effect nudge smuggled into a template as if it were a
  fact (see science report finding S6 — the decoy/compromise effect does not
  reliably replicate on realistic pricing pages, so the sentence buys risk without
  proven benefit).
- **Fix:** delete the sentence, or reword to advice the *freelancer* can verify:
  "Offer three tiers; most freelancers find clients pick the middle one." Even
  better: drop it — the tier names already do the work.

### L-N5. NEW: the "Homepage screenshot" card is a dead placeholder in the results flow
- **Where:** visible in both phase1 audit screenshots, between the score bars and
  "Findings (10)": "Homepage screenshot — Screenshot capture is not built in v1.
  Paid reports will include a mobile and desktop screenshot of the homepage. For
  now, the findings above are drawn from the fetched page itself."
- **Why it matters (low):** the copy is honest, and honesty is the site's strength —
  but it is a card that announces a missing feature in the middle of the product's
  core flow, on every audit result. It reads as a TODO shipped to the user.
- **Fix:** delete the card until screenshots ship, or demote it to one caption line
  under the score bars.

### L-N6. NEW: "Trust, local and social" score-bar label wraps mid-phrase at 390px
- **Where:** `phase1-audit-mobile.png`: the sixth score row breaks as "Trust, local
  and / social / weight 15% / 33/100 F" — the label wraps across two lines while
  the other five rows fit on one.
- **Why it matters (low):** cosmetic; the row is still readable, and the grade is
  printed next to the number.
- **Fix:** shorten the label to "Trust & local" (the category key is `trust`; the
  full name can stay in the weights caption).

---

## What was checked and held from the earlier rounds (verified, no change)

| Item | Verification (live HTML + source + screenshots) |
|---|---|
| H1 Inter loaded | `app/layout.tsx:2` `next/font/google`; live HTML contains the `__Inter_` class hash; renders in Inter, not system-ui. |
| H2 eyebrows | One eyebrow left, `app/page.tsx:16`, sentence case ("For web design freelancers and small agencies"), 13px, no `text-transform` (`app/globals.css:48-51`). Only remaining `text-transform: uppercase` is table headers + mobile stacked-table labels (`app/globals.css:95,102`). |
| H3 weights | h1/h2/h3 all 600 (`app/globals.css:33-35`); 0 occurrences of weight 700 in `app/` + `components/` UI code. |
| M1/M2 steps flow | "How it works" is still the vertical `.steps-flow`; `.two-col` still 1.2fr/1fr. |
| M3 CTA arrows | `ArrowRight`: 0 hits in `app/ components/ lib/`. |
| M4 middle dots | `·`: 0 hits in `app/ components/ lib/`. |
| M5 transitions | One shared 120ms hover transition on `.btn` and nav links (`app/globals.css:58,125`), plus `prefers-reduced-motion` handling (`:159`). |
| M6 "Payment coming soon" | 0 hits. |
| M8 teal icons | 0 `color="#0F766E"` icon props; step/tier/category icons use `#475569` (slate-600). Severity icons keep semantic grade colours (correct). |
| L1 glyphs | `✓` and `…`: 0 hits. Progress dots use Lucide `Check`; button reads "Running audit" with `Loader2`. |
| L2 h3 650 | Gone with H3. |
| L4 nested radii | Inner radii 6px (`.callout`, `.evidence`, `.grade-badge`, `.sample-stamp`, `.tag`) inside 8px `.card`s; score bars 4px (`app/globals.css:74-75,105-117`). No nested-radius violation remains. |
| L6 nav touch target | Nav links `padding: 12px 10px` at 15px/1.6 ≈ 48px tall. |
| L7 `--faint` | `#64748B` (slate-500). |
| L3 tinted boxes, L8 score bars | Unchanged, documented correct (muted semantic tints; score bars are data visualisation with letter grades printed). |

## §5. Verified clean — with evidence (live HTML + source)

| Check | Evidence |
|---|---|
| SAMPLE stamp exactly 1 per sample page | Live HTML: `/sample` 1 ("SAMPLE: fictional business, fictional data", `app/sample/page.tsx:13`); `/audit` 1 (ScoreSummary `sampleLabel`, `components/audit-ui.tsx:172`); `/` hero score card 1. No page has 0 or 2+. |
| Skipped headings: none | Live HTML heading order, all 6 pages: exactly one `<h1>` each; h2 always follows h1; h3 only under h2. `/`: h1 + 5 h2 + 14 h3. `/audit` (pre-run state): h1 + 1 h2 ("No audit yet"). `/sample`: h1 + 4 h2 + 11 h3 ("Next step" h3 correctly under h2 "Investment"). `/templates`: h1 + 6 h2 + 8 h3 (tier names are h2, fixed in the recheck). `/terms`: h1 + 10 h2. `/privacy`: h1 + 8 h2. |
| Em dashes in user-facing copy | Only the frozen BuyButton string (M-N3). 0 elsewhere in source (`grep -r '—' app components lib` → 2 hits, both in `components/audit-ui.tsx`, one unrendered). |
| Gradients | 0 in UI source; the only "gradient" hits are comments in `lib/pdf-html.ts` and the PDF routes saying "no gradients". |
| Emoji | 0 (same non-ASCII inventory as before: only `·`, `✓`, `…` in source, and `·`/`✓`/`…` are now all 0 in UI code). |
| Hype words / "Get Started" / "Learn More" / "Trusted by" | 0 hits ("unlock" hits are all the licence-key feature, not marketing copy). |
| Headline wording | H1 is now one short sentence: "Paste any business website URL." (`app/page.tsx:17`); the second clause lives in the subhead. No staccato triple remains ("One payment. No subscription. No per-report fee." → one plain sentence). |
| Footer repeats | Footer is one `<footer>` per page (live HTML: header=1, footer=1 on all 6 pages). Its content repeats on every page by design (description, 6 nav links, "$49 one-time" disclaimer, BuyButton) — noted as L-N4-carried in the recheck; no new repetition added. |
| Screenshot artifact, not a finding | `phase1-templates-desktop.png` shows the site header a second time mid-page. Live HTML has exactly one `<header>` on `/templates` (and on all 6 pages); the header is sticky, so this is a full-page-screenshot stitching artifact, not a live defect. Not counted. |

## Briskly-style score detail (11 rules, weights total 70)

| # | Rule (weight) | Result |
|---|---|---|
| 1 | Inter font (8) | Clean — really loaded via `next/font/google`. |
| 2 | Geist font (6) | Clean. |
| 3 | Purple-to-blue gradient (9) | Clean — 0 gradients. |
| 4 | zinc-950 / slate-950 dark mode (6) | Clean — white throughout, no dark mode. |
| 5 | shadcn-style rounded card (7) | **Half-hit (3.5)** — uniform white 8px cards everywhere, now including two new equal grids on `/templates`; radius is 8px, not 2xl. |
| 6 | Centered hero + Get Started / Learn More (8) | Clean — asymmetric split, left-aligned, no stock CTAs. |
| 7 | All-caps section labels (5) | Clean — one sentence-case eyebrow only. |
| 8 | Floating orbs / glow (6) | Clean. |
| 9 | Generic marketing speak (6) | Clean. |
| 10 | "Trusted by X+ companies" (4) | Clean. |
| 11 | AI builder fingerprint (5) | Clean — hand-written CSS, no Tailwind/shadcn. |

**Replicated Briskly: 3.5/70 ≈ 5/100.** Band 15–40 is "mostly original with a few
defaults remaining"; 5/100 sits well below it. Full-counting the card rule would give
7/70 = 10/100; either way the card style is the entire remaining score.

## Jev-style score detail (34 tells)

| Tell group | Firing tells | Evidence |
|---|---|---|
| Color | None (0/5) | No indigo gradient, no glow dark mode, no rainbow tints beyond the muted semantic set. |
| Type | None | Inter loaded; one sentence-case eyebrow; H1 is a few words now; headings 600. |
| Copy | **1 partial** | Em dash in the BuyButton (M-N3) — the only AI-copy tell left. No hype words, no staccato triples, no invented stats (except L-N4, which is a template-data claim, not page copy). |
| Components | None | Lucide 18px/1.5 only, icons inherit slate-600, SAMPLE reduced to one quiet stamp per page. |
| Layout | **1 full** | Three-card feature grid, back on `/templates` (M-N1) — 3 proposal cards + 5 email cards in equal grids. |

**Replicated Jev read: ~2 of 34 tells firing → estimated 6–10/100**, band 0–39
("Hand-made / Mostly human"). Judgement-based mapping, as before — not a Jev model
score; the real detector also uses a screenshot + vision description, which this run
could not produce (no live browser).

## Fix order (do in this sequence; each item is independent)

1. **M-N2 — Delete the duplicated weights sentence** (one line, `app/audit/page.tsx:64`
   or `components/audit-ui.tsx:179`). Cheapest fix; the duplication is visible on
   every audit result.
2. **M-N1 — Break the /templates equal-card grids.** Restructure the 5 emails as a
   numbered sequence; keep equal widths only for the 3 proposal cards. This is the
   only change that moves the Jev score.
3. **L-N2 + L-N3 — /templates first screen.** Collapse the two alerts into one quiet
   line; cut the intro to one line and move the outreach-law paragraph to the
   checklist. Do with (2) as one templates-page pass.
4. **L-N4 — Delete "Most clients pick the middle tier"** (`lib/templates.ts:72`).
   One sentence.
5. **M-N4 — Delete the "30 audits" clause from the hero caption only**
   (`app/page.tsx:32`).
6. **L-N1 — Mobile header.** Collapse to wordmark + compact menu under ~640px.
7. **M-N3 — Em dash in the BuyButton** (`components/audit-ui.tsx:55`) when the
   payment freeze lifts. One string; fixes all 6 pages at once.
8. **L-N5 + L-N6 — Small audit-page pass.** Delete or demote the "Homepage
   screenshot" card; shorten the "Trust, local and social" label to "Trust & local".
9. **No change:** L3 (semantic tints), L8 (score bars), tier cards equal-width
   (parallel content), the 3 remaining "30 audits" mentions (operative statements).

## Limitations of this run

1. **No live browser.** Judgements are from live HTML (curl), source, and the
   existing `phase1-*.png` screenshots. Mobile behaviour at 390px was judged from
   the screenshots, not from a live render; the Jev screenshot-based tells could
   not be verified visually beyond those four images.
2. **Live `/audit` HTML is the pre-run state.** The audit result (scores, findings,
   proposal generator) renders client-side after "Run audit", so the weights
   duplication (M-N2) is evidenced from the screenshots, not from live HTML.
3. **Briskly/Jev scores are replications**, as in both prior rounds — rule lists read
   as public text and applied by hand. No URL was submitted to any detector.
4. **No Impeccable `detect` run in this loop** (no build was run, per the report-only
   constraint; the recheck's `detect` findings — skipped headings — were re-verified
   as 0 by live-HTML heading order instead).
5. **No new build was run.** Source on disk is main `19c3b65`; live HTML was fetched
   27 Nov 2026 and matches that commit's content (templates Phase 1 present on
   `/templates` and `/audit`).

## Sources applied

- Prior rounds: `docs/dealnote-slop-check-2026-11-27.md`,
  `docs/dealnote-slop-recheck-2026-11-27.md` (method, rule lists, fix history).
- Briskly AI Slop Detector — https://briskly.tools/tools/ai-slop-detector (11 rules +
  weights + score bands).
- Jev AI Slop Detector — https://madewithjev.com/free-tools/ai-slop-detector (34 tells).
- Unslop (Damir Sokolovsky, CC BY 4.0) — signs.md group by group.
- Product brief — `docs/design-notes.md`.
- Live site — https://dealnote-blue.vercel.app (curl, 27 Nov 2026, all 6 pages HTTP 200).
- Screenshots — `docs/screenshots/phase1-audit-desktop.png`,
  `phase1-audit-mobile.png`, `phase1-templates-desktop.png`,
  `phase1-templates-mobile.png`.
