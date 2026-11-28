import { NextResponse } from "next/server";
import { analyzePage, internalLinksOf } from "@/lib/analyze";
import {
  gradeFor,
  isValidAuditUrl,
  type AuditResult,
} from "@/lib/audit";
import { validateLicenseKey } from "@/lib/license";
import {
  AUDITS_PER_MONTH,
  entitlementStore,
  hashLicenseKey,
  newLicenseRecord,
  remainingAudits,
  tryConsumeAudit,
  type LicenseRecord,
} from "@/lib/entitlements";
import { checkFreeRateLimitAsync, getClientIp, refundFreeRateLimit } from "@/lib/ratelimit";
import { getCachedAudit, setCachedAudit } from "@/lib/audit-cache";

export const runtime = "nodejs";
export const maxDuration = 60;

const FETCH_TIMEOUT_MS = 10000;
const MAX_REDIRECTS = 3;
const ROBOTS_TIMEOUT_MS = 5000;
const ROBOTS_FORBIDDEN_MESSAGE =
  "This site asks automated tools not to fetch this page (robots.txt). No score was given.";

async function fetchWithTimeout(url: string, timeoutMs: number): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, {
      signal: controller.signal,
      redirect: "follow",
      headers: {
        "user-agent": "DealNote/1.0 (website teardown; contact murugan@drvelu.com)",
        accept: "text/html,application/xhtml+xml",
      },
    });
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Fetch a small public text file (robots.txt / sitemap.xml) following at
 * most MAX_REDIRECTS redirects, re-validating every hop with the same
 * public-only blocklist as the main fetch. Previously these two fetches
 * used redirect:"follow" with no re-validation, so a redirect to a
 * private address was followed. Only the fetched text is consumed.
 */
async function fetchPublicTextWithRedirects(url: string, timeoutMs: number): Promise<Response> {
  let current = url;
  for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    let response: Response;
    try {
      response = await fetch(current, {
        signal: controller.signal,
        redirect: "manual",
        headers: {
          "user-agent": "DealNote/1.0 (website teardown; contact murugan@drvelu.com)",
          accept: "text/html,application/xhtml+xml",
        },
      });
    } finally {
      clearTimeout(timer);
    }
    if (isRedirectStatus(response.status)) {
      const location = response.headers.get("location");
      if (!location) return response;
      if (hop === MAX_REDIRECTS) throw new Error("too many redirects");
      let next: string;
      try {
        next = new URL(location, current).toString();
      } catch {
        throw new Error("bad redirect");
      }
      const check = isValidAuditUrl(next);
      if (!check.ok) throw new Error("redirect to non-public address");
      current = check.url;
      continue;
    }
    return response;
  }
  throw new Error("too many redirects");
}

// ---------------------------------------------------------------------------
// robots.txt
// ---------------------------------------------------------------------------

interface RobotsGroup {
  agents: string[];
  disallows: string[];
  allows: string[];
}

/**
 * Minimal robots.txt parser: groups of User-agent lines followed by
 * Allow / Disallow rules. The group for user-agent "DealNote" wins when
 * present; otherwise the "*" group applies. Longest matching rule wins
 * (an Allow longer than any Disallow allows the path).
 */
export function isPathDisallowedByRobots(robotsText: string, path: string): boolean {
  const groups: RobotsGroup[] = [];
  let current: RobotsGroup | null = null;
  for (const rawLine of robotsText.split(/\r?\n/)) {
    const line = rawLine.split("#")[0]?.trim() ?? "";
    if (!line) continue;
    const [fieldRaw, ...valueParts] = line.split(":");
    const field = (fieldRaw ?? "").trim().toLowerCase();
    const value = valueParts.join(":").trim();
    if (field === "user-agent") {
      if (current && (current.disallows.length > 0 || current.allows.length > 0)) {
        groups.push(current);
        current = null;
      }
      if (!current) current = { agents: [], disallows: [], allows: [] };
      current.agents.push(value.toLowerCase());
    } else if (field === "disallow" && current) {
      if (value) current.disallows.push(value);
    } else if (field === "allow" && current) {
      if (value) current.allows.push(value);
    }
    // Other fields (Sitemap, Crawl-delay, ...) are ignored.
  }
  if (current) groups.push(current);

  const specific = groups.find((g) => g.agents.includes("dealnote"));
  const group = specific ?? groups.find((g) => g.agents.includes("*"));
  if (!group) return false;

  // Robots patterns support the standard wildcards: "*" matches any
  // run of characters and a trailing "$" anchors the end of the path.
  // The match length used for longest-rule wins is the literal prefix
  // length (pattern with "*" and "$" stripped).
  const patternMatches = (pattern: string, p: string): boolean => {
    const anchored = pattern.endsWith("$");
    const core = anchored ? pattern.slice(0, -1) : pattern;
    const escaped = core.replace(/[.+?^${}()|[\]\\]/g, "\\$&").replace(/\*/g, ".*");
    return new RegExp(`^${escaped}${anchored ? "$" : ""}`).test(p);
  };
  const longest = (rules: string[]) =>
    rules.filter((r) => patternMatches(r, path)).reduce((m, r) => Math.max(m, r.replace(/[*$]/g, "").length), 0);
  const disallowLen = longest(group.disallows);
  if (disallowLen === 0) return false;
  const allowLen = longest(group.allows);
  return allowLen <= disallowLen;
}

