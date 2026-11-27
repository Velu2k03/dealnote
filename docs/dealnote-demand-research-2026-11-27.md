# DealNote — Demand / Reddit Research

**Date:** 27 November 2026
**Product:** DealNote — live at https://dealnote-blue.vercel.app — paste any business website URL, get a white-label teardown report (A–F per category) plus a ready-to-send proposal in about a minute.
**Price:** $49 one-time, 30 audits/month fair-use, no subscription.
**Buyer:** web-design freelancers and small agencies (1–10 people) who pitch redesigns to local businesses.
**Audit scope (per brief):** direct page fetch only. No Google Maps / Places data, no stored business lists, no traffic / ranking estimates.
**Purpose:** report only. No deployment, no external sending.
**How this document relates to RESEARCH.md:** `RESEARCH.md` (27 Nov 2026, same repo) already covers competitor feature lists, the recommended 100-point audit model, Lighthouse / PSI mechanics, PDF generation, white-label fields and proposal structure. This document does **not** repeat that as new. It builds on it with the one question RESEARCH.md did not answer: **is there real demand, at $49, from the stated buyer, and where is the evidence thin?** Where a price or fact below duplicates RESEARCH.md, it is labelled "re-verified 27 Nov 2026" or "carried from RESEARCH.md, not re-checked".

**Method:** public web search (`browser.search` / `browser.open` on results) on 27 Nov 2026. No Reddit account, no live Reddit rules page, no interviews, no survey, no sales data for DealNote itself. Reddit findings below are therefore **second-hand rule summaries** (rule-aggregation sites that read the rules pages in Oct–Nov 2026), not a live check of each subreddit's sidebar. Re-check every rule on the live rules page before posting anything.

---

## 0. Verdict up front

**Demand is real but narrow, and it is demand for the *pitch*, not for the *audit*.**

- **Yes, there is a real job to be done.** Freelancers pitch local businesses every week, and the practitioners who write about it in 2026 converge on the same method: do not open with "Do you need a website?" Open with **one specific, verifiable problem on the prospect's own site** that the owner can check on their phone in 30 seconds. A tool that produces that finding plus a proposal draft in a minute removes the 10–15 minutes of manual free-tool work per prospect (PageSpeed Insights + DevTools + contact checks) that the DEV guide documents, and the 3–5 hours a full manual audit takes that VibeAudit cites. That time saving is the demand.
- **No, $49 is not obviously defensible on the audit alone.** The audit's raw inputs are free: PageSpeed Insights / Lighthouse, GTmetrix Basic, and a human opening the site at 375 px. Every practitioner guide cited below tells freelancers to do exactly that for free in 10 minutes. If DealNote's report reads as a prettier PSI score, buyers will churn to PSI. The $49 only holds if the buyer can see, in the sample report, the two things free tools do not give them: (a) local-conversion checks tied to lost calls / bookings (phone / tap-to-call, CTA above the fold, form on the homepage, trust signals, schema — RESEARCH.md §2), and (b) a ready-to-send proposal with blank price / timeline placeholders, editable before sending (RESEARCH.md §6).
- **The strongest headwind is not a competitor. It is the pitch itself.** Cold email reply rates in 2026 are 1–3% on the pessimistic benchmarks and 3–8% on the average-B2B benchmarks (see §3). A freelancer can buy the best audit tool in the world and still get silence from 95+ of 100 prospects, because owners are saturated with identical "I found a problem on your website" emails, many now AI-written, and Gmail / Yahoo have tightened spam filtering since 2024. DealNote makes each pitch faster; it does not make the inbox less crowded. Any sales copy that implies "buy this and win clients" would be false.
- **The strongest tailwind is arithmetic, not hype.** White-label + proposal is currently gated behind subscriptions: the cheapest white-label audit subscription re-verified today is SEOptimer White Label at $39/month ($468/year); the cheapest white-label + proposal combination is PitchProof Professional at $39.99/month or AuditPilot Agency Pro at $79.99/month. $49 once is 1.25 months of SEOptimer White Label and 0.6 months of AuditPilot Agency Pro. A freelancer who would otherwise subscribe recoups $49 in well under two months. That is a cost comparison, not an earnings claim, and it is the honest pitch.
- **Conversion target implied by the hackathon:** Ship or Die is ranked by verified profit, not by sign-ups. At $49, 20 sales = $980 gross revenue (before payment fees / refunds / tax). There is **no public evidence in this research** for what conversion rate a $49 one-time audit tool for freelancers achieves, and no evidence for how many freelancers will pay $49 rather than use the free 10-minute method. Do not forecast sales from the market-size numbers in §2 — they describe the *prospect* pool (local businesses), not the *buyer* pool (freelancers willing to pay).

**Bottom line for the parent / builder:** proceed to launch on 1 Dec 2026 only if the sample report and the proposal are both visibly better than a free PSI run. If either is thin, $49 will read as a wrapper and the launch will stall. Do not raise the price, do not add a subscription, and do not invent revenue-loss figures to make the report look more valuable.

---

## 1. What was already established (RESEARCH.md, 27 Nov 2026) — summary only

- Competitor prices as found then: SEOptimer White Label $39/mo; WooRank Premium $199.99/mo (white label only there); Ubersuggest Individual $29/mo, lifetime $290; VibeAudit Agency $299/mo (white label + proposal); AuditPilot Agency Pro $79.99/mo (white label + proposal); Roast My Web $12 / $50 / $299 one-time credit packs ($0.75 / $0.50 / $0.30 per audit); GTmetrix PRO Lite $5.99/mo; PSI / Lighthouse free.
- The gap: no incumbent sells teardown + proposal in one step for a *website redesign* (not SEO) at a one-time price.
- The audit model: 6 categories totalling 100 (Speed 20, Mobile 15, On-page SEO 20, Technical 15, Conversion 15, Trust/local/social 15), with ~30 checks.
- The proposal model: 10 sections, problem before price, blank price / timeline placeholders only, editable before sending, "Not included" row, "Investment" not "Cost".
- What kills a sale: looking like a free-tool wrapper; AI-estimated revenue claims; "unlimited" without a stated limit; no sample report before purchase; slow / failed audits; vendor-survival fear at a $49 one-time price.

This document re-verifies the prices in §5 and adds the demand evidence RESEARCH.md did not contain.

---

## 2. Market size — the prospect pool is large; the buyer pool is not measured

### 2.1 Verified facts

