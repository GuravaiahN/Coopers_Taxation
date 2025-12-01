import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Security headers for all requests
  const response = NextResponse.next();
  
  // Add security headers
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('X-XSS-Protection', '1; mode=block');

  // Skip auth check for static files and API auth routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/auth') ||
    pathname.includes('.') ||
    pathname === '/login' ||
    pathname === '/register' ||
    pathname === '/'
  ) {
    return response;
  }

  // Protected routes that require authentication
  const protectedRoutes = ['/admin', '/user/dashboard'];
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  if (isProtectedRoute) {
    // For protected routes, let client-side auth provider handle authentication
    // Only check API routes for tokens
    return response;
  }

  // API route authentication - allow NextAuth session cookies
  if (pathname.startsWith('/api/') && !pathname.startsWith('/api/auth')) {
    // Let NextAuth session authentication handle API route protection
    // Remove Bearer token requirement since we're using session cookies
    return response;
  }

  return response;
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/user/dashboard/:path*',
    '/api/admin/:path*',
    '/api/user/:path*',
    '/((?!_next/static|_next/image|favicon.ico|.*\.png$).*)',
  ],
};