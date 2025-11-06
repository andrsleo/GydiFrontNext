import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Outfit } from 'next/font/google';
import { SessionProvider } from 'next-auth/react';
import { Toaster } from 'sonner';
import './globals.css';
import { Providers } from './providers';

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['300', '400', '500', '600', '700', '800'],
  display: 'swap',
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-heading',
  weight: ['400', '500', '600', '700', '800', '900'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    template: '%s | GYDI',
    default: 'GYDI - Vende Propiedades y Gana Comisiones por Referidos',
  },
  description:
    'La plataforma integral para vender propiedades inmobiliarias y ganar comisiones refiriendo destinos vacacionales. Dos modelos de negocio, una sola plataforma.',
  keywords: ['venta propiedades', 'propiedades vacacionales', 'afiliados', 'comisiones', 'referidos', 'inmobiliaria', 'bienes raíces'],
  authors: [{ name: 'GYDI' }],
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    url: 'https://gydi.com',
    siteName: 'GYDI',
    title: 'GYDI - Vende Propiedades y Gana Comisiones',
    description: 'Vende propiedades inmobiliarias o gana hasta 10% de comisión refiriendo propiedades vacacionales',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GYDI - Vende Propiedades y Gana Comisiones',
    description: 'Vende propiedades inmobiliarias o gana hasta 10% de comisión refiriendo propiedades vacacionales',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${plusJakarta.variable} ${outfit.variable} font-sans antialiased`}>
        <SessionProvider>
          <Providers>{children}</Providers>
        </SessionProvider>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
