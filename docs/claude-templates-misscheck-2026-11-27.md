# DealNote Template Expansion — Claude Miss-Check

**Source:** Claude Opus 4.6 (thinking), via Antigravity CLI `~/.local/bin/agy --model claude-opus-4-6-thinking --print=...`, run 27 Nov 2026 by a research subagent. Research only; no code changed, no deploy, no payment touched.
**Prompt:** miss-check on the template expansion plan for DealNote ($49 one-time white-label teardown + proposal generator), covering the six questions in the task brief (choice too small, essential vs bloat customization, template counts, legal traps, premium vs generic, flow misses in /templates and /audit).
**Note:** Claude's full text follows verbatim below this header, unedited. Legal flags in it are general information, not legal advice.

---

# DealNote Template Expansion — Independent Miss-Check

> [!IMPORTANT]
> This is a review, not a build plan. No code. No invented facts. Legal flags are general information, not legal advice — where I'm uncertain, I say so and flag it for a lawyer.

---

## 1. What Would Make Buyers Still Feel Choice Is Too Small?

### The Six Failure Modes

**1. Same skeleton, different hat.** If you add "Proposal Template — Plumber" and "Proposal Template — Auto Repair" and the only difference is swapping "pipes" for "brake pads" in one sentence, a buyer will open two templates, compare them, and feel cheated. This is the single most likely failure mode in a template expansion. The niche name in the heading does not constitute a different template.

**2. No fit to deal size.** Right now there are 3 tiers (Essential/Growth/Premium), but all three live inside ONE proposal structure. A $500 quick-fix pitch to a plumber who just needs speed + SSL is a fundamentally different document from a $5,000 full-redesign pitch to a dental clinic. The $500 pitch should be one page, no milestones, no "About" section, no acceptance block. The $5,000 pitch needs all 10 sections. If every template forces the buyer through 10 sections regardless of deal size, the "choice" is fake — it's one template with three price tiers, not three templates.

**3. No connection to audit findings.** The proposal generator auto-fills "What I found" with top 3 findings. But the covering email also auto-fills top 3 findings. If a buyer runs an audit that surfaces 7 findings, and the proposal only uses 3, and the email repeats the same 3, the buyer has no way to reference findings 4–7 in either document. The template "choice" doesn't include choosing which findings to feature. That's a customization gap disguised as a template gap.

**4. No tone fit.** A freelancer pitching a dentist uses different language than one pitching a tattoo parlour. "Your online presence" vs "your site." "Patient acquisition" vs "getting more walk-ins." If every template sounds like the same LinkedIn-polished voice, the buyer will rewrite 60% of it manually, which makes the template worthless. Tone is not "formal/casual" — it's register matched to the prospect's world.

**5. Sections that can't be removed or reordered.** If the 10-section structure is rigid, a buyer who doesn't want Section 8 (About) because they're brand-new and have no past projects is stuck with blank slots that make them look amateur. A section they can't delete is worse than no template at all — it's a template that makes them look bad.

**6. Email templates that only cover first touch.** One covering email is not "choice." A buyer's real workflow is: send email → wait 3–5 days → follow up → wait → follow up once more → stop. If you give them one email, they'll use it once and then write their follow-ups in Gmail freehand. The "template" served exactly one moment in a multi-step process.

### Real Choice vs Fake Choice

| Real choice | Fake choice |
|---|---|
| Different structure (1-page vs 10-section) | Same structure, different heading |
| Different purpose (quick-fix pitch vs full-redesign pitch vs retainer pitch) | Same purpose, different niche word swapped in |
| Different tone register (trades-plain vs professional-clinical) | "Formal" vs "Casual" toggle that changes 4 adjectives |
| Selectable findings (buyer picks which to feature) | Auto-filled top 3, no override |
| Removable sections | Rigid 10-section structure with blank slots |
| Email sequence (first touch + 2 follow-ups) | One email with 3 "variant" subject lines |

**Bottom line:** Buyers feel choice is too small when they open the templates page, compare two options, and can see they're the same document with surface edits. Real choice means structurally different documents for structurally different situations.

---

## 2. Essential vs Bloat — Customization Verdicts

### Field-by-Field Verdicts

