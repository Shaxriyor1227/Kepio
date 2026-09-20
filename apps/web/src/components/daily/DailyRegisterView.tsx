'use client';

import React, { useState } from 'react';
import { Locale } from '@/lib/i18n';
import { Signal } from '@/lib/api/types';
import { Sheet } from '@/components/paper/Sheet';
import { Stamp } from '@/components/paper/Stamp';
import { StickyNote } from '@/components/paper/StickyNote';
import { PaperButton } from '@/components/paper/PaperButton';
import { Download, Printer, Plus, CheckCircle2 } from 'lucide-react';
import { api } from '@/lib/api/client';

interface DailyRegisterViewProps {
  initialSignals: Signal[];
  lang: Locale;
  dict: {
    daily: {
      title: string;
      subtitle: string;
      stamp: string;
      quickEntryTitle: string;
      quickEntryPlaceholder: string;
      quickEntryButton: string;
      tableCaption: string;
      colDate: string;
      colSource: string;
      colContent: string;
      colStatus: string;
      colActions: string;
      memoTitle: string;
      memoContent: string;
      actionsTitle: string;
      exportCsv: string;
      printSheet: string;
      closeDayButton: string;
      progressTitle: string;
      progressSummary: string;
      emptyDaily: string;
    };
    stamps: {
      new: string;
      read: string;
      done: string;
      archived: string;
    };
  };
}

