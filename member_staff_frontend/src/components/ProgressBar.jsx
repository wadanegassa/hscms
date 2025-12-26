import React from 'react'

export default function ProgressBar({value=0, height=12, color='var(--secondary)', bg='#e6eef0'}){
  const pct = Math.max(0, Math.min(100, Math.round(value)))
  return (
    <div style={{width:'100%'}}>
      <div style={{background:bg,borderRadius:999,height,overflow:'hidden'}}>
        <div style={{width:`${pct}%`,height:'100%',background:color,transition:'width 600ms ease'}} />
      </div>
      <div className="small muted" style={{marginTop:6}}>{pct}%</div>
    </div>
  )
}
