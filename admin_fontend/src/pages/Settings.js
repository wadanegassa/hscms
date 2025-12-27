import React, { useState, useEffect } from 'react';
import api from '../services/api';

const Settings = () => {
  const [settings, setSettings] = useState({
    loanMultiplier: 1.2,
    interestRate: 12.5,
    minSavingsForLoan: 1000
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await api.get('/admin/settings');
      if (res.data) {
        setSettings(res.data);
      }
    } catch (err) {
      console.error('Error fetching settings:', err);
      setMessage({ type: 'error', text: 'Failed to load settings' });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });
    try {
      await api.put('/admin/settings', settings);
      setMessage({ type: 'success', text: 'Settings updated successfully!' });
    } catch (err) {
      console.error('Error updating settings:', err);
      setMessage({ type: 'error', text: 'Failed to update settings' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p style={{ color: 'var(--text-secondary)', marginTop: '1rem' }}>Loading system settings...</p>
      </div>
    );
  }

  return (
    <div className="fade-in" style={{ paddingBottom: '2rem' }}>
      <header style={{ marginBottom: '3rem' }}>
        <h2 className="page-title" style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-0.03em', background: 'linear-gradient(to right, #fff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          System Configuration
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginTop: '0.5rem' }}>
          Fine-tune the core parameters of your financial ecosystem.
        </p>
      </header>

      {message.text && (
        <div className="fade-in mb-8" style={{
          padding: '1.25rem 1.5rem',
          borderRadius: '16px',
          background: message.type === 'success' ? 'rgba(0, 255, 157, 0.05)' : 'rgba(244, 63, 94, 0.05)',
          color: message.type === 'success' ? 'var(--primary)' : 'var(--danger)',
          border: `1px solid ${message.type === 'success' ? 'rgba(0, 255, 157, 0.1)' : 'rgba(244, 63, 94, 0.1)'}`,
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
        }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'currentColor' }}></div>
          {message.text}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2.5rem', alignItems: 'start' }}>
        <div className="glass-card" style={{ padding: '2.5rem', borderRadius: '24px', border: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2.5rem' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(0, 255, 157, 0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(0, 255, 157, 0.1)' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2.5">
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--text-primary)', fontWeight: 900 }}>Financial Parameters</h3>
              <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Configure loan and interest rules</p>
            </div>
          </div>

          <form onSubmit={handleUpdate} style={{ display: 'grid', gap: '2rem' }}>
            {[
              { label: 'Loan Interest Rate (%)', key: 'interestRate', type: 'number', step: '0.1', desc: 'Annual interest rate for all new loans', icon: '%' },
              { label: 'Eligibility Multiplier', key: 'loanMultiplier', type: 'number', step: '0.1', desc: 'Max loan = Total Savings × Multiplier', icon: '×' },
              { label: 'Min Savings for Loan (ETB)', key: 'minSavingsForLoan', type: 'number', step: '1', desc: 'Minimum balance required to apply', icon: 'E' }
            ].map(field => (
              <div key={field.key}>
                <label style={{ display: 'block', marginBottom: '0.75rem', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {field.label}
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    className="input"
                    type={field.type}
                    step={field.step}
                    value={settings[field.key]}
                    onChange={e => setSettings({ ...settings, [field.key]: field.type === 'number' ? parseFloat(e.target.value) : e.target.value })}
                    required
                    style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', padding: '1rem 1.25rem', borderRadius: '14px', fontWeight: 700, fontSize: '1.1rem' }}
                  />
                  <div style={{ position: 'absolute', right: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontWeight: 900, fontSize: '1.2rem', opacity: 0.3 }}>
                    {field.icon}
                  </div>
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.75rem', fontWeight: 600 }}>{field.desc}</p>
              </div>
            ))}

            <button className="btn btn-primary hover-glow" type="submit" disabled={saving} style={{
              marginTop: '1rem',
              padding: '1.1rem',
              borderRadius: '16px',
            }}>
              {saving ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
                  <div className="loading-spinner" style={{ width: '18px', height: '18px', borderWidth: '3px' }}></div>
                  Syncing...
                </div>
              ) : 'Save System Parameters'}
            </button>
          </form>
        </div>

        <div className="glass-card" style={{ padding: '2.5rem', borderRadius: '24px', border: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2.5rem' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(168, 85, 247, 0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(168, 85, 247, 0.1)' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--secondary)" strokeWidth="2.5">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--text-primary)', fontWeight: 900 }}>Security Protocol</h3>
              <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Update administrative credentials</p>
            </div>
          </div>

          <div style={{ display: 'grid', gap: '1.5rem' }}>
            {[
              { label: 'Current Password', placeholder: 'Enter current password' },
              { label: 'New Password', placeholder: 'Enter new password' },
              { label: 'Confirm New Password', placeholder: 'Repeat new password' }
            ].map((field, idx) => (
              <div key={idx}>
                <label style={{ display: 'block', marginBottom: '0.75rem', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {field.label}
                </label>
                <input
                  type="password"
                  className="input"
                  placeholder={field.placeholder}
                  style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', padding: '1rem 1.25rem', borderRadius: '14px', fontWeight: 700 }}
                />
              </div>
            ))}

            <button className="btn btn-primary hover-glow" style={{
              marginTop: '1rem',
              padding: '1.1rem',
              borderRadius: '16px',
            }}>
              Update Admin Password
            </button>
          </div>

          <div style={{ marginTop: '3rem', padding: '1.5rem', borderRadius: '16px', background: 'rgba(244, 63, 94, 0.03)', border: '1px solid rgba(244, 63, 94, 0.1)' }}>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--danger)" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
              <div>
                <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>Critical Action</div>
                <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, lineHeight: 1.5 }}>
                  Changing these settings will affect all future transactions. Proceed with extreme caution.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
