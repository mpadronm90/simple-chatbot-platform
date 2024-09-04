import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  response.headers.set(
    'Content-Security-Policy',
    "frame-ancestors 'self' http: https: localhost:* 127.0.0.1:*"
  );

  // Add other necessary headers
  response.headers.set('X-Frame-Options', 'ALLOW-FROM *');
  response.headers.set('Access-Control-Allow-Origin', '*');

  return response;
}

export const config = {
  matcher: '/:path*',
};
