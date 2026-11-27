import { NextResponse } from "next/server";
import { analyzePage, internalLinksOf } from "@/lib/analyze";
import {
  gradeFor,
  isValidAuditUrl,
  type AuditResult,
} from "@/lib/audit";

export const runtime = "nodejs";
export const maxDuration = 60;

const FETCH_TIMEOUT_MS = 10000;

async function fetchWithTimeout(url: string, timeoutMs: number): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, {
      signal: controller.signal,
      redirect: "follow",
      headers: {
        "user-agent": "DealNote/1.0 (website teardown; contact via site owner)",
        accept: "text/html,application/xhtml+xml",
      },
    });
  } finally {
    clearTimeout(timer);
  }
}

export async function POST(request: Request) {
  let body: { url?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Send a JSON body with a url field." }, { status: 400 });
  }

  const raw = typeof body.url === "string" ? body.url : "";
  const check = isValidAuditUrl(raw);
  if (!check.ok) {
    return NextResponse.json({ error: check.error }, { status: 400 });
  }
  const url = check.url;

  const started = Date.now();
  let response: Response;
  try {
    response = await fetchWithTimeout(url, FETCH_TIMEOUT_MS);
  } catch (err) {
    const reason = err instanceof Error && err.name === "AbortError" ? "timed out after 10 seconds" : "could not be reached";
    return NextResponse.json(
      {
        error: `The site ${reason}. The page may block automated checks, or it may be down. No score was given for a page that could not be read.`,
        sampleAvailable: true,
      },
      { status: 502 },
    );
  }
  const loadMs = Date.now() - started;

  if (!response.ok) {
    return NextResponse.json(
      {
        error: `The site returned HTTP ${response.status}. No score was given for a page that could not be read.`,
        sampleAvailable: true,
      },
      { status: 502 },
    );
  }

  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("text/html")) {
    return NextResponse.json(
      {
        error: "That URL did not return an HTML page. Paste the address of a business website homepage.",
        sampleAvailable: true,
      },
      { status: 422 },
    );
  }

  const html = await response.text();
  const finalUrl = response.url || url;

  // Best-effort robots.txt and sitemap checks; a missing file is a finding, not a failure.
  const origin = new URL(finalUrl).origin;
  const [robotsRes, sitemapRes] = await Promise.allSettled([
    fetchWithTimeout(`${origin}/robots.txt`, 5000),
    fetchWithTimeout(`${origin}/sitemap.xml`, 5000),
  ]);
  const hasRobots = robotsRes.status === "fulfilled" && robotsRes.value.ok ? true : robotsRes.status === "fulfilled" ? false : null;
  const hasSitemap = sitemapRes.status === "fulfilled" && sitemapRes.value.ok ? true : sitemapRes.status === "fulfilled" ? false : null;

  // Broken internal links: first 10 unique internal links, HEAD then GET, 5 s each.
  const brokenLinks: { url: string; status: number | string }[] = [];
  const uniqueInternal = [...new Set(internalLinksOf(html, finalUrl))].slice(0, 10);
  const linkChecks = await Promise.allSettled(
    uniqueInternal.map(async (linkUrl) => {
      try {
        const head = await fetchWithTimeout(linkUrl, 5000);
        if (head.status >= 400) return { url: linkUrl, status: head.status };
        return null;
      } catch {
        try {
          const get = await fetchWithTimeout(linkUrl, 5000);
          if (get.status >= 400) return { url: linkUrl, status: get.status };
          return null;
        } catch {
          return { url: linkUrl, status: "unreachable" };
        }
      }
    }),
  );
  for (const r of linkChecks) {
    if (r.status === "fulfilled" && r.value) brokenLinks.push(r.value);
  }

  // Pure analysis: HTML in, scores and issues out. This is the piece
  // being ported to Rust, checked against the original at every step.
  const analysis = analyzePage({ html, finalUrl, loadMs, hasRobots, hasSitemap, brokenLinks });
  const https = finalUrl.startsWith("https://");

  const result: AuditResult = {
    url,
    finalUrl,
    fetchedAt: new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }),
    status: response.status,
    https,
    loadMs,
    pageBytes: Buffer.byteLength(html, "utf8"),
    title: analysis.title,
    metaDescription: analysis.metaDescription,
    h1Count: analysis.h1Count,
    imageCount: analysis.imageCount,
    imagesMissingAlt: analysis.imagesMissingAlt,
    internalLinks: analysis.internalLinks,
    externalLinks: analysis.externalLinks,
    brokenLinks,
    hasViewport: analysis.hasViewport,
    hasSchema: analysis.hasSchema,
    hasTel: analysis.hasTel,
    hasMailto: analysis.hasMailto,
    hasForm: analysis.hasForm,
    formFields: analysis.formFields,
    hasFavicon: analysis.hasFavicon,
    hasCanonical: analysis.hasCanonical,
    hasRobots,
    hasSitemap,
    overallScore: analysis.overallScore,
    overallGrade: gradeFor(analysis.overallScore),
    categories: analysis.categories,
    issues: analysis.issues,
    couldNotCheck: analysis.couldNotCheck,
    isSample: false,
  };

  return NextResponse.json(result);
}
