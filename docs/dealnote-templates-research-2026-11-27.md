# DealNote Template Expansion — Research Plan

Date: 27 Nov 2026. Research only. No code changed, no deploy, no payment touched.
Status: plan for build. Payment stays on hold per Velu. Build order in this file is the recommendation; Velu picks what ships.

## 0. The problem in Velu's words

"For the proposal or the template or other thing, like static make it like more option, more customized option, more template option for that so they won't ever feel it's only less and then they don't have anything choose what they want. or they can edit what they like like that. Ask anyone how the template like that. Don't in the memory and then search in internet how the template need to be like that. Not chat AI basic template."

Translation into a testable rule, agreed by both research streams: a buyer must open two templates and see two structurally different documents, not the same document with a word swapped. Real choice = different structure, different purpose, selectable findings, removable sections, an email sequence. Fake choice = same skeleton, different heading; tone as 30 separate files; colour-only variants.

## 1. Where DealNote stands today (verified from the repo, 27 Nov 2026)

Live: https://dealnote-blue.vercel.app

- `/templates`: 3 tiers (Essential / Growth / Premium) with blank `$____` price inputs, one 10-section structure (cover, what I found, understanding the problem, what I would fix, scope and deliverables, timeline and milestones, investment, about, terms, next step and acceptance), 1 email-only covering email template (auto-fills top 3 audit findings, 1-click copy), 60-second sending checklist, no cold SMS.
- `/audit` proposal generator: editable `$____` blanks, 1-click copy, auto-fill top 3 findings. "What I would fix" is read-only. Only top 3 findings are used; findings 4-10 are invisible. No PDF export; proposal output is plain text only.
- `/sample`: one full sample teardown.
- Audit itself: deterministic code checks, no AI generation. That stays.

## 2. What the research streams said

### 2a. Muse deep research (live web, 27 Nov 2026)

Full notes: `/tmp/templates-deep-research-2026-11-27.md` (not in the repo; sources with URLs and dates for every major claim).

Headline: SaaS leaders market huge libraries, but the counts are not comparable. Better Proposals 260+ (all document types; ~130 proposal templates per its own older blog), PandaDoc 750+ (some secondary sources say 1,000+; its own older page said 450+), Proposify 75+ on its own site (200+/250+ in comparisons), Qwilr 140+ (verified live 27 Nov 2026), Prospero 100+, Bonsai 500+ across all document types (not 500 proposals). One-time packs sell far fewer, honestly counted: Etsy 8-in-1 pack $6, Creative Agency Canva Kit $19-38, Proposal Pack 2,200+ chapters/sections (not whole proposals). DealNote at $49 cannot credibly claim 200+ whole proposals.

Evidence-backed findings:

- Length is a real, researched axis. Proposify State of Proposals 2026 (742,137 proposals, $3.06bn): winning proposals average 11 pages vs 13 for losers, 7 sections; buyers spend 7.72 min on pricing; interactive pricing wins 2x; e-sign +15% close, 60% faster; watched video 3.3x close; first open ~34 min; close ~2.5 days. Fora pack: 1-page / 2-3-page / 4-6-page layouts. Waco3/SoloPad: 1-2 pages best for under-$10k/fast deals. Better Proposals (180,000+ signed): ideal 8 sections across 6 pages; one-page "doesn't work" except for existing clients/small amounts.
- Deal types are a first-class axis. Qwilr Website Proposal Template (new vs redesign, 5-page vs larger build, 3 packages, middle Recommended, extras). ProposalKit free templates with example prices (labelled "example library prices, not market rates"): redesign $6,000, landing $1,800, Shopify $4,200. HubSpot: build vs management/hosting as separate templates.
- Follow-up is a sequence, not one email. RadarLeads 3-touch (bump day 3-4, value-add day 8-10, breakup day 15-18; "3 touches is the ceiling"). GigRadar: one follow-up +65.8% replies, 40% answer only after the 4th touch. Waco3: 7 breakup variants, 15-22% reply claimed (their own claim, not verified).
- Maintenance retainer is the only variant that creates recurring revenue for the buyer. HubSpot's separate Website (management/hosting) template; Rokn maintenance agreement (updates, backups, quarterly restore test, 2 hrs small changes, min 3 months); Waco3 bands $150-400 light / $400-1,200 active / $1,200-2,500 premium (their stated typical ranges, not market rates), pitched as Phase 2 after scope, before total.
- Niche is the #1 organising axis at Better Proposals (25+ industries), Proposify, Qwilr, Prospero. Strongest-evidenced local niches: restaurant, dentist, plumber, roofer, salon/spa, real estate, law, auto repair. A niche variant changes findings language, goals, proof slots and cover, not the 10-section skeleton. Med-spa was NOT evidenced; do not ship it without further research.
- Tone is NOT sold as separate templates anywhere. All vendors handle tone via editable copy/content library. PAS/BAB/AIDA are the named angle frameworks.
- Audit reports converge on one shape: SEOptimer 8 sections + A+ to F scorecard, 100+ checks; Bloomwise 4-page sample (exec summary = 3 findings only, findings table 12-20 lines sorted by impact, Problem/Cause/Fix/Effort/Impact); WhiteSpace 24-page audit (8 criteria 0-10, weighted, 7/30/90-day blueprint); Fable teardown (matchup table, 6 ranked gaps, timestamped evidence); UtilitySEO 12-section template (scope/method, scores, action plan, appendix).
- Editable fields buyers expect: cover + ref/version + 30-day validity; problem/goals in the client's words; countable deliverables; NOT-included list (unanimous, the #1 scope-creep protection); phased timeline with client dependencies; line-item + total price; deposit/milestone terms (50/50 or 40/30/30); revision rounds (standard 2 design / 1 dev); portfolio/proof slots; EMPTY testimonial slots; about/team; plain-English terms (ownership after final payment); next step + signature or "reply YES" acceptance; what is needed from the client.
- Premium signals: specificity (real findings, real numbers, real screenshots), structure matched to the decision, visual proof slots, selectable pricing with middle Recommended, branding actually applied, honest `$____` blanks with guidance on what goes in them, a sending system around the template.
- Generic AI-basic signals (avoid): same 10 sections with different headings and no niche language/numbers/screenshots/proof; invented prices as market rates; invented "% more leads"; invented case studies; no exclusions, no revision limit, no expiry, no payment schedule; "[Insert testimonial here]" with no prompt; one length for every deal.

