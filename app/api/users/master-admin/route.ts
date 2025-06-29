import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { auth } from "@clerk/nextjs/server";

const orgId = "org_2z6AucumjhZE4b008K1hvAresjG";

// Helper function to check if user is master admin
async function isMasterAdmin(clerkId: string) {
  const user = await prisma.user.findFirst({
    where: {
      clerkId: clerkId,
      organizationId: orgId,
      isActive: true
    }
  });
  
  return user?.role === 'MASTER_ADMIN';
}

// GET: List all users (only for master admin)
export async function GET() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is master admin
    const masterAdminCheck = await isMasterAdmin(userId);
    if (!masterAdminCheck) {
      return NextResponse.json({ error: 'Access denied. Master admin privileges required.' }, { status: 403 });
    }

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

// POST: Create a new user (only for master admin)
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is master admin
    const masterAdminCheck = await isMasterAdmin(userId);
    if (!masterAdminCheck) {
      return NextResponse.json({ error: 'Access denied. Master admin privileges required.' }, { status: 403 });
    }

    const body = await request.json();
    const { 
      email, 
      firstName, 
      lastName, 
      role = "MEMBER", 
      clerkId,
      timezone = "UTC",
      language = "en",
      emailNotifications = true,
      pushNotifications = true
    } = body;

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: email },
          { clerkId: clerkId }
        ],
        organizationId: orgId
      }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email or Clerk ID already exists" },
        { status: 409 }
      );
    }

    const user = await prisma.user.create({
      data: {
        email,
        clerkId: clerkId || `clerk_${Date.now()}`, // Generate a unique clerkId if not provided
        firstName,
        lastName,
        fullName: firstName && lastName ? `${firstName} ${lastName}` : undefined,
        organizationId: orgId,
        role,
        isActive: true,
        timezone,
        language,
        emailNotifications,
        pushNotifications,
        profileCompleted: false,
      },
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error: unknown) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
  }
}

// PUT: Update multiple users (only for master admin)
export async function PUT(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is master admin
    const masterAdminCheck = await isMasterAdmin(userId);
    if (!masterAdminCheck) {
      return NextResponse.json({ error: 'Access denied. Master admin privileges required.' }, { status: 403 });
    }

    const body = await request.json();
    const { users } = body; // Array of user updates

    if (!Array.isArray(users)) {
      return NextResponse.json({ error: 'Users array is required' }, { status: 400 });
    }

    const updatedUsers = [];

    for (const userUpdate of users) {
      const { id, ...updateData } = userUpdate;
      
      if (!id) {
        continue;
      }

      const updatedUser = await prisma.user.update({
        where: {
          id: id,
          organizationId: orgId
        },
        data: updateData
      });

      updatedUsers.push(updatedUser);
    }

    return NextResponse.json(updatedUsers);
  } catch (error: unknown) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to update users' }, { status: 500 });
  }
} 