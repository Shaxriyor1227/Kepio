import React from 'react';
import { notFound } from 'next/navigation';
import { isValidLocale, getDictionary, Locale } from '@/lib/i18n';
import { SkipLink } from '@/components/layout/SkipLink';
import { AppHeader } from '@/components/layout/AppHeader';
import { Footer } from '@/components/layout/Footer';
import { FloatingAddButton } from '@/components/layout/FloatingAddButton';

export default async function AppLayout({
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
      <AppHeader
        lang={lang}
        dict={{
          brandName: dict.brand.name,
          headerStamp: dict.stamps.header,
          searchPlaceholder: dict.library.searchPlaceholder,
          searchShortcutHint: dict.library.searchShortcutHint,
          langSelector: dict.a11y.languageSelector,
          userProfile: dict.a11y.userProfile,
          nav: {
            library: dict.nav.library,
            daily: dict.nav.daily,
            archive: dict.nav.archive,
            settings: dict.nav.settings,
          },
        }}
      />
      <main id="main-content" className="flex-1 flex flex-col">
        {children}
      </main>
      <FloatingAddButton lang={lang} label={dict.common.save} />
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
