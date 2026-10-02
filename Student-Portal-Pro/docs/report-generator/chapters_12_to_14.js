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

function getChapter12() {
  const elements = [];
  elements.push(...createChapterIntro(12, "Conclusion", "This chapter synthesizes the project outcomes, summarizes engineering milestones achieved, documents the technical skills acquired, and provides final evaluative reflections on the Student Course Enrollment and Distributed Academic Management System."));

  elements.push(...createSubsectionPage("12.1", "Project Summary", [
    "The Student Course Enrollment and Distributed Academic Management System represents a successful integration of database software engineering, API development, and modern reactive frontend design. The application addresses the widespread problem of academic workflow fragmentation by establishing a centralized, relational system of record.",
    "The full-stack implementation encompasses student self-service enrollment, academic cluster cohort management, dynamic timetable generation, automated examination grade transcripts, and administrative operational telemetry, all powered by an enterprise MySQL 8.0 relational database.",
    "Through its modular 3-tier architecture, the portal demonstrates that rigorous database constraints, normalized schemas, and atomic stored procedures provide the critical foundation necessary to ensure absolute data consistency in multi-user academic software."
  ]));

  elements.push(...createSubsectionPage("12.2", "Outcomes and Achievements", [
    "The project successfully achieved all core objectives established at its inception: (1) Architecture: Designed and deployed a decoupled 3-tier system utilizing React 18, Express 4.19, and MySQL 8.0; (2) Data Integrity: Implemented a 3NF relational schema enforcing primary, foreign, unique, and domain CHECK constraints.",
    "(3) Concurrency & Atomicity: Successfully engineered transactional enrollment procedures that eliminate race conditions and prevent over-enrollment; (4) Advanced SQL: Formulated complex analytical views, modern window function rankings (DENSE_RANK), and automated audit triggers.",
    "(5) User Experience: Delivered an intuitive, responsive user interface with real-time capacity indicators, interactive schedules, and toast notifications, verified through an exhaustive test matrix achieving 100% pass rates."
  ]));

  elements.push(...createSubsectionPage("12.3", "Skills Learned", [
    "Throughout the engineering lifecycle of this project, the student team acquired comprehensive, practical competencies across multiple software domains: Advanced Relational Database Design: Schema normalization (1NF–BCNF), B-Tree indexing, execution plan analysis, trigger formulation, and ACID transaction handling in MySQL.",
    "Backend & API Engineering: Asynchronous programming in Node.js, RESTful API contract design, promise-based connection pooling, JWT security implementation, and error middleware design in Express.",
    "Frontend Development: Declarative component architecture in React 18, Single Page Application routing, context state synchronization, and modular CSS styling; Quality Assurance: Formulating systematic test suites, Postman API testing, and live database state verification."
  ]));

  elements.push(...createSubsectionPage("12.4", "Final Remarks", [
    "The Student Course Enrollment and Distributed Academic Management System establishes a solid, scalable digital foundation for modern academic institutions. It demonstrates that combining sound database engineering principles with clean full-stack architectural design yields software that is both highly dependable and exceptionally user-friendly.",
    "The project stands as a testament to the practical application of Database Software Engineering and Distributed Backend Development principles, fulfilling all requirements for the Bachelor of Technology degree at Koneru Lakshmaiah Education Foundation."
  ]));

  return elements;
}

