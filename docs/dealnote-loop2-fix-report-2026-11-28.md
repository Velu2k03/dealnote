# DealNote Loop 2 Fix Report — 28 Nov 2026

**Product:** DealNote, white-label website teardown + proposal generator, $49 one-time.
**Live:** https://dealnote-blue.vercel.app — **Repo:** ~/workspace/ship-or-die-100k/teardown-generator
**Branch:** `dealnote-loop2-fixes` merged to main. **Audited commit:** main `19c3b65`.
**Audit docs:** `docs/dealnote-loop2-live-audit-2026-11-27.md` (verdict NO-SHIP),
`docs/dealnote-loop2-legal-endpoints-2026-11-27.md`, `docs/dealnote-loop2-slop-2026-11-27.md`,
`docs/dealnote-loop2-science-2026-11-27.md`, `docs/neon-high-guide-2026-11-27.md`.
**Payment:** ON HOLD per Velu (27 Nov 11:29 + 13:08). No payment code touched, no
Polar/Lemon Squeezy/TrustMRR/Stripe account or product created, no test purchase.

## What the audit found, and what this round fixed

### P0 — all 3 addressed

| # | Finding | Fix | Verified |
|---|---|---|---|
| P0-1 | Live free audit POST unproven (timed out twice, HTTP 000) | NOT fixable in code; local POST path proven again below. Live POST re-check still needs Velu's approval (timed out twice before). Recorded as still pending, not retried. | Local free audit 200 in ~3 s, 45/F, teaser keys exactly `teaser, url, fetchedAt, overallScore, overallGrade, issues, message` |
| P0-2 | SSRF guard allowed 169.254.169.254 and `[::ffff:127.0.0.1]`, plus 100.64/10 | New `isNonPublicIPv4` / `isNonPublicIPv6` in `lib/audit.ts`: blocks 169.254/16, 100.64/10, `::ffff:0:0/96` mapped, fe80::/10, fc00::/7, decimal/hex IPv4 forms. Same blocklist feeds redirect re-validation. New `scripts/test-ssrf.ts`. | `npx tsx scripts/test-ssrf.ts`: 29/29 pass (23 blocked, 6 allowed). Live-route check: `POST /api/audit http://169.254.169.254/...` → 400. |
| P0-3 | Payment on hold, no live purchase path | Unchanged by design. Site still honestly says PDFs "coming with payment". | Checkout POST → 503 `notConfigured`, never a fake success. |

### P1 — all 6 fixed

| # | Finding | Fix | Verified |
|---|---|---|---|
| P1-1 | Ticking a finding wiped edited fix items | `toggleFinding` now merges: untick removes only that finding's item (`issueId`), tick adds only that finding's item. `ProposalItem.issueId` stamped in `proposalItemsFromIssues`. Caption updated. | Code-verified (read-only check 28 Nov); runtime browser re-test not repeated this round. |
| P1-2 | 0-findings card contradicted by generator + "found 7 quick wins" | UI gates generator on `issues.length > 0` (Retainer Opener only for clean sites). `DEFAULT_BRAND.introLine` now neutral "found several quick wins" (was a false "7"). 0-issues replacement broadened to `/found (\d+\|several) quick wins/i` in `lib/templates.ts`, `lib/pdf-html.ts` (x2). **New:** proposal PDF route forces `template=retainer` when the audit has 0 issues. | Unit: `buildProposalText` with 0 issues → "found it in good shape", 0 hits for "found 7". |
| P1-3 | "Ordered by severity: Critical first" was false | Findings sorted Critical first in `lib/analyze.ts`, `app/api/audit/route.ts` (re-sort + renumber), and `sampleAudit()`. | Free teaser example.com now returns i1 Meta description (Critical), i2 phone (Critical) first. Home sample card shows the 404 Critical first. |
| P1-4 | HEAD 405 flagged as broken link | Broken-link check retries with GET on HEAD 405/403/501 before calling a link broken. | Code-verified. |
| P1-5 | Free teaser leaked categories + totalIssues | `teaserFor()` now returns only score, grade, top 2 findings (+ url, date, message). Copy matches payload. | Teaser keys: exactly `fetchedAt, issues, message, overallGrade, overallScore, teaser, url`. |
| P1-6 | Every PDF re-ran the audit, burning 1 of 30 | New `lib/audit-cache.ts` (24 h, key-hash + URL, Upstash Redis or in-memory). `runPaidAuditCached()` reuses the cached audit; both PDF routes use it. Disclosure added on /audit: "A PDF reuses the audit above and does not use another audit. A PDF downloaded without running the audit first uses 1 audit." | Paid audit 1 used / 29 left; teardown PDF + proposal PDF downloaded; next paid audit showed 2 used, so the 2 PDFs consumed 0. |

