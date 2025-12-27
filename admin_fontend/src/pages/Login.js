import React, { useState } from 'react';
import auth from '../services/auth';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const res = await auth.login(email, password);
    setLoading(false);
    if (res.ok) {
      window.location.href = '/';
    } else {
      setError(res.message || 'Login failed');
    }
  }

  return (
    <div className="login-page" style={{
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(circle at top right, rgba(0, 255, 157, 0.1), transparent 40%), radial-gradient(circle at bottom left, rgba(168, 85, 247, 0.1), transparent 40%), #0d1117',
      padding: '2rem',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.02\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
        opacity: 0.5
      }}></div>
      <div className="login-card fade-in" style={{
        width: '100%',
        maxWidth: '460px',
        padding: '3rem 2rem',
        borderRadius: '40px',
        background: 'rgba(13, 17, 23, 0.7)',
        backdropFilter: 'blur(30px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 40px 100px -20px rgba(0, 0, 0, 0.8)',
        position: 'relative',
        zIndex: 1
      }}>
        <div className="login-header" style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div className="login-icon" style={{
            width: '64px',
            height: '64px',
            borderRadius: '20px',
            background: 'var(--gradient-premium)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem',
            boxShadow: '0 10px 20px rgba(16, 185, 129, 0.2)'
          }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <h1 className="login-title" style={{
            fontSize: '2rem',
            fontWeight: 900,
            letterSpacing: '-0.02em',
            margin: '0 0 0.5rem 0',
            color: 'var(--text-primary)'
          }}>Admin Command</h1>
          <p className="login-subtitle" style={{
            color: 'var(--text-muted)',
            fontSize: '0.95rem',
            fontWeight: 600
          }}>Harari Saving & Credit Management System</p>
        </div>

        {error && (
          <div className="error-message fade-in" style={{
            padding: '1rem',
            borderRadius: '12px',
            background: 'rgba(244, 63, 94, 0.1)',
            color: 'var(--danger)',
            border: '1px solid rgba(244, 63, 94, 0.2)',
            fontSize: '0.85rem',
            fontWeight: 700,
            textAlign: 'center',
            marginBottom: '2rem'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={submit} className="login-form" style={{ display: 'grid', gap: '1.5rem' }}>
          <div className="form-group">
            <label className="form-label" style={{
              display: 'block',
              marginBottom: '0.75rem',
              fontSize: '0.7rem',
              fontWeight: 800,
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.1em'
            }}>Administrative Email</label>
            <div style={{ position: 'relative' }}>
              <input
                className="form-input"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '1rem 1.25rem 1rem 3rem',
                  borderRadius: '14px',
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-primary)',
                  fontWeight: 600,
                  fontSize: '1rem'
                }}
              />
              <svg style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" style={{
              display: 'block',
              marginBottom: '0.75rem',
              fontSize: '0.7rem',
              fontWeight: 800,
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.1em'
            }}>Security Key</label>
            <div style={{ position: 'relative' }}>
              <input
                className="form-input"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '1rem 3rem 1rem 3rem',
                  borderRadius: '14px',
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-primary)',
                  fontWeight: 600,
                  fontSize: '1rem'
                }}
              />
              <svg style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: '1.25rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0 }}
              >
                {showPassword ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                )}
              </button>
            </div>
          </div>

          <button className="btn-login hover-glow" type="submit" disabled={loading} style={{
            marginTop: '1rem',
            padding: '1.1rem',
            borderRadius: '16px',
            background: 'var(--gradient-premium)',
            color: 'white',
            border: 'none',
            fontSize: '1rem',
            fontWeight: 900,
            cursor: 'pointer',
            boxShadow: '0 10px 20px rgba(16, 185, 129, 0.15)',
            letterSpacing: '0.02em'
          }}>
            {loading ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
                <div className="loading-spinner" style={{ width: '18px', height: '18px', borderWidth: '3px' }}></div>
                Authorizing...
              </div>
            ) : 'Access Terminal'}
          </button>
        </form>

        <div className="login-footer" style={{
          marginTop: '2.5rem',
          textAlign: 'center',
          color: 'var(--text-muted)',
          fontSize: '0.8rem',
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem'
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
          Authorized Personnel Only
        </div>
      </div>
    </div>
  );
}

export default Login;

