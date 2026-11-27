// DealNote audit types, scoring, and SAMPLE data.
// Brand-new code for DealNote. No code copied from any other product.
// Sample data is fictional only: invented business, invented address,
// invented phone number in the 555 range. Never a real business.

export type Severity = "Critical" | "Fix soon" | "Nice to have";

export type CategoryKey =
  | "speed"
  | "mobile"
  | "seo"
  | "technical"
  | "conversion"
  | "trust";

export interface CategoryMeta {
  key: CategoryKey;
  label: string;
  weight: number;
  icon: "gauge" | "smartphone" | "search" | "wrench" | "mouse-pointer-click" | "shield-check";
  description: string;
}

export const CATEGORIES: CategoryMeta[] = [
  { key: "speed", label: "Speed", weight: 20, icon: "gauge", description: "How fast the homepage loads and settles." },
  { key: "mobile", label: "Mobile", weight: 15, icon: "smartphone", description: "How the page works on a phone." },
  { key: "seo", label: "On-page SEO", weight: 20, icon: "search", description: "Title, meta description, headings, and page content." },
  { key: "technical", label: "Technical", weight: 15, icon: "wrench", description: "HTTPS, crawlability, sitemap, and links." },
  { key: "conversion", label: "Conversion", weight: 15, icon: "mouse-pointer-click", description: "Calls to action, contact details, and forms." },
  { key: "trust", label: "Trust, local and social", weight: 15, icon: "shield-check", description: "Business details, reviews, and social links on the page." },
];

export interface Issue {
  id: string;
  category: CategoryKey;
  severity: Severity;
  title: string;
  found: string;
  why: string;
  fix: string;
}

export interface CategoryScore {
  key: CategoryKey;
  score: number;
  grade: string;
}

export interface AuditResult {
  url: string;
  finalUrl: string;
  fetchedAt: string;
  status: number;
  https: boolean;
  loadMs: number;
  pageBytes: number;
  title: string;
  metaDescription: string;
  h1Count: number;
  imageCount: number;
  imagesMissingAlt: number;
  internalLinks: number;
  externalLinks: number;
  brokenLinks: { url: string; status: number | string }[];
  hasViewport: boolean;
  hasSchema: boolean;
  hasTel: boolean;
  hasMailto: boolean;
  hasForm: boolean;
  formFields: number;
  hasFavicon: boolean;
  hasCanonical: boolean;
  hasRobots: boolean | null;
  hasSitemap: boolean | null;
  overallScore: number;
  overallGrade: string;
  categories: CategoryScore[];
  issues: Issue[];
  couldNotCheck: string[];
  isSample: boolean;
}

export function gradeFor(score: number): string {
  if (score >= 90) return "A";
  if (score >= 80) return "B";
  if (score >= 70) return "C";
  if (score >= 60) return "D";
  return "F";
}

export function gradeColor(grade: string): string {
  if (grade === "A" || grade === "B") return "#15803D";
  if (grade === "C") return "#B45309";
  return "#B91C1C";
}

export function isValidAuditUrl(raw: string): { ok: true; url: string } | { ok: false; error: string } {
  let parsed: URL;
  try {
    parsed = new URL(raw.trim());
  } catch {
    return { ok: false, error: "Enter a full URL starting with https://" };
  }
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    return { ok: false, error: "Enter a full URL starting with https://" };
  }
  const host = parsed.hostname.toLowerCase();
  if (
    host === "localhost" ||
    host.endsWith(".localhost") ||
    host === "0.0.0.0" ||
    host.startsWith("127.") ||
    host.startsWith("10.") ||
    host.startsWith("192.168.") ||
    /^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(host) ||
    host === "[::1]" ||
    host.startsWith("::1")
  ) {
    return { ok: false, error: "That address is not a public website. Paste a public business website URL." };
  }
  return { ok: true, url: parsed.toString() };
}

// ---------------------------------------------------------------------------
// SAMPLE audit. Fictional business only. Used for the landing hero, the
// sample report page, and as the fallback when a live fetch fails.
// ---------------------------------------------------------------------------

export const SAMPLE_BUSINESS = {
  name: "Harbor & Pine Plumbing",
  city: "Santa Rosa",
  phone: "(555) 014-8820",
  address: "12 Harbor Lane, Santa Rosa, CA 95401",
  site: "https://www.harborandpine-plumbing.example",
};

