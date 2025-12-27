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
      console.log('Loans Data:', loansData);
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
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <div>
          <h2 className="page-title" style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-0.03em', background: 'linear-gradient(to right, #fff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Loan Approvals
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginTop: '0.5rem' }}>
            Review and process pending financial requests.
          </p>
        </div>

        <div className="glass-card" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          padding: '0.75rem 1.5rem',
          borderRadius: '16px',
          border: '1px solid var(--border)'
        }}>
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--warning)', boxShadow: '0 0 15px var(--warning)' }}></div>
          <div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Pending Review</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--warning)' }}>
              {loans.length}
            </div>
          </div>
        </div>
      </header>

      {loading ? (
        <div className="loading-container" style={{ padding: '8rem' }}>
          <div className="loading-spinner"></div>
          <div style={{ color: 'var(--text-muted)', marginTop: '1.5rem' }}>Fetching applications...</div>
        </div>
      ) : loans.length === 0 ? (
        <div className="glass-card" style={{ padding: '6rem 2rem', textAlign: 'center', borderRadius: '32px' }}>
          <div style={{
            width: '100px',
            height: '100px',
            background: 'rgba(16, 185, 129, 0.05)',
            borderRadius: '30px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 2rem',
            border: '1px solid rgba(16, 185, 129, 0.1)'
          }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
          <h3 style={{ fontSize: '2rem', color: 'var(--text-primary)', fontWeight: 900, margin: '0 0 1rem 0' }}>Inbox Zero!</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '400px', margin: '0 auto' }}>All loan applications have been processed. Great job!</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
          {loans.map((loan, idx) => (
            <div key={loan._id} className="user-profile scale-up" style={{
              flex: 'none',
              margin: 0,
              padding: '2rem',
              display: 'flex',
              flexDirection: 'column',
              animation: `slideUp 0.5s ease forwards ${idx * 0.1}s`,
              opacity: 0,
              background: 'var(--bg-card)',
              border: '1px solid var(--border)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '18px',
                  background: 'var(--bg-dark)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem',
                  color: 'var(--primary)',
                  fontWeight: 900,
                  border: '1px solid var(--border)'
                }}>
                  {loan.memberId?.fullName?.charAt(0) || '?'}
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Amount</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--primary)' }}>
                    ${loan.amount?.toLocaleString()}
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: '1.25rem' }}>{loan.memberId?.fullName || 'Unknown Member'}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>Requested on {new Date(loan.requestDate).toLocaleDateString()}</div>
              </div>

              <div style={{
                background: 'rgba(255,255,255,0.02)',
                padding: '1rem',
                borderRadius: '12px',
                border: '1px solid var(--border)',
                marginBottom: '2rem',
                flex: 1
              }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.5rem' }}>Purpose</div>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.5' }}>
                  {loan.purpose || 'No purpose specified'}
                </p>
              </div>

              <button
                onClick={() => setSelected(loan)}
                className="btn btn-primary hover-glow"
                style={{
                  width: '100%',
                  padding: '1rem',
                  borderRadius: '14px',
                }}
              >
                Review Application
              </button>
            </div>
          ))}
        </div>
      )}

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
                <div style={{ marginTop: '0.75rem', display: 'grid', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    <span style={{ width: '20px' }}>🆔</span>
                    <span style={{ fontWeight: 600 }}>National ID:</span>
                    <span style={{ color: selected.memberId?.nationalId ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                      {selected.memberId?.nationalId || 'Not provided'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    <span style={{ width: '20px' }}>🏦</span>
                    <span style={{ fontWeight: 600 }}>Bank (CBE):</span>
                    <span style={{ color: selected.memberId?.bankAccount ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                      {selected.memberId?.bankAccount || 'Not provided'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    <span style={{ width: '20px' }}>📱</span>
                    <span style={{ fontWeight: 600 }}>Telebirr:</span>
                    <span style={{ color: selected.memberId?.telebirr ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                      {selected.memberId?.telebirr || 'Not provided'}
                    </span>
                  </div>
                </div>
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
