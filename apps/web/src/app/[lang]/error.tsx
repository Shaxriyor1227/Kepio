'use client';

import React, { useEffect } from 'react';
import { Sheet } from '@/components/paper/Sheet';
import { PaperButton } from '@/components/paper/PaperButton';
import { Stamp } from '@/components/paper/Stamp';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="w-full flex-1 flex flex-col items-center justify-center p-6 min-h-[60vh]">
      <Sheet className="p-8 sm:p-12 text-center max-w-md space-y-4">
        <div className="flex justify-center">
          <Stamp variant="new" size="md">
            XATOLIK
          </Stamp>
        </div>
        <h1 className="text-2xl font-serif font-bold text-ink">
          Kutilmagan nosozlik yuz berdi
        </h1>
        <p className="text-sm text-ink-soft leading-relaxed">
          Sahifani yuklashda xatolik yuz berdi. Iltimos, qaytadan urinib koʻring.
        </p>
        <div className="pt-2 flex justify-center gap-3">
          <PaperButton onClick={() => reset()} variant="primary">
            Qayta yuklash
          </PaperButton>
          <PaperButton href="/uz" variant="secondary">
            Bosh sahifa
          </PaperButton>
        </div>
      </Sheet>
    </div>
  );
}
