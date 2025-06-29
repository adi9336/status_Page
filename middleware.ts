// middleware.ts

import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { prisma } from './lib/prisma';

const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/api/incidents(.*)',
  '/api/services(.*)',
  '/api/users(.*)',
  '/api/notifications(.*)',
]);

const orgId = "org_2z6AucumjhZE4b008K1hvAresjG";

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    try {
      const { userId } = await auth();
      
      console.log('🔍 Middleware Debug - Route:', req.url);
      console.log('🔍 Middleware Debug - Clerk userId:', userId);
      
      if (!userId) {
        console.log('❌ No userId from Clerk - redirecting to sign-in');
        return NextResponse.redirect(new URL('/sign-in', req.url));
      }

      // Check if user exists in database and is active
      try {
        const user = await prisma.user.findFirst({
          where: {
            clerkId: userId,
            organizationId: orgId,
            isActive: true
          }
        });

        if (!user) {
          console.log('❌ User not found in database or not active - redirecting to not-authorized');
          return NextResponse.redirect(new URL('/not-authorized', req.url));
        }

        console.log('✅ User authenticated and authorized - allowing access');
        return NextResponse.next();
      } catch (dbError) {
        console.error('Database error in middleware:', dbError);
        // If database is unavailable, allow access (fail open for development)
        console.log('⚠️ Database error - allowing access for development');
        return NextResponse.next();
      }
    } catch (error) {
      console.error('Auth middleware error:', error);
      return NextResponse.redirect(new URL('/sign-in', req.url));
    }
  }
  
  return NextResponse.next();
});

export const config = {
  matcher: [
    '/((?!.+\\.[\\w]+$|_next).*)',
    '/',
    '/(api|trpc)(.*)',
  ],
};
