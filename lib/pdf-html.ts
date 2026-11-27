// DealNote PDF HTML templates (shared by /api/pdf/teardown and /api/pdf/proposal).
// Brand-new code for DealNote. No code copied from any other product.
//
// Design tokens: white / slate, deep teal #0F766E, Inter / system font.
// No gradients, no glows, no emoji. The HTML is rendered to PDF by
// Puppeteer (Chromium); it is plain printable HTML, no JavaScript.

import type { AuditResult, BrandProfile, ProposalItem } from "@/lib/audit";
import { CATEGORIES } from "@/lib/audit";

// ---------------------------------------------------------------------------
// Chromium rendering (Puppeteer). Pinned matched pair, verified locally:
// puppeteer-core 25.19.0 + @sparticuz/chromium 158.0.0 (Chrome 158).
// No jsPDF / html2canvas, no commercial react-pdf.dev product.
// If Chromium cannot launch at runtime, callers return a clear 501;
// a PDF is never faked.
// ---------------------------------------------------------------------------

/** Render printable HTML to a PDF buffer with headless Chromium. */
export async function htmlToPdfBuffer(html: string): Promise<Buffer> {
  const chromium = (await import("@sparticuz/chromium")).default;
  const puppeteer = (await import("puppeteer-core")).default;
  const executablePath = await chromium.executablePath();
  const browser = await puppeteer.launch({
    args: [...chromium.args, "--no-sandbox", "--disable-setuid-sandbox"],
    executablePath,
    headless: true,
  });
  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "domcontentloaded" });
    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "20mm", bottom: "20mm", left: "15mm", right: "15mm" },
    });
    return Buffer.from(pdf);
  } finally {
    await browser.close();
  }
}


export const FOOTER_DISCLAIMER =
  "Scores are DealNote's own measurements from this run, not Lighthouse or PageSpeed scores, and can vary between runs. " +
  "This report checks the public homepage only. It does not estimate traffic, rankings, or lost revenue. " +
  "No guarantee of client wins.";

