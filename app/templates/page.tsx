"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { CheckSquare, Copy, FileText, Mail, TriangleAlert } from "lucide-react";
import { DEFAULT_BRAND, type BrandProfile } from "@/lib/audit";
import {
  EMAIL_TEMPLATES,
  PROPOSAL_TEMPLATES,
  SECTION_LABELS,
  buildEmailText,
  buildProposalText,
  canSpamFooter,
  DEFAULT_SCOPE,
  DEFAULT_TIMELINE,
  defaultSections,
  hasPlaceholder,
  NOT_INCLUDED_DEFAULT,
  type EmailKind,
  type ProposalKind,
} from "@/lib/templates";

const LAST_FINDINGS_KEY = "dealnote-last-findings-v1";
const BRAND_KEY = "dealnote-brand-v1";

const CHECKLIST = [
  "The subject line matches the body (no fake \"Re:\" or \"Fwd:\").",
  "The footer has your real name, brand, postal address, and an opt-out.",
  "The findings quoted are the real findings from the audit, no invented figures, no invented dollar loss, no fake case studies.",
  "The recipient is in the US, or, if in Canada, the UK/EU, or Australia, you have consent or a documented consent basis for that country. When in doubt, do not send.",
  "You have checked the recipient against your own do-not-contact list and any opt-outs you have received.",
  "You are sending email only. No SMS.",
];

function loadBrand(): BrandProfile {
  try {
    const raw = localStorage.getItem(BRAND_KEY);
    if (raw) return { ...DEFAULT_BRAND, ...(JSON.parse(raw) as BrandProfile) };
  } catch {
    // Keep the default brand profile.
  }
  return DEFAULT_BRAND;
}

