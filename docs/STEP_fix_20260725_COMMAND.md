# STEP_fix_20260725_COMMAND.md — Skip restricted API calls for attendant

## Project Context Summary
Attendant users still see 403 errors because the dashboard and reading entry pages
request `/fuel-prices` and `/nozzle-readings` listings which are owner/manager only.
Previous fix routed hierarchy lookups through `/attendant/*`, but these pages
still fetch restricted resources.

## Steps already implemented
- Attendant pages use attendant stations/pumps/nozzles hooks (`STEP_fix_20260723_COMMAND.md`).
- Documentation clarifies lack of listing APIs (`STEP_fix_20260724_COMMAND.md`).

## What to build now
- Update `AttendantDashboardPage.tsx` and `NewReadingPage.tsx` to avoid calling
  `/fuel-prices` and `/nozzle-readings` when role is `attendant`. Use React Query
  with `enabled: false` so no network request occurs.
- Adjust logic so attendants can still record readings without fuel price data.
- Update `docs/journeys/ATTENDANT.md` to describe the available features and note
  that the UI omits price and reading listings for attendants.

## Required documentation updates
- `CHANGELOG.md`
- `backend/docs/CHANGELOG.md`
- `backend/docs/IMPLEMENTATION_INDEX.md`
- `docs/backend/PHASE_3_SUMMARY.md`
- `docs/journeys/ATTENDANT.md`
