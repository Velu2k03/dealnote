"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  Check,
  ChevronDown,
  ChevronUp,
  Download,
  Eye,
  FileText,
  Loader2,
  Lock,
  Mail,
  Play,
  Plus,
  Printer,
  Send,
  Trash2,
} from "lucide-react";
import {
  DEFAULT_BRAND,
  isValidAuditUrl,
  proposalItemsFromIssues,
  sampleAudit,
  type AuditResult,
  type BrandProfile,
  type ProposalItem,
} from "@/lib/audit";
import {
  DEFAULT_SCOPE,
  DEFAULT_TIMELINE,
  NOT_INCLUDED_DEFAULT,
  PROPOSAL_TEMPLATES,
  SECTION_LABELS,
  buildProposalText,
  defaultSections,
  introLineForAudit,
  type ProposalKind,
  type SectionKey,
} from "@/lib/templates";
import { BuyButton, IssueList, ScoreSummary } from "@/components/audit-ui";
import {
  SakugaButton,
  SakugaCheckbox,
  SakugaInput,
  SakugaProgress,
  SakugaRadio,
  SakugaRating,
  SakugaScripts,
  SakugaSlider,
  SakugaToggle,
  showToast,
  type SakugaEl,
} from "@/components/sakuga";

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
const LICENSE_KEY = "dealnote-license-v1";
const LAST_FINDINGS_KEY = "dealnote-last-findings-v1";
const RATING_KEY = "dealnote-rating-v1";

const STEPS = ["Validating the URL", "Fetching the homepage", "Checking links and page details", "Scoring the six categories"];

