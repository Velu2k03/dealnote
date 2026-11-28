// DealNote PDF HTML templates (shared by /api/pdf/teardown and /api/pdf/proposal).
// Brand-new code for DealNote. No code copied from any other product.
//
// Design tokens: white / slate, deep teal #0F766E, Inter / system font.
// No gradients, no glows, no emoji. The HTML is rendered to PDF by
// Puppeteer (Chromium); it is plain printable HTML, no JavaScript.

import type { AuditResult, BrandProfile, ProposalItem } from "@/lib/audit";
import { CATEGORIES } from "@/lib/audit";
import {
  NON_BINDING_TEXT,
  NOT_INCLUDED_DEFAULT,
  TESTIMONIAL_SLOT_TEXT,
  priceOrBlank,
  type ProposalKind,
  type SectionKey,
} from "@/lib/templates";

/** Buyer brand color, validated to a #rrggbb hex; anything else falls
 *  back to DealNote teal so a bad value can never break the PDF. */
export function brandAccent(brand: BrandProfile): string {
  const c = (brand.primaryColor ?? "").trim();
  return /^#[0-9a-fA-F]{6}$/.test(c) ? c : "#0F766E";
}

/** Logo for the PDF: only an uploaded data URL is embedded. A remote
 *  logo URL is never fetched server-side for the PDF. */
function logoImg(brand: BrandProfile): string {
  const src = (brand.logoDataUrl ?? "").trim();
  if (!src.startsWith("data:image/")) return "";
  return `<img src="${escapeHtml(src)}" alt="" style="max-height:48px;max-width:220px;display:block;margin-bottom:10px;">`;
}

// ---------------------------------------------------------------------------
// Chromium rendering (Puppeteer). Pinned matched pair, verified locally:
// puppeteer-core 25.19.0 + @sparticuz/chromium 158.0.0 (Chrome 158).
// No jsPDF / html2canvas, no commercial react-pdf.dev product.
// If Chromium cannot launch at runtime, callers return a clear 501;
// a PDF is never faked.
// ---------------------------------------------------------------------------

/** Render printable HTML to a PDF buffer with headless Chromium.
 *  When `footerText` is given, it is printed on EVERY page via
 *  displayHeaderFooter (the footer disclaimer is a legal requirement,
 *  not a last-page note). Page numbers are included. */
export async function htmlToPdfBuffer(html: string, footerText?: string): Promise<Buffer> {
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
      displayHeaderFooter: Boolean(footerText),
      headerTemplate: "<div></div>",
      footerTemplate: footerText
        ? `<div style="width:100%;font-size:8px;color:#64748b;padding:0 15mm;text-align:center;">${escapeHtml(footerText)} &middot; Page <span class="pageNumber"></span> of <span class="totalPages"></span></div>`
        : "<div></div>",
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

const baseCss = (accent: string) => `
  * { box-sizing: border-box; }
  body { font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; color: #1e293b; margin: 0; padding: 32px 40px; font-size: 13px; line-height: 1.55; background: #ffffff; }
  h1 { font-size: 26px; line-height: 1.25; color: #0f172a; margin: 0 0 6px; }
  h2 { font-size: 17px; color: #0f172a; margin: 28px 0 8px; padding-bottom: 6px; border-bottom: 2px solid ${accent}; }
  h3 { font-size: 14px; color: #0f172a; margin: 14px 0 4px; }
  p { margin: 6px 0; }
  .brand { color: ${accent}; font-weight: 700; font-size: 13px; letter-spacing: 0.04em; text-transform: uppercase; margin-bottom: 4px; }
  .meta { color: #64748b; font-size: 12px; }
  .sample-stamp { display: inline-block; border: 2px solid #B91C1C; color: #B91C1C; font-weight: 700; letter-spacing: 0.08em; padding: 3px 10px; font-size: 12px; margin: 10px 0; }
  .score-box { border: 1px solid #cbd5e1; padding: 16px 20px; margin: 16px 0; }
  .score-big { font-size: 40px; font-weight: 800; color: #0f172a; }
  .grade { font-size: 22px; font-weight: 800; }
  table { width: 100%; border-collapse: collapse; margin: 10px 0; font-size: 13px; }
  th, td { text-align: left; padding: 7px 8px; border-bottom: 1px solid #e2e8f0; vertical-align: top; }
  th { color: #475569; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; }
  .issue { border: 1px solid #e2e8f0; padding: 12px 14px; margin: 10px 0; page-break-inside: avoid; }
  .severity { display: inline-block; font-size: 11px; font-weight: 700; padding: 2px 8px; color: #ffffff; background: ${accent}; }
  .severity.critical { background: #B91C1C; }
  .footer { margin-top: 32px; padding-top: 12px; border-top: 1px solid #cbd5e1; color: #64748b; font-size: 11px; line-height: 1.5; }
  .cta { border: 2px solid ${accent}; padding: 14px 16px; margin: 16px 0; }
  .cta a { color: ${accent}; font-weight: 700; }
  @media print { * { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
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
<html><head><meta charset="utf-8"><style>${baseCss(brandAccent(b))}</style></head>
<body>
  ${logoImg(b)}
  <div class="brand">${escapeHtml(b.brandName)}</div>
  <h1>${escapeHtml(opts.title)}</h1>
  <p class="meta">${escapeHtml(opts.prospectUrl)} &middot; ${escapeHtml(opts.runDate)}</p>
  ${opts.isSample ? `<p><span class="sample-stamp">SAMPLE</span></p><p class="meta">Sample report. The business, address, phone number, and website in this report are fictional, and the findings are sample findings written to show the report format. Nothing in this report describes a real business.</p>` : ""}
  ${opts.body}
</body></html>`;
}