| Customization | Verdict | Reason |
|---|---|---|
| **Editable price fields (blank $____)** | **Essential — keep blank** | The entire legal safety of the product depends on DealNote never suggesting a price. Must stay blank. |
| **Editable business name / prospect name** | **Essential** | Already auto-filled from audit. Must be editable in case of typo or "doing business as" mismatch. |
| **Editable CTA text and link** | **Essential** | Already exists in brand profile. Keep. |
| **Editable intro line / "What I found" summary** | **Essential** | The buyer MUST be able to rewrite the opening in their voice. Read-only findings are a problem (see Q6). |
| **Editable "What I would fix" items** | **Essential** | Currently read-only. This is the single most important editing gap. A buyer needs to remove irrelevant fixes, reword others, add one the audit didn't catch (e.g., "your logo is a JPEG from 2008"). |
| **Per-section toggle (show/hide each section)** | **Essential** | A quick-fix pitch doesn't need About, Timeline, or Acceptance. A full-redesign pitch needs all 10. Let the buyer toggle sections on/off. |
| **Tone options (plain / professional / clinical)** | **Nice-to-have** | Useful but hard to execute well. 2 tones max (plain-spoken, professional). More than 2 and you're maintaining 2× the copy with diminishing returns. |
| **Length options (short / full)** | **Essential** | A 1-page quick-fix pitch and a 10-section full proposal are not "length options" — they're different templates. But within a full proposal, short vs verbose per-section is nice-to-have. |
| **Niche variants — Trades** | **Essential** | #1 ranked niche. Language: "calls," "jobs," "homeowners," "emergency," "service area." |
| **Niche variants — Auto repair** | **Nice-to-have** | #2 ranked niche but language overlaps heavily with trades (calls, jobs, local). A trades template with 3 swapped terms covers it. |
| **Niche variants — Beauty/salon** | **Nice-to-have** | "Bookings" replaces "calls," "clients" replaces "customers." Distinct enough to justify a variant, but can wait. |
| **Niche variants — Dental/med spa** | **Nice-to-have** | "Patients," "appointments," "HIPAA-compliant" — genuinely different language. But #5 ranked niche and harder sell. Not launch-critical. |
| **Niche variants — All others** | **Bloat** | Chiropractors, law firms, accountants, vets — too small a segment to maintain a dedicated variant. The buyer can edit a general template. |
| **Logo in proposal output** | **Essential** | Brand profile already stores a logo. It must appear in the proposal output, not just the UI. Currently unclear if the copied plain text includes anything resembling the logo — it can't, because it's plain text. This is a format gap, not a customization gap (see export formats). |
| **Brand colours in proposal output** | **Bloat for plain text / Essential for PDF** | Colours in a plain-text copy are meaningless. If you add PDF export, colours matter. Don't build colour controls without PDF export first. |
| **Postal address auto-fill** | **Essential** | CAN-SPAM requires a postal address. The email template has a placeholder, but the brand profile doesn't collect a postal address. The buyer has to type it every time. Add it to brand profile, auto-fill it into the email footer. |
| **Export: plain-text copy** | **Essential — already exists** | Keep. |
| **Export: PDF** | **Essential** | A proposal sent as pasted plain text in an email body looks amateur. Freelancers need a PDF attachment to look professional. This is the #1 feature gap affecting perceived premium-ness. |
| **Export: DOCX** | **Nice-to-have** | Some buyers want to edit in Word/Google Docs. But PDF covers 80% of the need. DOCX can wait. |
| **Export: print** | **Bloat** | Print-to-PDF exists for the sample. Browser print is free. Don't build a custom print stylesheet. |
| **Subject-line options** | **Nice-to-have** | 3 subject-line variants per email type is enough. More than 5 is A/B testing theatre — a freelancer sending 10 cold emails a week doesn't have the volume to test subject lines. |
| **CTA options (call, meeting link, reply)** | **Essential** | Already exists as a text field. Add 3 preset CTA types: "Reply to this email," "Book a 15-min call: [link]," "Call me: [phone]." |
| **Payment-terms options** | **Nice-to-have** | 50/50 is fine as default. A milestone option (30/40/30) is nice for >$3K deals. Don't build monthly/retainer billing terms — that's a different product. |
| **Revision-limit options** | **Bloat** | "2 rounds of revisions included" is fine as template text. A dropdown with 1/2/3/unlimited revisions is feature-list padding that no buyer will agonise over. |
| **Timeline options** | **Nice-to-have** | The current Week 1/2-3/4-6/7 structure is fine. Let the buyer edit the week numbers. Don't build a Gantt chart. |
| **Proposal expiry options** | **Nice-to-have** | A blank "Valid until ____" is enough. Pre-set 7/14/30 day options are harmless but not essential. |

### What Gets Used vs What Looks Good on a Features List

**Actually used on a real pitch:** editable fix list, section toggles, PDF export, postal address auto-fill, selectable findings, 1 niche variant that matches their market.

**Looks good on a features list but never touched:** 5 tone sliders, 8 niche variants, revision-limit dropdown, timeline Gantt, 10 subject-line options, DOCX export, brand colour picker without PDF.

---

## 3. How Many Templates — Concrete Counts

### Proposal Templates

**Recommended: 3 structurally different proposals (not 3 tiers within 1 proposal).**

The current "3 tiers" (Essential/Growth/Premium) are not 3 templates — they're 1 template with a 3-row pricing table. That's fine for the pricing table, but the buyer also needs:

| # | Template Name | Purpose | Sections |
|---|---|---|---|
| 1 | **Quick-Fix Pitch** | $300–$800 quick wins. Speed, SSL, meta tags, broken links. For prospects with a decent site that just needs polish. | Cover, What I Found (2–3 findings), What I'd Fix (quick wins only), Investment (1 tier only — Essential), Next Step. 1 page. No About, no Timeline, no Acceptance block. |
| 2 | **Redesign Proposal** | $1,500–$5,000+ full redesign. The current 10-section structure. For prospects with a genuinely bad site. | All 10 sections. 3 tiers. Full scope, timeline, terms. |
| 3 | **Retainer Opener** | $200–$500/month ongoing. For prospects whose site is OK but neglected — no blog, stale content, no reviews. The pitch is "I'll keep your site working and growing." | Cover, What I Found (focus on staleness/neglect, not brokenness), What I'd Do Monthly (not "fix" — maintain, update, monitor), Investment (monthly price, 3-month minimum), Next Step. No milestones, no acceptance block. |

