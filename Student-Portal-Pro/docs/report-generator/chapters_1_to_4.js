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
const { createParagraph, createHeading, createSubsectionPage, createChapterIntro, archImgPath } = require('./docx_helpers');

function getFrontMatter() {
  const elements = [];

  // ==================== COVER PAGE ====================
  elements.push(new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 360, after: 200, line: 360 },
    children: [
      new TextRun({
        text: "“Student Course Enrollment and Distributed Academic\nManagement System”",
        font: "Times New Roman",
        size: 32, // 16pt
        bold: true,
        color: "1E3A8A"
      })
    ]
  }));

  elements.push(new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 180, after: 180, line: 320 },
    children: [
      new TextRun({
        text: "A Project Report Submitted in partial fulfillment of the requirements for the award of the degree of",
        font: "Times New Roman",
        size: 24, // 12pt
        italics: true
      })
    ]
  }));

  elements.push(new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 240, after: 180, line: 360 },
    children: [
      new TextRun({
        text: "BACHELOR OF TECHNOLOGY",
        font: "Times New Roman",
        size: 30, // 15pt
        bold: true,
        color: "B91C1C"
      })
    ]
  }));

  elements.push(new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 100, after: 180, line: 320 },
    children: [
      new TextRun({
        text: "In\nDEPARTMENT OF COMPUTER SCIENCE ENGINEERING\n&\nDEPARTMENT OF COMPUTER SCIENCE AND INFORMATION TECHNOLOGY",
        font: "Times New Roman",
        size: 24,
        bold: true
      })
    ]
  }));

  elements.push(new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 180, after: 120, line: 320 },
    children: [new TextRun({ text: "By", font: "Times New Roman", size: 24, bold: true })]
  }));

  // Student details table
  const studentTable = new Table({
    width: { size: 70, type: WidthType.PERCENTAGE },
    alignment: AlignmentType.CENTER,
    rows: [
      new TableRow({
        children: [
          new TableCell({ children: [createParagraph("V. ABHIDEV", { bold: true, color: "B91C1C" })] }),
          new TableCell({ children: [createParagraph("2520030325", { bold: true, color: "B91C1C", alignment: AlignmentType.RIGHT })] }),
        ]
      }),
      new TableRow({
        children: [
          new TableCell({ children: [createParagraph("TEJ PRATAP SINGH", { bold: true, color: "B91C1C" })] }),
          new TableCell({ children: [createParagraph("2520030476", { bold: true, color: "B91C1C", alignment: AlignmentType.RIGHT })] }),
        ]
      }),
      new TableRow({
        children: [
          new TableCell({ children: [createParagraph("G. SHASHANK", { bold: true, color: "B91C1C" })] }),
          new TableCell({ children: [createParagraph("2520030495", { bold: true, color: "B91C1C", alignment: AlignmentType.RIGHT })] }),
        ]
      })
    ]
  });
  elements.push(studentTable);

  elements.push(new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 360, after: 100, line: 320 },
    children: [new TextRun({ text: "Under the Esteemed Guidance of", font: "Times New Roman", size: 24, italics: true })]
  }));

  elements.push(new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 80, after: 360, line: 320 },
    children: [
      new TextRun({ text: "Dr Yerragudipadu Subbarayudu\n", font: "Times New Roman", size: 26, bold: true, color: "B91C1C" }),
      new TextRun({ text: "Assistant Professor\nDepartment of Computer Science and Engineering", font: "Times New Roman", size: 24, bold: true })
    ]
  }));

  elements.push(new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 240, after: 60, line: 320 },
    children: [
      new TextRun({ text: "Koneru Lakshmaiah Education Foundation\n", font: "Times New Roman", size: 28, bold: true, color: "B91C1C" }),
      new TextRun({ text: "(Deemed to be University estd. u/s. 3 of the UGC Act, 1956)\nOff-Campus: Bachupally-Gandimaisamma Road, Bowrampet, Hyderabad, Telangana - 500 043.\nPhone No: 7815926816, www.klh.edu.in", font: "Times New Roman", size: 22 })
    ]
  }));
  elements.push(new Paragraph({ children: [new PageBreak()] }));

  // ==================== DECLARATION ====================
  elements.push(new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 300, after: 120, line: 320 },
    children: [
      new TextRun({ text: "K L (Deemed to be) University\nDEPARTMENT OF COMPUTER SCIENCE ENGINEERING\n&\nDEPARTMENT OF COMPUTER SCIENCE AND INFORMATION TECHNOLOGY\n\n", font: "Times New Roman", size: 24, bold: true }),
      new TextRun({ text: "Declaration", font: "Times New Roman", size: 28, bold: true, color: "B91C1C" })
    ]
  }));

  elements.push(createParagraph("The Project Report entitled “Student Course Enrollment and Distributed Academic Management System” is a record of Bonafide work of V. ABHIDEV - 2520030325, TEJ PRATAP SINGH - 2520030476, G. SHASHANK - 2520030495 submitted in partial fulfillment for the award of B. Tech in Computer Science and Engineering (or) Computer Science and Information Technology to the K L University. The results embodied in this report have not been copied from any other departments/University/Institute."));
  elements.push(createParagraph("The investigations carried out in this project are original and represent genuine system development, database modeling, and empirical verification undertaken by the project team under supervision. Proper citations and references have been provided for all external literature, specifications, and libraries utilized during the development process."));

  elements.push(new Paragraph({
    alignment: AlignmentType.RIGHT,
    spacing: { before: 400, after: 200, line: 320 },
    children: [
      new TextRun({ text: "V. ABHIDEV – 2520030325\nTEJ PRATAP SINGH – 2520030476\nG. SHASHANK – 2520030495", font: "Times New Roman", size: 24, bold: true })
    ]
  }));
  elements.push(new Paragraph({ children: [new PageBreak()] }));

  // ==================== CERTIFICATE ====================
  elements.push(new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 300, after: 120, line: 320 },
    children: [
      new TextRun({ text: "K L (Deemed to be) University\nDEPARTMENT OF COMPUTER SCIENCE ENGINEERING\n&\nDEPARTMENT OF COMPUTER SCIENCE AND INFORMATION TECHNOLOGY\n\n", font: "Times New Roman", size: 24, bold: true }),
      new TextRun({ text: "CERTIFICATE", font: "Times New Roman", size: 28, bold: true, color: "B91C1C" })
    ]
  }));

  elements.push(createParagraph("This is to certify that the mini project based report entitled “Student Course Enrollment and Distributed Academic Management System” is a bonafide work done and submitted by V. ABHIDEV - 2520030325, TEJ PRATAP SINGH - 2520030476, G. SHASHANK - 2520030495 in partial fulfillment of the requirements for the award of the degree of BACHELOR OF TECHNOLOGY in Department of Computer Science Engineering, K L (Deemed to be University), during the academic year 2024-2025."));
  elements.push(createParagraph("The design, implementation, and database architecture presented in this thesis have been verified through active laboratory demonstrations and fulfill the academic rigor required for Database Software Engineering and Distributed Backend Development."));

  elements.push(new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 600, after: 100, line: 320 },
    children: [new TextRun({ text: "Signature of the Guide\n\n\n\n", font: "Times New Roman", size: 24, bold: true })]
  }));

  const signTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [
          new TableCell({ children: [createParagraph("Signature of the Course Coordinator", { bold: true })] }),
          new TableCell({ children: [createParagraph("Signature of the HOD", { bold: true, alignment: AlignmentType.RIGHT })] }),
        ]
      })
    ]
  });
  elements.push(signTable);
  elements.push(new Paragraph({ children: [new PageBreak()] }));

  // ==================== ACKNOWLEDGEMENT ====================
  elements.push(new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 300, after: 180, line: 320 },
    children: [new TextRun({ text: "ACKNOWLEDGEMENT", font: "Times New Roman", size: 28, bold: true, color: "B91C1C" })]
  }));

  elements.push(createParagraph("The success in this project would not have been possible but for the timely help and guidance rendered by many people. Our wish to express our sincere thanks to all those who have assisted us in one way or the other for the completion of our project."));
  elements.push(createParagraph("Our greatest appreciation to our Course Coordinator Dr Yerragudipadu Subbarayudu, and our guide Dr Yerragudipadu Subbarayudu, Department of Computer Science and Engineering, which cannot be expressed in words for his tremendous support, encouragement, technical insights, and continuous guidance throughout the duration of this project."));
  elements.push(createParagraph("We express our deep gratitude to Dr. P Venkateshwara Rao (CSE) / Dr. Kaja Shareef (CSIT), Head of the Department for Computer Science Engineering / Department of Computer Science and Information Technology, for providing us with adequate laboratory facilities, computing infrastructure, and ways and means by which we are able to complete this project-based Lab."));
  elements.push(createParagraph("We thank all the members of teaching and non-teaching staff members who have assisted us directly or indirectly for the successful completion of this project. Finally, we sincerely thank our parents, friends, and classmates for their kind help, moral support, and cooperation during our work."));

  elements.push(new Paragraph({
    alignment: AlignmentType.RIGHT,
    spacing: { before: 300, after: 120, line: 320 },
    children: [new TextRun({ text: "V. ABHIDEV – 2520030325\nTEJ PRATAP SINGH – 2520030476\nG. SHASHANK – 2520030495", font: "Times New Roman", size: 24, bold: true })]
  }));
  elements.push(new Paragraph({ children: [new PageBreak()] }));

  // ==================== ABSTRACT ====================
  elements.push(new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 200, after: 180, line: 320 },
    children: [new TextRun({ text: "Abstract", font: "Times New Roman", size: 28, bold: true })]
  }));

  elements.push(createParagraph("The “Student Course Enrollment and Distributed Academic Management System” is a web-based academic portal designed to organize student information, course offerings, enrollments, grades, timetable details, notifications, and administrative records. The system provides separate user-facing pages for common student activities and administrative pages for reviewing academic records. Its purpose is to reduce fragmentation in academic workflows and demonstrate practical database and full-stack development concepts."));
  elements.push(createParagraph("The frontend is implemented with React and React Router, while the backend uses Node.js and Express to expose REST-style API endpoints. The frontend communicates with the server through a centralized API service that sends and receives JSON. The backend uses a MySQL connection pool through mysql2 and loads database settings from environment variables. The submitted source includes route modules for authentication, students, courses, enrollments, grades, timetable, notifications, and administration."));
  elements.push(createParagraph("The MySQL schema, named student_portal_db, defines relational tables and constraints for academic entities. It uses primary keys, foreign keys, unique constraints, CHECK constraints, indexes, analytical views, stored procedures, a stored function, and enrollment audit structures. The setup notes describe transactional procedures for enrollment and course dropping so that related changes can be performed consistently. The actual database behavior should be confirmed by running the schema and test cases in MySQL Workbench."));
  elements.push(createParagraph("The project demonstrates the integration of a browser-based interface, a server-side API, and a relational database. It provides a practical case study in React component organization, Express routing, SQL schema design, data integrity, API integration, and test planning. The documentation distinguishes implemented source structure from proposed enhancements and leaves test outcomes to be recorded after the application is executed in the target environment."));
  elements.push(createParagraph("From a data architecture perspective, the platform employs MySQL as its relational database management system to preserve and organize vital institutional records. Through the strategic implementation of normalized tables, primary and foreign key constraints, and relational logic, the schema guarantees high data integrity while minimizing redundancy. Dynamic SQL queries facilitate real-time data manipulation, including insertion, modifications, deletion, and extraction of academic inventories."));
  elements.push(createParagraph("The application’s backend is constructed around RESTful APIs, bridging client-side requests with core database operations. The server layer handles request routing, input validation, and secure authentication protocols to safeguard sensitive administrative records. Furthermore, the architecture supports a modular, cluster-oriented cohort design, enabling independent scaling for student administration, course cataloging, and enrollment processing modules."));
  elements.push(new Paragraph({ children: [new PageBreak()] }));

  // ==================== INDEX / TABLE OF CONTENTS ====================
  elements.push(new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 200, after: 180, line: 320 },
    children: [new TextRun({ text: "Index", font: "Times New Roman", size: 30, bold: true, color: "B91C1C" })]
  }));

  const indexData = [
    ["S.No.", "Chapters", "Topics", "Page Range"],
    ["", "Front Matter", "Declaration, Certificate, Acknowledgement, Abstract", "1 - 8"],
    ["1", "Introduction", "1.1 Background to 1.8 Report Organization", "11 - 19"],
    ["2", "System Requirements", "2.1 Hardware, Software, Functional, Non-Functional", "20 - 28"],
    ["3", "Technology Stack", "React, React Router, Node.js, Express, MySQL, REST APIs", "29 - 39"],
    ["4", "System Architecture", "Layered Architecture, Request Sequence, Deployment", "40 - 48"],
    ["5", "Design", "Relational Model, ER Relationships, Schema, Views, Procedures", "49 - 62"],
    ["6", "Implementation", "Frontend Pages, API Integration, Auth, Feature Modules", "63 - 81"],
    ["7", "Features", "Login, Catalog, Enrollment, Timetable, Grades, Admin", "82 - 96"],
    ["8", "Testing", "Testing Strategy, Test Cases TC-01 to TC-14, Evidence", "97 - 109"],
    ["9", "Deployment", "Local Setup, MySQL Config, Security Checklist, Recovery", "110 - 120"],
    ["10", "Challenges & Limitations", "Frontend-Backend Sync, Schema Compatibility, Concurrency", "121 - 129"],
    ["11", "Future Enhancements", "Authentication, Analytics, Search, Timetable, Scaling", "130 - 140"],
    ["12", "Conclusion", "Project Summary, Outcomes, Skills Learned, Final Remarks", "141 - 145"],
    ["13", "References", "Source Files, Documentation, Standards, Citations", "146 - 150"],
    ["14", "Appendices", "Directory Tree, API Reference, SQL Examples, User Guides", "151 - 166"]
  ];

  const indexRows = indexData.map((row, idx) => {
    return new TableRow({
      children: row.map((cell, cIdx) => new TableCell({
        children: [createParagraph(cell, { bold: idx === 0, size: 22 })],
        width: { size: cIdx === 0 ? 10 : (cIdx === 1 ? 25 : (cIdx === 2 ? 45 : 20)), type: WidthType.PERCENTAGE }
      }))
    });
  });

  elements.push(new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, rows: indexRows }));
  elements.push(new Paragraph({ children: [new PageBreak()] }));

  return elements;
}

