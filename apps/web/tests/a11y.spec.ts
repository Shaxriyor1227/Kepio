import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { locales, openWithSession } from './helpers';

const routes = [
  { path: '', name: 'landing' },
  { path: '/library', name: 'library' },
  { path: '/library/sig-001', name: 'library-detail' },
  { path: '/library/new', name: 'library-new' },
  { path: '/daily', name: 'daily' },
  { path: '/sign-in', name: 'sign-in' },
  { path: '/archive', name: 'archive' },
  { path: '/settings', name: 'settings' },
];

for (const lang of locales) {
  for (const route of routes) {
    test(`${lang}${route.path || '/'} (${route.name}) has no axe violations`, async ({ page }) => {
      await openWithSession(page, `/${lang}${route.path}`);

      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
        .analyze();

      const violations = results.violations.map((violation) => {
        const targets = violation.nodes.map((node) => node.target.join(' ')).join(' | ');
        return `${violation.id}: ${violation.help} → ${targets}`;
      });

      expect(violations).toEqual([]);
    });
  }
}