**Clutter threshold: 5 proposal templates.** At 5, the buyer spends more time choosing a template than writing the pitch. At 7+, maintenance kills copy quality — you can't keep 7 proposals updated, consistent, and non-generic.

**What happens to the 3 tiers:** They stay inside the Redesign Proposal as the pricing table. The Quick-Fix Pitch gets 1 tier (Essential only). The Retainer Opener gets 1 monthly price line.

### Covering Emails

**Recommended: 3.**

| # | Email Name | Purpose |
|---|---|---|
| 1 | **Cold Intro** (exists) | First-touch cold email with top 3 findings. Current template. |
| 2 | **Warm Intro** | For prospects the buyer has already met (networking event, referral, existing contact). No findings dump — "I took a look at your site, here's one thing I noticed, full report attached." Shorter, warmer, assumes some trust. |
| 3 | **Referral Intro** | "Hi [Name], [Referrer] suggested I take a look at your website." Different opening, different social proof, different CTA (often a call, not a report). |

**Clutter threshold: 5.** Beyond 5 covering emails, you're writing variants of variants. A freelancer sends 1 type of cold email 90% of the time.

### Follow-Up Emails

**Recommended: 2 follow-ups per sequence (so 2 templates).**

| # | Email Name | Timing | Purpose |
|---|---|---|---|
| 1 | **Follow-Up 1** | 3–5 business days after initial send | Short. "Just checking this landed. Here's the one finding I'd fix first: [finding 1]. Happy to walk you through it in 15 minutes." |
| 2 | **Follow-Up 2 (Breakup)** | 7–10 business days after Follow-Up 1 | Final touch. "I won't keep emailing — if now's not the right time, no worries. If you do want to revisit your site, the report's still valid. [CTA]." |

**Clutter threshold: 3 follow-ups.** A 4th follow-up from a stranger is spam. Practitioner consensus is clear: 2–3 follow-ups max for cold outreach, then stop. More than 3 follow-up templates signals "we help you spam people," which is a brand risk AND a legal risk.

**Each follow-up must carry the same CAN-SPAM footer as the initial email.** This is not optional — every commercial email needs it, not just the first one.

### Teardown Report Variants

**Recommended: 0 additional variants at launch.**

The teardown report is deterministic code output, not a template. The buyer doesn't choose a "report style" — they run an audit, they get findings. Adding "report variants" means either (a) the same findings presented differently (cosmetic, wastes dev time), or (b) different audit depths (which is an engine change, not a template). Don't confuse template expansion with engine expansion. If you want a "deeper" audit, that's a v2 engine feature, not a template.

**Exception:** A 1-page executive summary that pulls the top 3 findings, the overall grade, and one screenshot into a single page would be genuinely useful as a leave-behind for in-person meetings. That's 1 variant, not a template category.

### Subject Lines

**Recommended: 3 options per email type.**

| Email type | Subject 1 (default) | Subject 2 | Subject 3 |
|---|---|---|---|
| Cold Intro | "Your website, reviewed: 3 quick wins for [Business]" (exists) | "I found 3 things on [Business].com" | "[Business] website — quick audit + suggestions" |
| Warm Intro | "Following up: I looked at [Business].com" | "Quick site notes for [Business]" | — |
| Follow-Up 1 | "Re: Your website review" | "The [#1 finding] on [Business].com" | — |
| Follow-Up 2 | "Last note about [Business].com" | — | — |

**Clutter threshold: 5 per email.** Beyond 5 subject lines you're doing A/B testing without volume. A freelancer sending 10 emails/week will never know which subject line "won."

### Summary Count Table

| Kind | Recommended | Clutter threshold |
|---|---|---|
| Proposal templates | 3 (Quick-Fix, Redesign, Retainer) | 5 |
| Covering emails | 3 (Cold, Warm, Referral) | 5 |
| Follow-up emails | 2 (Nudge, Breakup) | 3 |
| Report variants | 0 (1 executive summary if time allows) | 2 |
| Subject lines per email | 2–3 | 5 |
| **Total template artefacts** | **~11** | **~20** |

---

## 4. Legal Traps in Editable Templates

> [!WARNING]
> I am not a lawyer. The following is general information based on the prior research provided. Flag each point for a qualified attorney before shipping.

### 4.1 Blank Prices Must Stay Blank

**What breaks if a template ships with a filled-in price:**

- **"Example" price a buyer forgets to change.** If a template says "$1,500" as an example and a buyer sends it unedited, they've made a price offer they may not have intended. If the prospect accepts, the buyer may have a binding contract at a price they picked arbitrarily. This is a liability for the buyer AND a support/refund headache for DealNote ("your template made me quote $1,500 and they accepted").
- **"Starting at" or default price.** Even worse — it implies DealNote is recommending a market rate. If the price is too low, buyers blame DealNote for underpricing them. If it's too high, they blame DealNote when prospects don't respond. Either way, DealNote owns a pricing decision it has no basis to make.
- **FTC risk on DealNote itself.** If DealNote pre-fills prices and markets "$49 to close $5K deals," there's an implied earnings claim. The demand research already flags this: no earnings/client-win promises.

