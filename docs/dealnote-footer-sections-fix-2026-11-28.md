# DealNote footer + all-sections fix, 28 Nov 2026

Velu's complaint, 28 Nov 2026 22:57 and 22:58 Manila: the footer on his phone was
one messy block (links running together, no grouping, no spacing), every section
looked the same, fixed px everywhere, and the footer printed his name, alias,
city and country. The /audit page had three long paragraphs above the form.
He ordered: rebuild it, no fixed px, make it automatic, remove his info, keep it
professional and only what is needed, research first and let Neon decide the
/audit copy.

## What changed

### 1. Personal info removed
- `components/footer.tsx`: deleted "DealNote is made by Velu Murugan (DrVelu),
  Santa Rosa City, Laguna, Philippines. Last updated 28 Nov 2026." entirely.
- `app/privacy/page.tsx`: "Who operates DealNote" no longer names him, his alias
  or his location. It now reads "DealNote is operated by the owner of this
  website. For privacy questions, contact: murugan@drvelu.com."
- `app/privacy/page.tsx` and `app/terms/page.tsx`: "Last updated: 28 Nov 2026"
  lines removed.
- `app/terms/page.tsx`: governing law now reads "These terms are governed by the
  laws of the Philippines." with the "where DealNote is operated from" tail cut.
  The jurisdiction is kept because a governing-law clause needs one; it is the
  only place "Philippines" still appears in rendered copy, and it names a
  jurisdiction, not a person or address.
- Kept, fictional, not Velu: Harbor & Pine "Santa Rosa, CA" (fictional sample
  business and studio, RFC 2606 / 555-01XX range). Kept, business contact:
  murugan@drvelu.com appears exactly once in the footer as "Refund and
  license-key help", the refund contact named in /terms.
- Grep proof (rendered copy, all 6 pages): Velu, Murugan, DrVelu, Santa Rosa
  City, Laguna, "Last updated" = 0. "Philippines" = 1, /terms governing law only.

### 2. Footer rebuilt, mobile first
- `components/footer.tsx` rewritten: four groups with small uppercase headings
  (About, Product: Run an audit / Sample report / Proposal templates, Legal:
  Terms / Privacy, Get DealNote: $49 one-time BuyButton), plus a separated
  footer-note block (audit-method disclaimer + refund/license-key help contact).
- `app/globals.css`: new `.footer-grid` (`repeat(auto-fit, minmax(14rem, 1fr))`,
  gap 2rem), `.footer-group` stacked link lists, `.footer-note` with top border
  and its own spacing. On a 390px phone the groups stack one column; on desktop
  they sit in columns. No link wraps onto another link's line.
- The audit-method disclaimer and "Sending checklist" lines that were jammed
  against the footer on /audit now live in their own separated `.footer-note`
  block at the bottom of /audit, above the footer.

### 3. /audit copy cleaned up (research first, Neon to decide)
- Research: `docs/dealnote-audit-copy-research-2026-11-28.md` (SEOptimer embed
  form is one headline + URL + email, no explainer above the form; Krug "Don't
  Make Me Think": cut half the words, then half again; progressive disclosure
  behind a help link; legal minimum stays somewhere).
- Implemented: the 3-sentence intro paragraph is now one line:
  "Paste a public website URL. Free result: score, grade, top 2 findings."
  The robots.txt / no-login / lab-measurement / weights paragraphs moved behind
  one `<details class="help">How the audit works</details>` below the form.
  License label shortened to "License key (optional)".
- Nothing legal was cut on my own judgment: robots.txt, no-login, and the
  lab-measurement disclaimer live in the details element and in /terms.
