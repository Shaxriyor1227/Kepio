'use client';

import React from 'react';
import Link from 'next/link';
import { Locale } from '@/lib/i18n';
import { Plus } from 'lucide-react';

interface FloatingAddButtonProps {
  lang: Locale;
  label: string;
}

export function FloatingAddButton({ lang, label }: FloatingAddButtonProps) {
  return (
    <Link
      href={`/${lang}/library/new`}
      className="fixed bottom-6 right-6 z-30 inline-flex items-center gap-2 px-4 py-3 bg-ink text-on-ink font-mono text-xs uppercase tracking-wider rounded-paper shadow-sheet hover:bg-ink-2 active:translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-ink focus:ring-offset-2 transition-all whitespace-nowrap min-h-[44px] min-w-[44px]"
      aria-label={label}
    >
      <Plus className="w-4 h-4 text-on-ink" aria-hidden="true" />
      <span className="hidden sm:inline font-bold">{label}</span>
    </Link>
  );
}
