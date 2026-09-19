import React from 'react';
import { cn } from '@/lib/cn';

export type StickyColor = 'yellow' | 'green' | 'rose';

interface StickyNoteProps {
  color?: StickyColor;
  pin?: boolean;
  rotate?: number;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function StickyNote({
  color = 'yellow',
  pin = false,
  rotate = 0,
  title,
  children,
  className,
}: StickyNoteProps) {
  const colorStyles = {
    yellow: 'bg-sticky-yellow text-ink border-[#ebd99a]',
    green: 'bg-sticky-green text-ink border-[#c7d6b3]',
    rose: 'bg-sticky-rose text-ink border-[#dec5ba]',
  };

  const rotationStyle = rotate !== 0 ? { transform: `rotate(${rotate}deg)` } : undefined;

  return (
    <div
      style={rotationStyle}
      className={cn(
        'relative p-4 rounded-sm border shadow-sticky transition-transform duration-200',
        colorStyles[color],
        className
      )}
    >
      {pin && (
        <div
          aria-hidden="true"
          className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-seal shadow-[0_1px_3px_rgba(0,0,0,0.4)] border border-white/40 flex items-center justify-center pointer-events-none"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-white/60" />
        </div>
      )}
      {title && (
        <div className="font-mono text-[11px] uppercase tracking-wider font-bold mb-1.5 opacity-80 border-b border-ink/15 pb-1">
          {title}
        </div>
      )}
      <div className="text-sm leading-relaxed">{children}</div>
    </div>
  );
}
