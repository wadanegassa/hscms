import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

export default function RegisterMember() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
    nationalId: '',
    paymentMethod: 'cbe',
    accountNumber: ''
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
      const payload = { ...formData };
      if (formData.paymentMethod === 'cbe') {
        payload.bankAccount = formData.accountNumber;
        payload.telebirr = '';
      } else {
        payload.telebirr = formData.accountNumber;
        payload.bankAccount = '';
      }
      delete payload.paymentMethod;
      delete payload.accountNumber;

      const res = await api.post('/staff/register-member', payload);
      setCreatedUser(res.data);
      setFormData({ fullName: '', email: '', password: '', phone: '', nationalId: '', paymentMethod: 'cbe', accountNumber: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register member');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fade-in" style={{ paddingBottom: '2rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <div>
          <h2 className="page-title" style={{ fontSize: '2.8rem', fontWeight: 900, letterSpacing: '-0.04em', color: 'var(--text-primary)', textTransform: 'uppercase' }}>
            Member <span style={{ color: 'var(--primary)' }}>Registration</span>
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginTop: '0.5rem', fontWeight: 600 }}>
            Create a new member account and generate secure access credentials.
          </p>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: createdUser ? '1fr 1fr' : '1fr', gap: '2rem', alignItems: 'start' }}>
        <div className="glass-card" style={{ padding: '2.5rem', background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
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
                style={{ background: 'rgba(15, 23, 42, 0.02)', border: '1px solid var(--border)', borderRadius: '12px', color: 'var(--text-primary)' }}
              />
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem', fontWeight: 600 }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" style={{ marginRight: '4px', verticalAlign: 'middle' }}><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>
                Passwords are stored in plain text as per system requirements.
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

            <div className="input-group">
              <label className="label">National ID</label>
              <input
                type="text"
                name="nationalId"
                value={formData.nationalId}
                onChange={handleChange}
                placeholder="National ID Number"
                className="input"
              />
            </div>

            <div className="input-group">
              <label className="label">Payment Method</label>
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.5rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cbe"
                    checked={formData.paymentMethod === 'cbe'}
                    onChange={handleChange}
                  />
                  <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.85rem' }}>CBE Account</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="telebirr"
                    checked={formData.paymentMethod === 'telebirr'}
                    onChange={handleChange}
                  />
                  <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.85rem' }}>Telebirr</span>
                </label>
              </div>
            </div>

            <div className="input-group">
              <label className="label">
                {formData.paymentMethod === 'cbe' ? 'Bank Account Number' : 'Telebirr Mobile Number'}
              </label>
              <input
                type="text"
                name="accountNumber"
                value={formData.accountNumber}
                onChange={handleChange}
                placeholder={formData.paymentMethod === 'cbe' ? 'Enter CBE Account Number' : 'Enter Telebirr Number'}
                className="input"
              />
            </div>

            <div className="fade-in" style={{
              padding: '1.25rem',
              background: 'rgba(239, 68, 68, 0.05)',
              border: '1px solid rgba(239, 68, 68, 0.1)',
              color: 'var(--danger)',
              borderRadius: '16px',
              marginBottom: '1.5rem',
              fontSize: '0.9rem',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              justifyContent: 'center'
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
              {error}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn hover-glow"
              style={{ width: '100%', height: '4rem', borderRadius: '16px', background: 'var(--gradient-primary)', color: '#000', fontSize: '1.1rem', fontWeight: 900, letterSpacing: '0.05em', border: 'none' }}
            >
              {loading ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', justifyContent: 'center' }}>
                  <div className="loading-spinner" style={{ width: '20px', height: '20px', borderWidth: '3px' }}></div>
                  Processing...
                </div>
              ) : 'Complete Registration'}
            </button>
          </form>
        </div>

        {createdUser && (
          <div className="glass-card fade-in" style={{ padding: '3rem', border: '1px solid var(--primary)', background: 'var(--bg-secondary)' }}>
            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
              <div style={{
                width: '72px',
                height: '72px',
                borderRadius: '24px',
                background: 'rgba(234, 179, 8, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem',
                color: 'var(--primary)',
                boxShadow: '0 0 20px var(--primary-glow)'
              }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6L9 17l-5-5" /></svg>
              </div>
              <h3 style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '-0.02em' }}>Success!</h3>
              <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem', fontWeight: 600 }}>Member account has been provisioned.</p>
            </div>

            <div style={{
              background: 'rgba(15, 23, 42, 0.02)',
              padding: '2rem',
              borderRadius: '20px',
              border: '1px solid var(--border)',
              marginBottom: '2.5rem'
            }}>
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 900, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem', letterSpacing: '0.1em' }}>Access Email</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>{createdUser.email}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.7rem', fontWeight: 900, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem', letterSpacing: '0.1em' }}>Temporary Password</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--primary)', fontFamily: '"JetBrains Mono", monospace', letterSpacing: '0.05em' }}>{createdUser.password}</div>
              </div>
            </div>

            <button
              onClick={() => navigate('/staff/savings', { state: { member: createdUser } })}
              className="btn hover-lift"
              style={{ width: '100%', marginBottom: '1rem', height: '3.5rem', borderRadius: '14px', background: 'var(--gradient-primary)', color: '#000', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em', border: 'none' }}
            >
              💰 Initial Deposit
            </button>
            <button
              onClick={() => setCreatedUser(null)}
              className="btn"
              style={{ width: '100%', height: '3.5rem', borderRadius: '14px', background: 'rgba(15, 23, 42, 0.02)', border: '1px solid var(--border)', color: 'var(--text-primary)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}
            >
              Register Another
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
