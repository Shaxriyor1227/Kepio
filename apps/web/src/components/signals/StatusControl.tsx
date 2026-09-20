'use client';

import React from 'react';
import { SignalStatus } from '@/lib/api/types';
import { cn } from '@/lib/cn';

interface StatusControlProps {
  currentStatus: SignalStatus;
  onChange: (status: SignalStatus) => void;
  label: string;
  labels: {
    new: string;
    read: string;
    done: string;
    archived: string;
  };
  disabled?: boolean;
}

const statusOptions: SignalStatus[] = ['new', 'read', 'done', 'archived'];

export function StatusControl({
  currentStatus,
  onChange,
  label,
  labels,
  disabled = false,
}: StatusControlProps) {
  const getVariantStyles = (status: SignalStatus, active: boolean) => {
    switch (status) {
      case 'new':
        return active
          ? 'bg-seal text-white border-seal font-bold shadow-sm'
          : 'bg-paper text-seal border-seal/50 hover:border-seal';
      case 'read':
        return active
          ? 'bg-ink text-on-ink border-ink font-bold shadow-sm'
          : 'bg-paper text-ink border-ink/40 hover:border-ink';
      case 'done':
        return active
          ? 'bg-[#1e5436] text-white border-[#1e5436] font-bold shadow-sm'
          : 'bg-paper text-[#1e5436] border-[#1e5436]/50 hover:border-[#1e5436]';
      case 'archived':
        return active
          ? 'bg-ink-muted text-white border-ink-muted font-bold shadow-sm'
          : 'bg-paper text-ink-muted border-rule hover:border-ink-muted';
    }
  };

  return (
    <div className="space-y-2">
      <span className="block font-mono text-xs text-ink-muted uppercase tracking-wider font-bold">
        {label}
      </span>
      <div
        role="radiogroup"
        aria-label={label}
        className="flex flex-wrap items-center gap-2"
      >
        {statusOptions.map((status) => {
          const isSelected = currentStatus === status;
          return (
            <button
              key={status}
              type="button"
              role="radio"
              aria-checked={isSelected}
              disabled={disabled}
              onClick={() => onChange(status)}
              className={cn(
                'px-3 py-1.5 font-mono text-xs uppercase tracking-widest rounded-paper border transition-all select-none min-h-[36px] flex items-center justify-center',
                getVariantStyles(status, isSelected),
                disabled && 'opacity-50 cursor-not-allowed'
              )}
            >
              {labels[status]}
            </button>
          );
        })}
      </div>
    </div>
  );
}
