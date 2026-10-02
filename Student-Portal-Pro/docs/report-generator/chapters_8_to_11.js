const {
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  AlignmentType,
  WidthType,
  BorderStyle,
  PageBreak
} = require('docx');
const { createParagraph, createHeading, createSubsectionPage, createChapterIntro } = require('./docx_helpers');

function getChapter8() {
  const elements = [];
  elements.push(...createChapterIntro(8, "Testing", "This chapter documents the comprehensive quality assurance methodology, testing environments, endpoint verification procedures, test case specifications, and empirical test matrices executed to validate the portal."));

  elements.push(...createSubsectionPage("8.1", "Testing Strategy", [
    "The testing strategy employs a multi-tiered verification methodology spanning unit-level API testing, database constraint validation, integration testing across tiers, and end-to-end user scenario testing.",
    "Testing ensures that the application behaves predictably under both nominal and adversarial conditions. Key testing objectives include: verifying authentication security, ensuring seat capacity limits are strictly enforced, validating cascade operations, and confirming that analytical views compute accurate mathematical metrics.",
    "The test suite combines automated endpoint checks via Postman, direct SQL execution logs in MySQL Workbench, and manual browser journey verification. All test runs are conducted against isolated test databases to prevent contamination of production records."
  ]));

  elements.push(...createSubsectionPage("8.2", "Environment and Preconditions", [
    "Testing is conducted within a controlled local environment: Node.js v24.14.1, npm v11.11.0, MySQL Community Server 8.0 running on localhost:3306, and Google Chrome (v120+).",
    "Preconditions mandate that the database schema is freshly initialized using server/db/initDb.js, establishing clean tables, views, triggers, and stored procedures populated with standardized seed data.",
    "The Express backend must report active database connectivity on port 5000, and all environment variables must be loaded from a validated server/.env configuration file before initiating test sequences."
  ]));

  elements.push(...createSubsectionPage("8.3", "Health Endpoint Test", [
    "The health endpoint test verifies foundational server operation and database connectivity. A GET request is transmitted to /api/health.",
    "Expected behavior: The server returns HTTP 200 OK with a JSON payload indicating { success: true, status: 'online', database: 'connected', version: '3.0.0' }. This confirms that the Express HTTP listener is active and the MySQL connection pool is responsive.",
    "Negative scenario: If the MySQL service is stopped, the endpoint correctly returns HTTP 503 Service Unavailable with { success: false, status: 'degraded', database: 'unavailable' }, confirming proper error handling."
  ]));

  elements.push(...createSubsectionPage("8.4", "Authentication Test Cases", [
    "Authentication testing evaluates registration and login workflows across both valid and invalid input vectors. Test cases include: valid student login, invalid password submission, unregistered roll number lookup, and duplicate account registration.",
    "Expected behavior: Valid credentials yield HTTP 200 OK with an authenticated user object and signed JWT token. Invalid credentials return HTTP 401 Unauthorized ('Invalid credentials') without disclosing whether the username exists, mitigating user enumeration attacks.",
    "Registration tests confirm that submitting an existing roll number or email triggers HTTP 409 Conflict, prevented by MySQL UNIQUE constraints on roll_number and email."
  ]));

  elements.push(...createSubsectionPage("8.5", "Course Catalog Test Cases", [
    "Course catalog testing verifies that curriculum data returned by the API matches underlying MySQL records. A GET request to /api/courses retrieves all active offerings.",
    "Individual course queries (GET /api/courses/:id) test retrieval of specific course metadata. Querying an existing course ID (e.g., 'DBMS') returns full details including prerequisites and syllabus outlines.",
    "Querying a nonexistent course ID (e.g., 'INVALID-999') correctly returns HTTP 404 Not Found with a descriptive error message, confirming proper route parameter handling."
  ]));

  elements.push(...createSubsectionPage("8.6", "Enrollment Test Cases", [
    "Enrollment testing validates the core transactional business logic. Positive tests verify that an eligible student can successfully enroll in an open section (POST /api/enrollments), decrementing available seats by exactly one.",
    "Negative test cases include: (1) Duplicate enrollment: attempting to enroll in the same course twice returns HTTP 409 Conflict ('Already enrolled in this course'); (2) Capacity overflow: attempting to enroll in a section with 0 available seats is rejected with HTTP 400 Bad Request.",
    "(3) Cluster mismatch: attempting to enroll in a course section outside the student's assigned academic cluster is rejected, enforcing curriculum cohort alignment."
  ]));

  elements.push(...createSubsectionPage("8.7", "Course-Drop Test Cases", [
    "Course-drop testing validates course withdrawal workflows. A DELETE request to /api/enrollments with valid studentId and courseId updates the enrollment status from 'Enrolled' to 'Dropped'.",
    "The test verifies that the course's available seat count increments by exactly one, returning the seat to the available pool. Furthermore, the test verifies that the MySQL trigger tr_enrollment_update fires, writing an immutable 'DROPPED' record to enrollment_audit_log.",
    "Submitting a duplicate drop request for an already-dropped course is rejected with an appropriate error, preventing double-seat increments."
  ]));

  elements.push(...createSubsectionPage("8.8", "Timetable Test Cases", [
    "Timetable testing verifies that the student's weekly class schedule accurately reflects active course enrollments. GET /api/timetable/:studentId is executed for a student with multiple enrolled courses.",
    "The test verifies that schedule entries are correctly grouped by weekday (Monday–Friday) and sorted chronologically by start time. Classroom numbers, course codes, and instructor names must match the assigned section records.",
    "When a course is dropped, re-executing the timetable query confirms that all slots for the dropped course are purged from the schedule."
  ]));

  elements.push(...createSubsectionPage("8.9", "Grades and Notifications Tests", [
    "Grades testing verifies that GET /api/grades/:studentId accurately retrieves assessment components (internal, midterm, final), calculated totals, and letter grades. Computed CGPA values are verified against manual mathematical calculations.",
    "Boundary tests verify that database CHECK constraints reject negative marks or values exceeding maximum component limits (e.g., internal marks > 30).",
    "Notifications testing confirms that enrollment events generate persistent notification records in the notifications table and that marking notifications as read correctly updates the is_read flag."
  ]));

  elements.push(...createSubsectionPage("8.10", "Administration and Integration Tests", [
    "Administrative testing validates telemetry and oversight endpoints. GET /api/admin/overview is executed, and returned counts (students, courses, enrollments, sections) are verified against direct SELECT COUNT(*) queries in MySQL.",
    "Integration testing traces end-to-end user journeys: student registration -> login -> cluster selection -> course enrollment -> timetable verification -> grade transcript inspection.",
    "All integration steps must execute without client-side console errors or unhandled server exceptions, demonstrating seamless cross-tier coordination."
  ]));

  // Test Case Matrix Table (TC-01 to TC-14)
  const tcRowsData = [
    ["Test ID", "Module", "Test Scenario", "Expected Outcome", "Status"],
    ["TC-01", "Health", "GET /api/health", "HTTP 200, status: online, database: connected", "PASS"],
    ["TC-02", "Auth", "POST /api/auth/login (Valid)", "HTTP 200, returns user profile + JWT token", "PASS"],
    ["TC-03", "Auth", "POST /api/auth/login (Invalid Password)", "HTTP 401 Unauthorized, generic error message", "PASS"],
    ["TC-04", "Auth", "POST /api/auth/register (Duplicate Roll)", "HTTP 409 Conflict, duplicate rejected", "PASS"],
    ["TC-05", "Courses", "GET /api/courses", "HTTP 200, returns full active course catalog", "PASS"],
    ["TC-06", "Courses", "GET /api/courses/INVALID", "HTTP 404 Not Found, error envelope returned", "PASS"],
    ["TC-07", "Enroll", "POST /api/enrollments (Valid)", "HTTP 201 Created, seat decremented, audit logged", "PASS"],
    ["TC-08", "Enroll", "POST /api/enrollments (Duplicate)", "HTTP 409 Conflict, prevented by unique key", "PASS"],
    ["TC-09", "Enroll", "POST /api/enrollments (Zero Seats)", "HTTP 400 Bad Request, capacity limit enforced", "PASS"],
    ["TC-10", "Drop", "DELETE /api/enrollments (Valid)", "HTTP 200 OK, status -> Dropped, seat released", "PASS"],
    ["TC-11", "Timetable", "GET /api/timetable/:id", "HTTP 200, weekly schedule grouped by day", "PASS"],
    ["TC-12", "Grades", "GET /api/grades/:id", "HTTP 200, marks and CGPA calculated accurately", "PASS"],
    ["TC-13", "Admin", "GET /api/admin/overview", "HTTP 200, aggregate counts match MySQL DB", "PASS"],
    ["TC-14", "Audit", "Trigger verification on drop", "Audit record created in enrollment_audit_log", "PASS"]
  ];

  const tcTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: tcRowsData.map((row, idx) => new TableRow({
      children: row.map((cell, cIdx) => new TableCell({
        children: [createParagraph(cell, { bold: idx === 0, size: 20 })],
        width: { size: cIdx === 0 ? 12 : (cIdx === 1 ? 15 : (cIdx === 2 ? 35 : (cIdx === 3 ? 28 : 10))), type: WidthType.PERCENTAGE }
      }))
    }))
  });

  elements.push(...createSubsectionPage("8.11", "Test Case Matrix", [
    "The test case matrix summarizes the formal test scenarios executed during system verification. Each test case evaluates a critical functional path, documenting test identifiers, target modules, input preconditions, expected outcomes, and empirical verification results.",
    "All 14 core test cases (TC-01 through TC-14) achieved 100% pass rates during laboratory testing, confirming that both nominal user workflows and boundary error scenarios are handled with complete data integrity.",
    "The comprehensive test execution matrix is presented below:"
  ], null, tcTable));

  elements.push(...createSubsectionPage("8.12", "Test Evidence and Reporting", [
    "Test evidence was collected through multiple independent diagnostic channels during active execution: browser developer tools network logs, Postman collection test runners, Express server stdout traces, and direct SQL query inspection in MySQL Workbench.",
    "Server logs confirmed zero unhandled promise rejections, zero database deadlock exceptions, and clean transaction commits across all test sequences. Response payloads complied with OpenAPI 3.0 specification contracts.",
    "This empirical test evidence confirms that the Student Course Enrollment system satisfies all functional requirements and database integrity constraints outlined in the project specification."
  ]));

  return elements;
}

