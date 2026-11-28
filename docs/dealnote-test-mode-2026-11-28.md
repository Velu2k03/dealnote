# DealNote test mode, like Sortes, before live payments

Date: 28 Nov 2026. Status: PREP DONE, browser steps NOT done.
Velu: "Make an test store in the lemonsqueezy then test it first like sortes
then once the pdfs outputs all are good then go with the live payments".
He cancelled the live $49 test purchase on 28 Nov 2026 ("Dont pay"), so
NO live purchase, NO live card, NO Wallet, no live charge at all.

## Sortes pattern (memory, 2026-11-06)

Lemon Squeezy TEST MODE completed, live mode untouched. Three test
products created and published in test mode. Test API key named "Sortes"
created (expires 6 May 2027). Test webhook 149521 created for the preview
URL with order_created + order_refunded, its signing secret was a 40-char
value entered in LS and in Preview (LS did not auto-generate one). All six
LS variables set in Preview only. Live mode settings were not to be
touched. Sortes products, variants, webhooks 149521 (test) and 148741
(live) were not to be touched. Velu 2026-11-16: update price packs in
Lemon Squeezy and do test mode, if everything works, do everything in
the browser.

## Live facts, already done, DO NOT TOUCH

- Store: Resonant Atlas #244487, account futureai2077@gmail.com.
- Live product: DealNote ID 1536795, variant 2390379 (numeric, NOT the
  checkout-link UUID ec07137c-ee2c-4f4f-b742-39251c96e711), $49 one-time,
  Published, license keys on, activation limit 1, never expires.
- Live checkout:
  https://pay.resonantatlas.com/checkout/buy/ec07137c-ee2c-4f4f-b742-39251c96e711
- Live webhook ID 153059, URL
  https://dealnote-blue.vercel.app/api/webhook/lemonsqueezy, events
  order_created + order_refunded only.
- Live API key expires 28 May 2027.
- Vercel env vars set Production, redeploy CCHZ8aiyL Ready 28 Nov
  21:20:22 Manila.
- Live POST verification Done 28 Nov 21:21 Manila: audit POST 200, 45/F,
  2 findings; checkout POST 200, real Lemon Squeezy URL; PDF 402 without
  a key; webhook GET 405, POST empty body 401. PDF 200 with a real key
  is still pending; that is what test mode must prove.
- Repo main HEAD 949aea0. Sakuga/pinkish redesign runs in parallel on
  branch dealnote-sakuga; do NOT touch that branch, do NOT merge it
  in this test-mode work.

## Code finding: there is NO test-mode separation in the code

`lib/lemonsqueezy.ts` reads one set of env vars only:
`LEMONSQUEEZY_API_KEY`, `LEMONSQUEEZY_STORE_ID`,
`LEMONSQUEEZY_PRODUCT_ID`, `LEMONSQUEEZY_VARIANT_ID`,
`LEMONSQUEEZY_WEBHOOK_SECRET`. Test mode works by pointing the
Vercel Preview deployment at TEST values and Production at LIVE values.
`validateLicenseKey` checks the key's meta store/product/variant
against the configured env, so a test key only unlocks when Preview
points at the test product/variant, and a live key only unlocks when
Production points at the live product/variant. Do not mix them.
`DEALNOTE_DEV_LICENSE_KEY` is accepted only when Lemon Squeezy is NOT
configured at all; it is ignored once LS is configured, and it must
stay blank in Production and in Preview.

## Local PDF pre-test, done 28 Nov 2026 (main 949aea0, before test mode)

Local production build (`npm run build`, exit 0, Next.js 14.2.35),
server on 127.0.0.1:3101 with LS env vars UNSET and
`DEALNOTE_DEV_LICENSE_KEY=LOCAL-TEST-DEV-KEY-ONLY` (local only, never
shipped). Files: /tmp/test-sample.pdf, /tmp/test-teardown.pdf,
/tmp/test-proposal.pdf.

- Home: 200. Audit POST https://example.com: 200.
- License check with the dev key: valid, keyId dev, auditsUsed 1,
  auditsRemaining 29, auditsPerMonth 30.
- Teardown, no key + url: 402. Teardown, bad key: 400/402 path
  (invalid key rejected). Teardown, dev key + real brand
  (brandName Harbor and Pine, contactName Test Tester, contactEmail
  test@example.com): 200, 82,536 B, 4 pages, "HARBOR AND PINE",
  "Website Teardown Report", https://example.com, 45/100 Grade F,
  scores by area, footer on every page. PASS.
- Proposal, dev key + same brand: 200, 99,139 B, 5 pages,
  "HARBOR AND PINE", "Website Fix Proposal", 45/100 Grade F,
  findings with Found / Why it matters / Fix, footer on every page.
  One fill-in blank remains by design: "Client: [Your client's
  business name]". PASS, with that blank noted.
