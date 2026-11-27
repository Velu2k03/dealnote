# DealNote — Tracker

**Sheet:** https://docs.google.com/spreadsheets/d/1ozzeyu22c7yK7-YXivY9zXXhq40Wrds_QTi2EYIoF0M/edit
**Spreadsheet ID:** 1ozzeyu22c7yK7-YXivY9zXXhq40Wrds_QTi2EYIoF0M
**Tabs:** Status, Packs, Tasks, Decisions, Sales
**Created:** 2026-11-27. Verified by read-back after every write.

**This file is the tracker doc. It is not the sheet. Never touch Google Sheets from this task — the sheet update is the parent's job.**

**Live site:** https://dealnote-blue.vercel.app/ — **SHIPPED LIVE 27 Nov 2026.** Merge commit 25f3f72 (dealnote-fixes-nov27 → main), Vercel auto-deployed, Ready after ~75s. Live GET verification: all 6 pages 200, /privacy 200 with region text, og.png 200, contact murugan@drvelu.com visible, $49 one-time, 0 "verified" on home, no future dates. Live POST verification (free audit teaser, checkout 503, PDF 402 on Vercel) NOT RUN — blocked by an approval timeout, not retried, still needs approval. Full PDF generation on Vercel serverless UNTESTED (needs a real licence key from the payment step).
**Tracker: INSTALLED LIVE 27 Nov 2026.** Merge commit e51015b (dealnote-tracker-install → main). Exact dashboard snippet in root layout head on every page, byte-verbatim in built and live HTML of all 6 pages, verify.js returns 200 (1,538 bytes). /privacy updated to state the tracker is installed. Full report: docs/dealnote-tracker-install-2026-11-27.md. Dashboard "Check installation" / connected status still needs a re-check in the Ship or Die dashboard after traffic.
**GitHub repo:** https://github.com/Velu2k03/dealnote
**Branch:** `main` at e51015b (tracker install merged 27 Nov 2026). Fixes branch dealnote-fixes-nov27 merged at 25f3f72; tracker branch dealnote-tracker-install merged at e51015b; do not re-merge either.
**Vercel project:** dealnote, team velus-projects-27f81f38, Next.js preset, no env vars set, no custom domain.
**Payment: ON HOLD by Velu (11:29 Nov 27).** Polar code unchanged, checkout returns 503 notConfigured with no env vars. Do NOT swap to Lemon Squeezy, do NOT create payment accounts/products, do NOT test-purchase until Velu says resume.
**Rust port:** gate passed 206/206, merged e529576. Vercel runs the TypeScript fallback, binary needs glibc >= 2.34, Vercel AL2 has 2.26. Fallback stays for now, Velu's decision. Deferred, do not touch before Dec 1.

## Fixes round — 27 Nov 2026 (what changed)