export function DailyRegisterView({
  initialSignals,
  lang,
  dict,
}: DailyRegisterViewProps) {
  const [signals, setSignals] = useState<Signal[]>(initialSignals);
  const [quickTitle, setQuickTitle] = useState('');
  const [dayClosed, setDayClosed] = useState(false);

  const handleQuickAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTitle.trim()) return;

    const newSig = await api.create({
      title: quickTitle,
      sourceType: 'other',
      sourceLabel: 'Quick Entry',
      collection: 'other',
      tags: ['daily'],
    });

    setSignals((prev) => [newSig, ...prev]);
    setQuickTitle('');
  };

  const handleExportCsv = () => {
    const headers = ['ID', 'Date', 'Source', 'Title', 'Status', 'URL'];
    const rows = signals.map((s) => [
      s.id,
      s.createdAt.split('T')[0],
      `"${s.sourceLabel.replace(/"/g, '""')}"`,
      `"${s.title.replace(/"/g, '""')}"`,
      s.status,
      s.url || '',
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `kepio-daily-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  const completedCount = signals.filter((s) => s.status === 'done').length;

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-rule pb-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-serif font-bold text-ink">
              {dict.daily.title}
            </h1>
            <Stamp variant="new" size="sm">
              {dict.daily.stamp}
            </Stamp>
          </div>
          <p className="text-sm text-ink-soft mt-1">
            {dict.daily.subtitle}
          </p>
        </div>

        <div className="font-mono text-xs text-ink-muted bg-paper px-3 py-1.5 border border-rule rounded-paper self-start sm:self-auto">
          {new Date().toLocaleDateString(lang === 'uz' ? 'uz-UZ' : 'en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </div>
      </div>

      {/* Quick Entry Form */}
      <Sheet className="p-4 sm:p-5">
        <form onSubmit={handleQuickAdd} className="flex flex-col sm:flex-row items-center gap-3">
          <label htmlFor="quick-entry" className="sr-only">
            {dict.daily.quickEntryTitle}
          </label>
          <div className="relative flex-1 w-full">
            <input
              id="quick-entry"
              type="text"
              value={quickTitle}
              onChange={(e) => setQuickTitle(e.target.value)}
              placeholder={dict.daily.quickEntryPlaceholder}
              className="w-full pl-3 pr-3 py-2 bg-paper border border-rule rounded-paper font-serif text-sm text-ink placeholder:text-ink-muted/50 focus:border-ink focus:outline-none focus:ring-1 focus:ring-ink"
            />
          </div>
          <button
            type="submit"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-ink text-on-ink font-mono text-xs uppercase tracking-wider rounded-paper hover:bg-ink-2 active:translate-y-0.5 transition-all whitespace-nowrap min-h-[38px]"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{dict.daily.quickEntryButton}</span>
          </button>
        </form>
      </Sheet>

      {/* Main Layout: Table (8 cols) + Right Sidebar (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Table Column */}
        <div className="lg:col-span-8 space-y-4">
          <div
            tabIndex={0}
            role="region"
            aria-label={dict.daily.tableCaption}
            className="overflow-x-auto border border-rule rounded-paper bg-paper shadow-sheet focus:outline-none focus:ring-2 focus:ring-ink"
          >
            <table className="w-full text-left border-collapse text-xs font-mono">
              <caption className="sr-only">{dict.daily.tableCaption}</caption>
              <thead>
                <tr className="border-b border-rule bg-desk/70 text-ink-muted uppercase tracking-wider">
                  <th scope="col" className="p-3 w-28">{dict.daily.colDate}</th>
                  <th scope="col" className="p-3 w-32">{dict.daily.colSource}</th>
                  <th scope="col" className="p-3">{dict.daily.colContent}</th>
                  <th scope="col" className="p-3 w-28 text-right">{dict.daily.colStatus}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-rule/60">
                {signals.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-ink-muted font-serif">
                      {dict.daily.emptyDaily}
                    </td>
                  </tr>
                ) : (
                  signals.slice(0, 10).map((sig) => (
                    <tr key={sig.id} className="hover:bg-desk/30 transition-colors">
                      <td className="p-3 text-ink-muted whitespace-nowrap">
                        {sig.createdAt.split('T')[0]}
                      </td>
                      <td className="p-3 text-ink-soft truncate max-w-[120px]">
                        {sig.sourceLabel}
                      </td>
                      <td className="p-3">
                        <div className="font-serif text-sm font-bold text-ink">
                          {sig.title}
                        </div>
                        <div className="text-ink-soft text-[11px] line-clamp-1 mt-0.5">
                          {sig.summary}
                        </div>
                      </td>
                      <td className="p-3 text-right whitespace-nowrap">
                        <Stamp variant={sig.status} size="sm">
                          {dict.stamps[sig.status]}
                        </Stamp>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Sidebar Actions & Memo */}
        <div className="lg:col-span-4 space-y-6">
          {/* Daily Memo */}
          <StickyNote color="yellow" pin rotate={-1} title={dict.daily.memoTitle}>
            {dict.daily.memoContent}
          </StickyNote>

          {/* Progress Card */}
          <Sheet className="p-5 space-y-3">
            <h2 className="font-mono text-xs uppercase tracking-wider font-bold text-ink">
              {dict.daily.progressTitle}
            </h2>
            <p className="text-xs text-ink-soft font-serif">
              {lang === 'uz'
                ? `Bugungi ${signals.length} ta qayddan ${completedCount} tasi yakunlandi.`
                : `Completed ${completedCount} out of ${signals.length} entries registered.`}
            </p>
            <div className="w-full bg-desk h-2 rounded-full overflow-hidden border border-rule">
              <div
                className="bg-[#1e5436] h-full transition-all"
                style={{
                  width: `${signals.length > 0 ? (completedCount / signals.length) * 100 : 0}%`,
                }}
              />
            </div>
          </Sheet>

          {/* Actions & Print */}
          <Sheet className="p-5 space-y-3">
            <h2 className="font-mono text-xs uppercase tracking-wider font-bold text-ink">
              {dict.daily.actionsTitle}
            </h2>
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={handleExportCsv}
                className="inline-flex items-center gap-2 px-3 py-2 bg-paper hover:bg-desk border border-rule rounded-paper font-mono text-xs text-ink transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{dict.daily.exportCsv}</span>
              </button>
              <button
                type="button"
                onClick={handlePrint}
                className="inline-flex items-center gap-2 px-3 py-2 bg-paper hover:bg-desk border border-rule rounded-paper font-mono text-xs text-ink transition-colors"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>{dict.daily.printSheet}</span>
              </button>
              <button
                type="button"
                onClick={() => setDayClosed(true)}
                disabled={dayClosed}
                className="inline-flex items-center justify-center gap-2 px-3 py-2 bg-seal text-white border border-seal rounded-paper font-mono text-xs uppercase tracking-wider hover:opacity-90 transition-opacity mt-2"
              >
                {dayClosed ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>✓ Yakunlandi</span>
                  </>
                ) : (
                  <span>{dict.daily.closeDayButton}</span>
                )}
              </button>
            </div>
          </Sheet>
        </div>
      </div>
    </div>
  );
}
