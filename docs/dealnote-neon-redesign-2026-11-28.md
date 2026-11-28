# DealNote — Neon PDF and site redesign, 28 Nov 2026

Velu ordered the redesign; Neon (Gemini 4 Neon, Task mode) is the guide.
Neon re-check verdict: **SHIP**, 9.0/10 on Design, Tap Flow, Trust, Legal,
Copy/Slop, Mobile 390px Unverified. 11-point matrix 10 PASS, 1 PARTIAL.
Live free audit example.com 45/100 F, 2 findings, score above the fold.
Chat: https://gemini.google.com/app/4b48280eb43a59f2, now titled
"DealNote PDF and site redesign - 28 Nov 2026".

Base: main 8327191 (Sakuga live on main, merge 6cd422e, 52/52 local
verification). Sakuga was NOT re-implemented or overwritten; the redesign
applies Neon's spec on top of the live Sakuga pink palette and controls.
Neon's note that live pages were still teal was out of date, the pink
(#BE185D) was already live. Payment code, env vars, Lemon Squeezy, and
the Vercel dashboard were NOT touched. Test-mode Preview branch
(dealnote-test-mode) was NOT touched.

## The Neon spec (summary)

PDFs, Sample 3p, Teardown 4p, Proposal 5p: US Letter 8.5x11, margins 44pt,
Inter 400/500/600/700, tabular-nums on scores/dates/prices. Title 22pt Bold
#111827, H2 13pt Bold with 1pt #E9D5FF bottom rule, H3 10.5pt SemiBold,
body 9.5pt #374151 line-height 1.45, micro 8pt #4B5563, hero score 40pt
Bold. White paper only #FFFFFF, ink #111827, body #374151, muted #4B5563.
Studio accent #BE185D only for 3pt top cover rule, section label accents,
callout left-border 2.5pt. Tinted bands only #FAF5FF with 0.75pt #DDD6FE
border. Grade colors fixed, never overridden by brand: A/B #15803D / tint
#F0FDF4, C #B45309 / text #92400E / tint #FFFBEB, D/F #B91C1C / tint
#FEF2F2. ZERO effects in PDFs: no backdrop-filter, glass blur, box-shadows,
gradients, Sakuga glow, dark-mode blending, no #EC4899 or #A78BFA text.
Running header every page: studio logo + name left, document type + domain
+ run date right, SAMPLE pill on sample PDF. Footer every page:
"Prepared by {Studio} · {Contact} · {Email}" left, "Page X of Y" right,
lab disclaimer micro line on page 1 and final page only. Score Hero Block
page 1: 48x48 grade badge, 83/100 or 45/100, status label, 6-row area table
with 6pt bars. Findings as structured blocks with header bar, Found / Why
it matters / Fix rows, break-inside avoid. Exact page blueprints per PDF
in the Neon spec, followed.

Harbor and Pine fictional brand, used exactly: audited business Harbor and
Pine Plumbing, 12 Harbor Lane, Santa Rosa, CA 95401, (555) 014-8820,
https://www.harborandpine-plumbing.example. Studio: Harbor and Pine
Digital, contact Maya Lin, maya@harborandpine-digital.example,
(555) 019-4410, Santa Rosa, CA, accent #BE185D. Sample PDF header
"Harbor & Pine Digital [SAMPLE]", notice strip "SAMPLE REPORT — Fictional
business (Harbor & Pine Plumbing) and fictional studio (Harbor & Pine
Digital). All data is invented for demonstration.", footer "Prepared by
Harbor & Pine Digital (Sample) · maya@harborandpine-digital.example",
disclaimer "Sample data for demonstration only. Real audits reflect public
homepage lab measurements on the run date and are not Lighthouse,
PageSpeed, or search-ranking scores." This fixes the [YOUR STUDIO] /
[Your studio] / [Your name] defect.

Site colors, all teal #0F766E / #0D9488 / #14B8A6 / #F8FAFC replaced with:
bg paper #FFFFFF, lavender soft #FAF5FF, lavender surface #F5ECFF, blush
tint #FDF2F8, border violet subtle #E9D5FF, border violet line #C4B5FD,
border focus #7C3AED, accent pink primary #DB2777 (CTA fill, 4.60:1
white), accent pink text #BE185D (6.04:1), accent pink hover #9D174D,
sakuga glow #EC4899 graphics only never text, ink primary #181024, ink
secondary #4A3B5C, ink muted #6B5B7E. Grade colors as above.

