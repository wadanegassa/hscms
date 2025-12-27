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
    const act = action.toLowerCase();
    if (act.includes('approved')) return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="3"><path d="M20 6L9 17l-5-5" /></svg>
    );
    if (act.includes('rejected')) return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--danger)" strokeWidth="3"><path d="M18 6L6 18M6 6l12 12" /></svg>
    );
    if (act.includes('created')) return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--secondary)" strokeWidth="3"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
    );
    if (act.includes('updated')) return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--warning)" strokeWidth="3"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
    );
    if (act.includes('deleted')) return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--danger)" strokeWidth="3"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" /></svg>
    );
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="3"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>
    );
  };

  return (
    <div className="fade-in" style={{ paddingBottom: '2rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <div>
          <h2 className="page-title" style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-0.03em', background: 'linear-gradient(to right, #fff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Audit Logs
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginTop: '0.5rem' }}>
            Traceable history of all administrative and system events.
          </p>
        </div>

        <div className="glass-card" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          padding: '0.75rem 1.5rem',
          borderRadius: '16px',
          border: '1px solid var(--border)'
        }}>
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--primary)', boxShadow: '0 0 15px var(--primary)' }}></div>
          <div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Total Events</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--text-primary)' }}>
              {logs.length}
            </div>
          </div>
        </div>
      </header>

      <div className="user-profile" style={{ flex: 'none', margin: 0, padding: '2.5rem', display: 'block' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '4px', height: '24px', background: 'var(--primary)', borderRadius: '2px', boxShadow: '0 0 10px var(--primary)' }}></div>
            <h4 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '1.25rem', fontWeight: 900 }}>
              Activity Timeline
            </h4>
          </div>
          <button
            onClick={fetchLogs}
            className="btn btn-primary hover-glow"
            style={{
              padding: '0.75rem 1.25rem',
              borderRadius: '12px',
            }}
            disabled={loading}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={loading ? 'rotate-icon' : ''}>
              <path d="M23 4v6h-6M1 20v-6h6" /><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" /></svg>
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="loading-container" style={{ padding: '8rem' }}>
            <div className="loading-spinner"></div>
            <div style={{ color: 'var(--text-muted)', marginTop: '1.5rem' }}>Fetching system logs...</div>
          </div>
        ) : logs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '6rem 2rem' }}>
            <div style={{
              width: '100px',
              height: '100px',
              background: 'rgba(255,255,255,0.02)',
              borderRadius: '30px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 2rem',
              border: '1px solid var(--border)'
            }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /><path d="M7 7h10" /><path d="M7 11h10" /><path d="M7 15h10" /></svg>
            </div>
            <h3 style={{ fontSize: '2rem', color: 'var(--text-primary)', fontWeight: 900, margin: '0 0 1rem 0' }}>Clean Slate</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>No system activities recorded yet.</p>
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
                  padding: '1.5rem 2rem',
                  background: 'rgba(255,255,255,0.01)',
                  borderRadius: '20px',
                  border: '1px solid var(--border)',
                  animation: `slideUp 0.4s ease forwards ${idx * 0.05}s`,
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
                  marginRight: '2rem',
                  flexShrink: 0,
                  border: '1px solid var(--border)',
                  boxShadow: '0 8px 16px rgba(0,0,0,0.2)'
                }}>
                  {getActionIcon(log.action)}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontWeight: 800,
                    color: 'var(--text-primary)',
                    marginBottom: '0.5rem',
                    fontSize: '1.1rem'
                  }}>
                    {log.action}
                  </div>
                  <div style={{
                    fontSize: '0.85rem',
                    color: 'var(--text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1.5rem',
                    flexWrap: 'wrap'
                  }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                      {log.performedBy?.fullName || 'System'}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2.5"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                      {new Date(log.timestamp).toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                    {log.targetEntity && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} title={log.targetEntity}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2.5"><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="3" /></svg>
                        {log.targetEntity.split(':')[0]}
                      </span>
                    )}
                  </div>
                </div>
                <div style={{
                  padding: '0.6rem 1rem',
                  background: 'rgba(255,255,255,0.03)',
                  borderRadius: '10px',
                  fontSize: '0.75rem',
                  color: 'var(--text-muted)',
                  fontWeight: 800,
                  fontFamily: '"JetBrains Mono", monospace',
                  border: '1px solid var(--border)'
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
};

export default AuditLogs;