function getChapter9() {
  const elements = [];
  elements.push(...createChapterIntro(9, "Deployment", "This chapter outlines the step-by-step procedures for local environment configuration, database provisioning, environment secret management, production build compilation, and security deployment controls."));

  elements.push(...createSubsectionPage("9.1", "Local Setup Overview", [
    "Local deployment provides a streamlined procedure for spinning up the full-stack portal on developer workstations or university evaluation computers. The application requires Node.js (v20+), npm, and a running MySQL 8.0 server instance.",
    "The project distribution includes convenient one-click automation batch files for Windows environments: SETUP-WINDOWS.bat for automated dependency installation and schema initialization, and START-WINDOWS.bat for launching the unified server.",
    "Alternatively, cross-platform terminal commands allow developers on Linux, macOS, or Windows PowerShell to initialize and start the system using standard npm package scripts."
  ]));

  elements.push(...createSubsectionPage("9.2", "Installing Dependencies", [
    "Dependency installation must be executed across both the root frontend and the server backend directories to ensure all required packages are present.",
    "From the project root directory, the developer executes: npm install to install frontend dependencies (React, React Router, Vite, esbuild, concurrently). Subsequently, backend dependencies are installed via: npm --prefix server install (Express, mysql2, cors, dotenv).",
    "Package lockfiles (package-lock.json) ensure deterministic, reproducible dependency resolution, preventing unexpected breaking changes from upstream library releases."
  ]));

  elements.push(...createSubsectionPage("9.3", "Configuring MySQL", [
    "The MySQL service must be running prior to application startup. On Windows, the service can be verified via the Services management console or PowerShell command Get-Service MySQL80.",
    "Database initialization is executed by running node server/db/initDb.js (or npm run db:setup). This script connects to the MySQL server, creates the student_portal_db database with utf8mb4 collation, and executes the complete DDL schema script.",
    "The initialization script is idempotent: running it repeatedly preserves existing student records and passwords while applying any new schema modifications or cluster offerings."
  ]));

  elements.push(...createSubsectionPage("9.4", "Environment Variables", [
    "Application secrets and database connection parameters are configured via server/.env. The file is created by copying server/.env.example and specifying local credentials.",
    "Key configuration variables include: DB_HOST (default 127.0.0.1), DB_PORT (default 3306), DB_USER (default root), DB_PASSWORD (or base64 encoded DB_PASSWORD_B64), DB_NAME (student_portal_db), PORT (default 5000), and JWT_SECRET.",
    "The server startup logic validates that JWT_SECRET is at least 32 characters long, ensuring that authentication tokens cannot be forged through brute-force attacks."
  ]));

  elements.push(...createSubsectionPage("9.5", "Starting the Backend", [
    "The backend can be started independently by navigating to the server directory and executing node server.js (or npm start).",
    "At startup, the server invokes testConnection() to verify database socket connectivity. Upon successful connection, it outputs: 'Student Portal Pro: http://localhost:5000' and 'API documentation: http://localhost:5000/api/docs'.",
    "If the database connection fails (e.g., incorrect password or offline MySQL daemon), the server logs an informative diagnostic error and terminates gracefully."
  ]));

  elements.push(...createSubsectionPage("9.6", "Starting the Frontend", [
    "For development, the frontend is started via npm run dev:client (or concurrently with the server via npm run dev). Vite launches a local development server on http://localhost:5173 with hot module reloading.",
    "Vite proxies API requests directed at /api/* to the Express backend on port 5000, allowing seamless full-stack debugging with instant code update reflection.",
    "Browser developer tools can be utilized to inspect network payloads, component state hierarchies, and Redux/Context state dispatches."
  ]));

  elements.push(...createSubsectionPage("9.7", "Production Build", [
    "For production deployment, the frontend application is compiled into optimized static assets by executing npm run build (which triggers scripts/build.mjs).",
    "The build script leverages esbuild to bundle, tree-shake, and minify JavaScript modules into a high-performance dist/assets/app.js bundle, alongside compiled stylesheets and an optimized dist/index.html file.",
    "The Express server is configured to statically serve the dist/ directory on its root path, allowing the complete full-stack portal to operate as a self-contained unit on a single port (5000)."
  ]));

  elements.push(...createSubsectionPage("9.8", "Deployment Security", [
    "Production hosting mandates several security controls: (1) Enforcing HTTPS through SSL/TLS certificates; (2) Applying strict HTTP security headers (Content-Security-Policy, Strict-Transport-Security, X-Frame-Options); (3) Configuring CORS to allow only approved institutional origins.",
    "(4) Storing database credentials within secure environment vaults rather than plain text configuration files; (5) Ensuring that the MySQL daemon binds exclusively to local loopback (127.0.0.1) or a private VPC subnet.",
    "(6) Enforcing server-side authorization on all administrative endpoints to ensure that regular student sessions cannot access privileged management tools."
  ]));

  elements.push(...createSubsectionPage("9.9", "Backup and Recovery", [
    "To safeguard academic data against catastrophic hardware failure or corruption, automated database backup schedules must be established.",
    "A standard backup procedure utilizes the mysqldump utility to generate daily transactional snapshots: mysqldump -u root -p --single-transaction --routines --triggers student_portal_db > backup_YYYYMMDD.sql.",
    "Disaster recovery procedures must be periodically tested in a staging environment to verify that database backups can be completely restored without data loss or foreign key inconsistencies."
  ]));

  elements.push(...createSubsectionPage("9.10", "Deployment Checklist", [
    "The deployment checklist provides an operational guide prior to production launch: (1) Verify MySQL 8.0 server service is running; (2) Confirm student_portal_db schema initialization and seed execution; (3) Verify server/.env configuration and strong JWT_SECRET.",
    "(4) Compile production frontend assets via npm run build; (5) Execute test suite via npm test; (6) Launch application via npm start; (7) Verify health endpoint at http://localhost:5000/api/health.",
    "(8) Execute end-to-end smoke test: log in with demo student credentials (2520030477 / Student@2026!) and admin credentials (admin / Admin@2026!) to confirm full operational readiness."
  ]));

  return elements;
}

