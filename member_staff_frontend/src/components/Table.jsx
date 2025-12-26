import React from 'react'

export default function Table({columns, data}){
  return (
    <table className="table card">
      <thead>
        <tr>{columns.map((c,idx)=>(<th key={idx}>{c}</th>))}</tr>
      </thead>
      <tbody>
        {data.length===0 && (
          <tr><td colSpan={columns.length} className="small muted">No records found</td></tr>
        )}
        {data.map((row, i)=> (
          <tr key={i} className="table-row">{
            columns.map((c,idx)=>{
              const key = c.toLowerCase()
              const val = row[key]
              if(key === 'payment' || key === 'payment method'){
                return (
                  <td key={idx}>
                    <div style={{display:'flex',alignItems:'center',gap:8}}>
                      <div className={`payment-icon ${String(val).toLowerCase().includes('tele')? 'telebirr': String(val).toLowerCase().includes('bank')? 'bank':'cash'}`}>{String(val||'').charAt(0).toUpperCase()}</div>
                      <div className="small">{val}</div>
                    </div>
                  </td>
                )
              }
              // render currency numbers with thousands separator if number
              if(typeof val === 'number'){
                return (<td key={idx}>{val.toLocaleString()}</td>)
              }
              return (<td key={idx}>{val ?? ''}</td>)
            })
          }</tr>
        ))}
      </tbody>
    </table>
  )
}
