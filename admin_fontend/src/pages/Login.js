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
    <div className="login-page">
      <div className="login-card fade-in">
        <div className="login-header">
          <div className="login-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <h1 className="login-title">Admin Login</h1>
          <p className="login-subtitle">Harari Saving and Credit Management System</p>
        </div>

        {error && (
          <div className="error-message fade-in">
            {error}
          </div>
        )}

        <form onSubmit={submit} className="login-form">
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              className="form-input"
              type="email"
              placeholder="admin@harari.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              className="form-input"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>

          <button className="btn-login" type="submit" disabled={loading}>
            {loading ? 'Authenticating...' : 'Login'}
          </button>
        </form>

        <div className="login-footer">
          <span className="lock-icon">🔒</span> Authorized Admins Only
        </div>
      </div>
    </div>
  );
}

export default Login;

