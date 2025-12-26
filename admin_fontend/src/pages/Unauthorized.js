import React from 'react';

const Unauthorized = ()=>{
  return (
    <div style={{padding:20}}>
      <div className="card">
        <h3>Unauthorized</h3>
        <p className="small-muted">You do not have permissions to access this resource.</p>
      </div>
    </div>
  );
}
export default Unauthorized;
