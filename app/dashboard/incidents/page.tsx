'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { FaPlus, FaExclamationCircle } from 'react-icons/fa'

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
      case 'OPEN': return 'bg-red-400 text-red-800'
      case 'RESOLVED': return 'bg-green-400 text-green-800'
      case 'SCHEDULED_MAINTENANCE': return 'bg-blue-400 text-blue-800'
      default: return 'bg-gray-200 text-gray-700'
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
    <div className="p-4 sm:p-8 bg-gray-100 min-h-screen">
      {/* Return Button */}
      <div className="mb-6">
        <Link href="/dashboard" className="inline-block bg-white hover:bg-blue-50 text-blue-600 font-semibold px-4 py-2 rounded-full transition-colors text-sm shadow border border-gray-200">
          ← Return to Dashboard
        </Link>
      </div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2"><FaExclamationCircle className="text-red-400" /> Manage Incidents</h1>
        <p className="text-gray-500 text-base mt-1">Create and track service incidents</p>
      </div>

      {/* Create Incident Form */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Create New Incident</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Incident Title</label>
            <input
              type="text"
              placeholder="Enter incident title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent text-sm"
              style={{ color: '#000' }}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent text-sm"
              style={{ color: '#000' }}
            >
              <option value="OPEN" style={{ color: '#000' }}>🔴 Open</option>
              <option value="RESOLVED" style={{ color: '#000' }}>🟢 Resolved</option>
              <option value="SCHEDULED_MAINTENANCE" style={{ color: '#000' }}>🔵 Scheduled Maintenance</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Service</label>
            <select
              value={serviceId}
              onChange={(e) => setServiceId(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent text-sm"
              style={{ color: '#000' }}
            >
              <option value="" style={{ color: '#000' }}>Select Service</option>
              {services.map((service) => (
                <option key={service.id} value={service.id} style={{ color: '#000' }}>{service.name}</option>
              ))}
            </select>
          </div>
          <button
            onClick={createIncident}
            className="bg-gradient-to-r from-red-400 to-blue-400 text-white px-6 py-2 rounded-full hover:from-red-500 hover:to-blue-500 transition-colors font-semibold flex items-center gap-2 shadow"
          >
            <FaPlus /> Create Incident
          </button>
        </div>
      </div>

      {/* Incidents List */}
      <div className="bg-white rounded-2xl shadow-lg">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">Recent Incidents</h2>
        </div>
        <div className="divide-y divide-gray-100">
          {incidents.length === 0 ? (
            <div className="p-6 text-center text-gray-400 text-base">No incidents found. Create your first incident above.</div>
          ) : (
            incidents.map((incident) => (
              <div key={incident.id} className="p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(incident.status)} bg-opacity-20`}>{getStatusText(incident.status)}</span>
                  <span className="font-medium text-gray-800 text-base">{incident.title}</span>
                  {incident.service && (
                    <span className="ml-2 px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-semibold">{incident.service.name}</span>
                  )}
                </div>
                <span className="text-xs text-gray-400">{new Date(incident.createdAt).toLocaleString()}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
