import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Dashboard from './pages/Dashboard';
import Staff from './pages/Staff';
import Members from './pages/Members';
import LoanApprovals from './pages/LoanApprovals';
import Reports from './pages/Reports';
import AuditLogs from './pages/AuditLogs';
import Login from './pages/Login';
import LoanOverview from './pages/LoanOverview';
import Users from './pages/Users';
import SearchResults from './pages/SearchResults';
import Settings from './pages/Settings';
import Transactions from './pages/Transactions';
import PrivateRoute from './routes/PrivateRoute';
import { useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

const Unauthorized = () => (
  <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-primary)' }}>
    <h1>403 - Unauthorized Access</h1>
    <p>You do not have permission to view this page.</p>
  </div>
);

function App() {
  const location = useLocation();
  const isLogin = location.pathname === '/login';

  return (
    <div className="app-shell">
      {!isLogin && <Sidebar />}
      <div className="main" style={isLogin ? { marginLeft: 0, padding: 0, width: '100%' } : {}}>
        {!isLogin && <Topbar />}
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route element={<PrivateRoute />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/staff" element={<Staff />} />
            <Route path="/members" element={<Members />} />
            <Route path="/loans" element={<LoanApprovals />} />
            <Route path="/loan-overview" element={<LoanOverview />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/users" element={<Users />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/transactions" element={<Transactions />} />
          </Route>

          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="*" element={<Navigate to={isLogin ? '/login' : '/'} />} />
        </Routes>

      </div>
      <ToastContainer theme="dark" />
    </div>
  );
}

export default App;
