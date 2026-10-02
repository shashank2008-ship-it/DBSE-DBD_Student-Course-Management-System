import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

const Timetable = () => {
  const { weeklyTimetable, enrolledCourseIds } = useApp();
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const [activeDay, setActiveDay] = useState('Monday');
  const [viewMode, setViewMode] = useState('day'); // 'day' or 'week'

  const currentDayClasses = weeklyTimetable[activeDay] || [];

  return (
    <div>
      <div className="catalog-header-bar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1>Weekly Class Timetable</h1>
          <p>Real-time lecture hall assignments, synchronized class timings, and laboratory blocks.</p>
        </div>

        <div style={{ display: 'flex', gap: '8px', background: '#e2e8f0', padding: '4px', borderRadius: '8px' }}>
          <button
            type="button"
            className={`btn btn-sm ${viewMode === 'day' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setViewMode('day')}
          >
            Day View
          </button>
          <button
            type="button"
            className={`btn btn-sm ${viewMode === 'week' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setViewMode('week')}
          >
            Full Week View
          </button>
        </div>
      </div>

      <div className="timetable-container">
        {/* Day Selector Tabs */}
        <div className="timetable-day-selector">
          {days.map((day) => {
            const count = weeklyTimetable[day]?.length || 0;
            return (
              <button
                key={day}
                type="button"
                className={`day-tab-btn ${activeDay === day && viewMode === 'day' ? 'active' : ''}`}
                onClick={() => {
                  setActiveDay(day);
                  setViewMode('day');
                }}
              >
                {day} ({count} {count === 1 ? 'class' : 'classes'})
              </button>
            );
          })}
        </div>

        {/* View Mode: Single Day View */}
        {viewMode === 'day' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.15rem', color: '#1e293b' }}>
                Schedule for {activeDay}
              </h3>
              <span className="badge badge-neutral">
                {currentDayClasses.length} Scheduled Sessions
              </span>
            </div>

            {currentDayClasses.length === 0 ? (
              <div className="empty-state">
                <p>No classes scheduled for {activeDay}.</p>
              </div>
            ) : (
              <div className="timetable-schedule-grid">
                {currentDayClasses.map((item, idx) => {
                  const isEnrolled = enrolledCourseIds.includes(item.courseCode) || enrolledCourseIds.includes(item.courseId);
                  return (
                    <div
                      key={idx}
                      className="class-slot-card"
                      style={{
                        borderLeftColor: isEnrolled ? '#10b981' : '#2563eb'
                      }}
                    >
                      <div className="slot-time-header">
                        <span className="slot-time">{item.time}</span>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <span className={`badge badge-${item.type.toLowerCase()}`}>
                            {item.type}
                          </span>
                          {isEnrolled && (
                            <span className="badge badge-success" style={{ fontSize: '0.68rem' }}>
                              Enrolled
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="slot-course-title">
                        <span className="course-code-pill" style={{ marginRight: '6px', fontSize: '0.75rem' }}>
                          {item.courseCode}
                        </span>
                        {item.courseName}
                      </div>

                      <div className="slot-footer">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                            <circle cx="12" cy="10" r="3"></circle>
                          </svg>
                          <span>{item.classroom}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* View Mode: Full Week View */}
        {viewMode === 'week' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {days.map((day) => {
              const dayClasses = weeklyTimetable[day] || [];
              return (
                <div key={day} style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <h4 style={{ fontSize: '1rem', color: '#0f172a', fontWeight: '800' }}>{day}</h4>
                    <span className="badge badge-neutral" style={{ fontSize: '0.72rem' }}>
                      {dayClasses.length} sessions
                    </span>
                  </div>

                  {dayClasses.length === 0 ? (
                    <div style={{ fontSize: '0.84rem', color: '#94a3b8', fontStyle: 'italic' }}>
                      No classes scheduled.
                    </div>
                  ) : (
                    <div className="timetable-schedule-grid">
                      {dayClasses.map((item, idx) => {
                        const isEnrolled = enrolledCourseIds.includes(item.courseCode) || enrolledCourseIds.includes(item.courseId);
                        return (
                          <div
                            key={idx}
                            className="class-slot-card"
                            style={{
                              background: '#ffffff',
                              borderLeftColor: isEnrolled ? '#10b981' : '#2563eb'
                            }}
                          >
                            <div className="slot-time-header">
                              <span className="slot-time">{item.time}</span>
                              <span className={`badge badge-${item.type.toLowerCase()}`} style={{ fontSize: '0.68rem' }}>
                                {item.type}
                              </span>
                            </div>
                            <div className="slot-course-title" style={{ fontSize: '0.94rem' }}>
                              <span className="course-code-pill" style={{ marginRight: '6px', fontSize: '0.7rem' }}>
                                {item.courseCode}
                              </span>
                              {item.courseName}
                            </div>
                            <div className="slot-footer">
                              <span>📍 {item.classroom}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Timetable;
