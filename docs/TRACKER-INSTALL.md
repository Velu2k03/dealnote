# DealNote — Ship or Die Tracker Install Note

**Date:** 27 Nov 2026
**Branch:** `dealnote-fixes-nov27`
**Status: NOT INSTALLED, NEEDS VELU (dashboard access)**

## Rule

Install the tracker BEFORE any traffic and BEFORE the first payment. Keep it active for the whole contest. No traffic or launch may happen before the snippet is installed.

## Do NOT invent the snippet

The exact snippet must be copied from the Ship or Die dashboard (**My Startup > traffic tracker**). Do not reconstruct it from the script URL alone, and do not paste a snippet from a chat message, a leaderboard page, or another entrant's site. An invented snippet is worse than a missing one, because a wrong snippet silently fails to verify traffic.

## What is confirmed

- Public script URL confirmed: https://www.ship-or-die.com/hackathon/verify.js
- That URL alone is not the snippet. The dashboard-issued snippet tag (script tag with its attributes) has not been verified from any source in this research, and no source shows it.
- Placement: paste into `<head>` in `app/layout.tsx` on every page.
- Note on the base code at branch start (commit f807acb): no tracker TODO comment was found in `app/layout.tsx` itself. The TODO comment lives in README.md. The code agent adds the snippet placement in `app/layout.tsx` in this fixes round; the snippet itself still has to come from the dashboard.

## Install checklist

- [ ] Copy the exact snippet from the Ship or Die dashboard (My Startup > traffic tracker)
- [ ] Paste it into `<head>` in `app/layout.tsx` (every page)
- [ ] Deploy
- [ ] Check the Ship or Die dashboard shows connected
- [ ] Check the browser network tab for a request to `verify.js`

## Status

**NOT INSTALLED.** This needs Velu: only he has dashboard access to copy the snippet. No traffic has been sent yet, so nothing is lost, but no traffic or launch may happen before this is done.

After install, record here: date installed, who copied the snippet, dashboard status shown, and the network-tab check result. Do not record the snippet itself in this file if it contains any per-startup identifier; the snippet belongs in `app/layout.tsx` only.

## Privacy note

The tracker sends visitor data to a third party. It must be named in the Privacy Policy (/privacy) before it is deployed. See docs/dealnote-legal-research-2026-11-27.md §5.4–§5.6. Do not add any other third-party script (analytics, chat, session replay) without a privacy review.

Contact: murugan@drvelu.com
