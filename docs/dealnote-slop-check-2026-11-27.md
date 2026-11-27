# DealNote AI Slop Check — 2026-11-27

**Target:** DealNote, live https://dealnote-blue.vercel.app, local repo `~/workspace/ship-or-die-100k/teardown-generator`, branch `dealnote-audit-batch` (not switched, nothing committed).
**Scope:** pages `/`, `/audit`, `/sample`, `/templates`, `/terms`; source `app/`, `components/`, `lib/`, `app/globals.css`, `public/logo.svg`; plus the existing production build output `.next/server/app/*.html` and `.next/static/css/*.css` (no `out/` directory exists; no new build was run).
**Mode:** report only. Nothing fixed, deployed, or sent externally. No URL was submitted to any external detector form; the Briskly and Jev rule lists were read as text and replicated locally against source + built HTML. No live browser was used.

⚠️ **DEGRADED: single-context (Impeccable dual-agent assessment not possible — this session is a depth-2 subagent with no sub-agent tool, no live browser; the `impeccable` launcher and `impeccable detect` CLI were not run, per the task constraint against writing files outside this report or running a CLI that downloads a binary and writes context/build artifacts).** Assessment A below is an inline design review against the Impeccable critique rubric (`~/.claude/skills/impeccable/reference/critique.md`); there is no isolated Assessment B detector run. Treat the heuristic total as a single-reviewer score, not a dual-agent critique.

**Design brief being checked against** (`docs/design-notes.md`): white/slate, one deliberate accent deep teal `#0F766E`, Inter, Lucide icons only at 18px / 1.5 stroke, no gradients/glows/emoji, no Sortes tokens, no NoSite indigo default, clean no-AI-slop. Several findings below are cases where the brief itself mandates a pattern the slop detectors flag (Inter, 700-weight headings, uppercase eyebrows). Those are flagged honestly with the conflict noted; the fix order says which side should win.

## Verdict in one paragraph

DealNote is genuinely clean where slop usually lives: zero gradients, zero em dashes, zero emoji, zero hype words, zero "Get Started / Learn More", zero fake social proof, zero purple/blue, zero pill badges, zero looping motion. The remaining slop is concentrated in three deliberate-but-detectable defaults: **Inter is named in the font stack but never actually loaded** (the site renders in system-ui), **an uppercase tracked eyebrow sits above almost every heading**, and **all headings run at weight 700** (h3 at 650). Underneath those, the familiar template skeleton is still visible: three equal feature cards, three equal pricing-tier cards, numbered steps, CTA arrows, middle-dot meta strings, and a repeated SAMPLE stamp. Replicated scores: **Briskly ~29/100** (band 15–40, "mostly original with a few defaults remaining"; range 24–29 depending on how strictly the card rule is counted) and **Jev-style ~5–6 of 34 tells firing, est. 15–25/100** (band 0–39, "Hand-made / Mostly human"). Both are local replications, not real detector scores.

## Severity counts

| Severity | Count |
|---|---|
| HIGH | 3 |
| MEDIUM | 7 |
| LOW | 8 |
| **Total findings** | **18** |
| Clean / verified-absent checks | 24 (listed in §5) |

---

## HIGH

### H1. Inter is declared but never loaded — the site actually renders in system-ui
- **Where:** `app/globals.css:24` — `font-family: Inter, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;`
- **Evidence:** `grep -rn 'next/font' app components lib` → 0 hits. No `<link>` font tag in `app/layout.tsx:1-22`. No Inter font file in the repo. The built HTML (`.next/server/app/index.html` etc.) contains "Inter" only 6 times, all inside the `font-family` declaration itself. Effective rendered font is `system-ui` on every platform.
- **Rules hit:** Briskly rule 1, "Inter font" (weight 8/70, the single heaviest font rule); Jev "The five default typefaces". Unslop §5: "A default like Inter that nobody chose may be swapped."
- **Why it matters:** The detectors flag Inter as the #1 shadcn/v0 default, but DealNote gets the worst of both worlds: it is *detected* as Inter (the string is in the CSS) while *rendering* as an unchosen system-ui stack. `docs/design-notes.md` §3 justifies Inter deliberately (small-size UI legibility, Chromium PDF rendering, one family for PDF embedding) — but none of that justification is true of the shipped artifact, because no font is bundled, so the PDF/print path also falls back to system-ui.
- **Fix:** either load Inter properly via `next/font/google` (or a self-hosted woff2) so the stated choice is real, or replace Inter in the stack with a genuinely chosen non-default face. Do not leave a named-but-unloaded font in the stack.

