# DealNote — What Published Research Actually Says About Keeping a Human, Getting the Tap, and Getting Paid

**Date:** 27 Nov 2026. **Method:** live web research (`browser.search` + reading the
returned sources). Every finding below names its source, date, and URL. Where a
number could not be sourced to a primary study, that is stated instead of inventing
one. No memory was used for any statistic.
**Scope:** the seven questions Velu ordered, applied to DealNote
(https://dealnote-blue.vercel.app, $49 one-time, white-label teardown + proposal
generator for web-design freelancers and small agencies).

---

## (a) The three-click rule: what the research actually says

### Finding A1. The three-click rule is a myth — no published study supports it
- **Claim:** users should reach any page within 3 clicks of the homepage or they
  will give up. The idea traces to Jeffrey Zeldman's 2001 book *Taking Your Talent
  to the Web*, which offered it as a suggestion with **no data behind it**.
- **What the tests found:** Joshua Porter (User Interface Engineering, 2003) tested
  it directly — 44 users, 620 tasks, 8,000+ clicks. Click count did **not** predict
  task success or failure; "hardly anybody gave up after three clicks"; some users
  went as far as 25 clicks; satisfaction did not track click count. Nielsen Norman
  Group's Page Laubheimer reviewed the evidence in 2019 and called the rule an
  arbitrary rule of thumb not backed by any published study.
- **Sources:** Porter (2003) via
  https://seothemes.net/three-click-rule/ and
  https://icons8.com/blog/articles/three-click-rule/ (both summarise Porter 2003 and
  Laubheimer, NN/g, 2019). Primary NN/g article not re-fetched in this run; the
  secondary summaries agree on the numbers above.
- **Proves vs myth:** the *number three* is myth. The instinct behind it is not:
  users want the least total effort, and they quit when they feel lost, not when a
  counter hits three. What predicts success is **information scent** (Xerox PARC):
  each link label must make the next step feel like progress. One e-commerce test
  cited by NN/g found moving products to **4** clicks from the homepage *increased*
  findability dramatically (~600% in summaries) because the labels got clearer.
- **Exact rule for DealNote:** stop counting clicks; count *confusion*. No DealNote
  page may have a vague link label. "Run a free audit", "See a sample report",
  "Generate a proposal from an audit" already pass this test — keep them literal.
  Do not flatten the site to satisfy "3 clicks".

### Finding A2. There is no magic drop-off click number — but effort is real
- **Claim:** five cognitively easy clicks beat three cognitively hard ones.
- **Source:** same Porter/Laubheimer evidence as A1; NN/g's conclusion is that
  effort (physical clicks + mental work per click) is the metric, not click count.
- **Proves vs myth:** myth says "3 clicks = stay, 4 clicks = leave". Reality:
  users persist through long paths when every step confirms they are closer, and
  abandon short paths when a step confuses them.
- **Exact rule for DealNote:** maximum **2 taps from landing to audit result**
  (tap "Run a free audit" → paste URL → tap "Run audit" — the paste is data entry,
  not navigation), maximum **4 taps from landing to a finished proposal**
  (audit → choose 1 of 3 proposal templates → copy or download PDF), maximum
  **2 taps from anywhere to pay** (BuyButton → Polar checkout). The binding
  constraint is not the tap count but that *every* tap's label must name exactly
  what happens next. The current weakest label is "See proposal templates" on the
  audit page (it does not say the templates open on another page); rename it
  "Open the proposal templates page".

---

## (b) Taps/clicks to complete a task, and abandonment

### Finding B1. Form-field count hurts more than step count; usability suffers after 8+ steps
- **Claim:** Baymard Institute's June 2024 checkout benchmark (60+ leading stores,
  4,400+ test sessions): the average checkout is **5.1 steps** and **11.3 form
  fields**; most checkouts need only **8 fields**; field count matters more than
  step count; usability suffers after **8 or more steps**. Better checkout design
  alone could lift conversion **35.26%** at an average large site (Baymard estimate,
  ~$260B recoverable across US + EU e-commerce).
