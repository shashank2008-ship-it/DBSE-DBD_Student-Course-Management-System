import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Modal from './Modal';

const CourseCard = ({ course }) => {
  const { enrolledCourseIds, enrollCourse, enrolledCourses,currentUser } = useApp();
  const [selectedSection, setSelectedSection] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEnrolled = enrolledCourseIds.includes(course.id);
  const enrolledRecord = enrolledCourses.find((c) => c.id === course.id);
  const enrolledSectionId = enrolledRecord?.sectionId;

  const sections = course.sections || [];

  const handleOpenEnrollModal = (section) => {
    setSelectedSection(section);
    setIsModalOpen(true);
  };

  const handleConfirmEnroll = async () => {
    if (!selectedSection) return;
    setIsSubmitting(true);
    try {
      if(await enrollCourse(course.id, selectedSection.id)) setIsModalOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className={`course-card ${isEnrolled ? 'enrolled-card' : ''}`}>
        <div>
          {/* Header */}
          <div className="course-card-header">
            <span className="course-code-pill">{course.courseCode}</span>
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
              <span className={`badge badge-${(course.courseType || 'Core').toLowerCase()}`}>
                {course.courseType || 'Core'}
              </span>
              {isEnrolled && (
                <span className="badge badge-success">
                  Enrolled ({enrolledRecord?.sectionName || 'Active'})
                </span>
              )}
            </div>
          </div>

          <h3 className="course-card-title">{course.courseName}</h3>

          <div className="course-card-meta">
            <div className="course-meta-row">
              <svg className="course-meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
              </svg>
              <span>{course.credits} Credits • {course.department}</span>
            </div>
          </div>

          <p className="course-card-description">{course.description}</p>
        </div>

        {/* Multi-Section Allocation Box (Section 1 vs Section 2) */}
        <div style={{ marginTop: '16px', borderTop: '1px solid #f1f5f9', paddingTop: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.76rem', fontWeight: '800', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Available Class Sections:
            </span>
            <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
              Live capacity
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {!sections.length&&<Link to="/clusters" className="btn btn-secondary">{currentUser.clusterId?"No offerings in your cluster":"Select a cluster to enroll"}</Link>}
            {sections.map((sec) => {
              const isStudentInSection = isEnrolled && enrolledSectionId === sec.id;
              const isOtherSectionEnrolled = isEnrolled && enrolledSectionId !== sec.id;
              const fillPct = sec.totalSeats ? Math.round((sec.filledSeats / sec.totalSeats) * 100) : 0;
              const isHalfOrMore = fillPct >= 50;
              const isFull = sec.availableSeats <= 0;

              return (
                <div
                  key={sec.id}
                  style={{
                    background: isStudentInSection ? '#eff6ff' : '#f8fafc',
                    border: '1px solid',
                    borderColor: isStudentInSection ? '#93c5fd' : '#e2e8f0',
                    borderRadius: '10px',
                    padding: '12px 14px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <strong style={{ fontSize: '0.86rem', color: '#0f172a' }}>{sec.sectionName}</strong>
                      <span
                        style={{
                          fontSize: '0.72rem',
                          fontWeight: '700',
                          padding: '2px 7px',
                          borderRadius: '999px',
                          background: isFull ? '#fee2e2' : isHalfOrMore ? '#fef3c7' : '#dcfce7',
                          color: isFull ? '#b91c1c' : isHalfOrMore ? '#b45309' : '#15803d'
                        }}
                      >
                        {isFull ? `Full (${sec.filledSeats}/${sec.totalSeats})` : isHalfOrMore ? `${sec.filledSeats}/${sec.totalSeats} (Half Full)` : `${sec.filledSeats}/${sec.totalSeats} (Empty / Open)`}
                      </span>
                    </div>

                    <span style={{ fontSize: '0.75rem', fontWeight: '700', color: isFull ? '#b91c1c' : '#059669' }}>
                      {sec.availableSeats} open
                    </span>
                  </div>

                  <div style={{ fontSize: '0.76rem', color: '#64748b' }}>
                    Instructor: <strong style={{ color: '#334155' }}>{sec.facultyName}</strong> • {sec.schedule} ({sec.classroom})
                  </div>

                  {/* Capacity progress bar */}
                  <div style={{ height: '5px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                    <div
                      style={{
                        height: '100%',
                        width: `${Math.min(100, Math.max(0, fillPct))}%`,
                        background: isFull ? '#ef4444' : isHalfOrMore ? '#f59e0b' : '#10b981',
                        borderRadius: '4px',
                        transition: 'width 0.4s ease'
                      }}
                    />
                  </div>

                  {/* Section-specific Action Button */}
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '4px' }}>
                    {isStudentInSection ? (
                      <span
                        style={{
                          fontSize: '0.76rem',
                          fontWeight: '700',
                          color: '#1d4ed8',
                          background: '#dbeafe',
                          padding: '4px 10px',
                          borderRadius: '6px'
                        }}
                      >
                        ✓ Enrolled in this Section
                      </span>
                    ) : isOtherSectionEnrolled ? (
                      <button
                        type="button"
                        onClick={() => handleOpenEnrollModal(sec)}
                        disabled={isFull}
                        className="btn btn-outline btn-sm"
                        style={{ fontSize: '0.76rem', padding: '4px 10px' }}
                      >
                        Switch to {sec.sectionName}
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleOpenEnrollModal(sec)}
                        disabled={isFull}
                        className="btn btn-primary btn-sm"
                        style={{
                          fontSize: '0.76rem',
                          padding: '4px 12px',
                          background: isFull ? '#94a3b8' : undefined,
                          borderColor: isFull ? '#94a3b8' : undefined
                        }}
                      >
                        {isFull ? 'Section Full' : `Enroll in ${sec.sectionName} →`}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '14px' }}>
            <Link to={`/courses/${course.id}`} className="btn btn-outline btn-sm" style={{ width: '100%', textAlign: 'center' }}>
              View Detailed Syllabus & Course Outcomes →
            </Link>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {selectedSection && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={`Confirm Enrollment: ${course.courseCode}`}
          footer={
            <>
              <button className="btn btn-secondary" onClick={() => setIsModalOpen(false)} disabled={isSubmitting}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleConfirmEnroll} disabled={isSubmitting}>
                {isSubmitting ? 'Confirming...' : `Confirm Enrollment in ${selectedSection.sectionName}`}
              </button>
            </>
          }
        >
          <p style={{ color: '#0f172a', fontSize: '0.92rem' }}>
            You are registering for <strong>{course.courseName}</strong> in <strong>{selectedSection.sectionName}</strong>:
          </p>

          <div style={{ marginTop: '14px', padding: '14px', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontWeight: '800', color: '#1d4ed8', fontSize: '1rem' }}>
              {selectedSection.sectionName} • {course.courseCode}
            </div>
            <div style={{ fontSize: '0.84rem', color: '#334155', marginTop: '6px' }}>
              Faculty Instructor: <strong>{selectedSection.facultyName}</strong>
            </div>
            <div style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '4px' }}>
              Class Schedule: <strong>{selectedSection.schedule}</strong> ({selectedSection.classroom})
            </div>
            <div style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '4px' }}>
              Section Capacity: <strong>{selectedSection.availableSeats} of {selectedSection.totalSeats} seats open</strong>
            </div>
          </div>

          <p style={{ marginTop: '14px', fontSize: '0.82rem', color: '#64748b' }}>
            Once registered, your seat in {selectedSection.sectionName} is secured, and your weekly class timetable will immediately display this lecture slot and classroom.
          </p>
        </Modal>
      )}
    </>
  );
};

export default CourseCard;
