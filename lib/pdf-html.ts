// DealNote PDF HTML templates (shared by /api/pdf/teardown and /api/pdf/proposal).
// Brand-new code for DealNote. No code copied from any other product.
//
// Design tokens: white / slate-violet, pink #BE185D, Inter / system font.
// No gradients, no glows, no emoji. The HTML is rendered to PDF by
// Puppeteer (Chromium); it is plain printable HTML, no JavaScript.
// Pink brand header/footer follows the site brand color (28 Nov 2026
// Sakuga direction); no effects in PDFs.

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
 *  back to DealNote pink so a bad value can never break the PDF. */
export function brandAccent(brand: BrandProfile): string {
  const c = (brand.primaryColor ?? "").trim();
  return /^#[0-9a-fA-F]{6}$/.test(c) ? c : "#BE185D";
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
 *  Neon redesign (28 Nov 2026): US Letter 8.5x11, 44pt margins on all
 *  sides, running header + footer on EVERY page via displayHeaderFooter.
 *  `headerHtml` / `footerHtml` are the full header/footer templates
 *  (already escaped); pass "" for none. Page numbers use Chromium's
 *  pageNumber / totalPages spans inside the footer template. */
export async function htmlToPdfBuffer(html: string, headerHtml = "", footerHtml = ""): Promise<Buffer> {
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
      format: "Letter",
      printBackground: true,
      margin: { top: "44pt", bottom: "44pt", left: "44pt", right: "44pt" },
      displayHeaderFooter: Boolean(headerHtml || footerHtml),
      headerTemplate: headerHtml || "<div></div>",
      footerTemplate: footerHtml || "<div></div>",
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

/** Sample-only disclaimer, printed on page 1 and the final page. */
export const SAMPLE_DISCLAIMER =
  "Sample data for demonstration only. Real audits reflect public homepage lab measurements on the run date and are not Lighthouse, PageSpeed, or search-ranking scores.";

/** Running footer, every page: prepared-by left, "Page X of Y" right. */
export function footerLine(brand: BrandProfile, runDate: string, prospectUrl: string): string {
  void runDate;
  void prospectUrl;
  const left = `Prepared by ${brand.brandName} · ${brand.contactName} · ${brand.contactEmail}`;
  return `<div style="width:100%;font-size:8pt;color:#4B5563;padding:0 44pt;display:flex;justify-content:space-between;"><span>${escapeHtml(left)}</span><span>Page <span class="pageNumber"></span> of <span class="totalPages"></span></span></div>`;
}

/** Running header, every page: studio logo + name left, document type +
 *  domain + run date right, SAMPLE pill on the sample PDF. */
export function headerLine(opts: {
  brand: BrandProfile;
  docType: string;
  prospectUrl: string;
  runDate: string;
  isSample: boolean;
}): string {
  const { brand, docType, prospectUrl, runDate, isSample } = opts;
  const host = prospectUrl.replace(/^https?:\/\//, "").replace(/\/.*$/, "");
  const pill = isSample
    ? ` <span style="display:inline-block;border:1pt solid #B91C1C;color:#B91C1C;font-weight:700;font-size:7pt;letter-spacing:0.08em;padding:1pt 5pt;">SAMPLE</span>`
    : "";
  return `<div style="width:100%;font-size:8pt;color:#4B5563;padding:0 44pt;display:flex;justify-content:space-between;align-items:center;"><span style="font-weight:700;color:#111827;">${escapeHtml(brand.brandName)}${pill}</span><span>${escapeHtml(docType)} &middot; ${escapeHtml(host)} &middot; ${escapeHtml(runDate)}</span></div>`;
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

/** Grade tint backgrounds, fixed, never overridden by brand. C uses the
 *  darker text #92400E on its tint for contrast. */
function gradeTint(grade: string): string {
  if (grade === "A" || grade === "B") return "#F0FDF4";
  if (grade === "C") return "#FFFBEB";
  return "#FEF2F2";
}

function gradeTextColor(grade: string): string {
  if (grade === "C") return "#92400E";
  return gradeColor(grade);
}

function statusLabel(grade: string): string {
  if (grade === "A") return "Excellent — keep it up";
  if (grade === "B") return "Good — a few quick wins";
  if (grade === "C") return "Fair — worth fixing soon";
  if (grade === "D") return "Needs work";
  return "Needs urgent attention";
}

const baseCss = (accent: string) => `
  * { box-sizing: border-box; }
  body { font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; color: #374151; margin: 0; padding: 0; font-size: 9.5pt; line-height: 1.45; background: #ffffff; }
  h1 { font-size: 22pt; font-weight: 700; line-height: 1.2; color: #111827; margin: 0 0 6pt; }
  h2 { font-size: 13pt; font-weight: 700; color: #111827; margin: 20pt 0 8pt; padding-bottom: 5pt; border-bottom: 1pt solid #E9D5FF; }
  h3 { font-size: 10.5pt; font-weight: 600; color: #111827; margin: 12pt 0 4pt; }
  p { margin: 5pt 0; }
  .micro { font-size: 8pt; color: #4B5563; line-height: 1.4; }
  .tabular { font-variant-numeric: tabular-nums; }
  .cover-rule { height: 3pt; background: ${accent}; margin: 0 0 14pt; }
  .brand { color: ${accent}; font-weight: 700; font-size: 9pt; letter-spacing: 0.06em; text-transform: uppercase; margin-bottom: 4pt; }
  .section-label { color: ${accent}; font-weight: 700; font-size: 8pt; letter-spacing: 0.08em; text-transform: uppercase; margin: 0 0 4pt; }
  .meta { color: #4B5563; font-size: 8pt; }
  .notice-strip { background: #FAF5FF; border: 0.75pt solid #DDD6FE; padding: 8pt 10pt; margin: 10pt 0; font-size: 8.5pt; color: #374151; }
  .sample-stamp { display: inline-block; border: 1.5pt solid #B91C1C; color: #B91C1C; font-weight: 700; letter-spacing: 0.08em; padding: 2pt 8pt; font-size: 9pt; margin: 8pt 0; }
  .hero { border: 0.75pt solid #DDD6FE; background: #FAF5FF; padding: 14pt 16pt; margin: 12pt 0; }
  .hero-score { font-size: 40pt; font-weight: 700; color: #111827; line-height: 1; }
  .grade-badge { display: inline-flex; align-items: center; justify-content: center; width: 48pt; height: 48pt; font-size: 24pt; font-weight: 700; color: #ffffff; }
  .score-bar { height: 6pt; background: #E9D5FF; border-radius: 3pt; overflow: hidden; }
  .score-bar > span { display: block; height: 100%; border-radius: 3pt; }
  table { width: 100%; border-collapse: collapse; margin: 8pt 0; font-size: 9.5pt; }
  th, td { text-align: left; padding: 5pt 6pt; border-bottom: 0.75pt solid #E9D5FF; vertical-align: top; }
  th { color: #4B5563; font-size: 8pt; text-transform: uppercase; letter-spacing: 0.05em; }
  .issue { border: 0.75pt solid #DDD6FE; margin: 10pt 0; break-inside: avoid; page-break-inside: avoid; }
  .issue-head { background: #FAF5FF; border-bottom: 0.75pt solid #DDD6FE; padding: 7pt 10pt; }
  .issue-head h3 { margin: 0; }
  .issue-body { padding: 8pt 10pt; }
  .issue-body p { margin: 4pt 0; }
  .severity { display: inline-block; font-size: 8pt; font-weight: 700; padding: 1pt 7pt; color: #ffffff; background: ${accent}; }
  .severity.critical { background: #B91C1C; }
  .footer-block { margin-top: 24pt; padding-top: 10pt; border-top: 1pt solid #E9D5FF; color: #4B5563; font-size: 8pt; line-height: 1.5; }
  .cta { border-left: 2.5pt solid ${accent}; background: #FAF5FF; border-top: 0.75pt solid #DDD6FE; border-right: 0.75pt solid #DDD6FE; border-bottom: 0.75pt solid #DDD6FE; padding: 12pt 14pt; margin: 12pt 0; }
  .cta a { color: ${accent}; font-weight: 700; }
  .page-break { break-before: page; page-break-before: always; }
  @media print { * { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
`;

function reportShell(opts: {
  title: string;
  brand: BrandProfile;
  runDate: string;
  prospectUrl: string;
  isSample: boolean;
  body: string;
  docType: string;
}): string {
  const b = opts.brand;
  const notice = opts.isSample
    ? `<div class="notice-strip"><strong>SAMPLE REPORT</strong> — Fictional business (${escapeHtml("Harbor & Pine Plumbing")}) and fictional studio (${escapeHtml("Harbor & Pine Digital")}). All data is invented for demonstration.</div>`
    : "";
  const disclaimer = opts.isSample ? SAMPLE_DISCLAIMER : FOOTER_DISCLAIMER;
  return `<!doctype html>
<html><head><meta charset="utf-8"><style>${baseCss(brandAccent(b))}</style></head>
<body>
  <div class="cover-rule"></div>
  ${logoImg(b)}
  <div class="brand">${escapeHtml(b.brandName)}${opts.isSample ? " [SAMPLE]" : ""}</div>
  <h1>${escapeHtml(opts.title)}</h1>
  <p class="meta tabular">${escapeHtml(opts.prospectUrl)} &middot; ${escapeHtml(opts.runDate)} &middot; ${escapeHtml(opts.docType)}</p>
  ${opts.isSample ? `<p><span class="sample-stamp">SAMPLE</span></p>` : ""}
  ${notice}
  ${opts.body}
  <div class="footer-block">
    <p class="micro">${escapeHtml(disclaimer)}</p>
    <p class="micro">Prepared by ${escapeHtml(b.brandName)} · ${escapeHtml(b.contactName)} · ${escapeHtml(b.contactEmail)}${b.contactPhone ? ` · ${escapeHtml(b.contactPhone)}` : ""}</p>
  </div>
</body></html>`;
}

/** Score Hero Block, page 1: 48x48 grade badge, big score, status label,
 *  6-row area table with 6pt bars. */
function heroBlock(result: AuditResult): string {
  const g = result.overallGrade;
  const rows = result.categories
    .map((c) => {
      const meta = CATEGORIES.find((m) => m.key === c.key);
      return `<tr><td>${escapeHtml(meta?.label ?? c.key)}</td><td class="tabular">${c.score} / 100</td><td><div class="score-bar"><span style="width:${c.score}%;background:${gradeColor(c.grade)};"></span></div></td><td style="color:${gradeTextColor(c.grade)};font-weight:700;background:${gradeTint(c.grade)};">${escapeHtml(c.grade)}</td></tr>`;
    })
    .join("");
  return `<div class="hero">
    <table style="margin:0;"><tbody><tr>
      <td style="border:none;padding:0;width:56pt;vertical-align:middle;"><span class="grade-badge" style="background:${gradeColor(g)};">${escapeHtml(g)}</span></td>
      <td style="border:none;padding:0 0 0 10pt;vertical-align:middle;">
        <div><span class="hero-score tabular">${result.overallScore}</span><span style="font-size:16pt;color:#4B5563;"> / 100</span></div>
        <div style="font-size:10.5pt;font-weight:600;color:${gradeTextColor(g)};">Grade ${escapeHtml(g)} — ${escapeHtml(statusLabel(g))}</div>
      </td>
    </tr></tbody></table>
    <table style="margin-top:10pt;"><thead><tr><th>Area</th><th>Score</th><th style="width:45%;">Bar</th><th>Grade</th></tr></thead>
    <tbody>${rows}</tbody></table>
    <p class="micro tabular" style="margin-bottom:0;">Homepage: ${escapeHtml(result.finalUrl)} &middot; Loaded in ${(result.loadMs / 1000).toFixed(1)}s &middot; ${result.https ? "HTTPS" : "Not HTTPS"}</p>
  </div>`;
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

function issueBlocks(result: AuditResult): string {
  if (result.issues.length === 0) return "<p>No issues were found on the homepage in this run.</p>";
  return result.issues
    .map(
      (issue) => `<div class="issue">
        <div class="issue-head">
          <p style="margin:0 0 3pt;"><span class="severity${issue.severity === "Critical" ? " critical" : ""}">${escapeHtml(issue.severity)}</span></p>
          <h3>${escapeHtml(issue.title)}</h3>
        </div>
        <div class="issue-body">
          <p><strong>Found:</strong> ${escapeHtml(issue.found)}</p>
          <p><strong>Why it matters:</strong> ${escapeHtml(issue.why)}</p>
          <p><strong>Fix:</strong> ${escapeHtml(issue.fix)}</p>
        </div>
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
  <p class="section-label">Teardown report</p>
  ${heroBlock(result)}
  <p class="micro">${escapeHtml(FOOTER_DISCLAIMER)}</p>
  <div class="page-break"></div>
  <p class="section-label">Findings</p>
  <h2>What we found, in plain language</h2>
  ${issueBlocks(result)}
  ${result.couldNotCheck.length > 0 ? `<h2>What this report could not check</h2><ul>${result.couldNotCheck.map((c) => `<li>${escapeHtml(c)}</li>`).join("")}</ul>` : ""}
  <h2>What happens next</h2>
  <div class="cta"><p>${escapeHtml(introLine)}</p>
  ${contactBlock(brand)}</div>`;
  return reportShell({ title: "Website Teardown Report", brand, runDate, prospectUrl: result.url, isSample: result.isSample, body, docType: "Teardown report" });
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
  <p class="section-label">Proposal</p>
  ${heroBlock(result)}
  <p>${escapeHtml(introLine)}</p>
  <p class="micro">${escapeHtml(FOOTER_DISCLAIMER)}</p>`;

  if (on("found")) {
    body += `<div class="page-break"></div><p class="section-label">What we found</p><h2>What we found</h2>${shownResult.issues.length === 0 ? "<p>No material issues were found on the homepage in this run. The opportunity is keeping the site in good shape, not fixing what is not broken.</p>" : issueBlocks(shownResult)}`;
  }
  if (on("fix")) {
    body += `<p class="section-label">What we would fix</p><h2>${escapeHtml(fixHeading)}</h2>${phaseSections || "<p>No fix items were listed for this site in this run.</p>"}`;
  }
  if (on("scope") && scopeLines.length > 0) {
    body += `<p class="section-label">Scope</p><h2>Scope and deliverables</h2><ul>${scopeLines.map((s) => `<li>${escapeHtml(s)}</li>`).join("")}</ul><h3>Not included</h3><ul>${notIncluded.map((s) => `<li>${escapeHtml(s)}</li>`).join("")}</ul>`;
  }
  if (on("timeline") && timelineLines.length > 0) {
    body += `<h2>Timeline and milestones</h2><ul>${timelineLines.map((s) => `<li>${escapeHtml(s)}</li>`).join("")}</ul><p class="meta">Start date: [fill in]. Timings assume the client provides content and access on time.</p>`;
  }
  if (on("investment")) {
    body += `<h2>Investment</h2>${investment}`;
  }
  if (on("about")) {
    body += `<p class="section-label">About</p><h2>About and past work</h2><p>${escapeHtml(TESTIMONIAL_SLOT_TEXT).replace(/\n/g, "<br>")}</p>`;
  }
  if (on("terms")) {
    body += `<h2>Terms</h2><p>This proposal includes 2 rounds of design revisions. Additional revisions or work outside the scope described above will be quoted separately. Ownership of the finished site passes to the client on final payment. Edit these terms to match your agreement with your client. This is not legal advice.</p>`;
  }
  if (on("nextstep")) {
    const expiry = (opts.expiryDays ?? "").trim() || "[14/30]";
    body += `<p class="section-label">Next step</p><h2>What happens next</h2>
  <div class="cta">${contactBlock(brand)}</div>
  <p>Reply to this email by [date] to book a 15-minute call. This proposal is valid for ${escapeHtml(expiry)} days from the date above.</p>
  <p class="meta">${escapeHtml(NON_BINDING_TEXT)}</p>`;
  }
  return reportShell({ title, brand, runDate, prospectUrl: result.url, isSample: result.isSample, body, docType: "Proposal" });
}
