import React from 'react';
import { useApp } from '../context/AppContext';

const Notifications = () => {
  const {
    notifications,
    unreadNotificationCount,
    markNotificationRead,
    markAllNotificationsRead
  } = useApp();

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'enrollment':
        return {
          bg: '#ecfdf5',
          color: '#10b981',
          icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          )
        };
      case 'grade':
        return {
          bg: '#eff6ff',
          color: '#2563eb',
          icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
            </svg>
          )
        };
      case 'deadline':
        return {
          bg: '#fff1f2',
          color: '#f43f5e',
          icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
          )
        };
      case 'exam':
        return {
          bg: '#fffbeb',
          color: '#f59e0b',
          icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
          )
        };
      default:
        return {
          bg: '#f5f3ff',
          color: '#8b5cf6',
          icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
          )
        };
    }
  };

  return (
    <div>
      <div className="catalog-header-bar">
        <h1>Student Notification Center</h1>
        <p>Institutional alert log, registration confirmations, grade updates, and deadline reminders.</p>
      </div>

      <div className="notifications-panel">
        <div className="notifications-top-bar">
          <div>
            <h2 style={{ fontSize: '1.2rem', color: '#0f172a' }}>
              Notifications Log
            </h2>
            <div style={{ fontSize: '0.84rem', color: '#64748b', marginTop: '2px' }}>
              {unreadNotificationCount} unread alerts remaining
            </div>
          </div>

          {unreadNotificationCount > 0 && (
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={markAllNotificationsRead}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              Mark All as Read
            </button>
          )}
        </div>

        <div className="notifications-list">
          {notifications.length === 0 ? (
            <div className="empty-state" style={{ border: 'none' }}>
              <div className="empty-state-icon">✓</div>
              <h3 className="empty-state-title">No Notifications</h3>
              <p className="empty-state-desc">You are all caught up on academic notifications!</p>
            </div>
          ) : (
            notifications.map((n) => {
              const iconMeta = getCategoryIcon(n.category);
              return (
                <div key={n.id} className={`notification-row ${!n.read ? 'unread' : ''}`}>
                  <div
                    className="notification-icon-wrap"
                    style={{ background: iconMeta.bg, color: iconMeta.color }}
                  >
                    {iconMeta.icon}
                  </div>

                  <div className="notification-body">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                      <div className="notification-title">{n.title}</div>
                      <div className="notification-time">{n.timestamp}</div>
                    </div>

                    <div className="notification-msg">{n.message}</div>

                    {!n.read && (
                      <button
                        type="button"
                        onClick={() => markNotificationRead(n.id)}
                        style={{
                          fontSize: '0.78rem',
                          color: '#2563eb',
                          fontWeight: '700',
                          marginTop: '4px'
                        }}
                      >
                        Mark as Read
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
