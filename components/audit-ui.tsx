"use client";

import { useState, type ReactNode } from "react";
import {
  AlertOctagon,
  AlertTriangle,
  Gauge,
  Info,
  MousePointerClick,
  Search,
  ShieldCheck,
  Smartphone,
  Wrench,
} from "lucide-react";
import { motion } from "motion/react";
import type { AuditResult, CategoryKey, Issue, Severity } from "@/lib/audit";
import { CATEGORIES, gradeColor } from "@/lib/audit";
import { CountUp, Stagger, StaggerItem } from "./motion-ui";

export const CHECKOUT_NOT_CONFIGURED_MESSAGE =
  "Checkout is not connected yet — payment opens once the Lemon Squeezy account is set up.";

/** Buy button. POSTs to /api/checkout (owned by the checkout agent) and
 *  follows the checkout URL it returns. Shows a plain message when the
 *  checkout is not connected yet. */
export function BuyButton({ className = "btn btn-primary" }: { className?: string }) {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  const buy = async () => {
    setBusy(true);
    setMessage("");
    try {
      const res = await fetch("/api/checkout", { method: "POST" });
      const data = await res.json().catch(() => ({}));
      if (data && typeof data.url === "string" && data.url) {
        window.location.href = data.url;
        return;
      }
      if (data && (data.notConfigured === true || data.error === "notConfigured")) {
        setMessage(CHECKOUT_NOT_CONFIGURED_MESSAGE);
      } else if (!res.ok) {
        setMessage(CHECKOUT_NOT_CONFIGURED_MESSAGE);
      } else {
        setMessage("Checkout did not return a payment link. Try again, or email murugan@drvelu.com.");
      }
    } catch {
      setMessage("Checkout could not be reached. Try again, or email murugan@drvelu.com.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <span style={{ display: "inline-block" }}>
      <button type="button" className={className} onClick={buy} disabled={busy}>
        {busy ? "Opening checkout…" : "Buy DealNote — $49 one-time"}
      </button>
      {message ? (
        <span className="caption" role="status" style={{ display: "block", marginTop: 8 }}>
          {message}
        </span>
      ) : null}
    </span>
  );
}

/** Never "0.0 MB": under 100 KB in KB, under 1 MB as "0.x MB" with one decimal. */
export function formatPageSize(pageBytes: number): string {
  if (pageBytes < 100 * 1024) return `${(pageBytes / 1024).toFixed(1)} KB`;
  return `${(pageBytes / 1024 / 1024).toFixed(1)} MB`;
}

export function GradeBadge({ grade, size = 36 }: { grade: string; size?: number }) {
  return (
    <span
      className="grade-badge"
      style={{ background: gradeColor(grade), width: size, height: size, fontSize: size === 36 ? 20 : 28 }}
      aria-label={`Grade ${grade}`}
    >
      {grade}
    </span>
  );
}

export function CategoryIcon({ icon }: { icon: string }) {
  const props = { size: 18, strokeWidth: 1.5, color: "#475569", "aria-hidden": true };
  switch (icon) {
    case "gauge":
      return <Gauge {...props} />;
    case "smartphone":
      return <Smartphone {...props} />;
    case "search":
      return <Search {...props} />;
    case "wrench":
      return <Wrench {...props} />;
    case "mouse-pointer-click":
      return <MousePointerClick {...props} />;
    case "shield-check":
      return <ShieldCheck {...props} />;
    default:
      return <Info {...props} />;
  }
}

export function SeverityIcon({ severity }: { severity: Severity }) {
  const props = { size: 18, strokeWidth: 1.5, "aria-hidden": true };
  if (severity === "Critical") return <AlertOctagon {...props} color="#B91C1C" />;
  if (severity === "Fix soon") return <AlertTriangle {...props} color="#B45309" />;
  return <Info {...props} color="#475569" />;
}

export function severityClass(severity: Severity): string {
  if (severity === "Critical") return "tag tag-critical";
  if (severity === "Fix soon") return "tag tag-soon";
  return "tag tag-nice";
}

export function ScoreBars({ result }: { result: AuditResult }) {
  return (
    <div className="score-bars">
      {(result.categories ?? []).map((cat) => {
        const meta = CATEGORIES.find((m) => m.key === cat.key);
        if (!meta) return null;
        return (
          <div key={cat.key} style={{ marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <CategoryIcon icon={meta.icon} />
              <span style={{ fontWeight: 600, fontSize: 14 }}>{meta.label}</span>
              <span className="caption">weight {meta.weight}%</span>
              <span className="tabular" style={{ marginLeft: "auto", fontWeight: 600 }}>
                {cat.score}/100
              </span>
              <span style={{ fontWeight: 600, color: gradeColor(cat.grade) }}>{cat.grade}</span>
            </div>
            <div className="score-bar">
              <motion.span
                className="motion-fade"
                style={{ background: gradeColor(cat.grade), width: "100%", transformOrigin: "left" }}
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: cat.score / 100 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function ScoreSummary({ result, children }: { result: AuditResult; children?: ReactNode }) {
  return (
    <div className="card glass">
      <div style={{ display: "flex", gap: 20, alignItems: "center", flexWrap: "wrap" }}>
        <div style={{ textAlign: "center" }}>
          <div className="tabular" style={{ fontSize: 48, fontWeight: 600, lineHeight: 1 }}>
            <CountUp to={result.overallScore} immediate />
            <span style={{ fontSize: 20, color: "#475569" }}>/100</span>
          </div>
          <p className="caption mb-0">Overall score</p>
        </div>
        <GradeBadge grade={result.overallGrade} size={56} />
        <div style={{ flex: "1 1 220px" }}>
          <p className="mb-8" style={{ overflowWrap: "anywhere" }}>
            <strong>{result.url}</strong>
          </p>
          {/* Teaser responses carry no run facts beyond the date; render only
              the fields the server actually returned. */}
          <p className="caption mb-8">
            Run on {result.fetchedAt}
            {typeof result.status === "number" ? `, HTTP ${result.status}` : ""}
            {result.https === true ? ", HTTPS" : result.https === false ? ", not HTTPS" : ""}
          </p>
          {typeof result.loadMs === "number" && typeof result.pageBytes === "number" ? (
            <p className="caption mb-0">
              Loaded in {(result.loadMs / 1000).toFixed(1)}s, page size {formatPageSize(result.pageBytes)}
            </p>
          ) : null}
          {children}
        </div>
      </div>
      <div className="mt-24">
        <ScoreBars result={result} />
      </div>
      <p className="caption mb-0">
        Scores are DealNote&apos;s own measurements from this run, on the run date shown. They are not
        Lighthouse, PageSpeed, or search-ranking scores. Scores can vary between runs. Weights: Speed 20,
        Mobile 15, On-page SEO 20, Technical 15, Conversion 15, Trust &amp; local 15. This is
        DealNote&apos;s scoring model, not an industry standard. Grades: A 90-100, B 80-89, C 70-79,
        D 60-69, F below 60.
      </p>
    </div>
  );
}

export function IssueList({ issues, showCategory = true }: { issues: Issue[]; showCategory?: boolean }) {
  return (
    <Stagger>
      {issues.map((issue) => {
        const meta = CATEGORIES.find((m) => m.key === issue.category);
        return (
          <StaggerItem key={issue.id}>
          <article className="card glass" style={{ marginBottom: 16 }}>
            <div style={{ display: "flex", gap: 10, alignItems: "flex-start", flexWrap: "wrap" }}>
              <SeverityIcon severity={issue.severity} />
              <div style={{ flex: "1 1 260px" }}>
                <h3 className="mb-8">{issue.title}</h3>
                <p className="mb-8">
                  <span className={severityClass(issue.severity)}>{issue.severity}</span>{" "}
                  {showCategory && meta ? <span className="tag">{meta.label}</span> : null}
                </p>
                <p className="mb-8">
                  <strong>What was found: </strong>
                  {issue.found}
                </p>
                <p className="mb-8">
                  <strong>Why it matters: </strong>
                  {issue.why}
                </p>
                <p className="mb-0">
                  <strong>Fix: </strong>
                  {issue.fix}
                </p>
              </div>
            </div>
          </article>
          </StaggerItem>
        );
      })}
    </Stagger>
  );
}

export function categoryLabel(key: CategoryKey): string {
  return CATEGORIES.find((m) => m.key === key)?.label ?? key;
}
