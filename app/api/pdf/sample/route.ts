// DealNote sample teardown PDF: GET /api/pdf/sample
// No license key, no payment, no live audit: it renders the fictional
// sample audit from lib/audit.ts (isSample: true) through the same
// teardown template as the paid PDF, so the file carries the SAMPLE
// stamp on page 1 and the sample disclaimer in its footer. The brand is
// the deliberate [Your studio] placeholder, matching the /sample page.

import { NextResponse } from "next/server";
import { DEFAULT_BRAND, sampleAudit } from "@/lib/audit";
import { footerLine, htmlToPdfBuffer, teardownReportHtml } from "@/lib/pdf-html";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function GET() {
  const sample = sampleAudit();
  const html = teardownReportHtml({ result: sample, brand: DEFAULT_BRAND, runDate: sample.fetchedAt });
  let pdf: Buffer;
  try {
    pdf = await htmlToPdfBuffer(html, footerLine(DEFAULT_BRAND, sample.fetchedAt, sample.url));
  } catch {
    return NextResponse.json(
      { error: "Sample PDF export is not available in this build." },
      { status: 501 },
    );
  }
  return new NextResponse(new Uint8Array(pdf), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="dealnote-sample-teardown.pdf"',
      "Content-Length": String(pdf.length),
    },
  });
}
