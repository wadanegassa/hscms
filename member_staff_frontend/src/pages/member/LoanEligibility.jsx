import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

export default function LoanEligibility() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEligibility();
  }, []);

  const fetchEligibility = async () => {
    try {
      setLoading(true);
      const res = await api.get('/member/loan/eligibility');
      setData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container" style={{ padding: '6rem' }}>
        <div className="loading-spinner"></div>
        <div style={{ color: 'var(--text-secondary)', marginTop: '1rem' }}>Calculating your eligibility...</div>
      </div>
    );
  }

  return (
    <div className="fade-in" style={{ paddingBottom: '2rem' }}>
      <div className="mb-8">
        <h2 className="page-title">Loan Eligibility</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>Check how much you can borrow based on your savings</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', alignItems: 'start' }}>
        <div className="glass-card" style={{ padding: '2.5rem' }}>
          <h3 className="section-title" style={{ marginBottom: '1.5rem' }}>Eligibility Calculation</h3>

          <div style={{ display: 'grid', gap: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>
              <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>Total Savings</span>
              <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{(data?.totalSavings || 0).toLocaleString()} ETB</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>
              <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>System Multiplier</span>
              <span style={{ fontWeight: 700, color: 'var(--primary)' }}>{data?.multiplier || 0}x</span>
            </div>
            <div style={{ padding: '1.5rem', background: 'var(--bg-hover)', borderRadius: '16px', marginTop: '1rem', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.025em' }}>Maximum Loan Amount</div>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                {(data?.maxLoan || 0).toLocaleString()} <span style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-secondary)' }}>ETB</span>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '2rem' }}>
            <Link to="/member/apply-loan" className="btn btn-primary" style={{ width: '100%', padding: '1rem', textAlign: 'center' }}>
              Apply For This Loan
            </Link>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '2.5rem', background: 'var(--bg-hover)', border: '1px solid var(--border)' }}>
          <h3 className="section-title" style={{ marginBottom: '1.5rem' }}>How it works</h3>
          <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
            Your loan eligibility is determined by your total savings multiplied by the system multiplier.
          </p>
          <ul style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', lineHeight: 1.8, paddingLeft: '1.25rem' }}>
            <li style={{ marginBottom: '0.75rem' }}>Save more to increase your borrowing limit.</li>
            <li style={{ marginBottom: '0.75rem' }}>The current multiplier is <span style={{ color: 'var(--primary)', fontWeight: 700 }}>{data?.multiplier || 0}x</span>.</li>
            <li style={{ marginBottom: '0.75rem' }}>Loans are subject to administrative approval.</li>
            <li style={{ marginBottom: '0.75rem' }}>Interest rates are set by the system administrator.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
