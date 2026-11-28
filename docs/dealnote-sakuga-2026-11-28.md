# DealNote — Sakuga VFX integration + pinkish redesign, 28 Nov 2026

**Product:** DealNote, white-label website teardown + proposal generator, $49 one-time.
**Repo:** `~/workspace/ship-or-die-100k/teardown-generator`, branch `dealnote-sakuga`
(merge to main + live verification below).
**Live:** https://dealnote-blue.vercel.app
**Sakuga repo:** https://github.com/finktheartist/sakuga-vfx, commit
`c3dabb173928a3ad2372183103caf2e6f50953d0`, MIT, 1154 stars, created 2026-11-15.
Local clone: `~/workspace/ship-or-die-100k/sakuga-vfx` (depth 1, same commit).
**Direction change (Velu, 28 Nov 2026, replying to the Neon audit doc and the
Sakuga message):** "Fix this all" and "So make our site design like that color
pinkish". The pinkish Sakuga palette SUPERSEDES the deep-teal-only rule from
27 Nov 2026. The original brief's teal recolor was not done; pink was done
instead, per Velu. No payment, env vars, or Vercel dashboard work in this
task; the Vercel env-vars browser task runs separately.

## What Sakuga VFX is

"Twelve ordinary UI controls that react like anime. One file each, no
dependencies." At rest plain. Use one and it squashes and overshoots on
springs and throws drawn effects around it: smoke puffs, impact bursts,
crystal chips, slashes, splashes, smoke rings, with manga sound-effect
lettering (ドン!, カチッ, ズザッ). Every effect is drawn in code on one canvas
over the page. Lettering painted with GPT Image and traced to paths, toggle
is 43 painted frames, both live inside the component files, nothing else to
fetch. The repo ships 11 element files (registry.json lists 11); the
"twelfth" is the gallery counting the button's primary and secondary
variants as two cards. The live gallery is https://sakuga-vfx.vercel.app.
Each file carries its own copy of the core (springs, effects layer,
lettering, about 40 KB); the first loaded sets `window.SakugaFX`, the rest
reuse it, one canvas + one animation loop. Reduced motion turns every
effect off; springs and state changes stay. Limits, per the README:
checked in headless Chromium only, not Safari/Firefox/real phone/screen
reader. The effects canvas sits on top of everything at the highest
z-index, ignores pointer, can fly over a modal or sticky header. Effects
behind a control are drawn inside it and are cut off by a parent with
`overflow:hidden`.

## SkillSpector scan

