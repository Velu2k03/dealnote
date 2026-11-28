// DealNote teardown PDF: POST /api/pdf/teardown
// Brand-new code for DealNote. No code copied from any other product.
//
// Body: { url, licenseKey, brand? } (brand = BrandProfile fields, partial
// allowed; missing fields fall back to DEFAULT_BRAND).
// - Requires a valid licence key: missing or invalid key -> 402, quota
//   exhausted -> 402. The audit is NOT re-run when the licence key
//   already has a cached paid audit for this URL (within 24 h): the
//   cached result is reused and no quota is consumed.
// - Returns application/pdf rendered from the shared template in
//   lib/pdf-html.ts (white/slate, deep teal #0F766E, no gradients).
// - If Chromium cannot render at runtime, returns a clear 501. A PDF is
//   never faked.

import { NextResponse } from "next/server";
import { DEFAULT_BRAND, brandValidationError, isValidAuditUrl, type BrandProfile } from "@/lib/audit";
import { runPaidAuditCached } from "@/app/api/audit/route";
import { footerLine, htmlToPdfBuffer, teardownReportHtml } from "@/lib/pdf-html";

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

export async function POST(request: Request) {
  let body: { url?: string; licenseKey?: string; brand?: unknown };
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
      { error: "A licence key is required to download the PDF report. Buy DealNote ($49 one-time) to get one." },
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
  const brandError = brandValidationError(brand);
  if (brandError) {
    return NextResponse.json({ error: brandError }, { status: 400 });
  }
  const html = teardownReportHtml({ result: paid.result, brand, runDate: paid.result.fetchedAt });

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
      "Content-Disposition": 'attachment; filename="dealnote-teardown.pdf"',
      "Content-Length": String(pdf.length),
    },
  });
}
