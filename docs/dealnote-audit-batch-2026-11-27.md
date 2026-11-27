# DealNote Audit Batch — 2026-11-27

**Product:** DealNote, white-label website teardown + proposal generator, $49 one-time.
**Live:** https://dealnote-blue.vercel.app — **Repo:** https://github.com/Velu2k03/dealnote
**Branch:** `dealnote-audit-batch` (report only, nothing merged to main, nothing deployed, nothing bought).
**Mode:** NoSite-style batch replicated for DealNote: design skills, AI slop check, legal research, demand/Reddit research, payment/subdomain/TrustMRR research, GitHub reuse check, tracker sheet + docs, README cleanup check.
**Standing:** General information only, not legal advice, no lawyer contacted. Rust fallback left as it is, Vercel build not changed.

## Verdict: SHIP WITH FIXES

DealNote is in a much stronger position than NoSite was at the same stage. The audit engine is real, the data model is lawful by design (direct page fetch only, no Maps/Places, no stored lists, no personal data), and the site is genuinely clean where slop usually lives (zero gradients, zero em dashes, zero emoji, zero hype words, zero fake social proof). It is NOT launchable on Dec 1 as it stands, because the seller-side plumbing is missing: a buyer cannot contact the seller, cannot claim the advertised 14-day refund, there is no Privacy Policy, and there is no payment at all. Those are fixable in days, not a rebuild. Do NOT launch with payment until the P0 list is closed.

## Launch readiness by area (0-10)

| Area | Score | Why |
|---|---|---|
| Design and visual polish | 7.5 | Clean, deliberate teal #0F766E, Lucide only, hero is real product UI. Deductions: Inter named but never loaded, uppercase eyebrows everywhere, all headings 700, equal card grids |
| UX and interactive flows | 6.5 | Audit tool works live, example.com returns 45/100 F with 10 findings, invalid/localhost rejected. Deductions: no screenshot capture, no transitions, no report flow |
| Product completeness | 5.0 | Core audit + white-label preview + proposal generator exist. Missing: paid PDF, PageSpeed Insights API key, screenshots, server-stored brand profiles |
| Data and verification | 7.0 | Real fetch + parse, scores are lab measurements, no invented figures, sample clearly marked SAMPLE with fictional data. Deductions: robots.txt read but not honoured, no rate limiting, SSRF redirect not re-validated |
| Legal and compliance | 3.0 | Good by design, bad by omission: no Privacy Policy, no contact email, refund promise unclaimable, $39 "cheapest" unsubstantiated |
| Pricing and economics | 6.0 | $49 once is defensible against $39-$299/mo white-label subscriptions. Deduction: pricing card lists PDF downloads that are not built yet |
| Monetization and checkout | 1.0 | Payment coming soon, no checkout, no webhook, no entitlement, no test purchase |
| Distribution and GTM | 2.5 | No tracker, no email capture, no waitlist, no launch posts, no proof asset beyond the sample report |
| Trust and credibility | 3.0 | Honest copy, no Verified claims, no guarantee of client wins. Deductions: no contact, no Privacy Policy, no refund channel, Vercel subdomain only |

## Top 5 findings

1. **Refund promise is unclaimable (LEGAL P0).** 14-day replace-or-refund is advertised on the landing page and in Terms, but there is no contact email, support address, form, or refund flow anywhere on the site (repo-wide grep). A refund promise with no channel to claim it is the single most likely source of a chargeback or FTC Act §5 deception complaint once payment goes live. Fix: publish a contact email in footer, /terms, FAQ, and User-Agent, add a mailto refund route, start a refund log.
2. **No Privacy Policy at all (LEGAL P0).** Vercel server logs (IPs, audited URLs) and buyer brand data exist with zero notice. Fix: publish /privacy before Dec 1, naming Vercel logs, localStorage, and the Ship or Die tracker once added.
3. **Stripe is not available to a Philippines-based seller (PAYMENT).** PLAN.md's "Stripe Checkout + webhooks" plan is not executable as written. Recommended: Polar.sh Starter, $0/month, net $46.05 per $49 US sale (5% + $0.50), $45.32 non-US, merchant of record, licence keys and file downloads built in, Philippines explicitly on its payout-countries list via Stripe Connect Express, TrustMRR-supported. Lemon Squeezy existing store is a bridge only: new sign-ups closed Nov 16 2026, processing stops Mar 31 2027, its official exit (Stripe Managed Payments) accepts only 37 countries, PH/India not included, and delivers no files/keys. Do not build on Lemon Squeezy.
4. **Inter is declared but never loaded (SLOP HIGH).** `app/globals.css:24` names Inter first, but there is no next/font import, no font link, no font file, so the site renders in system-ui while detectors flag it as Inter. Fix: load Inter properly via next/font/google or self-hosted woff2, or replace it with a genuinely chosen non-default face. Do not leave a named-but-unloaded font in the stack.
5. **Demand is real but narrow (DEMAND).** The pitch job is real: freelancers pitch local businesses weekly, 58% of small businesses plan a redesign in the next 12 months (Clutch 2025), average mobile Performance 58/100 across 131,514 businesses (RapidWebLaunch census, updated 21 Nov 2026). But no primary evidence was found that freelancers will pay $49 for this, no interview, survey, or Reddit "I wish there was a tool" thread. The strongest $49 argument: white label + proposal currently costs $468-$3,588/year, $49 once is 1.26 months of SEOptimer White Label and 0.61 months of AuditPilot Agency Pro. The strongest argument against: a freelancer can do the core job free in 10 minutes with PSI + DevTools, and the highest-converting pitch is a mockup, not an audit.

