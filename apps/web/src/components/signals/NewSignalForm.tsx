'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Locale } from '@/lib/i18n';
import { SignalCollection, SignalSourceType } from '@/lib/api/types';
import { Sheet } from '@/components/paper/Sheet';
import { Field } from '@/components/paper/Field';
import { PaperButton } from '@/components/paper/PaperButton';
import { TagInput } from './TagInput';
import { Rule } from '@/components/paper/Rule';
import { api } from '@/lib/api/client';
import { cn } from '@/lib/cn';
import { ArrowLeft, AlertCircle, Sparkles, Loader2 } from 'lucide-react';

interface NewSignalFormProps {
  lang: Locale;
  dict: {
    backToLibrary: string;
    forms: {
      newSignalTitle: string;
      newSignalSubtitle: string;
      urlOrTextLabel: string;
      urlOrTextPlaceholder: string;
      titleLabel: string;
      titlePlaceholder: string;
      summaryLabel: string;
      summaryPlaceholder: string;
      sourceTypeLabel: string;
      sourceTelegram: string;
      sourceWeb: string;
      sourceOther: string;
      sourceChannelLabel: string;
      sourceChannelPlaceholder: string;
      collectionLabel: string;
      tagsLabel: string;
      tagsPlaceholder: string;
      tagsHint: string;
      noteLabel: string;
      notePlaceholder: string;
      deadlineLabel: string;
      submitButton: string;
      submitting: string;
      cancelButton: string;
      successToast: string;
      errors: {
        titleRequired: string;
        urlInvalid: string;
        collectionRequired: string;
      };
    };
    collections: Record<string, string>;
    a11yErrorSummary: string;
  };
}

const collectionsList: { key: SignalCollection; labelKey: string }[] = [
  { key: 'jobs', labelKey: 'jobs' },
  { key: 'freelance', labelKey: 'freelance' },
  { key: 'courses', labelKey: 'courses' },
  { key: 'housing', labelKey: 'housing' },
  { key: 'tools', labelKey: 'tools' },
  { key: 'other', labelKey: 'other' },
];

