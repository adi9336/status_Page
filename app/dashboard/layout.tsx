import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { SignOutButton } from "@clerk/nextjs"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth();
  const userId = session?.userId;

  if (!userId) {
    redirect("/sign-in")
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6">
          <h1 className="text-xl font-bold text-gray-800">Status Page</h1>
        </div>
        
        <nav className="mt-6">
          <div className="px-4 space-y-2">
            <Link 
              href="/dashboard" 
              className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <span className="mr-3">📊</span>
              Dashboard
            </Link>
            
            <Link 
              href="/dashboard/Services" 
              className="flex items-center px-4 py-2 text-blue-600 bg-blue-50 rounded-lg font-medium"
            >
              <span className="mr-3">🔧</span>
              Services
            </Link>
            
            <Link 
              href="/dashboard/incidents" 
              className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <span className="mr-3">🚨</span>
              Incidents
            </Link>
            
            <div className="pt-4 border-t border-gray-200">
              <SignOutButton>
                <button className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                  <span className="mr-3">🚪</span>
                  Logout
                </button>
              </SignOutButton>
            </div>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  )
} 