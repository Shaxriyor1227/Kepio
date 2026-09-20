'use client';

import React, { useState, KeyboardEvent } from 'react';
import { X } from 'lucide-react';

interface TagInputProps {
  id: string;
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  hint?: string;
}

export function TagInput({ id, tags, onChange, placeholder, hint }: TagInputProps) {
  const [inputValue, setInputValue] = useState('');

  const addTag = (text: string) => {
    const clean = text.trim().toLowerCase().replace(/^#/, '');
    if (clean && !tags.includes(clean)) {
      onChange([...tags, clean]);
    }
    setInputValue('');
  };

  const removeTag = (tagToRemove: string) => {
    onChange(tags.filter((t) => t !== tagToRemove));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === 'Backspace' && inputValue === '' && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    }
  };

  return (
    <div className="space-y-1.5">
      <div className="min-h-[42px] p-1.5 bg-paper border border-rule rounded-paper flex flex-wrap items-center gap-1.5 focus-within:border-ink focus-within:ring-1 focus-within:ring-ink transition-colors">
        {tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 px-2 py-0.5 bg-desk border border-rule/80 text-ink font-mono text-xs rounded-sm select-none"
          >
            <span>#{tag}</span>
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="p-0.5 hover:text-seal focus:outline-none focus:ring-1 focus:ring-ink rounded-sm"
              aria-label={`Remove tag #${tag}`}
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
        <input
          id={id}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => {
            if (inputValue.trim()) addTag(inputValue);
          }}
          placeholder={tags.length === 0 ? placeholder : ''}
          className="flex-1 min-w-[120px] bg-transparent border-none py-1 px-1.5 text-sm font-serif text-ink placeholder:text-ink-muted/50 focus:outline-none"
        />
      </div>
      {hint && <p className="font-mono text-[11px] text-ink-muted">{hint}</p>}
    </div>
  );
}
