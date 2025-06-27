import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import Link from "next/link"

export default async function DashboardPage() {
  const session = await auth();
  const userId = session?.userId;

  if (!userId) {
    // Not logged in — redirect to sign-in
    redirect("/sign-in")
  }

  return (
    <div className="p-6">
      {/* Return to Home Button */}
      <div className="mb-6">
        <Link href="/" className="inline-block bg-gray-200 hover:bg-gray-300 text-black font-semibold px-4 py-2 rounded transition-colors mb-4">
          ← Return to Home
        </Link>
      </div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-black">Dashboard Overview</h1>
        <p className="text-black">Monitor your services and incidents</p>
      </div>

      {/* Status Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
            <span className="text-sm font-medium text-black">Operational</span>
          </div>
          <p className="text-2xl font-bold text-black mt-2">2</p>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-yellow-500 rounded-full mr-3"></div>
            <span className="text-sm font-medium text-black">Degraded</span>
          </div>
          <p className="text-2xl font-bold text-black mt-2">1</p>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-500 rounded-full mr-3"></div>
            <span className="text-sm font-medium text-black">Down</span>
          </div>
          <p className="text-2xl font-bold text-black mt-2">1</p>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
            <span className="text-sm font-medium text-black">Total</span>
          </div>
          <p className="text-2xl font-bold text-black mt-2">4</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-black mb-4">Quick Actions</h2>
        <div className="flex space-x-4">
          <a 
            href="/dashboard/Services" 
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Manage Services
          </a>
          <a 
            href="/dashboard/incidents" 
            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
          >
            View Incidents
          </a>
        </div>
      </div>
    </div>
  )
}
