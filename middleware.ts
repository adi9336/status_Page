// middleware.ts

import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/api/incidents(.*)',
  '/api/services(.*)',
  '/api/users(.*)',
  '/api/notifications(.*)',
]);

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

      // User is authenticated with Clerk - allow access
      // Database user validation will be handled in the API routes
      console.log('✅ User authenticated with Clerk - allowing access');
      return NextResponse.next();
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