### H2. Uppercase tracked eyebrow ("kicker") above nearly every heading
- **Where:** `app/globals.css:52-55` — `.eyebrow { font-size: 12px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: var(--accent); }`
- **Uses (6):** `app/page.tsx:16` ("For web design freelancers and small agencies"), `app/page.tsx:98` ("One-time payment"), `app/audit/page.tsx:183` ("Audit tool"), `app/audit/page.tsx:364` ("Report preview", inline brand colour), `app/templates/page.tsx:30` ("Proposal templates"), `app/terms/page.tsx:6` ("Terms"). Plus the same pattern in table headers — `app/globals.css:102` (`th { text-transform: uppercase; letter-spacing: 0.04em; }`) and mobile stacked-table labels (`app/globals.css:119`).
- **Rules hit:** Briskly rule 7, "All-caps section labels" (weight 5); Jev "A kicker above every heading" ("Delete kickers that repeat their heading; let scale introduce sections"); Unslop §5 / signs.md Type ("Uppercase labels with wide tracking … → sentence case").
- **Why it matters:** It is the single most repeated template marker on the site: 5 of 5 pages open a section with one. The eyebrow on `/` line 16 duplicates the H1's audience ("For web design freelancers…") and the one on `/templates` line 30 duplicates its own H1 word-for-word ("Proposal templates" above "Proposal templates").
- **Conflict note:** `docs/design-notes.md` §3 explicitly permits eyebrow text ("Never use all-caps for more than a short label (eyebrow text, max 12 px, letter-spacing 0.08em)"). The usage complies with the brief's own rule; the external detectors flag the pattern regardless. Fix order treats this as a brief-vs-detector decision, not a clear bug.
- **Fix:** delete the kickers that repeat their heading (`/templates`, `/terms`, `/audit` "Audit tool"); keep at most one where it adds information the heading lacks, set it in sentence case.

### H3. All headings at weight 700 (h3 at 650) — heavier than the Unslop type ceiling
- **Where:** `app/globals.css:33` (`h1 { font-weight: 700; }`), `:34` (`h2 { font-weight: 700; }`), `:35` (`h3 { font-weight: 650; }`), `:119` (`.wordmark { font-weight: 700; }`); large figures at 700 — `app/page.tsx:99` ($49 at 48px/700), `components/audit-ui.tsx:94` (overall score 48px/700), `components/audit-ui.tsx:21` (grade badge 700), `app/templates/page.tsx:47` ($____ at 24px/700).
- **Rules hit:** Unslop §5 ("two weights, 400 and 500, with 600 at most for rare emphasis. No 700 to 900 headings"); signs.md Type ("Headings at weight 800 or 900 → 400 to 500 and size for hierarchy" — 700 is the same failure one step down).
- **Why it matters:** Hierarchy here comes from weight, not from size and colour as Unslop requires, and 650 is not even a token weight — it is an off-scale value. Combined with H1, the type system reads as "bold everything", the default template weight scheme.
- **Conflict note:** `docs/design-notes.md` §3 mandates the 36/700, 24/700, 18/650 scale as the design system. Changing this means revising the design notes, not just the CSS.
- **Fix:** drop h1/h2 to 600 (or 500 with larger size steps for hierarchy), h3 to 500/600, and delete the 650 value. Re-check the 48px score figures at 600.

---

## MEDIUM

### M1. Three equal feature cards + three equal tier cards + two equal cards — the template grid, three times
- **Where:** `app/globals.css:127` (`.steps-grid { grid-template-columns: repeat(3, 1fr); }`), used by "How it works" (`app/page.tsx:49-76`) and the pricing tiers (`app/templates/page.tsx:38-49`); `app/globals.css:129` (`.two-col { 1fr 1fr }`), used by "What DealNote checks, and what it does not" (`app/page.tsx:122-152`) and the white-label preview (`app/audit/page.tsx:340`).
- **Rules hit:** Jev "The three-card feature grid" ("Pick the most important thing and show it fully instead of equal boxes"); Unslop §7 / signs.md Components ("Equal cards side by side, each with the same kind of content, read as a template. Give the grid a rhythm").
- **Why it matters:** Every section on `/` and `/templates` is an equal-width row of identical white 8px-radius cards. The "How it works" cards are the worst case: icon + bold title + vague line each, exactly the signs.md landing-page pattern. The tier cards are defensible (tiers are genuinely parallel), the feature cards are not.
- **Fix:** vary the rhythm — e.g. make the "How it works" section a numbered vertical flow or a wide-first layout, and give the two-col "checks / does not check" pair unequal widths. Keep equal widths only where the content is truly parallel (pricing tiers).

### M2. Numbered steps "1. / 2. / 3." as card titles
- **Where:** `app/page.tsx:52` (`1. Paste a URL`), `:60` (`2. Get the teardown`), `:68` (`3. Send the proposal`).
- **Rules hit:** Jev "01 / 02 / 03 section markers" ("Number only what really happens in order").
- **Why it matters (partial):** the steps genuinely happen in order, so the numbering is defensible — this is a half-hit, not a full one. It still reads as a template marker because the numbers sit inside equal cards (M1) rather than in a real sequential flow.
- **Fix:** fold into the M1 fix — if the steps become a vertical flow, the numbers earn their place; as card titles they should go.

