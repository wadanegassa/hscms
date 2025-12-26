import React from 'react';

const Card = ({ title, value, icon, color, gradient, children }) => {
  return (
    <div className="stats-card">
      <div className="stats-card-header">
        <div className="stats-info">
          <div className="stats-title">{title}</div>
          <div className="stats-value">{value}</div>
        </div>
        {icon && (
          <div className="stats-icon" style={{
            background: gradient || `linear-gradient(135deg, ${color}40, ${color}80)`,
            boxShadow: `0 4px 16px ${color}40`
          }}>
            <span style={{ fontSize: '1.5rem' }}>{icon}</span>
          </div>
        )}
      </div>
      {children && <div className="stats-footer">{children}</div>}
    </div>
  );
}
export default Card;
