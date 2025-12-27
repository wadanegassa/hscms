import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-toastify';

const SearchResults = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q') || '';
    const [results, setResults] = useState({ users: [], loans: [], savings: [], auditLogs: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (query) {
            performSearch();
        }
    }, [query]);

    const performSearch = async () => {
        try {
            setLoading(true);
            const res = await api.get(`/admin/search?q=${encodeURIComponent(query)}`);
            setResults(res.data?.data || res.data || { users: [], loans: [], savings: [], auditLogs: [] });
        } catch (err) {
            console.error(err);
            toast.error('Search failed');
        } finally {
            setLoading(false);
        }
    };

    const ResultSection = ({ title, items, type }) => {
        if (!items || items.length === 0) return null;

        return (
            <div className="glass-card-static" style={{ marginBottom: '2rem', padding: '2rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-primary)' }}>
                    {title}
                    <span style={{ fontSize: '0.8rem', background: 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: '6px', color: 'var(--text-muted)' }}>{items.length}</span>
                </h3>
                <div className="table-container" style={{ margin: 0, border: '1px solid var(--border)' }}>
                    <table style={{ width: '100%' }}>
                        <thead>
                            <tr style={{ background: 'rgba(255,255,255,0.02)' }}>
                                {type === 'users' && (
                                    <>
                                        <th style={{ padding: '1rem' }}>Name</th>
                                        <th style={{ padding: '1rem' }}>Email</th>
                                        <th style={{ padding: '1rem' }}>Role</th>
                                        <th style={{ padding: '1rem', textAlign: 'right' }}>Action</th>
                                    </>
                                )}
                                {type === 'loans' && (
                                    <>
                                        <th style={{ padding: '1rem' }}>Member</th>
                                        <th style={{ padding: '1rem' }}>Amount</th>
                                        <th style={{ padding: '1rem' }}>Status</th>
                                        <th style={{ padding: '1rem', textAlign: 'right' }}>Action</th>
                                    </>
                                )}
                                {type === 'savings' && (
                                    <>
                                        <th style={{ padding: '1rem' }}>Member</th>
                                        <th style={{ padding: '1rem' }}>Amount</th>
                                        <th style={{ padding: '1rem' }}>Date</th>
                                        <th style={{ padding: '1rem', textAlign: 'right' }}>Action</th>
                                    </>
                                )}
                                {type === 'audit' && (
                                    <>
                                        <th style={{ padding: '1rem' }}>Action</th>
                                        <th style={{ padding: '1rem' }}>By</th>
                                        <th style={{ padding: '1rem' }}>Date</th>
                                        <th style={{ padding: '1rem', textAlign: 'right' }}>Action</th>
                                    </>
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item, idx) => (
                                <tr key={idx}>
                                    {type === 'users' && (
                                        <>
                                            <td style={{ padding: '1rem', fontWeight: 700 }}>{item.fullName}</td>
                                            <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{item.email}</td>
                                            <td style={{ padding: '1rem' }}>
                                                <span style={{ fontSize: '0.7rem', fontWeight: 900, textTransform: 'uppercase', color: item.role === 'admin' ? 'var(--secondary)' : 'var(--primary)' }}>{item.role}</span>
                                            </td>
                                            <td style={{ padding: '1rem', textAlign: 'right' }}>
                                                <Link to={`/users?search=${encodeURIComponent(item.email)}`} className="btn" style={{ fontSize: '0.7rem', padding: '4px 10px' }}>View</Link>
                                            </td>
                                        </>
                                    )}
                                    {type === 'loans' && (
                                        <>
                                            <td style={{ padding: '1rem', fontWeight: 700 }}>{item.memberId?.fullName || 'N/A'}</td>
                                            <td style={{ padding: '1rem', color: 'var(--primary)', fontWeight: 800 }}>${item.amount?.toLocaleString()}</td>
                                            <td style={{ padding: '1rem' }}>
                                                <span style={{ fontSize: '0.7rem', fontWeight: 900, textTransform: 'uppercase', color: item.status === 'approved' ? 'var(--primary)' : 'var(--warning)' }}>{item.status}</span>
                                            </td>
                                            <td style={{ padding: '1rem', textAlign: 'right' }}>
                                                <Link to="/reports" state={{ reportType: 'loans' }} className="btn" style={{ fontSize: '0.7rem', padding: '4px 10px' }}>View</Link>
                                            </td>
                                        </>
                                    )}
                                    {type === 'savings' && (
                                        <>
                                            <td style={{ padding: '1rem', fontWeight: 700 }}>{item.memberId?.fullName || 'N/A'}</td>
                                            <td style={{ padding: '1rem', color: 'var(--primary)', fontWeight: 800 }}>${item.amount?.toLocaleString()}</td>
                                            <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{new Date(item.date || item.createdAt).toLocaleDateString()}</td>
                                            <td style={{ padding: '1rem', textAlign: 'right' }}>
                                                <Link to="/reports" state={{ reportType: 'savings' }} className="btn" style={{ fontSize: '0.7rem', padding: '4px 10px' }}>View</Link>
                                            </td>
                                        </>
                                    )}
                                    {type === 'audit' && (
                                        <>
                                            <td style={{ padding: '1rem', fontWeight: 700 }}>{item.action}</td>
                                            <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{item.performedBy?.fullName || 'System'}</td>
                                            <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{new Date(item.timestamp).toLocaleString()}</td>
                                            <td style={{ padding: '1rem', textAlign: 'right' }}>
                                                <Link to="/reports" state={{ reportType: 'audit' }} className="btn" style={{ fontSize: '0.7rem', padding: '4px 10px' }}>View</Link>
                                            </td>
                                        </>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

    return (
        <div className="fade-in" style={{ paddingBottom: '2rem' }}>
            <header style={{ marginBottom: '3rem' }}>
                <h2 className="page-title" style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-0.03em', background: 'linear-gradient(to right, #fff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    Search Results
                </h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginTop: '0.5rem' }}>
                    Showing results for "{query}" across the entire system.
                </p>
            </header>

            {loading ? (
                <div className="loading-container" style={{ padding: '6rem' }}>
                    <div className="loading-spinner"></div>
                    <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>Searching database...</p>
                </div>
            ) : (
                <>
                    {Object.values(results).every(arr => arr.length === 0) ? (
                        <div className="glass-card-static" style={{ textAlign: 'center', padding: '6rem' }}>
                            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" style={{ marginBottom: '1.5rem', opacity: 0.3 }}>
                                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                            </svg>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>No results found</h3>
                            <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Try searching for a different name, email, or action.</p>
                        </div>
                    ) : (
                        <>
                            <ResultSection title="Users" items={results.users} type="users" />
                            <ResultSection title="Loans" items={results.loans} type="loans" />
                            <ResultSection title="Savings" items={results.savings} type="savings" />
                            <ResultSection title="Audit Logs" items={results.auditLogs} type="audit" />
                        </>
                    )}
                </>
            )}
        </div>
    );
};

export default SearchResults;
