# DealNote Template Expansion — Phase 1 Build Report, 27 Nov 2026

**Product:** DealNote, white-label website teardown + proposal generator, $49 one-time.
**Live:** https://dealnote-blue.vercel.app — **Repo:** https://github.com/Velu2k03/dealnote
**Branch:** `dealnote-templates-phase1` (base commit 5186088, main with tracker installed). **NOT merged to main, NOT deployed.**
**Plan followed:** docs/dealnote-templates-research-2026-11-27.md (Phase 1, sections 3a-3c, 5) + docs/claude-templates-misscheck-2026-11-27.md.
**Payment:** ON HOLD. No payment code touched (no changes under app/api/checkout, app/api/webhook, licence validation), no Polar/Lemon Squeezy change, no account or product created, no test purchase, no domain bought, nothing sent externally, nothing posted publicly, nosite-leads untouched, tracker snippet in app/layout.tsx untouched.

## What was built, per item

### 3 proposals — structurally different documents (lib/templates.ts, app/templates/page.tsx, app/audit/page.tsx)
| Template | Structure | Status |
|---|---|---|
| Quick-Fix Pitch | 1 page: cover, What I found (2-3 findings), What I'd fix (quick wins only), Investment (1 tier, Essential), Next step. No About, no Timeline, no acceptance block. | Built, full text viewable + copyable on /templates, selectable in the /audit generator |
| Redesign Proposal | Full 10 sections (cover, found, understanding, fix, scope, timeline, investment, about, terms, next step), 3 tiers inside. | Built, same as above |
| Retainer Opener | 5 sections: cover, found (staleness/neglect), What I'd do monthly, Investment (monthly price, 3-month minimum), Next step. No milestones, no acceptance block. | Built, same as above |

### 5 emails — one sequence (lib/templates.ts, app/templates/page.tsx)
Cold Intro (3 subject lines), Warm Intro (2), Referral Intro (2), Nudge follow-up 3-5 business days, same thread (2 subjects), Breakup follow-up 7-10 days after the nudge, then stop (1 subject). Every email, including follow-ups, carries the CAN-SPAM footer auto-filled from the brand profile. Each email has a "View and edit" expandable editor with a copy button. Copy is blocked with a visible warning if the text still contains a `[finding]` placeholder.

