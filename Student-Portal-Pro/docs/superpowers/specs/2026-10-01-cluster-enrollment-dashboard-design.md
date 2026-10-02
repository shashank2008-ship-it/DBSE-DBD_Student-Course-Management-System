# Cluster Enrollment and Academic Dashboard Design

## Goal

Extend Student Portal Pro with four academic clusters, cluster-restricted course enrollment, richer student and admin dashboards, and an admin-managed CGPA value. Preserve the existing React, Express, and MySQL architecture and existing student, course, grade, attendance, and enrollment data.

## User-facing behavior

### Clusters and enrollment

- Provide four clusters for the active academic semester.
- Each cluster contains two or three section groups. Existing course sections will be assigned to a cluster and section group; courses can be offered in multiple clusters.
- A student selects one cluster for the semester. The student may select/change clusters until an enrollment exists. Once enrolled, the choice is locked for the semester; changing it requires an admin operation that first verifies the change will not leave conflicting enrollments.
- Course catalog and section selection show eligible offerings for the selected cluster. If the student has not selected a cluster, show a cluster-selection step before enrollment.
- All enrollment and waitlist requests are checked on the server. A section in a different cluster is rejected with a clear message, even if the request bypasses the UI.
- Course eligibility, seat capacity, prerequisite, timetable, and credit-limit rules continue to apply.

### Student dashboard

- Add a clear cluster card with the selected cluster and its section groups.
- Improve the dashboard hierarchy with summary cards for CGPA, current-semester GPA, enrolled courses, completed credits, and attendance.
- Add a concise enrolled-course view and academic progress visualization using existing grades and credits.
- Explain when CGPA is admin-entered versus calculated from published grades.

### Admin dashboard and records

- Add cluster overview cards showing students, course offerings, and section groups for each cluster.
- Extend the student directory with cluster, course count, enrolled course/section details, and CGPA.
- Allow administrators to set or clear an individual CGPA override, validate it in the 0–10 range, and enter a reason.
- Keep the calculated GPA from published grades available. Display the admin override as the student-facing CGPA when present, label it as admin-entered, and retain the calculated value for transparency.
- Add an audit trail for CGPA override changes and admin-driven cluster changes.

## Data model and migration

- Add `academic_clusters` with a semester-scoped unique cluster code and display name.
- Add a cluster reference and section-group label to `course_sections`; keep current course-section identity and seat data intact.
- Add a nullable selected-cluster reference to `students`, scoped through the student's current semester.
- Add nullable CGPA override value, reason, update timestamp, and admin reference to `students` or a dedicated overrides table; use a separate audit table for change history.
- Make schema updates idempotent for the existing MySQL setup flow. Preserve existing enrollments and grades. Existing records without cluster metadata remain readable; seed/setup assigns cluster metadata to demo offerings without silently deleting data.
- Seed four example clusters and two or three section groups per cluster. Ensure demo course offerings cover each seeded cluster so a student can test the enrollment restriction.

## API and validation

- Add authenticated endpoints to list clusters and choose/update a student's cluster. Students can change their own cluster only before enrollment; admins can change it through the audited admin route.
- Extend course/section responses with cluster identifiers and labels and filter student offerings by the selected cluster.
- Enforce cluster compatibility inside the enrollment service transaction before capacity reservation or waitlist insertion.
- Add an admin endpoint to set/clear CGPA overrides; validate role, student ID, numeric range, and reason.
- Extend admin overview and student-directory responses with cluster and CGPA source fields.

## Visual design

- Keep the portal's current light academic visual style and responsive layout.
- Use four visually distinct but coordinated cluster cards, clear selected/locked states, and a small progress/CGPA panel.
- Reuse existing dashboard components and styles where practical. Avoid adding a new frontend dependency.

## Error handling and edge cases

- Students without a cluster are prompted to choose one before enrollment.
- Changing cluster after enrollment returns an actionable conflict message; no existing enrollment is changed implicitly.
- The enrollment transaction rejects a cluster mismatch and rolls back without consuming a seat.
- Students with no published grades see an unset or admin-entered CGPA and are not shown misleading calculated progress.
- Invalid CGPA, unauthorized changes, invalid cluster IDs, and stale cluster choices return clear API errors.
- Existing rows and database setup remain compatible with rerunning the setup command.

## Verification

- Unit-test cluster compatibility, missing cluster, cluster lock, and CGPA range rules.
- Integration-test student self-service cluster selection, enrollment from the selected cluster, rejection from another cluster, no seat loss on rejection, admin CGPA updates, and admin/student access control.
- Run the existing backend unit and integration tests and the production frontend build.
- Review dashboard and enrollment flows at desktop and narrow viewport widths.

## Assumptions

- Cluster selection applies to the student's current semester.
- A cluster is a cohort of course sections; a course may be offered in more than one cluster.
- Admin-entered CGPA is a visible override, while the grade-derived GPA remains separately stored/calculated and auditable.
- Four clusters and their initial section groups are seeded as editable demo data; administrators can manage offerings through the project UI.

