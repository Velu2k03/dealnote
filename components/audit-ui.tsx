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
import { Stagger, StaggerItem } from "./motion-ui";
import { SakugaButton, SakugaTooltip } from "./sakuga";

export const CHECKOUT_NOT_CONFIGURED_MESSAGE =
  "Checkout is not connected yet. Payment opens once the Lemon Squeezy account is set up.";

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
      <SakugaButton
        variant={className.includes("btn-secondary") ? "secondary" : undefined}
        onClick={buy}
        disabled={busy}
      >
        {busy ? "Opening checkout…" : "Buy DealNote — $49 one-time"}
      </SakugaButton>
      {message ? (
        <span className="caption" role="status" style={{ display: "block", marginTop: "0.5rem" }}>
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
  const props = { size: 18, strokeWidth: 1.5, color: "#4A3B5C", "aria-hidden": true };
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
  return <Info {...props} color="#4A3B5C" />;
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
          <div key={cat.key} style={{ marginBottom: "1rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.375rem" }}>
              <CategoryIcon icon={meta.icon} />
              <span style={{ fontWeight: 600, fontSize: "0.875rem" }}>{meta.label}</span>
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
      <div style={{ display: "flex", gap: "1.25rem", alignItems: "center", flexWrap: "wrap" }}>
        <div style={{ textAlign: "center" }}>
          <div className="tabular" style={{ fontSize: "3rem", fontWeight: 600, lineHeight: 1 }}>
            {/* Neon P2-2 (28 Nov 2026): the headline score renders
                immediately, no count-up. The counter flashed 68/100 B
                mid-animation on /sample (and read 0 until scrolled to
                in the earlier Neon recheck), while the grade badge
                already showed the final B. CountUp stays in motion-ui
                for other uses; the score itself is now static text. */}
            {result.overallScore}
            <span style={{ fontSize: "1.25rem", color: "#4A3B5C" }}>/100</span>
          </div>
          <p className="caption mb-0">Overall score</p>
        </div>
        <GradeBadge grade={result.overallGrade} size={56} />
        {/* Unslop spacing pass 1 (28 Nov 2026): this flex item needs
            min-width: 0, or its nowrap URL sets min-content at ~376px
            and stretches the whole score card past a 390px viewport. */}
        <div style={{ flex: "1 1 13.75rem", minWidth: 0 }}>
          <p className="mb-8" title={result.url} style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "100%" }}>
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
      {/* Neon /audit copy decision (28 Nov 2026): the 5-sentence score-model
          paragraph is cut. One line under the score, plus a [?] popover with
          the full model. Neon's text uses an em dash before "not"; a comma
          is used here instead, so no new em dash enters rendered copy. */}
      <p className="caption mb-0">
        DealNote lab measurement on the run date, not Lighthouse, PageSpeed, or a search-ranking score.
        Scores can vary between runs.{" "}
        <SakugaTooltip
          label="?"
          text="Scoring model: Six areas scored 0-100, weighted and summed: Speed 20, Mobile 15, On-page SEO 20, Technical 15, Conversion 15, Trust and local 15. Unreadable checks never lower a score. Grades: A 90-100, B 80-89, C 70-79, D 60-69, F below 60. This is DealNote's own model, not an industry standard."
        />
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
          <article className="card glass" style={{ marginBottom: "1rem" }}>
            <div style={{ display: "flex", gap: "0.625rem", alignItems: "flex-start", flexWrap: "wrap" }}>
              <SeverityIcon severity={issue.severity} />
              <div style={{ flex: "1 1 16.25rem" }}>
                <h3 className="mb-8">{issue.title}</h3>
                <p className="mb-8">
                  <span className={severityClass(issue.severity)}>{issue.severity}</span>{" "}
                  {showCategory && meta ? <span className="tag">{meta.label}</span> : null}
                </p>
                <p className="mb-8">
                  <strong>Found: </strong>
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
