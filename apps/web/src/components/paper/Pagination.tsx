import React from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  page: number;
  totalPages: number;
  total: number;
  dict: {
    page: string;
    of: string;
    total: string;
  };
  createPageUrl: (pageNumber: number) => string;
}

export function Pagination({
  page,
  totalPages,
  total,
  dict,
  createPageUrl,
}: PaginationProps) {
  if (totalPages <= 1) {
    return (
      <div className="flex items-center justify-between py-4 border-t border-rule text-xs font-mono text-ink-muted">
        <span>
          {dict.total}: {total}
        </span>
      </div>
    );
  }

  const hasPrev = page > 1;
  const hasNext = page < totalPages;

  return (
    <nav
      aria-label="Pagination"
      className="flex items-center justify-between py-4 border-t border-rule flex-wrap gap-3"
    >
      <div className="font-mono text-xs text-ink-muted whitespace-nowrap">
        {dict.page} <span className="font-bold text-ink">{page}</span> {dict.of} {totalPages} · {dict.total}: {total}
      </div>

      <div className="flex items-center gap-2">
        {hasPrev ? (
          <Link
            href={createPageUrl(page - 1)}
            className="inline-flex items-center gap-1 px-3 py-1.5 bg-paper border border-rule rounded-paper text-xs font-mono text-ink hover:border-ink transition-colors min-h-[36px]"
            aria-label={`${dict.page} ${page - 1}`}
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{dict.page} {page - 1}</span>
          </Link>
        ) : (
          <span
            className="inline-flex items-center gap-1 px-3 py-1.5 bg-desk border border-rule/50 rounded-paper text-xs font-mono text-ink-muted/50 cursor-not-allowed min-h-[36px]"
            aria-disabled="true"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </span>
        )}

        {hasNext ? (
          <Link
            href={createPageUrl(page + 1)}
            className="inline-flex items-center gap-1 px-3 py-1.5 bg-paper border border-rule rounded-paper text-xs font-mono text-ink hover:border-ink transition-colors min-h-[36px]"
            aria-label={`${dict.page} ${page + 1}`}
          >
            <span className="hidden sm:inline">{dict.page} {page + 1}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        ) : (
          <span
            className="inline-flex items-center gap-1 px-3 py-1.5 bg-desk border border-rule/50 rounded-paper text-xs font-mono text-ink-muted/50 cursor-not-allowed min-h-[36px]"
            aria-disabled="true"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </span>
        )}
      </div>
    </nav>
  );
}
