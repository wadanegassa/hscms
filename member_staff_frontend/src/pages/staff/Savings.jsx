import React, { useState } from 'react';
import api from '../../services/api';

export default function StaffSavings() {
  const [email, setEmail] = useState('');
  const [member, setMember] = useState(null);
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLookup = async (e) => {
    e.preventDefault();
    setError('');
    setMember(null);
    try {
      const res = await api.get(`/staff/member-lookup?email=${email}`);
      setMember(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Member not found');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!member) return;
    setError('');
    setMessage('');
    setLoading(true);
    try {
      await api.post('/staff/savings', {
        memberId: member.id,
        amount: Number(amount),
        paymentMethod
      });
      setMessage('Saving recorded successfully!');
      setAmount('');
      setMember(null);
      setEmail('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to record saving');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fade-in" style={{ paddingBottom: '2rem' }}>
      <div className="flex-between mb-8" style={{ alignItems: 'flex-end' }}>
        <div>
          <h2 className="page-title" style={{ marginBottom: '0.5rem', fontSize: '2rem' }}>💰 Record Savings</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', margin: 0 }}>
            Search for a member and record their savings deposit.
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: member ? '1fr 1fr' : '1fr', gap: '2rem', alignItems: 'start' }}>
        <div className="glass-card scale-up" style={{ padding: '2.5rem' }}>
          <div style={{ marginBottom: '2.5rem' }}>
            <h4 className="section-title" style={{ fontSize: '1.125rem', marginBottom: '1.25rem' }}>1. Find Member</h4>
            <form onSubmit={handleLookup} style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ flex: 1, position: 'relative' }}>
                <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                </span>
                <input
                  type="email"
                  placeholder="Enter member email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input"
                  required
                  style={{ paddingLeft: '3rem' }}
                />
              </div>
              <button type="submit" className="btn btn-primary" style={{ padding: '0 2rem' }}>
                Find
              </button>
            </form>
          </div>

          <div style={{ opacity: member ? 1 : 0.5, pointerEvents: member ? 'auto' : 'none', transition: 'all 0.3s ease' }}>
            <h4 className="section-title" style={{ fontSize: '1.125rem', marginBottom: '1.25rem' }}>2. Deposit Details</h4>
            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <label className="label">Deposit Amount (ETB)</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', fontWeight: 700, color: 'var(--text-muted)' }}>
                    ETB
                  </span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="input"
                    required
                    min="1"
                    placeholder="0.00"
                    style={{ paddingLeft: '3.5rem' }}
                  />
                </div>
              </div>

              <div className="input-group">
                <label className="label">Payment Method</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                  {['cash', 'telebirr', 'bank'].map(method => (
                    <div
                      key={method}
                      onClick={() => setPaymentMethod(method)}
                      style={{
                        padding: '1rem',
                        borderRadius: '12px',
                        border: `2px solid ${paymentMethod === method ? 'var(--primary)' : 'var(--border-bright)'}`,
                        background: paymentMethod === method ? 'var(--bg-secondary)' : 'white',
                        cursor: 'pointer',
                        textAlign: 'center',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
                        {method === 'cash' ? '💵' : method === 'telebirr' ? '📱' : '🏦'}
                      </div>
                      <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: paymentMethod === method ? 'var(--primary)' : 'var(--text-muted)' }}>
                        {method}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {message && (
                <div style={{
                  padding: '1rem',
                  background: 'rgba(16, 185, 129, 0.05)',
                  border: '1px solid rgba(16, 185, 129, 0.1)',
                  color: 'var(--success)',
                  borderRadius: '12px',
                  marginBottom: '1.5rem',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  textAlign: 'center'
                }}>
                  ✅ {message}
                </div>
              )}

              {error && (
                <div style={{
                  padding: '1rem',
                  background: 'rgba(239, 68, 68, 0.05)',
                  border: '1px solid rgba(239, 68, 68, 0.1)',
                  color: 'var(--danger)',
                  borderRadius: '12px',
                  marginBottom: '1.5rem',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  textAlign: 'center'
                }}>
                  ⚠️ {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !member}
                className="btn btn-primary hover-glow"
                style={{ width: '100%', padding: '1rem', fontSize: '1rem' }}
              >
                {loading ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
                    <div className="loading-spinner" style={{ width: '18px', height: '18px', borderWidth: '2px', borderTopColor: 'white' }}></div>
                    Recording...
                  </div>
                ) : 'Record Deposit'}
              </button>
            </form>
          </div>
        </div>

        {member && (
          <div className="glass-card scale-up" style={{ padding: '2.5rem', border: '1px solid var(--info)' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '24px',
                background: 'var(--gradient-primary)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem',
                fontSize: '2rem',
                fontWeight: 800
              }}>
                {member.fullName.charAt(0)}
              </div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>{member.fullName}</h3>
              <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>{member.email}</p>
            </div>

            <div style={{
              background: 'var(--bg-secondary)',
              padding: '1.5rem',
              borderRadius: '20px',
              border: '1px solid var(--border-bright)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <span style={{ color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.875rem' }}>Member ID</span>
                <span style={{ color: 'var(--text-primary)', fontWeight: 700, fontFamily: 'monospace' }}>#{member.id.slice(-6).toUpperCase()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.875rem' }}>Account Type</span>
                <span className="badge badge-info">Standard Member</span>
              </div>
            </div>

            <div style={{ marginTop: '2rem', padding: '1.5rem', borderRadius: '20px', background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.1)' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--success)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Current Savings</div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  {(member?.totalSaved || 0).toLocaleString()} <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>ETB</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
