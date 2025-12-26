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
      <div className="flex-between mb-8">
        <div>
          <h2 className="page-title">Staff Operations</h2>
          <p style={{ color: '#64748b', fontSize: '0.875rem' }}>Overview of your saving and credit operations</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link to="/staff/register-member" className="btn btn-primary">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="8.5" cy="7" r="4" /><line x1="20" y1="8" x2="20" y2="14" /><line x1="23" y1="11" x2="17" y2="11" /></svg>
            Register Member
          </Link>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#dbeafe', color: '#1e40af', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
            </div>
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#64748b' }}>Total Members</span>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1e293b' }}>
            {stats.memberCount}
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#dcfce7', color: '#166534', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
            </div>
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#64748b' }}>Total Savings</span>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1e293b' }}>
            {stats.totalSavings.toLocaleString()} <span style={{ fontSize: '0.875rem', fontWeight: 500, color: '#64748b' }}>ETB</span>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#fef9c3', color: '#854d0e', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><line x1="1" y1="10" x2="23" y2="10" /></svg>
            </div>
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#64748b' }}>Active Loans</span>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1e293b' }}>
            {stats.activeLoans}
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#f3e8ff', color: '#6b21a8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>
            </div>
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#64748b' }}>Today's Savings</span>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1e293b' }}>
            {stats.todaySavings.toLocaleString()} <span style={{ fontSize: '0.875rem', fontWeight: 500, color: '#64748b' }}>ETB</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1.5rem' }}>
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div className="flex-between mb-6">
            <h3 className="section-title" style={{ margin: 0 }}>Recent Savings Activity</h3>
            <Link to="/staff/savings" style={{ fontSize: '0.8125rem', color: '#3b82f6', fontWeight: 600, textDecoration: 'none' }}>View all</Link>
          </div>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Member</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentSavings.map((s, idx) => (
                  <tr key={idx}>
                    <td>{new Date(s.date).toLocaleDateString()}</td>
                    <td style={{ fontWeight: 600, color: '#1e293b' }}>{s.memberId?.fullName || 'Unknown'}</td>
                    <td style={{ fontWeight: 600, color: '#1e293b' }}>{s.amount.toLocaleString()} ETB</td>
                    <td><span className="badge badge-success">Recorded</span></td>
                  </tr>
                ))}
                {stats.recentSavings.length === 0 && (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>No recent activity</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div style={{ display: 'grid', gap: '1.5rem' }}>
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h3 className="section-title" style={{ marginBottom: '1rem' }}>Quick Actions</h3>
            <div style={{ display: 'grid', gap: '0.75rem' }}>
              <Link to="/staff/savings" className="btn btn-secondary" style={{ justifyContent: 'flex-start' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
                Record New Savings
              </Link>
              <Link to="/staff/repayments" className="btn btn-secondary" style={{ justifyContent: 'flex-start' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><line x1="1" y1="10" x2="23" y2="10" /></svg>
                Record Loan Repayment
              </Link>
              <Link to="/staff/loans" className="btn btn-secondary" style={{ justifyContent: 'flex-start' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg>
                Manage Loan Applications
              </Link>
            </div>
          </div>

          <div className="glass-card" style={{ padding: '1.5rem', background: '#1e293b', color: 'white' }}>
            <h3 className="section-title" style={{ color: 'white', marginBottom: '0.5rem' }}>System Status</h3>
            <p style={{ fontSize: '0.8125rem', color: '#94a3b8', marginBottom: '1.5rem' }}>All systems are operational. Last sync: Just now.</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#4ade80', fontSize: '0.75rem', fontWeight: 600 }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#4ade80' }}></div>
              Operational
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