- **Source:** Baymard Institute, "Checkout Optimization: 5 Ways to Minimize Form
  Fields in Checkout", 26 June 2024, via
  https://www.statwharf.com/research/cart-abandonment-statistics/ and
  https://www.businessinitiative.org/business-tips/multi-step-forms-that-reduce-abandonment/
  (both quote the 2024 benchmark figures; Baymard's own pages were not re-fetched).
  Note the two secondary sources disagree on the older US average (14.88 vs 11.3
  fields) because they cite different Baymard snapshots; the 2024 benchmark figures
  (5.1 steps, 11.3 fields, 8 needed) are the consistent ones.
- **Proves vs myth:** there is no "users abandon after N taps" law. What is measured
  is that each *field* is friction and each *unclear step* is friction; steps per se
  are cheap if they are labelled and progressive.
- **Exact rule for DealNote:** the audit form is already at the floor (1 URL field +
  1 optional licence-key field + 1 button) — do not add fields. The **brand profile
  on /audit has 11 fields** (brand name, contact name, email, phone, postal address,
  website URL, CTA text, primary colour, accent colour, logo URL, intro line) — that
  is over Baymard's 8-field line and it sits *before* the proposal generator. Rule:
  split brand setup into "needed to preview" (brand name, contact name, email — 3
  fields) and "optional, fill later" (everything else collapsed behind one
  "More brand details" toggle). The proposal generator itself must stay at
  **0 required fields** before "Copy proposal text" works (prices are blank
  placeholders by design — keep it that way).

### Finding B2. Most cart abandonment is not a UX failure — it is browsing
- **Claim:** Baymard's average documented cart-abandonment rate is **70.22%**
  (mean of 50 studies, 2006–2025), but **42%** of US shoppers who abandoned said
  they were "just browsing or not ready to buy". Of the rest, the top reasons are
  extra costs (40%), slow delivery (20%), did-not-trust-site-with-card (19%),
  forced account creation (18%), long/complicated checkout (17%).
- **Source:** Baymard Institute, cart-abandonment statistics, updated Oct 2026, via
  https://www.statwharf.com/research/cart-abandonment-statistics/
- **Proves vs myth:** the 70% figure is quoted everywhere as "70% of buyers quit
  because checkout is bad". It is not: nearly half of it is people who never
  intended to buy. The fixable part is dominated by *surprise costs* and *forced
  accounts*, not by step count.
- **Exact rule for DealNote:** (1) the price must never surprise: "$49 one-time"
  is already on the hero, the pricing card, and the footer — keep it on the
  BuyButton itself ("Buy DealNote — $49 one-time" already does this). (2) Never
  require an account before payment: DealNote already sells by licence key with no
  account — do not add one. (3) Do not treat "visitor ran a free audit but did not
  buy" as abandonment; the free audit is the browsing step by design.

---

## (c) Cognitive load and choice overload

### Finding C1. Hick's law: decision time grows logarithmically, not linearly — and it is about reaction, not deliberation
- **Claim:** Hick (1952) / Hyman (1953): reaction time RT = a + b·log₂(n+1).
  Doubling equally-likely options adds a roughly constant delay; the expensive jump
  is from 1 option to 2. Hyman showed what matters is *uncertainty*: when some
  options are far more likely, people are faster with the same count.
- **Source:** https://zumilabs.com/articles/design-hicks-law-myths.html and
  https://yukaichou.com/gamification-analysis/hicks-law-choice-reaction-time-options/
  (both summarise Hick 1952, Hyman 1953).
- **Proves vs myth:** the popular "fewer options = proportionally faster" is wrong
  (the curve is logarithmic), and Hick's law strictly describes practised,
  sub-second, known-option reaction (lamps and keys) — **not** scanning an unfamiliar
  menu or comparing plans, which are search and deliberation and scale roughly
  linearly with what must be read.
- **Exact rule for DealNote:** Hick's law does **not** justify cutting the 3 proposal
  templates to 1. It justifies making the *likely* choice fastest: pre-select the
  recommended template (Quick-Fix Pitch, the common case) and make the other two
  visibly secondary, so Hyman's uncertainty reduction does the work.

### Finding C2. Miller's 7±2 is about memory chunks, not menu limits — and later work says ~4
- **Claim:** Miller (1956, *Psychological Review*, "The Magical Number Seven, Plus
  or Minus Two") found immediate-memory span near 7 *chunks* — and stressed
  chunking/recoding, not a 7-item menu limit. Later work (notably Cowan) puts
  working-memory capacity nearer **4** items (3–5) when rehearsal and grouping are
  controlled.
- **Source:** Miller 1956 via
  https://www.researchgate.net/publication/273323278_George_Miller's_Magical_Number_of_Immediate_Memory_in_Retrospect_Observations_on_the_Faltering_Progression_of_Science
  (retrospective on Miller 1956; Cowan's ~4 estimate summarised there).
- **Proves vs myth:** "max 7 nav items" is a misquotation. Miller never set a menu
  limit; the defensible number for *holding items in mind at once* is closer to 4.
- **Exact rule for DealNote:** keep the header at its current **4 links + wordmark**
  (Run an audit / Sample report / Proposal templates / Terms / Privacy is 5 links —
  cut one: move Privacy into the footer only, leaving 4). No decision point on any
  page may ask the user to hold more than **4** things in mind at once: the audit
  form (1 input), the proposal choice (3 templates, 1 pre-selected), the findings
  picker (top 3 selected by default; the other 7 are opt-in, not a 10-way decision).

### Finding C3. The jam study is real — but the meta-analysis says the effect is small and conditional
- **Claim:** Iyengar & Lepper (2000, *Journal of Personality and Social Psychology*
  79(6):995–1006): 24 jams attracted more tasters (60% stopped vs 40% for 6 jams)
  but only **3%** of stoppers bought, vs **30%** with 6 jams. Customers with fewer
  options were also more satisfied afterwards.
- **Source:** the original paper via
  https://faculty.washington.edu/jdb/345/345%20Articles/Iyengar%20%26%20Lepper%20(2000).pdf
  and the summary at https://pmc.ncbi.nlm.nih.gov/articles/PMC11111947/
- **Proves vs myth:** the jam result is real, but it is **not** a law that "more
  choice always kills sales". Scheibehenne's meta-analysis (2010, 63 conditions,
  50 experiments, N=5,036) found a mean choice-overload effect size of **virtually
  zero** with large variance between studies; a German supermarket replication found
  no overload effect at all. Overload appears when options are hard to compare,
  unfamiliar, and high-stakes — not whenever a count exceeds 6.
- **Source (meta-analysis):**
  https://www.researchgate.net/publication/48210291_Can_There_Ever_Be_Too_Many_Options_A_Meta-Analytic_Review_of_Choice_Overload
- **Exact rule for DealNote:** the problem on `/templates` is not the number 8 (3
  proposals + 5 emails) — it is that the 8 are *hard to compare* (different
  lengths, different deals, different "when" rules, all in identical cards). Rule:
  maximum **3 options visible at any one decision point**, and every option must
  differ on one comparable dimension the user already understands (deal size:
  quick win / redesign / monthly care). The 5 emails must not be 5 equal cards;
  present them as **one sequence** (Cold → Warm/Referral → Nudge → Breakup) with
  one visible at a time or as a numbered list, because a sequence is one decision
  ("which first touch fits this prospect?"), not five.

---

## (d) Attention and first-impression timing

### Finding D1. Visual appeal is judged in 50 milliseconds — and the judgement sticks
- **Claim:** Lindgaard, Fernandes, Dudek & Brown (2006, *Behaviour & Information
  Technology* 25(2):115–126): participants rated homepage visual appeal after
  50ms exposures, and those ratings correlated highly with ratings after 500ms and
  longer viewing. The authors conclude designers have "about 50ms to make a good
  first impression".
- **Source:** https://www.nature.com/news/2006/060109/full/news060109-13.html?error=cookies_not_supported&code=b0ecf831-73e3-4b24-aacd-ca48d861c6b1
  (Nature news report, Jan 2006) and https://measuringu.com/visual-appeal/
  (ratings consistent over time, R² ~94%).
- **Proves vs myth:** the 50ms figure is about *visual appeal* (attractiveness),
  not about understanding, trust, or buying. It does not prove "users decide in
  50ms whether to buy". What it proves is that the *aesthetic* verdict is instant
  and then colours everything after it (halo effect: after a positive first
  impression, later flaws are overlooked; after a negative one, they are amplified).
- **Exact rule for DealNote:** the first screen must *look* finished in 50ms: one
  clear headline, one visible action, no warning cards, no wall of text. Current
  violations: `/templates` opens with two amber/white warning cards and two long
  paragraphs before any template (see loop-2 slop report L-N2/L-N3); `/audit`
  mobile header takes three rows. Rule: **first screen = H1 + one line + one
  button, nothing else above the fold** on `/` (already true) and on `/templates`
  (not true — fix it).

### Finding D2. Half of new site visits last under 12 seconds
- **Claim:** Weinreich, Obendorf, Herder & Mayer (2008): half of all new site
  visits last less than 12 seconds; but if a site survives the first cut, visitors
  often stay 2 minutes or more (Nielsen, 2011, summarising the same line of work).
- **Source:** cited in https://www.makinggood.ac.nz/methods/web-credibility/
  (Weinreich et al. 2008, p.16; Nielsen 2011). Primary paper not re-fetched.
- **Proves vs myth:** "12 seconds" is a median visit length, not a countdown to
  purchase. It means the page has ~12 seconds to earn the *next* action, not to
  close the sale.
- **Exact rule for DealNote:** every page must deliver its one next action inside
  12 seconds of reading: `/` → "Run a free audit" (visible immediately — pass);
  `/templates` → "View full text" of a proposal (currently below two warnings and
  two paragraphs — fail, fix per D1); `/audit` → "Run audit" (visible immediately
  — pass); `/sample` → the score and first finding (visible immediately — pass).

---

## (e) Trust signals that make users stay and pay

### Finding E1. People judge credibility by visual design first — 46.1% of credibility comments cite design
- **Claim:** Stanford Web Credibility Project (Fogg et al., 2002/2003; 4,500+
  participants over three years): when assessing real sites, the average consumer
  paid far more attention to superficial aspects (layout, typography, font size,
  colour) than to content. **46.1%** of credibility-related comments cited the
  site's overall visual design — the single most-cited factor, ahead of information
  structure, focus, and content. Design look mattered most for finance (54.6%),
  search (52.6%), and travel (50.5%) sites.
- **Source:** https://credibility.stanford.edu/guidelines/index.html (Stanford
  Guidelines for Web Credibility, 10 guidelines, based on 3 years of research with
  4,500+ people) and https://en.wikipedia.org/wiki/Stanford_Web_Credibility_Project
- **Proves vs myth:** trust is not earned by claims; it is *read off the design*
  in the first glance, then confirmed or destroyed by verification. A site that
  fails the visual test never gets its substance examined. (Counter-note from the
  same study: sites that look *too slick* trigger the opposite reaction — design
  gloss reads as "selling, not useful".)
- **Exact rule for DealNote:** the clean white/slate/teal design *is* the main
  trust signal — protect it (this is what the slop checks are for). Do not add
  trust badges, testimonial carousels, or star ratings: DealNote has no customers
  yet, so any of those would be invented, and Stanford's guideline 1 is "make it
  easy to verify accuracy" — invented proof destroys the trust it pretends to build.

### Finding E2. The 10 Stanford credibility guidelines, applied to DealNote
- **Source:** https://credibility.stanford.edu/guidelines/index.html (Fogg, 2002).
- **What each guideline implies for DealNote:**
  1. *Make accuracy easy to verify* — already done: weights printed on the report,
     "not Lighthouse" disclaimers, "scores can vary between runs". Keep.
  2. *Show a real organisation behind the site* — **gap**: no physical address,
     no "about the maker" anywhere on the site. The CAN-SPAM footer demands the
     *user's* postal address but DealNote shows none of its own. Rule: add one
     line in the footer — "DealNote is made by DrVelu, Santa Rosa City, Laguna,
     Philippines" + the contact email already there (murugan@drvelu.com).
  3. *Highlight expertise* — **gap**: nothing says who built the scoring model or
     why it is credible. Rule: one line under the score bars — "Scoring model:
     6 categories, weights printed above. Built from public homepage checks only."
     (already half-present; make it one line, not two paragraphs — see slop M-N2).
  4. *Show honest, trustworthy people stand behind it* — **gap**: no name or face.
     Rule: the footer line in (2) covers this minimally; do not add a fake photo.
  5. *Make it easy to contact you* — pass: murugan@drvelu.com in the footer on
     every page. Keep.
  6. *Design so it looks professional* — pass (see E1).
  7. *Make it easy to use — and useful* — pass for the audit; fail for brand
     setup (11 fields, see B1).
  8. *Update content often / show it was reviewed recently* — **gap**: no date
     anywhere except the audit run date. Rule: put "Last updated 27 Nov 2026" in
     the footer; update it on every change.
  9. *Restraint with promotional content* — pass: no ads, no pop-ups, no upsell.
  10. *Avoid errors of all types* — mostly pass; the live defects are the slop
      report's M-N2 duplication and L-N4 invented claim — fix those first, because
      an error a user *notices* costs more trust than a missing feature.

---

## (f) Friction, checkout, and pay decisions — what makes $49 feel cheap vs expensive

### Finding F1. Anchoring is real, but it needs a real anchor
- **Claim:** Tversky & Kahneman (1974, *Science* 185:1124–1131): an arbitrary
  starting number biases later judgements of value, even when people know it is
  arbitrary. In pricing, the first number a buyer sees frames every number after it.
- **Source:** classic paper, cited from the literature (not re-fetched in this run).
- **Proves vs myth:** anchoring is one of the most replicated effects in
  judgement research, but the anchor must be *seen before* the price and must be
  plausible. A fake "was $499, now $49" anchor is not anchoring — it is a lie the
  buyer can check, and it triggers Stanford guideline 10 (errors destroy trust).
- **Exact rule for DealNote:** the honest anchors already on the page are the right
  ones — "30 audits per month" (the $49 buys 30 audits: **$1.63 per audit**) and
  "no subscription" (the alternative is a monthly tool). Rule: put the per-audit
  arithmetic next to the price once, on the pricing card: "$49 one-time — 30
  audits a month, about $1.63 per audit, no subscription." Do **not** invent a
  struck-through higher price or a "competitors charge $X" claim. Do not add a
  second price tier: DealNote has one product at one price, and a fake tier built
  only to anchor would be a decoy (see F2).

### Finding F2. The decoy effect is real in the lab and mostly disappears on realistic pricing pages
- **Claim:** Huber, Payne & Puto (1982, *Journal of Consumer Research* 9(1):90–98):
  adding a third option that is clearly worse than one option (and not clearly
  worse than the other) shifted choice toward the dominating option — e.g. beer A
  vs B split 50:50, then a decoy made A win 68%. Ariely (2008, *Predictably
  Irrational*): *The Economist* Web $59 / Print $125 / Print+Web $125 — 84% chose
  Print+Web with the decoy present, 32% without it.
- **Source:** https://www.ux-strategy.ch/en/effects/decoy-effekt.html (Huber 1982
  and Ariely 2008 numbers).
