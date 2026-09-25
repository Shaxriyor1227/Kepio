'use client';

import { useEffect } from 'react';

// The inline script in the root layout handles the first paint; this keeps
// <html lang> right when the language switcher changes locale without a reload.
export function HtmlLang({ lang }: { lang: string }) {
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  return null;
}