- Sample PDF: 200, 76,635 B, 3 pages, SAMPLE stamped, 83/100 Grade B,
  fictional Harbor and Pine business, disclaimer present. DEFECT
  FOUND, P1: the sample PDF brand header is still "[YOUR STUDIO]",
  footer "Prepared by [Your studio] on 28 Nov 2026", and
  "[Your name] · [your email]". The live /sample page was fixed to
  the Harbor and Pine fictional brand, but /api/pdf/sample still
  renders the placeholder brand. Fix before live: make the sample
  PDF use the Harbor and Pine fictional brand throughout, no
  bracket placeholders. Re-test the sample PDF after the fix.
- No "coming with payment" copy in any of the three PDFs.
- Test note: the first dev-key PDF attempt returned 400 because the
  test used `studioName` instead of the real BrandProfile field
  `brandName`. The API field is `brandName`, plus `contactName`
  and `contactEmail`. Use those exact names in every test.

## Browser steps still to do (parent agent, browser task)

These need a live browser. A generic subagent cannot do them.

1. Lemon Squeezy, Resonant Atlas store, switch to TEST MODE. Do NOT
   create a new store unless test mode is not available; if one is
   created, record its name/ID and why.
2. Create a DealNote TEST product in test mode only: $49 one-time,
   same description as live, license keys on, activation limit 1,
   never expires. Record test product ID and test variant ID
   (numeric; check via GET /v1/variants?filter[product_id]=...,
   do NOT use the checkout-link UUID).
3. Create a test API key named "DealNote Test" and a test webhook
   for the Vercel Preview deployment URL (order_created +
   order_refunded only). Record test webhook ID. NEVER put test or
   live API keys or webhook secrets in git, docs, or the sheet;
   only in Vercel env vars, Preview for test, Production for live.
4. Vercel, project dealnote: set the test LS variables in Preview
   only (test API key, test store ID 244487, test product ID, test
   variant ID, test webhook secret). Leave Production env vars
   exactly as they are. Redeploy Preview, verify Ready, record the
   Preview URL.
5. Test checkout in test mode with Lemon Squeezy's test card
   4242 4242 4242 4242, any future expiry, any CVC, test mode only,
   no real money. Complete the test purchase exactly once in test
   mode. Record test order ID, amount, licence key issued, buyer
   email. Then refund it in test mode, record test refund ID.
6. Verify the test licence key end to end on the Preview site:
   full audit on https://example.com, then teardown PDF and
   proposal PDF, plus the sample PDF. Check every PDF against the
   checklist below. Verify the free teaser still works, the
   webhook fired (order_created, then order_refunded revokes the
   licence), and the key unlocks the full report. If any PDF is
   bad, fix the PDF code on a branch, redeploy Preview, re-test
   until all PDFs are good. Record each PDF: name, pages, bytes,
   pass/fail, what was fixed.
7. Only when ALL PDFs are good: switch the store back to Live
   Mode, verify live product 1536795 / variant 2390379 and live
   webhook 153059 are untouched, verify Production env vars are
   still the live ones, verify the live site returns 200 on all
   6 pages + checkout POST 200. Do NOT do a live purchase.
   Report live payments ready to go, with the test evidence.

## PDF checklist (every PDF, every re-test)

- Pages and bytes recorded; PDF opens, no corruption.
- SAMPLE stamp where it belongs (sample PDF only), and only there.
- Brand header/footer: real brand on teardown/proposal, Harbor and
  Pine fictional brand on the sample PDF, no "[Your studio]",
  "[Your name]", "[your email]" anywhere.
- No "coming with payment" copy anywhere.
- Correct score/grade (example.com teardown/proposal: 45/F;
  sample: 83/B), readable layout, no overflow, no garbled text.
- Footer disclaimer on every page (scores are DealNote's own
  measurements, not Lighthouse/PageSpeed, homepage only, no
  guarantee of client wins).
- Proposal: findings carry Found / Why / Fix; "Client:" blank is
  the only bracket allowed, and only as a fill-in for the buyer.

## Live-ready checklist (all must be true before live payments)

- [ ] Test product + test variant created in test mode, IDs recorded.
- [ ] Test API key "DealNote Test" + test webhook created, IDs recorded.
- [ ] Preview env vars set to test values; Production env vars
      untouched and still live values.
- [ ] Test purchase completed once in test mode, test order ID recorded.
- [ ] Test licence key unlocks full audit on Preview.
- [ ] Teardown PDF good (pages, bytes, pass).
- [ ] Proposal PDF good (pages, bytes, pass).
- [ ] Sample PDF good, Harbor and Pine brand, no placeholders.
- [ ] Webhook fired order_created; refund fired order_refunded and
      revoked the licence.
- [ ] Sample PDF placeholder defect (above) fixed and re-tested.
- [ ] Store switched back to Live Mode; live product 1536795 /
      variant 2390379 / webhook 153059 verified untouched.
- [ ] Live site all 6 pages 200, checkout POST 200.
- [ ] No live purchase, no live charge, no live card used.
