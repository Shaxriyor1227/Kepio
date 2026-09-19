import React from 'react';
import { cn } from '@/lib/cn';

interface TagProps {
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
  className?: string;
}

export function Tag({ children, active = false, onClick, className }: TagProps) {
  const Component = onClick ? 'button' : 'span';

  return (
    <Component
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-sm font-mono text-xs uppercase tracking-wider whitespace-nowrap select-none transition-colors',
        active
          ? 'bg-ink text-on-ink border border-ink'
          : 'bg-desk/60 text-ink-muted hover:text-ink hover:bg-desk border border-rule/70',
        onClick && 'cursor-pointer hover:border-ink/50',
        className
      )}
    >
      <span>#</span>
      <span>{children}</span>
    </Component>
  );
}
