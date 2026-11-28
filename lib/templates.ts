// DealNote template library (Phase 1, 27 Nov 2026).
// Shared by /templates (the library page) and /audit (the proposal
// generator) so both pages render the same copy. Pure data + text
// builders, no React, no AI generation: every word here is hand-written
// template copy. Audit findings are never rewritten here; the buyer only
// selects which findings to feature, and prices are always blank ($____).
// Legal notes (general information, not legal advice): prices stay blank,
// no invented dollar-loss figures, no fake testimonials, proposals are
// non-binding sales documents, every email carries a CAN-SPAM footer.

import type { BrandProfile, Issue, ProposalItem } from "@/lib/audit";

export type ProposalKind = "quickfix" | "redesign" | "retainer" | "localseo" | "landing" | "fastclose" | "newbuild" | "ecommerce";

export type SectionKey =
  | "cover"
  | "found"
  | "understanding"
  | "fix"
  | "scope"
  | "timeline"
  | "investment"
  | "about"
  | "terms"
  | "nextstep";

export const SECTION_LABELS: Record<SectionKey, string> = {
  cover: "Cover",
  found: "What I found",
  understanding: "Understanding the problem",
  fix: "What I would fix",
  scope: "Scope and deliverables",
  timeline: "Timeline and milestones",
  investment: "Investment",
  about: "About and past work",
  terms: "Terms",
  nextstep: "Next step",
};

export interface ProposalTemplateDef {
  kind: ProposalKind;
  name: string;
  tagline: string;
  length: string;
  dealSize: string;
  /** Sections in order, with the ones this document carries. */
  sections: SectionKey[];
  /** Sections shown by default when the buyer opens the generator. */
  defaultOn: SectionKey[];
  investmentNote: string;
}

export const PROPOSAL_TEMPLATES: ProposalTemplateDef[] = [
  {
    kind: "quickfix",
    name: "Quick-Fix Pitch",
    tagline: "One page for a decent site that needs polish, not a rebuild.",
    length: "1 page",
    dealSize: "Small quick-win jobs",
    sections: ["cover", "found", "fix", "investment", "nextstep"],
    defaultOn: ["cover", "found", "fix", "investment", "nextstep"],
    investmentNote: "One tier only (Essential). Quick wins: speed, SSL, meta tags, broken links.",
  },
  {
    kind: "redesign",
    name: "Redesign Proposal",
    tagline: "The full ten-section proposal for a site that needs a real rebuild.",
    length: "10 sections",
    dealSize: "Full redesigns",
    sections: ["cover", "found", "understanding", "fix", "scope", "timeline", "investment", "about", "terms", "nextstep"],
    defaultOn: ["cover", "found", "understanding", "fix", "scope", "timeline", "investment", "terms", "nextstep"],
    investmentNote: "Three tiers (Essential / Growth / Premium).",
  },
  {
    kind: "retainer",
    name: "Retainer Opener",
    tagline: "Monthly care for a site that is OK but neglected. No milestones, no rebuild.",
    length: "5 sections",
    dealSize: "Monthly care, 3-month minimum",
    sections: ["cover", "found", "fix", "investment", "nextstep"],
    defaultOn: ["cover", "found", "fix", "investment", "nextstep"],
    investmentNote: "One monthly price line. Updates, backups, monitoring, small changes.",
  },
  {
    kind: "localseo",
    name: "Local SEO & GBP Refresh",
    tagline: "For a business that is invisible in local search: profile, listings, and on-page local signals.",
    length: "6 sections",
    dealSize: "Local search + Google Business Profile",
    sections: ["cover", "found", "fix", "scope", "investment", "nextstep"],
    defaultOn: ["cover", "found", "fix", "scope", "investment", "nextstep"],
    investmentNote: "One tier (Essential) plus a monthly profile-care line. No invented rankings.",
  },
  {
    kind: "landing",
    name: "Landing Page / Lead-Gen Funnel",
    tagline: "One page built to turn visits into calls and bookings, with a form and a clear offer.",
    length: "7 sections",
    dealSize: "One landing page + lead capture",
    sections: ["cover", "found", "understanding", "fix", "scope", "investment", "nextstep"],
    defaultOn: ["cover", "found", "understanding", "fix", "scope", "investment", "nextstep"],
    investmentNote: "One flat fee for the page, plus an optional monthly optimization line.",
  },
  {
    kind: "fastclose",
    name: "One-Page Fast-Close Quote",
    tagline: "A single page that quotes the job and asks for a yes, for small jobs that close in a day.",
    length: "1 page",
    dealSize: "Small jobs, quote in a day",
    sections: ["cover", "found", "fix", "investment", "nextstep"],
    defaultOn: ["cover", "found", "fix", "investment", "nextstep"],
    investmentNote: "One price, one page, valid 7 days. No tiers, no timeline section.",
  },
  {
    kind: "newbuild",
    name: "New Website Build",
    tagline: "For a business with no real website yet, or only a social page: a full new site from scratch.",
    length: "10 sections",
    dealSize: "Full new builds",
    sections: ["cover", "found", "understanding", "fix", "scope", "timeline", "investment", "about", "terms", "nextstep"],
    defaultOn: ["cover", "found", "understanding", "fix", "scope", "timeline", "investment", "terms", "nextstep"],
    investmentNote: "Three tiers (Essential / Growth / Premium).",
  },
  {
    kind: "ecommerce",
    name: "E-commerce / Shopify Store",
    tagline: "For a shop that needs to sell online: store setup, product pages, checkout, and payments.",
    length: "10 sections",
    dealSize: "Online stores",
    sections: ["cover", "found", "understanding", "fix", "scope", "timeline", "investment", "about", "terms", "nextstep"],
    defaultOn: ["cover", "found", "understanding", "fix", "scope", "timeline", "investment", "terms", "nextstep"],
    investmentNote: "Three tiers (Essential / Growth / Premium).",
  },
];

