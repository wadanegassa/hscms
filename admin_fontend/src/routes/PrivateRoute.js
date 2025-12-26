import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import auth from '../services/auth';

// Admin-only guard
const PrivateRoute = () => {
  const token = auth.getToken();
  if(!token) return <Navigate to="/login" replace />;
  const user = auth.getProfile();
  if(!user || user.role!=='admin'){
    return <Navigate to="/unauthorized" replace />;
  }
  return <Outlet />;
}

export default PrivateRoute;
