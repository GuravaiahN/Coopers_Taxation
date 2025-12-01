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

  // Simple token validation for protected routes (without JWT verification in middleware)
  const protectedRoutes = ['/admin', '/user/dashboard'];
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  if (isProtectedRoute) {
    // Check for token existence only (full validation happens in API routes)
    const authHeader = request.headers.get('authorization');
    const cookieToken = request.cookies.get('token')?.value;
    const token = authHeader?.replace('Bearer ', '') || cookieToken;

    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // Basic token format check (JWT tokens have 3 parts separated by dots)
    const tokenParts = token.split('.');
    if (tokenParts.length !== 3) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // API route token check (without verification)
  if (pathname.startsWith('/api/admin') || pathname.startsWith('/api/user')) {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized - Missing or invalid token' },
        { status: 401 }
      );
    }
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
