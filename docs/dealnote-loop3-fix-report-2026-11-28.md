# DealNote Loop 3 Fix Report — 28 Nov 2026

**Product:** DealNote, white-label website teardown + proposal generator, $49 one-time.
**Live:** https://dealnote-blue.vercel.app — **Repo:** ~/workspace/ship-or-die-100k/teardown-generator
**Branch:** `dealnote-loop3-fixes` merged to main. **Audited commit:** main `c1f2d47`.
**Audit doc:** `docs/dealnote-loop3-audit-2026-11-28.md` (verdict NO-SHIP as a paid
product, 0 new P0 in code, code-side SHIP WITH FIXES). Opus miss-check record:
`docs/claude-loop3-misscheck-2026-11-28.md` (agy quota exhausted, resets ~3 Dec 2026).
**Payment:** ON HOLD per Velu. No payment code touched, no Polar/Lemon Squeezy/TrustMRR/
Stripe account or product created, no test purchase.

## What the audit found, and what this round fixed

### P1 — all 4 fixed

| # | Finding | Fix | Verified |
|---|---|---|---|
| P1-1 | Default brand placeholders (Alex Rivera etc.) reached real PDFs | `DEFAULT_BRAND` is now obviously placeholder (`[Your studio]`, `[Your name]`, `[your email]`, phone/website/call-link blank). New `brandValidationError()` in `lib/audit.ts`: both PDF routes return **400** until studio name, contact name, and contact email are real values. PDF contact block (`contactBlock()` in `lib/pdf-html.ts`) renders phone / call link / website only when filled in. Sample page preparer line updated to the bracket placeholders. | PDF with no brand → 400 with the fill-in message (both routes). PDF with a real brand → 200, valid, 0 hits for Alex Rivera / yourstudio / 555 in the text. |
| P1-2 | Rate limit consumed on failed fetches; XFF trusted | New `refundFreeRateLimit()` (`lib/ratelimit.ts`, in-memory + Redis DECR, clamped at 0): the free path refunds the count when `runFullAudit` fails (robots 403, fetch failure). `getClientIp` now prefers `x-real-ip` (platform-set on Vercel, not caller-spoofable) with XFF only as fallback. | Behavior-proven: free 200, robots 403, then 4 more free 200, 6th call 429. The 403 did not burn one of the 5. |
| P1-3 | /privacy described Polar payments in the present tense | Payments paragraph + "Why each item is used" + "Who data is shared with" reworded to future tense with "coming soon" / "No payment is taken today". | Live text check: "coming soon and will be handled by Polar" present. |
| P1-4 | /audit card said "Six structurally different documents" | Changed to "Eight". 0 other stale counts found. | Present in local /audit HTML. |

### P2 — fixed except where noted

1. **PDF last-page footer duplication:** fixed. In-body `.footer` div removed from `reportShell` (`lib/pdf-html.ts`); the `displayHeaderFooter` template is now the only footer. Verified per page: teardown footer exactly 1× on each of p1–p4 (was 2× on p4).
2. **Cold subject 8 words + hardcoded "3":** fixed. Cold subjects now "3 quick wins for [Business]" (5 words), "Your website: 3 quick wins", "[Business] website quick audit". Body "The three biggest items are" → "The biggest items are"; purpose line de-counted. The count in the subject is the buyer's own "3 quick wins" framing, not a claim about the selection.
3. **Fake "Re:" subjects:** fixed. Day 3 → "Your website review"; Post-Proposal → "Your website proposal". Checklist claim ("no fake 'Re:' or 'Fwd:'") is now true.
4. **Header 5 links:** fixed. Privacy removed from the header nav (still in the footer). Header now has 4 links.
5. **Default template Redesign:** fixed. Generator now defaults to Quick-Fix (`useState("quickfix")`, `defaultSections("quickfix")`).
6. **"See proposal templates" label:** fixed → "Open the proposal templates page".
7. **L8 notice only after a result:** fixed. `LOCAL_STORAGE_NOTICE` now also renders in the /audit form card, so a fresh visit shows it. Verified: 1 hit in static /audit HTML (the in-result copies render client-side only).
8. **"Last updated 27 Nov 2026" stale:** fixed. Footer, /terms, /privacy now say 28 Nov 2026; sitemap `lastModified` 2026-11-28.
9. **R8 load budget unmeasured:** NOT fixed. PageSpeed Insights API without a key returns 429 (anonymous quota exhausted); no API key exists. Still needs the PageSpeed Insights API key (already a pending tracker item).
10. **R1 hero input + autofocus:** fixed. Home hero now has a real GET form (`<form method="get" action="/audit">`, input `name="url"`) so landing → audit is one submit; /audit prefills from `?url=` in its mount effect and the URL field has `autoFocus`. Verified in screenshots: hero input renders, /audit field focused on mobile.
11. **Day 3 email 49 words:** fixed ("Just checking that my note…" — one word added).
12. **Orphaned `.steps-grid` CSS:** fixed, deleted from `app/globals.css`.
13. **BuyButton em dash:** NOT fixed (frozen payment component; reword when the freeze lifts).

