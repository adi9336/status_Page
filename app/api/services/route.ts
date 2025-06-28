import { NextResponse } from 'next/server';

const orgId = "org_2z6AucumjhZE4b008K1hvAresjG";

// Mock data for services
const mockServices = [
  {
    id: "service_1",
    name: "Website",
    status: "OPERATIONAL",
    organizationId: orgId,
  },
  {
    id: "service_2", 
    name: "API",
    status: "OPERATIONAL",
    organizationId: orgId,
  },
  {
    id: "service_3",
    name: "Database",
    status: "DEGRADED",
    organizationId: orgId,
  }
];

// GET: List all services for the org
export async function GET() {
  return NextResponse.json(mockServices);
}

// POST: Create a service
export async function POST(req: Request) {
  const body = await req.json();

  // Validate required fields
  if (!body.name || !body.status) {
    return NextResponse.json({ error: 'Missing required fields: name, status' }, { status: 400 });
  }

  try {
    const newService = {
      id: `service_${Date.now()}`,
      name: body.name,
      status: body.status,
      organizationId: orgId,
    };
    
    mockServices.push(newService);
    return NextResponse.json(newService);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
} 