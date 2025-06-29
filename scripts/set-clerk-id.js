const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function setClerkId(email, clerkId) {
  try {
    console.log(`🔍 Looking for user with email: ${email}`);
    
    // Find the user
    const user = await prisma.user.findFirst({
      where: { 
        email: email.toLowerCase(),
        isActive: true
      }
    });

    if (!user) {
      console.log('❌ User not found in database');
      return;
    }

    console.log('✅ User found:', {
      id: user.id,
      email: user.email,
      currentClerkId: user.clerkId,
      role: user.role,
      isActive: user.isActive
    });

    // Update the clerkId
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { 
        clerkId: clerkId,
        lastActivityAt: new Date(),
        isActive: true,
        role: user.role || 'MEMBER',
      }
    });

    console.log('✅ Clerk ID updated successfully:', {
      id: updatedUser.id,
      email: updatedUser.email,
      newClerkId: updatedUser.clerkId,
      role: updatedUser.role
    });

  } catch (error) {
    console.error('❌ Error updating user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Usage: Set your email and Clerk user ID here
const email = 'adityan8nlearn@gmail.com';
const clerkId = 'user_2zBaEl7ZVo6IMj9KIbdYoyufyA';

console.log('Setting Clerk ID for user...');
setClerkId(email, clerkId); 