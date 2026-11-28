# DealNote Payment: Lemon Squeezy — 28 Nov 2026

**Status: CODE DONE AND LIVE. Product CREATED and VERIFIED via the Lemon Squeezy API 28 Nov 2026. Vercel env vars + Upstash + test purchase PENDING — browser task required (see blockers below).**
Payment provider is now Lemon Squeezy, not Polar. No Polar code
remains in the app: no Polar SDK, no Polar routes, no Polar copy.
Live site: https://dealnote-blue.vercel.app — main HEAD 052f845 (Neon fixes merged), all 6 pages + robots.txt + sitemap.xml 200 live, checked 28 Nov ~21:10 Manila.

## Why Lemon Squeezy
- Velu has an existing store: Resonant Atlas #244487, account
  futureai2077@gmail.com, live mode (test mode OFF), 13 published
  products. Lemon Squeezy closed new sign-ups 16 Nov 2026 and stops
  processing 31 Mar 2027, so this window is usable for the Dec 16
  Ship or Die deadline. Fees 5% + $0.50.
- Do NOT touch the other stores on the account: Atlas #473370,
  CashDash.ai #349198.

## Product CREATED and verified via API, 28 Nov 2026 21:04-21:08 Manila
(Browser task f8878ee8, store Resonant Atlas #244487, account
futureai2077@gmail.com; verified with GET /v1/products/1536795,
/v1/variants?filter[product_id]=1536795, /v1/webhooks/153059.)
- Product ID: 1536795, name DealNote, status published, price 4900 ($49.00), test_mode false (live).
- Variant ID: **2390379** (numeric, name Default, price 4900, status pending). CORRECT VARIANT ID — use this in Vercel.
  WARNING: the browser report also gave a UUID ec07137c-ee2c-4f4f-b742-39251c96e711 as "Variant ID". That is NOT a variant ID; it is the ID in the hosted checkout link. `lib/lemonsqueezy.ts` does `Number(env.variantId)`, so the UUID would become NaN and checkout creation would fail. Do NOT set LEMONSQUEEZY_VARIANT_ID to the UUID.
- Checkout URL (hosted): https://pay.resonantatlas.com/checkout/buy/ec07137c-ee2c-4f4f-b742-39251c96e711
- Product page: https://app.lemonsqueezy.com/products/1536795
- Description as created: "Paste any business website URL. Get a teardown report plus a ready-to-send proposal in about a minute. White-label teardown PDF + proposal PDF, 8 proposals + 8 emails, 30 audits/month fair-use, no subscription."
- Licence keys: enabled, activation limit 1, never expires.
- API key: created 28 Nov 2026, expires 28 May 2027. Value lives in Vercel env only, NEVER in this doc, git, or the sheet.
- Webhook ID: 153059, URL https://dealnote-blue.vercel.app/api/webhook/lemonsqueezy, events order_created + order_refunded only, test_mode false. Signing secret: set on the webhook, same value in Vercel env LEMONSQUEEZY_WEBHOOK_SECRET only, NEVER in this doc, git, or the sheet.

## Product to create (browser task, Resonant Atlas store only) — DONE, see above
- Name: DealNote
- Price: $49 one-time (single variant, no subscription)
- Description: Website teardown + proposal generator for web design
  freelancers. Paste any business website URL, get a white-label
  teardown report plus a ready-to-send proposal in about a minute.
  30 audits per month fair-use. No subscription, no per-report fee.
- Licence keys: ENABLED on the product (and variant). Lemon Squeezy
  generates the key and emails it to the buyer in the receipt.
  Activation limit: 1 is enough (one buyer, one browser); length:
  leave as "never expires" / lifetime of the product.
- Record here after creation (fill in, do not commit secrets):
  - Product ID: 1536795
  - Variant ID: 2390379 (numeric; see warning above)
  - Checkout URL (hosted): https://pay.resonantatlas.com/checkout/buy/ec07137c-ee2c-4f4f-b742-39251c96e711
  - API key: created in Settings -> API, put in Vercel only, never here.
  - Webhook signing secret: chosen when creating the webhook,
    put in Vercel only, never here.