### 8 platform fixes (Claude #1-10 / plan P1-1 to P1-8)
1. **PDF export for proposals** — `/api/pdf/proposal` now accepts the buyer's edited fix list, template kind, section toggles, prices, scope/timeline/not-included lines, expiry, and selected finding IDs. The PDF renders the buyer's logo (uploaded data URL) and validated brand colour (hex, falls back to #0F766E) in headings, borders, and CTA, plus real audit numbers quoted verbatim. Teardown PDF gets the same brand logo/colour treatment. Verified: real PDFs (see below).
2. **Editable fix list** — in the /audit generator: edit title/detail, delete, move up/down, add custom item with phase picker. Verified in the browser.
3. **Selectable findings** — checkboxes on all findings (10 on example.com), default top 3 checked. Proposal text, covering email, and proposal PDF use only the selected findings. Verified: ticking finding #4 adds a 4th fix item.
4. **Section toggles** — every section of the chosen template can be shown/hidden. About is off by default; Terms on by default. Verified in the browser.
5. **Postal address in brand profile** — `postalAddress` added to BrandProfile (lib/audit.ts) with a textarea field on /audit (`autocomplete="street-address"`, per modern-web-guidance `forms` §9) and auto-fill into every email footer. /templates warns visibly when it is missing.
6. **localStorage placeholder warning** — /templates shows a prominent warning banner when no audit findings are stored, and copy buttons refuse to copy text that still contains `[finding N]` placeholders. /audit now stores ALL finding titles in localStorage (was top 3 only).
7. **Non-binding acceptance wording** — signature lines removed everywhere in proposal text and PDF. Both carry: "This proposal is for discussion purposes. It is not a contract, and signing it does not create one. A separate agreement will be provided before work begins." Verified 0 "sign below"/"signature" hits in the proposal PDF and generated text.
8. **0-findings edge case** — when an audit finds nothing material, /audit shows a "This site is in good shape" card with guidance (pitch monthly care, not fixes) and a button switching to the Retainer Opener, instead of an empty proposal. The proposal text builder also renders a good-shape note for 0 issues. Unit-verified via tsx (live 0-issue site not available locally; the code path is the same conditional).

### Static vs editable (per plan §3c)
- Static and selectable, never rewritten: audit findings (quoted verbatim; buyer only selects which to feature).
- Editable: fix list, prices (always `$____`, never `$0` — `priceOrBlank` maps blank, `0`, `$0`, `____` to `$____`; verified by unit test), timeline, scope, pre-populated NOT-included list (5 concrete lines, editable), testimonial slots (empty slot text: "Replace with a real project or delete this section", section toggleable off), expiry (default [14/30] days, never omitted).
- Brand/logo/colours in PDF: logo embedded from uploaded data URL, brand colour applied to PDF headings/borders/CTA.

### /templates page
Headline is the honest count: "3 proposals + 5 emails + editable blocks". Never claims 200+. Each proposal card lists its real section list and length; each email card lists timing and subject lines. Full template text is viewable in place. 60-second checklist and CAN-SPAM footer preview kept.

### Skills used
- **modern-web-guidance**: searched `accessible checkbox list`, retrieved `checkbox` + `forms` guides. Applied: native checkboxes with `accent-color: #0F766E` (keeps native keyboard behaviour), wrapping `<label>` with a 44px hit target (`.check-row`), postal address as a `<textarea autocomplete="street-address">`, `type="button"` on helper buttons, `aria-live`/`role="alert"` on warnings.
- **ui-ux-pro-max, unslop, impeccable**: NOT installed in this workspace (only `modern-web-guidance` and `logo-design` exist under custom-skills). No new skill was installed (lean-toolset rule). Design follows the existing docs/design-notes.md system instead (white/slate, teal #0F766E, Inter, Lucide only, no gradients/glows/emoji, no Sortes tokens). **logo-design**: not used — no new logo was needed; the existing DealNote logo is unchanged.

## Build result
`npm run build` clean on Next.js 14.2.35, zero type errors. Routes unchanged: 6 pages + 6 dynamic API routes.

## Local verification (production build, `next start` port 3102, dev licence key only, no Polar env)
- All 6 pages HTTP 200: /, /audit, /sample, /templates, /terms, /privacy. Headline "3 proposals + 5 emails + editable blocks" present in served /templates HTML; all 8 template names present.
- Paid audit (dev key, example.com): 200, 10 issues, score 45/F — findings 4-10 exist and are selectable.
- Proposal PDF (curl, dev key, edited fix item + Quick-Fix + brand colour #155E75 + logo data URL + price "0"): 200, 67,662 bytes, valid `%PDF-`, 4 pages. pdftotext confirms: edited fix title present, `$____` (the "0" price rendered blank), non-binding wording present, brand name present, 0 signature lines.
- Proposal PDF, no key: 402. Teardown PDF (dev key, brand colour + logo): 200, 71,574 bytes, valid PDF, 4 pages.
- Browser test (Puppeteer + cached Chromium, real audit run on example.com with dev key): 10 finding checkboxes; fix list starts at 3 items; ticking finding #4 raises it to 4; editing a fix title works and the edited title appears in the downloaded proposal PDF (3 pages, "EDITED FIX IN BROWSER", `$____`, non-binding text, "Proposal PDF downloaded" status); About toggle off by default; Quick-Fix picker works; /templates warning banner shows in a fresh browser; Quick-Fix full text opens.
- Unit test (tsx): `priceOrBlank("0")` → `$____`, `priceOrBlank("")` → `$____`, `priceOrBlank("1500")` → `$1500`; 0-findings proposal text contains the good-shape note + non-binding wording, no signature lines, monthly price blank.
- Overflow: scrollWidth == innerWidth on /templates and /audit at 1280 and 390 (0 px overflow in the browser test).
- Screenshots (desktop 1280 + mobile 390, full page): docs/screenshots/phase1-templates-desktop.png, phase1-templates-mobile.png, phase1-audit-desktop.png, phase1-audit-mobile.png. Visually checked: clean white/slate + teal, no slop markers. Note: the sticky header repeats mid-page in full-page captures (screenshot artifact, not a page defect). Note: the mobile /audit screenshot shows the local test licence key in the key field; it is a throwaway dev-only key (`dev-test-key-123`, set via env at server start, never committed, never a real licence).

## Neon verdict — LANDED DURING THIS BUILD, reconciled
Neon's templates audit arrived while this build was running: docs/neon-dealnote-templates-audit-2026-11-27.md (Gemini Task mode, 27 Nov 2026). Verdict: 18 modular templates (6 deal types, 6 niche overlays, 6 email sequences). Neon agrees with every Phase 1 platform fix (selectable findings, editable fix list, branded PDF, postal address, section toggles, CAN-SPAM, blank prices, no fake testimonials, non-binding acceptance, no cold SMS, no AI text). Its additions beyond Phase 1 (deal types 4-6: Local SEO & GBP Refresh, Landing Page, One-Page Fast-Close Quote; 6 niche overlays; 6th email variants incl. Day 14 breakup, post-call delivery, post-proposal nudge; concise 6-7 section default; 3 tone presets; tier-count toggle; /sample alignment gap) are recorded as **Phase 2 candidates** in the hook added to docs/dealnote-templates-research-2026-11-27.md §2c. Disagreements for Velu/parent to decide in Phase 2: 6-7 vs 10 section default, 6 vs 5 emails, 6 niches at once vs 2 first. No Neon launch-blocker stands against Phase 1 that Phase 1 does not already build.

## Deliberately NOT built (per plan §3d)
- 200+ colour-only templates; pre-filled testimonials/case studies; pre-filled dollar-loss figures (blank formula wording instead: "These issues may be turning away visitors"); full contract as proposal (non-binding wording instead); cold SMS; "unlimited revisions" (template text: 2 rounds included); pricing recommendations / "starting at" prices; AI-generated proposal text; colour picker without PDF (colours ship WITH the PDF); DOCX export; niche language sets (Phase 2); tone switcher (Phase 2); deal-type scope packs 4-6 (Phase 2, per Neon); 1-page executive summary report (Phase 2, P2-4).
- /sample alignment (Neon's 4 missing sections): pre-existing gap, out of Phase 1 scope, noted for Phase 2.

## Files changed
- New: lib/templates.ts (shared template library + proposal/email builders), docs/dealnote-templates-phase1-2026-11-27.md (this file), docs/screenshots/phase1-{templates,audit}-{desktop,mobile}.png.
- Modified: app/templates/page.tsx (rewrite), app/audit/page.tsx (generator: selectable findings, editable fix list, template picker, section toggles, scope/timeline/not-included editors, postal address field, PDF download), app/api/pdf/proposal/route.ts (accepts edited items/template/sections/prices/selected findings), lib/pdf-html.ts (brand logo + colour in both PDFs, full proposal structure), lib/audit.ts (postalAddress), app/globals.css (`.check-row`, checkbox accent-color), docs/dealnote-templates-research-2026-11-27.md (Neon hook filled with landed verdict + reconciliation).
- Untouched: app/api/checkout, app/api/webhook, lib/license.ts, lib/entitlements.ts, app/layout.tsx (tracker), nosite-leads, main branch, Vercel deploys.

## Open items / follow-ups
1. Merge decision is the parent agent's / Velu's; this branch is ready for review, not merged.
2. Live PDF on Vercel serverless still untested (same as before; needs a real licence key via the payment step, which is on hold).
3. Phase 2 candidates (Neon additions + plan P2-1 to P2-6) need Velu's pick before building.
4. The two pre-existing docs files docs/claude-templates-misscheck-2026-11-27.md and docs/dealnote-templates-research-2026-11-27.md were untracked in the working tree at branch start; they are committed on this branch along with the Neon audit file docs/neon-dealnote-templates-audit-2026-11-27.md (which landed during the build).

### Modern Web Guidance
- **`checkbox`**: I used native checkboxes with `accent-color: #0F766E` and a wrapping label with a 44px hit target instead of custom-styled inputs, so keyboard behaviour and focus indicators stay native ("ensure the checkbox or its wrapping `<label>` provides an interactive hit target of at least `44px x 44px`").
- **`forms`**: I used a `<textarea autocomplete="street-address">` for the postal address ("use the `<textarea>` element for addresses, to accommodate different address formats") and `type="button"` on all non-submit helper buttons.
