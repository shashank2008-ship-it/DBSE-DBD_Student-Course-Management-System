# Student Portal Pro — v3: Cluster Edition

An upgraded Student Course Enrollment and Academic Management System.
React frontend + Node.js/Express REST API + MySQL. No Docker required.

## New in v3

- Four academic clusters with 2, 3, 2 and 3 section groups. Every seeded subject has offerings inside each cluster.
- Students choose a cluster in **My Cluster** before enrolling. They can choose different section groups for different subjects, but every subject must stay within the same cluster.
- First enrollment or waitlist entry locks the cluster for the current semester, even after courses are dropped. The server also rejects requests that attempt to mix clusters.
- Admin **Student Directory** shows each student's courses and cluster. Click **Edit academic record**, enter an official CGPA (0–10) and a reason, then **Save CGPA**. Leave CGPA empty to restore the value calculated from grades.
- Admin **Cluster Management** supports cluster and section-group names, reassignment of empty offerings, and academic change history. Occupied sections cannot be moved.
- Redesigned dashboards include degree progress, course performance, cluster summaries, academic alerts and a roster CSV export.

### Upgrade an existing v2 installation

1. Stop the old application with Ctrl+C.
2. Extract this ZIP into a new folder and open its **Student-Portal-Pro** folder.
3. Copy your old `server/.env` to the new `server/.env` to reuse the same database settings, or enter the same settings during setup.
4. Run **SETUP-WINDOWS.bat** once, then **START-WINDOWS.bat**.

Setup adds the cluster tables and course offerings without deleting existing students, grades or enrollments. Original course section IDs become part of Cluster 1, so existing section choices stay consistent. Setup preserves later cluster and CGPA edits.

## Quick start on Windows

1. Install Node.js 20+ and MySQL Community Server 8.0.16+.
2. Start the MySQL Windows service. Workbench is optional for running the web app.
3. Extract this ZIP and open **Student-Portal-Pro** in VS Code.
4. Double-click **SETUP-WINDOWS.bat**. It installs dependencies, asks for your MySQL connection details, creates an isolated `student_portal_pro` database and builds the frontend.
5. Enter the same root password that works in MySQL Workbench. Terminal password input may be visible; it is never printed by the program afterward.
6. Double-click **START-WINDOWS.bat**.
7. Open **http://localhost:5000**. Keep the backend terminal open.

Subsequent runs: start the MySQL service and double-click START-WINDOWS.bat.
Existing original `student_portal_db` data is not changed. This version uses the student_portal_pro schema; do not point it at the old schema.

## VS Code terminal commands

Run inside the folder containing the root package.json:

```powershell
npm install
npm --prefix server install
npm run setup
npm start
```

If PowerShell blocks npm.ps1, replace `npm` with `npm.cmd`.

Manual configuration: copy `server/.env.example` to `server/.env`, set your database credentials and a random JWT_SECRET of at least 32 characters, then run:

```powershell
npm run db:setup
npm run build
npm start
```

`npm run setup` preserves existing configuration. To correct a password, remove DB_PASSWORD_B64 from server/.env and set DB_PASSWORD to your password, then rerun setup. Automatic setup stores passwords as base64 to preserve quotes/backslashes; base64 is encoding, not encryption. Never commit .env.

Development: `npm run dev` starts Express and Vite; open http://localhost:3000.
Production demo: `npm start` serves both the built frontend and API from port 5000.

## Demo accounts

| Role | Username / ID | Password |
|---|---|---|
| Administrator | admin | Admin@2026! |
| Student | 2520030477 | Student@2026! |
| Student occupying a one-seat section | 2520030002 | Student@2026! |
| Additional student | 2024CSB1084 | Student@2026! |

These are explicit demonstration credentials, not universal bypass passwords. New accounts have their own hashed password and zero academic records.
The supplied students, faculty and academic results are illustrative demo data.

## What's improved

