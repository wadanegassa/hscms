import React from 'react';

const Modal = ({title, children, onClose})=>{
  return (
    <>
      <div className="overlay" onClick={onClose}></div>
      <div className="modal">
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
          <strong>{title}</strong>
          <button className="btn secondary" onClick={onClose}>Close</button>
        </div>
        <div>{children}</div>
      </div>
    </>
  );
}
export default Modal;
