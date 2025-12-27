import React, { useEffect, useState, useContext } from 'react'
import api from '../../services/api'
import { AuthContext } from '../../context/AuthContext'

export default function Profile() {
  const { user: authUser } = useContext(AuthContext);
  const [profile, setProfile] = useState({ fullName: '', email: '', phone: '' })
  const [password, setPassword] = useState('')
  const [msg, setMsg] = useState(null)
  const [loading, setLoading] = useState(false)

  const rolePath = authUser?.role === 'staff' ? 'staff' : 'member';

  useEffect(() => { load() }, [])
  async function load() {
    try {
      const r = await api.get(`/${rolePath}/profile`)
      setProfile(r.data || {})
    } catch (e) { }
  }

  async function save(e) {
    e.preventDefault()
    setLoading(true)
    setMsg(null)
    try {
      const updateData = {
        fullName: profile.fullName,
        email: profile.email,
        phone: profile.phone
      };
      if (password) updateData.password = password;

      await api.put(`/${rolePath}/profile`, updateData)
      setMsg({ type: 'success', text: 'Profile updated successfully' })
      setPassword('')
    } catch (e) {
      setMsg({ type: 'error', text: e?.response?.data?.message || 'Save failed' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fade-in">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <div>
          <h2 className="page-title" style={{ fontSize: '2.8rem', fontWeight: 900, letterSpacing: '-0.04em', color: 'var(--text-primary)', textTransform: 'uppercase' }}>
            Account <span style={{ color: 'var(--primary)' }}>Settings</span>
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginTop: '0.5rem', fontWeight: 600 }}>
            Manage your personal information and security preferences.
          </p>
        </div>
      </header>

      <div className="glass-card" style={{ maxWidth: '640px', padding: '3rem', background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '3rem' }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '24px',
            background: 'rgba(234, 179, 8, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2rem',
            fontWeight: 900,
            color: 'var(--primary)',
            border: '1px solid rgba(234, 179, 8, 0.2)',
            boxShadow: '0 0 20px rgba(234, 179, 8, 0.2)'
          }}>
            {profile.fullName?.charAt(0) || authUser?.fullName?.charAt(0) || 'U'}
          </div>
          <div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--text-primary)', margin: 0, textTransform: 'uppercase', letterSpacing: '-0.02em' }}>{profile.fullName || authUser?.fullName || 'User'}</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--primary)', margin: '0.25rem 0 0 0', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.1em' }}>{authUser?.role} Command</p>
          </div>
        </div>

        {msg && (
          <div className="fade-in" style={{
            padding: '1.25rem',
            background: msg.type === 'success' ? 'rgba(234, 179, 8, 0.05)' : 'rgba(239, 68, 68, 0.05)',
            border: `1px solid ${msg.type === 'success' ? 'rgba(234, 179, 8, 0.1)' : 'rgba(239, 68, 68, 0.1)'}`,
            color: msg.type === 'success' ? 'var(--primary)' : 'var(--danger)',
            borderRadius: '16px',
            marginBottom: '2rem',
            fontSize: '0.9rem',
            fontWeight: 800,
            textAlign: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.75rem'
          }}>
            {msg.type === 'success' ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6L9 17l-5-5" /></svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
            )}
            {msg.text}
          </div>
        )}

        <form onSubmit={save} style={{ display: 'grid', gap: '1.5rem' }}>
          <div className="input-group">
            <label className="label">Full Name</label>
            <input
              className="input"
              value={profile.fullName || ''}
              onChange={e => setProfile({ ...profile, fullName: e.target.value })}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="input-group">
              <label className="label">Email Address</label>
              <input
                className="input"
                type="email"
                value={profile.email || ''}
                onChange={e => setProfile({ ...profile, email: e.target.value })}
                required
              />
            </div>
            <div className="input-group">
              <label className="label">Phone Number</label>
              <input
                className="input"
                value={profile.phone || ''}
                onChange={e => setProfile({ ...profile, phone: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label className="label">New Password (leave blank to keep current)</label>
            <input
              className="input"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>

          <div style={{ marginTop: '1rem' }}>
            <button
              className="btn hover-glow"
              type="submit"
              disabled={loading}
              style={{ width: '100%', height: '4rem', borderRadius: '16px', background: 'var(--gradient-primary)', color: '#000', fontSize: '1.1rem', fontWeight: 900, letterSpacing: '0.05em', border: 'none' }}
            >
              {loading ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', justifyContent: 'center' }}>
                  <div className="loading-spinner" style={{ width: '20px', height: '20px', borderWidth: '3px' }}></div>
                  Processing...
                </div>
              ) : 'Update Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
