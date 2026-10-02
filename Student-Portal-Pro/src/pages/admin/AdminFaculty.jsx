import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const AdminFaculty = () => {
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All');

  const fetchFaculty = async () => {
    try {
      setLoading(true);
      const res = await api.admin.getFaculty();
      if (res?.success) {
        setFaculty(res.faculty);
      }
    } catch (err) {
      console.error('Failed to load faculty:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaculty();
  }, []);

  const filteredFaculty = faculty.filter((f) => {
    const matchesSearch =
      f.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.designation?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDept = departmentFilter === 'All' || f.department === departmentFilter;

    return matchesSearch && matchesDept;
  });

  const departments = ['All', ...new Set(faculty.map((f) => f.department).filter(Boolean))];

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', width: '100%', paddingBottom: '32px' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.65rem', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.02em', margin: '0 0 6px' }}>
          Faculty Members Directory
        </h1>
        <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>
          Institutional registry of professors, assistant professors, office locations, and assigned course sections.
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
            placeholder="Search by faculty name, designation, or department..."
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

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: '600' }}>Department:</span>
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            style={{
              padding: '6px 12px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              fontSize: '0.84rem',
              color: '#0f172a',
              background: '#ffffff'
            }}
          >
            {departments.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>

          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={fetchFaculty}
          >
            Refresh ↻
          </button>
        </div>
      </div>

      {/* Faculty Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '18px' }}>
        {filteredFaculty.map((f) => (
          <div
            key={f.id}
            style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '14px',
              padding: '22px',
              boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 20px -4px rgba(15, 23, 42, 0.08)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(15, 23, 42, 0.04)'; }}
          >
            <div>
              {/* Header with Avatar & Name */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', marginBottom: '14px' }}>
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #1d4ed8, #2563eb)',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '800',
                    fontSize: '1.05rem',
                    flexShrink: 0
                  }}
                >
                  {f.avatarInitials || 'FC'}
                </div>

                <div>
                  <div style={{ fontSize: '0.74rem', fontWeight: '700', color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    {f.facultyId}
                  </div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#0f172a', margin: '2px 0 3px' }}>
                    {f.fullName}
                  </h3>
                  <div style={{ fontSize: '0.82rem', fontWeight: '600', color: '#475569' }}>
                    {f.designation}
                  </div>
                </div>
              </div>

              {/* Department & Office Info */}
              <div style={{ background: '#f8fafc', borderRadius: '8px', padding: '12px', marginBottom: '14px', fontSize: '0.8rem', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#334155' }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                  </svg>
                  <span>{f.department}</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#334155' }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                  </svg>
                  <span>Office: <strong>{f.office}</strong></span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#334155' }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                  <span style={{ color: '#2563eb' }}>{f.email}</span>
                </div>

                {f.qualification && (
                  <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '2px', borderTop: '1px solid #e2e8f0', paddingTop: '6px' }}>
                    Qualification: {f.qualification}
                  </div>
                )}
              </div>
            </div>

            {/* Assigned Course Sections */}
            <div>
              <div style={{ fontSize: '0.76rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '8px' }}>
                Assigned Section Teaching
              </div>

              {(!f.assignedSections || f.assignedSections.length === 0) ? (
                <div style={{ fontSize: '0.78rem', color: '#94a3b8', fontStyle: 'italic' }}>
                  {f.coursesTaught || 'Departmental Faculty'}
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {f.assignedSections.map((s) => (
                    <div
                      key={s.sectionId}
                      style={{
                        background: '#eff6ff',
                        border: '1px solid #bfdbfe',
                        borderRadius: '6px',
                        padding: '8px 10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        fontSize: '0.78rem'
                      }}
                    >
                      <div>
                        <strong style={{ color: '#1d4ed8' }}>{s.courseCode}</strong> ({s.sectionName})
                        <div style={{ fontSize: '0.72rem', color: '#475569' }}>{s.schedule} • {s.classroom}</div>
                      </div>
                      <span style={{ fontWeight: '700', color: '#047857', background: '#dcfce7', padding: '2px 7px', borderRadius: '999px', fontSize: '0.72rem' }}>
                        {s.enrolledStudents} Students
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminFaculty;