| Fact | Source (URL, date) |
|---|---|
| 83% of 131,514 randomly sampled US local businesses with a Google listing list a website; 17% list none. Among those that do, 1.1% link only a Facebook page / directory profile and 8.2% link a site that did not load. Average mobile Performance score **58/100** (69,560 PSI audits). Only **28%** put a contact form on the homepage. 42.3% run no analytics. 6% still serve plain HTTP. WordPress 36.4% of audited sites. | RapidWebLaunch, "The State of Small Business Web Design in 2026", random-sample audit of 131,514 businesses, updated 21 Nov 2026 — https://rapidweblaunch.com/state-of-small-business-web-design |
| The "no website" share depends on what is counted: owner surveys say 17–27% (Clutch 2025: 17% offline; Zippia 2023: 27%); Google Maps listing-field counts say 35–43% (Leadity Q3 2026: 35.9% of 2,782,509 listings; CUFinder Sep 2026: 42.9% of 18.4M US listings; Primavera Nov 2026: 41.9% of 28.0M US listings). Among businesses with at least 5 Google reviews, 21.6% have no website. | DEV, "Five sources say between 17% and 43% of local businesses have no website", published 10 Nov 2026 — https://dev.to/maptosite/five-sources-say-between-17-and-43-of-local-businesses-have-no-website-here-is-what-each-one-2h66 |
| Clutch 2025 survey (406 US small-business owners): 83% have a website (up from 64% in 2018, 71% in 2021); **90% plan to invest in their website in the next 12 months; 58% plan a redesign or visual refresh**; 53% speed improvements; 45% better mobile experience. 81% have redesigned at least once. | Clutch 2025 via PaidHosting, "Website Builder Statistics 2026", updated Nov 2026 — https://www.paidhosting.com/website-builder-adoption-statistics/ |
| SBA Office of Advocacy (Feb 2026): 36,207,130 small businesses in the US; 82.3% (29.8M) have no employees. | Cited in StartFleet, "69 Freelance Statistics", 2026 — https://startfleet.io/statistics/freelance-statistics |
| Freelancing overall: a record 74.9M Americans earn income independently (MBO Partners, State of Independence 2026, Sep 2026); 38% of skilled US knowledge workers freelanced in 2026, up from 28% a year earlier (Upwork Research Institute, Future Workforce Index 2026, Jul 2026); Upwork 18M+ registered freelancers, 717,000 active clients in Q3 2026 (down 10% YoY); Fiverr active buyers 2.7M in Q2 2026 (down 21.9% YoY). | StartFleet, same page as above, citing MBO / Upwork / Fiverr filings |

### 2.2 What these numbers do and do not prove

