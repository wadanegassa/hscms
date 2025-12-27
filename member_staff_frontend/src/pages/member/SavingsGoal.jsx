import React, { useState, useEffect } from 'react';
import api from '../../services/api';

export default function SavingsGoal() {
  const [goal, setGoal] = useState(null);
  const [targetAmount, setTargetAmount] = useState('');
  const [progress, setProgress] = useState(0);
  const [totalSaved, setTotalSaved] = useState(0);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchGoal();
  }, []);

  const fetchGoal = async () => {
    try {
      const res = await api.get('/member/goal');
      if (res.data && res.data.goal) {
        setGoal(res.data.goal);
        setTargetAmount(res.data.goal.targetAmount);
        setProgress(res.data.progress);
        setTotalSaved(res.data.totalSaved);
      } else {
        // No goal set yet, but maybe savings exist
        setTotalSaved(res.data?.totalSaved || 0);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      const res = await api.post('/member/goal', { targetAmount: Number(targetAmount) });
      setMessage('Savings goal updated successfully!');
      fetchGoal(); // Refresh to get new progress
    } catch (err) {
      setError('Failed to update goal');
    }
  };

  return (
    <div className="fade-in" style={{ paddingBottom: '2rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <div>
          <h2 className="page-title" style={{ fontSize: '2.8rem', fontWeight: 900, letterSpacing: '-0.04em', color: 'var(--text-primary)', textTransform: 'uppercase' }}>
            Savings <span style={{ color: 'var(--primary)' }}>Goal</span>
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginTop: '0.5rem', fontWeight: 600 }}>
            Set targets and visualize your journey towards financial freedom.
          </p>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '2rem', alignItems: 'start' }}>
        <div className="glass-card scale-up" style={{ padding: '2.5rem', background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2.5"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>
            Set Your Goal
          </h3>

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label className="label">Target Amount (ETB)</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', fontWeight: 700, color: 'var(--text-muted)' }}>
                  ETB
                </span>
                <input
                  type="number"
                  value={targetAmount}
                  onChange={(e) => setTargetAmount(e.target.value)}
                  className="input"
                  required
                  min="1"
                  placeholder="e.g. 50,000"
                  style={{ paddingLeft: '3.5rem' }}
                />
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                Enter the total amount you wish to save.
              </p>
            </div>

            {message && (
              <div className="fade-in" style={{
                padding: '1.25rem',
                background: 'rgba(234, 179, 8, 0.05)',
                border: '1px solid rgba(234, 179, 8, 0.1)',
                color: 'var(--primary)',
                borderRadius: '16px',
                marginBottom: '1.5rem',
                fontSize: '0.9rem',
                fontWeight: 800,
                textAlign: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.75rem'
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6L9 17l-5-5" /></svg>
                {message}
              </div>
            )}

            {error && (
              <div className="fade-in" style={{
                padding: '1.25rem',
                background: 'rgba(239, 68, 68, 0.05)',
                border: '1px solid rgba(239, 68, 68, 0.1)',
                color: 'var(--danger)',
                borderRadius: '16px',
                marginBottom: '1.5rem',
                fontSize: '0.9rem',
                fontWeight: 800,
                textAlign: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.75rem'
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                {error}
              </div>
            )}

            <button
              type="submit"
              className="btn hover-glow"
              style={{ width: '100%', height: '4rem', borderRadius: '16px', background: 'var(--gradient-primary)', color: '#000', fontSize: '1.1rem', fontWeight: 900, letterSpacing: '0.05em', border: 'none' }}
            >
              Update Goal
            </button>
          </form>
        </div>

        <div className="glass-card scale-up" style={{ padding: '2.5rem', background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '2.5rem', display: 'flex', alignItems: 'center', gap: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2.5"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>
            Goal Progress
          </h3>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <div className="loading-spinner" style={{ margin: '0 auto' }}></div>
            </div>
          ) : goal ? (
            <div>
              <div className="flex-between mb-4">
                <span style={{ fontSize: '0.8rem', fontWeight: 900, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Current Progress</span>
                <span style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--primary)', letterSpacing: '-0.02em' }}>{progress.toFixed(1)}%</span>
              </div>

              <div style={{
                width: '100%',
                height: '20px',
                background: 'rgba(15, 23, 42, 0.05)',
                borderRadius: '10px',
                overflow: 'hidden',
                marginBottom: '2.5rem',
                border: '1px solid var(--border)',
                padding: '4px'
              }}>
                <div style={{
                  width: `${Math.min(100, progress)}%`,
                  height: '100%',
                  background: 'var(--gradient-primary)',
                  borderRadius: '6px',
                  transition: 'width 1.5s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: '0 0 20px rgba(234, 179, 8, 0.3)'
                }}></div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div style={{ padding: '1.5rem', background: 'rgba(15, 23, 42, 0.02)', borderRadius: '20px', border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 900, textTransform: 'uppercase', marginBottom: '0.75rem', letterSpacing: '0.05em' }}>Total Saved</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--primary)' }}>{totalSaved.toLocaleString()} <span style={{ fontSize: '0.8rem', opacity: 0.5 }}>ETB</span></div>
                </div>
                <div style={{ padding: '1.5rem', background: 'rgba(15, 23, 42, 0.02)', borderRadius: '20px', border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 900, textTransform: 'uppercase', marginBottom: '0.75rem', letterSpacing: '0.05em' }}>Remaining</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-primary)' }}>
                    {Math.max(0, goal.targetAmount - totalSaved).toLocaleString()} <span style={{ fontSize: '0.8rem', opacity: 0.5 }}>ETB</span>
                  </div>
                </div>
              </div>

              <div style={{
                marginTop: '2.5rem',
                padding: '1.5rem',
                background: 'rgba(234, 179, 8, 0.03)',
                borderRadius: '20px',
                border: '1px dashed rgba(234, 179, 8, 0.2)',
                textAlign: 'center'
              }}>
                <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1.6, fontWeight: 600 }}>
                  {progress >= 100
                    ? "🎉 Amazing! You've reached your savings goal!"
                    : `Keep going! You're only ${Math.max(0, goal.targetAmount - totalSaved).toLocaleString()} ETB away from your target.`}
                </p>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
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
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M12 8v4l3 3" /></svg>
              </div>
              <h3 style={{ color: 'var(--text-primary)', fontWeight: 900, fontSize: '1.5rem', margin: 0 }}>No Goal Set</h3>
              <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem', fontWeight: 600 }}>Set a savings goal to start tracking your progress!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