### P2 — fixed except where noted

- **P2-1 Technical 0 for HTTP:** fixed. No-HTTPS already costs 1 of 4 checks + a Critical issue; the category no longer forces to 0. `lib/analyze.ts`.
- **P2-2 Speed penalised alt text:** fixed. Alt text is scored under SEO only; Speed is load time + page weight.
- **P2-3 Page weight HTML-only:** fixed wording: "The homepage HTML alone measured about X MB in this run (images, scripts, and stylesheets are not counted)."
- **P2-4 Robots wildcards:** fixed. `isPathDisallowedByRobots` now supports `*` and trailing `$`. Unit: `/*.pdf$` blocks `/x.pdf`, allows `/x.html`; longest-rule Allow still wins.
- **P2-5 Robots/sitemap redirect re-validation:** fixed in the prior fix round (`fetchPublicTextWithRedirects`, per-hop `isValidAuditUrl`).
- **P2-6 Rate limit trusts XFF + consumes on failed fetch:** PARTIAL. XFF-spoof note added; KV-backed async limiter added (`lib/ratelimit.ts`, Upstash INCR, 1 h expiry, in-memory fallback). Consumption-before-fetch unchanged, so a robots 403 still burns 1 of 5. Left as a known limit; the throttle is documented as not a billing control.
- **P2-7 Screenshot promise:** fixed earlier round (promise removed, 0 hits).
- **P2-8 DealNote robots/sitemap + /sample gaps:** fixed. `app/robots.ts` + `app/sitemap.ts` (6 pages) now exist; `/sample` has all 10 template sections (Scope, Timeline, About, Terms added).
- **P2-9 Default brand placeholders in a real PDF:** PARTIAL. Intro line neutralised (see P1-2). `DEFAULT_BRAND` still ships Alex Rivera / `hello@yourstudio.example` / `(555) 010-4471` / cal.com link as fallbacks when the buyer leaves the brand profile blank; both PDF routes still fall back to it. The buyer is warned on /audit and /templates to fill in their own brand first.

### Legal partials (L1 / L5 / L9)

- **L1 score disclaimer:** PASS. Full sentence ("They are not Lighthouse, PageSpeed, or search-ranking scores… not an industry standard. Grades: A 90–100…") now in the hero via `ScoreSummary` and in the PDF footer.
- **L5 refund pointer on pricing card:** PASS. Pricing card now carries "Bad report? Report it within 14 days for a replacement or refund" with a pre-filled `mailto:?subject=DealNote%20refund%20request`. Same pre-filled subject added in FAQ, terms, and (fixed this round) the footer contact link is plain `mailto:` again — the refund subject belongs on refund links only, not the general contact link.
- **L9 PDF footer on every page:** PASS with a cosmetic note. `page.pdf({displayHeaderFooter})` with a footer template now renders the footer on every page. Verified per page with `pdftotext`: teardown 4 pages, footer on all 4; proposal 5 pages, footer on all 5. Last page shows the footer twice (header/footer + in-body `.footer` div) — cosmetic only.
- **Terms T1–T6, L2, L3, L4, L6, L7, L8:** PASS, unchanged from the audit (verified 27 Nov).
- **Refund:** still claimable via `murugan@drvelu.com` mailto on all 6 pages; `docs/refund-log.md` current ("No refunds yet"). Live deliverability not re-proven this round (no test email sent).

### Templates expansion (Loop 2 plan: 8 proposals + 8 emails)

- Was 6 proposals + 8 emails at merge time. Added **New Website Build** (10 sections, 3 tiers) and **E-commerce / Shopify Store** (10 sections, 3 tiers) to `lib/templates.ts`, with `FIX_INTRO` entries and scope/timeline defaults in the proposal PDF route and the /audit generator. Now **8 proposals + 8 emails**, confirmed live on /templates and by unit count.
- Prices still blank `$____` only; no invented dollar figures anywhere in `lib/templates.ts`.
- Puppeteer kept as the PDF engine (no `@react-pdf/renderer` switch); blank prices kept (no `$650`/`$1,500` presets) — both Neon conflicts resolved toward the legal guardrails, per the Opus orchestrator order.

### KV / quota (honest-copy work)

- New `lib/kv.ts`: Upstash Redis via env (`UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN`, documented in `.env.example`); in-memory fallback when unset. Entitlement store resolves to KV when configured (`lib/entitlements.ts`), rate limiter uses Redis INCR when configured. No account provisioned by code. Copy now presents 30/month as a fair-use limit, not a hard cap, until KV is configured (home hero clause removed, pricing card "30 audits a month fair-use limit, about $1.63 per audit", terms updated).
- New dep: `@upstash/redis ^1.41.1` (only package change).