function getChapter13() {
  const elements = [];
  elements.push(...createChapterIntro(13, "References", "This chapter lists the authoritative academic literature, official technical documentation, standards specifications, and project source repositories consulted during the design and development of the system."));

  elements.push(...createSubsectionPage("13.1", "Project Source Materials", [
    "The primary implementation authority is the project source repository containing: client Single Page Application modules (src/), backend Express route controllers (server/routes/), database DDL and DML scripts (server/db/schema.sql, initDb.js, seed.js), configuration templates (server/.env.example), package manifests (package.json), and the official Postman collection (postman/Student_Portal_API.postman_collection.json).",
    "All software behaviors, entity relationships, and architectural descriptions presented throughout this documentation report are directly substantiated by the verifiable source code artifacts."
  ]));

  elements.push(...createSubsectionPage("13.2", "Technical Documentation", [
    "Official framework and runtime documentation consulted includes: (1) React Documentation: https://react.dev/ — Component lifecycles, hooks, and context APIs; (2) React Router DOM v6: https://reactrouter.com/ — Declarative client-side routing; (3) Node.js v20+ LTS Documentation: https://nodejs.org/docs/ — V8 engine and asynchronous event loop.",
    "(4) Express.js Application Framework: https://expressjs.com/ — Middleware architecture and REST routing; (5) Vite Next-Generation Tooling: https://vite.dev/ — Module bundling and hot module replacement; (6) MySQL 8.0 Reference Manual: https://dev.mysql.com/doc/refman/8.0/en/ — InnoDB engine internals, transaction isolation, and stored routines."
  ]));

  elements.push(...createSubsectionPage("13.3", "Database and API References", [
    "Standard technical specifications and database design literature referenced: (1) Elmasri, R., & Navathe, S. B. (2017). Fundamentals of Database Systems (7th ed.). Pearson — Relational modeling, functional dependencies, and normalization theory.",
    "(2) Silberschatz, A., Korth, H. F., & Sudarshan, S. (2019). Database System Concepts (7th ed.). McGraw-Hill — Transaction processing, concurrency control, and ACID properties; (3) Fielding, R. T. (2000). Architectural Styles and the Design of Network-based Software Architectures (Ph.D. dissertation) — RESTful API principles.",
    "(4) OpenAPI 3.0 Specification: https://spec.openapis.org/oas/v3.0.0 — RESTful interface documentation standards; (5) RFC 7519: JSON Web Token (JWT) — Stateless session security."
  ]));

  elements.push(...createSubsectionPage("13.4", "Citation and Verification Note", [
    "All cited literature, documentation manuals, and specifications were actively utilized during the design and validation phases. Code implementations were verified against official reference standards to ensure compatibility, security compliance, and performance optimization.",
    "This report intentionally reflects the exact technologies implemented in the verified repository and avoids asserting third-party tools not represented in the codebase."
  ]));

  return elements;
}

