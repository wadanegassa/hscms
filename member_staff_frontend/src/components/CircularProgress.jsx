import React from 'react'

export default function CircularProgress({size=96, stroke=8, value=0, color='var(--secondary)', bg='#f0f7f5'}){
  const pct = Math.max(0, Math.min(100, value))
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const dash = (pct/100) * circumference
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <defs>
        <linearGradient id="grad" x1="0%" x2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.9" />
          <stop offset="100%" stopColor={color} stopOpacity="0.7" />
        </linearGradient>
      </defs>
      <g transform={`translate(${size/2},${size/2})`}>
        <circle r={radius} fill="none" stroke={bg} strokeWidth={stroke} />
        <circle r={radius} fill="none" stroke="url(#grad)" strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={`${dash} ${circumference - dash}`} strokeDashoffset={-circumference * 0.25} style={{transition:'stroke-dasharray 600ms ease'}} />
        <text x="0" y="4" textAnchor="middle" style={{fontSize:14, fontWeight:700, fill:'var(--text)'}}>{pct}%</text>
      </g>
    </svg>
  )
}
