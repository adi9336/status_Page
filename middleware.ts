// middleware.ts

import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/api/incidents(.*)',
  '/api/services(.*)',
  '/api/users(.*)',
  '/api/notifications(.*)',
  '/not-authorized(.*)',
]);

export default clerkMiddleware((auth, req) => {
  if (isProtectedRoute(req)) {
    console.log('🔍 Middleware Debug - Protecting route:', req.url);
    auth();
  }
});

export const config = {
  matcher: [
    '/((?!.+\\.[\\w]+$|_next).*)',
    '/',
    '/(api|trpc)(.*)',
  ],
};
