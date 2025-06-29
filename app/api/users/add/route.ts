import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    const userId = session?.userId;

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if the current user is an admin
    const currentUser = await prisma.user.findFirst({
      where: {
        OR: [
          { clerkId: "user_2z5fNI9Vuhr2pH4h6PrzqNdPE7y"},
          { email: { equals: userId, mode: 'insensitive' } }
        ],
        isActive: true
      }
    });

    if (!currentUser || !['ADMIN', 'SUPER_ADMIN'].includes(currentUser.role)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const body = await request.json();
    const { email, firstName, lastName, role = 'MEMBER', organizationId } = body;

    if (!email || !organizationId) {
      return NextResponse.json({ error: 'Email and organizationId are required' }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        email: email.toLowerCase(),
        organizationId
      }
    });

    if (existingUser) {
      return NextResponse.json({ error: 'User already exists in this organization' }, { status: 409 });
    }

    // Create new user
    const newUser = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        firstName: firstName || null,
        lastName: lastName || null,
        fullName: firstName && lastName ? `${firstName} ${lastName}` : null,
        role,
        organizationId,
        clerkId: '', // Will be updated when user first signs in
        isActive: true
      }
    });

    return NextResponse.json({ 
      message: 'User added successfully', 
      user: {
        id: newUser.id,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        role: newUser.role,
        isActive: newUser.isActive
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Error adding user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 