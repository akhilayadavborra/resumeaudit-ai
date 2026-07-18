import React from "react";

export function PrimaryButton({ children, onClick, type = "button", disabled = false, className = "" }) {
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={`btn-primary ${className}`}>
      {children}
    </button>
  );
}

export function SecondaryButton({ children, onClick, type = "button", className = "" }) {
  return (
    <button type={type} onClick={onClick} className={`btn-secondary ${className}`}>
      {children}
    </button>
  );
}