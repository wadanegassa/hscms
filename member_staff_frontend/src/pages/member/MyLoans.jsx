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

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p style={{ color: '#64748b', marginTop: '1rem' }}>Loading your loans...</p>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <div className="mb-8">
        <h2 className="page-title">My Loans</h2>
        <p style={{ color: '#64748b', fontSize: '0.875rem' }}>Track your loan applications and repayment history</p>
      </div>

      <div className="glass-card mb-6" style={{ padding: '1.5rem' }}>
        <h3 className="section-title" style={{ marginBottom: '1.25rem' }}>Filter Loans</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
          <div className="input-group">
            <label className="label">Status</label>
            <select
              className="input"
              value={filters.status}
              onChange={e => setFilters({ ...filters, status: e.target.value })}
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
            <label className="label">Start Date</label>
            <input
              className="input"
              type="date"
              value={filters.startDate}
              onChange={e => setFilters({ ...filters, startDate: e.target.value })}
            />
          </div>
          <div className="input-group">
            <label className="label">End Date</label>
            <input
              className="input"
              type="date"
              value={filters.endDate}
              onChange={e => setFilters({ ...filters, endDate: e.target.value })}
            />
          </div>
          <div className="input-group">
            <label className="label">Min Amount</label>
            <input
              className="input"
              type="number"
              placeholder="Min"
              value={filters.minAmount}
              onChange={e => setFilters({ ...filters, minAmount: e.target.value })}
            />
          </div>
          <div className="input-group">
            <label className="label">Max Amount</label>
            <input
              className="input"
              type="number"
              placeholder="Max"
              value={filters.maxAmount}
              onChange={e => setFilters({ ...filters, maxAmount: e.target.value })}
            />
          </div>
        </div>
      </div>

      <div className="glass-card" style={{ padding: '1rem' }}>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Purpose</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLoans.map((loan) => (
                <React.Fragment key={loan._id}>
                  <tr>
                    <td>{new Date(loan.createdAt).toLocaleDateString()}</td>
                    <td style={{ fontWeight: 700, color: '#1e293b' }}>{loan.amount.toLocaleString()} ETB</td>
                    <td>
                      <span className={`badge badge-${loan.status === 'active' || loan.status === 'approved' || loan.status === 'completed' ? 'success' :
                        loan.status === 'pending' ? 'warning' : 'danger'
                        }`}>
                        {loan.status}
                      </span>
                    </td>
                    <td style={{ color: '#64748b' }}>{loan.purpose}</td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        className="btn btn-secondary"
                        style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem' }}
                        onClick={() => toggleRepayments(loan._id)}
                      >
                        {expandedLoan === loan._id ? 'Hide History' : 'View History'}
                      </button>
                    </td>
                  </tr>
                  {expandedLoan === loan._id && (
                    <tr>
                      <td colSpan="5" style={{ padding: '1.5rem', background: '#f8fafc', borderRadius: '8px' }}>
                        <div style={{ maxWidth: '600px' }}>
                          <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#1e293b', marginBottom: '1rem' }}>Repayment History</h4>
                          {repayments[loan._id] && repayments[loan._id].length > 0 ? (
                            <table className="table" style={{ background: 'transparent' }}>
                              <thead>
                                <tr>
                                  <th>Date</th>
                                  <th>Amount</th>
                                  <th>Method</th>
                                </tr>
                              </thead>
                              <tbody>
                                {repayments[loan._id].map((rep, idx) => (
                                  <tr key={idx}>
                                    <td>{new Date(rep.date).toLocaleDateString()}</td>
                                    <td style={{ fontWeight: 700, color: '#16a34a' }}>{rep.amount.toLocaleString()} ETB</td>
                                    <td style={{ textTransform: 'capitalize' }}>{rep.paymentMethod}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          ) : (
                            <div style={{ fontSize: '0.875rem', color: '#64748b', fontStyle: 'italic', textAlign: 'center', padding: '1rem' }}>
                              No repayments recorded yet.
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
                  <td colSpan="5" style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
                    No loans found matching your filters.
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
