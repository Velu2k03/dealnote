// Loop 5 screenshots: prototype variants (?v=1..3) + all 6 pages, 1280 + 390.
// Scrolls through each page first so whileInView reveals settle, then shoots.
import { mkdirSync } from "node:fs";
import puppeteer from "puppeteer-core";

const BASE = process.env.BASE ?? "http://127.0.0.1:3105";
const OUT = "docs/screenshots";
mkdirSync(OUT, { recursive: true });
const CHROME = "/home/hatch/.cache/puppeteer/chrome-headless-shell/linux-158.0.8127.88/chrome-headless-shell-linux64/chrome-headless-shell";

const pages = [
  ["home", "/"],
  ["audit", "/audit"],
  ["sample", "/sample"],
  ["templates", "/templates"],
  ["terms", "/terms"],
  ["privacy", "/privacy"],
];

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ["--no-sandbox", "--disable-gpu", "--proxy-server=http://127.0.0.1:8888", "--ignore-certificate-errors"],
});
for (const [slug, path] of pages) {
  for (const width of [1280, 390]) {
    const page = await browser.newPage();
    await page.setViewport({ width, height: 900, deviceScaleFactor: 1 });
    await page.goto(BASE + path, { waitUntil: "domcontentloaded", timeout: 90000 });
    await new Promise((r) => setTimeout(r, 1200));
    await page.evaluate(async () => {
      await new Promise((resolve) => {
        let y = 0;
        const step = () => {
          y += 600;
          window.scrollTo(0, y);
          if (y < document.body.scrollHeight) setTimeout(step, 60);
          else resolve(null);
        };
        step();
      });
    });
    await page.evaluate(() => window.scrollTo(0, 0));
    await new Promise((r) => setTimeout(r, 700));
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    await page.screenshot({ path: `${OUT}/loop5-${slug}-${width}.png`, fullPage: true });
    console.log(`${slug} ${width}: overflow ${overflow}px`);
    await page.close();
  }
}
await browser.close();
console.log("done");
