import { test, expect } from '@playwright/test';
import { dictionaries, locales, openWithSession } from './helpers';

for (const lang of locales) {
  const dict = dictionaries[lang];

  test.describe(`keyboard — ${lang}`, () => {
    test('skip link is the first stop and jumps to main content', async ({ page }) => {
      await openWithSession(page, `/${lang}/library`);

      await page.keyboard.press('Tab');
      const skipLink = page.getByRole('link', { name: dict.a11y.skipLink });
      await expect(skipLink).toBeFocused();

      await page.keyboard.press('Enter');
      await expect(page).toHaveURL(/#main-content$/);
    });

    test('Ctrl+K focuses the header search input', async ({ page }) => {
      await openWithSession(page, `/${lang}/library`);

      await page.keyboard.press('Control+k');
      await expect(page.locator('header input[type="search"]')).toBeFocused();
    });

    test('header navigation marks the current page with aria-current', async ({ page }) => {
      await openWithSession(page, `/${lang}/daily`);

      const nav = page.getByRole('navigation', { name: dict.a11y.mainNavigation });
      const current = nav.locator('a[aria-current="page"]');
      await expect(current).toHaveCount(1);
      await expect(current).toHaveText(dict.nav.daily);
    });

    test('collection filter tab works from the keyboard and updates the URL', async ({ page }) => {
      await openWithSession(page, `/${lang}/library`);

      const tab = page.locator('button', { hasText: dict.collections.jobs }).first();
      await tab.focus();
      await expect(tab).toBeFocused();

      await page.keyboard.press('Enter');
      await expect(page).toHaveURL(/collection=jobs/);
      await expect(tab).toHaveAttribute('aria-current', 'page');
    });

    test('status chip works from the keyboard and updates the URL', async ({ page }) => {
      await openWithSession(page, `/${lang}/library`);

      const chip = page.locator('button', { hasText: dict.stamps.new }).first();
      await chip.focus();
      await expect(chip).toBeFocused();

      await page.keyboard.press('Enter');
      await expect(page).toHaveURL(/status=new/);
    });

    test('detail page status radiogroup is keyboard operable', async ({ page }) => {
      await openWithSession(page, `/${lang}/library/sig-001`);

      const group = page.getByRole('radiogroup', { name: dict.a11y.statusRadioGroup });
      const radios = group.getByRole('radio');
      await expect(radios).toHaveCount(4);
      await expect(group.locator('[aria-checked="true"]')).toHaveCount(1);

      const doneRadio = radios.nth(2);
      await doneRadio.focus();
      await page.keyboard.press('Enter');
      await expect(doneRadio).toHaveAttribute('aria-checked', 'true');
      await expect(group.locator('[aria-checked="true"]')).toHaveCount(1);
    });

    test('invalid form submit moves focus to the error summary', async ({ page }) => {
      await openWithSession(page, `/${lang}/library/new`);

      await page.getByRole('button', { name: dict.forms.submitButton }).click();

      const summary = page.locator('div[role="alert"]').first();
      await expect(summary).toContainText(dict.a11y.errorSummary);
      await expect(summary).toBeFocused();
    });
  });
}
