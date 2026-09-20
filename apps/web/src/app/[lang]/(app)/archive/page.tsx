import React from 'react';
import { notFound } from 'next/navigation';
import { isValidLocale, getDictionary, Locale } from '@/lib/i18n';
import { api } from '@/lib/api/client';
import { SignalCard } from '@/components/signals/SignalCard';
import { Sheet } from '@/components/paper/Sheet';
import { Archive, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isValidLocale(lang)) return {};

  const dict = getDictionary(lang);
  return {
    title: `${dict.archive.title} — KEPIO`,
    robots: {
      index: false,
    },
  };
}

export default async function ArchivePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isValidLocale(lang)) {
    notFound();
  }

  const dict = getDictionary(lang);
  const result = await api.list({ status: 'archived', pageSize: 30 });

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div className="flex items-center justify-between border-b border-rule pb-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-ink">
            {dict.archive.title}
          </h1>
          <p className="text-sm text-ink-soft mt-1">
            {dict.archive.subtitle}
          </p>
        </div>
        <Link
          href={`/${lang}/library`}
          className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-ink-muted hover:text-ink transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{dict.library.backToLibrary}</span>
        </Link>
      </div>

      {result.items.length === 0 ? (
        <Sheet className="p-12 text-center space-y-4">
          <div className="w-12 h-12 mx-auto rounded-full bg-desk border border-rule flex items-center justify-center text-ink-muted">
            <Archive className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-serif font-bold text-ink">
            {dict.archive.emptyTitle}
          </h2>
          <p className="text-sm text-ink-soft max-w-md mx-auto">
            {dict.archive.emptyDesc}
          </p>
        </Sheet>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {result.items.map((signal) => (
            <SignalCard
              key={signal.id}
              signal={signal}
              lang={lang as Locale}
              dict={{
                viewOriginal: dict.library.viewOriginal,
                stamps: dict.stamps,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
