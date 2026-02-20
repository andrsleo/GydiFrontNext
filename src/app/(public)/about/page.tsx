import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Building2, Users, Target, Award, TrendingUp, Globe, Shield, Heart } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sobre Nosotros',
  description: 'Conoce la historia, misión y valores de GYDI. El complemento de Airbnb para anfitriones y afiliados que quieren ganar comisiones por referir propiedades en renta.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50/50 to-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b bg-gradient-to-br from-primary/5 via-blue-500/5 to-purple-500/5 py-16 sm:py-20 md:py-24">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:64px_64px]" />

        <div className="container relative mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <div className="animate-fade-in-down mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary backdrop-blur-sm">
              <Building2 className="h-4 w-4" />
              <span>Nuestra Historia</span>
            </div>

            <h1 className="animate-fade-in-up mb-6">
              El complemento que{' '}
              <span className="bg-gradient-to-r from-primary via-blue-600 to-purple-600 bg-clip-text text-transparent">
                Airbnb no tiene
              </span>
            </h1>

            <p className="animate-fade-in-up animation-delay-100 text-lg text-muted-foreground">
              Conectamos anfitriones, afiliados y viajeros en una plataforma de referidos que convierte
              el boca a boca en comisiones reales por reservas vacacionales.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 sm:py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <div className="mb-12 text-center">
              <h2 className="mb-4">Nuestra Historia</h2>
              <div className="mx-auto h-1 w-24 rounded-full bg-gradient-to-r from-primary via-blue-600 to-purple-600" />
            </div>

            <div className="space-y-6 text-lg leading-relaxed text-muted-foreground">
              <p>
                GYDI nació en 2024 con una visión clara: <span className="font-semibold text-foreground">democratizar el acceso
                al mercado inmobiliario</span> y crear oportunidades de ingresos para personas de todo el mundo.
              </p>

              <p>
                Observamos que Airbnb resolvió la visibilidad, pero dejó un vacío enorme: nadie ayudaba
                a los anfitriones a activar su propia red de referidos. Por otro lado, miles de personas
                querían ganar dinero recomendando alojamientos, pero no tenían herramientas para hacerlo.{' '}
                <span className="font-semibold text-foreground">Vimos la oportunidad de unir ambos mundos.</span>
              </p>

              <p>
                Hoy, GYDI es <span className="font-semibold text-primary">el complemento de Airbnb</span> que activa
                una red de{' '}
                <span className="font-semibold text-blue-600">afiliados motivados</span> que refieren
                <span className="font-semibold text-purple-600"> propiedades en renta a huéspedes reales</span>.
                Anfitriones consiguen más reservas. Afiliados generan comisiones. Todos ganan.
              </p>

              <p>
                Con más de <span className="font-semibold text-foreground">500 afiliados activos</span> y
                cientos de propiedades listadas, estamos construyendo el futuro del mercado inmobiliario digital.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission, Vision, Values */}
      <section className="border-y bg-gradient-to-b from-gray-50/50 to-white py-16 sm:py-20">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-3">
            {/* Mission */}
            <div className="group rounded-3xl border border-border/50 bg-card p-8 transition-all duration-300 hover:border-primary/50 hover:shadow-xl hover:-translate-y-1">
              <div className="mb-6 inline-flex rounded-2xl bg-primary/10 p-4 transition-all duration-300 group-hover:scale-110">
                <Target className="h-10 w-10 text-primary" />
              </div>
              <h3 className="mb-4">Nuestra Misión</h3>
              <p className="leading-relaxed text-muted-foreground">
                Crear oportunidades de ingresos reales para cualquier persona, conectando anfitriones con propiedades en renta y afiliados con viajeros a través de una plataforma de referidos transparente y justa.
              </p>
            </div>

            {/* Vision */}
            <div className="group rounded-3xl border border-border/50 bg-card p-8 transition-all duration-300 hover:border-blue-500/50 hover:shadow-xl hover:-translate-y-1">
              <div className="mb-6 inline-flex rounded-2xl bg-blue-500/10 p-4 transition-all duration-300 group-hover:scale-110">
                <Globe className="h-10 w-10 text-blue-600" />
              </div>
              <h3 className="mb-4">Nuestra Visión</h3>
              <p className="leading-relaxed text-muted-foreground">
                Ser la red de referidos de propiedades en renta más grande de Latinoamérica, donde anfitriones de Airbnb y afiliados colaboran para generar ingresos reales de manera simple y transparente.
              </p>
            </div>

            {/* Values */}
            <div className="group rounded-3xl border border-border/50 bg-card p-8 transition-all duration-300 hover:border-purple-500/50 hover:shadow-xl hover:-translate-y-1">
              <div className="mb-6 inline-flex rounded-2xl bg-purple-500/10 p-4 transition-all duration-300 group-hover:scale-110">
                <Heart className="h-10 w-10 text-purple-600" />
              </div>
              <h3 className="mb-4">Nuestros Valores</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-purple-600" />
                  <span>Transparencia total</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-purple-600" />
                  <span>Innovación constante</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-purple-600" />
                  <span>Comunidad primero</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-purple-600" />
                  <span>Pagos justos y puntuales</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features / Why Choose Us */}
      <section className="py-16 sm:py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4">¿Por Qué Elegir GYDI?</h2>
            <p className="text-lg text-muted-foreground">
              Nos diferenciamos por nuestro compromiso con la excelencia y la transparencia
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {/* Feature 1 */}
            <div className="rounded-2xl border border-border/50 bg-card p-6 transition-all duration-300 hover:shadow-lg">
              <div className="mb-4 inline-flex rounded-xl bg-primary/10 p-3">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h4 className="mb-2">100% Seguro</h4>
              <p className="text-sm text-muted-foreground">
                Transacciones protegidas y datos encriptados. Tu seguridad es nuestra prioridad.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="rounded-2xl border border-border/50 bg-card p-6 transition-all duration-300 hover:shadow-lg">
              <div className="mb-4 inline-flex rounded-xl bg-blue-500/10 p-3">
                <TrendingUp className="h-8 w-8 text-blue-600" />
              </div>
              <h4 className="mb-2">Comisiones Justas</h4>
              <p className="text-sm text-muted-foreground">
                Hasta 10% de comisión por referidos. Las tasas más competitivas del mercado.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="rounded-2xl border border-border/50 bg-card p-6 transition-all duration-300 hover:shadow-lg">
              <div className="mb-4 inline-flex rounded-xl bg-purple-500/10 p-3">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
              <h4 className="mb-2">Comunidad Global</h4>
              <p className="text-sm text-muted-foreground">
                Más de 500 afiliados activos en todo el mundo generando ingresos con nosotros.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="rounded-2xl border border-border/50 bg-card p-6 transition-all duration-300 hover:shadow-lg">
              <div className="mb-4 inline-flex rounded-xl bg-orange-500/10 p-3">
                <Award className="h-8 w-8 text-orange-600" />
              </div>
              <h4 className="mb-2">Soporte Premium</h4>
              <p className="text-sm text-muted-foreground">
                Equipo dedicado disponible 24/7 para resolver tus dudas y ayudarte a crecer.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y bg-gradient-to-br from-primary via-blue-600 to-purple-600 py-16 text-primary-foreground sm:py-20">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="text-center">
              <div className="mb-2 text-5xl font-extrabold">500+</div>
              <div className="text-sm opacity-90">Afiliados Activos</div>
            </div>
            <div className="text-center">
              <div className="mb-2 text-5xl font-extrabold">1,200+</div>
              <div className="text-sm opacity-90">Propiedades Listadas</div>
            </div>
            <div className="text-center">
              <div className="mb-2 text-5xl font-extrabold">$2M+</div>
              <div className="text-sm opacity-90">Pagado en Comisiones</div>
            </div>
            <div className="text-center">
              <div className="mb-2 text-5xl font-extrabold">30+</div>
              <div className="text-sm opacity-90">Países Activos</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4">
            ¿Listo para Unirte a Nosotros?
          </h2>
          <p className="mb-8 text-lg text-muted-foreground">
            Únete como afiliado y gana comisiones por referir propiedades en renta, o como anfitrión y amplía el alcance de tu propiedad con nuestra red de referidos
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link href="/register">Crear Cuenta Gratis</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
              <Link href="/contact">Contáctanos</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
