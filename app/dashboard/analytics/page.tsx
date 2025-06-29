"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FaChartLine, FaChartBar, FaChartPie, FaCalendar, FaClock, FaExclamationTriangle, FaCheckCircle, FaUsers, FaServer } from "react-icons/fa";
import { motion } from "framer-motion";
import { useRouter } from 'next/navigation';

interface AnalyticsData {
  totalIncidents: number;
  resolvedIncidents: number;
  activeIncidents: number;
  avgResolutionTime: number;
  totalServices: number;
  operationalServices: number;
  degradedServices: number;
  downServices: number;
  totalUsers: number;
  activeUsers: number;
  incidentsByMonth: { month: string; count: number }[];
  incidentsBySeverity: { severity: string; count: number }[];
  servicesByStatus: { status: string; count: number }[];
  recentActivity: { type: string; description: string; timestamp: string }[];
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalIncidents: 0,
    resolvedIncidents: 0,
    activeIncidents: 0,
    avgResolutionTime: 0,
    totalServices: 0,
    operationalServices: 0,
    degradedServices: 0,
    downServices: 0,
    totalUsers: 0,
    activeUsers: 0,
    incidentsByMonth: [],
    incidentsBySeverity: [],
    servicesByStatus: [],
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const [servicesRes, incidentsRes, usersRes] = await Promise.all([
        fetch('/api/services'),
        fetch('/api/incidents'),
        fetch('/api/users')
      ]);

      const services = await servicesRes.json();
      const incidents = await incidentsRes.json();
      const users = await usersRes.json();

      // Calculate analytics
      const resolvedIncidents = incidents.filter((i: any) => i.status === 'RESOLVED').length;
      const activeIncidents = incidents.filter((i: any) => i.status === 'OPEN').length;
      const operationalServices = services.filter((s: any) => s.status === 'OPERATIONAL').length;
      const degradedServices = services.filter((s: any) => s.status === 'DEGRADED').length;
      const downServices = services.filter((s: any) => s.status === 'DOWN').length;
      const activeUsers = users.filter((u: any) => u.isActive).length;

      // Mock data for charts (in real app, you'd calculate these from actual data)
      const incidentsByMonth = [
        { month: 'Jan', count: 12 },
        { month: 'Feb', count: 8 },
        { month: 'Mar', count: 15 },
        { month: 'Apr', count: 10 },
        { month: 'May', count: 18 },
        { month: 'Jun', count: 14 }
      ];

      const incidentsBySeverity = [
        { severity: 'Critical', count: 5 },
        { severity: 'High', count: 12 },
        { severity: 'Medium', count: 8 },
        { severity: 'Low', count: 3 }
      ];

      const servicesByStatus = [
        { status: 'Operational', count: operationalServices },
        { status: 'Degraded', count: degradedServices },
        { status: 'Down', count: downServices }
      ];

      const recentActivity = [
        { type: 'incident', description: 'New incident created: Database connectivity issues', timestamp: '2 hours ago' },
        { type: 'service', description: 'Service status updated: API Gateway restored', timestamp: '4 hours ago' },
        { type: 'user', description: 'New team member added: John Doe', timestamp: '1 day ago' },
        { type: 'incident', description: 'Incident resolved: Email service outage', timestamp: '2 days ago' }
      ];

      setAnalytics({
        totalIncidents: incidents.length,
        resolvedIncidents,
        activeIncidents,
        avgResolutionTime: 4.5, // Mock average in hours
        totalServices: services.length,
        operationalServices,
        degradedServices,
        downServices,
        totalUsers: users.length,
        activeUsers,
        incidentsByMonth,
        incidentsBySeverity,
        servicesByStatus,
        recentActivity
      });
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const getUptimePercentage = () => {
    const total = analytics.totalServices;
    if (total === 0) return 100;
    return ((analytics.operationalServices / total) * 100).toFixed(1);
  };