export const NON_BINDING_TEXT =
  "This proposal is for discussion purposes. It is not a contract, and signing it does not create one. " +
  "A separate agreement will be provided before work begins. " +
  "This template is a starting point, not legal advice.";

export const NOT_INCLUDED_DEFAULT: string[] = [
  "Content writing (you provide the text, or we quote it separately)",
  "Photography and logo design",
  "Hosting and domain registration fees",
  "Ongoing SEO work after launch, unless a care plan is agreed",
  "Social media setup and management",
];

export const TESTIMONIAL_SLOT_TEXT =
  "[PAST PROJECT - Replace with a real project or delete this section]\n" +
  "Client: [Your client's business name]\n" +
  "What you did: [Describe the actual work]\n" +
  "Result: [Only include a result you can verify, for example: site loads in 1.8s, down from 6.2s]\n" +
  "Never invent a client, a quote, or a result.";

export const DEFAULT_TIMELINE: string[] = [
  "Week 1 - Discovery: confirm goals, content, and access",
  "Weeks 2-3 - Design: homepage and key pages, 2 rounds of design revisions included",
  "Weeks 4-6 - Development: build, mobile layout, forms, and SEO setup",
  "Week 7 - QA and launch: testing, fixes, and go-live",
];

export const DEFAULT_SCOPE: string[] = [
  "Pages: [number] pages, custom design (not a bought template)",
  "Responsive layout for desktop, tablet, and phone",
  "Contact or booking form with [number] fields",
  "On-page SEO setup: titles, meta descriptions, headings",
  "2 rounds of design revisions included. Additional revisions or work outside scope will be quoted separately.",
];

/** A price is only ever shown when the buyer typed a real value. Blank,
 *  "$0", "0", and "$____" all render as the blank placeholder, so a
 *  proposal can never go out with a $0 or an example price. */
export function priceOrBlank(value: string): string {
  const v = (value ?? "").trim().replace(/^\$/, "").replace(/,/g, "").trim();
  if (!v || v === "____" || v === "0" || v === "0.00") return "$____";
  if (!/[0-9]/.test(v)) return "$____";
  return value.trim().startsWith("$") ? value.trim() : `$${value.trim()}`;
}

