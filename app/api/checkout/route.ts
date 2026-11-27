// DealNote checkout: POST /api/checkout creates a Polar checkout session.
// Brand-new code for DealNote. No code copied from any other product.
//
// $49 one-time via Polar.sh (Starter 5% + $0.50). No Stripe checkout on top.
// When Polar is not configured, this returns { notConfigured: true } with a
// plain message and HTTP 503. It never returns a fake success or a fake URL.
// Optional fallback: if POLAR_CHECKOUT_URL (a hosted Polar checkout link
// created in the Polar dashboard) is set, that link is returned instead.

import { NextResponse } from "next/server";
import { getPolarClient } from "@/lib/license";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: { email?: string } = {};
  try {
    body = await request.json();
  } catch {
    // Empty body is fine; email is optional.
  }
  const email = typeof body.email === "string" ? body.email.trim() : "";

  const token = process.env.POLAR_ACCESS_TOKEN;
  const productId = process.env.POLAR_PRODUCT_ID;
  const hostedLink = process.env.POLAR_CHECKOUT_URL;

  if (token && productId) {
    const polar = getPolarClient();
    if (!polar) {
      return NextResponse.json(
        { notConfigured: true, error: "Checkout is not configured yet. Polar is not set up on this build." },
        { status: 503 },
      );
    }
    const origin = new URL(request.url).origin;
    try {
      const checkout = await polar.checkouts.create({
        products: [productId],
        success_url: `${origin}/audit?checkout_id={CHECKOUT_ID}`,
        ...(email ? { customer_email: email } : {}),
      });
      return NextResponse.json({ url: checkout.url, checkoutId: checkout.id });
    } catch {
      return NextResponse.json(
        { error: "Checkout could not be started. Try again in a moment." },
        { status: 502 },
      );
    }
  }

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
