'use client'

import Link from "next/link"
import { SignOutButton, UserButton } from "@clerk/nextjs"
import { useState } from "react"
import NotificationBell from "@/components/NotificationBell"
import { Menu, X, BarChart2, Wrench, AlertTriangle, Users } from "lucide-react"

export default function DashboardLayoutClient({
  children,
}: {
  children: React.ReactNode
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="flex h-screen bg-gray-50 w-full font-sans">
      {/* Sidebar for desktop only */}
      <div className="hidden md:flex md:flex-col md:w-64 bg-white shadow-lg">
        <div className="p-4 sm:p-6 border-b">
          <h1 className="text-xl font-bold text-gray-800">Statusly</h1>
        </div>
        <nav className="mt-4 sm:mt-6 flex-grow">
          <div className="px-2 sm:px-4 space-y-1 sm:space-y-2">
            <Link href="/dashboard" className="flex items-center px-3 sm:px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors text-sm sm:text-base">
              <BarChart2 className="mr-2 sm:mr-3 h-5 w-5" /> Dashboard
            </Link>
            <Link href="/dashboard/Services" className="flex items-center px-3 sm:px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium text-sm sm:text-base">
              <Wrench className="mr-2 sm:mr-3 h-5 w-5" /> Services
            </Link>
            <Link href="/dashboard/incidents" className="flex items-center px-3 sm:px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors text-sm sm:text-base">
              <AlertTriangle className="mr-2 sm:mr-3 h-5 w-5" /> Incidents
            </Link>
            <Link href="/dashboard/users" className="flex items-center px-3 sm:px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors text-sm sm:text-base">
              <Users className="mr-2 sm:mr-3 h-5 w-5" /> Users
            </Link>
          </div>
        </nav>
        <div className="p-4 border-t">
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-auto">
        {/* Top nav for mobile & header for desktop */}
        <header className="md:hidden sticky top-0 bg-white/80 backdrop-blur-md shadow-sm z-30 flex items-center justify-between px-4 py-3">
          <h1 className="text-lg font-bold text-gray-800">Statusly</h1>
          <div className="flex items-center gap-3">
            <NotificationBell />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </header>

        {/* Desktop Header */}
        <header className="hidden md:flex sticky top-0 bg-white/80 backdrop-blur-md z-10 items-center justify-end p-4 border-b">
          <div className="flex items-center gap-4">
            <NotificationBell />
            <UserButton afterSignOutUrl="/" />
          </div>
        </header>

        {/* Mobile dropdown nav */}
        {mobileMenuOpen && (
          <div className="md:hidden fixed top-16 left-0 w-full bg-white shadow-lg z-20 flex flex-col gap-2 p-4 animate-fade-in">
            <Link href="/dashboard" className="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg text-base font-medium" onClick={() => setMobileMenuOpen(false)}>
              <BarChart2 className="mr-3 h-5 w-5" /> Dashboard
            </Link>
            <Link href="/dashboard/Services" className="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium text-base" onClick={() => setMobileMenuOpen(false)}>
              <Wrench className="mr-3 h-5 w-5" /> Services
            </Link>
            <Link href="/dashboard/incidents" className="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg text-base font-medium" onClick={() => setMobileMenuOpen(false)}>
              <AlertTriangle className="mr-3 h-5 w-5" /> Incidents
            </Link>
            <Link href="/dashboard/users" className="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg text-base font-medium" onClick={() => setMobileMenuOpen(false)}>
              <Users className="mr-3 h-5 w-5" /> Users
            </Link>
            <div className="pt-2 border-t border-gray-200 mt-2">
              <SignOutButton>
                <button className="flex items-center w-full px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg text-base font-medium">
                  <span className="mr-3">🚪</span> Logout
                </button>
              </SignOutButton>
            </div>
          </div>
        )}

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
} 