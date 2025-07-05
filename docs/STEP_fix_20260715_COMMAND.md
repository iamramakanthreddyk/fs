Project Context Summary: Recent sales table shows "Unknown Station" and missing nozzle and fuel info because `/api/v1/sales` only returned basic fields.
Steps already implemented: Up to STEP_fix_20260714_COMMAND.md including test DB fallback docs.
Task: Extend `listSales` query to join stations, pumps and nozzles so results include station_name, pump_name, nozzle_number, fuel_type and fuel_price. Update `salesApi` mapping accordingly. Document in changelogs, implementation index and phase summary.
Required documentation updates: CHANGELOG.md, docs/backend/CHANGELOG.md, docs/backend/IMPLEMENTATION_INDEX.md, docs/backend/PHASE_3_SUMMARY.md.
