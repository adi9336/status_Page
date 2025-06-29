import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

const orgId = "org_2z6AucumjhZE4b008K1hvAresjG";

// GET: List all services for the org
export async function GET() {
  try {
  const services = await prisma.service.findMany({
      where: {
        organizationId: orgId
      },
      orderBy: {
        name: 'asc'
      }
  });

  return NextResponse.json(services);
  } catch (error: unknown) {
    console.error('Database error:', error);
    // Return empty array if database is not available
    return NextResponse.json([]);
  }
}

// POST: Create a service
export async function POST(req: Request) {
  const body = await req.json();

  // Validate required fields
  if (!body.name || !body.status) {
    return NextResponse.json({ error: 'Missing required fields: name, status' }, { status: 400 });
  }

  try {
    const newService = await prisma.service.create({
      data: {
        name: body.name,
        status: body.status,
        organizationId: orgId,
      }
    });
    
    return NextResponse.json(newService, { status: 201 });
  } catch (error: unknown) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to create service' }, { status: 500 });
  }
} 