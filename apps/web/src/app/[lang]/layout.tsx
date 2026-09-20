import React from 'react';
import { notFound } from 'next/navigation';
import { locales, isValidLocale } from '@/lib/i18n';

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  if (!isValidLocale(lang)) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col bg-paper text-ink selection:bg-sticky-yellow selection:text-ink">
      {children}
    </div>
  );
}
