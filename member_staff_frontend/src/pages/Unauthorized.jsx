import React from 'react'
import { Link } from 'react-router-dom'

export default function Unauthorized() {
  return (
    <div className="fade-in" style={{
      minHeight: '80vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem'
    }}>
      <div className="glass-card scale-up" style={{
        maxWidth: '500px',
        padding: '4rem 2rem',
        textAlign: 'center',
        border: '1px solid rgba(239, 68, 68, 0.2)',
        boxShadow: '0 20px 40px rgba(239, 68, 68, 0.1)'
      }}>
        <div style={{
          width: '100px',
          height: '100px',
          background: 'rgba(239, 68, 68, 0.1)',
          borderRadius: '32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 2rem',
          fontSize: '3rem'
        }}>
          🚫
        </div>

        <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1rem' }}>
          Access Denied
        </h2>

        <p style={{ color: 'var(--text-muted)', fontSize: '1.125rem', lineHeight: 1.6, marginBottom: '2.5rem' }}>
          You don't have the necessary permissions to view this page. Please contact your administrator if you believe this is an error.
        </p>

        <Link
          to="/"
          className="btn btn-primary hover-glow"
          style={{ padding: '1rem 3rem', display: 'inline-block', fontSize: '1rem' }}
        >
          Return to Safety
        </Link>
      </div>
    </div>
  )
}
