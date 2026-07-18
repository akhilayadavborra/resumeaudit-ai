import React from "react";

export default function Input({ icon: Icon, className = "", ...props }) {
  return (
    <div className="relative">
      {Icon && <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />}
      <input {...props} className={`input-field ${Icon ? "pl-11" : ""} ${className}`} />
    </div>
  );
}