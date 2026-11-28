// Loop 4 fix screenshots: all 6 pages, desktop 1280 + mobile 390, full page.
// Run: node /tmp/dnloop4/shot.mjs <baseUrl> <prefix>  (prefix e.g. loop4fix- or loop4fix-local-)
// Uses puppeteer-core (a DealNote dependency) + cached chrome-headless-shell.
import puppeteer from "puppeteer-core";

const base = process.argv[2];
const prefix = process.argv[3];
const pages = ["", "audit", "sample", "templates", "terms", "privacy"];
const widths = [
  { w: 1280, suffix: "1280" },
  { w: 390, suffix: "390" },
];

const browser = await puppeteer.launch({
  executablePath: "/home/hatch/.cache/puppeteer/chrome-headless-shell/linux-158.0.8127.88/chrome-headless-shell-linux64/chrome-headless-shell",
  args: ["--no-sandbox", "--disable-dev-shm-usage", "--proxy-server=http://127.0.0.1:8888", "--ignore-certificate-errors"],
  headless: true,
});

for (const p of pages) {
  for (const { w, suffix } of widths) {
    const page = await browser.newPage();
    await page.setViewport({ width: w, height: 900, deviceScaleFactor: 1 });
    await page.goto(`${base}/${p}`, { waitUntil: "networkidle0", timeout: 60000 });
    await new Promise((r) => setTimeout(r, 800));
    // Scroll through the page first so whileInView reveals (350ms each)
    // have fired before the full-page capture; otherwise below-fold
    // sections photograph at opacity 0.
    await page.evaluate(async () => { for (let y = 0; y <= document.body.scrollHeight; y += 450) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 120)); } window.scrollTo(0, 0); });
    await new Promise((r) => setTimeout(r, 900));
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    const name = p === "" ? "home" : p;
    await page.screenshot({ path: `/home/hatch/workspace/ship-or-die-100k/teardown-generator/docs/screenshots/${prefix}${name}-${suffix}.png`, fullPage: true });
    console.log(`${prefix}${name}-${suffix}.png overflow=${overflow}px`);
    await page.close();
  }
}
await browser.close();
console.log("done");
