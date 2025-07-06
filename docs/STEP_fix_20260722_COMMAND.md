# STEP_fix_20260722_COMMAND.md — Remove duplicate backend brain doc

Project Context Summary:
FuelSync Hub documentation has multiple directories. The file `docs/architecture/BACKEND_BRAIN.md` is an exact duplicate of `docs/backend_brain.md`.
The latter is the canonical file referenced throughout the docs and implementation index. The duplicate in the architecture folder is unused.

Steps already implemented:
- Fixes through `STEP_fix_20260721_COMMAND.md` including pumps page default listing.

Task: Delete `docs/architecture/BACKEND_BRAIN.md` and update `docs/architecture/README.md` to link to `../backend_brain.md`.
Also update CHANGELOGs, implementation index, and phase summary to record this documentation cleanup.

Required documentation updates: `CHANGELOG.md`, `docs/backend/CHANGELOG.md`, `docs/backend/IMPLEMENTATION_INDEX.md`, `docs/backend/PHASE_3_SUMMARY.md`.