**Rule: Every price field must render as `$____` or be visually empty. Never `$0`, never `$X,XXX`, never `e.g. $1,500`. The placeholder must be obviously unfinished — a buyer should not be able to copy-paste the proposal and have it look complete with a fake price.**

### 4.2 No Invented Guarantees or Results Promises

**Phrases that must never appear in any template, auto-generated text, or example copy:**

| ❌ Never | ✅ Safe replacement |
|---|---|
| "Guaranteed to increase your calls/bookings/traffic" | "Designed to make it easier for customers to find and contact you" |
| "You'll see results in X days/weeks" | "Most changes take effect within [timeframe] of launch" (only for technical fixes like speed, not business outcomes) |
| "This will pay for itself" | Remove entirely. No ROI promise. |
| "Your competitors are ahead of you" | "Here's what I found on your site" (stick to audit findings, never comparative claims without evidence) |
| "You're losing $X per month/day" | "These issues may be turning away visitors" (never invent a dollar-loss figure) |
| "I've helped X businesses increase revenue by Y%" | Only if the buyer has real, verifiable case studies. Blank slot must say "Add your own results here — only use real, verifiable numbers." |
| "#1 web designer in [city]" | Remove. Superlative claims need a basis. |
| "Award-winning" | Only if real award, real year, real awarding body. |
| "100% satisfaction guaranteed" | "14-day replacement guarantee on audit reports" (DealNote's actual guarantee, scoped to the report, not the buyer's client outcomes) |

### 4.3 No Fake Case Studies or Testimonials

**What counts as fake:**
- A "case study" with a business name the buyer made up.
- A testimonial quote attributed to a person who didn't say it.
- Screenshots from a site the buyer didn't build.
- Results numbers ("40% more calls") the buyer can't verify.

**What a blank slot must look like:**

```
[PAST PROJECT — Replace with a real project or delete this section]
Client: [Your client's business name]
What you did: [Describe the actual work]
Result: [Only include if you can verify it — e.g., "site loads in 1.8s, down from 6.2s"]
```

**The slot must include the instruction to delete the section if the buyer has no case studies.** A blank slot that says "Client: ____" without the "or delete" instruction will get sent with "Client: ____" in it, making the buyer look incompetent. The section toggle (Q2) solves this — if About is togglable, a new freelancer just turns it off.

### 4.4 Payment Terms

**Safe as template text:** "50% deposit before work begins, 50% on project completion and approval." This is a starting point the buyer edits. The template should say explicitly: *"Edit these terms to match your agreement with your client. This is not legal advice."*

**Unsafe:** Any template that says "Payment is due upon receipt" or "Late payments will incur a X% fee" without flagging that enforceability varies by jurisdiction. Late-fee clauses, in particular, are regulated differently in different US states, let alone internationally. **Flag for a lawyer:** whether the template should include any late-fee language at all, or just say "Add your own payment terms."

**Milestone option (30/40/30):** Safe to include as an alternative payment structure, with the same "edit to match your agreement" disclaimer.

### 4.5 Revision Limits and Scope Creep

**Safe template text:** "This proposal includes [2] rounds of design revisions. Additional revisions or work outside the scope described above will be quoted separately."

**Trap:** If the template says "unlimited revisions," the buyer has made a promise they can't keep. Never include "unlimited" as an option or example. If a buyer wants to offer unlimited revisions, they can type it in, but the template should not suggest it.

**"Not included" row:** This is one of the best features of the current template structure. It must be prominent and must include concrete examples: "Not included: content writing, photography, logo design, SEO copywriting, social media setup, ongoing maintenance (unless specified in a separate agreement)." A blank "Not included: ____" is useless — give real examples the buyer can keep or delete.

### 4.6 Expiry / Validity

**Safe:** "This proposal is valid for [14/30] days from the date above."

**Trap:** If the proposal has no expiry and the prospect "accepts" it 6 months later, the buyer may be held to pricing and scope that are no longer viable. **The template should default to including an expiry line, not omit it.** A blank expiry is dangerous.

### 4.7 Acceptance / Signature — Offer vs Non-Binding Outline

> [!CAUTION]
> This is the highest-risk legal area in the template. I am not confident in the following analysis — **flag for a lawyer before shipping.**

**The problem:** If the proposal has a signature line and says "Sign below to accept this proposal," it may function as a binding contract (or at least an offer that becomes binding on acceptance). Whether a signed proposal is a binding contract depends on jurisdiction, the specificity of terms, consideration, and intent.

**What the template should do:**
- Either (a) make the proposal explicitly non-binding: "This proposal is for discussion purposes. A separate agreement/contract will be provided before work begins." — in which case the buyer needs a real contract (which DealNote does not provide, and should not), OR
- (b) include enough terms to function as a basic agreement (scope, price, payment, timeline, revisions, IP/usage rights, termination) — in which case DealNote is effectively providing a contract template.

