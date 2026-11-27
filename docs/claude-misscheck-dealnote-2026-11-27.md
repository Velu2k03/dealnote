# DealNote v1 — Miss-Check & Launch Plan

**Ship or Die $100K Hackathon · Launch target Dec 1 · Contest ends Dec 16 21:00 Manila**
**Ranked by verified profit via TrustMRR · Today is Nov 27, 4 days remain**

---

## Fact-Check Flags

Working from provided summary only. These items I **cannot verify** but flag as assumptions that could bite:

| # | Claim | Risk |
|---|-------|------|
| F1 | "Polar.sh Starter net $46.05 per $49 US sale" | Polar Starter is 5% platform fee. $49 × 5% = $2.45 platform. Then Stripe ~2.9%+$0.30 = ~$1.72. Net ≈ $44.83, not $46.05. **Re-verify the actual net per sale — you may be ~$1.22 off per transaction.** If Polar's 5% is inclusive of Stripe fees, net would be $46.55. Check their pricing page. |
| F2 | "build 34s" | Build time, not TTFB. If Vercel cold starts are slow (serverless), the audit endpoint could be 15–20s+ for the user. Not verified. |
| F3 | "Rust port… falls back to identical TypeScript" | Fine, but confirm the fallback is actually deployed and exercised. A silent failure on Vercel that returns no result vs. falling back is different from graceful fallback. |
| F4 | "30 audits/month fair-use" | No enforcement mechanism described. This is marketing copy, not a technical limit. |
| F5 | "TrustMRR… Revenue is verified with Stripe API key" | This is the single most dangerous assumption in the entire plan. See item #1 below. |

---

## Critical Misses Your Audit Didn't Catch

> [!CAUTION]
> **MISS #1 — TrustMRR cannot verify Polar.sh revenue directly.**
> TrustMRR verifies revenue via a **Stripe API key you provide**. Polar.sh is a Merchant of Record — the customer pays Polar.sh's Stripe account, not yours. You receive payouts via Stripe Connect Express, which is a sub-account under Polar.sh's platform. You do NOT get a standard Stripe API key. TrustMRR almost certainly cannot read a Connect Express sub-account's data via a key you provide. **If you can't get verified on TrustMRR, you cannot rank in the hackathon at all.** This is a potential total blocker. Same problem applies to Lemon Squeezy (also a MoR with their own Stripe account).
>
> **Resolution paths (verify Day 1 AM):**
> 1. Check if TrustMRR supports Polar.sh or Lemon Squeezy as a data source directly
> 2. Check if TrustMRR accepts Stripe Connect Express account IDs
> 3. Check if Ship or Die accepts manual revenue proof (screenshots + Polar dashboard) as an alternative
> 4. Nuclear option: find a payment processor that gives YOU a direct Stripe account (requires a Stripe-eligible country — a friend/co-founder in the US, or Stripe Atlas for $500)
> 5. Nuclear option 2: Lemon Squeezy bridge — if TrustMRR supports Lemon Squeezy directly (they might, as LemonSqueezy is popular in indie hacker circles)

> [!CAUTION]
> **MISS #2 — No authentication system, paywall architecture undefined.**
> The P0 says "build server paywall (teaser only until server confirms payment)" but there is NO auth system. How does the server know who paid? Options: (a) Polar.sh license keys entered on the site, validated server-side per request — simplest, no accounts needed, but keys can be shared; (b) email + magic link; (c) full auth (NextAuth/Clerk). Without deciding this NOW, the paywall can't be built. **This is 2–8 hours of work depending on approach and directly blocks revenue.**

> [!CAUTION]
> **MISS #3 — No PDF generation exists.**
> The product promises "a white-label teardown report plus ready-to-send proposal." The pricing bullet says "Teardown PDF and proposal PDF (coming with payment)." But PDF generation is not built. Puppeteer PDF is listed under "GitHub reuse" as a **pattern**, not an implementation. This is the core deliverable that justifies $49. Without a downloadable PDF, a freelancer gets a web page they can't forward to a client white-labeled. **Estimated 6–12 hours to build.** This is what separates "$49 worth it" from "I'll just use PageSpeed Insights."

