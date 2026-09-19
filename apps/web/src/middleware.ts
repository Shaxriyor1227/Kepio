import { NextResponse, NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname === '/') {
    const acceptLang = request.headers.get('accept-language') || '';
    const preferredLocale =
      acceptLang.includes('en') && !acceptLang.startsWith('uz') ? 'en' : 'uz';
    return NextResponse.redirect(new URL(`/${preferredLocale}`, request.url));
  }
}

export const config = {
  matcher: ['/'],
};
