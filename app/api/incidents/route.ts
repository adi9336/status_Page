import { NextResponse } from 'next/server';

const orgId = "org_2z6AucumjhZE4b008K1hvAresjG";

// Mock data for incidents
const mockIncidents = [
  {
    id: "incident_1",
    title: "Database connectivity issues",
    description: "Users experiencing slow response times",
    status: "OPEN",
    serviceId: "service_3",
    organizationId: orgId,
    createdAt: new Date().toISOString(),
    service: {
      id: "service_3",
      name: "Database",
      status: "DEGRADED",
    }
  },
  {
    id: "incident_2",
    title: "Scheduled maintenance",
    description: "Planned maintenance window",
    status: "SCHEDULED_MAINTENANCE",
    serviceId: "service_1",
    organizationId: orgId,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    service: {
      id: "service_1",
      name: "Website",
      status: "OPERATIONAL",
    }
  }
];

// GET: List all incidents for the org
export async function GET() {
  return NextResponse.json(mockIncidents);
}

// POST: Create an incident
export async function POST(req: Request) {
  const body = await req.json();

  // Validate required fields
  if (!body.title || !body.status || !body.serviceId) {
    return NextResponse.json({ error: 'Missing required fields: title, status, serviceId' }, { status: 400 });
  }

  try {
    const newIncident = {
      id: `incident_${Date.now()}`,
      title: body.title,
      description: body.description || "",
      status: body.status,
      serviceId: body.serviceId,
      organizationId: orgId,
      createdAt: new Date().toISOString(),
      service: {
        id: body.serviceId,
        name: body.serviceId === "service_1" ? "Website" : body.serviceId === "service_2" ? "API" : "Database",
        status: "OPERATIONAL",
      }
    };
    
    mockIncidents.unshift(newIncident);
    return NextResponse.json(newIncident);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
} 