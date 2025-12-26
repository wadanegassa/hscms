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
      <div className="mb-8">
        <h2 className="page-title">Profile Settings</h2>
        <p style={{ color: '#64748b', fontSize: '0.875rem' }}>Manage your personal information and security.</p>
      </div>

      <div className="glass-card" style={{ maxWidth: '640px', padding: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2.5rem' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '16px',
            background: '#f1f5f9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.5rem',
            fontWeight: 700,
            color: '#1e293b'
          }}>
            {profile.fullName?.charAt(0) || 'U'}
          </div>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1e293b', margin: 0 }}>{profile.fullName || 'User'}</h3>
            <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0, textTransform: 'capitalize' }}>{authUser?.role} Account</p>
          </div>
        </div>

        {msg && (
          <div className="fade-in" style={{
            padding: '1rem',
            background: msg.type === 'success' ? '#f0fdf4' : '#fef2f2',
            border: `1px solid ${msg.type === 'success' ? '#dcfce7' : '#fee2e2'}`,
            color: msg.type === 'success' ? '#166534' : '#991b1b',
            borderRadius: '8px',
            marginBottom: '1.5rem',
            fontSize: '0.875rem',
            fontWeight: 500,
            textAlign: 'center'
          }}>
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

          <div style={{ marginTop: '0.5rem' }}>
            <button className="btn btn-primary" type="submit" disabled={loading} style={{ width: '100%' }}>
              {loading ? 'Saving...' : 'Update Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
