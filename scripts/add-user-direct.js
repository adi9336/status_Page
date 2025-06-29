const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function addUserDirect(userData) {
  try {
    // First, check if organization exists, if not create it
    let organization = await prisma.organization.findFirst({
      where: { id: userData.organizationId }
    });

    if (!organization) {
      organization = await prisma.organization.create({
        data: {
          id: userData.organizationId,
          name: 'Default Organization'
        }
      });
      console.log('✅ Created organization:', organization.name);
    }

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        email: userData.email.toLowerCase(),
        organizationId: userData.organizationId
      }
    });

    if (existingUser) {
      console.log('⚠️ User already exists:', existingUser.email);
      return existingUser;
    }

    // Create new user
    const newUser = await prisma.user.create({
      data: {
        email: userData.email.toLowerCase(),
        firstName: userData.firstName || null,
        lastName: userData.lastName || null,
        fullName: userData.firstName && userData.lastName ? `${userData.firstName} ${userData.lastName}` : null,
        role: userData.role,
        organizationId: userData.organizationId,
        clerkId: '', // Will be updated when user first signs in
        isActive: true,
        timezone: 'UTC',
        language: 'en',
        emailNotifications: true,
        pushNotifications: true,
        profileCompleted: false
      }
    });

    console.log('✅ User added successfully:', {
      id: newUser.id,
      email: newUser.email,
      name: newUser.fullName,
      role: newUser.role,
      isActive: newUser.isActive
    });

    return newUser;
  } catch (error) {
    console.error('❌ Error adding user:', error);
    return null;
  } finally {
    await prisma.$disconnect();
  }
}

// Example usage - Replace with actual user data
const newUser = {
  email: 'adityan8nlearn@gmail.com',
  firstName: 'Aditya_N8N',
  lastName: '',
  role: 'MEMBER', // SUPER_ADMIN, ADMIN, MANAGER, MEMBER, VIEWER
  organizationId: 'org_2z6AucumjhZE4b008K1hvAresjG' // Replace with your org ID
};

console.log('Adding user directly to database:', newUser.email);
addUserDirect(newUser); 