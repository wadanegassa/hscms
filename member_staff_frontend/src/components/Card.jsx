import React from 'react'

export default function Card({title, value, children, icon}){
  return (
    <div className="card animated-card">
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <div style={{display:'flex',alignItems:'center',gap:12}}>
          {icon && <div style={{width:40,height:40,borderRadius:8,background:'linear-gradient(180deg,var(--primary),var(--primary-dark))',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff'}}>{icon}</div>}
          <div>
            <div className="muted small">{title}</div>
            <div style={{fontSize:20,fontWeight:700}}>{value}</div>
          </div>
        </div>
        <div>{children}</div>
      </div>
    </div>
  )
}
