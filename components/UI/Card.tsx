import React from 'react';

export function Card({ children, className = '', ...props }) {
  return <div className={`glass-panel p-6 rounded-2xl shadow-lg ${className}`} {...props}>{children}</div>;
}

export function CardHeader({ children, className = '', ...props }) {
  return <div className={`mb-4 ${className}`} {...props}>{children}</div>;
}

export function CardTitle({ children, className = '', ...props }) {
  return <h3 className={`text-xl font-bold text-primary mb-2 ${className}`} {...props}>{children}</h3>;
}

export function CardDescription({ children, className = '', ...props }) {
  return <p className={`text-gray-600 text-base ${className}`} {...props}>{children}</p>;
}

export function CardContent({ children, className = '', ...props }) {
  return <div className={className} {...props}>{children}</div>;
} 