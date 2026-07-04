import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware to protect /admin/* routes.
 * Checks for a session cookie — if absent, redirects to login.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect /admin routes
  if (pathname.startsWith('/admin')) {
    const session = request.cookies.get('session')?.value;

    if (!session) {
      const loginUrl = new URL('/auth/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Protect hospital doctor and staff routes (both hospital-specific and global)
  const isDoctorPath = pathname.includes('/doctors') || pathname.includes('/bengali-doctors');
  const isStaffPath = pathname.includes('/staff') || pathname.includes('/bengali-staff');

  if ((isDoctorPath || isStaffPath) && !pathname.includes('/verify')) {
    const isVerified = request.cookies.has('verified_directory_user');

    if (!isVerified) {
      let hospitalId = 'general';
      const hospitalRouteMatch = pathname.match(/^\/emergency\/hospitals\/([^\/]+)/);
      if (hospitalRouteMatch && hospitalRouteMatch[1] !== 'bengali-doctors' && hospitalRouteMatch[1] !== 'bengali-staff') {
        hospitalId = hospitalRouteMatch[1];
      }

      const verifyUrl = new URL(`/emergency/hospitals/${hospitalId}/verify`, request.url);
      verifyUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(verifyUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/emergency/hospitals/:id/doctors',
    '/emergency/hospitals/:id/doctors/:path*',
    '/emergency/hospitals/:id/staff',
    '/emergency/hospitals/:id/staff/:path*',
    '/emergency/hospitals/bengali-doctors',
    '/emergency/hospitals/bengali-doctors/:path*',
    '/emergency/hospitals/bengali-staff',
    '/emergency/hospitals/bengali-staff/:path*',
  ],
};
