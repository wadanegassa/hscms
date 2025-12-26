import React, { useState } from 'react';
import api from '../../services/api';

export default function RegisterMember() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: ''
  });
  const [createdUser, setCreatedUser] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/staff/register-member', formData);
      setCreatedUser(res.data);
      setFormData({ fullName: '', email: '', password: '', phone: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register member');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fade-in" style={{ paddingBottom: '2rem' }}>
      <div className="flex-between mb-8" style={{ alignItems: 'flex-end' }}>
        <div>
          <h2 className="page-title" style={{ marginBottom: '0.5rem', fontSize: '2rem' }}>👤 Register New Member</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', margin: 0 }}>
            Create a new member account and generate secure access credentials.
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: createdUser ? '1fr 1fr' : '1fr', gap: '2rem', alignItems: 'start' }}>
        <div className="glass-card scale-up" style={{ padding: '2.5rem' }}>
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label className="label">Full Name</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                placeholder="Enter member's full name"
                className="input"
              />
            </div>

            <div className="input-group">
              <label className="label">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="member@example.com"
                className="input"
              />
            </div>

            <div className="input-group">
              <label className="label">Password</label>
              <input
                type="text"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Set a secure password"
                className="input"
              />
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                ℹ️ Passwords are stored in plain text as per system requirements.
              </p>
            </div>

            <div className="input-group">
              <label className="label">Phone Number</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+251 ..."
                className="input"
              />
            </div>

            {error && (
              <div style={{
                padding: '1rem',
                background: 'rgba(239, 68, 68, 0.05)',
                border: '1px solid rgba(239, 68, 68, 0.1)',
                color: 'var(--danger)',
                borderRadius: '12px',
                marginBottom: '1.5rem',
                fontSize: '0.875rem',
                fontWeight: '600'
              }}>
                ⚠️ {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary hover-glow"
              style={{ width: '100%', padding: '1rem', fontSize: '1rem' }}
            >
              {loading ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div className="loading-spinner" style={{ width: '18px', height: '18px', borderWidth: '2px', borderTopColor: 'white' }}></div>
                  Registering...
                </div>
              ) : 'Register Member'}
            </button>
          </form>
        </div>

        {createdUser && (
          <div className="glass-card scale-up" style={{ padding: '2.5rem', border: '2px solid var(--success)' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'rgba(16, 185, 129, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem',
                fontSize: '2rem'
              }}>
                ✅
              </div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>Registration Successful!</h3>
              <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Provide these credentials to the member.</p>
            </div>

            <div style={{
              background: 'var(--bg-secondary)',
              padding: '1.5rem',
              borderRadius: '16px',
              border: '1px solid var(--border-bright)',
              marginBottom: '2rem'
            }}>
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Email</div>
                <div style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-primary)' }}>{createdUser.email}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Password</div>
                <div style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--primary)', fontFamily: 'monospace' }}>{createdUser.password}</div>
              </div>
            </div>

            <button
              onClick={() => setCreatedUser(null)}
              className="btn btn-secondary"
              style={{ width: '100%' }}
            >
              Register Another Member
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
