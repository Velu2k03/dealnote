// Logo audit: counts distinct fill/stroke colours and gradient usage in public/logo.svg.
// Usage: node scripts/logo-audit.mjs
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const dir = dirname(fileURLToPath(import.meta.url));
const svg = readFileSync(join(dir, "..", "public", "logo.svg"), "utf8");

const colours = new Set();
for (const m of svg.matchAll(/(?:fill|stroke)\s*=\s*"([^"]+)"/g)) {
  const v = m[1].trim().toLowerCase();
  if (v !== "none") colours.add(v);
}
for (const m of svg.matchAll(/#[0-9a-f]{3,8}/gi)) {
  colours.add(m[0].toLowerCase());
}

const gradients = (svg.match(/<lineargradient|<radialgradient|gradient/gi) || []).length;
const hasGradientAttr = /gradient/i.test(svg);

console.log(`Colours found (${colours.size}): ${[...colours].join(", ")}`);
console.log(`Gradient elements/refs: ${gradients}`);
console.log(`Max colours allowed: 2`);
console.log(`Gradients allowed: 0`);
const pass = colours.size <= 2 && !hasGradientAttr;
console.log(pass ? "LOGO AUDIT: PASS" : "LOGO AUDIT: FAIL");
process.exit(pass ? 0 : 1);
