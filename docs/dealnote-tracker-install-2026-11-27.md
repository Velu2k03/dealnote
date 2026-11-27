# DealNote — Ship or Die Tracker Install Report, 27 Nov 2026

**Live:** https://dealnote-blue.vercel.app — **Repo:** https://github.com/Velu2k03/dealnote
**Branch:** `dealnote-tracker-install` (commit f522c72) merged to main as e51015b, pushed `03715ff..e51015b`.
**Status: INSTALLED AND LIVE.**

## Exact snippet installed

Copied word for word from Velu's Ship or Die dashboard (My Startup > traffic tracker) on 27 Nov 2026, after My Startup was saved as: DealNote, Software / web app, website https://dealnote-blue.vercel.app/, public sharing on. Dashboard status before install: traffic "Not connected", revenue "Not connected". Nothing in the snippet was invented or altered, including the `data-site` value:

```html
<script defer src="https://www.ship-or-die.com/hackathon/verify.js" data-site="d40c7a78322ccb335a973aa331f31294d5cbddcb"></script>
```

## Placement

In `app/layout.tsx` (root layout `<head>`), so it is on every page. One implementation note: a plain JSX `<script defer ...>` is serialised by React as `defer=""`, which is not byte-identical to the dashboard snippet. The layout therefore renders the tag via `dangerouslySetInnerHTML` on `<head>`, which emits the snippet byte-verbatim. Verified that metadata still renders (title and OG tags intact in built HTML).

/privacy was updated in the same commit: it previously said the tracker was "not yet installed"; it now states the tracker is installed (27 Nov 2026) and loads verify.js to count visits.

## Build result

`npm run build` passes clean, zero type errors, Next.js 14.2.35. 6 pages + 6 API routes, unchanged from the site-whole build.

## Verification — built HTML (local)

Byte-verbatim snippet present (grep count 1 per file) in all 6 built pages:

| Page | Built HTML | Snippet |
|---|---|---|
| / | .next/server/app/index.html | 1 |
| /audit | .next/server/app/audit.html | 1 |
| /sample | .next/server/app/sample.html | 1 |
| /templates | .next/server/app/templates.html | 1 |
| /terms | .next/server/app/terms.html | 1 |
| /privacy | .next/server/app/privacy.html | 1 |

verify.js direct request: HTTP 200, 1,538 bytes.

## Verification — local production server

`next start` on port 3101: all 6 pages HTTP 200, snippet count 1 in each served page, verify.js 200. (Server stopped after the test.)

## Verification — live (Vercel auto-deploy from main)

Vercel auto-deployed from main after the push of e51015b. First live poll (about 75 seconds after push) already showed the snippet on the home page. No separate deployment ID was captured from a dashboard; the live checks below prove the deploy is Ready.

| Live page | Status | Snippet present |
|---|---|---|
| https://dealnote-blue.vercel.app/ | 200 | yes (1) |
| https://dealnote-blue.vercel.app/audit | 200 | yes (1) |
| https://dealnote-blue.vercel.app/sample | 200 | yes (1) |
| https://dealnote-blue.vercel.app/templates | 200 | yes (1) |
| https://dealnote-blue.vercel.app/terms | 200 | yes (1) |
| https://dealnote-blue.vercel.app/privacy | 200 | yes (1) |

verify.js from the live site: HTTP 200, 1,538 bytes. No console-breaking error from the script was observed in the local test (the script loads and returns 200); a browser network-tab check was not run in this task.

## Docs updated

- docs/TRACKER-INSTALL.md — rewritten: status INSTALLED, exact snippet, install date 27 Nov 2026, dashboard status before install, checklist updated.
- docs/TRACKER.md — live status, tracker status, My Startup status, branch now at e51015b.
- This file: docs/dealnote-tracker-install-2026-11-27.md.

## What was NOT touched

No payment code changed (Polar checkout/webhook/licence code exactly as-is, payment ON HOLD per Velu). No Lemon Squeezy/Polar/TrustMRR/Stripe account or product created. No test purchase. No domain bought. Nothing sent externally. Nothing posted publicly. nosite-leads untouched. No design/copy/pricing change except the /privacy tracker sentence, which is part of this install.

## Still open

- Ship or Die dashboard "Check installation" / connected status: needs a re-check in the dashboard after traffic arrives; the dashboard showed "Not connected" before install because no website was saved, and the snippet has only just gone live.
- Live POST verification (free audit teaser, checkout 503, PDF 402 on Vercel) is still not run — blocked by an approval timeout earlier, not retried, still needs Velu's approval.
- Payment remains ON HOLD per Velu. Next steps when he says resume: Lemon Squeezy vs Polar decision, test purchase, TrustMRR connection.
