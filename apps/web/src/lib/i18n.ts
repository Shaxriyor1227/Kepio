import { Dictionary } from '@/content/types';
import { uz } from '@/content/uz';
import { en } from '@/content/en';

export const locales = ['uz', 'en'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'uz';

const dictionaries: Record<Locale, Dictionary> = {
  uz,
  en,
};

export function getDictionary(lang: string): Dictionary {
  if (lang === 'en') {
    return dictionaries.en;
  }
  return dictionaries.uz;
}

export function isValidLocale(lang: string): lang is Locale {
  return locales.includes(lang as Locale);
}
