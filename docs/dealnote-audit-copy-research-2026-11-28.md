# /audit copy research, 28 Nov 2026 (research first, Neon decides)

Velu, 28 Nov 2026, /audit screenshot: "too much text, why like that, clean it. Research first and then neon decide."

## Current /audit copy (before, mobile 390px, top of page)

1. Intro paragraph, 4 sentences, ~55 words: "Paste a public business website URL. The audit runs on the server, reads the homepage, and scores six categories. The free result shows the overall score, grade, and top 2 findings. Enter a license key to unlock the full report, the white-label preview, and the proposal."
2. After the URL card: "Public http or https addresses only. The audit reads the homepage and checks up to 10 internal links. It never submits forms, logs in, or bypasses a login page. If the site's robots.txt asks automated tools not to fetch the page, the audit will not run and no score will be given." (~50 words)
3. Then: "Scores are DealNote's own measurements from this run, not Lighthouse, PageSpeed, or search-ranking scores. Scores can vary between runs. Weights: Speed 20, Mobile 15, On-page SEO 20, Technical 15, Conversion 15, Trust & local 15." (~35 words)
4. Then: "License key (optional, unlocks the full report)" label + field.

Total above the fold before any action: ~140 words in 3 paragraphs. That is the mess Velu saw.

## Research

### SEOptimer (the comparator on the pricing card, $39/mo White Label)
- Embeddable audit form is deliberately minimal: visitor enters website URL + email, nothing else. Headline pattern from its own guide: "Get Your Free SEO Audit in 20 Seconds."
- Report is produced in ~20-30 seconds and shown as a modal / new tab / PDF. No long explainer sits above the form; how it works, what is checked, and limits live in the report and in help docs, not on the form page.
- Sources: seoptimer.com/blog/how-to-embed-audit-form, seoptimer.com/blog/how-to-win-clients-with-seoptimer/, seoptimer.com/embeddable-audit-tool/

### UX rules that apply (Krug, "Don't Make Me Think"; Nielsen heuristics)
- Users scan, they do not read. Get rid of half the words on each page, then get rid of half of what is left.
- Every question mark in the user's head adds cognitive load. A form page should be self-evident: what to type, what happens next, nothing else.
- Progressive disclosure: detail that only some users need (weights, robots.txt, login policy) goes behind a help link / "?" / collapsible, not in the main flow.
- Copy pattern: label says what to do, hint says the one constraint, tooltip holds the rest.

### What must stay somewhere (legal / honesty minimum)
- Robots.txt is honoured, no login bypass, no form submission. This is a real behaviour users must know, but it only matters when an audit fails, so it belongs in the failure message and in /terms, not above the form.
- Scores are DealNote's own lab measurements, not Lighthouse/PageSpeed/search-ranking scores, and can vary between runs. Honesty copy, but one short line under the result, not a paragraph above the form.
- Scoring weights (Speed 20, Mobile 15, SEO 20, Technical 15, Conversion 15, Trust 15) belong on the result/report, where the score is shown, not above the form.
- Free tier = score + grade + top 2 findings; full report needs a license key. This is the one line that decides whether to type a key, so it stays, as one short line under the form, not a paragraph above it.

## Proposed clean /audit (for Neon to decide, NOT implemented as final)

- H1: "Run an audit" (keep).
- One line under it: "Paste a public website URL. Free result: score, grade, top 2 findings."
- Form card: URL label, input, Run audit button. One hint line under the input: "Public http or https addresses only."
- License key: label only, "License key (optional)", hint "Unlocks the full report and PDFs."
- Everything else behind one "How the audit works" collapsible / "?" link: server-side homepage fetch, up to 10 internal links, robots.txt honoured, never logs in or submits forms, lab-measurement disclaimer, weights.
- Same rule on every page: no paragraph over 2 short lines above an action; detail goes behind a help link or below the fold.

## Neon brief (for the parent to run in the browser)

Task mode, Gemini 4 Neon High, same Gemini chat https://gemini.google.com/app/4b48280eb43a59f2, title "DealNote /audit copy clean-up - 28 Nov 2026". Give Neon the research above plus the current /audit copy, and ask it to decide the exact copy: what stays, what goes behind a "How it works" or "?" link, what is cut entirely, exact wording, short. Do not cut legal or honesty copy on Neon's say-so alone without naming where it lives instead. Report Neon's decision back, then implement it exactly.