function getChapter1() {
  const elements = [];
  elements.push(...createChapterIntro(1, "Introduction", "This chapter establishes the purpose, institutional context, and boundaries of the Student Course Enrollment and Distributed Academic Management System. It identifies the critical academic tasks addressed by the submitted implementation, defines core objectives, and outlines the structural organization of this project report."));

  elements.push(...createSubsectionPage("1.1", "Background of the Project", [
    "Academic institutions maintain voluminous, mission-critical information about students, curricula, course offerings, faculty allocations, grades, timetables, and dynamic enrollment activity. When these records are managed through disconnected spreadsheets, localized flat-files, or manual administrative procedures, the same information is frequently recorded multiple times. This introduces severe data redundancy, inconsistent state updates, and administrative overhead where stakeholders find it difficult to identify authoritative data records.",
    "The Student Course Enrollment and Distributed Academic Management System provides an integrated, web-based digital portal for accessing and orchestrating these related academic services through a standardized, consistent workflow. Designed specifically to solve real-world university management challenges, the platform centralizes student registration, course offerings, capacity-controlled course registrations, and transcript generations into a unified relational database schema.",
    "The submitted implementation utilizes a modern, reactive React frontend, an asynchronous Node.js and Express RESTful API layer, and an enterprise MySQL 8.0 relational database engine for persistent transactional storage. The active schema is designated as student_portal_db. The software architecture establishes distinct student self-service pages alongside comprehensive administrative oversight consoles, supported by secure server-side route handlers that enforce strict academic constraints."
  ]));

  elements.push(...createSubsectionPage("1.2", "Problem Statement", [
    "The central challenge addressed by this project is the critical requirement to coordinate multi-entity academic records and course enrollment operations while maintaining absolute data consistency across distributed client sessions. Students require instantaneous visibility into available course catalogs, real-time section capacities, current enrollment statuses, and historical grade sheets. Simultaneously, academic administrators must oversee course inventories, allocate faculty instructors, configure student quotas, and monitor enrollment metrics without experiencing data corruption.",
    "Conventional academic software solutions often suffer from severe synchronization latencies, orphan foreign key records, race conditions during high-volume registration periods, and lack of cohort synchronization. When user interfaces and database tiers are decoupled without robust transactional boundaries, displayed seat counts become stale, leading to unintentional over-enrollments and schedule collisions.",
    "The project resolves these persistent vulnerabilities through a centralized 3NF relational schema, parameterized REST API endpoints, and a responsive frontend client. Strict database-level domain and referential integrity constraints prevent duplicate student identifiers and invalid course mappings. Atomic stored procedures and database triggers safeguard transactional consistency during high-concurrency enrollment and course-drop actions."
  ]));

  elements.push(...createSubsectionPage("1.3", "Scope of the Project", [
    "The functional scope of the implemented system covers authenticated student registration and sign-in workflows, student academic profile retrieval and updates, interactive course catalog exploration, real-time capacity-checked course enrollment, verified course-drop workflows, letter grade and GPA computation views, automated timetable scheduling, notification dispatching, and administrative oversight consoles.",
    "Within the administrative domain, authorized personnel are provided with consolidated telemetry dashboards tracking institutional student counts, course occupancy percentages, faculty teaching assignments, and student enrollment audit trails. Advanced features include academic cluster cohorts, which group course sections and enforce semester-wide cohort enrollment locks to preserve academic curriculum synchronization.",
    "The scope is strictly bound to the verified capabilities implemented within the submitted source codebase. It deliberately excludes integrations with external third-party payment gateways, commercial single-sign-on (SSO) OAuth2 federation with external identity providers, or cloud-hosted microservices infrastructure. The platform operates as a cohesive, modular, on-premises full-stack software system designed for university campus deployment."
  ]));

  elements.push(...createSubsectionPage("1.4", "Objectives", [
    "The primary technical objective of this project is to architect, develop, and empirically validate an integrated academic management system that demonstrates core database engineering and distributed backend development principles. The system aims to replace fragmented legacy record-keeping with an ACID-compliant relational framework capable of serving concurrent student and administrative workflows.",
    "Specific operational objectives include: (1) Designing a normalized MySQL relational schema enforcing primary, foreign, candidate, and domain CHECK constraints; (2) Engineering a secure Node.js and Express backend providing stateless RESTful API endpoints; (3) Implementing atomic transactional stored procedures and automated triggers to handle course enrollments and audit logging; (4) Developing an interactive React client interface delivering seamless user experiences; (5) Formulating analytical views and window functions for automated academic performance metrics.",
    "A further pedagogical objective is the practical application of enterprise database concepts: index optimization on high-cardinality keys, multi-table JOIN query planning, parameterized SQL execution for SQL injection mitigation, and automated transaction rollback mechanisms during unexpected server or database failures."
  ]));

  elements.push(...createSubsectionPage("1.5", "Importance of the Application", [
    "Modern educational institutions require dependable, fault-tolerant digital infrastructure to administer academic programs. By establishing an integrated database management system, universities eliminate human data-entry errors, ensure regulatory compliance, provide transparent auditability for all registration events, and democratize access to academic standing metrics for enrolled students.",
    "For students, the application provides self-service empowerment: learners can independently browse course descriptions, inspect prerequisite requirements, register for desired cohorts, review individualized weekly timetables, and monitor cumulative grade point averages in real time without navigating administrative queues.",
    "From an engineering and educational standpoint, this project bridges theoretical database design principles with full-stack software engineering. It illustrates the complete end-to-end lifecycle of academic data: from client-side state collection, through HTTP request marshaling, middleware token validation, and connection pool allocation, to binary database execution on disk."
  ]));

  elements.push(...createSubsectionPage("1.6", "Target Users and Audience", [
    "The primary user groups interacting with the portal are categorized into two major operational roles: Registered Students and Academic Administrators. Students utilize the self-service interface to register their accounts, authenticate their sessions, browse course offerings, enroll in courses within their assigned academic cluster, track their class schedules, and review published examination grades.",
    "Academic Administrators represent department chairs, registrars, and academic evaluators. Administrators utilize administrative dashboards to monitor campus-wide enrollment occupancy, inspect student demographics, manage academic clusters, enforce CGPA overrides when sanctioned by academic committees, and audit historical course drop/add events for compliance.",
    "Faculty data is systematically modeled within the database schema to represent teaching staff qualifications, departments, and course assignments. Although faculty records are managed through administrative views in the current release, the modular architecture lays the structural groundwork for future dedicated faculty portals."
  ]));

  elements.push(...createSubsectionPage("1.7", "Project Overview", [
    "The system implements a classic 3-Tier Layered Architecture consisting of a Presentation Tier (React SPA), an Application Logic Tier (Express REST API), and a Data Persistence Tier (MySQL InnoDB RDBMS). Client browsers execute compiled React components that initiate asynchronous fetch calls using standardized JSON envelopes to the backend service.",
    "The Node.js server receives inbound HTTP requests, applies security and CORS headers, parses JSON request bodies, and executes route-specific controllers. Database interactions are executed over a persistent connection pool using the mysql2/promise driver, ensuring high throughput, parameter binding against SQL injection, and automatic connection reuse.",
    "The database tier enforces relational integrity at the storage level. All table creations adhere to third normal form (3NF), foreign key cascades are deliberately controlled, and transactional routines ensure that concurrent requests cannot violate capacity constraints or corrupt student enrollment records."
  ]));

  elements.push(...createSubsectionPage("1.8", "Report Organization", [
    "This documentation report is structured into 14 distinct, logically sequential chapters that systematically examine the software system from conception to empirical validation. Chapter 1 introduces the project background, problem statement, scope, and objectives. Chapter 2 details the hardware, software, functional, and non-functional system requirements. Chapter 3 examines the complete technology stack.",
    "Chapter 4 presents the high-level system architecture, component topologies, and request sequence traces. Chapter 5 explores the database design, entity relationships, normalization proofs, views, triggers, and stored routines. Chapter 6 details the implementation of frontend and backend modules. Chapter 7 covers user-facing and administrative features.",
    "Chapter 8 formulates the comprehensive testing strategy, test case matrix, and empirical evidence. Chapter 9 outlines deployment and configuration procedures. Chapter 10 analyzes development challenges and current limitations. Chapter 11 proposes future technical enhancements. Chapter 12 delivers the project conclusion. Chapter 13 provides academic references, and Chapter 14 supplies exhaustive technical appendices."
  ]));

  return elements;
}

