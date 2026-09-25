import { test, expect } from '@playwright/test';
import { dictionaries, locales, openWithSession } from './helpers';

test.describe('locale routing', () => {
  test('root redirects to /en for an English Accept-Language header', async ({ browser }) => {
    const context = await browser.newContext({ locale: 'en-US' });
    const page = await context.newPage();

    await page.goto('/');
    await expect(page).toHaveURL(/\/en$/);
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');

    await context.close();
  });

  test('root redirects to /uz for an Uzbek Accept-Language header', async ({ browser }) => {
    const context = await browser.newContext({ locale: 'uz-UZ' });
    const page = await context.newPage();

    await page.goto('/');
    await expect(page).toHaveURL(/\/uz$/);
    await expect(page.locator('html')).toHaveAttribute('lang', 'uz');

    await context.close();
  });
});

for (const lang of locales) {
  const dict = dictionaries[lang];

  test.describe(`locale — ${lang}`, () => {
    test('html lang, dictionary copy and switcher state', async ({ page }) => {
      await page.goto(`/${lang}`);

      await expect(page.locator('html')).toHaveAttribute('lang', lang);

      const heading = page.getByRole('heading', { level: 1 });
      await expect(heading).toContainText(dict.landing.h1Part1);
      await expect(heading).toContainText(dict.landing.h1Accent);

      const switcher = page.getByRole('navigation', { name: dict.a11y.languageSelector }).first();
      await expect(switcher.locator('a[hreflang]')).toHaveCount(2);
      await expect(switcher.locator('a[aria-current="true"]')).toHaveText(lang.toUpperCase());
    });

    test('sign-in page is not indexable', async ({ page }) => {
      await page.goto(`/${lang}/sign-in`);
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
    });
  });
}

test('language switcher keeps you on the same page', async ({ page }) => {
  await openWithSession(page, '/uz/library');
  await expect(page.locator('html')).toHaveAttribute('lang', 'uz');

  const uzSwitcher = page.getByRole('navigation', { name: dictionaries.uz.a11y.languageSelector }).first();
  await uzSwitcher.getByRole('link', { name: 'EN' }).click();

  await expect(page).toHaveURL(/\/en\/library/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');

  const enSwitcher = page.getByRole('navigation', { name: dictionaries.en.a11y.languageSelector }).first();
  await expect(enSwitcher.locator('a[aria-current="true"]')).toHaveText('EN');
});
