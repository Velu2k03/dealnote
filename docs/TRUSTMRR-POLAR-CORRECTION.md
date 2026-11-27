# DealNote — TrustMRR / Polar Correction

**Date:** 27 Nov 2026
**Branch:** `dealnote-fixes-nov27`
**Status:** Settled corrections recorded in this fixes round. No live payment, no live tracker, no TrustMRR connection exists yet.

This file corrects two errors in the 27 Nov 2026 audit batch. It does not claim any of the corrected paths has been tested live.

## Correction 1 — Claude Miss #1 is WRONG in its strong form: TrustMRR DOES support Polar directly

Claude Miss #1 (docs/claude-misscheck-dealnote-2026-11-27.md) claimed TrustMRR cannot verify Polar.sh revenue directly, because TrustMRR verifies revenue via a Stripe API key and Polar is a merchant of record whose customers pay Polar's Stripe account.

That claim is wrong in its strong form.

- TrustMRR's FAQ lists Polar as a supported provider, alongside Stripe, Lemon Squeezy, Paddle, RevenueCat, Superwall, Dodo Payments, App Store, Creem, Whop, and Shopify.
- Multiple independent sources checked against the TrustMRR FAQ / Terms of Service on 13 Oct 2026 confirm the same provider list.
- TrustMRR verification is by provider API key, and Polar is a supported provider, so a Polar read-only / scoped key is the connection path. The verification does not require the seller to hold a direct Stripe account.
- The same correction applies to the Lemon Squeezy variant of the claim: Lemon Squeezy is also a TrustMRR-supported provider. That does not change the separate decision not to build on Lemon Squeezy (new sign-ups closed 16 Nov 2026, processing stops 31 Mar 2027, and its official exit does not accept a Philippines-based seller).

What this correction does NOT settle:

- It does not prove the TrustMRR connection works for DealNote until a real sale exists and the key is connected and the dashboard shows verified revenue. Connection happens after the first sale.
- It does not settle whether TrustMRR handles one-time (non-subscription) payments. See the open item below.

## Open item — TrustMRR handling of one-time payments (Claude Miss #7, still unverified)

Claude Miss #7 asked whether TrustMRR handles one-time payments at all, or only subscriptions / MRR. That question is still unverified.

It must be checked in the TrustMRR add-startup flow before the first sale is counted on. Do not assume a $49 one-time sale will appear as verified profit on the leaderboard until that check is done. If the flow shows one-time payments are not counted, the coordinator must record that result and Velu must decide the next step before launch.

## Correction 2 — Polar net is $46.05 per $49 US sale; there is NO separate Stripe card fee on top

Claude's fact-check flag F1 calculated a net of about $44.83 by adding Polar's 5% platform fee and then a Stripe 2.9% + $0.30 card fee on top of it. That figure was wrong.

- Polar Starter (free, $0/month): 5% + $0.50 per transaction.
- $49 x 5% = $2.45, plus $0.50 = **$2.95 fee, net $46.05 per $49 US sale**.
- Non-US card: +1.5% ($0.74) = $3.69 fee, **net $45.32**.
- Stripe fees are payout fees passed through, not a second card fee on the same sale: $2/month with at least one active payout, plus 0.25% + $0.25 per payout. They are not added to the $2.95 transaction fee to make $44.83.

The fix branch uses **$46.05 everywhere** as the net per $49 US sale, and **$45.32** for a non-US card. No file in this branch may use $44.83.

## What this changes

- PLAN.md §4/§5/§6 and README.md now say Polar Checkout + webhooks, not Stripe Checkout. Stripe direct is unavailable to a Philippines-based seller; only the webhook-entitlement architecture carries over from the old Stripe plan.
- TrustMRR is no longer treated as blocked by the payment provider. The remaining TrustMRR risk is the unverified one-time-payment handling above, plus the ordinary need to connect the key after the first sale and confirm the dashboard shows the sale.
- Nothing else in the payment research changes. Polar remains the recommendation for the reasons in docs/dealnote-payment-research-2026-11-27.md: Philippines explicitly on its payout-countries list via Stripe Connect Express, merchant of record, licence keys and file downloads built in, $0 monthly fee.

## Sources

- TrustMRR FAQ / Terms of Service, checked against multiple independent secondary sources on 13 Oct 2026 (see docs/dealnote-payment-research-2026-11-27.md §5 for the source list).
- Polar Starter pricing: 5% + $0.50 per transaction, +1.5% non-US cards; payout fees $2/month + 0.25% + $0.25 per payout (see docs/dealnote-payment-research-2026-11-27.md §2).
- Claude Miss #1 and flag F1: docs/claude-misscheck-dealnote-2026-11-27.md.

Contact: murugan@drvelu.com
