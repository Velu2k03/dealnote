// DealNote licence check: POST /api/license validates a licence key
// server-side and reports its monthly audit quota. It never reveals a
// full audit result and never consumes quota: checking a key is free.
// Brand-new code for DealNote. No code copied from any other product.
//
// Request:  { "licenseKey": "...." }
// Response: { valid: true, keyId, email?, auditsUsed, auditsRemaining,
//             auditsPerMonth: 30, source: "polar" | "dev" }
//           { valid: false, reason }   (HTTP 200 either way: this is a
//           check, not an auth gate; /api/audit returns 401 for bad keys.)

import { NextResponse } from "next/server";
import { validateLicenseKey } from "@/lib/license";
import {
  AUDITS_PER_MONTH,
  entitlementStore,
  hashLicenseKey,
  remainingAudits,
} from "@/lib/entitlements";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: { licenseKey?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ valid: false, reason: "Send a JSON body with a licenseKey field." });
  }
  const licenseKey = typeof body.licenseKey === "string" ? body.licenseKey.trim() : "";
  if (!licenseKey) {
    return NextResponse.json({ valid: false, reason: "Enter a licence key." });
  }

  const validation = await validateLicenseKey(licenseKey);
  if (!validation.valid) {
    return NextResponse.json({ valid: false, reason: validation.reason });
  }

  const record = await entitlementStore.getByKeyHash(hashLicenseKey(licenseKey));
  if (record?.revoked) {
    return NextResponse.json({ valid: false, reason: "That licence key was revoked after a refund." });
  }
  const auditsUsed = record ? record.auditsUsed : 0;
  const auditsRemaining = record ? remainingAudits(record) : AUDITS_PER_MONTH;

  return NextResponse.json({
    valid: true,
    keyId: validation.keyId,
    ...(validation.email ? { email: validation.email } : {}),
    auditsUsed,
    auditsRemaining,
    auditsPerMonth: AUDITS_PER_MONTH,
    source: validation.source,
  });
}
