import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Modal from '../components/Modal';
import StatCard from '../components/StatCard';

const MyCourses = () => {
  const { enrolledCourses, dropCourse, grades } = useApp();
  const navigate = useNavigate();

  const [courseToDrop, setCourseToDrop] = useState(null);

  const totalCredits = enrolledCourses.reduce((sum, c) => sum + c.credits, 0);

  const getCourseMeta = (courseCode) => {
    const course = enrolledCourses.find(c=>c.courseCode===courseCode);
    const gradeObj = grades.find(g=>g.courseCode===courseCode);
    return {attendance:Number(course?.attendanceRate||0).toFixed(1),grade:gradeObj?.grade||'Not published'};
  };

  const handleConfirmDrop = async () => {
    if (courseToDrop) {
      if(await dropCourse(courseToDrop.id)) setCourseToDrop(null);
    }
  };

  return (
    <div>
      <div className="catalog-header-bar">
        <h1>My Enrolled Courses</h1>
        <p>Active course registrations, weekly attendance statistics, and academic grading progress.</p>
      </div>

      {/* Summary KPI Bar */}
      <div className="my-courses-summary">
        <StatCard
          title="Active Registered Courses"
          value={enrolledCourses.length}
          subtext="Fall Semester 2026"
          badgeText="Registered"
          color="blue"
          icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
              <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
            </svg>
          }
        />

        <StatCard
          title="Total Term Credits"
          value={`${totalCredits} Credits`}
          subtext="Full-time Enrollment Load"
          badgeText="Full Time"
          color="purple"
          icon={
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
            </svg>
          }
        />

        <StatCard
          title="Average Attendance"
          value={`${(enrolledCourses.length ? enrolledCourses.reduce((n,c)=>n+Number(c.attendanceRate||0),0)/enrolledCourses.length : 0).toFixed(1)}%`} 
          subtext="Across all enrolled lecture labs"
          badgeText="Good Standing"
          color="green"
          icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
          }
        />
      </div>

      {/* Course List */}
      {enrolledCourses.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
              <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
            </svg>
          </div>
          <h3 className="empty-state-title">You Have No Active Enrolled Courses</h3>
          <p className="empty-state-desc">
            You are not currently registered for any courses this semester. Visit the catalog to select your modules.
          </p>
          <Link to="/courses" className="btn btn-primary">
            Browse Course Catalog
          </Link>
        </div>
      ) : (
        <div className="enrolled-course-list">
          {enrolledCourses.map((course) => {
            const meta = getCourseMeta(course.courseCode);
            return (
              <div key={course.id} className="enrolled-course-card">
                {/* Course Name & Code */}
                <div className="enrolled-card-info">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <span className="course-code-pill">{course.courseCode}</span>
                    <span className={`badge badge-${course.courseType.toLowerCase()}`}>
                      {course.courseType}
                    </span>
                    <span className="badge badge-success">Enrolled</span>
                  </div>
                  <h3>{course.courseName}</h3>
                  <div className="enrolled-instructor">
                    {course.department} • {course.credits} Credits
                  </div>
                </div>

                {/* Schedule */}
                <div>
                  <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: '600', textTransform: 'uppercase' }}>
                    Class Schedule
                  </div>
                  <div style={{ fontSize: '0.88rem', fontWeight: '600', color: '#1e293b', marginTop: '2px' }}>
                    {course.schedule}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                    {course.classroom}
                  </div>
                </div>

                {/* Attendance */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: '600' }}>
                    <span style={{ color: '#64748b' }}>Attendance</span>
                    <span style={{ color: '#059669' }}>{meta.attendance}%</span>
                  </div>
                  <div className="enrolled-attendance-bar">
                    <div
                      className="attendance-fill"
                      style={{ width: `${meta.attendance}%` }}
                    ></div>
                  </div>
                  <div style={{ fontSize: '0.74rem', color: '#94a3b8', marginTop: '4px' }}>
                    Recorded attendance
                  </div>
                </div>

                {/* Grade */}
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: '600', textTransform: 'uppercase', marginBottom: '4px' }}>
                    Current Grade
                  </div>
                  <span className="badge badge-neutral" style={{ fontSize: '0.88rem', padding: '4px 12px' }}>
                    {meta.grade}
                  </span>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', justifyContent: 'flex-end' }}>
                  <Link to={`/courses/${course.id}`} className="btn btn-outline btn-sm">
                    View Course
                  </Link>

                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => navigate('/grades')}
                  >
                    Grades
                  </button>

                  <button
                    type="button"
                    className="btn btn-danger btn-sm"
                    onClick={() => setCourseToDrop(course)}
                    title="Drop Course"
                  >
                    Drop
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Drop Course Confirmation Modal */}
      <Modal
        isOpen={courseToDrop !== null}
        onClose={() => setCourseToDrop(null)}
        title="Confirm Course Drop"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setCourseToDrop(null)}>
              Cancel
            </button>
            <button className="btn btn-danger" onClick={handleConfirmDrop}>
              Drop Course
            </button>
          </>
        }
      >
        {courseToDrop && (
          <div>
            <p style={{ color: '#e11d48', fontWeight: '700', fontSize: '1rem', marginBottom: '8px' }}>
              Are you sure you want to drop this course?
            </p>
            <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '14px' }}>
              <div style={{ fontWeight: '700', color: '#0f172a' }}>
                {courseToDrop.courseCode}: {courseToDrop.courseName}
              </div>
              <div style={{ fontSize: '0.86rem', color: '#64748b', marginTop: '4px' }}>
                Department: {courseToDrop.department} • Credits: {courseToDrop.credits}
              </div>
            </div>
            <p style={{ fontSize: '0.86rem', color: '#64748b', lineHeight: 1.5 }}>
              By dropping this course, you will relinquish your allocated seat and your enrolled credit count will decrease. You can re-enroll later as long as seats remain open.
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default MyCourses;