export function hasPlaceholder(text: string): boolean {
  return /\[finding \d+\]/i.test(text) || /\[finding\]/i.test(text);
}

// ---------------------------------------------------------------------------
// CAN-SPAM footer (every email, including follow-ups). Postal address comes
// from the brand profile; when it is missing the footer says so in plain
// words and must not be sent as-is.
// ---------------------------------------------------------------------------

export function canSpamFooter(brand: BrandProfile): string {
  const address = (brand.postalAddress ?? "").trim();
  return [
    "",
    "--",
    `${brand.contactName}, ${brand.brandName}`,
    address ? address : "[Add your postal address in your brand profile - required for commercial email in the US]",
    `${brand.contactEmail}${brand.contactPhone ? `, ${brand.contactPhone}` : ""}`,
    brand.website,
    "",
    "This is an advertisement. If you do not want marketing email from me, reply with \"unsubscribe\" or use this link: [unsubscribe link]. I will stop within 10 business days.",
  ].join("\n");
}

// ---------------------------------------------------------------------------
// Email templates: 8, one sequence. E1-E3 are first touches for
// different relationships; Day 3 and Day 7 are the follow-ups in the same
// thread; Breakup is the Day 14 close; Post-Call and Post-Proposal are
// sent after a call or after a proposal, not as cold follow-ups.
// ---------------------------------------------------------------------------

export type EmailKind = "cold" | "warm" | "referral" | "day3" | "day7" | "breakup" | "postcall" | "postproposal";

export interface EmailTemplateDef {
  kind: EmailKind;
  name: string;
  timing: string;
  purpose: string;
  subjects: string[];
  body: (opts: { brand: BrandProfile; business: string; findings: string[] }) => string;
}

function findingList(findings: string[], n: number): string {
  const picked = findings.slice(0, n);
  const out: string[] = [];
  for (let i = 0; i < n; i++) out.push(picked[i] ?? `[finding ${i + 1}]`);
  return out.join(", ");
}

