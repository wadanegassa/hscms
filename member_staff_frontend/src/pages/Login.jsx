import React, { useState, useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import { Link } from 'react-router-dom'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState(null)
  const [loading, setLoading] = useState(false)
  const { login } = useContext(AuthContext)

  async function submit(e) {
    e.preventDefault()
    setErr(null)
    setLoading(true)
    try {
      await login({ email, password })
    } catch (e) {
      const msg = e?.response?.data?.message || e?.message || 'Login failed'
      setErr(msg)
      setLoading(false)
    }
  }

  return (
    <div className="login_page">
      <div className="login-card scale-up">
        <div className="login-logo">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
        </div>
        <h3 className="login-title">Portal <span style={{ color: 'var(--primary)' }}>Login</span></h3>
        <p className="login-subtitle">Harari Saving & Credit Management System</p>

        {err && (
          <div className="fade-in" style={{
            marginBottom: '2rem',
            padding: '1rem',
            background: 'rgba(239, 68, 68, 0.05)',
            border: '1px solid rgba(239, 68, 68, 0.1)',
            color: 'var(--danger)',
            borderRadius: '16px',
            fontSize: '0.9rem',
            fontWeight: '700',
            textAlign: 'center'
          }}>
            {err}
          </div>
        )}

        <form onSubmit={submit} style={{ display: 'grid', gap: '1.5rem' }}>
          <div className="input-group">
            <label className="label" style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem', display: 'block', textAlign: 'left' }}>Email Address</label>
            <div style={{ position: 'relative' }}>
              <input
                className="input"
                type="email"
                placeholder="user@hscms.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                style={{ paddingLeft: '3rem', height: '3.5rem', borderRadius: '14px' }}
              />
              <svg style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
            </div>
          </div>

          <div className="input-group">
            <label className="label" style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem', display: 'block', textAlign: 'left' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <input
                className="input"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                style={{ paddingLeft: '3rem', height: '3.5rem', borderRadius: '14px' }}
              />
              <svg style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
            </div>
          </div>

          <button
            className="btn hover-glow"
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              marginTop: '0.5rem',
              height: '3.8rem',
              borderRadius: '16px',
              background: 'var(--gradient-primary)',
              color: '#000',
              fontWeight: 900,
              fontSize: '1.1rem',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              border: 'none',
              boxShadow: '0 10px 20px rgba(234, 179, 8, 0.2)'
            }}
          >
            {loading ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div className="loading-spinner" style={{ width: '20px', height: '20px', borderWidth: '3px', borderColor: '#000 #0000' }}></div>
                Authorizing...
              </div>
            ) : 'Access Portal'}
          </button>
        </form>

        <div style={{ marginTop: '2.5rem', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
          Authorized Access Only
        </div>
      </div>
    </div>
  )
}
