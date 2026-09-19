import React from 'react';
import { cn } from '@/lib/cn';

interface SheetProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'inset' | 'card';
  as?: React.ElementType;
}

export function Sheet({
  children,
  className,
  variant = 'default',
  as: Component = 'div',
  ...props
}: SheetProps) {
  const variantStyles = {
    default: 'bg-paper border border-rule shadow-sheet',
    card: 'bg-paper border border-rule shadow-sheet hover:border-ink/40 transition-colors',
    inset: 'bg-desk border border-rule/80',
  };

  return (
    <Component
      className={cn(
        'rounded-paper p-4 md:p-6 transition-shadow sheet-container',
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}
