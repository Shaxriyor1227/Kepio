import { Page } from '@playwright/test';
import { uz } from '../src/content/uz';
import { en } from '../src/content/en';

export const locales = ['uz', 'en'] as const;
export type TestLocale = (typeof locales)[number];

export const dictionaries = { uz, en };

export const sessionCookie = {
  name: 'kepio_demo_session',
  value: 'active',
  domain: 'localhost',
  path: '/',
};

export async function openWithSession(page: Page, path: string): Promise<void> {
  await page.context().addCookies([sessionCookie]);
  await page.goto(path);
}
