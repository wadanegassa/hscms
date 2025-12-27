import React, { useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function TopNav() {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className="top-nav">
            <div className="top-nav-left">
                <div className="top-nav-brand">
                    <span className="brand-h">H</span>
                    <span className="brand-scms">SCMS</span>
                </div>
                <div className="top-nav-separator"></div>
                <div className="top-nav-full-name">
                    Harari Saving & Credit Management System
                </div>
            </div>

            <div className="top-nav-right">
                <Link to={`/${user?.role}/profile`} className="top-nav-user">
                    <div className="user-info">
                        <span className="user-name">{user?.fullName || 'User'}</span>
                        <span className="user-role">{user?.role}</span>
                    </div>
                    <div className="user-avatar-small">
                        {user?.fullName?.charAt(0) || 'U'}
                    </div>
                </Link>

                <div className="top-nav-actions">
                    <button onClick={handleLogout} className="top-nav-logout" title="Logout">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M15 3H19A2 2 0 0 1 21 5V19A2 2 0 0 1 19 21H15" />
                            <polyline points="10 17 15 12 10 7" />
                            <line x1="15" y1="12" x2="3" y2="12" />
                        </svg>
                        <span>Logout</span>
                    </button>
                </div>
            </div>
        </header>
    );
}