- **The replication problem:** two large replication efforts in 2014 (100+
  attempted demonstrations) found the effect **mostly disappeared** once stimuli
  became realistic — real products, images, qualitative attributes, choosers with
  prior preferences. A 2025 analysis of UK supermarket purchase records (Devine et
  al.) found preference moved by **~1%** when a dominated option was present.
- **Source:** https://atticusli.com/replication-crisis/decoy-effect-asymmetric-dominance/
  and https://isoglu.com/insights/journal/what-is-the-decoy-effect/
- **Proves vs myth:** the lab effect is real; the pricing-page tactic is mostly
  folklore. Do not build DealNote's price around a decoy.
- **Exact rule for DealNote:** (1) keep **one price, $49, no tiers** — a decoy tier
  would not reliably move anyone and would add a choice (see C3). (2) Delete
  "Most clients pick the middle tier" (`lib/templates.ts:72`) — it is a
  compromise-effect nudge with no data behind it (slop report L-N4). (3) The
  *templates inside the product* already use a real three-tier structure
  (Essential / Growth / Premium) for the freelancer's own client proposals — that
  is fine, because there the middle tier is a genuine option the client can pick,
  not a decoy built to lose.

### Finding F3. The $49 price must be framed against the buyer's next best alternative, not against $0
- **Claim:** no single study gives a "$49 feels cheap" threshold. What the
  evidence in (b) and (f) jointly supports: a one-time price feels cheap when (i)
  the total cost is visible before the click (Baymard: surprise costs are the #1
  abandonment reason, 40%), (ii) it is divided into the unit the buyer already
  counts (per audit, per proposal, per client), and (iii) there is no forced
  account and no subscription to mentally add on top.