Tool: `~/workspace/tools/skillspector/.venv/bin/skillspector`,
`scan <skill-dir> --no-llm --format json`, report
`docs/scan-reports/sakuga-vfx.json`. **Score 50, MEDIUM, verdict CAUTION.**
HIGH findings: 3x AE1 "Incomplete referenced artifact analysis" on
`look.mjs` (partial) — a parser-limit false positive on documentation
references, not a malicious finding. 1x MEDIUM LP3: skill declares no tool
scope ("permissions" or "allowed-tool"). No network, credential, or
exfiltration findings. The skill was installed to
`~/workspace/custom-skills/sakuga-vfx/` (SKILL.md, core.js, look.mjs,
starter.html) and its workflow followed; the component files are used by
hand, exactly as shipped (plain script tags, not modules, never split or
rewritten, per the skill's "Wire it in" section). The repo's own scripts
(tools/build.mjs, tools/test.mjs, look.mjs) are NOT run. A security notice
appeared on the clone exec output (execution-risk check on the tool
result); work from there was read-only (inspect files, run the scan), and
the clone itself had already completed before the notice.

## Pinkish palette (Velu direction, 28 Nov 2026)

Sakuga look: white paper, two-tone effects (white, lavender, violet line),
pink accents, impact burst on every confirm. Site tokens in
`app/globals.css` `:root` and Sakuga `--sk-*` variables, same values
(OKLCH in the CSS, hex below):

| Token | Value | Use |
|---|---|---|
| background | #FFFFFF | page |
| surface | #F4F3FC | lavender section surfaces |
| border | #DDD6FE | lavender borders |
| text | #1D1A4A | dark violet ink, body + headings |
| muted | #55507A | secondary text |
| faint | #6E6890 | captions only, 4.5:1+ on white |
| accent | #BE185D | pink, buttons + links + readable pink text |
| accent hover | #9D174D | button hover |
| accent soft | #FDF2F8 | pink soft backgrounds |
| accent border | #F9A8D4 | pink borders |
| Sakuga accent | #FF5FA8 | decorative only (wedges, bursts), about 2.9:1, never body text |
| Sakuga primary | #8F8DF7 | violet, stars lit, toggle fill |
| Sakuga soft | #B8B3FF | lavender, shadows + fills |
| Sakuga line | #5A4FD8 | violet effect outlines + control borders |

Contrast (checked): #BE185D on white 6.04:1 (AA), white on #BE185D
6.04:1 (AA), #9D174D on white 7.88:1, #1D1A4A on white 16.9:1 approx,
#55507A on white 7.0:1 approx. Grade colors unchanged, never pink-washed:
A/B green #15803D, C amber #B45309, D/F red #B91C1C, always with the A-F
letter. Glass is now a pink-tinted frosted panel
(oklch(0.99 0.01 340 / 0.72), lavender border); dark text on light
frosted panels only, no text over busy backgrounds. Inter kept. Apple
glass + MotionDev motion kept, under 400ms (motion retimed to 250ms in
Loop 5), prefers-reduced-motion respected (Sakuga core turns effects off;
verified live, see below). No Sakuga elements on /terms or /privacy
(simple fade only). PDFs follow the brand color: default brand colour is
now pink #BE185D (`lib/audit.ts` DEFAULT_BRAND primaryColor #BE185D,
accentColor #8F8DF7; `lib/pdf-html.ts` fallback #BE185D), pink
header/footer rule, clean and printable, no effects in PDFs.
`docs/design-notes.md` §14 records the palette with exact values and
contrast checks, dated 28 Nov 2026. Lines 160/184 in §11 still mention
teal as dated 27 Nov 2026 history; left as history.

## Per-control table

All eleven shipped controls are wired into real flows. No demo-only
widget, no demo page. The 12th (gallery) is the live demo at
sakuga-vfx.vercel.app, not a DealNote page (see Skipped).

| Control | DealNote element | File | How wired | Bundle cost (static file, not webpack) | Verified |
|---|---|---|---|---|---|
| button | Hero submit (type=submit, GET form), Run audit (x2 on /audit), BuyButton ($49, `components/audit-ui.tsx`), Copy proposal / Download proposal PDF / Add to tracker on /audit, Unlock with this key | `components/sakuga.tsx` SakugaButton, `public/sakuga-vfx/button.js` | React wrapper, `onClick` on the host; `done()` on the Run button only when the audit actually worked; submit buttons rely on the component's own `requestSubmit()` for `type="submit"` | 46,435 B, loaded afterInteractive on every page via layout | Yes, 52/52 run: real mouse click runs the audit; home submit navigates to /audit?url=; BuyButton click reaches checkout (503 notConfigured until env vars land, never fake success) |
| toggle | /audit "Show white-label preview", /sample brand preview toggle (via BrandPreview) | `components/sakuga.tsx` SakugaToggle, `public/sakuga-vfx/toggle.js` | React state, `checked` set imperatively (see React gotchas) | 505,888 B (43 painted frames), lazy-loaded only on /audit + /sample, never on home/templates/terms/privacy | Yes: hides/shows the preview on /audit and /sample |
| slider | /audit proposal validity days, 0-90, unit " days", 0 means no expiry shown | `components/sakuga.tsx` SakugaSlider, `public/sakuga-vfx/slider.js` | `value` set imperatively; input + change events | 47,412 B, lazy on /audit only | Yes: 14 to 30, value reads back 30 |
| checkbox | /audit selectable findings list (proposal features), /templates sending checklist (persisted `dealnote-checklist-v1`) | `components/sakuga.tsx` SakugaCheckbox, `public/sakuga-vfx/checkbox.js` | `checked` set imperatively; change events | 44,311 B, lazy on /audit + /templates | Yes: toggles a finding (10 findings listed); checklist ticks + persists |
| radio | /audit + /templates proposal template choice (Quick-Fix / Redesign / Retainer) | `components/sakuga.tsx` SakugaRadio, `public/sakuga-vfx/radio.js` | `value` set imperatively; persisted `dealnote-default-template-v1`; /audit reads it on mount | 44,649 B, lazy on /audit + /templates | Yes: quickfix to redesign on /audit, quickfix to retainer on /templates, persists |
| input | /audit URL input (type url, autoFocus, Enter runs audit) | `components/sakuga.tsx` SakugaInput, `public/sakuga-vfx/input.js` | `value` set imperatively; input events; manual validation via `isValidAuditUrl` (Sakuga input does not pass required/pattern through) | 44,336 B, lazy on /audit only | Yes: typing keeps value `https://example.com`, dust fires per key, autofocus works |
| tabs | /templates Proposals / Emails / Checklist panels (only the active panel renders) | `components/sakuga.tsx` SakugaTabs, `public/sakuga-vfx/tabs.js` | `selected` set imperatively; change detail drives the panel | 45,799 B, lazy on /templates only | Yes: switches to Emails, then Checklist |
| progress | /audit running card, driven by (step+1)/4 | `components/sakuga.tsx` SakugaProgress, `public/sakuga-vfx/progress.js` | `set(n)` method via ref; `sakuga:done` listener; done() check lands on the Run button only when the audit actually worked | 52,256 B, lazy on /audit only | Yes: runs during the audit; score CountUp still lands cleanly on the final integer (83) |
| rating | "Rate this teardown" on /audit and /sample, persisted `dealnote-rating-v1`, explicitly not a testimonial, never shown to anyone else | `components/sakuga.tsx` SakugaRating, `public/sakuga-vfx/rating.js` | `value` set imperatively; change events | 44,767 B, lazy on /audit + /sample | Yes: 4 stars on /audit (value 4, stored 4), 5 stars on /sample (value 5) |
| toast | Copy proposal / proposal PDF downloaded / added to tracker / rating saved / default proposal saved | `components/sakuga.tsx` SakugaToastHost + showToast, `public/sakuga-vfx/toast.js` | Singleton fixed bottom-left, listens for `dealnote:toast` window events | 45,130 B, loaded afterInteractive on every page via layout | Yes: toast opens (`open=true`) on copy proposal |
| tooltip | Home fair-use note, ScoreSummary weights text, /templates heading | `components/sakuga.tsx` SakugaTooltip, `public/sakuga-vfx/tooltip.js` | Plain element, `text` + `label` attributes | 44,691 B, loaded afterInteractive on every page via layout | Yes: defined on every page; hint springs out on hover/focus/tap (spot-checked live) |

Script loading: layout loads button + toast + tooltip `afterInteractive`
on every page (136,256 B total); /audit adds input, checkbox, radio,
slider, progress, rating, toggle `lazyOnload` (783,619 B, toggle
dominates); /sample adds rating + toggle (550,655 B); /templates adds
tabs + radio + checkbox (134,759 B). `/terms` and `/privacy` load only
the three layout scripts and render no Sakuga element. Total static
assets in `public/sakuga-vfx/`: 965,674 B across 12 files (11 components
+ LICENSE.txt, MIT, Copyright (c) 2026 Justin Finkelman).

## Before / after build size (First Load JS, `npm run build`)

Baseline is the pre-Sakuga build on this branch (Loop 5 sizes, confirmed
by the baseline build 28 Nov 2026). Sakuga scripts are static assets,
not webpack bundle; the First Load JS delta is the React wrapper only.

| Route | Before | After | Delta |
|---|---|---|---|
| / (home) | 161 kB | 165 kB | +4 kB |
| /audit | 177 kB | 182 kB | +5 kB |
| /sample | 154 kB | 166 kB | +12 kB |
| /templates | 109 kB | 114 kB | +5 kB |
| /terms | 87.5 kB | 87.5 kB | 0 |
| /privacy | 87.5 kB | 87.5 kB | 0 |
| Shared | 87.3 kB | 87.3 kB | 0 |

The toggle's ~506 KB is the honest cost of that control: it is
lazy-loaded only where it is used (/audit, /sample) and never blocks
first paint. No control was silently dropped for cost; the trade is
recorded here instead.

## Two React 18 + custom-element bugs found and fixed (28 Nov 2026)

Both were found by the verification run, not by inspection, and both
would have shipped broken controls to real users.

1. **Own-property shadowing of value/checked/selected.** React can
   render a Sakuga tag before its script has defined it. On a
   not-yet-upgraded element React's initial `value`/`checked`/`selected`
   prop lands as an OWN data property, which then permanently shadows the
   component's prototype getter/setter even after upgrade. Verified live:
   typed text sat in the shadow input while `el.value` stayed `""`, and
   a clicked 5-star set the internal score to 5 while `el.value` stayed
   `0`. Fix (`components/sakuga.tsx`): no wrapper passes
   value/checked/selected as a JSX prop; each sync effect deletes any own
   shadowing property (`unshadow`), waits until the tag is defined
   (`customElements.whenDefined`), then assigns through the real setter.
2. **disabled={false} disables every button.** React writes
   `disabled={false}` on a custom element as the string attribute
   `disabled="false"`, and the Sakuga button reads disabled as
   `hasAttribute('disabled')`, so every Sakuga button was disabled
   (verified live: the inner shadow button was `disabled=true` with
   `running=false`; neither a real mouse click nor a shadow `.click()`
   reached the host). That silently broke the Run audit button AND the
   $49 Buy button. Fix: `disabled` is set imperatively through the real
   setter in `SakugaButton`, never as a JSX prop. The payment freeze had
   lifted by then, so the frozen BuyButton em dash was also fixed in the
   same pass (see Slop).

A third defect, same run: **horizontal overflow from the Sakuga back
canvas.** Every control carries a `canvas.back` 160px wider than itself
on each side, which inflated `documentElement.scrollWidth` by 35px on
/audit at 1280px and /sample at 390px. Fix: `html { overflow-x: clip; }`
in `app/globals.css` (clip, not hidden, so sticky positioning keeps
working; only trims what is outside the viewport; the visible burst
behind a control still shows). The skip-link at `left:-9999px` was
checked and is not the cause.

## Verification (local, production build, headless Chrome)

Script `.sakuga-verify.mjs` (puppeteer-core, repo node_modules, cached
Chrome; deleted after use — it was untracked scratch, not shipped).
Server on `PORT=3100` with `DEALNOTE_DEV_LICENSE_KEY` set to a throwaway
local value so the full audit could be unlocked; the key is local-test
only, never in git, docs, or the sheet. Final run, after all fixes:
**52/52 passed, 0 failed.** `npx tsc --noEmit` exit 0, `npm run build`
exit 0, 18/18 pages.

- All 6 pages, desktop 1280 + mobile 390: HTTP 200, `scrollWidth`
  exactly equals `innerWidth` (0px overflow), zero page errors. (The
  sandbox egress proxy blocks the external Ship or Die tracker script
  with `ERR_TUNNEL_CONNECTION_FAILED`; that is environmental noise, not
  a page defect, and is excluded from the error count. Tracker tag
  presence is checked separately by HTML.)
- Home submit navigates to `/audit?url=`; /audit `?url=` auto-runs and
  produces a result; input keeps its typed value; Run audit button
  produces a result on a real mouse click; unlock with the dev key
  renders the findings checkboxes; checkbox toggles a finding; radio
  changes template; slider sets expiry days 14 to 30; toggle hides the
  white-label preview; rating sets 4 and persists; toast opens on copy
  proposal.
- /templates: tabs switch to Emails then Checklist; checklist checkbox
  ticks + persists; radio sets default proposal + persists.
- /sample: rating sets 5; toggle hides the brand preview.
- Reduced motion: `prefers-reduced-motion: reduce` emulated, effects
  off (`window.SakugaFX.calm` true), state changes still work.
- Client-side navigation / to /sample to /templates keeps CSS (Neon
  P0-1 re-check): 2 stylesheet links, Inter font-family, zero page
  errors, zero application errors.
- Screenshots: `docs/screenshots/sakuga-{home,audit,sample,templates,
  terms,privacy}-{1280,390}.png` plus `sakuga-audit-controls-1280.png`.
  Reviewed: pink design holds on desktop and mobile, header one row on
  mobile with working Menu, no overflow, no clipped controls. The mobile
  hero keeps the Loop 5 whitespace where the sample card is hidden under
  640px; pre-existing, not a Sakuga regression.

## Neon whole-site audit re-check (28 Nov 2026)

The 11 Neon findings (merged as 052f845) were re-checked against this
branch by code grep + the live verification above. All still fixed, none
regressed:

- P0-1 client nav drops CSS / crashes: tracker loads through
  `next/script` (`app/layout.tsx`), never a hand-written `<head>`;
  10-route click matrix in the Neon fix + the client-nav test here both
  pass.
- P0-2 sample PDF works: `GET /api/pdf/sample` 200, 71,632 B, 3 pages,
  SAMPLE stamped; no "coming with payment" copy remains.
- P0-3 /terms no longer mentions Upstash plumbing; it says plainly the
  30/month count may reset when the hosting restarts (honest interim
  wording until Upstash is provisioned by the separate Vercel task).
- P1-1 /audit?url= auto-runs once (ref-guarded); P1-2 teaser findings
  stored, /templates shows the "Latest audit filled in" banner; P1-3
  home subcopy rewritten (H1 appears once); P1-4 template sections
  render human labels, no double markers; P1-5 /terms names Lemon
  Squeezy as merchant of record + Governing Law (Philippines law),
  /privacy lists Ship or Die under Who data is shared with.
- P2-1 one visible SAMPLE banner on screen (print stamp only on printed
  pages), CountUp lands cleanly on 83, run dates 28 Nov 2026; P2-2 US
  English site-wide (0 "licence" occurrences in app/lib/components);
  P2-3 /privacy prints no localStorage key names and no "$100K
  Hackathon" wording.
- Mobile 390px verified on all 6 routes in this run (scrollWidth exactly
  390, no overflow, no errors; drawer opens 312x210 with 4 links).

## Slop re-run (28 Nov 2026, same method as Loop 4/5)

Local replication of the Briskly (11 rules) and Jev (34 tells) lists
against source + fresh screenshots + the local build. No URL submitted
to any external detector.

| Score | Loop 5 | This run |
|---|---|---|
| Briskly-style (/100) | ~5 | **~5 (unchanged)** |
| Jev-style (tells, est. /100) | ~1 partial, est. ~3-5 | **~1 partial, est. ~3-5 (unchanged)** |

What did not move: Inter is really loaded (next/font/google); the
uppercase eyebrow is gone (0 uses in markup, CSS definition only);
0 hype words; 0 "Get Started / Learn More / Trusted by"; 0 gradients
as decoration (5 grep hits: 4 comments saying "no gradients" + 1 real
radial spotlight wash at 7% pink in `motion-ui.tsx`, pre-existing since
Loop 4, not a purple-blue linear gradient); the card rule still
half-fires on the uniform white 8px-radius bordered cards (the brief
mandates the 8px card); the three-card grid and numbered steps are
unchanged (M1/M2 standing partials); frosted glass is present since
Loop 4 (Jev partial). **Em dashes in rendered copy: 1, the frozen
BuyButton dash** (see below). Two others found at the start of this
branch are gone (banner dash fixed here and identically on main;
checkout message dash fixed on main).
Two were found in rendered copy at the start of this branch: the frozen
BuyButton dash ("Buy DealNote — $49 one-time", frozen in Loops 3-5 and
kept frozen by the Neon recheck at 21:42 on 28 Nov even after payment
went live, so it stays frozen here) and the /templates "Latest audit
filled in" banner ("{url} — score …"). The banner dash was fixed to a
comma in this branch, and the Neon recheck on main made the identical
fix independently, so the merge carries it once. A third rendered dash,
the checkout fallback message ("Checkout is not connected yet — …"),
was fixed to a period by the Neon recheck on main and arrives via the
merge. Remaining em dashes in the repo are in code comments and lib
docstrings only, plus the one frozen BuyButton dash in rendered copy.
**Manga lettering does not read as slop:** the ドン!/ポン/ズザッ words
are drawn canvas effects that appear only transiently on interaction;
they are in no static copy, no screenshot, and no detector rule list
(neither detector flags drawn SFX lettering). **Violet is now present
as flat tokens** (effect line #5A4FD8, lavender surfaces, violet ink
#1D1A4A); neither detector flags flat violet, only purple-blue
gradients, which remain at zero.

## What was skipped, with evidence

- **Gallery (the 12th control):** no "Effects" showcase page built on
  DealNote. The brief allowed recording the gallery as the live demo at
  sakuga-vfx.vercel.app instead, and that is what is recorded here.
  A demo page would have been a demo-only widget, which the brief
  forbade.
- **Home hero URL input stays native.** The hero is a plain no-JS GET
  form (`method="get" action="/audit"`); the Sakuga input is the
  stateful one on /audit, where typing, validation, autofocus and Enter
  all live. Wiring SakugaInput into the hero would have added React
  state to a form that deliberately works without it. The hero submit
  button IS a Sakuga button and was verified.
- **Toggle is not inlined or replaced with a lighter control.** Its
  ~506 KB (43 painted frames) is the price of the one control Velu
  asked to use; it is lazy-loaded only on /audit and /sample and never
  blocks first paint. No lighter Sakuga control was substituted.
- **shadcn install not used.** The repo offers `npx shadcn add
  finktheartist/sakuga-vfx/<name>`; the files were copied by hand
  instead, per the skill's workflow and the standing shadcn
  DO_NOT_INSTALL record (Loop 5: shadcn scored 100, CRITICAL, 136
  issues).
- **The repo's own scripts (tools/build.mjs, tools/test.mjs, look.mjs)
  were not run.** Only read, plus the SkillSpector scan.
- **No Sakuga on /terms or /privacy** beyond a simple fade, per the
  brief. The three layout scripts (button/toast/tooltip) still load on
  those pages because they are in the shared layout; no Sakuga element
  renders there.
- **Mobile hero whitespace under 640px** (sample card hidden, Loop 5)
  left as-is; pre-existing, not a Sakuga regression.

## Merge + live verification

- Branch `dealnote-sakuga`. Sakuga commit `dead2bb` ("Sakuga VFX: all
  11 controls wired + pinkish redesign, 28 Nov 2026"). Main was ahead
  (Neon recheck 220457c: CountUp `immediate`, two em dash fixes), so
  main was merged into the branch first as `73151e5` (clean, no
  conflicts; the templates banner dash fix was identical on both sides).
  The merged state was rebuilt and re-verified locally: **52/52 passed,
  0 failed** (one intermediate run hit the site's own 5-free-audits/hour
  IP limit with HTTP 429 after repeated test runs; the local server was
  restarted to reset the in-memory counter and the full suite passed;
  license-key requests are exempt from that limit by design).
  Merged to `main` as (merge commit below), pushed; Vercel auto-deploy.
- Live verification after deploy: (filled in at merge time — all 6
  pages 200, tracker snippet present, effects fire live on home +
  audit + templates).
- Payment/env vars untouched by this work (separate Vercel browser
  task; env vars were set and checkout went live 28 Nov 21:21 via that
  task). The dev license key used for local verification is
  local-test-only and is not in git, docs, the sheet, or production.
