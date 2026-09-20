import React from 'react';
import Link from 'next/link';
import { Locale } from '@/lib/i18n';
import { Signal } from '@/lib/api/types';
import { Sheet } from '@/components/paper/Sheet';
import { Stamp } from '@/components/paper/Stamp';
import { Tag } from '@/components/paper/Tag';
import { ExternalLink } from 'lucide-react';

interface SignalCardProps {
  signal: Signal;
  lang: Locale;
  dict: {
    viewOriginal: string;
    stamps: {
      new: string;
      read: string;
      done: string;
      archived: string;
    };
  };
}

export function SignalCard({ signal, lang, dict }: SignalCardProps) {
  const formattedDate = new Date(signal.createdAt).toLocaleDateString(
    lang === 'uz' ? 'uz-UZ' : 'en-US',
    { month: 'short', day: 'numeric', year: 'numeric' }
  );

  const stampLabels = {
    new: dict.stamps.new,
    read: dict.stamps.read,
    done: dict.stamps.done,
    archived: dict.stamps.archived,
  };

  return (
    <Sheet className="p-5 sm:p-6 transition-all hover:border-ink/50 group flex flex-col justify-between">
      <div className="space-y-3">
        {/* Top Header Row */}
        <div className="flex items-center justify-between gap-2 border-b border-rule/70 pb-2.5">
          <div className="flex items-center gap-2 flex-wrap">
            <Stamp variant={signal.status} size="sm">
              {stampLabels[signal.status]}
            </Stamp>
            <span className="font-mono text-[11px] text-ink-muted uppercase tracking-wider truncate max-w-[200px]">
              {signal.sourceLabel}
            </span>
          </div>
          <time
            dateTime={signal.createdAt}
            className="font-mono text-[11px] text-ink-muted whitespace-nowrap"
          >
            {formattedDate}
          </time>
        </div>

        {/* Title */}
        <div>
          <Link
            href={`/${lang}/library/${signal.id}`}
            className="block font-serif text-lg sm:text-xl font-bold text-ink hover:text-seal transition-colors group-hover:underline decoration-rule underline-offset-4"
          >
            {signal.title}
          </Link>
          <p className="text-sm text-ink-soft mt-1.5 line-clamp-2 leading-relaxed">
            {signal.summary}
          </p>
        </div>
      </div>

      {/* Bottom Row: Tags and external link */}
      <div className="mt-4 pt-3 border-t border-rule/50 flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-1.5 flex-wrap">
          {signal.tags.slice(0, 3).map((tag) => (
            <Tag key={tag}>#{tag}</Tag>
          ))}
          {signal.tags.length > 3 && (
            <span className="font-mono text-[10px] text-ink-muted">
              +{signal.tags.length - 3}
            </span>
          )}
        </div>

        {signal.url && (
          <a
            href={signal.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-mono text-[11px] text-ink-muted hover:text-ink transition-colors whitespace-nowrap"
            aria-label={`${dict.viewOriginal}: ${signal.title}`}
          >
            <span>{dict.viewOriginal}</span>
            <ExternalLink className="w-3 h-3" aria-hidden="true" />
          </a>
        )}
      </div>
    </Sheet>
  );
}
