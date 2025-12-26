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
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
        </div>
        <h3 className="login-title">Portal Login</h3>
        <p className="login-subtitle">Harari Saving and Credit Management System</p>

        {err && (
          <div className="fade-in" style={{
            marginBottom: '1.5rem',
            padding: '0.75rem',
            background: '#fef2f2',
            border: '1px solid #fee2e2',
            color: '#991b1b',
            borderRadius: '8px',
            fontSize: '0.8125rem',
            fontWeight: '600',
            textAlign: 'center'
          }}>
            {err}
          </div>
        )}

        <form onSubmit={submit}>
          <div className="input-group">
            <label className="label">Email Address</label>
            <input
              className="input"
              type="email"
              placeholder="admin@harari.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label className="label">Password</label>
            <input
              className="input"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            className="btn btn-primary"
            type="submit"
            disabled={loading}
            style={{ width: '100%', marginTop: '0.5rem' }}
          >
            {loading ? 'Signing in...' : 'Login'}
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', fontSize: '0.75rem', color: '#94a3b8' }}>
          <span style={{ marginRight: '0.5rem' }}>🔒</span> Authorized Access Only
        </div>
      </div>
    </div>
  )
}
