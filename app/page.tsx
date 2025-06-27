'use client'

import Link from 'next/link'
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs'
import { useState, useEffect } from 'react'

export default function Home() {
  const [statusData, setStatusData] = useState({
    totalIncidents: 0,
    totalServices: 0,
    services: [],
    incidents: []
  })
  const [loading, setLoading] = useState(false)

  const fetchStatusData = async () => {
    setLoading(true)
    try {
      const [servicesRes, incidentsRes] = await Promise.all([
        fetch('/api/services'),
        fetch('/api/incidents')
      ])
      const services = await servicesRes.json()
      const incidents = await incidentsRes.json()
      setStatusData({
        totalIncidents: incidents.length,
        totalServices: services.length,
        services: services,
        incidents: incidents
      })
    } catch (error) {
      // handle error
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStatusData()
    const interval = setInterval(fetchStatusData, 30000)
    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational': return 'bg-green-500'
      case 'degraded': return 'bg-yellow-500'
      case 'down': return 'bg-red-500'
      default: return 'bg-gray-400'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'operational': return 'Operational'
      case 'degraded': return 'Degraded'
      case 'down': return 'Down'
      default: return 'Unknown'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <span className="font-bold text-lg text-gray-900 tracking-tight">TeamStatus</span>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <a href="#status" className="text-gray-700 hover:text-blue-600 text-sm font-medium">Status</a>
            <a href="#team" className="text-gray-700 hover:text-blue-600 text-sm font-medium">Team</a>
            <a href="#support" className="text-gray-700 hover:text-blue-600 text-sm font-medium">Support</a>
          </div>
          <div className="flex items-center space-x-4">
            <SignedOut>
              <SignInButton mode="modal">
                <button className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">Sign In</button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium">Join Team</button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
              <Link href="/dashboard" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium">Dashboard</Link>
            </SignedIn>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <span className="inline-block mb-4 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">For Teams & Organizations</span>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">Team Status Dashboard</h1>
          <p className="text-lg text-gray-600 mb-8">Monitor your company's services and incidents in real time. Empower your team with transparency and control.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <SignedOut>
              <SignUpButton mode="modal">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-colors shadow-lg">Get Started</button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <Link href="/dashboard" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-colors shadow-lg">Go to Dashboard</Link>
            </SignedIn>
          </div>
        </div>
      </section>

      {/* Public Status Area */}
      <section id="status" className="py-16 bg-white border-t border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="bg-white p-6 rounded-lg shadow border flex flex-col items-center">
              <span className="text-gray-500 text-sm">Total Services</span>
              <span className="text-3xl font-bold text-blue-700 mt-2">{statusData.totalServices}</span>
            </div>
            <div className="bg-white p-6 rounded-lg shadow border flex flex-col items-center">
              <span className="text-gray-500 text-sm">Active Incidents</span>
              <span className="text-3xl font-bold text-red-600 mt-2">{statusData.totalIncidents}</span>
            </div>
            <div className="bg-white p-6 rounded-lg shadow border flex flex-col items-center">
              <span className="text-gray-500 text-sm">Uptime</span>
              <span className="text-3xl font-bold text-green-600 mt-2">
                {statusData.totalServices > 0 ? Math.round(((statusData.services.filter((s: any) => s.status === 'operational').length / statusData.totalServices) * 100)) : 0}%
              </span>
            </div>
          </div>

          {/* Service Status Grid */}
          <div className="mb-10">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Service Status</h3>
            {statusData.services.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {statusData.services.map((service: any) => (
                  <div key={service.id} className="p-4 border rounded-lg bg-gray-50 flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900">{service.name}</span>
                      <span className={`flex items-center gap-2 text-sm font-medium ${getStatusColor(service.status)} text-white px-2 py-1 rounded-full`}>
                        <span className="w-2 h-2 rounded-full bg-white/70 inline-block"></span>
                        {getStatusText(service.status)}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">{service.description}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-400 py-8">No services found.</div>
            )}
          </div>

          {/* Recent Incidents Timeline */}
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Recent Incidents</h3>
            {statusData.incidents.length > 0 ? (
              <ul className="space-y-4">
                {statusData.incidents.slice(0, 5).map((incident: any) => (
                  <li key={incident.id} className="bg-white border-l-4 border-red-500 p-4 rounded shadow-sm">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium text-gray-900">{incident.title}</span>
                      <span className="text-xs text-gray-500">{new Date(incident.createdAt).toLocaleString()}</span>
                    </div>
                    <div className="text-sm text-gray-600">{incident.description}</div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center text-gray-400 py-8">No recent incidents.</div>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-16">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-2">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <span className="font-bold text-lg">TeamStatus</span>
          </div>
          <div className="text-gray-400 text-sm">© 2024 TeamStatus. All rights reserved.</div>
        </div>
      </footer>
    </div>
  )
} 