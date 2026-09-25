'use client';

import React, { useState, useMemo, useEffect, useTransition } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Locale } from '@/lib/i18n';
import { Signal, SignalStatus } from '@/lib/api/types';
import { Sheet } from '@/components/paper/Sheet';
import { StickyNote } from '@/components/paper/StickyNote';
import { SignalCard } from '@/components/signals/SignalCard';
import { Pagination } from '@/components/paper/Pagination';
import { PaperButton } from '@/components/paper/PaperButton';
import { Search, Inbox, Sparkles } from 'lucide-react';
import { cn } from '@/lib/cn';
import { getPersistedSignals } from '@/lib/api/client';

interface LibraryInteractiveViewProps {
  initialSignals: Signal[];
  lang: Locale;
  dict: {
    library: {
      title: string;
      searchPlaceholder: string;
      searchShortcutHint: string;
      fromTheMargin: string;
      statsTitle: string;
      statsTotal: string;
      statsActive: string;
      statsCompleted: string;
      emptyTitle: string;
      emptyDesc: string;
      emptyReset: string;
      viewOriginal: string;
    };
    stamps: {
      new: string;
      read: string;
      done: string;
      archived: string;
    };
    collections: Record<string, string>;
    sort: {
      label: string;
      recent: string;
      oldest: string;
      title: string;
    };
    common: {
      page: string;
      of: string;
      total: string;
      statusAll: string;
    };
    paginationLabel: string;
  };
}

