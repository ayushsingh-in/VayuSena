import React from 'react';

export default function StatCard({ 
  label, 
  value, 
  valueUnit,
  badgeText, 
  badgeClass = 'badge-neutral', 
  subtext, 
  icon: Icon,
  isTextValue = false
}) {
  return (
    <div className="stat-card">
      <div className="stat-card-header">
        <span className="stat-label">
          {Icon && <Icon size={14} strokeWidth={2.2} />}
          {label}
        </span>
        {badgeText && (
          <span className={`aqi-badge ${badgeClass}`}>
            <span className="badge-dot"></span>
            {badgeText}
          </span>
        )}
      </div>

      <div className="stat-main-row">
        {isTextValue ? (
          <div className="stat-value-text">{value}</div>
        ) : (
          <div className="stat-value">
            {value}
            {valueUnit && <span style={{ fontSize: '15px', fontWeight: 500, marginLeft: '4px', color: 'var(--text-muted)' }}>{valueUnit}</span>}
          </div>
        )}
      </div>

      <div className="stat-subtext">
        {subtext}
      </div>
    </div>
  );
}
