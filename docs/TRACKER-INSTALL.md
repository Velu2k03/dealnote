# DealNote — Ship or Die Tracker Install Note

**Date installed:** 27 Nov 2026
**Branch:** `dealnote-tracker-install`, merged to main (see docs/dealnote-tracker-install-2026-11-27.md for merge commit)
**Status: INSTALLED**

## Rule

Install the tracker BEFORE any traffic and BEFORE the first payment. Keep it active for the whole contest. No traffic or launch may happen before the snippet is installed.

## The exact snippet (copied word for word from the dashboard)

Copied by Velu from the Ship or Die dashboard (My Startup > traffic tracker) on 27 Nov 2026, after My Startup was saved as: DealNote, Software / web app, website https://dealnote-blue.vercel.app/, public sharing on. Dashboard status before install: traffic "Not connected", revenue "Not connected".

```html
<script defer src="https://www.ship-or-die.com/hackathon/verify.js" data-site="d40c7a78322ccb335a973aa331f31294d5cbddcb"></script>
```

Do NOT alter any part of it, including the `data-site` value. This file records the snippet because the task brief explicitly required it; it is the dashboard-issued snippet for this startup only.

## Placement

Pasted into `<head>` in `app/layout.tsx` (root layout), so it is on every page: /, /audit, /sample, /templates, /terms, /privacy. Verified verbatim in the built HTML of all 6 pages (grep for `data-site="d40c7a78322ccb335a973aa331f31294d5cbddcb"` and the exact `src` URL) and in live served HTML after deploy.

## Install checklist

- [x] Copy the exact snippet from the Ship or Die dashboard (My Startup > traffic tracker)
- [x] Paste it into `<head>` in `app/layout.tsx` (every page)
- [x] Deploy (Vercel auto-deploy from main)
- [ ] Check the Ship or Die dashboard shows connected (needs a dashboard re-check after traffic; see docs/dealnote-tracker-install-2026-11-27.md)
- [x] Check the browser network tab for a request to `verify.js` (local test: request to https://www.ship-or-die.com/hackathon/verify.js returns 200)

## Status

**INSTALLED 27 Nov 2026.** /privacy was updated the same day: it now states the tracker is installed and loads verify.js to count visits.

## Privacy note

The tracker sends visitor data to a third party. It is named in the Privacy Policy (/privacy). Do not add any other third-party script (analytics, chat, session replay) without a privacy review.

Contact: murugan@drvelu.com
