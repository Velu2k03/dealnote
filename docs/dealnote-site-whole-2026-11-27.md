# DealNote — Site Whole, 27 Nov 2026

**Product:** DealNote, white-label website teardown + proposal generator, $49 one-time.
**Live:** https://dealnote-blue.vercel.app — **Repo:** https://github.com/Velu2k03/dealnote
**Branch merged:** `dealnote-fixes-nov27` → `main`, merge commit **25f3f72** ("Merge dealnote-fixes-nov27: Polar checkout code, licence paywall, PDFs, privacy, slop fixes, site-whole polish"), pushed `e529576..25f3f72`. Vercel auto-deployed from main.
**Payment status: ON HOLD by Velu (11:29 Nov 27).** No payment code was changed in this round, no Polar/Lemon Squeezy/TrustMRR/Stripe account or product was created, no live test purchase was made. The Polar code stays exactly as built in the fixes round: checkout returns 503 `notConfigured` when Polar env vars are unset, never a fake success.

## What was finished in this round, per item

### (a) Slop re-run — DONE, scores recorded
Subagent re-ran the slop check on the fixed code (local replications only, no URL submitted to any external detector). Full record: docs/dealnote-slop-recheck-2026-11-27.md. Commits ec33765 + e4d1ee3 on dealnote-fixes-nov27.

| Score | Original check (pre-fix) | Re-run BEFORE (3706d51) | Re-run AFTER |
|---|---|---|---|
| Briskly-style /100 | ~29 | ~5 | ~5 |
| Jev-style (tells of 34) | ~5–6 tells, est. 15–25 | ~4–5 tells, est. ~12–18 | ~1 partial tell, est. ~3–5 |

Briskly stays at ~5 because the only remaining hit is the card rule half-counted: uniform white 8px cards are the documented design system. Jev's one remaining partial is the equal pricing-tier cards on /templates, genuinely parallel content (the documented exception).

