import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Sheet } from '@/components/paper/Sheet';
import { Stamp } from '@/components/paper/Stamp';
import { StickyNote } from '@/components/paper/StickyNote';
import { PaperButton } from '@/components/paper/PaperButton';
import { FolderTab } from '@/components/paper/FolderTab';
import { Rule } from '@/components/paper/Rule';
import { Field } from '@/components/paper/Field';
import { Tag } from '@/components/paper/Tag';
import { QuoteBlock } from '@/components/paper/QuoteBlock';
import { SkeletonLoader } from '@/components/paper/SkeletonLoader';

// Helper to compute contrast ratio in page
function parseHex(hex: string) {
  const clean = hex.replace('#', '').trim();
  const num = parseInt(clean, 16);
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

function sRgbLuminance([r, g, b]: number[]) {
  const a = [r, g, b].map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
}

function contrastRatio(hex1: string, hex2: string) {
  const lum1 = sRgbLuminance(parseHex(hex1));
  const lum2 = sRgbLuminance(parseHex(hex2));
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
}

const tokens: Record<string, string> = {
  paper: '#fef9ec',
  desk: '#f2eee1',
  rule: '#e7e2d5',
  ink: '#09150e',
  'ink-2': '#1e2a22',
  'ink-soft': '#3d463f',
  'ink-muted': '#5c6259',
  'on-ink': '#fef9ec',
  seal: '#a7382e',
  'sticky-yellow': '#f5ecb4',
  'sticky-green': '#dde8cd',
  'sticky-rose': '#ebd9d0',
};

const contrastPairs = [
  { fg: 'ink', bg: 'paper', min: 4.5, label: 'Primary text on paper' },
  { fg: 'ink-2', bg: 'paper', min: 4.5, label: 'Headings / buttons on paper' },
  { fg: 'ink-soft', bg: 'paper', min: 4.5, label: 'Body copy on paper' },
  { fg: 'ink-muted', bg: 'paper', min: 4.5, label: 'Mono meta on paper' },
  { fg: 'seal', bg: 'paper', min: 4.5, label: 'Stamp red on paper' },
  { fg: 'on-ink', bg: 'ink', min: 4.5, label: 'Text on ink button' },
  { fg: 'ink', bg: 'desk', min: 4.5, label: 'Text on desk background' },
  { fg: 'ink-muted', bg: 'desk', min: 4.5, label: 'Mono meta on desk' },
  { fg: 'ink', bg: 'sticky-yellow', min: 4.5, label: 'Text on yellow sticky' },
  { fg: 'ink', bg: 'sticky-green', min: 4.5, label: 'Text on green sticky' },
  { fg: 'ink', bg: 'sticky-rose', min: 4.5, label: 'Text on rose sticky' },
];

export default function SpecsPage() {
  // Hide in production as requested by AGENTS.md
  if (process.env.NODE_ENV === 'production') {
    notFound();
  }

  return (
    <div className="w-full min-h-screen bg-desk p-4 sm:p-8 space-y-12 max-w-6xl mx-auto">
      {/* Header */}
      <header className="border-b border-rule pb-6 flex items-center justify-between">
        <div>
          <div className="font-mono text-xs uppercase tracking-widest text-ink-muted">
            Dev Only · Specifications Sheet
          </div>
          <h1 className="text-3xl font-serif font-bold text-ink mt-1">
            Kepio Paper UI Design System
          </h1>
        </div>
        <Link
          href="/uz"
          className="font-mono text-xs uppercase px-3 py-1.5 border border-rule bg-paper rounded-paper text-ink hover:border-ink transition-colors"
        >
          ← Asosiy sahifa
        </Link>
      </header>

      {/* 1. Color Palette Tokens */}
      <section className="space-y-4">
        <h2 className="text-xl font-serif font-bold text-ink">01. Color Palette Tokens</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
          {Object.entries(tokens).map(([name, hex]) => (
            <div key={name} className="p-3 bg-paper border border-rule rounded-paper space-y-2">
              <div
                className="w-full h-12 rounded-sm border border-black/10 shadow-sm"
                style={{ backgroundColor: hex }}
              />
              <div>
                <div className="font-mono text-xs font-bold text-ink truncate">--{name}</div>
                <div className="font-mono text-[11px] text-ink-muted uppercase">{hex}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 2. Computed Contrast Audit Table */}
      <section className="space-y-4">
        <h2 className="text-xl font-serif font-bold text-ink">02. Computed WCAG 2.2 Contrast Audit</h2>
        <Sheet className="overflow-x-auto p-0">
          <table className="w-full text-left text-xs font-mono border-collapse">
            <thead>
              <tr className="border-b border-rule bg-desk/60 text-ink-muted uppercase tracking-wider">
                <th className="p-3">Foreground</th>
                <th className="p-3">Background</th>
                <th className="p-3">Ratio</th>
                <th className="p-3">Target</th>
                <th className="p-3">Status</th>
                <th className="p-3">Role / Context</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-rule/60">
              {contrastPairs.map((pair) => {
                const fgHex = tokens[pair.fg];
                const bgHex = tokens[pair.bg];
                const ratio = contrastRatio(fgHex, bgHex);
                const pass = ratio >= pair.min;
                return (
                  <tr key={`${pair.fg}-${pair.bg}`} className="hover:bg-desk/30">
                    <td className="p-3 font-bold text-ink">
                      --{pair.fg} ({fgHex})
                    </td>
                    <td className="p-3 text-ink-soft">
                      --{pair.bg} ({bgHex})
                    </td>
                    <td className="p-3 font-bold">{ratio.toFixed(2)}:1</td>
                    <td className="p-3 text-ink-muted">≥ {pair.min}:1</td>
                    <td className="p-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-sm font-bold text-[10px] ${
                          pass ? 'bg-[#1e5436] text-white' : 'bg-seal text-white'
                        }`}
                      >
                        {pass ? 'PASS AA' : 'FAIL'}
                      </span>
                    </td>
                    <td className="p-3 text-ink-soft font-sans text-xs">{pair.label}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Sheet>
      </section>

      {/* 3. Typography Scale & Uzbek Character Proof */}
      <section className="space-y-4">
        <h2 className="text-xl font-serif font-bold text-ink">03. Typography & Uzbek Character Proof</h2>
        <Sheet className="space-y-6">
          <div className="p-4 bg-desk/50 border border-rule rounded-paper">
            <div className="font-mono text-xs text-ink-muted uppercase mb-1">
              Uzbek Typography Verification (ʻ U+02BB and ʼ U+02BC):
            </div>
            <div className="text-xl font-serif font-bold text-ink">
              Oʻzbekiston · gʻoya · oʻqildi · eʼlon · taʼmirlangan · maʼlumot
            </div>
          </div>

          <div className="space-y-2">
            <div className="font-mono text-xs text-ink-muted uppercase">Headings (Source Serif 4):</div>
            <h1 className="text-4xl font-serif font-bold text-ink">Display H1 (44px/600) — Foydali bilimlar</h1>
            <h2 className="text-2xl font-serif font-bold text-ink">Headline H2 (24px/600) — Muhim eslatmalar</h2>
            <h3 className="text-lg font-serif font-bold text-ink">Title H3 (18px/600) — Toifalar va qaydlar</h3>
          </div>

          <div className="space-y-2">
            <div className="font-mono text-xs text-ink-muted uppercase">Mono Labels (Courier Prime):</div>
            <div className="font-mono text-xs uppercase tracking-wider text-ink font-bold">
              01 · SHAXSIY BILIMLAR · KUTUBXONA · KUN TARTIBI · ARXIV
            </div>
          </div>
        </Sheet>
      </section>

      {/* 4. Paper UI Primitives Showcase */}
      <section className="space-y-4">
        <h2 className="text-xl font-serif font-bold text-ink">04. Paper UI Component Primitives</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Buttons & Stamps */}
          <Sheet className="space-y-4">
            <div className="font-mono text-xs text-ink-muted uppercase font-bold">Buttons & Stamps:</div>
            <div className="flex flex-wrap items-center gap-3">
              <PaperButton variant="primary">Asosiy tugma</PaperButton>
              <PaperButton variant="secondary">Ikkinchi tugma</PaperButton>
              <PaperButton variant="danger">Oʻchirish</PaperButton>
              <PaperButton variant="ghost">Oddiy havola</PaperButton>
            </div>
            <Rule />
            <div className="flex flex-wrap items-center gap-2">
              <Stamp variant="new" rotate>YANGI</Stamp>
              <Stamp variant="read">OʻQILDI</Stamp>
              <Stamp variant="done">BAJARILDI</Stamp>
              <Stamp variant="archived">ARXIVLANDI</Stamp>
            </div>
            <Rule />
            <div className="flex flex-wrap items-center gap-2">
              <Tag active>#barchasi</Tag>
              <Tag>#vakansiya</Tag>
              <Tag>#kurslar</Tag>
              <Tag>#foydali</Tag>
            </div>
          </Sheet>

          {/* Sticky Notes & Quote */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <StickyNote color="yellow" pin rotate={-1} title="Sariq">
                Ertaga soat 10:00 da muhim uchrashuv.
              </StickyNote>
              <StickyNote color="green" pin rotate={1} title="Yashil">
                Ushbu topshiriq toʻliq yakunlandi.
              </StickyNote>
              <StickyNote color="rose" rotate={-2} title="Pushti">
                Arxivga joʻnatilishi kerak boʻlgan qayd.
              </StickyNote>
            </div>
            <QuoteBlock>
              “Eslab qolishni bizga qoldir. Sening ishing — bajarish.”
            </QuoteBlock>
          </div>
        </div>

        {/* Folder Tabs & Form Inputs & Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Sheet className="space-y-4">
            <div className="font-mono text-xs text-ink-muted uppercase font-bold">Folder Tabs (Link-based):</div>
            <div className="flex items-center gap-1 border-b border-rule">
              <FolderTab href="/dev/specs" active count={14}>Kutubxona</FolderTab>
              <FolderTab href="/dev/specs" count={6}>Kun tartibi</FolderTab>
              <FolderTab href="/dev/specs" disabled>+ Yangi toifa</FolderTab>
            </div>
            <div className="p-4 bg-paper rounded-b-paper border-b border-x border-rule -mt-4 pt-6 text-sm text-ink-soft">
              Tab faol boʻlganda pastki chiziq olib tashlanadi va qogʻoz varagʻi bilan yaxlitlashadi.
            </div>
          </Sheet>

          <Sheet className="space-y-4">
            <div className="font-mono text-xs text-ink-muted uppercase font-bold">Form Fields & Skeleton:</div>
            <Field
              id="spec-title"
              label="Qayd sarlavhasi"
              placeholder="Masalan: Frontend Developer vakansiyasi..."
              hint="Kamida 5 ta harf kiritilishi lozim"
            />
            <Field
              id="spec-error"
              label="Havola (URL)"
              defaultValue="not-a-url"
              error="Yaroqli internet manzilini kiriting (https://...)"
            />
            <Rule />
            <div className="font-mono text-xs text-ink-muted uppercase mb-1">Paper Skeleton:</div>
            <SkeletonLoader lines={2} />
          </Sheet>
        </div>
      </section>
    </div>
  );
}
