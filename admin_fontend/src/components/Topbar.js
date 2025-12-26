import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import auth from '../services/auth';
import api from '../services/api';

const Topbar = () => {
  const profile = auth.getProfile();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState(0);

  useEffect(() => {
    fetchNotifications();
    // Auto-refresh notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/admin/loans/pending');
      // Handle both wrapped and unwrapped responses
      const loansData = res.data?.data || res.data || [];
      const loansArray = Array.isArray(loansData) ? loansData : [];
      setNotifications(loansArray.length);
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    }
  };

  return (
    <div className="topbar-modern">
      <div className="topbar-left">
        <div className="search-container">
          <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Search anything..."
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="topbar-right">
        <div className="topbar-stats">
          <div className="stat-item">
            <span className="stat-icon">🌍</span>
            <span className="stat-text">Online</span>
          </div>
        </div>

        <button
          className="icon-button notification-button"
          onClick={() => navigate('/loans')}
          title={`${notifications} pending loan${notifications !== 1 ? 's' : ''}`}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          {notifications > 0 && (
            <span className="notification-badge">{notifications}</span>
          )}
        </button>

        <div className="user-profile">
          <div className="user-avatar">
            <div className="avatar-gradient">
              <span className="avatar-text">{profile?.email?.charAt(0).toUpperCase() || 'A'}</span>
            </div>
          </div>
          <div className="user-details">
            <div className="user-name">{profile?.fullName || 'Administrator'}</div>
            <div className="user-role">Admin</div>
          </div>
        </div>

        <button
          className="btn-logout"
          onClick={() => { auth.logout(); window.location.href = '/login'; }}
          title="Logout"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default Topbar;
