import { NextResponse } from 'next/server';

const orgId = "org_2z6AucumjhZE4b008K1hvAresjG";

// Mock data for incident updates
const mockUpdates = [
  {
    id: "update_1",
    content: "Investigating the issue",
    incidentId: "incident_1",
    createdAt: new Date().toISOString(),
  },
  {
    id: "update_2",
    content: "Issue identified - database connection pool exhausted",
    incidentId: "incident_1",
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  }
];

// GET: Fetch all updates for a specific incident
export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id: incidentId } = await context.params;
  
  try {
    // Verify the incident exists (using the mock incidents from the parent route)
    const mockIncidents = [
      { id: "incident_1", organizationId: orgId },
      { id: "incident_2", organizationId: orgId }
    ];
    
    const incident = mockIncidents.find(inc => inc.id === incidentId && inc.organizationId === orgId);
    
    if (!incident) {
      return NextResponse.json({ error: 'Incident not found' }, { status: 404 });
    }
    
    const updates = mockUpdates.filter(update => update.incidentId === incidentId);
    return NextResponse.json(updates);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// POST: Create a new update for an incident
export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id: incidentId } = await context.params;
  const body = await request.json();
  
  if (!body.content) {
    return NextResponse.json({ error: 'Missing required field: content' }, { status: 400 });
  }
  
  try {
    // Verify the incident exists
    const mockIncidents = [
      { id: "incident_1", organizationId: orgId },
      { id: "incident_2", organizationId: orgId }
    ];
    
    const incident = mockIncidents.find(inc => inc.id === incidentId && inc.organizationId === orgId);
    
    if (!incident) {
      return NextResponse.json({ error: 'Incident not found' }, { status: 404 });
    }
    
    const newUpdate = {
      id: `update_${Date.now()}`,
      content: body.content,
      incidentId: incidentId,
      createdAt: new Date().toISOString(),
    };
    
    mockUpdates.push(newUpdate);
    return NextResponse.json(newUpdate);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
} 