## Webhook to create (browser task)
- Settings -> Webhooks, Resonant Atlas store.
- Callback URL: https://dealnote-blue.vercel.app/api/webhook/lemonsqueezy
- Events: `order_created`, `order_refunded` only.
- Signing secret: choose a random value (32+ chars), same value in
  Vercel env LEMONSQUEEZY_WEBHOOK_SECRET.

## Env vars to set on Vercel (project dealnote, team velus-projects-27f81f38) — BROWSER TASK, see blockers below
- LEMONSQUEEZY_API_KEY (secret)
- LEMONSQUEEZY_STORE_ID = 244487
- LEMONSQUEEZY_PRODUCT_ID = 1536795
- LEMONSQUEEZY_VARIANT_ID = 2390379 (numeric — NOT the checkout-link UUID ec07137c-ee2c-4f4f-b742-39251c96e711; the UUID would break Number() in lib/lemonsqueezy.ts)
- LEMONSQUEEZY_WEBHOOK_SECRET (secret, same as webhook above)
- Leave DEALNOTE_DEV_LICENSE_KEY blank in production.
- After setting, redeploy (or wait for the next push) and verify.

## Code (merged to main, this doc's commit)
- Branch: dealnote-lemonsqueezy, merged to main.
- `lib/lemonsqueezy.ts` (new): checkout creation (POST
  /v1/checkouts), licence validation (POST /v1/licenses/validate,
  public License API), licence lookup by order (GET
  /v1/license-keys?filter[order_id]=), webhook signature verify
  (X-Signature = hex HMAC-SHA256 of raw body).
- `lib/license.ts` (rewritten): validates against Lemon Squeezy;
  dev key only when Lemon Squeezy is not configured.
- `app/api/checkout/route.ts` (rewritten): POST creates a Lemon
  Squeezy checkout, returns { url, checkoutId }; 503 notConfigured
  when unconfigured; 502 when the API fails. Never a fake URL.
- `app/api/webhook/lemonsqueezy/route.ts` (new): verifies signature
  (bad = 401, missing secret = 503), dedupes on
  `ls:<event>:<order id>`, order_created stores the purchase and
  provisions the licence-key hash (best-effort lookup), order_refunded
  marks refunded and revokes the key.
- `app/api/webhook/polar/route.ts` DELETED. `@polar-sh/sdk`
  removed from package.json. No Polar references left in app/lib/
  components (historical docs still mention Polar; they are records,
  not code).
- Copy updated: /privacy now names Lemon Squeezy as merchant of
  record; /terms no longer says PDF downloads are "not yet
  available"; home pricing card and FAQ now say PDF downloads are
  included with your licence. $49 one-time, 30/month fair-use,
  refund murugan@drvelu.com, 14-day replace-or-refund unchanged.

## Local verification (28 Nov 2026, production build, dev key only)
- `npx tsc --noEmit`: clean. `npm run build`: clean, 18/18 pages.
- POST /api/checkout {} (no LS env): 503 notConfigured.
- POST /api/license dev key: 200 valid, source dev, 30 remaining.
- POST /api/license bogus key: 200 valid:false, "not recognised".
- POST /api/audit free teaser example.com: 200, 45/F, 2 of 10 issues.
- POST /api/webhook/lemonsqueezy, no secret: 503.
- Webhook with test secret: bad signature 401; good signature 200
  received:true; replay 200 duplicate:true; order_refunded 200.
- GET /privacy: 200, names Lemon Squeezy, no "Polar".
- GET /: 200, no "coming with payment".

## Live verification (28 Nov 2026 ~21:10 Manila, GETs done; POSTs BLOCKED on a permission card)
- [x] GET all 6 pages 200, robots.txt 200, sitemap.xml 200 live.
- [ ] POST /api/audit free teaser live: expect 200, 45/F, 2 issues. BLOCKED: the POST attempt at 21:10 Manila hit a pending permission card ("Share info with dealnote-blue.vercel.app", approval c3201560-22f0-406c-ba7d-a84c35070d24, foreground). Velu approved the live POST in chat 28 Nov 20:31, but the runtime still needs him to tap approve on that card. No POST was sent. Retry after the card is approved.
- [ ] POST /api/checkout live: expect 200 with a real checkout URL (lemonsqueezy.com), NOT 503. Not yet run (same card blocks it); also currently WOULD return 503 until Vercel env vars are set.
- [ ] POST /api/pdf/teardown without key: expect 402. Not yet run (same card).
- [ ] Live $49 test purchase, then refund immediately in Lemon Squeezy. Record: order ID, amount, refund ID, licence key issued (do NOT put the key itself in this doc — record that it was issued and that it works), and that the key unlocks the full audit + PDFs live. This also proves PDF generation on Vercel serverless. ONE purchase only.
- [ ] Licence key unlocks full report live; teardown + proposal PDFs download live; no "coming with payment" copy left.
- [ ] TrustMRR: connect only after the first real sale, and only if the test purchase counts. A refunded test sale likely does NOT count as revenue; record the truth, do not claim TrustMRR is live unless verified.

