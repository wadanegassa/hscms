import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';

const LoanApprovals = () => {
  const [loans, setLoans] = useState([]);
  const [selected, setSelected] = useState(null);
  const [remarks, setRemarks] = useState('');
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchLoans();
  }, []);

  const fetchLoans = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/loans/pending');
      // Handle both wrapped and unwrapped responses
      const loansData = res.data?.data || res.data || [];
      setLoans(Array.isArray(loansData) ? loansData : []);
    } catch (err) {
      console.error(err);
      toast.error('Failed to fetch pending loans');
    } finally {
      setLoading(false);
    }
  };

  const approve = async (id) => {
    setProcessing(true);
    try {
      await api.post(`/admin/loan/${id}/approve`, { remarks });
      toast.success('Loan approved successfully!');
      setLoans(l => l.filter(x => x._id !== id));
      setSelected(null);
      setRemarks('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to approve loan');
    } finally {
      setProcessing(false);
    }
  }

  const reject = async (id) => {
    if (!remarks.trim()) {
      toast.warning('Please provide a reason for rejection');
      return;
    }
    setProcessing(true);
    try {
      await api.post(`/admin/loan/${id}/reject`, { remarks });
      toast.success('Loan rejected');
      setLoans(l => l.filter(x => x._id !== id));
      setSelected(null);
      setRemarks('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reject loan');
    } finally {
      setProcessing(false);
    }
  }

  return (
    <div className="fade-in" style={{ paddingBottom: '2rem' }}>
      <div className="flex-between mb-8" style={{ alignItems: 'flex-end' }}>
        <div>
          <h2 className="page-title" style={{ marginBottom: '0.5rem', fontSize: '2rem' }}>💸 Loan Approvals</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', margin: 0 }}>
            Review and manage pending loan applications from members.
          </p>
        </div>
        <div className="glass-card" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          padding: '0.75rem 1.5rem',
          borderRadius: '12px'
        }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--warning)', boxShadow: '0 0 10px var(--warning)' }}></div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>Pending Requests</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--warning)' }}>
              {loans.length}
            </div>
          </div>
        </div>
      </div>

      <div className="glass-card" style={{ overflow: 'hidden' }}>
        {loading ? (
          <div className="loading-container" style={{ padding: '4rem' }}>
            <div className="loading-spinner"></div>
            <div style={{ color: 'var(--text-secondary)', marginTop: '1rem' }}>Fetching loan applications...</div>
          </div>
        ) : loans.length === 0 ? (
          <div style={{ padding: '6rem 2rem', textAlign: 'center' }}>
            <div style={{
              width: '80px',
              height: '80px',
              background: 'rgba(16, 185, 129, 0.1)',
              borderRadius: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem',
              border: '1px solid rgba(16, 185, 129, 0.2)'
            }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>
            <h3 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', fontWeight: '800', margin: '0 0 0.5rem 0' }}>All Caught Up!</h3>
            <p style={{ color: 'var(--text-muted)', margin: 0 }}>No pending loan requests require your attention right now.</p>
          </div>
        ) : (
          <div className="table-container" style={{ margin: 0, borderRadius: 0, border: 'none' }}>
            <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.03)' }}>
                  <th style={{ padding: '1.25rem 1.5rem', textAlign: 'left', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Member</th>
                  <th style={{ padding: '1.25rem 1.5rem', textAlign: 'left', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Amount</th>
                  <th style={{ padding: '1.25rem 1.5rem', textAlign: 'left', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Purpose</th>
                  <th style={{ padding: '1.25rem 1.5rem', textAlign: 'left', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Requested On</th>
                  <th style={{ padding: '1.25rem 1.5rem', textAlign: 'right', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loans.map((loan, idx) => (
                  <tr key={loan._id} className="hover-lift" style={{
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
                          {loan.memberId?.fullName?.charAt(0) || '?'}
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '1rem' }}>{loan.memberId?.fullName || 'Unknown Member'}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ID: {loan.memberId?._id?.slice(-6).toUpperCase() || 'N/A'}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '1.25rem 1.5rem' }}>
                      <div style={{ color: 'var(--success)', fontWeight: 800, fontSize: '1.125rem' }}>
                        {loan.amount?.toLocaleString()} <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>ETB</span>
                      </div>
                    </td>
                    <td style={{ padding: '1.25rem 1.5rem' }}>
                      <div style={{
                        color: 'var(--text-secondary)',
                        fontSize: '0.875rem',
                        maxWidth: '250px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {loan.purpose || 'No purpose specified'}
                      </div>
                    </td>
                    <td style={{ padding: '1.25rem 1.5rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                      {new Date(loan.requestDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td style={{ padding: '1.25rem 1.5rem', textAlign: 'right' }}>
                      <button
                        onClick={() => setSelected(loan)}
                        className="btn btn-primary hover-glow"
                        style={{
                          padding: '0.6rem 1.25rem',
                          borderRadius: '10px',
                          fontWeight: '700',
                          fontSize: '0.875rem'
                        }}
                      >
                        Review
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selected && (
        <div className="modal-overlay" onClick={() => !processing && setSelected(null)} style={{ backdropFilter: 'blur(8px)' }}>
          <div className="glass-card scale-up" onClick={(e) => e.stopPropagation()} style={{ width: '100%', maxWidth: '650px', padding: '2.5rem' }}>
            <div className="flex-between mb-6">
              <div>
                <h3 style={{ margin: 0, fontSize: '1.5rem', color: 'var(--text-primary)', fontWeight: '800' }}>
                  📋 Loan Application Review
                </h3>
                <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                  Review member details and financial request.
                </p>
              </div>
              <button
                onClick={() => !processing && setSelected(null)}
                className="icon-button"
                disabled={processing}
                style={{ width: '36px', height: '36px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px' }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2.5">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '1.5rem',
              marginBottom: '2rem',
              background: 'rgba(255,255,255,0.02)',
              padding: '1.5rem',
              borderRadius: '16px',
              border: '1px solid var(--border)'
            }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Applicant</div>
                <div style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-primary)' }}>{selected.memberId?.fullName}</div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{selected.memberId?.email}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Requested Amount</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--success)' }}>
                  {selected.amount?.toLocaleString()} <span style={{ fontSize: '0.875rem', fontWeight: 400 }}>ETB</span>
                </div>
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Purpose of Loan</div>
                <div style={{
                  fontSize: '0.9375rem',
                  color: 'var(--text-primary)',
                  lineHeight: '1.6',
                  background: 'rgba(0,0,0,0.2)',
                  padding: '1rem',
                  borderRadius: '12px',
                  border: '1px solid rgba(255,255,255,0.05)'
                }}>
                  {selected.purpose || 'No purpose provided by the applicant.'}
                </div>
              </div>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'block', marginBottom: '0.75rem', fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-secondary)' }}>
                Admin Remarks {!remarks.trim() && <span style={{ color: 'var(--danger)' }}>*</span>}
              </label>
              <textarea
                className="input"
                value={remarks}
                onChange={e => setRemarks(e.target.value)}
                placeholder="Provide a reason for your decision..."
                style={{
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid var(--border)',
                  padding: '1rem',
                  borderRadius: '12px',
                  minHeight: '120px',
                  width: '100%',
                  resize: 'none',
                  fontSize: '0.9375rem',
                  color: 'var(--text-primary)'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button
                onClick={() => reject(selected._id)}
                className="btn btn-danger"
                disabled={processing}
                style={{
                  padding: '0.875rem 2rem',
                  borderRadius: '12px',
                  fontWeight: '700',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                {processing ? (
                  <div className="loading-spinner" style={{ width: '18px', height: '18px', borderWidth: '2.5px' }}></div>
                ) : (
                  <>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                    Reject Loan
                  </>
                )}
              </button>
              <button
                onClick={() => approve(selected._id)}
                className="btn btn-primary hover-glow"
                disabled={processing}
                style={{
                  padding: '0.875rem 2.5rem',
                  borderRadius: '12px',
                  fontWeight: '700',
                  background: 'var(--success)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                {processing ? (
                  <div className="loading-spinner" style={{ width: '18px', height: '18px', borderWidth: '2.5px' }}></div>
                ) : (
                  <>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                    Approve Loan
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default LoanApprovals;
