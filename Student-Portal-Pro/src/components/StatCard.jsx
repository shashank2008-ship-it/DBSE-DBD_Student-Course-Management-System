import React from 'react';

const StatCard = ({ title, value, subtext, icon, color = 'blue', badgeText, progress }) => {
  return (
    <div className={`stat-card stat-card-${color}`}>
      <div className={`stat-icon-box stat-icon-${color}`}>
        {icon}
      </div>
      <div className="stat-content">
        <div className="stat-title">{title}</div>
        <div className="stat-value">{value}</div>
        {(subtext || badgeText) && (
          <div className="stat-subtext">
            {badgeText && <span className="stat-badge-up">{badgeText}</span>}
            {subtext && <span>{subtext}</span>}
          </div>
        )}
        {progress !== undefined && (
          <div className="stat-progress-track">
            <div
              className={`stat-progress-bar stat-progress-${color}`}
              style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
