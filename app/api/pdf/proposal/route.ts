// DealNote proposal PDF: POST /api/pdf/proposal
// Brand-new code for DealNote. No code copied from any other product.
//
// Body: { url, licenseKey, brand?, items?, template?, sections?, prices?,
//         scopeLines?, timelineLines?, notIncluded?, expiryDays?,
//         selectedIssueIds? } (brand = BrandProfile fields, partial
// allowed; missing fields fall back to DEFAULT_BRAND).
// - Requires a valid licence key: missing or invalid key -> 402, quota
//   exhausted -> 402. The audit is NOT re-run when the licence key
//   already has a cached paid audit for this URL (within 24 h): the
//   cached result is reused and no quota is consumed. Only a first PDF
//   for a URL runs the audit, exactly like /api/audit.
//   list (items) is used when supplied and valid; otherwise fix items are
//   built from the audit findings (proposalItemsFromIssues), never invented.
//   Only the buyer-selected findings appear in the proposal.
// - Returns application/pdf rendered from the shared template in
//   lib/pdf-html.ts (buyer logo and brand colour in the PDF, white/slate,
//   deep teal #0F766E default, no gradients).
// - If Chromium cannot render at runtime, returns a clear 501. A PDF is
//   never faked.

import { NextResponse } from "next/server";
import {
  DEFAULT_BRAND,
  isValidAuditUrl,
  proposalItemsFromIssues,
  type BrandProfile,
  type ProposalItem,
} from "@/lib/audit";
import { runPaidAuditCached } from "@/app/api/audit/route";
import { footerLine, htmlToPdfBuffer, proposalHtml } from "@/lib/pdf-html";
import { DEFAULT_SCOPE, DEFAULT_TIMELINE, NOT_INCLUDED_DEFAULT, type ProposalKind, type SectionKey } from "@/lib/templates";

export const runtime = "nodejs";
export const maxDuration = 60;

function mergeBrand(input: unknown): BrandProfile {
  const base = { ...DEFAULT_BRAND };
  if (input && typeof input === "object") {
    for (const key of Object.keys(base) as (keyof BrandProfile)[]) {
      const value = (input as Record<string, unknown>)[key];
      if (typeof value === "string" && value.trim()) base[key] = value;
    }
  }
  return base;
}

/** Validate the buyer's edited fix list: plain strings only, capped. */
function parseItems(input: unknown): ProposalItem[] | null {
  if (!Array.isArray(input)) return null;
  const phases = ["Quick wins", "Redesign", "Ongoing"];
  const out: ProposalItem[] = [];
  for (const raw of input.slice(0, 30)) {
    if (!raw || typeof raw !== "object") return null;
    const title = typeof (raw as Record<string, unknown>).title === "string" ? ((raw as Record<string, unknown>).title as string).trim() : "";
    const detail = typeof (raw as Record<string, unknown>).detail === "string" ? ((raw as Record<string, unknown>).detail as string).trim() : "";
    const phase = typeof (raw as Record<string, unknown>).phase === "string" ? ((raw as Record<string, unknown>).phase as string) : "Quick wins";
    if (!title || title.length > 200 || detail.length > 500) return null;
    out.push({ phase: phases.includes(phase) ? phase : "Quick wins", title, detail });
  }
  return out;
}

function parseStringList(input: unknown, fallback: string[]): string[] {
  if (!Array.isArray(input)) return fallback;
  const out = input
    .filter((v): v is string => typeof v === "string")
    .map((v) => v.trim())
    .filter((v) => v.length > 0 && v.length <= 300)
    .slice(0, 20);
  return out.length > 0 ? out : fallback;
}

function parseSections(input: unknown): Partial<Record<SectionKey, boolean>> | undefined {
  if (!input || typeof input !== "object") return undefined;
  const keys: SectionKey[] = ["cover", "found", "understanding", "fix", "scope", "timeline", "investment", "about", "terms", "nextstep"];
  const out: Partial<Record<SectionKey, boolean>> = {};
  for (const k of keys) {
    const v = (input as Record<string, unknown>)[k];
    if (typeof v === "boolean") out[k] = v;
  }
  return out;
}

