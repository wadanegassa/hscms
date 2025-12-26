import React, { useState, useEffect } from 'react';
import api from '../../services/api';

export default function StaffLoans() {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchLoans();
  }, []);

  const fetchLoans = async () => {
    try {
      const res = await api.get('/staff/loans');
      setLoans(res.data);
    } catch (err) {
      setError('Failed to load loans');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      approved: { bg: 'rgba(16, 185, 129, 0.1)', color: '#10b981', label: 'Approved' },
      rejected: { bg: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', label: 'Rejected' },
      active: { bg: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', label: 'Active' },
      completed: { bg: 'rgba(107, 114, 128, 0.1)', color: '#6b7280', label: 'Completed' },
      pending: { bg: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', label: 'Pending' }
    };
    const style = styles[status] || styles.pending;
    return (
      <span style={{
        padding: '0.4rem 0.8rem',
        borderRadius: '8px',
        fontSize: '0.75rem',
        fontWeight: '700',
        textTransform: 'uppercase',
        background: style.bg,
        color: style.color,
        border: `1px solid ${style.bg}`
      }}>
        {style.label}
      </span>
    );
  };

  return (
    <div className="fade-in" style={{ paddingBottom: '2rem' }}>
      <div className="flex-between mb-8" style={{ alignItems: 'flex-end' }}>
        <div>
          <h2 className="page-title" style={{ marginBottom: '0.5rem', fontSize: '2rem' }}>📋 Loan Management</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', margin: 0 }}>
            View and monitor all member loan applications and their statuses.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          <div className="glass-card" style={{ padding: '0.75rem 1.5rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--primary)', boxShadow: '0 0 10px var(--primary)' }}></div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>Total Loans</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>{loans.length}</div>
            </div>
          </div>
          <div className="glass-card" style={{ padding: '0.75rem 1.5rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--info)', boxShadow: '0 0 10px var(--info)' }}></div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>Total Borrowed</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                {(loans || []).reduce((acc, l) => acc + (l.amount || 0), 0).toLocaleString()} <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ETB</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="glass-card" style={{ overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '4rem', textAlign: 'center' }}>
            <div className="loading-spinner" style={{ margin: '0 auto 1rem' }}></div>
            <p style={{ color: 'var(--text-secondary)' }}>Fetching loan records...</p>
          </div>
        ) : error ? (
          <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--danger)' }}>
            <p style={{ fontWeight: 700 }}>⚠️ {error}</p>
            <button onClick={fetchLoans} className="btn btn-primary" style={{ marginTop: '1rem' }}>Retry</button>
          </div>
        ) : (
          <div className="table-container" style={{ margin: 0, borderRadius: 0, border: 'none' }}>
            <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
              <thead>
                <tr style={{ background: 'var(--bg-secondary)' }}>
                  <th style={{ padding: '1.25rem 1.5rem', textAlign: 'left', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase' }}>Member</th>
                  <th style={{ padding: '1.25rem 1.5rem', textAlign: 'left', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase' }}>Amount</th>
                  <th style={{ padding: '1.25rem 1.5rem', textAlign: 'left', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase' }}>Purpose</th>
                  <th style={{ padding: '1.25rem 1.5rem', textAlign: 'left', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase' }}>Status</th>
                  <th style={{ padding: '1.25rem 1.5rem', textAlign: 'right', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase' }}>Date</th>
                </tr>
              </thead>
              <tbody>
                {(loans || []).map((loan, idx) => (
                  <tr key={loan._id} className="hover-lift" style={{
                    borderBottom: '1px solid var(--border-bright)',
                    animation: `slideInRight 0.4s ease forwards ${idx * 0.05}s`,
                    opacity: 0
                  }}>
                    <td style={{ padding: '1.25rem 1.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '8px',
                          background: 'var(--gradient-primary)',
                          color: 'white',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.875rem',
                          fontWeight: 700
                        }}>
                          {loan.memberId?.fullName?.charAt(0) || 'M'}
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.9375rem' }}>
                            {loan.memberId?.fullName || 'Unknown Member'}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            ID: {loan.memberId?._id?.slice(-6).toUpperCase() || 'N/A'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '1.25rem 1.5rem' }}>
                      <div style={{ fontWeight: 800, color: 'var(--text-primary)' }}>
                        {(loan.amount || 0).toLocaleString()} <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ETB</span>
                      </div>
                    </td>
                    <td style={{ padding: '1.25rem 1.5rem' }}>
                      <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {loan.purpose}
                      </div>
                    </td>
                    <td style={{ padding: '1.25rem 1.5rem' }}>
                      {getStatusBadge(loan.status)}
                    </td>
                    <td style={{ padding: '1.25rem 1.5rem', textAlign: 'right', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                      {loan.createdAt ? new Date(loan.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}
                    </td>
                  </tr>
                ))}
                {loans.length === 0 && (
                  <tr>
                    <td colSpan="5" style={{ padding: '6rem 2rem', textAlign: 'center' }}>
                      <div style={{ opacity: 0.5, marginBottom: '1rem', fontSize: '3rem' }}>📂</div>
                      <h3 style={{ color: 'var(--text-primary)', fontWeight: 700, margin: 0 }}>No loans found</h3>
                      <p style={{ color: 'var(--text-muted)', margin: '0.5rem 0 0 0' }}>There are no loan records to display at this time.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
