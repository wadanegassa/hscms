import React, {useState} from 'react';

const demoTx = [
  {id:1, member:'John Doe', amount:+2500, type:'Deposit', date:'2024-12-20', method:'Cash'},
  {id:2, member:'Sarah Williams', amount:-800, type:'Withdrawal', date:'2024-12-17', method:'Bank Transfer'},
  {id:3, member:'Emily Davis', amount:+4500, type:'Deposit', date:'2024-12-15', method:'Telebirr'},
];

const Transactions = ()=>{
  const [list] = useState(demoTx);
  return (
    <div>
      <h3>Savings Overview</h3>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
        <div style={{display:'flex',gap:8}}>
          <input className="input" placeholder="Start date" />
          <input className="input" placeholder="End date" />
          <select className="input"><option>All methods</option><option>Cash</option><option>Telebirr</option><option>Bank Transfer</option></select>
        </div>
        <div>
          <button className="btn">Export Report</button>
        </div>
      </div>

      <div className="table">
        <table>
          <thead><tr><th>Member</th><th>Amount</th><th>Type</th><th>Date</th><th>Method</th></tr></thead>
          <tbody>
            {list.map(tx=> (
              <tr key={tx.id}>
                <td>{tx.member}</td>
                <td style={{color:tx.amount>0?'#34d399':'#ff7b7b'}}>{tx.amount>0?`+$${Math.abs(tx.amount)}`:`-$${Math.abs(tx.amount)}`}</td>
                <td>{tx.type}</td>
                <td>{tx.date}</td>
                <td>{tx.method}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
export default Transactions;