- **Payment:** Polar Checkout + webhooks, code-ready with env placeholders (no live keys, no account). Licence-key paywall decided: teaser is score + grade + top 2 findings until the server confirms a licence key. Stripe direct is unavailable to a Philippines-based seller. Net $46.05 per $49 US sale, $45.32 non-US.
- **TrustMRR / Polar corrections:** recorded in docs/TRUSTMRR-POLAR-CORRECTION.md. TrustMRR supports Polar directly (Claude Miss #1 was wrong in its strong form); Polar net $46.05, not $44.83. Open item: TrustMRR handling of one-time payments is still unverified.
- **Contact + refund:** murugan@drvelu.com present in the footer and landing-page FAQ in the working tree at time of writing (/terms and User-Agent to be confirmed); mailto refund route; refund log started at docs/refund-log.md (no refunds yet).
- **/privacy page:** instructed in this round; NOT present in the working tree at time of writing (no app/privacy/ dir). Coordinator to verify.
- **Copy fixes:** $39 line reworded (no "cheapest"), pricing bullet "Teardown PDF and proposal PDF (coming with payment)", CAN-SPAM footer block + 60-second sending checklist on /templates.
- **Slop fixes:** Inter loaded via next/font/google (400/500/600/700), heading weights 600 (h1/h2/h3), 650 deleted, eyebrows at most one and sentence case, "How it works" now a numbered vertical flow, icons inherit slate-600, one shared 120 ms hover transition, nav links 44 px, `--faint` darkened to #64748B, SAMPLE stamp top + footer only on /sample. See docs/design-notes.md §11.
- **PDF:** Puppeteer primary + React-PDF fallback, being built this round, outcome TBD.
- **Next.js:** bumped from 14.2.18 to latest patched 14.2.x (exact version: 14.2.35, per package.json working tree; coordinator to confirm).
- **Docs written/updated this round:** docs/TRUSTMRR-POLAR-CORRECTION.md (new), docs/TRACKER-INSTALL.md (new), docs/refund-log.md (new), docs/dealnote-fixes-2026-11-27.md (new), docs/design-notes.md, docs/TRACKER.md (this file), PLAN.md (§4/§5/§6, §15, new §16), README.md.

## Site-whole round — 27 Nov 2026 (SHIPPED LIVE, merge 25f3f72)

- **Slop re-run:** Briskly-style ~5/100, Jev-style ~1 partial tell (est. ~3–5/100). Fixed M4, M6 residual, M7, L5, L4 residual, 13 em dashes, skipped headings. Full record: docs/dealnote-slop-recheck-2026-11-27.md. 2 em dashes left in the frozen payment component (BuyButton), reword when the freeze lifts.
- **Screenshots:** all 6 pages, 1280 + 390, docs/screenshots/whole-{home,audit,sample,templates,privacy,terms}-{1280,390}.png. No horizontal overflow anywhere.
- **OG:** public/og.png 1200×630, meta tags present in served and live HTML. Not tested on opengraph.xyz.
- **PDF:** verified locally (teardown 71,173 bytes, proposal 67,889 bytes, both 4 pages, no-key 402). Full PDF on Vercel serverless UNTESTED — needs a real licence key.
- **KV adapter:** no free no-account durable store exists. In-memory best-effort stays for Dec 1; do not present 30/month as a hard cap. Stale @vercel/kv comment fixed to @upstash/redis.
- **Vercel region:** default iad1 (Washington, D.C.) verified from public docs, added to /privacy. Log retention still open: sources conflict (Hobby 1 hour everywhere; Pro 1 hour per changelog vs 1 day per docs table). Plan not confirmed in dashboard — NEEDS VELU.
- **TrustMRR one-time:** secondary evidence says one-time payments count in last-30-days/all-time revenue but NOT in MRR (expect MRR $0). Whether Ship or Die ranks by MRR or revenue/profit is still unverified — rules check needed.
- Full report: docs/dealnote-site-whole-2026-11-27.md.

## What is still NEEDS VELU

- Polar account + Philippines Stripe Connect Express KYC.
- Test purchase with real money, then refund it.
- Custom domain decision / purchase.
- PSI API key creation (restricted to the PSI API).
- Legal review of terms (governing law, liability limitation, Business Opportunity Rule confirm).

## What is still open (not Velu, not done)

- PDF generation on the real host: outcome TBD, coordinator to verify.
- Licence-key paywall holding server-side: coordinator to verify.
- Build result, live test results, screenshots, git commits: [TO BE FILLED BY COORDINATOR] in docs/dealnote-fixes-2026-11-27.md.
- TrustMRR one-time-payment handling: check in the TrustMRR add-startup flow before the first sale is counted on.
- P1 items after this round: robots.txt honouring, rate limiting, SSRF redirect re-validation, server-stored brand profiles, SEO meta / OG images / sitemap / JSON-LD, email capture, homepage screenshot capture.

**Payment:** $49 one-time. Recommended: Polar.sh (net $46.05 US / $45.32 non-US per $49 sale). Stripe unavailable to a Philippines-based seller. Lemon Squeezy existing store is a bridge only, processing stops Mar 31 2027.
**Custom domain:** None bought, no decision recorded. Deferred until the payment step. Steps: Vercel Settings → Domains → Add subdomain.resonantatlas.com, exact CNAME Vercel shows; Cloudflare DNS CNAME, proxy OFF (DNS only); do not touch apex, nameservers, or MX.
**Ship or Die tracker:** INSTALLED LIVE 27 Nov 2026, merge e51015b. Exact snippet from the dashboard, in app/layout.tsx head on every page:
`<script defer src="https://www.ship-or-die.com/hackathon/verify.js" data-site="d40c7a78322ccb335a973aa331f31294d5cbddcb"></script>`
**TrustMRR:** Not started, after first real sale. Checked directly Nov 27: trustmrr.com is live, operator and full provider list could NOT be verified from the site itself; the Polar support correction rests on the TrustMRR FAQ via secondary sources checked Oct 13 2026 (see docs/TRUSTMRR-POLAR-CORRECTION.md).
**Ship or Die My Startup:** FILLED 27 Nov 2026 — DealNote, Software / web app, website https://dealnote-blue.vercel.app/, public sharing on. Dashboard status before tracker install: traffic "Not connected", revenue "Not connected".
**Launch target:** Dec 1. Contest ends Dec 16 2026 21:00 Manila.

**Audit batch 2026-11-27:** docs/dealnote-audit-batch-2026-11-27.md. Verdict: SHIP WITH FIXES. Neon verdict: NO-SHIP 4.1/10 (docs/neon-dealnote-audit-2026-11-27.html). Claude miss-check: docs/claude-misscheck-dealnote-2026-11-27.md (items 1-29). Slop check: docs/dealnote-slop-check-2026-11-27.md. Fixes report: docs/dealnote-fixes-2026-11-27.md.
**Design/images/flow rule:** clean, no AI slop, deep teal #0F766E, Inter, Lucide only, no Sortes tokens, no NoSite indigo. Design, images, and flow must stay in line with this tracker sheet and docs.

**Note:** a duplicate empty sheet was created by a failed first create call and was trashed via Drive; only one DealNote tracker remains.
