# Neon /audit copy decision, implemented and live, 28 Nov 2026

Neon's decision: Gemini 4 Neon High, Task mode, Gemini web app, chat
https://gemini.google.com/app/4b48280eb43a59f2, conversation
"DealNote /audit copy clean-up - 28 Nov 2026". The browser worker
independently verified the one-line intro and the "How the audit works"
details were already live before this change. Nothing on the site was
edited by Neon; this change implements its decision word for word.

- Base: main 20e1b75
- Branch: dealnote-neon-audit-copy, commit ad75d72
- Files: app/audit/page.tsx, components/audit-ui.tsx (ScoreSummary and
  IssueList, shared with /sample), app/globals.css (.utility-row,
  .micro-label)
- Payment code, env vars, Lemon Squeezy, Vercel dashboard, and the
  test-mode Preview branch were not touched. Claude Opus was unavailable
  (agy quota exhausted 28 Nov about 09:55 Manila, resets about Thu 3 Dec
  22:06 Manila); no agy call was made, all files edited directly.

## What stayed visible, implemented

- H1 "Run a teardown"; intro "Paste a public website URL. Free result:
  score, grade, top 2 findings."
- Input label "Website URL" as a 12px micro-label; placeholder changed
  from https://www.example-plumbing.com to Neon's
  https://example-plumbing.com; primary button "Run audit".
- Inline utility row directly below the bar, 1 line, 2 disclosures:
  "How the audit works" and "Have a license key?", side by side on
  desktop, stacked on a phone (fluid flex, no fixed px).
- Empty state: the whole "No audit yet" card is replaced by one line:
  "Want to see a finished report first? View sample report (fictional
  data)."
- Result state: score card header {score}/100, {Grade}, {url}, Run
  {date} (already the case); 1-line score disclaimer directly under the
  score: "DealNote lab measurement on the run date, not Lighthouse,
  PageSpeed, or a search-ranking score. Scores can vary between runs.
  [?]" (Neon's text uses an em dash before "not"; a comma is used
  instead, so no new em dash enters rendered copy).
- Findings heading "Top findings" (locked and unlocked); finding row
  labels "Found: / Why it matters: / Fix:" (was "What was found:").
- Paywall card: heading "Unlock the full report", body "All findings,
  white-label preview, proposal, and PDF downloads.", primary button
  "Buy DealNote, $49 one-time", inline key row with License key input
  ("Paste your license key") + "Unlock" button.
- Pre-footer, 1 line only: "Before you email a prospect, read the
  Sending checklist."

## Behind disclosures, exact wording

A. Behind "How the audit works":

> What we check: DealNote fetches the public homepage (http or https
> only) and checks up to 10 internal links on the server. It never logs
> in, submits forms, or bypasses a login wall. If robots.txt disallows
> automated fetches, the audit stops and no score is given. No Google
> Maps/Places data, traffic estimates, or invented figures are used.
>
> How scoring works: Scores are DealNote's own lab measurements on the
> run date, not Lighthouse, PageSpeed, or search-ranking scores, and can
> vary between runs. Weights: Speed 20, Mobile 15, On-page SEO 20,
> Technical 15, Conversion 15, Trust and local 15. Grades: A 90-100,
> B 80-89, C 70-79, D 60-69, F below 60.

B. Behind the [?] popover next to the 1-line score disclaimer
(SakugaTooltip, label "?"):

> Scoring model: Six areas scored 0-100, weighted and summed: Speed 20,
> Mobile 15, On-page SEO 20, Technical 15, Conversion 15, Trust and
> local 15. Unreadable checks never lower a score. Grades: A 90-100,
> B 80-89, C 70-79, D 60-69, F below 60. This is DealNote's own model,
> not an industry standard.

