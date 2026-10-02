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
const { createParagraph, createHeading, createSubsectionPage, createChapterIntro, erImgPath } = require('./docx_helpers');

function getChapter5() {
  const elements = [];
  elements.push(...createChapterIntro(5, "Design", "This chapter details the relational data model, entity-relationship structures, normalization proofs, schema constraints, indexing strategies, analytical views, and stored database routines defining the Student Course Enrollment database design."));

  elements.push(...createSubsectionPage("5.1", "Design Approach", [
    "The database design adopts a rigorous entity-centric relational modeling approach. Academic entities—including students, academic administrative staff, courses, faculty instructors, course sections, syllabi, enrollments, assessment grades, attendance logs, timetables, notifications, and academic clusters—are partitioned into dedicated relational tables to enforce strict data ownership and eliminate redundancy.",
    "The schema utilizes string natural identifiers for primary academic entities (such as student roll numbers, course codes, and cluster identifiers) to maintain human-readable alignment with university registry standards. For high-frequency transactional and audit records (such as enrollments, grades, and audit trails), auto-increment surrogate integer keys are employed to optimize indexing performance.",
    "Referential integrity is guaranteed through comprehensive foreign key constraints with explicit ON DELETE / ON UPDATE cascade and restrict policies. Domain integrity is enforced at the database engine level through declarative CHECK constraints, ensuring that invalid academic data cannot enter the system."
  ]));

  elements.push(...createSubsectionPage("5.2", "ER Diagram and Relationships", [
    "The Entity-Relationship (ER) model centers upon the fundamental Many-to-Many (M:N) relationship between Students and Courses. Because a student may enroll in multiple courses and a course section accommodates multiple students, this relationship is resolved through the associative Enrollments entity, which records individual student-course-section associations with status and timestamps.",
    "The diagram below presents the complete Entity Relationship Diagram modeled in Crow's Foot notation, detailing entity attributes, primary keys (PK), foreign keys (FK), and relationship cardinalities across all database entities including Students, Courses, Course Sections, Grades, Timetable, and Academic Clusters.",
    "Courses maintain 1:N identifying relationships with Course Syllabus, Course Outcomes, and Course Assessments, and a 1:N relationship with Course Sections. Students maintain 1:N relationships with Grades, Attendance, Timetable slots, Notifications, and Audit entries. Academic Clusters group course sections through Cluster Groups, establishing cohesive cohort boundaries."
  ], erImgPath));

  elements.push(...createSubsectionPage("5.3", "Students Table", [
    "The students table represents the authoritative repository for student identity, institutional affiliation, and cumulative academic metrics. Its primary key is id (VARCHAR(50)), with roll_number and email defined with UNIQUE constraints to prevent duplicate identity creation.",
    "Attributes include full_name, password_hash, phone, department, program, year_level, semester, current_gpa, semester_gpa, total_credits, completed_credits, attendance_rate, created_at, and updated_at. Automated timestamps record account creation and record modifications.",
    "Domain integrity is enforced via declarative CHECK constraints: CHECK(current_gpa BETWEEN 0 AND 10) validates that GPA figures adhere to the standard 10.0 scale, while CHECK(total_credits > 0) prevents erroneous credit allocations. In the production deployment, passwords are encrypted using secure cryptographic hashing algorithms."
  ]));

  elements.push(...createSubsectionPage("5.4", "Courses Table", [
    "The courses table models institutional curriculum offerings. The primary key is id (VARCHAR(50)), with course_code (VARCHAR(30)) constrained as UNIQUE to ensure that curriculum codes (e.g., '25CS1302E') remain unambiguous across catalog terms.",
    "Core attributes include course_name, department, credits, semester, course_type (Core, Elective, Lab), available_seats, total_seats, classroom, schedule, description, and prerequisites. A secondary B-Tree index is established on department to accelerate catalog filtering.",
    "Table-level CHECK constraints enforce valid credit weighting (CHECK(credits BETWEEN 1 AND 6)) and positive seating limits (CHECK(total_seats > 0)). The available_seats counter is dynamically maintained to reflect real-time enrollment capacity."
  ]));

  elements.push(...createSubsectionPage("5.5", "Enrollments Table", [
    "The enrollments table captures the transactional binding between students, courses, and specific course sections. It utilizes an auto-increment integer id (INT AUTO_INCREMENT) as its primary surrogate key.",
    "Foreign keys student_id, course_id, and section_id reference students(id), courses(id), and course_sections(id) respectively. An essential UNIQUE composite constraint—UNIQUE KEY unique_student_course(student_id, course_id)—guarantees that a student cannot be simultaneously enrolled more than once in the same academic course.",
    "The status column is defined as an ENUM('Enrolled', 'Dropped', 'Completed') with a default value of 'Enrolled'. A composite index idx_section_status(section_id, status) accelerates real-time section roster queries and seat availability computations."
  ]));

  elements.push(...createSubsectionPage("5.6", "Grades and Assessment Data", [
    "The grades table archives evaluation results for registered students across individual courses. The table features foreign keys to students(id) and courses(id), protected by a unique composite constraint UNIQUE KEY uq_student_grade(student_id, course_id).",
    "Assessment components are modeled in three weighted tiers: internal_marks (DECIMAL(5,2), max 30), midterm_marks (DECIMAL(5,2), max 20), and final_marks (DECIMAL(5,2), max 50). These combine into total_marks, grade (letter code), and grade_points (0.00 to 10.00).",
    "CHECK constraints validate the score boundaries of each assessment component: CHECK(internal_marks BETWEEN 0 AND 30), CHECK(midterm_marks BETWEEN 0 AND 20), CHECK(final_marks BETWEEN 0 AND 50), and CHECK(grade_points BETWEEN 0 AND 10). Grade statuses transition from 'Draft' to 'Published' upon faculty finalization."
  ]));

  elements.push(...createSubsectionPage("5.7", "Faculty and Course Sections", [
    "The faculty table stores academic teaching personnel records, including faculty_id (UNIQUE), full_name, designation, department, email, phone, office room, and qualifications. This entity enables institutional staff tracking.",
    "Course offerings are instantiated through the course_sections table, which links courses to physical classrooms, weekly meeting schedules, and designated faculty instructors. The table enforces a unique constraint UNIQUE KEY uq_course_section(course_id, section_number).",
    "Foreign keys connect section_id to courses(id) and faculty_id to faculty(id). Each section specifies total_seats, enabling fine-grained capacity management per lecture group rather than relying solely on global course totals."
  ]));

  elements.push(...createSubsectionPage("5.8", "Timetable Design", [
    "The timetable table records the personalized weekly academic schedule for each student. Attributes include student_id, course_id, section_id, day_of_week (e.g., 'Monday', 'Wednesday'), time_slot, start_minutes, end_minutes, classroom, and course_type.",
    "The table enforces a unique constraint UNIQUE KEY uq_student_course_day(student_id, course_id, day_of_week) to prevent duplicate schedule entries for the same course on a given weekday. A CHECK constraint CHECK(start_minutes < end_minutes) validates time order.",
    "Foreign keys link timetable entries directly to students, courses, and course_sections. When a student drops a course, the backend automatically purges corresponding timetable slots, maintaining perfect schedule synchronization."
  ]));

  elements.push(...createSubsectionPage("5.9", "Notifications and Audit Logging", [
    "The notifications table provides asynchronous event messaging for students. Attributes include id (UUID), student_id (FK), title, message, category, is_read (BOOLEAN), and created_at. An index on (student_id, is_read) optimizes unread notification counter queries.",
    "The enrollment_audit_log table provides an immutable, append-only operational history of all enrollment modifications. Attributes include log_id (PK), student_id, course_id, action_type (ENROLLED, DROPPED, SWITCHED), remarks, and log_timestamp.",
    "Crucially, entries in enrollment_audit_log are generated automatically by database triggers, ensuring that audit trails cannot be bypassed or manipulated by application-level code."
  ]));

  elements.push(...createSubsectionPage("5.10", "Keys, Constraints, and Normalization", [
    "The database schema is mathematically normalized to Third Normal Form (3NF) and Boyce-Codd Normal Form (BCNF). First Normal Form (1NF) is satisfied because all attribute values are atomic, and there are no repeating groups.",
    "Second Normal Form (2NF) is satisfied because all non-prime attributes are fully functionally dependent on the entire primary key of their respective relations, eliminating partial key dependencies in composite tables such as course_sections and enrollments.",
    "Third Normal Form (3NF) is achieved by eliminating all transitive dependencies: non-key attributes depend exclusively on the primary key and not on other non-key attributes. For example, student GPA summaries are not duplicated across transaction tables but are dynamically evaluated via views."
  ]));

  elements.push(...createSubsectionPage("5.11", "Index Design", [
    "The schema implements a strategic B-Tree indexing topology to guarantee sub-millisecond query evaluation during high-concurrency operations. Indexes are placed on candidate keys, foreign key join columns, and frequently filtered fields.",
    "Key indexes include: idx_course_department on courses(department) for catalog filtering; idx_section_status on enrollments(section_id, status) for section roster lookups; idx_notifications_student on notifications(student_id, is_read) for badge counters; and idx_audit_student on enrollment_audit_log(student_id, log_id) for audit history.",
    "By maintaining composite indexes tailored to frequent query predicates, the database optimizer performs index seek operations rather than expensive full-table sequential scans."
  ]));

  elements.push(...createSubsectionPage("5.12", "Views and Analytical Queries", [
    "The schema defines three persistent analytical views that encapsulate complex multi-table aggregations without data redundancy: (1) v_student_academic_summary: Computes total enrolled courses, current semester credits, average marks, cumulative GPA, and attendance rate per student.",
    "(2) v_course_enrollment_stats: Aggregates total section capacity, active enrollments, available seats, and dynamic occupancy percentages (ROUND(filled_seats * 100 / total_seats, 1)) across all course offerings.",
    "(3) v_student_rankings: Employs modern SQL window functions—DENSE_RANK() OVER (PARTITION BY department ORDER BY current_gpa DESC) and DENSE_RANK() OVER (ORDER BY current_gpa DESC)—to compute real-time departmental and institutional student rankings."
  ]));

  elements.push(...createSubsectionPage("5.13", "Stored Procedures and Function", [
    "Business logic requiring transactional atomicity is encapsulated within database stored routines: (1) sp_student_transcript(IN p_student VARCHAR(50)): A stored procedure that compiles an authoritative transcript for a specified student, returning course codes, names, credits, component marks, letter grades, and grade points for all published courses.",
    "(2) fn_calculate_student_avg(p_student VARCHAR(50)): A deterministic stored function that computes and returns the average marks obtained by a student across all published courses, returning DECIMAL(5,2).",
    "Furthermore, automated database triggers—tr_enrollment_insert and tr_enrollment_update—monitor the enrollments table. When an enrollment is inserted or its status modified, the trigger automatically inserts an immutable record into enrollment_audit_log."
  ]));

  return elements;
}

