# v3 verification record

Verified on 1 October 2026 with Node.js 24 and MariaDB 10.11.14. MySQL 8.0.16+ is the intended user installation; a separate MySQL server and Windows launcher were not available in this environment.

- Production frontend build: passed.
- Core unit tests: 7 passed.
- Live database/API integration checks: 40 passed. Includes cluster selection, missing selection, cross-cluster rejection without seat loss, choice/enrollment races, semester locks after dropping, ownership, admin CGPA overrides, audit history, effective-GPA rankings, legacy waitlist migration, semester-compatible legacy and cloned offerings, repeated setup preserving edits, plus the existing enrollment/grade/attendance/security checks.
- React server render smoke checks: 8 passed, covering student/admin dashboards, selected and unselected cluster pages, cluster management, student directory, planner onboarding, and selected-section schedule/venue.
- Independent code review caught legacy waitlist migration, selected-section metadata, effective-CGPA rankings, and a cloned-offering semester mismatch. These were corrected; regression checks pass.
- Database setup ran repeatedly without deleting academic records. No private database credentials are included in the ZIP.

Browser interaction and visual layout inspection were not available; render checks verify component execution but do not replace browser visual QA. The ZIP includes the built frontend and can be rebuilt by SETUP-WINDOWS.bat.
