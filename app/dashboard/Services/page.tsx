'use client'

import { useState, useEffect } from 'react'

interface Service {
  id: string
  name: string
  status: 'OPERATIONAL' | 'DEGRADED' | 'PARTIAL_OUTAGE' | 'MAJOR_OUTAGE'
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [name, setName] = useState('')
  const [status, setStatus] = useState('OPERATIONAL')

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
      case 'OPERATIONAL': return 'bg-green-500'
      case 'DEGRADED': return 'bg-yellow-500'
      case 'PARTIAL_OUTAGE': return 'bg-orange-500'
      case 'MAJOR_OUTAGE': return 'bg-red-500'
      default: return 'bg-gray-500'
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
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">🔧 Manage Services</h1>
        <p className="text-gray-600">Add and manage your service status</p>
      </div>

      {/* Add Service Form */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Add New Service</h2>
        
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-64">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Service Name
            </label>
            <input
              type="text"
              placeholder="Enter service name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="min-w-48">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select 
              value={status} 
              onChange={(e) => setStatus(e.target.value)} 
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="OPERATIONAL">🟢 Operational</option>
              <option value="DEGRADED">🟠 Degraded</option>
              <option value="PARTIAL_OUTAGE">🟡 Partial Outage</option>
              <option value="MAJOR_OUTAGE">🔴 Major Outage</option>
            </select>
          </div>

          <button 
            onClick={createService} 
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors font-medium"
          >
            + Add Service
          </button>
        </div>
      </div>

      {/* Services List */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Current Services</h2>
        </div>
        
        <div className="divide-y divide-gray-200">
          {services.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No services found. Add your first service above.
            </div>
          ) : (
            services.map((service) => (
              <div key={service.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(service.status)}`}></div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-800">{service.name}</h3>
                      <p className="text-sm text-gray-600">Status: {getStatusText(service.status)}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      service.status === 'OPERATIONAL' ? 'bg-green-100 text-green-800' :
                      service.status === 'DEGRADED' ? 'bg-yellow-100 text-yellow-800' :
                      service.status === 'PARTIAL_OUTAGE' ? 'bg-orange-100 text-orange-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {getStatusText(service.status)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
