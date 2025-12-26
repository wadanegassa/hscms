import React, { useState, useEffect } from 'react';
import api from '../../services/api';

export default function Notifications() {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            const res = await api.get('/member/notifications');
            setNotifications(res.data || []);
        } catch (err) {
            console.error('Error fetching notifications:', err);
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (id) => {
        try {
            await api.patch(`/member/notifications/${id}/read`);
            setNotifications(notifications.map(n => n._id === id ? { ...n, isRead: true } : n));
        } catch (err) {
            console.error('Error marking notification as read:', err);
        }
    };

    if (loading) {
        return (
            <div className="loading-container" style={{ padding: '6rem' }}>
                <div className="loading-spinner"></div>
                <p style={{ color: 'var(--text-secondary)', marginTop: '1rem' }}>Loading notifications...</p>
            </div>
        );
    }

    return (
        <div className="fade-in">
            <div className="mb-8">
                <h2 className="page-title">Notifications</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Stay updated with your account activity.</p>
            </div>

            <div className="glass-card" style={{ padding: '1.5rem' }}>
                {notifications.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔔</div>
                        <p>You have no notifications at this time.</p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gap: '1rem' }}>
                        {notifications.map((n) => (
                            <div
                                key={n._id}
                                style={{
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    gap: '1rem',
                                    padding: '1.25rem',
                                    background: n.isRead ? 'transparent' : 'rgba(59, 130, 246, 0.05)',
                                    borderRadius: '16px',
                                    border: `1px solid ${n.isRead ? 'var(--border)' : 'rgba(59, 130, 246, 0.2)'}`,
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                <div style={{
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '10px',
                                    background: n.isRead ? 'var(--bg-hover)' : 'var(--primary-glow)',
                                    color: n.isRead ? 'var(--text-muted)' : 'var(--primary)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0
                                }}>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                                        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                                    </svg>
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.25rem' }}>
                                        <p style={{ margin: 0, fontWeight: n.isRead ? 500 : 700, color: 'var(--text-primary)', fontSize: '0.9375rem' }}>
                                            {n.message}
                                        </p>
                                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', marginLeft: '1rem' }}>
                                            {new Date(n.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    {!n.isRead && (
                                        <button
                                            onClick={() => markAsRead(n._id)}
                                            style={{
                                                background: 'none',
                                                border: 'none',
                                                color: 'var(--primary)',
                                                fontSize: '0.75rem',
                                                fontWeight: 700,
                                                cursor: 'pointer',
                                                padding: 0,
                                                marginTop: '0.5rem'
                                            }}
                                        >
                                            Mark as read
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
