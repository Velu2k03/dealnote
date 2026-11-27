# DealNote — Payment / Subdomain / TrustMRR Research

- **Research date:** 2026-11-27
- **Product:** DealNote — white-label website teardown report + proposal for web design freelancers and small agencies
- **Live site:** https://dealnote-blue.vercel.app
- **Repo:** https://github.com/Velu2k03/dealnote
- **Local repo:** `~/workspace/ship-or-die-100k/teardown-generator`, branch `dealnote-audit-batch`
- **Price:** $49 one-time. **Payment status in v1: disabled — "Payment coming soon".** No payment account is connected; no payment is taken (README.md, app/page.tsx).
- **Contest:** Ship or Die $100K Hackathon, ends **Dec 16, 2026, 21:00 Manila**. Ranked by **verified profit** via TrustMRR (receipts minus refunds, chargebacks, payment fees, ad spend). Traffic tracker mandatory before any traffic and before first payment.
- **Scope of this report:** research only. Nothing was bought, no accounts were created, nothing was deployed, no domain was added, nothing was sent externally.

## 0. What DealNote needs from a payment provider

From PLAN.md and README.md (local repo, read 2026-11-27):

- $49 one-time payment, server-side paywall. Full report JSON + PDF only after a webhook confirms payment. The full report is NEVER shipped to the browser before payment.
- Planned path in PLAN.md is "Stripe Checkout + webhooks" — **that plan conflicts with the findings below** (Stripe does not onboard Philippines-based sellers directly; see §3). The plan predates this check and needs updating when the provider is chosen.
- Paid-report PDF is not built yet (Puppeteer primary, @react-pdf/renderer fallback). The provider does not need to deliver the file itself — DealNote's own server renders and serves the PDF after entitlement — but built-in licence-key / file-delivery features are a useful fallback and are recorded below.
- Seller position: Velu is an Indian citizen residing in Santa Rosa City, Laguna, Philippines. No US company exists. Any provider must onboard and pay out on that basis (Indian passport / Philippines residence) with no $500 entity-formation step inside the contest window.

## 1. Lemon Squeezy — existing store futureai2077@gmail.com

### Status: winding down — usable only as a short bridge, NOT a home

- **Closed to new sign-ups Nov 16, 2026; stops processing transactions Mar 31, 2027, no extensions.** Confirmed on Lemon Squeezy's own migration doc, read directly 2026-11-27: "Lemon Squeezy is winding down and will stop processing transactions on March 31, 2027. All Lemon Squeezy stores need to move off the platform by then, and extensions will not be offered." (https://docs.lemonsqueezy.com/migration)
- Key dates from the same doc: Nov 16, 2026 — new sign-ups closed; Dec 2, 2026 — migration tooling for Managed Payments launches; mid-Jan 2027 — recommended latest start of migration (full move can take up to 8 weeks); Mar 31, 2027 — processing stops, including subscription renewals.
- Runway from today (Nov 27, 2026): **~4 months / 124 days**. The contest ends Dec 16, 2026, so Lemon Squeezy would survive the contest itself — but DealNote would need a second migration immediately after, and any buyer entitlement tied to Lemon Squeezy would need moving too.
- The existing store (futureai2077@gmail.com, sign in with Google) is usable **only because it already exists**. No new store can be created. This was already the recorded plan for NoSite Leads (nosite-leads/PLAN.md: "Payment: Lemon Squeezy, existing store, futureai2077@gmail.com").
- Sortes precedent (from ~/workspace/sortes/docs/playbook/SORTES_ENGINEERING_RETROSPECTIVE.md): Sortes used Lemon Squeezy ("Sortes Production Live" store, live mode). A Nov 8, 2026 live checkout test failed ("Could not start checkout") and the live-mode API key was never proven valid. That is a caution, not a verdict on DealNote — but it shows the LS integration on this stack has an unverified live path.

### Fees

- **5% + $0.50 per transaction**, plus **+1.5% for international (non-US) cards**, plus +0.5% on subscription payments (not relevant — DealNote is one-time). Sourced from multiple secondary comparisons checked Nov 2026 (finpresso.com Lemon Squeezy review; creem.io Lemon Squeezy alternatives; remotebuilders.io Philippines guide). Lemon Squeezy's own migration doc does not restate the fee on the page read; the 5% + 50¢ figure is consistent across all secondary sources.
- Payout fees (secondary, remotebuilders.io): 1% per non-US bank payout; PayPal payouts 3% capped at $30.
- **Net on a $49 sale (US card):** fee $2.45 + $0.50 = **$2.95 → net $46.05** (before payout fee).
- **Net on a $49 sale (non-US card):** fee $2.45 + $0.50 + $0.74 = **$3.69 → net $45.32** (before payout fee).

### Licence keys / protected downloads

- **Yes — built in.** Lemon Squeezy delivers files, licence keys and download links. Its own migration doc lists as a migration checklist item: "Product delivery: Whether Lemon Squeezy delivers files, license keys, or download links for you" — and warns that the recommended replacement (Stripe Managed Payments) does NOT include digital fulfilment.

