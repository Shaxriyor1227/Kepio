'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Locale } from '@/lib/i18n';
import { LanguageSwitcher } from './LanguageSwitcher';
import { Stamp } from '@/components/paper/Stamp';
import { cn } from '@/lib/cn';
import { Search } from 'lucide-react';

interface AppHeaderProps {
  lang: Locale;
  dict: {
    brandName: string;
    headerStamp: string;
    searchPlaceholder: string;
    searchShortcutHint: string;
    langSelector: string;
    userProfile: string;
    nav: {
      library: string;
      daily: string;
      archive: string;
      settings: string;
    };
  };
}

export function AppHeader({ lang, dict }: AppHeaderProps) {
  const pathname = usePathname() || '';
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const navItems = [
    { href: `/${lang}/library`, label: dict.nav.library },
    { href: `/${lang}/daily`, label: dict.nav.daily },
    { href: `/${lang}/archive`, label: dict.nav.archive },
    { href: `/${lang}/settings`, label: dict.nav.settings },
  ];

  return (
    <header className="w-full bg-desk border-b border-rule sticky top-0 z-40">
      {/* Top row */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href={`/${lang}/library`}
            className="font-serif text-xl font-bold tracking-tight text-ink hover:opacity-85 transition-opacity"
          >
            {dict.brandName}
          </Link>
          <span className="hidden md:inline-block">
            <Stamp variant="neutral" size="sm">
              {dict.headerStamp}
            </Stamp>
          </span>
        </div>

        {/* Global Search Box (Ctrl+K) */}
        <div className="flex-1 max-w-md mx-2 sm:mx-4 relative">
          <div className="relative flex items-center">
            <Search className="w-3.5 h-3.5 absolute left-3 text-ink-muted pointer-events-none" />
            <input
              ref={searchInputRef}
              type="search"
              placeholder={dict.searchPlaceholder}
              className="w-full pl-8 pr-16 py-1.5 bg-paper/80 border border-rule rounded-paper font-serif text-xs text-ink placeholder:text-ink-muted/60 focus:bg-paper focus:border-ink focus:outline-none transition-colors"
            />
            <kbd className="absolute right-2 top-1/2 -translate-y-1/2 px-1.5 py-0.5 font-mono text-[10px] text-ink-muted bg-desk border border-rule rounded-sm pointer-events-none select-none">
              {dict.searchShortcutHint}
            </kbd>
          </div>
        </div>

        {/* Language & User */}
        <div className="flex items-center gap-3">
          <LanguageSwitcher currentLocale={lang} label={dict.langSelector} />
          <div
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-paper border border-rule rounded-paper font-mono text-xs text-ink whitespace-nowrap select-none"
            aria-label={dict.userProfile}
          >
            <span className="w-2 h-2 rounded-full bg-[#1e5436]" aria-hidden="true" />
            <span className="truncate max-w-[120px]">user@kepio.app</span>
          </div>
        </div>
      </div>

      {/* Second row: Navigation tabs */}
      <div className="border-t border-rule/70 bg-desk/70">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <nav aria-label="App Navigation" className="flex items-center gap-1 overflow-x-auto scrollbar-none py-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? 'page' : undefined}
                  className={cn(
                    'px-3 py-1 font-mono text-xs uppercase tracking-wider whitespace-nowrap rounded-paper transition-colors',
                    isActive
                      ? 'bg-paper text-ink font-bold border border-rule shadow-sm'
                      : 'text-ink-muted hover:text-ink hover:bg-paper/50'
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}
