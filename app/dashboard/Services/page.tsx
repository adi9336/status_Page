'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { FaPlus, FaServer } from 'react-icons/fa'
import { useRouter } from 'next/navigation'

interface Service {
  id: string
  name: string
  status: 'OPERATIONAL' | 'DEGRADED' | 'PARTIAL_OUTAGE' | 'MAJOR_OUTAGE'
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [name, setName] = useState('')
  const [status, setStatus] = useState('OPERATIONAL')
  const router = useRouter()

  const fetchServices = async () => {
    try {
      const res = await fetch('/api/services')
      const data = await res.json()
      setServices(data)
    } catch (error) {
      console.error('Failed to fetch services:', error)
    }
  }

  useEffect(() => {
    fetchServices()
  }, [])

  const createService = async () => {
    if (!name.trim()) return
    try {
      await fetch('/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, status }),
      })
      setName('')
      setStatus('OPERATIONAL')
      fetchServices()
    } catch (error) {
      console.error('Failed to create service:', error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPERATIONAL': return 'bg-green-400 text-green-800'
      case 'DEGRADED': return 'bg-yellow-300 text-yellow-900'
      case 'PARTIAL_OUTAGE': return 'bg-orange-300 text-orange-900'
      case 'MAJOR_OUTAGE': return 'bg-red-400 text-red-800'
      default: return 'bg-gray-200 text-gray-700'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'OPERATIONAL': return 'Operational'
      case 'DEGRADED': return 'Degraded'
      case 'PARTIAL_OUTAGE': return 'Partial Outage'
      case 'MAJOR_OUTAGE': return 'Major Outage'
      default: return status
    }
  }

  return (
    <div className="p-2 sm:p-4 md:p-8 bg-gray-100 min-h-screen w-full">
      {/* Return Button */}
      <div className="mb-4 sm:mb-6">
        <button
          onClick={() => router.push('/')}
          className="inline-block bg-white hover:bg-blue-50 text-blue-600 font-semibold px-4 py-2 rounded-full transition-colors text-sm shadow border border-gray-200"
        >
          ← Return to Dashboard
        </button>
      </div>
      <div className="mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800 flex items-center gap-2"><FaServer className="text-blue-500" /> Manage Services</h1>
        <p className="text-gray-500 text-sm sm:text-base mt-1">Add and manage your service status</p>
      </div>

      {/* Add Service Form */}
      <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 mb-6 sm:mb-8">
        <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-2 sm:mb-4">Add New Service</h2>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-end">
          <div className="flex-1 min-w-0">
            <label className="block text-sm font-medium text-gray-700 mb-2">Service Name</label>
            <input
              type="text"
              placeholder="Enter service name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-sm"
              style={{ color: '#000' }}
            />
          </div>
          <div className="w-full sm:w-auto sm:min-w-48">
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select 
              value={status} 
              onChange={(e) => setStatus(e.target.value)} 
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-sm"
              style={{ color: '#000' }}
            >
              <option value="OPERATIONAL" style={{ color: '#000' }}>🟢 Operational</option>
              <option value="DEGRADED" style={{ color: '#000' }}>🟠 Degraded</option>
              <option value="PARTIAL_OUTAGE" style={{ color: '#000' }}>🟡 Partial Outage</option>
              <option value="MAJOR_OUTAGE" style={{ color: '#000' }}>🔴 Major Outage</option>
            </select>
          </div>
          <button 
            onClick={createService} 
            className="bg-gradient-to-r from-blue-500 to-green-400 text-white px-6 py-2 rounded-full hover:from-blue-600 hover:to-green-500 transition-colors font-semibold flex items-center gap-2 shadow"
          >
            <FaPlus /> Add Service
          </button>
        </div>
      </div>

      {/* Services List */}
      <div className="bg-white rounded-2xl shadow-lg overflow-x-auto">
        <div className="p-4 sm:p-6 border-b border-gray-100">
          <h2 className="text-base sm:text-lg font-semibold text-gray-800">Current Services</h2>
        </div>
        <div className="divide-y divide-gray-100 min-w-[320px]">
          {services.length === 0 ? (
            <div className="p-6 text-center text-gray-400 text-base">No services found. Add your first service above.</div>
          ) : (
            services.map((service) => (
              <div key={service.id} className="p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(service.status)} bg-opacity-20`}>{getStatusText(service.status)}</span>
                  <span className="font-medium text-gray-800 text-base">{service.name}</span>
                </div>
                <span className={`px-4 py-1 rounded-full text-xs font-semibold ${getStatusColor(service.status)} bg-opacity-20`}>{getStatusText(service.status)}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
