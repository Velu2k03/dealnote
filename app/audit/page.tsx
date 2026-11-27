"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Camera,
  CheckCircle2,
  Eye,
  FileText,
  Loader2,
  Mail,
  Play,
  Printer,
  Send,
} from "lucide-react";
import {
  DEFAULT_BRAND,
  isValidAuditUrl,
  proposalItemsFromIssues,
  sampleAudit,
  type AuditResult,
  type BrandProfile,
} from "@/lib/audit";
import { IssueList, ScoreSummary } from "@/components/audit-ui";

type TrackerStatus = "Not Sent" | "Sent" | "Replied" | "Closed";

interface TrackedProposal {
  id: string;
  business: string;
  url: string;
  status: TrackerStatus;
  updatedAt: string;
}

const TRACKER_KEY = "dealnote-proposals-v1";
const BRAND_KEY = "dealnote-brand-v1";

const STEPS = ["Validating the URL", "Fetching the homepage", "Checking links and page details", "Scoring the six categories"];

function loadTracker(): TrackedProposal[] {
  try {
    const raw = localStorage.getItem(TRACKER_KEY);
    return raw ? (JSON.parse(raw) as TrackedProposal[]) : [];
  } catch {
    return [];
  }
}

export default function AuditPage() {
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const [running, setRunning] = useState(false);
  const [step, setStep] = useState(0);
  const [result, setResult] = useState<AuditResult | null>(null);
  const [fetchFailed, setFetchFailed] = useState("");
  const [showSample, setShowSample] = useState(false);
  const [brand, setBrand] = useState<BrandProfile>(DEFAULT_BRAND);
  const [tracker, setTracker] = useState<TrackedProposal[]>([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setTracker(loadTracker());
    try {
      const raw = localStorage.getItem(BRAND_KEY);
      if (raw) setBrand({ ...DEFAULT_BRAND, ...(JSON.parse(raw) as BrandProfile) });
    } catch {
      // Keep the default brand profile.
    }
  }, []);

  const saveTracker = (next: TrackedProposal[]) => {
    setTracker(next);
    localStorage.setItem(TRACKER_KEY, JSON.stringify(next));
  };

  const saveBrand = (next: BrandProfile) => {
    setBrand(next);
    localStorage.setItem(BRAND_KEY, JSON.stringify(next));
  };

  const runAudit = async () => {
    const check = isValidAuditUrl(url);
    if (!check.ok) {
      setError(check.error);
      return;
    }
    setError("");
    setFetchFailed("");
    setResult(null);
    setShowSample(false);
    setRunning(true);
    setStep(0);
    const timer = setInterval(() => setStep((s) => Math.min(s + 1, STEPS.length - 1)), 4000);
    try {
      const res = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: check.url }),
      });
      const data = await res.json();
      if (!res.ok) {
        setFetchFailed(typeof data.error === "string" ? data.error : "The audit could not run.");
      } else {
        const audit = data as AuditResult;
        setResult(audit);
        // Keep the default intro line honest: if the buyer has not edited it,
        // state the real finding count for this audit instead of the sample's 7.
        if (brand.introLine === DEFAULT_BRAND.introLine) {
          saveBrand({ ...brand, introLine: `I reviewed your website and found ${audit.issues.length} quick wins.` });
        }
      }
    } catch {
      setFetchFailed("The audit request failed. Check your connection and try again, or view the sample audit below.");
    } finally {
      clearInterval(timer);
      setRunning(false);
    }
  };

  const displayed: AuditResult | null = result ?? (showSample ? sampleAudit() : null);
  const proposalItems = useMemo(
    () => (displayed ? proposalItemsFromIssues(displayed.issues) : []),
    [displayed],
  );

  const addToTracker = () => {
    if (!displayed) return;
    const entry: TrackedProposal = {
      id: `${Date.now()}`,
      business: displayed.url.replace(/^https?:\/\//, "").replace(/\/$/, ""),
      url: displayed.url,
      status: "Not Sent",
      updatedAt: new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }),
    };
    saveTracker([entry, ...tracker]);
  };

  const setStatus = (id: string, status: TrackerStatus) => {
    saveTracker(
      tracker.map((t) =>
        t.id === id ? { ...t, status, updatedAt: new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) } : t,
      ),
    );
  };

  const proposalText = useMemo(() => {
    if (!displayed) return "";
    const lines: string[] = [];
    lines.push(`Website redesign proposal for ${displayed.url}`);
    lines.push(`Prepared by ${brand.brandName}, ${brand.contactName}, ${brand.contactEmail}`);
    lines.push("");
    lines.push("What I found");
    displayed.issues.slice(0, 3).forEach((issue) => lines.push(`- ${issue.title}: ${issue.why}`));
    lines.push("");
    lines.push("What I would fix");
    proposalItems.forEach((item) => lines.push(`- [${item.phase}] ${item.title}: ${item.detail}`));
    lines.push("");
    lines.push("Investment");
    lines.push("Essential: $____");
    lines.push("Growth: $____");
    lines.push("Premium: $____");
    lines.push("");
    lines.push(`Next step: ${brand.ctaText}: ${brand.ctaLink}`);
    return lines.join("\n");
  }, [displayed, brand, proposalItems]);

  const copyProposal = async () => {
    try {
      await navigator.clipboard.writeText(proposalText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <>
      <section style={{ paddingTop: 48 }}>
        <div className="container">
          <div className="reading">
            <p className="eyebrow">Audit tool</p>
            <h1>Run a teardown</h1>
            <p>
              Paste a public business website URL. The audit runs on the server, reads the homepage, and
              scores six categories. The free result shows the full score and findings in v1.
            </p>
          </div>

          <div className="card mt-24">
            <label htmlFor="audit-url">Business website URL</label>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <input
                id="audit-url"
                type="url"
                inputMode="url"
                placeholder="https://www.example-plumbing.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") runAudit();
                }}
                style={{ flex: "1 1 280px" }}
                aria-describedby={error ? "audit-url-error" : undefined}
              />
              <button className="btn btn-primary" onClick={runAudit} disabled={running} style={{ flex: "0 0 auto" }}>
                {running ? <Loader2 size={18} strokeWidth={1.5} aria-hidden /> : <Play size={18} strokeWidth={1.5} aria-hidden />}
                {running ? "Running audit…" : "Run audit"}
              </button>
            </div>
            {error ? <p id="audit-url-error" className="field-error">{error}</p> : null}
            <p className="caption mt-16 mb-0">
              Public http or https addresses only. The audit reads the homepage and checks up to 10 internal
              links. It never submits forms, logs in, or bypasses a login page.
            </p>
          </div>

          {running ? (
            <div className="card mt-24" aria-live="polite">
              <h3>Running the audit</h3>
              {STEPS.map((label, i) => (
                <div key={label} className="progress-step">
                  <span className={`progress-dot ${i < step ? "done" : i === step ? "active" : ""}`}>
                    {i < step ? "✓" : i + 1}
                  </span>
                  <span style={{ paddingTop: 3 }}>{label}</span>
                </div>
              ))}
              <p className="caption mb-0">Audits usually take 10 to 30 seconds, depending on the site.</p>
            </div>
          ) : null}

          {fetchFailed ? (
            <div className="card mt-24" role="alert" style={{ borderColor: "#fecaca" }}>
              <h3>Audit could not read that page</h3>
              <p>{fetchFailed}</p>
              <p className="mb-16">
                No score was given for a page that could not be read. You can still see how the product
                works with the sample audit below, which uses fictional data only.
              </p>
              <button className="btn btn-secondary" onClick={() => { setShowSample(true); setFetchFailed(""); }}>
                <Eye size={18} strokeWidth={1.5} aria-hidden /> Show the sample audit instead
              </button>
            </div>
          ) : null}

          {displayed ? (
            <>
              <div className="mt-32">
                {displayed.isSample ? (
                  <p><span className="sample-stamp">SAMPLE: fictional business, fictional data</span></p>
                ) : null}
                <ScoreSummary result={displayed} sampleLabel={displayed.isSample} />
              </div>

              <div className="card mt-24">
                <h3 style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <Camera size={18} strokeWidth={1.5} color="#475569" aria-hidden /> Homepage screenshot
                </h3>
                <p className="mb-0">
                  Screenshot capture is not built in v1. Paid reports will include a mobile and desktop
                  screenshot of the homepage. For now, the findings above are drawn from the fetched page
                  itself.
                </p>
              </div>

              <h2 className="mt-32">Findings ({displayed.issues.length})</h2>
              <p className="reading">
                Each finding shows what was found, why it matters, and the fix. Findings are ordered by
                severity: Critical first.
              </p>
              {displayed.issues.length > 0 ? (
                <IssueList issues={displayed.issues} />
              ) : (
                <div className="card">
                  <p className="mb-0">No issues found in the checks run. That is a clean result for this page, not a guarantee about the rest of the site.</p>
                </div>
              )}

              {displayed.couldNotCheck.length > 0 ? (
                <div className="card mt-24">
                  <h3>Could not check</h3>
                  <ul style={{ paddingLeft: 20, marginBottom: 0 }}>
                    {displayed.couldNotCheck.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                  <p className="caption mt-16 mb-0">
                    Anything the engine could not read gets this state and never lowers the score.
                  </p>
                </div>
              ) : null}

              <h2 className="mt-32">Page facts</h2>
              <div className="stack-table">
                <table>
                  <thead>
                    <tr><th>Check</th><th>Result</th></tr>
                  </thead>
                  <tbody>
                    <tr><td data-label="Check">Page title</td><td data-label="Result">{displayed.title || "Missing"}</td></tr>
                    <tr><td data-label="Check">Meta description</td><td data-label="Result">{displayed.metaDescription || "Missing"}</td></tr>
                    <tr><td data-label="Check">H1 headings</td><td data-label="Result">{displayed.h1Count}</td></tr>
                    <tr><td data-label="Check">Images / missing alt text</td><td data-label="Result">{displayed.imageCount} / {displayed.imagesMissingAlt}</td></tr>
                    <tr><td data-label="Check">Internal / external links</td><td data-label="Result">{displayed.internalLinks} / {displayed.externalLinks}</td></tr>
                    <tr><td data-label="Check">Broken links found</td><td data-label="Result">{displayed.brokenLinks.length === 0 ? "None in the links checked" : displayed.brokenLinks.map((b) => `${b.url} (${b.status})`).join(", ")}</td></tr>
                    <tr><td data-label="Check">Mobile viewport tag</td><td data-label="Result">{displayed.hasViewport ? "Yes" : "No"}</td></tr>
                    <tr><td data-label="Check">LocalBusiness schema</td><td data-label="Result">{displayed.hasSchema ? "Yes" : "No"}</td></tr>
                    <tr><td data-label="Check">Tap-to-call link</td><td data-label="Result">{displayed.hasTel ? "Yes" : "No"}</td></tr>
                    <tr><td data-label="Check">Contact form</td><td data-label="Result">{displayed.hasForm ? `Yes, ${displayed.formFields} fields` : "No"}</td></tr>
                    <tr><td data-label="Check">robots.txt / sitemap.xml</td><td data-label="Result">{displayed.hasRobots === null ? "Could not check" : displayed.hasRobots ? "Found" : "Not found"} / {displayed.hasSitemap === null ? "Could not check" : displayed.hasSitemap ? "Found" : "Not found"}</td></tr>
                  </tbody>
                </table>
              </div>

              <h2 className="mt-32">White-label preview</h2>
              <p className="reading">
                Set your brand once. The sample report preview below rebrands instantly. Your details are
                stored only in this browser in v1. Client reports carry your brand only, never the DealNote name.
              </p>
              <div className="two-col">
                <div className="card">
                  <div className="form-grid">
                    <div>
                      <label htmlFor="brand-name">Brand / business name</label>
                      <input id="brand-name" type="text" value={brand.brandName} onChange={(e) => saveBrand({ ...brand, brandName: e.target.value })} />
                    </div>
                    <div>
                      <label htmlFor="contact-name">Contact name</label>
                      <input id="contact-name" type="text" value={brand.contactName} onChange={(e) => saveBrand({ ...brand, contactName: e.target.value })} />
                    </div>
                    <div>
                      <label htmlFor="contact-email">Contact email</label>
                      <input id="contact-email" type="email" value={brand.contactEmail} onChange={(e) => saveBrand({ ...brand, contactEmail: e.target.value })} />
                    </div>
                    <div>
                      <label htmlFor="contact-phone">Contact phone</label>
                      <input id="contact-phone" type="tel" value={brand.contactPhone} onChange={(e) => saveBrand({ ...brand, contactPhone: e.target.value })} />
                    </div>
                    <div>
                      <label htmlFor="brand-website">Website URL</label>
                      <input id="brand-website" type="url" value={brand.website} onChange={(e) => saveBrand({ ...brand, website: e.target.value })} />
                    </div>
                    <div>
                      <label htmlFor="cta-text">Call-to-action text</label>
                      <input id="cta-text" type="text" value={brand.ctaText} onChange={(e) => saveBrand({ ...brand, ctaText: e.target.value })} />
                    </div>
                    <div>
                      <label htmlFor="primary-color">Primary brand colour</label>
                      <input id="primary-color" type="color" value={brand.primaryColor} onChange={(e) => saveBrand({ ...brand, primaryColor: e.target.value })} />
                    </div>
                    <div>
                      <label htmlFor="accent-color">Accent colour</label>
                      <input id="accent-color" type="color" value={brand.accentColor} onChange={(e) => saveBrand({ ...brand, accentColor: e.target.value })} />
                    </div>
                  </div>
                  <div className="mt-16">
                    <label htmlFor="intro-line">Report intro line</label>
                    <input id="intro-line" type="text" value={brand.introLine} onChange={(e) => saveBrand({ ...brand, introLine: e.target.value })} />
                  </div>
                </div>
                <div className="card" style={{ borderTop: `4px solid ${brand.primaryColor}` }}>
                  <p className="eyebrow" style={{ color: brand.primaryColor }}>Report preview</p>
                  <h3 style={{ color: brand.primaryColor }}>Website Teardown and Proposal</h3>
                  <p><strong>{displayed.url}</strong></p>
                  <p>{brand.introLine}</p>
                  <p className="mb-8">Prepared by {brand.contactName}, {brand.brandName}</p>
                  <p className="caption mb-16">
                    {brand.contactEmail}
                    {brand.contactPhone ? ` · ${brand.contactPhone}` : ""} · {brand.website}
                  </p>
                  <p className="mb-0">
                    <span className="btn btn-primary" style={{ background: brand.primaryColor }}>
                      {brand.ctaText}
                    </span>
                  </p>
                </div>
              </div>

              <h2 className="mt-32">Proposal generator</h2>
              <p className="reading">
                The findings above become a What I Would Fix list. Prices are blank placeholders only.
                DealNote never fills in a price, a timeline promise, or a results promise.
              </p>
              <div className="card">
                <h3>What I would fix</h3>
                {["Quick wins", "Redesign", "Ongoing"].map((phase) => {
                  const items = proposalItems.filter((i) => i.phase === phase);
                  if (items.length === 0) return null;
                  return (
                    <div key={phase} style={{ marginBottom: 16 }}>
                      <h4 style={{ fontSize: 15, margin: "0 0 8px" }}>{phase}</h4>
                      <ul style={{ paddingLeft: 20, margin: 0 }}>
                        {items.map((item) => (
                          <li key={item.title} style={{ marginBottom: 8 }}>
                            <strong>{item.title}.</strong> {item.detail}
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
                <h3>Investment</h3>
                <div className="stack-table">
                  <table>
                    <thead><tr><th>Tier</th><th>Includes</th><th>Price</th></tr></thead>
                    <tbody>
                      <tr><td data-label="Tier">Essential</td><td data-label="Includes">Quick wins, core pages, basic SEO setup</td><td data-label="Price">$____</td></tr>
                      <tr><td data-label="Tier">Growth</td><td data-label="Includes">Everything in Essential, plus redesign, forms, and trust sections</td><td data-label="Price">$____</td></tr>
                      <tr><td data-label="Tier">Premium</td><td data-label="Includes">Everything in Growth, plus ongoing support period</td><td data-label="Price">$____</td></tr>
                    </tbody>
                  </table>
                </div>
                <p className="caption">Fill in the prices yourself before sending. Payment terms placeholder: 50% upfront, 50% on launch.</p>
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                  <button className="btn btn-secondary" onClick={copyProposal}>
                    <FileText size={18} strokeWidth={1.5} aria-hidden /> {copied ? "Copied" : "Copy proposal text"}
                  </button>
                  <Link href="/templates" className="btn btn-secondary">
                    <Mail size={18} strokeWidth={1.5} aria-hidden /> See proposal templates
                  </Link>
                </div>
              </div>

              <h2 className="mt-32">Outreach tracker</h2>
              <p className="reading">
                Track each proposal you send. Stored only in this browser. Nothing is sent anywhere.
              </p>
              <div className="card">
                <button className="btn btn-primary" onClick={addToTracker}>
                  <Send size={18} strokeWidth={1.5} aria-hidden /> Add this proposal to the tracker
                </button>
                {tracker.length === 0 ? (
                  <p className="mt-16 mb-0">No proposals tracked yet.</p>
                ) : (
                  <div className="stack-table mt-16">
                    <table>
                      <thead><tr><th>Prospect</th><th>Status</th><th>Updated</th></tr></thead>
                      <tbody>
                        {tracker.map((t) => (
                          <tr key={t.id}>
                            <td data-label="Prospect" style={{ overflowWrap: "anywhere" }}>{t.business}</td>
                            <td data-label="Status">
                              <select
                                value={t.status}
                                onChange={(e) => setStatus(t.id, e.target.value as TrackerStatus)}
                                aria-label={`Status for ${t.business}`}
                              >
                                <option>Not Sent</option>
                                <option>Sent</option>
                                <option>Replied</option>
                                <option>Closed</option>
                              </select>
                            </td>
                            <td data-label="Updated">{t.updatedAt}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              <div className="callout mt-32">
                <p className="mb-8"><strong>Payment coming soon.</strong> In v1 the audit and preview are free to try. Full paid PDF downloads arrive when payment is wired up.</p>
                <p className="mb-0">
                  <Link href="/sample" className="btn btn-secondary">
                    <Printer size={18} strokeWidth={1.5} aria-hidden /> Print the sample report to PDF
                  </Link>{" "}
                  <span className="caption">The sample report page offers print-to-PDF for the sample only.</span>
                </p>
              </div>
            </>
          ) : null}

          {!displayed && !running && !fetchFailed ? (
            <div className="card mt-24">
              <h3 className="mb-8">No audit yet</h3>
              <p className="mb-16">
                Run an audit above, or look at the sample first. The sample uses a fictional business and
                fictional data, and is clearly marked SAMPLE.
              </p>
              <Link href="/sample" className="btn btn-secondary">
                <Eye size={18} strokeWidth={1.5} aria-hidden /> View the sample report
              </Link>
            </div>
          ) : null}

          <p className="caption mt-32">
            <CheckCircle2 size={18} strokeWidth={1.5} aria-hidden style={{ verticalAlign: "text-bottom" }} />{" "}
            Audit method: direct fetch of the public homepage only. No Google Maps or Places data, no traffic
            or ranking estimates, no invented figures. Scores are lab measurements on the run date and can vary
            between runs.
          </p>
        </div>
      </section>
    </>
  );
}