C. Behind "Have a license key?": License key input ("Paste your license
key") + "Save key" button (saves to local storage, shows a toast) +
"Stored only in this browser. Lost your key? Check your Lemon Squeezy
receipt email or email murugan@drvelu.com."

## Cut entirely

- The "Public http or https addresses only." helper line (moved inside
  "How the audit works"; a bad URL still shows the inline validation
  error).
- The open "License key (optional)" input plus duplicate Buy DealNote
  button inside the top form card (key collapsed behind "Have a license
  key?"; Buy stays in the result paywall and the footer).
- The "Your brand profile and outreach tracker are stored only in this
  browser's local storage..." paragraph from the form card (already
  covered in /privacy; the same notice still appears in the white-label
  preview and outreach tracker sections where it belongs).
- The full "No audit yet" empty-state card plus its 2-sentence sample
  disclaimer (replaced by the 1-line link above).
- The 5-sentence score-model paragraph on the Score card (split into the
  1-line disclaimer and the [?] popover).
- The pre-footer "Audit method: direct fetch of the public homepage
  only..." paragraph (duplicate; removed from the visible pre-footer).
- "Enter your key and run the audit again to see the full report."
  NOT replaced: the Unlock button re-runs the audit with the key in one
  click, so no separate re-run step is needed. No "Re-run after saving
  your key." line was kept, because the button itself does the re-run.

## No fixed px, no personal info

- New CSS is fluid only: .utility-row is flex with wrap and a
  1 1 16rem basis; .micro-label is 0.75rem. No new fixed px anywhere.
- No name, alias, city, country, or last-updated date was added. The
  only personal-adjacent string in the new copy is the existing business
  contact murugan@drvelu.com in the license-key recovery line, which
  Neon specified and which the refund terms already name.

## Verification (local production build, main 20e1b75 + ad75d72)

- tsc via `next build`: clean, 19/19 pages. First Load JS /audit
  172 kB (was 177 kB in Loop 5, 182 kB in Sakuga; the copy cut shrank it).
- Playwright Chromium 1255, script
  ~/workspace/ship-or-die-100k/neon-copy-verify.mjs: 35/36 checks passed.
  All 26 static checks at 390px and 1280px passed (0px overflow, H1,
  one-line intro, empty-state line, cut items absent, both disclosures
  with exact wording, Save key button, pre-footer 1 line). All 9
  result-state checks passed after a live local audit of example.com
  (1-line disclaimer, no 5-sentence paragraph, Top findings, Found:
  labels, no "What was found:", paywall heading and body, no
  "Enter your key again" line, [?] tooltip present).
- The 1 failing check is "0 page errors": 2 console errors,
  "Failed to load resource: net::ERR_TUNNEL_CONNECTION_FAILED", both
  from the external Ship or Die tracker script
  (https://www.ship-or-die.com/hackathon/verify.js) failing through the
  sandbox egress proxy. Pre-existing and environmental, not caused by
  this change; the same caveat applied in Loops 4-5. No pageerror events.
- Screenshots viewed: docs/screenshots/neon-copy-audit-390.png and
  docs/screenshots/neon-copy-audit-1280.png. Utility row is one line
  with two disclosures at both widths; empty-state and pre-footer are
  each one line; footer stays grouped and clean.
- Slop re-run (rule replication, same method as prior rounds): zero hype
  words in the rendered /audit copy; exactly 1 em dash in rendered copy,
  the frozen BuyButton label "Buy DealNote — $49 one-time"; zero new em
  dashes in the added lines (git diff grep). Briskly about 5/100, Jev
  about 3-5/100, unchanged.

## Live verification

- Main HEAD: b365ec8 (merge of dealnote-neon-audit-copy), pushed to
  origin. Vercel auto-deployed.
- All 6 pages + /robots.txt + /sitemap.xml: 200. Tracker script present
  on home (1 occurrence of ship-or-die.com/hackathon/verify.js).
- Live /audit HTML: one-line intro present, "How the audit works"
  present, "Have a license key?" present, "Want to see a finished
  report first" present, "No audit yet" absent (0), placeholder
  example-plumbing.com present.
- Live POST /api/audit {"url":"https://example.com"}: 200, score 45,
  grade F, teaser true, exactly 2 findings ("Meta description is
  missing", "No phone number visible on the homepage").
- Live POST /api/checkout {}: 200, real Lemon Squeezy URL
  (pay.resonantatlas.com, new checkout session only, no payment).
- Live GET /api/pdf/sample: 200, 86,254 B.
- Live headless screenshot was not possible from this VM (egress proxy
  fails for the live site, same caveat as Loops 4-5); local production
  screenshots above are of the exact shipped commit.
