# DealNote — Slop Re-check, Loop 4, 28 Nov 2026

**Product:** DealNote, white-label website teardown + proposal generator, $49 one-time.
**Repo:** `~/workspace/ship-or-die-100k/teardown-generator`, branch `main`, commit `d331073`
(Loop 3 fix report: live verification 28 Nov 2026, merge `1ce3e47`).
**Live:** https://dealnote-blue.vercel.app — all 6 pages fetched with curl, all HTTP 200
(`/` 49,769 bytes; `/audit` 17,788; `/sample` 52,096; `/templates` 38,747; `/terms` 26,419;
`/privacy` 22,494). Byte sizes are **identical** to the Loop 3 fix report's live
verification, confirming the live site is the audited commit.
**Scope:** re-ran the check from `docs/dealnote-slop-check-2026-11-27.md`,
`docs/dealnote-slop-recheck-2026-11-27.md`, and `docs/dealnote-loop2-slop-2026-11-27.md`
against the live site at main `d331073` plus source.
**Mode:** report only. No code changed, no build run, no deploy, no commit, nothing sent
externally. No URL submitted to any external detector; Briskly and Jev rule lists were
replicated locally against live HTML + source + screenshots, as before. No live browser
was used (subagent has none); screenshots reviewed are the existing
`docs/screenshots/loop3fix-*.png` (see Screenshot note below).

## Method note: live HTML counts are inflated by the RSC payload

As in Loop 2, Next.js embeds a serialized React Server Component payload in the served
HTML, so a plain `grep -o` on live HTML counts most copy strings twice (once rendered,
once in the payload). Rendered counts in this report are therefore taken from **source +
screenshots**, and live HTML is used only for structure (headings, single header/footer,
em-dash contexts, SAMPLE stamp presence). Where a live-HTML count is quoted, it is
labelled as raw HTML, not rendered copy.

## Screenshot note: no fresh loop4 screenshots taken

Fresh `loop4-slop-*.png` screenshots were attempted with the repo's puppeteer script
(`scripts/shot-loop3fix.mjs`, copied to `/tmp`, output prefix changed to `loop4-slop-`).
The headless Chrome run failed with `net::ERR_TUNNEL_CONNECTION_FAILED` against the
live site: this VM's egress proxy is not wired into that script, and the script's
working route is a local server (`http://127.0.0.1:3105`), which would have needed a
fresh `next build` + serve. Per the report-only constraint no build was run, so no
fresh screenshots were produced. The temporary script copy was deleted afterwards;
`git status` is clean.

Instead, `docs/screenshots/loop3fix-*.png` were reused as current evidence. They were
taken after the Loop 3 fixes from the exact build now live (live HTML byte sizes match
the Loop 3 fix verification exactly), and the pages reviewed here
(`loop3fix-home-1280.png`, `loop3fix-home-390.png`, `loop3fix-templates-390.png`,
`loop3fix-sample-1280.png`, `loop3fix-audit-390.png`) all show the post-Loop-3 state
(28 Nov footer, bracket brand placeholders, fixed email subjects, hero URL form,
one-row mobile header). **Warning for future loops:** `docs/screenshots/loop3-live-*.png`
are PRE-Loop-3-fix (they still show the fake `Re:` subjects, the Alex Rivera brand
placeholders, and a 27 Nov footer) and must not be used as current evidence.

## Scores

| Score | Original check | Recheck (ec33765) | Loop 2 (19c3b65, live) | Loop 4 (d331073, live) |
|---|---|---|---|---|
| Briskly-style (/100) | ~29 | ~5 | ~5 | **~5** (unchanged) |
| Jev-style (tells of 34, est. /100) | ~5–6 tells, est. 15–25 | ~1 partial, est. ~3–5 | ~2 tells, est. ~6–10 | **~1 partial tell, est. ~3–5** |

Briskly is unchanged: Inter is really loaded, the uppercase eyebrow is gone, and the
card rule still half-fires on the uniform white 8px-radius bordered cards (the brief
mandates the 8px card). If the card rule were counted in full, the score would be
~10/100; it is kept at ~5 because the radius is 8px, not shadcn's 2xl, same judgement
as the recheck and Loop 2.

