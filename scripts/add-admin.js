const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function addAdminUser() {
  try {
    // You'll need to create an organization first
    const organization = await prisma.organization.create({
      data: {
        name: 'Your Organization Name',
      }
    });

    console.log('Organization created:', organization);

    // Add your admin user (replace with your actual email)
    const adminUser = await prisma.user.create({
      data: {
        email: 'newuser@example.com',
        firstName: 'Admin',
        lastName: 'User',
        fullName: 'Admin User',
        role: 'SUPER_ADMIN',
        organizationId: organization.id,
        clerkId: 'user_2zBaEl7ZVo6IMj9KIbdYoyufyA',
        isActive: true
      }
    });

    console.log('Admin user created:', adminUser);
    console.log('\n✅ Setup complete!');
    console.log('Now you can:');
    console.log('1. Sign up with the email:', adminUser.email);
    console.log('2. Access the dashboard');
    console.log('3. Add more team members through the admin panel');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addAdminUser(); 
