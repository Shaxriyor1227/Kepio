import React from 'react';
import Link from 'next/link';
import { Locale } from '@/lib/i18n';
import { LanguageSwitcher } from './LanguageSwitcher';
import { Stamp } from '@/components/paper/Stamp';
import { PaperButton } from '@/components/paper/PaperButton';

interface SiteHeaderProps {
  lang: Locale;
  dict: {
    brandName: string;
    headerStamp: string;
    secondaryLink: string;
    signIn: string;
    primaryCta: string;
    langSelector: string;
  };
}

export function SiteHeader({ lang, dict }: SiteHeaderProps) {
  return (
    <header className="w-full bg-desk border-b border-rule sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Logo & Stamp */}
        <div className="flex items-center gap-3">
          <Link
            href={`/${lang}`}
            className="font-serif text-2xl font-bold tracking-tight text-ink hover:opacity-90 transition-opacity"
          >
            {dict.brandName}
          </Link>
          <span className="hidden sm:inline-block">
            <Stamp variant="neutral" size="sm">
              {dict.headerStamp}
            </Stamp>
          </span>
        </div>

        {/* Navigation & Language */}
        <div className="flex items-center gap-3 sm:gap-6">
          <Link
            href={`#how-it-works`}
            className="hidden md:inline-block font-mono text-xs uppercase tracking-wider text-ink-muted hover:text-ink transition-colors"
          >
            {dict.secondaryLink}
          </Link>
          <Link
            href={`/${lang}/sign-in`}
            className="font-mono text-xs uppercase tracking-wider text-ink font-semibold hover:underline underline-offset-4 transition-all"
          >
            {dict.signIn}
          </Link>

          <LanguageSwitcher currentLocale={lang} label={dict.langSelector} />

          <PaperButton href={`/${lang}/sign-in`} size="sm" variant="primary" className="hidden sm:inline-flex">
            {dict.primaryCta}
          </PaperButton>
        </div>
      </div>
    </header>
  );
}