export const EMAIL_TEMPLATES: EmailTemplateDef[] = [
  {
    kind: "cold",
    name: "Cold Intro",
    timing: "First touch",
    purpose: "First email to a prospect you have never spoken to. Leads with the biggest findings and the attached report.",
    subjects: [
      "3 quick wins for [Business]",
      "Your website: 3 quick wins",
      "[Business] website quick audit",
    ],
    body: ({ brand, business, findings }) =>
      [
        `Hi [Name],`,
        ``,
        `I reviewed ${business} website and put together a short teardown showing what is working and what is costing you calls. The biggest items are ${findingList(findings, 3)}.`,
        ``,
        `The full report is attached. If you would like, I can fix these and rebuild the site so the phone rings more often. No obligation, just a 15-minute call if it is useful.`,
        ``,
        `Best regards,`,
        `${brand.contactName}, ${brand.brandName}`,
      ].join("\n"),
  },
  {
    kind: "warm",
    name: "Warm Intro",
    timing: "First touch, after meeting",
    purpose: "For a prospect you have already met, at an event or through an existing contact. Shorter, warmer, one finding only, no findings dump.",
    subjects: [
      "Following up: I looked at [Business].com",
      "Quick site notes for [Business]",
    ],
    body: ({ brand, business, findings }) =>
      [
        `Hi [Name],`,
        ``,
        `Good to meet you. As promised, I took a look at ${business} website. One thing stood out: ${findings[0] ?? "[finding 1]"}.`,
        ``,
        `I put the full short report together - it is attached. If a 15-minute call would help, I am free this week.`,
        ``,
        `Best regards,`,
        `${brand.contactName}, ${brand.brandName}`,
      ].join("\n"),
  },
  {
    kind: "referral",
    name: "Referral Intro",
    timing: "First touch, via a referrer",
    purpose: "Opened by a named referrer. Different social proof, and the call to action is a call, not the report.",
    subjects: [
      "[Referrer] suggested I look at [Business].com",
      "Introduction from [Referrer] - your website",
    ],
    body: ({ brand, business, findings }) =>
      [
        `Hi [Name],`,
        ``,
        `[Referrer] suggested I take a look at ${business} website, so I did. The main thing I noticed is ${findings[0] ?? "[finding 1]"}.`,
        ``,
        `I help businesses like yours turn their website into more calls and bookings. Would a short call be useful? I can walk you through what I found in 15 minutes.`,
        ``,
        `Best regards,`,
        `${brand.contactName}, ${brand.brandName}`,
      ].join("\n"),
  },
  {
    kind: "day3",
    name: "Day 3 Single-Fix Bump",
    timing: "Day 3 after the first email, same thread",
    purpose: "Short bump. Adds one new finding or one concrete fix, and offers the 15-minute walkthrough again.",
    subjects: ["Your website review", "The [#1 finding] on [Business].com"],
    body: ({ brand, business, findings }) =>
      [
        `Hi [Name],`,
        ``,
        `Just checking that my note about ${business} website landed. The one finding I would fix first is ${findings[0] ?? "[finding 1]"}.`,
        ``,
        `Happy to walk you through it in 15 minutes, or I can just send the short report again.`,
        ``,
        `Best regards,`,
        `${brand.contactName}, ${brand.brandName}`,
      ].join("\n"),
  },
  {
    kind: "day7",
    name: "Day 7 Low-Friction Q",
    timing: "Day 7 after the first email, same thread",
    purpose: "One low-friction question, no pitch. Asks whether the fix is on their list this month, and offers to send the one-page quote.",
    subjects: ["Quick question about [Business].com", "On your list this month?"],
    body: ({ brand, business, findings }) =>
      [
        `Hi [Name],`,
        ``,
        `One quick question about ${business} website: is fixing ${findings[0] ?? "[finding 1]"} something you want done this month, or is it a later job?`,
        ``,
        `Either answer is fine. If it is this month, I can send a one-page quote with a fixed price and a date. No call needed unless you want one.`,
        ``,
        `Best regards,`,
        `${brand.contactName}, ${brand.brandName}`,
      ].join("\n"),
  },
  {
    kind: "breakup",
    name: "Breakup follow-up",
    timing: "Day 14 after the first email, same thread. Then stop.",
    purpose: "The final touch. Closes the loop politely and leaves the report valid if they come back later.",
    subjects: ["Last note about [Business].com"],
    body: ({ brand, business }) =>
      [
        `Hi [Name],`,
        ``,
        `I won't keep emailing. If now is not the right time for ${business} website, no worries at all.`,
        ``,
        `If you do want to revisit your site later, the report is still valid. Just reply to this email and I will pick it up from there.`,
        ``,
        `Best regards,`,
        `${brand.contactName}, ${brand.brandName}`,
      ].join("\n"),
  },
  {
    kind: "postcall",
    name: "Warm Post-Call Delivery",
    timing: "After a call, same day",
    purpose: "Sent after a call with the prospect. Delivers the report and the agreed next step, and names what was discussed.",
    subjects: ["Your website report, as discussed", "Following up on our call"],
    body: ({ brand, business, findings }) =>
      [
        `Hi [Name],`,
        ``,
        `Good talking just now. As promised, here is the short report on ${business} website. The main item we discussed is ${findings[0] ?? "[finding 1]"}.`,
        ``,
        `The next step is the one we agreed on the call. If anything in the report looks wrong, tell me and I will correct it.`,
        ``,
        `Best regards,`,
        `${brand.contactName}, ${brand.brandName}`,
      ].join("\n"),
  },
  {
    kind: "postproposal",
    name: "Post-Proposal Nudge",
    timing: "48-72 hours after sending the proposal, same thread",
    purpose: "Short nudge after a proposal has been sent. Asks one question about the proposal and offers the call, without re-pitching the whole job.",
    subjects: ["Your website proposal", "Any questions on the proposal?"],
    body: ({ brand, business, findings }) =>
      [
        `Hi [Name],`,
        ``,
        `Just checking you received the proposal for ${business} website. The first fix in it is ${findings[0] ?? "[finding 1]"}.`,
        ``,
        `Any questions on the price or the timeline? A 15-minute call is enough to settle them, or reply here and I will answer in writing.`,
        ``,
        `Best regards,`,
        `${brand.contactName}, ${brand.brandName}`,
      ].join("\n"),
  },
];

