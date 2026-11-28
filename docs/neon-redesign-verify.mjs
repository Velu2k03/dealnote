// Neon redesign verification (playwright-core): nav matrix, auto-run,
// templates banner, sample 83, redesign tokens, mobile 390 P2 check.
import { chromium } from "playwright-core";

const BASE = "http://127.0.0.1:3102";
const OUT = "/home/hatch/workspace/ship-or-die-100k/dealnote-neon-redesign-wt/docs/screenshots";
const EXE = "/home/hatch/.cache/ms-playwright/chromium-1255/chrome-linux64/chrome";

const results = [];
function rec(name, pass, detail) {
  results.push({ name, pass, detail });
  console.log(`${pass ? "PASS" : "FAIL"} ${name} :: ${detail}`);
}
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const browser = await chromium.launch({ executablePath: EXE, args: ["--no-sandbox"] });

async function newPage(w, h) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h } });
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push("pageerror: " + String(e.message).slice(0, 200)));
  page.on("requestfailed", (r) => {
    if (!r.url().includes("ship-or-die.com")) errors.push("requestfailed: " + r.url().slice(0, 120));
  });
  page.on("console", (m) => {
    if (m.type() === "error" && !m.text().startsWith("Failed to load resource")) errors.push("console: " + m.text().slice(0, 200));
  });
  return { ctx, page, errors };
}

async function styleState(page) {
  return page.evaluate(() => {
    const links = [...document.querySelectorAll('link[rel="stylesheet"]')].length;
    const cs = getComputedStyle(document.body);
    return {
      links,
      font: cs.fontFamily.slice(0, 60),
      bg: cs.backgroundColor,
      hasAppError: document.body.innerText.includes("Application error"),
    };
  });
}

