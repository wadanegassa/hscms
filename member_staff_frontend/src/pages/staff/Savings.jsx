import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../../services/api';

export default function StaffSavings() {
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [member, setMember] = useState(null);
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (location.state?.member) {
      const passedMember = location.state.member;
      setMember({ ...passedMember, totalSaved: 0 }); // New member has 0 savings
      setEmail(passedMember.email);
    } else if (location.state?.email) {
      setEmail(location.state.email);
      handleAutoLookup(location.state.email);
    }
  }, [location.state]);

  const handleAutoLookup = async (emailToFind) => {
    try {
      setLoading(true);
      const res = await api.get(`/staff/member-lookup?email=${emailToFind}`);
      setMember(res.data);
    } catch (err) {
      setError('Could not find member');
    } finally {
      setLoading(false);
    }
  };

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

      // Refresh member details
      const res = await api.get(`/staff/member-lookup?email=${email}`);
      setMember(res.data);

    } catch (err) {
      setError(err.response?.data?.message || 'Failed to record saving');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fade-in" style={{ paddingBottom: '2rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <div>
          <h2 className="page-title" style={{ fontSize: '2.8rem', fontWeight: 900, letterSpacing: '-0.04em', color: 'var(--text-primary)', textTransform: 'uppercase' }}>
            Savings <span style={{ color: 'var(--primary)' }}>Deposit</span>
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginTop: '0.5rem', fontWeight: 600 }}>
            Securely record and manage member savings contributions.
          </p>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: member ? '1.2fr 0.8fr' : '1fr', gap: '2.5rem', alignItems: 'start' }}>
        <div className="glass-card" style={{ flex: 'none', margin: 0, padding: '2.5rem', display: 'block', background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
          <div style={{ marginBottom: '3rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ width: '4px', height: '20px', background: 'var(--primary)', borderRadius: '2px' }}></div>
              <h4 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '1.1rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                1. Identify Member
              </h4>
            </div>
            <form onSubmit={handleLookup} style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ flex: 1, position: 'relative' }}>
                <span style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                </span>
                <input
                  type="email"
                  placeholder="Member email address..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input"
                  required
                  style={{ paddingLeft: '3.5rem', height: '3.5rem', borderRadius: '16px', background: 'rgba(15, 23, 42, 0.02)', border: '1px solid var(--border)' }}
                />
              </div>
              <button type="submit" className="btn" style={{ padding: '0 2.5rem', height: '3.5rem', borderRadius: '16px', background: 'var(--gradient-primary)', color: '#000', fontWeight: 800 }}>
                Lookup
              </button>
            </form>
          </div>

          <div style={{ opacity: member ? 1 : 0.3, pointerEvents: member ? 'auto' : 'none', transition: 'all 0.4s cubic-bezier(0.22, 1, 0.36, 1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ width: '4px', height: '20px', background: 'var(--secondary)', borderRadius: '2px' }}></div>
              <h4 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '1.1rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                2. Transaction Details
              </h4>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="input-group" style={{ marginBottom: '2rem' }}>
                <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 800, marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Deposit Amount
                </label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', right: '1.25rem', top: '50%', transform: 'translateY(-50%)', fontWeight: 900, color: 'var(--primary)', fontSize: '1.1rem', opacity: 0.5 }}>
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
                    style={{ paddingRight: '3.5rem', height: '3.5rem', borderRadius: '16px', background: 'rgba(15, 23, 42, 0.02)', border: '1px solid var(--border)', fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}
                  />
                </div>
              </div>

              <div className="input-group" style={{ marginBottom: '2.5rem' }}>
                <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 800, marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Payment Method
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                  {[
                    { id: 'cash', label: 'Cash', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="6" width="20" height="12" rx="2" /><circle cx="12" cy="12" r="2" /><path d="M6 12h.01M18 12h.01" /></svg> },
                    { id: 'telebirr', label: 'Telebirr', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="5" y="2" width="14" height="20" rx="2" ry="2" /><line x1="12" y1="18" x2="12.01" y2="18" /></svg> },
                    { id: 'bank', label: 'Bank', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 14v3M12 14v3M16 14v3" /></svg> }
                  ].map(method => (
                    <div
                      key={method.id}
                      onClick={() => setPaymentMethod(method.id)}
                      className="hover-lift"
                      style={{
                        padding: '1.25rem',
                        borderRadius: '16px',
                        border: `1px solid ${paymentMethod === method.id ? 'var(--primary)' : 'var(--border)'}`,
                        background: paymentMethod === method.id ? 'rgba(234, 179, 8, 0.08)' : 'rgba(15, 23, 42, 0.01)',
                        cursor: 'pointer',
                        textAlign: 'center',
                        transition: 'all 0.3s ease',
                        color: paymentMethod === method.id ? 'var(--primary)' : 'var(--text-muted)'
                      }}
                    >
                      <div style={{ marginBottom: '0.75rem', display: 'flex', justifyContent: 'center' }}>
                        {method.icon}
                      </div>
                      <div style={{ fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        {method.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {message && (
                <div className="fade-in" style={{
                  padding: '1.25rem',
                  background: 'rgba(234, 179, 8, 0.05)',
                  border: '1px solid rgba(234, 179, 8, 0.1)',
                  color: 'var(--primary)',
                  borderRadius: '16px',
                  marginBottom: '2rem',
                  fontSize: '0.9rem',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  justifyContent: 'center'
                }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6L9 17l-5-5" /></svg>
                  {message}
                </div>
              )}

              {error && (
                <div className="fade-in" style={{
                  padding: '1.25rem',
                  background: 'rgba(255, 71, 87, 0.05)',
                  border: '1px solid rgba(255, 71, 87, 0.1)',
                  color: 'var(--danger)',
                  borderRadius: '16px',
                  marginBottom: '2rem',
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
              )}

              <button
                type="submit"
                disabled={loading || !member}
                className="btn hover-glow"
                style={{ width: '100%', height: '4rem', borderRadius: '16px', background: 'var(--gradient-primary)', color: '#000', fontSize: '1.1rem', fontWeight: 900, letterSpacing: '0.05em', border: 'none' }}
              >
                {loading ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', justifyContent: 'center' }}>
                    <div className="loading-spinner" style={{ width: '20px', height: '20px', borderWidth: '3px' }}></div>
                    Processing...
                  </div>
                ) : 'Confirm Deposit'}
              </button>
            </form>
          </div>
        </div>

        {member && (
          <div className="glass-card fade-in" style={{ padding: '3rem', border: '1px solid var(--border)', background: 'rgba(15, 23, 42, 0.01)', position: 'sticky', top: '2rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <div style={{
                width: '100px',
                height: '100px',
                borderRadius: '30px',
                background: 'var(--bg-secondary)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem',
                fontSize: '2.5rem',
                fontWeight: 900,
                border: '1px solid var(--border)',
                boxShadow: '0 10px 30px rgba(15, 23, 42, 0.1)'
              }}>
                {member.fullName.charAt(0)}
              </div>
              <h3 style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>{member.fullName}</h3>
              <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem', fontSize: '1rem', fontWeight: 600 }}>{member.email}</p>
            </div>

            <div style={{
              background: 'rgba(15, 23, 42, 0.02)',
              padding: '2rem',
              borderRadius: '24px',
              border: '1px solid var(--border)',
              marginBottom: '2.5rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <span style={{ color: 'var(--text-muted)', fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Member ID</span>
                <span style={{ color: 'var(--text-primary)', fontWeight: 900, fontFamily: '"JetBrains Mono", monospace', fontSize: '1rem' }}>#{member.id.slice(-6).toUpperCase()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-muted)', fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Status</span>
                <span style={{ padding: '4px 12px', borderRadius: '8px', background: 'rgba(234, 179, 8, 0.1)', color: 'var(--primary)', fontSize: '0.7rem', fontWeight: 900, textTransform: 'uppercase' }}>Active</span>
              </div>
            </div>

            <div style={{ padding: '2.5rem', borderRadius: '24px', background: 'var(--bg-secondary)', border: '1px solid var(--border)', textAlign: 'center', boxShadow: 'inset 0 0 20px rgba(15, 23, 42, 0.05)' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase', marginBottom: '1rem', letterSpacing: '0.15em' }}>Current Balance</div>
              <div style={{ fontSize: '2.8rem', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>
                {(member?.totalSaved || 0).toLocaleString()} <span style={{ fontSize: '1rem', opacity: 0.5 }}>ETB</span>
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.5rem', fontWeight: 700 }}>Total Accumulated Savings</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