### M3. CTA arrows on the primary and secondary buttons
- **Where:** `app/page.tsx:24` — `Run a free audit <ArrowRight size={18} strokeWidth={1.5} aria-hidden />`; `app/page.tsx:89` — `Read the full sample report <ArrowRight … />`.
- **Rules hit:** task-listed check ("CTA arrows"); Briskly's rendered-DOM guidance names arrow-suffixed CTAs as part of the template read; Jev "Stock calls to action" (partial — see mitigation).
- **Mitigation:** both CTAs name the first thing the visitor gets ("Run a free audit", "Read the full sample report"), which is exactly Jev's fix for stock CTAs. The arrow is the only template residue here.
- **Fix:** drop the `ArrowRight` from both CTAs (keep the `CheckCircle2` on the FAQ "Try the audit tool" button at `app/page.tsx:184`, which is a status icon, not a directional arrow). Lowest-effort fix on this list.

### M4. Middle-dot meta strings (" · " separators) in four places
- **Where:** `components/audit-ui.tsx:107` — `Run on {date}. HTTP {status} · HTTPS · Loaded in {n}s · Page size {n} MB` (3 dots in one caption); `components/footer.tsx:13-17` — three `{" · "}` separators between footer links; `app/templates/page.tsx:85` — `[Phone] · [Email] · [Website]`; `app/audit/page.tsx:371` — `{email} · {phone} · {website}`. Total: 6 source lines containing `·`.
- **Rules hit:** task-listed check ("middle-dot meta strings").
- **Why it matters:** the ScoreSummary caption packs four facts into one dot-joined run-on line; it is the densest "meta string" on the site and the first thing under the hero score. The footer dots are the classic template footer separator.
- **Fix:** split the ScoreSummary caption into two short lines (run facts vs. page facts) and replace footer `·` separators with a real nav list or line breaks.

### M5. Zero transitions — hover states change instantly (0 ms)
- **Where:** `grep -rn 'transition' app components` → 0 hits. Hover rules exist with no transition: `app/globals.css:28` (`a:hover`), `:64` (`.btn-primary:hover { background: #0d5f58; }`), `:66` (`.btn-secondary:hover`), `:116` (nav link hover background).
- **Rules hit:** UI-UX Pro Max priority 2 (Touch & Interaction, CRITICAL) anti-pattern: "Instant state changes (0ms)"; pro-rules.md "Animation timing — use shared tokens chosen for distance, complexity, platform, and user context" / "One duration for every transition" is the opposite failure — here there is no duration at all.
- **Why it matters:** buttons snap between states with no feedback ramp; on the audit tool (an Operate surface) this reads as unfinished rather than deliberate. No reduced-motion handling exists either (moot today — nothing animates — but any future motion needs it).
- **Fix:** add one shared easing/duration token (e.g. `transition: background-color 120ms ease-out, border-color 120ms ease-out` on `.btn` and nav links). Do not add `transition-all`.

### M6. "Payment coming soon" repeated 4×, "30 audits per month" 5×, "No subscription" 3×
- **Where:** "Payment coming soon" — `app/page.tsx:32` (hero caption), `app/page.tsx:114` (pricing `.tag` badge), `app/audit/page.tsx:466` (callout), `components/footer.tsx:21` (footer). "30 audits per month" — 5 occurrences across `app/page.tsx` (caption, pricing list, FAQ), `app/terms/page.tsx`, `components/footer.tsx`. "No subscription" — 3×; "No per-report fee" — 2×; "$49 one-time" — 5× (case-insensitive).
- **Rules hit:** Unslop §4 (claims/copy repetition); Jev "The AI copywriting voice" (partial — the copy is specific, but the same sentence is stamped on every surface including the footer).
- **Why it matters:** the same status sentence on the hero, the pricing card, the audit tool, and the footer reads as template filler rather than information. The pricing-card instance is additionally wrapped in a `.tag` badge (see L4-adjacent badge note), which makes a status notice look like a plan label.
- **Fix:** say it once on `/` (pricing section) and once in `/terms`; delete the hero-caption and footer instances. Keep the audit-page callout only until payment ships, then delete it too.

### M7. SAMPLE stamp repeated 7× on /sample (plus 2 more elsewhere)
- **Where:** `app/sample/page.tsx` — 7 `sample-stamp` uses (lines 12, 23, 27, 32, 37, 63, and the "Next step" card); plus `app/audit/page.tsx:282` and `components/audit-ui.tsx:110`. `grep -c 'sample-stamp'` → sample 7, audit 1, audit-ui 1 (plus 1 CSS definition in `app/globals.css:110-114`).
- **Rules hit:** Unslop §4 / signs.md ("`PRO`, `New ✨`, `Beta 🚀` badges everywhere → remove or one quiet text badge"); Jev "The announcement pill" (partial — the stamp is quiet text, not a pill, but its repetition is the issue).
- **Mitigation:** `docs/design-notes.md` §8 requires the word SAMPLE "at the top of every page" of the *PDF report*. The web page over-applies this to every *section*. One stamp at the top of the page plus one in the footer would satisfy the rule.
- **Fix:** keep the stamp at `app/sample/page.tsx:12` and the footer caption; delete the per-section stamps (lines 23, 27, 32, 37, 63).

