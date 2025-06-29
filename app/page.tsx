'use client'

import Link from 'next/link'
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton, useAuth } from '@clerk/nextjs'
import { useState, useEffect } from 'react'
import { Button } from "@/components/UI/Button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/UI/Card";
import { Badge } from "@/components/UI/Badge";
import { Activity } from "lucide-react";
import { useRouter } from 'next/navigation';

interface StatusData {
  totalIncidents: number;
  totalServices: number;
  services: Array<{ id: string; name: string; status: string; description?: string }>;
  incidents: Array<{ id: string; title: string; description?: string; createdAt: string }>;
}

export default function Home() {
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
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-white to-primary/5 font-sans">
      {/* Navbar */}
      <header className="fixed top-0 left-0 w-full h-16 flex items-center justify-between px-6 lg:px-12 bg-white/60 backdrop-blur-glass border-b border-white/30 z-50">
        <div className="flex items-center gap-2">
          <Activity className="h-6 w-6 text-primary" />
          <span className="text-lg font-bold text-primary">Statusly</span>
        </div>
        <div className="flex items-center gap-2">
          <SignedOut>
            <SignInButton mode="modal">
              <Button className="bg-primary text-white px-5 py-2 rounded-full font-semibold shadow-lg">Dashboard</Button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <Link href="/dashboard">
              <Button className="bg-primary text-white px-5 py-2 rounded-full font-semibold shadow-lg">Dashboard</Button>
            </Link>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex flex-col items-center justify-center px-4 py-16 md:py-24" style={{ paddingTop: '4rem' }}>
        <div className="max-w-2xl w-full flex flex-col items-center text-center gap-4">
          <Badge variant="secondary" className="mb-2">For Teams &amp; Organizations</Badge>
          <h1 className="text-4xl md:text-5xl font-extrabold text-primary drop-shadow-lg mb-2">Team Status Dashboard</h1>
          <p className="text-lg text-gray-700 mb-6">Monitor your company's services and incidents in real time. Empower your team with transparency and control.</p>
          <SignedOut>
            <SignInButton mode="modal">
              <Button className="bg-primary text-white px-8 py-3 rounded-full text-lg font-bold shadow-lg">Go to Dashboard</Button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <Link href="/dashboard">
              <Button className="bg-primary text-white px-8 py-3 rounded-full text-lg font-bold shadow-lg">Go to Dashboard</Button>
            </Link>
          </SignedIn>
        </div>

        {/* Stats Row */}
        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          <Card className="glass-panel flex flex-col items-center py-8">
            <div className="text-sm text-gray-500 mb-2">Total Services</div>
            <div className="text-4xl font-bold text-primary">{statusData.totalServices}</div>
          </Card>
          <Card className="glass-panel flex flex-col items-center py-8">
            <div className="text-sm text-gray-500 mb-2">Active Incidents</div>
            <div className="text-4xl font-bold text-primary">{statusData.totalIncidents}</div>
          </Card>
          <Card className="glass-panel flex flex-col items-center py-8">
            <div className="text-sm text-gray-500 mb-2">Uptime</div>
            <div className="text-4xl font-bold text-primary">0%</div>
          </Card>
        </div>

        {/* Service Status Section Title */}
        <div className="w-full max-w-4xl mt-16 mb-4">
          <h2 className="text-2xl font-bold text-primary">Service Status</h2>
        </div>
        {/* You can add a service status table or cards here if needed */}
      </main>
    </div>
  )
} 