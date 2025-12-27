import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

export default function StaffDashboard() {
  const [stats, setStats] = useState({
    memberCount: 0,
    totalSavings: 0,
    activeLoans: 0,
    todaySavings: 0,
    recentSavings: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await api.get('/staff/dashboard-stats');
      setStats(res.data);
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
        <div style={{ color: 'var(--text-secondary)', marginTop: '1rem' }}>Loading operations data...</div>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <div>
          <h2 className="page-title" style={{ fontSize: '2.8rem', fontWeight: 900, letterSpacing: '-0.04em', color: 'var(--text-primary)', textTransform: 'uppercase' }}>
            Operations <span style={{ color: 'var(--primary)' }}>Center</span>
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginTop: '0.5rem', fontWeight: 600 }}>
            Command hub for member financials and system oversight.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link to="/staff/register-member" className="btn" style={{
            background: 'var(--gradient-primary)',
            color: '#000',
            padding: '1rem 2rem',
            borderRadius: '14px',
            boxShadow: '0 10px 25px var(--primary-glow)',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            textDecoration: 'none',
            fontWeight: 900,
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="8.5" cy="7" r="4" /><line x1="20" y1="8" x2="20" y2="14" /><line x1="23" y1="11" x2="17" y2="11" /></svg>
            New Member
          </Link>
        </div>
      </header>

      {/* Bento Grid Layout */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '1.5rem',
        marginBottom: '3rem'
      }}>
        {[
          { label: 'Total Members', value: stats.memberCount, icon: <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></>, color: 'var(--primary)' },
          { label: 'Total Savings', value: `${stats.totalSavings.toLocaleString()} ETB`, icon: <path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />, color: 'var(--primary)' },
          { label: 'Active Loans', value: stats.activeLoans, icon: <><rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><line x1="1" y1="10" x2="23" y2="10" /></>, color: 'var(--warning)' },
          { label: 'Today\'s Flow', value: `${stats.todaySavings.toLocaleString()} ETB`, icon: <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />, color: 'var(--accent)' }
        ].map((card, i) => (
          <div key={i} className="glass-card" style={{ padding: '2rem', background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
            <div style={{ color: card.color, marginBottom: '1.25rem', opacity: 0.8 }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                {card.icon}
              </svg>
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '0.5rem' }}>{card.label}</div>
            <div style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>{card.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: '1.5rem' }}>
        <div className="glass-card" style={{ padding: '2.5rem', background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.6rem', fontWeight: 900, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '-0.02em' }}>Activity <span style={{ color: 'var(--primary)' }}>Log</span></h3>
              <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Real-time transaction monitoring</p>
            </div>
            <Link to="/staff/savings" style={{ color: 'var(--primary)', fontWeight: 800, textDecoration: 'none', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Full Ledger →</Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {stats.recentSavings.map((s, idx) => (
              <div key={idx} style={{
                display: 'flex',
                alignItems: 'center',
                padding: '1.25rem',
                background: 'rgba(15, 23, 42, 0.02)',
                borderRadius: '16px',
                border: '1px solid var(--border)',
                animation: `slideUp 0.5s ease forwards ${idx * 0.1}s`,
                opacity: 0
              }}>
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '10px',
                  background: 'rgba(234, 179, 8, 0.05)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '1.25rem',
                  border: '1px solid rgba(234, 179, 8, 0.1)'
                }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2.5">
                    <path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: '1rem' }}>{s.memberId?.fullName || 'Unknown Member'}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>{new Date(s.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 900, color: 'var(--primary)', fontSize: '1.1rem' }}>+{s.amount.toLocaleString()} <span style={{ fontSize: '0.7rem', opacity: 0.6 }}>ETB</span></div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--primary)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Verified</div>
                </div>
              </div>
            ))}
            {stats.recentSavings.length === 0 && (
              <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)', background: 'rgba(15, 23, 42, 0.01)', borderRadius: '20px', border: '1px dashed var(--border)' }}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" style={{ marginBottom: '1rem', opacity: 0.3 }}>
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                </svg>
                <div style={{ fontWeight: 700 }}>No recent activity recorded.</div>
              </div>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="glass-card" style={{ padding: '2rem', background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
            <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Quick <span style={{ color: 'var(--primary)' }}>Actions</span></h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                { to: '/staff/savings', label: 'Record Savings', icon: <path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />, color: 'var(--primary)' },
                { to: '/staff/repayments', label: 'Loan Repayment', icon: <><rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><line x1="1" y1="10" x2="23" y2="10" /></>, color: 'var(--secondary)' },
                { to: '/staff/loans', label: 'Loan Registry', icon: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></>, color: 'var(--accent)' }
              ].map((action, i) => (
                <Link key={i} to={action.to} className="btn hover-lift" style={{
                  justifyContent: 'flex-start',
                  background: 'rgba(15, 23, 42, 0.02)',
                  border: '1px solid var(--border)',
                  padding: '1.1rem',
                  borderRadius: '14px',
                  color: 'var(--text-primary)',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  fontWeight: 700,
                  fontSize: '0.85rem'
                }}>
                  <div style={{ color: action.color }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      {action.icon}
                    </svg>
                  </div>
                  {action.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="glass-card" style={{ padding: '2rem', background: 'var(--bg-secondary)', border: '1px solid var(--border)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '100px', height: '100px', background: 'var(--primary-glow)', filter: 'blur(40px)', borderRadius: '50%' }}></div>
            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-primary)', textTransform: 'uppercase' }}>System <span style={{ color: 'var(--primary)' }}>Status</span></h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.5rem', fontWeight: 600, lineHeight: 1.5 }}>All operational systems are running at peak performance.</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--primary)', fontWeight: 900, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary)', boxShadow: '0 0 12px var(--primary)' }}></div>
              Operational
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
