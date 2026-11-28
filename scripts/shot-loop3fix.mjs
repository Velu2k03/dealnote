// Loop 2 fix screenshots: all 6 pages, desktop 1280 + mobile 390, full page.
// Run: node scripts/shot-loop2fix.mjs [baseUrl]
// Uses puppeteer-core (a DealNote dependency) + cached chrome-headless-shell.
import puppeteer from "puppeteer-core";

const base = process.argv[2] ?? "http://127.0.0.1:3105";
const pages = ["", "audit", "sample", "templates", "terms", "privacy"];
const widths = [
  { w: 1280, suffix: "1280" },
  { w: 390, suffix: "390" },
];

const browser = await puppeteer.launch({
  executablePath: "/home/hatch/.cache/puppeteer/chrome-headless-shell/linux-158.0.8127.88/chrome-headless-shell-linux64/chrome-headless-shell",
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
  headless: true,
});

for (const p of pages) {
  for (const { w, suffix } of widths) {
    const page = await browser.newPage();
    await page.setViewport({ width: w, height: 900, deviceScaleFactor: 1 });
    await page.goto(`${base}/${p}`, { waitUntil: "networkidle0", timeout: 60000 });
    await new Promise((r) => setTimeout(r, 800));
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    const name = p === "" ? "home" : p;
    await page.screenshot({ path: `docs/screenshots/loop3fix-${name}-${suffix}.png`, fullPage: true });
    console.log(`loop3fix-${name}-${suffix}.png overflow=${overflow}px`);
    await page.close();
  }
}
await browser.close();
console.log("done");