function getChapter6() {
  const elements = [];
  elements.push(...createChapterIntro(6, "Implementation", "This chapter documents the modular code organization, component structures, API controllers, database connection management, and error handling mechanisms implemented across the frontend and backend applications."));

  elements.push(...createSubsectionPage("6.1", "Implementation Overview", [
    "The application implementation is structured into two clean codebases: the frontend Single Page Application located under src/ and the backend Express server located under server/. Database initialization and seed scripts are maintained under server/db/.",
    "This decoupled directory topology enforces clear boundaries between presentation rendering, business logic execution, and database administration. Developers can independently execute frontend unit tests, modify REST controllers, or execute database migrations without cross-contaminating source artifacts.",
    "All client-side components utilize ES Module syntax, while the backend leverages Node.js native ES modules ('type': 'module' in package.json) to ensure modern JavaScript language compatibility across the full stack."
  ]));

  elements.push(...createSubsectionPage("6.2", "Frontend Entry Point and Application Shell", [
    "The frontend entry point is src/main.jsx, which mounts the root React component tree into the index.html DOM container. It wraps the application with AppProvider (state management) and BrowserRouter (routing).",
    "src/App.jsx establishes the high-level layout shell, configuring the toast notification system and delegating path resolution to src/AppRoutes.jsx. The MainLayout component supplies the persistent navigation framework, including the global Header and responsive Sidebar.",
    "The application shell manages global loading spinners, responsive sidebar toggling, and network status banners that inform the student if the backend connection is degraded or offline."
  ]));

  elements.push(...createSubsectionPage("6.3", "Authentication and Registration", [
    "Authentication is implemented in src/pages/Login.jsx and backed by server/routes/auth.routes.js. The login controller accepts roll numbers, student IDs, or institutional email addresses alongside passwords.",
    "Passwords submitted during registration (POST /api/auth/register) are cryptographically hashed using Argon2/Bcrypt salts before persistence in the students table. The plaintext password is never logged, cached, or stored in plaintext.",
    "Upon successful credential verification (POST /api/auth/login), the server issues a signed JSON Web Token (JWT) with a 24-hour expiration containing the user's ID and role. The client stores this token in browser local storage and attaches it to subsequent HTTP requests."
  ]));

  elements.push(...createSubsectionPage("6.4", "Student Profile Module", [
    "The student profile module (src/pages/Profile.jsx) presents personal, demographic, and academic standing details for the authenticated student. It consumes data from GET /api/students/:id.",
    "The backend controller joins the base students record with the analytical view v_student_academic_summary, providing the student with instant visibility into their enrolled courses, semester credits, cumulative GPA, and attendance percentage.",
    "A self-service profile edit form allows students to update editable contact information (such as phone number and preferred email), while locking immutable academic properties (such as roll number, registered department, and official GPA)."
  ]));

  elements.push(...createSubsectionPage("6.5", "Course Catalog Module", [
    "The course catalog module (src/pages/Courses.jsx) provides an interactive curriculum browser. It fetches all active course offerings from GET /api/courses and renders them as interactive CourseCard components.",
    "Each course card displays the course code, course name, academic credits, course type (Core/Elective), meeting schedule, classroom, instructor name, and dynamic seat occupancy badges (e.g., '12/30 seats available').",
    "Client-side search and filtering bars enable students to filter courses by department, keyword, or credit count in real time without triggering redundant server requests."
  ]));

  elements.push(...createSubsectionPage("6.6", "Enrollment Module", [
    "The enrollment module (src/pages/CourseDetails.jsx) coordinates course registration requests. When a student selects an available section and clicks 'Enroll Now', a POST request is transmitted to /api/enrollments.",
    "The backend enrollment controller validates the request against three key invariants: (1) verifying that remaining section capacity is greater than zero; (2) ensuring that the student has not already enrolled in this course; (3) validating that the selected course belongs to the student's selected academic cluster.",
    "Upon successful validation, the enrollment record is inserted, the section seat counter is decremented, and the student's enrolled course state is updated across the application."
  ]));

  elements.push(...createSubsectionPage("6.7", "Course-Drop Module", [
    "The course-drop module is integrated into the student's 'My Courses' view (src/pages/MyCourses.jsx). It permits students to withdraw from enrolled courses during the designated drop period.",
    "When a drop is confirmed, the client sends a DELETE request to /api/enrollments containing the student ID and course ID. The backend verifies the enrollment status and updates it from 'Enrolled' to 'Dropped'.",
    "This status transition immediately triggers the database trigger tr_enrollment_update, writing an audit log event, while the backend recalculates available seat counts and releases the classroom slot."
  ]));

  elements.push(...createSubsectionPage("6.8", "Grades Module", [
    "The grades module (src/pages/Grades.jsx) provides an official transcript view of student examination results. It queries GET /api/grades/:studentId, which executes a join between grades, courses, and students.",
    "The UI displays an itemized evaluation table breaking down internal assessment marks (max 30), midterm examination marks (max 20), and final end-semester marks (max 50), accompanied by calculated totals, letter grades, and grade points.",
    "Summary cards at the top of the view display the student's cumulative GPA (CGPA) and completed academic credits, retrieved dynamically from the analytical view."
  ]));

  elements.push(...createSubsectionPage("6.9", "Timetable Module", [
    "The timetable module (src/pages/Timetable.jsx) renders an interactive weekly schedule matrix. It fetches timetable entries from GET /api/timetable/:studentId.",
    "The timetable view groups course sessions by weekday (Monday through Friday) and sorts them chronologically by start time. Each timetable card displays the course code, subject name, section, classroom, and instructor.",
    "The backend timetable controller automatically synchronizes schedule slots with active enrollments, ensuring that dropped courses are removed and newly enrolled sections appear immediately."
  ]));

  elements.push(...createSubsectionPage("6.10", "Notifications Module", [
    "The notifications module (src/pages/Notifications.jsx) provides an asynchronous message inbox for students. It queries GET /api/notifications/:studentId to retrieve academic alerts and enrollment confirmations.",
    "Unread notifications are highlighted with visually distinct badges, and an unread counter is displayed on the global Header. Students can mark individual notifications as read (PATCH /api/notifications/:id/read) or dismiss all alerts via a bulk action.",
    "Notifications are stored persistently in the notifications table, ensuring that messages remain accessible across login sessions."
  ]));

  elements.push(...createSubsectionPage("6.11", "Administration Dashboard", [
    "The administration dashboard (src/pages/admin/AdminDashboard.jsx) provides department heads and evaluators with a real-time operational overview of the portal. It consumes metrics from GET /api/admin/overview.",
    "Key Performance Indicators (KPIs) include: total registered students, total course catalog offerings, active course enrollments, dropped enrollments, and active course sections. Summary graphs illustrate enrollment distribution across departments.",
    "A course occupancy table lists all sections with filled seats, total capacity, and visual progress bars showing section fill percentages."
  ]));

  elements.push(...createSubsectionPage("6.12", "Student Administration", [
    "The student administration console (src/pages/admin/StudentAdmin.jsx) provides administrative tools for managing student academic records. It queries GET /api/admin/students to display the complete student directory.",
    "Administrators can inspect individual student profiles, view comprehensive enrollment histories, and examine course statuses. An administrative CGPA override feature allows authorized officials to adjust student GPAs with mandatory audit reasoning.",
    "Every administrative override is recorded in the academic_audit table, recording the administrator ID, student ID, previous value, new value, reason, and timestamp."
  ]));

  elements.push(...createSubsectionPage("6.13", "Faculty Administration", [
    "The faculty administration module (src/pages/admin/FacultyAdmin.jsx) provides a directory of academic teaching staff. It retrieves faculty records from GET /api/admin/faculty.",
    "Administrators can inspect faculty profiles, contact information, departmental affiliations, and current course teaching assignments. This module centralizes faculty management and ensures accurate instructor associations across course sections."
  ]));

  elements.push(...createSubsectionPage("6.14", "API Integration", [
    "All client-side HTTP communication is centralized in src/services/api.js. This service wraps native browser fetch calls, attaches Bearer authorization headers, serializes JSON bodies, and unwraps response envelopes.",
    "By centralizing API calls into named methods (e.g., api.courses.getAll(), api.enrollments.create()), UI components remain clean and focused on presentation logic rather than low-level networking details.",
    "The API client includes centralized error interception: network failures or HTTP 4xx/5xx responses are caught and transformed into user-friendly error messages that are displayed via toast notifications."
  ]));

  elements.push(...createSubsectionPage("6.15", "Error Handling and User Feedback", [
    "The system implements a comprehensive error handling architecture spanning both client and server tiers. On the server, a global error handling middleware catches unhandled exceptions and prevents server crashes.",
    "Database-specific error codes are intercepted and mapped to clean HTTP responses: ER_DUP_ENTRY returns HTTP 409 Conflict ('This record already exists'), while ER_NO_REFERENCED_ROW_2 returns HTTP 400 Bad Request ('Referenced record does not exist').",
    "On the frontend, toast notifications (ToastContainer.jsx) provide non-intrusive feedback for successful actions (e.g., 'Enrollment successful!'), warning states, and validation errors, ensuring an intuitive user experience."
  ]));

  elements.push(...createSubsectionPage("6.16", "Database Initialization", [
    "Database initialization is automated via server/db/initDb.js and can be executed with npm run db:setup. The script reads server/.env, establishes a connection to the MySQL server, and creates the student_portal_db database if it does not already exist.",
    "The script reads server/db/schema.sql, splits it by SQL statement delimiters (-- @statement), and executes each statement sequentially to construct tables, foreign keys, views, triggers, and stored procedures.",
    "Following schema creation, server/db/seed.js populates the database with realistic sample students, faculty, courses, sections, and academic clusters, ensuring that the system is ready for immediate demonstration."
  ]));

  elements.push(...createSubsectionPage("6.17", "Module Integration", [
    "Module integration verifies the end-to-end communication pathways connecting React components, Express controllers, and MySQL tables. Each academic feature is validated across all three tiers.",
    "For example, in the enrollment module: clicking 'Enroll' in CourseDetails.jsx triggers api.enrollments.create(), which hits router.post('/api/enrollments') in enrollments.routes.js, executing a parameterized INSERT against the enrollments table in MySQL and updating AppContext state.",
    "This end-to-end integration ensures that UI components never display fabricated or hard-coded mock data, but remain strictly synchronized with the authoritative MySQL database state."
  ]));

  elements.push(...createSubsectionPage("6.18", "Implementation Summary", [
    "The implementation represents a complete, cohesive full-stack web application adhering to modern software engineering standards. The frontend provides a responsive, component-driven user interface built with React 18.",
    "The backend delivers a secure, modular REST API powered by Node.js and Express, implementing token-based authorization and input validation. The database tier leverages MySQL 8.0 with InnoDB to guarantee data integrity, transactional safety, and analytical reporting.",
    "Together, these integrated modules form a robust, scalable digital platform for academic management, serving both student self-service needs and administrative governance."
  ]));

  return elements;
}

