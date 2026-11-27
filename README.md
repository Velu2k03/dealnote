# DealNote

White-label website teardown report plus ready-to-send proposal for web design
freelancers and small agencies. Paste any business website URL, get a teardown
plus a proposal under your own brand in about a minute.

**Price:** $49 one-time. **Payment: coming soon in v1.** No payment is taken in
this version, and no payment account is connected.

## Warning: sample data is SAMPLE only

The sample report on `/sample` and the hero preview on the landing page use a
**fictional business only** (Harbor & Pine Plumbing, fictional address, phone
number in the 555 range, fictional website). The findings shown there are
sample findings written to show the report format. Nothing on the sample pages
describes a real business. Every sample view is marked SAMPLE.

## How to run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000. The audit tool is on `/audit`.

## How to deploy on Vercel

1. Push this folder to a Git repository.
2. Import the repository in Vercel as a Next.js project.
3. No environment variables are needed in v1.
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
- `/sample`: full sample teardown report, marked SAMPLE, print-to-PDF via the
  browser for the sample only
- `/templates`: proposal templates (Essential / Growth / Premium) and an
  email-only covering template
- `/terms`: Terms, Acceptable Use, Refund policy (replace or refund bad reports
  reported within 14 days)

## What is still missing

- **Payment:** Stripe Checkout ($49 one-time) plus webhook entitlement is not
  built. The full report PDF is not paywalled yet because there is no payment
  to gate it behind; in v1 the audit result is shown free and PDF download is
  sample-only via print-to-PDF.
- **Paid-report PDF:** the paid path is planned as Puppeteer
  (`puppeteer-core` + `@sparticuz/chromium`, pinned versions) rendering the
  same branded HTML as the on-screen preview, with `@react-pdf/renderer` as
  the serverless fallback. Neither is built in v1; do not claim PDF downloads
  for paid reports until that is tested on the real host.
- **PageSpeed Insights API:** no API key is wired in v1. Speed is scored from
  measured load time and page size in the run, and the report says so plainly.
  It is not presented as a Lighthouse score.
- **Screenshots:** homepage screenshot capture is not built in v1. The audit
  page says so plainly instead of showing a fake screenshot.
- **Ship or Die tracker:** the product is not yet registered in the hackathon
  tracker. TODO: add the tracker snippet when the tracker is set up.
  <!-- TODO: Ship or Die tracker snippet goes here once the tracker is set up. Do not invent the snippet. -->
- **TrustMRR:** not set up; no profit tracking is wired in.
- **Domain:** none bought or attached. Do not buy one until the registrar and
  trademark check in PLAN.md is done.
- **Server-stored brand profiles:** brand profiles are stored only in the
  browser (localStorage) in v1.
- **Legal review:** terms and refund text are drafted from research, not
  reviewed by a lawyer. General information, not legal advice.

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