function getChapter2() {
  const elements = [];
  elements.push(...createChapterIntro(2, "System Requirements", "This chapter outlines the minimum and recommended hardware configurations, software dependencies, operating system runtimes, development toolsets, functional specifications, and non-functional quality standards necessary to construct, deploy, and maintain the academic portal."));

  elements.push(...createSubsectionPage("2.1", "Hardware Requirements for Development", [
    "The development environment requires workstation hardware capable of executing multiple concurrent background services: the Node.js runtime process, the Vite development server with hot module replacement, the MySQL 8.0 server daemon, an integrated development environment (IDE), and browser developer inspection tools.",
    "Minimum hardware specifications comprise a dual-core 64-bit processor (Intel Core i3 or AMD Ryzen 3 equivalent, 2.0 GHz or higher), 8 GB of physical RAM, and 10 GB of available solid-state storage. This baseline ensures that database connection pools and development build caches operate without thrashing virtual memory swap files.",
    "Recommended workstation specifications comprise a quad-core or hexa-core processor (Intel Core i5/i7 or AMD Ryzen 5/7), 16 GB of DDR4/DDR5 RAM, and high-speed NVMe SSD storage. Additional memory capacity substantially accelerates Vite compilation cycles and enables smooth operation of MySQL Workbench alongside active client sessions."
  ]));

  elements.push(...createSubsectionPage("2.2", "End-User Hardware Requirements", [
    "End-user client hardware requirements are designed to be lightweight and accessible, as all computational processing, query evaluation, and business logic execution occur on the server and database tiers. End users interact with the system strictly via standard web browsers.",
    "Client devices may include standard desktop computers, laptops, chromebooks, tablets, or modern smartphones. Hardware requirements for the client device are limited to an active display resolution of 1024x768 pixels or higher (with responsive support down to 360px mobile viewports), 2 GB of RAM, and a stable network connection capable of handling HTTP/1.1 or HTTP/2 TCP traffic.",
    "Because client browsers receive pre-compiled JavaScript, HTML, and CSS bundles from the web server, no local database drivers, compilers, or server utilities need to be installed on the client machine, guaranteeing seamless universal accessibility across diverse campus devices."
  ]));

  elements.push(...createSubsectionPage("2.3", "Operating System and Runtime", [
    "The application backend and development toolchains are built upon cross-platform web standards, enabling seamless operation across Microsoft Windows (Windows 10, Windows 11, Windows Server), POSIX Linux distributions (Ubuntu 20.04+, Debian, Fedora, CentOS), and Apple macOS.",
    "The primary runtime environment is Node.js, requiring version 20.0.0 LTS or higher (the current verified production environment utilizes Node.js v24.14.1). Node.js provides the asynchronous, non-blocking V8 JavaScript engine that executes Express route handlers and manages database socket connections.",
    "Package management is orchestrated through npm (v10+ or v11+), which resolves project dependencies, validates package checksums via lockfiles, and executes lifecycle automation scripts for compiling, testing, and starting server daemons."
  ]));

  elements.push(...createSubsectionPage("2.4", "Software Requirements", [
    "The core database server requirement is MySQL Community Server version 8.0.16 or higher (specifically configured with the InnoDB storage engine and utf8mb4 collation). MySQL manages relational schema tables, primary and foreign key constraints, analytical views, and stored procedures.",
    "Client-side software requirements entail any evergreen web browser with full ECMAScript 2020+ and CSS Flexbox/Grid support, including Google Chrome (version 100+), Mozilla Firefox (version 100+), Microsoft Edge, or Apple Safari.",
    "Administrative database management is facilitated by MySQL Workbench 8.0 CE or equivalent GUI clients (such as DBeaver or Navicat). API verification, contract testing, and endpoint simulation are supported by Postman (v10+) or standard curl command-line utilities."
  ]));

  elements.push(...createSubsectionPage("2.5", "Development Tools and Frameworks", [
    "The application framework stack incorporates React 18 for building declarative user interfaces, React Router DOM v6 for client-side single-page routing, and Vite 5 as the next-generation frontend build tooling and development server.",
    "The backend server is constructed using Express.js 4.19, complemented by essential middleware packages: cors for cross-origin resource sharing, dotenv for environmental secret isolation, and mysql2 for high-throughput promise-based database connectivity.",
    "Source code authoring and debugging are conducted in Visual Studio Code, augmented with extensions for JavaScript (ES6+), React JSX, SQL syntax highlighting, and Git version control integration. The esbuild bundler provides lightning-fast production asset compilation."
  ]));

  elements.push(...createSubsectionPage("2.6", "Functional Requirements", [
    "The functional requirements specify the operational capabilities delivered by the software system: (1) FR-01: Secure student and administrative authentication with password verification and stateless JWT token issuance; (2) FR-02: Self-service student registration with unique roll number and institutional email validation; (3) FR-03: Real-time course catalog exploration displaying course code, title, credits, schedule, classroom, and live seat availability.",
    "(4) FR-04: Academic cluster selection allowing students to select a cohort track that locks section offerings; (5) FR-05: Atomic course enrollment validating seat capacity, cluster membership, and duplicate enrollment constraints; (6) FR-06: Verified course-drop functionality updating enrollment status and releasing reserved seat capacity; (7) FR-07: Automated timetable generation compiling active enrollments into structured weekly class schedules.",
    "(8) FR-08: Academic transcript and grade viewing presenting internal, midterm, and final assessment scores; (9) FR-09: Student notification center tracking enrollment confirmations and administrative alerts; (10) FR-10: Administrative telemetry console displaying campus-wide enrollment statistics, occupancy percentages, and audit logs."
  ]));

  elements.push(...createSubsectionPage("2.7", "Non-Functional Requirements", [
    "The system adheres to rigorous non-functional quality standards: (1) Performance: API endpoint response latencies must remain below 100 milliseconds for standard read operations under nominal local loads; database queries must leverage secondary B-Tree indexes to prevent full table scans.",
    "(2) Data Integrity: The database must strictly enforce ACID transactional properties; foreign key constraints must prohibit orphan child records, and domain CHECK constraints must ensure that marks (0–100), credits (1–6), and GPAs (0.0–10.0) remain within valid ranges.",
    "(3) Reliability and Availability: The system must handle unexpected client disconnection or invalid payloads gracefully without crashing the Node.js process; database connection pools must automatically reconnect after transient network dropouts; (4) Security: Passwords must be hashed using cryptographic algorithms; all API parameters must use prepared statements to prevent SQL injection vulnerabilities."
  ]));

  elements.push(...createSubsectionPage("2.8", "Assumptions and Constraints", [
    "System development and documentation are formulated under specific engineering assumptions: (1) The application is designed to operate against a local or private intranet MySQL 8.0+ server instance; (2) Relational SQL scripts employ MySQL-specific procedural syntax (DELIMITER, stored procedures, DECLARE) and are not directly portable to PostgreSQL or Oracle without dialect translation.",
    "(3) Academic terms are structured on a trimester/semester basis where course enrollments belong to the active academic term; (4) Sample student profiles, faculty entries, and assessment grades provided in the seed files represent realistic development datasets and do not expose confidential institutional records.",
    "(5) Network connectivity between the Express API server and MySQL daemon is assumed to have minimal latency (<5ms) within the local host loopback interface (127.0.0.1:3306)."
  ]));

  return elements;
}

