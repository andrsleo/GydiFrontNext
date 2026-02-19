import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Outfit } from 'next/font/google';
import { Toaster } from 'sonner';
import './globals.css';
import { Providers } from './providers';
import { AuthProvider } from '@/features/auth/providers/auth-provider';
import { AuthVerifier } from '@/features/auth/components/auth-verifier';

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
    default: 'GYDI - Refiere propiedades y gana comisiones reales',
  },
  description:
    'Plataforma de afiliados para rentals vacacionales. Genera links de referido, comparte propiedades en renta y cobra hasta 10% de comisión por cada reserva. Gratis para comenzar.',
  keywords: ['plataforma de afiliados', 'referidos de propiedades', 'ganar comisiones rentals', 'complemento airbnb', 'propiedades en renta', 'referidos vacaciones'],
  authors: [{ name: 'GYDI' }],
  openGraph: {
    type: 'website',
    locale: 'es_MX',
    url: 'https://gydi.com',
    siteName: 'GYDI',
    title: 'GYDI - El complemento de Airbnb que te paga por referir',
    description: 'Conecta viajeros con alojamientos increíbles y gana comisiones reales. Anfitriones de Airbnb: activa una red de afiliados que llena tus fechas disponibles.',
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
    <html lang="es" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
      </head>
      <body
        className={`${plusJakarta.variable} ${outfit.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
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
