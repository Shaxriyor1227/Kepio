import React from 'react';
import { cn } from '@/lib/cn';

interface FieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  variant?: 'underline' | 'box';
}

export function Field({
  id,
  label,
  error,
  hint,
  variant = 'underline',
  className,
  ...props
}: FieldProps) {
  const errorId = error ? `${id}-error` : undefined;
  const hintId = hint ? `${id}-hint` : undefined;
  const describedBy = [errorId, hintId].filter(Boolean).join(' ') || undefined;

  return (
    <div className="flex flex-col gap-1 w-full text-left">
      <label htmlFor={id} className="font-mono text-xs uppercase tracking-wider text-ink font-semibold">
        {label}
      </label>
      {hint && (
        <span id={hintId} className="text-xs text-ink-muted leading-tight">
          {hint}
        </span>
      )}
      <input
        id={id}
        aria-invalid={!!error}
        aria-describedby={describedBy}
        className={cn(
          'w-full bg-transparent text-ink placeholder:text-ink-muted/60 transition-colors',
          'focus-visible:outline-none',
          variant === 'underline' &&
            'border-b border-rule py-2 px-0 rounded-none focus:border-b-2 focus:border-ink',
          variant === 'box' &&
            'border border-rule bg-paper px-3 py-2 rounded-paper focus:border-ink focus:ring-1 focus:ring-ink',
          error && 'border-seal focus:border-seal focus:ring-seal text-seal',
          className
        )}
        {...props}
      />
      {error && (
        <span id={errorId} className="font-mono text-xs text-seal tracking-tight mt-0.5" role="alert">
          {error}
        </span>
      )}
    </div>
  );
}