**My recommendation:** Option (a). The proposal should be positioned as a sales document, not a contract. The acceptance section should say: *"Interested? [Next step]. A separate project agreement will be provided before work begins."* Remove the signature lines, or add a prominent note: *"This proposal is not a contract. If both parties agree to proceed, a separate agreement should be signed before work begins."*

**Why:** DealNote is a $49 tool for freelancers. If it ships a contract template and a buyer relies on it, and the contract is deficient (which it will be, because contracts need jurisdiction-specific terms), DealNote is exposed to "your template lost me $X" complaints. Stay in the sales-document lane.

**Flag for lawyer:** Whether the current acceptance/signature wording could be construed as a binding offer in common-law jurisdictions (US, UK, Australia, Canada).

### 4.8 CAN-SPAM Footer

**Current footer:** "This is an advertisement... reply unsubscribe... I will stop within 10 business days."

**Is it sufficient?** Mostly, but check these:

- ✅ Identifies message as an ad — present.
- ⚠️ **Physical postal address** — the footer has a placeholder, but the brand profile doesn't collect a postal address (see Q2). If the buyer doesn't fill it in, the email violates CAN-SPAM. **Fix: make postal address a required field in brand profile, auto-fill it into every email template, and add a checklist item that says "Confirm your real postal address is in the footer."**
- ✅ Opt-out mechanism — "reply unsubscribe" is a valid opt-out mechanism under CAN-SPAM (the sender must monitor and honour it).
- ✅ 10 business days — CAN-SPAM requires honouring opt-outs within 10 business days. Present.
- ⚠️ **"I will stop" — who is "I"?** If the buyer's brand name is "Acme Web Design," the footer should say "Acme Web Design will stop" or "We will stop," not "I" (which leaks that it's a template). Minor, but sloppy.
- ⚠️ **Missing: sender identity.** CAN-SPAM requires the message to identify who is sending it. The footer should include the buyer's brand name, not just the postal address. The brand profile has this — auto-fill it.

### 4.9 Outreach-Law Responsibility — Cross-Border

**The problem:** A US freelancer cold-emailing a Canadian sole trader is subject to CASL, not CAN-SPAM. CASL is opt-in. The email would be illegal.

**What the template/checklist must say:**

The current checklist item ("recipient in US, or if Canada/UK/EU/Australia you have consent or a documented consent basis, when in doubt do not send") is good but needs to be more concrete:

- **Canada (CASL):** "You need consent (express or implied) BEFORE sending. Implied consent exists if their email is conspicuously published AND your message is relevant to their published role. If in doubt, do not send. CASL fines can reach CAD $10M for businesses."
- **UK/EU (PECR + GDPR):** "For individuals / sole traders, you need consent or soft opt-in. For registered companies (Ltd/GmbH), you can email with an opt-out. If you're unsure whether the recipient is a sole trader or a company, do not send without consent."
- **Australia (Spam Act):** "You need consent. Inferred consent from conspicuous publication of an email address may apply, but verify."
- **US (CAN-SPAM):** "Opt-out regime. You can send the first email without consent, but must include the footer, honour opt-outs within 10 business days, and not use deceptive headers or subject lines."

**Flag for lawyer:** The "conspicuous publication" implied-consent rules under CASL and the Australian Spam Act are fact-specific. DealNote should not give a definitive "you can send if the email is on their website" — it should say "this MAY constitute implied consent under [law], but consult a lawyer if you're unsure." The current checklist item is directionally right but could be more cautious.

### 4.10 SMS — Confirm No-SMS Stance

**Correct to exclude SMS.** TCPA requires prior express written consent for marketing SMS. There is no opt-out regime for SMS the way CAN-SPAM provides for email. Cold marketing SMS is effectively illegal in the US without consent.

**If a buyer asks for SMS scripts:** DealNote should not provide them. A help text or FAQ should say: *"DealNote does not include SMS templates. Cold marketing texts require prior written consent under US law (TCPA) and similar laws in other countries. Sending unsolicited marketing texts can result in fines of $500–$1,500 per message."*

### 4.11 Other Traps — Editable Fields

- **Wrong business name.** If the audit auto-fills "Harbor & Pine Plumbing" and the buyer sends it to "Harbor Pine Plumbing" (no ampersand), it's embarrassing but not legally dangerous. If the buyer sends a proposal addressed to the wrong business entirely (copy-paste error from a different audit), it's a credibility disaster. **Mitigation: the copy button should include a prominent "Prepared for: [Business Name]" at the top of the copied text, so the buyer sees any mismatch immediately.**
- **Findings the audit didn't produce.** If the "What I found" section is editable (as recommended in Q2), a buyer could insert "Your site has malware" when the audit found no such thing. This is a false claim about the prospect's business. **Mitigation: label the section "Edit these findings — only include issues the audit actually found. Do not invent problems."** You can't prevent it, but you can instruct against it.
- **Stale findings.** If a buyer runs an audit in November, the prospect fixes their site in December, and the buyer sends the proposal in January with November's findings, the findings are wrong. **Mitigation: include audit date in the proposal text, and a checklist item: "Confirm these findings are still accurate — re-run the audit if more than 2 weeks old."**

---