  const getResolutionRate = () => {
    if (analytics.totalIncidents === 0) return 100;
    return ((analytics.resolvedIncidents / analytics.totalIncidents) * 100).toFixed(1);
  };

  if (loading) {
    return (
      <div className="p-4 sm:p-8 bg-gray-100 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 bg-gray-100 min-h-screen">
      <div className="mb-6">
        <button
          onClick={() => router.push('/')}
          className="inline-block bg-white hover:bg-blue-50 text-blue-600 font-semibold px-4 py-2 rounded-full transition-colors text-sm shadow border border-gray-200"
        >
          ← Return to Home
        </button>
      </div>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <FaChartLine className="text-blue-400" /> Analytics Dashboard
        </h1>
        <p className="text-gray-500 text-base mt-1">Comprehensive insights into your system performance</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div whileHover={{ scale: 1.02 }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">System Uptime</p>
              <p className="text-2xl font-bold text-gray-900">{getUptimePercentage()}%</p>
            </div>
            <FaServer className="text-green-400 w-8 h-8" />
          </div>
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-400 h-2 rounded-full" style={{ width: `${getUptimePercentage()}%` }}></div>
            </div>
          </div>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Resolution Rate</p>
              <p className="text-2xl font-bold text-gray-900">{getResolutionRate()}%</p>
            </div>
            <FaCheckCircle className="text-blue-400 w-8 h-8" />
          </div>
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-400 h-2 rounded-full" style={{ width: `${getResolutionRate()}%` }}></div>
            </div>
          </div>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Resolution Time</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.avgResolutionTime}h</p>
            </div>
            <FaClock className="text-yellow-400 w-8 h-8" />
          </div>
          <div className="mt-4">
            <p className="text-xs text-gray-500">Target: &lt; 2 hours</p>
          </div>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Incidents</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.activeIncidents}</p>
            </div>
            <FaExclamationTriangle className="text-red-400 w-8 h-8" />
          </div>
          <div className="mt-4">
            <p className="text-xs text-gray-500">{analytics.totalIncidents} total incidents</p>
          </div>
        </motion.div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Incidents by Month */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <FaChartBar className="text-blue-400" /> Incidents by Month
            </h3>
          </div>
          <div className="space-y-3">
            {analytics.incidentsByMonth.map((item, index) => (
              <div key={item.month} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">{item.month}</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-400 h-2 rounded-full" 
                      style={{ width: `${(item.count / Math.max(...analytics.incidentsByMonth.map(i => i.count))) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-semibold text-gray-900 w-8 text-right">{item.count}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Incidents by Severity */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <FaChartPie className="text-green-400" /> Incidents by Severity
            </h3>
          </div>
          <div className="space-y-3">
            {analytics.incidentsBySeverity.map((item) => (
              <div key={item.severity} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${
                    item.severity === 'Critical' ? 'bg-red-500' :
                    item.severity === 'High' ? 'bg-orange-500' :
                    item.severity === 'Medium' ? 'bg-yellow-500' : 'bg-green-500'
                  }`}></div>
                  <span className="text-sm font-medium text-gray-600">{item.severity}</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">{item.count}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Services Status and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Services Status */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <FaServer className="text-purple-400" /> Services Status
            </h3>
          </div>
          <div className="space-y-3">
            {analytics.servicesByStatus.map((item) => (
              <div key={item.status} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${
                    item.status === 'Operational' ? 'bg-green-500' :
                    item.status === 'Degraded' ? 'bg-yellow-500' : 'bg-red-500'
                  }`}></div>
                  <span className="text-sm font-medium text-gray-700">{item.status}</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">{item.count}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <FaCalendar className="text-indigo-400" /> Recent Activity
            </h3>
          </div>
          <div className="space-y-3">
            {analytics.recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  activity.type === 'incident' ? 'bg-red-500' :
                  activity.type === 'service' ? 'bg-blue-500' : 'bg-green-500'
                }`}></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-700">{activity.description}</p>
                  <p className="text-xs text-gray-500 mt-1">{activity.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
} 