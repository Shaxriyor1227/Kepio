import React from 'react';
import { notFound } from 'next/navigation';
import { isValidLocale, getDictionary, Locale } from '@/lib/i18n';
import { api } from '@/lib/api/client';
import { SignalDetailView } from '@/components/signals/SignalDetailView';

interface SignalDetailPageProps {
  params: Promise<{
    lang: string;
    id: string;
  }>;
}

export async function generateMetadata({ params }: SignalDetailPageProps) {
  const { lang, id } = await params;
  if (!isValidLocale(lang)) return {};

  const signal = await api.get(id);
  if (!signal) return { title: 'Not Found' };

  return {
    title: `${signal.title} — KEPIO`,
    description: signal.summary,
    robots: {
      index: false,
    },
  };
}

export default async function SignalDetailPage({ params }: SignalDetailPageProps) {
  const { lang, id } = await params;
  if (!isValidLocale(lang)) {
    notFound();
  }

  const signal = await api.get(id);
  if (!signal) {
    notFound();
  }

  const dict = getDictionary(lang);

  return (
    <SignalDetailView
      initialSignal={signal}
      lang={lang as Locale}
      dict={{
        backToLibrary: dict.library.backToLibrary,
        viewOriginal: dict.library.viewOriginal,
        nextStepTitle: dict.library.nextStepTitle,
        deadlineLabel: dict.library.deadlineLabel,
        noDeadline: dict.library.noDeadline,
        statusChangeSuccess: dict.library.statusChangeSuccess,
        stamps: dict.stamps,
        a11yStatusGroup: dict.a11y.statusRadioGroup,
      }}
    />
  );
}
