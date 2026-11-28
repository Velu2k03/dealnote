// Loop 4 screenshots: all 6 pages, desktop 1280 + mobile 390, full page.
// Run: node /tmp/dnloop4/shot.mjs <baseUrl> <prefix>  (prefix e.g. loop4- or loop4-local-)
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
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    const name = p === "" ? "home" : p;
    await page.screenshot({ path: `/home/hatch/workspace/ship-or-die-100k/teardown-generator/docs/screenshots/${prefix}${name}-${suffix}.png`, fullPage: true });
    console.log(`${prefix}${name}-${suffix}.png overflow=${overflow}px`);
    await page.close();
  }
}
await browser.close();
console.log("done");
