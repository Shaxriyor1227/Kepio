import React from 'react';
import { cn } from '@/lib/cn';

export type StampVariant = 'new' | 'read' | 'done' | 'archived' | 'neutral';

interface StampProps {
  children: React.ReactNode;
  variant?: StampVariant;
  rotate?: boolean;
  className?: string;
  size?: 'sm' | 'md';
}

export function Stamp({
  children,
  variant = 'new',
  rotate = false,
  className,
  size = 'md',
}: StampProps) {
  const variantStyles = {
    new: 'text-seal border-seal',
    read: 'text-ink border-ink',
    done: 'text-[#1e5436] border-[#1e5436]',
    archived: 'text-ink-muted border-ink-muted',
    neutral: 'text-ink-soft border-rule',
  };

  const sizeStyles = {
    sm: 'text-[10px] px-1.5 py-0.5 border',
    md: 'text-xs px-2.5 py-1 border-[1.5px]',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center justify-center font-mono font-bold uppercase tracking-widest whitespace-nowrap select-none',
        'rounded-sm',
        sizeStyles[size],
        variantStyles[variant],
        rotate && 'rotate-[-2deg] hover:rotate-0 transition-transform',
        className
      )}
    >
      {children}
    </span>
  );
}
