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

// GET: List all users in the organization
export async function GET() {
  return NextResponse.json(mockUsers);
}

// POST: Create a new user (admin/invite flow)
export async function POST(req: Request) {
  const body = await req.json();
  
  // Validate required fields
  if (!body.email || !body.clerkId) {
    return NextResponse.json({ error: 'Missing required fields: email, clerkId' }, { status: 400 });
  }
  
  try {
    const newUser = {
      id: `user_${Date.now()}`,
      email: body.email,
      clerkId: body.clerkId,
      firstName: body.firstName || "",
      lastName: body.lastName || "",
      fullName: body.fullName || `${body.firstName || ""} ${body.lastName || ""}`.trim(),
      avatar: body.avatar || "",
      role: body.role || "MEMBER",
      isActive: true,
      organizationId: orgId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      timezone: body.timezone || "UTC",
      language: body.language || "en",
      emailNotifications: body.emailNotifications ?? true,
      pushNotifications: body.pushNotifications ?? true,
      profileCompleted: body.profileCompleted ?? false,
      totalIncidentsCreated: 0,
      totalUpdatesPosted: 0,
    };
    
    mockUsers.push(newUser);
    return NextResponse.json(newUser);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 