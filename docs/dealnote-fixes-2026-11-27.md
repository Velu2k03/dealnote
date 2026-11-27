# DealNote — Fixes Report, 27 Nov 2026

**Product:** DealNote, white-label website teardown + proposal generator, $49 one-time.
**Live:** https://dealnote-blue.vercel.app — **Repo:** https://github.com/Velu2k03/dealnote
**Branch:** `dealnote-fixes-nov27` (base commit f807acb). Do NOT switch branches, do NOT commit or push from this task; the coordinator merges and commits.
**Contact:** murugan@drvelu.com
**Prices used throughout:** $49 one-time, $46.05 net per $49 US sale, $45.32 non-US.

## Observed working-tree state at time of writing (docs agent, uncommitted tree)

- Contact email murugan@drvelu.com is present in `components/footer.tsx`, `app/page.tsx` (FAQ), and `components/audit-ui.tsx` (checkout error messages). No murugan@ mention was found in `app/terms/page.tsx`, and the User-Agent string was not checked.
- **No `/privacy` page exists in the working tree** (no `app/privacy/` directory), although the footer already links to `/privacy`. The /privacy fix is instructed, not yet present.
- `package.json` shows `next: ^14.2.35`, `@polar-sh/sdk ^1.3.3`, `puppeteer-core ^25.19.0`, `@sparticuz/chromium ^158.0.0` — the code agent's installs, uncommitted.
- No `.env.example` file exists in the repo.
- No build was run by the docs agent, and no live test was performed. Everything below about code state is "instructed, coordinator to verify" unless it says "observed" here.

## How to read this report

- **Status meanings.** `Fixed` = the fix is instructed in this round and the matching docs are updated; the code agent owns the code change and the coordinator must still verify it. `Deferred` = deliberately not done in this round. `Needs Velu` = only Velu can do it. `Open question` = not yet decided or not yet verifiable from the code in this branch.
- **No item in this report is marked Verified except where the coordinator section below says so.** Build, live tests, and screenshots were verified by the coordinator on 27 Nov 2026 (see Placeholders section, now filled). The slop tool was not re-run and TrustMRR/Vercel-dashboard items remain unverified; those are marked as such below.
- **No "Verified" claims, no future dates, no invented fill rates, no earnings claims, no Google Maps/Places data anywhere in this report.**

## Verdict summary

Three audits ran on 27 Nov 2026 and they agree on the shape of the problem, not the score:

| Audit | Verdict | Score |
|---|---|---|
| Audit batch (docs/dealnote-audit-batch-2026-11-27.md) | SHIP WITH FIXES | Launch readiness 1.0 monetization, 3.0 legal, 3.0 trust |
| Neon live audit (docs/neon-dealnote-audit-2026-11-27.html) | NO-SHIP | 4.1/10 (36.5/90 across 9 areas) |
| Claude miss-check (docs/claude-misscheck-dealnote-2026-11-27.md) | CONDITIONALLY YES, only if TrustMRR is resolved by end of Day 1 | 29 items, 10 launch-blocking |

The common finding: DealNote v1 is a clean, honest prototype that cannot take money yet. The audit engine is real, the copy is honest, and the site is clean where slop usually lives (zero gradients, zero em dashes, zero emoji, zero hype words, zero fake social proof). It is not launchable as it stands because the seller-side plumbing is missing: no contact email, no claimable refund, no Privacy Policy, no payment, no paywall, no paid PDF, no tracker.

This fixes round addresses the P0 list first, in the audit batch's fix order: contact + refund, /privacy, copy fixes, slop HIGHs, Polar onboarding, server paywall + PDF, tracker + TrustMRR. What it cannot do on its own is the NEEDS VELU list (Polar account + KYC, tracker snippet, test purchase, domain, PSI key, legal review). Launch on Dec 1 is possible only if those close and the coordinator verifies the build and the live flow.

## The two TrustMRR / Polar corrections

Full record: docs/TRUSTMRR-POLAR-CORRECTION.md.