Fixed in this round: M4 (last 2 middle-dot lines → separate lines; middle dots in code 2 → 0), M6 residual (footer "30 audits" clause removed), M7 (SAMPLE stamp exactly 1 per page), L5 (H1 now "Paste any business website URL.", second clause moved to subhead; staccato triples 3 → 0), L4 residual (.callout/.evidence radius 8px → 6px inside 8px cards), NEW em dashes (15 hits introduced by the fixes round's new copy; 13 replaced, 2 left — see below), NEW skipped headings (Impeccable `detect` on built HTML: /audit status/empty-state headings and /templates tier names h3 → h2; skipped-heading findings 2 → 0).

Already fixed at 3706d51, verified no change: H1 Inter really loaded via next/font/google, H2 one sentence-case eyebrow, H3 all headings 600, M1/M2 vertical steps flow, M3 ArrowRight 0, M5 120ms transition + reduced-motion, M8 teal icons gone, L1 Lucide Check, L2, L4, L6 nav ~48px, L7 `--faint` #64748B. L3 and L8 left as-is (documented correct).

Impeccable `detect`: source 0 findings; built HTML 11 findings before the heading fix, 8 after. The remaining 8 are detector artifacts: it cannot read the linked stylesheet, so it reads all type as 16px (`flat-type-hierarchy`) and sees no section inset (`cramped-padding`). Real CSS is h1 36 / h2 24 / h3 18 / body 16, sections padded 64px with 20px container inset. Not real findings.

Left with reason: 2 em dashes in components/audit-ui.tsx (BuyButton label "Buy DealNote — $49 one-time" + checkout-not-configured message) — inside the frozen payment component, untouched per the freeze; reword when the freeze lifts. `lib/pdf-html.ts` 700 weights + uppercase `.brand` — PDF document styling, prescribed by design-notes §8, not web UI. "30 audits" ×6, equal tier cards, Briskly card rule — documented above.

10 files changed: app/page.tsx, app/layout.tsx, app/templates/page.tsx, app/audit/page.tsx, app/sample/page.tsx, app/terms/page.tsx, components/footer.tsx, app/globals.css, docs/design-notes.md (§11 addendum), docs/dealnote-slop-recheck-2026-11-27.md. No files under app/api/, lib/, or nosite-leads touched. `npm run build` clean twice.

### (b) Screenshots — DONE, all 6 pages
12 new full-page screenshots in docs/screenshots/whole-{home,audit,sample,templates,privacy,terms}-{1280,390}.png (1280 desktop + 390 mobile, Puppeteer + local Chromium). **No horizontal overflow anywhere: scrollWidth == innerWidth on all 6 pages at both widths.** Visually checked: /templates desktop (tiers, CAN-SPAM footer, 60-second checklist, copy button) and /terms mobile (refund policy, contact murugan@drvelu.com, acceptable use) are clean, white/slate + teal. Commit e9d081c.

### (c) OG image — DONE, verified locally and live
public/og.png loads, 1200×630 PNG, 30,377 bytes. OG meta tags present in served home HTML: og:title, og:description, og:url, og:image (https://dealnote-blue.vercel.app/og.png), og:image:width 1200, og:image:height 630, og:image:alt, og:type website. Live: og.png returns 200, og:image meta present in live home HTML. NOT tested on opengraph.xyz (not reached in this round); record as untested.

### (d) PDF endpoints — DONE locally, live full-PDF untested
Production build, `next start` port 3101, dev licence key only, no Polar env:
- Teardown PDF, dev key: 200, 71,173 bytes, valid PDF 1.4, 4 pages.
- Proposal PDF, dev key: 200, 67,889 bytes, valid PDF 1.4, 4 pages.
- Teardown PDF, no key: 402. Proposal PDF, no key: 402.
- Free audit, example.com: teaser true, 45/F, exactly 2 issues of 10, no title field (server-enforced paywall confirmed locally).
- Paid audit, benjaminfranklinplumbing.com, dev key: 200, 85/B, 2 real findings, title correct.
- All 6 pages HTTP 200 locally.

**Live (Vercel serverless): full PDF generation is UNTESTED.** The live POST checks (free audit, checkout, PDF endpoints) were blocked by an approval timeout on 27 Nov and were NOT retried — they still need approval before they can run. What was verified live by GET: all 6 pages 200, /privacy 200 with the new region text, og.png 200, contact email present, $49 one-time present, 0 "verified" on home, no future dates on home. Full PDF generation on Vercel serverless can only be proven with a real licence key, which needs the payment step (NEEDS VELU).

### (e) KV adapter — DONE, decision recorded
Research subagent (no code edits, no accounts): no free, no-account, durable quota store exists. File-based storage does not survive on Vercel (`/tmp` is ephemeral, per-instance). Vercel KV is sunset/deprecated; the durable path is Upstash Redis free tier via the Vercel Marketplace ($0, no card, 250 MB / 500K commands/month, 1 DB), which still needs a provisioning step. **Decision: leave the in-memory best-effort store for the 1 Dec launch; do not present the 30/month limit as a hard cap.** The stale `@vercel/kv` comment in lib/entitlements.ts was fixed to point at `@upstash/redis` (commit e9d081c). The quota failure mode is permissive (extra audits after a cold start), not blocking. Webhook dedupe has the same best-effort limit.

### (f) Vercel log retention / region — DONE as far as public docs allow, retention still open
Research subagent, public Vercel docs only, no login:
- Region VERIFIED: default `iad1` (Washington, D.C., USA), single region; no `vercel.json` in the repo, so the default applies. Static files are CDN-served globally. Applied to /privacy: "Serverless functions run in Vercel's default region, Washington, D.C., USA (iad1); static files are served from Vercel's global CDN." (commit e9d081c).
- Retention NOT settled: public Vercel sources conflict. Changelog (updated 29 Oct 2026) says Hobby and Pro both have 1 hour of log retention; the Runtime Logs docs table quoted by secondary sources in Nov 2026 says Hobby 1 hour, Pro 1 day, Pro + Observability Plus 30 days. The project plan (Hobby vs Pro) is not recorded anywhere and was not confirmed in a dashboard. /privacy keeps "Retention follows Vercel's current plan" — not false, but vague; publish a number only after the dashboard confirms the plan. NEEDS VELU (dashboard check).

### (g) Other fixes found while testing live locally
- /privacy region sentence added (see f). KV comment fixed (see e). No other broken items found: copy buttons present on /templates, editable proposal $____ blanks present, logo upload field present on /audit white-label preview, 0.0 MB fix present (page size shown in KB under 100 KB), Inter rendering via next/font/google, all 6 pages 200, no console-breaking errors observed in local runs.

## TrustMRR one-time payments — research finding (from research subagent)
Direct verification FAILED: trustmrr.com/faq returns HTTP 403 to fetch, same as before. Secondary evidence, indirect but strong from live TrustMRR listings: one-time payments ARE counted in "last 30 days" and "all-time revenue" (Shipper Club via Creem, mostly one-time memberships, showed $39,532 all time; CreativeClaw via Polar, mostly one-time credit top-ups, showed $118,000 collected in the last 30 days). One-time payments are NOT counted in MRR — a pure one-time product like DealNote should expect MRR $0. **Still unverified, and the part that matters for Ship or Die:** whether the leaderboard ranks by MRR, by last-30-days revenue, or by verified profit, and whether a $0-MRR one-time product is ranked at all. That is a Ship or Die rules question, not a TrustMRR FAQ question; needs the add-startup flow / live-browser check.

## Build result
`npm run build` clean on Next.js 14.2.35, zero type errors, 6 pages (/, /audit, /sample, /templates, /terms, /privacy) + 6 dynamic API routes (/api/audit, /api/checkout, /api/license, /api/pdf/teardown, /api/pdf/proposal, /api/webhook/polar). Run after the slop fixes and the two small edits in this round.

## Live deploy + verification
- Merge commit 25f3f72 pushed to main; Vercel auto-deployed. Deployment went Ready after ~75 seconds (privacy was 404 for the first 5 polls, then 200 with the new region text).
- Live GET verification, 27 Nov 2026: home 200, /audit 200, /sample 200, /templates 200, /terms 200, /privacy 200, og.png 200. Home HTML contains murugan@drvelu.com, "$49 one-time", og:image meta, 0 occurrences of "verified", no future dates found.
- Live POST verification (free audit teaser, checkout 503, PDF 402 on Vercel): NOT RUN — blocked by an approval timeout; not retried. Still needs approval before it can run.

## Git commits (this round)
- ec33765 — slop re-check fixes (M4/M7/L5, em dashes, nested radii, heading order)
- e4d1ee3 — slop re-check report, record final commit hash
- e9d081c — site-whole round: privacy region note, KV comment fix, full-page screenshots all 6 pages
- 25f3f72 — MERGE dealnote-fixes-nov27 into main (64 files, +6,504/−489)
- This report + TRACKER.md update: to be committed on main after live verification (commit hash below).

## NEEDS VELU
1. Polar account + Philippines Stripe Connect Express KYC (payment ON HOLD until Velu says resume; do not swap to Lemon Squeezy without his word — he said "hold the payment part" on 11:29 Nov 27).
2. Tracker snippet copied EXACTLY from the Ship or Die dashboard (My Startup > traffic tracker) before any traffic / first payment. NOT installed.
3. Live $49 test purchase with real money, then refund it. This is also the only way to prove full PDF generation on Vercel serverless.
4. Custom domain decision / purchase. None bought.
5. PageSpeed Insights API key (restricted to the PSI API).
6. Legal review of terms (governing law, liability, Business Opportunity Rule).
7. Ship or Die rules re-check in a live browser (official rules page returned 403 on 27 Nov); includes whether the leaderboard ranks by MRR or by revenue/profit for a one-time product.
8. Vercel dashboard check: confirm the project plan (Hobby vs Pro) and log retention, so /privacy can name a number.
9. Distribution Dec 1–16 and the sales test (3 sample teardown reports + free teaser) need Velu's explicit APPROVED before anything is posted externally.
10. Approval to run the live POST verification (free audit teaser, checkout 503, PDF 402) against dealnote-blue.vercel.app — the attempt on 27 Nov timed out on approval and was not retried.

## Files
- This report: docs/dealnote-site-whole-2026-11-27.md
- Slop re-check: docs/dealnote-slop-recheck-2026-11-27.md (commits ec33765, e4d1ee3)
- Screenshots: docs/screenshots/whole-{home,audit,sample,templates,privacy,terms}-{1280,390}.png
- Fixes report: docs/dealnote-fixes-2026-11-27.md
