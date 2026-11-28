# DealNote test-mode PDF proof, real sites, 28 Nov 2026

Status: PREP DONE, re-synced to current main. BROWSER STEPS PENDING (test purchase, PDF downloads with the real test key, refund). No live purchase, no real card, test mode only.

Velu, 28 Nov 2026 23:32 Manila: "Use real site for audit, not like example.com". This proof does NOT use example.com, example-plumbing.com, or any fictional business for the paid audit. The sample PDF with Harbor and Pine Plumbing stays fictional and clearly marked SAMPLE, that is the demo, not the paid proof.

## Re-sync to main

- main HEAD at re-sync: 7c94a94 "Neon /audit copy: record live verification on main b365ec8" (Neon /audit copy merge b365ec8 included).
- dealnote-test-mode merged main 7c94a94 as 0c804ce, clean, no conflicts. tsc exit 0, `npm run build` clean. Pushed 0c804ce to origin/dealnote-test-mode. Vercel Preview redeploys from it.
- First re-sync (before the Neon copy landed): 9ba9b53 merged main 20e1b75, also built clean and pushed.
- Worktree: ~/workspace/ship-or-die-100k/teardown-generator-testmode (home disk, never /tmp).

## Real sites for the paid audit proof

### 1. DealNote itself: https://dealnote-blue.vercel.app
- Real live site, ours. Home 200, checked 28 Nov 2026.
- robots.txt: `User-Agent: *` / `Allow: /`, sitemap listed. Automated fetch of the homepage is allowed.

### 2. Real external business: Chambliss Plumbing Company, https://chamblissplumbing.com/
- Real small business, San Antonio, TX, serving since 1991, 1,400+ five-star Google reviews, Licensed Master Plumber MPL 46504, phone (210) 797-7471, 1875 E Borgfeld Dr, San Antonio, TX 78260. A plausible DealNote customer: a local service business whose homepage a web design freelancer would teardown and pitch.
- Home verified live 28 Nov 2026: HTTP 200, 370,357 B.
- robots.txt checked first: `User-agent: *` disallows only /ads.txt, /wp-admin/, /wp-includes/, /wp-content/ (except /wp-content/uploads/), and URLs with query strings. The homepage `/` is NOT disallowed. The audit must fetch the homepage only and must respect this; if the audit refuses to run, record that, do not force it.

## Test-mode facts (unchanged, live untouched)

- Store Resonant Atlas #244487, account futureai2077@gmail.com.
- TEST product DealNote ID 1536800, test variant ID 2390384, $49 one-time, license keys on, activation limit 1, never expires.
- TEST webhook ID 153060, order_created + order_refunded, to the Preview branch URL with a protection-bypass parameter (plain Preview URL returns 302/401 under Vercel Authentication protection; use the bypass URL as in the first test run).
- TEST API key "DealNote Test", expires 28 May 2027. Value lives only in Vercel Preview env vars, NEVER in this doc, git, or the sheet.
- Preview: branch dealnote-test-mode, stable URL https://dealnote-git-dealnote-test-mode-velus-projects-27f81f38.vercel.app, now on 0c804ce (main 7c94a94 + test-mode doc).
- LIVE untouched and to stay untouched: product 1536795, variant 2390379, webhook 153059, Production env vars, live site main 7c94a94, home 200.

## Browser steps pending (parent agent, browser task)

Test mode only, test card only, no live mode, no real card, no wallet.

1. Vercel dashboard: confirm Preview env vars are still the TEST values (test API key, store 244487, test product 1536800, test variant 2390384, test webhook secret) and Production env vars are still the LIVE values. Do NOT redeploy Production. Confirm the Preview deployment for 0c804ce is Ready.
2. Lemon Squeezy: switch the Resonant Atlas store to TEST MODE (as in the first test run). Do NOT touch live mode products.
3. On the Preview site (use the protection-bypass URL if the plain Preview URL is blocked by Vercel Authentication), click Buy, complete exactly ONE test purchase with test card 4242 4242 4242 4242, expiry 12/30, CVC 123, buyer Velu Murugan, futureai2077@gmail.com. Record test order number, API order ID, and the licence key issued. No live purchase.
4. With the NEW licence key, on the Preview site:
   - Run a paid audit of https://chamblissplumbing.com/ (expect a real score/grade and real findings from that homepage, NOT 45/F from example.com). Unlock with the key, download the teardown PDF and the proposal PDF. Both must return 200.
   - Also run a paid audit of https://dealnote-blue.vercel.app with the same key (30 audits/month fair-use, no extra cost) and download its teardown PDF too if time allows; at minimum record its score and grade.
   - Download the sample PDF and check it the same way.
   - Check every PDF: page counts (teardown 4 pages, proposal 5 pages, sample 3 pages, per the Neon redesign), Harbor and Pine brand ONLY on the sample PDF, the real audited business name and URL on the teardown/proposal, zero "[YOUR STUDIO]" / "[Your studio]" / "[Your name]" / "[your email]" placeholders anywhere, running header/footer on every page, sample data clearly marked fictional/SAMPLE where it is sample, no "coming with payment" copy. Keep the downloaded PDFs as files and record sizes and page counts below.
5. Then refund the test order in full in Lemon Squeezy test mode immediately, exactly like the first test, and verify: order status Refunded, licence key Expired, order_refunded webhook delivered 200. Record order number, API order ID, refunded_at.
6. Verify live is untouched: live product 1536795, live webhook 153059, Production env vars unchanged, live site main 7c94a94 still 200.
7. If anything fails, stop, do not retry a purchase blindly, report the exact failure. Do NOT do a live purchase under any circumstance.

## Results (fill in after the browser run)

- Test order number: _PENDING_
- API order ID: _PENDING_
- Licence key issued: _PENDING_ (test data; record the key here only, never the API key or webhook secret)
- Chambliss audit: score _PENDING_, grade _PENDING_, findings _PENDING_
- DealNote self-audit: score _PENDING_, grade _PENDING_
- Teardown PDF (Chambliss): _PENDING_ B, _PENDING_ pages, PASS/FAIL
- Proposal PDF (Chambliss): _PENDING_ B, _PENDING_ pages, PASS/FAIL
- Teardown PDF (DealNote self): _PENDING_ B, _PENDING_ pages, PASS/FAIL
- Sample PDF: _PENDING_ B, _PENDING_ pages, PASS/FAIL
- Refund: order status _PENDING_, refunded_at _PENDING_, licence Expired _PENDING_, order_refunded webhook _PENDING_
- Live untouched: _PENDING_

## First test run, for reference (28 Nov 2026)

Test order #2444879, API order ID 10153598, $49.00, buyer Velu Murugan, futureai2077@gmail.com, created 2026-11-28T13:44:43Z, licence key 54833712-DAB1-4527-A15B-B2AF8E619FDF (now Expired after refund). Refunded in full 2026-11-28T13:48:42Z, order status Refunded, order_created and order_refunded webhooks both delivered 200. Gap that this proof closes: the teardown and proposal PDFs were never downloaded with that real test key before it expired. Local dev-key PDF tests passed (teardown 4 pages, proposal 5 pages), but a live Preview PDF 200 with a real test key is still unproven.
