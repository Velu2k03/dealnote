# DealNote — Legal Research Report

**Date:** 27 November 2026
**Product:** DealNote — white-label website teardown report + ready-to-send proposal for web design freelancers and small agencies
**Live site:** https://dealnote-blue.vercel.app (fetched 27 Nov 2026)
**Repo:** `~/workspace/ship-or-die-100k/teardown-generator`, branch `dealnote-audit-batch`
**Status of this document:** GENERAL INFORMATION ONLY. NOT legal advice. No lawyer was contacted. No file was changed, nothing was deployed, nothing was sent externally. This report only.

## 0. Facts verified from the live site and the repo (do not invent beyond these)

| Fact | Source |
|---|---|
| Price $49 one-time, no subscription, no per-report fee, 30 audits/month fair-use limit, payment coming soon, no payment account connected | Live landing page; `app/page.tsx`; `README.md` |
| Audit = direct server-side fetch of the public homepage the buyer pastes, cheerio parse; homepage only in v1; first 10 unique internal links checked (HEAD then GET) | `app/api/audit/route.ts`; `lib/analyze.ts`; `README.md` |
| No Google Maps/Places data, no traffic or ranking estimates, no invented dollar-loss figures, no cold SMS, email-only proposal templates | Live landing "What DealNote checks, and what it does not"; `README.md` |
| Scores are DealNote's own model, weights Speed 20 / Mobile 15 / On-page SEO 20 / Technical 15 / Conversion 15 / Trust-local-social 15, grades A–F; speed scored from measured load time + page size, NOT a Lighthouse/PageSpeed score (no PageSpeed API key wired) | `lib/audit.ts`; `lib/analyze.ts`; `README.md` |
| Sample report is fictional Harbor & Pine Plumbing, marked SAMPLE throughout (`.example` domain, 555 phone) | Live site; `lib/audit.ts` `SAMPLE_BUSINESS`; `app/sample/page.tsx` |
| No account, no email capture in v1. Brand profile + outreach tracker stored in buyer localStorage only (`dealnote-brand-v1`, `dealnote-proposals-v1`) | `app/audit/page.tsx`; `README.md` |
| No analytics, tracking pixel, or third-party script in the repo (`package.json` deps: cheerio, lucide-react, next, react only). No TrustMRR, no Ship or Die tracker snippet — TODO comment only, snippet not invented | `package.json`; repo grep 27 Nov 2026 |
| Terms page exists (`/terms`, "Last updated: 27 Nov 2026"), incl. refund clause (bad report within 14 days, replace or refund) | `app/terms/page.tsx` |
| **No Privacy Policy page exists. No contact email, support address, or contact form exists anywhere on the site** (repo grep 27 Nov 2026: no `support@`, no mailto link in footer/header). No refund-request flow exists on the site | Repo grep + live site fetch 27 Nov 2026 |
| Server fetch User-Agent: `DealNote/1.0 (website teardown; contact via site owner)`; 10 s homepage timeout, 5 s per link check; private/loopback hosts blocked in `isValidAuditUrl` | `app/api/audit/route.ts`; `lib/audit.ts` |
| **The engine does NOT parse or honour robots.txt Disallow rules.** It fetches `/robots.txt` only to record whether the file exists (`hasRobots` boolean) and then fetches the homepage regardless | `app/api/audit/route.ts` lines 86–95 |

## Executive summary

DealNote's current design is deliberately low-risk in the places that usually get audit tools in trouble: public-homepage-only fetching, no Google data, no invented figures, no cold SMS, no stored prospect lists, no accounts. The live copy already carries most of the right disclaimers. The risk is not the audit engine; it is the **missing seller-side plumbing**: there is no way for a buyer to contact the seller, no way to claim the advertised 14-day replace-or-refund promise, and no Privacy Policy at all. A refund promise with no channel to claim it is the single most likely source of a chargeback, an FTC Act §5 deception complaint, or a Ship or Die leaderboard dispute once payment goes live. That is P0 #1 and it is fixable in an afternoon (publish a contact email + a refund-request form, and wire the Terms clause to it).

The second structural gap is robots.txt: the engine *reads* robots.txt but does not *obey* it. That is lawful in the narrow sense (RFC 9309 says robots rules "are not a form of access authorization"), but it weakens every good-faith argument if a site owner complains, and it is a one-function fix.

Everything else is P1/P2 hardening: substantiate or soften the "$39/mo cheapest" comparison, add a Privacy Policy + cookie/localStorage disclosure, keep the Ship or Die tracker and any future analytics off the site (or behind consent) until reviewed, and re-check thresholds if the business ever stores prospect data.

## Risk ranking (highest first)

| Rank | Risk | Why it matters | Fix tier |
|---|---|---|---|
| 1 | **Refund promise is unclaimable** — 14-day replace-or-refund advertised on landing + Terms, but no contact email, form, or address anywhere on the site | Deceptive-practice exposure under FTC Act §5; chargebacks once Stripe is live; the promise is the buyer's only remedy and it cannot be exercised | **P0** |
| 2 | **No Privacy Policy** — site collects/uses data (Vercel server logs incl. IPs of audited URLs and visitors; buyer brand profile with name/email/phone) with no notice at all | Every state privacy law that does apply, plus GDPR/UK GDPR if any EU/UK visitor, expects a notice; also blocks Stripe/TrustMRR onboarding later | **P0** |
| 3 | **"$39/mo cheapest white-label audit subscription" is unsubstantiated** — no named competitor, no date, no source on the page | FTC Act §5: comparative price claims need a reasonable basis; "cheapest" is a superlative that must be provable | **P0** |
| 4 | **robots.txt Disallow ignored** — engine fetches regardless of Disallow | Weakens good-faith position in any access/contract dispute; trivially fixable; also the "we check robots.txt" copy implies compliance | **P1** |
| 5 | **No rate limiting / abuse controls on `/api/audit`**; redirect-to-private-IP (SSRF) not re-validated after redirect | Open endpoint can be used to probe third-party sites at volume or (via redirect) internal addresses; reputational + host-abuse risk | **P1** |
| 6 | **Future trackers (Ship or Die snippet, TrustMRR, any analytics)** added without review | Third-party scripts that send visitor data are the exact fact pattern behind the 2025–26 CIPA demand-letter wave ($5,000/violation, Cal. Civ. Code §637.2) | **P1** (do not add before Dec 1 without the P0 privacy notice naming them) |
| 7 | **Buyer outreach liability is shifted but the template is the risk vector** — buyers will cold-email using the template; CAN-SPAM is opt-out but CASL/Spam Act/PECR are opt-in | DealNote is not the sender, but a template missing the mandatory footer elements (postal address, opt-out, ad identification) invites buyer violations and blame | **P1** |
| 8 | **"Lifetime" means "lifetime of the product"** — defined in Terms, but only in Terms; landing FAQ says "as stated in the terms" | Fine as drafted, but any ad/landing copy that says "lifetime" without the qualifier risks a §5 reading | **P2** |
| 9 | **State privacy thresholds will be crossed silently if the model ever changes** (esp. Texas TDPSA — no numeric threshold, SBA-small-business test only) | Today's "below threshold" conclusion depends entirely on *not* storing prospect data; one feature (stored lead lists, accounts) flips it | **P2** (tripwire, not a fix) |
| 10 | **COPPA / children's data** — negligible today | Site is B2B, not directed to children, collects no PI from anyone; only becomes live if accounts/age-gated features are added | **P2** (no action) |

---

## 1. Direct page crawling — legality, PageSpeed/GTmetrix model, robots.txt, CFAA, what must NOT be pulled

### 1.1 The CFAA after *Van Buren* and *hiQ* — public pages are low-risk, gates are the line

- **CFAA, 18 U.S.C. § 1030**, makes it a crime / civil wrong to access a computer "without authorization" or to "exceed authorized access."
- ***Van Buren v. United States*, 593 U.S. ___ (3 June 2021, 6–3):** "exceeds authorized access" means accessing areas of a computer you are not entitled to access (a "gates-up-or-down" test). It does **not** cover accessing information you are entitled to obtain for a purpose the owner dislikes. Purpose-based limits in contracts/policies do not create CFAA liability. (Cooley client alert, 9 June 2021; Clifford Chance, June 2021.)
- ***hiQ Labs v. LinkedIn*, 9th Cir., 18 Apr 2022 (on remand from the Supreme Court):** scraping data from a public website with no password gate is unlikely to be "without authorization" under the CFAA — "authorization is only required for password-protected sites or sites that otherwise prevent the general public from viewing the information." Limits: it affirmed a *preliminary injunction* on "serious questions," and it binds only the Ninth Circuit.
- **The hiQ warning — CFAA is not the whole law.** hiQ "won" the CFAA point and still lost the case: N.D. Cal. (27 Oct 2022, published 4 Nov 2022) held hiQ breached LinkedIn's User Agreement, and the **8 Dec 2022 consent judgment entered $500,000 against hiQ**, plus deletion of scraped data/code and a permanent ban on scraping LinkedIn. Contract, copyright, trespass, and privacy claims survive even when the CFAA does not apply. (Ninth Circuit itself listed copyright, misappropriation, unjust enrichment, conversion, breach of contract, breach of privacy as still open.)

