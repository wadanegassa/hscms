import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Unauthorized from './pages/Unauthorized'
import StaffDashboard from './pages/staff/Dashboard'
import RegisterMember from './pages/staff/RegisterMember'
import StaffSavings from './pages/staff/Savings'
import StaffLoans from './pages/staff/Loans'
import StaffRepayments from './pages/staff/Repayments'
import MemberDashboard from './pages/member/Dashboard'
import MySavings from './pages/member/MySavings'
import MyLoans from './pages/member/MyLoans'
import ApplyLoan from './pages/member/ApplyLoan'
import SavingsGoal from './pages/member/SavingsGoal'
import LoanEligibility from './pages/member/LoanEligibility'
import Profile from './pages/member/Profile'
import Notifications from './pages/member/Notifications'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/Layout'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      <Route path="/staff/*" element={
        <ProtectedRoute role="staff">
          <Layout>
            <StaffRoutes />
          </Layout>
        </ProtectedRoute>
      } />

      <Route path="/member/*" element={
        <ProtectedRoute role="member">
          <Layout>
            <MemberRoutes />
          </Layout>
        </ProtectedRoute>
      } />

      <Route path="*" element={<div style={{ padding: 40 }}>Page not found</div>} />
    </Routes>
  )
}

function StaffRoutes() {
  return (
    <Routes>
      <Route path="dashboard" element={<StaffDashboard />} />
      <Route path="register-member" element={<RegisterMember />} />
      <Route path="savings" element={<StaffSavings />} />
      <Route path="loans" element={<StaffLoans />} />
      <Route path="repayments" element={<StaffRepayments />} />
      <Route path="profile" element={<Profile />} />
      <Route path="" element={<Navigate to="dashboard" replace />} />
    </Routes>
  )
}

function MemberRoutes() {
  return (
    <Routes>
      <Route path="dashboard" element={<MemberDashboard />} />
      <Route path="my-savings" element={<MySavings />} />
      <Route path="savings-goal" element={<SavingsGoal />} />
      <Route path="loan-eligibility" element={<LoanEligibility />} />
      <Route path="my-loans" element={<MyLoans />} />
      <Route path="apply-loan" element={<ApplyLoan />} />
      <Route path="profile" element={<Profile />} />
      <Route path="notifications" element={<Notifications />} />
      <Route path="" element={<Navigate to="dashboard" replace />} />
    </Routes>
  )
}
