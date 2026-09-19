import React from 'react';
import { cn } from '@/lib/cn';

interface RuleProps {
  variant?: 'solid' | 'dashed' | 'dotted';
  className?: string;
  my?: string;
}

export function Rule({ variant = 'solid', className }: RuleProps) {
  const variantStyles = {
    solid: 'border-t border-rule',
    dashed: 'border-t border-dashed border-rule',
    dotted: 'border-t border-dotted border-rule',
  };

  return <hr className={cn('w-full my-4 border-0', variantStyles[variant], className)} />;
}