## Test purchase + refund (PENDING)
- Order ID: _PENDING_
- Amount: _PENDING_ ($49 expected)
- Refund ID: _PENDING_
- Licence key issued: _PENDING_ (record "issued and works", not the key)
- Full audit + PDFs unlocked live with the key: _PENDING_

## Still open
- Custom domain: DO NOT do it, Velu said later.
- TrustMRR connection: after first real sale only (see above).
- Ship or Die My Startup revenue section: update only with real
  verified figures, never invented.

## Neon whole-site audit fixes, 28 Nov 2026 (branch dealnote-neon-fixes)

Neon Task audit: https://gemini.google.com/app/4b48280eb43a59f2, verdict
NO-SHIP, scores Design/UI 5.5, Tap Flow 4.5, Trust 8.0, Legal 8.5,
Copy/Slop 7.5. Full record: docs/neon-whole-site-audit-2026-11-28.md.

All code findings are fixed and verified locally (production build +
headless Chrome): P0-1 nav crash (tracker moved from a hand-written
<head> to next/script; 10-route click matrix clean), P0-2 sample PDF
(200, 76,635 B, 3 pages), P0-3 terms copy (Upstash sentence replaced
with plain wording), P1-1 audit auto-run, P1-2 teaser findings to
/templates, P1-3 hero subcopy, P1-4 section labels + checklist
markers, P1-5 merchant of record + governing law + tracker in
privacy sharing, P2-1 single SAMPLE banner + CountUp lands on 83,
P2-2 US English site-wide, P2-3 privacy plain language, plus mobile
390px verified on all 6 routes, brand preview on /sample, license
key recovery clarified on home + /audit, favicon 404 fixed.

## Still pending, browser task only (not done by the subagent)

BLOCKERS found 28 Nov 2026 ~21:05 Manila — why the subagent could not finish:
- Vercel MCP connector is connected but returns 403 for team velus-projects-27f81f38 on every project call (list_projects, get_project). It says to call authorize_team_access with teamId team_FUU0It1D2nXFGEUUPNFg9fVg, but that tool is NOT in the connector's available tools ("Error: unsupported Vercel tool authorize_team_access"). No real Vercel CLI is installed on this VM (only the MCP wrapper binary at /opt/hatch/bin/vercel), and no Vercel token is available to log a CLI in with. So env vars CANNOT be set from here; they need the Vercel dashboard in a browser task.
- Live POST verification: DONE 28 Nov 2026 21:21 Manila, see "Live POST verification, 28 Nov 2026 21:21 Manila" at the end of this doc. Permission card c3201560 was decided "Site always allowed" at 21:13:55 Manila, and Vercel env vars were set + redeploy CCHZ8aiyL Ready 21:20:22 Manila before the POSTs ran. All four POST checks passed. The only remaining POST item is PDF 200 with a real licence key, which waits for the test purchase.
- Live $49 test purchase + immediate refund: needs a browser (checkout page, card entry). If it needs Velu's card, stop that step only and report exactly what is needed; do not use any saved card without his say; do NOT do a second purchase.