### TrustMRR support

- **Yes** — Lemon Squeezy is in every TrustMRR provider list found (see §5). Connect a read-only API key.
- BUT: TrustMRR verification through Lemon Squeezy dies with the platform on Mar 31, 2027. A DealNote listing verified via Lemon Squeezy would need re-verification on the next provider.

### Migration path

- Lemon Squeezy's official recommendation is **Stripe Managed Payments** (its own merchant-of-record product, built by the Lemon Squeezy team after Stripe's July 2024 acquisition). Guided migration tooling opens Dec 2, 2026; migrating stores pay a promotional 1.5% (instead of 3.5%) through Dec 1, 2027.
- **This path does NOT work for DealNote's seller position:** Managed Payments accepts businesses based in 37 locations only (US, Canada, 31 European countries, Australia, Hong Kong, Japan, Singapore). Philippines / India are not on the list. Lemon Squeezy's own doc says: "If your business isn't eligible, or you rely on features or payment methods that Managed Payments doesn't support, you'll need to move to another provider." It also notes Stripe Atlas (US incorporation) as an option — $500 setup, plus entity maintenance — disproportionate for a $49 product inside a 19-day contest window.
- Managed Payments also does **not** deliver files, licence keys or download links, has no storefront, and does not support PayPal. DealNote would have to build fulfilment on webhooks anyway (which its server-paywall design already does).
- **Verdict on Lemon Squeezy: do NOT build DealNote on it.** It is a 4-month bridge to a forced migration, and its own recommended exit is closed to this seller. The existing store remains a fallback only if every other route fails before launch.

## 2. Polar.sh

### Fees (new organisations — the rate that applies to a new DealNote account)

- **Starter (free, $0/month): 5% + $0.50 per transaction.** Confirmed by Polar's pricing via multiple secondary sources checked Sep–Nov 2026 (paymentreview.com; shortlisted.tools; creem.io Polar review). Note: older articles still quote 4% + 40¢ — that was the rate until **May 27, 2026**. Organisations created before that date keep 4% + 40¢; a new DealNote organisation pays 5% + 50¢.
- Paid tiers (not needed at this volume): Pro $20/mo → 3.8% + 40¢; Growth $100/mo → 3.6% + 35¢; Scale $400/mo → 3.4% + 30¢. Pro pays for itself only above ~$1,400/month in sales — far above DealNote's contest scale.
- Surcharges: **+1.5% for international (non-US) cards**; $15 per dispute (any outcome); fees kept on refunds.
- Payout fees (Stripe Connect Express pass-through, no Polar markup): $2 per month with at least one active payout; 0.25% + $0.25 per payout; 0.25% (EU) to 1% currency conversion outside the EU.
- Settlement: 7-day delay for organisations created on or after May 12, 2026. Manual withdrawals, $10 minimum (USD).
- **Net on a $49 sale (US card):** fee $2.45 + $0.50 = **$2.95 → net $46.05** (before payout fees).
- **Net on a $49 sale (non-US card):** fee $2.45 + $0.50 + $0.74 = **$3.69 → net $45.32** (before payout fees).
- Per-sale payout cost if withdrawing in batches is negligible (e.g. one $0.25 + 0.25% payout spread across many sales); the $2/month active-payout fee is the only fixed cost.

### Philippines payout — YES, explicitly confirmed

- Polar's own supported-countries doc (https://polar.sh/docs/merchant-of-record/supported-countries, read via search result 2026-11-27): payouts go through **Stripe Connect Express** to individuals and businesses in the listed countries, and **Philippines is on the Asia-Pacific payout list** (alongside India, Indonesia, Japan, Singapore, etc.).
- Polar's own wording: "Stripe Payments doesn't need to be available in your country. Polar charges your customers as the Merchant of Record. You only need Stripe Connect Express to receive payouts, and it covers more countries than Stripe Payments." Individuals can sell if Stripe Connect Express supports the individual business type in their country. Caveat from secondary sources: use a bank account in your own name in your own country — Wise/Payoneer/Revolut virtual accounts usually fail Stripe's payout check.

### Licence keys and protected downloads — YES, built in

- Automatic benefits on purchase: **licence keys, file downloads up to 10 GB**, private GitHub repo invites, Discord roles, usage credits. Licence-key activation/validation API is public (`/v1/customer-portal/license-keys/activate`, `/validate`). For DealNote, the primary paywall is server-side entitlement via webhook (see §3 pattern — Polar also sends webhooks), with Polar's file/key delivery as a fallback.

### TrustMRR support — YES

- Polar is in every TrustMRR provider list found (see §5). Connect a read-only API key.

### Other notes

- Merchant of record: Polar is the legal seller, collects/remits US sales tax, EU VAT, Canadian GST and other taxes, carries chargeback liability, issues invoices. Seller does not register for VAT/GST.
- Open source (Apache 2.0), Next.js SDKs praised in reviews; checkout drops into a Next.js app. Fits DealNote's stack.
- Acceptable-use: software/digital products only. A PDF teardown report for freelancers is a digital product; no conflict found. AI content generators and eBooks get extra scrutiny per one review — DealNote is neither (it is a generated report, sold as a one-time digital product; keep the listing wording as "website audit report", not "eBook").

