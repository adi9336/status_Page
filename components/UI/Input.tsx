import React from 'react';

export const Input = React.forwardRef(({ className = '', ...props }, ref) => (
  <input
    ref={ref}
    className={`bg-white/60 backdrop-blur-glass rounded-lg border border-primary/20 px-4 py-2 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition ${className}`}
    {...props}
  />
));
Input.displayName = 'Input'; 