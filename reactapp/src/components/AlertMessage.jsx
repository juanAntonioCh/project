import React from 'react';

export const AlertMessage = ({ type, message, handleCloseAlert }) => {
  if (!message) return null;

  let alertClass = '';
  switch (type) {
    case 'success':
      alertClass = 'alert-success';
      break;
    case 'danger':
      alertClass = 'alert-danger';
      break;
    case 'warning':
      alertClass = 'alert-warning';
      break;
    default:
      alertClass = 'alert-secondary';
  }

  return (
    <div className="alert-container text-center pt-1">
      <div className={`alert ${alertClass} alert-dismissible fade show`} role="alert">
        <strong>{message}</strong>
        <button type="button" className="btn-close login-alert-button" onClick={handleCloseAlert} aria-label="Close"></button>
      </div>
    </div>
  );
};

