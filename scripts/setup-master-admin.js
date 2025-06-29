const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const orgId = "org_2z6AucumjhZE4b008K1hvAresjG";

async function setupMasterAdmin() {
  try {
    console.log('🔧 Setting up Master Admin...');
    
    // Get the Clerk user ID from command line argument
    const clerkId = process.argv[2];
    
    if (!clerkId) {
      console.error('❌ Please provide a Clerk user ID as an argument');
      console.log('Usage: node scripts/setup-master-admin.js <clerk-user-id>');
      process.exit(1);
    }

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        clerkId: clerkId,
        organizationId: orgId
      }
    });

    if (existingUser) {
      // Update existing user to master admin
      const updatedUser = await prisma.user.update({
        where: {
          id: existingUser.id
        },
        data: {
          role: 'MASTER_ADMIN',
          isActive: true
        }
      });
      
      console.log('✅ Updated existing user to Master Admin:', updatedUser.email);
    } else {
      // Create new master admin user
      const masterAdmin = await prisma.user.create({
        data: {
          email: `master-admin-${Date.now()}@example.com`, // Temporary email
          clerkId: clerkId,
          firstName: 'Master',
          lastName: 'Admin',
          fullName: 'Master Admin',
          organizationId: orgId,
          role: 'MASTER_ADMIN',
          isActive: true,
          emailNotifications: true,
          pushNotifications: true,
          profileCompleted: false,
        }
      });
      
      console.log('✅ Created new Master Admin user with ID:', masterAdmin.id);
      console.log('📧 Please update the email address for this user in the database');
    }

    console.log('🎉 Master Admin setup complete!');
  } catch (error) {
    console.error('❌ Error setting up Master Admin:', error);
  } finally {
    await prisma.$disconnect();
  }
}

setupMasterAdmin(); 