import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import Modal from '../../components/Modal';

const AdminEnrollments = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [courseFilter, setCourseFilter] = useState('All');

  const [dropTarget, setDropTarget] = useState(null); // { studentId, studentName, courseId, courseName, sectionName }
  const [dropping, setDropping] = useState(false);

  const fetchEnrollments = async () => {
    try {
      setLoading(true);
      const res = await api.admin.getEnrollments();
      if (res?.success) {
        setEnrollments(res.enrollments);
      }
    } catch (err) {
      console.error('Failed to load enrollments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const handleConfirmDrop = async () => {
    if (!dropTarget) return;
    try {
      setDropping(true);
      const res = await api.admin.dropEnrollment(dropTarget.studentId, dropTarget.courseId);
      if (res?.success) {
        setDropTarget(null);
        await fetchEnrollments();
      }
    } catch (err) {
      alert(err.message || 'Failed to drop enrollment.');
    } finally {
      setDropping(false);
    }
  };

  const filteredEnrollments = enrollments.filter((e) => {
    const matchesSearch =
      e.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.rollNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.courseCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.courseName?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'All' || e.status === statusFilter;
    const matchesCourse = courseFilter === 'All' || e.courseCode === courseFilter;

    return matchesSearch && matchesStatus && matchesCourse;
  });

  const uniqueCourses = ['All', ...new Set(enrollments.map((e) => e.courseCode).filter(Boolean))];

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', width: '100%', paddingBottom: '32px' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.65rem', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.02em', margin: '0 0 6px' }}>
          Master Enrollment & Course Drop Ledger
        </h1>
        <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>
          Central institutional registry of all active and dropped course sections per student, with instant administrative drop authority.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div
        style={{
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '12px',
          padding: '16px 20px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '14px',
          boxShadow: '0 2px 6px rgba(15, 23, 42, 0.02)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: '260px' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            type="text"
            placeholder="Search by student name, roll number, or course code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              border: 'none',
              outline: 'none',
              fontSize: '0.88rem',
              color: '#0f172a'
            }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: '600' }}>Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{
                padding: '6px 10px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                fontSize: '0.84rem',
                color: '#0f172a',
                background: '#ffffff'
              }}
            >
              <option value="All">All Statuses</option>
              <option value="Enrolled">Active Enrolled</option>
              <option value="Dropped">Dropped</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: '600' }}>Course:</span>
            <select
              value={courseFilter}
              onChange={(e) => setCourseFilter(e.target.value)}
              style={{
                padding: '6px 10px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                fontSize: '0.84rem',
                color: '#0f172a',
                background: '#ffffff'
              }}
            >
              {uniqueCourses.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={fetchEnrollments}
          >
            Refresh ↻
          </button>
        </div>
      </div>

      {/* Enrollments Master Table */}
      <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.84rem' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569', fontWeight: '700', textTransform: 'uppercase', fontSize: '0.72rem', letterSpacing: '0.05em' }}>
                <th style={{ padding: '14px 18px' }}>Student Roll No & Name</th>
                <th style={{ padding: '14px 18px' }}>Course Code & Name</th>
                <th style={{ padding: '14px 18px' }}>Section</th>
                <th style={{ padding: '14px 18px' }}>Faculty & Room</th>
                <th style={{ padding: '14px 18px' }}>Enrolled At</th>
                <th style={{ padding: '14px 18px' }}>Status</th>
                <th style={{ padding: '14px 18px', textAlign: 'right' }}>Admin Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredEnrollments.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ padding: '36px', textAlign: 'center', color: '#64748b' }}>
                    {loading ? 'Querying enrollment records from MySQL...' : 'No enrollments found matching your filters.'}
                  </td>
                </tr>
              ) : (
                filteredEnrollments.map((enr) => {
                  const isEnrolled = enr.status === 'Enrolled';
                  return (
                    <tr
                      key={enr.id}
                      style={{
                        borderBottom: '1px solid #f1f5f9',
                        transition: 'background 0.15s ease',
                        background: !isEnrolled ? '#fafafa' : '#ffffff'
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = '#f8fafc'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = !isEnrolled ? '#fafafa' : '#ffffff'; }}
                    >
                      <td style={{ padding: '14px 18px' }}>
                        <div style={{ fontWeight: '800', color: '#1d4ed8' }}>{enr.rollNumber}</div>
                        <div style={{ fontWeight: '700', color: '#0f172a' }}>{enr.studentName}</div>
                      </td>

                      <td style={{ padding: '14px 18px' }}>
                        <span style={{ fontWeight: '800', background: '#eff6ff', padding: '2px 8px', borderRadius: '4px', fontSize: '0.76rem', color: '#1d4ed8' }}>
                          {enr.courseCode}
                        </span>
                        <div style={{ fontWeight: '600', color: '#334155', marginTop: '3px' }}>{enr.courseName}</div>
                      </td>

                      <td style={{ padding: '14px 18px' }}>
                        <span
                          style={{
                            fontWeight: '700',
                            padding: '3px 9px',
                            borderRadius: '999px',
                            fontSize: '0.74rem',
                            background: enr.sectionName === 'Section 1' ? '#eff6ff' : '#f5f3ff',
                            color: enr.sectionName === 'Section 1' ? '#1d4ed8' : '#7c3aed',
                            border: '1px solid',
                            borderColor: enr.sectionName === 'Section 1' ? '#bfdbfe' : '#ddd6fe'
                          }}
                        >
                          {enr.sectionName}
                        </span>
                      </td>

                      <td style={{ padding: '14px 18px' }}>
                        <div style={{ color: '#0f172a', fontWeight: '600' }}>{enr.facultyName}</div>
                        <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>{enr.classroom} • {enr.schedule}</div>
                      </td>

                      <td style={{ padding: '14px 18px', color: '#64748b', fontSize: '0.78rem' }}>
                        {enr.enrolledAt ? new Date(enr.enrolledAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Session Start'}
                      </td>

                      <td style={{ padding: '14px 18px' }}>
                        <span
                          style={{
                            padding: '3px 10px',
                            borderRadius: '999px',
                            fontSize: '0.74rem',
                            fontWeight: '700',
                            background: isEnrolled ? '#dcfce7' : '#fee2e2',
                            color: isEnrolled ? '#15803d' : '#991b1b',
                            border: '1px solid',
                            borderColor: isEnrolled ? '#86efac' : '#fca5a5'
                          }}
                        >
                          {enr.status}
                        </span>
                      </td>

                      <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                        {isEnrolled ? (
                          <button
                            type="button"
                            className="btn btn-danger btn-sm"
                            onClick={() => setDropTarget({
                              studentId: enr.studentId,
                              studentName: enr.studentName,
                              courseId: enr.courseId,
                              courseName: enr.courseName,
                              sectionName: enr.sectionName
                            })}
                            style={{ fontSize: '0.78rem', padding: '4px 10px' }}
                          >
                            Drop Course
                          </button>
                        ) : (
                          <span style={{ fontSize: '0.76rem', color: '#94a3b8', fontStyle: 'italic' }}>
                            Already Dropped
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Drop Confirmation Modal */}
      {dropTarget && (
        <Modal
          isOpen={Boolean(dropTarget)}
          onClose={() => setDropTarget(null)}
          title="Confirm Administrative Enrollment Drop"
          footer={
            <>
              <button className="btn btn-secondary" onClick={() => setDropTarget(null)} disabled={dropping}>
                Cancel
              </button>
              <button className="btn btn-danger" onClick={handleConfirmDrop} disabled={dropping}>
                {dropping ? 'Dropping...' : 'Confirm Drop Course'}
              </button>
            </>
          }
        >
          <p style={{ color: '#0f172a', fontSize: '0.92rem' }}>
            Are you sure you want to drop <strong>{dropTarget.studentName}</strong> from this registered course?
          </p>
          <div style={{ background: '#fff1f2', border: '1px solid #fecdd3', borderRadius: '8px', padding: '12px 16px', margin: '14px 0' }}>
            <div style={{ fontWeight: '700', color: '#be123c' }}>{dropTarget.courseName}</div>
            <div style={{ fontSize: '0.82rem', color: '#9f1239', marginTop: '2px' }}>{dropTarget.sectionName}</div>
          </div>
          <p style={{ fontSize: '0.82rem', color: '#64748b' }}>
            This action will update the student's status to <strong>Dropped</strong> in MySQL, restore the section seat capacity for other students, and clear lecture timings from their weekly timetable.
          </p>
        </Modal>
      )}
    </div>
  );
};

export default AdminEnrollments;