- **Exact rule for DealNote:** on the pricing card only, show the three numbers
  together, once: "$49 one-time. 30 audits a month. About $1.63 per audit. No
  subscription, no per-report fee." That is the whole price story; do not repeat it
  on the hero caption, the footer, and the audit page as well (slop report M-N4:
  "30 audits per month" appears 4× today). Repetition does not anchor — it reads
  as filler, and filler is what Stanford's guideline 10 punishes.

---

## (g) Mobile behaviour

### Finding G1. 58% of proposals are opened on mobile — but that number is one vendor's platform data
- **Claim (as given in the task):** "58% mobile opens for proposals per Better
  Proposals." Verification: Better Proposals' own reports show the trend clearly
  but the 58% figure traces to their **2022 Report** (58% of proposals opened on a
  mobile device in 2022, up from 46% the year before), as summarised at
  https://www.docsaura.com/blog/how-long-should-a-proposal-be (which itself warns:
  "Both figures come from a vendor's own platform, so treat them as indicators
  rather than market-wide facts"). The figures I could verify directly from Better
  Proposals' own published reports: **34%** first opened on mobile in 2018
  (189,090 signed proposals, 1 Jan–31 Dec 2018) and **37.7%** in 2020.
- **Sources:** https://betterproposals.io/reports/2019/ (2018 data, 34% mobile
  first-open: PC 41.4%, iPhone 22.5%, Mac 21.9%, Android 9.9%, iPad 2.9%) and
  http://betterproposals.io/reports/2020/ (2020 data, 37.7% mobile first-open).
  The 58% (2022) figure is second-hand via Docsaura; the 2022 report itself was
  not re-fetched.
