import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

const orgId = "org_2z6AucumjhZE4b008K1hvAresjG";

interface UserUpdateData {
  role?: string;
  isActive?: boolean;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  avatar?: string;
  timezone?: string;
  language?: string;
  emailNotifications?: boolean;
  pushNotifications?: boolean;
}

const UserRoles = [
  'MASTER_ADMIN',
  'SUPER_ADMIN',
  'ADMIN',
  'MANAGER',
  'MEMBER',
  'VIEWER',
] as const;
type UserRole = typeof UserRoles[number];

// GET: Fetch a specific user
export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id: userId } = await context.params;

  try {
    const user = await prisma.user.findFirst({
      where: {
        id: userId,
        organizationId: orgId
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error: unknown) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 });
  }
}

// PATCH: Update a user
export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id: userId } = await context.params;
  const body = await request.json();

  try {
    const user = await prisma.user.findFirst({
      where: {
        id: userId,
        organizationId: orgId
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Prepare update data with only provided fields
    const updateData: Record<string, any> = {};
    if (typeof body.role === 'string' && UserRoles.includes(body.role as UserRole)) {
      updateData.role = body.role as UserRole;
    }
    if (body.isActive !== undefined) updateData.isActive = body.isActive;
    if (body.firstName !== undefined) updateData.firstName = body.firstName;
    if (body.lastName !== undefined) updateData.lastName = body.lastName;
    if (body.fullName !== undefined) updateData.fullName = body.fullName;
    if (body.avatar !== undefined) updateData.avatar = body.avatar;
    if (body.timezone !== undefined) updateData.timezone = body.timezone;
    if (body.language !== undefined) updateData.language = body.language;
    if (body.emailNotifications !== undefined) updateData.emailNotifications = body.emailNotifications;
    if (body.pushNotifications !== undefined) updateData.pushNotifications = body.pushNotifications;

    // Update the user
    const updatedUser = await prisma.user.update({
      where: {
        id: userId
      },
      data: updateData
    });

    return NextResponse.json(updatedUser);
  } catch (error: unknown) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}

// DELETE: Deactivate a user (soft delete)
export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id: userId } = await context.params;

  try {
    const user = await prisma.user.findFirst({
      where: {
        id: userId,
        organizationId: orgId
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Soft delete by setting isActive to false
    await prisma.user.update({
      where: {
        id: userId
      },
      data: {
        isActive: false
      }
    });

    return NextResponse.json({ message: 'User deactivated successfully' });
  } catch (error: unknown) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to deactivate user' }, { status: 500 });
  }
} 