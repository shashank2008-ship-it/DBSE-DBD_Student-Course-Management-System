# Student Portal Pro upgrade

Goal: preserve the existing React + Express + MySQL project and make it a credible college backend demonstration.

Architecture: modular monolith; Express routers for HTTP contracts, services for transactional enrollment and academics, MySQL for durable relational records. Authentication uses a signed token and scrypt password hashes. No fabricated academic data or frontend login fallback.

Tasks
1. Regression tests for passwords, sessions, access control, time conflicts, grades, and database enrollment.
2. Complete repeatable schema setup; secure middleware; transactional enrollment/switch/drop; prerequisites, credit limit, FIFO waitlist promotion; truthful academic summaries and audit triggers.
3. Preserve UI, replace fake data, add planner/waitlist and admin operations pages, session restoration, notifications and transcript export.
4. Live database/API checks, build, setup scripts, OpenAPI/Postman, syllabus mapping, package clean ZIP.

Constraints: Node.js 20+, MySQL 8.0.16+ or compatible MariaDB; Windows instructions; no Docker required; new isolated database student_portal_pro to preserve the old database. Keep all validation on backend.

Review focus: last-seat races, concurrent section changes, missing prerequisite, tampered authentication, invalid marks, enrollee record ownership, fresh install/repeated setup, stale client requests.
