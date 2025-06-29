'use client'

import { useState, useEffect } from 'react'
import { FaPlus, FaClock, FaComment } from 'react-icons/fa'
import { motion, AnimatePresence } from 'framer-motion'

interface IncidentUpdate {
  id: string
  content: string
  createdAt: string
}

interface IncidentUpdatesProps {
  incidentId: string
  initialUpdates?: IncidentUpdate[]
}

export default function IncidentUpdates({ incidentId, initialUpdates = [] }: IncidentUpdatesProps) {
  const [updates, setUpdates] = useState<IncidentUpdate[]>(initialUpdates)
  const [newUpdate, setNewUpdate] = useState('')
  const [isAdding, setIsAdding] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)

  const fetchUpdates = async () => {
    try {
      const response = await fetch(`/api/incidents/${incidentId}/updates`)
      if (response.ok) {
        const data = await response.json()
        setUpdates(data)
      }
    } catch (error) {
      console.error('Failed to fetch updates:', error)
    }
  }

  useEffect(() => {
    fetchUpdates()
  }, [incidentId])

  const addUpdate = async () => {
    if (!newUpdate.trim()) return

    setIsAdding(true)
    try {
      const response = await fetch(`/api/incidents/${incidentId}/updates`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newUpdate }),
      })

      if (response.ok) {
        const newUpdateData = await response.json()
        setUpdates(prev => [newUpdateData, ...prev])
        setNewUpdate('')
        setShowAddForm(false)
      }
    } catch (error) {
      console.error('Failed to add update:', error)
    } finally {
      setIsAdding(false)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <FaComment className="text-blue-500" />
            Incident Updates
          </h3>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-gradient-to-r from-blue-500 to-green-400 text-white px-4 py-2 rounded-full hover:from-blue-600 hover:to-green-500 transition-colors text-sm font-semibold flex items-center gap-2 shadow"
          >
            <FaPlus className="w-3 h-3" />
            Add Update
          </button>
        </div>
      </div>

      {/* Add Update Form */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="p-4 border-b border-gray-100 bg-gray-50"
          >
            <div className="space-y-3">
              <textarea
                value={newUpdate}
                onChange={(e) => setNewUpdate(e.target.value)}
                placeholder="Enter update details (e.g., 'We are investigating the issue...')"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-sm resize-none"
                rows={3}
                style={{ color: '#000' }}
              />
              <div className="flex gap-2">
                <button
                  onClick={addUpdate}
                  disabled={isAdding || !newUpdate.trim()}
                  className="bg-gradient-to-r from-blue-500 to-green-400 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-green-500 transition-colors text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isAdding ? 'Adding...' : 'Add Update'}
                </button>
                <button
                  onClick={() => {
                    setShowAddForm(false)
                    setNewUpdate('')
                  }}
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors text-sm font-semibold"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Updates List */}
      <div className="divide-y divide-gray-100">
        {updates.length === 0 ? (
          <div className="p-6 text-center text-gray-400 text-sm">
            No updates yet. Add the first update above.
          </div>
        ) : (
          updates.map((update, index) => (
            <motion.div
              key={update.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <div className="flex-1 min-w-0">
                  <p className="text-gray-800 text-sm leading-relaxed">{update.content}</p>
                  <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                    <FaClock className="w-3 h-3" />
                    {new Date(update.createdAt).toLocaleString()}
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  )
} 