function parsePrices(input: unknown): { essential?: string; growth?: string; premium?: string; monthly?: string } {
  if (!input || typeof input !== "object") return {};
  const out: Record<string, string> = {};
  for (const k of ["essential", "growth", "premium", "monthly"]) {
    const v = (input as Record<string, unknown>)[k];
    if (typeof v === "string" && v.trim().length <= 40) out[k] = v.trim();
  }
  return out;
}

export async function POST(request: Request) {
  let body: {
    url?: string;
    licenseKey?: string;
    brand?: unknown;
    items?: unknown;
    template?: unknown;
    sections?: unknown;
    prices?: unknown;
    scopeLines?: unknown;
    timelineLines?: unknown;
    notIncluded?: unknown;
    expiryDays?: unknown;
    selectedIssueIds?: unknown;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Send a JSON body with url and licenseKey fields." }, { status: 400 });
  }

  const raw = typeof body.url === "string" ? body.url : "";
  const check = isValidAuditUrl(raw);
  if (!check.ok) {
    return NextResponse.json({ error: check.error }, { status: 400 });
  }

  const licenseKey = typeof body.licenseKey === "string" ? body.licenseKey.trim() : "";
  if (!licenseKey) {
    return NextResponse.json(
      { error: "A licence key is required to download the PDF proposal. Buy DealNote ($49 one-time) to get one." },
      { status: 402 },
    );
  }

  const paid = await runPaidAuditCached(check.url, licenseKey);
  if (!paid.ok) {
    // PDF export is a paid feature: an invalid key is a payment problem (402),
    // while audit failures (robots 403, fetch 502, ...) pass through as-is.
    const status = paid.status === 401 ? 402 : paid.status;
    return NextResponse.json(
      { error: paid.error, ...(paid.sampleAvailable ? { sampleAvailable: true } : {}) },
      { status },
    );
  }

  const brand = mergeBrand(body.brand);
  const template: ProposalKind =
    body.template === "quickfix" ||
    body.template === "retainer" ||
    body.template === "localseo" ||
    body.template === "landing" ||
    body.template === "fastclose" ||
    body.template === "newbuild" ||
    body.template === "ecommerce"
      ? (body.template as ProposalKind)
      : "redesign";
  // A 0-findings audit gets no fix proposal: only the Retainer Opener,
  // which is care for a healthy site, is honest for it.
  const effectiveTemplate = paid.result.issues.length === 0 && template !== "retainer" ? "retainer" : template;
  const items = parseItems(body.items) ?? proposalItemsFromIssues(paid.result.issues);
  const selectedIssueIds = Array.isArray(body.selectedIssueIds)
    ? body.selectedIssueIds.filter((v): v is string => typeof v === "string").slice(0, 20)
    : undefined;
  const expiryDays = typeof body.expiryDays === "string" && /^[0-9]{1,3}$/.test(body.expiryDays.trim()) ? body.expiryDays.trim() : "";
  const html = proposalHtml({
    result: paid.result,
    brand,
    runDate: paid.result.fetchedAt,
    items,
    template: effectiveTemplate,
    sections: parseSections(body.sections),
    prices: parsePrices(body.prices),
    scopeLines: parseStringList(body.scopeLines, effectiveTemplate === "redesign" || effectiveTemplate === "localseo" || effectiveTemplate === "landing" || effectiveTemplate === "newbuild" || effectiveTemplate === "ecommerce" ? DEFAULT_SCOPE : []),
    timelineLines: parseStringList(body.timelineLines, effectiveTemplate === "redesign" || effectiveTemplate === "newbuild" || effectiveTemplate === "ecommerce" ? DEFAULT_TIMELINE : []),
    notIncluded: parseStringList(body.notIncluded, NOT_INCLUDED_DEFAULT),
    expiryDays,
    selectedIssueIds,
  });

  let pdf: Buffer;
  try {
    pdf = await htmlToPdfBuffer(html, footerLine(brand, paid.result.fetchedAt, paid.result.url));
  } catch {
    return NextResponse.json(
      { error: "PDF export is not available in this build." },
      { status: 501 },
    );
  }

  return new NextResponse(new Uint8Array(pdf), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="dealnote-proposal.pdf"',
      "Content-Length": String(pdf.length),
    },
  });
}
