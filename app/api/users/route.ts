import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

const orgId = "org_2z6AucumjhZE4b008K1hvAresjG";

// GET: List all users for the organization
export async function GET() {
  try {
    const users = await prisma.user.findMany({
      where: {
        organizationId: orgId
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(users);
  } catch (error: unknown) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

// POST: Create a new user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, email, firstName, lastName, organizationId, role = "MEMBER", clerkId } = body;

    if (!id || !email || !organizationId) {
      return NextResponse.json(
        { error: "Missing required fields: id, email, organizationId" },
        { status: 400 }
      );
    }

    const user = await prisma.user.create({
      data: {
        id,
        email,
        clerkId: clerkId || id, // Use provided clerkId or fallback to id
        firstName,
        lastName,
        fullName: firstName && lastName ? `${firstName} ${lastName}` : undefined,
        organizationId,
        role,
        isActive: true,
        emailNotifications: true,
        pushNotifications: true,
        profileCompleted: false,
      },
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error: unknown) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
  }
}
 