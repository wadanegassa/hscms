import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-toastify';

const Users = () => {
  const [searchParams] = useSearchParams();
  const [filter, setFilter] = useState('All Roles');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const query = searchParams.get('search');
    if (query) {
      setSearchQuery(query);
    }
  }, [searchParams]);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/admin/users');
      setUsers(res.data?.data || res.data || []);
    } catch (err) {
      console.error(err);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'suspended' : 'active';
    try {
      await api.patch(`/admin/users/${id}/status`, { status: newStatus });
      setUsers(u => Array.isArray(u) ? u.map(x => x._id === id ? { ...x, status: newStatus } : x) : []);
    } catch (err) {
      console.error(err);
      toast.error('Failed to update status');
    }
  }

  const list = Array.isArray(users) ? users.filter(u => {
    const matchesRole = filter === 'All Roles' || u.role === filter.toLowerCase();
    const matchesSearch = (u.fullName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.email || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRole && matchesSearch;
  }) : [];

  return (
    <div className="fade-in" style={{ paddingBottom: '2rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <div>
          <h2 className="page-title" style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-0.03em', background: 'linear-gradient(to right, #fff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            User Registry
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginTop: '0.5rem' }}>
            Global access control and status management for all system entities.
          </p>
        </div>
        <button className="btn hover-lift" onClick={fetchUsers} style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          padding: '0.75rem 1.5rem',
          borderRadius: '14px',
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid var(--border)',
          color: 'var(--text-primary)',
          fontWeight: 800
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" /></svg>
          Refresh Data
        </button>
      </header>

      <div className="glass-card-static" style={{ flex: 'none', margin: '0 0 2.5rem 0', padding: '1.5rem 2rem', display: 'flex', gap: '1.5rem', border: '1px solid var(--border)' }}>
        <div className="search-container" style={{ flex: 1, background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: '14px' }}>
          <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2.5">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
          <input
            className="search-input"
            placeholder="Search by name or email..."
            style={{ color: 'var(--text-primary)', fontWeight: 600 }}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
        <div style={{ position: 'relative', width: '200px' }}>
          <select
            className="input"
            value={filter}
            onChange={e => setFilter(e.target.value)}
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid var(--primary)',
              padding: '0.875rem 1.25rem',
              borderRadius: '14px',
              fontWeight: 700,
              color: 'var(--text-primary)',
              width: '100%',
              appearance: 'none',
              WebkitAppearance: 'none',
              MozAppearance: 'none'
            }}
          >
            <option>All Roles</option>
            <option>Admin</option>
            <option>Staff</option>
            <option>Member</option>
          </select>
          <div style={{ position: 'absolute', right: '1.25rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--text-muted)' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="m6 9 6 6 6-6" /></svg>
          </div>
        </div>
      </div>

      <div className="table-container" style={{ padding: 0, overflow: 'hidden', borderRadius: '24px', border: '1px solid var(--border)' }}>
        {loading ? (
          <div className="loading-container" style={{ padding: '6rem' }}>
            <div className="loading-spinner"></div>
            <div style={{ color: 'var(--text-muted)', marginTop: '1.5rem' }}>Syncing user database...</div>
          </div>
        ) : (
          <div className="table-container" style={{ margin: 0, borderRadius: 0, border: 'none', background: 'transparent' }}>
            <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.02)' }}>
                  <th style={{ padding: '1.5rem', textAlign: 'left', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Entity</th>
                  <th style={{ padding: '1.5rem', textAlign: 'left', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Role</th>
                  <th style={{ padding: '1.5rem', textAlign: 'left', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Email Address</th>
                  <th style={{ padding: '1.5rem', textAlign: 'left', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Status</th>
                  <th style={{ padding: '1.5rem', textAlign: 'right', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {list.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '6rem', color: 'var(--text-muted)' }}>
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" style={{ marginBottom: '1rem', opacity: 0.5 }}>
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
                      <div style={{ fontSize: '1.1rem', fontWeight: 600 }}>No entities found.</div>
                    </td>
                  </tr>
                ) : (
                  list.map((u, idx) => (
                    <tr key={u._id} className="hover-lift" style={{
                      borderBottom: '1px solid var(--border)',
                      animation: `slideInRight 0.5s ease forwards ${idx * 0.05}s`,
                      opacity: 0
                    }}>
                      <td style={{ padding: '1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                          <div style={{
                            width: '44px',
                            height: '44px',
                            borderRadius: '12px',
                            background: u.role === 'admin' ? 'rgba(168, 85, 247, 0.1)' : u.role === 'staff' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(0, 255, 157, 0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1.25rem',
                            color: u.role === 'admin' ? 'var(--secondary)' : u.role === 'staff' ? '#3b82f6' : 'var(--primary)',
                            fontWeight: 900,
                            border: '1px solid rgba(255,255,255,0.05)'
                          }}>
                            {(u.fullName || 'U').charAt(0)}
                          </div>
                          <div style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: '1rem' }}>{u.fullName}</div>
                        </div>
                      </td>
                      <td style={{ padding: '1.5rem' }}>
                        <span style={{
                          fontSize: '0.75rem',
                          fontWeight: 900,
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                          color: u.role === 'admin' ? 'var(--secondary)' : u.role === 'staff' ? '#3b82f6' : 'var(--primary)'
                        }}>
                          {u.role}
                        </span>
                      </td>
                      <td style={{ padding: '1.5rem', color: 'var(--text-secondary)', fontWeight: 700 }}>{u.email}</td>
                      <td style={{ padding: '1.5rem' }}>
                        <span style={{
                          padding: '6px 12px',
                          borderRadius: '8px',
                          fontSize: '0.7rem',
                          fontWeight: 900,
                          textTransform: 'uppercase',
                          background: u.status === 'active' ? 'rgba(0, 255, 157, 0.08)' : 'rgba(244, 63, 94, 0.08)',
                          color: u.status === 'active' ? 'var(--primary)' : 'var(--danger)',
                          border: `1px solid ${u.status === 'active' ? 'rgba(0, 255, 157, 0.15)' : 'rgba(244, 63, 94, 0.15)'}`,
                          letterSpacing: '0.05em'
                        }}>
                          {u.status}
                        </span>
                      </td>
                      <td style={{ padding: '1.5rem', textAlign: 'right' }}>
                        {u.role !== 'admin' && (
                          <button
                            className="btn hover-lift"
                            onClick={() => toggleStatus(u._id, u.status)}
                            style={{
                              padding: '0.6rem 1.25rem',
                              borderRadius: '10px',
                              fontSize: '0.8rem',
                              fontWeight: 800,
                              background: u.status === 'active' ? 'rgba(244, 63, 94, 0.05)' : 'rgba(0, 255, 157, 0.05)',
                              border: `1px solid ${u.status === 'active' ? 'rgba(244, 63, 94, 0.1)' : 'rgba(0, 255, 157, 0.1)'}`,
                              color: u.status === 'active' ? 'var(--danger)' : 'var(--primary)'
                            }}
                          >
                            {u.status === 'active' ? 'Suspend Access' : 'Restore Access'}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
export default Users;
