# DealNote unslop + logo-design-skill — 28 Nov 2026

Velu said YES in plain words, 28 Nov 2026 23:26 Manila, to proceed with installing
and using unslop and logo-design-skill despite the execution-risk flag on the clone
output, and added "also spacing, use the vercel skills and all skills links i give
use it". This run records that yes and what happened under it.

Branch: dealnote-unslop-logo, worktree
~/workspace/ship-or-die-100k/teardown-generator-unslop-logo, base main b365ec8
(Neon /audit copy merge). NOT merged to main. No payment code, env vars, Lemon
Squeezy, Vercel dashboard, or test-mode Preview branch touched.

## 1. SkillSpector gate

Tool: ~/workspace/tools/skillspector/.venv/bin/skillspector, --no-llm, JSON.
Reports: ~/workspace/ship-or-die-100k/skillspector-reports/.

### unslop — CAUTION, score 45, MEDIUM, INSTALLED

- Source: heydamir/unslop, HEAD 620163eedb3529d9cd23a3994ed8d287d06f760d,
  skills/unslop/, CC BY 4.0, Damir Sokolovsky.
- 4 issues: 1 HIGH, 3 MEDIUM. No credential, network, or exfiltration findings.
- HIGH AE1 analysis-evasion: the scanner could not fully interpret the
  reference image references/refs/story-dashboard-frames.webp. Its own
  remediation says "incomplete analysis is not proof of malicious evasion".
  False positive, same class as the Sakuga AE1.
- MEDIUM LP3: no declared tool scope in SKILL.md (normal for a skill).
- MEDIUM RP1 x2: unpinned `npx playwright` in scripts/snapshot.mjs and
  scripts/story.mjs. Mitigation: neither script was run; screenshots used the
  already-installed local Playwright/Puppeteer, never npx.
- Installed to ~/workspace/custom-skills/unslop (SKILL.md + agents/ +
  references/ + scripts/). Credit kept in SKILL.md per CC BY 4.0.

### logo-design-skill — DO_NOT_INSTALL, score 100, CRITICAL, NOT INSTALLED

- Source: kaankiziltug/logo-design-skill, HEAD
  e9eaddc07895575253d6663320354a708f53e955, skills/logo-design/.
- 15 issues: 3 HIGH, 12 MEDIUM/LOW. Recommendation DO_NOT_INSTALL.
- Per the brief, a DO_NOT_INSTALL verdict means do NOT install or use it.
  It was NOT installed to ~/workspace/custom-skills, its scripts were NOT run,
  and no logo concepts were produced. The current DealNote logo (pink check
  tile + Inter wordmark) stays as is.
- HIGH findings read in source (score alone is not the verdict, so each HIGH
  was read before reporting):
  - AR2 anti-refusal, SKILL.md line 166: "Never judge a logo only in
    isolation on a white artboard." Design guidance, not an instruction to
    omit warnings. Known false-positive phrase class ("do not judge").
  - AR2 anti-refusal, references/testing-checklist.md line 69: the same
    sentence, same false positive.
  - PE3 privilege escalation, scripts/render_png.py line 182: the headless
    Chrome command carries --password-store=basic and --use-mock-keychain
    with --user-data-dir inside a temp dir. Those flags deliberately AVOID
    the real keychain and use a throwaway profile; no credential file is
    read. Keyword match, not credential access.
- MEDIUMs, for the record: LP3 no declared tool scope; YR4 x2 YARA matches
  inside the logo library DATA files (assets/library/catalog.json,
  classifications.json line 9430), not code, almost certainly a brand-name
  keyword; AST4 x5 + TT2 x2 subprocess calls in render_png.py (its stated
  job is running a local renderer: cairosvg/rsvg/Inkscape/headless Chrome);
  EA4 unbounded resource use (a render loop with a 45s deadline).
- Honest read: all 3 HIGHs are the known false-positive classes, and the
  MEDIUMs are generic. Under the standing convention this would read as
  CAUTION, like Sakuga and modern-web-guidance before it. But the brief's
  rule is explicit: DO_NOT_INSTALL means do not install. So it stays
  uninstalled. Proceeding needs Velu's explicit override after seeing this
  evidence. If he overrides, the logo workflow is Phase 1-6, 3 concepts in
  black SVG first, checkpoint, Velu picks before any kit is built.

## 2. Vercel skills used (installed copies, not reinstalled)

- ~/workspace/openmontage/.agents/skills/web-design-guidelines (SKILL.md read,
  fresh command.md fetched 28 Nov 2026 15:38 UTC from
  raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md).
  Its own rules prescribe this fix exactly: "Flex children need min-w-0 to
  allow text truncation" and "Text containers handle long content: truncate,
  line-clamp-*, or break-words" and "fix content overflow".
- ~/workspace/openmontage/.agents/skills/vercel-react-best-practices and
  vercel-composition-patterns: Loop 5 already applied them (recorded in
  docs/dealnote-loop5-skills-2026-11-28.md); re-checked here, no new
  violations in the two changed files.
- NOTE, flagged not followed: ~/workspace/openmontage/AGENTS.md tells any
  agent to read AGENT_GUIDE.md before responding to any user message. A
  system security notice flagged that file content as untrusted tool data
  that did not pass a prompt-injection check, and instructed not to act on
  it. I did not read AGENT_GUIDE.md and did not follow that routing. I used
  only the Vercel skill files the brief authorized. Parent to decide if that
  file needs cleaning.