// ---------------------------------------------------------------------------
// Fetch with redirect re-validation (SSRF guard)
// ---------------------------------------------------------------------------

function isRedirectStatus(status: number): boolean {
  return status === 301 || status === 302 || status === 303 || status === 307 || status === 308;
}

/**
 * Fetch a URL following at most MAX_REDIRECTS redirects. Every hop,
 * including the final URL, is re-validated with the same public-only
 * blocklist as isValidAuditUrl, so a redirect to a localhost / private
 * address is refused instead of followed.
 * Exported for unit tests; routes call it via runFullAudit.
 */
export async function fetchPublicWithRedirects(
  startUrl: string,
): Promise<{ response: Response; finalUrl: string }> {
  let current = startUrl;
  for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
    let response: Response;
    try {
      response = await fetch(current, {
        signal: controller.signal,
        redirect: "manual",
        headers: {
          "user-agent": "DealNote/1.0 (website teardown; contact murugan@drvelu.com)",
          accept: "text/html,application/xhtml+xml",
        },
      });
    } finally {
      clearTimeout(timer);
    }
    if (isRedirectStatus(response.status)) {
      const location = response.headers.get("location");
      if (!location) return { response, finalUrl: current };
      if (hop === MAX_REDIRECTS) {
        throw new Error("too many redirects");
      }
      let next: string;
      try {
        next = new URL(location, current).toString();
      } catch {
        throw new Error("bad redirect");
      }
      const check = isValidAuditUrl(next);
      if (!check.ok) throw new Error("redirect to non-public address");
      current = check.url;
      continue;
    }
    return { response, finalUrl: current };
  }
  throw new Error("too many redirects");
}

// ---------------------------------------------------------------------------
// The audit itself (fetch + analyse). No auth, no quota: callers enforce those.
// ---------------------------------------------------------------------------

export type AuditFailure = {
  ok: false;
  status: number;
  error: string;
  sampleAvailable?: boolean;
};

