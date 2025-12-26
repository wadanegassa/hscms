import React, { useState, useContext } from 'react';
import Sidebar from './Sidebar';
import { AuthContext } from '../context/AuthContext';

export default function Layout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user } = useContext(AuthContext);

  if (!user) return children;

  return (
    <div className="app-shell">
      <Sidebar role={user.role} isOpen={isSidebarOpen} />



      {isSidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setIsSidebarOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.3)',
            backdropFilter: 'blur(4px)',
            zIndex: 90
          }}
        />
      )}

      <main className="main-content">
        {children}
      </main>

      <style>{`
        .app-shell {
          display: flex;
          min-height: 100vh;
          background: var(--bg);
        }
        .main-content {
          flex: 1;
          padding: 2.5rem;
          max-width: 1400px;
          margin: 0 auto;
          width: 100%;
          transition: all 0.3s ease;
        }
        @media (max-width: 1024px) {
          .main-content {
            padding: 1.5rem;
            padding-top: 5rem;
          }
        }
      `}</style>
    </div>
  );
}
