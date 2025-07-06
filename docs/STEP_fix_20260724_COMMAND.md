# STEP_fix_20260724_COMMAND.md — Mobile sidebar toggle fix

Project Context Summary:
The mobile dashboard layout shows a hamburger button in the header but clicking it does not open the sidebar. The sidebar component maintains its own state internally, so the header button is disconnected.

Steps already implemented:
- Attendant pages were updated to use role APIs (STEP_fix_20260723_COMMAND.md).
- Previous fixes include pumps page default listing and fuel price service tests.

Task:
Allow the header hamburger button to toggle the mobile sidebar by hoisting the sidebar open state to `DashboardLayout`. Pass `open` and `onOpenChange` props to `Sidebar`, and add an `onMobileMenuClick` callback prop to `Header` which opens the sidebar. Remove the unused local state in `Header`.
Update CHANGELOG.md, docs/FRONTEND_CHANGELOG.md, docs/backend/IMPLEMENTATION_INDEX.md, backend/docs/IMPLEMENTATION_INDEX.md and docs/backend/PHASE_3_SUMMARY.md.

Required documentation updates: CHANGELOG.md, docs/FRONTEND_CHANGELOG.md, docs/backend/IMPLEMENTATION_INDEX.md, backend/docs/IMPLEMENTATION_INDEX.md, docs/backend/PHASE_3_SUMMARY.md.