## P0 blockers before Dec 1

- **P0-1** Publish a contact email (footer, /terms, FAQ, User-Agent) and test it.
- **P0-2** Create the refund-request channel (minimum: mailto with pre-filled subject + instructions) and wire Terms to it; start a refund log. Do not take payment until P0-1 and P0-2 exist.
- **P0-3** Publish /privacy (contents in the legal report §10.6; verify Vercel log retention/region first).
- **P0-4** Fix the $39/mo line: name + date the comparator, or drop "cheapest" and use "Example only — compare current prices before you buy".
- **P0-5** Fix the pricing-card bullet to "Teardown PDF and proposal PDF (coming with payment)" until paid PDF is built.
- **P0-6** Add the CAN-SPAM footer block + 60-second sending checklist to /templates (covering email has no postal address, ad identification, or opt-out; a buyer copying it verbatim violates CAN-SPAM, $53,088/email).
- **P0-7** Wire live checkout via Polar.sh, complete Philippines Stripe Connect Express payout onboarding, connect TrustMRR after first sale. Test purchase end-to-end, then refund it.
- **P0-8** Build the server paywall: drop the free full result, teaser only (overall grade + top 3 findings) until the server confirms payment, full report JSON + PDF withheld, 30-audit/month fair-use enforced server-side. Note: in v1 the audit result is shown free; that must change before launch or the paywall is cosmetic.
- **P0-9** Install the Ship or Die traffic tracker snippet copied EXACTLY from the Ship or Die dashboard into <head> on every page BEFORE any traffic and BEFORE first payment. Do not invent the snippet. Public script URL confirmed: https://www.ship-or-die.com/hackathon/verify.js.
- **P0-10** Fix the slop HIGHs: load or drop Inter, delete repeating uppercase eyebrows, drop heading weights from 700.

## P1 list

- robots.txt: parse and honour Disallow rules (engine currently reads robots.txt only to record whether it exists).
- Rate limiting on /api/audit; re-validate the URL after redirects (SSRF: redirect-to-private-IP not re-validated).
- Add a governing-law + liability-limitation clause to Terms (lawyer, before payment goes live).
- PageSpeed Insights API key (restricted to PSI API) so speed scores are real Lighthouse scores, not load-time/page-size proxy.
- Puppeteer PDF on Vercel: puppeteer-core + @sparticuz/chromium pinned pair (e.g. 25.11.0 + 153.0.0, Node 22.17+, ~1.5 GB function memory), React-PDF as fallback. Homepage screenshot from the same Puppeteer stack.
- Custom domain when the payment step starts: Vercel Settings → Domains → Add subdomain.resonantatlas.com, exact CNAME Vercel shows; Cloudflare DNS CNAME, proxy OFF (DNS only); do not touch apex, nameservers, or MX. No domain bought, no decision recorded.
- Server-stored brand profiles: Supabase (Postgres + RLS + Storage) or Vercel Blob + Vercel Postgres.
- "Request your city/niche" capture form and email capture for non-buyers (free 25-lead-style proof does not apply here; use one free teaser audit + sample report).
- SEO meta, OG images, sitemap.xml, robots.txt, JSON-LD.
- 60-second live verification proof video on the homepage.

## P2 list

