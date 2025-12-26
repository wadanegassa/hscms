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
import Unauthorized from './pages/Unauthorized';
import PrivateRoute from './routes/PrivateRoute';
import { useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

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
            <Route path="/reports" element={<Reports />} />
            <Route path="/audit-logs" element={<AuditLogs />} />
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
