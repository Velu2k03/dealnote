// Loop 4 fix verification: header geometry at 1280 + 390, mobile menu
// open/close, wordmark clickability, score count-up, print stamp.
// Run: node scripts/verify-loop4fix.mjs http://127.0.0.1:3105
import puppeteer from "puppeteer-core";

const base = process.argv[2];
const out = "/home/hatch/workspace/ship-or-die-100k/teardown-generator/docs/screenshots";
const browser = await puppeteer.launch({
  executablePath: "/home/hatch/.cache/puppeteer/chrome-headless-shell/linux-158.0.8127.88/chrome-headless-shell-linux64/chrome-headless-shell",
  args: ["--no-sandbox", "--disable-dev-shm-usage", "--proxy-server=http://127.0.0.1:8888", "--ignore-certificate-errors"],
  headless: true,
});

async function headerProbe(width) {
  const page = await browser.newPage();
  await page.setViewport({ width, height: 900, deviceScaleFactor: 1 });
  await page.goto(`${base}/`, { waitUntil: "networkidle0", timeout: 60000 });
  await new Promise((r) => setTimeout(r, 1200));
  const m = await page.evaluate(() => {
    const menu = document.querySelector("#site-menu");
    const desktop = document.querySelector(".site-menu-desktop");
    const wordmark = document.querySelector(".wordmark");
    const cs = menu ? getComputedStyle(menu) : null;
    const rect = (el) => el ? (() => { const r = el.getBoundingClientRect(); return { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) }; })() : null;
    const elAtWordmark = (() => { const r = wordmark.getBoundingClientRect(); const el = document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2); return el ? (el.closest("a")?.className || el.tagName) : "none"; })();
    return {
      menuDisplay: cs?.display, menuPosition: cs?.position, menuBorder: cs?.borderTopWidth + " " + cs?.borderTopStyle,
      popoverOpen: menu ? menu.matches(":popover-open") : null,
      menuRect: rect(menu), desktopRect: rect(desktop), wordmarkRect: rect(wordmark),
      desktopDisplay: desktop ? getComputedStyle(desktop).display : null,
      headerHeight: document.querySelector(".site-header")?.getBoundingClientRect().height,
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      elementAtWordmarkCenter: elAtWordmark,
      scoreText: document.querySelector(".tabular")?.textContent ?? null,
    };
  });
  console.log(`header ${width}:`, JSON.stringify(m));
  await page.screenshot({ path: `${out}/loop4fix-header-${width}.png` });
  if (width === 390) {
    await page.click(".menu-button");
    await new Promise((r) => setTimeout(r, 400));
    const open = await page.evaluate(() => {
      const menu = document.querySelector("#site-menu");
      return { open: menu.matches(":popover-open"), display: getComputedStyle(menu).display };
    });
    console.log("menu 390 after click:", JSON.stringify(open));
    await page.screenshot({ path: `${out}/loop4fix-menu-open-390.png` });
    await page.keyboard.press("Escape");
    await new Promise((r) => setTimeout(r, 300));
    const closed = await page.evaluate(() => document.querySelector("#site-menu").matches(":popover-open"));
    console.log("menu 390 after Escape, open =", closed);
  }
  if (width === 1280) {
    // wordmark click navigates home (click at its centre)
    await page.goto(`${base}/sample`, { waitUntil: "networkidle0" });
    await new Promise((r) => setTimeout(r, 600));
    await page.click(".wordmark");
    await new Promise((r) => setTimeout(r, 800));
    console.log("wordmark click from /sample landed on:", page.url());
  }
  await page.close();
}

await headerProbe(1280);
await headerProbe(390);

// Print stamp: render /sample to PDF, check SAMPLE on every page.
const page = await browser.newPage();
await page.setViewport({ width: 1280, height: 900 });
await page.goto(`${base}/sample`, { waitUntil: "networkidle0", timeout: 60000 });
await new Promise((r) => setTimeout(r, 1000));
await page.emulateMediaType("print");
await page.pdf({ path: "/tmp/dnloop4fix/sample-print.pdf", format: "A4", printBackground: true });
await page.close();
await browser.close();
console.log("done");
