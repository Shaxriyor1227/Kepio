import React from 'react';
import { notFound } from 'next/navigation';
import { locales, isValidLocale, getDictionary } from '@/lib/i18n';
import { Sheet } from '@/components/paper/Sheet';
import { Stamp } from '@/components/paper/Stamp';
import { StickyNote } from '@/components/paper/StickyNote';
import { PaperButton } from '@/components/paper/PaperButton';
import { Rule } from '@/components/paper/Rule';
import { QuoteBlock } from '@/components/paper/QuoteBlock';
import { Tag } from '@/components/paper/Tag';

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isValidLocale(lang)) return {};

  const dict = getDictionary(lang);
  return {
    title: `${dict.brand.name} — ${dict.brand.tagline}`,
    description: dict.landing.subtitle,
    alternates: {
      canonical: `/${lang}`,
      languages: {
        uz: '/uz',
        en: '/en',
        'x-default': '/en',
      },
    },
    openGraph: {
      title: `${dict.brand.name} — ${dict.brand.tagline}`,
      description: dict.landing.subtitle,
      locale: lang === 'uz' ? 'uz_UZ' : 'en_US',
    },
  };
}

export default async function LandingPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isValidLocale(lang)) {
    notFound();
  }

  const dict = getDictionary(lang);

  return (
    <div className="w-full flex-1 flex flex-col items-center justify-center py-10 px-4 sm:px-6">
      <div className="max-w-4xl w-full mx-auto space-y-12">
        {/* Hero Section */}
        <section className="text-center space-y-6 pt-4">
          <div className="inline-flex items-center gap-2">
            <span className="font-mono text-xs uppercase tracking-widest text-ink-muted">
              {dict.landing.eyebrow}
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-ink tracking-tight max-w-3xl mx-auto">
            {dict.landing.h1Part1}
            <em className="italic text-seal font-serif not-italic">{dict.landing.h1Accent}</em>
          </h1>

          <p className="text-lg sm:text-xl text-ink-soft max-w-2xl mx-auto leading-relaxed">
            {dict.landing.subtitle}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <PaperButton href={`/${lang}/library`} variant="primary" size="lg">
              {dict.landing.primaryCta}
            </PaperButton>
            <PaperButton href="#how-it-works" variant="secondary" size="lg">
              {dict.landing.secondaryLink}
            </PaperButton>
          </div>

          <div className="pt-2">
            <span className="font-mono text-xs text-ink-muted tracking-wide">
              {dict.landing.microClaims}
            </span>
          </div>
        </section>

        {/* Hero Preview Sheet (Pure CSS & HTML, aria-hidden for accessibility) */}
        <div aria-hidden="true" className="w-full max-w-3xl mx-auto relative select-none">
          <Sheet className="p-6 sm:p-8 relative z-10 space-y-4">
            <div className="flex items-center justify-between border-b border-rule pb-3">
              <div className="flex items-center gap-2">
                <Stamp variant="new" size="sm">
                  {dict.stamps.new}
                </Stamp>
                <span className="font-mono text-xs text-ink-muted uppercase">
                  Telegram · @dev_jobs_channel
                </span>
              </div>
              <span className="font-mono text-xs text-ink-muted">2026-09-19</span>
            </div>

            <div>
              <h2 className="text-xl font-bold text-ink font-serif">
                Senior Frontend Engineer (Remote / Uzbekistan)
              </h2>
              <p className="text-sm text-ink-soft mt-1 leading-relaxed">
                React, TypeScript, Next.js tajribasi bilan xalqaro jamoada ishlash imkoniyati. Moslashuvchan ish tartibi.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-2">
              <Tag active>#jobs</Tag>
              <Tag>#remote</Tag>
              <Tag>#nextjs</Tag>
            </div>
          </Sheet>

          {/* Margin Sticky Note */}
          <div className="hidden lg:block absolute -right-12 -bottom-6 z-20 w-60">
            <StickyNote color="yellow" pin rotate={3} title="Eslatma">
              Rezyumeni yangilab, soat 18:00 gacha xat yuborish.
            </StickyNote>
          </div>
        </div>

        {/* Steps Section: Find -> Keep -> Act */}
        <section id="how-it-works" className="space-y-6 pt-8 scroll-mt-20">
          <div className="text-center">
            <h2 className="font-mono text-sm uppercase tracking-widest text-ink-muted">
              {dict.landing.stepsTitle}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Sheet className="p-5 space-y-2">
              <span className="font-mono text-xs uppercase font-bold text-seal">
                {dict.landing.steps.find.title}
              </span>
              <p className="text-sm text-ink-soft leading-relaxed">
                {dict.landing.steps.find.desc}
              </p>
            </Sheet>

            <Sheet className="p-5 space-y-2">
              <span className="font-mono text-xs uppercase font-bold text-ink">
                {dict.landing.steps.keep.title}
              </span>
              <p className="text-sm text-ink-soft leading-relaxed">
                {dict.landing.steps.keep.desc}
              </p>
            </Sheet>

            <Sheet className="p-5 space-y-2">
              <span className="font-mono text-xs uppercase font-bold text-[#1e5436]">
                {dict.landing.steps.act.title}
              </span>
              <p className="text-sm text-ink-soft leading-relaxed">
                {dict.landing.steps.act.desc}
              </p>
            </Sheet>
          </div>
        </section>

        {/* Quote Block */}
        <div className="max-w-2xl mx-auto">
          <QuoteBlock>{dict.landing.quote}</QuoteBlock>
        </div>

        {/* Final CTA Block */}
        <section className="text-center space-y-4 py-8 border-t border-rule">
          <h2 className="text-2xl font-serif font-bold text-ink">
            {dict.landing.finalCtaTitle}
          </h2>
          <p className="text-sm text-ink-soft max-w-md mx-auto">
            {dict.landing.finalCtaSubtitle}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <PaperButton href={`/${lang}/library`} variant="primary">
              {dict.landing.primaryCta}
            </PaperButton>
            <span
              className="inline-flex items-center px-3 py-2 text-xs font-mono uppercase tracking-wider text-ink-muted bg-desk border border-rule/70 rounded-paper cursor-not-allowed select-none"
              aria-disabled="true"
            >
              {dict.landing.telegramBot}
            </span>
          </div>
        </section>
      </div>
    </div>
  );
}
