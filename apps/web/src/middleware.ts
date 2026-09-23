import { NextResponse, NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname === '/') {
    const acceptLang = request.headers.get('accept-language') || '';
    const preferredLocale =
      acceptLang.includes('en') && !acceptLang.startsWith('uz') ? 'en' : 'uz';
    return NextResponse.redirect(new URL(`/${preferredLocale}`, request.url));
  }

  const appMatch = pathname.match(/^\/(uz|en)\/(library|daily|archive|settings)(?:\/|$)/);
  if (appMatch && request.cookies.get('kepio_demo_session')?.value !== 'active') {
    const signInUrl = new URL(`/${appMatch[1]}/sign-in`, request.url);
    signInUrl.searchParams.set('next', pathname);
    return NextResponse.redirect(signInUrl);
  }
}

export const config = {
  matcher: ['/', '/(uz|en)/(library|daily|archive|settings)(.*)'],
};