Remaining browser-task steps, in order:
- Vercel dashboard (project dealnote, team velus-projects-27f81f38): DONE 28 Nov 2026 via browser task — 5 Lemon Squeezy env vars set, redeploy CCHZ8aiyL Ready 21:20:22 Manila, commit 1627bb3. Variant ID 2390379 numeric, NOT the UUID.
- Upstash Redis free tier via Vercel Marketplace ($0, no card): NOT provisioned. The Marketplace offered no free tier, only Pay As You Go $0.2/100K commands and Fixed $10/mo+, so the browser stopped. The 30/month counter is still in-memory, and /terms still says it "may reset when the hosting restarts" — that copy is accurate and was NOT changed. Upstash is still open, needs a decision (Pay As You Go vs Fixed vs leave in-memory).
- Live POST verification: DONE 28 Nov 2026 21:21 Manila, see the section at the end of this doc.
- Live $49 test purchase + immediate refund in Lemon Squeezy; record order ID, amount, refund ID, license key issued (record "issued and works", not the key). If it needs Velu's card, stop that step only and report exactly what is needed; do not use any saved card without his say; do NOT do a second purchase.
- TrustMRR: connect only after the first real sale, and only if the test purchase counts. Ship or Die revenue only with real verified figures.

## Live POST verification, 28 Nov 2026 21:21 Manila

Run by subagent, live against https://dealnote-blue.vercel.app, deployment CCHZ8aiyL Ready 21:20:22 Manila, commit 1627bb3, env vars set. Velu approved in chat 20:31, permission card c3201560 decided "Site always allowed" 21:13:55 Manila. No purchase was completed in this run. No code changes.

1. POST /api/audit, body {"url":"https://example.com"} — 200, 1.73s, 980 B. Body: teaser true, url https://example.com/, fetchedAt "28 Nov 2026", overallScore 45, overallGrade "F", exactly 2 issues: i1 "Meta description is missing" (Critical, seo), i2 "No phone number visible on the homepage" (Critical, conversion). Message: free preview, full report needs a DealNote license ($49 one-time). PASS, matches the expected 45/F + 2 findings.
2. POST /api/checkout, body {} — 200, 1.56s. Body: {"url":"https://pay.resonantatlas.com/checkout/custom/6395524c-25ef-4492-a13e-3184a6f9a930?signature=90d6d1c08ea494bdf06ca85021a08861dff307754feccf106f4ac35533b88366","checkoutId":"6395524c-25ef-4492-a13e-3184a6f9a930"}. Real Lemon Squeezy checkout on the store custom domain pay.resonantatlas.com, NOT a 503. Note: this created one checkout session (6395524c-25ef-4492-a13e-3184a6f9a930); no payment was entered, no order exists. GET on that checkout URL returns 302 (Lemon Squeezy redirect, expected for an unauthenticated checkout link). PASS — checkout is live.
3. POST /api/pdf/teardown, body {"url":"https://example.com"} (no key) — 402, 0.96s. Body: {"error":"A license key is required to download the PDF report. Buy DealNote ($49 one-time) to get one."} POST /api/pdf/proposal, same body — 402, same message for the proposal. PASS.
4. PDF with a real licence key — NOT RUN. No dev licence key exists in the repo (DEALNOTE_DEV_LICENSE_KEY is blank in .env.example, and it is blank in production by design), and no licence key has been issued yet because no purchase has happened. Nothing was invented. This test waits for the $49 test purchase + refund, which issues a real key. PENDING.
5. Webhook endpoint — GET /api/webhook/lemonsqueezy returns 405 (method not allowed, correct for a POST-only route), POST with an empty body returns 401 (signature verification, correct). Not a 404. PASS — the endpoint exists and rejects unsigned calls.
6. Live site re-check, same run: all 6 pages + /robots.txt + /sitemap.xml return 200. Ship or Die tracker snippet (ship-or-die.com/hackathon/verify.js, data-site d40c7a78322ccb335a973aa331f31294d5cbddcb) present on all 6 pages (templates shows 2 occurrences: script + prose disclosure). Neon fixes confirmed live: header split into site-menu-desktop + site-menu-mobile popover, /terms has "Governing law" ("These terms are governed by the laws of the Philippines..."), /sample has "Download sample report as PDF" and the sample is 83/B Harbor and Pine, GET /api/pdf/sample returns 200, 71,772 B, 3 pages. /terms still says the 30/month count "may reset when the hosting restarts" (accurate, Upstash not provisioned).

Verdict: checkout is LIVE. Free audit teaser, checkout creation, PDF paywall (402), webhook auth, tracker, and Neon fixes all verified live. Remaining before a paid launch is proven end to end: the $49 test purchase + refund (issues a real licence key, proves PDF 200 on Vercel serverless), and the Upstash decision.
