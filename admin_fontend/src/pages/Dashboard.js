import React, { useEffect, useState } from 'react';
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

  const savingsData = {
    labels: (charts?.savings || []).map(d => d._id),
    datasets: [{
      label: 'Savings Growth ($)',
      data: (charts?.savings || []).map(d => d.total),
      borderColor: '#10b981',
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
      tension: 0.4,
      fill: true,
      borderWidth: 3,
      pointBackgroundColor: '#10b981',
      pointBorderColor: '#ffffff',
      pointBorderWidth: 2,
      pointRadius: 5,
      pointHoverRadius: 7,
    }]
  };

  const loanData = {
    labels: (charts?.loans || []).map(d => d._id),
    datasets: [{
      label: 'Loan Status',
      data: (charts?.loans || []).map(d => d.count),
      backgroundColor: [
        'rgba(99, 102, 241, 0.8)',
        'rgba(244, 63, 94, 0.8)',
        'rgba(245, 158, 11, 0.8)',
        'rgba(16, 185, 129, 0.8)',
      ],
      borderColor: [
        '#6366f1',
        '#f43f5e',
        '#f59e0b',
        '#10b981',
      ],
      borderWidth: 2,
    }]
  };

  const chartOptions = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: '#b8c1ec',
          font: {
            size: 12,
            family: 'Inter'
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(17, 25, 54, 0.95)',
        titleColor: '#ffffff',
        bodyColor: '#b8c1ec',
        borderColor: 'rgba(99, 102, 241, 0.3)',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
      }
    },
    scales: {
      y: {
        grid: {
          color: 'rgba(99, 102, 241, 0.1)',
        },
        ticks: {
          color: '#b8c1ec'
        }
      },
      x: {
        grid: {
          color: 'rgba(99, 102, 241, 0.1)',
        },
        ticks: {
          color: '#b8c1ec'
        }
      }
    }
  };

  return (
    <div className="fade-in" style={{ paddingBottom: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem' }}>
        <div>
          <h2 className="page-title" style={{ marginBottom: '0.5rem', fontSize: '2rem' }}>📊 Dashboard Overview</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', margin: 0 }}>
            Welcome back! Here's what's happening with the system today.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div className="search-container" style={{ maxWidth: 320, background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              placeholder="Search recent activity..."
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ color: 'var(--text-primary)' }}
            />
          </div>

          <button
            onClick={fetchStats}
            className={`btn btn-primary ${refreshing ? 'loading' : ''}`}
            disabled={refreshing}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.25rem',
              borderRadius: '12px',
              fontWeight: '600'
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={refreshing ? 'rotating' : ''}>
              <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" />
            </svg>
            {refreshing ? 'Syncing...' : 'Refresh'}
          </button>
        </div>
      </div>

      <div className="card-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <div className="glass-card hover-lift" style={{ padding: '1.5rem', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '-10px', right: '-10px', fontSize: '4rem', opacity: 0.1 }}>👥</div>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Members</div>
          <div style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--text-primary)', margin: '0.5rem 0' }}>{counts.members}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="18 15 12 9 6 15" /></svg>
            Active community
          </div>
        </div>

        <div className="glass-card hover-lift" style={{ padding: '1.5rem', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '-10px', right: '-10px', fontSize: '4rem', opacity: 0.1 }}>🛡️</div>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Staff</div>
          <div style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--text-primary)', margin: '0.5rem 0' }}>{counts.staff}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><circle cx="12" cy="12" r="10" /></svg>
            System operators
          </div>
        </div>

        <div className="glass-card hover-lift" style={{ padding: '1.5rem', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '-10px', right: '-10px', fontSize: '4rem', opacity: 0.1 }}>💰</div>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Savings</div>
          <div style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--text-primary)', margin: '0.5rem 0' }}>${counts.savings.toLocaleString()}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="18 15 12 9 6 15" /></svg>
            Capital growth
          </div>
        </div>

        <div className="glass-card hover-lift" style={{ padding: '1.5rem', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '-10px', right: '-10px', fontSize: '4rem', opacity: 0.1 }}>💸</div>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Loans</div>
          <div style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--text-primary)', margin: '0.5rem 0' }}>${counts.loans.toLocaleString()}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="18 9 12 15 6 9" /></svg>
            Active credit
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <div className="glass-card" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h4 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '1.25rem', fontWeight: 700 }}>
              💹 Savings Growth Trend
            </h4>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.05)', padding: '4px 12px', borderRadius: '20px' }}>
              Last 6 Months
            </div>
          </div>
          <div style={{ height: '350px' }}>
            <Line data={savingsData} options={{
              ...chartOptions,
              scales: {
                ...chartOptions.scales,
                y: { ...chartOptions.scales.y, grid: { color: 'rgba(255,255,255,0.03)' } },
                x: { ...chartOptions.scales.x, grid: { display: false } }
              }
            }} />
          </div>
        </div>

        <div className="glass-card" style={{ padding: '2rem' }}>
          <h4 style={{ margin: '0 0 2rem 0', color: 'var(--text-primary)', fontSize: '1.25rem', fontWeight: 700 }}>
            📊 Loan Distribution
          </h4>
          <div style={{ height: '350px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Doughnut data={loanData} options={{
              ...chartOptions,
              cutout: '70%',
              plugins: {
                ...chartOptions.plugins,
                legend: {
                  position: 'bottom',
                  labels: { padding: 20, usePointStyle: true, color: '#94a3b8' }
                }
              }
            }} />
          </div>
        </div>
      </div>

      <div className="glass-card" style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h4 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '1.25rem', fontWeight: 700 }}>
            🕐 System Audit Trail
          </h4>
          <button className="btn btn-secondary" style={{ fontSize: '0.75rem', padding: '6px 16px' }}>View All Logs</button>
        </div>

        {filteredActivity.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.02)', borderRadius: '16px' }}>
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🔍</div>
            {searchQuery ? 'No activity matches your search.' : 'No recent activity recorded.'}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {filteredActivity.map((log, idx) => (
              <div
                key={idx}
                className="activity-item scale-up"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '1.25rem',
                  background: 'rgba(255, 255, 255, 0.02)',
                  borderRadius: '1rem',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  transition: 'all 0.3s ease',
                  animation: `slideInRight 0.4s ease forwards ${idx * 0.05}s`,
                  opacity: 0
                }}
              >
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: log.action.toLowerCase().includes('create') ? 'rgba(16, 185, 129, 0.1)' :
                    log.action.toLowerCase().includes('delete') ? 'rgba(244, 63, 94, 0.1)' :
                      'rgba(99, 102, 241, 0.1)',
                  color: log.action.toLowerCase().includes('create') ? '#10b981' :
                    log.action.toLowerCase().includes('delete') ? '#f43f5e' :
                      '#6366f1',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.25rem',
                  marginRight: '1.25rem'
                }}>
                  {log.action.toLowerCase().includes('user') ? '👤' :
                    log.action.toLowerCase().includes('loan') ? '💸' :
                      log.action.toLowerCase().includes('saving') ? '💰' : '📝'}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '600', color: 'var(--text-primary)', marginBottom: '0.25rem', fontSize: '1rem' }}>
                    {log.action}
                  </div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                    Performed by <span style={{ color: 'var(--primary)', fontWeight: '500' }}>{log.performedBy?.fullName || 'System'}</span>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-primary)', fontWeight: '500' }}>
                    {new Date(log.timestamp).toLocaleDateString()}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
export default Dashboard;

