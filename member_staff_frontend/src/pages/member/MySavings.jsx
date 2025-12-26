import React, { useState, useEffect } from 'react';
import api from '../../services/api';

export default function MySavings() {
  const [savings, setSavings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredSavings, setFilteredSavings] = useState([]);
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    minAmount: '',
    maxAmount: '',
    search: ''
  });

  useEffect(() => {
    fetchSavings();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [savings, filters]);

  const fetchSavings = async () => {
    try {
      const res = await api.get('/member/savings');
      setSavings(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let result = [...savings];

    if (filters.startDate) {
      result = result.filter(s => new Date(s.date) >= new Date(filters.startDate));
    }
    if (filters.endDate) {
      const end = new Date(filters.endDate);
      end.setHours(23, 59, 59, 999);
      result = result.filter(s => new Date(s.date) <= end);
    }
    if (filters.minAmount) {
      result = result.filter(s => s.amount >= parseFloat(filters.minAmount));
    }
    if (filters.maxAmount) {
      result = result.filter(s => s.amount <= parseFloat(filters.maxAmount));
    }
    if (filters.search) {
      const search = filters.search.toLowerCase();
      result = result.filter(s =>
        s.paymentMethod.toLowerCase().includes(search) ||
        (s.memberId?.fullName && s.memberId.fullName.toLowerCase().includes(search))
      );
    }

    setFilteredSavings(result);
  };

  return (
    <div className="fade-in">
      <div className="flex-between mb-8">
        <div>
          <h2 className="page-title">Savings History</h2>
          <p style={{ color: '#64748b', fontSize: '0.875rem' }}>Track your financial growth and contribution history.</p>
        </div>
        <div className="glass-card" style={{ padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#dcfce7', color: '#166534', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
          </div>
          <div>
            <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Total Saved</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1e293b' }}>
              {(savings || []).reduce((acc, s) => acc + (s.amount || 0), 0).toLocaleString()} <span style={{ fontSize: '0.875rem', fontWeight: 500, color: '#64748b' }}>ETB</span>
            </div>
          </div>
        </div>
      </div>

      <div className="glass-card mb-6" style={{ padding: '1.5rem' }}>
        <h3 className="section-title" style={{ marginBottom: '1.25rem' }}>Filter Transactions</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
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
              onChange={setFilters.bind(null, { ...filters, endDate: filters.endDate })} // Fixing bind later
              onInput={e => setFilters({ ...filters, endDate: e.target.value })}
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
          <div className="input-group">
            <label className="label">Search</label>
            <input
              className="input"
              placeholder="Search method..."
              value={filters.search}
              onChange={e => setFilters({ ...filters, search: e.target.value })}
            />
          </div>
        </div>
      </div>

      <div className="glass-card" style={{ padding: '1rem' }}>
        {loading ? (
          <div style={{ padding: '4rem', textAlign: 'center' }}>
            <div className="loading-spinner"></div>
            <p style={{ color: '#64748b', marginTop: '1rem' }}>Loading history...</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Method</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredSavings.map((saving, idx) => (
                  <tr key={saving._id}>
                    <td>
                      <div style={{ fontWeight: 600, color: '#1e293b' }}>
                        {new Date(saving.date).toLocaleDateString()}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                        {new Date(saving.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>
                    <td style={{ fontWeight: 700, color: '#16a34a' }}>
                      +{saving.amount.toLocaleString()} ETB
                    </td>
                    <td>
                      <span style={{ textTransform: 'capitalize' }}>{saving.paymentMethod}</span>
                    </td>
                    <td>
                      <span className="badge badge-success">Completed</span>
                    </td>
                  </tr>
                ))}
                {filteredSavings.length === 0 && (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
                      No transactions found matching your filters.
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
