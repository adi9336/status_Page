import React from 'react';
import Link from 'next/link';
import { FaUser, FaHome, FaBell, FaCog } from 'react-icons/fa';
import { UserButton } from '@clerk/nextjs';
import '../../app/globals.css';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex bg-gradient-to-br from-primary/10 via-white to-primary/5 font-sans">
      {/* Sidebar */}
      <aside className="w-64 p-6 flex flex-col gap-6 glass-card min-h-screen sticky top-0 z-20">
        <div className="flex items-center gap-3 mb-8">
          <span className="text-3xl font-bold text-primary">Statusly</span>
        </div>
        <nav className="flex flex-col gap-4 text-lg">
          <Link href="/dashboard" className="flex items-center gap-3 text-primary hover:underline">
            <FaHome /> Dashboard
          </Link>
          <Link href="/dashboard/incidents" className="flex items-center gap-3 text-primary hover:underline">
            <FaBell /> Incidents
          </Link>
          <Link href="/dashboard/Services" className="flex items-center gap-3 text-primary hover:underline">
            <FaCog /> Services
          </Link>
          <Link href="/dashboard/users" className="flex items-center gap-3 text-primary hover:underline">
            <FaUser /> Users
          </Link>
        </nav>
        <div className="mt-auto">
          <UserButton afterSignOutUrl="/" />
        </div>
      </aside>
      {/* Main Content */}
      <main className="flex-1 p-8">
        {/* Header */}
        <header className="glass-panel flex items-center justify-between mb-8 p-6">
          <h1 className="text-2xl font-bold text-primary tracking-tight">Dashboard</h1>
          <UserButton />
        </header>
        <div className="space-y-8">{children}</div>
      </main>
    </div>
  );
} 