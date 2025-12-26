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
      <div className="mb-8">
        <h2 className="page-title">Loan Application</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>Submit a new loan request for review</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', alignItems: 'start' }}>
        <div className="glass-card" style={{ padding: '2.5rem' }}>
          <h3 className="section-title" style={{ marginBottom: '1.5rem' }}>Application Form</h3>

          {error && (
            <div style={{
              padding: '1rem',
              background: 'rgba(239, 68, 68, 0.05)',
              border: '1px solid rgba(239, 68, 68, 0.1)',
              color: 'var(--danger)',
              borderRadius: '12px',
              marginBottom: '1.5rem',
              fontSize: '0.875rem',
              fontWeight: 600,
              textAlign: 'center'
            }}>
              ⚠️ {error}
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
              disabled={loading}
              className="btn btn-primary"
              style={{ width: '100%', padding: '1rem' }}
            >
              {loading ? 'Submitting...' : 'Submit Application'}
            </button>
          </form>
        </div>

        <div className="glass-card" style={{ padding: '2.5rem', background: 'var(--bg-hover)', border: '1px solid var(--border)' }}>
          <h3 className="section-title" style={{ marginBottom: '1.5rem' }}>Eligibility Summary</h3>
          <div style={{ padding: '1.5rem', background: 'var(--bg-card)', borderRadius: '16px', border: '1px solid var(--border)' }}>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.025em' }}>Your Max Limit</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {eligibility ? (eligibility.maxLoan || 0).toLocaleString() : '0'} <span style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-secondary)' }}>ETB</span>
            </div>
          </div>
          <div style={{ marginTop: '2rem', fontSize: '0.9375rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            <p style={{ marginBottom: '1rem' }}>Please ensure your requested amount does not exceed your maximum limit.</p>
            <p>Applications are reviewed by the staff and admin within 24-48 hours. You will be notified once a decision is made.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
