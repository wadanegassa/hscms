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
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <div>
          <h2 className="page-title" style={{ fontSize: '2.8rem', fontWeight: 900, letterSpacing: '-0.04em', color: 'var(--text-primary)', textTransform: 'uppercase' }}>
            Loan <span style={{ color: 'var(--primary)' }}>Eligibility</span>
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginTop: '0.5rem', fontWeight: 600 }}>
            Check how much you can borrow based on your current savings.
          </p>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', alignItems: 'start' }}>
        <div className="glass-card" style={{ padding: '2.5rem', background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
          <h3 className="section-title" style={{ marginBottom: '2rem', fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Eligibility Calculation</h3>

          <div style={{ display: 'grid', gap: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>
              <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>Total Savings</span>
              <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{(data?.totalSavings || 0).toLocaleString()} ETB</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>
              <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>System Multiplier</span>
              <span style={{ fontWeight: 700, color: 'var(--primary)' }}>{data?.multiplier || 0}x</span>
            </div>
            <div style={{ padding: '2rem', background: 'rgba(15, 23, 42, 0.02)', borderRadius: '24px', marginTop: '1rem', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.75rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Maximum Loan Amount</div>
              <div style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                {(data?.maxLoan || 0).toLocaleString()} <span style={{ fontSize: '1rem', opacity: 0.5 }}>ETB</span>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '2rem' }}>
            <Link to="/member/apply-loan" className="btn hover-glow" style={{ width: '100%', height: '4rem', borderRadius: '16px', background: 'var(--gradient-primary)', color: '#000', fontSize: '1.1rem', fontWeight: 900, letterSpacing: '0.05em', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', textDecoration: 'none' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M12 5v14M5 12h14" /></svg>
              Apply For This Loan
            </Link>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '2.5rem', background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
          <h3 className="section-title" style={{ marginBottom: '2rem', fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>How it works</h3>
          <p style={{ fontSize: '1rem', color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: '2rem', fontWeight: 600 }}>
            Your loan eligibility is determined by your total savings multiplied by the system multiplier.
          </p>
          <ul style={{ fontSize: '1rem', color: 'var(--text-muted)', lineHeight: 2, paddingLeft: 0, listStyle: 'none' }}>
            <li style={{ marginBottom: '1rem', display: 'flex', gap: '0.75rem', alignItems: 'center', fontWeight: 600 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
              Save more to increase your borrowing limit.
            </li>
            <li style={{ marginBottom: '1rem', display: 'flex', gap: '0.75rem', alignItems: 'center', fontWeight: 600 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
              The current multiplier is <span style={{ color: 'var(--primary)', fontWeight: 900, marginLeft: '4px' }}>{data?.multiplier || 0}x</span>.
            </li>
            <li style={{ marginBottom: '1rem', display: 'flex', gap: '0.75rem', alignItems: 'center', fontWeight: 600 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
              Loans are subject to administrative approval.
            </li>
            <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', fontWeight: 600 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
              Interest rates are set by the system administrator.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
