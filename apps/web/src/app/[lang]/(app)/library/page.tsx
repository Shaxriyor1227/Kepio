import React from 'react';
import { notFound } from 'next/navigation';
import { isValidLocale, getDictionary, Locale } from '@/lib/i18n';
import { api } from '@/lib/api/client';
import { LibraryInteractiveView } from '@/components/signals/LibraryInteractiveView';

export default async function LibraryPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isValidLocale(lang)) {
    notFound();
  }

  const dict = getDictionary(lang);
  const result = await api.list({ pageSize: 100 });

  return (
    <LibraryInteractiveView
      initialSignals={result.items}
      lang={lang as Locale}
      dict={{
        library: dict.library,
        stamps: dict.stamps,
        collections: dict.collections,
        sort: dict.sort,
        common: dict.common,
        paginationLabel: dict.a11y.pagination,
      }}
    />
  );
}