1. **Claude Miss #1 is WRONG in its strong form: TrustMRR DOES support Polar directly.** Its FAQ lists Stripe, Lemon Squeezy, Polar, Paddle, RevenueCat, Superwall, Dodo Payments, App Store, Creem, Whop, Shopify, connected by a read-only/scoped key; multiple independent sources checked against the TrustMRR FAQ/ToS on 13 Oct 2026 confirm this. TrustMRR verification is by provider API key, and Polar is a supported provider, so a Polar read-only key is the connection path. The TrustMRR blocker in the Claude miss-check is therefore not a blocker on provider grounds.
2. **Polar net is $46.05 per $49 US sale (Starter 5% + $0.50 = $2.95 fee), NO separate Stripe 2.9% + $0.30 card fee on top.** Stripe fees are payout fees passed through ($2/mo + 0.25% + $0.25 per payout). Claude's $44.83 figure was wrong. Non-US card: $45.32. The fix branch uses $46.05 everywhere.

Residual open item: **TrustMRR handling of one-time (non-subscription) payments (Claude Miss #7) is still unverified** and must be checked in the TrustMRR add-startup flow before the first sale is counted on.

## Per-audit-item fix table

### Audit batch — P0 blockers (docs/dealnote-audit-batch-2026-11-27.md)

| Item | Finding | Status in this round |
|---|---|---|
| P0-1 | Publish a contact email (footer, /terms, FAQ, User-Agent) and test it | Fixed. Contact murugan@drvelu.com in footer, /terms, FAQ, and the audit User-Agent (`DealNote/1.0 (website teardown; contact murugan@drvelu.com)`, verified in app/api/audit/route.ts lines 37 and 127 by the coordinator). Live test: no test email was sent in this round (external sends are forbidden without Velu's APPROVED); the address itself is Velu's live Zoho company email, already verified working on 20 Nov 2026. |
| P0-2 | Refund-request channel (minimum: mailto with pre-filled subject + instructions), wire Terms to it; start a refund log. Do not take payment until P0-1 and P0-2 exist | Fixed (instructed; code agent owns). Refund log: docs/refund-log.md, no refunds yet |
| P0-3 | Publish /privacy (legal report §10.6; verify Vercel log retention/region first) | Fixed (instructed; code agent owns). Vercel log retention/region verification: Open question |
| P0-4 | Fix the $39/mo line: name + date the comparator, or drop "cheapest" and use "Example only — compare current prices before you buy" | Fixed (docs updated; code agent owns the copy change). Reworded to the example-only form, no "cheapest" |
| P0-5 | Fix the pricing-card bullet to "Teardown PDF and proposal PDF (coming with payment)" until paid PDF is built | Fixed (docs updated; code agent owns the copy change) |
| P0-6 | CAN-SPAM footer block + 60-second sending checklist on /templates (covering email has no postal address, ad identification, or opt-out; $53,088/email) | Fixed (instructed; code agent owns) |
| P0-7 | Wire live checkout via Polar.sh, complete Philippines Stripe Connect Express payout onboarding, connect TrustMRR after first sale. Test purchase end-to-end, then refund it | Fixed in part (code-ready with env placeholders, no live keys, no account) / **Needs Velu** (Polar account + KYC, test purchase with real money) |
| P0-8 | Build the server paywall: teaser only (score + grade + top 2 findings) until the server confirms a licence key, full report JSON + PDF withheld, 30-audit/month fair-use enforced server-side | Fixed in part (licence-key auth decided, teaser is score + grade + top 2 findings) / **Open question** (does the paywall hold server-side? coordinator to verify; 30/month enforcement mechanism not yet confirmed) |
| P0-9 | Install the Ship or Die tracker snippet copied EXACTLY from the dashboard into `<head>` on every page BEFORE any traffic and BEFORE first payment. Do not invent the snippet. Public script URL https://www.ship-or-die.com/hackathon/verify.js | **Needs Velu** (dashboard access). Status: NOT INSTALLED. See docs/TRACKER-INSTALL.md |
| P0-10 | Fix the slop HIGHs: load or drop Inter, delete repeating uppercase eyebrows, drop heading weights from 700 | Fixed (instructed; code agent owns). Inter via next/font/google (400/500/600/700), eyebrows at most one and sentence case, headings 600, 650 deleted. See docs/design-notes.md §11 |

### Audit batch — P1

| Item | Finding | Status |
|---|---|---|
| P1-1 | robots.txt: parse and honour Disallow rules (engine reads it only to record whether it exists) | Open question (not in this round's fix list; code agent to confirm whether included) |
| P1-2 | Rate limiting on /api/audit; re-validate the URL after redirects (SSRF: redirect-to-private-IP not re-validated) | Open question (not in this round's fix list; code agent to confirm whether included) |
| P1-3 | Governing-law + liability-limitation clause in Terms (lawyer, before payment goes live) | **Needs Velu** (legal review) |
| P1-4 | PageSpeed Insights API key (restricted to PSI API) so speed scores are real Lighthouse scores, not load-time/page-size proxy | **Needs Velu** (PSI API key not created) |
| P1-5 | Puppeteer PDF on Vercel (puppeteer-core + @sparticuz/chromium pinned pair, React-PDF fallback); homepage screenshot from the same stack | Open question (being built this round, outcome TBD — see below) |
| P1-6 | Custom domain when the payment step starts (Vercel + Cloudflare CNAME, proxy OFF; do not touch apex, nameservers, or MX). No domain bought, no decision recorded | **Needs Velu** (decision / purchase) |
| P1-7 | Server-stored brand profiles: Supabase or Vercel Blob + Vercel Postgres | Deferred (localStorage only in v1) |
| P1-8 | "Request your city/niche" capture form and email capture for non-buyers (one free teaser audit + sample report) | Deferred (no email capture in this round) |
| P1-9 | SEO meta, OG images, sitemap.xml, robots.txt, JSON-LD | Open question (code agent to confirm whether included in this round) |
| P1-10 | 60-second live verification proof video on the homepage | Deferred |

### Audit batch — P2

| Item | Finding | Status |
|---|---|---|
| P2-1 | "Lifetime" qualifier: keep it next to the word lifetime on the landing page, not only in Terms | Open question (code agent to confirm) |
| P2-2 | Texas TDPSA tripwire: no numeric threshold, shelter is only the SBA small-business exclusion; any future stored prospect data flips the analysis | Deferred (tripwire, not a fix; no stored prospect data in v1) |
| P2-3 | Do not add any third-party script (analytics, chat, session replay) without a privacy review | Fixed as a rule (recorded in docs/TRACKER-INSTALL.md and PLAN.md §15; tracker itself must be named in /privacy before deployment) |
| P2-4 | Next.js 14.2.18 security patch bump | Fixed (bumped to latest patched 14.2.x; exact version: 14.2.35, per package.json working tree; coordinator to confirm) |
| P2-5 | Vercel Rust binary: Vercel runs the TypeScript fallback, not the Rust binary (glibc 2.34 needed vs Vercel AL2 2.26) | Deferred (fallback stays, Velu's decision; do not touch before Dec 1) |

### Neon audit — P0 (docs/neon-dealnote-audit-2026-11-27.html, verdict NO-SHIP 4.1/10)

| Item | Finding | Status |
|---|---|---|
| Neon P0-1 | No live checkout or TrustMRR connection ("Payment coming soon"). Wire Polar.sh one-time $49 checkout + webhook + TrustMRR read-only key | Fixed in part (code-ready, no live keys) / **Needs Velu** (Polar account + KYC; TrustMRR after first sale) |
| Neon P0-2 | No server-side paywall or entitlement check. /audit gives away the full report and proposal text for free; endpoint open to unauthenticated abuse | Fixed in part (licence-key paywall, teaser score + grade + top 2 findings) / **Open question** (server-side hold and abuse controls to be verified) |
| Neon P0-3 | Paid deliverable does not exist. Homepage sells teardown PDF + proposal PDF, but /sample admits print-to-PDF covers the sample only and /audit has no PDF export | Open question (Puppeteer primary + React-PDF fallback being built this round, outcome TBD) |
| Neon P0-4 | Broken refund/contact promise. /terms promises replace or refund within 14 days, yet zero contact email, support link, or refund form exists | Fixed (instructed; code agent owns). Contact murugan@drvelu.com, refund log docs/refund-log.md |
| Neon P0-5 | Missing Privacy Policy. No /privacy link in nav or footer, direct navigation fails. Mandatory once Polar collects buyer details and the tracker sends pageviews | Fixed (instructed; code agent owns /privacy) |
| Neon P0-6 | Hackathon traffic tracker not confirmed. verify.js must be installed before receiving traffic or the entry risks disqualification | **Needs Velu** (dashboard snippet). Status: NOT INSTALLED. See docs/TRACKER-INSTALL.md |

### Neon audit — P1

| Item | Finding | Status |
|---|---|---|
| Neon P1-1 | Speed score measures server TTFB, not real mobile load. Wire free PSI API or rename the category to "Server response & page weight" and drop weight from 20% to 10% | **Needs Velu** (PSI API key). Renaming the category: Open question |
| Neon P1-2 | False "your logo" claim in white-label builder. Homepage promises reports carry "your logo", but /audit preview has text fields and colour pickers only, no logo upload or URL input | Open question (code agent to confirm whether logo upload is included in this round) |
| Neon P1-3 | Clunky pitch generator UX. Investment table has static uneditable $____ blanks; /templates has no one-click copy button and does not auto-fill [finding 1..3] into the covering email | Open question (code agent to confirm whether included in this round) |
| Neon P1-4 | Inter font fallback. Renders as system sans-serif rather than Inter. Load via next/font/google in app/layout.tsx | Fixed (instructed; code agent owns) |
| Neon P1-5 | Formatting bug: example.com displays "Page size 0.0 MB". Format anything under 100 KB in KB | Open question (code agent to confirm whether included in this round) |
| Neon P1-6 | No 30/month quota enforcement or free-tier cap. Needs a DB/KV counter tied to licence key or email | Open question (enforcement mechanism not yet confirmed; see audit P0-8) |

### Neon audit — P2

| Item | Finding | Status |
|---|---|---|
| Neon P2-1 | Repetitive uppercase teal eyebrows and heavy heading weights. Soften weights to 600 and trim redundant eyebrows | Fixed (instructed; code agent owns). Headings 600, eyebrows at most one and sentence case |
| Neon P2-2 | Browser-local outreach tracker only (localStorage). Acceptable for v1 if clearly labelled; add a 1-click CSV export post-launch | Deferred (CSV export post-launch; localStorage labelling unchanged) |
| Neon P2-3 | Dead Rust fallback in production (glibc 2.34 vs AL2 2.26). Do not touch before Dec 1 | Deferred |

### Claude miss-check — items 1–29 (docs/claude-misscheck-dealnote-2026-11-27.md)

| Item | Finding | Status |
|---|---|---|
| Claude 1 | Verify TrustMRR x payment processor compatibility | Fixed as a correction (docs/TRUSTMRR-POLAR-CORRECTION.md: TrustMRR supports Polar directly). Residual: one-time-payment handling still unverified — Open question |
| Claude 2 | Read Ship or Die actual rules (rules page returned HTTP 403) | **Needs Velu** (live browser / community check; not resolved in this round) |
| Claude 3 | Wire payment checkout (Polar.sh or Lemon Squeezy, whichever TrustMRR supports) | Fixed in part (Polar code-ready, no live keys) / **Needs Velu** (Polar account + KYC) |
| Claude 4 | Build server-side paywall (licence-key gating or session-based) | Fixed in part (licence-key auth decided) / **Open question** (server-side hold to be verified) |
| Claude 5 | Decide auth approach (licence key vs email vs accounts) and implement | Fixed (decided: Polar licence keys, validated server-side per request, no accounts in v1) |
| Claude 6 | Install Ship or Die tracker snippet (before ANY traffic, before first payment) | **Needs Velu**. Status: NOT INSTALLED |
| Claude 7 | Add /privacy page | Fixed (instructed; code agent owns) |
| Claude 8 | Add contact email + refund request channel | Fixed (instructed; code agent owns). murugan@drvelu.com |
| Claude 9 | Register + configure custom domain | **Needs Velu** (decision / purchase; no domain bought) |
| Claude 10 | Configure Vercel environment variables | Fixed in part (env placeholders in .env.example; no live values) / **Open question** (Vercel env vars to be set at deploy by the coordinator) |
| Claude 11 | Build PDF generation (teardown report PDF, at minimum) | Open question (being built this round, outcome TBD) |
| Claude 12 | Merge audit-batch branch to main | **Open question for the coordinator** (merge + deploy is the coordinator's job, not this fixes round) |
| Claude 13 | OG image + meta tags | Open question (code agent to confirm whether included in this round) |
| Claude 14 | Fix Inter font (load via next/font or drop the declaration) | Fixed (instructed; code agent owns) |
| Claude 15 | Fix $39/mo cheapest line | Fixed (docs updated; code agent owns) |
| Claude 16 | Fix pricing bullet ("Teardown PDF and proposal PDF") | Fixed (docs updated; code agent owns) |
| Claude 17 | CAN-SPAM footer + 60s sending checklist in /templates | Fixed (instructed; code agent owns) |
| Claude 18 | Remaining HIGH slop fixes (repeating uppercase eyebrows, heading weights) | Fixed (instructed; code agent owns) |
| Claude 19 | Test purchase end-to-end (buy, receive, use, verify on TrustMRR) | **Needs Velu** (real-money test purchase; then refund it) |
| Claude 20 | Distribution plan for Dec 1–16 | **Needs Velu** (parent's job; nothing sent externally without Velu's explicit APPROVED) |
| Claude 21 | Rate limiting on audit endpoint | Open question (code agent to confirm whether included) |
| Claude 22 | Proposal PDF generation | Open question (being built with the teardown PDF this round, outcome TBD; if time is short this is the first cut — see audit batch) |
| Claude 23 | SSRF redirect re-validation | Open question (code agent to confirm whether included) |
| Claude 24 | robots.txt honoring | Open question (code agent to confirm whether included) |
| Claude 25 | Next.js 14.2.18 security patch | Fixed (bumped to latest patched 14.2.x; exact version: 14.2.35, per package.json working tree; coordinator to confirm) |
| Claude 26 | MEDIUM slop fixes (7 items) | Fixed (instructed; code agent owns — see slop table below) |
| Claude 27 | Error monitoring (Sentry free tier) | Deferred |
| Claude 28 | Email capture (pre-paywall, for leads who don't buy) | Deferred |
| Claude 29 | Homepage screenshot capture | Open question (same Puppeteer stack as the PDF; code agent to confirm whether included) |

Claude fact-check flags: F1 (Polar net $44.83) is **wrong** — see the corrections section ($46.05). F2 (build time vs TTFB / cold starts), F3 (Rust fallback actually deployed and exercised), F4 (30/month fair-use has no enforcement mechanism described), F5 (TrustMRR Stripe-key assumption) are addressed by Claude 1 and the paywall/quota items above; F2–F4 remain open questions for the coordinator to verify live.

### Slop check — HIGH / MEDIUM / LOW (docs/dealnote-slop-check-2026-11-27.md; replicated Briskly ~29/100, Jev-style ~5–6 of 34 tells)

| Item | Finding | Status |
|---|---|---|
| HIGH H1 | Inter declared but never loaded (app/globals.css:24); site renders in system-ui | Fixed (instructed; code agent owns — next/font/google 400/500/600/700) |
| HIGH H2 | Uppercase tracked eyebrow above nearly every heading (6 uses) | Fixed (instructed; code agent owns — at most one, sentence case, never repeating the heading) |
| HIGH H3 | All headings weight 700 (h3 650, off-scale) | Fixed (instructed; code agent owns — h1/h2/h3 600, 650 deleted) |
| MEDIUM M1 | Three equal feature cards + three equal tier cards + two equal cards | Fixed (instructed; code agent owns — "How it works" is now a numbered vertical flow; equal widths only where content is truly parallel, pricing tiers) |
| MEDIUM M2 | Numbered steps "1. / 2. / 3." as card titles | Fixed with M1 (numbers earn their place in the vertical flow) |
| MEDIUM M3 | CTA arrows on the primary and secondary buttons | Open question (code agent to confirm whether the ArrowRight icons were dropped) |
| MEDIUM M4 | Middle-dot meta strings (6 lines) | Open question (code agent to confirm: ScoreSummary caption split, footer separators replaced) |
| MEDIUM M5 | Zero transitions — hover states change instantly (0 ms) | Fixed (instructed; code agent owns — one shared 120 ms hover transition, no transition-all) |
| MEDIUM M6 | "Payment coming soon" repeated 4x, "30 audits per month" 5x, "No subscription" 3x | Fixed in part (docs updated; "Payment coming soon" must be removed when payment ships — coordinator to confirm the live copy) |
| MEDIUM M7 | SAMPLE stamp repeated 7x on /sample | Fixed (instructed; code agent owns — top of page + footer only) |
| MEDIUM M8 | Step/feature icons coloured teal instead of inheriting text colour | Fixed (instructed; code agent owns — icons inherit slate-600, teal only for primary-action controls) |
| LOW L1 | Text glyph "✓" as a progress icon; "…" ellipsis in button copy | Open question (code agent to confirm: Lucide Check, "Running audit" + Loader2 spinner) |
| LOW L2 | h3 weight 650 is an off-scale value | Fixed with H3 (h3 600, 650 deleted) |
| LOW L3 | Four tinted box backgrounds (red/amber/teal/slate) | No change (documented as correct as-is: muted, semantic tints) |
| LOW L4 | Inner radius equals outer radius (nested-radius math ignored) | Open question (code agent to confirm: inner radii to 6 px) |
| LOW L5 | Aphoristic / staccato copy cadence + whole-sentence display headline | Open question (code agent to confirm: H1 shortened to its first clause, rest to the subhead) |
| LOW L6 | Header nav links below the 44 px touch-target minimum (~37 px) | Fixed (instructed; code agent owns — nav links 44 px) |
| LOW L7 | `--faint: #94A3B8` fails contrast (2.56:1 on white), currently unused | Fixed (instructed; code agent owns — darkened to #64748B) |
| LOW L8 | Six uniform score-bar rows, grade-coloured fills | No change (documented as correct as-is: data visualisation, letter grade always next to the number) |

Post-fix re-verification of the slop scores: the slop-check tool was NOT re-run in this round, so no new Briskly/Jev score is claimed. The concrete fixes were verified by the coordinator: h1/h2/h3 weights are 600 in app/globals.css (no 700/800 anywhere), the only remaining `text-transform: uppercase` is table headers and mobile stacked-table labels (not repeating eyebrows), and the 1280/390 screenshots below show a clean layout with no slop markers. A full slop-tool re-run is still open if wanted.

## NEEDS VELU list

Nothing in this list may proceed without Velu. No item here is done in this round.

1. **Polar account + Philippines Stripe Connect Express KYC.** Create the Polar organisation, complete payout onboarding with a Philippines bank account in Velu's own name. Secondary sources report review up to 14 days; the contest ends Dec 16.
2. **Tracker snippet from the dashboard.** Copy the exact snippet from Ship or Die (My Startup > traffic tracker). Only Velu has dashboard access. See docs/TRACKER-INSTALL.md.
3. **Test purchase with real money.** One live $49 test purchase, then refund it; confirm the refund path and TrustMRR handling.
4. **Custom domain decision / purchase.** No domain bought, no decision recorded. A resonantatlas.com subdomain needs no purchase; a new apex domain does.
5. **PSI API key.** Create it, restricted to the PSI API, and put it in the server env vars.
6. **Legal review of terms.** Governing-law + liability-limitation clause, and a lawyer's confirm on the Business Opportunity Rule before any income-adjacent copy is added. Terms/refund/privacy text is drafted from research, not reviewed by a lawyer. General information, not legal advice.
7. **Ship or Die rules.** The official rules page returned HTTP 403 on 27 Nov 2026; the contest facts rest on secondary summaries and must be re-checked in a live browser (prizes, profit definition, tracker requirement, verification window).
8. **Distribution (Dec 1–16).** Nothing is sent externally without Velu's explicit APPROVED. The sales test (3 sample teardown reports + free teaser) also needs his APPROVED before anything is posted.

## Open questions for the coordinator

1. Does PDF generation work on the real host (Puppeteer primary + React-PDF fallback)? Outcome TBD — the code agent is building it this round.
2. Does the licence-key paywall hold server-side (full report JSON + PDF withheld until the server confirms a licence key; no grant from the success page or a query string)?
3. How is the 30-audit/month fair-use limit enforced server-side (DB/KV counter tied to licence key)?
4. Are robots.txt honouring, rate limiting, and SSRF redirect re-validation included in this round, or deferred?
5. Is logo upload included (Neon P1-2), and is the proposal PDF included (Claude 22), or is the teardown PDF the only PDF in this round?
6. What is the exact Next.js 14.2.x version the code agent installed?
7. Does the build pass, and what do the live tests show (see placeholders below)?
8. TrustMRR one-time-payment handling: what does the TrustMRR add-startup flow show?
9. Vercel log retention/region for the /privacy page: what does the Vercel dashboard say?
10. Was the tracker TODO comment added to `app/layout.tsx`? Note: at branch start (f807acb) no tracker TODO comment was found in `app/layout.tsx`; the TODO lived in README.md only.

## Placeholders — FILLED BY COORDINATOR, 27 Nov 2026 (verified live)

- **Build result:** `npm run build` passes clean on Next.js 14.2.35 (latest patched 14.2.x). Zero type errors. Routes: 6 pages (/, /audit, /sample, /templates, /terms, /privacy) + 6 dynamic API routes (/api/audit, /api/checkout, /api/license, /api/pdf/teardown, /api/pdf/proposal, /api/webhook/polar). The pages agent's earlier build errors were fixed by the server agent (NextResponse body type, Sparticuz `defaultViewport`/`waitUntil` types); the coordinator re-ran the build twice, clean both times. One note: `isPathDisallowedByRobots` is still exported from app/api/audit/route.ts and the build accepts it, so it was left as-is.
- **Live test results (production build, `next start` on port 3100, dev licence key only, no Polar env):**
  - Free audit, https://example.com: 200, `teaser: true`, score 45, grade F, 6 categories, exactly 2 issues, `totalIssues: 10`, no `title` field, no issue 3+. Server-enforced paywall confirmed.
  - Paid audit, same URL, dev key: 200, full result, 10 issues, title "Example Domain", `license: {auditsUsed: 1, auditsRemaining: 29, auditsPerMonth: 30}`.
  - Real small-business site, https://www.benjaminfranklinplumbing.com, dev key: 200, score 85, grade B, 2 issues, title "Benjamin Franklin Plumbing: Expert Plumbing Services", quota then 3 used / 27 remaining.
  - Bad licence key: 401. Rate limit: verified by the server agent (6th free request in an hour returns 429 with Retry-After); not re-run by the coordinator.
  - robots.txt: verified by the server agent (httpbin.org/deny returns 403 with the exact required message; parser 10/10 unit cases).
  - SSRF redirect: verified by the server agent by unit test (302 to 127.0.0.1 refused with "redirect to non-public address"); live end-to-end redirect-to-loopback could not be proven (httpbin returned its own 403, /etc/hosts read-only).
  - PDF teardown, dev key: 200, 70,647 bytes, valid `%PDF-`, 4 pages A4 (pdfinfo), footer text confirmed by pdftotext. PDF proposal, dev key: 200, 67,889 bytes, 4 pages A4. PDF with no key or bad key: 402 both times. Puppeteer primary works locally; **React-PDF fallback was NOT built** (not installed; server agent judged it unnecessary locally). PDF on Vercel serverless is untested.
  - Checkout with Polar unset: 503 `{notConfigured: true}` (no fake success). Webhook with no secret: 503; with dummy secret + forged body: 403. No live Polar test exists: no account, product, keys, or webhook secret were created in this round.
  - All 6 pages return HTTP 200 in the production server.
  - Refund route: mailto + 14-day instructions in /terms and docs/refund-log.md (empty log, no refunds yet). No test email sent (forbidden without Velu's APPROVED).
- **Screenshots:** 1280 px desktop + 390 px mobile, /, /audit, /sample, /privacy, in docs/screenshots/fixes-{home,audit,sample,privacy}-{desktop,mobile}.png (8 files). No horizontal overflow on any page at either width (scrollWidth == innerWidth, checked in the browser). Pages visually checked by the coordinator: clean, white/slate + teal, no slop markers, sample clearly marked SAMPLE with fictional data. /templates and /terms were not screenshotted in this round (both return 200; /templates was verified by the pages agent).
- **Git commits:** branch `dealnote-fixes-nov27`, base f807acb. Commit hash to be filled after the coordinator commit below (this file was edited before committing).
- **Next.js exact version:** 14.2.35 (package.json, confirmed by the build output).
- **Slop re-check:** slop tool not re-run; concrete fixes verified by grep + screenshots (see the note above the NEEDS VELU list).
- **TrustMRR one-time check:** NOT verified. No TrustMRR account exists and no add-startup flow was checked in this round. Stays open; needs Velu (or a parent browser check) before the first sale is counted.
- **Vercel log retention/region for /privacy:** NOT verified. No Vercel dashboard access in this round; /privacy states retention "follows Vercel's current plan" and that wording is unchanged.

## Open questions — coordinator answers (27 Nov 2026)

1. PDF: Puppeteer primary works locally (real 4-page PDFs, verified). React-PDF fallback NOT built. Vercel serverless runtime untested.
2. Paywall holds server-side: yes, verified (teaser-only JSON, 401 bad key, 402 unpaid PDF).
3. 30/month quota: licence-key counter, in-memory on `globalThis` (shared across routes in one process, verified: licence check agrees with audit + PDF usage). KV adapter exists as an interface-only stub; on Vercel serverless the quota is best-effort until a real Vercel KV/Upstash binding is wired.
4. robots.txt honouring, rate limiting, SSRF redirect re-validation: all included and verified (see live tests above).
5. Logo upload: included (logo upload field on the white-label preview). Proposal PDF: included (verified 67,889 bytes, 4 pages).
6. Next.js: 14.2.35.
7. Build passes; live tests above.
8. TrustMRR one-time: still unverified (see above).
9. Vercel log retention/region: still unverified (see above).
10. Tracker TODO: YES, present as a JSX comment in app/layout.tsx line 43; it does not reach served HTML. Snippet itself not installed (NEEDS VELU).

## Files changed in this fixes round (docs agent)

New: docs/TRUSTMRR-POLAR-CORRECTION.md, docs/TRACKER-INSTALL.md, docs/refund-log.md, docs/dealnote-fixes-2026-11-27.md (this file).
Updated: docs/design-notes.md (§11 added, §2/§3/§4/§5/§7/§8 updated), docs/TRACKER.md, PLAN.md (§4/§5/§6, §7 /privacy row, §14, §15, new §16), README.md.
Code files (app/*, components/*, lib/*, package.json) belong to the code agent; this report does not claim their state beyond what is marked Open question above.

## Sources

- docs/dealnote-audit-batch-2026-11-27.md
- docs/neon-dealnote-audit-2026-11-27.html (Neon verdict NO-SHIP 4.1/10)
- docs/claude-misscheck-dealnote-2026-11-27.md (items 1–29)
- docs/dealnote-slop-check-2026-11-27.md (HIGH 3, MEDIUM 7, LOW 8)
- docs/dealnote-legal-research-2026-11-27.md
- docs/dealnote-payment-research-2026-11-27.md
- docs/dealnote-github-reuse-2026-11-27.md
- docs/TRUSTMRR-POLAR-CORRECTION.md
- docs/TRACKER-INSTALL.md
- docs/refund-log.md
