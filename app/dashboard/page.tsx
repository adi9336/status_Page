import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import DashboardClient from "./DashboardClient"

export default async function DashboardPage() {
  const session = await auth();
  const userId = session?.userId;

  console.log('🔍 Dashboard Debug - Clerk userId:', userId);

  if (!userId) {
    console.log('❌ No userId from Clerk - redirecting to sign-in');
    // Not logged in — redirect to sign-in
    redirect("/sign-in")
  }

  // Check if user exists in database
  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { clerkId: userId },
        { email: { equals: userId, mode: 'insensitive' } }
      ],
      isActive: true
    }
  });

  console.log('🔍 Dashboard Debug - DB user found:', user ? {
    id: user.id,
    email: user.email,
    clerkId: user.clerkId,
    role: user.role,
    isActive: user.isActive
  } : 'No user found');

  if (!user) {
    console.log('❌ User not found in database - redirecting to not-authorized');
    redirect("/not-authorized");
  }

  console.log('✅ User authorized - rendering dashboard');
  return <DashboardClient />
}
