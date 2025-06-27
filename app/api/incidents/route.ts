import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const orgId = "org_2z6AucumjhZE4b008K1hvAresjG";

// GET: List all incidents for the org
export async function GET() {
  const incidents = await prisma.incident.findMany({
    include: { service: true },
    where: { organizationId: orgId },
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(incidents);
}

// POST: Create an incident
export async function POST(req: Request) {
  const body = await req.json();

  // Validate required fields
  if (!body.title || !body.status || !body.serviceId) {
    return NextResponse.json({ error: 'Missing required fields: title, status, serviceId' }, { status: 400 });
  }

  try {
    const newIncident = await prisma.incident.create({
      data: {
        title: body.title,
        status: body.status,
        serviceId: body.serviceId,
        organizationId: orgId,
      },
    });
    return NextResponse.json(newIncident);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
} 