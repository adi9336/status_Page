import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';

export async function GET(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // First, find the internal user ID from the clerkId
    const user = await prisma.user.findUnique({
      where: {
        clerkId: userId,
      }
    });

    if (!user) {
      // If the user is not in our DB, they can't have notifications
      return NextResponse.json([]);
    }

    const notifications = await prisma.notification.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 100, // Limit the number of notifications
    });

    return NextResponse.json(notifications);
  } catch (error) {
    console.error('Failed to fetch notifications:', error);
    return new NextResponse(JSON.stringify({ error: 'Failed to fetch notifications' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
} 