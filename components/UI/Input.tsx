import React, { InputHTMLAttributes, ForwardedRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', ...props }, ref: ForwardedRef<HTMLInputElement>) => (
    <input
      ref={ref}
      className={`bg-white/60 backdrop-blur-glass rounded-lg border border-primary/20 px-4 py-2 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition ${className}`}
      {...props}
    />
  )
);
Input.displayName = 'Input'; 