export async function runFullAudit(
  url: string,
): Promise<{ ok: true; result: AuditResult } | AuditFailure> {
  const parsed = new URL(url);
  const homePath = parsed.pathname || "/";

  // robots.txt is honoured BEFORE the homepage is fetched. A missing or
  // unreadable robots.txt is not a failure: the audit proceeds.
  let robotsText: string | null = null;
  let hasRobots: boolean | null = null;
  try {
    const robotsRes = await fetchPublicTextWithRedirects(`${parsed.origin}/robots.txt`, ROBOTS_TIMEOUT_MS);
    hasRobots = robotsRes.ok;
    if (robotsRes.ok) robotsText = await robotsRes.text();
  } catch {
    hasRobots = null;
  }
  if (robotsText !== null && isPathDisallowedByRobots(robotsText, homePath)) {
    return { ok: false, status: 403, error: ROBOTS_FORBIDDEN_MESSAGE };
  }

  const started = Date.now();
  let fetched: { response: Response; finalUrl: string };
  try {
    fetched = await fetchPublicWithRedirects(url);
  } catch (err) {
    const message = err instanceof Error ? err.message : "";
    const reason =
      message === "too many redirects"
        ? "redirected too many times"
        : message === "redirect to non-public address"
          ? "redirected to an address that is not a public website"
          : message === "bad redirect"
            ? "sent a redirect that could not be followed"
            : err instanceof Error && err.name === "AbortError"
              ? "timed out after 10 seconds"
              : "could not be reached";
    return {
      ok: false,
      status: message === "redirect to non-public address" ? 400 : 502,
      error: `The site ${reason}. The page may block automated checks, or it may be down. No score was given for a page that could not be read.`,
      sampleAvailable: true,
    };
  }
  const { response, finalUrl } = fetched;
  const loadMs = Date.now() - started;

  // Defence in depth: re-validate the final URL even though every hop
  // was already checked.
  const finalCheck = isValidAuditUrl(finalUrl);
  if (!finalCheck.ok) {
    return { ok: false, status: 400, error: finalCheck.error };
  }

  if (!response.ok) {
    return {
      ok: false,
      status: 502,
      error: `The site returned HTTP ${response.status}. No score was given for a page that could not be read.`,
      sampleAvailable: true,
    };
  }

  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("text/html")) {
    return {
      ok: false,
      status: 422,
      error: "That URL did not return an HTML page. Paste the address of a business website homepage.",
      sampleAvailable: true,
    };
  }

  const html = await response.text();

  // Sitemap check; a missing file is a finding, not a failure.
  let hasSitemap: boolean | null = null;
  try {
    const sitemapRes = await fetchPublicTextWithRedirects(`${new URL(finalUrl).origin}/sitemap.xml`, 5000);
    hasSitemap = sitemapRes.ok;
  } catch {
    hasSitemap = null;
  }

  // Broken internal links: first 10 unique internal links, HEAD then GET, 5 s each.
  // A HEAD that returns 405/403/501 is NOT a broken link on its own: many
  // servers refuse HEAD while serving GET fine, so retry with GET before
  // calling the link broken. Other 4xx HEAD responses are broken as-is.
  const brokenLinks: { url: string; status: number | string }[] = [];
  const uniqueInternal = [...new Set(internalLinksOf(html, finalUrl))].slice(0, 10);
  const linkChecks = await Promise.allSettled(
    uniqueInternal.map(async (linkUrl) => {
      const getCheck = async () => {
        try {
          const get = await fetchWithTimeout(linkUrl, 5000);
          if (get.status >= 400) return { url: linkUrl, status: get.status };
          return null;
        } catch {
          return { url: linkUrl, status: "unreachable" };
        }
      };
      try {
        const head = await fetchWithTimeout(linkUrl, 5000);
        if (head.status >= 400) {
          if (head.status === 405 || head.status === 403 || head.status === 501) {
            return getCheck();
          }
          return { url: linkUrl, status: head.status };
        }
        return null;
      } catch {
        return getCheck();
      }
    }),
  );
  for (const r of linkChecks) {
    if (r.status === "fulfilled" && r.value) brokenLinks.push(r.value);
  }

  // Pure analysis: HTML in, scores and issues out. This is the piece
  // being ported to Rust, checked against the original at every step.
  const analysis = analyzePage({ html, finalUrl, loadMs, hasRobots, hasSitemap, brokenLinks });
  // Findings are ordered by severity, Critical first, so the copy that
  // says so is true. Done here (not only in analyzePage) because the
  // Rust port of analyzePage may supply the analysis instead.
  const severityRank: Record<string, number> = { Critical: 0, "Fix soon": 1, "Nice to have": 2 };
  analysis.issues.sort((a, b) => (severityRank[a.severity] ?? 2) - (severityRank[b.severity] ?? 2));
  analysis.issues.forEach((issue, idx) => {
    issue.id = `i${idx + 1}`;
  });
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

  return { ok: true, result };
}

// ---------------------------------------------------------------------------
// Paid path: validate key, check quota, run, consume one audit on success.
// Shared by /api/audit and the PDF routes.
// ---------------------------------------------------------------------------

export type PaidAuditResult =
  | { ok: true; result: AuditResult; auditsUsed: number; auditsRemaining: number }
  | { ok: false; status: number; error: string; sampleAvailable?: boolean };

export async function runPaidAudit(url: string, licenseKey: string): Promise<PaidAuditResult> {
  const validation = await validateLicenseKey(licenseKey);
  if (!validation.valid) {
    return { ok: false, status: 401, error: validation.reason };
  }
  const keyHash = hashLicenseKey(licenseKey);
  let record: LicenseRecord | null = await entitlementStore.getByKeyHash(keyHash);
  if (!record) {
    record = newLicenseRecord({
      keyHash,
      keyId: validation.keyId,
      email: validation.email,
      customerId: validation.customerId,
    });
    await entitlementStore.set(record);
  }
  if (record.revoked) {
    return { ok: false, status: 401, error: "That license key was revoked after a refund. Contact support if this is wrong." };
  }
  if (remainingAudits(record) <= 0) {
    return {
      ok: false,
      status: 402,
      error: `This license key has used all ${AUDITS_PER_MONTH} audits for this month. The quota resets on the 1st of next month.`,
    };
  }

  const audited = await runFullAudit(url);
  if (!audited.ok) return audited;

  // Consume only on a successful audit: a failed fetch costs nothing.
  if (!tryConsumeAudit(record)) {
    return {
      ok: false,
      status: 402,
      error: `This license key has used all ${AUDITS_PER_MONTH} audits for this month. The quota resets on the 1st of next month.`,
    };
  }
  await entitlementStore.set(record);
  // Cache the paid result so a PDF download for the same URL reuses it
  // instead of re-running the audit and burning another audit.
  await setCachedAudit(keyHash, audited.result.url, audited.result);
  return {
    ok: true,
    result: audited.result,
    auditsUsed: record.auditsUsed,
    auditsRemaining: remainingAudits(record),
  };
}