- **They prove the prospect pool is large and visibly broken.** An average mobile score of 58/100, 72% of homepages with no contact form, and 17% with no website at all mean a freelancer who picks a niche and a city will not run out of sites with a real, checkable problem. The RapidWebLaunch census is the strongest single piece of demand-side evidence in this report because it is a *measured* audit (91,904 sites), not a survey of opinions.
- **They do not prove how many freelancers will pay $49.** No source found in this research counts "web-design freelancers / small agencies who pitch local businesses by cold outreach and buy tools for it". Upwork's 18M registered freelancers cover every category and every country; Fiverr's buyer count is falling. The buyer pool for DealNote is a small, unmeasured slice of that. **Do not multiply 74.9M freelancers × $49, or 36M small businesses × any conversion rate, and present the result as a market size.** That would be invented.
- **The Clutch 58% redesign-intent figure is the most useful demand signal for the *end client*, not the tool buyer.** It says owners are already planning to spend on redesigns. It does not say they will answer a cold email, or that they will hire the freelancer who sent the audit. Treat it as "the money exists" evidence, not "DealNote will capture it" evidence.
- **Estimate (labelled as such):** if a freelancer pitches 30 audits/month (DealNote's fair-use cap) and the cold-email reply benchmarks in §3 hold, they should expect roughly 0–2 replies per month from cold email alone, of which a fraction are positive. That is arithmetic on published benchmarks, not a measured DealNote result, and it is the reason the tool must also be usable for warm leads, follow-ups and sales calls, not only for cold email.

---

## 3. Buyer complaints — what freelancers say is broken about pitching today

These are complaints and practitioner observations found in public writing on 27 Nov 2026. They are quoted / paraphrased with sources; none is a survey with a sample size, and none should be presented as "X% of freelancers say…".

### 3.1 Cold outreach is saturated and low-reply

- **Reply rates:** Belkins' B2B cold-email benchmarks put a typical 2026 campaign at **3–4.5% reply rate, with roughly a third of those replies (30–37%) positive**; asking for time on a first touch cut reply rates by 44% versus asking about interest (Gong Labs, 304,174 sales emails). LeadClaw's help docs put average cold B2B at **3–8%**, below 3% as a targeting / deliverability problem, 0–1% as well below average. LeadPipe puts the 2026 average at **1–3%** and says most of those replies are "not interested". The three sources disagree on the band; the honest range to quote is **1–8%, with 1–3% the pessimistic end**. Sources: https://smartremotegigs.com/why-cold-emails-get-no-replies/ ; https://app.leadclaw.io/kb/troubleshooting/low-reply-rates ; https://www.leadpipe.com/blog/cold-email-challenges-3-steps-to-client-acquisition/
- **Why it fails:** the same generic email ten times a week ("I came across your website and was impressed", "Do you have 15 minutes?"), AI-written outreach that owners now spot in a second, and Gmail / Yahoo sender rules tightened since 2024, so a lazy email can hurt the sender's reputation for every later email. Fix offered by every guide: homework on each business, shown in the first line; under ~120 words; one specific finding with a number; a low-pressure question, not a call ask. Source: https://clickkiwi.com/blog/cold-email-templates-that-get-replies
- **Owner-side fatigue, direct quote (second-hand):** a salon owner in r/smallbusiness wrote that so many people call to sell websites they started wondering whether a business needs a website at all. Cited in DEV Community, "How to Find Web Design Clients as a Freelancer" (Evenleads / Marius Stiuriuc), updated Nov 2026 — https://community.benhalpern.com/marius_stiuriuc_f65afb31a/how-to-find-web-design-clients-as-a-freelancer-1gc8 . That same article ran 37 WordPress sites of local businesses in Iași through PSI in November 2026: **31 had a clear problem** (mobile performance under 50, main content after 4+ seconds, or an obvious SEO gap such as a missing page description); only 5 were already fast. Small sample, one city, one author — directional, not a statistic.
- **The process the guides teach (free, 10–15 min per prospect):** run PSI mobile, open at 375 px in DevTools, check `tel:` links, HTTPS redirect, title / meta / headings, then write one finding as "what I saw + why it matters to a customer + how small the fix is", under 120 words, first line about them, one small question, follow up at most three times. Source: DEV, "Stop asking 'Do you need a website?': the 10-minute audit pitch for freelance web devs" — https://dev.to/digitallyelevated/stop-asking-do-you-need-a-website-the-10-minute-audit-pitch-for-freelance-web-devs-4833 . **This is DealNote's real competitor: a free 10-minute habit, not a paid tool.** DealNote must beat 10 minutes by enough, and produce a visibly better artefact, to justify $49.

### 3.2 The mockup beats the audit (a serious challenge to the product thesis)

- Prospeo's 2026 pitch guide states the **mockup-first cold email is the highest-converting approach** for web designers: spend 1–2 hours building a quick homepage mockup from the prospect's existing content, then email it. One freelancer cited sends 12–15 mockup emails a week and books 3–4 calls consistently. The guide's consensus claim is that this has outperformed every other cold-outreach method for designers since at least 2015 on r/freelance. Source: https://prospeo.io/s/web-design-sales-pitch-example
- **Implication for DealNote:** an audit report tells the owner what is wrong; a mockup shows them what it could look like. A mockup is harder to ignore and harder to fake at scale. DealNote's proposal section partially answers this (it says what the freelancer *would* fix), but it does not show the fix. If early users report "owners liked the report but did not reply", the next feature to test is a before/after visual or a one-screen mockup prompt, not a deeper audit. Do not claim in sales copy that an audit converts better than a mockup — the published practitioner consensus found here says the opposite.

### 3.3 Complaints about the incumbent tools (what buyers dislike today)

| Tool | Complaint found (source, date) |
|---|---|
| SEOptimer | **Monthly crawl limits bite.** White Label allows 10 SEO crawls/month; DIY SEO 4/month on a single website — "a site owner who fixes something on Monday and wants to re-check on Tuesday has used half the month". G2 reviewers (354 reviews, 4.6/5) praise ease of use and detailed reporting but complain about **limited features / incomplete white labelling, monthly crawl / data limits, no competitor benchmarking, no UI/UX analysis**. One reviewer: "The pricing is a bit steep." Another: the share feature "does not use whitelabel link and no ability to password protect". CrawlRaven's review scores SEOptimer 3.7/5 overall — 5/5 as a lead-gen / reporting tool, 2/5 as a site-audit platform: "a $29 to $59/month page grader with superb packaging, not a site auditor". Sources: https://www.aiignitions.com/seoptimer-review (prices checked 29 Sep 2026) ; https://www.g2.com/products/seoptimer/reviews?page=2&qs=pros-and-cons ; https://crawlraven.com/blog/seoptimer-review |
| AuditPilot (auditpilot.us) | **Estimated revenue figures are the risk, not the feature.** Its own copy leans on "estimated lost client revenue" and an "Agency Pro Net ROI: 8,650%" claim ("One client redesign deal covers 2 years of AuditPilot"). Those are estimates, not measurements — the same claim-risk RESEARCH.md §7.2 already flagged. No independent user-review complaint base was found for auditpilot.us in this search; do not invent one. Source: https://auditpilot.us/ (crawled 25 Nov 2026 per search index) |
| VibeAudit (vibeauditapp.com) | **Name collision is itself a complaint risk.** At least five unrelated products call themselves VibeAudit (vibeauditapp.com — UX/CRO audits; vibeaudit.co — code health; vibeaudit.vip / .ca / .sh — security scans; a GitHub security scanner). A buyer searching "VibeAudit pricing" will find the wrong product. For vibeauditapp.com itself, the complaint in the open is structural: white label + proposal are locked behind the $299/mo Agency tier, so a freelancer on Starter ($29/mo) or Pro ($99/mo, per RESEARCH.md) gets no branding at all. Source: https://www.vibeauditapp.com/ |
| Free tools (PSI / Lighthouse / GTmetrix) | **Developer report, not a sales document.** PSI is the credibility anchor, but a local business owner cannot read it and decide to hire the freelancer; GTmetrix is speed-only and unbranded (white-label PDF only on Enterprise / custom). The 10-minute manual method works but is slow and unbranded, and PSI takes 15–40 s per run. Carried from RESEARCH.md §1.2; consistent with every practitioner guide above, which uses PSI as a *step* and then rewrites the finding in plain English. |
| General (all subscriptions) | **Renewal anxiety / vendor survival.** Lifetime-deal research consistently finds buyers weigh "will this exist in 6 months?" and tier limits against the saving — the standard objection to any $49 one-time tool from an unknown seller. Carried from RESEARCH.md §7.2; no new source found 27 Nov 2026 that quantifies it for this category. |

### 3.4 What buyers want in a report (synthesised from the guides, not a survey)

No survey of "what freelancers want in a teardown report" was found. The list below is synthesised from what the practitioner guides *tell freelancers to send*, and from what the incumbents *sell as the differentiator*. Label it as synthesis, not as surveyed demand.

1. **One specific, verifiable finding, with a number** — e.g. "homepage took ~8 s on mobile, PSI 31/100, three uncompressed photos". Not a list of 100 checks.
2. **Plain English tied to a lost call / booking / visit** — no jargon without a one-line explanation; no scare tactics.
3. **Proof the owner can check in 30 seconds** — a screenshot at mobile width, the actual title text, the actual broken URL, the actual LCP value.
4. **A small fix, priced** — the fix should sound small ("roughly a 2-hour fix") so the decision feels small. The proposal's three tiers (Essential / Growth / Premium, middle tier the default pick) match this.
5. **The freelancer's brand, not the tool's** — logo, colours, contact, booking link, no vendor name in the PDF, metadata or share URL. This is the definition of white label in this category.
6. **Editable before sending** — the freelancer rewrites summaries, removes findings that do not fit, adds context only they know. Roast My Web's manual editor is the model RESEARCH.md cites.
7. **What they do *not* want:** invented dollar-loss figures ("you are losing $X/month"), invented traffic / ranking estimates, a ranking promise, or a 100-check dump they cannot explain on a call. All three are refund / dispute risks.

---

## 4. $49 — what makes it defensible, and what makes it not defensible

### 4.1 Strongest argument FOR $49 (the one to lead with)

**White label + proposal currently costs $468–$3,588 a year, every year. $49 once is 1.25 months of the cheapest white-label subscription and 0.6 months of the cheapest white-label + proposal subscription. After that, every report is free to the buyer (within the stated 30/month fair-use limit).**

Re-verified arithmetic, 27 Nov 2026 (see §5 for sources):

- SEOptimer White Label $39/mo = $468/yr. $49 ÷ $39 = **1.26 months**.
- PitchProof Professional $39.99/mo = $479.88/yr. $49 ÷ $39.99 = **1.23 months**.
- AuditPilot Agency Pro $79.99/mo = $959.88/yr. $49 ÷ $79.99 = **0.61 months**.
- VibeAudit Agency $299/mo = $3,588/yr. $49 ÷ $299 = **0.16 months**.
- WooRank Premium $199.99/mo = $2,399.88/yr. $49 ÷ $199.99 = **0.24 months**.
- Roast My Web is the only one-time rival: $50 buys 100 page reviews ($0.50/audit). DealNote at $49 with 30 audits/month breaks even against Roast My Web's $50 pack after **~98 audits** at $0.50 each — but Roast My Web credits never expire and DealNote's 30/month is a recurring cap, so the comparison cuts both ways (see §4.2).

The honest sales line is: **"$49 once. No subscription. No per-report fee. Less than two months of the cheapest white-label audit subscription."** Do not say "one client pays for it" as a promise — a freelancer may pitch ten businesses and close none, and RESEARCH.md §7.1 already forbids that framing.

Secondary supporting points: (a) it replaces the 10–15 min manual method per prospect — at 30 audits/month that is 5–7.5 hours/month of repetitive work; (b) it is a flat, ownable tool, not metered credits — buyers of lifetime deals cite "no monthly bill, no price hikes, no renewal reminders" as the appeal; (c) the local-conversion checks (CTA, tap-to-call, form, trust, schema) are the category incumbents do not systematically do, so the report is not just a prettier PSI score — *if* those checks are actually in the shipped report and visible in the sample.

### 4.2 Strongest argument AGAINST $49 (the one to answer before launch)

**A freelancer can do the core job for free in 10 minutes, and the highest-converting pitch in the practitioner literature is not an audit at all — it is a mockup, which DealNote does not produce.**

Three parts, each verified above:

1. **Free is a real substitute.** PSI / Lighthouse is free, GTmetrix Basic is free, and the DEV guide's 10-minute method uses only free tools. A freelancer pitching 2–3 businesses a month (the volume RESEARCH.md assumes) spends 20–45 minutes a month doing it by hand. $49 saves them under an hour a month. That is a weak saving unless they pitch at volume (10+/month) or value the branded PDF + proposal draft highly.
2. **Roast My Web undercuts $49 for low-volume buyers.** $12 buys 16 page reviews ($0.75/audit) with white label, an editor and batch audits, and no subscription. A freelancer who audits 5 prospects a month pays $12 once and is done for three months. DealNote only wins on price for a buyer who audits *a lot* (98+ audits to beat Roast My Web's $50 pack) or who specifically wants the proposal builder, which Roast My Web does not have.
3. **The audit is not the highest-converting artefact.** Prospeo's guide (see §3.2) says mockup-first beats every other cold-outreach method for designers, with a cited freelancer booking 3–4 calls from 12–15 mockup emails a week. An audit report, however polished, is a list of problems; a mockup is a vision of the fix. If DealNote's launch copy claims audits win clients, a knowledgeable buyer will know the literature says otherwise.

**What would blunt this argument:** a public sample report on a fictional business that a reader can compare side-by-side with a PSI run and see the difference in 30 seconds (local-conversion findings + proposal, not just scores); one free audit before the paywall, as every incumbent offers in some form; and a 30-day refund window (Roast My Web offers 30 days) to neutralise vendor-survival fear. All three are already recommended in RESEARCH.md §7.2 — none is new, but all three are now load-bearing for the $49 price, not optional polish.

### 4.3 Price-sensitivity notes (thin evidence — read as caution, not fact)

- No price-elasticity study for this exact product was found. The nearest analogues are lifetime-deal guides, which say buyers expect break-even in ~5–6 months against a subscription; at $49 against $39/mo, break-even is under two months, which is favourable.
- $49 is *above* Roast My Web's entry ($12) and *below* every white-label subscription's first month except SEOptimer DIY ($29/mo, no white label). It sits in a gap, not on a cliff edge. A $99 or $149 tier for agencies (more audits, team seats) is a later option, not a v1 decision — RESEARCH.md §7.3.
- The 30 audits/month fair-use cap must be stated plainly at checkout next to "One-time payment. No subscription. No per-report fee." If a buyer discovers the cap after paying, it reads as a hidden subscription. Do not promise "unlimited" anywhere.

---

## 5. Competitor prices — re-verified 27 Nov 2026

Prices change frequently. Every price below was re-checked via public search on 27 Nov 2026; the vendor's own pricing page is the authority and should be re-checked before any price is put on the DealNote sales page. "Carried" means the price is from RESEARCH.md and was not re-found in today's search — do not present it as re-verified.

| Tool | Price re-verified 27 Nov 2026 | White label? | Proposal? | Source (URL, date) |
|---|---|---|---|---|
| **Google PageSpeed Insights / Lighthouse** | Free, no account. PSI API free, no paid tier; default quota commonly cited as 25,000 requests/day with a key | No | No | Carried from RESEARCH.md §1.1 |
| **GTmetrix** | Free Basic; PRO Lite **$5.99/mo** ($4.99/mo billed yearly), Core **$11.99/mo** ($9.99/yr), Advanced **$29.99/mo** ($24.99/yr), Expert **$59.99/mo** ($49.99/yr); white-label PDF only on Enterprise / custom | No on listed plans | No | https://recaply.co/tools/gtmetrix (prices checked 8 Nov 2026) ; https://www.g2.com/products/gtmetrix-gtmetrix/pricing (updated 9 Apr 2026) |
| **SEOptimer** | DIY SEO **$29/mo**, White Label **$39/mo**, Lead Generation **$59/mo**; annual ~25% off ($21.75 / $29.25 / $44.25 per mo). White Label: 10 SEO crawls/mo, 3 templates, custom domain. Prices unchanged Jan 2025–Sep 2026 in every capture. | Yes, from $39/mo | No | https://www.g2.com/products/seoptimer/pricing (updated 30 Apr 2026) ; https://www.aiignitions.com/seoptimer-review (pricing page captured 29 Sep 2026) |
| **WooRank** | Lite $19.99/mo ($12.99/yr), Pro **$89.99/mo** ($53.25/yr), Premium **$199.99/mo** ($133.25/yr), Enterprise from ~$249.99/mo / custom | Yes, Premium only ($199.99/mo) | No | https://www.woorank.com/en/p/pricing (vendor page, crawled 25 Nov 2026) ; https://hogonext.com/saas/seo-content/compare?slugs=ubersuggest,woorank |
| **Ubersuggest** | Individual **$29/mo** ($192/yr, $290 lifetime), Business **$49/mo** ($326/yr, $490 lifetime), Agency/Enterprise **$99/mo** ($657/yr, $990 lifetime). Free 3 searches/day. | No | No | https://hogonext.com/saas/seo-content/compare?slugs=ubersuggest,woorank ; https://velotouch.com/top-software-for-seo-analysis-and-auditing/ (prices read from vendor pages 12 Nov 2026) |
| **VibeAudit (vibeauditapp.com)** | Starter **$29/mo** (3 audits/mo, no white label, no screenshots); Pro $99/mo (10 audits/mo, no white label) — Pro price carried from RESEARCH.md, not re-found today; **Agency $299/mo** (unlimited audits fair use, white label, annotated screenshots, revenue-impact projections, AI-generated client proposals) | Yes, Agency only ($299/mo) | Yes, Agency only ("AI-generated client proposals (pitch-ready)"); proposal generator listed as "ALL PLANS" on one part of the page — **contradiction on the vendor's own site, verify before quoting** | https://www.vibeauditapp.com/ (crawled 26 Nov 2026) |
| **AuditPilot (auditpilot.us)** | Starter Hustler **$29.99/mo** (30 audits/mo, cold-email generator, PDF exports, basic pipeline); **Agency Pro $79.99/mo** (unlimited audits, 100% white label, Loom pitch generator, two-tier proposal & pricing builder, full CRM Kanban, Stripe portal); Enterprise **$199.99/mo**. 14-day free trial. | Yes, Agency Pro only | Yes, Agency Pro only | https://auditpilot.us/ (crawled 25 Nov 2026) |
| **PitchProof (pitchproof.ca)** | Starter **$19.99/mo** (50 scans, PitchProof branding — no white label); Professional **$39.99/mo** (white label, 200 scans/mo); Growth **$79.99/mo**. 7-day trial + $1 activation. 30-day money-back on first paid month. One free prospect scan, no card. **Note:** pitchproof.ca (website audit for agencies) is a different product from pitchproof.app (fundraise sparring, $39 one-time Sprint Pack / $99/mo) and pitchproof.org (free pitch-reading aid) — do not confuse them. | Yes, Professional+ ($39.99/mo) | No dedicated proposal builder; report is the sales asset ("use the report where website projects are actually sold" — sales calls, follow-ups, proposals) | https://pitchproof.ca/ (crawled 26 Nov 2026) ; https://pitchproof.ca/free-assessment |
| **Pitchgen (via AIDiveForge listing)** | Starter **$29/mo** (25 credits, white-labelled audits & presentations, pitch decks); Standard **$49/mo** (50 credits); Premium **$99/mo** (125 credits). 7-day free trial. White label is paid-only. Listing last verified ~3 weeks before the search; treat as secondary, not vendor-direct. | Yes, paid tiers | Yes — pitch-deck generator | https://aidiveforge.com/listing/pitchgen/ (listing updated 1 Jun 2026) |
| **Roast My Web** | One-time credit packs, no subscription: **$12** (16 reviews, $0.75/audit), **$50** (100 reviews, $0.50/audit, "RECOMMENDED / Studio"), **$299** (1,000 reviews, $0.30/audit, Agency). 30-day money-back on first purchase. Failed audits return credits. | Yes, on paid packs (logo + "Book a call" button, branded PDF or neutral audits.page link) | No dedicated proposal builder | https://www.roastmyweb.com/for-client-work (crawled 25 Nov 2026) ; https://www.roastmyweb.com/ |
| **PitchSEO (pitchseo.com)** | No verifiable pricing found in search on 27 Nov 2026 — do not quote a price. Different from Pitchbox ($300/mo) and Pitchsite ($29–$49/mo). | Yes (logo, colours, company profile) | Yes (proposal + pitch-deck builder) | Carried from RESEARCH.md §1.1 |

### 5.1 Name collisions to warn the buyer about (and to avoid in DealNote copy)

- **AuditPilot:** at least four unrelated products share the name — auditpilot.us (website audit Chrome extension, the relevant one), auditpilot.aquilaflowai.com / Product Hunt (ISO audit copilot, Solo $39/mo, Pro $69/mo, Team $99/seat/mo), siteauditpilot.com (a *different* website-audit extension, Pro $6.99/mo, Premium $14.99/mo, white label from $6.99/mo), auditpilot.dev (audit engagement platform, private beta), and a Gumroad desktop audit suite ($149). A buyer searching "AuditPilot pricing" can easily land on the wrong one. DealNote copy should link to auditpilot.us explicitly if it names the competitor, and should not quote the ISO product's prices as the web-audit product's.
- **VibeAudit:** see §3.3 — at least five unrelated products.
- **PitchProof:** three unrelated products share the name (see table). Only pitchproof.ca is the website-audit competitor.
- **Pitchgen / PitchSEO / Pitchbox / Pitchsite:** four similar names, four different products. Do not conflate them in comparison tables.

### 5.2 What the price table means for DealNote

- **Cheapest white label in the market today is PitchProof Professional at $39.99/mo, then SEOptimer White Label at $39/mo** — effectively tied. DealNote at $49 once undercuts both after ~1.25 months.
- **Cheapest white label + proposal is PitchProof Professional ($39.99/mo, report-as-proposal-support) or AuditPilot Agency Pro ($79.99/mo, full proposal builder).** DealNote is the only one-time option in this cell — that is its defensible niche, *if* the proposal builder is genuinely usable and not a single template page.
- **Cheapest audit of any kind is free (PSI) or $0.30–$0.75 per audit (Roast My Web).** DealNote cannot win on "cheapest per audit". It wins, if at all, on "cheapest way to *own* the white-label + proposal workflow".

---

## 6. Niches and cities — ranked only where evidence supports a ranking

**No city-level ranking is supported by the evidence found.** No source in this research ranks cities for web-design pitching, and no source gives a per-city count of bad websites with a methodology that could be reused. Any "top 10 cities" list in a launch plan would be invented. What the evidence *does* support is a niche ranking and a *method* for picking a city. Both are given below; the city part is a method, not a ranking.

### 6.1 Ranked niches (evidence-based, strongest first)

Ranking logic, stated so it can be challenged: (a) low website penetration or high share of visibly broken sites, (b) high value per new customer (so a redesign pays for itself), (c) owner reachable (no head office / gatekeeper), (d) customers search online before buying. Sources for the numbers are cited per row; project values are from niche guides (secondary, treat as indicative ranges, not quotes).

| Rank | Niche | Why it ranks here (evidence) | Caveat |
|---|---|---|---|
| **1** | **Trades — plumbers, HVAC, electricians, roofers** | Highest convergence of all four criteria. Project values $3,000–$8,000 (plumbing / HVAC $3,000–$6,000; roofing $3,500–$7,000; general contractors $4,000–$8,000). One job $200–$10,000+. Customers search heavily for local trades. No-website shares: electricians 23% (LeadsByLocation index, Nov 2026), plumbers 19%; RapidWebLaunch census: electricians 71.7% have a website (i.e. 28.3% do not). Multiple guides rank trades #1. | Competition is medium; many trades already get pitched. Roofing has fewer businesses (BLS QCEW 2024: 31,562 roofing establishments vs 122,326 plumbing/HVAC) so the list exhausts faster. |
| **2** | **Auto repair** | **44% have no website** (LeadsByLocation index, Nov 2026) — the highest no-website share in that index. Project $2,000–$4,000, high local-search dependence, owner usually on site. BLS QCEW 2024: 85,889 general auto-repair establishments. | Lower project value than trades; customers often find shops via Maps / word of mouth rather than the website. |
| **3** | **Beauty — hair salons, barbers, spas** | **Lowest website adoption in the RapidWebLaunch census: hair salons 62.6% have a website** (37.4% do not); salons 23% no-website in the LeadsByLocation index. High volume of owner-run shops, easy to reach, visual work photographs well. | Low project value ($1,500–$3,000), low value per customer, recurring but small tickets. Volume niche, not a high-ticket niche. Many salons run on Instagram / booking apps instead of a website — the pitch must be "your booking flow leaks", not "you need a website". |
| **4** | **Home services — cleaning, pest control, landscaping, movers** | Cleaning companies 77.7% have a website (RapidWebLaunch); landscaping 123,133 establishments, cleaning 83,174 (BLS QCEW 2024). Recurring revenue, owner-reachable, customers search locally. | Low–medium job value; cleaning / landscaping sites are often simple and the owner may see little need for a redesign beyond a booking form. |
| **5** | **Dental / med spa / clinics (high ticket, harder)** | Highest customer value: a new dental patient is worth $1,000+; project $4,000–$8,000 (dental), $4,000–$9,000 (dermatology / med spa). Most practices already budget for marketing. But: dentists 76.5% already have a website (RapidWebLaunch), and SiteSeeker rates dentists "Harder" as a first niche — regulated, gatekeepers, longer sales cycles, and many have a decade-old site with no mobile layout or booking, so they are strong *redesign* leads only once the freelancer has a portfolio. | Do not lead with dentists for a first-time freelancer. Target them second, with proof from trades / salons first. |
| **6** | **Chiropractors, physical therapy, vets** | Project $3,000–$6,000, high customer value, high local-search dependence. Similar profile to dental but smaller practices. | Same gatekeeper / portfolio caveat as dental, milder. |
| **7** | **Professional services — personal-injury law, accountants** | Highest project values ($8,000–$15,000 for personal-injury law; accountants $68.0% have a website, so 32% do not). One case can be worth $50,000+ to a firm. | High competition, sophisticated buyers who already get pitched by agencies, longer cycles. Personal-injury law is the highest-ticket niche in the guides and the hardest to win without proof. Accountants are reachable but low urgency — a website is rarely their growth bottleneck. |

Sources for the niche section: https://caplira.com/blog/best-niches-web-design-clients ; https://leadsbylocation.com/blog/best-niches-for-web-design/ (index of 91,000+ local businesses, updated Nov 2026) ; https://siteseeker.ai/blog/web-design-niches (BLS QCEW 2024 establishment counts) ; https://rapidweblaunch.com/state-of-small-business-web-design ; https://reapify.io/blog/most-profitable-niches-web-design ; https://gonovu.com/blog/best-niches-web-design-freelance

### 6.2 Cities — method, not a ranking (evidence is thin)

No evidence was found for a ranked city list. Do not publish one. The method the practitioner guides converge on:

1. Pick **one niche and one city** (DEV / Evenleads guide: "Dentists in one city, or physiotherapists, or car services").
2. Build a list of 20–40 businesses from Google Maps, with website and public contact email. (DealNote cannot supply this list — no stored lists, no Maps data, per the brief. The buyer builds it.)
3. Run each homepage through the audit; keep only sites with **one clear, explainable problem** (mobile score under 50, main content after 4+ seconds, no page title / description, huge images, no tap-to-call, no form).
4. Send 4–5 lines about that one problem, with what fixing it would take and a fixed price.
5. Test the niche in an afternoon before committing a month to it (Caplira's test; SiteSeeker's one-week test).

City characteristics that *would* favour a city, stated as hypotheses to test, not as findings: a mid-size US city (enough businesses in one niche to make a 20–40 list, few enough that national agencies are not already saturating it); a city where the target niche is fragmented owner-operated rather than franchised; English-speaking, US time zones, since the buyer pool and the pricing are USD. **No specific city is named here because no source ranks them.**

### 6.3 What NOT to target

| Do not target | Why (evidence) |
|---|---|
| **Restaurants and cafés** (as a first niche) | Thin margins (3–5% net, per Reapify), owners stretched for time, discovery happens via Google Maps / Yelp / Instagram / delivery aggregators rather than the business website. Caplira: "Look empty but usually aren't — delivery aggregator pages act as their website." Project $1,500–$3,000, low value per customer. |
| **Businesses with no website at all** | DealNote needs a URL to audit. A business with no site cannot be given a teardown. The 17–43% with no website are a *different* product's market (a "we will build you a site" pitch, or Merchynt-style Pitch Sites, which build a homepage from Maps data). Do not count them as DealNote prospects. |
| **Franchises / chains / multi-location businesses** | 16% of audited sites in the RapidWebLaunch census are chains / franchises whose websites come from corporate teams. The local owner cannot approve a redesign. |
| **SaaS / tech companies** | 97% already have a website (RapidWebLaunch, highest adoption); sites are usually fast and professionally built. No visible problem to audit. |
| **Businesses whose site is already fast and complete** | In the Iași sample, 5 of 37 were already fast. Auditing them wastes one of the 30 monthly audits and produces a report with nothing to sell. The workflow must filter them out *before* generating the full branded report. |
| **SEO agencies / in-house SEO teams as buyers** | They need rank tracking, backlinks, multi-page crawls and Search Console / GA4 data — all out of scope for DealNote (RESEARCH.md §2.4). They will compare DealNote to SEOptimer / Semrush and find it thin. The buyer is a *web-design* freelancer selling a redesign, not an SEO selling rankings. |
| **Large enterprises / businesses with 50+ employees as prospects** | The redesign guides put the sweet spot at 10–50 employees and $1M–$10M revenue. Larger businesses have procurement, brand teams and incumbent agencies; a cold audit PDF will not reach the decision-maker. |
| **Regulated professions without a portfolio (first niche)** | Dentists, law firms, financial advisers: high ticket but gatekeepers, compliance concerns, and a need for proof. Target them second, not first. |
| **Anyone the freelancer cannot reach** | If the only contact is a generic `info@` with no named owner, or a contact form behind a login, the pitch is unlikely to land. Prospeo's guide stresses finding the decision-maker's actual email instead of a generic address. |

---

## 7. Reddit — demand signals and no-promotion rules

### 7.1 Demand signals found on / about Reddit

No direct Reddit thread was opened in this research (no Reddit account / live browser in this task). The signals below come from practitioner guides that *cite* Reddit threads, and from rule-aggregation sites that *read* Reddit rules pages. Treat them as second-hand.

- **r/smallbusiness — owner fatigue is visible.** The salon-owner quote in §3.1 ("so many people call to sell websites…") is from r/smallbusiness. It is evidence that owners in that subreddit are *aware* of the pitch and tired of generic versions — which supports the "one specific finding" method and warns against generic audit spam.
- **r/freelance — mockup-first consensus.** Prospeo cites "the consensus on r/freelance" that mockup-first cold email still outperforms every other cold-outreach method for designers since at least 2015. That is a demand signal *against* an audit-only pitch and *for* adding a visual element.
- **r/forhire / r/WebDeveloperJobs / r/slavelabour — warm leads.** The Evenleads guide lists these as sources of warm leads: people already asking for a website. Warm leads "decide faster" than cold outreach. DealNote's buyer should be told to start with warm leads and add cold audit outreach second — the tool serves both, but the guide's ordering matters for the launch story.
- **r/webdev / r/smallbusiness — owners asking questions.** The Evenleads guide notes owners ask web questions in r/smallbusiness and r/webdev. That is a listening opportunity (answer questions, do not pitch), not a posting opportunity.
- **No "I wish there was a tool that…" thread was found.** No Reddit thread was found in this search in which a freelancer asks for a white-label teardown + proposal tool, or complains that SEOptimer / AuditPilot is too expensive, or says they would pay $49 for one. That absence is itself evidence: **demand for this tool is inferred from the workflow (freelancers do audits by hand) and from competitor pricing (freelancers pay $39–$299/mo for adjacent tools), not from freelancers asking for it by name.** Say that plainly in any investor / hackathon narrative. Do not invent a Reddit quote.

### 7.2 No-promotion rules — what affects launch posts

**Status of this table:** rules as read by third-party rule-aggregation sites in Oct–Nov 2026 (LaunchIt, SubredditMarketing, WillItStay, RankHog, Okara, RankCow, Bazzly, MediaFast, GrowReddit, SaaSCity). Reddit's own rules pages were not opened live in this task. **Re-check the live rules page and the pinned threads before posting. Rules change; a removal or ban is the cost of getting this wrong.**

| Subreddit | Size (as cited) | Can you post DealNote? | Where / how, if at all | What gets removed / banned |
|---|---|---|---|---|
| **r/SideProject** | ~848K subscribers (MediaFast); 311K weekly visitors (LaunchIt) | **Yes — best launch subreddit in this set.** Self-promotion is the point of the subreddit, with conditions. | Main feed, any day. Show the real product: working demo, real screenshots, live URL, no email gate. Include the problem it solves, tech stack, what was learned. Engage with every comment. Do not repost without significant updates (space reposts by 2+ weeks). No affiliate links, no "DM me for more" funnelling, no astroturfing (do not pretend to be a random user). | Low-effort "check this out" link drops; pure marketing copy; email-gated / waitlist links with no working product; resold / white-label / dropshipped products presented as "your side project"; repeated reposts. |
| **r/webdev** | 3,328,694 members; 418K weekly visitors | **No, not as a product.** Projects, not products. | **Showoff Saturday only**, with the correct flair, and commercial promotion is *still* banned even then: "Think project, not product. Focus on the technical details of your project." A technical write-up of how DealNote was built (fetch + parse + PSI + PDF) on a Saturday is the only compliant format. No pitch, no pricing, no "buy it" link as the point of the post. | Commercial promotion / solicitation (Rule 4, ban); project / feedback posts on any day but Saturday (auto-removed); excessive self-promotion (Rule 3, Reddit 9:1 rule); low-effort posts. |
| **r/web_design** (note: distinct from r/webdesign) | 18 years old, since Jan 2008 | **No, not as a product.** Same rule set as r/webdev in the RankHog reading: no self-promotion, no commercial promotion / solicitation (ban), feedback only in Feedback Weekend / Showoff Saturday threads. | As r/webdev: a genuine design discussion with no links unless necessary to answer a question; a showcase only on Saturday. | Promoting a design service, tool or agency in any form; commercial solicitation (ban). |
| **r/webdesign** (no underscore) | ~80K members (MediaFast) | **Unclear — no published rules found.** RankHog (20 Nov 2026): "No subreddit-specific rules were displayed on the public rules page" (checked 21 Oct 2026); moderator one-liner is "keep your posts relevant to web design". MediaFast rates self-promo tolerance as "Medium" but notes its snapshot could not be re-verified on 21 Sep 2026. | Treat as high-risk: a case study or feedback request with a live link *may* be accepted, but there is no rule to rely on. Do not make it a launch channel. Check the live sidebar first; if no rules are published, assume the sitewide spam rules and moderator discretion apply. | Spam / unsolicited links; anything not relevant to web design. |
| **r/freelance** | ~708K members; ~30 new posts/day | **No. Self-promotion is banned outright.** | Do not post DealNote. The only compliant route is answering questions in comments with real expertise (tool recommendations, contract / pricing questions) and letting people discover the product via the profile — never a link drop. Even that is high-risk: "thinly framed feedback posts" get removed. | "No advertising or self-promotion" (Rule 1): your app or SaaS, website, portfolio, freelance-site profile, blog post, article mentioning your company, mailing list, Slack group, book, course, code repository, video — any external resource you benefit from. Also: no hiring / soliciting work (use r/forhire), no surveys / market-research questions, no referral / shortened links, no soliciting private messages. Violations: post removed, **permanent ban**. |
| **r/Entrepreneur** | 4.5M members; 240K weekly visitors | **Only in weekly threads.** No promotion in the main feed. | **Thank You Thursday** — promotions, offers, discounts. **Talent Tuesday** — services you offer. **Feedback Friday** — feedback on your website / portfolio. Must comment on others' posts before posting yourself. AI-generated posts / comments are not allowed. | Selling, dropping URLs, "DM me" / "check my profile" anywhere else; violations can mean a permanent ban, and brands can be blacklisted from mentions. |
| **r/smallbusiness** | 1.9M members; 318K weekly visitors | **Only in the weekly thread.** | Weekly **Promote-your-business** thread only. A relevant mention in a reply is allowed, but deliberate promotion outside the thread is not. | Promotion outside the weekly thread. |
| **r/SaaS** | 286K weekly visitors | **Occasionally, rationed.** | Max **1 mention or 3 links every 60 days**, affiliation disclosed. Promotion only inside posts that lead with a lesson, failure, teardown of your own numbers, or a specific question — link in a comment or profile, not the post title. Pure marketing posts are forbidden. | Breaking the 60-day limit "leads to a ban and URL blacklisting". |
| **r/startups** | (not sized in sources used) | **Only in the stickied thread.** | Share Your Startup in the stickied monthly thread. Feedback requests / surveys / polls go in the Feedback Thread or matching weekly thread. | "No direct sales, advertisements, or promotional posts of any kind" outside those threads. |
| **r/indiehackers** | 9.4K weekly visitors | **Yes, once.** | One self-promotion post per product, with the Self Promotion flair. | More than one post per product. |

Sources for the rules table: https://launchit.fast/blog/where-to-promote-your-startup-on-reddit-2026 (rules read 8 Oct 2026, 26 subreddits) ; https://www.subredditmarketing.com/subreddits/webdev (rules read 7 Nov 2026) ; https://willitstay.com/r/webdev ; https://willitstay.com/r/freelance ; https://rankhog.com/subreddits/web_design (checked 25 Nov 2026) ; https://rankhog.com/subreddits/webdesign (checked 20 Nov 2026) ; https://www.rankcow.com/blog/how-to-promote-on-reddit (scan 14 Oct 2026, 1,117 subreddits) ; https://okara.ai/blog/subreddits-that-allow-self-promotion (rules read Sep 2026) ; https://www.bazzly.ai/blog/best-subreddits-indie-saas-founders-2026 ; https://www.growreddit.com/blog/reddit-self-promotion-rules-sideproject ; https://www.mediafa.st/subreddit/sideproject ; https://saascity.io/best-subreddits-for-indie-hackers (moderation rules checked 24 Nov 2026)

### 7.3 Sitewide rules that apply everywhere

- **Reddit Content Policy, Rule 2:** post authentic content in communities where you have a personal interest; do not spam or engage in content manipulation (including vote manipulation, ban evasion, subscriber fraud).
- **Reddiquette / 9:1 (now often cited as 90/10 or 10%):** if more than about 10% of your activity is submitting your own stuff, you read as a spammer. Some communities enforce closer to 99/1. The practical rule from the guides: roughly four genuinely value-driven contributions (answering questions, commenting on launches, sharing a case study with real numbers) for every promotional mention, and at least two weeks of commenting before the first product post on a stricter subreddit.
- **Spam policy:** accounts whose contributions are mostly links to their own business should post less or use self-serve ads. New accounts posting links, URL shorteners and repeated domains are the sitewide spam filter's favourite targets — removals are instant and silent. A brand-new domain (dealnote-blue.vercel.app) posted by a brand-new account is high-risk for silent filtering even in a permissive subreddit.
- **r/SideProject's specific inversion:** the 90/10 rule is deliberately relaxed there because sharing your project *is* the point — but reciprocity replaces it: makers who only drop links and never give feedback to others still fail.

### 7.4 Recommended Reddit launch plan (based on the rules above)

1. **First post: r/SideProject only.** Main feed, Tue–Thu 8–11 AM US Eastern (SaaSCity timing) or Sat–Sun 9 AM–1 PM ET (MediaFast peak). Show the live product, screenshots, the problem, the tech, a real sample report, and a feedback question. No email gate. Reply to every comment.
2. **Second: r/webdev Showoff Saturday** — only as a *technical* write-up ("how I built a white-label teardown in Next.js: direct fetch, PSI, PDF"), not a product pitch. No pricing in the post body.
3. **Third: r/Entrepreneur Thank You Thursday thread** (comment, not a standalone post) and **r/smallbusiness weekly Promote-your-business thread** — short, with the $49 one-time price and the one-free-scan offer, if the thread format allows it.
4. **Never as a launch post: r/freelance, r/web_design, r/webdesign, r/SaaS (outside the 60-day ration), r/startups (outside the stickied thread).** Use r/freelance only for listening and for answering tool-recommendation questions in comments, with disclosure, and only when the product genuinely answers the question.
5. **Do not cross-post the same text to five subreddits in one hour.** That is itself a bannable pattern (vote / spam manipulation). Space posts by days, rewrite for each community, and keep the account's non-promotional activity visible.
6. **Re-check every rule live before posting.** This table is a secondary summary from Oct–Nov 2026. If the live rules page contradicts it, the live page wins.

---

## 8. What would change the verdict

The verdict in §0 ("real but narrow demand") would strengthen if any of the following were measured before or just after launch — none was measured in this research:

1. **Five freelancers use the sample report on a real prospect and report back** — did the owner reply, did the report change the conversation, what did they delete / rewrite? Five conversations are worth more than any market-size table.
2. **A side-by-side test:** the same prospect, one pitch with a PSI screenshot pasted into an email, one pitch with the DealNote PDF + proposal. Which gets a reply? Even 10 prospects per arm would be directional.
3. **A mockup test:** does adding a one-screen "what it could look like" visual to the proposal lift replies versus the audit alone? The literature says it should; DealNote should test it rather than assume it.
4. **Price test:** $49 versus $29 versus $79 as a one-time price, or $49 with a 30-day refund versus without. No evidence in this research for the optimal point — $49 is justified by competitor arithmetic, not by a tested willingness-to-pay curve.
5. **A Reddit post-mortem:** the r/SideProject launch post's upvotes, comments and click-throughs, and whether any buyer came from it. That is the only Reddit demand signal that will be *measured* rather than inferred.

If none of these is done, the launch will be flying on the competitor-price arithmetic alone. That arithmetic is sound, but it is not demand evidence.

---

## 9. Risks and honest limitations of this research

- **No primary research.** No interviews with freelancers, no survey, no DealNote sales / usage data, no Reddit thread opened live. All demand evidence is inferred from practitioner guides, competitor pricing and measured website censuses.
- **Reddit rules are second-hand.** The rules table (§7.2) is built from aggregation sites that read the rules pages in Oct–Nov 2026. Reddit blocks automated reads of rules pages, so at least one aggregator (MediaFast) explicitly says it could not re-verify. Treat every row as "check live before posting".
- **Practitioner guides are marketing.** Prospeo, Evenleads, ClickKiwi and the niche guides sell tools / services of their own. Their conversion claims (e.g. "12–15 mockup emails a week books 3–4 calls") are self-reported by a single freelancer or by the guide's author, not independently verified. They are the best available practitioner evidence, not controlled studies.
- **Cold-email benchmarks disagree.** 1–3% (LeadPipe), 3–4.5% (Belkins via SmartRemoteGigs), 3–8% (LeadClaw). The range is reported honestly here; picking one number would be false precision.
- **Niche project values are indicative.** $3,000–$15,000 project ranges come from niche-marketing guides, not from contracts. They are useful for ranking niches, not for quoting a price to a client.
- **Prices change.** Every price in §5 was checked on 27 Nov 2026 (or carried from RESEARCH.md with that label). Re-verify on the vendor's own pricing page before putting any competitor price on the DealNote sales page. In particular, VibeAudit's own site contradicts itself on whether the proposal generator is Agency-only or all plans, and AuditPilot / VibeAudit / PitchProof each have unrelated namesakes.
- **The RapidWebLaunch census is the strongest dataset here and it has a stated bias:** its sample frame is businesses *with a Google listing*, so businesses with no Google presence at all are not represented. Its industry rankings are built from ten weighted checks of that author's choosing, not an industry standard.
- **No city evidence.** Stated in §6.2. Do not invent a city ranking from this document.

---

## 10. Sources — full list (27 Nov 2026 unless noted)

**Prior research (this repo, not new):**
- `RESEARCH.md` — White-Label Local-Business Website Teardown and Proposal Generator — Research, 27 Nov 2026 (competitor features, audit model, Lighthouse/PSI, PDF, white-label fields, proposal structure, lifetime-deal pricing).

**Demand / pitching / cold outreach:**
- https://community.benhalpern.com/marius_stiuriuc_f65afb31a/how-to-find-web-design-clients-as-a-freelancer-1gc8
- https://dev.to/digitallyelevated/stop-asking-do-you-need-a-website-the-10-minute-audit-pitch-for-freelance-web-devs-4833
- https://prospeo.io/s/web-design-sales-pitch-example
- https://clickkiwi.com/blog/cold-email-templates-that-get-replies
- https://smartremotegigs.com/why-cold-emails-get-no-replies/
- https://app.leadclaw.io/kb/troubleshooting/low-reply-rates
- https://www.leadpipe.com/blog/cold-email-challenges-3-steps-to-client-acquisition/
- http://cursor.directory/plugins/pitch-to-handoff-free-sample

**Market / website census:**
- https://rapidweblaunch.com/state-of-small-business-web-design (updated 21 Nov 2026)
- https://dev.to/maptosite/five-sources-say-between-17-and-43-of-local-businesses-have-no-website-here-is-what-each-one-2h66 (10 Nov 2026)
- https://www.paidhosting.com/website-builder-adoption-statistics/ (updated Nov 2026, citing Clutch 2025)
- https://resources.review42.com/what-percentage-of-small-businesses-have-a-website/
- https://startfleet.io/statistics/freelance-statistics (citing MBO Partners Sep 2026, Upwork Research Institute Jul 2026, SBA Feb 2026, Fiverr Q2 2026, Upwork Q3 2026)

**Niches:**
- https://caplira.com/blog/best-niches-web-design-clients
- https://leadsbylocation.com/blog/best-niches-for-web-design/ (index updated Nov 2026)
- https://siteseeker.ai/blog/web-design-niches (BLS QCEW 2024)
- https://gonovu.com/blog/best-niches-web-design-freelance
- https://reapify.io/blog/most-profitable-niches-web-design
- https://niqis.com/guides/how-to-find-website-redesign-clients-2026
- https://dipoutsourcewebdesign.com/freelance-web-design-niche/

**Competitor prices (re-verified 27 Nov 2026):**
- https://www.g2.com/products/seoptimer/pricing ; https://www.aiignitions.com/seoptimer-review (29 Sep 2026 capture) ; https://www.g2.com/products/seoptimer/reviews?page=2&qs=pros-and-cons ; https://crawlraven.com/blog/seoptimer-review
- https://www.woorank.com/en/p/pricing ; https://hogonext.com/saas/seo-content/compare?slugs=ubersuggest,woorank ; https://velotouch.com/top-software-for-seo-analysis-and-auditing/ (12 Nov 2026)
- https://www.vibeauditapp.com/
- https://auditpilot.us/ ; https://auditpilot.us/features/white-label-reports/
- https://pitchproof.ca/ ; https://pitchproof.ca/free-assessment
- https://aidiveforge.com/listing/pitchgen/
- https://www.roastmyweb.com/for-client-work ; https://www.roastmyweb.com/
- https://recaply.co/tools/gtmetrix (8 Nov 2026) ; https://www.g2.com/products/gtmetrix-gtmetrix/pricing

**Reddit rules (secondary summaries, Oct–Nov 2026 — re-check live before posting):**
- https://launchit.fast/blog/where-to-promote-your-startup-on-reddit-2026 (8 Oct 2026)
- https://www.subredditmarketing.com/subreddits/webdev (7 Nov 2026)
- https://willitstay.com/r/webdev ; https://willitstay.com/r/freelance
- https://rankhog.com/subreddits/web_design (25 Nov 2026) ; https://rankhog.com/subreddits/webdesign (20 Nov 2026)
- https://www.rankcow.com/blog/how-to-promote-on-reddit (14 Oct 2026)
- https://okara.ai/blog/subreddits-that-allow-self-promotion (Sep 2026)
- https://www.bazzly.ai/blog/best-subreddits-indie-saas-founders-2026
- https://www.growreddit.com/blog/reddit-self-promotion-rules-sideproject
- https://www.mediafa.st/subreddit/sideproject ; https://www.mediafa.st/subreddit/webdesign
- https://saascity.io/best-subreddits-for-indie-hackers (24 Nov 2026)
- https://redship.io/blog/reddit-self-promotion-rules

*Prices, rules and benchmarks were found via public web search on 27 Nov 2026 and change frequently. Re-verify every price on the vendor's own pricing page and every subreddit rule on the live rules page before publishing or posting. No sales, conversion or earnings claim in this document is a DealNote measurement — none exists yet.*
