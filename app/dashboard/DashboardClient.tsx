'use client'

import Link from "next/link"
import { SignOutButton } from "@clerk/nextjs"
import { FaCheckCircle, FaExclamationTriangle, FaTimesCircle, FaListAlt, FaCogs, FaBug } from 'react-icons/fa'
import { motion } from 'framer-motion'

export default function DashboardClient() {
  return (
    <div className="p-4 sm:p-8 bg-gray-100 min-h-screen">
      {/* Top Bar with Return and Sign Out */}
      <div className="flex justify-between items-center mb-6">
        <Link href="/" className="inline-block bg-white hover:bg-blue-50 text-blue-600 font-semibold px-4 py-2 rounded-full transition-colors text-sm shadow border border-gray-200">
          ← Return to Home
        </Link>
        <SignOutButton>
          <button className="bg-gradient-to-r from-blue-500 to-green-400 hover:from-blue-600 hover:to-green-500 text-white font-semibold px-6 py-2 rounded-full text-sm transition-colors shadow">Sign Out</button>
        </SignOutButton>
      </div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
        <p className="text-gray-500 text-base mt-1">Monitor your services and incidents</p>
      </div>

      {/* Status Summary Cards with Modern Design */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div whileHover={{ scale: 1.03 }} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-start border-t-4 border-green-400">
          <div className="flex items-center mb-2">
            <FaCheckCircle className="text-green-400 w-6 h-6 mr-2" />
            <span className="text-sm font-semibold text-gray-700">Operational</span>
          </div>
          <span className="text-3xl font-bold text-gray-900">2</span>
          <span className="mt-2 px-3 py-1 rounded-full bg-green-50 text-green-600 text-xs font-semibold">Healthy</span>
        </motion.div>
        <motion.div whileHover={{ scale: 1.03 }} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-start border-t-4 border-yellow-400">
          <div className="flex items-center mb-2">
            <FaExclamationTriangle className="text-yellow-400 w-6 h-6 mr-2" />
            <span className="text-sm font-semibold text-gray-700">Degraded</span>
          </div>
          <span className="text-3xl font-bold text-gray-900">1</span>
          <span className="mt-2 px-3 py-1 rounded-full bg-yellow-50 text-yellow-600 text-xs font-semibold">Attention</span>
        </motion.div>
        <motion.div whileHover={{ scale: 1.03 }} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-start border-t-4 border-red-400">
          <div className="flex items-center mb-2">
            <FaTimesCircle className="text-red-400 w-6 h-6 mr-2" />
            <span className="text-sm font-semibold text-gray-700">Down</span>
          </div>
          <span className="text-3xl font-bold text-gray-900">1</span>
          <span className="mt-2 px-3 py-1 rounded-full bg-red-50 text-red-500 text-xs font-semibold">Critical</span>
        </motion.div>
        <motion.div whileHover={{ scale: 1.03 }} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-start border-t-4 border-blue-500">
          <div className="flex items-center mb-2">
            <FaListAlt className="text-blue-500 w-6 h-6 mr-2" />
            <span className="text-sm font-semibold text-gray-700">Total</span>
          </div>
          <span className="text-3xl font-bold text-gray-900">4</span>
          <span className="mt-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-semibold">All Services</span>
        </motion.div>
      </div>

      {/* Quick Actions with Modern Design */}
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Quick Actions</h2>
          <button className="text-blue-500 text-xs font-semibold bg-blue-50 px-4 py-1 rounded-full hover:bg-blue-100 transition">View All</button>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 mt-2">
          <motion.div whileHover={{ scale: 1.03 }}>
            <Link 
              href="/dashboard/Services" 
              className="bg-gradient-to-r from-blue-500 to-green-400 text-white px-6 py-2 rounded-full hover:from-blue-600 hover:to-green-500 transition-colors text-center text-sm font-semibold shadow flex items-center gap-2"
            >
              <FaCogs className="w-4 h-4" /> Manage Services
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.03 }}>
            <Link 
              href="/dashboard/incidents" 
              className="bg-gradient-to-r from-green-400 to-blue-500 text-white px-6 py-2 rounded-full hover:from-green-500 hover:to-blue-600 transition-colors text-center text-sm font-semibold shadow flex items-center gap-2"
            >
              <FaBug className="w-4 h-4" /> View Incidents
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
} 