/** Contact block for the end of a report: name + email always (PDF routes
 *  refuse to generate until the brand is real), phone / call link /
 *  website only when the buyer filled them in, so no placeholder contact
 *  detail can ever reach a real PDF. */
function contactBlock(brand: BrandProfile): string {
  const phone = brand.contactPhone.trim() ? ` &middot; ${escapeHtml(brand.contactPhone)}` : "";
  const cta = brand.ctaLink.trim()
    ? `<p><a href="${escapeHtml(brand.ctaLink)}">${escapeHtml(brand.ctaText)}</a></p>`
    : "";
  const site = brand.website.trim() ? `<p class="meta">${escapeHtml(brand.website)}</p>` : "";
  return `<p><strong>${escapeHtml(brand.contactName)}</strong> &middot; ${escapeHtml(brand.contactEmail)}${phone}</p>${cta}${site}`;
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
  const introLine =
    result.issues.length === 0 && /found (\d+|several) quick wins/i.test(brand.introLine)
      ? "I reviewed your website and found it in good shape."
      : brand.introLine;
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
  <div class="cta"><p>${escapeHtml(introLine)}</p>
  ${contactBlock(brand)}</div>`;
  return reportShell({ title: "Website Teardown Report", brand, runDate, prospectUrl: result.url, isSample: result.isSample, body });
}

/** Proposal PDF HTML: the fix plan plus the proposal structure the buyer
 *  chose (template kind, visible sections, edited fix list, blank prices).
 *  Findings are quoted verbatim from the audit; prices are always blank
 *  ($____) unless the buyer typed a real value. No signature lines: the
 *  proposal is explicitly non-binding. */
export function proposalHtml(opts: {
  result: AuditResult;
  brand: BrandProfile;
  runDate: string;
  items: ProposalItem[];
  template?: ProposalKind;
  sections?: Partial<Record<SectionKey, boolean>>;
  prices?: { essential?: string; growth?: string; premium?: string; monthly?: string };
  scopeLines?: string[];
  timelineLines?: string[];
  notIncluded?: string[];
  expiryDays?: string;
  /** Findings the buyer selected in the generator; only these appear in
   *  the proposal PDF. Defaults to all findings when omitted. */
  selectedIssueIds?: string[];
}): string {
  const { result, brand, runDate, items } = opts;
  const shownResult: AuditResult =
    opts.selectedIssueIds && opts.selectedIssueIds.length > 0
      ? { ...result, issues: result.issues.filter((i) => opts.selectedIssueIds!.includes(i.id)) }
      : result;
  const template = opts.template ?? "redesign";
  const on = (s: SectionKey) => opts.sections?.[s] !== false;
  const prices = opts.prices ?? {};
  const scopeLines = opts.scopeLines?.length ? opts.scopeLines : [];
  const timelineLines = opts.timelineLines?.length ? opts.timelineLines : [];
  const notIncluded = opts.notIncluded?.length ? opts.notIncluded : NOT_INCLUDED_DEFAULT;
  const title =
    template === "quickfix"
      ? "Quick-Fix Pitch"
      : template === "retainer"
        ? "Monthly Care Proposal"
        : template === "localseo"
          ? "Local SEO & GBP Refresh Proposal"
          : template === "landing"
            ? "Landing Page Proposal"
            : template === "fastclose"
              ? "One-Page Fast-Close Quote"
              : "Website Fix Proposal";
  const fixHeading = template === "retainer" ? "What we would do monthly" : template === "localseo" ? "What we would fix (local search and profile)" : template === "landing" ? "What the new page would fix" : "What we would fix";
  // A 0-findings audit must never claim "found N quick wins" in the PDF:
  // the cover line is replaced with the good-shape wording instead.
  const introLine =
    result.issues.length === 0 && /found (\d+|several) quick wins/i.test(brand.introLine)
      ? "I reviewed your website and found it in good shape."
      : brand.introLine;

  const investment =
    template === "retainer"
      ? `<p>Monthly care plan: <strong>${escapeHtml(priceOrBlank(prices.monthly ?? ""))}</strong> per month, 3-month minimum, 30-day cancel after that.</p><p>Updates, backups, quarterly restore test, up to 2 hours of small changes per month.</p>`
      : template === "quickfix" || template === "fastclose" || template === "landing"
        ? `<table><thead><tr><th>Tier</th><th>Price</th></tr></thead><tbody><tr><td>Essential</td><td>${escapeHtml(priceOrBlank(prices.essential ?? ""))}</td></tr></tbody></table><p class="meta">Quick wins only. Payment terms: 50% upfront, 50% on completion.</p>`
        : template === "localseo"
          ? `<table><thead><tr><th>Tier</th><th>Price</th></tr></thead><tbody><tr><td>Essential</td><td>${escapeHtml(priceOrBlank(prices.essential ?? ""))}</td></tr><tr><td>Monthly profile care</td><td>${escapeHtml(priceOrBlank(prices.monthly ?? ""))}</td></tr></tbody></table><p class="meta">Payment terms: 50% upfront, 50% on completion.</p>`
          : `<table><thead><tr><th>Tier</th><th>Price</th></tr></thead><tbody><tr><td>Essential</td><td>${escapeHtml(priceOrBlank(prices.essential ?? ""))}</td></tr><tr><td>Growth</td><td>${escapeHtml(priceOrBlank(prices.growth ?? ""))}</td></tr><tr><td>Premium</td><td>${escapeHtml(priceOrBlank(prices.premium ?? ""))}</td></tr></tbody></table><p class="meta">Payment terms: 50% upfront, 50% on launch. For larger projects, milestone terms of 30% / 40% / 30% can be used instead. Edit these terms to match your agreement. This is not legal advice.</p>`;

  const phases = template === "retainer" ? ["Ongoing"] : ["Quick wins", "Redesign", "Ongoing"];
  const phaseSections = phases
    .map((phase) => {
      const phaseItems = items.filter((i) => i.phase === phase);
      if (phaseItems.length === 0) return "";
      return `<h3>${escapeHtml(phase)}</h3><ul>${phaseItems.map((i) => `<li><strong>${escapeHtml(i.title)}</strong> &mdash; ${escapeHtml(i.detail)}</li>`).join("")}</ul>`;
    })
    .join("");

  let body = `
  <div class="score-box">
    <p class="meta">Overall score</p>
    <p><span class="score-big">${result.overallScore} / 100</span> &nbsp; <span class="grade" style="color:${gradeColor(result.overallGrade)};">Grade ${escapeHtml(result.overallGrade)}</span></p>
    <p class="meta">Homepage: ${escapeHtml(result.finalUrl)}</p>
  </div>
  <p>${escapeHtml(introLine)}</p>`;

  if (on("found")) {
    body += `<h2>What we found</h2>${shownResult.issues.length === 0 ? "<p>No material issues were found on the homepage in this run. The opportunity is keeping the site in good shape, not fixing what is not broken.</p>" : issueBlocks(shownResult)}`;
  }
  if (on("fix")) {
    body += `<h2>${escapeHtml(fixHeading)}</h2>${phaseSections || "<p>No fix items were listed for this site in this run.</p>"}`;
  }
  if (on("scope") && scopeLines.length > 0) {
    body += `<h2>Scope and deliverables</h2><ul>${scopeLines.map((s) => `<li>${escapeHtml(s)}</li>`).join("")}</ul><h3>Not included</h3><ul>${notIncluded.map((s) => `<li>${escapeHtml(s)}</li>`).join("")}</ul>`;
  }
  if (on("timeline") && timelineLines.length > 0) {
    body += `<h2>Timeline and milestones</h2><ul>${timelineLines.map((s) => `<li>${escapeHtml(s)}</li>`).join("")}</ul><p class="meta">Start date: [fill in]. Timings assume the client provides content and access on time.</p>`;
  }
  if (on("investment")) {
    body += `<h2>Investment</h2>${investment}`;
  }
  if (on("about")) {
    body += `<h2>About and past work</h2><p>${escapeHtml(TESTIMONIAL_SLOT_TEXT).replace(/\n/g, "<br>")}</p>`;
  }
  if (on("terms")) {
    body += `<h2>Terms</h2><p>This proposal includes 2 rounds of design revisions. Additional revisions or work outside the scope described above will be quoted separately. Ownership of the finished site passes to the client on final payment. Edit these terms to match your agreement with your client. This is not legal advice.</p>`;
  }
  if (on("nextstep")) {
    const expiry = (opts.expiryDays ?? "").trim() || "[14/30]";
    body += `<h2>What happens next</h2>
  <div class="cta">${contactBlock(brand)}</div>
  <p>Reply to this email by [date] to book a 15-minute call. This proposal is valid for ${escapeHtml(expiry)} days from the date above.</p>
  <p class="meta">${escapeHtml(NON_BINDING_TEXT)}</p>`;
  }
  return reportShell({ title, brand, runDate, prospectUrl: result.url, isSample: result.isSample, body });
}
