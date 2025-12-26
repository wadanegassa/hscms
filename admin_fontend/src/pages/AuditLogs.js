import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/audit-logs');
      // Handle wrapped response
      const logsData = res.data?.data || res.data || [];
      setLogs(Array.isArray(logsData) ? logsData : []);
    } catch (err) {
      console.error(err);
      toast.error('Failed to fetch audit logs');
    } finally {
      setLoading(false);
    }
  };

  const getActionIcon = (action) => {
    if (action.toLowerCase().includes('approved')) return '✅';
    if (action.toLowerCase().includes('rejected')) return '❌';
    if (action.toLowerCase().includes('created')) return '➕';
    if (action.toLowerCase().includes('updated')) return '📝';
    if (action.toLowerCase().includes('deleted')) return '🗑️';
    return '📋';
  };

  return (
    <div className="fade-in" style={{ paddingBottom: '2rem' }}>
      <div className="flex-between mb-8" style={{ alignItems: 'flex-end' }}>
        <div>
          <h2 className="page-title" style={{ marginBottom: '0.5rem', fontSize: '2rem' }}>📜 Audit Logs</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', margin: 0 }}>
            Comprehensive record of all system activities and administrative actions.
          </p>
        </div>
        <div className="glass-card" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          padding: '0.75rem 1.5rem',
          borderRadius: '12px'
        }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--primary)', boxShadow: '0 0 10px var(--primary)' }}></div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>Total Activities</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {logs.length}
            </div>
          </div>
        </div>
      </div>

      <div className="glass-card" style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '4px', height: '24px', background: 'var(--primary)', borderRadius: '2px' }}></div>
            <h4 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '1.25rem', fontWeight: 800 }}>
              System Activity Timeline
            </h4>
          </div>
          <button
            onClick={fetchLogs}
            className="btn btn-secondary hover-glow"
            style={{
              padding: '0.6rem 1.25rem',
              fontSize: '0.875rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              borderRadius: '10px',
              background: 'rgba(255,255,255,0.05)'
            }}
            disabled={loading}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={loading ? 'rotate-icon' : ''}>
              <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" />
            </svg>
            Refresh Logs
          </button>
        </div>

        {loading ? (
          <div className="loading-container" style={{ padding: '6rem' }}>
            <div className="loading-spinner"></div>
            <div style={{ color: 'var(--text-secondary)', marginTop: '1rem' }}>Retrieving activity logs...</div>
          </div>
        ) : logs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '6rem 2rem' }}>
            <div style={{
              width: '80px',
              height: '80px',
              background: 'rgba(255,255,255,0.02)',
              borderRadius: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem',
              border: '1px solid var(--border)'
            }}>
              <span style={{ fontSize: '2.5rem' }}>📭</span>
            </div>
            <h3 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', fontWeight: '800', margin: '0 0 0.5rem 0' }}>No Logs Found</h3>
            <p style={{ color: 'var(--text-muted)', margin: 0 }}>System activities and administrative actions will appear here.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {logs.map((log, idx) => (
              <div
                key={log._id || idx}
                className="hover-lift"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '1.25rem 1.5rem',
                  background: 'rgba(255,255,255,0.02)',
                  borderRadius: '16px',
                  border: '1px solid var(--border)',
                  animation: `slideInRight 0.4s ease forwards ${idx * 0.05}s`,
                  opacity: 0
                }}
              >
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '14px',
                  background: 'var(--gradient-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '1.5rem',
                  flexShrink: 0,
                  fontSize: '1.5rem',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                }}>
                  {getActionIcon(log.action)}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontWeight: '700',
                    color: 'var(--text-primary)',
                    marginBottom: '0.4rem',
                    fontSize: '1rem'
                  }}>
                    {log.action}
                  </div>
                  <div style={{
                    fontSize: '0.8125rem',
                    color: 'var(--text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    flexWrap: 'wrap'
                  }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <span style={{ color: 'var(--primary)', opacity: 0.8 }}>👤</span> {log.performedBy?.fullName || 'System'}
                    </span>
                    <span style={{ opacity: 0.3 }}>|</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <span style={{ color: 'var(--primary)', opacity: 0.8 }}>🕐</span> {new Date(log.timestamp).toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                    {log.targetEntity && (
                      <>
                        <span style={{ opacity: 0.3 }}>|</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }} title={log.targetEntity}>
                          <span style={{ color: 'var(--primary)', opacity: 0.8 }}>🎯</span> {log.targetEntity.split(':')[0]}
                        </span>
                      </>
                    )}
                  </div>
                </div>
                <div style={{
                  padding: '0.5rem 1rem',
                  background: 'rgba(255,255,255,0.03)',
                  borderRadius: '8px',
                  fontSize: '0.75rem',
                  color: 'var(--text-muted)',
                  fontWeight: '600',
                  fontFamily: 'monospace'
                }}>
                  #{log._id?.slice(-6).toUpperCase() || 'SYSTEM'}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
export default AuditLogs;
