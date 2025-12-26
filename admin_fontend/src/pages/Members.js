import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';

const Members = () => {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [editData, setEditData] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchMembers();
    }, []);

    const fetchMembers = async () => {
        try {
            const res = await api.get('/admin/users');
            const users = res.data?.data || res.data || [];
            setMembers(users.filter(u => u.role === 'member'));
        } catch (err) {
            console.error(err);
            toast.error('Failed to fetch members');
        } finally {
            setLoading(false);
        }
    };

    const toggleStatus = async (id, currentStatus) => {
        const newStatus = currentStatus === 'active' ? 'suspended' : 'active';
        try {
            await api.patch(`/admin/users/${id}/status`, { status: newStatus });
            setMembers(m => m.map(u => u._id === id ? { ...u, status: newStatus } : u));
            toast.success(`Member ${newStatus === 'active' ? 'activated' : 'suspended'}`);
        } catch (err) {
            toast.error('Failed to update status');
        }
    };

    const handleEdit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await api.put(`/admin/users/${editData._id}`, {
                fullName: editData.fullName,
                email: editData.email,
                phone: editData.phone
            });
            toast.success('Member updated successfully');
            setShowEditModal(false);
            setEditData(null);
            fetchMembers();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to update member');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async () => {
        setSubmitting(true);
        try {
            await api.delete(`/admin/users/${deleteTarget._id}`);
            toast.success('Member deleted successfully');
            setShowDeleteModal(false);
            setDeleteTarget(null);
            fetchMembers();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to delete member');
        } finally {
            setSubmitting(false);
        }
    };

    const filteredMembers = members.filter(m =>
        m.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.phone?.includes(searchQuery)
    );

    return (
        <div className="fade-in" style={{ paddingBottom: '2rem' }}>
            <div className="flex-between mb-8" style={{ alignItems: 'flex-end' }}>
                <div>
                    <h2 className="page-title" style={{ marginBottom: '0.5rem', fontSize: '2rem' }}>👥 Member Management</h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', margin: 0 }}>
                        View and manage system members, their status and accounts.
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
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>Total Members</div>
                        <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                            {members.length}
                        </div>
                    </div>
                </div>
            </div>

            <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
                <div className="search-container" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)' }}>
                    <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2">
                        <circle cx="11" cy="11" r="8" />
                        <path d="m21 21-4.35-4.35" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Search members by name, email or phone..."
                        className="search-input"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{ color: 'var(--text-primary)', fontSize: '1rem' }}
                    />
                </div>
            </div>

            <div className="glass-card" style={{ overflow: 'hidden' }}>
                {loading ? (
                    <div className="loading-container" style={{ padding: '4rem' }}>
                        <div className="loading-spinner"></div>
                        <div style={{ color: 'var(--text-secondary)', marginTop: '1rem' }}>Fetching member records...</div>
                    </div>
                ) : (
                    <div className="table-container" style={{ margin: 0, borderRadius: 0, border: 'none' }}>
                        <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
                            <thead>
                                <tr style={{ background: 'rgba(255,255,255,0.03)' }}>
                                    <th style={{ padding: '1.25rem 1.5rem', textAlign: 'left', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Member</th>
                                    <th style={{ padding: '1.25rem 1.5rem', textAlign: 'left', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Contact Info</th>
                                    <th style={{ padding: '1.25rem 1.5rem', textAlign: 'left', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</th>
                                    <th style={{ padding: '1.25rem 1.5rem', textAlign: 'left', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Joined Date</th>
                                    <th style={{ padding: '1.25rem 1.5rem', textAlign: 'right', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredMembers.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
                                            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🔍</div>
                                            {searchQuery ? 'No members found matching your search.' : 'No members registered yet.'}
                                        </td>
                                    </tr>
                                ) : (
                                    filteredMembers.map((u, idx) => (
                                        <tr key={u._id} className="hover-lift" style={{
                                            borderBottom: '1px solid var(--border)',
                                            animation: `slideInRight 0.4s ease forwards ${idx * 0.05}s`,
                                            opacity: 0
                                        }}>
                                            <td style={{ padding: '1.25rem 1.5rem' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                    <div style={{
                                                        width: '40px',
                                                        height: '40px',
                                                        borderRadius: '10px',
                                                        background: 'var(--gradient-primary)',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        fontSize: '1.25rem',
                                                        color: 'white',
                                                        fontWeight: '700'
                                                    }}>
                                                        {u.fullName.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '1rem' }}>{u.fullName}</div>
                                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Member ID: {u._id.slice(-6).toUpperCase()}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td style={{ padding: '1.25rem 1.5rem' }}>
                                                <div style={{ color: 'var(--text-primary)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>{u.email}</div>
                                                <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{u.phone || 'No phone provided'}</div>
                                            </td>
                                            <td style={{ padding: '1.25rem 1.5rem' }}>
                                                <button
                                                    onClick={() => toggleStatus(u._id, u.status)}
                                                    className={`status-badge status-${u.status}`}
                                                    style={{
                                                        padding: '0.4rem 0.8rem',
                                                        borderRadius: '8px',
                                                        fontSize: '0.75rem',
                                                        fontWeight: '700',
                                                        textTransform: 'uppercase',
                                                        background: u.status === 'active' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(244, 63, 94, 0.1)',
                                                        color: u.status === 'active' ? '#10b981' : '#f43f5e',
                                                        border: `1px solid ${u.status === 'active' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(244, 63, 94, 0.2)'}`,
                                                        cursor: 'pointer'
                                                    }}
                                                    title={`Click to ${u.status === 'active' ? 'suspend' : 'activate'}`}
                                                >
                                                    {u.status}
                                                </button>
                                            </td>
                                            <td style={{ padding: '1.25rem 1.5rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                                                {new Date(u.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </td>
                                            <td style={{ padding: '1.25rem 1.5rem', textAlign: 'right' }}>
                                                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                                                    <button
                                                        onClick={() => {
                                                            setEditData(u);
                                                            setShowEditModal(true);
                                                        }}
                                                        className="btn btn-secondary"
                                                        style={{
                                                            padding: '0.5rem',
                                                            borderRadius: '10px',
                                                            background: 'rgba(255,255,255,0.05)',
                                                            border: '1px solid var(--border)'
                                                        }}
                                                        title="Edit member"
                                                    >
                                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2">
                                                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                                        </svg>
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setDeleteTarget(u);
                                                            setShowDeleteModal(true);
                                                        }}
                                                        className="btn btn-danger"
                                                        style={{
                                                            padding: '0.5rem',
                                                            borderRadius: '10px',
                                                            background: 'rgba(244, 63, 94, 0.1)',
                                                            border: '1px solid rgba(244, 63, 94, 0.2)'
                                                        }}
                                                        title="Delete member"
                                                    >
                                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f43f5e" strokeWidth="2">
                                                            <polyline points="3 6 5 6 21 6" />
                                                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                                        </svg>
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

            {/* Edit Modal */}
            {showEditModal && editData && (
                <div className="modal-overlay" onClick={() => setShowEditModal(false)} style={{ backdropFilter: 'blur(8px)' }}>
                    <div className="glass-card scale-up" onClick={(e) => e.stopPropagation()} style={{ width: '100%', maxWidth: '500px', padding: '2.5rem' }}>
                        <div className="flex-between mb-6">
                            <div>
                                <h3 style={{ margin: 0, fontSize: '1.5rem', color: 'var(--text-primary)', fontWeight: '800' }}>
                                    ✏️ Edit Member
                                </h3>
                                <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                                    Update information for {editData.fullName}.
                                </p>
                            </div>
                            <button onClick={() => setShowEditModal(false)} className="icon-button" style={{ width: '36px', height: '36px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px' }}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2.5">
                                    <line x1="18" y1="6" x2="6" y2="18" />
                                    <line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                            </button>
                        </div>
                        <form onSubmit={handleEdit} style={{ display: 'grid', gap: '1.25rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.75rem', fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-secondary)' }}>
                                    Full Name
                                </label>
                                <input
                                    required
                                    className="input"
                                    value={editData.fullName}
                                    onChange={e => setEditData({ ...editData, fullName: e.target.value })}
                                    style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', padding: '0.875rem 1rem', borderRadius: '12px' }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.75rem', fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-secondary)' }}>
                                    Email Address
                                </label>
                                <input
                                    required
                                    type="email"
                                    className="input"
                                    value={editData.email}
                                    onChange={e => setEditData({ ...editData, email: e.target.value })}
                                    style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', padding: '0.875rem 1rem', borderRadius: '12px' }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.75rem', fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-secondary)' }}>
                                    Phone Number
                                </label>
                                <input
                                    className="input"
                                    value={editData.phone || ''}
                                    onChange={e => setEditData({ ...editData, phone: e.target.value })}
                                    style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', padding: '0.875rem 1rem', borderRadius: '12px' }}
                                />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}>
                                <button type="button" onClick={() => setShowEditModal(false)} className="btn btn-secondary" disabled={submitting} style={{ padding: '0.875rem 1.5rem', borderRadius: '12px' }}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary hover-glow" disabled={submitting} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    padding: '0.875rem 2rem',
                                    borderRadius: '12px',
                                    fontWeight: '700'
                                }}>
                                    {submitting ? (
                                        <>
                                            <div className="loading-spinner" style={{ width: '18px', height: '18px', borderWidth: '2.5px' }}></div>
                                            Saving...
                                        </>
                                    ) : 'Update Member'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && deleteTarget && (
                <div className="modal-overlay" onClick={() => setShowDeleteModal(false)} style={{ backdropFilter: 'blur(8px)' }}>
                    <div className="glass-card scale-up" onClick={(e) => e.stopPropagation()} style={{ width: '100%', maxWidth: '450px', padding: '2.5rem', textAlign: 'center' }}>
                        <div style={{
                            width: '80px',
                            height: '80px',
                            margin: '0 auto 1.5rem',
                            background: 'rgba(244, 63, 94, 0.1)',
                            borderRadius: '24px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: '1px solid rgba(244, 63, 94, 0.2)'
                        }}>
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#f43f5e" strokeWidth="2.5">
                                <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1-1v3M4 7h16" />
                            </svg>
                        </div>
                        <h3 style={{ margin: 0, fontSize: '1.5rem', color: 'var(--text-primary)', fontWeight: '800' }}>
                            Delete Member?
                        </h3>
                        <p style={{ margin: '1rem 0 2rem 0', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                            Are you sure you want to remove <strong>{deleteTarget.fullName}</strong>? This will permanently delete their account and history.
                        </p>
                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                            <button onClick={() => setShowDeleteModal(false)} className="btn btn-secondary" disabled={submitting} style={{ padding: '0.875rem 1.5rem', borderRadius: '12px' }}>
                                Cancel
                            </button>
                            <button onClick={handleDelete} className="btn btn-danger" disabled={submitting} style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                padding: '0.875rem 2rem',
                                borderRadius: '12px',
                                fontWeight: '700'
                            }}>
                                {submitting ? (
                                    <>
                                        <div className="loading-spinner" style={{ width: '18px', height: '18px', borderWidth: '2.5px' }}></div>
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

export default Members;