export function buildEmailText(
  def: EmailTemplateDef,
  brand: BrandProfile,
  business: string,
  findings: string[],
): string {
  const subject = def.subjects[0].replace(/\[Business\]/g, business);
  return [`Subject: ${subject}`, ``, def.body({ brand, business, findings }), canSpamFooter(brand)].join("\n");
}

// ---------------------------------------------------------------------------
// Proposal text builder. Used by /audit (live findings) and /templates
// (placeholder findings). Findings are quoted verbatim and never rewritten;
// the fix list is the buyer's editable text.
// ---------------------------------------------------------------------------

export interface ProposalBuildOpts {
  kind: ProposalKind;
  brand: BrandProfile;
  business: string;
  runDate: string;
  issues: Issue[];
  items: ProposalItem[];
  sections: Record<SectionKey, boolean>;
  prices: { essential: string; growth: string; premium: string; monthly: string };
  scopeLines: string[];
  timelineLines: string[];
  notIncluded: string[];
  expiryDays: string;
}

const FIX_INTRO: Record<ProposalKind, string> = {
  quickfix: "What I would fix (quick wins only)",
  redesign: "What I would fix",
  retainer: "What I would do monthly",
  localseo: "What I would fix (local search and profile)",
  landing: "What the new page would fix",
  fastclose: "What I would fix",
  newbuild: "What the new site would include",
  ecommerce: "What the store would include",
};

/**
 * The report intro line for THIS audit. The brand profile stores one
 * intro line, and a full audit rewrites it to "found N quick wins"
 * (audit page), so a later proposal can claim a stale count: Neon P2-3
 * (28 Nov 2026) saw "found 10 quick wins" above 2 free-tier findings.
 * A counted intro line is rewritten to the finding count actually in
 * this proposal/preview ("found 2 quick wins", "found 1 quick win");
 * any other wording is the buyer's own text and is left alone. A
 * 0-finding audit gets the good-shape line instead of a count.
 */
export function introLineForAudit(introLine: string, issueCount: number): string {
  if (!/found (\d+|several) quick wins/i.test(introLine)) return introLine;
  if (issueCount === 0) return "I reviewed your website and found it in good shape.";
  return introLine.replace(
    /found (\d+|several) quick wins/i,
    `found ${issueCount} quick win${issueCount === 1 ? "" : "s"}`,
  );
}

