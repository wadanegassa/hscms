import React from 'react';

const Unauthorized = () => {
  return (
    <div className="fade-in" style={{
      minHeight: '60vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem'
    }}>
      <div className="glass-card" style={{
        maxWidth: '480px',
        padding: '3.5rem',
        borderRadius: '32px',
        textAlign: 'center',
        border: '1px solid var(--border)',
        boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
      }}>
        <div style={{
          width: '80px',
          height: '80px',
          borderRadius: '24px',
          background: 'rgba(244, 63, 94, 0.05)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 2rem',
          border: '1px solid rgba(244, 63, 94, 0.1)'
        }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--danger)" strokeWidth="2.5">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><line x1="9" y1="9" x2="15" y2="15" /><line x1="15" y1="9" x2="9" y2="15" /></svg>
        </div>
        <h3 style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--text-primary)', margin: '0 0 1rem 0', letterSpacing: '-0.02em' }}>Access Restricted</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', fontWeight: 600, lineHeight: 1.6, margin: 0 }}>
          Your current security clearance does not permit access to this terminal. Please contact the system administrator if you believe this is an error.
        </p>
        <button
          onClick={() => window.history.back()}
          className="btn hover-lift"
          style={{
            marginTop: '2.5rem',
            padding: '1rem 2rem',
            borderRadius: '14px',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid var(--border)',
            color: 'var(--text-primary)',
            fontWeight: 800,
            width: '100%'
          }}
        >
          Return to Previous Station
        </button>
      </div>
    </div>
  );
}
export default Unauthorized;