- **Proves vs myth:** the *direction* is solid (mobile first-open rose 34% → 37.7%
  → 46% → 58% across 2018–2022 on this platform) and the *level* (~half or more)
  is plausible, but 58% is not a market-wide fact — it is one vendor's closed-deal
  data. Do not quote "58%" on the DealNote site as if it were universal.
- **Exact rule for DealNote:** design mobile-first anyway, because the trend and the
  level both point the same way, and because DealNote's own user (a freelancer
  between client visits) is the mobile case. Concretely: the **proposal PDF the
  freelancer sends must read on a phone** (single column, 16px+ body, no
  side-by-side tables — the PDF is built from `lib/pdf-html.ts`, verify it at 390px
  before launch); the **sample report page must be the mobile test page** (it is
  what the prospect opens); and the audit results page must not require horizontal
  scrolling at 390px (it currently stacks correctly — keep it that way).

### Finding G2. 53% of mobile visits are abandoned if the page takes over 3 seconds — but the data is from 2016
- **Claim:** Google/DoubleClick (2016): 53% of mobile site visits are abandoned if
  pages take longer than 3 seconds to load. Source data: aggregated, anonymised
  Google Analytics data from 3,700 mobile sites, March 2016.
- **Source:** https://blog.google/products/admanager/the-need-for-mobile-speed/?view=Schedule
  and https://support.google.com/google-ads/answer/9238823/ (footnote 1: "Google
  Data, Aggregated, anonymized Google Analytics data from a sample of mWeb sites
  opted into sharing benchmark data, n=3.7K, Global, March 2016").
