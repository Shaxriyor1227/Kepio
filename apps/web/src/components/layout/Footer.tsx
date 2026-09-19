'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Locale } from '@/lib/i18n';
import { LanguageSwitcher } from './LanguageSwitcher';

interface FooterProps {
  lang: Locale;
  dict: {
    brandName: string;
    description: string;
    specsLink: string;
    decorToggleActive: string;
    decorToggleDefault: string;
    rights: string;
    langSelector: string;
  };
}

export function Footer({ lang, dict }: FooterProps) {
  const [decorOff, setDecorOff] = useState(false);

  useEffect(() => {
    const isOff = document.documentElement.getAttribute('data-decor') === 'off';
    setDecorOff(isOff);
  }, []);

  function toggleDecor() {
    const nextState = !decorOff;
    setDecorOff(nextState);
    if (nextState) {
      document.documentElement.setAttribute('data-decor', 'off');
      try {
        localStorage.setItem('kepio-decor', 'off');
      } catch {}
    } else {
      document.documentElement.removeAttribute('data-decor');
      try {
        localStorage.removeItem('kepio-decor');
      } catch {}
    }
  }

  return (
    <footer className="w-full bg-desk border-t border-rule mt-auto py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-ink-muted">
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-center sm:text-left">
          <span className="font-serif font-bold text-ink text-sm">{dict.brandName}</span>
          <span className="hidden sm:inline text-rule">|</span>
          <span>{dict.description}</span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4">
          {/* Reduced decoration toggle */}
          <button
            type="button"
            onClick={toggleDecor}
            className="px-2.5 py-1 border border-rule bg-paper rounded-paper hover:border-ink/50 text-ink transition-colors cursor-pointer select-none"
          >
            {decorOff ? dict.decorToggleActive : dict.decorToggleDefault}
          </button>

          {/* Development Specs link */}
          <Link
            href="/dev/specs"
            className="hover:text-ink underline underline-offset-2 transition-colors"
          >
            {dict.specsLink}
          </Link>

          {/* Language Switcher in Footer */}
          <LanguageSwitcher currentLocale={lang} label={dict.langSelector} />
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-4 pt-4 border-t border-rule/50 text-center text-[11px] text-ink-muted font-mono">
        © {new Date().getFullYear()} {dict.brandName}. {dict.rights}
      </div>
    </footer>
  );
}
