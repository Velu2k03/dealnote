"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { CheckSquare, Copy, FileText, Mail } from "lucide-react";

const TIERS = [
  {
    name: "Essential",
    includes: "Quick wins only: speed fixes, meta and alt text, SSL, broken links.",
    pages: "Up to 5 pages",
    support: "2 weeks post-launch support",
  },
  {
    name: "Growth",
    includes: "Everything in Essential, plus full redesign, mobile layout, forms, and trust sections.",
    pages: "Up to 10 pages",
    support: "30 days post-launch support",
  },
  {
    name: "Premium",
    includes: "Everything in Growth, plus schema, sitemap, monitoring setup, and ongoing checks.",
    pages: "Up to 20 pages",
    support: "90 days post-launch support",
  },
];

const LAST_FINDINGS_KEY = "dealnote-last-findings-v1";

const CHECKLIST = [
  "The subject line matches the body (no fake \"Re:\" or \"Fwd:\").",
  "The footer has your real name, brand, postal address, and an opt-out.",
  "The findings quoted are the real findings from the audit — no invented figures, no invented dollar loss, no fake case studies.",
  "The recipient is in the US, or — if in Canada, the UK/EU, or Australia — you have consent or a documented consent basis for that country. When in doubt, do not send.",
  "You have checked the recipient against your own do-not-contact list and any opt-outs you have received.",
  "You are sending email only. No SMS.",
];