- **Proves vs myth:** the number is real but **ten years old** (March 2016) and from
  a pre-5G, pre-HTTP/2 web. It is still the most-cited load-time threshold because
  nothing newer has replaced it at the same scale — but treat "3 seconds" as a
  budget, not a law. The direction is undisputed: every second costs visitors.
- **Exact rule for DealNote:** budget **under 3 seconds to first content on a
  mid-range phone on 4G**, and under 1 second for the audit form to become usable.
  DealNote is already light (no webfonts blocked? — Inter is loaded via
  `next/font/google`, one family; no images except the 28px SVG logo; no
  third-party scripts except the Ship or Die tracker snippet). Rule: measure the
  live homepage with PageSpeed Insights on mobile and record the number; if LCP
  exceeds 2.5s, the tracker snippet is the first suspect, not the design.

### Finding G3. One-handed thumb use: 49% one-handed, 75% of touches are thumbs — and the rigid "thumb zone" chart is wrong
- **Claim:** Hoober (UXmatters, 2013): 1,333 observations of people using phones in
  public — **49%** one-handed (thumb), 36% cradled (one hand holds, other taps),
  15% two-handed; **75% of all screen touches are thumb-driven**. The popular
  green/yellow/red "thumb zone" heat map came from this work — but Hoober himself
  has since said that chart is wrong (2022): people shift grips constantly, and
  accuracy is highest at the **centre** of the screen, dropping toward the edges.
  Updated guidance: touch targets ~**7mm at centre, 9mm at edges, 12mm in
  corners**.
