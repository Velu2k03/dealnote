# DealNote — GitHub Reuse Check

**Date:** 2026-11-27
**Scope:** Report only. No code copied, nothing installed, nothing deployed, nothing sent externally.
**Repo:** `~/workspace/ship-or-die-100k/teardown-generator`, branch `dealnote-audit-batch` (branch not switched, no commits made).
**Stack:** Next.js 14 TypeScript on Vercel, Node runtime, no static export, cheerio parse, Rust port of `analyzePage` (`lib/analyze.ts` + `rust/analyze-page-rs/` — already merged; the `rust-anything` skill at `~/workspace/custom-skills/rust-anything/` was **not** re-audited per brief).

## Ship or Die rules applied

- Product must be brand new, launched on/after **Nov 16, 2026**.
- No prebuilt product before Nov 16; no fork-wholesale-and-rebrand of an existing product.
- **Safe:** MIT/Apache-2.0 libraries, small utility functions, and patterns, rewritten into the brand-new repo.
- **Not safe:** whole competing products, and any licence that forbids commercial use (AGPL, PolyForm Noncommercial, etc.).
- **Licence trap:** a repo with **no licence** is all-rights-reserved by default — do not copy its code, even if it is public on GitHub. Use it only as a pattern reference and write your own implementation.

## Method

Web search plus direct GitHub API reads on 2026-11-27 (licence, stars, last push taken from `api.github.com/repos/...`). Star counts and push dates are as of that check. No code was copied into this report beyond short API/pattern descriptions.

---

## 1. Puppeteer PDF generation on Vercel

### TOP PICK — puppeteer-core + @sparticuz/chromium (pair, pinned)

| | puppeteer-core (via puppeteer) | @sparticuz/chromium |
|---|---|---|
| URL | https://github.com/puppeteer/puppeteer | https://github.com/Sparticuz/chromium |
| Licence | **Apache-2.0** | **MIT** |
| Stars | **95,912** | **1,669** |
| Last activity | 2026-11-26 | 2026-11-24 |
| What it does | `puppeteer-core` is Puppeteer's browser-control library without a bundled Chromium. `@sparticuz/chromium` is a Chromium build compressed to fit serverless (Lambda/Vercel) limits, unpacked to `/tmp` at runtime. Together they render HTML and export `page.pdf()` inside a Vercel Node function. | Same row. |
| Ship or Die verdict | **SAFE — use.** Standard MIT/Apache-2.0 libraries, not a product. | **SAFE — use.** |

**Implementation notes (from Nov 2026 guides, tested on Vercel):**