**Application to DealNote.** The engine fetches a single public homepage that anyone can open without logging in, with an identifying User-Agent, one fetch per audit plus up to 10 link checks. That is the lowest-risk fact pattern under *Van Buren*/*hiQ*. Risk rises only if the engine ever crosses a gate (see §1.4).

### 1.2 robots.txt — a request, not a lock, but ignore it at your peril

- **RFC 9309 (IETF standard, Sept 2022)** states the Robots Exclusion Protocol rules **"are not a form of access authorization."** No US statute makes violating robots.txt unlawful by itself.
- But robots.txt is **evidence of the owner's wishes**, shows up in disputes, and ignoring it weakens a good-faith argument. Several major sites also incorporate robots.txt into their Terms, which converts a robots violation into a contract question — the exact claim hiQ lost on.
- **DealNote gap (verified in code):** the engine fetches `/robots.txt` and records only whether it exists. It never parses `Disallow` and never refuses a disallowed URL. The landing page says "HTTPS, canonical, robots.txt, sitemap, broken links" under "It checks the page you paste," which a reader could take to mean robots.txt is respected. **Fix (P1):** parse the file for the DealNote User-Agent (fallback `*`), and if the homepage path is disallowed, refuse the audit with "This site asks automated tools not to fetch this page (robots.txt). No score was given." — the same no-score pattern already used for unreachable pages. At minimum, add the disclosure in §10.

### 1.3 PageSpeed / GTmetrix model — what DealNote does and must keep saying

- PageSpeed Insights / GTmetrix run **Lighthouse** (lab + field data) in a controlled Chrome environment and report performance scores. DealNote does **not** do this: no PageSpeed API key is wired in v1; speed is scored from **measured fetch time and page size in that run** (`lib/analyze.ts`), and the "Could not check" list says so on every report.
- The live copy already says this correctly in three places ("Scores are lab measurements on the run date under stated conditions. Scores can vary between runs."). **Keep that sentence on every surface that shows a score** (landing hero, /audit result, /sample, report PDF). Never present a DealNote score as a Lighthouse, PageSpeed, or Core Web Vitals score, and never show field/real-user data — the engine has none.
- The one wording risk: "lab measurements" is accurate (the Vercel server is the lab), but a reader may hear "lab" as "Google lab." The copy-ready label in §10 pins it down: "Measured by DealNote's server in this run."

### 1.4 What must NOT be pulled — hard lines (already in Terms; keep them as code, not just words)

| Never pull / never do | Why | DealNote status |
|---|---|---|
| Pages behind a login, paywall, or CAPTCHA; any CAPTCHA bypass, credential use, session-cookie replay, or bot-evasion tooling | Crosses the *Van Buren*/*hiQ* "gate"; 2026 commentary notes courts are beginning to treat bot-blocking systems as DMCA §1201 "access controls," so bypassing a CAPTCHA can carry legal, not just technical, risk (unsettled — treat as red line, not a grey area) | Already prohibited in Terms Acceptable Use; engine does no login/CAPTCHA handling — keep it that way |
| Google Maps / Places data: business names, addresses, reviews, photos, ratings, coordinates, place IDs | Google Maps Platform ToS §3.2.3: do not export, extract, or scrape Google Maps Content for use outside the Services; do not pre-fetch, index, store, or redistribute it; do not "copy and save business names, addresses, or user reviews" (Places API Policies, accessed Nov 2026). Only place IDs are exempt from caching restrictions | Already excluded by design; README + landing say so. **Never add it, even via a third-party API, without a licence review** |
| Review text or photos from any review platform (Google, Yelp, Trustpilot, etc.) | Copyright in the review text (owned by author/platform), platform ToS bans, and FTC endorsement/testimonial rules if reproduced in a sales document | Engine does not fetch them. Do not add a "review count" field from any source |
| Personal data beyond what is visibly published on the fetched homepage | Any name/email/phone that is *not* on the public page must not be enriched, appended, or inferred. Enrichment is what turns a page audit into a data-broker activity (§7) | Terms already say contact details come only from the fetched page. The engine currently extracts only a boolean (phone visible / tel: link present), not the number itself — keep it that way |
| Non-homepage crawling, site-wide scraping, or building/storing business lists | Multi-page crawling multiplies load, ToS exposure, and data volume; stored lists are the data-broker trigger | v1 is homepage-only; Terms prohibit list-building/resale. Any "crawl the whole site" feature needs a fresh review |
| Form submission, POST requests, or any state-changing request | Submitting forms is not "reading a public page"; it can create accounts, send mail, or trigger transactions | Engine only GETs (HEAD for link checks). Keep it so |
| Copyrighted content reproduction | Reports may quote short factual findings (title length, "6 images missing alt text") — facts, not expression. Do not reproduce page copy, images, or logos in the report | Current findings quote only measurements. The report must not embed the prospect's images or logo |

### 1.5 Rate, identification, and politeness (not law, but the difference between a complaint and a lawsuit)

- Identify the bot (already done: `DealNote/1.0 (website teardown; contact via site owner)`). **Improve the contact**: the parenthetical points nowhere — there is no contact address on the site. Once the P0 contact email exists, put the real address in the User-Agent.
- One homepage + ≤10 link checks per audit, 10 s/5 s timeouts, is a light footprint. Add per-IP/per-URL rate limiting before Dec 1 (P1, §5 of fix list) so the endpoint cannot be used to hammer a third-party site.

---

## 2. FTC — verified/earnings claims, scores, the $49 vs $39/mo comparison, guarantees, disclaimers

### 2.1 The governing law is FTC Act §5, not only the Business Opportunity Rule

- **FTC Act §5, 15 U.S.C. §45** prohibits unfair or deceptive acts or practices. Any material claim — price, "cheapest," scores, "lifetime," "guarantee" — needs a **reasonable basis (competent, reliable evidence) before it is made**, and a disclaimer placed next to the claim cannot cure a misleading overall impression (FTC staff guidance on earnings claims, updated Apr 2024; FTC Business Blog, 16 June 2026).
- **Business Opportunity Rule, 16 CFR Part 437** applies only to a "business opportunity": buyer pays, enters a new business, **and** the seller represents it will provide locations, outlets/accounts/customers, or buy back output (§437.1(c)). If it applies, an earnings claim requires written substantiation in hand, an "EARNINGS CLAIM STATEMENT REQUIRED BY LAW" document with dates and the number/percentage of purchasers who achieved the claimed level (§437.4), and a disclosure document 7+ calendar days before payment. **DealNote is likely outside the Rule** — it sells a tool, not customers, accounts, or a buyback — but that is a lawyer's call, not a certainty, because the landing copy ("Show the prospect what is wrong with their site, then sell the fix") is sales-outcome language. **Do not add any sentence that promises clients, customers, or income, or the Rule analysis flips.** The FTC's Operation AI Comply (25 Sept 2024) and the Air AI case (Mar 2026, charged with a Business Opportunity Rule violation for missing disclosure documents) show the agency is actively policing AI-tool income promises.
- **No "verified" badge exists on the site and none should be added.** "Verified" implies third-party verification; TrustMRR "verified profit" is a hackathon-leaderboard concept, not an FTC concept, and TrustMRR is not set up (§5). Do not use the word "verified" next to revenue, profit, or client-win claims anywhere.

### 2.2 Scores — what is compliant, what to keep

Compliant as written, provided the disclaimers stay attached:

- Scores are **DealNote's own model** with weights printed on the report (landing L34–35: "This is DealNote's scoring model, not an industry standard. Grades: A 90–100, B 80–89, C 70–79, D 60–69, F below 60."). Keep that exact sentence on the landing hero, /audit results, /sample, and every PDF.
- "Scores are lab measurements on the run date under stated conditions. Scores can vary between runs." — present on landing + footer + /audit. Keep it adjacent to every score, not only in the footer.
- Do not translate a DealNote score into a predicted ranking, traffic, or revenue effect. The current "Why it matters" lines ("fewer of them call") are generic, qualitative, and tied to the finding — acceptable; do not quantify them ("you lose 37% of calls") without a cited study.

