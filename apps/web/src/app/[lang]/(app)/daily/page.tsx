import React from 'react';
import { notFound } from 'next/navigation';
import { isValidLocale, getDictionary, Locale } from '@/lib/i18n';
import { api } from '@/lib/api/client';
import { DailyRegisterView } from '@/components/daily/DailyRegisterView';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isValidLocale(lang)) return {};

  const dict = getDictionary(lang);
  return {
    title: `${dict.daily.title} — KEPIO`,
    robots: {
      index: false,
    },
  };
}

export default async function DailyPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isValidLocale(lang)) {
    notFound();
  }

  const dict = getDictionary(lang);
  const result = await api.list({ pageSize: 20 });

  return (
    <DailyRegisterView
      initialSignals={result.items}
      lang={lang as Locale}
      dict={{
        daily: dict.daily,
        stamps: dict.stamps,
      }}
    />
  );
}
