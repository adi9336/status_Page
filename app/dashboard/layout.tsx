import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import DashboardLayoutClient from "./DashboardLayoutClient";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const userId = session?.userId;

  if (!userId) {
    redirect("/sign-in");
    return null;
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

  if (!user) {
    redirect("/not-authorized");
    return null;
  }

  return <DashboardLayoutClient>{children}</DashboardLayoutClient>;
} 