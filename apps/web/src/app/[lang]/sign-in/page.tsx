import React from 'react';
import { notFound } from 'next/navigation';
import { isValidLocale, getDictionary, Locale } from '@/lib/i18n';
import { SignInView } from '@/components/auth/SignInView';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isValidLocale(lang)) return {};

  const dict = getDictionary(lang);
  return {
    title: `${dict.signIn.title} — KEPIO`,
    robots: {
      index: false,
    },
  };
}

export default async function SignInPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ next?: string }>;
}) {
  const { lang } = await params;
  const query = await searchParams;
  if (!isValidLocale(lang)) {
    notFound();
  }

  const dict = getDictionary(lang);

  return (
    <SignInView
      lang={lang as Locale}
      nextPath={query.next}
      dict={{
        signIn: dict.signIn,
      }}
    />
  );
}