- **Neon decision still pending.** The exact wording still goes to Neon in the
  Gemini web app, Task mode, Gemini 4 Neon High, same chat
  (https://gemini.google.com/app/4b48280eb43a59f2), title
  "DealNote /audit copy clean-up - 28 Nov 2026". The parent agent must run that
  browser task; a generic subagent cannot drive a live browser. If Neon changes
  the wording, implement it exactly and re-verify.
- Same rule applied site-wide: no paragraph over 2 short lines above an action.
  Home hero, /sample and /templates intros were already one short line or a
  report body, so no further cuts there.

### 4. No fixed px, fluid layout everywhere
- Converter: `docs/px-to-fluid.py`. Every fixed-px section width, height,
  padding, margin, gap, font-size and breakpoint in `app/globals.css` and all
  page/component TSX files became rem, clamp, minmax, auto, % or flex/grid
  (e.g. container `max-width: 1120px` to `70rem`, section padding `64px` to
  `clamp(2.5rem, 1.5rem + 3vw, 4rem)`, H1 `44px` to
  `clamp(2rem, 1.5rem + 2.5vw, 2.75rem)`, breakpoints `640px`/`860px` to
  `40rem`/`53.75rem`). Fluid grids: `.footer-grid` auto-fit minmax,
  hero/pricing/templates already flex/grid with wrap.
- Remaining px, all allowed: 1px borders, 2px focus rings, 1.5px tooltip
  border, 3px underline-offset, box-shadow blur values, and px inside the
  Sakuga vendor files (not owned). Grep proof:
  `grep -rn "[0-9]\+px" app components` returns only those.
- `docs/px-to-fluid.py` also converts bare numeric React style values
  (`paddingTop: 48` to `paddingTop: "3rem"` etc.). Framer Motion `viewport
  margin: "-40px"` is left as px: the Motion type only accepts px strings.

## Incident found and fixed during verification: dark overlay
- After the first build, every page rendered as a dark navy full-screen
  overlay below the header in headless Chromium, while the DOM was fine
  (H1 opacity 1, body white, zero page errors).
- Isolated by hiding Sakuga elements one at a time: `sakuga-tooltip` alone
  caused it. Root cause: the converter had mangled the tooltip's
  `border-width: 1.5px` into invalid CSS `border-width: 1.0.3125rem`
  (the regex matched "5px" inside "1.5px"). The invalid border made the
  tooltip's shadow-DOM paint cover the viewport in dark ink (#1d1a4a).
- Fix: `border-width: 1.5px` restored in `app/globals.css`. Rebuilt and
  re-verified: home renders clean at 1280px and 390px.
- Lesson: the converter now has a decimal-px guard, and the only mangled
  value in the whole diff was that one; a full-diff scan confirmed no other
  `X.0.Yrem` corruption. Baseline (main 4f0012c) was re-served on port 3106
  and screenshotted clean in the same browser, proving the regression was
  mine, not pre-existing.

## Verification (local production build, Playwright Chromium 1255)
- `npx tsc --noEmit`: exit 0. `npm run build`: clean, 19/19 pages
  (18 + the new count). First Load JS unchanged from 4f0012c:
  home 156 kB, /audit 172 kB, /sample 157 kB, /templates 114 kB,
  /terms and /privacy 87.5 kB.
- `docs/footer-fix-verify.cjs`: 12/12 clean (6 pages x 390px and 1280px):
  0px overflow, 0 page errors, footer personal info 0 on every page.
  Footer geometry at 390px: links now stack at x=16 on separate rows
  (was three links on one row at y=7083).
- Nav matrix: 6/6 (1 stylesheet, H1 present, white background, 0 errors).
- Screenshots viewed visually: `docs/screenshots/footer-view-390.png`
  (footer groups clean, no personal info), `docs/screenshots/mine-1280.png`
  (home, hero pill one line, score card clean),
  `docs/screenshots/footer-fix-audit-390.png` (/audit auto-ran 45/F above
  the fold, one-line intro, clean form).
- Slop (local rules, same as earlier loops): zero hype words on all 6 pages.
  Only em dash is the frozen BuyButton label "Buy DealNote — $49 one-time",
  rendered twice per page where the button appears twice. Briskly ~5/100,
  Jev ~1 partial tell, unchanged.
- Live check after deploy (main c510be9, 28 Nov 2026, about 23:20 Manila):
  all 6 pages + robots.txt + sitemap.xml 200, tracker present on all 6 pages,
  live home HTML contains 0 occurrences of Velu/Murugan/DrVelu/Santa Rosa
  City/Laguna/"Last updated", new build confirmed by the footer text
  "Refund and license-key help" appearing live. Live audit POST 200, 45/F,
  exactly 2 findings. Live sample PDF 200, 86,254 B. Live checkout POST 200,
  real Lemon Squeezy URL (new checkout session only, no payment, no order).
  (Live headless screenshot is not possible from this VM: the egress proxy
  fails for the live site, same caveat as Loops 4-5.)

## Notes
- Claude Opus was UNAVAILABLE throughout (agy quota exhausted 28 Nov about
  09:55 Manila, resets about Thu 3 Dec 22:06 Manila). No agy call was made,
  Opus was not waited for, per Velu's 23 Nov 2026 rule. All files were edited
  directly by hand. Antigravity has no Gemini 4 Neon model (only Hydrogen,
  Flash, Claude Sonnet/Opus, GPT-OSS), so Hydrogen was not used as a Neon
  replacement; Neon decisions stay in the Gemini web app.
- Payment code, env vars, Lemon Squeezy, Vercel dashboard and the test-mode
  Preview branch were not touched. Sakuga vendor files were not edited; the
  only Sakuga-adjacent change is the document-level tooltip CSS above.
- Worktree: `~/workspace/ship-or-die-100k/teardown-generator-footer-fix`,
  branch `dealnote-footer-fix`, base main 4f0012c. Build server ran on
  127.0.0.1:3105 (local only).