// ---------- Desktop nav matrix ----------
{
  const { ctx, page, errors } = await newPage(1280, 800);
  await page.goto(BASE + "/", { waitUntil: "networkidle", timeout: 60000 });
  const seq = [
    { label: "Sample report", href: "/sample" },
    { label: "Terms", href: "/terms" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Proposal templates", href: "/templates" },
    { label: "Run an audit", href: "/audit" },
    { label: "DealNote", href: "/" },
  ];
  for (const step of seq) {
    const before = await styleState(page);
    const clicked = await page.evaluate((label) => {
      const a = [...document.querySelectorAll("header a, footer a, nav a")].find((el) =>
        el.textContent.trim().startsWith(label)
      );
      if (!a) return false;
      a.click();
      return true;
    }, step.label);
    await sleep(1800);
    const after = await styleState(page);
    const url = page.url();
    const expect = step.href === "/" ? BASE + "/" : BASE + step.href;
    const ok = clicked && url === expect && after.links >= 1 && !after.hasAppError && after.font.includes("Inter");
    rec(`nav -> ${step.href}`, ok, `clicked=${clicked} url=${url} links=${before.links}->${after.links} font=${after.font} bg=${after.bg} appError=${after.hasAppError}`);
  }
  rec("nav matrix page errors", errors.length === 0, errors.slice(0, 5).join(" | ") || "none");

  await page.goto(BASE + "/audit?url=https://example.com", { waitUntil: "networkidle", timeout: 60000 });
  await sleep(5000);
  const auto = await page.evaluate(() => {
    const t = document.body.innerText;
    return {
      has45: /45/.test(t),
      hasMeta: t.includes("Meta description is missing"),
      hasPhone: t.includes("No phone number visible"),
      hasNoAuditYet: t.includes("No audit yet"),
    };
  });
  rec("P1-1 auto-run /audit?url=example.com", auto.has45 && auto.hasMeta && auto.hasPhone && !auto.hasNoAuditYet, JSON.stringify(auto));

  await page.goto(BASE + "/templates", { waitUntil: "networkidle", timeout: 60000 });
  await sleep(1200);
  const tpl = await page.evaluate(() => {
    const t = document.body.innerText;
    return {
      banner: t.includes("Latest audit filled in"),
      example: t.includes("example.com"),
      rawKeys: /cover, found, fix/.test(t) || t.includes("investment, nextstep"),
    };
  });
  rec("P1-2 templates banner after teaser", tpl.banner && tpl.example && !tpl.rawKeys, JSON.stringify(tpl));

  await page.goto(BASE + "/sample", { waitUntil: "networkidle", timeout: 60000 });
  await sleep(2500);
  const smp = await page.evaluate(() => {
    const stamps = [...document.querySelectorAll(".sample-stamp")].filter((el) => el.offsetParent !== null).length;
    const t = document.body.innerText;
    const m = t.match(/(\d+)\s*\/\s*100/);
    return {
      visibleStamps: stamps,
      scoreShown: m ? m[1] : null,
      hasDownload: t.includes("Download sample report as PDF"),
      hasHarborStudio: t.includes("Harbor & Pine Digital"),
      hasMaya: t.includes("Maya Lin"),
      hasPlaceholder: /\[Your studio\]|\[Your name\]|\[your email\]/.test(t),
    };
  });
  rec("P2-1 sample banner + score 83 + Harbor brand", smp.visibleStamps === 1 && smp.scoreShown === "83" && smp.hasDownload && smp.hasHarborStudio && smp.hasMaya && !smp.hasPlaceholder, JSON.stringify(smp));

  const copy = await page.evaluate(async () => {
    const out = {};
    for (const p of ["/", "/audit", "/sample", "/templates", "/terms", "/privacy"]) {
      const r = await fetch(p);
      const html = await r.text();
      out[p] = {
        comingWithPayment: /coming with payment/i.test(html),
        uk: /enquiry|honoured|enquire/i.test(html.replace(/<script[\s\S]*?<\/script>/g, "")),
        teal: /#0F766E|#0D9488|#14B8A6|#F8FAFC/i.test(html),
      };
    }
    return out;
  });
  const copyOk = Object.values(copy).every((c) => !c.comingWithPayment && !c.uk && !c.teal);
  rec("no 'coming with payment', no UK spelling, no teal (all 6 pages)", copyOk, JSON.stringify(copy));

  // Redesign tokens on home: H1 size, primary button color, hero pill nowrap
  const home = await page.goto(BASE + "/", { waitUntil: "networkidle", timeout: 60000 });
  await sleep(1200);
  const tokens = await page.evaluate(() => {
    const h1 = document.querySelector("h1");
    const h1Size = h1 ? getComputedStyle(h1).fontSize : null;
    const form = document.querySelector('form[action="/audit"]');
    const formWrap = form ? getComputedStyle(form).flexWrap : null;
    const sampleLink = [...document.querySelectorAll("a")].find((a) => a.textContent.trim() === "See a sample report");
    const pricing = document.querySelector(".pricing-grid");
    const pricingCols = pricing ? getComputedStyle(pricing).gridTemplateColumns.split(" ").length : 0;
    const btn = document.querySelector(".btn-primary") || document.querySelector("sakuga-button");
    return { h1Size, formWrap, sampleLinkIsBtn: sampleLink ? sampleLink.className.includes("btn") : null, pricingCols };
  });
  rec("redesign tokens home (H1 44px, pill nowrap, sample link not a button, pricing 2-col)", tokens.h1Size === "44px" && tokens.formWrap === "nowrap" && tokens.sampleLinkIsBtn === false && tokens.pricingCols === 2, JSON.stringify(tokens));

  // Templates: step bar 3-col, proposal grid 2-col
  await page.goto(BASE + "/templates", { waitUntil: "networkidle", timeout: 60000 });
  await sleep(1200);
  const tplGrid = await page.evaluate(() => {
    const steps = document.querySelector(".template-steps");
    const grid = document.querySelector(".template-grid");
    return {
      stepCols: steps ? getComputedStyle(steps).gridTemplateColumns.split(" ").length : 0,
      gridCols: grid ? getComputedStyle(grid).gridTemplateColumns.split(" ").length : 0,
    };
  });
  rec("templates step bar 3-col + cards 2-col", tplGrid.stepCols === 3 && tplGrid.gridCols === 2, JSON.stringify(tplGrid));

  // Logo upload styled button on /sample
  await page.goto(BASE + "/sample", { waitUntil: "networkidle", timeout: 60000 });
  await sleep(1500);
  const logo = await page.evaluate(() => {
    const labels = [...document.querySelectorAll("label")].filter((l) => l.textContent.includes("Upload logo"));
    // A 1x1 opacity-0 input still has an offsetParent; visible means it
    // actually paints: non-trivial rect and opacity above zero.
    const nativeVisible = [...document.querySelectorAll('input[type="file"]')].filter((i) => {
      const r = i.getBoundingClientRect();
      return r.width > 4 && r.height > 4 && Number(getComputedStyle(i).opacity) > 0;
    }).length;
    return { labels: labels.length, nativeVisible };
  });
  rec("logo upload styled label, no native Choose File visible", logo.labels >= 1 && logo.nativeVisible === 0, JSON.stringify(logo));
  await ctx.close();
}

// ---------- Screenshots desktop + mobile, overflow, P2 mobile check ----------
for (const [w, h, tag] of [[1280, 800, "1280"], [390, 844, "390"]]) {
  const { ctx, page, errors } = await newPage(w, h);
  for (const p of ["/", "/audit", "/sample", "/templates", "/terms", "/privacy"]) {
    await page.goto(BASE + p, { waitUntil: "networkidle", timeout: 60000 });
    await sleep(1200);
    const sw = await page.evaluate(() => document.documentElement.scrollWidth);
    const name = p === "/" ? "home" : p.slice(1);
    await page.screenshot({ path: `${OUT}/neon-redesign-${name}-${tag}.png` });
    rec(`overflow ${p} @${tag}`, sw <= w, `scrollWidth=${sw} viewport=${w}`);
  }
  rec(`page errors @${tag}`, errors.length === 0, errors.slice(0, 5).join(" | ") || "none");
  if (tag === "390") {
    // P2-3: mobile 390 check — score card readable above the fold on /audit
    await page.goto(BASE + "/audit?url=https://example.com", { waitUntil: "networkidle", timeout: 60000 });
    await sleep(5000);
    const mob = await page.evaluate(() => {
      const t = document.body.innerText;
      const m = t.match(/(\d+)\s*\/\s*100/);
      const scoreEl = [...document.querySelectorAll("*")].find((el) => el.children.length === 0 && /^\d+$/.test(el.textContent.trim()) && el.textContent.trim() === (m ? m[1] : ""));
      const rect = scoreEl ? scoreEl.getBoundingClientRect() : null;
      return { scoreShown: m ? m[1] : null, scoreTop: rect ? Math.round(rect.top) : null, viewportH: window.innerHeight };
    });
    rec("P2-3 mobile 390: 45/100 readable above fold", mob.scoreShown === "45" && mob.scoreTop !== null && mob.scoreTop < mob.viewportH, JSON.stringify(mob));
    await page.goto(BASE + "/", { waitUntil: "networkidle", timeout: 60000 });
    await sleep(800);
    const drawer = await page.evaluate(() => {
      const btn = [...document.querySelectorAll("button")].find((b) => /menu/i.test(b.textContent));
      if (!btn) return { btn: false };
      btn.click();
      return { btn: true };
    });
    await sleep(800);
    const open = await page.evaluate(() => ({
      visibleLinks: [...document.querySelectorAll("header a, nav a")].filter((a) => a.offsetParent !== null).length,
    }));
    rec("mobile drawer opens", drawer.btn && open.visibleLinks >= 4, JSON.stringify({ ...drawer, ...open }));
  }
  await ctx.close();
}

await browser.close();
const fails = results.filter((r) => !r.pass);
console.log(`\nTOTAL ${results.length} checks, ${fails.length} FAIL`);
if (fails.length) process.exitCode = 1;
