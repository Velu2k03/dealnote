# DealNote Loop 4 Consolidated Audit — 28 Nov 2026

**Product:** DealNote, white-label website teardown + proposal generator, $49 one-time.
**Live (audited):** https://dealnote-blue.vercel.app — **Repo:** ~/workspace/ship-or-die-100k/teardown-generator
**Commit audited:** main `d331073` (Loop 3 fix report, merge `1ce3e47`).
**Streams (5, all report-only, no code changed by any auditor):**

| # | Stream | Report |
|---|---|---|
| 1 | Live site + code | `docs/dealnote-loop4-live-audit-2026-11-28.md` |
| 2 | Slop (Briskly / Jev, replicated) | `docs/dealnote-loop4-slop-2026-11-28.md` |
| 3 | Legal labels + endpoints | `docs/dealnote-loop4-legal-endpoints-2026-11-28.md` |
| 4 | Science / psychology + tracker | `docs/dealnote-loop4-science-2026-11-28.md` |
| 5 | Live UI/UX (additional stream, same commit) | `docs/dealnote-live-uiux-audit-2026-11-28.md` |

All five streams audited the same commit (live page sizes byte-identical to the Loop 3 live verification: home 49,769 B; /audit 17,788 B; /sample 52,096 B; /templates 38,747 B; /terms 26,419 B; /privacy 22,494 B). No live POSTs were run in any stream (needs Velu's approval). No payment work in any stream. Claude Opus miss-check was not done in any stream (agy quota exhausted until ~Thu 3 Dec 2026 ~22:06 Manila).

## Consolidated verdict: NO-SHIP as a paid product — code-side SHIP WITH FIXES

- **0 new P0s in code.** The 2 P0s are carried and Velu-gated only (see below).
- **1 new P1 in code:** desktop header broken on every page at viewport > 640px (streams 1 and 5 agree, same root cause).
- **Code-side:** SHIP WITH FIXES. All four Loop 3 P1s verified fixed; 11 of 13 Loop 3 P2s verified fixed (carried: PageSpeed unmeasured, BuyButton em dash).
- **Fix round:** `docs/dealnote-loop4-fix-report-2026-11-28.md` — the P1 and every fixable gap below are fixed there, plus Velu's Apple glass + motion direction (28 Nov 2026).

## Scores

| Area | Loop 4 | Loop 3 (for comparison) |
|---|---|---|
| Build (local) | 9/10 (clean on retry; legal stream hit two late-packaging failures, see §4) | 10/10 |
| Pages live (GET) | 10/10 — all 6 pages 200, byte-identical to Loop 3 | 10/10 |
| Free audit, local | 10/10 — 45/F, exact teaser keys, ~3.9 s | 10/10 |
| Free audit, live | 0/10 — not verified (Velu-gated) | 0/10 |
| Paid audit, local | 10/10 — 45/F, 10 issues, quota 1/29 | 10/10 |
| Phase 1 features | 10/10 — all 8 present, runtime-verified in a real browser | 9/10 |
| PDFs, local | 10/10 — both valid A4, footer exactly 1x per page, 0 placeholder leaks | 9/10 |
| PDFs, live | 0/10 — need a real licence key | 0/10 |
| Copy / honesty | 9/10 — 0 "verified", 0 future dates, 0 invented figures | 9/10 |
| Scoring engine | 10/10 — weighted math re-verified by hand (44.95 → 45) | 9/10 |
| Security / SSRF | 9/10 — `test-ssrf.ts` 29/29; DNS rebinding theoretically open | 9/10 |
| Paywall / quota | 10/10 — teaser server-enforced, rate-limit refund proven | 8/10 |
| Visual / design | 7/10 — 0px overflow everywhere; desktop header broken (P1) | 10/10 |
| Briskly-style slop | ~5/100 (unchanged) | ~5/100 |
| Jev-style slop | ~3–5/100, ~1 partial tell (frozen BuyButton em dash) | ~3–5/100 |
| Science composite (Neon formula) | 79/100 (A 82, O 84, P 76, C 62, L 86, R 84) — gate is 92, no dimension below 85 | — |

## P0 — 2 carried, Velu-gated only (NOT fixable in code)

| # | Finding | Unblocker |
|---|---|---|
| P0-1 | Live free-audit POST unproven (not retried; timed out twice before) | One real-browser run of the free audit against the live site; needs Velu's approval |
| P0-2 | Payment on hold, no live purchase path (checkout 503 `notConfigured`, honest) | Velu resumes payment, then a live $49 purchase + refund proven end to end |

## P1 — 1 new

| # | Finding | Streams | Fix |
|---|---|---|---|
| P1-1 | Desktop header nav renders as a black-bordered box pinned top-left, covering the DealNote wordmark, at any viewport > 640px, on every page. Wordmark/home link unclickable at desktop width. Root cause: `components/site.tsx:33` puts `popover="auto"` on the same `<ul>` that `app/globals.css:132` turns into the desktop inline nav; author `display: flex` overrides the UA closed-popover `display: none`, and the remaining UA popover styles (`position: fixed; inset: 0; 3px border`) place it in the top layer. Present but unreported in Loops 2–3 (visible in Loop 3's own screenshots). Mobile (390px) correct. | 1, 5 | Fixed in the Loop 4 fix round: separate desktop list + mobile popover list. Verified desktop 1280 + mobile 390 (see fix report §2.1). Real-Chrome check still recommended (proven in chrome-headless-shell 158 only). |

## P2 — consolidated (new + carried)

| # | Finding | Streams | Status after fix round |
|---|---|---|---|
| P2-1 | BuyButton em dash (frozen payment component) — the only em dash / only Jev tell on the site | 1, 2, 5 | Carried, frozen. Fix when the payment freeze lifts ("Buy DealNote, $49 one-time"). |
| P2-2 | PageSpeed / LCP unmeasured (no API key; anonymous quota 429 in Loop 3) | 1, 4, 5 | Carried. Needs an API key. |
| P2-3 | Two alternate email subjects run 7 words (day7, postcall) vs the under-6 rule | 1 | Fixed: both shortened to 5 words. All 16 subjects now ≤ 6 words. |
| P2-4 | DNS rebinding theoretically open (SSRF guard is blocklist-based; no `dns.lookup` re-check) | 1, 4 | Carried. Theoretical only; unit suite 29/29. |
| P2-5 | Quota enforcement best-effort until Upstash KV is wired (in-memory, per-instance) | 1, 4 | Carried. Needs a KV account. Honestly disclosed in /terms. |
| P2-6 | Legal / privacy open items: no legal review of terms (governing law, liability, Business Opportunity Rule); /privacy carries no Vercel log-retention number; no custom domain | 1, 3, 4 | Carried. Need Velu / a reviewer, not a code fix. |
| P2-7 | Sample data + competitor price carry 27 Nov dates while the site says 28 Nov (slop L-N7) | 2 | Fixed honestly: SEOptimer price re-checked 28 Nov 2026 (still $39/mo); sample run date kept 27 Nov (its genuine run date). |
| P2-8 | "60-second checklist" is an unmeasured time estimate (slop L-N8) | 2 | Fixed: renamed "Before you send: checklist". |
| P2-9 | $696/yr price-anchor table missing — `$696` appears 0 times in repo/live; only a single-comparator $39/mo line | 4 | Partially fixed, honestly: the $696 figure was NOT claimed (Better Proposals annual figure could not be verified cleanly from its own pricing page); a one-comparator block was added instead — SEOptimer $39/mo = $468 over 12 monthly payments, $351 billed annually, vs $49 once, dated 28 Nov 2026. See fix report §2.3a. |
| P2-10 | Sample PDF is print-to-PDF only, not a 1-click download | 4 | Fixed: real `GET /api/pdf/sample`, SAMPLE-stamped, 3 pages, verified locally. |
| P2-11 | Blank `$____` x3 in /sample proposal tiers (Opus-undecided conflict) | 4 | Fixed without pre-filling: tiers now read "To be quoted"; audit-page generator blanks untouched. |
| P2-12 | No scroll cue on home (false floor only partly broken by the scorecard peek) | 4 | Fixed: "See how it works below" link + `#how-it-works` anchor. |
| P2-13 | No labelled TL;DR box on /terms or /privacy | 4 | Fixed: 4-bullet Summary boxes on both. |
| P2-14 | Two /terms paragraphs just over 120 words (~121–123) | 4 | Fixed: both split at sentence boundaries, wording unchanged. Max now 117 words. |
| P2-15 | SAMPLE stamp prints on page 1 only; never on server PDFs | 3 | Fixed: print-only repeating header (SAMPLE on all 6 printed pages, verified) + new `/api/pdf/sample` route. |
| P2-16 | /audit L1/L6 render only after a result exists | 3 | Partially fixed: short L1 disclaimer now unconditional under the URL box. |
| P2-17 | Sample page leads with raw bracket placeholders ("Prepared by [Your studio]…") | 5 | Fixed with a quiet line: "The bracketed names are placeholders on purpose: your brand goes here on a real report." |
| P2-18 | Desktop prose lines run ~110–130 characters | 5 | Fixed: `.card p, .reading p { max-width: 65ch; }`. |
| P2-19 | Footer inline links ~17px tall | 5 | Fixed: `display: inline-block; padding: 4px 0` (clears 24px target). |
| P2-20 | /templates warning cards are H2s, overstated in the heading outline | 5 | Fixed: demoted to styled `<p>` inside the existing `role="alert"` cards. |
| P2-21 | Home hero score card repeats the full score disclaimer in small type | 5 | NOT fixed: the full text is the required L1 label; trimming it would reopen a legal gap. Recorded, not silently skipped. |
| P2-22 | Local `npm run build` failed twice at final packaging in the legal stream | 3 | Investigated in the fix round: no code defect found; clean exit 0 twice from a clean `.next`. See fix report §2.2. |

## Loop 3 P1s — all 4 verified fixed (stream 1)

Brand placeholders refused in PDFs (400 until real brand); rate-limit refund on failed fetches + `x-real-ip` first; /privacy Polar future tense; /audit card "Eight structurally different documents". Loop 3 P2s: 11 of 13 verified fixed (carried: PageSpeed, BuyButton em dash).

## What passed (all streams agree)

- All 6 pages + `/robots.txt` + `/sitemap.xml` return 200 live and local; sizes byte-identical to Loop 3.
- Tracker snippet byte-verbatim on all 6 pages, exactly one live script tag per page.
- Free audit local 200, 45/F, exact teaser keys; robots 403; rate limit 5 then 429 with refund on failed fetch; private URL 400; checkout 503; PDFs 402 without key, 200 with dev key, footer exactly 1x per page, 0 placeholder leaks.
- SSRF 29/29. Scoring math hand-verified. Phase 1 features runtime-verified in a real browser (edit-loss kept, finding toggles, section toggles, `?url=` prefill + autofocus).
- Legal labels L1–L9: all PASS except L3 print/server-PDF (now fixed in the fix round). Refund channel present (mailto with pre-filled subject); deliverability last proven 20 Nov 2026 Zoho test.
- 0 "verified", 0 future dates, 0 invented figures, 0 hype/urgency copy on all 6 pages.
- 0px horizontal overflow on all pages at 1280 and 390.

## Science gaps carried (not code-fixable in this round)

- Cold start to a branded PDF cannot be walked: no licence key can be bought (P0-2). Free path is under 3 minutes.
- Buy → pay unmeasurable (1 tap reaches an honest dead end). Dead ends are all honest, none is a crash.
- No Better Proposals second comparator (see P2-9).

## 25-skill polish pass (Velu, 28 Nov 2026 — Loop 5 scope)

After the Loop 4 fix round shipped, Velu ordered a polish pass using all 25 skills from https://recent.design/skills. The fix round (header + build + science + glass/motion) shipped first per his fallback instruction; the skill pass is recorded as named Loop 5 scope in the fix report (§10) with a per-skill table (skill, source, scan verdict, used/skipped with evidence, what changed) to be completed there. No skill was silently skipped: each of the 25 is either applied or recorded with its reason.

## Files

- This report: `docs/dealnote-loop4-audit-2026-11-28.md`.
- Fix report: `docs/dealnote-loop4-fix-report-2026-11-28.md`.
- Stream reports: `docs/dealnote-loop4-live-audit-2026-11-28.md`, `docs/dealnote-loop4-slop-2026-11-28.md`, `docs/dealnote-loop4-legal-endpoints-2026-11-28.md`, `docs/dealnote-loop4-science-2026-11-28.md`, `docs/dealnote-live-uiux-audit-2026-11-28.md`.
- Screenshots: `docs/screenshots/loop4-*.png` (audit), `docs/screenshots/live-uiux-*.png` (UI/UX), `docs/screenshots/loop4fix-*.png` (fix round).