### 2.3 The $49 vs $39/mo arithmetic — correct maths, unproven superlative

- **Arithmetic: correct.** $39 × 2 = $78 > $49, so "$49 once is less than two months of [a] $39 per month [subscription]" is mathematically true.
- **Problem: "the cheapest white-label audit subscription."** "Cheapest" is a superlative comparative claim. No competitor is named, no date is given, no source is cited, and no evidence was found in the repo that a market survey was done. Under §5 the seller needs a reasonable basis for the *comparison as a whole*, including the "cheapest" element. **P0 fix:** either (a) name the comparator and date it ("e.g. [Named Tool], $39/mo on its public pricing page, checked 27 Nov 2026"), or (b) drop "cheapest" and reword to the copy-ready label in §10 ("$49 once is less than two months of a $39-per-month subscription. Example only — compare current prices before you buy."). Option (b) is safer and needs no maintenance.
- Also: the landing pricing card lists "Teardown PDF and proposal PDF" as included, while the same page says "full PDF downloads arrive when payment is wired up" and README confirms paid PDF is not built. That is a **present-tense feature claim for a not-yet-built feature**. P0 fix: change the bullet to "Teardown PDF and proposal PDF (coming with payment)" or remove it until built.

### 2.4 No guarantee of client wins — correct, keep it everywhere

- Landing pricing caption already says "Arithmetic on published prices, not an earnings claim. No guarantee of client wins." Terms §"Data provided as-is" repeats it. Keep both, and add the same sentence to /templates and the proposal PDF footer (§10 placement map). Never let a proposal template promise a result ("will double your calls"); the template's "tied to a lost call, booking, or visit" phrasing is qualitative — keep it qualitative.

### 2.5 Disclaimers — placement rule

A disclaimer must sit **next to the claim it qualifies**, not only in /terms. FTC staff guidance: a needed disclosure must be clear, prominent, and next to the claim, not behind a link. The placement map in §10 implements this: price disclaimer under the price; score disclaimer under the score; sample disclaimer on the sample; refund pointer under the price and in the FAQ.

---

## 3. Refund / replace promise — is it honoured, is there a report flow, what must change

### 3.1 What the site promises

- Landing FAQ: "Report a bad report within 14 days and we will replace it or refund it. See the refund section in the terms."
- Terms, Refund policy: "If a report is bad, report it within 14 days and we will replace it or refund it. A bad report is one with wrong findings, for example a check that contradicts the fetched page. Tell us which finding is wrong and why, and we will re-run the audit or refund the $49. Refunds are for bad reports, not for a prospect declining your proposal."
- Terms, Changes: "If a feature you paid for stops working, report it and the refund rule above applies."

### 3.2 Is it honoured? — **No, not as the site stands. There is no way to report anything.**

Verified 27 Nov 2026: there is **no contact email, no support address, no contact form, and no refund-request flow anywhere on the site** (repo-wide grep; footer links only to /audit, /sample, /templates, /terms). A buyer who paid $49 and received a bad report literally cannot "tell us which finding is wrong and why," because there is no "us" to tell. The promise is therefore currently **unperformable**. That matters in three ways:

1. **FTC Act §5:** advertising a remedy the buyer cannot invoke is deceptive. The risk is low while payment is not yet live (nobody has paid), and becomes real the day Stripe goes live.
2. **Chargebacks:** a buyer who cannot reach the seller disputes with their card issuer instead. A $49 chargeback costs more than $49 in fees and, at volume, threatens the Stripe account.
3. **Ship or Die:** a "verified profit" leaderboard entry built on sales with an unclaimable refund policy is a reputational risk if a buyer complains publicly.

### 3.3 What must change (P0, before any payment is taken — and before Dec 1 regardless)

