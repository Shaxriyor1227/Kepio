import React from 'react';
import { cn } from '@/lib/cn';

interface QuoteBlockProps {
  children: React.ReactNode;
  author?: string;
  className?: string;
}

export function QuoteBlock({ children, author, className }: QuoteBlockProps) {
  return (
    <blockquote
      className={cn(
        'border-l-2 border-seal pl-4 py-1 my-4 italic text-ink font-serif text-lg leading-relaxed',
        className
      )}
    >
      <p>{children}</p>
      {author && (
        <footer className="font-mono text-xs not-italic text-ink-muted uppercase tracking-wider mt-2">
          — {author}
        </footer>
      )}
    </blockquote>
  );
}
