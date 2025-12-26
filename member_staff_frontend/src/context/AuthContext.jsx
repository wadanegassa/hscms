import React, { createContext, useState, useEffect } from 'react'
import api from '../services/api'
import { useNavigate } from 'react-router-dom'

export const AuthContext = createContext()

export function AuthProvider({children}){
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(()=>{
    const token = localStorage.getItem('token')
    const stored = localStorage.getItem('user')
    if(token && stored){
      setUser(JSON.parse(stored))
    }
    setLoading(false)
  },[])

  async function login({email,password}){
    const res = await api.post('/auth/login',{email,password})
    const payload = res.data?.data || res.data || {}
    const token = payload.token || payload?.token
    const userObj = payload.user || payload || {}
    const role = userObj.role
    const name = userObj.fullName || userObj.name || userObj.email || ''
    localStorage.setItem('token', token)
    const u = { role, name, email: userObj.email || email }
    localStorage.setItem('user', JSON.stringify(u))
    setUser(u)
    // redirect based on role
    if(role==='staff') navigate('/staff/dashboard')
    else navigate('/member/dashboard')
  }

  // Dev helper: set a fake user and token (useful for quick local testing)
  function devLogin({role,name,email,token='DEV_TOKEN'}){
    const u = { role, name, email }
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(u))
    setUser(u)
    if(role === 'staff') navigate('/staff/dashboard')
    else navigate('/member/dashboard')
  }

  function logout(){
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    navigate('/login')
  }

  const value = { user, loading, login, logout, devLogin }
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
