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
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                <div>
                    <h2 className="page-title" style={{ fontSize: '2.8rem', fontWeight: 900, letterSpacing: '-0.04em', color: 'var(--text-primary)', textTransform: 'uppercase' }}>
                        System <span style={{ color: 'var(--primary)' }}>Notifications</span>
                    </h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginTop: '0.5rem', fontWeight: 600 }}>
                        Stay updated with your account activity and loan status.
                    </p>
                </div>
            </header>

            <div className="glass-card" style={{ padding: '2rem', background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
                {notifications.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '6rem 2rem', color: 'var(--text-muted)' }}>
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
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>
                        </div>
                        <h3 style={{ color: 'var(--text-primary)', fontWeight: 900, fontSize: '1.5rem', margin: 0 }}>No Notifications</h3>
                        <p style={{ marginTop: '0.5rem', fontWeight: 600 }}>You're all caught up! No new messages.</p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gap: '1rem' }}>
                        {notifications.map((n) => (
                            <div
                                key={n._id}
                                style={{
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    gap: '1.5rem',
                                    padding: '1.5rem',
                                    background: n.isRead ? 'rgba(15, 23, 42, 0.01)' : 'rgba(234, 179, 8, 0.05)',
                                    borderRadius: '20px',
                                    border: `1px solid ${n.isRead ? 'var(--border)' : 'rgba(234, 179, 8, 0.15)'}`,
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                                }}
                            >
                                <div style={{
                                    width: '48px',
                                    height: '48px',
                                    borderRadius: '14px',
                                    background: n.isRead ? 'rgba(15, 23, 42, 0.02)' : 'rgba(234, 179, 8, 0.1)',
                                    color: n.isRead ? 'var(--text-muted)' : 'var(--primary)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0,
                                    border: `1px solid ${n.isRead ? 'var(--border)' : 'rgba(234, 179, 8, 0.2)'}`
                                }}>
                                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
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