export function sampleAudit(): AuditResult {
  const categories: CategoryScore[] = [
    { key: "speed", score: 74, grade: "C" },
    { key: "mobile", score: 81, grade: "B" },
    { key: "seo", score: 88, grade: "B" },
    { key: "technical", score: 79, grade: "C" },
    { key: "conversion", score: 86, grade: "B" },
    { key: "trust", score: 90, grade: "A" },
  ];
  const overall = Math.round(
    categories.reduce((sum, c) => {
      const meta = CATEGORIES.find((m) => m.key === c.key);
      return sum + c.score * ((meta ? meta.weight : 0) / 100);
    }, 0),
  );
  return {
    url: SAMPLE_BUSINESS.site,
    finalUrl: SAMPLE_BUSINESS.site,
    fetchedAt: "27 Nov 2026",
    status: 200,
    https: true,
    loadMs: 2840,
    pageBytes: 1840000,
    title: "Plumber in Santa Rosa | Harbor & Pine Plumbing",
    metaDescription: "Family plumbing company serving Santa Rosa since 2009. Call today for repairs, installs, and free estimates.",
    h1Count: 1,
    imageCount: 14,
    imagesMissingAlt: 6,
    internalLinks: 9,
    externalLinks: 4,
    brokenLinks: [{ url: "/services/drain-cleaning", status: 404 }],
    hasViewport: true,
    hasSchema: false,
    hasTel: true,
    hasMailto: false,
    hasForm: true,
    formFields: 8,
    hasFavicon: true,
    hasCanonical: true,
    hasRobots: true,
    hasSitemap: false,
    overallScore: overall,
    overallGrade: gradeFor(overall),
    categories,
    isSample: true,
    couldNotCheck: ["Field speed data for real visitors (no field data is shown for sample reports)."],
    issues: [
      {
        id: "s1",
        category: "speed",
        severity: "Fix soon",
        title: "Homepage loads slowly on a mobile connection",
        found: "Sample measurement: homepage took about 2.8 seconds to load, and the page is about 1.8 MB. The largest image is about 640 KB.",
        why: "Visitors on a phone leave slow pages before they read anything, so fewer of them call.",
        fix: "Compress the hero image below 200 KB and serve it in a modern format.",
      },
      {
        id: "s2",
        category: "technical",
        severity: "Critical",
        title: "One internal link returns a 404 error",
        found: "The link /services/drain-cleaning returns a 404 error.",
        why: "A visitor who taps a service link and lands on an error page is unlikely to try again.",
        fix: "Point the link at the correct service page or remove it from the menu.",
      },
      {
        id: "s3",
        category: "trust",
        severity: "Fix soon",
        title: "No LocalBusiness details on the page for search engines",
        found: "No LocalBusiness schema was found on the homepage. Name, address, phone, and hours are shown as plain text only.",
        why: "Search engines use that structured detail to show the business correctly in local results.",
        fix: "Add LocalBusiness schema with name, address, phone, and opening hours.",
      },
      {
        id: "s4",
        category: "seo",
        severity: "Fix soon",
        title: "6 of 14 images have no alt text",
        found: "6 images have missing or empty alt text, including 2 service photos.",
        why: "Search engines and screen readers cannot tell what those images show.",
        fix: "Write one short alt description per image, naming the service shown.",
      },
      {
        id: "s5",
        category: "conversion",
        severity: "Fix soon",
        title: "Contact form asks for too much up front",
        found: "The contact form has 8 fields, including full address before any reply.",
        why: "Long forms put people off, so fewer visitors send an enquiry.",
        fix: "Cut the form to name, phone, and message, and ask for the address later.",
      },
      {
        id: "s6",
        category: "technical",
        severity: "Nice to have",
        title: "No sitemap file found",
        found: "No sitemap.xml file was found at the usual address.",
        why: "A sitemap helps search engines find every page on the site.",
        fix: "Add a sitemap.xml and list it in robots.txt.",
      },
      {
        id: "s7",
        category: "mobile",
        severity: "Nice to have",
        title: "Tap-to-call link is present but small on mobile",
        found: "A tel: link is present, but the phone number in the header is small text, not a button.",
        why: "A clear call button is the fastest path from a mobile visit to a booked job.",
        fix: "Make the phone number a clear call button in the mobile header.",
      },
    ],
  };
}

export interface BrandProfile {
  brandName: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  website: string;
  primaryColor: string;
  accentColor: string;
  ctaText: string;
  ctaLink: string;
  introLine: string;
  /** Postal address, required for the CAN-SPAM footer on every email. */
  postalAddress: string;
  logoUrl?: string;
  logoDataUrl?: string;
}

export const DEFAULT_BRAND: BrandProfile = {
  brandName: "Your Studio",
  contactName: "Alex Rivera",
  contactEmail: "hello@yourstudio.example",
  contactPhone: "(555) 010-4471",
  website: "https://www.yourstudio.example",
  primaryColor: "#0F766E",
  accentColor: "#155E75",
  ctaText: "Book a free 15-minute call",
  ctaLink: "https://cal.com/yourstudio/intro",
  introLine: "I reviewed your website and found 7 quick wins.",
  postalAddress: "",
  logoUrl: "",
  logoDataUrl: "",
};

export interface ProposalItem {
  phase: string;
  title: string;
  detail: string;
}

export function proposalItemsFromIssues(issues: Issue[]): ProposalItem[] {
  const phaseFor = (category: CategoryKey): string => {
    if (category === "speed" || category === "seo" || category === "technical") return "Quick wins";
    if (category === "mobile" || category === "conversion") return "Redesign";
    return "Ongoing";
  };
  return issues.map((issue) => ({
    phase: phaseFor(issue.category),
    title: issue.title,
    detail: issue.fix,
  }));
}