const LOCAL_STORAGE_NOTICE =
  "Your brand profile and outreach tracker are stored only in this browser's local storage. Nothing is sent to DealNote or anyone else. Clear them in your browser settings to delete them.";

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
  const [isTeaser, setIsTeaser] = useState(false);
  const [totalFindings, setTotalFindings] = useState<number | null>(null);
  const [fetchFailed, setFetchFailed] = useState("");
  const [showSample, setShowSample] = useState(false);
  const [brand, setBrand] = useState<BrandProfile>(DEFAULT_BRAND);
  const [tracker, setTracker] = useState<TrackedProposal[]>([]);
  const [copied, setCopied] = useState(false);
  const [licenseKey, setLicenseKey] = useState("");
  const [logoError, setLogoError] = useState("");
  const [prices, setPrices] = useState({ essential: "", growth: "", premium: "", monthly: "" });
  const [templateKind, setTemplateKind] = useState<ProposalKind>("quickfix");
  const [sections, setSections] = useState<Record<SectionKey, boolean>>(defaultSections("quickfix"));
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [fixItems, setFixItems] = useState<ProposalItem[]>([]);
  const [newFixTitle, setNewFixTitle] = useState("");
  const [newFixDetail, setNewFixDetail] = useState("");
  const [newFixPhase, setNewFixPhase] = useState("Quick wins");
  const [scopeText, setScopeText] = useState(DEFAULT_SCOPE.join("\n"));
  const [timelineText, setTimelineText] = useState(DEFAULT_TIMELINE.join("\n"));
  const [notIncludedText, setNotIncludedText] = useState(NOT_INCLUDED_DEFAULT.join("\n"));
  const [expiryDays, setExpiryDays] = useState("");
  const [pdfBusy, setPdfBusy] = useState(false);
  const [pdfMessage, setPdfMessage] = useState("");
  const [showPreview, setShowPreview] = useState(true);
  const [rating, setRating] = useState(0);
  const runBtnRef = useRef<SakugaEl | null>(null);

  // Guard so the hero-form auto-run fires exactly once, even under
  // React StrictMode double effects in development.
  const autoRanRef = useRef(false);

  useEffect(() => {
    // Hero form on the home page links here as /audit?url=... : prefill it
    // and run the audit straight away (Neon whole-site audit P1-1: the
    // form used to prefill but never run, so the visitor had to press
    // Run a second time). runAuditFor is defined below; the effect runs
    // after the whole component body, so the closure sees it.
    try {
      const q = new URLSearchParams(window.location.search).get("url");
      if (q) {
        setUrl(q);
        if (!autoRanRef.current && isValidAuditUrl(q).ok) {
          autoRanRef.current = true;
          runAuditFor(q);
        }
      }
    } catch {
      // Keep the URL box empty.
    }
    setTracker(loadTracker());
    try {
      const savedRating = Number(localStorage.getItem(RATING_KEY) ?? "0");
      if (savedRating >= 1 && savedRating <= 5) setRating(savedRating);
    } catch {
      // No saved rating.
    }
    try {
      const raw = localStorage.getItem(BRAND_KEY);
      if (raw) setBrand({ ...DEFAULT_BRAND, ...(JSON.parse(raw) as BrandProfile) });
    } catch {
      // Keep the default brand profile.
    }
    try {
      setLicenseKey(localStorage.getItem(LICENSE_KEY) ?? "");
    } catch {
      // No stored license key.
    }
    try {
      const savedDefault = localStorage.getItem("dealnote-default-template-v1");
      if (savedDefault && PROPOSAL_TEMPLATES.some((t) => t.kind === savedDefault)) {
        const kind = savedDefault as ProposalKind;
        setTemplateKind(kind);
        setSections(defaultSections(kind));
      }
    } catch {
      // Keep the default template.
    }
  }, []);

  const saveRating = (next: number) => {
    setRating(next);
    try {
      if (next > 0) localStorage.setItem(RATING_KEY, String(next));
      else localStorage.removeItem(RATING_KEY);
    } catch {
      // Rating is a convenience; a failed save is not fatal.
    }
    if (next > 0) showToast("Thanks for rating this teardown.");
  };

  const saveTracker = (next: TrackedProposal[]) => {
    setTracker(next);
    localStorage.setItem(TRACKER_KEY, JSON.stringify(next));
  };

  const saveBrand = (next: BrandProfile) => {
    setBrand(next);
    localStorage.setItem(BRAND_KEY, JSON.stringify(next));
  };

  const saveLicenseKey = (next: string) => {
    setLicenseKey(next);
    try {
      if (next) localStorage.setItem(LICENSE_KEY, next);
      else localStorage.removeItem(LICENSE_KEY);
    } catch {
      // Storage unavailable; the key still works for this run.
    }
  };

  const onLogoFile = (file: File | undefined) => {
    if (!file) return;
    if (file.type !== "image/png" && file.type !== "image/jpeg") {
      setLogoError("Choose a PNG or JPG logo.");
      return;
    }
    if (file.size > 512 * 1024) {
      setLogoError("Choose a logo under 512 KB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      saveBrand({ ...brand, logoDataUrl: String(reader.result) });
      setLogoError("");
    };
    reader.readAsDataURL(file);
  };

  const runAuditFor = async (targetUrl: string) => {
    const check = isValidAuditUrl(targetUrl);
    if (!check.ok) {
      setError(check.error);
      return;
    }
    setError("");
    setFetchFailed("");
    setResult(null);
    setIsTeaser(false);
    setTotalFindings(null);
    setShowSample(false);
    setRunning(true);
    setStep(0);
    const timer = setInterval(() => setStep((s) => Math.min(s + 1, STEPS.length - 1)), 4000);
    try {
      const res = await fetch("/api/audit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(licenseKey ? { "x-dealnote-license": licenseKey } : {}),
        },
        body: JSON.stringify({ url: check.url, licenseKey: licenseKey || undefined }),
        // check.url is the normalised target URL, so the request never
        // depends on the url state having caught up with setUrl.
      });
      const data = (await res.json()) as AuditResult & {
        error?: string;
        teaser?: boolean;
        locked?: boolean;
        isTeaser?: boolean;
        totalIssues?: number;
        totalFindings?: number;
      };
      if (!res.ok) {
        setFetchFailed(data.error ?? "The audit could not run.");
      } else {
        const audit = data as AuditResult;
        setResult(audit);
        // The Sakuga run button lands its check only when the audit
        // actually worked (the skill's done() rule).
        if (runBtnRef.current && typeof runBtnRef.current.done === "function") {
          (runBtnRef.current.done as () => void)();
        }
        // Teaser detection: the server marks a teaser response, or reports
        // more findings than it returned. Anything else is a full result.
        // The client renders only what the server returned, never more.
        const totalKnown =
          typeof data.totalIssues === "number"
            ? data.totalIssues
            : typeof data.totalFindings === "number"
              ? data.totalFindings
              : null;
        const teaser =
          data.teaser === true ||
          data.locked === true ||
          data.isTeaser === true ||
          (totalKnown !== null && Array.isArray(data.issues) && totalKnown > data.issues.length);
        setIsTeaser(teaser);
        setTotalFindings(totalKnown);
        // Store the findings for the templates page even for a free
        // teaser: the teaser carries the top 2 real findings, and the
        // templates page fills in from them instead of forcing a re-run
        // (Neon whole-site audit P1-2). The stored record also carries
        // the URL and score so /templates can show a live preview line.
        // Only a full result feeds the intro-line finding count, because
        // a teaser must not claim the total count from 2 findings.
        try {
          localStorage.setItem(
            LAST_FINDINGS_KEY,
            JSON.stringify({
              url: audit.url,
              score: audit.overallScore,
              grade: audit.overallGrade,
              findings: audit.issues.map((i) => i.title),
              fetchedAt: audit.fetchedAt,
            }),
          );
        } catch {
          // Finding auto-fill is a convenience; a failed save is not fatal.
        }
        if (!teaser) {
          // Keep the default intro line honest: if the buyer has not edited it,
          // state the real finding count for this audit instead of the sample's 7.
          // A 0-findings audit never claims "found 0 quick wins".
          if (brand.introLine === DEFAULT_BRAND.introLine) {
            saveBrand({
              ...brand,
              introLine:
                audit.issues.length === 0
                  ? "I reviewed your website and found it in good shape."
                  : `I reviewed your website and found ${audit.issues.length} quick wins.`,
            });
          }
        }
      }
    } catch {
      setFetchFailed("The audit request failed. Check your connection and try again, or view the sample audit below.");
    } finally {
      clearInterval(timer);
      setRunning(false);
    }
  };

  const runAudit = () => runAuditFor(url);

  const displayed: AuditResult | null = result ?? (showSample ? sampleAudit() : null);
  // Sample audits are always fully visible. A live result is locked when
  // the server returned a teaser; the full result shows only with a license key.
  const locked = result !== null && isTeaser && !displayed?.isSample;

  // When a new audit (or the sample) appears, select the top 3 findings by
  // default and build the fix list from them. Findings are quoted verbatim
  // and never rewritten; the buyer only picks which ones to feature.
  useEffect(() => {
    if (!displayed) {
      setSelectedIds([]);
      setFixItems([]);
      return;
    }
    const top = displayed.issues.slice(0, 3).map((i) => i.id);
    setSelectedIds(top);
    setFixItems(proposalItemsFromIssues(displayed.issues.filter((i) => top.includes(i.id))));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [displayed?.url, displayed?.fetchedAt, displayed?.issues.length]);

  const selectedIssues = useMemo(
    () => (displayed ? displayed.issues.filter((i) => selectedIds.includes(i.id)) : []),
    [displayed, selectedIds],
  );

  // A 0-findings audit renders no fix proposal at all: only the
  // good-shape card above and the Retainer Opener path below. The full
  // generator shows once the buyer switches to the Retainer Opener.
  const showGenerator = displayed ? displayed.issues.length > 0 || templateKind === "retainer" : false;

  const toggleFinding = (id: string) => {
    const next = selectedIds.includes(id) ? selectedIds.filter((x) => x !== id) : [...selectedIds, id];
    setSelectedIds(next);
    // Merge, never rebuild: ticking a finding adds only that finding's
    // item (if it is not already there); unticking removes only the item
    // generated from that finding. Edits to every other fix item, and any
    // custom items the buyer added, are kept exactly as they are.
    if (displayed) {
      if (selectedIds.includes(id)) {
        setFixItems(fixItems.filter((item) => item.issueId !== id));
      } else {
        const issue = displayed.issues.find((i) => i.id === id);
        if (issue && !fixItems.some((item) => item.issueId === id)) {
          setFixItems([...fixItems, ...proposalItemsFromIssues([issue])]);
        }
      }
    }
  };

  const changeTemplate = (kind: ProposalKind) => {
    setTemplateKind(kind);
    setSections(defaultSections(kind));
  };

  const templateDef = PROPOSAL_TEMPLATES.find((t) => t.kind === templateKind) ?? PROPOSAL_TEMPLATES[1];
  const scopeLines = useMemo(() => scopeText.split("\n").map((s) => s.trim()).filter(Boolean), [scopeText]);
  const timelineLines = useMemo(() => timelineText.split("\n").map((s) => s.trim()).filter(Boolean), [timelineText]);
  const notIncludedLines = useMemo(() => notIncludedText.split("\n").map((s) => s.trim()).filter(Boolean), [notIncludedText]);

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
    showToast("Proposal added to the tracker.");
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
    return buildProposalText({
      kind: templateKind,
      brand,
      business: displayed.url,
      runDate: displayed.fetchedAt,
      issues: selectedIssues,
      items: fixItems,
      sections,
      prices,
      scopeLines,
      timelineLines,
      notIncluded: notIncludedLines,
      expiryDays,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [displayed, brand, selectedIssues, fixItems, sections, prices, scopeLines, timelineLines, notIncludedLines, expiryDays, templateKind]);

  const downloadProposalPdf = async () => {
    if (!displayed) return;
    if (!licenseKey.trim()) {
      setPdfMessage("A license key is required to download the proposal PDF. Enter your key above, or buy DealNote ($49 one-time).");
      return;
    }
    setPdfBusy(true);
    setPdfMessage("");
    try {
      const res = await fetch("/api/pdf/proposal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: displayed.url,
          licenseKey: licenseKey.trim(),
          brand,
          items: fixItems,
          template: templateKind,
          sections,
          prices,
          scopeLines,
          timelineLines,
          notIncluded: notIncludedLines,
          expiryDays,
          selectedIssueIds: selectedIds,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setPdfMessage(typeof data.error === "string" ? data.error : "The proposal PDF could not be generated.");
        return;
      }
      const blob = await res.blob();
      const href = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = href;
      a.download = "dealnote-proposal.pdf";
      a.click();
      URL.revokeObjectURL(href);
      setPdfMessage("Proposal PDF downloaded.");
      showToast("Proposal PDF downloaded.");
    } catch {
      setPdfMessage("The proposal PDF could not be downloaded. Check your connection and try again.");
    } finally {
      setPdfBusy(false);
    }
  };

  const copyProposal = async () => {
    try {
      await navigator.clipboard.writeText(proposalText);
      setCopied(true);
      showToast("Proposal text copied.");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const logoSrc = brand.logoDataUrl || brand.logoUrl || "";

  return (
    <>
      {/* Sakuga controls used on this page, lazy-loaded after the first
          paint. Toggle is ~506 KB (43 painted frames), so it loads last. */}
      <SakugaScripts names={["input", "checkbox", "radio", "slider", "progress", "rating", "toggle"]} />
      <section style={{ paddingTop: "3rem" }}>
        <div className="container audit-layout">
          <div className="reading">
            <h1>Run a teardown</h1>
            {/* Copy clean-up (28 Nov 2026, Velu: too much text above the form.
                Research first: SEOptimer's embed form is one headline + URL
                + email, no explainer above the form; Krug: cut half the words,
                then half again; detail lives behind a help link. The full
                research is in docs/dealnote-audit-copy-research-2026-11-28.md
                and the exact wording still goes to Neon in the Gemini web app,
                Task mode, Gemini 4 Neon High, for a final decision. Nothing
                legal was cut: robots.txt, no-login, and the lab-measurement
                disclaimer live in the "How the audit works" details below and
                in /terms. */}
            <p>Paste a public website URL. Free result: score, grade, top 2 findings.</p>
          </div>

          <div className="card mt-24">
            <label htmlFor="audit-url" className="micro-label">Website URL</label>
            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", alignItems: "flex-start" }}>
              <div style={{ flex: "1 1 17.5rem", minWidth: 0 }}>
                <SakugaInput
                  label="Website URL"
                  type="url"
                  name="url"
                  placeholder="https://example-plumbing.com"
                  value={url}
                  autoFocus
                  onInput={setUrl}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") runAudit();
                  }}
                  ariaLabel="Business website URL"
                />
              </div>
              <SakugaButton ref={runBtnRef} onClick={runAudit} disabled={running}>
                {running ? "Running audit…" : "Run audit"}
              </SakugaButton>
            </div>
            {error ? <p id="audit-url-error" className="field-error">{error}</p> : null}
            {/* Neon /audit copy decision (28 Nov 2026): one utility row, 1 line,
                2 disclosures. "How the audit works" carries Neon's exact
                wording; "Have a license key?" holds the key input + Save key.
                The open License key input and duplicate Buy button that used
                to sit in this card are cut; Buy stays in the result paywall
                and the footer. */}
            <div className="utility-row">
              <details className="help">
                <summary>How the audit works</summary>
                <p className="caption">
                  What we check: DealNote fetches the public homepage (http or https only) and checks up to
                  10 internal links on the server. It never logs in, submits forms, or bypasses a login wall.
                  If robots.txt disallows automated fetches, the audit stops and no score is given. No Google
                  Maps/Places data, traffic estimates, or invented figures are used.
                </p>
                <p className="caption">
                  How scoring works: Scores are DealNote&apos;s own lab measurements on the run date, not
                  Lighthouse, PageSpeed, or search-ranking scores, and can vary between runs. Weights: Speed
                  20, Mobile 15, On-page SEO 20, Technical 15, Conversion 15, Trust and local 15. Grades:
                  A 90-100, B 80-89, C 70-79, D 60-69, F below 60.
                </p>
              </details>
              <details className="help">
                <summary>Have a license key?</summary>
                <label htmlFor="license-key" className="micro-label">License key</label>
                <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", alignItems: "center" }}>
                  <input
                    id="license-key"
                    type="text"
                    autoComplete="off"
                    placeholder="Paste your license key"
                    value={licenseKey}
                    onChange={(e) => saveLicenseKey(e.target.value.trim())}
                    style={{ flex: "1 1 17.5rem" }}
                  />
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      saveLicenseKey(licenseKey.trim());
                      showToast("License key saved in this browser.");
                    }}
                  >
                    Save key
                  </button>
                </div>
                <p className="caption mt-8 mb-0">
                  Stored only in this browser. Lost your key? Check your Lemon Squeezy receipt email or email{" "}
                  <a href="mailto:murugan@drvelu.com?subject=DealNote%20license%20key%20recovery">murugan@drvelu.com</a>.
                </p>
              </details>
            </div>
          </div>

          {running ? (
            <div className="card mt-24" aria-live="polite">
              <h2>Running the audit</h2>
              <SakugaProgress label="Running the audit" progress={(step + 1) / STEPS.length} />
              {STEPS.map((label, i) => (
                <div key={label} className="progress-step">
                  <span className={`progress-dot ${i < step ? "done" : i === step ? "active" : ""}`}>
                    {i < step ? <Check size={18} strokeWidth={1.5} aria-hidden /> : i + 1}
                  </span>
                  <span style={{ paddingTop: "0.1875rem" }}>{label}</span>
                </div>
              ))}
              <p className="caption mb-0">Audits usually take 10 to 30 seconds, depending on the site.</p>
            </div>
          ) : null}

          {fetchFailed ? (
            <div className="card mt-24" role="alert" style={{ borderColor: "#fecaca" }}>
              <h2>Audit could not read that page</h2>
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
              <div className="mt-32 audit-results">
                <ScoreSummary result={displayed}>
                  {displayed.isSample ? <p className="mt-16 mb-0"><span className="sample-stamp">SAMPLE: fictional business</span></p> : null}
                </ScoreSummary>
              </div>

              {locked ? (
                <>
                  <h2 className="mt-32">Top findings</h2>
                  <IssueList issues={displayed.issues.slice(0, 2)} />
                  <div className="card mt-24">
                    <h3 style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                      <Lock size={18} strokeWidth={1.5} color="#4A3B5C" aria-hidden /> Unlock the full report
                    </h3>
                    <p>
                      All findings, white-label preview, proposal, and PDF downloads.
                      {totalFindings !== null && totalFindings > displayed.issues.length
                        ? ` This audit found ${totalFindings} findings in total.`
                        : ""}
                    </p>
                    <label htmlFor="license-key-locked">License key</label>
                    <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", alignItems: "center" }}>
                      <input
                        id="license-key-locked"
                        type="text"
                        autoComplete="off"
                        placeholder="Paste your DealNote license key"
                        value={licenseKey}
                        onChange={(e) => saveLicenseKey(e.target.value.trim())}
                        style={{ flex: "1 1 17.5rem" }}
                      />
                      <SakugaButton onClick={runAudit} disabled={running}>
                        Unlock
                      </SakugaButton>
                    </div>
                    <BuyButton />
                  </div>
                </>
              ) : (
                <>
                  <h2 className="mt-32">Top findings</h2>
                  <p className="reading">
                    Each finding shows what was found, why it matters, and the fix. Findings are ordered by
                    severity: Critical first. Tick the findings to feature in the proposal below. Findings are
                    quoted exactly as the audit found them; they are never rewritten.
                  </p>
                  {displayed.issues.length > 0 ? (
                    <>
                      <div className="card" style={{ marginBottom: "1rem" }}>
                        <h3>Choose findings for the proposal</h3>
                        <p className="caption">
                          Top 3 are selected by default. Findings 4 to 10 work the same way. The proposal and
                          the PDF use only the findings you tick.
                        </p>
                        <fieldset style={{ border: 0, padding: 0, margin: 0 }}>
                          <legend className="caption" style={{ marginBottom: "0.5rem" }}>Findings to feature</legend>
                          {displayed.issues.map((issue) => (
                            <div key={issue.id} style={{ marginBottom: "0.5rem" }}>
                              <SakugaCheckbox
                                checked={selectedIds.includes(issue.id)}
                                onChange={() => toggleFinding(issue.id)}
                              >
                                {`${issue.title} (${issue.severity})`}
                              </SakugaCheckbox>
                            </div>
                          ))}
                        </fieldset>
                        {selectedIds.length === 0 ? (
                          <p className="field-error" role="alert">No findings selected. The proposal will have nothing to propose until you tick at least one.</p>
                        ) : null}
                      </div>
                      <IssueList issues={displayed.issues} />
                    </>
                  ) : (
                    <div className="card" role="alert" style={{ borderColor: "#F9A8D4", background: "#FDF2F8" }}>
                      <h3>This site is in good shape</h3>
                      <p className="mb-16">
                        The audit found no material issues on the homepage in this run. A teardown pitch that
                        invents problems would be dishonest, so no fix proposal is generated for this site.
                      </p>
                      <p className="mb-16">
                        What to pitch instead: ongoing care. Offer a monthly plan that keeps the site updated,
                        backed up, and monitored, and pitch it with the Retainer Opener template.
                      </p>
                      <p className="mb-0">
                        <button type="button" className="btn btn-primary" onClick={() => changeTemplate("retainer")}>
                          Switch to the Retainer Opener
                        </button>{" "}
                        <Link href="/templates" className="btn btn-secondary">See all templates</Link>
                      </p>
                    </div>
                  )}

                  {displayed.couldNotCheck.length > 0 ? (
                    <div className="card mt-24">
                      <h3>Could not check</h3>
                      <ul style={{ paddingLeft: "1.25rem", marginBottom: 0 }}>
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
                  <p className="caption">{LOCAL_STORAGE_NOTICE}</p>
                  <div style={{ marginBottom: "1rem" }}>
                    <SakugaToggle label="Show white-label preview" checked={showPreview} onChange={setShowPreview} />
                  </div>
                  {showPreview ? (
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
                      </div>
                      {/* The other 8 brand fields live behind one disclosure, so
                          the form shows 3 fields, not 11, on first sight
                          (content-first-noise-reduction: secondary content
                          behind on-demand disclosure; native details needs
                          no script and stays keyboard accessible). */}
                      <details className="mt-16">
                        <summary style={{ cursor: "pointer", fontWeight: 600, fontSize: "0.875rem", minHeight: "2.75rem", display: "flex", alignItems: "center" }}>
                          More brand details
                        </summary>
                        <div className="form-grid mt-16">
                        <div>
                          <label htmlFor="contact-phone">Contact phone</label>
                          <input id="contact-phone" type="tel" value={brand.contactPhone} onChange={(e) => saveBrand({ ...brand, contactPhone: e.target.value })} />
                        </div>
                        <div>
                          <label htmlFor="postal-address">Postal address (for the CAN-SPAM footer on emails)</label>
                          <textarea
                            id="postal-address"
                            autoComplete="street-address"
                            placeholder="123 Main Street, Santa Rosa, CA 95401"
                            value={brand.postalAddress ?? ""}
                            onChange={(e) => saveBrand({ ...brand, postalAddress: e.target.value })}
                            rows={2}
                            style={{ minHeight: "2.75rem" }}
                          />
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
                          <label htmlFor="primary-color">Primary brand color</label>
                          <input id="primary-color" type="color" value={brand.primaryColor} onChange={(e) => saveBrand({ ...brand, primaryColor: e.target.value })} />
                        </div>
                        <div>
                          <label htmlFor="accent-color">Accent color</label>
                          <input id="accent-color" type="color" value={brand.accentColor} onChange={(e) => saveBrand({ ...brand, accentColor: e.target.value })} />
                        </div>
                        <div>
                          <label htmlFor="logo-url">Logo URL</label>
                          <input id="logo-url" type="url" placeholder="https://example.com/logo.png" value={brand.logoUrl ?? ""} onChange={(e) => saveBrand({ ...brand, logoUrl: e.target.value })} />
                        </div>
                        <div>
                          <span className="btn btn-secondary" style={{ height: "3rem", padding: "0 1.25rem", display: "inline-flex", alignItems: "center" }}>
                            <label htmlFor="logo-file" style={{ margin: 0, cursor: "pointer", fontSize: "0.9375rem", fontWeight: 600 }}>
                              Upload logo (PNG/JPG)
                            </label>
                          </span>
                          <input
                            id="logo-file"
                            type="file"
                            accept="image/png,image/jpeg"
                            onChange={(e) => onLogoFile(e.target.files?.[0])}
                            style={{ position: "absolute", width: 1, height: 1, opacity: 0, overflow: "hidden" }}
                          />
                          <p className="caption mt-8 mb-0">PNG or JPG, under 512 KB</p>
                          {logoError ? <p className="field-error">{logoError}</p> : null}
                          {logoSrc ? (
                            <p className="mt-8 mb-0">
                              <button type="button" className="btn btn-secondary" onClick={() => saveBrand({ ...brand, logoUrl: "", logoDataUrl: "" })}>
                                Remove logo
                              </button>
                            </p>
                          ) : null}
                        </div>
                      </div>
                        <div className="mt-16">
                          <label htmlFor="intro-line">Report intro line</label>
                          <input id="intro-line" type="text" value={brand.introLine} onChange={(e) => saveBrand({ ...brand, introLine: e.target.value })} />
                        </div>
                      </details>
                    </div>
                    <div className="card" style={{ borderTop: `0.25rem solid ${brand.primaryColor}` }}>
                      {logoSrc ? (
                        <p className="mb-16">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={logoSrc} alt={`${brand.brandName} logo`} style={{ maxHeight: 48, maxWidth: "100%" }} />
                        </p>
                      ) : null}
                      <p style={{ fontSize: "0.8125rem", fontWeight: 600, color: brand.primaryColor, margin: "0 0 0.75rem" }}>Report preview</p>
                      <h3 style={{ color: brand.primaryColor }}>Website Teardown and Proposal</h3>
                      <p><strong>{displayed.url}</strong></p>
                      {/* Same stale-count fix as the proposal text
                          (Neon P2-3): the preview shows this audit's
                          finding count, not a count saved from an
                          earlier audit. */}
                      <p>{introLineForAudit(brand.introLine, displayed.issues.length)}</p>
                      <p className="mb-8">Prepared by {brand.contactName}, {brand.brandName}</p>
                      <p className="caption mb-16">
                        {brand.contactEmail}
                        {brand.contactPhone ? `, ${brand.contactPhone}` : ""}, {brand.website}
                      </p>
                      <p className="mb-0">
                        <span className="btn btn-primary" style={{ background: brand.primaryColor }}>
                          {brand.ctaText}
                        </span>
                      </p>
                    </div>
                  </div>
                  ) : null}

                  {showGenerator ? (
                    <>
                  <h2 className="mt-32">Proposal generator</h2>
                  <p className="reading">
                    You are responsible for your own outreach law. Only email people in line with the rules
                    that apply to you and to them. See the sending checklist below. DealNote provides no cold
                    SMS scripts. Do not send marketing texts to a prospect unless you already have their prior
                    express written consent.
                  </p>
                  <p className="reading">
                    The findings above become a What I Would Fix list. Prices are blank placeholders only.
                    DealNote never fills in a price, a timeline promise, or a results promise. This proposal
                    is for discussion purposes and is not a contract; a separate agreement is provided before
                    work begins.
                  </p>

                  <div className="card" style={{ marginBottom: "1rem" }}>
                    <h3>1. Choose a proposal</h3>
                    <p className="caption">Eight structurally different documents, not one skeleton with a word swapped.</p>
                    <fieldset style={{ border: 0, padding: 0, margin: 0 }}>
                      <legend className="caption" style={{ marginBottom: "0.5rem" }}>Proposal template</legend>
                      <SakugaRadio
                        label="Proposal template"
                        options={PROPOSAL_TEMPLATES.map((t) => ({
                          value: t.kind,
                          label: `${t.name} (${t.length}) - ${t.tagline}`,
                          selected: t.kind === templateKind,
                        }))}
                        value={templateKind}
                        onChange={(v) => changeTemplate(v as ProposalKind)}
                      />
                    </fieldset>
                  </div>

                  <div className="card" style={{ marginBottom: "1rem" }}>
                    <h3>2. Sections to include</h3>
                    <p className="caption">
                      Hide any section you do not need. About is off by default: if you have no past projects
                      yet, turn it on only when you have real work to show, or delete it.
                    </p>
                    <fieldset style={{ border: 0, padding: 0, margin: 0 }}>
                      <legend className="caption" style={{ marginBottom: "0.5rem" }}>Sections</legend>
                      {templateDef.sections.map((key) => (
                        <div key={key} style={{ marginBottom: "0.5rem" }}>
                          <SakugaCheckbox
                            checked={sections[key] === true}
                            onChange={(next) => setSections({ ...sections, [key]: next })}
                          >
                            {SECTION_LABELS[key]}
                          </SakugaCheckbox>
                        </div>
                      ))}
                    </fieldset>
                  </div>

                  <div className="card" style={{ marginBottom: "1rem" }}>
                    <h3>3. What I would {templateKind === "retainer" ? "do monthly" : "fix"}</h3>
                    <p className="caption">
                      Edit any item, delete one, reorder with the arrows, or add your own. Ticking a finding
                      adds only that finding&apos;s item; unticking removes only its item. Edits to the
                      other items are kept.
                    </p>
                    {fixItems.length === 0 ? (
                      <p>No fix items yet. Tick a finding above, or add your own item below.</p>
                    ) : (
                      fixItems.map((item, idx) => (
                        <div key={`${item.title}-${idx}`} style={{ border: "1px solid #e2e8f0", borderRadius: "0.5rem", padding: 12, marginBottom: "0.75rem" }}>
                          <label htmlFor={`fix-title-${idx}`}>Fix title</label>
                          <input
                            id={`fix-title-${idx}`}
                            type="text"
                            value={item.title}
                            onChange={(e) => setFixItems(fixItems.map((f, i) => (i === idx ? { ...f, title: e.target.value } : f)))}
                          />
                          <label htmlFor={`fix-detail-${idx}`} style={{ marginTop: "0.5rem" }}>Detail</label>
                          <input
                            id={`fix-detail-${idx}`}
                            type="text"
                            value={item.detail}
                            onChange={(e) => setFixItems(fixItems.map((f, i) => (i === idx ? { ...f, detail: e.target.value } : f)))}
                          />
                          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginTop: "0.5rem", alignItems: "center" }}>
                            <label htmlFor={`fix-phase-${idx}`} style={{ margin: 0 }}>Phase</label>
                            <select
                              id={`fix-phase-${idx}`}
                              value={item.phase}
                              onChange={(e) => setFixItems(fixItems.map((f, i) => (i === idx ? { ...f, phase: e.target.value } : f)))}
                              style={{ maxWidth: "10rem" }}
                            >
                              <option>Quick wins</option>
                              <option>Redesign</option>
                              <option>Ongoing</option>
                            </select>
                            <button type="button" className="btn btn-secondary" disabled={idx === 0} aria-label={`Move ${item.title} up`} onClick={() => { const n = [...fixItems]; [n[idx - 1], n[idx]] = [n[idx], n[idx - 1]]; setFixItems(n); }}>
                              <ChevronUp size={18} strokeWidth={1.5} aria-hidden /> Up
                            </button>
                            <button type="button" className="btn btn-secondary" disabled={idx === fixItems.length - 1} aria-label={`Move ${item.title} down`} onClick={() => { const n = [...fixItems]; [n[idx + 1], n[idx]] = [n[idx], n[idx + 1]]; setFixItems(n); }}>
                              <ChevronDown size={18} strokeWidth={1.5} aria-hidden /> Down
                            </button>
                            <button type="button" className="btn btn-secondary" aria-label={`Delete ${item.title}`} onClick={() => setFixItems(fixItems.filter((_, i) => i !== idx))}>
                              <Trash2 size={18} strokeWidth={1.5} aria-hidden /> Delete
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                    <h4 style={{ fontSize: "0.9375rem", margin: "1rem 0 0.5rem" }}>Add a fix item</h4>
                    <label htmlFor="new-fix-title">Title</label>
                    <input id="new-fix-title" type="text" value={newFixTitle} onChange={(e) => setNewFixTitle(e.target.value)} placeholder="e.g. Compress the hero image" />
                    <label htmlFor="new-fix-detail" style={{ marginTop: "0.5rem" }}>Detail</label>
                    <input id="new-fix-detail" type="text" value={newFixDetail} onChange={(e) => setNewFixDetail(e.target.value)} placeholder="e.g. Bring it below 200 KB in a modern format" />
                    <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginTop: "0.5rem", alignItems: "center" }}>
                      <label htmlFor="new-fix-phase" style={{ margin: 0 }}>Phase</label>
                      <select id="new-fix-phase" value={newFixPhase} onChange={(e) => setNewFixPhase(e.target.value)} style={{ maxWidth: "10rem" }}>
                        <option>Quick wins</option>
                        <option>Redesign</option>
                        <option>Ongoing</option>
                      </select>
                      <button
                        type="button"
                        className="btn btn-secondary"
                        disabled={!newFixTitle.trim()}
                        onClick={() => {
                          setFixItems([...fixItems, { phase: newFixPhase, title: newFixTitle.trim(), detail: newFixDetail.trim() || "See the audit report." }]);
                          setNewFixTitle("");
                          setNewFixDetail("");
                        }}
                      >
                        <Plus size={18} strokeWidth={1.5} aria-hidden /> Add fix item
                      </button>
                    </div>
                  </div>

                  {templateKind === "redesign" || templateKind === "localseo" || templateKind === "landing" || templateKind === "newbuild" || templateKind === "ecommerce" ? (
                    <div className="card" style={{ marginBottom: "1rem" }}>
                      <h3>4. Scope, timeline, and what is not included</h3>
                      <p className="caption">One item per line. The Not included list is pre-filled with concrete examples; keep or delete each line, never leave it blank.</p>
                      <label htmlFor="scope-lines">Scope and deliverables</label>
                      <textarea id="scope-lines" value={scopeText} onChange={(e) => setScopeText(e.target.value)} rows={5} />
                      <label htmlFor="timeline-lines" style={{ marginTop: "0.75rem" }}>Timeline and milestones</label>
                      <textarea id="timeline-lines" value={timelineText} onChange={(e) => setTimelineText(e.target.value)} rows={4} />
                      <label htmlFor="not-included-lines" style={{ marginTop: "0.75rem" }}>Not included</label>
                      <textarea id="not-included-lines" value={notIncludedText} onChange={(e) => setNotIncludedText(e.target.value)} rows={5} />
                      <label style={{ marginTop: "0.75rem" }}>Proposal valid for (days)</label>
                      <SakugaSlider
                        label="Proposal valid for, in days"
                        value={Number(expiryDays) || 14}
                        min={0}
                        max={90}
                        step={1}
                        unit=" days"
                        onChange={(v) => setExpiryDays(v === 0 ? "" : String(v))}
                      />
                      <p className="caption mt-8 mb-0">0 days means no expiry date is shown. The slider shows the value as you drag it.</p>
                    </div>
                  ) : null}

                  <div className="card">
                    <h3>{templateKind === "redesign" || templateKind === "localseo" || templateKind === "landing" || templateKind === "newbuild" || templateKind === "ecommerce" ? "5. Investment" : "4. Investment"}</h3>
                    <p className="caption">Fill in the prices yourself before sending. A blank price stays blank ($____); a $0 price is never shown.</p>
                    {templateKind === "retainer" ? (
                      <div>
                        <label htmlFor="price-monthly">Monthly care plan price</label>
                        <input id="price-monthly" type="text" aria-label="Monthly price" placeholder="$____" value={prices.monthly} onChange={(e) => setPrices({ ...prices, monthly: e.target.value })} style={{ maxWidth: "10rem" }} />
                      </div>
                    ) : templateKind === "quickfix" || templateKind === "fastclose" || templateKind === "landing" ? (
                      <div>
                        <label htmlFor="price-essential">Essential price</label>
                        <input id="price-essential" type="text" aria-label="Essential price" placeholder="$____" value={prices.essential} onChange={(e) => setPrices({ ...prices, essential: e.target.value })} style={{ maxWidth: "10rem" }} />
                      </div>
                    ) : templateKind === "localseo" ? (
                      <div>
                        <label htmlFor="price-essential">Essential price</label>
                        <input id="price-essential" type="text" aria-label="Essential price" placeholder="$____" value={prices.essential} onChange={(e) => setPrices({ ...prices, essential: e.target.value })} style={{ maxWidth: "10rem" }} />
                        <label htmlFor="price-monthly" style={{ marginTop: "0.75rem" }}>Monthly profile care price</label>
                        <input id="price-monthly" type="text" aria-label="Monthly price" placeholder="$____" value={prices.monthly} onChange={(e) => setPrices({ ...prices, monthly: e.target.value })} style={{ maxWidth: "10rem" }} />
                      </div>
                    ) : (
                      <div className="stack-table">
                        <table>
                          <thead><tr><th>Tier</th><th>Includes</th><th>Price</th></tr></thead>
                          <tbody>
                            <tr>
                              <td data-label="Tier">Essential</td>
                              <td data-label="Includes">Quick wins, core pages, basic SEO setup</td>
                              <td data-label="Price">
                                <input type="text" aria-label="Essential price" placeholder="$____" value={prices.essential} onChange={(e) => setPrices({ ...prices, essential: e.target.value })} style={{ maxWidth: "8.75rem" }} />
                              </td>
                            </tr>
                            <tr>
                              <td data-label="Tier">Growth</td>
                              <td data-label="Includes">Everything in Essential, plus redesign, forms, and trust sections</td>
                              <td data-label="Price">
                                <input type="text" aria-label="Growth price" placeholder="$____" value={prices.growth} onChange={(e) => setPrices({ ...prices, growth: e.target.value })} style={{ maxWidth: "8.75rem" }} />
                              </td>
                            </tr>
                            <tr>
                              <td data-label="Tier">Premium</td>
                              <td data-label="Includes">Everything in Growth, plus ongoing support period</td>
                              <td data-label="Price">
                                <input type="text" aria-label="Premium price" placeholder="$____" value={prices.premium} onChange={(e) => setPrices({ ...prices, premium: e.target.value })} style={{ maxWidth: "8.75rem" }} />
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    )}
                    <p className="caption">Fill in the prices yourself before sending. Payment terms placeholder: 50% upfront, 50% on launch.</p>
                    <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                      <SakugaButton variant="secondary" onClick={copyProposal}>
                        {copied ? "Copied" : "Copy proposal text"}
                      </SakugaButton>
                      <SakugaButton onClick={downloadProposalPdf} disabled={pdfBusy}>
                        {pdfBusy ? "Generating PDF" : "Download proposal PDF"}
                      </SakugaButton>
                      <Link href="/templates" className="btn btn-secondary">
                        <Mail size={18} strokeWidth={1.5} aria-hidden /> Open the proposal templates page
                      </Link>
                    </div>
                    {pdfMessage ? <p className="caption mt-16" role="status">{pdfMessage}</p> : null}
                    <p className="caption mt-16 mb-0">
                      The PDF carries your logo and brand colors, the selected findings quoted from the audit,
                      and your edited fix list. It needs a license key; the audit above must be unlocked first.
                      A PDF reuses the audit above and does not use another audit. A PDF downloaded without
                      running the audit first uses 1 audit.
                    </p>
                  </div>
                    </>
                  ) : null}

                  <h2 className="mt-32">Outreach tracker</h2>
                  <p className="reading">
                    Track each proposal you send. Stored only in this browser. Nothing is sent anywhere.
                  </p>
                  <p className="caption">{LOCAL_STORAGE_NOTICE}</p>
                  <div className="card">
                    <SakugaButton onClick={addToTracker}>
                      Add this proposal to the tracker
                    </SakugaButton>
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

                  {displayed.isSample ? (
                    <div className="callout mt-32">
                      <p className="mb-8"><strong>Sample report.</strong> The sample report page offers print-to-PDF for the sample only.</p>
                      <p className="mb-0">
                        <Link href="/sample" className="btn btn-secondary">
                          <Printer size={18} strokeWidth={1.5} aria-hidden /> Print the sample report to PDF
                        </Link>
                      </p>
                    </div>
                  ) : null}

                  <div className="card mt-32">
                    <h3 className="mt-0">Rate this teardown</h3>
                    <p className="caption">
                      Your rating is stored only in this browser. It is not a testimonial and is never
                      shown to anyone else; it is here so you can mark how useful this run was.
                    </p>
                    <SakugaRating label="Rate this teardown" value={rating} onChange={saveRating} />
                    {rating > 0 ? <p className="caption mt-8 mb-0">You rated this teardown {rating} out of 5.</p> : null}
                  </div>
                </>
              )}
            </>
          ) : null}

          {!displayed && !running && !fetchFailed ? (
            <p className="mt-24">
              Want to see a finished report first? <Link href="/sample">View sample report</Link> (fictional data).
            </p>
          ) : null}

          {/* Pre-footer (Neon /audit copy decision, 28 Nov 2026): 1 line only.
              The "Audit method: direct fetch..." paragraph was a duplicate and
              is cut from the visible pre-footer; the method lives behind
              "How the audit works" above. */}
          <div className="footer-note" aria-label="Sending checklist">
            <p className="caption">
              Before you email a prospect, read the <Link href="/templates">Sending checklist</Link>.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
