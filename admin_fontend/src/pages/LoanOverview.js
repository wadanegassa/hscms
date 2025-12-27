import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';

const LoanOverview = () => {
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLoans();
    }, []);

    const fetchLoans = async () => {
        try {
            setLoading(true);
            const res = await api.get('/admin/reports/loans/detailed');
            setList(res.data?.data || res.data || []);
        } catch (err) {
            console.error(err);
            toast.error('Failed to fetch loan data');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fade-in" style={{ paddingBottom: '2rem' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                <div>
                    <h2 className="page-title" style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-0.03em', background: 'linear-gradient(to right, #fff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        Loan Overview
                    </h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginTop: '0.5rem' }}>
                        Detailed tracking of all system-wide loan applications and statuses.
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button onClick={fetchLoans} className="btn btn-primary hover-glow" style={{
                        padding: '0.75rem 1.25rem',
                        borderRadius: '14px',
                    }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M23 4v6h-6M1 20v-6h6" /><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" /></svg>
                        Sync
                    </button>
                </div>
            </header>

            <div className="table-container" style={{ padding: 0, overflow: 'hidden', borderRadius: '24px', border: '1px solid var(--border)' }}>
                {loading ? (
                    <div style={{ padding: '6rem', textAlign: 'center' }}>
                        <div className="loading-spinner"></div>
                        <div style={{ color: 'var(--text-muted)', marginTop: '1.5rem' }}>Fetching records...</div>
                    </div>
                ) : (
                    <div className="table-container" style={{ margin: 0, borderRadius: 0, border: 'none', background: 'transparent' }}>
                        <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
                            <thead>
                                <tr style={{ background: 'rgba(255,255,255,0.02)' }}>
                                    <th style={{ padding: '1.5rem', textAlign: 'left', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Member</th>
                                    <th style={{ padding: '1.5rem', textAlign: 'left', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Amount (ETB)</th>
                                    <th style={{ padding: '1.5rem', textAlign: 'left', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Status</th>
                                    <th style={{ padding: '1.5rem', textAlign: 'right', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {list.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>No loan records found.</td>
                                    </tr>
                                ) : (
                                    list.map((loan, idx) => (
                                        <tr key={loan._id || idx} className="hover-lift" style={{
                                            borderBottom: '1px solid var(--border)',
                                            animation: `slideInRight 0.5s ease forwards ${idx * 0.05}s`,
                                            opacity: 0
                                        }}>
                                            <td style={{ padding: '1.5rem' }}>
                                                <div style={{ fontWeight: 800, color: 'var(--text-primary)' }}>{loan.memberId?.fullName || 'N/A'}</div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{loan.memberId?.email || 'N/A'}</div>
                                            </td>
                                            <td style={{ padding: '1.5rem' }}>
                                                <div style={{
                                                    fontWeight: 900,
                                                    fontSize: '1.1rem',
                                                    color: 'var(--secondary)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '0.5rem'
                                                }}>
                                                    {loan.amount.toLocaleString()}
                                                    <span style={{ fontSize: '0.7rem', opacity: 0.5 }}>ETB</span>
                                                </div>
                                            </td>
                                            <td style={{ padding: '1.5rem' }}>
                                                <span style={{
                                                    padding: '6px 14px',
                                                    borderRadius: '10px',
                                                    fontSize: '0.75rem',
                                                    fontWeight: 800,
                                                    textTransform: 'uppercase',
                                                    background: loan.status === 'active' || loan.status === 'approved' ? 'rgba(0, 255, 157, 0.1)' : loan.status === 'pending' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(244, 63, 94, 0.1)',
                                                    color: loan.status === 'active' || loan.status === 'approved' ? 'var(--primary)' : loan.status === 'pending' ? 'var(--warning)' : 'var(--danger)',
                                                    border: `1px solid ${loan.status === 'active' || loan.status === 'approved' ? 'rgba(0, 255, 157, 0.2)' : loan.status === 'pending' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(244, 63, 94, 0.2)'}`,
                                                    letterSpacing: '0.05em'
                                                }}>
                                                    {loan.status}
                                                </span>
                                            </td>
                                            <td style={{ padding: '1.5rem', textAlign: 'right', color: 'var(--text-secondary)', fontWeight: 700 }}>
                                                {new Date(loan.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
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
export default LoanOverview;