> [!WARNING]
> **MISS #4 — Custom domain missing.**
> `dealnote-blue.vercel.app` will not convert paying customers. Period. A `.com` or `.co` domain is $10–15 and 10 minutes to configure on Vercel. This is not in the P0 list but should be. **No one pays $49 to a site on a free subdomain.**

> [!WARNING]
> **MISS #5 — Vercel env vars are empty.**
> "No env vars" means payment keys, API secrets, and any server-side config have nowhere to live. This is infrastructure that blocks payment integration. 5 minutes to configure but must happen before any payment code deploys.

> [!WARNING]
> **MISS #6 — Ship or Die rules are HTTP 403.**
> You're building for a contest whose rules you can't read. What if there are disqualifying criteria you don't know about? What if "verified profit" has a specific definition (net of refunds, net of fees, gross)? What if there's a minimum product requirement? **You need the actual rules.** Ask on their Discord/community, or use a different browser/account/cache.

> [!WARNING]
> **MISS #7 — TrustMRR + one-time payments.**
> "TrustMRR" implies Monthly Recurring Revenue. DealNote is $49 one-time. Does TrustMRR even handle one-time payments, or does it only track subscriptions? If it only shows MRR, your one-time sales show as $0 MRR. **Verify this along with Miss #1.**

> [!WARNING]
> **MISS #8 — No marketing/distribution plan for the 15-day revenue window.**
> Distribution score 2.5. Contest ends Dec 16. That's 15 days to generate enough verified profit to rank. Reddit r/SideProject is mentioned, but that's one post on launch day. Where are the other 14 days of distribution? No email list, no ads budget, no content strategy, no cold outreach plan, no ProductHunt launch. **A product with no traffic makes $0 regardless of how good it is.**

> [!NOTE]
> **MISS #9 — Audit batch branch (8b8fc2b) not merged to main.**
> The audit findings produced fixes, but they're on a branch. Production is running main (e529576). Every fix from that audit is not live. This is a merge + deploy away, but it must actually happen.

> [!NOTE]
> **MISS #10 — OG/social meta tags not mentioned.**
> When you post to Reddit, the link preview card matters enormously. No OG image, no OG description = a text-only link that gets scrolled past. 30 minutes of work, huge impact on click-through.

---

## Prioritized Item List

### 🔴 LAUNCH-BLOCKING (1–10)
*Cannot launch or cannot rank without these. Each one is a hard gate.*

| # | Item | Why it blocks | Effort | Owner |
|---|------|--------------|--------|-------|
| 1 | **Verify TrustMRR × payment processor compatibility** | If TrustMRR can't verify your revenue, hackathon ranking = impossible. Zero point launching. | 2h research + emails | Velu |
| 2 | **Read Ship or Die actual rules** (bypass 403, ask community, Wayback Machine) | Building blind for a contest. Could be disqualified on a rule you don't know. | 1h | Velu |
| 3 | **Wire payment checkout** (Polar.sh or Lemon Squeezy, whichever TrustMRR supports) | No checkout = $0 revenue = last place | 4–6h | Dev |
| 4 | **Build server-side paywall** (license-key gating or session-based) | Full audits are free right now. No reason to pay. | 4–6h | Dev |
| 5 | **Decide auth approach** (license key vs. email vs. accounts) and implement | Paywall can't work without identity | Included in #4 | Dev |
| 6 | **Install Ship or Die tracker snippet** (before ANY traffic, before first payment) | Contest requirement. If not installed, revenue may not count. | 15min | Dev |
| 7 | **Add /privacy page** | Payment processors require it. GDPR/CCPA exposure. Can't collect emails or payments without it. | 1–2h | Dev |
| 8 | **Add contact email + refund request channel** | Refund promise is unenforceable without it. Payment processor may reject the merchant. | 30min | Dev |
| 9 | **Register + configure custom domain** | `dealnote-blue.vercel.app` will not convert paid customers. Trust killer. | 30min + DNS propagation | Velu |
| 10 | **Configure Vercel environment variables** | Payment keys, secrets have nowhere to live. Blocks all server-side payment code. | 15min | Dev |

**Total launch-blocking effort: ~14–18 hours of dev work + ~3 hours of Velu research/decisions**

