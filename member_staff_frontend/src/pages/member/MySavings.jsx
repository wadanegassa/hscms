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
    <div className="fade-in" style={{ paddingBottom: '2rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <div>
          <h2 className="page-title" style={{ fontSize: '2.8rem', fontWeight: 900, letterSpacing: '-0.04em', color: 'var(--text-primary)', textTransform: 'uppercase' }}>
            Savings <span style={{ color: 'var(--primary)' }}>History</span>
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginTop: '0.5rem', fontWeight: 600 }}>
            Track your financial growth and contribution history.
          </p>
        </div>

        <div className="glass-card" style={{ padding: '0.75rem 1.5rem', borderRadius: '16px', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '1rem', background: 'var(--bg-secondary)' }}>
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--primary)', boxShadow: '0 0 15px var(--primary)' }}></div>
          <div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Total Saved</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--text-primary)' }}>
              {(savings || []).reduce((acc, s) => acc + (s.amount || 0), 0).toLocaleString()} <span style={{ fontSize: '0.7rem', opacity: 0.5 }}>ETB</span>
            </div>
          </div>
        </div>
      </header>

      <div className="glass-card" style={{ flex: 'none', margin: '0 0 2.5rem 0', padding: '2rem', display: 'block', border: '1px solid var(--border)', background: 'var(--bg-secondary)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ width: '4px', height: '20px', background: 'var(--secondary)', borderRadius: '2px' }}></div>
          <h4 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '1rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Filter Transactions
          </h4>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.5rem' }}>
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
            <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 800, marginBottom: '0.5rem', textTransform: 'uppercase' }}>End Date</label>
            <input
              className="input"
              type="date"
              value={filters.endDate}
              onChange={e => setFilters({ ...filters, endDate: e.target.value })}
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
          <div className="input-group">
            <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 800, marginBottom: '0.5rem', textTransform: 'uppercase' }}>Search</label>
            <input
              className="input"
              placeholder="Method or details..."
              value={filters.search}
              onChange={e => setFilters({ ...filters, search: e.target.value })}
              style={{ background: 'rgba(15, 23, 42, 0.02)', border: '1px solid var(--border)', borderRadius: '12px' }}
            />
          </div>
        </div>
      </div>

      <div className="glass-card" style={{ flex: 'none', margin: 0, padding: '0', overflow: 'hidden', border: '1px solid var(--border)', background: 'var(--bg-secondary)' }}>
        {loading ? (
          <div style={{ padding: '8rem', textAlign: 'center' }}>
            <div className="loading-spinner"></div>
            <div style={{ color: 'var(--text-muted)', marginTop: '1.5rem' }}>Fetching records...</div>
          </div>
        ) : (
          <div className="table-container" style={{ margin: 0, borderRadius: 0, border: 'none' }}>
            <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
              <thead>
                <tr style={{ background: 'rgba(15, 23, 42, 0.02)' }}>
                  <th style={{ padding: '1.25rem 2rem', textAlign: 'left', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Date & Time</th>
                  <th style={{ padding: '1.25rem 2rem', textAlign: 'left', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Amount</th>
                  <th style={{ padding: '1.25rem 2rem', textAlign: 'left', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Method</th>
                  <th style={{ padding: '1.25rem 2rem', textAlign: 'right', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredSavings.map((saving, idx) => (
                  <tr key={saving._id} style={{
                    borderBottom: '1px solid var(--border)',
                    animation: `slideUp 0.4s ease forwards ${idx * 0.05}s`,
                    opacity: 0
                  }}>
                    <td style={{ padding: '1.5rem 2rem' }}>
                      <div style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: '1rem' }}>
                        {new Date(saving.date).toLocaleDateString()}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                        {new Date(saving.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>
                    <td style={{ padding: '1.5rem 2rem' }}>
                      <div style={{ fontWeight: 900, color: 'var(--primary)', fontSize: '1.1rem' }}>
                        +{saving.amount.toLocaleString()} <span style={{ fontSize: '0.7rem', opacity: 0.5 }}>ETB</span>
                      </div>
                    </td>
                    <td style={{ padding: '1.5rem 2rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-primary)', fontWeight: 700 }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--secondary)' }}></div>
                        <span style={{ textTransform: 'capitalize' }}>{saving.paymentMethod}</span>
                      </div>
                    </td>
                    <td style={{ padding: '1.5rem 2rem', textAlign: 'right' }}>
                      <span style={{
                        padding: '6px 12px',
                        borderRadius: '10px',
                        fontSize: '0.7rem',
                        fontWeight: 900,
                        textTransform: 'uppercase',
                        background: 'rgba(234, 179, 8, 0.1)',
                        color: 'var(--primary)',
                        border: '1px solid rgba(234, 179, 8, 0.1)',
                        letterSpacing: '0.05em'
                      }}>
                        Completed
                      </span>
                    </td>
                  </tr>
                ))}
                {filteredSavings.length === 0 && (
                  <tr>
                    <td colSpan="4" style={{ padding: '8rem 2rem', textAlign: 'center' }}>
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
                      <h3 style={{ color: 'var(--text-primary)', fontWeight: 900, fontSize: '1.5rem', margin: 0 }}>No Transactions</h3>
                      <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>No savings records found matching your criteria.</p>
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
