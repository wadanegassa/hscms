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
    <div className="fade-in">
      <div className="mb-8">
        <h2 className="page-title">System Settings</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Configure global parameters for loans and savings.</p>
      </div>

      {message.text && (
        <div className={`fade-in mb-6`} style={{
          padding: '1rem',
          borderRadius: '12px',
          background: message.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
          color: message.type === 'success' ? 'var(--success)' : 'var(--danger)',
          border: `1px solid ${message.type === 'success' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`,
          fontWeight: 600,
          textAlign: 'center'
        }}>
          {message.text}
        </div>
      )}

      <div className="card mb-8">
        <h3 className="section-title" style={{ marginBottom: '1.5rem' }}>Loan & Eligibility Parameters</h3>
        <form onSubmit={handleUpdate}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
            <div className="input-group">
              <label className="label">Loan Interest Rate (%)</label>
              <input
                className="input"
                type="number"
                step="0.1"
                value={settings.interestRate}
                onChange={e => setSettings({ ...settings, interestRate: parseFloat(e.target.value) })}
                required
              />
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>Annual interest rate applied to all new loans.</p>
            </div>
            <div className="input-group">
              <label className="label">Eligibility Multiplier</label>
              <input
                className="input"
                type="number"
                step="0.1"
                value={settings.loanMultiplier}
                onChange={e => setSettings({ ...settings, loanMultiplier: parseFloat(e.target.value) })}
                required
              />
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>Max loan amount = Total Savings × Multiplier.</p>
            </div>
            <div className="input-group">
              <label className="label">Min Savings for Loan (ETB)</label>
              <input
                className="input"
                type="number"
                value={settings.minSavingsForLoan}
                onChange={e => setSettings({ ...settings, minSavingsForLoan: parseInt(e.target.value) })}
                required
              />
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>Minimum balance required to apply for a loan.</p>
            </div>
          </div>
          <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
            <button className="btn btn-primary" type="submit" disabled={saving}>
              {saving ? 'Saving...' : 'Save System Parameters'}
            </button>
          </div>
        </form>
      </div>

      <div className="card" style={{ maxWidth: '500px' }}>
        <h3 className="section-title" style={{ marginBottom: '1.5rem' }}>Security</h3>
        <div className="input-group mb-4">
          <label className="label">Admin Password</label>
          <input className="input" type="password" placeholder="Current password" />
        </div>
        <div className="input-group mb-4">
          <input className="input" type="password" placeholder="New password" />
        </div>
        <div className="input-group mb-6">
          <input className="input" type="password" placeholder="Confirm new password" />
        </div>
        <button className="btn btn-secondary" style={{ width: '100%' }}>Update Admin Password</button>
      </div>
    </div>
  );
};

export default Settings;
