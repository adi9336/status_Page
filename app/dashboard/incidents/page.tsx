'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Service {
  id: string
  name: string
}

interface Incident {
  id: string
  title: string
  status: 'OPEN' | 'RESOLVED' | 'SCHEDULED_MAINTENANCE'
  service?: Service
  createdAt: string
}

export default function IncidentsPage() {
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [services, setServices] = useState<Service[]>([])

  const [title, setTitle] = useState('')
  const [status, setStatus] = useState('OPEN')
  const [serviceId, setServiceId] = useState('')

  const fetchData = async () => {
    try {
      const [iRes, sRes] = await Promise.all([
        fetch('/api/incidents'),
        fetch('/api/services'),
      ])
      setIncidents(await iRes.json())
      setServices(await sRes.json())
    } catch (error) {
      console.error('Failed to fetch data:', error)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const createIncident = async () => {
    if (!title.trim() || !serviceId) return
    
    try {
      await fetch('/api/incidents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, status, serviceId }),
      })
      setTitle('')
      setStatus('OPEN')
      setServiceId('')
      fetchData()
    } catch (error) {
      console.error('Failed to create incident:', error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPEN': return 'bg-red-500'
      case 'RESOLVED': return 'bg-green-500'
      case 'SCHEDULED_MAINTENANCE': return 'bg-blue-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'OPEN': return 'Open'
      case 'RESOLVED': return 'Resolved'
      case 'SCHEDULED_MAINTENANCE': return 'Scheduled Maintenance'
      default: return status
    }
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">🚨 Manage Incidents</h1>
        <p className="text-gray-600">Create and track service incidents</p>
      </div>

      {/* Create Incident Form */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Create New Incident</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Incident Title
            </label>
            <input
              type="text"
              placeholder="Enter incident title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select 
              value={status} 
              onChange={(e) => setStatus(e.target.value)} 
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="OPEN">🔴 Open</option>
              <option value="RESOLVED">🟢 Resolved</option>
              <option value="SCHEDULED_MAINTENANCE">🔵 Scheduled Maintenance</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Service
            </label>
            <select 
              value={serviceId} 
              onChange={(e) => setServiceId(e.target.value)} 
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="">Select Service</option>
              {services.map((service) => (
                <option key={service.id} value={service.id}>{service.name}</option>
              ))}
            </select>
          </div>

          <button 
            onClick={createIncident} 
            className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors font-medium"
          >
            Create Incident
          </button>
        </div>
      </div>

      {/* Incidents List */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Current Incidents</h2>
        </div>
        
        <div className="divide-y divide-gray-200">
          {incidents.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No incidents found. Create your first incident above.
            </div>
          ) : (
            incidents.map((incident) => (
              <div key={incident.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(incident.status)}`}></div>
                      <h3 className="text-lg font-medium text-gray-800">{incident.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        incident.status === 'OPEN' ? 'bg-red-100 text-red-800' :
                        incident.status === 'RESOLVED' ? 'bg-green-100 text-green-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {getStatusText(incident.status)}
                      </span>
                    </div>
                    
                    <div className="text-sm text-gray-600 space-y-1">
                      <p><strong>Service:</strong> {incident.service?.name || 'Unknown'}</p>
                      <p><strong>Created:</strong> {new Date(incident.createdAt).toLocaleString()}</p>
                    </div>
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