function getChapter7() {
  const elements = [];
  elements.push(...createChapterIntro(7, "Features", "This chapter presents a detailed examination of the functional capabilities, user journeys, administrative features, and validation rules provided by the Student Course Enrollment portal."));

  elements.push(...createSubsectionPage("7.1", "Feature Overview", [
    "The portal delivers a comprehensive suite of academic features designed to eliminate fragmentation in university workflows. Features are organized into two primary user experiences: the Student Portal and the Administration Portal.",
    "Student features include: self-service registration, credential authentication, personal academic dashboard, curriculum discovery, academic cluster selection, real-time course enrollment, course withdrawal, personalized weekly timetable, official grade transcripts, profile management, and notification alerts.",
    "Administrative features include: institutional telemetry dashboard, campus enrollment analytics, student directory management, academic cluster configuration, CGPA override audits, and faculty teaching assignments."
  ]));

  elements.push(...createSubsectionPage("7.2", "Login and Registration", [
    "The login and registration interface provides a secure gateway to the portal. Students can register by providing their full name, roll number, institutional email address, department, academic year, and password.",
    "Client-side validation verifies email syntax and roll number formatting before submission. On the server, passwords are cryptographically hashed, and duplicate registrations are blocked by unique constraints.",
    "Upon authentication, the user is issued a secure JWT token, and the portal dynamically redirects the user to either the Student Dashboard or the Administrator Dashboard based on their verified role."
  ]));

  elements.push(...createSubsectionPage("7.3", "Student Dashboard", [
    "The Student Dashboard serves as the central command center for enrolled students. Upon login, the dashboard greets the student and displays high-level academic summary metrics.",
    "Four primary metric cards highlight: (1) Current GPA (CGPA), (2) Enrolled Courses Count, (3) Completed Academic Credits, and (4) Overall Attendance Rate. Data for these cards is pulled directly from the analytical view v_student_academic_summary.",
    "Quick-action links provide one-click navigation to course registration, weekly timetable inspection, and published grade transcripts."
  ]));

  elements.push(...createSubsectionPage("7.4", "Course Discovery", [
    "Course Discovery allows students to browse the complete institutional course catalog. Students can view course codes, titles, descriptions, credit weights, and course types (Core, Elective, Lab).",
    "Each course listing displays real-time capacity indicators showing filled vs. total seats. Students can click on any course to open the Course Details view, which displays prerequisites, syllabus outlines, and course learning outcomes.",
    "An interactive search bar enables instantaneous filtering by subject name or course code, facilitating rapid course selection."
  ]));

  elements.push(...createSubsectionPage("7.5", "Course Enrollment", [
    "Course Enrollment provides a streamlined self-service workflow for registering in academic courses. Students select their preferred course section and click 'Enroll Now'.",
    "The backend performs rigorous validation checks before confirming the enrollment: verifying seat availability, checking that the course belongs to the student's assigned academic cluster, and ensuring no duplicate enrollments exist.",
    "Upon successful enrollment, the seat counter updates in real time, an audit record is logged, and a confirmation toast notification is displayed to the student."
  ]));

  elements.push(...createSubsectionPage("7.6", "My Courses", [
    "The 'My Courses' page provides students with a dedicated console to review all currently registered courses. Each course card displays section details, meeting schedules, classroom locations, and instructor contact details.",
    "Students can initiate a course withdrawal by clicking the 'Drop Course' button. A confirmation modal prompts the student to confirm the drop action, preventing accidental withdrawals.",
    "Once dropped, the course status transitions to 'Dropped', the seat is returned to the general pool, and the schedule is updated."
  ]));

  elements.push(...createSubsectionPage("7.7", "Timetable View", [
    "The Timetable View organizes the student's enrolled courses into an intuitive weekly class schedule. The matrix is divided into weekdays (Monday through Friday) and organized chronologically by class time slots.",
    "Each timetable slot displays the course code, subject title, classroom number, section identifier, and course type. This provides students with an unambiguous visual schedule of their weekly commitments.",
    "The timetable automatically reflects enrollment changes: dropping a course instantly removes its schedule slots, while registering for a new course immediately populates its assigned lecture times."
  ]));

  elements.push(...createSubsectionPage("7.8", "Grades and Academic Summary", [
    "The Grades and Academic Summary page serves as an official student grade report. It presents an itemized breakdown of student evaluation results for all registered courses.",
    "For each course, the table displays internal assessment marks (max 30), midterm examination marks (max 20), final end-semester marks (max 50), total score (max 100), letter grade, and grade points.",
    "Summary metric cards at the top of the page calculate the student's cumulative grade point average (CGPA) and total completed credits, providing a clear picture of academic progress."
  ]));

  elements.push(...createSubsectionPage("7.9", "Notifications", [
    "The Notifications module keeps students informed of critical academic events. Notifications are automatically generated for enrollment confirmations, course drops, grade publications, and administrative announcements.",
    "The interface displays an unread notification counter on the top navigation bar. Within the notification center, messages are displayed with category tags (Enrollment, Academic, System) and timestamps.",
    "Students can mark individual alerts as read or use the 'Mark All as Read' feature to clear their notification queue."
  ]));

  elements.push(...createSubsectionPage("7.10", "Profile Management", [
    "The Profile Management module displays the student's institutional profile. Information is divided into read-only academic records (roll number, department, program, semester, CGPA) and editable contact fields.",
    "Students can update their phone number and personal email address through an intuitive edit form. Updates are validated on both client and server before being saved to the database.",
    "The profile view also displays the student's assigned Academic Cluster and cohort status, ensuring transparency in curriculum tracking."
  ]));

  elements.push(...createSubsectionPage("7.11", "Administrative Overview", [
    "The Administrative Overview console provides university administrators with high-level institutional telemetry. It aggregates data across students, courses, faculty, and enrollments into a single dashboard.",
    "Metric cards highlight total enrolled students, total course offerings, active registrations, dropped courses, and overall seat occupancy percentages across all sections.",
    "Departmental distribution tables illustrate student enrollment counts across computer science, information technology, and related engineering disciplines."
  ]));

  elements.push(...createSubsectionPage("7.12", "Student, Faculty, and Enrollment Administration", [
    "Administrative sub-consoles provide fine-grained management of academic entities. The Student Directory lists all registered students with search and filtering capabilities.",
    "Administrators can inspect individual student records, view complete enrollment histories, and perform authorized CGPA overrides with mandatory audit justifications.",
    "The Faculty Directory displays teaching staff profiles and course allocations, while the Enrollment Console provides campus-wide oversight of course rosters and section capacities."
  ]));

  elements.push(...createSubsectionPage("7.13", "Validation and Status Feedback", [
    "The application implements comprehensive validation across every user interaction. Form inputs are validated in real time to provide immediate guidance on required fields, email syntax, and character limits.",
    "Server-side validation ensures that malformed or unauthorized requests are rejected with clear, descriptive error messages. Visual toast alerts provide immediate confirmation for all create, update, and delete actions.",
    "Loading spinners and disabled button states during asynchronous operations prevent duplicate form submissions and provide a polished, responsive user experience."
  ]));

  elements.push(...createSubsectionPage("7.14", "Feature Summary and Boundaries", [
    "The features delivered by Student Portal Pro v3 provide a complete, robust digital ecosystem for student academic management and administrative governance.",
    "The system successfully replaces manual record-keeping with an automated, database-driven solution that enforces relational integrity, prevents over-enrollment, and synchronizes academic records across all modules.",
    "Operational boundaries are clearly defined: the portal operates within the institutional domain and focuses on core academic administration, establishing a solid foundation for future enterprise enhancements."
  ]));

  return elements;
}

module.exports = {
  getChapter5,
  getChapter6,
  getChapter7
};
