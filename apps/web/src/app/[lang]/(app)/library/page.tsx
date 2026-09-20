import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { isValidLocale, getDictionary, Locale } from '@/lib/i18n';
import { api } from '@/lib/api/client';
import { SignalCollection, SignalStatus } from '@/lib/api/types';
import { FolderTab } from '@/components/paper/FolderTab';
import { Sheet } from '@/components/paper/Sheet';
import { StickyNote } from '@/components/paper/StickyNote';
import { SignalCard } from '@/components/signals/SignalCard';
import { LibraryFilterBar } from '@/components/signals/LibraryFilterBar';
import { Pagination } from '@/components/paper/Pagination';
import { PaperButton } from '@/components/paper/PaperButton';
import { Inbox, Sparkles } from 'lucide-react';

interface LibraryPageProps {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{
    collection?: string;
    status?: string;
    q?: string;
    sort?: string;
    page?: string;
  }>;
}

export default async function LibraryPage({
  params,
  searchParams,
}: LibraryPageProps) {
  const { lang } = await params;
  if (!isValidLocale(lang)) {
    notFound();
  }

  const dict = getDictionary(lang);
  const sp = await searchParams;

  const currentCollection = sp.collection || 'all';
  const currentStatus = sp.status || 'all';
  const currentQ = sp.q || '';
  const currentSort = (sp.sort as 'recent' | 'oldest' | 'title') || 'recent';
  const currentPage = parseInt(sp.page || '1', 10) || 1;

  const result = await api.list({
    collection: currentCollection,
    status: currentStatus,
    q: currentQ,
    sort: currentSort,
    page: currentPage,
    pageSize: 6,
  });

  const collectionsList: { key: string; label: string; count: number }[] = [
    { key: 'all', label: dict.collections.all, count: result.counts.total },
    { key: 'jobs', label: dict.collections.jobs, count: result.counts.byCollection.jobs || 0 },
    { key: 'freelance', label: dict.collections.freelance, count: result.counts.byCollection.freelance || 0 },
    { key: 'courses', label: dict.collections.courses, count: result.counts.byCollection.courses || 0 },
    { key: 'housing', label: dict.collections.housing, count: result.counts.byCollection.housing || 0 },
    { key: 'tools', label: dict.collections.tools, count: result.counts.byCollection.tools || 0 },
  ];

  const buildUrl = (newParams: Record<string, string | number | undefined>) => {
    const params = new URLSearchParams();
    const merged = {
      collection: currentCollection !== 'all' ? currentCollection : undefined,
      status: currentStatus !== 'all' ? currentStatus : undefined,
      q: currentQ || undefined,
      sort: currentSort !== 'recent' ? currentSort : undefined,
      page: currentPage > 1 ? currentPage : undefined,
      ...newParams,
    };

    Object.entries(merged).forEach(([k, v]) => {
      if (v !== undefined && v !== '' && v !== 'all') {
        params.set(k, String(v));
      }
    });

    const qs = params.toString();
    return `/${lang}/library${qs ? `?${qs}` : ''}`;
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Top Collection Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto scrollbar-none border-b border-rule pt-2">
        {collectionsList.map((col) => {
          const isActive = currentCollection === col.key;
          return (
            <FolderTab
              key={col.key}
              href={buildUrl({ collection: col.key, page: undefined })}
              active={isActive}
              count={col.count}
            >
              {col.label}
            </FolderTab>
          );
        })}
        <FolderTab href="#" disabled>
          {dict.collections.newCollectionDisabled}
        </FolderTab>
      </div>

      {/* Filter & Search Bar */}
      <LibraryFilterBar
        currentQ={currentQ}
        currentStatus={currentStatus}
        currentSort={currentSort}
        counts={{
          total: result.counts.total,
          byStatus: result.counts.byStatus,
        }}
        dict={{
          searchPlaceholder: dict.library.searchPlaceholder,
          allStatus: dict.common.statusAll,
          sortLabel: dict.sort.label,
          sortRecent: dict.sort.recent,
          sortOldest: dict.sort.oldest,
          sortTitle: dict.sort.title,
          stamps: dict.stamps,
        }}
      />

      {/* Main Content Layout: Items Grid + Margin Column */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Signals List (8 cols on desktop) */}
        <section aria-label={dict.library.title} className="lg:col-span-8 space-y-6">
          {result.items.length === 0 ? (
            <Sheet className="p-8 sm:p-12 text-center space-y-4">
              <div className="w-12 h-12 mx-auto rounded-full bg-desk border border-rule flex items-center justify-center text-ink-muted">
                <Inbox className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-serif font-bold text-ink">
                {dict.library.emptyTitle}
              </h2>
              <p className="text-sm text-ink-soft max-w-md mx-auto leading-relaxed">
                {dict.library.emptyDesc}
              </p>
              <div className="pt-2">
                <PaperButton href={`/${lang}/library`} variant="secondary">
                  {dict.library.emptyReset}
                </PaperButton>
              </div>
            </Sheet>
          ) : (
            <div className="space-y-4">
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

              {/* Pagination */}
              <Pagination
                page={result.page}
                totalPages={result.totalPages}
                total={result.total}
                dict={{
                  page: dict.common.page,
                  of: dict.common.of,
                  total: dict.common.total,
                }}
                createPageUrl={(p) => buildUrl({ page: p })}
              />
            </div>
          )}
        </section>

        {/* Margin Column ("From the margin" - max 3 sticky notes + stats card) */}
        <aside
          aria-label={dict.library.fromTheMargin}
          className="lg:col-span-4 space-y-6"
        >
          <div className="space-y-4">
            <h2 className="font-mono text-xs uppercase tracking-widest text-ink-muted font-bold">
              {dict.library.fromTheMargin}
            </h2>

            {/* Sticky Note 1 */}
            <StickyNote color="yellow" pin rotate={-1} title="Eslatma">
              {lang === 'uz'
                ? 'Juma kunigacha rezyumelarni yangilab, koʻrib chiqilgan vakansiyalarga taklif yuborish.'
                : 'Update resumes by Friday and send proposals for shortlisted job postings.'}
            </StickyNote>

            {/* Sticky Note 2 */}
            <StickyNote color="green" rotate={1} title="Tavsiya">
              {lang === 'uz'
                ? 'PostgreSQL indekslar boʻyicha maqolani jamoa bilan ulashish va muhokama qilish.'
                : 'Share the PostgreSQL indexing article with the team and discuss query plans.'}
            </StickyNote>

            {/* Sticky Note 3 */}
            <StickyNote color="rose" pin rotate={-1} title="Tez orada">
              {lang === 'uz'
                ? 'Telegram bot integratsiyasi orqali toʻgʻridan-toʻgʻri chatdan saqlash imkoniyati keladi.'
                : 'Telegram bot integration will soon allow saving signals directly from your chat.'}
            </StickyNote>

            {/* Stats Card */}
            <Sheet className="p-4 space-y-3 bg-paper">
              <div className="flex items-center gap-2 border-b border-rule/60 pb-2">
                <Sparkles className="w-3.5 h-3.5 text-seal" />
                <span className="font-mono text-xs font-bold text-ink uppercase">
                  {dict.library.statsTitle}
                </span>
              </div>
              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between text-ink-soft">
                  <span>{dict.library.statsTotal}:</span>
                  <span className="font-bold text-ink">{result.counts.total}</span>
                </div>
                <div className="flex justify-between text-ink-soft">
                  <span>{dict.library.statsActive}:</span>
                  <span className="font-bold text-ink">
                    {(result.counts.byStatus.new || 0) + (result.counts.byStatus.read || 0)}
                  </span>
                </div>
                <div className="flex justify-between text-ink-soft">
                  <span>{dict.library.statsCompleted}:</span>
                  <span className="font-bold text-[#1e5436]">
                    {result.counts.byStatus.done || 0}
                  </span>
                </div>
              </div>
            </Sheet>
          </div>
        </aside>
      </div>
    </div>
  );
}
