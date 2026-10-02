import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Modal from '../components/Modal';

const CourseDetails = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { courses, enrolledCourseIds, enrollCourse, dropCourse,currentUser } = useApp();

  const [sectionId,setSectionId]=useState('');
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
  const [isDropModalOpen, setIsDropModalOpen] = useState(false);

  const course = courses.find((c) => c.id === courseId);

  if (!course) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">!</div>
        <h3 className="empty-state-title">Course Not Found</h3>
        <p className="empty-state-desc">The requested course code ({courseId}) does not exist in the current catalog.</p>
        <Link to="/courses" className="btn btn-primary">
          Return to Course Catalog
        </Link>
      </div>
    );
  }

  const isEnrolled = enrolledCourseIds.includes(course.id);
  const chosen=course.sections?.find(s=>s.id===sectionId)||course.sections?.[0];
  const seatsPercent = chosen?.totalSeats?Math.round(((chosen.totalSeats-chosen.availableSeats)/chosen.totalSeats)*100):0;

  const handleConfirmEnroll = async () => {
    if(chosen&&await enrollCourse(course.id,chosen.id))setIsEnrollModalOpen(false);
  };

  const handleConfirmDrop = () => {
    dropCourse(course.id);
    setIsDropModalOpen(false);
  };

  return (
    <div>
      <Link to="/courses" className="back-link-btn">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
        Back to Course Catalog
      </Link>

      {/* Hero Header */}
      <div className="course-details-hero">
        <div className="course-hero-main">
          <div className="course-hero-badges">
            <span className="course-code-pill">{course.courseCode}</span>
            <span className={`badge badge-${course.courseType.toLowerCase()}`}>
              {course.courseType} Course
            </span>
            <span className="badge badge-neutral">{course.semester}</span>
            {isEnrolled && <span className="badge badge-success">Currently Enrolled</span>}
          </div>

          <h1>{course.courseName}</h1>
          <p style={{ fontSize: '1.05rem', color: '#475569', lineHeight: 1.6 }}>
            {course.description}
          </p>

          <div className="course-hero-meta-grid">
            <div>
              <div className="meta-box-label">Course Code</div>
              <div className="meta-box-value">{course.courseCode}</div>
            </div>
            <div>
              <div className="meta-box-label">Academic Department</div>
              <div className="meta-box-value">{course.department}</div>
            </div>
            <div>
              <div className="meta-box-label">Course Credits</div>
              <div className="meta-box-value">{course.credits} Credits</div>
            </div>
            <div>
              <div className="meta-box-label">Classroom Venue</div>
              <div className="meta-box-value">{chosen?.classroom||course.classroom}</div>
            </div>
            <div>
              <div className="meta-box-label">Lecture Schedule</div>
              <div className="meta-box-value">{chosen?.schedule||course.schedule}</div>
            </div>
            <div>
              <div className="meta-box-label">Prerequisites</div>
              <div className="meta-box-value">{course.prerequisites}</div>
            </div>
          </div>
        </div>

        {/* Action Registration Box */}
        <div className="course-hero-action-box">
          {currentUser.clusterId?<label className="pro-field">{currentUser.clusterName}<select value={chosen?.id||""} onChange={e=>setSectionId(e.target.value)}>{course.sections?.map(s=><option key={s.id} value={s.id}>{s.sectionName} · {s.availableSeats} open</option>)}</select></label>:<Link to="/clusters" className="btn btn-primary">Choose cluster first</Link>}
          <div className="action-seats-left">
            <div className="meta-box-label">Current Seat Availability</div>
            <div className="action-seats-number">{chosen?.availableSeats||0}</div>
            <div style={{ fontSize: '0.82rem', color: '#64748b' }}>
              Seats available in selected section out of {chosen?.totalSeats||0}
            </div>

            <div style={{ marginTop: '12px' }}>
              <div className="seat-progress-track">
                <div
                  className="seat-progress-fill available"
                  style={{ width: `${seatsPercent}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div>
            {isEnrolled ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div className="btn btn-secondary" style={{ width: '100%', cursor: 'default', background: '#ecfdf5', color: '#065f46', borderColor: '#a7f3d0' }}>
                  ✓ You are Enrolled
                </div>
                <button
                  type="button"
                  className="btn btn-danger"
                  style={{ width: '100%' }}
                  onClick={() => setIsDropModalOpen(true)}
                >
                  Drop Course
                </button>
              </div>
            ) : (
              <button
                type="button"
                className="btn btn-primary btn-lg"
                style={{ width: '100%' }}
                disabled={!chosen||chosen.availableSeats<=0}
                onClick={() => setIsEnrollModalOpen(true)}
              >
                {course.availableSeats > 0 ? 'Enroll Now' : 'Class is Full'}
              </button>
            )}

            <div style={{ fontSize: '0.74rem', color: '#94a3b8', textAlign: 'center', marginTop: '12px' }}>
              Enrollment changes are validated by the server.
            </div>
          </div>
        </div>
      </div>

      {/* Details Sections: Syllabus, Outcomes, Assessment */}
      <div className="details-content-grid">
        {/* Left Column: Syllabus & Learning Outcomes */}
        <div>
          {/* Syllabus */}
          <div className="details-section-card">
            <h2>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
              </svg>
              Course Curriculum & Weekly Syllabus
            </h2>

            <div className="syllabus-timeline">
              {course.syllabus && course.syllabus.map((item, idx) => (
                <div key={idx} className="syllabus-item">
                  <div className="syllabus-week-badge">{item.week}</div>
                  <div className="syllabus-topic">{item.topic}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Learning Outcomes */}
          <div className="details-section-card">
            <h2>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
              Expected Learning Outcomes
            </h2>

            <ul className="outcomes-list">
              {course.learningOutcomes && course.learningOutcomes.map((outcome, idx) => (
                <li key={idx} className="outcome-item">
                  <span className="outcome-check">✓</span>
                  <span>{outcome}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Column: Assessment Scheme & Course Policies */}
        <div>
          <div className="details-section-card">
            <h2>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
              </svg>
              Grading & Assessment Scheme
            </h2>

            <div className="table-responsive-wrapper" style={{ marginTop: '14px' }}>
              <table className="academic-table">
                <thead>
                  <tr>
                    <th>Component</th>
                    <th>Weight</th>
                  </tr>
                </thead>
                <tbody>
                  {course.assessmentDetails && course.assessmentDetails.map((item, idx) => (
                    <tr key={idx}>
                      <td style={{ fontSize: '0.88rem', fontWeight: '600' }}>{item.component}</td>
                      <td>
                        <span className="badge badge-neutral">{item.weight}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Classroom & Attendance Policy */}
          <div className="details-section-card">
            <h2>Attendance Criteria & Academic Regulations</h2>
            <p style={{ fontSize: '0.86rem', color: '#64748b', lineHeight: 1.6, marginBottom: '12px' }}>
              Attendance is calculated from recorded sessions. Eligibility policies must be configured according to your institution.
            </p>
            <div style={{ padding: '10px 14px', background: '#f8fafc', borderRadius: '4px', border: '1px solid #e2e8f0', fontSize: '0.82rem', color: '#1e40af' }}>
              Scheduled Classroom / Lab Venue: <strong>{chosen?.classroom||course.classroom}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Enroll Modal */}
      <Modal
        isOpen={isEnrollModalOpen}
        onClose={() => setIsEnrollModalOpen(false)}
        title="Confirm Enrollment"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setIsEnrollModalOpen(false)}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleConfirmEnroll}>
              Confirm Enrollment
            </button>
          </>
        }
      >
        <p>Would you like to enroll in <strong>{course.courseCode}: {course.courseName}</strong>?</p>
        <div style={{ marginTop: '12px', padding: '14px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.88rem' }}>
          <div><strong>Schedule:</strong> {chosen?.schedule||course.schedule}</div>
          <div><strong>Venue:</strong> {chosen?.classroom||course.classroom}</div>
          <div><strong>Credits:</strong> {course.credits} Credits</div>
          <div><strong>Section:</strong> {chosen?.sectionName}</div>
          <div><strong>Seats Remaining:</strong> {chosen?.availableSeats||0}</div>
        </div>
      </Modal>

      {/* Drop Modal */}
      <Modal
        isOpen={isDropModalOpen}
        onClose={() => setIsDropModalOpen(false)}
        title="Confirm Course Drop"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setIsDropModalOpen(false)}>
              Keep Course
            </button>
            <button className="btn btn-danger" onClick={handleConfirmDrop}>
              Yes, Drop Course
            </button>
          </>
        }
      >
        <p style={{ color: '#e11d48', fontWeight: '600' }}>
          Are you sure you want to drop {course.courseCode}?
        </p>
        <p style={{ fontSize: '0.88rem', color: '#64748b', marginTop: '10px' }}>
          Your seat will immediately be returned to the course catalog and your weekly schedule will be recalculated.
        </p>
      </Modal>
    </div>
  );
};

export default CourseDetails;
