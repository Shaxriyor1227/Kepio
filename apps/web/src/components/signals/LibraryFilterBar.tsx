'use client';

import React, { useCallback, useTransition, useState, useEffect } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Search } from 'lucide-react';
import { cn } from '@/lib/cn';
import { SignalStatus } from '@/lib/api/types';

interface LibraryFilterBarProps {
  currentQ?: string;
  currentStatus?: string;
  currentSort?: string;
  counts: {
    total: number;
    byStatus: Record<SignalStatus, number>;
  };
  dict: {
    searchPlaceholder: string;
    allStatus: string;
    sortLabel: string;
    sortRecent: string;
    sortOldest: string;
    sortTitle: string;
    stamps: {
      new: string;
      read: string;
      done: string;
      archived: string;
    };
  };
}

export function LibraryFilterBar({
  currentQ = '',
  currentStatus = 'all',
  currentSort = 'recent',
  counts,
  dict,
}: LibraryFilterBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const [searchTerm, setSearchTerm] = useState(currentQ);

  useEffect(() => {
    setSearchTerm(currentQ);
  }, [currentQ]);

  const updateFilters = useCallback((updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams?.toString() || '');

    // Reset page to 1 on filter/search change unless page is explicitly updated
    if (!updates.page) {
      params.delete('page');
    }

    Object.entries(updates).forEach(([key, val]) => {
      if (val === null || val === '' || (key === 'status' && val === 'all') || (key === 'sort' && val === 'recent')) {
        params.delete(key);
      } else {
        params.set(key, val);
      }
    });

    startTransition(() => {
      const qs = params.toString();
      router.replace(`${pathname}${qs ? `?${qs}` : ''}`);
    });
  }, [pathname, router, searchParams]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm !== currentQ) {
        updateFilters({ q: searchTerm || null });
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [currentQ, searchTerm, updateFilters]);

  const statuses: { key: string; label: string; count: number }[] = [
    { key: 'all', label: dict.allStatus, count: counts.total },
    { key: 'new', label: dict.stamps.new, count: counts.byStatus.new || 0 },
    { key: 'read', label: dict.stamps.read, count: counts.byStatus.read || 0 },
    { key: 'done', label: dict.stamps.done, count: counts.byStatus.done || 0 },
    { key: 'archived', label: dict.stamps.archived, count: counts.byStatus.archived || 0 },
  ];

  return (
    <div className="space-y-3 pt-2 pb-4 border-b border-rule">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted pointer-events-none" />
          <input
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={dict.searchPlaceholder}
            className="w-full pl-9 pr-3 py-1.5 bg-paper border border-rule rounded-paper font-serif text-xs text-ink placeholder:text-ink-muted/60 focus:outline-none focus:border-ink focus:ring-1 focus:ring-ink transition-colors"
          />
        </div>

        {/* Sort dropdown */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <label htmlFor="sort-select" className="font-mono text-xs text-ink-muted uppercase whitespace-nowrap">
            {dict.sortLabel}:
          </label>
          <select
            id="sort-select"
            value={currentSort}
            onChange={(e) => updateFilters({ sort: e.target.value })}
            className="bg-paper border border-rule rounded-paper py-1 px-2.5 font-mono text-xs text-ink focus:outline-none focus:border-ink transition-colors cursor-pointer"
          >
            <option value="recent">{dict.sortRecent}</option>
            <option value="oldest">{dict.sortOldest}</option>
            <option value="title">{dict.sortTitle}</option>
          </select>
        </div>
      </div>

      {/* Status Chips */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1">
        {statuses.map((item) => {
          const isSelected = (currentStatus || 'all') === item.key;
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => updateFilters({ status: item.key })}
              className={cn(
                'inline-flex items-center gap-1.5 px-3 py-1 rounded-paper font-mono text-xs uppercase tracking-wider transition-all whitespace-nowrap border min-h-[32px]',
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
  );
}
