import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const orgId = "org_2z6AucumjhZE4b008K1hvAresjG";

export const ORG_ID = orgId;

// GET: List all services for the org
export async function GET() {
  const services = await prisma.service.findMany({
    where: { organizationId: orgId },
    orderBy: { id: 'desc' },
  });
  return NextResponse.json(services);
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
      },
    });
    return NextResponse.json(newService);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
} 