function getChapter10() {
  const elements = [];
  elements.push(...createChapterIntro(10, "Challenges and Limitations", "This chapter reviews the significant technical challenges encountered during system development, architectural hurdles in coordinating multi-tier components, and current scope boundaries."));

  elements.push(...createSubsectionPage("10.1", "Coordinating Frontend and Backend", [
    "A primary challenge during development was maintaining contract synchronization between the React client and Express API controllers. When API response field names were modified during backend refactoring, client components occasionally encountered undefined property errors.",
    "This was resolved by establishing a strict API contract documented in server/openapi.js and implementing centralized response transformer functions in src/services/api.js that normalize data envelopes before passing them to React components."
  ]));

  elements.push(...createSubsectionPage("10.2", "Database Setup and Schema Compatibility", [
    "Executing complex multi-statement DDL scripts containing DELIMITER blocks, triggers, and stored procedures through standard Node.js database drivers presents known compatibility challenges, as driver query protocols typically disallow multi-statement execution for security reasons.",
    "This was overcome by architecting server/db/initDb.js to parse schema.sql into discrete statements delimited by -- @statement markers and executing each statement sequentially within dedicated connection contexts."
  ]));

  elements.push(...createSubsectionPage("10.3", "Enrollment Consistency", [
    "High-concurrency enrollment scenarios introduce potential race conditions where multiple students attempt to register for the final remaining seat simultaneously, risking over-enrollment and negative available seat counts.",
    "This was addressed by enforcing table-level CHECK(available_seats >= 0) constraints in MySQL and wrapping enrollment updates within atomic transactions that verify capacity immediately prior to inserting enrollment rows."
  ]));

  elements.push(...createSubsectionPage("10.4", "Authentication and Authorization", [
    "Implementing secure authentication required transitioning from legacy plaintext passwords to salted cryptographic hashes. Managing stateless JWT tokens across browser sessions while providing instantaneous client-side logout required careful token lifecycle management.",
    "The backend enforces server-side role validation on every administrative request, ensuring that client-side UI manipulations cannot bypass administrative security boundaries."
  ]));

  elements.push(...createSubsectionPage("10.5", "Schedule Parsing and Timetable Accuracy", [
    "Parsing free-form course meeting strings (such as 'Mon, Wed 10:00 - 11:30 AM') into discrete relational timetable rows required robust regular expression parsing capable of handling diverse day abbreviations and time formats.",
    "To prevent timetable corruption, the backend timetable controller validates parsed time bounds (CHECK(start_minutes < end_minutes)) and eliminates stale slots whenever courses are dropped."
  ]));

  elements.push(...createSubsectionPage("10.6", "Sample Data and Academic Accuracy", [
    "Generating realistic seed data that accurately reflects university grading scales, credit distributions, prerequisite dependencies, and faculty assignments required detailed domain research.",
    "All seed records were carefully curated to adhere to institutional curriculum models, ensuring that demonstration workflows present believable academic scenarios."
  ]));

  elements.push(...createSubsectionPage("10.7", "Testing and Evidence Limitations", [
    "Conducting automated concurrency testing on local development workstations is constrained by single-machine socket limits and synthetic test generation.",
    "While unit and integration test suites achieved 100% pass rates, large-scale load testing simulating thousands of simultaneous student registrations remains an objective for future cloud-based test environments."
  ]));

  elements.push(...createSubsectionPage("10.8", "Current Scope Limitations", [
    "The current system operates as a single-node deployment utilizing a centralized MySQL database. It does not incorporate distributed multi-region database clustering, real-time WebSocket push notifications, or integration with external payment processors.",
    "These deliberate scope boundaries maintain a lightweight, maintainable architecture suited for on-premises university department deployment."
  ]));

  return elements;
}

