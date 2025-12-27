import React, { useState, useEffect } from 'react';
import api from '../../services/api';

export default function MyLoans() {
  const [loans, setLoans] = useState([]);
  const [filteredLoans, setFilteredLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedLoan, setExpandedLoan] = useState(null);
  const [repayments, setRepayments] = useState({});
  const [filters, setFilters] = useState({
    status: '',
    startDate: '',
    endDate: '',
    minAmount: '',
    maxAmount: ''
  });

  useEffect(() => {
    fetchLoans();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [loans, filters]);

  const fetchLoans = async () => {
    try {
      setLoading(true);
      const res = await api.get('/member/loans');
      setLoans(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let result = [...loans];

    if (filters.status) {
      result = result.filter(l => l.status === filters.status);
    }
    if (filters.startDate) {
      result = result.filter(l => new Date(l.createdAt) >= new Date(filters.startDate));
    }
    if (filters.endDate) {
      const end = new Date(filters.endDate);
      end.setHours(23, 59, 59, 999);
      result = result.filter(l => new Date(l.createdAt) <= end);
    }
    if (filters.minAmount) {
      result = result.filter(l => l.amount >= parseFloat(filters.minAmount));
    }
    if (filters.maxAmount) {
      result = result.filter(l => l.amount <= parseFloat(filters.maxAmount));
    }

    setFilteredLoans(result);
  };

  const toggleRepayments = async (loanId) => {
    if (expandedLoan === loanId) {
      setExpandedLoan(null);
      return;
    }

    setExpandedLoan(loanId);
    if (!repayments[loanId]) {
      try {
        const res = await api.get(`/member/repayments/${loanId}`);
        setRepayments(prev => ({ ...prev, [loanId]: res.data || [] }));
      } catch (err) {
        console.error(err);
      }
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      approved: { bg: 'rgba(234, 179, 8, 0.1)', color: 'var(--primary)', label: 'Approved', icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6L9 17l-5-5" /></svg> },
      rejected: { bg: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', label: 'Rejected', icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 6L6 18M6 6l12 12" /></svg> },
      active: { bg: 'rgba(234, 179, 8, 0.1)', color: 'var(--primary)', label: 'Active', icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg> },
      completed: { bg: 'rgba(148, 163, 184, 0.1)', color: 'var(--text-muted)', label: 'Completed', icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg> },
      pending: { bg: 'rgba(255, 171, 0, 0.1)', color: 'var(--warning)', label: 'Pending', icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg> }
    };
    const style = styles[status] || styles.pending;
    return (
      <span style={{
        padding: '6px 12px',
        borderRadius: '10px',
        fontSize: '0.7rem',
        fontWeight: 900,
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

  if (loading) {
    return (
      <div style={{ padding: '8rem', textAlign: 'center' }}>
        <div className="loading-spinner"></div>
        <div style={{ color: 'var(--text-muted)', marginTop: '1.5rem' }}>Fetching your loan portfolio...</div>
      </div>
    );
  }

  return (
    <div className="fade-in" style={{ paddingBottom: '2rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <div>
          <h2 className="page-title" style={{ fontSize: '2.8rem', fontWeight: 900, letterSpacing: '-0.04em', color: 'var(--text-primary)', textTransform: 'uppercase' }}>
            My <span style={{ color: 'var(--primary)' }}>Loans</span>
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginTop: '0.5rem', fontWeight: 600 }}>
            Track your loan applications and repayment history.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '1.5rem' }}>
          <div className="glass-card" style={{ padding: '0.75rem 1.5rem', borderRadius: '16px', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '1rem', background: 'var(--bg-secondary)' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--primary)', boxShadow: '0 0 15px var(--primary)' }}></div>
            <div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Active Loans</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--text-primary)' }}>
                {loans.filter(l => l.status === 'active' || l.status === 'approved').length}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="glass-card" style={{ flex: 'none', margin: '0 0 2.5rem 0', padding: '2rem', display: 'block', border: '1px solid var(--border)', background: 'var(--bg-secondary)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ width: '4px', height: '20px', background: 'var(--primary)', borderRadius: '2px' }}></div>
          <h4 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '1rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Filter Portfolio
          </h4>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1.5rem' }}>
          <div className="input-group">
            <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 800, marginBottom: '0.5rem', textTransform: 'uppercase' }}>Status</label>
            <select
              className="input"
              value={filters.status}
              onChange={e => setFilters({ ...filters, status: e.target.value })}
              style={{ background: 'rgba(15, 23, 42, 0.02)', border: '1px solid var(--border)', borderRadius: '12px', height: '3rem' }}
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          <div className="input-group">
            <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 800, marginBottom: '0.5rem', textTransform: 'uppercase' }}>Start Date</label>
            <input
              className="input"
              type="date"
              value={filters.startDate}
              onChange={e => setFilters({ ...filters, startDate: e.target.value })}
              style={{ background: 'rgba(15, 23, 42, 0.02)', border: '1px solid var(--border)', borderRadius: '12px' }}
            />
          </div>
          <div className="input-group">
            <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 800, marginBottom: '0.5rem', textTransform: 'uppercase' }}>Min Amount</label>
            <input
              className="input"
              type="number"
              placeholder="Min $"
              value={filters.minAmount}
              onChange={e => setFilters({ ...filters, minAmount: e.target.value })}
              style={{ background: 'rgba(15, 23, 42, 0.02)', border: '1px solid var(--border)', borderRadius: '12px' }}
            />
          </div>
        </div>
      </div>

      <div className="glass-card" style={{ flex: 'none', margin: 0, padding: '0', overflow: 'hidden', border: '1px solid var(--border)', background: 'var(--bg-secondary)' }}>
        <div className="table-container" style={{ margin: 0, borderRadius: 0, border: 'none' }}>
          <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
            <thead>
              <tr style={{ background: 'rgba(15, 23, 42, 0.02)' }}>
                <th style={{ padding: '1.25rem 2rem', textAlign: 'left', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Date</th>
                <th style={{ padding: '1.25rem 2rem', textAlign: 'left', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Principal</th>
                <th style={{ padding: '1.25rem 2rem', textAlign: 'left', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Remaining</th>
                <th style={{ padding: '1.25rem 2rem', textAlign: 'left', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Status</th>
                <th style={{ padding: '1.25rem 2rem', textAlign: 'right', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLoans.map((loan, idx) => (
                <React.Fragment key={loan._id}>
                  <tr style={{
                    borderBottom: '1px solid var(--border)',
                    animation: `slideUp 0.4s ease forwards ${idx * 0.05}s`,
                    opacity: 0
                  }}>
                    <td style={{ padding: '1.5rem 2rem' }}>
                      <div style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: '1rem' }}>
                        {new Date(loan.createdAt).toLocaleDateString()}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                        ID: {loan._id.slice(-6).toUpperCase()}
                      </div>
                    </td>
                    <td style={{ padding: '1.5rem 2rem' }}>
                      <div style={{ fontWeight: 900, color: 'var(--text-primary)', fontSize: '1.1rem' }}>
                        {loan.amount.toLocaleString()} <span style={{ fontSize: '0.7rem', opacity: 0.5 }}>ETB</span>
                      </div>
                    </td>
                    <td style={{ padding: '1.5rem 2rem' }}>
                      <div style={{ fontWeight: 900, color: 'var(--warning)', fontSize: '1.1rem' }}>
                        {Math.round(loan.remainingBalance).toLocaleString()} <span style={{ fontSize: '0.7rem', opacity: 0.5 }}>ETB</span>
                      </div>
                    </td>
                    <td style={{ padding: '1.5rem 2rem' }}>
                      {getStatusBadge(loan.status)}
                    </td>
                    <td style={{ padding: '1.5rem 2rem', textAlign: 'right' }}>
                      <button
                        className="btn hover-lift"
                        style={{ padding: '0.6rem 1.2rem', fontSize: '0.75rem', borderRadius: '10px', background: expandedLoan === loan._id ? 'var(--bg)' : 'rgba(15, 23, 42, 0.05)', color: 'var(--text-primary)', border: '1px solid var(--border)', fontWeight: 800 }}
                        onClick={() => toggleRepayments(loan._id)}
                      >
                        {expandedLoan === loan._id ? 'Hide History' : 'View History'}
                      </button>
                    </td>
                  </tr>
                  {expandedLoan === loan._id && (
                    <tr>
                      <td colSpan="5" style={{ padding: '2rem', background: 'rgba(255,255,255,0.02)' }}>
                        <div className="fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                            <div style={{ width: '3px', height: '16px', background: 'var(--secondary)', borderRadius: '2px' }}></div>
                            <h4 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '0.9rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                              Repayment History
                            </h4>
                          </div>

                          {repayments[loan._id] && repayments[loan._id].length > 0 ? (
                            <div style={{ borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--border)' }}>
                              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                  <tr style={{ background: 'rgba(255,255,255,0.02)' }}>
                                    <th style={{ padding: '1rem', textAlign: 'left', color: 'var(--text-muted)', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase' }}>Date</th>
                                    <th style={{ padding: '1rem', textAlign: 'left', color: 'var(--text-muted)', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase' }}>Amount</th>
                                    <th style={{ padding: '1rem', textAlign: 'right', color: 'var(--text-muted)', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase' }}>Method</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {repayments[loan._id].map((rep, rIdx) => (
                                    <tr key={rIdx} style={{ borderTop: '1px solid var(--border)' }}>
                                      <td style={{ padding: '1rem', color: 'var(--text-primary)', fontWeight: 700 }}>{new Date(rep.date).toLocaleDateString()}</td>
                                      <td style={{ padding: '1rem', color: 'var(--primary)', fontWeight: 900 }}>+{rep.amount.toLocaleString()} ETB</td>
                                      <td style={{ padding: '1rem', textAlign: 'right', color: 'var(--text-muted)', textTransform: 'capitalize', fontSize: '0.85rem' }}>{rep.paymentMethod}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          ) : (
                            <div style={{ padding: '3rem', textAlign: 'center', background: 'rgba(15, 23, 42, 0.01)', borderRadius: '16px', border: '1px dashed var(--border)' }}>
                              <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>⏳</div>
                              <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 700 }}>No repayments recorded yet.</div>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
              {filteredLoans.length === 0 && (
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
                    <h3 style={{ color: 'var(--text-primary)', fontWeight: 900, fontSize: '1.5rem', margin: 0 }}>No Loans Found</h3>
                    <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Your loan portfolio is currently empty.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
