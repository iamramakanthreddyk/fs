Project Context Summary: The PumpsPage uses `usePumps()` to fetch pump data. When opening "/dashboard/pumps" from the sidebar, no stationId is provided. The existing hook disables the query when stationId is undefined, so the page shows no pumps. Previous steps up to STEP_fix_20260714_COMMAND.md covered integration tests and documentation updates.

Steps already implemented: All backend and frontend integration up to STEP_fix_20260714_COMMAND.md. Pump listing UI already exists in `src/pages/dashboard/PumpsPage.tsx`.

Task: Modify `src/hooks/api/usePumps.ts` so that the pumps query runs even when no station is selected. Use a stable query key for the "all pumps" case and remove the `enabled` condition. Update docs to log this fix.

Required documentation updates: `CHANGELOG.md`, `backend/docs/IMPLEMENTATION_INDEX.md`, `docs/backend/PHASE_3_SUMMARY.md`.
