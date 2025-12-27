import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

export default function ApplyLoan() {
  const [amount, setAmount] = useState('');
  const [purpose, setPurpose] = useState('');
  const [eligibility, setEligibility] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchEligibility();
  }, []);

  const fetchEligibility = async () => {
    try {
      const res = await api.get('/member/loan/eligibility');
      setEligibility(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/member/loan/apply', {
        amount: Number(amount),
        purpose
      });
      navigate('/member/my-loans');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to apply for loan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fade-in" style={{ paddingBottom: '2rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <div>
          <h2 className="page-title" style={{ fontSize: '2.8rem', fontWeight: 900, letterSpacing: '-0.04em', color: 'var(--text-primary)', textTransform: 'uppercase' }}>
            Loan <span style={{ color: 'var(--primary)' }}>Application</span>
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginTop: '0.5rem', fontWeight: 600 }}>
            Submit a new loan request for review.
          </p>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', alignItems: 'start' }}>
        <div className="glass-card" style={{ padding: '2.5rem', background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
          <h3 className="section-title" style={{ marginBottom: '2rem', fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Application Form</h3>

          {error && (
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
          )}

          <form onSubmit={handleSubmit}>
            <div className="input-group" style={{ marginBottom: '1.5rem' }}>
              <label className="label">Requested Amount (ETB)</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="input"
                required
                min="1"
                max={eligibility ? eligibility.maxLoan : undefined}
                placeholder="Enter amount"
              />
              {eligibility && (
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem', fontWeight: 500 }}>
                  Maximum allowed: <span style={{ color: 'var(--primary)', fontWeight: 700 }}>{eligibility.maxLoan.toLocaleString()} ETB</span>
                </div>
              )}
            </div>

            <div className="input-group" style={{ marginBottom: '2rem' }}>
              <label className="label">Purpose of Loan</label>
              <textarea
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                className="input"
                required
                rows="4"
                placeholder="Describe why you need this loan..."
                style={{ resize: 'none' }}
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={loading || (eligibility && eligibility.totalSavings < eligibility.minSavings)}
              className="btn hover-glow"
              style={{
                width: '100%',
                height: '4rem',
                borderRadius: '16px',
                background: (eligibility && eligibility.totalSavings < eligibility.minSavings) ? 'var(--border)' : 'var(--gradient-primary)',
                color: (eligibility && eligibility.totalSavings < eligibility.minSavings) ? 'var(--text-muted)' : '#000',
                fontSize: '1.1rem',
                fontWeight: 900,
                letterSpacing: '0.05em',
                border: 'none',
                cursor: (eligibility && eligibility.totalSavings < eligibility.minSavings) ? 'not-allowed' : 'pointer',
                opacity: (eligibility && eligibility.totalSavings < eligibility.minSavings) ? 0.6 : 1
              }}
            >
              {loading ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', justifyContent: 'center' }}>
                  <div className="loading-spinner" style={{ width: '20px', height: '20px', borderWidth: '3px' }}></div>
                  Processing...
                </div>
              ) : (eligibility && eligibility.totalSavings < eligibility.minSavings) ? 'Ineligible for Loan' : 'Submit Application'}
            </button>
            {eligibility && eligibility.totalSavings < eligibility.minSavings && (
              <p style={{ color: 'var(--danger)', fontSize: '0.85rem', marginTop: '1rem', textAlign: 'center', fontWeight: 700 }}>
                You need at least {eligibility.minSavings.toLocaleString()} ETB in savings to apply.
              </p>
            )}
          </form>
        </div>

        <div className="glass-card" style={{ padding: '2.5rem', background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
          <h3 className="section-title" style={{ marginBottom: '2rem', fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Eligibility Summary</h3>
          <div style={{ padding: '2rem', background: 'rgba(15, 23, 42, 0.02)', borderRadius: '24px', border: '1px solid var(--border)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.75rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Your Maximum Limit</div>
            <div style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              {eligibility ? (eligibility.maxLoan || 0).toLocaleString() : '0'} <span style={{ fontSize: '1rem', opacity: 0.5 }}>ETB</span>
            </div>
          </div>
          <div style={{ marginTop: '2.5rem', fontSize: '1rem', color: 'var(--text-muted)', lineHeight: 1.7, fontWeight: 600 }}>
            <p style={{ marginBottom: '1.25rem', display: 'flex', gap: '0.75rem' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="3" style={{ flexShrink: 0 }}><circle cx="12" cy="12" r="10" /><path d="M12 8v4l3 3" /></svg>
              Please ensure your requested amount does not exceed your maximum limit.
            </p>
            <p style={{ display: 'flex', gap: '0.75rem' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="3" style={{ flexShrink: 0 }}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
              Applications are reviewed by the staff and admin within 24-48 hours. You will be notified once a decision is made.
            </p>
            {eligibility && eligibility.minSavings > 0 && (
              <p style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem', padding: '1rem', background: 'rgba(16, 185, 129, 0.05)', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.1)' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="3" style={{ flexShrink: 0 }}><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                <span>Minimum savings of <span style={{ color: 'var(--primary)', fontWeight: 800 }}>{eligibility.minSavings.toLocaleString()} ETB</span> required to apply.</span>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