Layout: app pages max-w 1120px mx-auto px-6 / px-4 mobile, legal and
single-column cards max-w 760px centered, section py-16 desktop py-10
mobile, card gap-6. Typography: H1 44px Bold line-height 1.1 tracking
-0.025em (mobile 32px), H2 28px, H3 18px SemiBold, body 15-16px
line-height 1.6 max-w 65ch, eyebrows 12px SemiBold uppercase tracking
0.06em #BE185D. Cards: bg-white border #E9D5FF rounded-2xl p-6, hero
scorecard and sticky header only glass bg-white/80 backdrop-blur-md
border #E9D5FF/80, hover border #C4B5FD. Buttons 44-48px tap targets:
primary h-12 px-5 rounded-xl bg #DB2777 hover #9D174D white text 15px
SemiBold, secondary white hover #FDF2F8 text #BE185D border, ghost text
#BE185D hover #9D174D underline. Inputs h-12 px-4 rounded-xl bg-white
border #C4B5FD text #181024 placeholder #6B5B7E, focus 2px #7C3AED ring.
Logo upload on /sample: styled h-12 button-label "Upload logo
(PNG/SVG)", no native Choose File. Tap flow: keep 2-action home to
audit, hero URL input + Run a free audit in a single flex-nowrap pill/bar,
"See a sample report" as compact inline text link below. /sample: drop or
fix the count-up so 67/100 never flashes beside a green B, instant 83/100
B. /templates: 3-column horizontal step bar, unified border #E9D5FF
rounded-2xl cards in 2-column grid for both 8 proposals and 8 emails.
/terms and /privacy: mt-8 / mb-10 breathing room below Summary box,
centered max-w 760px, #BE185D links. Home: 2-column pricing card,
centered max-w 760px FAQ, truncate sample URL to 1 line. Keep: Inter,
grade colors + A-F badge, sticky single-row top bar + 4-link nav, white
cards + restrained motion, anti-hype copy, SAMPLE stamps, CAN-SPAM and
no-cold-SMS labels. Remove: all teal, sample count-up mismatch, native
Choose File, flat unbordered proposal list, any glass/blur/gradient
inside PDFs.

## The 3 P2s from Neon's second verdict (all fixed)