### Science rules (Neon High guide)

Applied: R3 first screen (templates H1 + 1 line, warnings below), R4 brand 3 fields + rest behind `<details>`, R5 one price story on the pricing card, R6 maker + date in footer and /privacy, R2 emails as a numbered sequence, R7 mobile header 3-row fix. Not applied: R2 header still 5 links, proposals default to Redesign (not pre-selected Quick-Fix), R1 label "See proposal templates" unchanged, R8 load budget (no PageSpeed measurement in this round).

### Slop

- /templates three-card grid fixed (vertical `.steps-flow` + numbered `<ol>`); `/templates` workflow steps now use `<h2>` under the `<h1>` (was skipped `<h3>`).
- Only em dashes left are the known frozen BuyButton strings. Middle dots 0 in UI copy. Weights duplication fixed (one `Weights:`). "Most clients pick the middle tier" deleted. Screenshot card deleted.
- Orphaned `.steps-grid` CSS remains in `app/globals.css` (unused) — harmless, noted for cleanup.

## Local verification (28 Nov 2026, production build)

- `npm run build`: clean, Next.js 14.2.35, zero type errors, 6 pages + 6 API routes + `/robots.txt` + `/sitemap.xml`.
- `npx tsx scripts/test-ssrf.ts`: 29/29 pass.
- Local server (port 3105, dev key via env only): all 8 routes 200 (`/`, `/audit`, `/sample`, `/templates`, `/terms`, `/privacy`, `/robots.txt`, `/sitemap.xml`).
- Free audit example.com: 200, 45/F, exactly 2 issues, teaser keys exact.
- Robots block: `google.com/search` → 403. Private URL `169.254.169.254` → 400. Checkout `{}` → 503 `notConfigured`. PDF no key → 402.
- Rate limit: 5 free audits then 429 (verified across the session's calls from one IP).
- Paid audit (dev key): 45/F, 10 issues, quota 1 used / 29 left.
- Teardown PDF: 200, 84,777 bytes, valid PDF 1.4, 4 pages A4. Proposal PDF: 200, 101,027 bytes, 5 pages. Footer present on every page of both. 0 hits for "found 7" in either PDF.
- Screenshots: all 6 pages retaken after the gap fixes (`docs/screenshots/loop2fix-*.png`, script `scripts/shot-loop2fix.mjs`), desktop 1280 + mobile 390, **0 px horizontal overflow on all 12**. Visually checked: /templates desktop (8 proposals, clean vertical flow), home mobile (clean, refund pointer on pricing card).

## Live verification (after merge/deploy, 28 Nov 2026 ~09:45 Manila)

- Merge `18487aa` pushed to GitHub main; Vercel auto-deployed. Live HTML sizes match
  the local build byte-for-byte (home 49,293 B; /audit 17,705 B; /sample 52,269 B;
  /templates 39,017 B; /terms 26,571 B; /privacy 22,296 B).
- All 6 pages + `/robots.txt` + `/sitemap.xml` return 200 live. Tracker snippet
  (`data-site="d40c7a78322ccb335a973aa331f31294d5cbddcb"`) byte-present on all 6 pages;
  `verify.js` returns 200. `/templates` live shows "8 proposals + 8 emails"; home live
  shows "$49 one-time". 0 occurrences of "verified", 0 of 2027/2028 on every page.
- Live POST verification NOT done (needs Velu's approval; see Still open #1).

## Still open (not fixed in Loop 2)

1. **Live POST verification** (free audit teaser, checkout 503, PDF 402 against the live site): still pending, needs Velu's approval, timed out twice before. Do not retry unless he asks.
2. **Payment**: ON HOLD. No live purchase path, no real licence key, so live paid audit and live PDFs remain unproven. Needs Velu to resume (Lemon Squeezy direction) + a live $49 test purchase + refund.
3. **P2-6 remainder:** free rate limit still consumes on robots-blocked / failed fetches; XFF is still the IP source.
4. **P2-9 remainder:** default brand placeholders (Alex Rivera etc.) can still reach a real PDF via the API when the buyer leaves the brand blank.
5. **PDF last-page footer duplication** (header/footer + in-body div): cosmetic.
6. **Science R1/R2/R8:** header still 5 links, Redesign default, no PageSpeed load budget.
7. **Custom domain:** none bought. **PageSpeed Insights API key:** not wired. **Legal review of terms** (governing law, liability, Business Opportunity Rule): not done. **Vercel plan / log retention number:** /privacy still carries no number.
8. **Loop 3:** fresh audit underway next (see tracker sheet). Claude Opus miss-check via agy only after 09:55 Manila 28 Nov (quota).
