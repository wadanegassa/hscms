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
      approved: { bg: 'rgba(234, 179, 8, 0.1)', color: 'var(--primary)', label: 'Approved', icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6L9 17l-5-5" /></svg> },
      rejected: { bg: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', label: 'Rejected', icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 6L6 18M6 6l12 12" /></svg> },
      active: { bg: 'rgba(234, 179, 8, 0.1)', color: 'var(--primary)', label: 'Active', icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg> },
      completed: { bg: 'rgba(107, 114, 128, 0.1)', color: 'var(--text-muted)', label: 'Completed', icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg> },
      pending: { bg: 'rgba(245, 158, 11, 0.1)', color: 'var(--warning)', label: 'Pending', icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg> }
    };
    const style = styles[status] || styles.pending;
    return (
      <span style={{
        padding: '6px 12px',
        borderRadius: '10px',
        fontSize: '0.7rem',
        fontWeight: 800,
        textTransform: 'uppercase',
        background: style.bg,
        color: style.color,
        border: `1px solid ${style.bg}`,
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        letterSpacing: '0.05em'
      }}>
        {style.icon}
        {style.label}
      </span>
    );
  };

  return (
    <div className="fade-in" style={{ paddingBottom: '2rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <div>
          <h2 className="page-title" style={{ fontSize: '2.8rem', fontWeight: 900, letterSpacing: '-0.04em', color: 'var(--text-primary)', textTransform: 'uppercase' }}>
            Loan <span style={{ color: 'var(--primary)' }}>Registry</span>
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginTop: '0.5rem', fontWeight: 600 }}>
            Monitor and manage all member financial obligations.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '1.5rem' }}>
          <div className="glass-card" style={{ padding: '0.75rem 1.5rem', borderRadius: '16px', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '1rem', background: 'var(--bg-secondary)' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--primary)', boxShadow: '0 0 15px var(--primary)' }}></div>
            <div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Total Loans</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--text-primary)' }}>{loans.length}</div>
            </div>
          </div>
          <div className="glass-card" style={{ padding: '0.75rem 1.5rem', borderRadius: '16px', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '1rem', background: 'var(--bg-secondary)' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--accent)', boxShadow: '0 0 15px var(--accent)' }}></div>
            <div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Total Disbursed</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--text-primary)' }}>
                {(loans || []).reduce((acc, l) => acc + (l.amount || 0), 0).toLocaleString()} <span style={{ fontSize: '0.7rem', opacity: 0.5 }}>ETB</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="glass-card" style={{ flex: 'none', margin: 0, padding: '0', overflow: 'hidden', border: '1px solid var(--border)', background: 'var(--bg-secondary)' }}>
        {loading ? (
          <div style={{ padding: '8rem', textAlign: 'center' }}>
            <div className="loading-spinner"></div>
            <div style={{ color: 'var(--text-muted)', marginTop: '1.5rem' }}>Fetching loan records...</div>
          </div>
        ) : error ? (
          <div style={{ padding: '6rem 2rem', textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>⚠️</div>
            <h3 style={{ color: 'var(--danger)', fontWeight: 900, fontSize: '1.5rem' }}>Load Failed</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>{error}</p>
            <button onClick={fetchLoans} className="btn" style={{ background: 'var(--gradient-primary)', color: 'white', padding: '0.75rem 2rem', borderRadius: '12px', fontWeight: 800 }}>Retry</button>
          </div>
        ) : (
          <div className="table-container" style={{ margin: 0, borderRadius: 0, border: 'none' }}>
            <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
              <thead>
                <tr style={{ background: 'rgba(15, 23, 42, 0.02)' }}>
                  <th style={{ padding: '1.25rem 2rem', textAlign: 'left', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Member</th>
                  <th style={{ padding: '1.25rem 2rem', textAlign: 'left', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Principal</th>
                  <th style={{ padding: '1.25rem 2rem', textAlign: 'left', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Remaining</th>
                  <th style={{ padding: '1.25rem 2rem', textAlign: 'left', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Status</th>
                  <th style={{ padding: '1.25rem 2rem', textAlign: 'right', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Date</th>
                </tr>
              </thead>
              <tbody>
                {(loans || []).map((loan, idx) => (
                  <tr key={loan._id} style={{
                    borderBottom: '1px solid var(--border)',
                    animation: `slideUp 0.4s ease forwards ${idx * 0.05}s`,
                    opacity: 0
                  }}>
                    <td style={{ padding: '1.5rem 2rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '12px',
                          background: 'var(--bg)',
                          color: 'var(--primary)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '1rem',
                          fontWeight: 900,
                          border: '1px solid var(--border)'
                        }}>
                          {loan.memberId?.fullName?.charAt(0) || 'M'}
                        </div>
                        <div>
                          <div style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: '1rem' }}>
                            {loan.memberId?.fullName || 'Unknown Member'}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            ID: {loan.memberId?._id?.slice(-6).toUpperCase() || 'N/A'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '1.5rem 2rem' }}>
                      <div style={{ fontWeight: 900, color: 'var(--text-primary)', fontSize: '1.1rem' }}>
                        {(loan.amount || 0).toLocaleString()} <span style={{ fontSize: '0.7rem', opacity: 0.5 }}>ETB</span>
                      </div>
                    </td>
                    <td style={{ padding: '1.5rem 2rem' }}>
                      <div style={{ fontWeight: 900, color: 'var(--warning)', fontSize: '1.1rem' }}>
                        {Math.round(loan.remainingBalance || 0).toLocaleString()} <span style={{ fontSize: '0.7rem', opacity: 0.5 }}>ETB</span>
                      </div>
                    </td>
                    <td style={{ padding: '1.5rem 2rem' }}>
                      {getStatusBadge(loan.status)}
                    </td>
                    <td style={{ padding: '1.5rem 2rem', textAlign: 'right', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                      {loan.createdAt ? new Date(loan.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                  </tr>
                ))}
                {loans.length === 0 && (
                  <tr>
                    <td colSpan="5" style={{ padding: '8rem 2rem', textAlign: 'center' }}>
                      <div style={{
                        width: '80px',
                        height: '80px',
                        background: 'rgba(15, 23, 42, 0.02)',
                        borderRadius: '24px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 1.5rem',
                        border: '1px solid var(--border)'
                      }}>
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" /></svg>
                      </div>
                      <h3 style={{ color: 'var(--text-primary)', fontWeight: 900, fontSize: '1.5rem', margin: 0 }}>No Records</h3>
                      <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>The loan registry is currently empty.</p>
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
