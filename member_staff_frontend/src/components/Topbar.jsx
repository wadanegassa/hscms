import React, { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'

export default function Topbar(){
  const { user, logout } = useContext(AuthContext)
  return (
    <div className="topbar">
      <div style={{display:'flex',alignItems:'center',gap:12}}>
        <a href="#sidebar" className="hamburger" aria-label="Open menu">☰</a>
        <div style={{display:'flex',flexDirection:'column'}}>
          <div style={{fontWeight:700,color:'var(--primary-dark)'}}>Harari Saving & Credit</div>
          <div className="small muted">Staff Management Portal</div>
        </div>
      </div>
      <div style={{display:'flex',gap:12,alignItems:'center'}}>
        {user && (
          <div style={{display:'flex',alignItems:'center',gap:10}}>
            <div style={{width:36,height:36,borderRadius:18,background:'linear-gradient(180deg,var(--primary),var(--primary-dark))',color:'#fff,',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700}}>{user.name?.charAt(0) || 'U'}</div>
            <div style={{textAlign:'right'}}>
              <div style={{fontSize:13,fontWeight:700}}>{user.name}</div>
              <div className="small muted">{user.role}</div>
            </div>
          </div>
        )}
        <button className="button" onClick={logout}>Logout</button>
      </div>
    </div>
  )
}
