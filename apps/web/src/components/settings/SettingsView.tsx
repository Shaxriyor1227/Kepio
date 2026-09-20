'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Locale } from '@/lib/i18n';
import { Sheet } from '@/components/paper/Sheet';
import { PaperButton } from '@/components/paper/PaperButton';
import { Rule } from '@/components/paper/Rule';
import { Sparkles, Globe, Database, Check } from 'lucide-react';

interface SettingsViewProps {
  lang: Locale;
  dict: {
    settings: {
      title: string;
      subtitle: string;
      appearanceSection: string;
      reducedDecorLabel: string;
      reducedDecorDesc: string;
      languageSection: string;
      languageDesc: string;
      dataSection: string;
      dataDesc: string;
      resetDemoData: string;
      resetDone: string;
    };
  };
}

export function SettingsView({ lang, dict }: SettingsViewProps) {
  const [decorOff, setDecorOff] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  useEffect(() => {
    const isOff = document.documentElement.getAttribute('data-decor') === 'off';
    setDecorOff(isOff);
  }, []);

  const handleToggleDecor = () => {
    const nextState = !decorOff;
    setDecorOff(nextState);
    if (nextState) {
      document.documentElement.setAttribute('data-decor', 'off');
      localStorage.setItem('kepio-decor', 'off');
    } else {
      document.documentElement.removeAttribute('data-decor');
      localStorage.removeItem('kepio-decor');
    }
  };

  const handleResetData = () => {
    setResetSuccess(true);
    setTimeout(() => {
      window.location.reload();
    }, 600);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      <div className="border-b border-rule pb-4">
        <h1 className="text-3xl font-serif font-bold text-ink">
          {dict.settings.title}
        </h1>
        <p className="text-sm text-ink-soft mt-1">
          {dict.settings.subtitle}
        </p>
      </div>

      <div className="space-y-6">
        {/* Appearance Section */}
        <Sheet className="p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-rule pb-3">
            <Sparkles className="w-4 h-4 text-seal" />
            <h2 className="font-mono text-xs uppercase tracking-wider font-bold text-ink">
              {dict.settings.appearanceSection}
            </h2>
          </div>

          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="space-y-1 max-w-md">
              <span className="font-serif text-base font-bold text-ink block">
                {dict.settings.reducedDecorLabel}
              </span>
              <p className="text-xs text-ink-soft leading-relaxed">
                {dict.settings.reducedDecorDesc}
              </p>
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={decorOff}
              onClick={handleToggleDecor}
              className={`px-4 py-2 font-mono text-xs uppercase tracking-wider rounded-paper border transition-all ${
                decorOff
                  ? 'bg-seal text-white border-seal font-bold shadow-sm'
                  : 'bg-paper text-ink border-rule hover:border-ink'
              }`}
            >
              {decorOff ? 'Decor: OFF' : 'Decor: ON'}
            </button>
          </div>
        </Sheet>

        {/* Language Section */}
        <Sheet className="p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-rule pb-3">
            <Globe className="w-4 h-4 text-ink" />
            <h2 className="font-mono text-xs uppercase tracking-wider font-bold text-ink">
              {dict.settings.languageSection}
            </h2>
          </div>

          <div className="flex items-center justify-between gap-4 flex-wrap">
            <p className="text-xs text-ink-soft max-w-md leading-relaxed">
              {dict.settings.languageDesc}
            </p>

            <div className="flex items-center gap-2">
              <Link
                href="/uz/settings"
                className={`px-3 py-1.5 font-mono text-xs uppercase tracking-wider rounded-paper border transition-all ${
                  lang === 'uz'
                    ? 'bg-ink text-on-ink border-ink font-bold shadow-sm'
                    : 'bg-paper text-ink border-rule hover:border-ink'
                }`}
                aria-current={lang === 'uz' ? 'page' : undefined}
              >
                Oʻzbekcha (UZ)
              </Link>
              <Link
                href="/en/settings"
                className={`px-3 py-1.5 font-mono text-xs uppercase tracking-wider rounded-paper border transition-all ${
                  lang === 'en'
                    ? 'bg-ink text-on-ink border-ink font-bold shadow-sm'
                    : 'bg-paper text-ink border-rule hover:border-ink'
                }`}
                aria-current={lang === 'en' ? 'page' : undefined}
              >
                English (EN)
              </Link>
            </div>
          </div>
        </Sheet>

        {/* Data Section */}
        <Sheet className="p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-rule pb-3">
            <Database className="w-4 h-4 text-ink-muted" />
            <h2 className="font-mono text-xs uppercase tracking-wider font-bold text-ink">
              {dict.settings.dataSection}
            </h2>
          </div>

          <div className="flex items-center justify-between gap-4 flex-wrap">
            <p className="text-xs text-ink-soft max-w-md leading-relaxed">
              {dict.settings.dataDesc}
            </p>

            <button
              type="button"
              onClick={handleResetData}
              disabled={resetSuccess}
              className="inline-flex items-center gap-2 px-4 py-2 bg-desk hover:bg-paper border border-rule text-ink font-mono text-xs uppercase tracking-wider rounded-paper transition-colors"
            >
              {resetSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#1e5436]" />
                  <span>{dict.settings.resetDone}</span>
                </>
              ) : (
                <span>{dict.settings.resetDemoData}</span>
              )}
            </button>
          </div>
        </Sheet>
      </div>
    </div>
  );
}