export function NewSignalForm({ lang, dict }: NewSignalFormProps) {
  const router = useRouter();
  const errorSummaryRef = useRef<HTMLDivElement>(null);

  const [urlOrText, setUrlOrText] = useState('');
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [sourceType, setSourceType] = useState<SignalSourceType>('web');
  const [sourceLabel, setSourceLabel] = useState('');
  const [collection, setCollection] = useState<SignalCollection>('jobs');
  const [tags, setTags] = useState<string[]>(['general']);
  const [note, setNote] = useState('');
  const [deadline, setDeadline] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // AI Magic Auto-Fill function
  const handleAiAutoFill = async () => {
    if (!urlOrText.trim()) return;

    setIsParsing(true);
    try {
      const res = await fetch('/api/signals/ai-parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: urlOrText,
          url: urlOrText.startsWith('http') ? urlOrText : undefined,
        }),
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          const d = json.data;
          setTitle(d.title || title);
          setSummary(d.summary || summary);
          if (d.collection) setCollection(d.collection);
          if (d.sourceType) setSourceType(d.sourceType);
          if (d.sourceLabel) setSourceLabel(d.sourceLabel);
          if (d.tags && d.tags.length > 0) setTags(d.tags);
          if (d.note) setNote(d.note);
          if (d.deadline) setDeadline(d.deadline);

          setToastMessage(lang === 'uz' ? 'AI matnni muvaffaqiyatli tahlil qildi!' : 'AI parsed content successfully!');
          setTimeout(() => setToastMessage(null), 3000);
        }
      }
    } catch (e) {
      console.error('AI parse error:', e);
    } finally {
      setIsParsing(false);
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!title.trim() || title.trim().length < 3) {
      newErrors.title = dict.forms.errors.titleRequired;
    }

    if (urlOrText.trim().startsWith('http')) {
      try {
        new URL(urlOrText.trim());
      } catch {
        newErrors.url = dict.forms.errors.urlInvalid;
      }
    }

    if (!collection) {
      newErrors.collection = dict.forms.errors.collectionRequired;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      errorSummaryRef.current?.focus();
      return;
    }

    setIsSubmitting(true);
    try {
      const created = await api.create({
        title,
        summary: summary || title,
        url: urlOrText.trim().startsWith('http') ? urlOrText.trim() : undefined,
        sourceType,
        sourceLabel: sourceLabel.trim() || (sourceType === 'telegram' ? 'Telegram' : 'Web'),
        collection,
        tags,
        note: note.trim() || undefined,
        deadline: deadline || undefined,
      });

      setToastMessage(dict.forms.successToast);

      setTimeout(() => {
        router.push(`/${lang}/library/${created.id}`);
      }, 600);
    } catch (err) {
      setErrors({ form: 'Kutilmagan xatolik yuz berdi.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Toast Notification */}
      <div
        aria-live="polite"
        className="fixed top-4 right-4 z-50 transition-all pointer-events-none"
      >
        {toastMessage && (
          <div className="px-4 py-2 bg-[#1e5436] text-white font-mono text-xs rounded-paper shadow-sheet animate-bounce pointer-events-auto">
            ✓ {toastMessage}
          </div>
        )}
      </div>

      {/* Back button */}
      <div>
        <Link
          href={`/${lang}/library`}
          className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-ink-muted hover:text-ink transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{dict.backToLibrary}</span>
        </Link>
      </div>

      {/* Main Sheet Form */}
      <Sheet className="p-6 sm:p-10 space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-ink">
            {dict.forms.newSignalTitle}
          </h1>
          <p className="text-sm text-ink-soft mt-1">
            {dict.forms.newSignalSubtitle}
          </p>
        </div>

        {/* Error Summary */}
        {Object.keys(errors).length > 0 && (
          <div
            ref={errorSummaryRef}
            tabIndex={-1}
            aria-labelledby="error-summary-heading"
            role="alert"
            className="p-4 bg-seal/10 border-2 border-seal rounded-paper space-y-2 focus:outline-none focus:ring-2 focus:ring-seal"
          >
            <div className="flex items-center gap-2 text-seal font-bold font-serif text-sm" id="error-summary-heading">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{dict.a11yErrorSummary}</span>
            </div>
            <ul className="list-disc list-inside text-xs font-mono text-seal space-y-1">
              {Object.entries(errors).map(([field, err]) => (
                <li key={field}>{err}</li>
              ))}
            </ul>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          {/* Smart Input & AI Auto-fill Trigger */}
          <div className="space-y-2 p-4 bg-desk/50 border border-rule rounded-paper">
            <div className="flex items-center justify-between">
              <label htmlFor="signal-url" className="font-mono text-xs uppercase tracking-wider text-ink font-bold">
                {dict.forms.urlOrTextLabel}
              </label>
              <button
                type="button"
                onClick={handleAiAutoFill}
                disabled={!urlOrText.trim() || isParsing}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-ink text-on-ink font-mono text-[11px] uppercase tracking-wider rounded-paper hover:bg-ink-2 active:translate-y-0.5 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                {isParsing ? (
                  <>
                    <Loader2 className="w-3 h-3 animate-spin" />
                    <span>Tahlil qilinmoqda...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3 h-3 text-sticky-yellow" />
                    <span>✨ AI bilan toʻldirish</span>
                  </>
                )}
              </button>
            </div>
            <textarea
              id="signal-url"
              rows={2}
              value={urlOrText}
              onChange={(e) => {
                setUrlOrText(e.target.value);
                if (e.target.value.includes('t.me')) setSourceType('telegram');
              }}
              placeholder={dict.forms.urlOrTextPlaceholder}
              className="w-full p-2.5 bg-paper border border-rule rounded-paper font-serif text-sm text-ink placeholder:text-ink-muted/50 focus:border-ink focus:ring-1 focus:ring-ink focus:outline-none transition-colors"
            />
          </div>

          {/* Title */}
          <Field
            id="signal-title"
            label={dict.forms.titleLabel}
            placeholder={dict.forms.titlePlaceholder}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            error={errors.title}
            required
          />

          {/* Summary */}
          <div className="space-y-1.5">
            <label htmlFor="signal-summary" className="block font-mono text-xs text-ink-muted uppercase">
              {dict.forms.summaryLabel}
            </label>
            <textarea
              id="signal-summary"
              rows={3}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder={dict.forms.summaryPlaceholder}
              className="w-full p-2.5 bg-paper border border-rule rounded-paper font-serif text-sm text-ink placeholder:text-ink-muted/50 focus:border-ink focus:ring-1 focus:ring-ink focus:outline-none transition-colors"
            />
          </div>

          <Rule />

          {/* Source Type & Source Channel */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <span className="block font-mono text-xs text-ink-muted uppercase">
                {dict.forms.sourceTypeLabel}
              </span>
              <div className="flex items-center gap-2">
                {[
                  { key: 'telegram', label: dict.forms.sourceTelegram },
                  { key: 'web', label: dict.forms.sourceWeb },
                  { key: 'other', label: dict.forms.sourceOther },
                ].map((st) => (
                  <button
                    key={st.key}
                    type="button"
                    onClick={() => setSourceType(st.key as SignalSourceType)}
                    className={cn(
                      'flex-1 py-1.5 font-mono text-xs uppercase tracking-wider rounded-paper border transition-all',
                      sourceType === st.key
                        ? 'bg-ink text-on-ink border-ink font-bold shadow-sm'
                        : 'bg-paper text-ink-muted border-rule hover:border-ink'
                    )}
                  >
                    {st.label}
                  </button>
                ))}
              </div>
            </div>

            <Field
              id="signal-source-label"
              label={dict.forms.sourceChannelLabel}
              placeholder={dict.forms.sourceChannelPlaceholder}
              value={sourceLabel}
              onChange={(e) => setSourceLabel(e.target.value)}
            />
          </div>

          {/* Collection Selector */}
          <div className="space-y-1.5">
            <span className="block font-mono text-xs text-ink-muted uppercase">
              {dict.forms.collectionLabel}
            </span>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {collectionsList.map((col) => {
                const isSelected = collection === col.key;
                return (
                  <button
                    key={col.key}
                    type="button"
                    onClick={() => setCollection(col.key)}
                    className={cn(
                      'py-1.5 px-2 font-mono text-xs uppercase tracking-wider rounded-paper border transition-all text-center truncate',
                      isSelected
                        ? 'bg-seal text-white border-seal font-bold shadow-sm'
                        : 'bg-paper text-ink-muted border-rule hover:border-seal'
                    )}
                  >
                    {dict.collections[col.labelKey] || col.key}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-1.5">
            <label htmlFor="signal-tags" className="block font-mono text-xs text-ink-muted uppercase">
              {dict.forms.tagsLabel}
            </label>
            <TagInput
              id="signal-tags"
              tags={tags}
              onChange={setTags}
              placeholder={dict.forms.tagsPlaceholder}
              hint={dict.forms.tagsHint}
            />
          </div>

          <Rule />

          {/* Personal Memo & Deadline */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field
              id="signal-note"
              label={dict.forms.noteLabel}
              placeholder={dict.forms.notePlaceholder}
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />

            <Field
              id="signal-deadline"
              type="date"
              label={dict.forms.deadlineLabel}
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
            />
          </div>

          {/* Actions */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-rule">
            <PaperButton
              href={`/${lang}/library`}
              variant="secondary"
            >
              {dict.forms.cancelButton}
            </PaperButton>
            <PaperButton
              type="submit"
              variant="primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? dict.forms.submitting : dict.forms.submitButton}
            </PaperButton>
          </div>
        </form>
      </Sheet>
    </div>
  );
}
