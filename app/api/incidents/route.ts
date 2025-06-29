import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

const orgId = "org_2z6AucumjhZE4b008K1hvAresjG";

// GET: List all incidents for the org
export async function GET() {
  try {
  const incidents = await prisma.incident.findMany({
      where: {
        organizationId: orgId
      },
      include: {
        service: true,
        updates: {
          orderBy: {
            createdAt: 'desc'
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
  });

  return NextResponse.json(incidents);
  } catch (error: unknown) {
    console.error('Database error:', error);
    // Return empty array if database is not available
    return NextResponse.json([]);
  }
}

// POST: Create an incident
export async function POST(req: Request) {
  const body = await req.json();

  // Validate required fields
  if (!body.title || !body.status || !body.serviceId) {
    return NextResponse.json({ error: 'Missing required fields: title, status, serviceId' }, { status: 400 });
  }

  try {
    // Verify the service exists and belongs to the organization
    const service = await prisma.service.findFirst({
      where: {
        id: body.serviceId,
        organizationId: orgId
      }
    });

    if (!service) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }

    const newIncident = await prisma.incident.create({
      data: {
        title: body.title,
        description: body.description || "",
        status: body.status,
        serviceId: body.serviceId,
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
    
    return NextResponse.json(newIncident, { status: 201 });
  } catch (error: unknown) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to create incident' }, { status: 500 });
  }
} 