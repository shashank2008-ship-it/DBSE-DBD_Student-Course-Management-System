import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const Header = ({ onToggleSidebar }) => {
  const { currentUser, logout, isAdmin } = useApp();
  const location = useLocation();
  const navigate = useNavigate();

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const profileRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getPageMeta = (pathname) => {
    if (pathname === '/admin') return { title: 'Admin Overview & Section Intelligence', section: 'System Administration' };
    if (pathname === '/admin/students') return { title: 'Student Directory & Records', section: 'Academic Affairs' };
    if (pathname === '/admin/enrollments') return { title: 'Master Enrollment Ledger & Course Drops', section: 'Registrar Office' };
    if (pathname === '/admin/faculty') return { title: 'Faculty Members & Department Directory', section: 'Faculty Council' };
    if (pathname === '/dashboard') return { title: 'Student Dashboard', section: 'Overview' };
    if (pathname === '/courses') return { title: 'Course Catalog & Sections', section: 'Academics' };
    if (pathname.startsWith('/courses/')) return { title: 'Course Syllabus & Details', section: 'Course Catalog' };
    if (pathname === '/my-courses') return { title: 'My Enrolled Courses', section: 'My Academics' };
    if (pathname === '/timetable') return { title: 'Weekly Class Timetable', section: 'Schedules' };
    if (pathname === '/grades') return { title: 'Grades & Academic Evaluation', section: 'Transcripts' };
    if (pathname === '/profile') return { title: 'Student Profile & Records', section: 'Account' };
    return { title: 'Academic Portal', section: 'Home' };
  };

  const pageMeta = getPageMeta(location.pathname);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/courses?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="app-header">
      {/* Left: Mobile Toggle & Page Title */}
      <div className="header-left">
        <button
          type="button"
          className="mobile-menu-trigger"
          onClick={onToggleSidebar}
          aria-label="Open Navigation Menu"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>

        <div>
          <div className="header-breadcrumbs">
            <span>{isAdmin ? 'Admin Console' : 'Portal'}</span>
            <span>/</span>
            <span>{pageMeta.section}</span>
          </div>
          <h1 className="header-page-title">{pageMeta.title}</h1>
        </div>
      </div>

      {/* Right: Search & User Profile */}
      <div className="header-right">
        {/* Course Search */}
        <form onSubmit={handleSearchSubmit} className="header-search-bar">
          <svg className="header-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            type="text"
            placeholder="Search courses, codes..."
            className="header-search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>

        <div className="header-actions">
          {/* User Profile Menu */}
          <div className="header-profile-menu" ref={profileRef}>
            <button
              type="button"
              className="header-profile-btn"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
            >
              <div
                className="header-avatar-initials"
                style={isAdmin ? { background: 'linear-gradient(135deg, #7c3aed, #4f46e5)', color: '#fff' } : {}}
              >
                {currentUser.fullName ? currentUser.fullName.split(' ').map((n) => n[0]).slice(0, 2).join('') : (isAdmin ? 'AD' : 'SG')}
              </div>
              <div className="header-user-meta">
                <span className="header-user-name">{currentUser.fullName || (isAdmin ? 'Admin User' : 'Student')}</span>
                <span className="header-user-role">{isAdmin ? 'Administrator' : (currentUser.id || '2520090075')}</span>
              </div>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginLeft: '4px', flexShrink: 0, color: '#64748b' }}>
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>

            {isProfileOpen && (
              <div className="profile-dropdown">
                <div style={{ padding: '10px 14px', borderBottom: '1px solid #f1f5f9' }}>
                  <div style={{ fontWeight: '700', fontSize: '0.88rem', color: '#0f172a' }}>
                    {currentUser.fullName || (isAdmin ? 'Administrator' : 'Student')}
                  </div>
                  <div style={{ fontSize: '0.74rem', color: '#64748b' }}>
                    {isAdmin ? 'Account: Institutional Administrator' : `Roll: ${currentUser.id}`}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: isAdmin ? '#7c3aed' : '#2563eb', fontWeight: '600', marginTop: '2px' }}>
                    {currentUser.department || 'Academic Administration'}
                  </div>
                </div>

                {isAdmin ? (
                  <>
                    <Link
                      to="/admin/students"
                      className="dropdown-item"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                        <circle cx="9" cy="7" r="4"></circle>
                      </svg>
                      <span>Student Records</span>
                    </Link>

                    <Link
                      to="/admin/enrollments"
                      className="dropdown-item"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                      </svg>
                      <span>Course Drops Ledger</span>
                    </Link>

                    <Link
                      to="/admin/faculty"
                      className="dropdown-item"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                      </svg>
                      <span>Faculty Directory</span>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      to="/profile"
                      className="dropdown-item"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                      </svg>
                      <span>Student Profile</span>
                    </Link>

                    <Link
                      to="/grades"
                      className="dropdown-item"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                      </svg>
                      <span>Academic Transcript</span>
                    </Link>
                  </>
                )}

                <div className="dropdown-divider" />

                <button
                  type="button"
                  className="dropdown-item danger"
                  onClick={handleLogout}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                    <polyline points="16 17 21 12 16 7"></polyline>
                    <line x1="21" y1="12" x2="9" y2="12"></line>
                  </svg>
                  <span>Log Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
