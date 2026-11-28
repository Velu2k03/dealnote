// Baseline + verification audit for the footer/sections fix.
// Serves the local production build on 127.0.0.1:3105 (started separately).
const { chromium } = require("/home/hatch/workspace/skills/ext-career-ops/node_modules/playwright");
const fs = require("fs");
const path = require("path");
const BASE = "http://127.0.0.1:3105";
const OUT = path.join(__dirname, "screenshots");
fs.mkdirSync(OUT, { recursive: true });
const ROUTES = [
  ["home", "/"],
  ["audit", "/audit?url=https://example.com"],
  ["sample", "/sample"],
  ["templates", "/templates"],
  ["terms", "/terms"],
  ["privacy", "/privacy"],
];
const PERSONAL = ["Velu", "Murugan", "DrVelu", "Santa Rosa City", "Laguna", "Philippines", "Last updated"];
(async () => {
  const browser = await chromium.launch({ executablePath: "/home/hatch/.cache/ms-playwright/chromium-1255/chrome-linux64/chrome", args: ["--no-sandbox"] });
  const results = [];
  for (const [w, h] of [[390, 844], [1280, 900]]) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h } });
    const page = await ctx.newPage();
    const errors = [];
    page.on("pageerror", (e) => errors.push(String(e)));
    for (const [name, route] of ROUTES) {
      await page.goto(BASE + route, { waitUntil: "networkidle", timeout: 30000 }).catch(() => {});
      await page.waitForTimeout(800);
      const m = await page.evaluate(() => {
        const de = document.documentElement;
        const footer = document.querySelector("footer");
        const bodyText = document.body.innerText || "";
        return {
          scrollWidth: de.scrollWidth, clientWidth: de.clientWidth,
          footerText: footer ? footer.innerText : "(no footer)",
          footerLinks: footer ? [...footer.querySelectorAll("a")].map((a) => a.textContent.trim()) : [],
          bodyLen: bodyText.length,
        };
      });
      const personal = PERSONAL.filter((p) => m.footerText.includes(p));
      try { await page.screenshot({ path: path.join(OUT, `footer-fix-${name}-${w}.png`) }); } catch (e) { console.log(`shot fail ${w} ${name}: ${String(e).split("\n")[0]}`); }
      results.push({ w, name, route, overflow: m.scrollWidth - m.clientWidth, errors: errors.length, footerLinks: m.footerLinks, personalInFooter: PERSONAL.filter((p) => m.footerText.includes(p)) });
      console.log(`${w} ${name}: overflow=${m.scrollWidth - m.clientWidth} errors=${errors.length} personalFooter=${JSON.stringify(results[results.length - 1].personalInFooter)} links=${JSON.stringify(m.footerLinks)}`);
    }
    await ctx.close();
  }
  // footer geometry at 390: link rows, group headings
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await ctx.newPage();
  await page.goto(BASE + "/", { waitUntil: "networkidle" });
  const geo = await page.evaluate(() => {
    const f = document.querySelector("footer");
    if (!f) return null;
    const r = f.getBoundingClientRect();
    const links = [...f.querySelectorAll("a")].map((a) => { const b = a.getBoundingClientRect(); return { t: a.textContent.trim(), x: Math.round(b.x), y: Math.round(b.y), w: Math.round(b.width) }; });
    return { footerTop: Math.round(r.top + window.scrollY), links };
  });
  console.log("FOOTER-GEO-390", JSON.stringify(geo));
  await browser.close();
  const fails = results.filter((r) => r.overflow !== 0 || r.errors !== 0 || r.personalInFooter.length > 0);
  console.log(`SUMMARY ${results.length - fails.length}/${results.length} clean; fails=${JSON.stringify(fails.map((f) => [f.w, f.name, f.overflow, f.errors, f.personalInFooter]))}`);
})();
