'use client';

import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import { Locale } from '@/lib/i18n';
import { Signal, SignalStatus } from '@/lib/api/types';
import { Sheet } from '@/components/paper/Sheet';
import { Stamp } from '@/components/paper/Stamp';
import { StickyNote } from '@/components/paper/StickyNote';
import { Tag } from '@/components/paper/Tag';
import { Rule } from '@/components/paper/Rule';
import { QuoteBlock } from '@/components/paper/QuoteBlock';
import { StatusControl } from './StatusControl';
import { ExternalLink, Calendar, CheckSquare, Square, ArrowLeft } from 'lucide-react';
import { api } from '@/lib/api/client';

interface SignalDetailViewProps {
  initialSignal: Signal;
  lang: Locale;
  dict: {
    backToLibrary: string;
    viewOriginal: string;
    nextStepTitle: string;
    deadlineLabel: string;
    noDeadline: string;
    statusChangeSuccess: string;
    stamps: {
      new: string;
      read: string;
      done: string;
      archived: string;
    };
    a11yStatusGroup: string;
  };
}

export function SignalDetailView({
  initialSignal,
  lang,
  dict,
}: SignalDetailViewProps) {
  const [signal, setSignal] = useState<Signal>(initialSignal);
  const [isNextStepDone, setIsNextStepDone] = useState<boolean>(signal.status === 'done');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleStatusChange = (newStatus: SignalStatus) => {
    // Optimistic update
    setSignal((prev) => ({ ...prev, status: newStatus }));
    if (newStatus === 'done') setIsNextStepDone(true);
    setToastMessage(dict.statusChangeSuccess);

    startTransition(async () => {
      await api.updateStatus(signal.id, newStatus);
      setTimeout(() => setToastMessage(null), 3000);
    });
  };

  const handleToggleNextStep = () => {
    const nextState = !isNextStepDone;
    setIsNextStepDone(nextState);
    if (nextState) {
      handleStatusChange('done');
    } else {
      handleStatusChange('read');
    }
  };

  const formattedDate = new Date(signal.createdAt).toLocaleDateString(
    lang === 'uz' ? 'uz-UZ' : 'en-US',
    { month: 'long', day: 'numeric', year: 'numeric' }
  );

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Toast Notification (aria-live) */}
      <div
        aria-live="polite"
        className="fixed top-4 right-4 z-50 transition-all pointer-events-none"
      >
        {toastMessage && (
          <div className="px-4 py-2 bg-ink text-on-ink font-mono text-xs rounded-paper shadow-sheet border border-rule animate-bounce pointer-events-auto">
            ✓ {toastMessage}
          </div>
        )}
      </div>

      {/* Back link */}
      <div>
        <Link
          href={`/${lang}/library`}
          className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-ink-muted hover:text-ink transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{dict.backToLibrary}</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Document Sheet (8 cols) */}
        <div className="lg:col-span-8">
          <Sheet className="p-6 sm:p-10 space-y-6">
            {/* Header Metadata */}
            <div className="flex items-center justify-between gap-3 border-b border-rule pb-4 flex-wrap">
              <div className="flex items-center gap-2">
                <Stamp variant={signal.status} size="md">
                  {dict.stamps[signal.status]}
                </Stamp>
                <span className="font-mono text-xs text-ink-muted uppercase tracking-wider">
                  {signal.sourceLabel}
                </span>
              </div>
              <time
                dateTime={signal.createdAt}
                className="font-mono text-xs text-ink-muted"
              >
                {formattedDate}
              </time>
            </div>

            {/* Title & Body */}
            <div className="space-y-4">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-ink leading-tight">
                {signal.title}
              </h1>

              <p className="text-base sm:text-lg text-ink-soft leading-relaxed max-w-[68ch]">
                {signal.summary}
              </p>
            </div>

            <Rule />

            {/* Secondary Memo Quote Block */}
            {signal.note && (
              <QuoteBlock>
                <span className="font-serif italic text-ink">{signal.note}</span>
              </QuoteBlock>
            )}

            {/* Tags Row */}
            <div className="flex items-center gap-2 flex-wrap pt-2">
              {signal.tags.map((tag) => (
                <Tag key={tag}>#{tag}</Tag>
              ))}
            </div>

            {/* Source Link */}
            {signal.url && (
              <div className="pt-4 border-t border-rule/60 flex items-center justify-between">
                <a
                  href={signal.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-2 bg-desk hover:bg-paper border border-rule rounded-paper font-mono text-xs text-ink transition-colors"
                >
                  <span>{dict.viewOriginal}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            )}
          </Sheet>
        </div>

        {/* Sidebar Controls & Next Step Sticky (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Status Control */}
          <Sheet className="p-5 space-y-3">
            <StatusControl
              currentStatus={signal.status}
              onChange={handleStatusChange}
              label={dict.a11yStatusGroup}
              labels={dict.stamps}
              disabled={isPending}
            />
          </Sheet>

          {/* Next Step Sticky Note */}
          <StickyNote color="yellow" pin rotate={1} title={dict.nextStepTitle}>
            <div className="space-y-3">
              <button
                type="button"
                onClick={handleToggleNextStep}
                className="flex items-start gap-2 text-left group focus:outline-none"
              >
                {isNextStepDone ? (
                  <CheckSquare className="w-4 h-4 mt-0.5 text-[#1e5436] shrink-0" />
                ) : (
                  <Square className="w-4 h-4 mt-0.5 text-ink-muted group-hover:text-ink shrink-0" />
                )}
                <span
                  className={`text-xs font-serif leading-relaxed ${
                    isNextStepDone ? 'line-through text-ink-muted' : 'text-ink'
                  }`}
                >
                  {signal.note || (lang === 'uz' ? 'Ushbu manba boʻyicha amaliy qadamni rejalashtiring.' : 'Plan the actionable next step for this finding.')}
                </span>
              </button>

              <div className="pt-2 border-t border-ink/10 flex items-center gap-1.5 font-mono text-[11px] text-ink-muted">
                <Calendar className="w-3.5 h-3.5" />
                <span>
                  {dict.deadlineLabel}:{' '}
                  <strong className="text-ink">
                    {signal.deadline || dict.noDeadline}
                  </strong>
                </span>
              </div>
            </div>
          </StickyNote>
        </div>
      </div>
    </div>
  );
}