export function buildProposalText(o: ProposalBuildOpts): string {
  const def = PROPOSAL_TEMPLATES.find((t) => t.kind === o.kind) ?? PROPOSAL_TEMPLATES[1];
  const on = (s: SectionKey) => o.sections[s] === true && def.sections.includes(s);
  const lines: string[] = [];

  if (on("cover")) {
    lines.push(`${def.name} - Website redesign proposal for ${o.business}`);
    lines.push(`Prepared by ${o.brand.brandName}, ${o.brand.contactName}, ${o.brand.contactEmail}`);
    lines.push(`Date: ${o.runDate}`);
    // The cover line states the finding count actually in this
    // proposal, never a stale count saved in the brand profile
    // (introLineForAudit above: "found 10 quick wins" above 2 teaser
    // findings, Neon P2-3, 28 Nov 2026).
    lines.push(introLineForAudit(o.brand.introLine, o.issues.length));
    lines.push("");
  }

  if (on("found")) {
    lines.push("What I found");
    if (o.issues.length === 0) {
      lines.push("No material issues were found on the homepage in this audit. See the note at the end of this proposal.");
    } else {
      o.issues.forEach((issue) => lines.push(`- ${issue.title}: ${issue.why}`));
    }
    lines.push("");
    lines.push("Edit these findings only to remove one that does not apply. Only include issues the audit actually found. Do not invent problems.");
    lines.push("");
  }

  if (on("understanding")) {
    lines.push("Understanding the problem");
    if (o.issues.length > 0) {
      lines.push(
        `The audit found ${o.issues.length} issue${o.issues.length === 1 ? "" : "s"} on the homepage. ` +
          `These issues may be turning away visitors who would otherwise call, book, or visit. ` +
          `No dollar-loss figure is claimed here: the cost is the visitors who leave without contacting you.`,
      );
    } else {
      lines.push("The homepage is in good shape on the checks run. The opportunity is keeping it that way, not fixing what is not broken.");
    }
    lines.push("");
  }

  if (on("fix")) {
    lines.push(FIX_INTRO[o.kind]);
    if (o.items.length === 0) {
      lines.push("No fix items listed. Add the fixes you will deliver, or pick findings above to generate the list.");
    } else {
      o.items.forEach((item) => lines.push(`- [${item.phase}] ${item.title}: ${item.detail}`));
    }
    lines.push("");
  }

  if (on("scope")) {
    lines.push("Scope and deliverables");
    o.scopeLines.forEach((s) => lines.push(`- ${s}`));
    lines.push("");
    lines.push("Not included:");
    o.notIncluded.forEach((s) => lines.push(`- ${s}`));
    lines.push("");
  }

  if (on("timeline")) {
    lines.push("Timeline and milestones");
    o.timelineLines.forEach((s) => lines.push(`- ${s}`));
    lines.push("Start date: [fill in]. Timings assume the client provides content and access on time.");
    lines.push("");
  }

  if (on("investment")) {
    lines.push("Investment");
    if (o.kind === "retainer") {
      lines.push(`Monthly care plan: ${priceOrBlank(o.prices.monthly)} per month, 3-month minimum, 30-day cancel after that.`);
      lines.push("Includes: updates, backups, quarterly restore test, up to 2 hours of small changes per month.");
    } else if (o.kind === "quickfix" || o.kind === "fastclose" || o.kind === "landing") {
      lines.push(`Essential: ${priceOrBlank(o.prices.essential)}`);
      lines.push("Quick wins only. Payment terms: 50% upfront, 50% on completion.");
    } else if (o.kind === "localseo") {
      lines.push(`Essential: ${priceOrBlank(o.prices.essential)}`);
      lines.push(`Monthly profile care: ${priceOrBlank(o.prices.monthly)} per month.`);
      lines.push("Payment terms: 50% upfront, 50% on completion.");
    } else {
      lines.push(`Essential: ${priceOrBlank(o.prices.essential)}`);
      lines.push(`Growth: ${priceOrBlank(o.prices.growth)}`);
      lines.push(`Premium: ${priceOrBlank(o.prices.premium)}`);
      lines.push("Payment terms: 50% upfront, 50% on launch. For larger projects, milestone terms of 30% / 40% / 30% can be used instead. Edit these terms to match your agreement. This is not legal advice.");
    }
    lines.push("");
  }

  if (on("about")) {
    lines.push("About and past work");
    lines.push(TESTIMONIAL_SLOT_TEXT);
    lines.push("");
  }

  if (on("terms")) {
    lines.push("Terms");
    lines.push("This proposal includes 2 rounds of design revisions. Additional revisions or work outside the scope described above will be quoted separately.");
    lines.push("Ownership of the finished site passes to the client on final payment.");
    lines.push("Edit these terms to match your agreement with your client. This is not legal advice.");
    lines.push("");
  }

  if (on("nextstep")) {
    lines.push("Next step");
    const expiry = (o.expiryDays ?? "").trim() || "[14/30]";
    lines.push(`Reply to this email by [date] to book a 15-minute call, or use this link: ${o.brand.ctaLink}.`);
    lines.push(`This proposal is valid for ${expiry} days from the date above.`);
    lines.push(NON_BINDING_TEXT);
    lines.push("");
  }

  return lines.join("\n").trim() + "\n";
}

export function defaultSections(kind: ProposalKind): Record<SectionKey, boolean> {
  const def = PROPOSAL_TEMPLATES.find((t) => t.kind === kind) ?? PROPOSAL_TEMPLATES[1];
  const out = {} as Record<SectionKey, boolean>;
  (Object.keys(SECTION_LABELS) as SectionKey[]).forEach((k) => {
    out[k] = def.defaultOn.includes(k);
  });
  return out;
}
