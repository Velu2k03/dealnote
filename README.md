# DealNote

White-label website teardown report plus ready-to-send proposal for web design
freelancers and small agencies. Paste any business website URL, get a teardown
plus a proposal under your own brand in about a minute.

**Price:** $49 one-time. Net per sale on Polar Starter: **$46.05** per $49 US
sale, **$45.32** non-US. No subscription. No per-report fee. Fair-use limit:
30 audits per month per buyer. Never use the word "unlimited" anywhere.

**Payment status in this fixes round (27 Nov 2026, branch `dealnote-fixes-nov27`):**
Polar Checkout + webhooks is code-ready with env placeholders. No live keys,
no Polar account, no payment taken, no test purchase made. Do not claim a
live payment exists.

**Contact:** murugan@drvelu.com — present in the footer and the landing-page
FAQ in the working tree at time of writing; /terms and User-Agent still to be
confirmed by the coordinator. Refund: replace or refund a bad report reported
within 14 days; reply within 3 business days. Refund log:
docs/refund-log.md.

**TrustMRR / Polar corrections:** TrustMRR supports Polar directly, and Polar
net is $46.05 per $49 US sale (not $44.83). See
docs/TRUSTMRR-POLAR-CORRECTION.md. One item is still unverified: TrustMRR
handling of one-time (non-subscription) payments must be checked in the
TrustMRR add-startup flow before the first sale is counted on.

## Warning: sample data is SAMPLE only

The sample report on `/sample` and the hero preview on the landing page use a
**fictional business only** (Harbor & Pine Plumbing, fictional address, phone
number in the 555 range, fictional website). The findings shown there are
sample findings written to show the report format. Nothing on the sample pages
describes a real business. Every sample view is marked SAMPLE (top of the page
and footer on /sample).

## How to run locally

```bash
npm install
npm run build
npm run dev
```

Open http://localhost:3000. The audit tool is on `/audit`.

Environment variables (Polar keys, webhook secret, PSI API key — placeholders
only, no live values) go in `.env.local` locally and in Vercel at deploy time.
Fill in real values only when the accounts exist. Never commit real keys.
Note: no `.env.example` file exists in the repo yet — the coordinator should
confirm whether the code agent adds one, or this paragraph should name the
variables explicitly.

## How to deploy on Vercel

1. Push this folder to a Git repository.
2. Import the repository in Vercel as a Next.js project.
3. Set the environment variables in Vercel (Polar keys, webhook secret,
   PSI API key when it exists).
4. Deploy. Do not add `output: 'export'` to `next.config.js`: the audit runs
   in server API routes, and the full report must not be shipped to the browser
   before payment.

## What v1 includes

- Landing page with the real audit UI as the hero visual (sample data, marked SAMPLE)
- `/audit`: server-side audit engine (direct fetch + HTML parse, no Google Maps
  or Places data), scores A to F per category (weights: Speed 20, Mobile 15,
  On-page SEO 20, Technical 15, Conversion 15, Trust/local/social 15),
  issues with plain-language fixes, white-label preview, proposal generator
  with blank price placeholders only, localStorage outreach tracker
- `/audit` paywall: teaser only (overall score + grade + top 2 findings)
  until the server confirms a licence key for the $49 Polar payment.
  Full report JSON + PDF are never shipped to the browser before payment.
- `/sample`: full sample teardown report, marked SAMPLE, print-to-PDF via the
  browser for the sample only
- `/templates`: proposal templates (Essential / Growth / Premium) and an
  email-only covering template, with a CAN-SPAM footer block and a 60-second
  sending checklist
- `/terms`: Terms, Acceptable Use, Refund policy (replace or refund bad reports
  reported within 14 days)
- `/privacy`: Privacy Policy (Vercel server logs, localStorage keys, Ship or
  Die tracker once added, contact murugan@drvelu.com) — instructed in this
  fixes round; NOT present in the working tree at time of writing (no
  app/privacy/ dir, though the footer already links to it). Coordinator to
  verify.

## What is still missing / needs Velu

- **Polar account + KYC:** no Polar account exists yet. Velu must create the
  Polar organisation and complete Philippines Stripe Connect Express payout
  onboarding. Stripe direct is unavailable to a Philippines-based seller.
- **Test purchase:** no real $49 purchase has been made or refunded. A live
  test purchase with real money needs Velu, then refund it and confirm the
  refund path and TrustMRR handling.
- **Ship or Die tracker:** NOT installed. The exact snippet must be copied
  from the Ship or Die dashboard (My Startup > traffic tracker) before any
  traffic and before the first payment. Do not invent it. See
  docs/TRACKER-INSTALL.md. Public script URL confirmed:
  https://www.ship-or-die.com/hackathon/verify.js
  <!-- TODO: Ship or Die tracker snippet goes here once the tracker is set up. Do not invent the snippet. -->
- **TrustMRR:** not set up; connection after the first sale, via a Polar
  read-only key. One-time-payment handling still unverified (see above).
- **Custom domain:** none bought or attached. Velu's decision. Do not buy one
  until the registrar and trademark check in PLAN.md is done.
- **PageSpeed Insights API key:** not created. Velu must create it (restricted
  to the PSI API). Until then, speed is scored from measured load time and
  page size in the run, and the report says so plainly. It is not presented
  as a Lighthouse score.
- **Paid-report PDF:** Puppeteer (`puppeteer-core` + `@sparticuz/chromium`,
  pinned versions) primary, `@react-pdf/renderer` fallback — being built in
  this fixes round, outcome TBD. Do not claim PDF downloads for paid reports
  until that is tested on the real host.
- **Screenshots:** homepage screenshot capture is not built in v1. The audit
  page says so plainly instead of showing a fake screenshot.
- **Server-stored brand profiles:** brand profiles are stored only in the
  browser (localStorage) in v1.
- **Legal review:** terms, refund, and privacy text are drafted from research,
  not reviewed by a lawyer. General information, not legal advice. Governing
  law + liability limitation and a Business Opportunity Rule confirm still
  need a lawyer before payment goes live.

## Audit method

Direct fetch of the public homepage only, server-side. The engine checks
status, HTTPS, title, meta description, headings, images and alt text, links
(first 10 unique internal links checked for broken status), viewport, schema
JSON-LD, tel:/mailto: links, forms, favicon, canonical, robots.txt, and
sitemap.xml. If a page cannot be read, the audit says so and gives no score
for it. No Google Maps/Places data, no traffic or ranking estimates, no
invented figures, no cold SMS scripts, no personal data collection.

## Logo audit

```bash
node scripts/logo-audit.mjs
```

Checks `public/logo.svg` uses at most 2 colours and no gradients.