- Scrypt password hashing with a random salt; signed eight-hour HS256 JWT sessions.
- Backend student ownership and administrator permissions; frontend admin route protection.
- Verified session restoration, no offline admin login fallback, authentication request limit.
- Parameterized queries, JSON input size limit, validation and consistent error messages.
- Enrollment, section switching and drops run inside database transactions.
- Section capacity, course/section relationship, timetable conflicts, prerequisites and 24-credit limit are checked by the server.
- FIFO waitlist among eligible students; released seats trigger automatic promotion.
- Section-specific read-only timetable API, including Saturday.
- Enrollment changes are captured by actual MySQL triggers.
- GPA is calculated from credit-weighted published grades; earned credits are distinct from active term credits.
- Attendance is calculated from recorded daily sessions; no hardcoded performance values.
- Independent aggregates prevent duplicate credit sums.
- Admin marks/attendance entry, analytics, audit history and waitlist viewer.
- Student enrollment planner, notifications and transcript CSV via a stored procedure.
- Database-aware health check, OpenAPI contract, Postman collection, regression tests.
- Fresh and repeated setup creates all required tables without resetting existing marks or passwords.

## Demonstration sequence

1. Student 2520030477: Dashboard shows a seeded grade in Data Structures and recorded DBMS attendance.
2. Open Enrollment Planner and check ML eligibility. Data Structures is its configured prerequisite.
3. Register a new student. Their GPA and attendance remain zero, and ML enrollment is rejected until a passing Data Structures grade is published.
4. Enroll the new student in Data Structures. Switch sections and inspect Timetable.
5. Admin > Academic Operations > Records: publish marks and record attendance for an enrolled student. Refresh the student screen to see real calculated values.
6. Student 2520030477 joins Security Studio Section 1's waitlist. Its single seat is occupied by 2520030002.
7. Admin > Enrollments & Drops: drop 2520030002 from that course. The waiting eligible student is enrolled automatically and receives a notification.
8. Admin > Academic Operations > Audit: inspect ENROLLED, SWITCHED and DROPPED events.
9. Grades & Marks: download transcript CSV.
10. Open http://localhost:5000/api/docs or import /api/openapi.json into Postman.

## Inspect in MySQL Workbench

```sql
USE student_portal_pro;
SHOW TABLES;
SELECT * FROM v_student_academic_summary;
SELECT * FROM v_student_rankings;
SELECT * FROM v_course_enrollment_stats;
SELECT * FROM enrollment_audit_log ORDER BY log_id DESC;
SELECT * FROM waitlist;
CALL sp_student_transcript('2520030477');
SELECT fn_calculate_student_avg('2520030477');
SHOW TRIGGERS;
```

Setup executes schema.sql one marked statement at a time and seeds data through seed.js. For manual Workbench execution of the multi-statement trigger/procedure bodies, select each complete CREATE statement or use DELIMITER handling in Workbench.

## Tests

```powershell
npm test
```

Integration tests intentionally require a disposable database whose name ends in `_test`.
Copy your working .env aside, temporarily set DB_NAME=student_portal_pro_test, run db:setup, then `npm run test:integration`; restore your normal .env afterward. Integration tests DROP and recreate only the explicitly configured database ending in _test, then change test records and section schedules. Do not run them against the ordinary demo database.

## Honest scope and limitations

This is a modular monolith, not a distributed microservices system. It implements relational CO1 concepts and the Node.js/Express part of CO4, plus API contracts/testing/documentation concepts shared across the handout.
It does not implement FastAPI, MongoDB, vector databases, Spring Boot, Redis, Kafka, Docker, Kubernetes or a cloud deployment.
Enrollment transactions deliberately serialize section changes by locking section rows in a stable order. This prioritizes consistency for a college demo over high-volume throughput. A production system would use narrower locking and retry policies.
Waitlist entries that become ineligible are retained; a later eligible student may be promoted. Promotion runs on enrollment/drop events, not a background job.
Grades use the configured project scale, not a claim about university grading regulations. Cumulative GPA aggregates all published grades; semester GPA filters grades to the student current semester. A full multi-year enrollment/history model is future work.
The server binds to localhost. Remote access needs deliberate hosting/network configuration and HTTPS. Default demo credentials must be changed before public use.
JWT logout clears the browser token; issued tokens expire after eight hours. Server-side token revocation, password recovery email, a dedicated faculty login and institution-specific term policies remain future work.
API documentation has a local viewer and an OpenAPI JSON contract; no CDN is required.
