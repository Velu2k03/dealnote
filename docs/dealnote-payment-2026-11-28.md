# DealNote Payment: Lemon Squeezy — 28 Nov 2026

**Status: CODE DONE AND LIVE. Dashboard steps PENDING (browser task).**
Payment provider is now Lemon Squeezy, not Polar. No Polar code
remains in the app: no Polar SDK, no Polar routes, no Polar copy.
Live site: https://dealnote-blue.vercel.app

## Why Lemon Squeezy
- Velu has an existing store: Resonant Atlas #244487, account
  futureai2077@gmail.com, live mode (test mode OFF), 13 published
  products. Lemon Squeezy closed new sign-ups 16 Nov 2026 and stops
  processing 31 Mar 2027, so this window is usable for the Dec 16
  Ship or Die deadline. Fees 5% + $0.50.
- Do NOT touch the other stores on the account: Atlas #473370,
  CashDash.ai #349198.

## Product to create (browser task, Resonant Atlas store only)
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
  - Product ID: _PENDING_
  - Variant ID: _PENDING_
  - Checkout URL (hosted): _PENDING_
  - API key: created in Settings -> API, put in Vercel only, never here.
  - Webhook signing secret: chosen when creating the webhook,
    put in Vercel only, never here.

## Webhook to create (browser task)
- Settings -> Webhooks, Resonant Atlas store.
- Callback URL: https://dealnote-blue.vercel.app/api/webhook/lemonsqueezy
- Events: `order_created`, `order_refunded` only.
- Signing secret: choose a random value (32+ chars), same value in
  Vercel env LEMONSQUEEZY_WEBHOOK_SECRET.

## Env vars to set on Vercel (project dealnote, team velus-projects-27f81f38)
- LEMONSQUEEZY_API_KEY (secret)
- LEMONSQUEEZY_STORE_ID = 244487
- LEMONSQUEEZY_PRODUCT_ID (from the product created above)
- LEMONSQUEEZY_VARIANT_ID (from the variant created above)
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

## Live verification (PENDING — browser task, after env vars set)
- [ ] GET all 6 pages 200, tracker snippet on all pages.
- [ ] POST /api/audit free teaser live: expect 200, 45/F, 2 issues.
- [ ] POST /api/checkout live: expect 200 with a real
  checkout URL (lemonsqueezy.com), NOT 503.
- [ ] POST /api/pdf/teardown without key: expect 402.
- [ ] Live $49 test purchase, then refund immediately in Lemon
  Squeezy. Record: order ID, amount, refund ID, licence key
  issued (do NOT put the key itself in this doc — record that it
  was issued and that it works), and that the key unlocks the full
  audit + PDFs live. This also proves PDF generation on Vercel
  serverless. ONE purchase only.
- [ ] Licence key unlocks full report live; teardown + proposal
  PDFs download live; no "coming with payment" copy left.
- [ ] TrustMRR: connect only after the first real sale, and only
  if the test purchase counts. A refunded test sale likely does
  NOT count as revenue; record the truth, do not claim TrustMRR
  is live unless verified.

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

- Lemon Squeezy: create DealNote product in Resonant Atlas store
  #244487 ($49 one-time, license keys on, activation limit 1, never
  expires); API key (Settings -> API); webhook (Settings ->
  Webhooks, https://dealnote-blue.vercel.app/api/webhook/lemonsqueezy,
  order_created + order_refunded only, signing secret).
- Vercel: set LEMONSQUEEZY_API_KEY, LEMONSQUEEZY_STORE_ID=244487,
  LEMONSQUEEZY_PRODUCT_ID, LEMONSQUEEZY_VARIANT_ID,
  LEMONSQUEEZY_WEBHOOK_SECRET; leave DEALNOTE_DEV_LICENSE_KEY blank
  in production; redeploy.
- Upstash Redis free tier via Vercel Marketplace ($0, no card):
  provision and set UPSTASH_REDIS_REST_URL /
  UPSTASH_REDIS_REST_TOKEN so the 30/month counter is durable.
- Live POST verification (free audit teaser, checkout POST expecting
  a real lemonsqueezy.com URL, PDF 402 without key, PDF 200 with a
  real key): Velu approved this 28 Nov 20:31, BUT the last attempt
  timed out on approval and the runtime instruction says do not
  retry unless he asks to try again. Tell Velu it still needs his
  approval.
- Live $49 test purchase + immediate refund in Lemon Squeezy; record
  order ID, amount, refund ID, license key issued (record "issued
  and works", not the key). If it needs Velu's card, stop that step
  only and report exactly what is needed; do not use any saved card
  without his say; do NOT do a second purchase.
- TrustMRR: connect only after the first real sale, and only if the
  test purchase counts. Ship or Die revenue only with real verified
  figures.