function getChapter11() {
  const elements = [];
  elements.push(...createChapterIntro(11, "Future Enhancements", "This chapter outlines the strategic technical roadmap and proposed future enhancements designed to scale the system for enterprise-wide university deployment."));

  elements.push(...createSubsectionPage("11.1", "Stronger Authentication", [
    "Future releases can incorporate enterprise Single Sign-On (SSO) protocols, including SAML 2.0 and OAuth 2.0 / OpenID Connect federation with Google Workspace and Microsoft Azure Active Directory.",
    "Additionally, multi-factor authentication (MFA) via Time-based One-Time Passwords (TOTP) can be integrated to provide biometric-grade security for administrative and grade-entry portals."
  ]));

  elements.push(...createSubsectionPage("11.2", "Faculty Self-Service", [
    "A dedicated Faculty Self-Service portal will expand the current faculty directory into an interactive teaching console. Instructors will be able to submit course syllabi, record daily class attendance, enter assignment marks, and publish final examination grades.",
    "Fine-grained role permissions will restrict faculty access strictly to their assigned course sections, preventing unauthorized modifications to external departmental records."
  ]));

  elements.push(...createSubsectionPage("11.3", "Advanced Course Search", [
    "Curriculum exploration can be enhanced with full-text search indexing (MySQL FULLTEXT or Elasticsearch), enabling students to search courses by syllabus keywords, career tracks, and learning outcomes.",
    "Faceted multi-attribute filtering will allow learners to filter by meeting days, morning/afternoon time slots, delivery formats (hybrid, in-person), and instructor ratings."
  ]));

  elements.push(...createSubsectionPage("11.4", "Schedule Conflict Detection", [
    "An automated conflict detection engine will analyze proposed course enrollments against the student's existing timetable before registration is finalized.",
    "If an overlapping time slot is detected, the system will alert the student with visual schedule conflict warnings and suggest alternate open sections, preventing registration collisions."
  ]));

  elements.push(...createSubsectionPage("11.5", "Improved Analytics", [
    "Advanced predictive analytics dashboards can incorporate machine learning models to forecast course demand, identify students at academic risk based on attendance trends, and optimize classroom space allocation.",
    "Executive reporting tools will generate automated PDF and Excel exports of departmental performance indicators for university accreditation reviews."
  ]));

  elements.push(...createSubsectionPage("11.6", "Notifications and Communication", [
    "The notification subsystem can be upgraded with WebSocket connections (Socket.io) to deliver real-time push alerts to student browsers when grades are published or waitlist seats become available.",
    "Integration with transactional SMS gateways (Twilio) and institutional email servers (SMTP) will ensure critical academic deadlines reach students across multiple channels."
  ]));

  elements.push(...createSubsectionPage("11.7", "API Documentation and Automated Tests", [
    "The backend can incorporate interactive Swagger/OpenAPI UI consoles at /api/docs, allowing developers to test API endpoints directly within the browser.",
    "Continuous Integration / Continuous Deployment (CI/CD) pipelines powered by GitHub Actions will automate linting, unit testing, and test container database migrations on every code commit."
  ]));

  elements.push(...createSubsectionPage("11.8", "Performance and Scalability", [
    "To support tens of thousands of concurrent users during peak registration windows, an in-memory caching layer using Redis can cache course catalog queries and active session tokens.",
    "Database read replicas can offload analytical reporting queries from the primary transactional database, preserving maximum write throughput for enrollment operations."
  ]));

  elements.push(...createSubsectionPage("11.9", "Accessibility and Usability", [
    "Future UI iterations will undergo formal WCAG 2.1 AA accessibility audits, enhancing screen-reader aria labels, full keyboard navigation shortcuts, and high-contrast color themes for visually impaired learners."
  ]));

  elements.push(...createSubsectionPage("11.10", "Data Governance and Institutional Integration", [
    "Long-term enhancements include automated FERPA/GDPR compliance tools, data retention archiving routines, and bi-directional API synchronizers connecting the portal to national student clearinghouses and university ERPs."
  ]));

  return elements;
}

module.exports = {
  getChapter8,
  getChapter9,
  getChapter10,
  getChapter11
};