export default function TemplatesPage() {
  const [brand, setBrand] = useState<BrandProfile>(DEFAULT_BRAND);
  const [findings, setFindings] = useState<string[]>([]);
  // Live preview of the latest audit (URL + score), filled in from the
  // free teaser as well as full audits (Neon whole-site audit P1-2).
  const [lastAudit, setLastAudit] = useState<{ url: string; score: number; grade: string } | null>(null);
  const [openProposal, setOpenProposal] = useState<ProposalKind | null>(null);
  const [openEmail, setOpenEmail] = useState<EmailKind | null>(null);
  const [emailDrafts, setEmailDrafts] = useState<Partial<Record<EmailKind, string>>>({});
  const [copied, setCopied] = useState<string>("");
  const [copyWarning, setCopyWarning] = useState<string>("");

  useEffect(() => {
    setBrand(loadBrand());
    try {
      const raw = localStorage.getItem(LAST_FINDINGS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as unknown;
        // Current shape: { url, score, grade, findings[] }. Older runs
        // stored a plain string[]; accept both.
        if (Array.isArray(parsed) && parsed.length > 0) {
          setFindings(parsed.filter((x): x is string => typeof x === "string"));
        } else if (parsed && typeof parsed === "object") {
          const rec = parsed as { url?: unknown; score?: unknown; grade?: unknown; findings?: unknown };
          if (Array.isArray(rec.findings) && rec.findings.length > 0) {
            setFindings(rec.findings.filter((x): x is string => typeof x === "string"));
          }
          if (typeof rec.url === "string" && typeof rec.score === "number" && typeof rec.grade === "string") {
            setLastAudit({ url: rec.url, score: rec.score, grade: rec.grade });
          }
        }
      }
    } catch {
      // No audit findings stored; placeholders stay as written.
    }
  }, []);

  const findingsMissing = findings.length === 0;
  const business = "[Business]";

  const proposalText = (kind: ProposalKind) =>
    buildProposalText({
      kind,
      brand,
      business,
      runDate: "[date]",
      issues: findings.map((title, i) => ({
        id: `t${i}`,
        category: "speed" as const,
        severity: "Fix soon" as const,
        title,
        found: title,
        why: "See the audit report for the full finding.",
        fix: title,
      })),
      items: findings.slice(0, 3).map((title) => ({ phase: "Quick wins", title, detail: "See the audit report for the fix." })),
      sections: defaultSections(kind),
      prices: { essential: "", growth: "", premium: "", monthly: "" },
      scopeLines: DEFAULT_SCOPE,
      timelineLines: DEFAULT_TIMELINE,
      notIncluded: NOT_INCLUDED_DEFAULT,
      expiryDays: "",
    });

  const emailText = (kind: EmailKind) => {
    const def = EMAIL_TEMPLATES.find((e) => e.kind === kind)!;
    return emailDrafts[kind] ?? buildEmailText(def, brand, business, findings);
  };

  const copyText = async (key: string, text: string) => {
    if (hasPlaceholder(text)) {
      setCopyWarning(
        "This text still has [finding 1] placeholders in it. Run an audit on the audit page first, or replace every [finding] placeholder with a real finding, before you copy it.",
      );
      return;
    }
    setCopyWarning("");
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      setTimeout(() => setCopied(""), 2000);
    } catch {
      setCopied("");
    }
  };

  const footerPreview = useMemo(() => canSpamFooter(brand), [brand]);

  return (
    <section style={{ paddingTop: 48 }}>
      <div className="container">
        <div className="reading">
          <h1>Proposal templates</h1>
          <p>8 proposals + 8 emails. Pick one, fill in the blanks, send it.</p>
        </div>
        {lastAudit ? (
          <div className="card mt-24" style={{ background: "#F0FDF9", borderColor: "#99F6E4" }}>
            <p className="mb-0">
              <strong>Latest audit filled in:</strong> {lastAudit.url} — score {lastAudit.score}/{lastAudit.grade}.
              The {findings.length} finding{findings.length === 1 ? "" : "s"} below come from that audit, so the
              templates show real text instead of [finding] placeholders.{" "}
              <Link href="/audit">Run a new audit</Link> to replace them.
            </p>
          </div>
        ) : null}
        <div className="steps-flow mt-24" aria-label="How templates fit the workflow">
          <div className="step-row">
            <span className="step-num" aria-hidden>1</span>
            <div>
              <h2 className="mt-0">Audit done</h2>
              <p className="mb-0">Run an audit first; the real findings fill in here.</p>
            </div>
          </div>
          <div className="step-row">
            <span className="step-num" aria-hidden>2</span>
            <div>
              <h2 className="mt-0">Customize</h2>
              <p className="mb-0">Pick a proposal, edit the fix list, fill in the blank prices.</p>
            </div>
          </div>
          <div className="step-row">
            <span className="step-num" aria-hidden>3</span>
            <div>
              <h2 className="mt-0">Export PDF</h2>
              <p className="mb-0">Download the white-label PDF and send the emails.</p>
            </div>
          </div>
        </div>

        <h2 className="mt-32">Proposals: 8 documents, 8 deals</h2>
        <p className="reading">
          Each proposal is a structurally different document for a different deal, not the same skeleton
          with a word swapped. Prices are blank placeholders you fill in. These templates are starting
          text you adapt, not legal advice. Get your own contract reviewed if you need one.
        </p>
        <div className="steps-flow">
          {PROPOSAL_TEMPLATES.map((t) => (
            <div key={t.kind} className="step-row">
              <FileText size={18} strokeWidth={1.5} color="#475569" aria-hidden style={{ flexShrink: 0, marginTop: 4 }} />
              <div style={{ flex: "1 1 auto" }}>
                <h3 className="mt-0">{t.name} <span className="caption">({t.length}, {t.dealSize})</span></h3>
                <p className="mb-8">{t.tagline}</p>
                <p className="mb-8"><strong>Sections ({t.sections.length}): </strong>{t.sections.map((s) => SECTION_LABELS[s]).join(", ")}</p>
                <p className="mb-16">{t.investmentNote}</p>
                <p className="mb-0">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    aria-expanded={openProposal === t.kind}
                    onClick={() => setOpenProposal(openProposal === t.kind ? null : t.kind)}
                  >
                    {openProposal === t.kind ? "Hide full text" : "View full text"}
                  </button>
                </p>
              </div>
            </div>
          ))}
        </div>
        <p className="caption mt-16">
          Every proposal is editable in the generator on the audit page: pick which findings to feature,
          edit, delete, reorder, or add fix items, and hide any section. Prices always stay blank ($____)
          until you fill them in. No guarantee of client wins.
        </p>

        {openProposal ? (
          <div className="card mt-24">
            <h3>{PROPOSAL_TEMPLATES.find((t) => t.kind === openProposal)?.name} - full text</h3>
            <p className="caption">
              Template text with placeholders. Findings fill in from your latest audit; prices stay blank.
            </p>
            <pre className="evidence" style={{ whiteSpace: "pre-wrap", fontFamily: "inherit" }}>{proposalText(openProposal)}</pre>
            <p className="mt-16 mb-0">
              <button type="button" className="btn btn-secondary" onClick={() => copyText(`proposal-${openProposal}`, proposalText(openProposal))}>
                <Copy size={18} strokeWidth={1.5} aria-hidden /> {copied === `proposal-${openProposal}` ? "Copied" : "Copy proposal text"}
              </button>
            </p>
            {copyWarning ? <p className="field-error mt-16" role="alert">{copyWarning}</p> : null}
          </div>
        ) : null}

        <h2 className="mt-32">Emails: 8, one sequence</h2>
        <p className="reading">
          Three first touches for three different relationships, then Day 3 and Day 7 follow-ups in the
          same thread, a Day 14 breakup, and two warm sends after a call or a proposal. Every email,
          including follow-ups, carries the CAN-SPAM footer with your postal address from your brand profile.
        </p>
        <ol style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 16 }}>
          {EMAIL_TEMPLATES.map((e, i) => (
            <li key={e.kind} className="card" style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
              <span className="step-num" aria-hidden>{i + 1}</span>
              <div style={{ flex: "1 1 auto" }}>
                <h3 className="mt-0" style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <Mail size={18} strokeWidth={1.5} color="#475569" aria-hidden /> {e.name}
                </h3>
                <p className="mb-8">{e.purpose}</p>
                <p className="mb-8"><strong>When: </strong>{e.timing}</p>
                <p className="mb-16"><strong>Subject lines: </strong>{e.subjects.join(" / ")}</p>
                <p className="mb-0">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    aria-expanded={openEmail === e.kind}
                    onClick={() => setOpenEmail(openEmail === e.kind ? null : e.kind)}
                  >
                    {openEmail === e.kind ? "Hide email" : "View and edit email"}
                  </button>
                </p>
              </div>
            </li>
          ))}
        </ol>

        {openEmail ? (
          <div className="card mt-24">
            <h3>{EMAIL_TEMPLATES.find((e) => e.kind === openEmail)?.name}</h3>
            <p className="caption">
              Edit the body below before you copy it. If it still contains a [finding] placeholder, the copy
              button will warn you instead of copying.
            </p>
            <label htmlFor="email-draft">Email text</label>
            <textarea
              id="email-draft"
              value={emailText(openEmail)}
              onChange={(ev) => setEmailDrafts({ ...emailDrafts, [openEmail]: ev.target.value })}
              rows={14}
            />
            <p className="mt-16 mb-0">
              <button type="button" className="btn btn-secondary" onClick={() => copyText(`email-${openEmail}`, emailText(openEmail))}>
                <Copy size={18} strokeWidth={1.5} aria-hidden /> {copied === `email-${openEmail}` ? "Copied" : "Copy email"}
              </button>
            </p>
            {copyWarning ? <p className="field-error mt-16" role="alert">{copyWarning}</p> : null}
          </div>
        ) : null}

        {findingsMissing ? (
          <div className="card mt-24" role="alert" style={{ borderColor: "#fde68a", background: "#fffbeb" }}>
            <p style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 18, fontWeight: 600, margin: "0 0 8px" }}>
              <TriangleAlert size={18} strokeWidth={1.5} color="#B45309" aria-hidden /> No audit findings found
            </p>
            <p className="mb-16">
              The email and proposal templates below show [finding 1], [finding 2], and [finding 3] as
              placeholders because no audit has been run in this browser yet. Run an audit on the{" "}
              <Link href="/audit">audit page</Link> first and the real findings will fill in here.
              Never send a template with a [finding] placeholder still in it.
            </p>
            <p className="mb-0">
              <Link href="/audit" className="btn btn-primary">Run an audit first</Link>
            </p>
          </div>
        ) : null}

        {!(brand.postalAddress ?? "").trim() ? (
          <div className="card mt-24" role="alert">
            <p style={{ fontSize: 18, fontWeight: 600, margin: "0 0 8px" }}>Your postal address is missing</p>
            <p className="mb-16">
              The CAN-SPAM footer on every email below needs your real postal address. Add it in your{" "}
              <Link href="/audit">brand profile on the audit page</Link> before you send anything, or the
              footer goes out with a placeholder in it.
            </p>
          </div>
        ) : null}


        <h2 className="mt-32">CAN-SPAM footer (on every email)</h2>
        <div className="card">
          <p className="caption">
            Auto-filled from your brand profile. If your postal address is missing above, this footer is not
            ready to send.
          </p>
          <pre className="evidence" style={{ whiteSpace: "pre-wrap", fontFamily: "inherit" }}>{footerPreview}</pre>
          <p className="caption mb-0">
            You are responsible for your own outreach law, including spam, consent, and local rules where you
            operate. Only email people in line with the rules that apply to you.
          </p>
        </div>

        <p className="reading mt-32">
          You are responsible for your own outreach law. Only email people in line with the rules that
          apply to you and to them. See the sending checklist below. DealNote provides no cold SMS scripts.
          Do not send marketing texts to a prospect unless you already have their prior express written consent.
        </p>

        <h2 className="mt-32">Before you send: checklist</h2>
        <div className="card">
          <ul style={{ listStyle: "none", paddingLeft: 0, marginBottom: 0 }}>
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
