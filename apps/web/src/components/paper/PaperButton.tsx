import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/cn';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface BaseProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: React.ReactNode;
}

type ButtonAsButton = BaseProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseProps> & {
    href?: undefined;
  };

type ButtonAsLink = BaseProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof BaseProps> & {
    href: string;
  };

export type PaperButtonProps = ButtonAsButton | ButtonAsLink;

export function PaperButton({
  variant = 'primary',
  size = 'md',
  className,
  children,
  href,
  ...props
}: PaperButtonProps) {
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs min-h-[36px]',
    md: 'px-4 py-2 text-sm min-h-[44px]',
    lg: 'px-6 py-3 text-base min-h-[48px]',
  };

  const variantStyles = {
    primary:
      'bg-ink text-on-ink border border-ink shadow-[2px_2px_0_var(--ink)] hover:shadow-[3px_3px_0_var(--ink)] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none',
    secondary:
      'bg-paper text-ink border border-ink shadow-[2px_2px_0_var(--ink)] hover:shadow-[3px_3px_0_var(--ink)] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none',
    danger:
      'bg-paper text-seal border border-seal shadow-[2px_2px_0_var(--seal)] hover:shadow-[3px_3px_0_var(--seal)] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none',
    ghost:
      'bg-transparent text-ink border border-transparent hover:bg-rule/40 active:bg-rule/60',
  };

  const commonClasses = cn(
    'inline-flex items-center justify-center gap-2 font-mono uppercase tracking-wider rounded-paper font-semibold',
    'cursor-pointer select-none transition-all duration-100 whitespace-nowrap',
    'focus-visible:outline-2 focus-visible:outline-ink focus-visible:outline-offset-2',
    sizeStyles[size],
    variantStyles[variant],
    className
  );

  if (href) {
    return (
      <Link href={href} className={commonClasses} {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {children}
      </Link>
    );
  }

  return (
    <button className={commonClasses} {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
    </button>
  );
}