- "Lifetime" qualifier: keep it next to the word lifetime on the landing page, not only in Terms.
- Texas TDPSA tripwire: no numeric threshold, shelter is only the SBA small-business exclusion; any future stored prospect data flips the analysis.
- Do not add any third-party script (analytics, chat, session replay) without a privacy review; DealNote is currently outside the CIPA demand-letter wave precisely because it ships no third-party scripts.
- Next.js 14.2.18 security patch bump (pre-existing v1 item).
- Vercel Rust binary: Vercel runs the TypeScript fallback, not the Rust binary (glibc 2.34 needed vs Vercel AL2 2.26). Getting the Rust speedup in production needs a Vercel build step running cargo. Velu's decision, fallback stays for now.

## Fix order

1. Contact email + refund channel + refund log (P0-1, P0-2, half a day)
2. /privacy page (P0-3, half a day)
3. Copy fixes: $39 line, PDF bullet, CAN-SPAM template footer (P0-4, P0-5, P0-6, 1 hour)
4. Slop HIGHs: font, eyebrows, weights (P0-10, 2 hours)
5. Polar.sh onboarding + $49 product + test purchase (P0-7, 3-4 hours)
6. Server paywall + PDF generation (P0-8, 1-2 days, hardest remaining build)
7. Ship or Die tracker + TrustMRR + My Startup (P0-9, 30 minutes, before any traffic)
8. P1 items, then launch Dec 1 with the sales test below

## What Neon still needs to check (Task audit on the live site)

- Live audit of https://dealnote-blue.vercel.app: launch readiness score, live defects with screenshots, pricing and economics, trust and credibility, legal and compliance, data and verification, monetization and checkout, distribution and GTM. Neon Task mode, default Neon model, new Task, signed in as velu2k03@gmail.com.
- Confirm or correct: the Polar.sh recommendation, the TrustMRR verification (trustmrr.com checked directly Nov 27: live, "TrustMRR - Buy and Sell SaaS Startups", Top 100 table, Ship or Die profile page says "Revenue is verified with Stripe API key. Last updated: Oct 25, 2026"; operator and full provider list could NOT be verified from trustmrr.com itself), and the $49 price against the live market.
- Ask Neon for a day-by-day Nov 28-Dec 1 fix plan and a base-case revenue estimate for Dec 1-16.

## What Claude still needs to check (miss-check via agy Opus high, after all batches)

- "Am I missing anything / did we miss anything, and how to improve that?" on the full batch: slop, legal, demand, payment, GitHub reuse, Rust port, tracker sheet. Claude Code always Opus high, never Sonnet, via Antigravity CLI agy. Implement notes ONLY after ALL batches are finished, never interleaved, never during them (Velu, 2026-11-14).
- Specific asks: the robots.txt and SSRF gaps, the paywall architecture, the Polar vs Lemon Squeezy call, the $49 price, and the sales test plan.

## Sales test plan (3 sample teardown reports, before full payment wiring)

- Make 3 sample teardown reports on fictional businesses (different niches: one trades, one auto repair, one salon), using the live /audit tool, each clearly marked SAMPLE with fictional data only.
- Post one as a free teaser: a real teardown, not a pitch for the tool. Where: r/SideProject main feed (show real product), r/webdev only as a technical Showoff Saturday post, never a product pitch, Indie Hackers, X/Twitter build-in-public, Facebook freelancer groups. Do NOT post to r/freelance (self-promotion banned outright, permanent ban) or r/Entrepreneur / r/smallbusiness outside their weekly promo threads. Re-check live subreddit rules before posting.
- What counts as a yes: freelancers ask for the tool, ask for a teardown of their prospect, or ask for the price. If no one asks after the teaser + 2 follow-ups, do not build payment yet; switch to the next distribution channel or reconsider the price.
- Daily distribution after launch Dec 1: one new post/day, reply to every comment, DM engaged freelancers, one new sample teardown per day.
- Nothing is sent externally without Velu's explicit APPROVED.

## Design skills used (step 1)