export function footerLine(brand: BrandProfile, runDate: string, prospectUrl: string): string {
  return `Prepared by ${brand.brandName} on ${runDate} for ${prospectUrl}. ${FOOTER_DISCLAIMER}`;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function gradeColor(grade: string): string {
  if (grade === "A" || grade === "B") return "#15803D";
  if (grade === "C") return "#B45309";
  return "#B91C1C";
}

const BASE_CSS = `
  * { box-sizing: border-box; }
  body { font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; color: #1e293b; margin: 0; padding: 32px 40px; font-size: 13px; line-height: 1.55; background: #ffffff; }
  h1 { font-size: 26px; line-height: 1.25; color: #0f172a; margin: 0 0 6px; }
  h2 { font-size: 17px; color: #0f172a; margin: 28px 0 8px; padding-bottom: 6px; border-bottom: 2px solid #0F766E; }
  h3 { font-size: 14px; color: #0f172a; margin: 14px 0 4px; }
  p { margin: 6px 0; }
  .brand { color: #0F766E; font-weight: 700; font-size: 13px; letter-spacing: 0.04em; text-transform: uppercase; margin-bottom: 4px; }
  .meta { color: #64748b; font-size: 12px; }
  .sample-stamp { display: inline-block; border: 2px solid #B91C1C; color: #B91C1C; font-weight: 700; letter-spacing: 0.08em; padding: 3px 10px; font-size: 12px; margin: 10px 0; }
  .score-box { border: 1px solid #cbd5e1; padding: 16px 20px; margin: 16px 0; }
  .score-big { font-size: 40px; font-weight: 800; color: #0f172a; }
  .grade { font-size: 22px; font-weight: 800; }
  table { width: 100%; border-collapse: collapse; margin: 10px 0; font-size: 13px; }
  th, td { text-align: left; padding: 7px 8px; border-bottom: 1px solid #e2e8f0; vertical-align: top; }
  th { color: #475569; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; }
  .issue { border: 1px solid #e2e8f0; padding: 12px 14px; margin: 10px 0; page-break-inside: avoid; }
  .severity { display: inline-block; font-size: 11px; font-weight: 700; padding: 2px 8px; color: #ffffff; background: #0F766E; }
  .severity.critical { background: #B91C1C; }
  .footer { margin-top: 32px; padding-top: 12px; border-top: 1px solid #cbd5e1; color: #64748b; font-size: 11px; line-height: 1.5; }
  .cta { border: 2px solid #0F766E; padding: 14px 16px; margin: 16px 0; }
  .cta a { color: #0F766E; font-weight: 700; }
`;

function reportShell(opts: {
  title: string;
  brand: BrandProfile;
  runDate: string;
  prospectUrl: string;
  isSample: boolean;
  body: string;
}): string {
  const b = opts.brand;
  return `<!doctype html>
<html><head><meta charset="utf-8"><style>${BASE_CSS}</style></head>
<body>
  <div class="brand">${escapeHtml(b.brandName)}</div>
  <h1>${escapeHtml(opts.title)}</h1>
  <p class="meta">${escapeHtml(opts.prospectUrl)} &middot; ${escapeHtml(opts.runDate)}</p>
  ${opts.isSample ? `<p><span class="sample-stamp">SAMPLE</span></p><p class="meta">Sample report. The business, address, phone number, and website in this report are fictional, and the findings are sample findings written to show the report format. Nothing in this report describes a real business.</p>` : ""}
  ${opts.body}
  <div class="footer">${escapeHtml(footerLine(b, opts.runDate, opts.prospectUrl))}</div>
</body></html>`;
}

function categoryRows(result: AuditResult): string {
  return result.categories
    .map((c) => {
      const meta = CATEGORIES.find((m) => m.key === c.key);
      return `<tr><td>${escapeHtml(meta?.label ?? c.key)}</td><td>${c.score} / 100</td><td style="color:${gradeColor(c.grade)};font-weight:700;">${escapeHtml(c.grade)}</td><td>${escapeHtml(meta?.description ?? "")}</td></tr>`;
    })
    .join("");
}

function issueBlocks(result: AuditResult): string {
  if (result.issues.length === 0) return "<p>No issues were found on the homepage in this run.</p>";
  return result.issues
    .map(
      (issue) => `<div class="issue">
        <p><span class="severity${issue.severity === "Critical" ? " critical" : ""}">${escapeHtml(issue.severity)}</span></p>
        <h3>${escapeHtml(issue.title)}</h3>
        <p><strong>Found:</strong> ${escapeHtml(issue.found)}</p>
        <p><strong>Why it matters:</strong> ${escapeHtml(issue.why)}</p>
        <p><strong>Fix:</strong> ${escapeHtml(issue.fix)}</p>
      </div>`,
    )
    .join("");
}

/** Full teardown report PDF HTML: scores, categories, every finding. */
export function teardownReportHtml(opts: {
  result: AuditResult;
  brand: BrandProfile;
  runDate: string;
}): string {
  const { result, brand, runDate } = opts;
  const body = `
  <div class="score-box">
    <p class="meta">Overall score</p>
    <p><span class="score-big">${result.overallScore} / 100</span> &nbsp; <span class="grade" style="color:${gradeColor(result.overallGrade)};">Grade ${escapeHtml(result.overallGrade)}</span></p>
    <p class="meta">Homepage: ${escapeHtml(result.finalUrl)} &middot; Loaded in ${(result.loadMs / 1000).toFixed(1)}s &middot; ${result.https ? "HTTPS" : "Not HTTPS"}</p>
  </div>
  <h2>Scores by area</h2>
  <table><thead><tr><th>Area</th><th>Score</th><th>Grade</th><th>What it covers</th></tr></thead>
  <tbody>${categoryRows(result)}</tbody></table>
  <h2>What we found, in plain language</h2>
  ${issueBlocks(result)}
  ${result.couldNotCheck.length > 0 ? `<h2>What this report could not check</h2><ul>${result.couldNotCheck.map((c) => `<li>${escapeHtml(c)}</li>`).join("")}</ul>` : ""}
  <h2>What happens next</h2>
  <div class="cta"><p>${escapeHtml(brand.introLine)}</p>
  <p><strong>${escapeHtml(brand.contactName)}</strong> &middot; ${escapeHtml(brand.contactEmail)} &middot; ${escapeHtml(brand.contactPhone)}</p>
  <p><a href="${escapeHtml(brand.ctaLink)}">${escapeHtml(brand.ctaText)}</a></p></div>`;
  return reportShell({ title: "Website Teardown Report", brand, runDate, prospectUrl: result.url, isSample: result.isSample, body });
}

/** Proposal PDF HTML: the fix plan, grouped by phase, plus the teardown summary. */
export function proposalHtml(opts: {
  result: AuditResult;
  brand: BrandProfile;
  runDate: string;
  items: ProposalItem[];
}): string {
  const { result, brand, runDate, items } = opts;
  const phases = ["Quick wins", "Redesign", "Ongoing"];
  const phaseSections = phases
    .map((phase) => {
      const phaseItems = items.filter((i) => i.phase === phase);
      if (phaseItems.length === 0) return "";
      return `<h3>${escapeHtml(phase)}</h3><ul>${phaseItems.map((i) => `<li><strong>${escapeHtml(i.title)}</strong> &mdash; ${escapeHtml(i.detail)}</li>`).join("")}</ul>`;
    })
    .join("");
  const body = `
  <div class="score-box">
    <p class="meta">Overall score</p>
    <p><span class="score-big">${result.overallScore} / 100</span> &nbsp; <span class="grade" style="color:${gradeColor(result.overallGrade)};">Grade ${escapeHtml(result.overallGrade)}</span></p>
    <p class="meta">Homepage: ${escapeHtml(result.finalUrl)}</p>
  </div>
  <p>${escapeHtml(brand.introLine)}</p>
  <h2>What we would fix</h2>
  ${phaseSections || "<p>No fix items were listed for this site in this run.</p>"}
  <h2>What we found</h2>
  ${issueBlocks(result)}
  <h2>What happens next</h2>
  <div class="cta"><p><strong>${escapeHtml(brand.contactName)}</strong> &middot; ${escapeHtml(brand.contactEmail)} &middot; ${escapeHtml(brand.contactPhone)}</p>
  <p><a href="${escapeHtml(brand.ctaLink)}">${escapeHtml(brand.ctaText)}</a></p>
  <p class="meta">${escapeHtml(brand.website)}</p></div>`;
  return reportShell({ title: "Website Fix Proposal", brand, runDate, prospectUrl: result.url, isSample: result.isSample, body });
}
