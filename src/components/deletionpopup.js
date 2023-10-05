import React from 'react';

export default function Deletionpopup({ onCancel, onConfirm, show }) {
  return (
    <div className={`${show ? 'pop-up-container ' : 'hidden'}`}>
      <div className='pop-up'>
        <p>Are you sure you want to delete this expense?</p>
        <div className='button-container'>
          <button className='cancel-button' onClick={onCancel}>CANCEL</button>
          <button className='delete-button' onClick={onConfirm}>DELETE</button>
        </div>
      </div>
    </div>
  );
}