## 3. Stripe (direct)

### Availability — NOT available to a Philippines-based seller

- **Stripe does not onboard businesses incorporated in the Philippines.** Confirmed by Wise (stripe-vs-paypal PH guide) and remotebuilders.io (checked against Stripe's global availability page Oct 27 and Nov 16, 2026): "Philippines isn't on Stripe's list of supported countries, so a business based there can't open a Stripe account."
- The only Stripe route for a PH-based founder is forming a foreign entity — Stripe Atlas, **$500 one-time setup** (including government fees and first year of registered agent, then $100/year), plus US company maintenance, accounting/compliance, and international banking. That is a company-formation project, not a checkout integration, and it cannot be done responsibly inside the contest window.
- **Consequence:** PLAN.md's planned path ("Stripe Checkout + webhooks") is not executable as written for this seller. The webhook-entitlement *architecture* in PLAN.md is still correct and transfers directly to Polar (or any provider with webhooks) — only the provider changes.

### Fees (for reference — US pricing, hypothetical only)

- Standard US online card: **2.9% + $0.30** per successful domestic transaction; +1.5% international cards; +1% currency conversion; $15 per dispute (returned if won).
- **Net on a $49 sale (US card):** fee $1.42 + $0.30 = **$1.72 → net $47.28**.
- **Net on a $49 sale (international card):** fee $1.42 + $0.30 + $0.74 = **$2.46 → net $46.54**.
- These are the best nets in this report — and they are **unavailable**. Do not plan around them.

### One-time Checkout, webhook entitlement

- Stripe Checkout supports one-time purchases (`mode: 'payment'`) and Payment Links (no-code hosted checkout). Fulfilment pattern, per Stripe's own docs (https://docs.stripe.com/checkout/fulfillment, read via search 2026-11-27): **webhooks are required for fulfilment** — "You can't rely on triggering fulfillment only from your checkout landing page, because it's not guaranteed customers visit that page." Listen for `checkout.session.completed`, verify the webhook signature against the raw request body, retrieve the session with line items expanded, check `payment_status`, fulfil idempotently (record fulfilment per Checkout Session ID), never fulfil twice. This exact pattern is what DealNote's PLAN.md describes and what Polar's webhooks (`order.created` / `order.paid`) would replace.
- Stripe Tax exists as an add-on, but with direct Stripe the seller is the merchant of record: **tax registration, collection and remittance are the seller's own responsibility** in every applicable jurisdiction. With Polar/Paddle/Lemon Squeezy/Dodo/Creem (merchants of record), the platform is the legal seller and handles it.

### TrustMRR support — YES (in principle)

- Stripe is TrustMRR's primary and best-supported provider (most listings; verification via a restricted read-only key `rk_live_`, per TrustMRR terms as quoted in secondary sources). Irrelevant for DealNote unless a Stripe account exists via a foreign entity.

## 4. Other TrustMRR-supported options worth noting

TrustMRR provider list (secondary sources quoting TrustMRR's FAQ, see §5): Stripe, Lemon Squeezy, Polar, Paddle, Dodo Payments, RevenueCat, Superwall, App Store, Creem, Whop, Shopify (+ Razorpay as 13th per a Marc Lou post Nov 1, 2026). Of these, the realistic ones for a $49 one-time web product from a PH-based seller are Paddle, Dodo Payments and Creem. RevenueCat/Superwall/App Store are mobile-app rails; Whop/Shopify do not fit this product.

### Paddle

- Merchant of record (software/SaaS only). **5% + $0.50 per checkout transaction**, no monthly fee; chargebacks $20 (USD/GBP/EUR). No international-card surcharge in the headline rate.
- **Net on a $49 sale: $2.95 fee → net $46.05** (same as Polar Starter / Lemon Squeezy on a US card; better than Polar on non-US cards since there is no +1.5%).
- Philippines: **not on Paddle's unsupported seller-countries list** (secondary sources, Oct–Nov 2026) — i.e. not blocked, but not explicitly confirmed as supported either. Every business still goes through Paddle's review; sellers report stricter approval and rejections without reason.
- Payouts: monthly; generated on the 1st, sent by the 15th; **$100 minimum**; $15 SWIFT fee in some countries. A $100 minimum means the first payout needs at least 3 sales ($49 × 3 = $147 gross) — fine, but slower than Polar's $10 minimum.
- Licence keys / file delivery: **not built into Paddle Billing** — build it with webhooks (which DealNote already plans to do server-side, so this is not a blocker, just no fallback).
- TrustMRR: yes, supported.
- Verdict: credible second choice. Loses to Polar on: explicit Philippines payout confirmation, $100 payout minimum vs $10, stricter/opaquer approval, no built-in file/key delivery.

### Dodo Payments

- Merchant of record, popular with India-based founders who cannot get Stripe. **4% + $0.40** headline; +1.5% international cards; +0.5% subscriptions (n/a here); +3% PayPal/BNPL; $1 per refund; **$30 per dispute**; payouts twice-monthly (1st–15th pays on the 18th; 16th–end pays on the 4th), $50 minimum, $5 fee on payouts under $1,000, $25 USD SWIFT.
- **Net on a $49 sale (US card): $2.36 fee → net $46.64** — $0.59 better than Polar Starter per sale.
- **Net on a $49 sale (non-US card): $3.10 fee → net $45.91**.
- Eligibility follows the country that issued the government ID (all directors'/owners' IDs). Velu holds an Indian passport, which fits Dodo's India-friendly onboarding; Dodo is on the accepted-countries list for Philippines payout per remotebuilders.io.
- Licence keys, storefront, digital delivery: included (per Dodo pricing/docs via turbostarter.dev review, Oct 2026).
- TrustMRR: yes, supported (in the FAQ list).
- **Risks (why it is not the recommendation):** founded 2024, ~$1.1M pre-seed; Trustpilot ~3.1/5 over ~124 reviews with a recurring theme of accounts suspended/closed at or before the first payout with balances held 120 days (card-network dispute-exposure hold, confirmed as a mechanism by Dodo's own replies); master services agreement (last updated Feb 26, 2026) still quotes 5% + 50¢ while the pricing page says 4% + 40¢ — the contract does not match the quoted price; discretionary reserve, termination at a 0.5% monthly chargeback/cancellation/refund rate, dormancy charge after 3 months without sales. For a contest where every sale must verify on TrustMRR and the money must actually arrive, that risk profile outweighs $0.59/sale.
- Verdict: cheapest per-sale net among the realistic MoRs, but the account-hold record and contract/price mismatch make it the riskier pick. Keep as a backup if Polar rejects the account.

### Creem

- Merchant of record. **3.9% + $0.40 per successful transaction, flat — no international-card surcharge, no subscription surcharge, no monthly/setup fee.** Licence keys, file downloads (up to 500 MB per file), storefront and affiliates built in.
- **Net on a $49 sale (any card): $2.31 fee → net $46.69** — the best net among the available MoRs.
- Payouts: 1st and 15th monthly, local bank transfer; **payout fee $7 USD/EUR or 1% of the payout, whichever is higher** — on small contest payouts this bites (e.g. a $46.69 single-sale payout costs $7, i.e. 15%).
- Seller countries: 87 countries per Creem; India and Brazil named as included. **Philippines acceptance was NOT verified in this research** — no source found confirms PH on Creem's supported-countries list. Do not choose Creem until that page is checked.
- TrustMRR: yes, supported (in the FAQ list).
- Verdict: best headline net, but PH acceptance unverified and the $7-or-1% payout fee erases the advantage at low volume. Worth one check of Creem's supported-countries page; not the recommendation today.

### Stripe Managed Payments (for completeness)

- Stripe's merchant-of-record replacement for Lemon Squeezy. **3.5% per transaction on top of standard Stripe processing fees** (migrating Lemon Squeezy stores: 1.5% promo through Dec 1, 2027).
- **Net on a $49 sale (standard, US processing):** 3.5% ($1.72) + 2.9% + $0.30 ($1.72) = **$3.44 → net $45.56**. Promo 1.5%: $0.74 + $1.72 = **$2.46 → net $46.54**.
- **Not available to this seller:** 37 supported locations only (US, Canada, 31 European countries, Australia, Hong Kong, Japan, Singapore). No licence keys, file delivery, storefront or affiliates. TrustMRR support for Managed Payments specifically was not verified anywhere in this research.
- Verdict: not an option for DealNote.

## Net-per-$49-sale summary

| Provider | Fee on $49 (US card) | Net (US card) | Fee on $49 (non-US card) | Net (non-US card) | Available to PH-based seller? |
|---|---|---|---|---|---|
| Lemon Squeezy | $2.95 | **$46.05** | $3.69 | **$45.32** | Existing store only; closes Mar 31, 2027 |
| **Polar (Starter)** | **$2.95** | **$46.05** | **$3.69** | **$45.32** | **Yes — PH on payout list** |
| Stripe (direct, US rates) | $1.72 | $47.28 | $2.46 | $46.54 | **No — PH not supported** |
| Paddle | $2.95 | $46.05 | $2.95 | $46.05 | Not blocked; not explicitly confirmed |
| Dodo Payments | $2.36 | $46.64 | $3.10 | $45.91 | Yes (ID-based; Indian passport) |
| Creem | $2.31 | $46.69 | $2.31 | $46.69 | **Unverified for PH** |
| Stripe Managed Payments | $3.44 | $45.56 | — | — | No — 37 countries only |

Notes: nets are before payout fees and before any tax the buyer pays (MoR tax is collected on top of the price and remitted by the MoR; it is not deducted from the $49). Payout fees: Polar $2/mo active + 0.25% + $0.25 per payout; Dodo $5 under $1,000; Creem $7 or 1% per payout; Paddle $100 minimum, $15 SWIFT in some countries; Lemon Squeezy 1% non-US bank. Contest profit = receipts − refunds − chargebacks − payment fees − ad spend, so the fee directly reduces ranked profit.

## Recommendation: Polar.sh (Starter plan)

1. **It is the only option that clears every gate at once:** TrustMRR-supported; Philippines explicitly on its payout list (Polar's own supported-countries doc); merchant of record (tax handled); licence keys + file downloads built in; $0 monthly fee; Next.js-friendly; no company formation needed.
2. **Lemon Squeezy is a dead end.** Four months of runway, a forced migration on Mar 31, 2027, and its official exit (Managed Payments) is closed to this seller. Building DealNote's paywall on it would mean rebuilding payment twice.
3. **Stripe direct is unavailable** without a $500 US entity via Atlas — unjustifiable for a $49 product with 19 days of contest left.
4. **Dodo is $0.59/sale cheaper but riskier** (account holds before first payout, 120-day holds, contract quoting a different price than the pricing page, $30 disputes). In a contest decided by verified, actually-received profit, payout reliability beats $0.59.
5. **Creem nets the most per sale ($46.69) but PH acceptance is unverified** and its $7-or-1% payout fee eats the advantage at contest volume. Check its supported-countries page as a one-off; do not build on it unverified.
6. **Paddle is the credible second choice** (same $46.05 net, no intl surcharge, TrustMRR-supported) — use it only if Polar rejects the account. Its $100 payout minimum, stricter approval and lack of built-in file/key delivery make it second, not first.
7. **Implementation shape (unchanged from PLAN.md, provider swapped):** Polar Checkout for the $49 one-time product → Polar webhook (`order.paid`) → server verifies signature → entitlement record → full PDF rendered server-side and served only to entitled buyers. Never ship the full report to the browser before payment. Connect Polar's read-only API key to TrustMRR after the first sale. Install the Ship or Die tracker BEFORE any traffic (see §7).

### Pre-launch checks before wiring Polar (do not skip)

- Create the Polar organisation and confirm the account passes review (secondary sources report review up to 14 days — start immediately; the contest ends Dec 16).
- Confirm Stripe Connect Express individual payout works for Philippines with a Philippines bank account in Velu's own name (Polar's doc says individuals are supported where Connect Express supports the individual type; verify in the onboarding flow, do not assume).
- Test purchase in Polar test mode, then one live $49 test, then refund/void it and confirm the refund path and TrustMRR handling.
- Update PLAN.md: replace "Stripe Checkout + webhooks" with "Polar Checkout + webhooks" and record why.

## 5. TrustMRR — direct check (2026-11-27)

This section records only what was checked directly in this session. Earlier claims about TrustMRR were NOT repeated without checking.

### What trustmrr.com itself says (fetched directly)

- **The site is live.** https://trustmrr.com fetched 2026-11-27 (page crawled 00:49 UTC). It renders as "TrustMRR - Buy and Sell SaaS Startups" with a **Top 100 startups** table (rank, startup, founder, MRR, MoM growth). Examples from the live page: #1 Stan, $3,569,654 MRR; #2 (unnamed in the fetch) $477,322; #9 (Anonymous) $198,645.
- Footer/description on the page itself: "TrustMRR verified startup revenue database — A startup acquisition marketplace and public database of SaaS, apps, and digital businesses with revenue and marketplace metrics verified through payment providers and connected analytics sources when available."
- **Operator: NOT stated on the pages fetched.** Neither the homepage nor the Ship or Die profile page names who operates TrustMRR. Secondary sources consistently say it was built by Marc Lou (who also runs Ship or Die) — that claim could NOT be verified from trustmrr.com itself in this session and is recorded here as unverified-from-primary-source, not as fact.
- **Supported payment providers: NOT listed on the pages fetched.** The homepage does not name any provider. The provider list below comes from secondary sources quoting TrustMRR's FAQ and could NOT be verified on trustmrr.com itself in this session (no FAQ page was fetched — its URL was not available from the pages read, and URLs are not guessed).
- **Verification, as shown on a live profile page:** https://trustmrr.com/startup/ship-or-die (fetched 2026-11-27; page crawled Oct 26, 2026) shows Ship or Die with all-time revenue $119,684, ranked #552, founders "Marc Lou / jack friks", founded May 2026, Singapore, and the line: **"Revenue is verified with Stripe API key. Last updated: Oct 25, 2026, 10:33 PM."** This confirms the mechanism at least for Stripe: a provider API key is connected and the profile states the verifying provider and last-sync time.

### Supported providers (secondary sources only — NOT verified on trustmrr.com directly)

Multiple independent secondary sources, all citing TrustMRR's FAQ (checked Oct 4 – Nov 15, 2026), agree on this list:

- **Stripe, Lemon Squeezy, Polar, Paddle, Dodo Payments, RevenueCat, Superwall, App Store, Creem, Whop, Shopify** — each connected with a read-only API key or OAuth/scoped connection. One source (creatorstoolbox.com, updated Nov 15, 2026) adds that Marc Lou posted Nov 1, 2026 that **Razorpay is the 13th provider**, though the FAQ did not name it.
- The Ship or Die hackathon rules summary (vibecodinglist.com, checked against official sources Nov 20, 2026) lists the same set for the contest: "TrustMRR supports several payment providers, including Stripe, Lemon Squeezy, Polar, Paddle Billing, RevenueCat, App Store, Shopify, and others listed in the official rules."
- **Caveat:** TrustMRR's own terms (last updated Oct 9, 2026, per onemanonly.co) name a shorter list — Stripe, Lemon Squeezy, Polar and Dodo Payments. The FAQ list is the wider one. Either way, **Polar, Lemon Squeezy, Paddle, Dodo and Stripe are on both lists**.

### How verification works (secondary sources quoting TrustMRR FAQ/terms)

- Founder clicks "Add startup" and pastes a **read-only API key** from the payment provider (for Stripe, a restricted `rk_live_` key with read-only access to charges, subscriptions and account information). TrustMRR cannot charge customers or change anything in the account.
- TrustMRR reads revenue directly from the provider and refreshes automatically (typically hourly, per one source). The profile shows verified figures with the provider's name.
- What it reads: aggregates only — total revenue, MRR, last-30-days revenue, customer count, active subscriptions, churn, growth, charge counts. It states it does **not** collect customer names, emails, addresses or payment details.
- TrustMRR notes its figures can differ from the provider's own dashboard (one source quotes up to 30%). For the contest, the leaderboard shows provisional revenue; final rankings use verified profit.
- A startup can link a secondary provider to combine revenue; the primary provider is fixed per listing.
- TrustMRR also lists startups for sale (3% closing fee plus escrow via Escrow.com, per secondary sources) — not relevant to DealNote.

### Contest link (secondary sources; official rules page not directly verifiable)

- The $100K Hackathon is run by Ship or Die (Marc Lou and Jack Friks), sponsor Higgsfield, Nov 16 – Dec 16, 2026. Entrants reach the public revenue board by connecting TrustMRR, which verifies revenue through the payment provider.
- **Ranking is by verified profit, not raw revenue:** receipts during the competition minus refunds, chargebacks, payment processing fees, and paid marketing. Upfront annual payments count; unpaid invoices and projected MRR do not. The live leaderboard displays provisional revenue; final prize rankings use verified profit.
- Potential winners undergo manual checks of development history, acquisition sources, revenue and expenses; verification can take up to 10 days after closing; entrants have five days to supply requested evidence.
- **Could not verify directly:** the official rules page (https://www.ship-or-die.com/100k-hackathon/rules) returned **HTTP 403 — access denied** to browser.open on 2026-11-27. The contest facts above are therefore sourced from the vibecodinglist.com rules summary (stated as checked against official sources Nov 20, 2026) and a productwatch.io report (Nov 2026). They must be re-checked against the official rules in a live browser before launch.

## 6. Subdomain — Vercel + Cloudflare DNS steps (do NOT buy or add anything yet)

### Status

- **No custom domain bought, no decision recorded for DealNote.** README.md: "Domain: none bought or attached. Do not buy one until the registrar and trademark check in PLAN.md is done." PLAN.md's trademark note is web-search only (no known live product called DealNote in the website-audit/proposal space; nearest names are different products) — not a trademark search.
- Live for now: https://dealnote-blue.vercel.app.

### Deferred-until-payment pattern (NoSite precedent, Velu's decision 2026-11-26)

From nosite-leads/PLAN.md and nosite-leads/docs/TRACKER.md (read 2026-11-27):

- "Subdomain: leads.resonantatlas.com, host Vercel, domain bought on Cloudflare. DEFERRED 2026-11-26 Velu: add custom domain later while on the payment step."
- "When payment step starts: Vercel Settings > Domains > Add leads.resonantatlas.com, use the exact CNAME Vercel shows, Cloudflare Type CNAME, Name leads, Value that exact CNAME, proxy off. Do not change apex, nameservers, or MX."
- Same pattern in nosite-leads/README.md (§Deploy to Vercel, steps 3–5), plus: "Wait for SSL, then check the domain shows Valid in Vercel."
- NoSite also records: "Tracker snippet before any traffic or first payment. TrustMRR after first sale."

### Sortes precedent (verified from repo/docs)

- Sortes is live at **https://sortes.resonantatlas.com** (Next.js on Vercel), domain decided by the owner and live since **2026-11-03** (~/workspace/sortes/docs/playbook/SORTES_ENGINEERING_RETROSPECTIVE.md). The alternative tarot.resonantatlas.com was not used and must not be re-added.
- resonantatlas.com DNS lives in Cloudflare (nosite-leads/README.md). Resend domains verified for resonantatlas.com and sortes.resonantatlas.com.
- **Honest limit:** the explicit "CNAME, proxy off" wording was found in the NoSite docs, NOT as a line in the Sortes docs searched in this session. The Sortes precedent verifies the pattern (subdomain of resonantatlas.com → Vercel, DNS on Cloudflare, live since Nov 3) but the step-by-step proxy-off wording comes from NoSite. The proxy-off rule itself is corroborated by Vercel/Cloudflare guides (see below).

### Steps for a future DealNote subdomain (when Velu approves; nothing done now)

A subdomain of resonantatlas.com needs **no domain purchase** (unlike a new apex domain). The candidate name is **not decided** — following the pattern it would be something like `dealnote.resonantatlas.com`, but no decision is recorded; do not treat that as chosen.

1. **Decide the subdomain** (Velu's call) and confirm no clash with existing subdomains (sortes., leads. are taken).
2. **Vercel:** open the DealNote project → Settings → Domains → Add `<subdomain>.resonantatlas.com`. Vercel shows a project-specific CNAME value — **copy it exactly, character for character**. (Current Vercel guidance: the CNAME is unique per project, e.g. `<hash>.vercel-dns-017.com`; older tutorials saying `cname.vercel-dns.com` are outdated.)
3. **Cloudflare** (where resonantatlas.com DNS lives): DNS → Records → Add record: Type `CNAME`, Name `<subdomain>`, Target `<exact Vercel CNAME>`, TTL Auto, **Proxy status: DNS only (grey cloud) — proxy OFF**.
4. **Do not change** the apex record, nameservers, or MX records.
5. **Wait for SSL:** Vercel auto-detects propagation (typically 2–10 minutes for Cloudflare-managed domains), provisions the certificate, and the domain should show **Valid** in Vercel. If it stays stuck on "Failed to generate cert", the orange Cloudflare proxy being on is the most common cause — turn it off and retry.
6. Why proxy off: with the Cloudflare proxy on, Cloudflare intercepts HTTPS and Vercel cannot complete domain verification or issue its SSL certificate. DNS-only means Cloudflare acts as a pure resolver and Vercel handles SSL + edge routing. (Sources: Vercel/Cloudflare setup guides, dev.to 2026; shiptocash.com Vercel custom-domain guide, Nov 2026; Atlantis KB-002.)
7. After the subdomain is live: update the Ship or Die "My Startup" website URL and the TrustMRR profile to the subdomain; keep the vercel.app URL working as a fallback until the subdomain is verified.

## 7. Ship or Die tracker — exact order and what is / is not verified

### Order (mandatory)

1. **Install the tracker BEFORE any traffic and BEFORE the first payment.** Keep it active for the whole contest. (Rules summary, vibecodinglist.com; NoSite README: "BEFORE any traffic or first payment. Verify the dashboard shows connected.")
2. Mobile apps are exempt from website tracking but still require TrustMRR and, if shortlisted, a verification call. DealNote is a web app, so the tracker applies.
3. TrustMRR connection comes after the first real sale (NoSite pattern: "TrustMRR after first sale") — but the tracker must already be live before that sale.
4. DealNote current state: **not yet registered in the hackathon tracker** (README.md: "TODO: add the tracker snippet when the tracker is set up." with the comment `<!-- TODO: Ship or Die tracker snippet goes here once the tracker is set up. Do not invent the snippet. -->`). No traffic has been sent yet, so nothing is lost — but no traffic or launch may happen before the snippet is installed.

### Script URL — publicly confirmed

- **https://www.ship-or-die.com/hackathon/verify.js** — confirmed by multiple independent entrant privacy pages that load exactly this script and name it as the Ship or Die traffic tracker:
  - apsh.ai/privacy: "Every page of this site loads a small script from Ship or Die (`https://www.ship-or-die.com/hackathon/verify.js`)."
  - quoteflow.markriplabs.com/privacy (updated Nov 19, 2026): "A script from Ship or Die (`www.ship-or-die.com/hackathon/verify.js`) loads on every public marketing and legal page."
  - saychip.com/privacy: describes the same script and the data it sends (page path without the rest of the address; referrer domain only; UTM source/medium and whether the link came from an advert; IP address and user agent, used only briefly to estimate visitors per day and not stored; no cookies; data deleted 90 days after the contest ends; operator named as Ship or Die / JustShipIt Pte. Ltd., Singapore).
  - minidev.fun/privacy: "Every page loads their script from ship-or-die.com (verify.js), which counts visits and where they came from."

### The full snippet — NOT verified, do NOT invent

- **No source in this research shows the exact dashboard-issued snippet tag** (script tag with its attributes). The privacy pages above confirm only the script URL. The NoSite README records the source of truth: "paste the EXACT snippet from the Ship or Die dashboard (My Startup > traffic tracker) into the `<head>` in `app/layout.tsx` (there is a TODO comment there), on EVERY page."
- **Required action:** copy the snippet exactly from the Ship or Die dashboard (My Startup → traffic tracker), paste it into `<head>` on every page (Next.js: `app/layout.tsx`), deploy, then verify the dashboard shows connected. Do not reconstruct it from the URL alone — an invented snippet is worse than a missing one, because a wrong snippet silently fails to verify traffic.
- Placement note from the entrant examples: the script loads on public/marketing pages; at least one entrant excludes quote/account pages (`/q/…`, `/app`, `/login`) so it never sees customer data. For DealNote, load it on public pages; keep it off any page that handles a buyer's audit data if the dashboard snippet allows scoping — otherwise follow the dashboard's own instruction exactly.

## 8. Open items / what still needs a live check

1. **Polar account review timing** — secondary sources report review up to 14 days. Start the Polar organisation now; the contest ends Dec 16.
2. **Polar Philippines individual payout** — confirm in onboarding that Stripe Connect Express accepts an individual with a Philippines bank account in Velu's name.
3. **Creem Philippines acceptance** — one check of Creem's supported-countries page; only if Creem is ever considered.
4. **TrustMRR provider list on trustmrr.com itself** — not verified from the primary source in this session; re-check the TrustMRR FAQ/add-startup flow in a live browser before connecting keys.
5. **Official Ship or Die rules** — rules page returned HTTP 403 to browser.open on 2026-11-27; re-check in a live browser (prizes, profit definition, tracker requirement, verification window).
6. **Exact tracker snippet** — copy from the Ship or Die dashboard only.
7. **PLAN.md update** — replace "Stripe Checkout + webhooks" with the chosen provider (recommended: Polar) and record the reason; do not leave the unexecutable Stripe plan in place.
8. **Subdomain decision** — Velu's call; no purchase needed for a resonantatlas.com subdomain.

## Sources (all checked 2026-11-27 unless dated otherwise)

- Lemon Squeezy migration doc (official, read directly): https://docs.lemonsqueezy.com/migration
- Lemon Squeezy farewell post: https://www.lemonsqueezy.com/blog/saying-goodbye-to-lemon-squeezy
- TrustMRR homepage (read directly): https://trustmrr.com (crawled 2026-11-27 00:49 UTC)
- TrustMRR Ship or Die profile (read directly): https://trustmrr.com/startup/ship-or-die (crawled 2026-10-26)
- Polar supported countries (official docs): https://polar.sh/docs/merchant-of-record/supported-countries
- Polar pricing/fees: https://paymentreview.com/reviews/polar/ ; https://shortlisted.tools/products/polar ; https://www.creem.io/blog/polar-sh-reviews
- Polar payouts: https://getpaidatlas.com/guides/polar-payout-countries (checked 2026-10-30)
- Stripe Philippines availability: http://wise.com/ph/blog/stripe-vs-paypal ; https://remotebuilders.io/payments/philippines/ (checked Oct 27 / Nov 16, 2026)
- Stripe fulfilment docs: https://docs.stripe.com/checkout/fulfillment
- Stripe Managed Payments: https://goodvat.com/blog/stripe-managed-payments/ (checked Nov 17, 2026); https://www.useworkcue.com/guides/leaving-lemon-squeezy (checked Nov 16, 2026)
- Paddle / Dodo / Creem comparisons: https://getpaidatlas.com/guides/merchant-of-record ; https://getpaidatlas.com/guides/creem-vs-polar-fees-payouts (checked Nov 15, 2026); https://www.turbostarter.dev/blog/dodo-payments-review (Oct 2026); https://paymentreview.com/reviews/dodo-payments/ ; https://www.creem.io/blog/lemonsqueezy-alternatives-after-stripe-acquisition
- TrustMRR provider list / verification (secondary, quoting FAQ/terms): https://www.conversiongems.com/tools/trustmrr ; https://creatorstoolbox.com/products/trustmrr (updated Nov 15, 2026); https://mrrdeals.com/blog/trustmrr-review ; https://onemanonly.co/posts/how-payment-verified-revenue-works (checked Oct 13, 2026)
- Ship or Die hackathon rules summary: https://vibecodinglist.com/vibe-jams/ship-or-die-100k-hackathon-2026-marc-lou-jack-friks (checked against official sources Nov 20, 2026); https://test.productwatch.io/stories/marc-lou-s-100k-hackathon-disqualified-its-top-product-its-maker-leads-again
- Tracker script URL (entrant privacy pages): https://www.apsh.ai/privacy ; https://quoteflow.markriplabs.com/privacy ; https://www.saychip.com/privacy ; https://minidev.fun/privacy
- Vercel + Cloudflare DNS: https://dev.to/getcraftly/custom-domains-for-nextjs-the-cloudflare-vercel-setup-that-works-in-2026-2a3i ; https://shiptocash.com/deploy/vercel-custom-domain-setup/ ; https://docs.atlantisits.info/kb/KB-002-Cloudflare-Vercel-DNS-Only/
- Local records: teardown-generator README.md, PLAN.md, app/page.tsx; nosite-leads PLAN.md, README.md, docs/TRACKER.md; ~/workspace/sortes/docs/playbook/SORTES_ENGINEERING_RETROSPECTIVE.md
- Ship or Die official rules page: https://www.ship-or-die.com/100k-hackathon/rules — **HTTP 403 on 2026-11-27, not verifiable in this session**