1. Two leftover UK spellings: "enquiry" on /sample, "honoured" on /terms.
   Fixed to inquiry, honored. A third was found during verification:
   "enquire" in a real audit finding (lib/analyze.ts, "have no way to
   enquire") also fixed to inquire. Zero UK spellings remain in rendered
   copy or code comments (grep verified).
2. /terms still mentions hosting restarts resetting usage counts. Kept
   honest for now: the counter is still in-memory, so the wording stays.
   Swap to "Usage counts reset on a rolling monthly basis per license key"
   only when durable storage is live. Upstash NOT provisioned, no paid
   plan picked.
3. Manual 390px mobile check still unverified. Verified in Playwright
   Chromium 390x844 on all 6 routes: scrollWidth exactly 390, 0px
   overflow, mobile drawer opens with 11 visible links, and the /audit
   45/100 score reads at top 136px (above the fold). Fix used: on mobile
   only, when a result exists, the score card moves above the URL form
   (visual order only via flex order, DOM unchanged).

## What was cut off in Neon's answer and how it was filled in

Neon's spec text cut off at card shadow, primary button shadow, secondary
border color, and proposal PDF pages 3 and 5. Filled in with values
consistent with the spec, recorded here:
- Card shadow: the existing subtle shadow, 0 1px 2px rgba(24,16,36,0.06).
- Primary button shadow: none, flat #DB2777 (zero-effects direction).
- Secondary border color: #E9D5FF.
- Proposal PDF pages 3 and 5: p1 cover/hero/intro, p2 what we found, p3
  what we would fix, p4 investment + scope/timeline, p5 about/terms/next
  step. Only the "What we found" section forces a page break; the rest
  flows, so a real 5-finding audit still lands on 5 pages (first attempt
  with forced breaks gave 7 pages, then 6; removing the extra breaks and
  tightening spacing gave 5).

## Before / after

| Item | Before | After |
| --- | --- | --- |
| Sample PDF | 76,635 B, 3p, A4, header "[YOUR STUDIO]", footer "[Your studio]" | 93,337 B, 3p, US Letter, Harbor & Pine Digital, Maya Lin, SAMPLE pill + notice strip, running header/footer |
| Teardown PDF (dev key) | 82,536 B, 4p, A4 | 96,780 B, 4p, US Letter, hero block, structured findings, running header/footer |
| Proposal PDF (dev key) | 99,139 B, 5p, A4 | 128,314 B, 5p, US Letter, hero block, section labels, running header/footer |
| Site tokens | OKLCH pinkish, teal remnants #F8FAFC, #475569 text | Neon hex palette, 0 teal, ink #181024 / secondary #4A3B5C / muted #6B5B7E |
| H1 | 36px | 44px Bold, -0.025em (32px mobile) |
| Buttons | #BE185D fill, 8px radius, 44px | #DB2777 fill, 12px radius, 48px |
| Cards | 8px radius | 16px radius, hover border #C4B5FD |
| Home hero | form wraps, "See a sample report" button | flex-nowrap pill, inline text link |
| Pricing | single column, max-w 560 | 2-column card (price + checklist) |
| Templates | vertical step rows, flat proposal list | 3-col step bar, 2-col bordered cards |
| /terms, /privacy | #F8FAFC summary, 720px reading | #FAF5FF summary, 760px, mt-8/mb-10 |
| Mobile /audit | score at 1175px (below fold) | score at 136px (above fold) |
| Build First Load JS | home 165 kB, /audit 182 kB, /sample 167 kB, /templates 114 kB | home 165 kB, /audit 182 kB, /sample 167 kB, /templates 114 kB (unchanged) |

## Verification evidence

- `tsc --noEmit` exit 0, `npm run build` clean, 18/18 pages (19/19 incl. _not-found).
- Local production build on 127.0.0.1:3102 with
  `DEALNOTE_DEV_LICENSE_KEY=LOCAL-TEST-DEV-KEY-ONLY` (local only, never
  shipped): home 200, audit POST example.com 200, 45/F, 2 findings.
- PDFs regenerated with the dev key (real BrandProfile fields are
  `brandName`, `contactName`, `contactEmail`): Sample 200, 93,337 B, 3p,
  Letter; Teardown 200, 96,780 B, 4p, Letter; Proposal 200, 128,314 B,
  5p, Letter. Zero "[YOUR STUDIO]" / "[Your studio]" / "[Your name]" /
  "[your email]" in any PDF. Zero "enquiry" / "enquire" / "honoured" in
  any PDF. Test PDFs kept at /tmp/neon-sample.pdf, /tmp/neon-teardown.pdf,
  /tmp/neon-proposal.pdf.
- Playwright Chromium 1255, production build, script
  `docs/neon-redesign-verify.mjs`: **30 checks, 0 fail** — 6/6 nav
  transitions (1 stylesheet, Inter, white bg, zero app errors), auto-run,
  templates banner, sample 83 + Harbor brand, no "coming with payment" /
  no UK spelling / no teal on all 6 pages, H1 44px + pill nowrap + pricing
  2-col, templates 3-col step bar + 2-col cards, logo upload styled label
  with no native file input painting, 12/12 overflow checks (1280 and
  390), 0 page errors at both widths, mobile drawer, P2-3 mobile score
  above fold. Live browsing from sandbox Chrome is blocked (egress tunnel
  fails for every external host, same as the Loop 5 note), so browser
  checks ran against a local production build of the exact shipped
  commit; the only external request that fails there is the tracker
  verify.js, which returns 200 from the shell.
- Screenshots: `docs/screenshots/neon-redesign-{home,audit,sample,templates,terms,privacy}-{1280,390}.png`;
  home and sample 1280px viewed visually, clean.
- Slop (local rules, no external detector): Briskly ~5/100 unchanged, Jev
  ~1 partial tell est. ~3-5/100 unchanged. The only em dash in rendered
  site copy is the frozen BuyButton "Buy DealNote — $49 one-time". New em
  dashes exist only in PDF status labels ("Grade B — Good — a few quick
  wins") and the sample notice strip, which are PDF/report copy, not site
  copy. Zero hype words in app copy.
- Incident, 28 Nov 2026: the first worktree was created under /tmp, and
  /tmp is a 512M tmpfs that filled to 100% during the rebuild (ENOSPC),
  which deleted the worktree and all uncommitted edits in it. Only the
  committed SAMPLE_BRAND change survived. All edits were re-applied in a
  new worktree on the home disk
  (`~/workspace/ship-or-die-100k/dealnote-neon-redesign-wt`) and committed
  at each step. Lesson: never put a worktree or a build under /tmp on this
  VM.

## Known cosmetic item

The Sakuga submit button in the hero pill still wraps "Run a free audit"
onto 3 lines: the Sakuga control sizes itself and ignores the nowrap
class. Pre-existing Sakuga control sizing, not a redesign regression;
left as is rather than editing the shipped Sakuga component files.

## Still open (not this redesign)

- PDF 200 with a real license key — pending on the parallel payment-test
  worker (test mode, no live purchase).
- Upstash Redis — not provisioned, no free tier in the Vercel Marketplace;
  do not provision a paid plan without Velu. /terms wording stays honest.
- BuyButton em dash — frozen, the one remaining Jev tell.
- TrustMRR — only after the first real sale.
- Fresh Neon Task re-check of the redesigned site — the parent runs it in
  the browser (Task mode, Gemini 4 Neon High).
