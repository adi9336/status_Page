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
    },
    updates: [
      {
        id: "update_1",
        content: "Investigating the issue",
        incidentId: "incident_1",
        createdAt: new Date().toISOString(),
      }
    ]
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
    },
    updates: []
  }
];

// GET: Fetch a specific incident
export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id: incidentId } = await context.params;

  try {
    const incident = mockIncidents.find(inc => inc.id === incidentId && inc.organizationId === orgId);

    if (!incident) {
      return NextResponse.json({ error: 'Incident not found' }, { status: 404 });
    }

    return NextResponse.json(incident);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// PUT: Update an incident (full update)
export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id: incidentId } = await context.params;
  const body = await request.json();

  try {
    const incidentIndex = mockIncidents.findIndex(inc => inc.id === incidentId && inc.organizationId === orgId);

    if (incidentIndex === -1) {
      return NextResponse.json({ error: 'Incident not found' }, { status: 404 });
    }

    // Update the incident
    mockIncidents[incidentIndex] = {
      ...mockIncidents[incidentIndex],
      title: body.title || mockIncidents[incidentIndex].title,
      status: body.status || mockIncidents[incidentIndex].status,
      serviceId: body.serviceId || mockIncidents[incidentIndex].serviceId,
      description: body.description !== undefined ? body.description : mockIncidents[incidentIndex].description,
    };

    return NextResponse.json(mockIncidents[incidentIndex]);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// PATCH: Partial update of an incident
export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id: incidentId } = await context.params;
  const body = await request.json();

  try {
    const incidentIndex = mockIncidents.findIndex(inc => inc.id === incidentId && inc.organizationId === orgId);

    if (incidentIndex === -1) {
      return NextResponse.json({ error: 'Incident not found' }, { status: 404 });
    }

    // Update only provided fields
    if (body.title !== undefined) mockIncidents[incidentIndex].title = body.title;
    if (body.status !== undefined) mockIncidents[incidentIndex].status = body.status;
    if (body.serviceId !== undefined) mockIncidents[incidentIndex].serviceId = body.serviceId;
    if (body.description !== undefined) mockIncidents[incidentIndex].description = body.description;

    return NextResponse.json(mockIncidents[incidentIndex]);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// DELETE: Delete an incident
export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id: incidentId } = await context.params;

  try {
    const incidentIndex = mockIncidents.findIndex(inc => inc.id === incidentId && inc.organizationId === orgId);

    if (incidentIndex === -1) {
      return NextResponse.json({ error: 'Incident not found' }, { status: 404 });
    }

    // Remove the incident
    mockIncidents.splice(incidentIndex, 1);

    return NextResponse.json({ message: 'Incident deleted successfully' });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
} 