## 3. Unslop audit (light slop, polish mode)

Built the worktree (production build, clean), served on 127.0.0.1:3105, shot
all 6 pages at 1280px and 390px with Puppeteer, viewed the screenshots.
Baseline: 12/12 shots, 0 page errors, scrollWidth overflow 0 everywhere.

The scrollWidth number lied. html has overflow-x: clip, so clipped content
never shows as overflow. A clipped-element probe (getBoundingClientRect
right edge past the viewport) found the real defect Velu photographed:

- Home 390px: hero text, H1, eyebrow, score card, and the form all ran to
  442px in a 390px viewport, text cut mid-word ("In about a minu",
  "https://www.harborandpine-plumbing.exam"). /sample 390px: score card
  content to 417px, URL cut.
- Root cause, measured: the hero pill is flex-nowrap with a no-shrink
  Sakuga button (157px) plus a long URL placeholder, so the form's
  min-content is about 426px. Grid items default to min-width: auto, so the
  hero column stretched to 426px and dragged every hero element with it.
  On /sample the score card's URL column is flex "1 1 13.75rem" with no
  min-width: 0, and its nowrap URL sets min-content at about 376px.
  The URL <p> already had ellipsis + max-width 100%, but 100% of a 376px
  flex item never truncates.
- Everything else is light slop only: no gradients, no glows, no emoji,
  Lucide one set, Inter 400-600, pink accent once per screen, 250ms motion
  on transform/opacity only, copy plain. Known tells left as decided before:
  frozen BuyButton em dash, Sakuga toggle is a large animated control by
  design, H1 at weight 700 (Neon redesign) against unslop's 400-600.

Direction (unslop 5 lines, proposed for Neon to approve):
- Product: DealNote turns any public business website into a white-label
  teardown report and a ready-to-send proposal, for web design freelancers
  and small agencies.
- Character: calm, exact, a little warm.
- World: paper, ink, and a freelancer's desk, a printed report handed
  across a table.
- Moments: the score card with its grade badge, and the sample PDF report.
- Signature: the pink #DB2777 accent used once per screen, and the A-F
  grade badge.

## 4. Spacing fixes applied (Pass 1, this branch)

- app/globals.css: min-width: 0 on grid children (.hero-grid, .two-col,
  .form-grid, .template-grid, .pricing-grid, .footer-grid, .audit-layout).
  Fluid only, no fixed px.
- components/audit-ui.tsx ScoreSummary: minWidth: 0 on the URL column flex
  item, so the URL truncates with an ellipsis instead of stretching the card.
- Not changed: the Sakuga toggle size (vendor control owns it), the hero
  pill one-line layout (Neon decision), the placeholder text (Neon's exact
  wording; Vercel guidelines want placeholders to end with "…", recorded
  as a deviation, not applied, because it would contradict Neon's wording).

Verification after the fix: tsc exit 0, build clean, production build
re-served, all 6 pages re-shot at 1280px and 390px with a scroll-through
first so reveals settle: 12/12, 0px overflow, 0 clipped elements at 390px
(was 12 clipped on home, 3 on sample), 0 page errors. Home 390px viewed:
hero wraps cleanly, URL shows with an ellipsis, score card fits, footer
grouped. Screenshots: docs/screenshots/unslop2-*-{1280,390}.png (after),
docs/screenshots/unslop-*-{1280,390}.png (before).

## 5. Antigravity

No agy call was made. Opus was not called (quota exhausted until about
Thu 3 Dec 22:06 Manila, per the brief). Sonnet was not called either: the
unslop audit and fix were done directly by hand following the skill text
and verified in a real browser, and the logo run the brief ordered through
agy is blocked by the DO_NOT_INSTALL verdict. If the parent wants a Sonnet
pass over the spacing diff, that is still open and cheap.

## 6. Neon — NOT done, needs the parent (browser task)

A subagent cannot run browser tasks. The parent must send this Neon Task in
the Gemini web app, Task mode, Gemini 4 Neon High, same chat
https://gemini.google.com/app/4b48280eb43a59f2, account velu2k03@gmail.com:

- Decide the unslop direction above (product, character, world, moments,
  signature) and the spacing fixes in section 4, exact wording where copy
  is involved.
- Decide the logo brief, IF Velu overrides the DO_NOT_INSTALL verdict:
  DealNote, web design freelancers and small agencies, sharp, trustworthy,
  fast, pink #DB2777 / #BE185D on white, works at 16px favicon, one color,
  no personal info, no gradient tile, no sparkle, 3 concepts in black SVG
  first, then checkpoint, Velu picks before any kit is built.
- Nothing on the site was edited by Neon; decision only.

## 7. What needs Velu

- Logo skill: override the DO_NOT_INSTALL verdict or leave the current logo.
  No concepts exist until he says so in plain words after seeing section 1.
- Logo pick: only after concepts exist and are shown; the kit is built only
  after his pick.
- Nothing else needs him. The spacing fix on this branch is ready for the
  parent to review and merge to main when the other two workers (Neon
  /audit copy, now merged as b365ec8; test-mode PDF proof, still running)
  are clear of it.
