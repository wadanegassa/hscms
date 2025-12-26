import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import auth from '../services/auth';

const Sidebar = () => {
  const navigate = useNavigate();
  const navItems = [
    { path: '/', label: 'Dashboard', icon: '📊' },
    { path: '/staff', label: 'Manage Staff', icon: '🛡️' },
    { path: '/members', label: 'Manage Members', icon: '👥' },
    { path: '/loans', label: 'Loan Approvals', icon: '💸' },
    { path: '/reports', label: 'Reports', icon: '📑' },
    { path: '/audit-logs', label: 'Audit Logs', icon: '📜' },
  ];

  const handleLogout = () => {
    auth.logout();
    navigate('/login');
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header" style={{ marginBottom: '2rem' }}>
        <div className="brand-icon" style={{ fontSize: '1.5rem' }}>🏦</div>
        <div className="brand-text">
          <h1 style={{ fontSize: '1.1rem', fontWeight: 800, letterSpacing: '-0.02em' }}>Harari Admin</h1>
          <p style={{ fontSize: '0.7rem', opacity: 0.6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Management System</p>
        </div>
      </div>

      <nav className="nav" style={{ flex: 1 }}>
        <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem', paddingLeft: '1rem' }}>
          System Menu
        </div>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <span style={{ fontSize: '1.2rem' }}>{item.icon}</span>
            <span style={{ fontWeight: 600 }}>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer" style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
        <div className="user-info" style={{ marginBottom: '1rem', background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 800 }}>A</div>
            <div>
              <p style={{ fontSize: '0.8rem', fontWeight: 700, margin: 0 }}>Administrator</p>
              <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', margin: 0 }}>System Root</p>
            </div>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="nav-link"
          style={{
            width: '100%',
            border: 'none',
            background: 'rgba(244, 63, 94, 0.05)',
            color: 'var(--danger)',
            cursor: 'pointer',
            justifyContent: 'flex-start'
          }}
        >
          <span style={{ fontSize: '1.2rem' }}>🚪</span>
          <span style={{ fontWeight: 600 }}>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
