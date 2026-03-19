import type { Metadata } from 'next';
import { Inter, Playfair_Display, Cormorant_Garamond } from 'next/font/google';
import './globals.css';
import { I18nProvider } from '@/hooks/use-i18n';
import { AuthProvider } from '@/hooks/use-auth';
import { Toaster } from 'sonner';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-display',
});

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-serif',
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
    <html lang="de" className={`${inter.variable} ${playfair.variable} ${cormorant.variable}`}>
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