- Pin both packages to exact versions and move them together. `@sparticuz/chromium` versions track Chromium, not semver; breaking changes can land in a patch release.
- Known-good pair from the guides: `puppeteer-core@25.11.0` + `@sparticuz/chromium@153.0.0` (Chrome 153). npm latest for `@sparticuz/chromium` was **158.0.0** on 2026-11-27 — if you take 158, pair it with the `puppeteer-core` release that targets Chrome 158 (check Puppeteer's supported-browsers table first). Do **not** install both at latest blindly: the newest `puppeteer-core` (25.16.0, Chrome 156) had no matching `@sparticuz/chromium` at the time the guides were written.
- Requires Node **22.17+ or 24+** (Vercel runtime setting), x86_64 architecture, ~1,536 MB function memory (`@sparticuz/chromium` wants ≥512 MB, recommends ≥1,600 MB), and a function timeout above your page timeout.
- Next.js must include the Chromium `bin` folder in the deployment: `outputFileTracingIncludes: { '/api/pdf': ['./node_modules/@sparticuz/chromium/bin/**'] }` in `next.config`, or the route 500s with a missing-`bin` error. `serverExternalPackages: ['@sparticuz/chromium', 'puppeteer-core']` is the current Next.js option for keeping them out of the bundle.
- Alternative for tighter bundles: `@sparticuz/chromium-min` (same repo family, MIT) ships without the browser and downloads a `chromium-pack.tar` from a URL you host at runtime (8 MB zipped vs ~78 MB for the full package). Prefer hosting the pack on Vercel Blob/your own storage, not a GitHub release URL, so uptime does not depend on GitHub.
- Vercel limits that bite: 250 MB uncompressed function size (5 GB large-function beta exists), 4.5 MB request-body limit, no system fonts in the Lambda environment (embed fonts or accept the bundled Open Sans), cold-start Chromium download on `chromium-min`.
- Sources: https://pagedpdf.com/guides/puppeteer-pdf-on-vercel/ (tested 2026-11-01, Next.js 16.4.3 / puppeteer-core 25.11.0 / @sparticuz/chromium 153.0.0), https://www.ventura-digital.de/blog/rendering-pdfs-on-vercel-with-nextjs, https://snapshotflow.com/blog/puppeteer-aws-lambda-vercel-screenshot, https://dev.pdfshift.io/guides/puppeteer-pdf-aws-lambda/

### FALLBACK — @react-pdf/renderer (diegomura/react-pdf)

| | |
|---|---|
| URL | https://github.com/diegomura/react-pdf |
| Licence | **MIT** |
| Stars | **16,864** |
| Last activity | 2026-11-27 (active) |
| What it does | Declarative PDF generation with React components (`<Document>`, `<Page>`, `<Text>`, `<View>`) running in Node or the browser. No Chromium, no serverless size problem, tiny cold start. |
| Ship or Die verdict | **SAFE — use as fallback.** MIT library, not a product. |

**Caveats:** no full CSS support, no flex gap, limited fonts, layout debugging is harder than inspecting a web page (you cannot inspect a PDF like HTML). Best for a clean, structured report layout; weaker for pixel-perfect reproduction of an HTML design. Good fit if the DealNote PDF is a designed report rather than a screenshot of the web page.

**Name-collision warning:** there are three different things called "react-pdf":

1. `diegomura/react-pdf` — the renderer above (MIT, **this is the one to use**).
2. `wojtek.maj/react-pdf` — a PDF *viewer* for React (also MIT; not a generator, wrong tool for this piece).
3. "React PDF" at react-pdf.dev — a **commercial product** with a paid EULA (watermarked evaluation, commercial use requires a purchased licence). **Do not use.**

### AVOID — chrome-aws-lambda (alixaxel/chrome-aws-lambda)

| | |
|---|---|
| URL | https://github.com/alixaxel/chrome-aws-lambda |
| Licence | MIT |
| Stars | 3,280 |
| Last activity | 2024-09-03 (stale, 2+ years) |
| Verdict | **DO NOT USE.** Superseded by `@sparticuz/chromium`. Older tutorials still reference it; follow the Sparticuz route instead. Licence itself is fine, the project is just unmaintained. |

### AVOID (licence) — gabenunez/puppeteer-on-vercel (reference only)

| | |
|---|---|
| URL | https://github.com/gabenunez/puppeteer-on-vercel |
| Licence | **NONE — no licence file** |
| Stars | 23 |
| Last activity | 2025-12-07 |
| What it does | Minimal Next.js App Router demo: `/api/screenshot` route, env detection (local `puppeteer` vs Vercel `puppeteer-core` + `@sparticuz/chromium-min`), URL validation, caching. Good pattern reference (documented at https://deepwiki.com/gabenunez/puppeteer-on-vercel/3.2-backend-api-route). |
| Verdict | **DO NOT COPY CODE.** No licence = all rights reserved. Read the pattern, write your own route. |

---

## 2. PageSpeed Insights API integration (mobile + desktop in parallel)

### TOP PICK — No library needed: call the official PSI REST API directly

| | |
|---|---|
| URL | `https://www.googleapis.com/pagespeedonline/v5/runPagespeed` (Google official API, not a GitHub repo) |
| Licence | N/A — Google API, governed by Google's API Terms of Service |
| What it does | `GET ?url=<target>&strategy=mobile|desktop&category=performance&category=accessibility&category=best-practices&category=seo[&key=...]`. Returns Lighthouse lab scores plus CrUX real-world data. |
| Ship or Die verdict | **SAFE — use.** Calling a public Google API is not reusing a product. |

**Implementation notes:**

- Run mobile and desktop in parallel with `Promise.all([fetch(mobile), fetch(desktop)])` in a single Next.js route handler; keep the API key server-side (`GOOGLE_PSI_API_KEY`, never `NEXT_PUBLIC_`).
- Free quota is 25,000 requests/day with an API key (much lower unauthenticated); cache results per URL (e.g. 24 h) so repeat teardowns of the same site do not burn quota.
- Add the same guards the better open-source implementations use: URL validation + SSRF protection (reject localhost/private IPs), per-IP rate limiting, and a timeout (PSI runs can take 30–60 s; Vercel Hobby functions cap at 10 s by default, so set `maxDuration` appropriately or run it as a background step).
- Extract the fields DealNote needs: `lighthouseResult.categories.*.score`, Core Web Vitals audits (`largest-contentful-paint`, `cumulative-layout-shift`, `total-blocking-time`, `first-contentful-paint`, `speed-index`), and `loadingExperience` (CrUX) where present.

### Reference pattern — danielbayerlein/dashboard (PSI widget only)

| | |
|---|---|
| URL | https://github.com/danielbayerlein/dashboard |
| Licence | **MIT** |
| Stars | 1,342 |
| Last activity | 2023-05-03 (stale) |
| What it does | Team dashboard with a PageSpeed Insights score/stats widget (`strategy: desktop|mobile`, polling interval). Only the small PSI widget is relevant; the rest is an unrelated dashboard. |
| Verdict | **SAFE to borrow the pattern, but stale (2023).** The PSI endpoint and params are unchanged, so the pattern still works, but prefer writing the two-line `fetch` call fresh. Do not reuse the dashboard itself. |

### DO NOT REUSE — Nextvital (Skyz03/Next-Vital)

| | |
|---|---|
| URL | https://github.com/Skyz03/Next-Vital |
| Licence | **NONE — no licence file** |
| Stars | 0 |
| Last activity | 2026-09-28 |
| What it does | A **whole competing product**: paste a URL, get a PageSpeed/Lighthouse audit translated into ranked Next.js fixes (38 Lighthouse audit IDs mapped to fixes, Redis caching, rate limiting, session history). |
| Verdict | **DO NOT REUSE — whole competing product AND unlicensed.** This is the closest thing to a DealNote competitor found in this check. Do not copy code, do not fork, do not rebrand. Its *architecture* (validate → SSRF guard → cache → rate limit → PSI → shape response) is a generic pipeline pattern you may implement yourself, but the fix-map content and the product must be your own. |

---

## 3. Homepage screenshot capture

### TOP PICK — Same Puppeteer stack as §1 (no second tool needed)

Screenshot capture is `page.screenshot()` on the same `puppeteer-core` + `@sparticuz/chromium` browser you already launch for the PDF. One browser launch can produce **both** the homepage screenshot and the PDF in the same route handler, which halves cold starts and function invocations.

- **Licence / stars / activity:** as §1 — Apache-2.0 + MIT, 95,912 + 1,669 stars, both active Nov 2026. **SAFE.**
- **Pattern reference:** `gabenunez/puppeteer-on-vercel` (`/api/screenshot`, see §1) — read-only, **do not copy code (no licence)**.
- **Timing gotcha:** do not `sleep(2000)` and hope. Wait for a stable selector or `networkidle`, and for SPAs wait for the async content selector before capturing; take `fullPage: true` only if the report wants the whole page, otherwise a fixed viewport (e.g. 1440×900) for the hero/fold shot.
- **Security:** same SSRF guard as §2 — validate the target URL, reject private/localhost addresses, cap redirects and page size.

### Alternative — hosted screenshot APIs (not recommended for DealNote)

Services such as PageBolt (pagebolt.dev) offer a screenshot API (100 free requests/month). These are **paid third-party SaaS products**, not libraries; using one adds a vendor dependency, a per-request cost, and sends your customers' target URLs to a third party. The in-house Puppeteer route is cheaper, private, and already paid for by §1. **Verdict: skip.**

---

## 4. Server paywall — Stripe / Polar webhook entitlement, full PDF withheld until payment

### TOP PICK (either) — official SDKs only; the entitlement logic is ~100 lines of your own code

| | Stripe (`stripe` / stripe-node) | Polar (`@polar-sh/sdk` + `@polar-sh/nextjs`) |
|---|---|---|
| Repo URL | https://github.com/stripe/stripe-node | https://github.com/polarsource/polar |
| Licence | **MIT** | Server: **Apache-2.0**; JS SDKs: **MIT** (`@polar-sh/sdk` 1.3.3, MIT, verified via npm) |
| Stars | **4,580** | **10,521** |
| Last activity | 2026-11-26 | 2026-11-26 |
| What it does | Official Stripe Node SDK. Create a one-time Checkout Session, verify webhooks with `stripe.webhooks.constructEvent(rawBody, signature, secret)`. | Polar is a merchant-of-record billing platform (handles VAT/tax, runs on Stripe underneath). `@polar-sh/nextjs` exports `Checkout`, `CustomerPortal`, `Webhooks` route-handler helpers; `validateEvent` verifies webhook signatures. |
| Ship or Die verdict | **SAFE — use.** | **SAFE — use.** |

**Which to pick for DealNote:** Stripe if you want the lowest fees (2.9% + 30¢) and full control; Polar if you want merchant-of-record tax handling with zero tax setup (fees ~4–5% + 40–50¢). DealNote is a **one-time PDF purchase**, not a subscription — so use **payment-mode** Checkout (`checkout.session.completed` + `charge.refunded`/`charge.dispute.created` to revoke), not subscription events. Both providers fit; pick one, not both.

**Entitlement pattern (provider-agnostic, implement yourself — this is the security-critical part):**

1. Create a `teardowns` row server-side with status `unpaid` and an unguessable token (SHA-256 hash stored, raw token returned once).
2. Create the Checkout Session server-side with `metadata: { teardownId }` (the client sends a plan/teardown key, never a price, amount, or user id).
3. **The webhook is the only writer of paid access.** `checkout.session.completed` / Polar `order.paid` → set status `paid`. Never grant from the success-page redirect or a query string — anyone can visit `/success`.
4. Webhook handler: read the **raw** body (`await req.text()` in App Router), verify the signature (`constructEvent` / `validateEvent`), dedupe on `event.id` (idempotency — Stripe/Polar retry deliveries), then update the DB.
5. The PDF route handler checks the DB entitlement server-side and returns **402** when unpaid. The full PDF bytes must never be generated or shipped before payment; the free preview is a separate redacted render.
6. Revoke on `customer.subscription.deleted` (subscriptions only), `charge.refunded`, `charge.dispute.created`, Polar `refund.created`/`refund.updated`.

**Reference checklist (safe to read, MIT):** PayWallKit/paywall-check — https://github.com/PayWallKit/paywall-check — **MIT, 0 stars, last push 2026-11-02**. A 60-second smoke test plus the rules above (unsigned webhook rejected, success page grants nothing, no secret keys in the client bundle). Small utility, **safe to use as a QA checklist**. Its paid $14.98 full kit is optional and not needed.

**Official docs (primary source, no repo needed):** Stripe webhook signatures / Checkout, Polar docs at https://docs.polar.sh. The Stripe sample repo `stripe-samples/nextjs-subscription-payments` returned **404** on 2026-11-27 (removed/renamed) — do not chase it; the docs plus the `stripe-node` SDK are sufficient.

### DO NOT REUSE — whole paywall products found in this check

| Repo | Why not |
|---|---|
| `JoshuaHfm/paywall` (Next.js + Supabase + Stripe paywall app; licence not verified, DEPLOY.md reviewed) | A **whole competing paywall product**. Do not fork or rebrand. Its deploy checklist (webhook URL must be `…/api/webhook`, live keys, one real $1 test purchase) is generic operational advice, not code to copy. |
| `loopstudioapp/gossipcheck` (Next.js 16 paywalled report product: scan → redact until paid → Stripe Checkout → entitlement polling) | A **whole competing product** whose flow (redact-until-paid, entitlement polling) is uncomfortably close to DealNote's. Do not copy. The generic pattern (server-side redaction + webhook-only grant) is already covered by the pattern in this section; implement it yourself. |

---

## 5. Server-stored brand profiles (replacing localStorage-only)

No new library is strictly required: a brand profile is a small JSON row (`userId | teardownId`, `name`, `logoUrl`, `colors`, `fonts`, `tone`, `createdAt`). The choice is **where to store it**. Both options below are infrastructure libraries, not products, and are safe.

### TOP PICK — Supabase (Postgres + Auth + Storage)

| | |
|---|---|
| URL | https://github.com/supabase/supabase |
| Licence | **Apache-2.0** |
| Stars | **115,561** |
| Last activity | 2026-11-27 (active) |
| What it does | Hosted Postgres with a JS client (`@supabase/supabase-js`), Row Level Security, Auth, and Storage buckets (for uploaded logos). Free tier covers launch volume. |
| Ship or Die verdict | **SAFE — use.** |

**Why it fits DealNote:** one `brand_profiles` table (RLS: a user reads/writes only their own rows) plus one Storage bucket for logos covers this piece and also gives you the `teardowns` + `entitlements` tables §4 needs — one backend for both pieces. Keep the service-role key server-only; the browser uses the anon key with RLS, never the service key.

### Alternative — Vercel-native storage

| | |
|---|---|
| URL | https://github.com/vercel/storage (Vercel Blob + Edge Config) |
| Licence | **Apache-2.0** |
| Stars | 599 |
| Last activity | 2026-11-09 |
| What it does | Vercel Blob (file/object storage, good for logos and for storing generated PDFs) and Edge Config (small read-heavy config). Pair with Vercel Postgres (Neon-backed) for the relational rows. |
| Ship or Die verdict | **SAFE — use.** Stays entirely inside the Vercel account you already deploy to; no second vendor. |

**Recommendation:** Supabase if you want Auth + Postgres + Storage in one place (and it doubles as the entitlement store for §4); Vercel Blob + Vercel Postgres if you prefer zero new vendors. Either way, the migration itself is your own code: on first save, POST the localStorage profile to `/api/brand-profiles`, store server-side, then delete the local copy; keep localStorage only as an offline draft cache, never as the source of truth.

---

## Licence flags — none blocking

No AGPL, PolyForm Noncommercial, or other commercial-use-forbidding licence was found among the recommended libraries. All top picks are **MIT or Apache-2.0**, both of which permit commercial use (keep the licence notice/attribution where the licence requires it).

Two **unlicensed** repos were found and must not be copied from (all rights reserved by default):

- `gabenunez/puppeteer-on-vercel` (no licence, 23 stars) — pattern reference only.
- `Skyz03/Next-Vital` (no licence, 0 stars) — whole competing product, do not touch.

One **name-collision trap**: the commercial "React PDF" product at react-pdf.dev (paid EULA, watermarked evaluation) is **not** the MIT `diegomura/react-pdf` renderer. Use only the latter.

---

## Summary table — top safe reuse per missing piece

| # | Missing piece | Top safe reuse | Licence | Stars | Last activity |
|---|---|---|---|---|---|
| 1 | Puppeteer PDF on Vercel | `puppeteer-core` + `@sparticuz/chromium` (pinned pair, e.g. 25.11.0 + 153.0.0) | Apache-2.0 + MIT | 95,912 / 1,669 | 2026-11-26 / 2026-11-24 |
| 1 | PDF fallback | `@react-pdf/renderer` (`diegomura/react-pdf`) | MIT | 16,864 | 2026-11-27 |
| 2 | PageSpeed Insights (mobile + desktop) | Official PSI REST API, direct `fetch`, `Promise.all` — no library | Google API ToS | N/A | N/A |
| 3 | Homepage screenshot | Same Puppeteer stack as #1 (`page.screenshot()`) | Apache-2.0 + MIT | as #1 | as #1 |
| 4 | Server paywall + webhook entitlement | `stripe` SDK **or** `@polar-sh/sdk` + `@polar-sh/nextjs` (pick one); entitlement logic is your own code; QA checklist: PayWallKit/paywall-check | MIT / MIT (+ Polar server Apache-2.0) | 4,580 / 10,521 (0 for the checklist) | 2026-11-26 / 2026-11-26 |
| 5 | Server-stored brand profiles | Supabase (Postgres + RLS + Storage) **or** Vercel Blob + Vercel Postgres | Apache-2.0 / Apache-2.0 | 115,561 / 599 | 2026-11-27 / 2026-11-09 |

## Do-not-reuse list (whole competing products)

- **Nextvital** (`Skyz03/Next-Vital`) — competing audit product, also unlicensed.
- **JoshuaHfm/paywall** — whole paywall product.
- **loopstudioapp/gossipcheck** — whole paywalled-report product with redact-until-paid flow.
- **chrome-aws-lambda** — not a competitor, but stale since 2024-09; superseded by `@sparticuz/chromium`.

## Notes / gaps

- The Rust port (`lib/analyze.ts` + `rust/analyze-page-rs/`) and the `rust-anything` skill were **not** re-audited, per brief.
- `prisma/prisma` could not be verified via the GitHub API at check time (301 redirect on the repo path); it was not needed for the recommendation — Supabase/Vercel Postgres cover piece 5 without an ORM decision.
- `stripe-samples/nextjs-subscription-payments` returned 404 on 2026-11-27 (removed/renamed); Stripe's official docs are the reference instead.
- No code was copied into this report; all reuse recommendations are libraries/APIs to install and call, plus patterns to reimplement in the brand-new DealNote repo.
