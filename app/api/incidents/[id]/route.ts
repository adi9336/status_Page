import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

const orgId = "org_2z6AucumjhZE4b008K1hvAresjG";

interface IncidentUpdateData {
  title?: string;
  status?: string;
  serviceId?: string;
  description?: string;
}

// GET: Fetch a specific incident
export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id: incidentId } = await context.params;

  try {
    const incident = await prisma.incident.findFirst({
      where: {
        id: incidentId,
        organizationId: orgId
      },
      include: {
        service: true,
        updates: {
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    });

    if (!incident) {
      return NextResponse.json({ error: 'Incident not found' }, { status: 404 });
    }

    return NextResponse.json(incident);
  } catch (error: unknown) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to fetch incident' }, { status: 500 });
  }
}

// PUT: Update an incident (full update)
export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id: incidentId } = await context.params;
  const body = await request.json();

  try {
    const incident = await prisma.incident.findFirst({
      where: {
        id: incidentId,
        organizationId: orgId
      }
    });

    if (!incident) {
      return NextResponse.json({ error: 'Incident not found' }, { status: 404 });
    }

    // Update the incident
    const updatedIncident = await prisma.incident.update({
      where: {
        id: incidentId
      },
      data: {
        title: body.title || incident.title,
        status: body.status || incident.status,
        serviceId: body.serviceId || incident.serviceId,
        description: body.description !== undefined ? body.description : incident.description,
      },
      include: {
        service: true,
        updates: {
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    });

    return NextResponse.json(updatedIncident);
  } catch (error: unknown) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to update incident' }, { status: 500 });
  }
}

// PATCH: Partial update of an incident
export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id: incidentId } = await context.params;
  const body = await request.json();

  try {
    const incident = await prisma.incident.findFirst({
      where: {
        id: incidentId,
        organizationId: orgId
      }
    });

    if (!incident) {
      return NextResponse.json({ error: 'Incident not found' }, { status: 404 });
    }

    // Prepare update data with only provided fields
    const updateData: IncidentUpdateData = {};
    if (body.title !== undefined) updateData.title = body.title;
    if (body.status !== undefined) updateData.status = body.status;
    if (body.serviceId !== undefined) updateData.serviceId = body.serviceId;
    if (body.description !== undefined) updateData.description = body.description;

    // Remove serviceId if it's undefined to match Prisma's type
    if (updateData.serviceId === undefined) {
      delete updateData.serviceId;
    }

    // Update the incident
    const updatedIncident = await prisma.incident.update({
      where: {
        id: incidentId
      },
      data: updateData,
      include: {
        service: true,
        updates: {
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    });

    return NextResponse.json(updatedIncident);
  } catch (error: unknown) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to update incident' }, { status: 500 });
  }
}

// DELETE: Delete an incident
export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id: incidentId } = await context.params;

  try {
    const incident = await prisma.incident.findFirst({
      where: {
        id: incidentId,
        organizationId: orgId
      }
    });

    if (!incident) {
      return NextResponse.json({ error: 'Incident not found' }, { status: 404 });
    }

    // Delete the incident (this will also delete related updates due to CASCADE)
    await prisma.incident.delete({
      where: {
        id: incidentId
      }
    });

    return NextResponse.json({ message: 'Incident deleted successfully' });
  } catch (error: unknown) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to delete incident' }, { status: 500 });
  }
} 