Jev went **down** from ~6–10 to ~3–5: the three-card feature grid tell, back in Loop 2
on `/templates`, is gone again (Loop 2 fixes restructured the page into a vertical flow
plus a numbered sequence; verified below). The only remaining tell is the em-dash
partial in the frozen BuyButton, unchanged since the recheck.

## Severity counts

| Severity | Count |
|---|---|
| HIGH | 0 |
| MEDIUM | 1 (carried, frozen) |
| LOW | 2 (both new) |
| **Total findings** | **3** |
| Clean / verified-absent checks | 24 (listed in §5) |

---

## MEDIUM

### M-N3 (carried). Em dash still in the BuyButton on every page (frozen payment component)
- **Where:** `components/audit-ui.tsx:55` — `Buy DealNote — $49 one-time`.
  Live HTML em-dash contexts (raw, deduplicated): exactly this one string on every page.
  Rendered count: 2 on `/` (pricing card + footer) and `/audit` (licence card + footer),
  1 on `/sample`, `/templates`, `/terms`, `/privacy` (footer only). The second em dash
  in that file (`audit-ui.tsx:19`, `CHECKOUT_NOT_CONFIGURED_MESSAGE`, "Checkout is not
  connected yet — payment opens…") does **not** appear in any live page HTML — it
  renders only on a checkout error. Non-ASCII scan of `app/`, `components/`, `lib/`
  finds exactly these 2 em dashes and nothing else (`·`, `✓`, `…` are all 0).
- **Rules hit:** Jev em-dash tell (AI-copy marker); Unslop §4.
- **Why it matters:** it is now the *only* em dash and the only Jev tell left on the
  live site, which makes it more visible, not less: the same "— $49" string is the most
  repeated punctuation on the site, on the purchase button itself. Unchanged since the
  recheck because the payment component is frozen.
- **Fix:** reword to "Buy DealNote, $49 one-time" when the payment freeze lifts. One
  string change fixes all 6 pages at once.

---

## LOW

### L-N7. NEW: sample data and the competitor price still carry 27 Nov dates while the site says 28 Nov
- **Where:** `app/sample/page.tsx:24` ("Prepared by [Your studio], [Your name],
  [your email]. Run date: 27 Nov 2026."), `app/sample/page.tsx:143` ("Lab measurement
  on 27 Nov 2026."), `lib/audit.ts:214` (`fetchedAt: "27 Nov 2026"` — the sample audit
  shown in the `/` hero card, "Run on 27 Nov 2026"), `app/page.tsx:132` ("SEOptimer
  White Label, $39/mo on its public pricing page, checked 27 Nov 2026.").
  Visible in `loop3fix-home-390.png`, `loop3fix-home-1280.png`, and
  `loop3fix-sample-1280.png`, next to footers that now read "Last updated 28 Nov 2026".
- **Why it matters (low):** every instance is explicitly dated, and the pricing line
  adds "Example only. Compare current prices before you buy. No guarantee of client
  wins." — so this is honest, not deceptive. It reads one day stale: the sample is the
  site's proof artifact, and its run date is now behind the site's own update date.
  The 27 Nov dates are the sample audit's genuine run date, so they are arguably
  correct as-is; the competitor price is the one that genuinely ages.
- **Fix:** re-check the SEOptimer price and bump its date (or drop the date to just the
  price with the existing disclaimer); leave the sample run date alone unless the
  sample is re-run. One line either way.

### L-N8. NEW: "60-second checklist" is an unmeasured time estimate
- **Where:** `app/templates/page.tsx:302` — `<h2>Before you send: 60-second checklist</h2>`.
  Visible in `loop3fix-templates-390.png`. The checklist has 6 items, all short
  ("The subject line matches the body", "The footer has your real name…", etc.),
  each with a Lucide `CheckSquare` icon (`app/templates/page.tsx:307`).
- **Why it matters (low):** "60-second" is a number nobody measured; it sits on the
  same page whose checklist proudly claims "no invented figures". As a label for six
  short checks it is plausible and harmless, and it is not a claim about the product —
  but it is the only unmeasured number on the page, and the page's own standard invites
  the question.
- **Fix:** drop the number ("Before you send: checklist") or time a real read-through
  and keep the number only if it holds. One heading either way.

---

## What was checked and held from the earlier rounds (verified, no change)

| Item | Verification (live HTML + source + screenshots) |
|---|---|
| M-N1 (Loop 2) three-card grid, FIXED in Loop 2 | `/templates` has no equal-card grid: 8 proposals in a vertical `.steps-flow` (`app/templates/page.tsx:154-156`, `.step-row` rows), 8 emails as a numbered `<ol>` sequence (`:205-207`, `step-num` 1–8). `.steps-grid` CSS deleted in Loop 3 (0 hits in `app/ components/`). `/` still has the vertical steps flow and the unequal `.two-col` (1.2fr/1fr, `app/globals.css:173`). "What a teardown finds" is a vertical `IssueList` stack (`app/page.tsx:107-109`), not a grid. Desktop `loop3fix-home-1280.png` confirms: asymmetric hero split, vertical flows, single pricing card, unequal two-col. |
| M-N2 (Loop 2) weights duplication, FIXED in Loop 2 | Exactly one `Weights:` in the codebase: `components/audit-ui.tsx:180` (ScoreBars caption: "Weights: Speed 20, Mobile 15, On-page SEO 20, Technical 15, Conversion 15, Trust & local 15."). The `/audit` disclaimer no longer contains it (checked `app/audit/page.tsx:55-75` region; the disclaimer text lives in the ScoreBars caption only). |
| M-N4 (Loop 2) "30 audits per month", reduced 4 → 3 | Rendered mentions: `app/page.tsx:125` (pricing list, "30 audits a month fair-use limit, about $1.63 per audit"), `app/terms/page.tsx:14` (pricing terms), `app/terms/page.tsx:78` (acceptable-use list). Hero-caption instance stays deleted. All three are the operative statement in their own context. Live raw counts (home 2, terms 4) are the RSC-payload doubling of the same rendered instances. |
| L-N1 (Loop 2) mobile header 3 rows, FIXED in Loop 2 | Header is 4 links (`components/site.tsx:4-9`: Run an audit, Sample report, Proposal templates, Terms; Privacy removed in Loop 3, footer-only). Under 640px the links live in a native popover behind a Menu button (`components/site.tsx:25-42`, `app/globals.css:133-160`); `.menu-button { display: none; }` on desktop (`:133`). `loop3fix-home-390.png`, `loop3fix-templates-390.png`, `loop3fix-audit-390.png` all show a one-row header (wordmark + Menu). |
| L-N2 (Loop 2) templates warnings first, FIXED in Loop 2 | The two alert cards now render below the email list (`app/templates/page.tsx:255-272`), above the CAN-SPAM footer section — confirmed in `loop3fix-templates-390.png` (alerts appear after email 8, before the CAN-SPAM footer). First screen is H1 + one-line intro + workflow steps + "Proposals: 8 documents, 8 deals". |
| L-N3 (Loop 2) templates long preamble, FIXED in Loop 2 | Intro is one line: "8 proposals + 8 emails. Pick one, fill in the blanks, send it." (`app/templates/page.tsx:122`). The outreach-law paragraph moved to just above the checklist (`:295-298`). Confirmed in `loop3fix-templates-390.png`. |
| L-N4 (Loop 2) "Most clients pick the middle tier", FIXED in Loop 2 | 0 hits in `app/ components/ lib/`. |
| L-N5 (Loop 2) "Homepage screenshot" placeholder card, FIXED in Loop 2 | 0 hits for "screenshot capture" / "not built in v1" in `app/ components/ lib/`. |
| L-N6 (Loop 2) "Trust, local and social" label wrap, FIXED in Loop 2 | Label is now "Trust & local" (`components/audit-ui.tsx:181`, `lib/analyze.ts:216` comment). Visible on one line in `loop3fix-home-390.png` and `loop3fix-home-1280.png`. |
| Loop 3 fixes, verified | Quick-Fix default: `app/audit/page.tsx:90-91` (`useState("quickfix")`, `defaultSections("quickfix")`). Cold subjects now 5 words: `lib/templates.ts:236-238` ("3 quick wins for [Business]", "Your website: 3 quick wins", "[Business] website quick audit"). No fake `Re:` subjects: Day 3 is "Your website review" (`lib/templates.ts:300`), Post-Proposal is "Your website proposal" (`:372`); the checklist claim "(no fake "Re:" or "Fwd:")" is now true. "Eight structurally different documents" (`app/audit/page.tsx:765`) matches the 8 proposals. Footer/terms/privacy say 28 Nov 2026; sitemap `lastModified` 2026-11-28 (per Loop 3 fix report). Hero URL form present with input `name="url"` (seen in `loop3fix-home-390.png` / `loop3fix-home-1280.png`); `/audit` field autofocused and the L8 local-storage notice renders in the form card (seen in `loop3fix-audit-390.png`). |
| H1 Inter loaded | `app/layout.tsx:2,11-15` `next/font/google`, weights 400/500/600/700, `variable: --font-inter`; live HTML `<html class="__variable_176161">`; live CSS (`/_next/static/css/e015ca70a93cdbdf.css`) contains `@font-face __Inter_176161` woff2 and `font-family: var(--font-inter),system-ui,…`. |
| H2 eyebrows | One eyebrow left, `app/page.tsx:16`, sentence case ("For web design freelancers and small agencies"), 13px, no `text-transform` (`app/globals.css:48-51`). Only remaining `text-transform: uppercase` is table headers + mobile stacked-table labels (`app/globals.css:95,102`). |
| H3 weights | h1/h2/h3 all 600 (`app/globals.css:33-35`); 0 occurrences of weight 700 in `app/` + `components/` UI code (700 survives only in the `next/font` weight list, `app/layout.tsx:12`, and PDF styling in `lib/pdf-html.ts`). |
| M3 CTA arrows | `ArrowRight`: 0 hits in `app/ components/ lib/`. Both hero CTAs ("Run a free audit", "See a sample report") are arrow-free in the screenshots. |
| M4 middle dots | `·`: 0 hits in `app/ components/ lib/`. The ScoreSummary caption is comma-separated ("Run on 27 Nov 2026, HTTP 200, HTTPS. Loaded in 2.8s, page size 1.8 MB"). |
| M5 transitions | One shared 120ms hover transition on `.btn` and nav links (`app/globals.css:58,125`), plus `prefers-reduced-motion` handling (`:159-192` region). |
| M6 "Payment coming soon" | 0 hits. |
| M8 teal icons | 0 `color="#0F766E"` icon props; step/tier/category icons use `#475569` (slate-600). Severity icons keep semantic grade colours (correct). Checklist uses Lucide `CheckSquare` 18px/1.5 (`app/templates/page.tsx:307`), not a text glyph. |
| L1 glyphs | `✓` and `…`: 0 hits. Non-ASCII scan of `app/ components/ lib/` finds only the 2 frozen em dashes. Progress dots use Lucide `Check`; button reads "Running audit" with `Loader2`. |
| L2 h3 650 | Gone with H3. |
| L4 nested radii | Inner radii 6px (`.callout`, `.evidence`, `.grade-badge`, `.sample-stamp`, `.tag`) inside 8px `.card`s; score bars 4px (`app/globals.css:74-75,105-117`). No nested-radius violation remains. |
| L6 nav touch target | Nav links `padding: 12px 10px` at 15px/1.6 ≈ 48px tall. |
| L7 `--faint` | `#64748B` (slate-500). |
| L3 tinted boxes, L8 score bars | Unchanged, documented correct (muted semantic tints; score bars are data visualisation with letter grades printed). |

## §5. Verified clean — with evidence (live HTML + source + screenshots)

| Check | Evidence |
|---|---|
| SAMPLE stamp exactly 1 per sample page | Live HTML: `/sample` rendered stamp 1 ("SAMPLE: fictional business, fictional data", `app/sample/page.tsx:14`); `/` hero score card 1; `/audit` 1 (ScoreSummary `sampleLabel`, `components/audit-ui.tsx:172`, client-rendered after a run). The "SAMPLE footer:" line in the sample Next-step card (`loop3fix-sample-1280.png`) is a caption sentence, not a stamp. No page has 0 or 2+ stamps. |
| Skipped headings: none | Live HTML heading order, all 6 pages: exactly one `<h1>` each; h2 always follows h1; h3 only under h2. `/`: h1 + 5 h2 + 14 h3. `/audit` (pre-run state): h1 + 1 h2 ("No audit yet"). `/sample`: h1 + 9 h2 + 12 h3. `/templates`: h1 + 9 h2 + 16 h3 (tier names are h2; proposal/email names are h3 under their section h2s). `/terms`: h1 + 10 h2. `/privacy`: h1 + 8 h2. |
| Em dashes in user-facing copy | Only the frozen BuyButton string (M-N3). 0 elsewhere in source (non-ASCII scan: 2 hits, both in `components/audit-ui.tsx`, one unrendered). |
| Gradients | 0 in UI source and 0 `linear-gradient` in the live CSS; the only "gradient" hits are comments in `lib/pdf-html.ts` and the PDF routes saying "no gradients". |
| Emoji | 0 (non-ASCII inventory is only the 2 frozen em dashes). |
| Hype words / "Get Started" / "Learn More" / "Trusted by" | 0 hits ("unlock" hits are all the licence-key feature, not marketing copy; "Get Started"/"Learn More"/"Trusted by" 0 in live HTML). |
| Headline wording | H1 is one short sentence: "Paste any business website URL." (`app/page.tsx:17`); the second clause lives in the subhead. No staccato triple remains. |
| Footer repeats | Footer is one `<footer>` per page (live HTML: header=1, footer=1 on all 6 pages). Its content repeats on every page by design (description, 6 nav links, "$49 one-time" disclaimer, BuyButton) — no new repetition added in Loop 3 or Loop 4. |
| "60-second" note | See L-N8 — the one soft number on the site; everything else is measured, dated, or explicitly a placeholder. |
| "#1 finding" subject line | `lib/templates.ts:300` ("The [#1 finding] on [Business].com") refers to the top-ranked finding; findings are severity-sorted, so the ranking is real, not an invented claim. Buyer framing inside a template, not a site claim. |
| "3 quick wins" subjects | `lib/templates.ts:236-238` — the buyer's own framing of their own email, which lists three findings; not a site claim. The 0-findings guard (`lib/templates.ts:438-441`, `app/audit/page.tsx:232,239`) still prevents "found N quick wins" on a clean audit. |
| "about $1.63 per audit" | Arithmetic (49/30 = 1.63), labelled "about" (`app/page.tsx:125`). Clean. |
| "Eight structurally different documents" | Count verified: 8 proposals in `lib/templates.ts`, 8 shown on `/templates`. Clean. |
| Competitor price line | SEOptimer $39/mo named, dated, with "Example only. Compare current prices before you buy. No guarantee of client wins." (`app/page.tsx:131-133`). Date staleness is L-N7, not a truthfulness issue. |
| Screenshot artifact, not a finding | `loop3fix-home-1280.png` and `loop3fix-sample-1280.png` show the nav row a second time in a bordered box at the very top. Live HTML has exactly one `<header>` on every page and the CSS shows the desktop nav inline with the Menu button hidden (`app/globals.css:132-133`); the header is sticky, so this is a full-page-screenshot stitching artifact, not a live defect (same class as the Loop 2 note). Not counted. |

## Briskly-style score detail (11 rules, weights total 70)

| # | Rule (weight) | Result |
|---|---|---|
| 1 | Inter font (8) | Clean — really loaded via `next/font/google` (woff2 in live CSS). |
| 2 | Geist font (6) | Clean. |
| 3 | Purple-to-blue gradient (9) | Clean — 0 gradients in UI source and live CSS. |
| 4 | zinc-950 / slate-950 dark mode (6) | Clean — white throughout, no dark mode. |
| 5 | shadcn-style rounded card (7) | **Half-hit (3.5)** — uniform white 8px cards everywhere (cards, step-rows, buttons); radius is 8px, not 2xl. |
| 6 | Centered hero + Get Started / Learn More (8) | Clean — asymmetric split, left-aligned, no stock CTAs; hero now has a real URL form. |
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
| Copy | **1 partial** | Em dash in the BuyButton (M-N3) — the only AI-copy tell left. No hype words, no staccato triples, no invented stats (L-N7/L-N8 are dated/unmeasured nits, not invented figures). |
| Components | None | Lucide 18px/1.5 only, icons inherit slate-600, SAMPLE reduced to one quiet stamp per page, checklist uses a real Lucide icon. |
| Layout | None | No equal-card grid anywhere: proposals and emails are vertical flows / a numbered sequence; hero is an asymmetric split; two-col is unequal. The Loop 2 grid tell is fixed. |

**Replicated Jev read: ~1 of 34 tells firing (partial) → estimated 3–5/100**, band 0–39
("Hand-made / Mostly human"). Judgement-based mapping, as before — not a Jev model
score; the real detector also uses a screenshot + vision description, which this run
could not produce (no live browser).

## Fix order (do in this sequence; each item is independent)

1. **M-N3 — Em dash in the BuyButton** (`components/audit-ui.tsx:55`) when the payment
   freeze lifts. One string; fixes all 6 pages at once and takes the Jev count to zero.
2. **L-N7 — Bump the 27 Nov dates.** Re-check the SEOptimer price and update its date
   (`app/page.tsx:132`); leave the sample run date unless the sample is re-run.
3. **L-N8 — Drop "60-second"** from the checklist heading (`app/templates/page.tsx:302`)
   or time a real read-through first.
4. **No change:** L3 (semantic tints), L8 (score bars), the uniform 8px card (brief
   mandates it; chasing the last Briskly 3.5 points would break the design system),
   the 3 remaining "30 audits" mentions (operative statements), the footer repeat
   (by design, one footer per page).

## Limitations of this run

1. **No live browser; no fresh screenshots.** Judgements are from live HTML (curl),
   source, and the existing `loop3fix-*.png` screenshots, which depict the exact live
   build (byte-identical live HTML sizes). A fresh headless-Chrome run against the live
   site failed on egress (`ERR_TUNNEL_CONNECTION_FAILED`); a local-build screenshot
   run was not done, per the report-only constraint (no build). Mobile behaviour at
   390px was judged from the screenshots, not from a live render; the Jev
   screenshot-based tells could not be verified visually beyond those five images.
2. **Live `/audit` HTML is the pre-run state.** The audit result (scores, findings,
   proposal generator) renders client-side after "Run audit", so the weights
   single-instance check (M-N2) is evidenced from source, and the post-audit visuals
   from the Loop 2 phase-1 screenshots; no new post-audit screenshot exists in this
   loop.
3. **Briskly/Jev scores are replications**, as in all prior rounds — rule lists read
   as public text and applied by hand. No URL was submitted to any detector.
4. **No Impeccable `detect` run in this loop** (no build was run, per the report-only
   constraint; the recheck's `detect` findings — skipped headings — were re-verified
   as 0 by live-HTML heading order instead).
5. **No new build was run.** Source on disk is main `d331073`; live HTML was fetched
   28 Nov 2026 and matches the Loop 3 fix verification byte-for-byte.

## Sources applied

- Prior rounds: `docs/dealnote-slop-check-2026-11-27.md`,
  `docs/dealnote-slop-recheck-2026-11-27.md`,
  `docs/dealnote-loop2-slop-2026-11-27.md` (method, rule lists, fix history).
- Loop 2 fix report: `docs/dealnote-loop2-fix-report-2026-11-28.md` (what Loop 2
  fixed: templates grids, weights dup, screenshot card, Trust label, header popover).
- Loop 3 fix report: `docs/dealnote-loop3-fix-report-2026-11-28.md` (what Loop 3
  fixed: header 4 links, Quick-Fix default, cold subjects, fake Re: subjects, PDF
  footer duplication, orphaned `.steps-grid` CSS, dates 28 Nov).
- Briskly AI Slop Detector — https://briskly.tools/tools/ai-slop-detector (11 rules +
  weights + score bands).
- Jev AI Slop Detector — https://madewithjev.com/free-tools/ai-slop-detector (34 tells).
- Unslop (Damir Sokolovsky, CC BY 4.0) — signs.md group by group.
- Product brief — `docs/design-notes.md`.
- Live site — https://dealnote-blue.vercel.app (curl, 28 Nov 2026, all 6 pages HTTP 200;
  live CSS `/_next/static/css/e015ca70a93cdbdf.css` fetched for the Inter check).
- Screenshots — `docs/screenshots/loop3fix-home-1280.png`,
  `loop3fix-home-390.png`, `loop3fix-templates-390.png`,
  `loop3fix-sample-1280.png`, `loop3fix-audit-390.png` (post-Loop-3-fix, current build).