Deep research's own ranked list (Tier A first): (1) length variants 1-page Short Pitch + 2-3-page Options Proposal; (2) deal types Redesign / New Build / Landing Page / Shopify / Fix-Only Quote; (3) follow-up sequence bump + value-add + breakup; (4) maintenance retainer standalone + Phase 2 block; (5) niche variants x8; (6) audit report formats x3 (1-page exec summary, full scored, competitor comparison); (7) tone switcher as swappable blocks; (8) before/after mockup slot; (9) warm SMS x2; (10) add-ons/extras menu + 3-package pricing block. Suggested honest headline if Tier A+B ship: "16 proposals + 4 emails + 2 SMS + 3 audit reports + editable blocks".

### 2b. Claude Opus miss-check (Antigravity CLI, claude-opus-4-6-thinking, 27 Nov 2026)

Full text: [docs/claude-templates-misscheck-2026-11-27.md](sandbox://workspace/ship-or-die-100k/teardown-generator/docs/claude-templates-misscheck-2026-11-27.md) (45,386 bytes, verbatim). Run took ~5.8 min. Legal flags in it are general information, not legal advice.

Claude's top 10 misses, ranked by impact on "was $49 worth it?":

1. No PDF export. Proposal is plain text only; a pasted Gmail body kills premium positioning. Branded PDF (logo, colours, real audit numbers) is the #1 miss and the single highest-leverage upgrade before launch. Caveat: if 1 Dec is too close to do PDF well, ship plain text with "PDF coming soon"; a bad PDF is worse than none.
2. "What I would fix" is read-only. Buyer cannot edit, delete, reorder or add to the fix list. Claude says this alone would trigger refund requests.
3. Only the top 3 findings are used in proposal and covering email; findings 4-10 are invisible. Fix: buyer-selectable findings (checkboxes, default top 3).
4. Only 1 covering email, no follow-ups; half the outreach workflow is missing. Cold reply rates are 1-8% without follow-ups.
5. One proposal structure for all deal sizes. The 3 tiers are one template with a 3-row pricing table, not 3 templates. A $500 quick-fix pitch is forced through all 10 sections.
6. No per-section editing/toggles. A new freelancer with no case studies is stuck with a blank About section that makes them look amateur.
7. Postal address not in the brand profile, so the CAN-SPAM footer placeholder can go out unfilled. A compliance break, not just UX.
8. 0-findings / clean-site edge case unhandled: buyer gets a proposal with nothing to propose and no guidance.
9. Covering-email auto-fill depends on fragile localStorage; a cleared browser/incognito silently leaves literal `[finding 1]` placeholders that could be sent. Needs a visible warning.
10. No acceptance/contract distinction: current signature lines may accidentally create a binding offer. Claude recommends positioning the proposal as non-binding ("a separate agreement will be provided") and removing signature lines.

Claude's recommended counts: 3 proposal templates (Quick-Fix Pitch 1-page $300-800; Redesign Proposal current 10-section $1,500-5,000+; Retainer Opener $200-500/month, no milestones), clutter threshold 5. 3 covering emails (Cold Intro exists, Warm Intro, Referral Intro), threshold 5. 2 follow-ups (Nudge 3-5 business days, Breakup 7-10 days after nudge), threshold 3 (a 4th is spam). Teardown report variants: 0 at launch (report is deterministic output, not a template), 1 exec summary optional. Subject lines 2-3 per email, threshold 5. Niche language sets 1-2 (trades/home services at launch; general/professional default), threshold 4. Total artefacts ~11-14, clutter threshold ~20-25.

Claude's essential vs bloat: essential = editable fix list, section toggles, PDF, postal-address auto-fill, selectable findings, 1 niche variant. Bloat / do-not-build (13 items in the file): cold SMS templates, 8+ niche variants, AI-generated proposal text, "unlimited revisions", a contract template, competitor-comparison section, dollar-loss estimator, pricing recommendations, multi-email automation, colour picker without PDF, cosmetic report reskins, tone sliders.

Claude's real-vs-fake choice test: variants that are the same skeleton with a niche word swapped are fake choice. Real choice = structurally different documents (1-page vs 10-section), selectable findings, removable sections, an email sequence.

Claude's premium tells: finding-to-fix-to-tier traceability made explicit, real audit numbers quoted verbatim in the proposal (not just the report), niche language, a pre-populated "Not included" list, a named next step with a date blank. Generic tells to delete: "Dear Business Owner", "in today's digital landscape", "leverage cutting-edge technology", "our team of experts", "synergy/holistic/best-in-class".

Legal traps Claude flags for a real lawyer before launch (it explicitly says it is not confident): (a) whether the acceptance/signature section creates binding offers; (b) whether "reply unsubscribe" alone is a sufficient CAN-SPAM opt-out; (c) CASL "conspicuous publication" implied-consent wording.

Assumptions Claude says to verify (8 in the file): buyers actually send proposals as PDF attachments vs email body; 2 vs 3 follow-ups; whether Quick-Fix/Retainer templates match the real deal mix; whether PDF is technically feasible before 1 Dec.

### 2c. Neon audit — NOT RUN

The Neon audit of the live `/templates` page and the `/audit` proposal generator (Gemini Task mode, browser task) was NOT run. Reason: this research was coordinated by a subagent, and subagents have no live-browser access, so the Gemini web-app task could not be started from here. It must be run by the parent agent in the main chat. Neon has audited DealNote before (Task audit 27 Nov 2026, verdict NO-SHIP 4.1/10, full report at docs/neon-dealnote-audit-2026-11-27.html), but it has not seen the template expansion question. Recommended Neon brief when it is run: same brief as Claude (section 2b questions) plus a live look at https://dealnote-blue.vercel.app/templates and /audit, and its own count recommendation. Do not treat this plan as having Neon's verdict until that run exists.

> **NEON HOOK — Phase 1 build, 27 Nov 2026 (branch `dealnote-templates-phase1`, NOT merged, NOT deployed).**
> The Phase 1 build in this branch was done from this research plan + Claude's miss-check only; Neon's templates verdict still had not arrived when the code was written, so nothing in the build claims Neon's agreement.
> WHEN Neon's verdict lands, record it here in this section (date, verdict, score if any, link to the full report) and reconcile it against the Phase 1 scope in section 3a before any merge to main:
> - If Neon confirms the counts (3 proposals + 5 emails) and finds no new launch-blocker, note "Neon agrees, no change" with the date and move to merge review.
> - If Neon adds a template, a fix, or a count change, list each addition here, mark it Phase 1-add or Phase 2, and do NOT merge until the Phase 1-adds are built or explicitly deferred with a reason.
> - If Neon disagrees with a Phase 1 choice (e.g. follow-up count, retainer scope, PDF approach), record the disagreement here and let the parent agent / Velu decide; do not silently rewrite the plan.
>
> **NEON VERDICT LANDED — 27 Nov 2026, during the Phase 1 build.** Full report: docs/neon-dealnote-templates-audit-2026-11-27.md (Gemini Task mode, browser task 29d262c3, 12 min, velu2k03@gmail.com). Neon's verdict: buyers need **18 modular templates (6 deal-type proposals, 6 local-niche overlays, 6 email-only sequence templates)**, selectable findings 1-10, an editable fix list, and branded print-to-PDF. No score given.
>
> **What Neon agrees with (already built in Phase 1):** selectable findings 1-10 with checkboxes; editable "What I would fix" (edit/delete/reorder/add); branded PDF export with logo, brand colour and real audit numbers; postal address in the brand profile; per-section toggles; CAN-SPAM footer on every email including follow-ups; blank `$____` prices with no suggested rates; no fake testimonials (empty slots only); non-binding acceptance (reply-to-accept / next step, no signature lines); no cold SMS; no AI-generated proposal text; no email sending engine. Neon's six "choice too small" triggers are all addressed by Phase 1 items P1-1 to P1-8 except trigger 6's /sample point (see below).
>
> **What Neon adds beyond Phase 1 — Phase 2 candidates, NOT built on this branch:**
> - Deal types 4-6: Local SEO & GBP Refresh; Landing Page / Lead-Gen Funnel; One-Page Fast-Close Quote. (Phase 1 ships 3: Quick-Fix, Redesign, Retainer.)
> - 6 local-niche overlays: Home Services & Trades; Dental, Medical & Clinics; Law Firms & Professional Services; Restaurants & Hospitality; Salons, Barbers & Fitness; Auto Repair & Local Contractors. (Phase 1 ships 0; the plan's Phase 2 already allowed 2 language sets first.)
> - Email 6 (vs Phase 1's 5): a Day 14 breakup (Phase 1: 7-10 days after the nudge), Warm Post-Call Proposal Delivery, and Post-Proposal Nudge (48-72h). Neon cites 42% of cold replies arriving after Email 1 (Lemlist/Instantly 2026).
> - Concise 6-7 section default with a Full (10-section) toggle; 3 tone presets (Direct/Plain-English, Consultative/Warm, Formal/Executive); 1/2/3-tier count toggle with editable tier names.
> - /sample alignment: Neon notes the sample report omits 4 of the 10 template sections (Scope, Timeline, About, Terms). Pre-existing gap, out of Phase 1 scope; fix in Phase 2 or a sample pass, do not block the Phase 1 merge on it.
>
> **Disagreements to decide, not silently rewrite:** Neon prefers a 6-7 section default; Phase 1 keeps the 10-section Redesign with per-section toggles (About off by default). Neon wants 6 emails; Phase 1 ships Claude's 5 (2 follow-ups, breakup at 7-10 days). Neon wants 6 niche overlays at once; the plan (Claude) caps at 2 first, max 4. These are Velu / parent-agent decisions for Phase 2.
>
> **Status: Neon verdict recorded and reconciled. No Neon launch-blocker stands against Phase 1 that Phase 1 does not already build. Phase 1 merge review may proceed; Neon's additions are Phase 2.**

## 3. Reconciled plan — what to build

The two streams agree on the core and disagree on counts. Where they disagree, this plan takes the stricter (Claude) count as the launch scope and the wider (deep research) list as the Phase 2 backlog, because Claude's clutter thresholds are the binding constraint on perceived choice: past ~20 artefacts the buyer spends more time choosing than pitching.

### 3a. Ranked list of template variants to build

PHASE 1 — Launch-critical (before 1 Dec; fixes Claude's top misses 1-7 and 9-10). These are not templates, they are the platform the templates sit on. Without them, more templates are fake choice.

| # | Item | Exact spec |
|---|---|---|
| P1-1 | Branded PDF export | Proposal and teardown export as branded PDF (buyer logo, brand colours, real audit numbers quoted verbatim). Plain-text copy stays. If PDF cannot be done well before 1 Dec, ship plain text labelled "PDF coming soon"; a bad PDF is worse than none. (Claude #1) |
| P1-2 | Editable fix list | In /audit proposal generator: buyer can edit, delete, reorder and add fix items. "What I would fix" must never be read-only. (Claude #2) |
| P1-3 | Selectable findings | Checkboxes on all audit findings, default top 3 checked; proposal and covering email use only the selected findings. (Claude #3) |
| P1-4 | Per-section toggles | Every proposal section can be shown/hidden; About/Terms/Acceptance off by default for a new freelancer with no case studies. (Claude #6) |
| P1-5 | Postal address in brand profile | Add postal address to the saved brand profile; auto-fill it into every email footer. Never sendable blank. (Claude #7) |
| P1-6 | localStorage warning | If no audit findings are stored (cleared browser/incognito), show a visible warning before the covering email can be copied; never copy literal `[finding 1]` placeholders. (Claude #9) |
| P1-7 | Non-binding acceptance | Replace signature lines with: "This proposal is for discussion purposes. A separate agreement will be provided before work begins." plus a named next step with a date blank. Lawyer to confirm before launch. (Claude #10) |
| P1-8 | 0-findings edge case | If the audit finds nothing material, show guidance instead of an empty proposal ("site is in good shape; pitch maintenance/monitoring, not fixes") and route the buyer to the Retainer Opener. (Claude #8) |

PHASE 1 — Templates (the counted library at launch: 3 proposals + 5 emails = 8 artefacts).

| # | Template | Exact spec |
|---|---|---|
| T1 | Quick-Fix Pitch | 1 page. $300-800 quick wins only (speed, SSL, meta tags, broken links). Sections: cover, What I Found (2-3 findings), What I'd Fix (quick wins only), Investment (1 tier, Essential only), Next Step. No About, no Timeline, no Acceptance block. |
| T2 | Redesign Proposal | Current 10-section structure, $1,500-5,000+. All 10 sections, 3 tiers (Essential / Growth / Premium) as the pricing table inside it. |
| T3 | Retainer Opener | $200-500/month ongoing. For a site that is OK but neglected. Sections: cover, What I Found (staleness/neglect, not brokenness), What I'd Do Monthly (maintain, update, monitor), Investment (monthly price, 3-month minimum), Next Step. No milestones, no acceptance block. |
| E1 | Cold Intro email | Exists today. Keep, plus 2-3 subject lines (see 3b). |
| E2 | Warm Intro email | For a prospect already met (event, referral, existing contact). No findings dump: "I took a look at your site, here's one thing I noticed, full report attached." Shorter, warmer, assumes some trust. |
| E3 | Referral Intro email | "Hi [Name], [Referrer] suggested I take a look at your website." Different opening, different social proof, CTA is usually a call, not a report. |
| E4 | Follow-Up 1 (Nudge) | 3-5 business days after first send. Short: "Just checking this landed. Here's the one finding I'd fix first: [finding 1]. Happy to walk you through it in 15 minutes." Same thread. CAN-SPAM footer on every follow-up, not just the first. |
| E5 | Follow-Up 2 (Breakup) | 7-10 business days after E4. Final touch: "I won't keep emailing, if now's not the right time, no worries. If you do want to revisit your site, the report's still valid. [CTA]." Then stop. |

PHASE 2 — Choice expanders (after launch; each must differ in scope or findings, not just cover colour).

| # | Item | Exact spec |
|---|---|---|
| P2-1 | Deal-type scope packs (5) | Scope blocks that slot into T1/T2, not separate files: New Build (brochure site), Redesign (already T2's default scope), Landing Page (single page), Shopify / e-commerce setup, Fix-Only Quote (a QUOTE, not a proposal, for small jobs; Better Proposals precedent: 20 Quote templates for small jobs). Each pack changes scope items, timeline and add-ons, not just the title. Example anchors (labelled EXAMPLE, never market rates): ProposalKit's redesign $6,000 / landing $1,800 / Shopify $4,200 library prices. |
| P2-2 | Niche language sets (start 2, max 4) | Launch sets: (1) Trades / home services ("calls", "jobs", "homeowners", "emergency", "service area") — Claude's #1 niche, deep research's plumber/roofer evidence; (2) General / professional default (dentist/law/real-estate register: "patients", "appointments", "clients"). Next, only with evidence: restaurant ("bookings", "table reservations", "menu not mobile-readable"), salon/spa ("bookings", "clients"). Do NOT ship med-spa (no source found), law, auto repair or others as dedicated variants until researched; the buyer can edit the general template. A niche set changes findings language, goals, proof slots and cover. Same skeleton with one word swapped is fake choice and must not ship. |
| P2-3 | Tone switcher (2 tones, swappable blocks) | Plain-spoken and Professional opening/closing paragraph blocks, pickable inside every proposal and email. Not separate templates. No vendor sells tone as separate templates; PAS/BAB/AIDA are the angle frameworks behind the blocks. Max 2 tones; more is 2x copy maintenance for diminishing returns. |
| P2-4 | 1-page Executive Summary report | Top 3 findings, overall grade, one screenshot slot, single page. A leave-behind for in-person meetings. This is the one report variant Claude allows; deep research's full scored report and competitor comparison are NOT templates (see 3d). |
| P2-5 | Add-ons / extras menu + 3-package pricing block | Reusable block: 3 packages, middle marked Recommended, tickable extras (e.g. SEO setup, copywriting — ProposalKit add-ons $900/$1,200 on a $6,000 base, labelled EXAMPLE). For a static/PDF product the honest version is a tick-box extras table with editable prices, not fake interactivity. Proposify 2026: buyers spend 7.72 min on pricing; interactive pricing 2x win. |
| P2-6 | Maintenance Phase 2 block | Reusable block inside every proposal, after scope, before total: monthly care plan (updates, backups, quarterly restore test, up to 2 hrs small changes, min 3 months, 30-day cancel). Waco3 bands $150-400 / $400-1,200 / $1,200-2,500 labelled typical/illustrative, never rates. Also ships as the standalone Retainer Opener (T3). |

PHASE 3 — Only with care (compliance-gated, see section 5).

| # | Item | Exact spec |
|---|---|---|
| P3-1 | Before/after evidence block | Reusable section holding the freelancer's OWN screenshot/mockup + caption prompt ("What changed, why it matters"). Never auto-generate a fake "after" design or a fake lift %. (WhiteSpace/LandingBoost/Gearside precedent: evidence from the freelancer's own pages only.) |
| P3-2 | Warm SMS follow-ups (2) | Initial follow-up + one bump, under 160 chars, labelled opt-in / prior-relationship ONLY, with STOP + business-hours warnings printed on the template itself. No cold-SMS template, ever. |
| P3-3 | DOCX export | Nice-to-have; PDF covers ~80% of the need. Only after PDF is solid. |

### 3b. Honest headline count (for the /templates page, only when Phase 1 ships)

"3 proposals + 5 emails + editable blocks" — 8 artefacts, every one structurally different. When Phase 2 ships, the honest headline becomes "3 proposals + 5 deal-type scope packs + 2 niche language sets + 5 emails + 1 executive summary + editable blocks". Do NOT claim 200+ templates. Do NOT count tone blocks, pricing blocks or Phase 2 blocks as separate templates. Subject lines: 2-3 per email type (Claude: threshold 5; a freelancer sending ~10 emails/week cannot A/B test more).

Subject lines to ship (Claude's table, kept): Cold Intro — "Your website, reviewed: 3 quick wins for [Business]" (exists), "I found 3 things on [Business].com", "[Business] website — quick audit + suggestions". Warm Intro — "Following up: I looked at [Business].com", "Quick site notes for [Business]". Follow-Up 1 — "Re: Your website review", "The [#1 finding] on [Business].com". Follow-Up 2 — "Last note about [Business].com".

### 3c. What stays static vs editable

| Element | Static (DealNote controls) | Editable (buyer controls) |
|---|---|---|
| Audit findings (what was found, measurements, scores) | Yes — deterministic code output, never edited, never invented | No — buyer selects which findings to feature (P1-3), never rewrites a measurement |
| Fix list ("What I would fix") | No | Yes — edit, delete, reorder, add (P1-2) |
| Prices | Never pre-filled; render as `$____` only (see 5) | Yes — buyer fills every price |
| Timelines | Default week structure (Week 1 Discovery, Weeks 2-3 Design, Weeks 4-6 Development, Week 7 QA and Launch) | Yes — buyer edits week numbers and start date |
| Scope / deliverables | Default countable lists per deal type | Yes — buyer edits items, adds/removes |
| NOT-included list | Pre-populated with concrete examples (content writing, photography, logo design, hosting, ongoing SEO) | Yes — buyer keeps or deletes each line; never a blank "Not included: ____" |
| Testimonial / case-study slots | Empty slots with instructions | Yes — buyer fills with real, verifiable work or deletes the section (P1-4 toggle); slot text must say "Replace with a real project or delete this section" |
| Tone blocks | 2 fixed block sets (plain-spoken, professional) | Yes — buyer picks one, then edits the text |
| Niche language | Fixed per language set | Yes — buyer edits any line |
| Brand (logo, colours, name, contact, postal address) | Stored in brand profile | Yes — buyer edits; logo and colours appear in PDF output (P1-1), not just the UI |
| Terms / payment terms | Default template text + "Edit these terms to match your agreement. This is not legal advice." | Yes — buyer edits; late-fee language flagged for lawyer (see 5) |
| Expiry | Default included: "valid for [14/30] days from the date above" | Yes — buyer fills the number; never omitted |
| Acceptance | Non-binding wording (P1-7) | No signature lines; buyer does not turn the proposal into a contract |

### 3d. What NOT to build (both streams agree, with one disagreement noted)

Do NOT build:

- 200+ near-identical templates by colour/style only. Proposal Pack's 2,200 counts chapters, not proposals; buyers can tell padding from choice.
- Pre-filled testimonials / case studies / "results guaranteed" language. FTC Consumer Reviews and Testimonials Rule, effective 21 Oct 2024 (see 5).
- Pre-filled dollar-loss figures ("you're losing $X/month"). Use a blank formula instead: "[X] missed calls/week x [Y] value = $____".
- A full legal contract sold as part of the proposal without a not-legal-advice disclaimer. Proposal is a sales document, not a contract (Claude's recommendation, option (a)).
- Cold SMS blast templates. Any SMS is warm/opt-in only (P3-2).
- Tone as 30 separate templates (3 tones x 10 niches). Use the Phase 2 tone switcher.
- "Unlimited revisions" as an option or example. Template text: "[2] rounds of design revisions included. Additional revisions or work outside scope will be quoted separately."
- Pricing recommendations or "starting at" prices. DealNote never suggests a price.
- AI-generated proposal text. The product's moat is deterministic audit + the buyer's own words; generated text is the generic AI-basic trap Velu named.
- Colour picker without PDF export. Colours in plain-text copy are meaningless.
- Multi-email automation, revision-limit dropdowns, timeline Gantt charts, 10 subject-line options, DOCX before PDF, cosmetic report reskins, tone sliders. (Claude's bloat list.)

DISAGREEMENT — report variants: deep research recommends +3 audit report formats (1-page exec summary, full scored report, competitor comparison). Claude recommends 0 additional variants (report is deterministic output; a "deeper" audit is an engine change, not a template) with 1 exec summary as the only exception. This plan follows Claude: ship only the 1-page exec summary (P2-4). The full scored report already exists as the audit output itself (add the prioritised findings table — Priority/Effort/Impact/Fix, sorted by impact — to the existing report rather than calling it a new template). Competitor comparison is engine work (needs a second site's audit + side-by-side scores); do not promise it as a template.

DISAGREEMENT — niche count: deep research recommends 8 niche variants; Claude recommends 1-2 language sets, threshold 4, and calls 8+ bloat. This plan follows Claude at launch (2 sets) and treats the other 6 as Phase 2 candidates only if each one is genuinely rewritten (findings language, goals, proof slots), never word-swapped.

DISAGREEMENT — follow-up count: deep research's sources support a 3-touch sequence (bump + value-add + breakup; GigRadar data says 40% answer only after the 4th touch). Claude recommends 2 follow-ups (nudge + breakup) with a clutter threshold of 3, warning a 4th follow-up from a stranger is spam. This plan ships Claude's 2 at launch and keeps the value-add touch (day 8-10, new info such as a competitor move) as the first Phase 2 addition, so the sequence can grow to 3 only after launch feedback.

## 4. Customization controls per template (build checklist)

Every proposal template (T1, T2, T3) ships with: editable fix list (P1-2); selectable findings (P1-3); per-section toggles (P1-4); tone picker, 2 blocks (P2-3); deal-type scope pack picker (P2-1); niche language set picker (P2-2); editable `$____` prices, editable timeline, editable scope; pre-populated NOT-included list; empty testimonial/case-study slots with delete instruction; payment-terms options (50/50 default, 30/40/30 alternative for >$3K deals); expiry line default-included; CTA presets ("Reply to this email", "Book a 15-min call: [link]", "Call me: [phone]"); brand logo/colours/name/contact/postal address from profile, rendered in PDF (P1-1); plain-text copy + PDF export; 2-3 subject lines where the template is emailed.

Every email template (E1-E5) ships with: editable body; selectable findings (E1, E4); tone picker; 2-3 subject lines; CAN-SPAM footer with postal address auto-filled from the brand profile (P1-5), on every email including follow-ups; 60-second sending checklist per touch; same-thread sending note for E4/E5; visible warning if findings are missing (P1-6).

Every report (existing full audit + P2-4 exec summary) ships with: deterministic findings only; prioritised findings table (Priority/Effort/Impact/Fix, sorted by impact); scope/method + audit date + what was checked; before/after evidence slot for the freelancer's own screenshot (P3-1); no invented figures anywhere.

## 5. Legal guardrails for templates (general information, NOT legal advice)

Sources: Claude miss-check section 4 (full text in docs/claude-templates-misscheck-2026-11-27.md); deep research section 5 (/tmp/templates-deep-research-2026-11-27.md); DealNote legal research docs/dealnote-legal-research-2026-11-27.md. A real lawyer must review before launch; Claude explicitly flagged three items it is not confident about (see 2b).

- Prices: every price field renders as `$____` or visually empty. Never `$0`, never `$X,XXX`, never `e.g. $1,500`. An "example" price a buyer forgets to change becomes an unintended binding offer and a refund/support headache. DealNote never recommends a market rate. Example anchors from other vendors (ProposalKit $6,000/$1,800/$4,200; Waco3 maintenance bands) must be labelled EXAMPLE / typical / illustrative, never presented as rates.
- No invented guarantees or results promises. Never / safe replacement table (Claude 4.2): "Guaranteed to increase your calls/bookings/traffic" -> "Designed to make it easier for customers to find and contact you". "You'll see results in X days/weeks" -> "Most changes take effect within [timeframe] of launch" (technical fixes only, never business outcomes). "This will pay for itself" -> remove entirely. "Your competitors are ahead of you" -> "Here's what I found on your site" (never comparative claims without evidence). "You're losing $X per month/day" -> "These issues may be turning away visitors". "I've helped X businesses increase revenue by Y%" -> only with real, verifiable case studies. "#1 web designer in [city]", "Award-winning" (only if real award, year, body), "100% satisfaction guaranteed" -> "14-day replacement guarantee on audit reports" (DealNote's actual guarantee, scoped to the report, not the buyer's client outcomes).
- No fake case studies or testimonials. FTC Consumer Reviews and Testimonials Rule, effective 21 Oct 2024: prohibits reviews/testimonials misrepresenting that they come from a real person, from someone who actually used the product, or misstating the person's experience; prohibits fake/AI-generated reviews attributed to people who don't exist; prohibits insider reviews without clear disclosure. JD Supra summary cites up to $51,744 per violation (figure as published at the time of that summary; verify the current figure before publishing). Bloomberg Law (Nov 2026): AI outputs must be reviewed "as advertising" with a claim-support matrix; "Don't let AI create fake testimonials, fake experiences, or fake independence". Blank slots must say "Replace with a real project or delete this section" and give the format: Client / What you did / Result (only if verifiable, e.g. "site loads in 1.8s, down from 6.2s").
- Guarantee language: "Guaranteed to double your revenue in 30 days!" is cited as not allowed unless there is an enforceable guarantee + solid data that most users achieve it (Treger Consulting FTC summary, citing a $1.7M FTC settlement over outlandish false claims). FileIt maintenance template states plainly "no site can be guaranteed secure". Every template carries: "This template is a starting point, not legal advice. Have a qualified professional review any contract before you use it."
- Payment terms: safe as template text: "50% deposit before work begins, 50% on project completion and approval", with "Edit these terms to match your agreement with your client. This is not legal advice." Unsafe without a lawyer flag: "Payment is due upon receipt" or late-fee percentages; enforceability varies by jurisdiction. Milestone option 30/40/30 is safe as an alternative with the same disclaimer.
- Revision limits and scope: safe: "This proposal includes [2] rounds of design revisions. Additional revisions or work outside the scope described above will be quoted separately." Never "unlimited revisions". NOT-included list must be pre-populated with concrete examples, never a blank "Not included: ____".
- Expiry: default included, never omitted: "This proposal is valid for [14/30] days from the date above." No expiry + acceptance 6 months later can hold the buyer to dead pricing and scope.
- Acceptance/signature: highest-risk area. Either make the proposal explicitly non-binding ("This proposal is for discussion purposes. A separate agreement/contract will be provided before work begins") and remove signature lines, or include enough terms to function as a basic agreement. Recommendation: option (a), non-binding. If DealNote shipped a contract template and a buyer relied on it, DealNote is exposed to "your template lost me $X" complaints. Lawyer must confirm.
- CAN-SPAM: every commercial email (including follow-ups E4/E5) carries the footer: real name, brand, postal address, opt-out, "This is an advertisement", stop within 10 business days. Postal address must come from the brand profile (P1-5), never a placeholder a buyer can send blank. Lawyer questions open: whether "reply unsubscribe" alone is a sufficient opt-out; CASL "conspicuous publication" implied-consent wording.
- SMS: no cold SMS. Warm/opt-in only, with STOP + business-hours warnings on the template itself. US marketing texts via automated systems generally require prior express written consent under TCPA; business texting over local numbers needs A2P 10DLC registration; calling hours 8am-9pm recipient local time.
- No earnings/client-win promises anywhere in template copy or on the /templates page. No guarantee of client wins (already on the site; keep it on every template).
- 0-findings edge case (P1-8) is a legal-adjacent honesty rule: never let the product generate a proposal that invents problems on a clean site.

## 6. Sources

Deep research (full list in /tmp/templates-deep-research-2026-11-27.md; key sources below, all fetched/searched 27 Nov 2026):

- Template counts: Better Proposals https://thedigitalprojectmanager.com/tools/best-free-proposal-software/ and https://betterproposals.io/blog/proposal-management-software/ ; PandaDoc https://papersign.com/e-signature-software/papersign-vs-pandadoc/ ; Proposify https://www.proposify.com/proposal-templates/job-proposal-template ; Qwilr https://qwilr.com/templates/page/2/ (verified live 27 Nov 2026) and https://qwilr.com/templates/website-proposal-template/ ; Prospero https://thesdrlist.com/best/best-proposal-software-for-small-business/ ; Bonsai https://goprospero.com/blog/prospero-vs-bonsai/ ; Proposal Pack https://www.proposalkit.com/htm/in-motion-business-proposal-275.htm ; ProposalKit free https://proposalkit.org/proposal-templates ; HubSpot https://blog.hubspot.com/website/website-design-proposal-example ; Etsy packs https://www.etsy.com/listing/4619306028/8-in-1-business-proposal-template-pack and https://www.etsy.com/listing/4566629581/creative-agency-canva-kit-pitch-deck .
- Length/structure data: Proposify State of Proposals 2026 https://www.proposify.com/blog/sales-closing-statistics (742,137 proposals, $3.06bn) and https://wayneflow.com/guides/proposal.html ; Fora https://fora.so/davidbuilds/proposal-template-pack ; Waco3 https://www.waco3.io/blog/how-to-make-simple-proposal/ ; SoloPad https://solopad-io.vercel.app/blog/one-page-freelance-proposal-template-uk ; Better Proposals https://betterproposals.io/blog/this-is-why-one-page-proposal-templates-dont-work/ .
- Editable fields: https://www.dric.be/what-to-include-in-a-design-proposal-the-9-sections-clients-expect-to-see/ ; https://www.mystackos.com/articles/web-design-proposal-template ; https://www.amariq.com/blogs/website-proposal-template ; https://we.inc/tools/web-design-proposal-template .
- Maintenance: https://rokn.dev/en/templates/website-maintenance-agreement-template ; https://waco3.io/blog/maintenance-retainer-quote/ .
- Follow-ups: https://www.radarleads.app/templates/follow-up-email-template-no-response ; https://gigradar.io/blog/follow-up-email-template ; https://www.waco3.io/blog/breakup-email-resurrection-templates/ ; https://deep-y.com/blog/cold-email-follow-up .
- SMS: https://autocloz.com/cold-email-templates/sms-outreach .
- FTC / what not to include: https://news.bloomberglaw.com/legal-exchange-insights-and-commentary/how-brands-can-build-ftc-compliance-into-ai-marketing-campaigns ; https://www.jdsupra.com/post/contentViewerEmbed.aspx?fid=1dbc9bd9-a6ad-4714-871e-2c54ba093987 ; https://www.blurstudio.ai/knowledge/fake-testimonials-ai-reviews-legal-risk ; https://tregerconsulting.com/blog/ftc-compliance .
- Audit reports: https://www.seoptimer.com/blog/seo-report-sample-pdf/ ; https://www.bloomwise.io/blog/seo-audit-report ; https://utilityseo.com/blog/complete-seo-audit-report-template-guide-with-examples ; https://www.roastmyweb.com/blog/website-audit-report-template ; https://cdn.jsdelivr.net/gh/Ryannn26/whitespace-assets@main/sample-report.pdf ; https://www.fablereports.com/sample/ ; https://gearside.com/tools/competitor-messaging-teardown/solve.php ; https://landingboost.app/before-after .
- Niche bundles: https://mei-review.com/monster-media-bundle/ ; https://glennreview.com/eazyads-local-review/ .

Claude miss-check: [docs/claude-templates-misscheck-2026-11-27.md](sandbox://workspace/ship-or-die-100k/teardown-generator/docs/claude-templates-misscheck-2026-11-27.md), Claude Opus 4.6 (thinking) via Antigravity CLI `~/.local/bin/agy --model claude-opus-4-6-thinking --print=...`, run 27 Nov 2026, ~5.8 min, prompt at /tmp/dealnote-templates-misscheck-prompt.md, full review from CLI brain file ~/.gemini/antigravity-cli/brain/e6538f4b-5609-4c78-ab73-bb77ecd3c125/dealnote-template-review.md, verified verbatim by diff.

Neon audit: NOT RUN (see 2c). Previous Neon audit of DealNote v1: docs/neon-dealnote-audit-2026-11-27.html (Task audit, 27 Nov 2026, NO-SHIP 4.1/10).

DealNote prior research (repo docs, read by both streams): docs/dealnote-legal-research-2026-11-27.md, docs/dealnote-demand-research-2026-11-27.md, docs/dealnote-audit-batch-2026-11-27.md.

Caveats carried from the streams: template counts differ by definition (proposal-only vs all documents vs chapters); ranges given where vendors disagree, vendor's own page preferred. Prices are Nov 2026 list prices and change often; re-verify before publishing any price. FTC $51,744/violation figure is from the JD Supra summary at publication; verify the current figure before publishing. Waco3 breakup reply rates (15-22%), maintenance bands, and WhiteSpace "8-14% lift" are those authors' own claims, not independently verified. Med-spa as a niche was not evidenced. No memory was used in this research, per Velu's instruction; all claims above come from the live web on 27 Nov 2026 and from the two model runs listed here.
