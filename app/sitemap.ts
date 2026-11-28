import type { MetadataRoute } from "next";

const BASE = "https://dealnote-blue.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/audit", "/sample", "/templates", "/terms", "/privacy"];
  return pages.map((path) => ({
    url: `${BASE}${path}`,
    lastModified: new Date("2026-11-28"),
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : 0.8,
  }));
}
