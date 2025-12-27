import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

export default function MemberDashboard() {
  const [profile, setProfile] = useState(null);
  const [summary, setSummary] = useState({
    totalSavings: 0,
    activeLoan: null,
    remainingBalance: 0,
    recentSavings: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [profileRes, statsRes] = await Promise.all([
        api.get('/member/profile'),
        api.get('/member/dashboard-stats')
      ]);

      setProfile(profileRes.data);
      setSummary(statsRes.data);
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
        <div style={{ color: 'var(--text-secondary)', marginTop: '1rem' }}>Loading your financial data...</div>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <div>
          <h2 className="page-title" style={{ fontSize: '2.8rem', fontWeight: 900, letterSpacing: '-0.04em', color: 'var(--text-primary)', textTransform: 'uppercase' }}>
            Financial <span style={{ color: 'var(--primary)' }}>Overview</span>
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginTop: '0.5rem', fontWeight: 600 }}>
            Welcome back, <span style={{ color: 'var(--primary)', fontWeight: 800 }}>{profile?.fullName}</span>. Here's your status.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link to="/member/apply-loan" className="btn hover-glow" style={{
            background: 'var(--gradient-primary)',
            color: '#000',
            padding: '0.875rem 2rem',
            borderRadius: '16px',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            textDecoration: 'none',
            fontWeight: 900,
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M12 5v14M5 12h14" /></svg>
            Apply for Loan
          </Link>
        </div>
      </header>

      {/* Bento Grid Layout */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '1.5rem',
        marginBottom: '2.5rem'
      }}>
        <div className="glass-card" style={{ flex: 'none', margin: 0, padding: '2rem', background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
          <div style={{ color: 'var(--primary)', marginBottom: '1.5rem' }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '0.5rem' }}>Total Savings</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            {summary.totalSavings.toLocaleString()} <span style={{ fontSize: '1rem', opacity: 0.5 }}>ETB</span>
          </div>
        </div>

        <div className="glass-card" style={{ flex: 'none', margin: 0, padding: '2rem', background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
          <div style={{ color: 'var(--accent)', marginBottom: '1.5rem' }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><line x1="1" y1="10" x2="23" y2="10" />
            </svg>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '0.5rem' }}>Active Loan</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            {summary.activeLoan ? summary.activeLoan.amount.toLocaleString() : '0'} <span style={{ fontSize: '1rem', opacity: 0.5 }}>ETB</span>
          </div>
        </div>

        <div className="glass-card" style={{ flex: 'none', margin: 0, padding: '2rem', background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
          <div style={{ color: 'var(--warning)', marginBottom: '1.5rem' }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" />
            </svg>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '0.5rem' }}>Remaining Loan</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            {summary.remainingBalance.toLocaleString()} <span style={{ fontSize: '1rem', opacity: 0.5 }}>ETB</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: '1.5rem' }}>
        <div className="glass-card" style={{ flex: 'none', margin: 0, padding: '2rem', display: 'block', background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h3 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800 }}>Recent Transactions</h3>
            <Link to="/member/my-savings" style={{ color: 'var(--primary)', fontWeight: 700, textDecoration: 'none', fontSize: '0.9rem' }}>View History →</Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {summary.recentSavings.map((s, idx) => (
              <div key={idx} style={{
                display: 'flex',
                alignItems: 'center',
                padding: '1.25rem',
                background: 'rgba(15, 23, 42, 0.02)',
                borderRadius: '20px',
                border: '1px solid var(--border)',
                animation: `slideUp 0.5s ease forwards ${idx * 0.1}s`,
                opacity: 0
              }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '14px',
                  background: 'var(--bg)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '1.25rem',
                  border: '1px solid var(--border)'
                }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2.5">
                    <path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>Savings Deposit</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{new Date(s.date).toLocaleDateString()}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '1.1rem' }}>+{s.amount.toLocaleString()} ETB</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--success)', fontWeight: 700, textTransform: 'uppercase' }}>Completed</div>
                </div>
              </div>
            ))}
            {summary.recentSavings.length === 0 && (
              <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                No recent transactions found.
              </div>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="glass-card" style={{ flex: 'none', margin: 0, padding: '2rem', display: 'block', background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
            <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Notifications</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {summary.notifications?.slice(0, 3).map((n, idx) => (
                <div key={idx} style={{
                  padding: '1rem',
                  background: n.isRead ? 'transparent' : 'rgba(16, 185, 129, 0.08)',
                  borderRadius: '16px',
                  border: `1px solid ${n.isRead ? 'var(--border)' : 'rgba(16, 185, 129, 0.15)'}`,
                }}>
                  <div style={{ fontWeight: n.isRead ? 600 : 800, color: 'var(--text-primary)', fontSize: '0.9rem', marginBottom: '0.25rem' }}>{n.message}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{new Date(n.createdAt).toLocaleDateString()}</div>
                </div>
              ))}
              {(!summary.notifications || summary.notifications.length === 0) && (
                <div style={{ textAlign: 'center', padding: '1rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  No new notifications
                </div>
              )}
            </div>
          </div>

          <div className="glass-card" style={{ flex: 'none', margin: 0, padding: '2rem', display: 'block', background: 'var(--gradient-primary)', border: 'none', boxShadow: '0 10px 30px var(--primary-glow)' }}>
            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.25rem', fontWeight: 900, color: '#000', textTransform: 'uppercase' }}>Quick Support</h3>
            <p style={{ fontSize: '0.85rem', color: 'rgba(0,0,0,0.7)', marginBottom: '1.5rem', fontWeight: 600 }}>Need help? Reach out to us via any of these channels:</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#000' }}>
                <div style={{ background: 'rgba(0,0,0,0.1)', padding: '0.5rem', borderRadius: '8px', display: 'flex' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l2.27-2.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                </div>
                <div>
                  <div style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', opacity: 0.6 }}>Short Code</div>
                  <div style={{ fontWeight: 900, fontSize: '1.1rem' }}>8080</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#000' }}>
                <div style={{ background: 'rgba(0,0,0,0.1)', padding: '0.5rem', borderRadius: '8px', display: 'flex' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15.05 5A5 5 0 0 1 19 8.95M15.05 1A9 9 0 0 1 23 8.94m-1 7.98v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l2.27-2.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                </div>
                <div>
                  <div style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', opacity: 0.6 }}>Phone</div>
                  <div style={{ fontWeight: 900, fontSize: '1.1rem' }}>+251 911 223344</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#000' }}>
                <div style={{ background: 'rgba(0,0,0,0.1)', padding: '0.5rem', borderRadius: '8px', display: 'flex' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
                </div>
                <div>
                  <div style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', opacity: 0.6 }}>Email</div>
                  <div style={{ fontWeight: 900, fontSize: '1.1rem' }}>support@hscms.com</div>
                </div>
              </div>
            </div>

            <a href="mailto:support@hscms.com" className="btn hover-lift" style={{
              width: '100%',
              background: '#000',
              color: 'var(--primary)',
              fontWeight: 900,
              padding: '0.875rem',
              borderRadius: '14px',
              border: 'none',
              cursor: 'pointer',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              textAlign: 'center',
              textDecoration: 'none',
              display: 'block'
            }}>Send Message</a>
          </div>
        </div>
      </div>
    </div>
  );
};
