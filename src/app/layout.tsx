import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Bricolage_Grotesque, Space_Grotesk } from 'next/font/google';
import { Toaster } from 'sonner';
import './globals.css';
import { Providers } from './providers';
import { AuthProvider } from '@/features/auth/providers/auth-provider';
import { AuthVerifier } from '@/features/auth/components/auth-verifier';
import { LocaleHtmlSync } from '@/components/shared/locale-html-sync';

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['300', '400', '500', '600', '700', '800'],
  display: 'swap',
});

// Display: Bricolage Grotesque — ultra-modern variable font, used by Arc, Framer, Linear
const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
});

// Heading: Space Grotesk — geometric, premium, Apple-adjacent
const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-heading',
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    template: '%s | GYDI',
    default: 'GYDI - Refiere propiedades y gana comisiones reales',
  },
  description:
    'Plataforma de referidos para rentals vacacionales. Genera links de referido, comparte propiedades en renta y cobra hasta 10% de comisión por cada reserva. Gratis para comenzar.',
  keywords: ['plataforma de referidos', 'referidos de propiedades', 'ganar comisiones rentals', 'complemento airbnb', 'propiedades en renta', 'referidos vacaciones'],
  authors: [{ name: 'GYDI' }],
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'GYDI',
  },
  openGraph: {
    type: 'website',
    locale: 'es_MX',
    url: 'https://gydi.com',
    siteName: 'GYDI',
    title: 'GYDI - El complemento de Airbnb que te paga por referir',
    description: 'Conecta viajeros con alojamientos increíbles y gana comisiones reales. Anfitriones de Airbnb: activa una red de referidos que llena tus fechas disponibles.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GYDI - El complemento de Airbnb que te paga por referir',
    description: 'Refiere propiedades en renta y gana hasta 10% de comisión por cada reserva. Gratis para comenzar.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <head>
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        <meta name="theme-color" content="#6C47FF" />
      </head>
      <body
        className={`${plusJakarta.variable} ${bricolage.variable} ${spaceGrotesk.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        <LocaleHtmlSync />
        <Providers>
          <AuthProvider>
            <AuthVerifier />
            {children}
          </AuthProvider>
        </Providers>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
