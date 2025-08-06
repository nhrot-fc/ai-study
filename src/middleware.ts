import { NextResponse, NextRequest } from 'next/server';
import { ROUTES } from './lib/constants';

// List of paths that don't require authentication
const PUBLIC_PATHS = [
  ROUTES.LOGIN,
  ROUTES.REGISTER,
  '/forgot-password',
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/refresh',
];

export async function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname;
  
  // Check if the path is public (no auth required)
  const isPublicPath = PUBLIC_PATHS.some(publicPath => path.startsWith(publicPath));
  
  // Get the token from cookies
  const token = request.cookies.get('accessToken')?.value;
  const isAuthenticated = !!token;
  
  // Log the auth state for debugging
  console.log(`[Middleware] Path: ${path}, Public: ${isPublicPath}, Auth: ${isAuthenticated}`);
  
  // Log all cookies for debugging
  const allCookies = Array.from(request.cookies.getAll()).map(c => `${c.name}=${c.value}`);
  console.log('[Middleware] Cookies:', allCookies);

  // If the path requires authentication and the user isn't authenticated
  if (!isPublicPath && !isAuthenticated) {
    console.log(`[Middleware] Redirecting to login from ${path}`);
    // Store the original URL to redirect after login
    const callbackUrl = encodeURIComponent(request.nextUrl.pathname);
    const url = new URL(ROUTES.LOGIN, request.nextUrl.origin);
    url.searchParams.set('callbackUrl', callbackUrl);
    
    return NextResponse.redirect(url);
  }

  // If the path is login or register and the user is already authenticated
  if ((path === ROUTES.LOGIN || path === ROUTES.REGISTER) && isAuthenticated) {
    return NextResponse.redirect(new URL(ROUTES.HOME, request.nextUrl.origin));
  }

  return NextResponse.next();
}

// Define which routes this middleware should run on
export const config = {
  matcher: [
    // Apply to all routes except:
    // 1. Static files
    // 2. API auth routes (which handle their own auth)
    // 3. Other API routes that need special handling
    '/((?!_next/static|_next/image|favicon.ico|public|api/auth).*)',
  ],
};
