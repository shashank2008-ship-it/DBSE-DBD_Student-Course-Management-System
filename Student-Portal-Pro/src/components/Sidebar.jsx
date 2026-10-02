import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const Sidebar = ({ isOpen, onClose }) => {
  const { currentUser, enrolledCourseIds, logout, isAdmin } = useApp();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Student Navigation Links
  const studentNavLinks = [
    {to:"/clusters",label:"My Cluster",icon:<span className="nav-icon">▦</span>},
    {to:'/planner',label:'Enrollment Planner',icon:<span className="nav-icon">✦</span>},
    {to:'/notifications',label:'Notifications',icon:<span className="nav-icon">◉</span>},
    {
      to: '/dashboard',
      label: 'Dashboard',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="nav-icon">
          <rect x="3" y="3" width="7" height="7"></rect>
          <rect x="14" y="3" width="7" height="7"></rect>
          <rect x="14" y="14" width="7" height="7"></rect>
          <rect x="3" y="14" width="7" height="7"></rect>
        </svg>
      )
    },
    {
      to: '/courses',
      label: 'Course Catalog',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="nav-icon">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
        </svg>
      )
    },
    {
      to: '/my-courses',
      label: 'My Courses',
      badge: enrolledCourseIds.length,
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="nav-icon">
          <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
          <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
        </svg>
      )
    },
    {
      to: '/timetable',
      label: 'Timetable',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="nav-icon">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="16" y1="2" x2="16" y2="6"></line>
          <line x1="8" y1="2" x2="8" y2="6"></line>
          <line x1="3" y1="10" x2="21" y2="10"></line>
        </svg>
      )
    },
    {
      to: '/grades',
      label: 'Grades & Marks',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="nav-icon">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
        </svg>
      )
    },
    {
      to: '/profile',
      label: 'Student Profile',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="nav-icon">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
      )
    }
  ];

  // Admin Navigation Links
  const adminNavLinks = [
    {to:"/admin/clusters",label:"Cluster Management",icon:<span className="nav-icon">▦</span>},
    {to:'/admin/operations',label:'Academic Operations',icon:<span className="nav-icon">✦</span>},
    {
      to: '/admin',
      label: 'Admin Overview',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="nav-icon">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          <polyline points="9 22 9 12 15 12 15 22"></polyline>
        </svg>
      )
    },
    {
      to: '/admin/students',
      label: 'Student Directory',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="nav-icon">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
      )
    },
    {
      to: '/admin/enrollments',
      label: 'Enrollments & Drops',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="nav-icon">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <line x1="9" y1="15" x2="15" y2="15"></line>
        </svg>
      )
    },
    {
      to: '/admin/faculty',
      label: 'Faculty Members',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="nav-icon">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
          <path d="M12 11V3"></path>
          <path d="M8 7l4-4 4 4"></path>
        </svg>
      )
    },
    {
      to: '/courses',
      label: 'Course Catalog & Sections',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="nav-icon">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
        </svg>
      )
    }
  ];

  const currentNavLinks = isAdmin ? adminNavLinks : studentNavLinks;

  return (
    <>
      <aside className={`app-sidebar ${isOpen ? 'open' : ''}`}>
        {/* Brand Header */}
        <div className="sidebar-header">
          <NavLink to={isAdmin ? '/admin' : '/dashboard'} className="sidebar-brand" onClick={onClose}>
            <div className="brand-icon-wrapper" style={isAdmin ? { background: 'linear-gradient(135deg, #7c3aed, #4f46e5)' } : {}}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
                <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
              </svg>
            </div>
            <div className="brand-text-block">
              <h2>{isAdmin ? 'ADMIN CONSOLE' : 'ACADEMIC PORTAL'}</h2>
              <p>{isAdmin ? 'Registrar & Dean Operations' : 'Student Portal Pro'}</p>
            </div>
          </NavLink>

          <button className="sidebar-close-btn" onClick={onClose} aria-label="Close Sidebar">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Navigation List */}
        <nav className="sidebar-nav">
          <div className="nav-section-label">
            {isAdmin ? 'Administrative Management' : 'Academic Portal'}
          </div>
          {currentNavLinks.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              onClick={onClose}
            >
              {item.icon}
              <span>{item.label}</span>
              {item.badge !== undefined && item.badge !== null && item.badge > 0 && (
                <span className="nav-badge">
                  {item.badge}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User Card & Logout */}
        <div className="sidebar-footer">
          <NavLink to={isAdmin ? '/admin' : '/profile'} className="sidebar-user-card" onClick={onClose}>
            <div
              className="user-avatar-initials-sm"
              style={isAdmin ? { background: 'linear-gradient(135deg, #7c3aed, #4f46e5)', color: '#fff' } : {}}
            >
              {currentUser.fullName ? currentUser.fullName.split(' ').map((n) => n[0]).slice(0, 2).join('') : (isAdmin ? 'AD' : 'SG')}
            </div>
            <div className="user-info-text">
              <div className="user-name">{currentUser.fullName || (isAdmin ? 'Admin User' : 'Student')}</div>
              <div className="user-id">
                {isAdmin ? (
                  <span style={{ color: '#7c3aed', fontWeight: '700', fontSize: '0.72rem' }}>Administrator</span>
                ) : (
                  currentUser.id || '2520090075'
                )}
              </div>
            </div>
          </NavLink>

          <button onClick={handleLogout} className="logout-btn-sidebar" type="button">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* Backdrop for mobile */}
      <div
        className={`sidebar-backdrop ${isOpen ? 'active' : ''}`}
        onClick={onClose}
      />
    </>
  );
};

export default Sidebar;