function getChapter3() {
  const elements = [];
  elements.push(...createChapterIntro(3, "Technology Stack", "This chapter presents an in-depth analysis of the technologies, architectural libraries, runtimes, and database engines comprising the Student Course Enrollment and Distributed Academic Management System stack."));

  elements.push(...createSubsectionPage("3.1", "Front-End Overview", [
    "The client-side presentation layer is implemented as a modern Single Page Application (SPA) powered by React 18. React's component-based model decomposes complex academic views—such as course catalogs, enrollment planners, and grade transcripts—into modular, reusable, and testable UI elements.",
    "By maintaining an in-memory Virtual DOM representation, React efficiently computes minimal layout diffs and batches DOM mutations, ensuring fluid, responsive client interactions without full page reloads. This is vital during high-frequency enrollment operations where immediate visual feedback is essential.",
    "The application utilizes modern React design paradigms, including functional components, custom hooks, and the Context API for shared global state. The compilation pipeline is driven by Vite 5, providing rapid Hot Module Replacement (HMR) and optimized production minification."
  ]));

  elements.push(...createSubsectionPage("3.2", "HTML, CSS, and Browser Rendering", [
    "The user interface styling is authored in clean, modular Vanilla CSS without reliance on heavy utility frameworks or bloated component libraries. This approach provides fine-grained control over layout rendering, prevents style pollution, and ensures high performance.",
    "Stylesheets are partitioned logically into four dedicated modules: global.css (design tokens, CSS variables, typography, and reset rules), layout.css (grid containers, responsive flex wrappers, headers, and navigation sidebars), components.css (buttons, badges, cards, modals, and form controls), and pages.css (page-specific layout overrides).",
    "Modern CSS features such as CSS custom properties (variables for harmonious academic color palettes), Flexbox, CSS Grid, and media queries guarantee responsive adaptation across standard desktop displays, tablets, and mobile smartphones while preserving WCAG accessibility contrast ratios."
  ]));

  elements.push(...createSubsectionPage("3.3", "React and Component-Based Design", [
    "The frontend follows atomic design principles. Reusable presentation components reside in src/components/, including Header (user identity, notifications, logout triggers), Sidebar (role-based navigation links), StatCard (metric visualization), CourseCard (course metadata and enrollment triggers), Modal (confirmation dialogues), and ToastContainer (ephemeral alerts).",
    "Global application state is managed by AppContext located in src/context/AppContext.jsx. The context provider centralizes authentication tokens, active user profiles, course inventories, active enrollments, and notification state. This architecture eliminates deep prop drilling across intermediate components.",
    "When a student performs an enrollment or drop action, context dispatcher functions trigger background API calls and synchronize local state upon successful server confirmation, ensuring that UI indicators and seat counts update immediately."
  ]));

  elements.push(...createSubsectionPage("3.4", "Routing and Protected Pages", [
    "Client-side navigation and URL synchronization are orchestrated by React Router DOM version 6 in src/AppRoutes.jsx. The route tree defines explicit mappings between browser URLs and high-level page views.",
    "To safeguard sensitive academic resources, the architecture implements a custom ProtectedRoute component wrapper. Unauthenticated sessions attempting to access protected routes (such as /dashboard, /courses, /grades, or /admin) are intercepted and redirected to the login view with state history preserved.",
    "Furthermore, the routing system enforces role-based access control (RBAC). Dedicated administrative routes (such as /admin, /admin/students, /admin/clusters) verify the authenticated user's role and block standard student accounts from accessing privileged administrative screens."
  ]));

  elements.push(...createSubsectionPage("3.5", "Back-End Overview", [
    "The application backend is built upon Node.js and Express.js (v4.19). Node.js provides a single-threaded, event-driven runtime utilizing libuv to execute non-blocking, asynchronous I/O operations, making it ideally suited for I/O-intensive database web applications.",
    "The Express server initializes in server/server.js and mounts its primary application logic in server/app.js. The server applies essential security middleware, configures JSON body parsers with payload size limits (64kb), and mounts decoupled route modules.",
    "Endpoints are organized modularly: auth.routes.js (login, registration), students.routes.js (profile, directory), courses.routes.js (catalog, prerequisites), enrollments.routes.js (registration, dropping), grades.routes.js (transcripts), timetable.routes.js (schedules), notifications.routes.js (alerts), clusters.routes.js (cohorts), and admin.routes.js (telemetry)."
  ]));

  elements.push(...createSubsectionPage("3.6", "MySQL and mysql2", [
    "Persistent data storage is powered by MySQL 8.0, utilizing the transactional InnoDB storage engine. MySQL provides row-level locking, foreign key enforcement, multi-version concurrency control (MVCC), and crash-safe write-ahead logging (WAL).",
    "Node.js interacts with MySQL via the mysql2/promise driver configured in server/config/db.js. The driver creates an optimized connection pool with a maximum connection limit of 10, connection queuing, and automatic thread recycling, preventing resource exhaustion during traffic spikes.",
    "All SQL queries execute via parameterized prepared statements (using ? placeholders). This architectural separation of query structure and user-supplied data completely neutralizes SQL injection threats and optimizes query execution plan caching within the MySQL engine."
  ]));

  elements.push(...createSubsectionPage("3.7", "REST APIs and JSON", [
    "Client-server communication strictly adheres to REST (Representational State Transfer) architectural constraints. Communication occurs over HTTP using JSON (JavaScript Object Notation) as the universal serialization format.",
    "Endpoints follow predictable RESTful noun naming conventions: GET /api/courses (retrieve catalog), POST /api/enrollments (create enrollment), DELETE /api/enrollments (drop enrollment), and GET /api/grades/:studentId (retrieve student transcript).",
    "Responses are encapsulated within a standardized JSON response envelope containing success (boolean), message (string), and payload data objects. HTTP status codes communicate outcome semantics accurately: 200 OK for successful reads, 201 Created for additions, 400 Bad Request for validation errors, 401 Unauthorized for invalid tokens, 409 Conflict for duplicate keys, and 500 for server errors."
  ]));

  elements.push(...createSubsectionPage("3.8", "Environment Configuration", [
    "The backend adheres to Twelve-Factor App methodology by decoupling application logic from environment configuration. Sensitive connection parameters and secrets are loaded into process.env at boot time via dotenv from server/.env.",
    "Configurable environment variables include DB_HOST, DB_PORT, DB_USER, DB_PASSWORD (or DB_PASSWORD_B64 for base64 encoded strings), DB_NAME, PORT, and JWT_SECRET. The server enforces a mandatory security check verifying that JWT_SECRET contains at least 32 cryptographically secure characters.",
    "To prevent inadvertent credential leakage, server/.env is explicitly listed in .gitignore, while server/.env.example provides sanitized template directives for onboarding new development workstations."
  ]));

  elements.push(...createSubsectionPage("3.9", "Version Control and Build Tools", [
    "Project source code is maintained under Git version control, following standard branch isolation practices. The repository structure separates client source code (src/) from server route controllers (server/) and database initialization scripts (server/db/).",
    "Frontend compilation is executed via npm scripts. Running npm run build triggers scripts/build.mjs, which leverages the blazing-fast esbuild compiler to bundle and minify JavaScript modules into a compact dist/assets/app.js artifact, accompanied by pre-rendered production HTML.",
    "Development orchestration utilizes concurrently (npm run dev) to spawn both the Express server in watch mode (node --watch) and the Vite frontend dev server in parallel, providing seamless developer ergonomics."
  ]));

  elements.push(...createSubsectionPage("3.10", "Technology Stack Summary", [
    "The assembled technology stack—React 18, Node.js 24, Express 4.19, and MySQL 8.0—represents a mature, robust, and highly maintainable architecture for academic enterprise software. The table below summarizes the stack components and their respective architectural responsibilities.",
    "Presentation Layer: React 18, React Router v6, Vanilla CSS (Dynamic UI rendering and client-side routing);\nApplication Layer: Node.js, Express.js (REST API orchestration, token authorization, request validation);\nDatabase Layer: MySQL 8.0, InnoDB Engine (Transactional persistence, ACID integrity, analytical views);\nTooling: Vite 5, esbuild, npm, Git, Postman, MySQL Workbench (Compilation, testing, and administration).",
    "This decoupled full-stack architecture achieves a high degree of maintainability, modular testability, and security, ensuring that database consistency rules are enforced at the storage engine level regardless of client behavior."
  ]));

  return elements;
}

