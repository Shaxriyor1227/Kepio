import type { Metadata } from 'next';
import { sourceSerif, courierPrime } from '@/styles/fonts';
import '@/styles/globals.css';
import '@/styles/print.css';

export const metadata: Metadata = {
  title: 'Kepio — Shaxsiy bilimlar va qaydlar daftari',
  description: 'Telegram va internetdagi eng muhim topilmalarni bitta toza qogʻoz daftarida saqla, tartibla va amalda qoʻlla.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uz" className={`${sourceSerif.variable} ${courierPrime.variable}`}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var p=window.location.pathname;var l=p.match(/^\/(uz|en)(?:\/|$)/);if(l){document.documentElement.lang=l[1]}var d=localStorage.getItem('kepio-decor');if(d==='off'||window.matchMedia('(prefers-contrast: more)').matches){document.documentElement.setAttribute('data-decor','off')}}catch(e){}})()`,
          }}
        />
      </head>
      <body className="flex flex-col min-h-screen bg-desk text-ink-soft selection:bg-sticky-yellow selection:text-ink">
        {children}
      </body>
    </html>
  );
}
