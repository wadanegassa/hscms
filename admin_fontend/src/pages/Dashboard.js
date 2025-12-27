import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/Card';
import { Chart as C, LineElement, BarElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend, ArcElement } from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import api from '../services/api';

C.register(LineElement, BarElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend, ArcElement);

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setRefreshing(true);
      const res = await api.get('/admin/dashboard-stats');
      // Handle wrapped response
      setStats(res.data?.data || res.data);
    } catch (err) {
      console.error("Error fetching stats:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  if (loading) return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <div style={{ color: 'var(--text-secondary)', marginTop: '1rem' }}>Loading Dashboard...</div>
    </div>
  );

  if (!stats) return (
    <div className="error-container">
      <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
      <div style={{ color: 'var(--text-primary)', fontSize: '1.25rem' }}>Error loading data</div>
      <button onClick={fetchStats} className="btn btn-primary" style={{ marginTop: '1rem' }}>Retry</button>
    </div>
  );

  const { counts, charts, recentActivity } = stats;

  const filteredActivity = (recentActivity || []).filter(log => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (log.action || '').toLowerCase().includes(q) || (log.performedBy?.fullName || '').toLowerCase().includes(q);
  });

  // Calculate cumulative savings with fallback sample data
  let runningTotal = 0;
  const rawSavings = charts?.savings || [];

  // Generate sample data if no real data exists
  const sampleSavings = rawSavings.length === 0 ? [
    { _id: '2024-07', total: 5000 },
    { _id: '2024-08', total: 8000 },
    { _id: '2024-09', total: 12000 },
    { _id: '2024-10', total: 18000 },
    { _id: '2024-11', total: 25000 },
    { _id: '2024-12', total: 35000 }
  ] : rawSavings;

  const cumulativeSavings = sampleSavings.map(d => {
    runningTotal += d.total;
    return { _id: d._id, total: runningTotal };
  });

  const savingsData = {
    labels: cumulativeSavings.map(d => d._id),
    datasets: [{
      label: 'Cumulative Savings ($)',
      data: cumulativeSavings.map(d => d.total),
      borderColor: '#10b981',
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
      tension: 0.4,
      fill: true,
      borderWidth: 4,
      pointBackgroundColor: '#10b981',
      pointBorderColor: '#ffffff',
      pointBorderWidth: 2,
      pointRadius: 0,
      pointHoverRadius: 6,
    }]
  };

  const loanData = {
    labels: (charts?.loans || []).map(d => d._id),
    datasets: [{
      label: 'Loan Status',
      data: (charts?.loans || []).map(d => d.count),
      backgroundColor: [
        'rgba(59, 130, 246, 0.8)',
        'rgba(244, 63, 94, 0.8)',
        'rgba(245, 158, 11, 0.8)',
        'rgba(16, 185, 129, 0.8)',
      ],
      borderColor: 'rgba(255, 255, 255, 0.1)',
      borderWidth: 2,
      hoverOffset: 20
    }]
  };

  const chartOptions = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(13, 20, 32, 0.9)',
        titleColor: '#ffffff',
        bodyColor: '#94a3b8',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 12,
        displayColors: false
      }
    },
    scales: {
      y: {
        grid: { color: 'rgba(255, 255, 255, 0.05)', drawBorder: false },
        ticks: { color: '#64748b', font: { size: 11 } }
      },
      x: {
        grid: { display: false },
        ticks: { color: '#64748b', font: { size: 11 } }
      }
    }
  };

  return (
    <div className="fade-in" style={{ paddingBottom: '2rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <div>
          <h2 className="page-title" style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-0.03em', background: 'linear-gradient(to right, #fff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            System Analytics
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginTop: '0.5rem' }}>
            Real-time overview of your financial ecosystem.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <div className="search-container" style={{ width: 300, background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: '16px' }}>
            <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              placeholder="Filter activity..."
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <button
            onClick={fetchStats}
            className="btn"
            style={{
              background: 'var(--gradient-premium)',
              color: 'white',
              padding: '0.875rem 1.5rem',
              borderRadius: '16px',
              boxShadow: '0 8px 20px var(--primary-glow)',
              border: 'none'
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={refreshing ? 'rotating' : ''}>
              <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" />
            </svg>
            <span style={{ fontWeight: 700 }}>{refreshing ? 'Syncing' : 'Refresh'}</span>
          </button>
        </div>
      </header>

      {/* Bento Grid Layout */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gridTemplateRows: 'auto auto',
        gap: '1.5rem',
        marginBottom: '2.5rem'
      }}>
        {/* Stat Cards */}
        <div className="sidebar-footer" style={{ gridColumn: 'span 1', background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.1)', padding: '2rem', borderRadius: '24px' }}>
          <div style={{ color: 'var(--primary)', marginBottom: '1rem' }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Members</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--text-primary)' }}>{counts.members}</div>
        </div>

        <div className="sidebar-footer" style={{ gridColumn: 'span 1', background: 'rgba(59, 130, 246, 0.05)', border: '1px solid rgba(59, 130, 246, 0.1)', padding: '2rem', borderRadius: '24px' }}>
          <div style={{ color: 'var(--secondary)', marginBottom: '1rem' }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Staff</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--text-primary)' }}>{counts.staff}</div>
        </div>

        <div className="sidebar-footer" style={{ gridColumn: 'span 1', background: 'rgba(139, 92, 246, 0.05)', border: '1px solid rgba(139, 92, 246, 0.1)', padding: '2rem', borderRadius: '24px' }}>
          <div style={{ color: 'var(--accent)', marginBottom: '1rem' }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Savings</div>
          <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--text-primary)' }}>${counts.savings.toLocaleString()}</div>
        </div>

        <div className="sidebar-footer" style={{ gridColumn: 'span 1', background: 'rgba(244, 63, 94, 0.05)', border: '1px solid rgba(244, 63, 94, 0.1)', padding: '2rem', borderRadius: '24px' }}>
          <div style={{ color: 'var(--danger)', marginBottom: '1rem' }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><line x1="1" y1="10" x2="23" y2="10" />
            </svg>
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Loans</div>
          <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--text-primary)' }}>${counts.loans.toLocaleString()}</div>
        </div>

        {/* Large Charts */}
        <div className="sidebar-footer" style={{ gridColumn: 'span 3', padding: '2.5rem', borderRadius: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h4 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800 }}>Growth Trajectory</h4>
            <div style={{ fontSize: '0.75rem', color: rawSavings.length === 0 ? 'var(--text-muted)' : 'var(--primary)', background: rawSavings.length === 0 ? 'rgba(255, 255, 255, 0.05)' : 'rgba(16, 185, 129, 0.1)', padding: '6px 12px', borderRadius: '12px', fontWeight: 700 }}>
              {rawSavings.length === 0 ? 'Sample Data' : '+12.5% this month'}
            </div>
          </div>
          <div style={{ height: '300px' }}>
            <Line data={savingsData} options={chartOptions} />
          </div>
        </div>

        <div className="sidebar-footer" style={{ gridColumn: 'span 1', padding: '2.5rem', borderRadius: '32px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <h4 style={{ margin: '0 0 2rem 0', fontSize: '1.25rem', fontWeight: 800, width: '100%' }}>Distribution</h4>
          <div style={{ height: '220px', width: '100%' }}>
            <Doughnut data={loanData} options={{ ...chartOptions, cutout: '75%' }} />
          </div>
          <div style={{ marginTop: '2rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', width: '100%' }}>
            {['Active', 'Pending', 'Paid', 'Default'].map((label, i) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '2px', background: loanData.datasets[0].backgroundColor[i] }} />
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Activity Section */}
      <div className="sidebar-footer" style={{ padding: '2.5rem', borderRadius: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
          <h4 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800 }}>Audit Trail</h4>
          <Link to="/reports" state={{ reportType: 'audit' }} className="btn btn-primary hover-glow" style={{
            padding: '0.6rem 1.25rem',
            borderRadius: '12px',
            fontSize: '0.9rem',
            fontWeight: 800,
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            View Full History
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filteredActivity.map((log, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '1.25rem',
                background: 'rgba(255, 255, 255, 0.02)',
                borderRadius: '20px',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                transition: 'var(--transition-smooth)',
                animation: `slideInRight 0.5s ease forwards ${idx * 0.05}s`,
                opacity: 0
              }}
            >
              <div style={{
                width: '52px',
                height: '52px',
                borderRadius: '16px',
                background: 'var(--bg-dark)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '1.5rem',
                border: '1px solid var(--border)'
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: '700', color: 'var(--text-primary)', fontSize: '1.05rem' }}>{log.action}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  By <span style={{ color: 'var(--secondary)', fontWeight: 600 }}>{log.performedBy?.fullName || 'System'}</span>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: '700', color: 'var(--text-primary)' }}>{new Date(log.timestamp).toLocaleDateString()}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

