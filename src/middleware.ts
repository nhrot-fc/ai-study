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

  // If the path requires authentication and the user isn't authenticated
  if (!isPublicPath && !isAuthenticated) {
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
    // Apply to all routes except static files and api routes that handle their own auth
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};