### M8. Step/feature icons coloured teal instead of inheriting text colour
- **Where:** `app/page.tsx:50,58,66` — `<Globe … color="#0F766E" />`, `<FileText … color="#0F766E" />`, `<Send … color="#0F766E" />`; `app/templates/page.tsx:34` — `<FileText … color="#0F766E" />`. Contrast with `components/audit-ui.tsx:30` where category icons correctly use `color: "#475569"` (the muted text role).
- **Rules hit:** Jev "Icons in a tint of themselves" ("Let the icon inherit the text color, with no container"); Unslop §3 ("Icons take the color of their text role, usually secondary or muted. They never get their own colors").
- **Why it matters (partial):** `docs/design-notes.md` §4 allows teal "when the icon is the primary action of a control" — these are decorative section icons, not actions, so the exception does not apply. The teal icons are the only coloured icons on the site, which makes them read as decoration rather than meaning.
- **Fix:** remove the `color="#0F766E"` props so the icons inherit slate-600 like every other icon on the site.

---

## LOW

### L1. Text glyph "✓" used as a progress icon; "…" ellipsis character in button copy
- **Where:** `app/audit/page.tsx:225` — `{i < step ? "✓" : i + 1}` inside `.progress-dot`; `app/audit/page.tsx:209` — `{running ? "Running audit…" : "Run audit"}`.
- **Rules hit:** Unslop §3 ("Every emoji used as an icon … becomes a line icon from one set"); pro-rules.md "No Emoji as Structural Icons" (a text checkmark is the same failure in miniature — font-dependent, unstyled).
- **Fix:** use Lucide `Check` at 18px/1.5 inside the done dot (the icon set is already imported in this file's scope pattern — `CheckCircle2` is imported at `app/audit/page.tsx:9`); replace "…" with "Running audit" + the existing `Loader2` spinner, which already conveys progress.

### L2. h3 weight 650 is an off-scale value
- **Where:** `app/globals.css:35` — `h3 { font-size: 18px; font-weight: 650; }`.
- **Rules hit:** Unslop §5 (weights 400/500, 600 at most for rare emphasis).
- **Fix:** fold into H3 — set h3 to 600.

### L3. Four tinted box backgrounds (red/amber/teal/slate)
- **Where:** `app/globals.css:131-133` — `.tag-critical { background: #fef2f2; }`, `.tag-soon { background: #fffbeb; }`; `:90` (`.callout { background: var(--accent-soft); }` = `#F0FDFA`); `:91` (`.evidence { background: var(--surface); }` = `#F8FAFC`). Full hex inventory of `globals.css`: 17 distinct hex values, all from the documented slate/teal/grade ramps.
- **Rules hit:** Jev "Default rainbow of tinted boxes" (partial).
- **Mitigation:** every tint is muted, semantic (red = critical, amber = fix-soon, teal = callout, slate = evidence), and documented in `docs/design-notes.md` §2. This is the correct use of tinted boxes, not the default rainbow.
- **Fix:** no change required; only note that adding any further tinted background would tip this into a hit. If the severity tags are restyled, prefer coloured text + hairline border over filled backgrounds.

### L4. Inner radius equals outer radius (nested-radius math ignored)
- **Where:** `app/globals.css:110-114` (`.sample-stamp { border-radius: 8px; }`), `:115` (`.tag { border-radius: 8px; }`), `:102-105` (`.grade-badge { border-radius: 8px; }`) — all sit inside `.card { border-radius: 8px; }` (`app/globals.css:87`).
- **Rules hit:** Unslop §7 ("Nested radius. An inner radius equals the outer radius minus the padding between them, never less than 4").
- **Fix:** drop inner radii to 6px (or 4px for the 12px `.tag`). Cosmetic; do it in the same pass as any card work.

### L5. Aphoristic / staccato copy cadence + whole-sentence display headline
- **Where:** `app/page.tsx:106` — "One payment. No subscription. No per-report fee."; `app/page.tsx:20-23` — "Show the prospect what is wrong with their site, then sell the fix."; H1 `app/page.tsx:17` — "Paste any business website URL. Get a teardown report plus a ready-to-send proposal in about a minute." at 36px/700 (two full sentences at display size).
- **Rules hit:** Jev "A whole sentence at display size" ("Make the big line a few words and put the rest in a normal-size subline"); task-listed "aphoristic cadence".
- **Mitigation:** the H1 is specific, product-true copy (who it is for, what it does, how long it takes) — Jev's headline fix is satisfied in substance. The staccato triples are the only cadence residue.
- **Fix:** shorten the H1 to its first clause ("Paste any business website URL.") and move the rest to the subhead; vary the pricing line into one plain sentence.

### L6. Header nav links below the 44px touch-target minimum
- **Where:** `app/globals.css:117` — `.site-header nav a { padding: 8px 10px; font-size: 15px; }` → ~37px tall. Buttons are compliant (`.btn { min-height: 44px; }`, `app/globals.css:59`).
- **Rules hit:** UI-UX Pro Max priority 2 (CRITICAL): "Min size 44×44px"; pro-rules.md "Touch Target Minimum — at least 44pt on iOS and 48dp on Android".
- **Fix:** raise nav link padding to `10px 10px` minimum (44px total) or `12px 10px`.

### L7. `--faint: #94A3B8` fails contrast (2.56:1 on white) — currently unused, latent risk
- **Where:** `app/globals.css:7` defines `--faint`; `grep -rn 'faint' app components` (excluding globals.css) → 0 uses. Contrast computed: `#94A3B8` on `#FFFFFF` = **2.56:1** (fails WCAG AA 4.5:1 for normal text). All other text pairs pass: `#0F766E` on white **5.47:1**, `#475569` on white **7.58:1**, white on `#0F766E` **5.47:1**, white on hover `#0d5f58` **7.51:1**, grade green `#15803D` **5.02:1**, amber `#B45309` **5.02:1**, red `#B91C1C` **6.47:1**.
- **Rules hit:** UI-UX Pro Max priority 1 (Accessibility, CRITICAL): contrast 4.5:1; Unslop §2 (three text roles — the faint role exists in the tokens but is never used, so the ramp is effectively two roles, which is fine).
- **Conflict note:** `docs/design-notes.md` §2 reserves faint for "timestamps, 'could not check' labels only — never body copy". The token is safe as long as it stays unused or is restricted to large/decorative use.
- **Fix:** either delete the token or darken it to `#64748B` (slate-500, ~4.8:1) before anyone uses it for text.

### L8. Six uniform score-bar rows — repeated identical component, grade-coloured fills
- **Where:** `components/audit-ui.tsx:64-86` (`ScoreBars`) — six rows, each icon + label + weight + score + grade + a full-width bar filled with the grade colour (green/amber/red from `lib/audit.ts:100-104` `gradeColor`).
- **Rules hit:** Unslop §7 ("Charts have a hierarchy… never a second chart of the same size"); Jev tinted-boxes (partial).
- **Mitigation:** this is data visualisation, not decoration: the bars are the product (the audit scores), the colours are semantic, and the letter grade is always printed next to the number so the score reads without colour (`docs/design-notes.md` §5). The overall 48px score + grade badge above the bars provides the hierarchy.
- **Fix:** no change. Only flag if a second chart-like element is ever added to the same card.

---

## Impeccable Assessment A (inline, single-context — see degraded banner)

**Mode:** `/` is Persuade (landing), `/audit` is Operate (tool), `/sample` and `/terms` are Read. Judged as a Persuade + Operate pair.

**Design specificity verdict:** authored for this product, not interchangeable. The hero is the real audit UI in code with fictional data and a SAMPLE label (`app/page.tsx:37-44`, per `docs/design-notes.md` §6); the sample report uses plausible invented data (Harbor & Pine Plumbing, 555 phone range, `lib/audit.ts:130-138`); findings are written for a business owner, not a developer; the white-label preview is the product's own differentiator. What keeps it from feeling fully authored is the generic skeleton underneath: Inter/system-ui, uppercase eyebrows, 700-weight headings, equal cards. If the product name were swapped, the chrome would still fit any SaaS tool — the specificity lives in the copy and the report UI, not in the visual system.

**Nielsen heuristics (0–4 each):**

| # | Heuristic | Score | Key issue |
|---|---|---|---|
| 1 | Visibility of system status | 3 | Audit progress steps shown (`app/audit/page.tsx:218-234`), but no percentage/ETA; "Running audit…" is the only live state |
| 2 | Match system / real world | 4 | Plain language throughout; findings written for business owners; no jargon |
| 3 | User control and freedom | 3 | Nav back everywhere; no destructive actions; but tracker entries cannot be removed and brand edits save instantly with no undo |
| 4 | Consistency and standards | 4 | One card, one button pair, one icon set/size/stroke across all pages |
| 5 | Error prevention | 3 | URL validated before run (`lib/audit.ts:106-130`); inline field errors; no confirmation before adding a proposal to the tracker |
| 6 | Recognition rather than recall | 3 | Icon + text labels everywhere; weights printed on the report so grades need no memory |
| 7 | Flexibility and efficiency | 2 | Enter key runs the audit; no shortcuts, no recent-URL recall, no bulk action in the tracker |
| 8 | Aesthetic and minimalist design | 3 | Clean and quiet; loses a point to the template skeleton (M1, H2, H3) |
| 9 | Error recovery | 3 | Fetch-failed state offers the sample audit (`app/audit/page.tsx:238-254`); no one-click retry — user must press Run again |
| 10 | Help and documentation | 3 | FAQ + terms cover the main questions; no contextual help on the audit form itself |
| **Total** | | **31/40** | **Good (28–35 band)** |

**Cognitive load:** no decision point shows more than 4 visible options (nav 4 links; audit form 1 input + 1 button; pricing 1 card). The audit results page is the heaviest surface (score, 7 findings, page-facts table, brand form, proposal, tracker) but sections are ordered and collapsible by scroll; acceptable for an Operate surface.

**Emotional journey:** peak is the hero score card (a B/82 for a fictional business — reassuring proof the product works); valley is the repeated "Payment coming soon" (M6), which undercuts the $49 purchase at the exact moment of decision; reassurance at the high-stakes moment is good ("No invented figures", refund terms, "Scores can vary between runs" disclaimers on every surface).

**Persona red flags:**
- *Freelancer on her phone between client visits (primary user):* nav links below 44px (L6); audit form stacks correctly at mobile widths, but the results page is very long with no anchor navigation to Findings / Proposal / Tracker.
- *Business owner reading the sample PDF on a phone:* SAMPLE stamp repeated 7× (M7) reads as watermark noise on a small screen; otherwise the sample is the strongest page.
- *First-time visitor deciding in 10 seconds:* H1 is a full sentence at display size (L5) and the eyebrow duplicates it (H2); the value prop takes two readings to land.

**Strengths (3):** (1) The hero shows the real product, not a stock visual. (2) Copy is honest and specific — real numbers, printed weights, explicit "not an earnings claim" disclaimers, no invented figures anywhere. (3) Accessibility basics are genuinely done: focus-visible rings on every interactive element (`app/globals.css:70-72`), labels above inputs, `aria-hidden` on decorative icons, `aria-live` on the running state, AA-passing text contrast (L7 excepted, unused).

---

## Replicated detector scores (local replication only — no URL submitted)

### Briskly AI Slop Detector — 11 rules, weights total 70
Source: https://briskly.tools/tools/ai-slop-detector (read 2026-11-27; rule text fetched, URL never submitted).

| # | Rule (weight) | Result on DealNote | Evidence |
|---|---|---|---|
| 1 | Inter font (8) | **HIT** | `app/globals.css:24` names Inter first; never loaded (H1) |
| 2 | Geist font (6) | Clean | No Geist anywhere |
| 3 | Purple-to-blue gradient (9) | Clean | 0 gradient hits in source; 0 `linear-gradient` in built CSS; only `gradientTransform` SVG identifiers inside a dependency bundle (`.next/server/app/api/audit/route.js`) |
| 4 | zinc-950 / slate-950 dark mode (6) | Clean | White background throughout; no dark mode in v1 |
| 5 | shadcn-style rounded card (7) | **HIT (partial)** | Uniform white 8px-radius bordered cards with a subtle shadow (`app/globals.css:87-89`) on every section. Radius is 8px, not shadcn's 2xl — counted full here, half if strict |
| 6 | Centered hero + Get Started / Learn More (8) | Clean | Hero is an asymmetric split (`hero-grid`, `app/globals.css:125`), left-aligned; no "Get Started" or "Learn More" anywhere |
| 7 | All-caps section labels (5) | **HIT** | `.eyebrow` uppercase + 0.08em, 6 uses (H2) |
| 8 | Floating orbs / glow effects (6) | Clean | 0 glow/blur/orb hits |
| 9 | Generic marketing speak (6) | Clean | 0 hits for supercharge / unleash / revolutionize / "build the future" class copy; H1 is product-specific |
| 10 | "Trusted by X+ companies", no logos (4) | Clean | 0 hits; no testimonials, no logo wall |
| 11 | AI builder fingerprint (5) | Clean | No Tailwind, no shadcn, no Lovable/v0/Bolt markers; hand-written CSS, Next.js 14 |

**Replicated Briskly score: 20/70 = ~29/100** (Inter 8 + cards 7 + caps 5). Band 15–40: "mostly original with a few defaults remaining". If the card rule is half-counted for the 8px (non-2xl) radius, the score is ~24/100. Either way the same three rules account for the entire score — fixing H1 + H2 + the card rhythm would take it to ~0.

### Jev AI Slop Detector — 34 tells
Source: https://madewithjev.com/free-tools/ai-slop-detector (read 2026-11-27; 34-tell list fetched, URL never submitted, no screenshot taken).

| Tell group | Firing tells | Evidence |
|---|---|---|
| Color | None (0/5) | No indigo gradient, no gradient headline, no glow dark mode, no stock warm palette, no rainbow tinted boxes beyond the muted semantic set (L3) |
| Type | **3 partial/full** | "Five default typefaces" (Inter, H1); "Kicker above every heading" (H2, 6 uses); "Whole sentence at display size" (H1 two sentences at 36px, L5). No serif italic, no display serif, no terminal |
| Copy | **0 full, 1 partial** | No AI voice, no slop vocabulary (0 hype-word hits), headline is product-specific, no em dashes, no emoji, no faux-insight setups, no invented stat row, CTAs name the action. Partial: staccato triples (L5) |
| Components | **2 partial** | "Icons in a tint of themselves" (M8, teal step icons); "Announcement pill" (M7, repeated SAMPLE stamp — quiet text, not a pill). No glowing status dot, no rounded-square icon tiles, no frosted glass, no oversized soft shadow, no coloured left border, no AI-drawn logo (flat 2-colour SVG, `public/logo.svg`) |
| Layout | **1 full, 1 partial** | "Three-card feature grid" (M1, full); "01/02/03 section markers" (M2, partial — genuinely sequential). No template hero (asymmetric split + real product preview), no cards-in-cards, no bento, no logo wall/testimonials, no builder template left as shipped |

**Replicated Jev read: ~5–6 of 34 tells firing → estimated 15–25/100**, band 0–39 ("Hand-made / Mostly human"). This is a judgement-based mapping of the tell list onto the source, not a Jev model score; the real detector also uses a screenshot + vision description, which this run could not produce (no live browser).

---

## §5. Verified clean — with evidence (grep counts)

| Check | Count | Evidence |
|---|---|---|
| Gradients | 0 | `grep -rni 'gradient' app components lib` → 0; built CSS `.next/static/css/*.css` → 0 `linear-gradient`; built HTML (5 pages) → 0 |
| Em dashes (—) | 0 | `grep -rn '—' app components lib` → 0; built HTML → 0 |
| Emoji | 0 | Python non-ASCII scan of `app/`, `components/`, `lib/` → only `·` (U+00B7), `✓` (U+2713), `…` (U+2026); no emoji codepoints |
| Hype words (unlock, supercharge, unleash, seamless, magic, revolutionize, game-changing, AI-powered) | 0 | case-insensitive grep → 0 |
| "Get Started" / "Learn More" | 0 | grep → 0 |
| "Trusted by" / testimonials / avatar dots / star ratings | 0 | grep → 0; "testimonial" appears once only in `/terms` as a prohibition ("Do not add … invented testimonials", `app/terms/page.tsx:57`) |
| Purple / blue / indigo / violet / Sortes tokens (#141b2e, #d4af37, #ede6d6, Cinzel, Jost) | 0 | grep → 0; accent inventory is teal `#0F766E` + slate ramp only |
| Pill shapes (rounded-full / rounded-2xl / rounded-3xl) | 0 | grep → 0; radii are 8px cards/buttons/tags, 4px score bars, 50% progress dots only |
| animate-pulse / animate-ping / transition-all / hover:scale | 0 | grep → 0; `transition` anywhere → 0 (see M5 — the absence itself is the finding) |
| Exclamation marks in UI copy | 0 | grep for `!` in copy → only code operators (`!check.ok`, `!res.ok`, etc.) |
| AI-writing vocab (comprehensive, delve, elevate, tapestry, cutting-edge, leverage, streamline, empower, furthermore, moreover, "in today's", "digital age") | 0 | case-insensitive grep → 0 |
| Icons | 20/20 at 18px / 1.5 | `grep -rho 'size={18}'` → 20; `strokeWidth={1.5}` → 20; all from `lucide-react` (6 import sites); the single `size={56}` is the `GradeBadge` size prop, not an icon |
| Spacing on 4px grid | — | Section padding 64/48, card padding 24, gaps 48/32/24/20/16/12, container padding 20 — all multiples of 4; no `mt-[13px]`-style arbitrary values (no Tailwind at all) |
| Focus rings | present | `app/globals.css:70-72` — 2px teal outline-offset ring on btn/a/input/select/textarea/button `:focus-visible` |
| Buttons ≥ 44px | yes | `.btn { min-height: 44px; }`; inputs `min-height: 44px` (`app/globals.css:94-95`) |
| No builder fingerprint | — | No `tailwind.config.*`, no `postcss.config.*`, no Tailwind/shadcn in `package.json`; hand-written CSS; Next.js 14.2.18 |
| No fake data in the product | — | Sample data is explicitly fictional (555 phone range, `.example` domain, SAMPLE labels); weights printed on the report; "Arithmetic on published prices, not an earnings claim" (`app/page.tsx:112-113`) |
| Logo | clean | `public/logo.svg` — flat 2-colour (teal `#0F766E` + white), document + check, no gradient, no glow, no sparkle, no third colour; matches `docs/design-notes.md` §7 |

## UI-UX Pro Max pro-rules applied (line by line, web-relevant subset)

The skill's `pro-rules.md` is scoped to native/mobile app UI; the web-applicable rules from `references/quick-reference.md` categories were applied instead, per the skill's own scope notice. Results: **Accessibility (P1)** — contrast passes except unused `--faint` (L7); focus rings present; decorative icons `aria-hidden`; icon buttons all carry visible text labels; form fields labelled with inline named errors. **Touch & Interaction (P2)** — buttons/inputs 44px pass; nav links fail at ~37px (L6); zero transitions (M5); no hover-only behaviour. **Performance (P3)** — no images except the 28px SVG logo; no webfonts to block rendering (a side-effect of H1); no CLS risk from the layout (fixed header, no lazy content). **Style Selection (P4)** — single icon set, SVG-only, no emoji (clean). **Layout & Responsive (P5)** — tables stack under 640px, grids collapse to 1 column under 860px, `overflow-x: hidden` on body, `overflow-wrap: anywhere` on long URLs; not verified at 390px in a live browser (see Limitations). **Typography & Color (P6)** — base 16px, line-height 1.6, semantic colour tokens via CSS variables (no raw hex in components except the intentional grade-colour mapping in `lib/audit.ts:100-104`); weights are the failure (H3). **Animation (P7)** — nothing animates; no reduced-motion handling needed today (M5). **Forms & Feedback (P8)** — labels above inputs, error adjacent to field, helper captions present; no progressive disclosure needed. **Navigation (P9)** — 4 predictable links, header + footer mirror each other, deep links per page. **Charts & Data (P10)** — score bars have text labels + letter grades (colour is never the only indicator); weights printed.

## Limitations of this run

1. **No live browser, no rendered screenshots.** Judgements are from source + the existing `.next` build output. Mobile behaviour at 390px, real font rendering, and the Jev screenshot-based tells could not be verified visually. The parent should run a live-browser pass (or `next build` + screenshot) for M1/M7/L6 at real widths.
2. **No `out/` directory; build not re-run.** The checked build output (`.next/server/app/*.html`) is from a prior build on disk; its freshness vs. the current branch was not verified (no rebuild, per the no-edit constraint — a rebuild writes `.next/`).
3. **Impeccable detector not run.** `impeccable detect` / `live-server` were not executed: the task forbids writes outside this report and the launcher downloads a binary on first run. The heuristic table above is a single-reviewer Assessment A, not a dual-agent critique.
4. **Briskly/Jev scores are replications.** Both detectors' rule lists were read as public text and applied by hand to the source. Briskly's own scoring weights were used arithmetically (20/70); Jev's score is an estimate because Jev weights a whole-page model judgement at 60% and this run has no model call.

---

## Fix order (do in this sequence; each item is independent)

1. **H1 — Load Inter or drop it.** `next/font/google` (or self-hosted woff2) in `app/layout.tsx`, or swap the stack. This alone removes Briskly's heaviest rule (8/70) and makes the design-notes §3 justification true. Decide first: it changes every rendered page.
2. **H2 — Delete the repeating kickers.** Remove `.eyebrow` from `/templates` (duplicates its H1), `/terms`, and `/audit` "Audit tool"; keep at most the `/` audience line if it must stay, in sentence case. Update `docs/design-notes.md` §3 to match.
3. **H3 — Drop heading weights to 600/500.** `app/globals.css:33-35`, plus the 48px figures. Update `docs/design-notes.md` §3 scale. Do with (2) as one type pass.
4. **M1 + M2 — Break the equal-card rhythm.** Restructure "How it works" as a vertical flow (numbers then earn their place); vary the two-col widths. Keep equal widths only for pricing tiers.
5. **M6 — De-duplicate the payment/status copy.** One mention on `/` pricing + one in `/terms`; delete hero-caption and footer instances.
6. **M7 — Reduce SAMPLE stamps to 2 on /sample.** Top of page + footer caption only.
7. **M3 + M8 — Small icon/CTA pass.** Drop the two `ArrowRight`s; remove `color="#0F766E"` from the step/tier icons.
8. **M5 + L6 — Interaction pass.** Add one shared hover-transition token; raise nav-link padding to reach 44px.
9. **M4 + L1 + L2 + L4 — Copy/micro pass.** Split the ScoreSummary caption; replace "✓" with Lucide `Check`; replace "…" with plain text; h3 650 → 600; inner radii 8px → 6px.
10. **L7 — Darken or delete `--faint`.** Before anyone uses it for text.
11. **No change:** L3 (semantic tints) and L8 (score bars) — documented as correct as-is.
12. **Re-verify after fixes:** re-run this same check (source + fresh `next build` + live-browser screenshot at 1440px and 390px) and re-score Briskly/Jev from the rebuilt output. Expected post-fix replicated Briskly: ~0–7/100.

## Sources applied

- Impeccable skill v4.9.2 — `~/.claude/skills/impeccable/SKILL.md` (read; launcher not run), `reference/critique.md` (rubric + heuristic table + degraded-run banner rule).
- Unslop (Damir Sokolovsky, CC BY 4.0) — `~/.claude/skills/unslop/SKILL.md`, `references/signs.md` (applied group by group).
- UI-UX Pro Max — `~/.claude/skills/ui-ux-pro-max/SKILL.md`, `references/pro-rules.md`, `references/quick-reference.md` (category headings; web-relevant subset applied, native-only tables noted as out of scope).
- Briskly AI Slop Detector — https://briskly.tools/tools/ai-slop-detector (11 rules + weights + score bands, read 2026-11-27; URL not submitted).
- Jev AI Slop Detector — https://madewithjev.com/free-tools/ai-slop-detector (34 tells, read 2026-11-27; URL not submitted).
- Product brief — `docs/design-notes.md` (used as the stated intent; conflicts with detector rules are called out, not silently resolved).
