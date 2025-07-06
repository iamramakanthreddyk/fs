# STEP_fix_20260724_COMMAND.md — Clarify attendant role access

## Project Context Summary
The frontend still issues requests to `/nozzle-readings` and `/fuel-prices` when an attendant is logged in. These endpoints are owner/manager only, resulting in `403` errors. Attendant specific routes exist but there is no listing API for readings or prices. The journey docs are outdated (last updated 2025-07-05) and miss these details.

## Steps already implemented
- Attendant endpoints for stations, pumps, nozzles, creditors and cash reports (`docs/journeys/ATTENDANT.md`).
- Fix 2026-07-23 changed frontend pages to use attendant hooks for hierarchy data.

## What to build now
Update `docs/journeys/ATTENDANT.md` to clearly list the available endpoints and explicitly state that attendants cannot fetch `/fuel-prices` or list `/nozzle-readings`. Note the stubbed attendance/shifts APIs. This documents why 403 errors occur when generic hooks are used.

## Required documentation updates
- `docs/journeys/ATTENDANT.md` (updated)
- `CHANGELOG.md` entry under Fix 2026-07-24
- `backend/docs/IMPLEMENTATION_INDEX.md` new row
