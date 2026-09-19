import React from 'react';
import { notFound } from 'next/navigation';
import { locales, isValidLocale, getDictionary } from '@/lib/i18n';
import { SkipLink } from '@/components/layout/SkipLink';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { Footer } from '@/components/layout/Footer';

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  if (!isValidLocale(lang)) {
    notFound();
  }

  const dict = getDictionary(lang);

  return (
    <>
      <SkipLink label={dict.a11y.skipLink} />
      <SiteHeader
        lang={lang}
        dict={{
          brandName: dict.brand.name,
          headerStamp: dict.stamps.header,
          secondaryLink: dict.landing.secondaryLink,
          signIn: dict.nav.signIn,
          primaryCta: dict.landing.primaryCta,
          langSelector: dict.a11y.languageSelector,
        }}
      />
      <main id="main-content" className="flex-1 flex flex-col">
        {children}
      </main>
      <Footer
        lang={lang}
        dict={{
          brandName: dict.brand.name,
          description: dict.footer.description,
          specsLink: dict.footer.specsLink,
          decorToggleActive: dict.footer.decorToggleActive,
          decorToggleDefault: dict.footer.decorToggleDefault,
          rights: dict.footer.rights,
          langSelector: dict.a11y.languageSelector,
        }}
      />
    </>
  );
}