export function LibraryInteractiveView({
  initialSignals,
  lang,
  dict,
}: LibraryInteractiveViewProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();
  const [signals, setSignals] = useState<Signal[]>(initialSignals);

  useEffect(() => {
    const persisted = getPersistedSignals();
    if (persisted.length === 0) return;
    const persistedIds = new Set(persisted.map((signal) => signal.id));
    setSignals([...persisted, ...initialSignals.filter((signal) => !persistedIds.has(signal.id))]);
  }, [initialSignals]);

  const [collection, setCollection] = useState<string>(
    searchParams?.get('collection') || 'all'
  );
  const [status, setStatus] = useState<string>(
    searchParams?.get('status') || 'all'
  );
  const [query, setQuery] = useState<string>(
    searchParams?.get('q') || ''
  );
  const [sort, setSort] = useState<'recent' | 'oldest' | 'title'>(
    (searchParams?.get('sort') as 'recent' | 'oldest' | 'title') || 'recent'
  );
  const [page, setPage] = useState<number>(
    parseInt(searchParams?.get('page') || '1', 10) || 1
  );

  // Sync state with URL if user navigates via browser back/forward
  useEffect(() => {
    const urlCol = searchParams?.get('collection') || 'all';
    const urlStat = searchParams?.get('status') || 'all';
    const urlQ = searchParams?.get('q') || '';
    const urlSort = (searchParams?.get('sort') as 'recent' | 'oldest' | 'title') || 'recent';
    const urlPage = parseInt(searchParams?.get('page') || '1', 10) || 1;

    setCollection(urlCol);
    setStatus(urlStat);
    setQuery(urlQ);
    setSort(urlSort);
    setPage(urlPage);
  }, [searchParams]);

  // Push updates to URL smoothly in background
  const syncUrl = (newParams: {
    collection?: string;
    status?: string;
    q?: string;
    sort?: string;
    page?: number;
  }) => {
    const nextCol = newParams.collection !== undefined ? newParams.collection : collection;
    const nextStat = newParams.status !== undefined ? newParams.status : status;
    const nextQ = newParams.q !== undefined ? newParams.q : query;
    const nextSort = newParams.sort !== undefined ? newParams.sort : sort;
    const nextPage = newParams.page !== undefined ? newParams.page : (newParams.collection || newParams.status || newParams.q ? 1 : page);

    const sp = new URLSearchParams();
    if (nextCol && nextCol !== 'all') sp.set('collection', nextCol);
    if (nextStat && nextStat !== 'all') sp.set('status', nextStat);
    if (nextQ.trim()) sp.set('q', nextQ.trim());
    if (nextSort && nextSort !== 'recent') sp.set('sort', nextSort);
    if (nextPage > 1) sp.set('page', String(nextPage));

    const qs = sp.toString();
    startTransition(() => {
      router.replace(`${pathname}${qs ? `?${qs}` : ''}`, { scroll: false });
    });
  };

  // Instant calculation of counts across all signals
  const counts = useMemo(() => {
    const byCollection: Record<string, number> = {
      all: signals.length,
      jobs: 0,
      freelance: 0,
      courses: 0,
      housing: 0,
      tools: 0,
      other: 0,
    };
    const byStatus: Record<SignalStatus, number> = {
      new: 0,
      read: 0,
      done: 0,
      archived: 0,
    };

    for (const item of signals) {
      if (byCollection[item.collection] !== undefined) byCollection[item.collection]++;
      if (byStatus[item.status] !== undefined) byStatus[item.status]++;
    }

    return { total: signals.length, byCollection, byStatus };
  }, [signals]);

  // Instant client-side memoized filtered list (0ms response)
  const filteredSignals = useMemo(() => {
    let list = [...signals];

    if (collection && collection !== 'all') {
      list = list.filter((s) => s.collection === collection);
    }

    if (status && status !== 'all') {
      list = list.filter((s) => s.status === status);
    }

    if (query.trim()) {
      const qClean = query.trim().toLowerCase();
      list = list.filter((s) => {
        const titleMatch = s.title.toLowerCase().includes(qClean);
        const summaryMatch = s.summary.toLowerCase().includes(qClean);
        const tagMatch = s.tags.some((t) => t.toLowerCase().includes(qClean));
        const sourceMatch = s.sourceLabel.toLowerCase().includes(qClean);
        return titleMatch || summaryMatch || tagMatch || sourceMatch;
      });
    }

    list.sort((a, b) => {
      if (sort === 'oldest') return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      if (sort === 'title') return a.title.localeCompare(b.title);
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return list;
  }, [signals, collection, status, query, sort]);

  const pageSize = 6;
  const totalPages = Math.max(1, Math.ceil(filteredSignals.length / pageSize));
  const currentPage = Math.min(Math.max(1, page), totalPages);
  const pagedItems = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredSignals.slice(start, start + pageSize);
  }, [filteredSignals, currentPage]);

  const collectionsList = [
    { key: 'all', label: dict.collections.all, count: counts.total },
    { key: 'jobs', label: dict.collections.jobs, count: counts.byCollection.jobs || 0 },
    { key: 'freelance', label: dict.collections.freelance, count: counts.byCollection.freelance || 0 },
    { key: 'courses', label: dict.collections.courses, count: counts.byCollection.courses || 0 },
    { key: 'housing', label: dict.collections.housing, count: counts.byCollection.housing || 0 },
    { key: 'tools', label: dict.collections.tools, count: counts.byCollection.tools || 0 },
  ];

  const statuses = [
    { key: 'all', label: dict.common.statusAll, count: filteredSignals.length },
    { key: 'new', label: dict.stamps.new, count: counts.byStatus.new },
    { key: 'read', label: dict.stamps.read, count: counts.byStatus.read },
    { key: 'done', label: dict.stamps.done, count: counts.byStatus.done },
    { key: 'archived', label: dict.stamps.archived, count: counts.byStatus.archived },
  ];

  const handleCollectionChange = (key: string) => {
    setCollection(key);
    setPage(1);
    syncUrl({ collection: key, page: 1 });
  };

  const handleStatusChange = (key: string) => {
    setStatus(key);
    setPage(1);
    syncUrl({ status: key, page: 1 });
  };

  const handleQueryChange = (val: string) => {
    setQuery(val);
    setPage(1);
    syncUrl({ q: val, page: 1 });
  };

  const handleSortChange = (newSort: 'recent' | 'oldest' | 'title') => {
    setSort(newSort);
    syncUrl({ sort: newSort });
  };

  const handleResetFilters = () => {
    setCollection('all');
    setStatus('all');
    setQuery('');
    setSort('recent');
    setPage(1);
    syncUrl({ collection: 'all', status: 'all', q: '', sort: 'recent', page: 1 });
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      <h1 className="text-2xl sm:text-3xl font-serif font-bold text-ink">
        {dict.library.title}
      </h1>

      {/* Top Folder Tabs (0ms Instant Switch) */}
      <div className="flex items-center gap-1 overflow-x-auto scrollbar-none border-b border-rule pt-2">
        {collectionsList.map((col) => {
          const isActive = collection === col.key;
          return (
            <button
              key={col.key}
              type="button"
              onClick={() => handleCollectionChange(col.key)}
              aria-current={isActive ? 'page' : undefined}
              className={cn(
                'inline-flex items-center gap-2 px-4 py-2 font-mono text-xs uppercase tracking-wider whitespace-nowrap select-none transition-all',
                'border-t border-x rounded-t-paper cursor-pointer',
                isActive
                  ? 'bg-paper text-ink font-bold border-rule -mb-px z-10 shadow-[0_-2px_4px_rgba(0,0,0,0.03)]'
                  : 'bg-desk text-ink-muted hover:text-ink hover:bg-paper/70 border-rule/70'
              )}
            >
              <span>{col.label}</span>
              <span
                className={cn(
                  'inline-block px-1.5 py-0.2 rounded-sm text-[10px] font-mono leading-tight',
                  isActive ? 'bg-ink text-on-ink' : 'bg-rule text-ink-soft'
                )}
              >
                {col.count}
              </span>
            </button>
          );
        })}
        <span
          className="inline-flex items-center gap-1.5 px-3 py-2 font-mono text-xs uppercase tracking-wider text-ink-muted/50 bg-desk/40 border-t border-x border-rule/40 cursor-not-allowed select-none whitespace-nowrap"
          aria-disabled="true"
        >
          {dict.collections.newCollectionDisabled}
        </span>
      </div>

      {/* Filter & Search Bar */}
      <div className="space-y-3 pt-2 pb-4 border-b border-rule">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search input with instant filter */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted pointer-events-none" />
            <input
              type="search"
              value={query}
              onChange={(e) => handleQueryChange(e.target.value)}
              placeholder={dict.library.searchPlaceholder}
              className="w-full pl-9 pr-3 py-1.5 bg-paper border border-rule rounded-paper font-serif text-xs text-ink placeholder:text-ink-muted/60 focus:outline-none focus:border-ink focus:ring-1 focus:ring-ink transition-colors"
            />
          </div>

          {/* Sort dropdown */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <label htmlFor="library-sort" className="font-mono text-xs text-ink-muted uppercase whitespace-nowrap">
              {dict.sort.label}:
            </label>
            <select
              id="library-sort"
              value={sort}
              onChange={(e) => handleSortChange(e.target.value as 'recent' | 'oldest' | 'title')}
              className="bg-paper border border-rule rounded-paper py-1 px-2.5 font-mono text-xs text-ink focus:outline-none focus:border-ink transition-colors cursor-pointer"
            >
              <option value="recent">{dict.sort.recent}</option>
              <option value="oldest">{dict.sort.oldest}</option>
              <option value="title">{dict.sort.title}</option>
            </select>
          </div>
        </div>

        {/* Status Chips */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1">
          {statuses.map((item) => {
            const isSelected = status === item.key;
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => handleStatusChange(item.key)}
                className={cn(
                  'inline-flex items-center gap-1.5 px-3 py-1 rounded-paper font-mono text-xs uppercase tracking-wider transition-all whitespace-nowrap border min-h-[32px] cursor-pointer',
                  isSelected
                    ? 'bg-ink text-on-ink border-ink font-bold shadow-sm'
                    : 'bg-paper text-ink-muted border-rule hover:border-ink/50 hover:text-ink'
                )}
              >
                <span>{item.label}</span>
                <span
                  className={cn(
                    'px-1.5 py-0.2 rounded-sm text-[10px]',
                    isSelected ? 'bg-paper/20 text-on-ink' : 'bg-desk text-ink-muted'
                  )}
                >
                  {item.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Grid + Margin Column */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Signals List */}
        <section aria-label={dict.library.title} className="lg:col-span-8 space-y-6">
          {filteredSignals.length === 0 ? (
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
                <PaperButton onClick={handleResetFilters} variant="secondary">
                  {dict.library.emptyReset}
                </PaperButton>
              </div>
            </Sheet>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {pagedItems.map((signal) => (
                  <SignalCard
                    key={signal.id}
                    signal={signal}
                    lang={lang}
                    dict={{
                      viewOriginal: dict.library.viewOriginal,
                      stamps: dict.stamps,
                    }}
                  />
                ))}
              </div>

              {/* Pagination */}
              <Pagination
                page={currentPage}
                totalPages={totalPages}
                total={filteredSignals.length}
                dict={{
                  page: dict.common.page,
                  of: dict.common.of,
                  total: dict.common.total,
                  label: dict.paginationLabel,
                }}
                createPageUrl={(p) => {
                  const sp = new URLSearchParams();
                  if (collection !== 'all') sp.set('collection', collection);
                  if (status !== 'all') sp.set('status', status);
                  if (query) sp.set('q', query);
                  if (sort !== 'recent') sp.set('sort', sort);
                  if (p > 1) sp.set('page', String(p));
                  const qs = sp.toString();
                  return `/${lang}/library${qs ? `?${qs}` : ''}`;
                }}
              />
            </div>
          )}
        </section>

        {/* Margin Column */}
        <aside
          aria-label={dict.library.fromTheMargin}
          className="lg:col-span-4 space-y-6"
        >
          <div className="space-y-4">
            <h2 className="font-mono text-xs uppercase tracking-widest text-ink-muted font-bold">
              {dict.library.fromTheMargin}
            </h2>

            <StickyNote color="yellow" pin rotate={-1} title="Eslatma">
              {lang === 'uz'
                ? 'Juma kunigacha rezyumelarni yangilab, koʻrib chiqilgan vakansiyalarga taklif yuborish.'
                : 'Update resumes by Friday and send proposals for shortlisted job postings.'}
            </StickyNote>

            <StickyNote color="green" rotate={1} title="Tavsiya">
              {lang === 'uz'
                ? 'PostgreSQL indekslar boʻyicha maqolani jamoa bilan ulashish va muhokama qilish.'
                : 'Share the PostgreSQL indexing article with the team and discuss query plans.'}
            </StickyNote>

            <StickyNote color="rose" pin rotate={-1} title="Tez orada">
              {lang === 'uz'
                ? 'Telegram bot integratsiyasi orqali toʻgʻridan-toʻgʻri chatdan saqlash imkoniyati keladi.'
                : 'Telegram bot integration will soon allow saving signals directly from your chat.'}
            </StickyNote>

            {/* Live Stats */}
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
                  <span className="font-bold text-ink">{counts.total}</span>
                </div>
                <div className="flex justify-between text-ink-soft">
                  <span>{dict.library.statsActive}:</span>
                  <span className="font-bold text-ink">
                    {counts.byStatus.new + counts.byStatus.read}
                  </span>
                </div>
                <div className="flex justify-between text-ink-soft">
                  <span>{dict.library.statsCompleted}:</span>
                  <span className="font-bold text-[#1e5436]">
                    {counts.byStatus.done}
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
