// DealNote sample teardown PDF: GET /api/pdf/sample
// No license key, no payment, no live audit: it renders the fictional
// sample audit from lib/audit.ts (isSample: true) through the same
// teardown template as the paid PDF, so the file carries the SAMPLE
// stamp on page 1 and the sample disclaimer in its footer. The brand is
// the fictional Harbor & Pine Digital studio (Neon redesign, 28 Nov
// 2026), never a [Your studio] placeholder.

import { NextResponse } from "next/server";
import { SAMPLE_BRAND, sampleAudit } from "@/lib/audit";
import { footerLine, headerLine, htmlToPdfBuffer, teardownReportHtml } from "@/lib/pdf-html";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function GET() {
  const sample = sampleAudit();
  const html = teardownReportHtml({ result: sample, brand: SAMPLE_BRAND, runDate: sample.fetchedAt });
  let pdf: Buffer;
  try {
    pdf = await htmlToPdfBuffer(
      html,
      headerLine({ brand: SAMPLE_BRAND, docType: "Teardown report", prospectUrl: sample.url, runDate: sample.fetchedAt, isSample: true }),
      footerLine(SAMPLE_BRAND, sample.fetchedAt, sample.url),
    );
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
