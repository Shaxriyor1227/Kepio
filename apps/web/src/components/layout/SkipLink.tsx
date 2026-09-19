import React from 'react';

interface SkipLinkProps {
  label: string;
}

export function SkipLink({ label }: SkipLinkProps) {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-ink focus:text-on-ink focus:font-mono focus:text-xs focus:uppercase focus:tracking-wider focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ink shadow-lg rounded-paper"
    >
      {label}
    </a>
  );
}
