import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';

const Staff = () => {
    const [staff, setStaff] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [formData, setFormData] = useState({ fullName: '', email: '', password: '', phone: '', nationalId: '' });
    const [editData, setEditData] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchStaff();
    }, []);

    const fetchStaff = async () => {
        try {
            const res = await api.get('/admin/users');
            const users = res.data?.data || res.data || [];
            setStaff(users.filter(u => u.role === 'staff'));
        } catch (err) {
            console.error(err);
            toast.error('Failed to fetch staff');
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await api.post('/admin/create-staff', formData);
            toast.success('Staff created successfully');
            setShowModal(false);
            setFormData({ fullName: '', email: '', password: '', phone: '', nationalId: '' });
            fetchStaff();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to create staff');
        } finally {
            setSubmitting(false);
        }
    };

    const handleEdit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await api.put(`/admin/users/${editData._id}`, {
                fullName: editData.fullName,
                email: editData.email,
                phone: editData.phone,
                nationalId: editData.nationalId
            });
            toast.success('Staff updated successfully');
            setShowEditModal(false);
            setEditData(null);
            fetchStaff();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to update staff');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async () => {
        setSubmitting(true);
        try {
            await api.delete(`/admin/users/${deleteTarget._id}`);
            toast.success('Staff deleted successfully');
            setShowDeleteModal(false);
            setDeleteTarget(null);
            fetchStaff();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to delete staff');
        } finally {
            setSubmitting(false);
        }
    };

    const filteredStaff = staff.filter(s =>
        s.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.phone?.includes(searchQuery) ||
        s.nationalId?.includes(searchQuery)
    );

    return (
        <div className="fade-in" style={{ paddingBottom: '2rem' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                <div>
                    <h2 className="page-title" style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-0.03em', background: 'linear-gradient(to right, #fff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        Staff Command
                    </h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginTop: '0.5rem' }}>
                        Manage your elite team and system access permissions.
                    </p>
                </div>

                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                    <div className="glass-card" style={{ padding: '0.75rem 1.5rem', borderRadius: '16px', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--primary)', boxShadow: '0 0 15px var(--primary)' }}></div>
                        <div>
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Active Staff</div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--text-primary)' }}>{staff.length}</div>
                        </div>
                    </div>
                    <button
                        onClick={() => setShowModal(true)}
                        className="btn btn-primary hover-glow"
                        style={{
                            padding: '1rem 2rem',
                            borderRadius: '16px',
                        }}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                        Recruit Staff
                    </button>
                </div>
            </header>

            <div className="user-profile" style={{ flex: 'none', margin: '0 0 2.5rem 0', padding: '1.5rem 2rem', display: 'block', border: '1px solid var(--border)' }}>
                <div className="search-container" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: '14px' }}>
                    <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2.5">
                        <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
                    <input
                        type="text"
                        placeholder="Search staff by name, email or phone..."
                        className="search-input"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{ color: 'var(--text-primary)', fontSize: '1rem', fontWeight: 600 }}
                    />
                </div>
            </div>

            <div className="table-container" style={{ padding: 0, overflow: 'hidden', borderRadius: '24px', border: '1px solid var(--border)' }}>
                {loading ? (
                    <div className="loading-container" style={{ padding: '6rem' }}>
                        <div className="loading-spinner"></div>
                        <div style={{ color: 'var(--text-muted)', marginTop: '1.5rem' }}>Syncing staff records...</div>
                    </div>
                ) : (
                    <div className="table-container" style={{ margin: 0, borderRadius: 0, border: 'none', background: 'transparent' }}>
                        <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
                            <thead>
                                <tr style={{ background: 'rgba(255,255,255,0.02)' }}>
                                    <th style={{ padding: '1.5rem', textAlign: 'left', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Staff Profile</th>
                                    <th style={{ padding: '1.5rem', textAlign: 'left', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Contact Details</th>
                                    <th style={{ padding: '1.5rem', textAlign: 'left', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Status</th>
                                    <th style={{ padding: '1.5rem', textAlign: 'left', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Joined Date</th>
                                    <th style={{ padding: '1.5rem', textAlign: 'right', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredStaff.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" style={{ textAlign: 'center', padding: '6rem', color: 'var(--text-muted)' }}>
                                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" style={{ marginBottom: '1rem', opacity: 0.5 }}>
                                                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
                                            <div style={{ fontSize: '1.1rem', fontWeight: 600 }}>No staff members found.</div>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredStaff.map((u, idx) => (
                                        <tr key={u._id} className="hover-lift" style={{
                                            borderBottom: '1px solid var(--border)',
                                            animation: `slideInRight 0.5s ease forwards ${idx * 0.05}s`,
                                            opacity: 0
                                        }}>
                                            <td style={{ padding: '1.5rem' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                                                    <div style={{
                                                        width: '52px',
                                                        height: '52px',
                                                        borderRadius: '16px',
                                                        background: 'var(--bg-dark)',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        fontSize: '1.5rem',
                                                        color: 'var(--secondary)',
                                                        fontWeight: 900,
                                                        border: '1px solid var(--border)'
                                                    }}>
                                                        {(u.fullName || 'S').charAt(0)}
                                                    </div>
                                                    <div>
                                                        <div style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: '1.1rem' }}>{u.fullName}</div>
                                                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '2px' }}>ID: {u._id.slice(-6).toUpperCase()} | National ID: {u.nationalId || 'N/A'}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td style={{ padding: '1.5rem' }}>
                                                <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.9rem' }}>{u.email}</div>
                                                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>{u.phone || 'No phone provided'}</div>
                                            </td>
                                            <td style={{ padding: '1.5rem' }}>
                                                <span style={{
                                                    padding: '6px 14px',
                                                    borderRadius: '10px',
                                                    fontSize: '0.75rem',
                                                    fontWeight: 800,
                                                    textTransform: 'uppercase',
                                                    background: u.status === 'active' ? 'rgba(0, 255, 157, 0.1)' : 'rgba(244, 63, 94, 0.1)',
                                                    color: u.status === 'active' ? 'var(--primary)' : 'var(--danger)',
                                                    border: `1px solid ${u.status === 'active' ? 'rgba(0, 255, 157, 0.2)' : 'rgba(244, 63, 94, 0.2)'}`,
                                                    letterSpacing: '0.05em'
                                                }}>
                                                    {u.status}
                                                </span>
                                            </td>
                                            <td style={{ padding: '1.5rem', color: 'var(--text-secondary)', fontWeight: 700 }}>
                                                {new Date(u.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </td>
                                            <td style={{ padding: '1.5rem', textAlign: 'right' }}>
                                                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                                                    <button
                                                        onClick={() => { setEditData(u); setShowEditModal(true); }}
                                                        className="btn hover-lift"
                                                        style={{ padding: '10px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)' }}
                                                    >
                                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2.5">
                                                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                                                    </button>
                                                    <button
                                                        onClick={() => { setDeleteTarget(u); setShowDeleteModal(true); }}
                                                        className="btn hover-lift"
                                                        style={{ padding: '10px', borderRadius: '12px', background: 'rgba(244, 63, 94, 0.05)', border: '1px solid rgba(244, 63, 94, 0.1)' }}
                                                    >
                                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--danger)" strokeWidth="2.5">
                                                            <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Create Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)} style={{ backdropFilter: 'blur(16px)' }}>
                    <div className="glass-card scale-up" onClick={(e) => e.stopPropagation()} style={{ width: '100%', maxWidth: '500px', padding: '2.5rem', border: '1px solid var(--border)' }}>
                        <div className="flex-between mb-8">
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                                    <div style={{ width: '4px', height: '20px', background: 'var(--primary)', borderRadius: '2px' }}></div>
                                    <h3 style={{ margin: 0, fontSize: '1.5rem', color: 'var(--text-primary)', fontWeight: '900', letterSpacing: '-0.02em' }}>
                                        Recruit Staff
                                    </h3>
                                </div>
                                <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 700 }}>
                                    Deploy a new staff member to the system.
                                </p>
                            </div>
                            <button onClick={() => setShowModal(false)} className="icon-button hover-lift" style={{ width: '40px', height: '40px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2.5">
                                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                            </button>
                        </div>
                        <form onSubmit={handleCreate} style={{ display: 'grid', gap: '1.5rem' }}>
                            {[
                                { label: 'Full Name', key: 'fullName', type: 'text', placeholder: 'e.g. bayisa shuma', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg> },
                                { label: 'Email Address', key: 'email', type: 'email', placeholder: 'bayisa@staff.hscms.et', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg> },
                                { label: 'Password', key: 'password', type: 'password', placeholder: '••••••••', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg> },
                                { label: 'Phone Number', key: 'phone', type: 'text', placeholder: '+251 ...', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg> },
                                { label: 'National ID Number', key: 'nationalId', type: 'text', placeholder: 'Enter ID number', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M7 8h10M7 12h10M7 16h10" /></svg> }
                            ].map(field => (
                                <div key={field.key}>
                                    <label style={{ display: 'block', marginBottom: '0.75rem', fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                        {field.label}
                                    </label>
                                    <div style={{ position: 'relative' }}>
                                        <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                                            {field.icon}
                                        </span>
                                        <input
                                            required={field.key !== 'phone'}
                                            type={field.type}
                                            className="input"
                                            value={formData[field.key]}
                                            onChange={e => setFormData({ ...formData, [field.key]: e.target.value })}
                                            placeholder={field.placeholder}
                                            style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', padding: '0.875rem 1rem 0.875rem 3rem', borderRadius: '12px', fontWeight: 700 }}
                                        />
                                    </div>
                                </div>
                            ))}
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                                <button type="button" onClick={() => setShowModal(false)} className="btn hover-lift" disabled={submitting} style={{ padding: '0.875rem 1.5rem', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', color: 'var(--text-primary)', fontWeight: 800 }}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary hover-glow" disabled={submitting} style={{
                                    padding: '0.875rem 2rem',
                                    borderRadius: '12px',
                                }}>
                                    {submitting ? (
                                        <>
                                            <div className="loading-spinner" style={{ width: '18px', height: '18px', borderWidth: '3px' }}></div>
                                            Deploying...
                                        </>
                                    ) : 'Create Account'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {showEditModal && editData && (
                <div className="modal-overlay" onClick={() => setShowEditModal(false)} style={{ backdropFilter: 'blur(16px)' }}>
                    <div className="glass-card scale-up" onClick={(e) => e.stopPropagation()} style={{ width: '100%', maxWidth: '500px', padding: '2.5rem', border: '1px solid var(--border)' }}>
                        <div className="flex-between mb-8">
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                                    <div style={{ width: '4px', height: '20px', background: 'var(--primary)', borderRadius: '2px' }}></div>
                                    <h3 style={{ margin: 0, fontSize: '1.5rem', color: 'var(--text-primary)', fontWeight: '900', letterSpacing: '-0.02em' }}>
                                        Edit Staff
                                    </h3>
                                </div>
                                <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 700 }}>
                                    Update profile for {editData.fullName}
                                </p>
                            </div>
                            <button onClick={() => setShowEditModal(false)} className="icon-button hover-lift" style={{ width: '40px', height: '40px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2.5">
                                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                            </button>
                        </div>
                        <form onSubmit={handleEdit} style={{ display: 'grid', gap: '1.5rem' }}>
                            {[
                                { label: 'Full Name', key: 'fullName', type: 'text', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg> },
                                { label: 'Email Address', key: 'email', type: 'email', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg> },
                                { label: 'Phone Number', key: 'phone', type: 'text', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg> },
                                { label: 'National ID Number', key: 'nationalId', type: 'text', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M7 8h10M7 12h10M7 16h10" /></svg> }
                            ].map(field => (
                                <div key={field.key}>
                                    <label style={{ display: 'block', marginBottom: '0.75rem', fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                        {field.label}
                                    </label>
                                    <div style={{ position: 'relative' }}>
                                        <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                                            {field.icon}
                                        </span>
                                        <input
                                            required={field.key !== 'phone'}
                                            type={field.type}
                                            className="input"
                                            value={editData[field.key] || ''}
                                            onChange={e => setEditData({ ...editData, [field.key]: e.target.value })}
                                            style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', padding: '0.875rem 1rem 0.875rem 3rem', borderRadius: '12px', fontWeight: 700 }}
                                        />
                                    </div>
                                </div>
                            ))}
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                                <button type="button" onClick={() => setShowEditModal(false)} className="btn hover-lift" disabled={submitting} style={{ padding: '0.875rem 1.5rem', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', color: 'var(--text-primary)', fontWeight: 800 }}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary hover-glow" disabled={submitting} style={{
                                    padding: '0.875rem 2rem',
                                    borderRadius: '12px',
                                }}>
                                    {submitting ? (
                                        <>
                                            <div className="loading-spinner" style={{ width: '18px', height: '18px', borderWidth: '3px' }}></div>
                                            Saving...
                                        </>
                                    ) : 'Update Staff'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && deleteTarget && (
                <div className="modal-overlay" onClick={() => setShowDeleteModal(false)} style={{ backdropFilter: 'blur(16px)' }}>
                    <div className="glass-card scale-up" onClick={(e) => e.stopPropagation()} style={{ width: '100%', maxWidth: '450px', padding: '3rem', textAlign: 'center', border: '1px solid rgba(244, 63, 94, 0.2)' }}>
                        <div style={{
                            width: '90px',
                            height: '90px',
                            margin: '0 auto 2rem',
                            background: 'rgba(244, 63, 94, 0.05)',
                            borderRadius: '30px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: '1px solid rgba(244, 63, 94, 0.1)',
                            boxShadow: '0 10px 30px rgba(244, 63, 94, 0.1)'
                        }}>
                            <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#f43f5e" strokeWidth="2.5">
                                <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                <line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" />
                            </svg>
                        </div>
                        <h3 style={{ margin: 0, fontSize: '1.75rem', color: 'var(--text-primary)', fontWeight: '900', letterSpacing: '-0.02em' }}>
                            Delete Staff Member?
                        </h3>
                        <p style={{ margin: '1.25rem 0 2.5rem 0', color: 'var(--text-muted)', lineHeight: '1.6', fontWeight: 600 }}>
                            Are you sure you want to remove <span style={{ color: 'var(--text-primary)', fontWeight: 900 }}>{deleteTarget.fullName}</span>?<br />
                            This will permanently revoke their system access.
                        </p>
                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                            <button onClick={() => setShowDeleteModal(false)} className="btn hover-lift" disabled={submitting} style={{ padding: '1rem 2rem', borderRadius: '14px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', color: 'var(--text-primary)', fontWeight: 800 }}>
                                Cancel
                            </button>
                            <button onClick={handleDelete} className="btn hover-glow" disabled={submitting} style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                padding: '1rem 2.5rem',
                                borderRadius: '14px',
                                fontWeight: '900',
                                background: 'linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)',
                                color: 'white',
                                boxShadow: '0 10px 20px rgba(244, 63, 94, 0.2)'
                            }}>
                                {submitting ? (
                                    <>
                                        <div className="loading-spinner" style={{ width: '18px', height: '18px', borderWidth: '3px' }}></div>
                                        Deleting...
                                    </>
                                ) : 'Confirm Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Staff;
