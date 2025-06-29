import React from 'react';

export function Button({ children, className = '', type = 'button', ...props }) {
  return (
    <button
      type={type}
      className={`bg-primary hover:bg-primary/80 text-white px-6 py-2 rounded-full shadow-lg font-semibold transition-all duration-200 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
} 