function getChapter4() {
  const elements = [];
  elements.push(...createChapterIntro(4, "System Architecture", "This chapter presents the architectural blueprints, structural layers, request sequence flows, and deployment topologies of the Student Course Enrollment and Distributed Academic Management System."));

  elements.push(...createSubsectionPage("4.1", "High-Level Architecture", [
    "The system is organized around a 3-Tier Layered Architecture that establishes clear separation of concerns across presentation, business logic, and data persistence. Each tier is decoupled through standardized interface boundaries, ensuring modularity, security, and independent maintainability.",
    "The Presentation Tier executes entirely within the user's browser environment, providing interactive views and capturing user events. The Application Logic Tier runs within a Node.js process hosting an Express HTTP server; it acts as an authenticated gateway, validating client input, verifying session tokens, and orchestrating business workflows.",
    "The Data Persistence Tier resides in the MySQL RDBMS, which manages persistent storage on disk, executes relational queries, evaluates triggers, and enforces referential integrity constraints across academic entities."
  ]));

  elements.push(...createSubsectionPage("4.2", "Architecture Diagram", [
    "The system architecture follows a clean horizontal tiered topology with well-defined communication channels. The diagram below illustrates the comprehensive request-response flow across the Presentation Layer, the Application/API Layer, and the MySQL Database Layer.",
    "Client requests initiated from React components pass through a centralized API service and travel over HTTP to the Express backend. The server processes requests through authentication and validation middlewares before routing them to domain-specific controllers. Database queries are executed over pooled connections to MySQL 8.0.",
    "Responses generated by the database engine return through the connection pool, where the Express server formats them into standardized JSON envelopes and returns them to the React client to update local UI state."
  ], archImgPath));

  elements.push(...createSubsectionPage("4.3", "Presentation Layer", [
    "The Presentation Layer encompasses all visual elements, client routing, layout containers, and user interaction logic. Built as a Single Page Application using React 18, it renders dynamic views without triggering full page reloads, providing desktop-class application performance.",
    "The layer contains three primary subsystems: (1) View Components: Dashboard, CourseCatalog, CourseDetails, MyCourses, Timetable, Grades, Notifications, StudentProfile, and AdminManagement; (2) Shared UI Library: Navbars, Sidebars, Modals, Badges, and Alert Toasts; (3) State Management: AppContext, which maintains active user identity, token caches, and synchronized academic data.",
    "The Presentation Layer is strictly decoupled from direct database communication. It interacts with the backend solely through asynchronous HTTP fetch operations via src/services/api.js, ensuring that database credentials and server logic remain inaccessible to client browser inspection."
  ]));

  elements.push(...createSubsectionPage("4.4", "API and Application Layer", [
    "The Application Layer is hosted on a Node.js runtime and driven by Express.js 4.19. It exposes RESTful HTTP endpoints listening on port 5000 (configurable via environment variables) and coordinates incoming client requests with database operations.",
    "Upon receiving an inbound request, the layer executes a structured middleware pipeline: (1) Security Headers: sets X-Content-Type-Options, X-Frame-Options, and Referrer-Policy; (2) Body Parsing: decodes JSON payloads with a strict 64kb limit; (3) Authentication Filter: verifies Bearer JWT tokens in authorization headers; (4) Rate Limiting: restricts excessive authentication attempts to prevent brute-force attacks.",
    "Validated requests are dispatched to dedicated controller routes that execute business logic, query the MySQL connection pool, and format JSON responses. A centralized error handling middleware catches unhandled exceptions, maps database error codes (such as ER_DUP_ENTRY and ER_NO_REFERENCED_ROW_2) to appropriate HTTP statuses, and logs diagnostic traces."
  ]));

  elements.push(...createSubsectionPage("4.5", "Data Layer", [
    "The Data Layer is implemented in MySQL 8.0, utilizing the InnoDB storage engine for all database tables. InnoDB provides ACID transaction compliance, row-level locking for high concurrency, foreign key constraints, and crash recovery via write-ahead logging.",
    "The database schema (student_portal_db) organizes academic entities into normalized relational tables. It defines declarative constraints including PRIMARY KEY, UNIQUE, FOREIGN KEY, and domain CHECK constraints to guarantee data integrity at the storage layer.",
    "Beyond static tables, the Data Layer incorporates advanced database programming constructs: analytical views (v_student_academic_summary, v_course_enrollment_stats, v_student_rankings), automated audit triggers (tr_enrollment_insert, tr_enrollment_update), and stored procedures (sp_student_transcript, fn_calculate_student_avg)."
  ]));

  elements.push(...createSubsectionPage("4.6", "Enrollment Request Sequence", [
    "The course enrollment workflow represents the core transactional sequence of the system. It executes through the following coordinated steps: (1) User Action: A student selects a course section on the frontend and clicks 'Enroll Now'; (2) API Dispatch: src/services/api.js transmits a POST request to /api/enrollments with courseId and sectionId.",
    "(3) Authentication Check: The authenticate middleware validates the student's JWT token, extracting the verified student ID; (4) Business Validation: The enrollment controller verifies that the student is active, checks academic cluster alignment, and ensures the student has not already enrolled in this course.",
    "(5) Database Transaction: A connection is acquired from the pool; a query checks seat availability; an INSERT is executed on the enrollments table; (6) Trigger Execution: The MySQL trigger tr_enrollment_insert fires automatically, writing an immutable record to enrollment_audit_log; (7) Notification: A notification record is inserted; (8) Response: A 201 Created JSON response is returned, triggering a UI state refresh on the client."
  ]));

  elements.push(...createSubsectionPage("4.7", "Course-Drop Request Sequence", [
    "The course-drop sequence provides an atomic, reversible mechanism for withdrawing from an enrolled course: (1) User Action: The student navigates to 'My Courses' and initiates a drop request; (2) API Request: A DELETE request is transmitted to /api/enrollments with studentId and courseId.",
    "(3) Verification: The server validates authentication and checks that an active enrollment record exists with status 'Enrolled'; (4) Status Transition: The backend executes an UPDATE setting status = 'Dropped'; (5) Audit Trigger: The MySQL trigger tr_enrollment_update fires immediately, recording a 'DROPPED' event in enrollment_audit_log.",
    "(6) Capacity Adjustment: Available seats in the course are recalculated; (7) Timetable Synchronization: Corresponding timetable slots are deactivated; (8) Confirmation: The server returns 200 OK, and the frontend updates the student's enrolled courses and timetable views."
  ]));

  elements.push(...createSubsectionPage("4.8", "Deployment Architecture", [
    "The system is architected for both streamlined local development and robust on-premises campus deployment. In local development mode, Vite serves frontend modules on port 5173 while Express listens on port 5000, connected via proxy routing.",
    "For production deployment, the frontend React application is pre-compiled and bundled into optimized static assets within the dist/ directory. The Express backend serves these static production assets directly from its root path while exposing the API on /api/*, consolidating the entire full-stack application into a single unified port (5000).",
    "Database connectivity is maintained over local loopback (127.0.0.1:3306), isolated from public network interfaces. A production checklist mandates SSL/TLS termination via a reverse proxy (such as Nginx), environment secret rotation, and automated daily MySQL mysqldump backup routines."
  ]));

  return elements;
}

module.exports = {
  getFrontMatter,
  getChapter1,
  getChapter2,
  getChapter3,
  getChapter4
};
