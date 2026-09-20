import React from 'react';
import { notFound } from 'next/navigation';
import { isValidLocale, getDictionary, Locale } from '@/lib/i18n';
import { SettingsView } from '@/components/settings/SettingsView';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isValidLocale(lang)) return {};

  const dict = getDictionary(lang);
  return {
    title: `${dict.settings.title} — KEPIO`,
    robots: {
      index: false,
    },
  };
}

export default async function SettingsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isValidLocale(lang)) {
    notFound();
  }

  const dict = getDictionary(lang);

  return (
    <SettingsView
      lang={lang as Locale}
      dict={{
        settings: dict.settings,
      }}
    />
  );
}