## 5. What Makes Templates Feel Premium vs Generic AI-Basic

### Premium Tells — What Must Be Present

1. **Finding-to-fix-to-price traceability.** Each finding in "What I found" maps to a specific fix in "What I would fix," and that fix is tagged to a tier. The reader can trace: "Missing meta descriptions → Add meta descriptions to all 8 pages → Included in Essential tier." This is what separates a proposal from a checklist. **Currently partially present (findings auto-fill, fixes auto-generate and are grouped), but the mapping is implicit, not explicit. Make it explicit: each fix should reference which finding triggered it.**

2. **Real numbers from the audit, quoted verbatim.** "Your homepage loads in 6.2 seconds" is premium. "Your site is slow" is generic. The audit produces real numbers (load time, missing alt tags count, missing meta descriptions count, broken links count). **These numbers must appear in the proposal text, not just the audit report.** If the proposal says "your site has issues" instead of "your homepage loads in 6.2s, 4 images have no alt text, and your contact page returns a 404," it's generic.

3. **Niche language.** "Customers who search for 'emergency plumber near me' won't wait for a 6-second page to load — they'll call the next result" is premium for a trades prospect. "Users may leave your site" is generic. **This is where the 1–2 niche variants (trades, general) earn their keep: the niche variant replaces generic terms with industry terms throughout.**

4. **A "Not included" list that proves scope discipline.** "Not included: logo design, copywriting, photography, social media setup, ongoing SEO, hosting management." This is counterintuitive — listing what you DON'T do makes you look more professional than listing what you do. **Currently described in the template structure (Section 5) but must be pre-populated with real examples, not blank.**

5. **A named next step with a date blank.** "Reply to this email by [date] to schedule a 15-minute call" is premium. "Contact me if interested" is generic. **Currently present as CTA + expiry placeholder. Good.**

6. **The owner's own brand throughout.** Logo, name, contact info, colours — in the PDF, not just the UI. **Currently: brand profile exists but logo can't appear in plain-text copy. PDF export is the fix.**

### Generic Tells — What Must Be Removed

| Generic tell | Fix |
|---|---|
| "Dear Sir/Madam" or "Dear Business Owner" | Use "[First Name]" or "[Business Owner's Name]" with a note to find the real name |
| "Your online presence could be improved" | Replace with a specific finding from the audit |
| "We offer a range of services" | Delete. The proposal describes one specific project. |
| "Our team of experts" | The buyer is a freelancer or tiny agency. "I" or "we" with no puffery. |
| "Leverage cutting-edge technology" | Delete. Name the actual technology (WordPress, Webflow, Next.js) or say nothing. |
| "In today's digital landscape" | Delete. |
| "Synergy," "holistic approach," "best-in-class" | Delete all. |
| Sections with lorem-ipsum-length filler | Every sentence must carry information or be deletable. |
| Identical paragraph structure across all templates | Vary sentence length, opening structure, section order between templates |

### The Single Highest-Leverage Premium Upgrade Before Launch

**PDF export with the buyer's logo, brand colours, and real audit numbers baked in.**

Reason: A plain-text proposal pasted into a Gmail body looks like a cold email. A branded PDF attachment looks like a professional document. This single feature is the difference between "I pasted some stuff from a tool" and "I prepared a proposal for you." It's also what every subscription competitor (SEOptimer, AuditPilot) offers. Without it, $49 feels like paying for copy-paste, not a tool. With it, $49 feels like paying for a branded deliverable.

If truly only one thing can ship: **branded PDF export of the proposal, with logo, audit numbers, and finding-to-fix mapping.**

---

## 6. Flow Misses in /templates and /audit Proposal

### Ranked by Severity

#### SEVERITY: CRITICAL (would cause refunds)

**1. "What I would fix" is read-only.**
The buyer cannot edit, remove, or reorder the fix list. If the audit finds "missing alt text on 12 images" and the buyer is pitching a $500 quick-fix, they might not want to include a full alt-text overhaul. They can't remove it. If the audit finds something the buyer disagrees with or can't deliver, they can't remove it. This makes the proposal generator a liability, not a tool.

**Fix:** Make the fix list editable. Each item: editable title, editable detail, delete button, drag to reorder, add custom item button.

**2. No PDF export.**
The proposal copies as plain text. No logo, no formatting, no colour, no visual hierarchy. A freelancer sending a plain-text proposal in a Gmail body to a business owner is competing against agencies sending branded PDFs. The $49 value evaporates.

**Fix:** PDF export with logo, brand colours, section headers, and a professional layout.

**3. Proposal only uses top 3 findings.**
The audit may surface 5–10 findings. The proposal "What I found" uses only the top 3. The covering email also uses the top 3. Findings 4–10 are invisible in the outreach. The buyer paid for a full audit but can only use 3 findings in their pitch.

**Fix:** Let the buyer select which findings to include (checkboxes). Default to top 3, but allow up to all findings.

#### SEVERITY: HIGH (would reduce perceived value)

**4. Brand profile doesn't collect postal address.**
CAN-SPAM requires a postal address. The email footer has a placeholder, but the brand profile (name, contact, logo, colours, CTA, intro line) doesn't include a postal address field. The buyer has to manually type it every time, or worse, forgets and sends a non-compliant email.

