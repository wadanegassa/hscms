import React, { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import { Navigate } from 'react-router-dom'

export default function ProtectedRoute({role, children}){
  const { user, loading } = useContext(AuthContext)
  if(loading) return <div style={{padding:40}}>Loading...</div>
  if(!user) return <Navigate to="/login" replace />
  if(role && user.role !== role) return <Navigate to="/unauthorized" replace />
  return children
}
