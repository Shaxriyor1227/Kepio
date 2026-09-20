import React from 'react';
import { notFound } from 'next/navigation';
import { isValidLocale, getDictionary, Locale } from '@/lib/i18n';
import { NewSignalForm } from '@/components/signals/NewSignalForm';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isValidLocale(lang)) return {};

  const dict = getDictionary(lang);
  return {
    title: `${dict.forms.newSignalTitle} — KEPIO`,
    robots: {
      index: false,
    },
  };
}

export default async function NewSignalPage({
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
    <NewSignalForm
      lang={lang as Locale}
      dict={{
        backToLibrary: dict.library.backToLibrary,
        forms: dict.forms,
        collections: dict.collections,
        a11yErrorSummary: dict.a11y.errorSummary,
      }}
    />
  );
}
