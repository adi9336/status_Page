import React, { ReactNode, ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  className?: string;
}

export function Button({ children, className = '', type = 'button', ...props }: ButtonProps) {
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