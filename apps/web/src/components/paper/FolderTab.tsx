import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/cn';

interface FolderTabProps {
  href: string;
  active?: boolean;
  disabled?: boolean;
  count?: number;
  children: React.ReactNode;
  className?: string;
}

export function FolderTab({
  href,
  active = false,
  disabled = false,
  count,
  children,
  className,
}: FolderTabProps) {
  if (disabled) {
    return (
      <span
        aria-disabled="true"
        className={cn(
          'inline-flex items-center gap-1.5 px-3 py-1.5 font-mono text-xs uppercase tracking-wider',
          'text-ink-muted/60 bg-desk/50 border-t border-x border-rule/50 cursor-not-allowed select-none whitespace-nowrap',
          className
        )}
      >
        {children}
      </span>
    );
  }

  return (
    <Link
      href={href}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'inline-flex items-center gap-2 px-3.5 py-2 font-mono text-xs uppercase tracking-wider whitespace-nowrap select-none transition-all',
        'border-t border-x border-rule rounded-t-paper',
        active
          ? 'bg-paper text-ink font-bold border-b-0 -mb-px z-10 shadow-[0_-2px_4px_rgba(0,0,0,0.03)]'
          : 'bg-desk text-ink-muted hover:text-ink hover:bg-paper/70 border-b border-rule',
        className
      )}
    >
      <span>{children}</span>
      {typeof count === 'number' && (
        <span
          className={cn(
            'inline-block px-1.5 py-0.2 rounded-sm text-[10px] font-mono leading-tight',
            active ? 'bg-ink text-on-ink' : 'bg-rule text-ink-soft'
          )}
        >
          {count}
        </span>
      )}
    </Link>
  );
}
