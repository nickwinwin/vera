import type { Metadata } from 'next';
import { Inter_Tight, Instrument_Serif } from 'next/font/google';
import './globals.css';
import { I18nProvider } from '@/hooks/use-i18n';
import { AuthProvider } from '@/hooks/use-auth';
import { Toaster } from 'sonner';

const inter = Inter_Tight({
  subsets: ['latin'],
  variable: '--font-sans',
});

const instrument = Instrument_Serif({
  subsets: ['latin'],
  weight: ['400'],
  style: ['normal', 'italic'],
  variable: '--font-display',
});

export const metadata: Metadata = {
  title: 'VERA | NiSV-AUDIT Platform',
  description: 'Compliance documentation for cosmetic clinics',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de" suppressHydrationWarning className={`${inter.variable} ${instrument.variable}`}>
      <body suppressHydrationWarning className="bg-[#FFFFFF] text-[#1A1A1A] antialiased">
        <I18nProvider>
          <AuthProvider>
            {children}
            <Toaster position="top-right" richColors />
          </AuthProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
