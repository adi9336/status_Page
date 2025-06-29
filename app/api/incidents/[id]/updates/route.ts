import { NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma';

const orgId = "org_2z6AucumjhZE4b008K1hvAresjG";

// GET: Fetch all updates for a specific incident
export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id: incidentId } = await context.params;
  
  try {
    // Verify the incident exists and belongs to the organization
    const incident = await prisma.incident.findFirst({
      where: {
        id: incidentId,
        organizationId: orgId
      }
    });
    
    if (!incident) {
      return NextResponse.json({ error: 'Incident not found' }, { status: 404 });
    }
    
    // Fetch all updates for this incident, ordered by creation date (newest first)
    const updates = await prisma.incidentUpdate.findMany({
      where: {
        incidentId: incidentId
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    return NextResponse.json(updates);
  } catch (error: unknown) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to fetch updates' }, { status: 500 });
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
    // Verify the incident exists and belongs to the organization
    const incident = await prisma.incident.findFirst({
      where: {
        id: incidentId,
        organizationId: orgId
      }
    });
    
    if (!incident) {
      return NextResponse.json({ error: 'Incident not found' }, { status: 404 });
    }
    
    // Create the new update
    const newUpdate = await prisma.incidentUpdate.create({
      data: {
        content: body.content,
        incidentId: incidentId
      }
    });
    
    return NextResponse.json(newUpdate, { status: 201 });
  } catch (error: unknown) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to create update' }, { status: 500 });
  }
} 