**Fix:** Add postal address to brand profile. Auto-fill into every email template footer.

**5. No follow-up email templates.**
The buyer sends one email and then... nothing. No follow-up sequence. Cold email reply rates are 1–8%. Without follow-ups, the buyer gets 1–3 replies per 100 emails. With 2 follow-ups, reply rates typically double. The lack of follow-ups cuts the buyer's ROI in half.

**Fix:** Add 2 follow-up templates (see Q3).

**6. Teaser/free audit locks the proposal.**
A free-audit user sees only 2 findings and cannot access the proposal generator. This is correct gating. But what happens when a teaser user buys a licence key — do they have to re-run the audit? If yes, is there any friction (re-entering the URL, waiting for re-fetch)? If the teaser findings are cached, does the full audit use the cached fetch or re-fetch? **If the user has to re-audit the same site after paying, that's a bad first-five-minutes experience.**

**Fix:** After licence activation, unlock all findings from the already-completed audit without requiring a re-run. If this isn't possible technically, make the re-run one click with the URL pre-filled.

**7. 0 findings / clean site — unhandled edge case.**
If the audit finds nothing wrong (fast site, good mobile, all meta tags present, no broken links), the proposal generator has nothing to propose. The buyer paid $49 and can't use the tool on this prospect. No error message, no guidance, no "this site is too good for a teardown pitch — try a different prospect."

**Fix:** Show a clear message: "This site scored well across all checks. A teardown pitch may not be effective for this prospect. Consider a different approach (e.g., content strategy, ongoing maintenance) or try a different prospect." Don't generate a proposal with 0 findings.

#### SEVERITY: MEDIUM (friction, not dealbreaker)

**8. No per-section editing in the proposal generator.**
The /audit proposal generator assembles plain text. The buyer can't edit individual sections before copying. They have to copy, paste into a text editor, edit there, then paste into their email/PDF tool. This defeats the purpose of a "generator."

**Fix:** Each section of the proposal should be editable inline before copy/export.

**9. Covering email auto-fill depends on localStorage key.**
If the buyer clears their browser data, switches browsers, or uses incognito mode, the auto-fill breaks. The email shows [finding 1/2/3] placeholders instead of real findings. The buyer may not notice and send a template with literal "[finding 1]" in it.

**Fix:** Show a prominent warning if findings aren't populated: "⚠️ No audit findings found. Run an audit first, or manually replace [finding 1], [finding 2], [finding 3] below." Better: show the placeholder text in a visually distinct style (red, highlighted) so it's obviously unfinished.

**10. Outreach tracker is localStorage-only.**
Tracker data (Not Sent / Sent / Replied / Closed) is lost on browser clear, device switch, or incognito. For a tool that costs $49, losing your outreach history is frustrating. This isn't a template miss, but it affects the perceived value of the entire flow.

**Fix (not launch-critical):** Add a JSON export/import for the tracker. Not a cloud sync — just a downloadable file. Saves the buyer from total data loss.

**11. Sample report uses fictional business — but is it obviously fictional?**
"Harbor & Pine Plumbing" with a .example domain and 555 phone is correct. But does the sample report UI look identical to a real report? If a buyer screenshots the sample and sends it to a prospect, thinking it's their audit, that's a credibility disaster.

**Fix:** Watermark the sample: "SAMPLE REPORT — NOT A REAL AUDIT" across every section, not just at the top.

**12. Mobile/UX: brand profile + proposal generator likely need mobile-responsive layouts.**
If a buyer is at a networking event and wants to show a prospect a sample or run a quick audit on their phone, the tool must work on mobile. Unclear from the description whether the /audit and /templates pages are mobile-responsive.

**Fix:** Verify mobile responsiveness of /audit, /templates, and the proposal generator. At minimum, the sample report and covering email copy should work on mobile.

---

## Top 10 Misses — Ranked by Impact on "$49 Worth It?"

| Rank | Miss | Fix |
|---|---|---|
| 1 | No PDF export — proposal is plain text only | Add branded PDF export with logo, colours, section headers |
| 2 | "What I would fix" is read-only — buyer can't edit their own proposal | Make fix list editable: edit, delete, reorder, add custom items |
| 3 | Only top 3 findings used in proposal/email — rest wasted | Let buyer select which findings to include (checkboxes, default top 3) |
| 4 | Only 1 email template, no follow-ups — half the outreach workflow missing | Add 2 follow-up templates + 2 additional covering email variants |
| 5 | 1 proposal structure for all deal sizes — $500 pitch forced through 10 sections | Add Quick-Fix (1-page) and Retainer proposal templates |
| 6 | No per-section editing — can't remove About section if no case studies | Add section toggles (show/hide) and inline editing |
| 7 | Postal address not in brand profile — CAN-SPAM footer breaks | Add postal address to brand profile, auto-fill into emails |
| 8 | 0-findings edge case unhandled — buyer stuck with nothing to propose | Show "site is healthy" message with guidance |
| 9 | Findings auto-fill depends on fragile localStorage — silent failure | Add visible warning when findings aren't populated |
| 10 | No acceptance/contract distinction — proposal may accidentally be binding | Add "this is not a contract" language, remove signature lines or add disclaimer |