- **Source:** https://alistapart.com/article/how-we-hold-our-gadgets/ (Hoober's
  2013 study, 1,333 observations, 49%/36%/15%, 75% thumb) and
  https://www.monterail.com/blog/thumb-friendly-navigation-word-oriented-design
  (Hoober's 2022 correction; 7/9/12mm guidance; platform minima 44×44pt iOS,
  48×48dp Android, WCAG 24×24 CSS px as the legal floor).
- **Proves vs myth:** the grip numbers are solid field data; the *static thumb-zone
  map* is myth (Hoober's own correction). The durable rule is: centre is most
  accurate, corners are worst, targets must be ≥44–48px.
- **Exact rule for DealNote:** (1) buttons and nav links are already ≥44px — keep
  it (slop check L6 fix held). (2) The **primary action on mobile must sit in the
  centre-bottom of the viewport, not the top**: on `/audit` the "Run audit" button
  is full-width under the URL field (good); on `/` the hero CTAs are mid-screen
  (good); but the **mobile header takes three rows** (slop report L-N1) — that
  pushes the primary action down and puts navigation in the hardest-to-reach zone
  (top edge). Fix the header first. (3) Do not put the BuyButton only in the
  footer on mobile — the footer is the furthest scroll from the decision point;
  keep the in-content BuyButton on `/` pricing and on `/audit` (already there).

---

## Consolidated DealNote rules (from the research above)

| # | Rule | Source |
|---|---|---|
| R1 | **Landing → audit result: max 2 taps** (Run a free audit → paste URL → Run audit). Landing → finished proposal: max 4 taps. Anywhere → pay: max 2 taps (BuyButton → checkout). Every tap label must name exactly what happens next. | A1, A2 (Porter 2003; Laubheimer 2019) |
| R2 | **Max 3 options visible at any one decision point; max 4 things held in mind.** 3 proposal templates (1 pre-selected), 5 emails as one numbered sequence, header cut from 5 links to 4 (Privacy to footer only). | C1 (Hick 1952), C2 (Miller 1956; Cowan ~4), C3 (Iyengar & Lepper 2000) |
| R3 | **First screen = H1 + one line + one button.** No warning cards, no second paragraph above the fold. Applies to `/templates` first (two alerts + two paragraphs today). | D1 (Lindgaard 2006, 50ms), D2 (Weinreich 2008, 12s) |
| R4 | **Brand setup: 3 fields visible, rest collapsed.** Audit form stays at 1 + 1 optional fields. Proposal generator stays at 0 required fields before Copy works. | B1 (Baymard 2024: 8 fields, 5.1 steps, suffers after 8 steps) |
| R5 | **Price story told once, on the pricing card:** "$49 one-time. 30 audits a month. About $1.63 per audit. No subscription, no per-report fee." No invented struck-through price, no second tier, no decoy. | F1 (Tversky & Kahneman 1974), F2 (Huber 1982; 2014 replications), B2 (Baymard 2026) |
| R6 | **Trust = design + verifiability + a real maker.** Add one footer line naming the maker and place (DrVelu, Santa Rosa City, Laguna, Philippines) + "Last updated 27 Nov 2026". No badges, testimonials, or star ratings — DealNote has no customers yet. | E1, E2 (Stanford/Fogg 2002–2003, 46.1% design) |
| R7 | **Mobile-first is mandatory, not a preference.** Proposal PDF must read at 390px; sample page is the mobile test page; audit results must not scroll horizontally at 390px; fix the 3-row mobile header; keep the primary action centre-bottom. | G1 (Better Proposals 2018–2022 trend), G3 (Hoober 2013/2022) |
| R8 | **Load budget: under 3s to first content on 4G, under 1s for the audit form to become usable.** Measure live with PageSpeed Insights on mobile; tracker snippet is the first suspect if LCP exceeds 2.5s. | G2 (Google/DoubleClick 2016, n=3.7K) |

## Top 5 rules (short version, for the decision)

1. **Three clicks is a myth; confusion is the killer.** (Porter 2003, 44 users / 620
   tasks; Laubheimer, NN/g, 2019.) Keep tap counts low anyway (R1), but spend the
   effort on literal link labels, not on the number 3.
2. **Max 3 options per decision; the 5 emails are one sequence, not five cards.**
   (Iyengar & Lepper 2000: 30% bought with 6 jams vs 3% with 24 — real, but the
   2010 meta-analysis says the effect is small and conditional; the fix is
   comparability, not just count.)
3. **50 milliseconds to look right, 12 seconds to earn the next tap.** (Lindgaard
   2006; Weinreich 2008.) `/templates` fails this today: two warnings and two
   paragraphs before any template.
4. **Trust is read off the design (46.1% of credibility comments), then verified.**
   (Stanford/Fogg 2002–2003.) DealNote's clean design is its main trust signal;
   the gaps are a named maker, a place, and a last-updated date — all cheap to add,
   and all honest.
5. **Checkout friction is fields, surprise costs, and forced accounts — not steps.**
   (Baymard 2024: 8 fields needed vs 11.3 average; 40% abandon over extra costs;
   42% of abandonment is just browsing.) DealNote's price must be visible before
   the click, the audit must stay at 1 field, and brand setup must collapse from
   11 visible fields to 3.

## Numbers I could NOT source — do not use these

- **No sourced "users drop off after N taps" number exists.** Neither Porter nor
  Baymard gives a tap-count cliff. Any claim like "users abandon after 5 taps" is
  invented.
- **No sourced "$49 feels cheap/expensive" threshold exists.** The per-audit
  arithmetic ($1.63) is DealNote's own numbers, not research. Do not quote a
  "willingness to pay" figure for freelancers — none was found.
- **The 58% mobile-opens figure is vendor data, not a market fact** (see G1).
  Quote it only as "Better Proposals' own platform data, 2022".
- **The 53% / 3-second figure is from March 2016** (see G2). Still the best
  available, but ten years old — cite the date when using it.
- **The decoy effect on realistic pricing pages is ~1% or absent** (see F2) — do
  not build pricing on it.
- **Miller's 7±2 is not a menu limit** (see C2) — do not cite it to justify 7 nav
  items or 7 options.
