'use client'

import Link from 'next/link'
import { SignedIn, SignedOut, SignInButton, UserButton, useAuth } from '@clerk/nextjs'
import { useState, useEffect } from 'react'
import { Button } from "@/components/UI/Button";
import { Card } from "@/components/UI/Card";
import { Activity, Menu, X } from "lucide-react";
import { useRouter } from 'next/navigation';

interface StatusData {
  totalIncidents: number;
  totalServices: number;
  services: Array<{ id: string; name: string; status: string; description?: string }>;
  incidents: Array<{ id: string; title: string; description?: string; createdAt: string }>;
}

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [statusData, setStatusData] = useState<StatusData>({
    totalIncidents: 0,
    totalServices: 0,
    services: [],
    incidents: []
  })
  const { isSignedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const fetchStatusData = async () => {
      try {
        const [servicesRes, incidentsRes] = await Promise.all([
          fetch('/api/services', { cache: 'no-store' }),
          fetch('/api/incidents', { cache: 'no-store' })
        ])
        if (!servicesRes.ok || !incidentsRes.ok) throw new Error('Network response was not ok')
        const services = await servicesRes.json()
        const incidents = await incidentsRes.json()
        setStatusData({
          totalIncidents: Array.isArray(incidents) ? incidents.length : 0,
          totalServices: Array.isArray(services) ? services.length : 0,
          services: Array.isArray(services) ? services : [],
          incidents: Array.isArray(incidents) ? incidents : []
        })
      } catch {
        setStatusData({ totalIncidents: 0, totalServices: 0, services: [], incidents: [] })
      }
    }
    fetchStatusData()
  }, [])

  useEffect(() => {
    if (isSignedIn) {
      router.push('/dashboard');
    }
  }, [isSignedIn, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-white to-primary/5 font-sans overflow-x-hidden">
      {/* Navbar */}
      <header className="fixed top-0 left-0 w-full h-16 flex items-center justify-between px-4 sm:px-6 lg:px-12 bg-white/70 backdrop-blur-md border-b border-white/30 z-50">
        <div className="flex items-center gap-2">
          <Activity className="h-6 w-6 text-primary" />
          <span className="text-lg font-bold text-primary">Statusly</span>
        </div>
        <div className="hidden sm:flex items-center gap-4">
          <SignedOut>
            <SignInButton mode="modal">
              <Button className="bg-primary text-white px-4 py-2 text-sm rounded-full font-semibold shadow">
                Dashboard
              </Button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <Link href="/dashboard">
              <Button className="bg-primary text-white px-4 py-2 text-sm rounded-full font-semibold shadow">
                Dashboard
              </Button>
            </Link>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>
        <div className="sm:hidden">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-primary">
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="sm:hidden fixed top-16 left-0 w-full bg-white/90 backdrop-blur-md z-40 p-4 border-b">
          <div className="flex flex-col items-center gap-4">
            <SignedOut>
              <SignInButton mode="modal">
                <Button className="bg-primary text-white px-4 py-2 text-sm rounded-full font-semibold shadow w-full">
                  Dashboard
                </Button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <Link href="/dashboard" className="w-full">
                <Button className="bg-primary text-white px-4 py-2 text-sm rounded-full font-semibold shadow w-full">
                  Dashboard
                </Button>
              </Link>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <main className="flex flex-col items-center justify-center px-4 pt-24 pb-12 sm:pt-32 w-full">
        <div className="max-w-2xl w-full flex flex-col items-center text-center gap-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-primary drop-shadow-lg">
            Team Status Dashboard
          </h1>
          <p className="text-base sm:text-lg text-gray-700 max-w-xl">
            Monitor your company's services and incidents in real time. Empower your team with transparency and control.
          </p>
          <div>
            <SignedOut>
              <SignInButton mode="modal">
                <Button className="bg-primary text-white px-8 py-3 text-base sm:text-lg rounded-full font-bold shadow-md">
                  Go to Dashboard
                </Button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <Link href="/dashboard">
                <Button className="bg-primary text-white px-8 py-3 text-base sm:text-lg rounded-full font-bold shadow-md">
                  Go to Dashboard
                </Button>
              </Link>
            </SignedIn>
          </div>
        </div>

        {/* Stats Row */}
        <div className="w-full max-w-5xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mt-12 px-2 sm:px-0">
          <Card className="glass-panel flex flex-col items-center py-6 sm:py-8">
            <div className="text-sm text-gray-500 mb-1">Total Services</div>
            <div className="text-3xl sm:text-4xl font-bold text-primary">{statusData.totalServices}</div>
          </Card>
          <Card className="glass-panel flex flex-col items-center py-6 sm:py-8">
            <div className="text-sm text-gray-500 mb-1">Active Incidents</div>
            <div className="text-3xl sm:text-4xl font-bold text-primary">{statusData.totalIncidents}</div>
          </Card>
          <Card className="glass-panel flex flex-col items-center py-6 sm:py-8">
            <div className="text-sm text-gray-500 mb-1">Uptime</div>
            <div className="text-3xl sm:text-4xl font-bold text-primary">0%</div>
          </Card>
        </div>

        {/* Section Title */}
        <div className="w-full max-w-5xl mt-16 mb-4 px-4 sm:px-0">
          <h2 className="text-xl sm:text-2xl font-bold text-primary">Service Status</h2>
        </div>
      </main>
    </div>
  )
}