export default function TemplatesPage() {
  const [prices, setPrices] = useState({ Essential: "", Growth: "", Premium: "" });
  const [findings, setFindings] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LAST_FINDINGS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as string[];
        if (Array.isArray(parsed) && parsed.length > 0) setFindings(parsed.slice(0, 3));
      }
    } catch {
      // No audit findings stored; placeholders stay as written.
    }
  }, []);

  const finding = (i: number) => findings[i] ?? `[finding ${i + 1}]`;

  const coveringEmailText = useMemo(() => {
    return [
      "Subject: Your website, reviewed: 3 quick wins for [Business]",
      "",
      "Hi [Name],",
      "",
      `I reviewed [Business] website and put together a short teardown showing what is working and what is costing you calls. The three biggest items are ${finding(0)}, ${finding(1)}, and ${finding(2)}.`,
      "",
      "The full report is attached. If you would like, I can fix these and rebuild the site so the phone rings more often. No obligation, just a 15-minute call if it is useful.",
      "",
      "Best regards,",
      "[Your name], [Your brand]",
      "[Postal address — required for commercial email in the US]",
      "[Phone] · [Email] · [Website]",
      "",
      "This is an advertisement. If you do not want marketing email from me, reply with \"unsubscribe\" or use this link: [unsubscribe link]. I will stop within 10 business days.",
    ].join("\n");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [findings]);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(coveringEmailText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section style={{ paddingTop: 48 }}>
      <div className="container">
        <div className="reading">
          <h1>Proposal templates</h1>
          <p>
            Three tiers, one structure: problem first, then the fix, then the timeline, then the price.
            Prices are blank placeholders you fill in. These templates are starting text you adapt, not legal
            advice. Get your own contract reviewed if you need one.
          </p>
          <p>
            You are responsible for your own outreach law. Only email people in line with the rules that
            apply to you and to them — see the sending checklist below. DealNote provides no cold SMS scripts.
            Do not send marketing texts to a prospect unless you already have their prior express written consent.
          </p>
        </div>

        <div className="steps-grid mt-24">
          {TIERS.map((tier) => (
            <div key={tier.name} className="card">
              <FileText size={18} strokeWidth={1.5} color="#475569" aria-hidden />
              <h3 className="mt-16">{tier.name}</h3>
              <p>{tier.includes}</p>
              <p className="mb-8"><strong>Pages: </strong>{tier.pages}</p>
              <p className="mb-8"><strong>Support: </strong>{tier.support}</p>
              <p className="mb-0">
                <input
                  type="text"
                  aria-label={`${tier.name} price`}
                  placeholder="$____"
                  value={prices[tier.name as keyof typeof prices]}
                  onChange={(e) => setPrices({ ...prices, [tier.name]: e.target.value })}
                  style={{ fontSize: 24, fontWeight: 600, maxWidth: 160 }}
                />
              </p>
            </div>
          ))}
        </div>
        <p className="caption mt-16">No guarantee of client wins.</p>

        <h2 className="mt-32">Template structure</h2>
        <div className="card">
          <ol style={{ paddingLeft: 20, marginBottom: 0 }}>
            <li><strong>Cover.</strong> Client business name, &quot;Website redesign proposal for [Business]&quot;, your brand and logo, date, one-line summary.</li>
            <li><strong>What I found.</strong> Three to five sentences, the top findings from the teardown, each tied to a lost call, booking, or visit.</li>
            <li><strong>Understanding the problem.</strong> Restate the problem with the actual numbers from the audit. Never invent a dollar loss.</li>
            <li><strong>What I would fix.</strong> Fix list mapped to findings, grouped as Quick wins, Redesign, and Ongoing.</li>
            <li><strong>Scope and deliverables.</strong> Concrete list: pages, design level, CMS, breakpoints, integrations, revision rounds, support. Always include a &quot;Not included&quot; row.</li>
            <li><strong>Timeline and milestones.</strong> Week 1 Discovery, Weeks 2 to 3 Design, Weeks 4 to 6 Development, Week 7 QA and Launch. You fill in the start date.</li>
            <li><strong>Investment.</strong> Three tiers with blank prices. Payment terms placeholder: 50% upfront, 50% on launch.</li>
            <li><strong>About.</strong> Short paragraph plus blank slots for past projects. Never fake case studies.</li>
            <li><strong>Terms.</strong> Payment structure, revision limits, what happens beyond scope, usage rights. Template text, not legal advice.</li>
            <li><strong>Next step and acceptance.</strong> One clear next step, an expiry placeholder, and signature lines for both parties.</li>
          </ol>
        </div>

        <h2 className="mt-32">Covering email template</h2>
        <div className="card">
          <p style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <Mail size={18} strokeWidth={1.5} color="#475569" aria-hidden /> <strong>Email only. No cold SMS scripts in this product.</strong>
          </p>
          {findings.length > 0 ? (
            <p className="caption">
              The three findings below are filled in from your latest audit on the audit page. Edit them before you send.
            </p>
          ) : null}
          <div className="evidence">
            <p className="mb-8"><strong>Subject:</strong> Your website, reviewed: 3 quick wins for [Business]</p>
            <p className="mb-8">Hi [Name],</p>
            <p className="mb-8">
              I reviewed [Business] website and put together a short teardown showing what is working and
              what is costing you calls. The three biggest items are {finding(0)}, {finding(1)}, and {finding(2)}.
            </p>
            <p className="mb-8">
              The full report is attached. If you would like, I can fix these and rebuild the site so the
              phone rings more often. No obligation, just a 15-minute call if it is useful.
            </p>
            <p className="mb-8">
              Best regards,<br />[Your name], [Your brand]<br />[Postal address — required for commercial email in the US]<br />[Phone] · [Email] · [Website]
            </p>
            <p className="mb-0">
              This is an advertisement. If you do not want marketing email from me, reply with
              &quot;unsubscribe&quot; or use this link: [unsubscribe link]. I will stop within 10 business days.
            </p>
          </div>
          <p className="mt-16 mb-0">
            <button className="btn btn-secondary" onClick={copyEmail}>
              <Copy size={18} strokeWidth={1.5} aria-hidden /> {copied ? "Copied" : "Copy covering email"}
            </button>
          </p>
          <p className="caption mt-16 mb-0">
            You are responsible for your own outreach law, including spam, consent, and local rules where you
            operate. Only email people in line with the rules that apply to you.
          </p>
        </div>

        <h2 className="mt-32">Before you send — 60-second checklist</h2>
        <div className="card">
          <ul style={{ paddingLeft: 20, marginBottom: 0 }}>
            {CHECKLIST.map((item) => (
              <li key={item} style={{ marginBottom: 8 }}>
                <CheckSquare size={18} strokeWidth={1.5} aria-hidden style={{ verticalAlign: "text-bottom", marginRight: 8 }} />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <p className="mt-32 mb-0">
          <Link href="/audit" className="btn btn-primary">Generate a proposal from an audit</Link>
        </p>
      </div>
    </section>
  );
}
