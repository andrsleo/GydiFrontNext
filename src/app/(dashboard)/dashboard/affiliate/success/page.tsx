/**
 * Affiliate Onboarding Success Page
 *
 * Confirmation page displayed after completing Stripe Connect onboarding.
 * Invalidates the connect status cache so banners disappear immediately.
 */

'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useQueryClient } from '@tanstack/react-query';
import { CheckCircle2, ArrowRight, Link as LinkIcon, Share2, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

export default function AffiliateOnboardingSuccessPage() {
  const queryClient = useQueryClient();

  // Invalidate connect status cache so banners disappear without needing a page refresh
  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ['affiliates', 'connect', 'status'] });
  }, [queryClient]);

  return (
    <div className="container max-w-3xl mx-auto py-8 px-4">
      {/* Success Card */}
      <Card className="border-green-200 bg-green-50/50">
        <CardHeader className="text-center space-y-4">
          {/* Success Icon */}
          <div className="flex justify-center">
            <div className="rounded-full bg-green-100 p-3">
              <CheckCircle2 className="h-12 w-12 text-green-600" />
            </div>
          </div>

          {/* Title */}
          <div>
            <CardTitle className="text-2xl md:text-3xl font-bold text-green-900">
              ¡Cuenta conectada exitosamente!
            </CardTitle>
            <CardDescription className="text-base mt-2 text-green-800">
              Tu cuenta bancaria ha sido verificada y está lista para recibir pagos.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Payout Information */}
          <div className="bg-white p-4 rounded-lg border border-green-200">
            <h3 className="font-semibold text-sm mb-2 text-foreground">
              Información de pagos
            </h3>
            <p className="text-sm text-muted-foreground">
              Recibirás pagos automáticamente los días <strong className="text-foreground">1 y 15</strong> de
              cada mes cuando hayas acumulado al menos{' '}
              <strong className="text-foreground">$50 USD</strong> en comisiones aprobadas.
            </p>
          </div>

          <Separator />

          {/* Next Steps */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-foreground">
              Próximos pasos
            </h3>

            <div className="space-y-3">
              {/* Step 1 */}
              <div className="flex gap-3 items-start">
                <div className="rounded-full bg-primary/10 p-2 mt-1">
                  <LinkIcon className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">
                    Genera tus enlaces de referido
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Crea enlaces personalizados para compartir propiedades y
                    comenzar a ganar comisiones.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex gap-3 items-start">
                <div className="rounded-full bg-primary/10 p-2 mt-1">
                  <Share2 className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">
                    Comparte en redes sociales
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Difunde tus enlaces en Facebook, Instagram, Twitter y otras
                    plataformas para alcanzar más personas.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex gap-3 items-start">
                <div className="rounded-full bg-primary/10 p-2 mt-1">
                  <BarChart3 className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">
                    Monitorea tus comisiones en el dashboard
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Revisa tus estadísticas, clics, conversiones y ganancias en
                    tiempo real.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* CTA Button */}
          <div className="flex justify-center pt-2">
            <Button asChild size="lg">
              <Link href="/dashboard" className="gap-2">
                Ir al Dashboard
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Additional Help */}
      <div className="mt-6 text-center">
        <p className="text-sm text-muted-foreground">
          ¿Tienes preguntas?{' '}
          <Link
            href="/dashboard"
            className="text-primary hover:underline font-medium"
          >
            Contáctanos en el dashboard
          </Link>
        </p>
      </div>
    </div>
  );
}
