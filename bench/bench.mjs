// Bench the pure audit analysis (no network): analyzePage over fixed
// HTML fixtures, repeated, so rust-anything can profile the hot function.
import { readFileSync } from "node:fs";
import { analyzePage } from "../lib/analyze.ts";

const fixtures = [
  { name: "example-com", html: readFileSync(new URL("./fixtures/example-com.html", import.meta.url), "utf8"), url: "https://example.com", loadMs: 120, robots: true, sitemap: false },
  { name: "wikipedia-org", html: readFileSync(new URL("./fixtures/wikipedia-org.html", import.meta.url), "utf8"), url: "https://www.wikipedia.org", loadMs: 800, robots: true, sitemap: true },
];

const ITERATIONS = Number(process.env.ITERATIONS ?? 200);
const started = Date.now();
let totalIssues = 0;
let totalScore = 0;
for (let i = 0; i < ITERATIONS; i++) {
  for (const f of fixtures) {
    const out = analyzePage({
      html: f.html,
      finalUrl: f.url,
      loadMs: f.loadMs,
      hasRobots: f.robots,
      hasSitemap: f.sitemap,
      brokenLinks: [],
    });
    totalIssues += out.issues.length;
    totalScore += out.overallScore;
  }
}
const elapsed = Date.now() - started;
console.log(`analyzePage x ${ITERATIONS * fixtures.length} runs in ${elapsed}ms (${(elapsed / (ITERATIONS * fixtures.length)).toFixed(2)}ms per run), totalIssues=${totalIssues}, totalScore=${totalScore}`);
