import { NextResponse } from 'next/server';

const orgId = "org_2z6AucumjhZE4b008K1hvAresjG";

// Mock data for users
const mockUsers = [
  {
    id: "user_1",
    email: "admin@example.com",
    clerkId: "clerk_admin_1",
    firstName: "Admin",
    lastName: "User",
    fullName: "Admin User",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    role: "ADMIN",
    isActive: true,
    organizationId: orgId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    timezone: "UTC",
    language: "en",
    emailNotifications: true,
    pushNotifications: true,
    profileCompleted: true,
    totalIncidentsCreated: 5,
    totalUpdatesPosted: 12,
  },
  {
    id: "user_2",
    email: "user@example.com",
    clerkId: "clerk_user_1",
    firstName: "Regular",
    lastName: "User",
    fullName: "Regular User",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    role: "MEMBER",
    isActive: true,
    organizationId: orgId,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
    timezone: "UTC",
    language: "en",
    emailNotifications: true,
    pushNotifications: false,
    profileCompleted: true,
    totalIncidentsCreated: 2,
    totalUpdatesPosted: 8,
  }
];

// GET: Get a single user by ID
export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  
  const user = mockUsers.find(u => u.id === id && u.organizationId === orgId);
  
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }
  
  return NextResponse.json(user);
}

// PATCH: Update a user (profile, preferences, role)
export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const body = await request.json();
  
  try {
    const userIndex = mockUsers.findIndex(u => u.id === id && u.organizationId === orgId);
    
    if (userIndex === -1) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    // Update user with provided fields
    mockUsers[userIndex] = {
      ...mockUsers[userIndex],
      firstName: body.firstName !== undefined ? body.firstName : mockUsers[userIndex].firstName,
      lastName: body.lastName !== undefined ? body.lastName : mockUsers[userIndex].lastName,
      fullName: body.fullName !== undefined ? body.fullName : mockUsers[userIndex].fullName,
      avatar: body.avatar !== undefined ? body.avatar : mockUsers[userIndex].avatar,
      role: body.role !== undefined ? body.role : mockUsers[userIndex].role,
      isActive: body.isActive !== undefined ? body.isActive : mockUsers[userIndex].isActive,
      timezone: body.timezone !== undefined ? body.timezone : mockUsers[userIndex].timezone,
      language: body.language !== undefined ? body.language : mockUsers[userIndex].language,
      emailNotifications: body.emailNotifications !== undefined ? body.emailNotifications : mockUsers[userIndex].emailNotifications,
      pushNotifications: body.pushNotifications !== undefined ? body.pushNotifications : mockUsers[userIndex].pushNotifications,
      profileCompleted: body.profileCompleted !== undefined ? body.profileCompleted : mockUsers[userIndex].profileCompleted,
      lastLoginAt: body.lastLoginAt !== undefined ? body.lastLoginAt : mockUsers[userIndex].lastLoginAt,
      lastActivityAt: body.lastActivityAt !== undefined ? body.lastActivityAt : mockUsers[userIndex].lastActivityAt,
      totalIncidentsCreated: body.totalIncidentsCreated !== undefined ? body.totalIncidentsCreated : mockUsers[userIndex].totalIncidentsCreated,
      totalUpdatesPosted: body.totalUpdatesPosted !== undefined ? body.totalUpdatesPosted : mockUsers[userIndex].totalUpdatesPosted,
      lastIncidentCreatedAt: body.lastIncidentCreatedAt !== undefined ? body.lastIncidentCreatedAt : mockUsers[userIndex].lastIncidentCreatedAt,
      updatedAt: new Date().toISOString(),
    };
    
    return NextResponse.json(mockUsers[userIndex]);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE: Deactivate a user (soft delete)
export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  
  try {
    const userIndex = mockUsers.findIndex(u => u.id === id && u.organizationId === orgId);
    
    if (userIndex === -1) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    // Deactivate user
    mockUsers[userIndex].isActive = false;
    mockUsers[userIndex].updatedAt = new Date().toISOString();
    
    return NextResponse.json({ message: 'User deactivated', user: mockUsers[userIndex] });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 