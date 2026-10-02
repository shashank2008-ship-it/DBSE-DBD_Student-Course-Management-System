# Handout mapping — 25CS1302E

| Handout area | Implementation |
|---|---|
| CO1 relational schema and relationships | Student/course enrollment junction, section/faculty references, prerequisites, grades and attendance tables |
| CO1 DDL and constraints | PK, FK, UNIQUE, NOT NULL, CHECK, InnoDB |
| CO1 SQL querying | Parameterized DML, joins, subqueries, aggregates, CTE analytics |
| CO1 window functions | DENSE_RANK in ranking view and analytics |
| CO1 views | Independent academic aggregates, ranking, course capacity |
| CO1 indexes | Unique enrollment, section/status, waitlist ordering, notification filters |
| CO1 transactions | Atomic enrollment/switch/drop, locks, commit/rollback and competing-seat tests |
| CO1 triggers | Enrollment insert/update audit triggers |
| CO1 stored logic | Transcript procedure used by CSV endpoint, average-marks function available in Workbench |
| CO4 Node/Express | Routers, middleware, async/await, validation, signed JWT authentication and role/ownership access control |
| API/documentation/testing concepts | REST methods, OpenAPI contract, Postman collection, Node tests, health endpoint |
| CO2 | MongoDB and vector database integration are not implemented |
| CO3 framework-specific | FastAPI/Pydantic/SQLAlchemy are not implemented |
| CO4 additional frameworks | Spring Boot, Redis and Socket.io are not implemented |
| CO5 | Modular monolith; not microservices |
| CO6 | Local setup, build and README; no containers/cloud/CI pipeline |

Useful faculty explanation: “We retained React, implemented an Express REST API, and used MySQL for relational records. The backend enforces authenticated ownership, prerequisites, schedule checks and seat capacity. Enrollment changes run in transactions, audit triggers capture database changes, and academic summaries calculate actual grade-weighted GPA and recorded attendance.”
