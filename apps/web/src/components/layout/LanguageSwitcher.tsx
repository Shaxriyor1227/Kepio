'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Locale, locales } from '@/lib/i18n';
import { cn } from '@/lib/cn';

interface LanguageSwitcherProps {
  currentLocale: Locale;
  label: string;
  className?: string;
}

export function LanguageSwitcher({
  currentLocale,
  label,
  className,
}: LanguageSwitcherProps) {
  const pathname = usePathname() || '';

  // Calculate equivalent path in the other locale
  function getLocalePath(targetLocale: Locale): string {
    const segments = pathname.split('/').filter(Boolean);
    if (segments.length === 0) {
      return `/${targetLocale}`;
    }
    if (locales.includes(segments[0] as Locale)) {
      segments[0] = targetLocale;
      return `/${segments.join('/')}`;
    }
    return `/${targetLocale}/${segments.join('/')}`;
  }

  return (
    <nav aria-label={label} className={cn('inline-flex items-center gap-1 font-mono text-xs select-none', className)}>
      {locales.map((loc, idx) => {
        const isCurrent = loc === currentLocale;
        return (
          <React.Fragment key={loc}>
            {idx > 0 && <span className="text-rule text-[11px] select-none">|</span>}
            <Link
              href={getLocalePath(loc)}
              lang={loc}
              hrefLang={loc}
              aria-current={isCurrent ? 'true' : undefined}
              className={cn(
                'px-1.5 py-0.5 uppercase tracking-wider rounded-sm transition-colors whitespace-nowrap min-w-[28px] text-center',
                isCurrent
                  ? 'bg-ink text-on-ink font-bold'
                  : 'text-ink-muted hover:text-ink hover:bg-desk'
              )}
            >
              {loc.toUpperCase()}
            </Link>
          </React.Fragment>
        );
      })}
    </nav>
  );
}