---

## Recommended Template-Count Table

| Kind | Count | Names / Purposes | Clutter threshold |
|---|---|---|---|
| **Proposal templates** | 3 | Quick-Fix Pitch (1-page, 1 tier), Redesign Proposal (10-section, 3 tiers), Retainer Opener (monthly, no milestones) | 5 — decision paralysis, maintenance burden |
| **Covering emails** | 3 | Cold Intro (current), Warm Intro (existing contact), Referral Intro (name-drop opener) | 5 — variant-of-variant territory |
| **Follow-up emails** | 2 | Nudge (3–5 days), Breakup (7–10 days after nudge) | 3 — 4th follow-up = spam |
| **Report variants** | 0–1 | 0 at launch; 1 executive summary (1-page leave-behind) if time allows | 2 — engine work disguised as templates |
| **Subject lines** | 2–3 per email | See Q3 table | 5 per email — no A/B volume to test |
| **Niche language sets** | 1–2 | Trades/home services (launch), General/professional (default) | 4 — maintenance of parallel copy kills quality |
| **TOTAL** | ~11–14 | | ~20–25 |

---

## Do Not Build List

| Item | Reason |
|---|---|
| **Cold SMS templates** | TCPA requires prior written consent. Cold SMS is effectively illegal. Brand and legal risk. |
| **8+ niche variants** | Fake choice — same text with industry words swapped. Maintenance kills copy quality. 2 is enough. |
| **AI-generated proposal text (ChatGPT integration)** | The product's differentiator is deterministic audit + human-edited proposal. AI text would genericise it and introduce hallucination risk (invented findings, fake numbers). |
| **"Unlimited revisions" option** | Invites buyers to make an undeliverable promise. |
| **Contract/agreement template** | DealNote is a sales tool, not a legal tool. A deficient contract template creates more liability than no template. |
| **Competitor comparison section** | "Your competitor's site loads in 2.1s, yours loads in 6.2s" — the audit only checks the prospect's site. Fabricating competitor data is a legal and credibility risk. |
| **Dollar-loss estimator** | "You're losing $X/month" — no data basis, FTC risk, explicitly excluded from the product spec already. Don't reverse this decision. |
| **Pricing recommendations / rate card** | DealNote must never suggest what a buyer should charge. Regional, skill, and market variation makes any suggestion indefensible. |
| **Multi-email automation / drip campaigns** | DealNote is a template tool, not a Mailchimp. Building send automation invites CAN-SPAM compliance complexity (tracking opt-outs, suppression lists across campaigns). |
| **Colour picker without PDF export** | Brand colours in a plain-text copy are invisible. Build PDF first, colours second. |
| **Report variants (cosmetic reskins)** | Same findings, different font/layout. Zero value. The 1 executive summary is the only justified variant. |
| **Proposal tone sliders / AI rewriting** | "Make it more professional" sliders produce uncanny-valley text. 2 handwritten tone variants beat 5 slider positions. |

---

## Assumptions That Could Be Wrong

| Assumption | Risk if wrong | How to verify |
|---|---|---|
| Freelancers send proposals as email attachments (PDFs), not email body text | If most buyers paste into email body, PDF export is less critical and plain-text formatting matters more | Survey 10 target buyers: "How do you send proposals?" |
| 2 follow-up emails is the right number | Practitioners disagree: some say 3, some say 5, some say 1 | Check cold-email practitioner data (Woodpecker, Lemlist blogs have real stats). I've said 2 based on the spam threshold, but 3 may be safe. |
| The 3-proposal-template split (Quick-Fix / Redesign / Retainer) matches real deal types | If most buyers only pitch redesigns, Quick-Fix and Retainer templates go unused | Check: what % of web design freelancer revenue comes from one-off fixes vs redesigns vs retainers? |
| Buyers will use section toggles | If most buyers send the full 10-section proposal regardless, toggles are dev effort for nothing | Watch usage after launch. But the existence of toggles is also a trust signal ("this tool lets me control what I send"). |
| CAN-SPAM's "reply unsubscribe" is sufficient as an opt-out mechanism | Some interpretations require a link or separate mechanism, not just "reply to this email." I believe reply-unsubscribe is valid, but I'm not certain. | **Flag for lawyer.** |
| The acceptance section's current signature lines don't create binding offers | This is jurisdiction-specific and fact-specific. I am not confident in my analysis. | **Flag for lawyer.** Priority: get this reviewed before launch. |
| The "conspicuous publication" implied-consent rule under CASL is correctly summarised | CASL's implied-consent rules have specific conditions (message must be relevant to recipient's role, among others) that the checklist oversimplifies | **Flag for lawyer** familiar with CASL. |
| Branded PDF is technically feasible before 1 Dec 2026 | PDF generation (puppeteer/wkhtmltopdf/react-pdf) with dynamic content, logo, and brand colours is non-trivial. If the launch is in 3 days, this may be impossible to ship well. | Estimate dev time honestly. A bad PDF is worse than no PDF. If it can't be done well by launch, ship plain-text copy with a "PDF export coming soon" note and prioritise it for the first post-launch update. |
