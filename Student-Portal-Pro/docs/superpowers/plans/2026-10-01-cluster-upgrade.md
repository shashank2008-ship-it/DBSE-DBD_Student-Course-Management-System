# Cluster Upgrade Implementation Plan

**Goal:** Deliver the approved cluster enrollment, admin CGPA, and dashboard upgrade as a tested ZIP.
**Architecture:** React UI calls authenticated Express APIs. MySQL migration adds clusters, section groups, semester selections, and an academic audit trail. Enrollment checks cluster compatibility inside the existing locked transaction.
**Spec:** ../specs/2026-10-01-cluster-enrollment-dashboard-design.md

## Tasks
- [x] Test cluster compatibility and CGPA validation rules; implement them in server/services/rules.js.
- [x] Add idempotent migration and four clusters (2, 3, 2, 3 groups). Preserve legacy sections in Cluster 1 and their enrollment records. New offerings cover every cluster. Store semester selections separately so a dropped course cannot unlock a cluster.
- [x] Add cluster selection, admin assignment, CGPA, and cluster management APIs. Audit changes; enforce student ownership and admin roles. Check same-semester offerings and waitlists.
- [x] Add reusable cluster cards, student selection screen, admin management screen, and student directory with courses and CGPA editing. Filter course sections throughout enrollment and planner flows.
- [x] Run unit and database integration checks, build frontend, review renders, update docs and API contract, and package a ZIP excluding credentials and dependencies.

## Review Focus
- Existing students with mixed legacy sections keep their records and receive Cluster 1.
- Concurrent selection/enrollment cannot produce cross-cluster records.
- Empty strings, booleans, infinity, and out-of-range CGPA are rejected; null clears the override.
- A cluster cannot change after any semester enrollment or active waitlist exists.
- Admins cannot move an occupied section across clusters.