- Installed and checked: ui-ux-pro-max (v2.15.0, 80 styles, 194 palettes, 74 font pairings, 130 UX guidelines, 105 icons, 17 GSAP presets), frontend-design, design-taste-frontend (tasteskill 2.5.1), unslop (9 passes), web-design-guidelines (Vercel, v1.0.0), canvas-design, extract-design, theme-factory, brand-guidelines, impeccable (v4.9.2), logo-design, image-prompt-design, image-qc, modern-web-guidance (installed 2026_11_09, latest 2026_11_16, skill should be updated), prompt-engineering.
- Actually used on DealNote: ui-ux-pro-max pro-rules, unslop signs.md, impeccable rubric (degraded single-context, no dual-agent run), logo-design (flat 2-colour SVG, audit 98/100), design-notes.md system (deep teal #0F766E, Inter, Lucide 18px/1.5).
- Deliberately not used: canvas-design, extract-design, theme-factory, brand-guidelines (no posters/art/brand system in v1), GSAP/transitions (motion is press-scale only, and the slop check found zero transitions, which is itself a finding), yt-thumbnail-design (no video), image generation (hero is real product UI built in code, no hero photo generated yet).
- No new skill installs in this batch. rust-anything skill was installed in the previous step (SkillSpector SAFE, score 7, LOW, Nov 27).

## AI slop check summary

- Full report: docs/dealnote-slop-check-2026-11-27.md. HIGH 3, MEDIUM 7, LOW 8, 18 findings, 24 verified-clean checks.
- HIGH: Inter declared but never loaded (app/globals.css:24); uppercase tracked eyebrow above nearly every heading (6 uses, .eyebrow); all headings weight 700 (h3 650).
- MEDIUM: three equal feature cards + three equal tier cards + two equal cards; numbered steps 1/2/3 as card titles; CTA arrows on two buttons; middle-dot meta strings (6 lines); zero transitions; "Payment coming soon" repeated 4x; SAMPLE stamp repeated 7x on /sample.
- Clean with evidence: gradients 0, em dashes 0, emoji 0, hype words 0, Get Started/Learn More 0, Trusted by/testimonials/avatar dots 0, purple/blue/indigo/Sortes tokens 0, pill shapes 0, animate-pulse/ping/transition-all/hover:scale 0, exclamation marks in copy 0. All 20 icon usages Lucide 18px/1.5. Logo flat 2-colour SVG. Contrast passes AA (teal 5.47:1, slate-600 7.58:1).
- Replicated detector scores (rules read as text, URL never submitted): Briskly ~29/100, Jev-style ~5-6 of 34 tells, est. 15-25/100. Impeccable single-context: Nielsen total 31/40 (Good). Note: three HIGHs conflict with docs/design-notes.md, which mandates Inter, 700 weights, and eyebrows. The fix order treats this as a brief-vs-detector decision.

## Legal research summary

- Full report: docs/dealnote-legal-research-2026-11-27.md (520 lines), copy-ready label texts L1-L9, Terms clauses T1-T6, per-page placement map, 7 open questions for a lawyer.
- Data-broker verdict: NO, DealNote is not a data broker in v1, no sale to third parties, no prospect personal information collected, no stored lists. DROP (live 1 Jan 2026, broker retrieval from 1 Aug 2026) does not apply unless the model changes; tripwires listed.
- State privacy: likely below all thresholds today (CCPA/CPRA $26.6M / 100k consumers / 50% revenue; most states 100k consumers). Texas TDPSA is the closest call: no numeric threshold, shelter only the SBA small-business exclusion, §541.107 (no sale of sensitive data without consent) survives it.
- COPPA: no exposure in v1 (B2B, not child-directed, collects no personal information from anyone).
- CIPA: currently outside the demand-letter wave because it ships no third-party scripts; keep it that way until the tracker is reviewed.
- FTC: FCC one-to-one TCPA consent rule was vacated 24 Jan 2025 (Insurance Marketing Coalition v. FCC); several 2025-26 guides still wrongly describe it as live. DealNote is likely outside the FTC Business Opportunity Rule (16 CFR 437) but that needs a lawyer's confirm before any income-adjacent copy is added.
- Code gaps, not just copy: engine fetches /robots.txt only to record whether it exists, never parses or honours Disallow rules; no rate limiting; redirect-to-private-IP not re-validated.

## Demand research summary

- Full report: docs/dealnote-demand-research-2026-11-27.md.
- Competitor prices re-verified 27 Nov 2026: SEOptimer White Label $39/mo ($468/yr); PitchProof Professional $39.99/mo (white label from there, Starter $19.99/mo branded); AuditPilot Agency Pro $79.99/mo; VibeAudit Agency $299/mo; WooRank Premium $199.99/mo; Ubersuggest Individual $29/mo / $290 lifetime (no white label); GTmetrix PRO from $5.99/mo (no white label); PSI/Lighthouse free; Roast My Web $12/$50/$299 one-time credit packs ($0.75/$0.50/$0.30 per audit, no proposal builder); Pitchgen $29-$99/mo.
- Ranked niches: 1) trades (plumbers/HVAC/electricians/roofers), 2) auto repair (44% no website), 3) salons (62.6% have a website, lowest adoption), 4) home services, 5) dental/med-spa (high ticket, harder first niche). Do NOT target restaurants/cafés, no-website businesses, franchises, SaaS, or SEO agencies.

## Payment research summary