/**
 * Paid audit for the PDF routes: reuse the cached result from the audit
 * that produced the report (same license key + URL, within 24 h) and do
 * NOT consume quota. Only when there is no cached result does this fall
 * back to runPaidAudit, which runs the audit and consumes one audit.
 * The license key is still validated and revocation/quota are still
 * checked before any cached result is used; the cache never grants access.
 */
export async function runPaidAuditCached(url: string, licenseKey: string): Promise<PaidAuditResult> {
  const check = isValidAuditUrl(url);
  if (!check.ok) return { ok: false, status: 400, error: check.error };
  const validation = await validateLicenseKey(licenseKey);
  if (!validation.valid) {
    return { ok: false, status: 401, error: validation.reason };
  }
  const keyHash = hashLicenseKey(licenseKey);
  const record: LicenseRecord | null = await entitlementStore.getByKeyHash(keyHash);
  if (!record) return runPaidAudit(url, licenseKey);
  if (record.revoked) {
    return { ok: false, status: 401, error: "That license key was revoked after a refund. Contact support if this is wrong." };
  }
  if (remainingAudits(record) <= 0) {
    return {
      ok: false,
      status: 402,
      error: `This license key has used all ${AUDITS_PER_MONTH} audits for this month. The quota resets on the 1st of next month.`,
    };
  }
  const cached = await getCachedAudit(keyHash, check.url);
  if (cached) {
    return {
      ok: true,
      result: cached,
      auditsUsed: record.auditsUsed,
      auditsRemaining: remainingAudits(record),
    };
  }
  return runPaidAudit(url, licenseKey);
}

// ---------------------------------------------------------------------------
// Teaser: the ONLY thing a free (unpaid) request ever receives.
// Server-enforced: the full result is never sent without a valid key.
// ---------------------------------------------------------------------------

export function teaserFor(result: AuditResult) {
  return {
    teaser: true,
    url: result.url,
    fetchedAt: result.fetchedAt,
    overallScore: result.overallScore,
    overallGrade: result.overallGrade,
    issues: result.issues.slice(0, 2),
    message:
      "This is a free preview: the overall score and the top 2 findings. The full report, including every finding and the ready-to-send proposal, needs a DealNote license ($49 one-time).",
  };
}

export async function POST(request: Request) {
  let body: { url?: string; licenseKey?: string };
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

  const licenseKey = typeof body.licenseKey === "string" ? body.licenseKey.trim() : "";

  // Paid path: valid key, quota remaining. Exempt from the IP limit.
  if (licenseKey) {
    const paid = await runPaidAudit(url, licenseKey);
    if (!paid.ok) {
      return NextResponse.json(
        { error: paid.error, ...(paid.sampleAvailable ? { sampleAvailable: true } : {}) },
        { status: paid.status },
      );
    }
    return NextResponse.json({
      ...paid.result,
      license: { auditsUsed: paid.auditsUsed, auditsRemaining: paid.auditsRemaining, auditsPerMonth: AUDITS_PER_MONTH },
    });
  }

  // Free path: 5 audits per IP per hour, teaser only.
  const ip = getClientIp(request);
  const limit = await checkFreeRateLimitAsync(ip);
  if (!limit.allowed) {
    const retryAfter = Math.max(1, Math.ceil((limit.resetAt - Date.now()) / 1000));
    return NextResponse.json(
      { error: "Free audits are limited to 5 per hour from one address. Try again later, or use a license key for the full report." },
      { status: 429, headers: { "Retry-After": String(retryAfter) } },
    );
  }

  const audited = await runFullAudit(url);
  if (!audited.ok) {
    // A failed audit (robots 403, fetch failure) must not burn one of
    // the 5 free audits: refund the count taken above.
    await refundFreeRateLimit(ip);
    return NextResponse.json(
      { error: audited.error, ...(audited.sampleAvailable ? { sampleAvailable: true } : {}) },
      { status: audited.status },
    );
  }
  return NextResponse.json(teaserFor(audited.result));
}
