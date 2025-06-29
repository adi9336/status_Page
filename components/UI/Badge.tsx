import React from 'react';

export function Badge({ children, className = '', variant = 'default', ...props }) {
  const base = 'inline-block rounded-full px-3 py-1 font-semibold text-sm';
  const color =
    variant === 'secondary'
      ? 'bg-gray-100 text-gray-700'
      : 'bg-primary/10 text-primary';
  return (
    <span className={`${base} ${color} ${className}`} {...props}>
      {children}
    </span>
  );
} 