### 🟡 HIGH PRIORITY (11–20)
*Should ship by Dec 1 if possible, or by Dec 3 at latest. Each one materially affects revenue.*

| # | Item | Impact | Effort |
|---|------|--------|--------|
| 11 | **Build PDF generation** (teardown report PDF, at minimum) | Core deliverable. Without it the product is a glorified web page, not a client-ready report. $49 justification. | 6–10h |
| 12 | **Merge audit-batch branch to main** | All audit fixes are stranded. Production doesn't have them. | 30min |
| 13 | **OG image + meta tags** | Reddit/social link previews. Directly affects click-through on launch post. | 1h |
| 14 | **Fix Inter font** (load via next/font or drop the declaration) | HIGH slop. Inconsistent rendering across OS. | 30min |
| 15 | **Fix $39/mo cheapest line** | Confusing pricing signal. Contradicts $49 one-time. | 15min |
| 16 | **Fix pricing bullet** ("Teardown PDF and proposal PDF") | Promising a feature that doesn't exist yet is false advertising. | 15min |
| 17 | **CAN-SPAM footer + 60s sending checklist in /templates** | Templates encourage outreach. Without compliance guidance, users (and you) are liable. | 1h |
| 18 | **Remaining HIGH slop fixes** (repeating uppercase eyebrows, heading weights) | Professional appearance for a paid product. | 1h |
| 19 | **Test purchase end-to-end** (buy → receive → use → verify on TrustMRR) | First real customer must not hit a broken flow. | 2h |
| 20 | **Distribution plan for Dec 1–16** | 15-day revenue window. Need at least 5 channels mapped with dates. | 2h planning |

### 🟢 MEDIUM PRIORITY (21–29)
*Ship before Dec 16 contest end. Polish and growth.*

