// DealNote checkout: POST /api/checkout creates a Lemon Squeezy checkout.
// Brand-new code for DealNote. No code copied from any other product.
//
// $49 one-time via Lemon Squeezy (5% + $0.50, merchant of record).
// When Lemon Squeezy is not configured, this returns
// { notConfigured: true } with a plain message and HTTP 503. It never
// returns a fake success or a fake URL.
// Optional fallback: if LEMONSQUEEZY_CHECKOUT_URL (a hosted Lemon
// Squeezy checkout link created in the dashboard) is set, that link
// is returned instead.

import { NextResponse } from "next/server";
import { createLemonSqueezyCheckout, isLemonSqueezyConfigured } from "@/lib/lemonsqueezy";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: { email?: string } = {};
  try {
    body = await request.json();
  } catch {
    // Empty body is fine; email is optional.
  }
  const email = typeof body.email === "string" ? body.email.trim() : "";

  if (isLemonSqueezyConfigured()) {
    const origin = new URL(request.url).origin;
    try {
      const checkout = await createLemonSqueezyCheckout({ email, origin });
      return NextResponse.json({ url: checkout.url, checkoutId: checkout.checkoutId });
    } catch {
      return NextResponse.json(
        { error: "Checkout could not be started. Try again in a moment." },
        { status: 502 },
      );
    }
  }

  const hostedLink = process.env.LEMONSQUEEZY_CHECKOUT_URL;
  if (hostedLink) {
    return NextResponse.json({ url: hostedLink, hostedLink: true });
  }

  return NextResponse.json(
    {
      notConfigured: true,
      error: "Checkout is not configured yet. The $49 one-time licence is coming soon; the free preview still works.",
    },
    { status: 503 },
  );
}
