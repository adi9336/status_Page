import React from 'react';
import DashboardLayoutClient from './DashboardLayoutClient';
import '../../app/globals.css';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardLayoutClient>
      {children}
    </DashboardLayoutClient>
  );
} 