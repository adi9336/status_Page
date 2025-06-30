'use client'

import { useEffect, useState } from "react"
import Link from "next/link"
import { SignOutButton } from "@clerk/nextjs"
import { FaCheckCircle, FaExclamationTriangle, FaTimesCircle, FaListAlt, FaCogs, FaBug, FaUsers, FaClock, FaBell, FaChartLine } from 'react-icons/fa'
import { motion } from 'framer-motion'
import NotificationBell from '../../components/NotificationBell'
import { useRouter } from 'next/navigation'

interface Service {
  id: string;
  name: string;
  status: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

interface Incident {
  id: string;
  title: string;
  status: string;
  severity: string;
  serviceId: string;
  createdAt: string;
  updatedAt: string;
}

interface User {
  id: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

interface DashboardStats {
  totalServices: number;
  operationalServices: number;
  degradedServices: number;
  downServices: number;
  totalIncidents: number;
  activeIncidents: number;
  resolvedIncidents: number;
  totalUsers: number;
  activeUsers: number;
  recentIncidents: Incident[];
}

export default function DashboardClient() {
  const [stats, setStats] = useState<DashboardStats>({
    totalServices: 0,
    operationalServices: 0,
    degradedServices: 0,
    downServices: 0,
    totalIncidents: 0,
    activeIncidents: 0,
    resolvedIncidents: 0,
    totalUsers: 0,
    activeUsers: 0,
    recentIncidents: []
  });
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchDashboardData = async () => {
    try {
      const [servicesRes, incidentsRes, usersRes] = await Promise.all([
        fetch('/api/services'),
        fetch('/api/incidents'),
        fetch('/api/users')
      ]);

      if (!servicesRes.ok || !incidentsRes.ok || !usersRes.ok) {
        throw new Error('Failed to fetch dashboard data');
      }

      const services: Service[] = await servicesRes.json();
      const incidents: Incident[] = await incidentsRes.json();
      const users: User[] = await usersRes.json();

      const operationalServices = services.filter(s => s.status === 'OPERATIONAL').length;
      const degradedServices = services.filter(s => s.status === 'DEGRADED').length;
      const downServices = services.filter(s => s.status === 'DOWN').length;
      const activeIncidents = incidents.filter(i => i.status === 'ACTIVE').length;
      const resolvedIncidents = incidents.filter(i => i.status === 'RESOLVED').length;
      const activeUsers = users.filter(u => u.isActive).length;

      setStats({
        totalServices: services.length,
        operationalServices,
        degradedServices,
        downServices,
        totalIncidents: incidents.length,
        activeIncidents,
        resolvedIncidents,
        totalUsers: users.length,
        activeUsers,
        recentIncidents: incidents.slice(0, 5) // Show last 5 incidents
      });
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPERATIONAL': return 'text-green-600';
      case 'DEGRADED': return 'text-yellow-600';
      case 'DOWN': return 'text-red-600';
      case 'ACTIVE': return 'text-red-600';
      case 'RESOLVED': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'OPERATIONAL': return 'bg-green-50 text-green-600';
      case 'DEGRADED': return 'bg-yellow-50 text-yellow-600';
      case 'DOWN': return 'bg-red-50 text-red-600';
      case 'ACTIVE': return 'bg-red-50 text-red-600';
      case 'RESOLVED': return 'bg-green-50 text-green-600';
      default: return 'bg-gray-50 text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Dashboard Overview</h1>
        <p className="text-gray-500 text-base mt-1">Monitor your services and incidents in real-time</p>
      </div>

      {/* Status Summary Cards with Real Data */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div whileHover={{ scale: 1.03 }} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-start border-t-4 border-green-400">
          <div className="flex items-center mb-2">
            <FaCheckCircle className="text-green-400 w-6 h-6 mr-2" />
            <span className="text-sm font-semibold text-gray-700">Operational</span>
          </div>
          <span className="text-3xl font-bold text-gray-900">{stats.operationalServices}</span>
          <span className="mt-2 px-3 py-1 rounded-full bg-green-50 text-green-600 text-xs font-semibold">Healthy</span>
        </motion.div>
        
        <motion.div whileHover={{ scale: 1.03 }} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-start border-t-4 border-yellow-400">
          <div className="flex items-center mb-2">
            <FaExclamationTriangle className="text-yellow-400 w-6 h-6 mr-2" />
            <span className="text-sm font-semibold text-gray-700">Degraded</span>
          </div>
          <span className="text-3xl font-bold text-gray-900">{stats.degradedServices}</span>
          <span className="mt-2 px-3 py-1 rounded-full bg-yellow-50 text-yellow-600 text-xs font-semibold">Attention</span>
        </motion.div>
        
        <motion.div whileHover={{ scale: 1.03 }} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-start border-t-4 border-red-400">
          <div className="flex items-center mb-2">
            <FaTimesCircle className="text-red-400 w-6 h-6 mr-2" />
            <span className="text-sm font-semibold text-gray-700">Down</span>
          </div>
          <span className="text-3xl font-bold text-gray-900">{stats.downServices}</span>
          <span className="mt-2 px-3 py-1 rounded-full bg-red-50 text-red-500 text-xs font-semibold">Critical</span>
        </motion.div>
        
        <motion.div whileHover={{ scale: 1.03 }} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-start border-t-4 border-blue-500">
          <div className="flex items-center mb-2">
            <FaListAlt className="text-blue-500 w-6 h-6 mr-2" />
            <span className="text-sm font-semibold text-gray-700">Total</span>
          </div>
          <span className="text-3xl font-bold text-gray-900">{stats.totalServices}</span>
          <span className="mt-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-semibold">All Services</span>
        </motion.div>
      </div>

      {/* Additional Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <motion.div whileHover={{ scale: 1.02 }} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Incidents</p>
              <p className="text-2xl font-bold text-gray-900">{stats.activeIncidents}</p>
            </div>
            <FaBell className="text-red-400 w-8 h-8" />
          </div>
          <div className="mt-4">
            <div className="flex items-center text-sm text-gray-500">
              <FaClock className="w-4 h-4 mr-1" />
              {stats.totalIncidents} total incidents
            </div>
          </div>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Team Members</p>
              <p className="text-2xl font-bold text-gray-900">{stats.activeUsers}</p>
            </div>
            <FaUsers className="text-blue-400 w-8 h-8" />
          </div>
          <div className="mt-4">
            <div className="flex items-center text-sm text-gray-500">
              <FaChartLine className="w-4 h-4 mr-1" />
              {stats.totalUsers} total users
            </div>
          </div>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Resolved Today</p>
              <p className="text-2xl font-bold text-gray-900">{stats.resolvedIncidents}</p>
            </div>
            <FaCheckCircle className="text-green-400 w-8 h-8" />
          </div>
          <div className="mt-4">
            <div className="flex items-center text-sm text-gray-500">
              <FaChartLine className="w-4 h-4 mr-1" />
              {((stats.resolvedIncidents / Math.max(stats.totalIncidents, 1)) * 100).toFixed(0)}% resolution rate
            </div>
          </div>
        </motion.div>
      </div>

      {/* Recent Incidents */}
      {stats.recentIncidents.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Recent Incidents</h2>
            <Link href="/dashboard/incidents" className="text-blue-500 text-xs font-semibold bg-blue-50 px-4 py-1 rounded-full hover:bg-blue-100 transition">View All</Link>
          </div>
          <div className="space-y-3">
            {stats.recentIncidents.map((incident) => (
              <div key={incident.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${incident.status === 'ACTIVE' ? 'bg-red-400' : 'bg-green-400'}`}></div>
                  <div>
                    <p className="font-medium text-gray-900">{incident.title}</p>
                    <p className="text-sm text-gray-500">{new Date(incident.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusBg(incident.status)}`}>
                  {incident.status}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Quick Actions with Modern Design */}
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }} className="bg-white rounded-2xl shadow-lg p-6">
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
          <motion.div whileHover={{ scale: 1.03 }}>
            <Link 
              href="/dashboard/users" 
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-full hover:from-purple-600 hover:to-pink-600 transition-colors text-center text-sm font-semibold shadow flex items-center gap-2"
            >
              <FaUsers className="w-4 h-4" /> Manage Users
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </>
  )
} 