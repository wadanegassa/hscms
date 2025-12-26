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
      const [profileRes, goalRes, loansRes, savingsRes, notificationsRes] = await Promise.all([
        api.get('/member/profile'),
        api.get('/member/goal'),
        api.get('/member/loans'),
        api.get('/member/savings'),
        api.get('/member/notifications')
      ]);

      const loans = loansRes.data || [];
      const activeLoan = loans.find(l => l.status === 'active' || l.status === 'approved');

      // Calculate remaining balance for active loan
      let remainingBalance = 0;
      if (activeLoan) {
        const totalRepayable = activeLoan.amount + (activeLoan.amount * (activeLoan.interestRate || 5) / 100);
        remainingBalance = totalRepayable; // Simplified for now
      }

      setProfile(profileRes.data);
      setSummary({
        totalSavings: goalRes.data?.totalSaved || 0,
        activeLoan: activeLoan,
        remainingBalance: remainingBalance,
        recentSavings: (savingsRes.data || []).slice(0, 5),
        notifications: notificationsRes.data || []
      });
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
      <div className="flex-between mb-8">
        <div>
          <h2 className="page-title">Welcome back, {profile?.fullName || 'User'}!</h2>
          <p style={{ color: '#64748b', fontSize: '0.875rem' }}>Here's what's happening with your account today.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link to="/member/profile" className="btn btn-secondary">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
            Profile
          </Link>
          <Link to="/member/apply-loan" className="btn btn-primary">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14" /></svg>
            Apply for Loan
          </Link>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#dcfce7', color: '#166534', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
            </div>
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#64748b' }}>Total Savings</span>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1e293b' }}>
            {summary.totalSavings.toLocaleString()} <span style={{ fontSize: '0.875rem', fontWeight: 500, color: '#64748b' }}>ETB</span>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#dbeafe', color: '#1e40af', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><line x1="1" y1="10" x2="23" y2="10" /></svg>
            </div>
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#64748b' }}>Active Loan</span>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1e293b' }}>
            {summary.activeLoan ? summary.activeLoan.amount.toLocaleString() : '0'} <span style={{ fontSize: '0.875rem', fontWeight: 500, color: '#64748b' }}>ETB</span>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#fef9c3', color: '#854d0e', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></svg>
            </div>
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#64748b' }}>Remaining Balance</span>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1e293b' }}>
            {summary.remainingBalance.toLocaleString()} <span style={{ fontSize: '0.875rem', fontWeight: 500, color: '#64748b' }}>ETB</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1.5rem' }}>
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div className="flex-between mb-6">
            <h3 className="section-title" style={{ margin: 0 }}>Recent Transactions</h3>
            <Link to="/member/my-savings" style={{ fontSize: '0.8125rem', color: '#3b82f6', fontWeight: 600, textDecoration: 'none' }}>View all</Link>
          </div>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {summary.recentSavings.map((s, idx) => (
                  <tr key={idx}>
                    <td>{new Date(s.date).toLocaleDateString()}</td>
                    <td style={{ fontWeight: 600, color: '#1e293b' }}>{s.amount.toLocaleString()} ETB</td>
                    <td><span className="badge badge-success">Completed</span></td>
                  </tr>
                ))}
                {summary.recentSavings.length === 0 && (
                  <tr>
                    <td colSpan="3" style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>No recent transactions</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div style={{ display: 'grid', gap: '1.5rem' }}>
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <div className="flex-between mb-4">
              <h3 className="section-title" style={{ margin: 0 }}>Notifications</h3>
              <Link to="/member/notifications" style={{ fontSize: '0.8125rem', color: '#3b82f6', fontWeight: 600, textDecoration: 'none' }}>View all</Link>
            </div>
            <div style={{ display: 'grid', gap: '0.75rem' }}>
              {summary.notifications?.slice(0, 3).map((n, idx) => (
                <div key={idx} style={{
                  padding: '0.75rem',
                  background: n.isRead ? 'transparent' : 'rgba(59, 130, 246, 0.05)',
                  borderRadius: '12px',
                  border: `1px solid ${n.isRead ? 'var(--border)' : 'rgba(59, 130, 246, 0.1)'}`,
                  fontSize: '0.8125rem'
                }}>
                  <div style={{ fontWeight: n.isRead ? 500 : 700, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>{n.message}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{new Date(n.createdAt).toLocaleDateString()}</div>
                </div>
              ))}
              {(!summary.notifications || summary.notifications.length === 0) && (
                <div style={{ textAlign: 'center', padding: '1rem', color: 'var(--text-muted)', fontSize: '0.8125rem' }}>
                  No new notifications
                </div>
              )}
            </div>
          </div>

          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h3 className="section-title" style={{ marginBottom: '1rem' }}>Quick Actions</h3>
            <div style={{ display: 'grid', gap: '0.75rem' }}>
              <Link to="/member/my-savings" className="btn btn-secondary" style={{ justifyContent: 'flex-start' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
                My Savings History
              </Link>
              <Link to="/member/my-loans" className="btn btn-secondary" style={{ justifyContent: 'flex-start' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><line x1="1" y1="10" x2="23" y2="10" /></svg>
                My Loan History
              </Link>
              <Link to="/member/loan-eligibility" className="btn btn-secondary" style={{ justifyContent: 'flex-start' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                Check Loan Eligibility
              </Link>
            </div>
          </div>

          <div className="glass-card" style={{ padding: '1.5rem', background: '#1e293b', color: 'white' }}>
            <h3 className="section-title" style={{ color: 'white', marginBottom: '0.5rem' }}>Need Help?</h3>
            <p style={{ fontSize: '0.8125rem', color: '#94a3b8', marginBottom: '1.5rem' }}>Contact our support team for any assistance with your account.</p>
            <button className="btn btn-accent" style={{ width: '100%' }}>Contact Support</button>
          </div>
        </div>
      </div>
    </div>
  );
}

