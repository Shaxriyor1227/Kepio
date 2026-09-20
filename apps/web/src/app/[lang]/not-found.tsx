import React from 'react';
import { Sheet } from '@/components/paper/Sheet';
import { PaperButton } from '@/components/paper/PaperButton';
import { Stamp } from '@/components/paper/Stamp';

export default function NotFound() {
  return (
    <div className="w-full flex-1 flex flex-col items-center justify-center p-6 min-h-[60vh]">
      <Sheet className="p-8 sm:p-12 text-center max-w-md space-y-4">
        <div className="flex justify-center">
          <Stamp variant="archived" size="md">
            404 · TOPILMADI
          </Stamp>
        </div>
        <h1 className="text-2xl font-serif font-bold text-ink">
          Sahifa topilmadi
        </h1>
        <p className="text-sm text-ink-soft leading-relaxed">
          Siz qidirgan sahifa mavjud emas yoki boshqa manzilga koʻchirilgan boʻlishi mumkin.
        </p>
        <div className="pt-2">
          <PaperButton href="/uz" variant="primary">
            ← Asosiy sahifaga qaytish
          </PaperButton>
        </div>
      </Sheet>
    </div>
  );
}
