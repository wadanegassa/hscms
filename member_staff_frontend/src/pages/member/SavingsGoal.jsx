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
      <div className="flex-between mb-8" style={{ alignItems: 'flex-end' }}>
        <div>
          <h2 className="page-title" style={{ marginBottom: '0.5rem', fontSize: '2rem' }}>🎯 Savings Goal</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', margin: 0 }}>
            Set targets and visualize your journey towards financial freedom.
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '2rem', alignItems: 'start' }}>
        <div className="glass-card scale-up" style={{ padding: '2.5rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '1.5rem' }}>⚙️</span> Set Your Goal
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
              <div style={{
                padding: '1rem',
                background: 'rgba(16, 185, 129, 0.05)',
                border: '1px solid rgba(16, 185, 129, 0.1)',
                color: 'var(--success)',
                borderRadius: '12px',
                marginBottom: '1.5rem',
                fontSize: '0.875rem',
                fontWeight: '600',
                textAlign: 'center'
              }}>
                ✅ {message}
              </div>
            )}

            {error && (
              <div style={{
                padding: '1rem',
                background: 'rgba(239, 68, 68, 0.05)',
                border: '1px solid rgba(239, 68, 68, 0.1)',
                color: 'var(--danger)',
                borderRadius: '12px',
                marginBottom: '1.5rem',
                fontSize: '0.875rem',
                fontWeight: '600',
                textAlign: 'center'
              }}>
                ⚠️ {error}
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary hover-glow"
              style={{ width: '100%', padding: '1rem', fontSize: '1rem' }}
            >
              Update Goal
            </button>
          </form>
        </div>

        <div className="glass-card scale-up" style={{ padding: '2.5rem', background: 'var(--bg-secondary)', border: '1px solid var(--border-bright)' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '1.5rem' }}>📈</span> Goal Progress
          </h3>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <div className="loading-spinner" style={{ margin: '0 auto' }}></div>
            </div>
          ) : goal ? (
            <div>
              <div className="flex-between mb-4">
                <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Current Progress</span>
                <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary)' }}>{progress.toFixed(1)}%</span>
              </div>

              <div style={{
                width: '100%',
                height: '16px',
                background: 'var(--bg-card)',
                borderRadius: '10px',
                overflow: 'hidden',
                marginBottom: '2rem',
                border: '1px solid var(--border)'
              }}>
                <div style={{
                  width: `${Math.min(100, progress)}%`,
                  height: '100%',
                  background: 'var(--gradient-primary)',
                  borderRadius: '10px',
                  transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: '0 0 15px rgba(59, 130, 246, 0.3)'
                }}></div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div style={{ padding: '1.25rem', background: 'var(--bg-card)', borderRadius: '16px', border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.5rem' }}>Total Saved</div>
                  <div style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--success)' }}>{totalSaved.toLocaleString()} ETB</div>
                </div>
                <div style={{ padding: '1.25rem', background: 'var(--bg-card)', borderRadius: '16px', border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.5rem' }}>Remaining</div>
                  <div style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    {Math.max(0, goal.targetAmount - totalSaved).toLocaleString()} ETB
                  </div>
                </div>
              </div>

              <div style={{
                marginTop: '2rem',
                padding: '1.5rem',
                background: 'rgba(59, 130, 246, 0.05)',
                borderRadius: '16px',
                border: '1px dashed var(--info)',
                textAlign: 'center'
              }}>
                <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9375rem', lineHeight: 1.6 }}>
                  {progress >= 100
                    ? "🎉 Amazing! You've reached your savings goal!"
                    : `Keep going! You're only ${Math.max(0, goal.targetAmount - totalSaved).toLocaleString()} ETB away from your target.`}
                </p>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏜️</div>
              <p style={{ color: 'var(--text-muted)', margin: 0 }}>Set a savings goal to start tracking your progress!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
