'use client'

import Link from "next/link"
import { SignOutButton } from "@clerk/nextjs"
import { useState } from "react"

export default function DashboardLayoutClient({
  children,
}: {
  children: React.ReactNode
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile menu button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="bg-white p-2 rounded-lg shadow-lg"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Sidebar */}
      <div className={`fixed md:relative inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-in-out`}>
        <div className="p-4 sm:p-6">
          <h1 className="text-lg sm:text-xl font-bold text-gray-800">Status Page</h1>
        </div>
        
        <nav className="mt-4 sm:mt-6">
          <div className="px-2 sm:px-4 space-y-1 sm:space-y-2">
            <Link 
              href="/dashboard" 
              className="flex items-center px-3 sm:px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors text-sm sm:text-base"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="mr-2 sm:mr-3">📊</span>
              Dashboard
            </Link>
            
            <Link 
              href="/dashboard/Services" 
              className="flex items-center px-3 sm:px-4 py-2 text-blue-600 bg-blue-50 rounded-lg font-medium text-sm sm:text-base"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="mr-2 sm:mr-3">🔧</span>
              Services
            </Link>
            
            <Link 
              href="/dashboard/incidents" 
              className="flex items-center px-3 sm:px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors text-sm sm:text-base"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="mr-2 sm:mr-3">🚨</span>
              Incidents
            </Link>
            
            <div className="pt-3 sm:pt-4 border-t border-gray-200">
              <SignOutButton>
                <button className="flex items-center w-full px-3 sm:px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors text-sm sm:text-base">
                  <span className="mr-2 sm:mr-3">🚪</span>
                  Logout
                </button>
              </SignOutButton>
            </div>
          </div>
        </nav>
      </div>

      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 overflow-auto md:ml-0">
        {children}
      </div>
    </div>
  )
} 