| # | Item | Impact | Effort |
|---|------|--------|--------|
| 21 | **Rate limiting on audit endpoint** | Without it, bots or competitors can run unlimited free audits (even with paywall, teaser mode has no limit). | 2h |
| 22 | **Proposal PDF generation** | Full product promise. Report + proposal is the pitch. | 4–6h |
| 23 | **SSRF redirect re-validation** | Security gap. Attacker could redirect audit URL to internal services. | 1h |
| 24 | **robots.txt honoring** | Ethical scraping. Some sites block crawlers; ignoring that could get DealNote blacklisted or cause legal issues. | 1h |
| 25 | **Next.js 14.2.18 security patch** | Known vulnerability, still unpatched. | 30min |
| 26 | **MEDIUM slop fixes** (7 items) | Polish. | 2h |
| 27 | **Error monitoring** (Sentry free tier) | Flying blind in production. Won't know when audits fail for real users. | 1h |
| 28 | **Email capture** (pre-paywall, for leads who don't buy) | Build a list for follow-up. Essential for the 15-day revenue window. | 2h |
| 29 | **Homepage screenshot capture** | Listed as missing. Part of the full product experience. | 2h |

---

## Day-by-Day Action Plan: Nov 27 → Dec 1

### Day 1 — Thursday Nov 27: DECIDE OR DIE

This day determines whether the hackathon is viable at all.

**Morning (09:00–13:00)**
| Time | Task | Blocks |
|------|------|--------|
| 09:00 | **#1 — Research TrustMRR compatibility.** Go to trustmrr.com, check docs, integrations page, FAQ. Does it support Polar.sh? Lemon Squeezy? Stripe Connect Express? Email their support if unclear. Post in Ship or Die community asking. | Everything |
| 09:30 | **#2 — Get Ship or Die rules.** Try Wayback Machine, different browser, logged-in view, community Discord, ask other participants. | Strategy |
| 10:00 | **#9 — Register domain.** Buy `dealnote.co` or `dealnote.app` or whatever is available. Point DNS to Vercel. | Deploy |
| 10:30 | **#5 — Decide auth approach.** Based on payment processor. If Polar.sh → license keys (simplest). If Lemon Squeezy → webhook + email session. Write the technical spec in 1 page. | Paywall dev |
| 11:00 | **#12 — Merge audit-batch branch.** `git merge dealnote-audit-batch` → resolve conflicts → push → verify Vercel deploy. | All fixes go live |

**Afternoon (13:00–18:00)**
| Time | Task | Blocks |
|------|------|--------|
| 13:00 | **#10 — Set up Vercel env vars.** Create placeholders for payment keys, any API secrets. | Payment integration |
| 13:30 | **#7 — Write /privacy page.** Use a generator as a base, customize for: data collected (URLs submitted, email if capturing, payment info via processor), no cookies in v1, data retention, contact email. | Payment processor approval |
| 14:30 | **#8 — Add contact email to site footer + /terms.** Create support@dealnote.co (or whatever domain). | Refund channel |
| 15:00 | **#3 — Begin payment integration.** Create Polar.sh product: "DealNote Audit Pack — $49 one-time, 30 audits." Set up webhook endpoint in Next.js API route. Or Lemon Squeezy equivalent. | Revenue |
| 17:00 | **Check TrustMRR research results.** If no answer yet, escalate: email TrustMRR directly, DM Ship or Die organizers. |  |

**Evening (18:00–23:00)**
| Time | Task | Blocks |
|------|------|--------|
| 18:00 | **#3 continued — Finish checkout integration.** Buy button → redirect to Polar/LS checkout → webhook confirms → store purchase record. | — |
| 20:00 | **#14 — Fix Inter font.** Either add `next/font/google` import or remove the declaration from globals.css. 30 min. | — |
| 20:30 | **#15 — Fix $39/mo line.** | — |
| 20:30 | **#16 — Fix pricing bullet.** Change to match what actually ships (remove "PDF" if not ready, or commit to building it). | — |
| 21:00 | **#18 — Fix HIGH slop** (eyebrows, heading weights). | — |

**Day 1 EXIT GATE:** Domain live, privacy page live, contact email visible, payment product created on processor, checkout partially wired, TrustMRR compatibility KNOWN. If TrustMRR is incompatible with all available payment processors, STOP and pivot strategy tonight.

---

### Day 2 — Friday Nov 28: PAYMENT + PAYWALL

**Morning (09:00–13:00)**
| Time | Task |
|------|------|
| 09:00 | **#3/#4 — Finish checkout + build paywall.** Complete the flow: user submits URL → sees teaser (score + grade only, findings blurred/locked) → "Unlock Full Report — $49" button → Polar/LS checkout → webhook fires → license key delivered → user enters key → full report revealed. |
| 12:00 | **#6 — Install Ship or Die tracker snippet.** Copy EXACTLY from dashboard. Verify it fires on page load in production. Must be before any real traffic. |

**Afternoon (13:00–18:00)**
| Time | Task |
|------|------|
| 13:00 | **#19 — Test purchase end-to-end.** Use Polar/LS test mode. Buy → receive key → enter on site → see full report. Verify webhook, verify TrustMRR sees the transaction. |
| 15:00 | **#13 — OG image + meta tags.** Create a simple OG image (1200×630) with DealNote logo + tagline. Add `<meta property="og:*">` tags to layout.tsx. Test with [opengraph.xyz](https://opengraph.xyz). |
| 16:00 | **#17 — CAN-SPAM footer + sending checklist.** Add to /templates page. |
| 17:00 | **#20 — Write distribution plan.** Map out 15 days of channels (see below). |

**Evening (18:00–23:00)**
| Time | Task |
|------|------|
| 18:00 | **#11 — Start PDF generation.** Puppeteer on Vercel Serverless (using @sparticuz/chromium). Generate teardown report as PDF from the audit data. Start with a simple HTML template → Puppeteer → PDF. |
| 22:00 | **QA pass #1.** Full flow on mobile + desktop. |

**Day 2 EXIT GATE:** Payment works end-to-end in test mode. Paywall hides full results. Tracker snippet verified. Can accept real money.

---

### Day 3 — Saturday Nov 29: PDF + POLISH

**Morning (09:00–13:00)**
| Time | Task |
|------|------|
| 09:00 | **#11 continued — Finish teardown PDF.** White-label header (user's brand or generic), audit scores, findings, recommendations. Must look professional enough that a freelancer would attach it to a client email. |
| 12:00 | **Test PDF on 5 real URLs.** Verify layout, data accuracy, no broken elements. |

**Afternoon (13:00–18:00)**
| Time | Task |
|------|------|
| 13:00 | **#21 — Rate limiting.** Simple middleware: 5 audits/IP/hour for free tier, 30/month for paid (by license key). |
| 15:00 | **#23 — SSRF redirect fix.** Re-validate URL after any redirect in the fetch chain. |
| 16:00 | **#25 — Next.js security patch.** Bump to 14.2.18, test, deploy. |
| 17:00 | **#26 — MEDIUM slop fixes.** Batch all 7. |

**Evening (18:00–23:00)**
| Time | Task |
|------|------|
| 18:00 | **#28 — Email capture.** Add an email input before the paywall: "Enter your email to receive your audit summary." Stores to Vercel KV or a simple JSON endpoint. Gives you a list to market to. |
| 20:00 | **QA pass #2.** End-to-end: free audit → teaser → buy → unlock → download PDF. Mobile + desktop. |
| 22:00 | **Switch payment to LIVE mode.** Real Polar/LS keys. Test with a real $1 product (or $49 and refund yourself). Verify TrustMRR picks it up. |

**Day 3 EXIT GATE:** PDF works. Rate limiting on. Security patches applied. Live payment verified on TrustMRR.

---

### Day 4 — Sunday Nov 30: QA + PREPARE LAUNCH

| Time | Task |
|------|------|
| 09:00 | **Full regression QA.** Test 10 real-world URLs across niches (plumber, salon, dentist, auto repair, home services). Verify scores are sane, PDFs render, payment flow works. |
| 11:00 | **Fix all bugs found in QA.** |
| 13:00 | **Write launch copy.** Reddit r/SideProject post, r/webdev Showoff Saturday post (if Saturday = Nov 29, post then). Prepare all copy today. |
| 15:00 | **#22 — Proposal PDF** (if time allows; otherwise defer to Dec 2). Simple template with client name, audit summary, proposed fixes, pricing placeholder for the freelancer to fill in. |
| 17:00 | **Record a 60-second demo GIF/video.** Screen recording: paste URL → see teaser → buy → see full report → download PDF. This is your Reddit post media. |
| 19:00 | **Final deploy.** Merge everything. Verify production. |
| 21:00 | **Pre-launch checklist:** ✅ Payment live ✅ Tracker firing ✅ TrustMRR verified ✅ Privacy page ✅ Contact email ✅ Custom domain ✅ OG tags ✅ No console errors ✅ Mobile works ✅ PDF downloads |

---

### Day 5 — Monday Dec 1: LAUNCH 🚀

| Time | Task |
|------|------|
| 09:00 | **Soft launch.** Share link with 2-3 trusted people. Watch for errors. |
| 11:00 | **Post to Reddit r/SideProject.** |
| 11:00 | **Post to Hacker News (Show HN).** |
| 14:00 | **Monitor.** Reply to every comment. Watch Sentry (if installed). Watch payment dashboard. |
| 18:00 | **Post-launch retrospective.** What broke? What's the conversion rate? What needs fixing tomorrow? |

---

## Distribution Plan (Dec 1–16) — Your $0 Budget Playbook

The contest is won by REVENUE, not by building. You need traffic that converts.

| Day | Channel | Action |
|-----|---------|--------|
| Dec 1 | Reddit r/SideProject | Launch post with demo GIF |
| Dec 1 | Hacker News | Show HN post |
| Dec 2 | Direct outreach | Find 20 web design freelancers on Twitter/X, DM them a free audit of THEIR client's site |
| Dec 3 | Reddit r/webdev | Showoff Saturday (if falls on Saturday) or useful post about common website mistakes |
| Dec 4 | IndieHackers | Product launch post |
| Dec 5 | Twitter/X thread | "I audited 100 small business websites. Here's what I found." (use real DealNote data) |
| Dec 6-7 | Cold email to freelancers | Use Upwork/Fiverr freelancer profiles (public), send free audit of a client they've built for |
| Dec 8 | ProductHunt | Launch (if ready; needs hunter, assets, 5 maker friends for upvotes) |
| Dec 9-10 | Facebook groups | Web design freelancer groups, offer free audits, convert to paid |
| Dec 11-12 | Content | Blog post: "How to land a $5K website redesign client in 48 hours" (SEO play, long-tail) |
| Dec 13-14 | Retarget | Email everyone who signed up but didn't buy. Offer limited discount ($39 for 48h). |
| Dec 15-16 | Final push | "Last chance" messaging to email list. Repost best-performing content. |

> [!IMPORTANT]
> **Without active daily distribution, revenue will be $0.** The product doesn't have SEO, viral mechanics, or an existing audience. Every dollar of revenue requires manual effort to drive traffic. Budget 2 hours/day minimum on distribution Dec 1–16.

---

## What to CUT if Time is Short

Ranked by what to drop first (least impact on revenue):

| Cut order | Item | Save | Revenue impact |
|-----------|------|------|----------------|
| 1st | Proposal PDF (#22) | 4-6h | Low — teardown report alone is enough for v1 |
| 2nd | Email capture (#28) | 2h | Low for Dec 1, but hurts Dec 13-16 retargeting |
| 3rd | MEDIUM slop (#26) | 2h | Cosmetic only |
| 4th | Homepage screenshot (#29) | 2h | Nice-to-have |
| 5th | robots.txt honoring (#24) | 1h | Edge case |
| 6th | Error monitoring (#27) | 1h | Fly blind but functional |
| **NEVER CUT** | Payment + paywall | — | No revenue without it |
| **NEVER CUT** | TrustMRR verification | — | No ranking without it |
| **NEVER CUT** | Tracker snippet | — | Contest may not count revenue |
| **NEVER CUT** | Privacy + contact | — | Payment processor may reject you |
| **NEVER CUT** | Custom domain | — | Conversion killer |

### Minimum Viable Launch (absolute floor, ~12h of work):
1. Verify TrustMRR compatibility ✓
2. Custom domain ✓
3. Payment checkout (Polar/LS) ✓
4. Paywall (teaser → buy → unlock) ✓
5. /privacy page ✓
6. Contact email in footer ✓
7. Ship or Die tracker snippet ✓
8. OG tags ✓
9. Merge audit branch ✓

**NO PDF in absolute minimum.** Ship "web report only" and add PDF by Dec 3. The teardown is still valuable as a web page — it's just less valuable than a downloadable PDF. You can even position it as "Full report available online; PDF export coming this week."

---

## Verdict

### Launchable Dec 1? **CONDITIONALLY YES — but only if TrustMRR is resolved by end of Day 1.**

**The honest breakdown:**

```
┌─────────────────────────────────────────────────────────┐
│  IF TrustMRR works with Polar.sh or Lemon Squeezy:     │
│    → Tight but doable. Minimum viable launch Dec 1.     │
│    → PDF by Dec 3. Full product by Dec 5.               │
│    → 11 days of sales runway (Dec 5–16).                │
│    → Realistic revenue: 5–20 sales = $245–$980          │
│      (competition likely needs $5K+ to win big prizes)  │
│                                                         │
│  IF TrustMRR does NOT work with any available processor:│
│    → HARD STOP. Cannot rank. Options:                   │
│      a) Stripe Atlas ($500, takes 1-2 weeks) — too slow │
│      b) Find a US-based co-founder with Stripe — maybe  │
│      c) Pivot to a different hackathon/launch context   │
│    → Do NOT launch into Ship or Die without             │
│      verified TrustMRR connectivity.                    │
│                                                         │
│  THE REAL RISK ISN'T TECHNICAL, IT'S DISTRIBUTION:      │
│    → Zero existing audience                             │
│    → Zero email list                                    │
│    → Zero ad budget                                     │
│    → Competing against people with all three            │
│    → 15 days × manual hustle is the only path           │
└─────────────────────────────────────────────────────────┘
```

**Brutal truth:** The product is a solid MVP with a real use case, but the **monetization is 1.0** and **distribution is 2.5** for a reason. You're 4 days from launch with no payment, no paywall, no PDF, no domain, no privacy page, and an unverified scoring mechanism. The code quality is fine. The product idea is fine. The execution gap is payment + distribution, and those are the only things that matter in a revenue-ranked contest.

**The #1 action right now, before anything else:** Verify TrustMRR compatibility with your payment processor. If that's a wall, everything else is wasted effort.

---

*Generated Nov 27 2026 · Working from provided summary only · No file reads performed*