- Full report: docs/dealnote-payment-research-2026-11-27.md.
- Recommended: Polar.sh Starter, net $46.05 per $49 US sale, $45.32 non-US. Others: Dodo $46.64 US / $45.91 intl (backup only, Trustpilot ~3.1, account holds); Creem $46.69 flat (best net, Philippines acceptance unverified); Paddle $46.05 (credible second choice, $100 payout minimum, stricter approval, no built-in keys/files). Stripe direct unavailable to a Philippines-based seller; hypothetical net $47.28, not available.
- TrustMRR checked directly Nov 27: trustmrr.com is live, "TrustMRR - Buy and Sell SaaS Startups", Top 100 table, Ship or Die profile page says "Revenue is verified with Stripe API key. Last updated: Oct 25, 2026". Could NOT verify from trustmrr.com itself: who operates it, and the supported-provider list (no FAQ page reachable from the pages fetched). Secondary sources agree on Stripe, Lemon Squeezy, Polar, Paddle, Dodo, RevenueCat, Superwall, App Store, Creem, Whop, Shopify (+ Razorpay as 13th). Verification works via a read-only provider API key; TrustMRR reads aggregates only, no customer PII.
- Ship or Die rules page returned HTTP 403 to browser.open, so contest facts rest on the vibecodinglist rules summary (checked against official sources Nov 20, 2026) and must be re-checked in a live browser.

## GitHub reuse summary

- Full report: docs/dealnote-github-reuse-2026-11-27.md.
- Puppeteer PDF: puppeteer-core + @sparticuz/chromium, Apache-2.0 + MIT, 95,912 / 1,669 stars. Fallback: @react-pdf/renderer, MIT, 16,864 stars. Do not confuse with commercial "React PDF" at react-pdf.dev (paid EULA, watermarked).
- PageSpeed Insights: official PSI REST API directly, Promise.all mobile + desktop, key server-side, no library needed.
- Screenshot: same Puppeteer stack, page.screenshot(), one launch can do screenshot + PDF.
- Paywall: stripe SDK or @polar-sh/sdk + @polar-sh/nextjs (pick one, one-time payment mode), webhook is the only writer of entitlements. MIT, 4,580 / 10,521 stars.
- Brand profiles: Supabase (Postgres + RLS + Storage), Apache-2.0, 115,561 stars, or Vercel Blob + Vercel Postgres.
- Do NOT reuse: Nextvital (PSI audit product, also unlicensed), JoshuaHfm/paywall, loopstudioapp/gossipcheck (redact-until-paid report flow, close to DealNote). Do NOT copy code from gabenunez/puppeteer-on-vercel (no licence, pattern reference only). Avoid chrome-aws-lambda (stale since 2024-09).

## README cleanup check

- README.md is clean: no internal emails, no Neon/Claude mentions, no contest strategy, no pricing rationale, no standing rules. It does admit sample data is fictional (Harbor & Pine Plumbing, 555 phone), which is honest disclosure, not a leak. No fix needed.
- PLAN.md §15 still lists items that are now done (sample report written, site deployed) and items still open (payment, tracker, TrustMRR, domain, PSI key, PDF on Vercel, legal review, trademark/domain check). PLAN.md should be updated to the current status before launch, not as part of this report-only batch.

## Tracker sheet

- https://docs.google.com/spreadsheets/d/1ozzeyu22c7yK7-YXivY9zXXhq40Wrds_QTi2EYIoF0M/edit
- spreadsheetId 1ozzeyu22c7yK7-YXivY9zXXhq40Wrds_QTi2EYIoF0M, tabs Status, Packs, Tasks, Decisions, Sales. Verified by read-back.
- Note: a duplicate empty sheet was created by a failed first create call (ID not captured, empty) and was trashed via Drive; only one DealNote tracker remains.

## Files in this batch

- docs/dealnote-slop-check-2026-11-27.md
- docs/dealnote-legal-research-2026-11-27.md
- docs/dealnote-demand-research-2026-11-27.md
- docs/dealnote-payment-research-2026-11-27.md
- docs/dealnote-github-reuse-2026-11-27.md
- docs/dealnote-audit-batch-2026-11-27.md (this file)
- docs/TRACKER.md

## Still missing (parent to do)

- Neon Task audit on the live site (parent, browser task).
- Claude miss-check via agy Opus high, after all batches (parent).
- Fixes: none applied in this batch, report only. P0 list above is the fix order.
- Sales test: 3 sample teardown reports + free teaser, needs Velu's APPROVED before anything is posted externally.
- Payment, tracker install, TrustMRR, My Startup, launch Dec 1.