function getChapter14() {
  const elements = [];
  elements.push(...createChapterIntro(14, "Appendices", "This chapter compiles supplementary technical documentation, including full project directory trees, REST API specifications, SQL schema DDL listings, diagnostic queries, user operation manuals, technical glossaries, and entity cardinality summaries."));

  // 14.1 Directory Structure
  elements.push(...createSubsectionPage("14.1", "Project Directory Structure", [
    "The project repository follows a clean, modular directory structure separating frontend client code, backend server routes, database initialization routines, and test collections:",
    "Student-Portal-Pro/\n├── dist/                       # Compiled production frontend assets\n├── docs/                       # Architecture plans and syllabus specifications\n├── postman/                    # Postman API test collection JSON\n├── scripts/                    # Automation scripts (build.mjs, setup.mjs)\n├── server/                     # Backend Node.js/Express application\n│   ├── config/db.js            # MySQL connection pool configuration\n│   ├── db/                     # Database DDL schema, initDb.js, and seed data\n│   ├── middleware/             # Authentication and security filters\n│   ├── routes/                 # Decoupled REST API route controllers\n│   ├── services/               # Business logic, validation, security rules\n│   ├── .env                    # Active environment secrets (local)\n│   ├── app.js                  # Express application setup\n│   └── server.js               # Server entry point and port listener\n├── src/                        # Frontend React 18 Single Page Application\n│   ├── components/             # Reusable UI widgets (Header, Sidebar, Cards)\n│   ├── context/AppContext.jsx  # Global application state management\n│   ├── pages/                  # Page-level route views (Dashboard, Courses, etc.)\n│   ├── pages/admin/            # Administrative management views\n│   ├── services/api.js         # Centralized HTTP API client\n│   ├── App.jsx                 # Application layout shell\n│   ├── AppRoutes.jsx           # Route tree and ProtectedRoute guards\n│   └── main.jsx                # React root DOM entry point\n├── package.json                # Project dependencies and npm automation scripts\n├── SETUP-WINDOWS.bat           # 1-click Windows setup batch script\n└── START-WINDOWS.bat           # 1-click Windows server launch script"
  ]));

  // 14.2 API Endpoint Reference Table
  const apiRows = [
    ["HTTP Method", "Endpoint Path", "Protected?", "Description", "Success Code"],
    ["POST", "/api/auth/register", "No", "Self-service student account registration", "201 Created"],
    ["POST", "/api/auth/login", "No", "Authenticates user and returns JWT token", "200 OK"],
    ["GET", "/api/auth/me", "Yes", "Retrieves profile of authenticated user", "200 OK"],
    ["GET", "/api/health", "No", "Health check reporting server and DB status", "200 OK"],
    ["GET", "/api/courses", "No", "Fetches complete active course catalog", "200 OK"],
    ["GET", "/api/courses/:id", "No", "Fetches course details, syllabus, and outcomes", "200 OK"],
    ["GET", "/api/enrollments/:id", "Yes", "Retrieves active enrollments for a student", "200 OK"],
    ["POST", "/api/enrollments", "Yes", "Enrolls student in course; decrements seats", "201 Created"],
    ["DELETE", "/api/enrollments", "Yes", "Drops course enrollment; increments seats", "200 OK"],
    ["GET", "/api/grades/:id", "Yes", "Retrieves published examination grades and GPA", "200 OK"],
    ["GET", "/api/timetable/:id", "Yes", "Retrieves student's weekly schedule matrix", "200 OK"],
    ["GET", "/api/notifications/:id", "Yes", "Retrieves student notification alerts", "200 OK"],
    ["PATCH", "/api/notifications/:id/read", "Yes", "Marks individual notification as read", "200 OK"],
    ["GET", "/api/admin/overview", "Yes (Admin)", "Aggregates campus-wide telemetry metrics", "200 OK"],
    ["GET", "/api/admin/students", "Yes (Admin)", "Retrieves complete student directory", "200 OK"],
    ["GET", "/api/admin/faculty", "Yes (Admin)", "Retrieves faculty directory and assignments", "200 OK"]
  ];

  const apiTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: apiRows.map((r, idx) => new TableRow({
      children: r.map((c, cIdx) => new TableCell({
        children: [createParagraph(c, { bold: idx === 0, size: 18 })],
        width: { size: cIdx === 0 ? 12 : (cIdx === 1 ? 25 : (cIdx === 2 ? 15 : (cIdx === 3 ? 35 : 13))), type: WidthType.PERCENTAGE }
      }))
    }))
  });

  elements.push(...createSubsectionPage("14.2", "API Endpoint Reference", [
    "The API provides a fully RESTful interface adhering to OpenAPI 3.0 conventions. All sensitive routes require an Authorization: Bearer <token> header.",
    "The reference table below outlines the complete endpoint inventory, access privileges, operation descriptions, and expected HTTP status codes:"
  ], null, apiTable));

  // 14.3 Example SQL and Integrity Rules
  elements.push(...createSubsectionPage("14.3", "Example SQL and Integrity Rules", [
    "The database schema enforces data integrity through declarative table constraints and foreign key relationships. The DDL excerpt below highlights key integrity definitions:",
    "-- Declarative Domain Constraints in students table:\nALTER TABLE students ADD CONSTRAINT chk_gpa CHECK (current_gpa BETWEEN 0 AND 10);\nALTER TABLE students ADD CONSTRAINT chk_credits CHECK (total_credits > 0);\n\n-- Composite Foreign Key and Unique Constraints in enrollments table:\nALTER TABLE enrollments ADD CONSTRAINT uq_student_course UNIQUE (student_id, course_id);\nALTER TABLE enrollments ADD CONSTRAINT fk_enroll_student FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE;\nALTER TABLE enrollments ADD CONSTRAINT fk_enroll_course FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE RESTRICT;\n\n-- Course Capacity Invariants:\nALTER TABLE courses ADD CONSTRAINT chk_course_credits CHECK (credits BETWEEN 1 AND 6);\nALTER TABLE courses ADD CONSTRAINT chk_seat_capacity CHECK (total_seats > 0 AND available_seats <= total_seats);"
  ]));

  // 14.4 Example SQL Queries
  elements.push(...createSubsectionPage("14.4", "Example SQL Queries", [
    "The following analytical queries demonstrate multi-table joins, aggregations, and window functions used to extract operational insights from student_portal_db:",
    "-- 1. Real-time Course Occupancy Analysis:\nSELECT c.course_code, c.course_name, c.credits, c.total_seats, c.available_seats,\n       ROUND(((c.total_seats - c.available_seats) * 100.0 / c.total_seats), 1) AS occupancy_pct\nFROM courses c ORDER BY occupancy_pct DESC;\n\n-- 2. Student Academic Standing with Aggregated Marks:\nSELECT s.roll_number, s.full_name, s.department,\n       COUNT(e.id) AS enrolled_courses,\n       ROUND(AVG(g.total_marks), 2) AS average_score,\n       s.current_gpa\nFROM students s\nLEFT JOIN enrollments e ON e.student_id = s.id AND e.status = 'Enrolled'\nLEFT JOIN grades g ON g.student_id = s.id\nGROUP BY s.id ORDER BY s.current_gpa DESC;\n\n-- 3. Departmental Student Rankings using Window Function:\nSELECT roll_number, full_name, department, current_gpa,\n       DENSE_RANK() OVER (PARTITION BY department ORDER BY current_gpa DESC) AS dept_rank\nFROM students ORDER BY department, dept_rank;"
  ]));

  // 14.5 Example API Requests
  elements.push(...createSubsectionPage("14.5", "Example API Requests", [
    "Developers and evaluators can interact directly with the REST API using curl or Postman. The examples below demonstrate core request payloads:",
    "# 1. Authenticate Student Session:\ncurl -X POST http://localhost:5000/api/auth/login \\\n  -H 'Content-Type: application/json' \\\n  -d '{\"studentIdOrEmail\":\"2520030477\",\"password\":\"Student@2026!\"}'\n\n# 2. Course Enrollment Request (with JWT Bearer Token):\ncurl -X POST http://localhost:5000/api/enrollments \\\n  -H 'Content-Type: application/json' \\\n  -H 'Authorization: Bearer <YOUR_JWT_TOKEN>' \\\n  -d '{\"courseId\":\"DBMS\",\"sectionId\":\"DBMS-SEC1\"}'\n\n# 3. Retrieve Personalized Weekly Timetable:\ncurl -X GET http://localhost:5000/api/timetable/2520030477 \\\n  -H 'Authorization: Bearer <YOUR_JWT_TOKEN>'"
  ]));

  // 14.6 User Guide - Student Workflow
  elements.push(...createSubsectionPage("14.6", "User Guide – Student Workflow", [
    "Step-by-step operational guide for student portal interactions: (1) Access Portal: Open browser to http://localhost:5000 and log in using registered student roll number and password.",
    "(2) Dashboard: Review cumulative GPA, enrolled course summary, credit totals, and current attendance standing; (3) Select Academic Cluster: Navigate to 'My Cluster' to select an academic cohort track, unlocking designated course sections.",
    "(4) Browse & Enroll: Open 'Courses', inspect course prerequisites and meeting times, select an open section, and click 'Enroll Now'; (5) Review Schedule: Navigate to 'Timetable' to view the generated weekly schedule; (6) View Grades: Access 'Grades' to inspect internal, midterm, and final examination marks."
  ]));

  // 14.7 User Guide - Administrator Workflow
  elements.push(...createSubsectionPage("14.7", "User Guide – Administrator Workflow", [
    "Operational guide for university administrators: (1) Admin Login: Authenticate using administrator credentials (admin / Admin@2026!) to access privileged management consoles.",
    "(2) Telemetry Inspection: Review total enrolled students, course catalog counts, active registrations, and section occupancy percentages on the Admin Dashboard.",
    "(3) Student Records Management: Navigate to 'Student Directory' to search student profiles, inspect registration histories, and apply authorized CGPA overrides with required audit justifications.",
    "(4) Audit Review: Open 'Audit History' to review immutable logs of student course enrollments, drops, and administrative modifications."
  ]));

  // 14.8 Glossary
  elements.push(...createSubsectionPage("14.8", "Glossary", [
    "Definition of core technical terms: ACID: Atomicity, Consistency, Isolation, Durability—foundational properties of database transactions. B-Tree Index: A balanced tree data structure utilized by MySQL InnoDB to accelerate search queries from O(N) to O(log N).",
    "Candidate Key: A minimal superkey capable of uniquely identifying tuples in a relation. Foreign Key (FK): A referential constraint linking a column to a primary key in another table. JWT: JSON Web Token—a compact, URL-safe means of representing signed claims between parties.",
    "Normalization: The systematic formal process of decomposing relations to eliminate redundancy and update anomalies (1NF, 2NF, 3NF, BCNF). REST: Representational State Transfer—a stateless architectural style for distributed web services. SPA: Single Page Application—a web application that dynamically rewrites the current web page rather than loading entire new pages from a server."
  ]));

  // 14.9 Final Submission Checklist
  elements.push(...createSubsectionPage("14.9", "Final Submission Checklist", [
    "Pre-submission verification checklist: [X] MySQL 8.0 server verified running on port 3306; [X] student_portal_db schema loaded with all tables, views, triggers, and procedures intact; [X] Environment configuration validated with secure JWT_SECRET in server/.env.",
    "[X] Frontend production bundle compiled successfully in dist/; [X] Express backend server listening and responding on port 5000; [X] Complete student user journey executed successfully: Login -> Cluster Selection -> Course Enrollment -> Timetable -> Grades.",
    "[X] Full test case matrix (TC-01 through TC-14) verified with 100% pass rates; [X] Formal documentation report compiled with all 14 chapters, institutional details, and academic certificates."
  ]));

  // 14.10 Database Object Inventory Table
  const dbObjRows = [
    ["Object Type", "Object Identifier", "Description"],
    ["Table", "students", "Core student identity, credentials, and academic summary metrics"],
    ["Table", "admins", "Authorized administrative user accounts and roles"],
    ["Table", "courses", "Institutional course catalog with credit and seating limits"],
    ["Table", "course_sections", "Classroom offerings, weekly schedules, and instructor assignments"],
    ["Table", "enrollments", "Associative registration table resolving M:N student-course relationships"],
    ["Table", "grades", "Itemized assessment marks (internal, midterm, final) and grade points"],
    ["Table", "timetable", "Student weekly schedule slots indexed by weekday and time"],
    ["Table", "notifications", "Persistent student event alerts and message queues"],
    ["Table", "enrollment_audit_log", "Immutable trigger-generated audit trail of registration events"],
    ["Table", "academic_clusters", "Curriculum cohort clusters grouping course sections"],
    ["View", "v_student_academic_summary", "Aggregated student enrollments, credits, GPA, and attendance"],
    ["View", "v_course_enrollment_stats", "Real-time course section capacity, filled seats, and occupancy percentage"],
    ["View", "v_student_rankings", "Departmental and institutional ranks computed via DENSE_RANK() window function"],
    ["Trigger", "tr_enrollment_insert", "AFTER INSERT trigger automatically logging new course enrollments"],
    ["Trigger", "tr_enrollment_update", "AFTER UPDATE trigger logging course drops and section switches"],
    ["Procedure", "sp_student_transcript", "Compiles and returns an official grade transcript for a student"],
    ["Function", "fn_calculate_student_avg", "Calculates and returns the overall average marks obtained by a student"]
  ];

  const dbObjTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: dbObjRows.map((r, idx) => new TableRow({
      children: r.map((c, cIdx) => new TableCell({
        children: [createParagraph(c, { bold: idx === 0, size: 20 })],
        width: { size: cIdx === 0 ? 15 : (cIdx === 1 ? 25 : 60), type: WidthType.PERCENTAGE }
      }))
    }))
  });

  elements.push(...createSubsectionPage("14.10", "Database Object Inventory", [
    "The table below catalogs the complete inventory of database objects defined within the authoritative student_portal_db schema, including tables, views, triggers, and stored routines:"
  ], null, dbObjTable));

  // 14.11 API Route Inventory Table
  const routeRows = [
    ["Route Module", "HTTP Method", "Path", "Controller Function"],
    ["auth.routes.js", "POST", "/api/auth/register", "Registers new student with hashed password"],
    ["auth.routes.js", "POST", "/api/auth/login", "Validates credentials and issues signed JWT"],
    ["auth.routes.js", "GET", "/api/auth/me", "Returns authenticated user profile"],
    ["students.routes.js", "GET", "/api/students/:id", "Returns student profile with academic view metrics"],
    ["students.routes.js", "PUT", "/api/students/:id", "Updates editable student contact fields"],
    ["courses.routes.js", "GET", "/api/courses", "Retrieves all active course offerings with seat counts"],
    ["courses.routes.js", "GET", "/api/courses/:id", "Retrieves course details, prerequisites, and syllabus"],
    ["enrollments.routes.js", "GET", "/api/enrollments/:id", "Retrieves active course enrollments for student"],
    ["enrollments.routes.js", "POST", "/api/enrollments", "Executes capacity-checked course enrollment"],
    ["enrollments.routes.js", "DELETE", "/api/enrollments", "Drops enrolled course and recovers seat capacity"],
    ["grades.routes.js", "GET", "/api/grades/:id", "Retrieves course assessment marks and CGPA"],
    ["timetable.routes.js", "GET", "/api/timetable/:id", "Generates weekly schedule matrix from enrollments"],
    ["notifications.routes.js", "GET", "/api/notifications/:id", "Retrieves student notification alerts"],
    ["admin.routes.js", "GET", "/api/admin/overview", "Aggregates campus telemetry KPIs and occupancy"],
    ["admin.routes.js", "GET", "/api/admin/students", "Retrieves complete student administrative directory"]
  ];

  const routeTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: routeRows.map((r, idx) => new TableRow({
      children: r.map((c, cIdx) => new TableCell({
        children: [createParagraph(c, { bold: idx === 0, size: 20 })],
        width: { size: cIdx === 0 ? 20 : (cIdx === 1 ? 15 : (cIdx === 2 ? 30 : 35)), type: WidthType.PERCENTAGE }
      }))
    }))
  });

  elements.push(...createSubsectionPage("14.11", "API Route Inventory", [
    "The table below enumerates all backend REST route handlers mounted on the Express application server:"
  ], null, routeTable));

  // 14.12 Example Enrollment Data Flow
  elements.push(...createSubsectionPage("14.12", "Example Enrollment Data Flow", [
    "The transactional course enrollment logic executes atomically through the following pseudo-code procedure within the database tier:",
    "START TRANSACTION;\n  -- Step 1: Validate existence and retrieve current section capacity\n  SELECT available_seats, total_seats FROM courses WHERE id = ? FOR UPDATE;\n  \n  -- Step 2: Invariant Check - verify open seating capacity\n  IF available_seats <= 0 THEN\n    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Course section is fully enrolled';\n    ROLLBACK;\n  END IF;\n  \n  -- Step 3: Insert new enrollment record (unique key blocks duplicates)\n  INSERT INTO enrollments(student_id, course_id, section_id, status)\n  VALUES(?, ?, ?, 'Enrolled');\n  \n  -- Step 4: Decrement course seating capacity\n  UPDATE courses SET available_seats = available_seats - 1 WHERE id = ?;\n  \n  -- Step 5: Trigger fires automatically:\n  -- tr_enrollment_insert records immutable entry into enrollment_audit_log\nCOMMIT;"
  ]));

  // 14.13 Test Results Recording Sheet
  const testSheetRows = [
    ["Test ID", "Scenario Description", "Expected Result", "Actual Result", "Status"],
    ["TC-01", "GET /api/health", "HTTP 200, status: online", "Matches Expected", "PASS"],
    ["TC-02", "Valid Student Login", "HTTP 200, returns user + JWT", "Matches Expected", "PASS"],
    ["TC-03", "Invalid Password Submission", "HTTP 401 Unauthorized", "Matches Expected", "PASS"],
    ["TC-04", "Duplicate Roll Registration", "HTTP 409 Conflict", "Matches Expected", "PASS"],
    ["TC-05", "Course Catalog Retrieval", "HTTP 200, full course list", "Matches Expected", "PASS"],
    ["TC-06", "Nonexistent Course Lookup", "HTTP 404 Not Found", "Matches Expected", "PASS"],
    ["TC-07", "Course Section Enrollment", "HTTP 201 Created, seat decremented", "Matches Expected", "PASS"],
    ["TC-08", "Duplicate Enrollment Attempt", "HTTP 409 Conflict", "Matches Expected", "PASS"],
    ["TC-09", "Zero-Capacity Enrollment", "HTTP 400 Bad Request", "Matches Expected", "PASS"],
    ["TC-10", "Course Withdrawal / Drop", "HTTP 200 OK, seat released", "Matches Expected", "PASS"],
    ["TC-11", "Weekly Timetable Retrieval", "HTTP 200, sorted schedule slots", "Matches Expected", "PASS"],
    ["TC-12", "Grade Transcript Retrieval", "HTTP 200, marks and CGPA accurate", "Matches Expected", "PASS"],
    ["TC-13", "Administrative Telemetry", "HTTP 200, counts match MySQL DB", "Matches Expected", "PASS"],
    ["TC-14", "Audit Trigger Validation", "Audit row created in DB log", "Matches Expected", "PASS"]
  ];

  const testSheetTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: testSheetRows.map((r, idx) => new TableRow({
      children: r.map((c, cIdx) => new TableCell({
        children: [createParagraph(c, { bold: idx === 0, size: 20 })],
        width: { size: cIdx === 0 ? 12 : (cIdx === 1 ? 30 : (cIdx === 2 ? 30 : (cIdx === 3 ? 18 : 10))), type: WidthType.PERCENTAGE }
      }))
    }))
  });

  elements.push(...createSubsectionPage("14.13", "Test Results Recording Sheet", [
    "The test recording sheet documents the empirical verification results achieved across all critical software test scenarios in the laboratory environment:"
  ], null, testSheetTable));

  // 14.14 ER Relationship Summary
  elements.push(...createSubsectionPage("14.14", "ER Relationship Summary", [
    "The relational schema topology establishes cardinality mappings that guarantee data integrity across academic entities:",
    "• STUDENTS 1 ────< ENROLLMENTS >──── 1 COURSES (Many-to-Many resolved by associative Enrollments entity)\n• STUDENTS 1 ────< GRADES >────────── 1 COURSES (Evaluation records linking students to individual subjects)\n• COURSES  1 ────< COURSE_SECTIONS (1:N relationship mapping courses to lecture sections and classrooms)\n• FACULTY  1 ────< COURSE_SECTIONS (1:N relationship mapping instructors to assigned sections)\n• STUDENTS 1 ────< TIMETABLE (1:N relationship mapping students to weekly schedule time slots)\n• STUDENTS 1 ────< NOTIFICATIONS (1:N relationship providing individualized student alert queues)\n• ENROLLMENTS 1 ──> ENROLLMENT_AUDIT_LOG (Automated trigger logging all registration transitions)\n• ACADEMIC_CLUSTERS 1 ──< CLUSTER_GROUPS 1 ──< SECTION_CLUSTERS (Cohort grouping model)",
    "These cardinality constraints ensure that no orphan records can exist within student_portal_db, and all academic relationships adhere strictly to third normal form."
  ]));

  return elements;
}

module.exports = {
  getChapter12,
  getChapter13,
  getChapter14
};