1. **Publish a contact email** (e.g. `support@dealnote…` or the seller's existing business email) in the footer, on /terms, and in the refund FAQ answer. This single change also fixes the User-Agent contact gap (§1.5).
2. **Add a refund-request route**: minimum viable is a `mailto:` link with a pre-filled subject ("DealNote refund request — [report URL] — [date]") plus the instruction "include the report URL, the finding you say is wrong, and why." Better: a simple form that emails the seller (no account, no database needed). The Terms clause in §10 is drafted to name the channel once it exists.
3. **Define "bad report" objectively in the Terms** (already roughly done — "a check that contradicts the fetched page") and add: what the buyer must send, the response time ("we will reply within 3 business days" — only promise a time you will keep), whether replacement or refund is the seller's choice, and that the 14 days run from the report run date shown on the report.
4. **Do not take payment until 1–3 exist.** The README already says payment is not built; keep the launch gate explicit: no Stripe Checkout until the refund channel is live and tested with a real email.
5. **Keep a refund log** (even a sheet): date, report URL, finding disputed, outcome, refund transaction ID. This is the substantiation file if a chargeback or complaint ever asks "did you honour it?"

### 3.4 What is already right

- 14 days is a clear, short window; "replace or refund" (seller's choice) is standard; excluding "prospect declined your proposal" is a fair, stated boundary. Keep all three.
- No cooling-off-period issue: the FTC's Cooling-Off Rule (16 CFR Part 429) covers door-to-door sales, not online software; no US federal cooling-off right applies to a $49 online tool. State rules and card-network chargeback rights are the practical remedies — hence the log in §3.3(5).

---

## 4. Buyer outreach law for the proposal templates (CAN-SPAM, TCPA, state call rules, CASL/PECR/Spam Act)

**Threshold point:** DealNote does not send any outreach. The *buyer* sends it. DealNote's liability is therefore indirect (template design, marketing of the template), but a template that omits legally required elements is the most likely way DealNote's name ends up in a buyer's complaint. The Terms already say "You are responsible for your own outreach law" — correct, but the template should make compliance *easy*, not just disclaimed.

### 4.1 United States — CAN-SPAM (email)

- **CAN-SPAM Act, 15 U.S.C. §§7701–7713; FTC CAN-SPAM Rule, 16 CFR Part 316; FTC Compliance Guide for Business.** Covers **all** commercial email — "any electronic mail message the primary purpose of which is the commercial advertisement or promotion of a commercial product or service" — **including B2B and single emails**. No exception for business-to-business.
- **Cold email is NOT banned.** CAN-SPAM is opt-out, not opt-in: no prior consent is required. But every commercial email must satisfy all 7 requirements; each violating email carries a penalty of **up to $53,088** (FTC inflation adjustment, 17 Jan 2025):
  1. Accurate "From," "To," "Reply-To," and routing header information.
  2. Non-deceptive subject line (no fake "Re:"/"Fwd:").
  3. Identify the message as an advertisement (clear and conspicuous, unless prior affirmative consent).
  4. Valid physical postal address of the sender.
  5. Clear, conspicuous opt-out explanation.
  6. Honour opt-outs within **10 business days**; opt-out mechanism must work for at least 30 days after sending.
  7. Monitor vendors — hiring a sender does not transfer liability; never sell/transfer opt-out addresses.
- **Gap in the current template (/templates covering email):** the template has a subject line, greeting, body, and sign-off — but **no postal address, no ad identification, and no opt-out instruction**. A buyer who copies it verbatim and sends it cold violates CAN-SPAM on elements 3–5. **P1 fix:** add a mandatory footer block to the template (copy-ready in §10) and a pre-send checklist on /templates. Do not present the template as "ready to send" without it; the landing says "ready-to-send proposal" — qualify it as "ready to adapt and send" once the footer is added, or add the footer and keep the claim.

### 4.2 United States — TCPA (calls and SMS) and state call rules

- **TCPA, 47 U.S.C. §227:** marketing calls/texts using an autodialer or artificial/prerecorded voice require **prior express written consent**. Statutory damages **$500–$1,500 per violation**, private right of action, no cap. Text messages are "calls" for TCPA purposes.
- **The FCC's "one-to-one consent" rule (FCC 23-107) is DEAD — do not cite it as live law.** It would have required consent naming one seller at a time, "logically and topically associated" with the interaction. The **Eleventh Circuit vacated it on 24 Jan 2025** (*Insurance Marketing Coalition v. FCC*, No. 24-10277), holding the FCC exceeded its statutory authority ("prior express consent — not prior express consent *plus*"). Several 2025–26 guides still describe the rule as effective Jan 2025/Jan 2026; those are stale. The underlying TCPA written-consent requirement for autodialed/prerecorded marketing calls and texts **remains in force**; bundled/lead-generator consent is lawful again, but consent must still be prior, express, and written for marketing autodialer traffic, and revocation must be honoured through **any reasonable method** (FCC revocation rule, effective Apr 2025; honour within 10 business days).
- **DealNote's position is correct and should stay absolute:** no cold SMS scripts anywhere in the product; templates are email-only. A single cold marketing SMS sent without prior express written consent is a $500–$1,500 exposure *per message*, and the buyer — not DealNote — would be the defendant. Keep the "Email only. No cold SMS scripts in this product." banner on /templates and /audit, and add the same line to the proposal PDF footer.
- **State call rules (buyer's problem, flag it once):** state telemarketing laws and do-not-call registries apply in parallel — e.g. Florida's mini-TCPA (Fla. Stat. §501.059, private right of action, and its own consent/identification rules), Oklahoma's Telephone Solicitation Act, and state DNC lists. A buyer calling a prospect must scrub against the National DNC Registry and applicable state lists, identify themselves, and observe state calling-hour limits. One line in the /templates compliance note covers this (§10).

### 4.3 Canada — CASL (opt-IN, the opposite of CAN-SPAM)

- **Canada's Anti-Spam Legislation (CASL), in force 1 July 2014, enforced by the CRTC.** A commercial electronic message (CEM — email, SMS, instant message) may be sent only with **prior consent (express or implied)**, plus sender identification and a working unsubscribe honoured within 10 business days (unsubscribe mechanism valid ≥60 days). Penalties up to **CAD $10M per violation for businesses / $1M for individuals**; the sender bears the onus of proving consent.
- **The trap for US buyers:** CAN-SPAM allows cold email; CASL does not. A buyer who emails a Canadian prospect cold, relying on the US rule, violates CASL unless an implied-consent route applies — the useful one here is **conspicuous publication**: the recipient published their business email publicly without a "do not contact" statement, and the message is relevant to their role/business. That route exists but is narrow and fact-specific. **Template fix:** the /templates compliance note must say "Do not cold-email Canadian recipients unless you have express consent or a documented CASL implied-consent basis (e.g. conspicuous publication)."

### 4.4 UK / EU — PECR + UK GDPR / GDPR

- **UK PECR, reg. 22:** marketing email/text to **individual subscribers** (consumers, sole traders, most partnerships) requires **prior consent**, unless the narrow **"soft opt-in"** applies: details collected during a sale/negotiation, marketing your own similar products/services, opt-out offered at collection and in every message. **Corporate subscribers** (limited companies, LLPs, Scottish partnerships, government bodies) may be emailed without prior consent, but must be given an opt-out and the sender must not disguise identity (reg. 23). If you cannot tell which type the recipient is, treat them as an individual (ICO guidance).
- **UK GDPR / EU GDPR** apply in parallel: a named business email is personal data; the buyer needs a lawful basis (usually legitimate interests with a recorded balancing test for B2B cold outreach), a privacy notice, and must honour objections. GDPR also applies to a US buyer emailing EU recipients (Art. 3(2) extraterritoriality).
- **Practical consequence for the template:** a cold proposal email to a UK sole-trader plumber needs consent or soft opt-in — and a first-touch teardown email is neither. The compliance note must say so plainly (§10).

### 4.5 Australia — Spam Act 2003 (Cth)

- **Spam Act 2003, enforced by ACMA:** unsolicited commercial electronic messages (email, SMS, MMS, IM) require **consent (express or inferred)**; inferred consent **cannot** be inferred from mere publication of an address, but **can** be inferred from **conspicuous publication** of a work address (employee/director/officer) without a "do not contact" statement, where the message is relevant to their role. Every CEM must identify the sender and include a functional unsubscribe facility. The Act also prohibits address-harvesting software and harvested-address lists. Penalties are severe (ACMA lists repeat corporate offenders facing up to $2.1M/day; Woolworths was fined just over $1M in July 2020 for 5M breaches).
- **Direct DealNote relevance:** the audit engine itself must never become an address-harvesting tool — it is not (it extracts no addresses), and the Terms prohibition on list-building should stay.

### 4.6 Outreach law — summary table for the /templates page

| Recipient location | Cold commercial email allowed? | What is needed |
|---|---|---|
| USA | Yes, opt-out regime (CAN-SPAM) | Honest headers/subject, ad ID, postal address, opt-out honoured ≤10 business days |
| Canada | No, opt-in (CASL) | Express consent, or documented implied consent (e.g. conspicuous publication + relevance) + ID + unsubscribe |
| UK/EU | Individuals: no, opt-in or soft opt-in (PECR/GDPR); Ltd/LLP companies: yes with opt-out | Consent or soft opt-in for individuals; legitimate-interest basis + notice under GDPR |
| Australia | No, opt-in (Spam Act) | Express or inferred consent (conspicuous publication route) + sender ID + unsubscribe |
| SMS anywhere (US/CA/AU/UK) | Effectively no for cold marketing | Prior express (written) consent; DealNote provides no SMS scripts — do not improvise one |

---

## 5. Seller-site data collection — localStorage, Vercel logs, Ship or Die tracker, TrustMRR, cookies/banner, CIPA

### 5.1 What the site actually collects today (verified)

- **Buyer localStorage (client-side only):** brand profile (name, contact name/email/phone, website, colours, CTA, intro line) under `dealnote-brand-v1`; outreach tracker (prospect domain/URL, status, date) under `dealnote-proposals-v1`. Nothing is sent to any server. The /audit page says "Stored only in this browser. Nothing is sent anywhere." — accurate.
- **Vercel hosting:** every request generates server-side logs at Vercel (IP address, user agent, path, timestamp, plus the pasted URL in the POST body to `/api/audit`). Vercel is a processor/sub-processor; retention varies by plan. **No DPA or retention figure is asserted here — verify the current plan in the Vercel dashboard and record it in the Privacy Policy.** The audited URL itself can be sensitive (it reveals the buyer's prospect list) — it appears in Vercel request logs. Do not log the URL anywhere else, and do not add logging that stores it.
- **No cookies, no analytics, no third-party scripts today** (verified: no analytics dependency, no tracking snippet in `app/layout.tsx`).

### 5.2 localStorage — consent and disclosure

- **EU/UK ePrivacy Directive Art. 5(3) / PECR reg. 6:** storing or accessing information on a user's device requires consent unless strictly necessary for a service the user explicitly requested. A brand profile the user typed in and asked to be remembered is arguably functional/strictly necessary for the white-label feature — but that is an argument, not a certainty, and it does not cover the outreach tracker (which persists prospect data the user may not expect to be retained). **P1 fix:** disclose both localStorage keys, their purpose, and how to clear them in the Privacy Policy, and add a one-line notice on /audit ("Your brand and tracker are stored only in this browser's local storage. Clear them in your browser settings to delete them."). No cookie banner is required for localStorage alone in the US; in the EU/UK a banner is the cautious route if any non-essential storage is added later.
- **US state laws:** localStorage holding the *buyer's own* contact details is not a "sale" of personal information. No opt-out mechanism is triggered. But if the tracker ever syncs to a server, the analysis changes (§6).

### 5.3 Cookies / banner — current answer: none needed today, banner needed the day anything is added

- Today: no cookies are set by the app; Vercel Web Analytics / Speed Insights are **not** installed (no `@vercel/analytics` in `package.json`). **Do not add a cookie banner for a site that sets no cookies** — it creates confusion and a false promise. Instead, state in the Privacy Policy: "DealNote sets no cookies in v1."
- The day any of the following is added, a banner + consent gate becomes required (EU/UK) and a disclosure update is required (US states): Vercel Analytics, any analytics, the Ship or Die tracker, TrustMRR script, a chat widget, or a payment provider's fraud scripts. Vercel Analytics is cookieless but still loads client-side and reports page views on mount with no built-in consent check — it must be conditionally rendered behind consent state, not mounted in the layout.

### 5.4 Ship or Die tracker — TODO only; do not invent, do not install blind

- The repo contains only a TODO comment ("Ship or Die tracker snippet goes here once the tracker is set up. Do not invent the snippet."). **No snippet exists, no tracker is installed, no claim about it may be made.**
- When the real snippet arrives: (a) read what data it sends (page URL, IP, user agent, referrer?) and to whom; (b) name it in the Privacy Policy *before* deploying; (c) if it sends visitor data to a third party, gate it behind consent for EU/UK visitors or accept the CIPA risk below. Do not paste an unverified snippet from a chat message or a leaderboard page.

### 5.5 TrustMRR — not set up; nothing to disclose, nothing to claim

- TrustMRR is not wired in. Do not claim "verified revenue/profit" anywhere (see §2.1). If TrustMRR is added later, it will typically involve a script and/or a data feed to a third party — same review as §5.4, plus: only report profit figures that reconcile to Stripe payouts, and keep the refund log (§3.3) as the reconciliation source.

### 5.6 CIPA risk — the 2025–26 demand-letter wave, and why DealNote is currently *outside* it

- **California Invasion of Privacy Act (CIPA), Cal. Penal Code §§631, 632, 638.51; private action §637.2: greater of $5,000 per violation or 3× actual damages.** Plaintiffs have repurposed this 1967 wiretap law against pixels, analytics scripts, session-replay tools, and chatbots that transmit visitor activity (IP, device identifiers, timestamps, browsing behaviour) to third parties before consent. More than 800 CIPA claims were filed in 2025; a wave of pre-suit demand letters from Fall 2025 (notably from plaintiff's counsel Vivek Shah) targeted thousands of businesses, including many with no California connection, alleging each visit/transmission is a separate $5,000 violation.
- **California SB 690 (enacted 2026, effective 1 January per 2026 reporting) narrows — but does not end — this risk.** It eliminates *private* lawsuits under the pen-register/trap-and-trace provision (§638.51), leaving enforcement of that provision to the Attorney General, and applies retroactively to claims filed on/after 1 Jan 2025. **Private claims under §631 (wiretapping) and §632 (recording confidential communications) are unaffected**, and claims under the federal Wiretap Act and common-law invasion of privacy continue. OneTrust's summary (Nov 2026) notes Forbes Media agreed in principle to a $10M settlement in a California wiretapping suit alleging trackers transmitted identifiers to third parties without sufficient consent.
- **DealNote today: no pixel, no third-party script, no session replay, no data sent to any third party from the visitor's browser.** That is the strongest possible CIPA posture, and it is a *design* fact worth preserving. Every future third-party script re-opens it. **Rule: no third-party script ships without (1) a Privacy Policy entry naming it, (2) a consent gate for EU/UK/CA visitors if it transmits identifiers, and (3) a documented reason it is needed.**

---

## 6. US state privacy laws — thresholds in force Nov 2026, and whether DealNote is below them

### 6.1 Landscape (as of late Nov 2026)

- **No comprehensive federal privacy law.** As of late 2026, **19–20 comprehensive state privacy laws are in force** (counts differ by tracker: 19 per Kukie/privacyquick, 20 per ComplyJet/Obtainer, both late-2026) and **23–24 states have enacted one**, with Oklahoma, Louisiana, Alabama, and Vermont signed in 2026 and taking effect 1 Jan 2027–1 Jan 2028. In force now include: California, Virginia, Colorado, Connecticut, Utah, Oregon, Texas, Montana, Delaware, Iowa, Nebraska, New Hampshire, New Jersey, Tennessee, Minnesota, Maryland, Indiana, Kentucky, Rhode Island, Florida (count varies on Florida's Digital Bill of Rights).

### 6.2 Thresholds that matter for DealNote

| Law | Threshold (applies if ANY is met, unless noted) | In force | DealNote today |
|---|---|---|---|
| **California CCPA as amended by CPRA**, Cal. Civ. Code §1798.140(d) | (A) Annual gross revenue > **$25M** (inflation-adjusted to **$26,625,000** per 2026 guides); OR (B) annually buys, sells, or shares PI of **100,000+** CA consumers/households; OR (C) derives **50%+** of annual revenue from selling/sharing PI | 1 Jan 2020; CPRA amendments 1 Jan 2023 | **Below all three.** Revenue is $0 (no payment yet); no PI bought/sold/shared; no prospect PI stored server-side. CPRA risk-assessment rules apply from 1 Jan 2026 and ADMT rules from 1 Jan 2027 — only to covered businesses, so not to DealNote today |
| **Texas TDPSA**, Tex. Bus. & Com. Code ch. 541 | **No revenue or consumer-count threshold.** Applies to any person conducting business in Texas or producing a product/service consumed by Texans, who processes or sells personal data, **unless** an SBA-defined small business. Small businesses remain bound by §541.107 (no sale of *sensitive* data without prior consent). AG-only enforcement, up to **$7,500/violation** | 1 July 2024; universal opt-out 1 Jan 2025 | **Likely below/exempt, but this is the closest call.** DealNote is a one-person product, well under SBA size standards (typically <500 employees / revenue standard for its NAICS code), so the small-business exclusion should apply. BUT: the exclusion turns on the SBA definition, not on "we are small" as a vibe — confirm the NAICS size standard once revenue starts. And §541.107 survives the exemption: never sell sensitive data without consent |
| **Virginia VCDPA** | Controls/processes PI of 100,000+ consumers; OR 25,000+ consumers + 50%+ revenue from sale of PI | 1 Jan 2023 | Below |
| **Colorado CPA** | Controls/processes PI of 100,000+ consumers; OR 25,000+ + sale of PI | 1 July 2023 | Below |
| **Connecticut CTDPA** | 100,000+ consumers (thresholds amended 1 July 2026 — re-check at next review; CT also reaches any sale of PI / processing of sensitive data at lower volumes) | 1 July 2023 | Below |
| **Utah UCPA** | 100,000+ consumers **AND** $25M+ revenue | 31 Dec 2023 | Below (AND test) |
| **Oregon, Montana, Delaware, Iowa, Nebraska, New Hampshire, New Jersey, Tennessee, Minnesota, Maryland, Indiana, Kentucky, Rhode Island, Florida** | Mostly 100,000-consumer thresholds (some 25,000–35,000 + sale tests; Maryland has no numeric threshold for some duties and applies to processing from 1 Apr 2026) | 2024–2026 | Below on volume in every case today |

### 6.3 Verdict and tripwires

- **Verdict: DealNote is likely below every state comprehensive-privacy threshold today**, because it has no revenue, no accounts, no server-side personal data, and no sale/sharing of PI. The only law without a numeric escape hatch is Texas, and the SBA small-business exclusion is the shelter there.
- **This verdict is fragile by design — it depends on what the product does NOT do.** Any one of these flips it, and must trigger a re-review *before* shipping: (1) user accounts or email capture; (2) server-side storage of audited URLs, prospect contact details, or buyer brand profiles; (3) a stored business/prospect list; (4) any sale or sharing of PI (including an analytics/tracker feed that shares identifiers); (5) revenue crossing $25M (not imminent) or 100,000 CA consumers' PI processed (possible at scale if accounts are added — 100,000 is not a large number for a $49 tool).
- **Even below thresholds, two duties already apply:** (a) **reasonable security** for any PI held (buyer brand data in localStorage is client-side, but Vercel logs hold IPs — do not expand logging); (b) **truthful privacy notice** — the absence of any Privacy Policy is itself the gap (P0), not the thresholds.

---

## 7. California data broker trap / Delete Act / DROP — does DealNote collect personal data about prospects?

### 7.1 Short answer: **NO — not in v1, and the design must stay that way.**

### 7.2 The test

- **Delete Act (SB 362, signed 10 Oct 2023), Cal. Civ. Code §§1798.99.80–.89:** a **"data broker"** is "a business that **knowingly collects and sells to third parties the personal information of a consumer with whom the business does not have a direct relationship**" (§1798.99.80(c)). Exemptions include entities covered by FCRA, GLBA, HIPAA, CMIA, and California insurance privacy law.
- **Duties if you are one:** register annually with the California Privacy Protection Agency (CPPA) by 31 January each year, pay a fee, publish detailed disclosures (including whether you collect minors' data, precise geolocation, reproductive-health data), report CCPA rights-request metrics, and — the sharp end — **honour deletion requests through DROP (Delete Request and Opt-Out Platform), which went live for consumers on 1 Jan 2026; brokers must retrieve and honour DROP requests from 1 Aug 2026**. CalPrivacy's Data Broker Enforcement Strike Force issued its first Delete Act decisions days after DROP launched (8 Jan 2026): Rickenbacher Data LLC d/b/a Datamasters fined **$42,000** for failure to register (it bought and resold names, addresses, phone numbers, and health-related PI of millions of people). Third-party audits of brokers begin in 2028.
- Note the **"sell"** definition is broad under CCPA/CPRA (it includes "sharing" for cross-context behavioural advertising). CalPrivacy has warned businesses **not to assume** they are exempt — retailers selling audience segments, lead providers selling targeted audiences, and enrichment companies have all been flagged as potential brokers.

### 7.3 Why DealNote is not a data broker today (three independent reasons — any one suffices)

1. **No sale to third parties.** DealNote sells a *tool* to the buyer. No prospect PI is sold, shared, or transferred to anyone. There is no third-party recipient at all in v1.
2. **No collection of prospect PI.** The audit reads a public homepage and records *measurements* (title length, load time, "phone visible: yes/no"). It does not extract, store, or transmit the prospect's name, email, phone, or address. The only contact details that ever appear are the *buyer's own* brand details, typed by the buyer into their own browser.
3. **No "consumer with whom the business does not have a direct relationship" whose PI is knowingly collected for sale.** The prospect is not DealNote's customer and DealNote holds no PI about them.

### 7.4 What changes if it ever did — the tripwire list

If any of these is ever proposed, **stop and get a lawyer before building**:

- Storing audited prospect contact details server-side (even "to show the buyer their history").
- Building, storing, or selling a list of businesses/prospects, or letting buyers export/share prospect lists.
- Enriching a prospect with data from any other source (registries, Maps, social profiles, data vendors).
- Sharing audit data, identifiers, or prospect URLs with any third party (analytics, tracker, CRM, ad platform) in a way that counts as a "sale/share" under CCPA.
- Adding a "find prospects for me" / lead-generation feature.

Any one of those would require, at minimum: a data-broker analysis, CPPA registration by 31 January of the following year, DROP participation from 1 Aug 2026, and a CCPA "Do Not Sell/Share" + deletion-request mechanism. The current Terms prohibition ("Do not use the tool to build lists of businesses or to resell data") is the right guardrail — keep it, and add the same prohibition to the /audit page near the tracker.

---

## 8. COPPA

- **Children's Online Privacy Protection Act, 15 U.S.C. §§6501–6506; COPPA Rule, 16 CFR Part 312.** Applies to operators of websites/online services **directed to children under 13** or who **knowingly collect personal information from children under 13**. Requires verifiable parental consent (VPC) before collecting, using, or disclosing a child's PI, plus a clear privacy notice and data-security duties.
- **FTC's Jan 2025 COPPA Rule update** (approved 16 Jan 2025, 5–0): separate VPC for disclosing a child's PI to third parties for targeted advertising or non-"integral" purposes; data-minimisation and a written retention policy; expanded "personal information" (biometric identifiers, government-issued IDs); clarified "directed to children" and new "mixed audience" definitions. Effective 60 days after Federal Register publication, with its fate under the new administration noted as uncertain in Feb 2025 commentary — **do not rely on the 2025 amendments as settled law; the underlying 2013 Rule is the stable baseline.**
- **Application to DealNote: no COPPA exposure in v1.** The site is a B2B tool for adult freelancers/agencies; it is not directed to children; it collects no personal information from *anyone* (no accounts, no email capture, no age data); and the buyer is an adult professional. No age gate, no parental-consent flow, and no child-directed content is needed.
- **Residual notes:** (1) If accounts or email capture are ever added, add a one-line representation ("You confirm you are at least 18, or the age of majority where you live") to the Terms — cheap, standard, and it documents the adult-audience position. (2) Auditing a child-directed *prospect's* website is not a COPPA event for DealNote — the audit reads a public page and collects no PI from children. (3) State laws now extend children's-privacy duties to ages 13–17 (e.g. Maryland's Online Data Privacy Act) — relevant only if the product ever targets minors, which it must not.

---

## 9. Other findings from the live site / repo review

1. **"Teardown PDF and proposal PDF" listed as included while payment/PDF is not built** (§2.3) — fix the bullet before Dec 1.
2. **Sample labelling is good.** "SAMPLE: fictional business, fictional data" appears on the landing hero, /sample (repeated per section), and /audit sample view. The fictional `.example` domain and 555 phone are correct choices. Keep the stamp on the **PDF print output** too — verify the print stylesheet keeps the SAMPLE stamp visible (check before launch; a printed sample without the stamp is a misrepresentation risk).
3. **Default brand profile uses fictional placeholder data** ("Alex Rivera," `hello@yourstudio.example`, 555 phone) — correct; do not replace with real-person data.
4. **"Lifetime means the lifetime of the product"** is defined in Terms and the FAQ defers to it — acceptable. Do not use "lifetime" in any ad or social post without the qualifier.
5. **Accessibility disclaimer is correct:** "Accessibility checks are automated checks, not a WCAG certification" (Terms) and "No accessibility score presented as a legal claim" (landing). Keep both; never add an accessibility *score* or a WCAG-conformance claim.
6. **SSRF residual (P1, engineering, not legal):** `isValidAuditUrl` blocks private/loopback hosts at input, but `fetch` follows redirects and the final URL is not re-validated — a public URL that 301-redirects to a private address could be fetched server-side. Re-validate `response.url` against the same blocklist, and add per-IP rate limiting on `/api/audit` before Dec 1.
7. **No governing-law, liability-cap, or IP clause in the Terms.** For a $49 tool this is acceptable for launch, but a lawyer should add a short governing-law + liability-limitation clause before payment goes live (P1, not P0 — the refund channel matters more).
8. **No business-entity, address, or identity information on the site.** Not strictly required for a $49 digital tool, but CAN-SPAM requires the *buyer's* postal address in their emails, not the seller's; and a refund channel needs a real contact. Publish at least an email; a postal address can wait until payment is live (Stripe will require business details then in any case).

---

## 10. Copy-ready texts and placement map

All texts below are **draft general-information wording, not legal advice**. Paste them as written, replacing only the bracketed items. Do not paraphrase the disclaimers — the wording is the protection.

### 10.1 Label texts (short, paste next to the claim)

**L1 — Score disclaimer (landing hero under the score; /audit result top; /sample top; every report PDF header/footer):**
> Scores are DealNote's own measurements from this run, on the run date shown. They are not Lighthouse, PageSpeed, or search-ranking scores. Scores can vary between runs. Weights: Speed 20, Mobile 15, On-page SEO 20, Technical 15, Conversion 15, Trust, local and social 15. This is DealNote's scoring model, not an industry standard. Grades: A 90–100, B 80–89, C 70–79, D 60–69, F below 60.

**L2 — Price disclaimer (landing pricing card, directly under the $49 and the comparison line):**
> $49 once is less than two months of a $39-per-month subscription. Example only — compare current prices before you buy. No guarantee of client wins. Payment coming soon: the audit tool is free to try in v1, and full PDF downloads arrive when payment is wired up.

**L3 — Sample stamp (keep existing; add to PDF print header):**
> SAMPLE: fictional business, fictional data. Harbor & Pine Plumbing is invented. Nothing on this page describes a real business.

**L4 — Audit-method note (/audit, under the URL box — keep existing, add the robots line):**
> Public http or https addresses only. The audit reads the homepage and checks up to 10 internal links. It never submits forms, logs in, or bypasses a login page. If the site's robots.txt asks automated tools not to fetch the page, the audit will not run and no score will be given.

**L5 — Refund pointer (landing FAQ "What if the report gets something wrong?" + pricing card):**
> Report a bad report within 14 days and we will replace it or refund it. Email [support email] with the report URL, the finding you say is wrong, and why. See the refund section in the terms.

**L6 — Outreach responsibility (/templates top + /audit proposal section):**
> You are responsible for your own outreach law. Only email people in line with the rules that apply to you and to them — see the sending checklist below. DealNote provides no cold SMS scripts. Do not send marketing texts to a prospect unless you already have their prior express written consent.

**L7 — No-data-about-prospects (landing FAQ, keep existing):**
> No. The audit reads the public homepage only. Contact details in a report come only from what is visibly published on that page. There is no cold SMS in this product, and you are responsible for your own outreach law.

**L8 — Local-storage notice (/audit, under the tracker + brand sections):**
> Your brand profile and outreach tracker are stored only in this browser's local storage. Nothing is sent to DealNote or anyone else. Clear them in your browser settings to delete them.

**L9 — Report PDF footer (every paid and sample PDF):**
> Prepared by [buyer brand] on [run date] for [prospect URL]. Scores are DealNote's own measurements from this run, not Lighthouse or PageSpeed scores, and can vary between runs. This report checks the public homepage only. It does not estimate traffic, rankings, or lost revenue. No guarantee of client wins. [SAMPLE reports add: SAMPLE — fictional business, fictional data.]

### 10.2 Terms clause texts (replace the matching /terms sections; keep the existing "Last updated" line and update the date)

**T1 — Refund policy (replaces existing Refund policy section):**
> **Refund policy.** If a report is bad, report it within 14 days of the run date shown on the report and we will replace it or refund the $49 — our choice. A bad report is one with a wrong finding, for example a check that contradicts the fetched page. To report it, email [support email] with (1) the report URL, (2) the finding you say is wrong, and (3) why it is wrong. We will reply within 3 business days. Refunds are for bad reports, not for a prospect declining your proposal, and not for a report you have not read. If a feature you paid for stops working, report it the same way and the same rule applies.

**T2 — Contact (new section, directly after Refund policy):**
> **Contact.** Email [support email] for refund requests, bad reports, and questions about these terms. There is no phone support in v1. We aim to reply within 3 business days.

**T3 — Acceptable use (add one bullet to the existing list):**
> Respect robots.txt. Do not use the tool on a page the site's robots.txt asks automated tools not to fetch, and do not try to work around that.

**T4 — Your outreach (replaces existing "Your outreach is your responsibility" paragraph):**
> **Your outreach is your responsibility.** You are responsible for your own outreach law, including spam, consent, and local rules where you and the recipient operate. DealNote provides no cold SMS scripts anywhere in the product, and templates are email only. Do not send a report to a business in a way that breaks the law where you operate. In the United States, commercial email must follow the CAN-SPAM Act (honest headers and subject line, identification as an advertisement, your postal address, and an opt-out honoured within 10 business days). Canada, the UK/EU, and Australia require consent before most cold commercial email — do not rely on the US rule when emailing outside the US. Do not send marketing texts unless you already have the recipient's prior express written consent.

**T5 — Data and privacy (new section — pairs with the new Privacy Policy page; do not ship the clause without the page):**
> **Data and privacy.** DealNote collects no account or payment information in v1. Your brand profile and outreach tracker are stored only in your browser's local storage and are never sent to us. When you run an audit, our host (Vercel) logs the request as needed to operate and secure the service. We do not collect personal data about the prospects you audit, we do not build or sell lists of businesses, and we do not sell personal information. See our Privacy Policy for the full notice.

**T6 — "Lifetime" (add to "What DealNote is" paragraph, keep the existing sentence):**
> Lifetime means the lifetime of the product. If DealNote is discontinued, lifetime access ends with it, and the refund rule above applies to purchases made within the preceding 14 days.

### 10.3 Template footer (add to the /templates covering email, inside the template box — this is the CAN-SPAM fix)

> [Your name], [Your brand]
> [Postal address — required for commercial email in the US]
> [Phone] · [Email] · [Website]
>
> This is an advertisement. If you do not want marketing email from me, reply with "unsubscribe" or use this link: [unsubscribe link]. I will stop within 10 business days.

### 10.4 /templates sending checklist (add under the covering email template)

> **Before you send — 60-second checklist**
> - [ ] The subject line matches the body (no fake "Re:" or "Fwd:").
> - [ ] The footer has your real name, brand, postal address, and an opt-out.
> - [ ] The findings quoted are the real findings from the audit — no invented figures, no invented dollar loss, no fake case studies.
> - [ ] The recipient is in the US, or — if in Canada, the UK/EU, or Australia — you have consent or a documented consent basis for that country. When in doubt, do not send.
> - [ ] You have checked the recipient against your own do-not-contact list and any opt-outs you have received.
> - [ ] You are sending email only. No SMS.

### 10.5 Placement map

| Page | Add / change | Text |
|---|---|---|
| **Landing (/)** | Pricing card bullet: qualify the PDF bullet | "Teardown PDF and proposal PDF (coming with payment)" |
| **Landing (/)** | Pricing caption: replace comparison line | L2 |
| **Landing (/)** | Hero score block: keep existing weights + "not an industry standard" line; add run-date line | L1 (short form under score) |
| **Landing (/)** | FAQ refund answer: add the email channel | L5 |
| **Landing (/)** | Footer: add contact email link + Privacy Policy link | "Contact: [support email] · Privacy Policy" |
| **/audit** | Under URL box: add robots sentence | L4 |
| **/audit** | Result top: score disclaimer | L1 |
| **/audit** | Brand + tracker sections: local-storage notice | L8 |
| **/audit** | Proposal section: outreach line | L6 (short form) |
| **/audit** | "Could not check" card: keep as is (already correct) | — |
| **/sample** | Top + each section: keep SAMPLE stamps; add run-date + L1 under score | L1, L3 |
| **/sample** | Print stylesheet: verify SAMPLE stamp prints on every page (check before Dec 1) | L3 in print header |
| **/templates** | Top intro: add outreach line | L6 |
| **/templates** | Covering email box: add footer block inside the template | §10.3 |
| **/templates** | Under covering email: add sending checklist | §10.4 |
| **/templates** | Add "No guarantee of client wins" line under the tier cards | L2 last sentence |
| **/terms** | Replace Refund policy | T1 |
| **/terms** | Add Contact section | T2 |
| **/terms** | Acceptable use: add robots bullet | T3 |
| **/terms** | Replace outreach paragraph | T4 |
| **/terms** | Add Data and privacy section | T5 |
| **/terms** | "What DealNote is": append lifetime sentence | T6 |
| **New /privacy** | New page: Privacy Policy (P0) — see §10.6 | — |
| **Report PDF** (paid + sample) | Footer on every page | L9 |

### 10.6 Privacy Policy page (/privacy) — required contents (P0)

A short plain-language page is enough at this scale. It must state, truthfully:

1. Who operates DealNote and how to contact them ([support email]).
2. What is collected: (a) nothing by account (no accounts exist); (b) brand profile + tracker in the buyer's own localStorage only, never sent to the seller; (c) Vercel server logs (IP, user agent, path, timestamp, audited URL in the request) as needed to operate/secure the service, retention per the current Vercel plan (verify and state the period); (d) no cookies in v1; (e) no analytics, no advertising trackers, no third-party scripts in v1.
3. What is NOT collected: no prospect personal data, no lists, no sale/sharing of personal information, no children's data.
4. Why each item is used (operate the audit; remember the buyer's brand on their own device; security/abuse prevention).
5. Who data is shared with: Vercel (hosting/processor) only; no other sharing, no sale.
6. How to delete: clear browser local storage (brand + tracker); email [support email] for log-deletion requests.
7. International transfers: Vercel hosting (state region if known; otherwise "hosted by Vercel in the United States" — verify).
8. Changes: "We will update this page and the date above when anything changes."

---

## 11. Fix list before Dec 1

### P0 — must be done before Dec 1, and before any payment is taken

| # | Fix | Owner action |
|---|---|---|
| P0-1 | **Publish a contact email** in the footer, /terms (T2), landing FAQ (L5), and the fetch User-Agent string. Without this, the refund promise is unclaimable (§3). | Choose the address, add it, test that it receives mail. |
| P0-2 | **Create the refund-request channel**: minimum `mailto:` with pre-filled subject + instructions; better a simple form. Wire Terms T1 to it. Test it end-to-end with a real message. | Add link/form; update Terms (T1, T2). |
| P0-3 | **Publish /privacy** with the contents in §10.6, and link it from the footer and /terms (T5). | Write the page from §10.6; verify Vercel log retention + hosting region first — do not guess them. |
| P0-4 | **Fix the $39/mo comparison**: either name + date the comparator or use L2 ("Example only — compare current prices before you buy"). Remove the word "cheapest" unless it is substantiated and dated. | Edit `app/page.tsx` pricing caption. |
| P0-5 | **Fix the pricing-card PDF bullet**: "Teardown PDF and proposal PDF (coming with payment)" until paid PDF is built and tested. | Edit `app/page.tsx`. |
| P0-6 | **Add the template footer + sending checklist** to /templates (§10.3, §10.4) so a buyer copying the template verbatim is CAN-SPAM-compliant on elements 3–5. | Edit `app/templates/page.tsx`. |

### P1 — do before Dec 1 if possible; otherwise before payment goes live

| # | Fix |
|---|---|
| P1-1 | **Honour robots.txt Disallow**: parse the file for the DealNote UA (fallback `*`); refuse disallowed homepages with the existing no-score pattern; add L4. |
| P1-2 | **Rate limiting + SSRF re-validation** on `/api/audit`: per-IP limit, re-validate the final URL after redirects against the private-range blocklist. |
| P1-3 | **Refund log**: start a sheet (date, report URL, finding disputed, outcome, refund transaction ID) from the first sale. |
| P1-4 | **Local-storage notice** (L8) on /audit; Privacy Policy disclosure of both keys. |
| P1-5 | **Governing-law + liability-cap clause** in /terms — lawyer-drafted, before payment goes live. |
| P1-6 | **Freeze on third-party scripts**: no Ship or Die tracker, TrustMRR, analytics, or chat widget ships without a Privacy Policy entry + consent review (§5.4–5.6). Do not paste any tracker snippet that has not been read. |
| P1-7 | **Verify the SAMPLE stamp prints** on the sample PDF (print stylesheet check). |

### P2 — before scale, or at the next review

| # | Fix |
|---|---|
| P2-1 | Add an 18+ / adult-audience representation to the Terms (COPPA documentation, §8). |
| P2-2 | "Lifetime" qualifier: never use "lifetime" in ads/social without "lifetime of the product." |
| P2-3 | Set a quarterly re-check: state privacy thresholds (esp. Texas SBA size standard once revenue starts; Connecticut's amended thresholds), CAN-SPAM penalty figure, and the COPPA Rule status. |
| P2-4 | If accounts/email capture are ever added: fresh review — privacy thresholds, COPPA, cookie banner, data-broker analysis, and a DPA with Vercel all become live questions. |
| P2-5 | If a "crawl the whole site" or lead-finding feature is ever proposed: fresh review before building (data-broker tripwire, §7.4). |

---

## 12. Sources

Checked 27 Nov 2026. Secondary sources (law-firm alerts, regulator guides) are cited where the primary text was not re-read in full; statute/rule citations are given so a lawyer can verify against the primary text. Nothing in this report was verified by a lawyer.

**Crawling / CFAA / robots.txt / Google**
- *Van Buren v. United States*, 593 U.S. ___ (3 June 2021) — Cooley alert, 9 June 2021, https://www.cooley.com/news/insight/2021/2021-06-09-us-supreme-court-computer-fraud-abuse-act-van-buren ; Clifford Chance, June 2021, https://www.cliffordchance.com/insights/resources/blogs/talking-tech/en/articles/2021/06/scraping-away-at-the-cfaa.html
- *hiQ Labs v. LinkedIn*, 9th Cir., 18 Apr 2022; N.D. Cal. summary judgment 27 Oct 2022; consent judgment 8 Dec 2022 ($500,000) — summarised at https://hproxy.com/blog/is-web-scraping-legal and https://redreplier.com/blog/is-web-scraping-legal?ref=ghost.drevon.dev (both read Nov 2026)
- RFC 9309, Robots Exclusion Protocol (Sept 2022) — "These rules are not a form of access authorization"
- Google Maps Platform, Places API Policies — caching/scraping restrictions §3.2.3, https://developers.google.cn/maps/documentation/places/web-service/policies?hl=en (read Nov 2026)
- 18 U.S.C. §1030 (CFAA)

**FTC / claims / refunds**
- FTC Act §5, 15 U.S.C. §45
- Business Opportunity Rule, 16 CFR Part 437, §§437.1, 437.4 — https://www.govinfo.gov/content/pkg/CFR-2025-title16-vol1/xhtml/CFR-2025-title16-vol1-sec437-4.html
- FTC, Business Guidance Concerning Multi-Level Marketing (staff guidance, updated Apr 2024); FTC Business Blog, 16 June 2026 (earnings/lifestyle claims)
- FTC, Operation AI Comply (25 Sept 2024); Air AI case (Mar 2026)
- FTC Cooling-Off Rule, 16 CFR Part 429 (door-to-door sales; noted as not applicable to online software)

**Outreach**
- FTC, CAN-SPAM Act: A Compliance Guide for Business — https://www.ftc.gov/business-guidance/resources/can-spam-act-compliance-guide-business (penalty up to $53,088/email, FTC inflation adjustment 17 Jan 2025); 15 U.S.C. §§7701–7713; 16 CFR Part 316
- TCPA, 47 U.S.C. §227; *Insurance Marketing Coalition v. FCC*, No. 24-10277 (11th Cir. 24 Jan 2025) (vacating the FCC one-to-one consent rule) — Wiley alert, 27 Jan 2025, https://www.wiley.law/alert-UPDATE-11th-Circuit-Vacates-FCCs-One-to-One-TCPA-Consent-Rule ; FCC revocation rule (effective Apr 2025)
- CASL (Canada), in force 1 July 2014; CRTC enforcement; penalties up to CAD $10M (business) / $1M (individual) — https://tomba.io/blog/casl-cold-email
- UK PECR regs. 22–23; ICO B2B/electronic-mail marketing guidance; UK GDPR — https://sprintlaw.co.uk/articles/soft-optin-email-marketing-using-it-legally-in-britain/ ; https://rhinehartstudio.com/guides/b2b-email-marketing-rules-uk/
- Australia, Spam Act 2003 (Cth); ACMA enforcement (Woolworths $1M+, July 2020) — https://www.legal500.com/intelligence/australia/consumer-protection/spamming-and-the-spam-act

**Privacy / data broker / CIPA / COPPA**
- CCPA/CPRA, Cal. Civ. Code §1798.140 (thresholds: $25M revenue, inflation-adjusted $26,625,000; 100,000 consumers/households; 50% revenue from sale/share) — https://privacyterms.io/ccpa-vs-cpra-key-differences-2026 ; https://www.enzuzo.com/blog/what-is-cpra
- Texas TDPSA, Tex. Bus. & Com. Code ch. 541 (eff. 1 July 2024; no numeric threshold; SBA small-business exclusion; §541.107 sensitive-data sale; $7,500/violation) — https://www.privacylawnetwork.com/states/texas.html ; https://www.kraus.law/glossary/texas-data-privacy-and-security-act/
- State privacy law counts in force late 2026 (19–20 in force; 23–24 enacted; OK/LA/AL/VT effective 2027–28) — https://kukie.io/blog/us-state-privacy-laws-compared ; https://www.complyjet.com/blog/us-state-privacy-laws-list
- California Delete Act (SB 362), Cal. Civ. Code §§1798.99.80–.89; CPPA DROP live 1 Jan 2026, broker retrieval from 1 Aug 2026; Datamasters $42,000 decision 8 Jan 2026 — https://cppa.ca.gov/regulations/pdf/data_broker_reg_delete_act_statute_eff_20260101.pdf ; https://www.legal500.com/intelligence/united-states/privacy/is-your-business-a-data-broker-california's-drop-goes-live-and-calprivacy-continues-to-enforce-delete-act
- CIPA, Cal. Penal Code §§631, 632, 638.51, 637.2 ($5,000/violation); SB 690 (2026) ends private §638.51 suits — https://www.onetrust.com/blog/cipa-litigation-is-accelerating-what-website-tracking-practices-are-getting-wrong/ ; https://news.bloomberglaw.com/legal-exchange-insights-and-commentary/californias-new-web-tool-law-doesnt-let-companies-off-the-hook ; Tucker Ellis alert, July 2026
- COPPA, 15 U.S.C. §§6501–6506; COPPA Rule, 16 CFR Part 312; FTC Jan 2025 Rule update (16 Jan 2025) — https://www.gibsondunn.com/ftc-updates-to-coppa-rule-impose-new-compliance-obligations-for-online-services-that-collect-data-from-children/ ; https://www.fenwick.com/insights/publications/coppas-coming-of-age-key-compliance-changes-in-ftcs-final-rule
- Vercel Analytics (cookieless, no consent gate by default) — https://kukie.io/blog/vercel-netlify-cloudflare-pages-cookies ; https://www.consentstack.io/vendors/vercel-analytics

**DealNote sources (verified 27 Nov 2026)**
- Live site https://dealnote-blue.vercel.app (fetched 27 Nov 2026)
- Repo: `README.md`; `app/page.tsx`; `app/terms/page.tsx`; `app/audit/page.tsx`; `app/sample/page.tsx`; `app/templates/page.tsx`; `app/api/audit/route.ts`; `lib/audit.ts`; `lib/analyze.ts`; `components/footer.tsx`; `components/site.tsx`; `package.json`; branch `dealnote-audit-batch`

## 13. What was NOT verified / open questions for a lawyer

1. The SBA size standard for DealNote's NAICS code (Texas TDPSA shelter) — confirm once revenue starts.
2. Vercel plan, log-retention period, hosting region, and DPA availability — verify in the dashboard; not asserted in this report.
3. Whether DealNote falls inside the FTC Business Opportunity Rule — likely outside, but a lawyer should confirm before any income-adjacent copy is added.
4. Whether the FCC's TCPA revocation rule or any new FCC order after Jan 2025 changes the consent picture — re-check at the next review.
5. SB 690's exact effective date/year and retroactivity challenges — confirm from the statute text.
6. Stripe's requirements (business details, refund handling) once payment is built — not yet applicable.
7. Trademark/domain clearance for "DealNote" — out of scope for this report; README notes it as pending in PLAN.md.

*End of report. General information only, not legal advice. No lawyer was contacted.*