## Local verification (28 Nov 2026, production build)

- `npm run build`: clean, Next.js 14.2.35, zero type errors, 6 pages + 6 API routes + `/robots.txt` + `/sitemap.xml`.
- `npx tsx scripts/test-ssrf.ts`: 29/29 pass.
- Local server (port 3105, dev key via env only): all 6 pages 200; hero form input `name="url"` present; header 4 links in screenshot.
- Rate limit refund: proven above (5 successful free audits allowed despite an interleaved robots 403; 6th call 429).
- PDF default brand → 400 (both routes, clear message). PDF real brand → 200: teardown 82,622 B, 4 pages A4; proposal 99,324 B, 5 pages A4. Footer exactly 1× per page on both. 0 placeholder hits.
- Screenshots: all 6 pages retaken after the fixes (`docs/screenshots/loop3fix-*.png`, script `scripts/shot-loop3fix.mjs`), desktop 1280 + mobile 390, **0 px horizontal overflow on all 12**. Visually checked: home desktop (hero form, 4-link header, "Last updated 28 Nov 2026" footer) and /audit mobile (autofocused URL field, L8 notice on fresh visit).

## Live verification (after merge/deploy, 28 Nov 2026 ~10:20 Manila)

- Merge `1ce3e47` pushed to GitHub main; Vercel auto-deployed. All 6 pages +
  `/robots.txt` + `/sitemap.xml` return 200 live (home 49,769 B; /audit 17,788 B;
  /sample 52,096 B; /templates 38,747 B; /terms 26,419 B; /privacy 22,494 B —
  sizes changed vs Loop 2, confirming the new build is live).
- Tracker snippet byte-present on all 6 pages. 0 occurrences of "verified",
  no 2027 dates, on every page. Hero form input `name="url"` present in live
  home HTML; /privacy live shows "coming soon and will be handled by Polar".
  The "Eight structurally different" card text is client-rendered after an
  audit result, so it is not in static HTML; it is verified in source and
  renders post-audit (Loop 3 audit confirmed the card in a real browser).
- Live POST verification NOT done (needs Velu's approval; see Still open #1).

## Still open (not fixed in Loop 3)

1. **Live POST verification** (free audit teaser, checkout 503, PDF 402 against the live site): still pending, needs Velu's approval, timed out twice before. Do not retry unless he asks.
2. **Payment**: ON HOLD. No live purchase path, no real licence key, so live paid audit and live PDFs remain unproven. Needs Velu to resume (Lemon Squeezy direction) + a live $49 test purchase + refund.
3. **Claude Opus miss-check**: agy quota exhausted, resets ~Thu 3 Dec 2026 ~22:06 Manila. Neon-guide conflicts (PDF engine, blank `$____` vs presets, loop scoring formula) remain undecided by Opus; Loop 2 defaults stand (keep Puppeteer, keep blank prices).
4. **PageSpeed / LCP**: unmeasured (anonymous API quota 429, no key). Needs the PageSpeed Insights API key.
5. **Custom domain:** none bought. **Legal review of terms** (governing law, liability, Business Opportunity Rule): not done. **Vercel plan / log retention number:** /privacy still carries no number.
6. **DNS rebinding** remains theoretically open (SSRF guard is blocklist-based; no resolve-and-check). Noted in Loop 3 audit.
