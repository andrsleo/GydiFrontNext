import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PlanSelectButton } from '@/components/shared/plan-select-button';
import { Building2, TrendingUp, Users, Shield, Zap, DollarSign, Check, Star, Crown, Rocket, MapPin, Bed, Bath, Maximize, ArrowRight, Home, CreditCard } from 'lucide-react';
import Image from 'next/image';

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/5 via-blue-500/5 to-purple-500/5" />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />

        <div className="container mx-auto flex flex-col items-center justify-center px-4 py-16 text-center sm:py-20 md:py-28 lg:py-36">
          {/* Badge */}
          <div className="animate-fade-in-down mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary backdrop-blur-sm transition-all hover:border-primary/30 hover:bg-primary/10 hover:scale-105 sm:mb-8">
            <span className="text-base animate-pulse-glow">🏡</span>
            <span>El complemento para anfitriones de Airbnb</span>
          </div>

          {/* Heading */}
          <h1 className="animate-fade-in-up animation-delay-100 mb-6 max-w-5xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl sm:leading-tight md:text-6xl md:leading-tight lg:text-7xl lg:leading-tight">
            Refiere propiedades.{' '}
            <span className="animate-gradient bg-gradient-to-r from-primary via-blue-600 to-purple-600 bg-clip-text text-transparent">
              Gana en cada reserva.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="animate-fade-in-up animation-delay-200 mb-10 max-w-2xl text-base text-muted-foreground sm:text-lg md:text-xl lg:max-w-3xl">
            Conecta a viajeros con los mejores alojamientos y gana{' '}
            <span className="font-semibold text-purple-600">hasta 10% de comisión</span>{' '}
            por cada reserva que generas.{' '}
            <span className="font-semibold text-blue-600">El poder del boca a boca, digitalizado.</span>
          </p>

          {/* CTA Buttons */}
          <div className="animate-fade-in-up animation-delay-300 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:gap-4">
            <Button asChild size="lg" className="text-base font-semibold shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30 sm:px-8">
              <Link href="/register">
                Empieza a ganar
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-base font-semibold sm:px-8">
              <Link href="/propiedades">Ver Propiedades</Link>
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="mt-16 grid w-full max-w-5xl grid-cols-1 gap-4 sm:mt-20 sm:grid-cols-3 sm:gap-6 lg:gap-8">
            <div className="animate-scale-in animation-delay-400 group relative overflow-hidden rounded-2xl border border-primary/10 bg-gradient-to-br from-card to-card/50 p-6 backdrop-blur-sm transition-all hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1 sm:p-8">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              <p className="relative text-4xl font-extrabold text-primary transition-transform group-hover:scale-110 sm:text-5xl lg:text-6xl">10%</p>
              <p className="relative mt-2 text-sm font-medium text-muted-foreground sm:text-base">Comisión por referido</p>
            </div>
            <div className="animate-scale-in animation-delay-500 group relative overflow-hidden rounded-2xl border border-blue-500/10 bg-gradient-to-br from-card to-card/50 p-6 backdrop-blur-sm transition-all hover:border-blue-500/20 hover:shadow-lg hover:shadow-blue-500/5 hover:-translate-y-1 sm:p-8">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              <p className="relative text-4xl font-extrabold text-blue-600 transition-transform group-hover:scale-110 sm:text-5xl lg:text-6xl">500+</p>
              <p className="relative mt-2 text-sm font-medium text-muted-foreground sm:text-base">Propiedades Disponibles</p>
            </div>
            <div className="animate-scale-in animation-delay-600 group relative overflow-hidden rounded-2xl border border-purple-500/10 bg-gradient-to-br from-card to-card/50 p-6 backdrop-blur-sm transition-all hover:border-purple-500/20 hover:shadow-lg hover:shadow-purple-500/5 hover:-translate-y-1 sm:p-8">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              <p className="relative text-4xl font-extrabold text-purple-600 transition-transform group-hover:scale-110 sm:text-5xl lg:text-6xl">$50K+</p>
              <p className="relative mt-2 text-sm font-medium text-muted-foreground sm:text-base">Pagado a Afiliados</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="como-funciona" className="relative overflow-hidden border-t bg-gradient-to-b from-gray-50/50 to-white py-16 sm:py-20 md:py-24 lg:py-28">
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <div className="mb-12 text-center sm:mb-16">
            <h2 className="animate-fade-in-up text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl md:text-5xl">
              Tres pasos para tu primer ingreso
            </h2>
            <p className="animate-fade-in-up animation-delay-100 mt-3 text-base text-muted-foreground sm:mt-4 sm:text-lg md:text-xl">
              No necesitas experiencia en ventas. Solo tener contactos y ganas de ganar.
            </p>
          </div>

          {/* Steps Grid */}
          <div className="grid gap-8 sm:gap-10 md:grid-cols-3 md:gap-8 lg:gap-12">
            {/* Step 1 */}
            <div className="animate-slide-in-left animation-delay-200 group relative">
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-6">
                  <div className="absolute -inset-2 rounded-full bg-primary/20 blur-xl transition-all duration-500 group-hover:bg-primary/30" />
                  <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/80 text-3xl font-extrabold text-primary-foreground shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:rotate-12 sm:h-24 sm:w-24">
                    1
                  </div>
                </div>
                <h3 className="mb-3 text-xl font-bold text-foreground transition-colors duration-300 group-hover:text-primary sm:text-2xl">Genera tu link único</h3>
                <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                  Con un click obtienes tu URL personal de referido. Cada link rastrea automáticamente las visitas y reservas que generas.
                </p>
              </div>
              {/* Connector line (hidden on mobile) */}
              <div className="absolute left-1/2 top-10 hidden h-0.5 w-full bg-gradient-to-r from-primary/50 to-transparent md:block" />
            </div>

            {/* Step 2 */}
            <div className="animate-fade-in animation-delay-300 group relative">
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-6">
                  <div className="absolute -inset-2 rounded-full bg-blue-500/20 blur-xl transition-all duration-500 group-hover:bg-blue-500/30" />
                  <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-blue-500 text-3xl font-extrabold text-white shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:rotate-12 sm:h-24 sm:w-24">
                    2
                  </div>
                </div>
                <h3 className="mb-3 text-xl font-bold text-foreground transition-colors duration-300 group-hover:text-blue-600 sm:text-2xl">Comparte con quien confía en ti</h3>
                <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                  Manda el link por WhatsApp, Instagram o email. Tu recomendación personal tiene más peso que cualquier anuncio.
                </p>
              </div>
              {/* Connector line (hidden on mobile) */}
              <div className="absolute left-1/2 top-10 hidden h-0.5 w-full bg-gradient-to-r from-blue-500/50 to-transparent md:block" />
            </div>

            {/* Step 3 */}
            <div className="animate-slide-in-right animation-delay-400 group relative">
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-6">
                  <div className="absolute -inset-2 rounded-full bg-purple-500/20 blur-xl transition-all duration-500 group-hover:bg-purple-500/30" />
                  <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-purple-500 text-3xl font-extrabold text-white shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:rotate-12 sm:h-24 sm:w-24">
                    3
                  </div>
                </div>
                <h3 className="mb-3 text-xl font-bold text-foreground transition-colors duration-300 group-hover:text-purple-600 sm:text-2xl">Cobra cuando ellos reservan</h3>
                <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                  Cada vez que alguien reserva usando tu link, la comisión se registra automáticamente y se acredita a tu cuenta.
                </p>
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <div className="animate-fade-in-up animation-delay-500 mt-12 text-center sm:mt-16">
            <Button asChild size="lg" className="shadow-lg shadow-primary/25 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-primary/30">
              <Link href="/register">Generar mi primer link</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Properties Showcase - Apple Style */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white via-gray-50 to-white py-16 sm:py-20 md:py-24 lg:py-32">
        {/* Decorative background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:64px_64px]" />

        <div className="container relative mx-auto px-4">
          {/* Section Header */}
          <div className="mb-16 text-center">
            <div className="animate-fade-in-down mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary backdrop-blur-sm">
              <Building2 className="h-4 w-4" />
              <span>Propiedades Destacadas</span>
            </div>
            <h2 className="animate-fade-in-up mb-4 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl md:text-5xl lg:text-6xl">
              Propiedades en renta para referir
            </h2>
            <p className="animate-fade-in-up animation-delay-100 mx-auto max-w-2xl text-base text-muted-foreground sm:text-lg md:text-xl">
              Alojamientos vacacionales premium curados por nuestra comunidad. Refiere y gana comisión por cada reserva.
            </p>
          </div>

          {/* Bento Box Grid - Apple Style */}
          <div className="grid gap-4 sm:gap-6 md:grid-cols-6 lg:gap-8">
            {/* Large Featured Property - Left */}
            <div className="animate-scale-in animation-delay-200 group relative col-span-6 overflow-hidden rounded-3xl bg-card shadow-2xl transition-all duration-700 hover:shadow-primary/20 md:col-span-4 md:row-span-2">
              <div className="aspect-[4/3] md:aspect-[16/10]">
                <Image
                  src="https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&q=80"
                  alt="Villa de Lujo en Bali"
                  width={1200}
                  height={750}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 transition-opacity duration-700 group-hover:opacity-80" />

              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-8 md:p-10">
                <div className="translate-y-2 transition-transform duration-700 group-hover:translate-y-0">
                  <div className="mb-3 flex items-center gap-2 text-white/90">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm font-medium">Bali, Indonesia</span>
                  </div>

                  <h3 className="mb-3 text-2xl font-extrabold text-white sm:text-3xl md:text-4xl">
                    Villa de Lujo Frente al Mar
                  </h3>

                  <div className="mb-4 flex items-center gap-4 text-white/80">
                    <div className="flex items-center gap-1.5">
                      <Bed className="h-4 w-4" />
                      <span className="text-sm">4 Habitaciones</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Bath className="h-4 w-4" />
                      <span className="text-sm">3 Baños</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Maximize className="h-4 w-4" />
                      <span className="text-sm">250m²</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-3xl font-extrabold text-white">$450</div>
                      <div className="text-sm text-white/70">por noche</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Badge */}
              <div className="absolute right-6 top-6 rounded-full bg-gradient-to-r from-primary to-blue-600 px-4 py-2 text-xs font-bold text-primary-foreground shadow-lg backdrop-blur-sm">
                Popular
              </div>
            </div>

            {/* Top Right Property */}
            <div className="animate-scale-in animation-delay-300 group relative col-span-6 overflow-hidden rounded-3xl bg-card shadow-xl transition-all duration-700 hover:shadow-primary/20 md:col-span-2">
              <div className="aspect-[4/3]">
                <Image
                  src="https://images.unsplash.com/photo-1602343168117-bb8ffe3e2e9f?w=800&q=80"
                  alt="Apartamento Moderno en Dubai"
                  width={800}
                  height={600}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 transition-opacity duration-700 group-hover:opacity-80" />

              <div className="absolute inset-0 flex flex-col justify-end p-6">
                <div className="translate-y-2 transition-transform duration-700 group-hover:translate-y-0">
                  <div className="mb-2 flex items-center gap-2 text-white/90">
                    <MapPin className="h-3 w-3" />
                    <span className="text-xs font-medium">Dubai, UAE</span>
                  </div>

                  <h3 className="mb-2 text-lg font-extrabold text-white sm:text-xl">
                    Apartamento Moderno
                  </h3>

                  <div className="mb-3 flex items-center gap-3 text-white/80">
                    <div className="flex items-center gap-1">
                      <Bed className="h-3 w-3" />
                      <span className="text-xs">2</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Bath className="h-3 w-3" />
                      <span className="text-xs">2</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xl font-extrabold text-white">$320</div>
                      <div className="text-xs text-white/70">por noche</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Right Property */}
            <div className="animate-scale-in animation-delay-400 group relative col-span-6 overflow-hidden rounded-3xl bg-card shadow-xl transition-all duration-700 hover:shadow-purple-500/20 md:col-span-2">
              <div className="aspect-[4/3]">
                <Image
                  src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80"
                  alt="Casa de Campo en Toscana"
                  width={800}
                  height={600}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 transition-opacity duration-700 group-hover:opacity-80" />

              <div className="absolute inset-0 flex flex-col justify-end p-6">
                <div className="translate-y-2 transition-transform duration-700 group-hover:translate-y-0">
                  <div className="mb-2 flex items-center gap-2 text-white/90">
                    <MapPin className="h-3 w-3" />
                    <span className="text-xs font-medium">Toscana, Italia</span>
                  </div>

                  <h3 className="mb-2 text-lg font-extrabold text-white sm:text-xl">
                    Casa de Campo
                  </h3>

                  <div className="mb-3 flex items-center gap-3 text-white/80">
                    <div className="flex items-center gap-1">
                      <Bed className="h-3 w-3" />
                      <span className="text-xs">3</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Bath className="h-3 w-3" />
                      <span className="text-xs">2</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xl font-extrabold text-white">$280</div>
                      <div className="text-xs text-white/70">por noche</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute right-4 top-4 rounded-full bg-purple-600 px-3 py-1 text-xs font-bold text-white shadow-lg">
                Nuevo
              </div>
            </div>

            {/* Bottom Full Width Property */}
            <div className="animate-scale-in animation-delay-500 group relative col-span-6 overflow-hidden rounded-3xl bg-card shadow-xl transition-all duration-700 hover:shadow-blue-500/20">
              <div className="aspect-[16/6] sm:aspect-[16/5]">
                <Image
                  src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1400&q=80"
                  alt="Penthouse en Manhattan"
                  width={1400}
                  height={400}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>

              <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent opacity-70 transition-opacity duration-700 group-hover:opacity-90" />

              <div className="absolute inset-0 flex items-center p-6 sm:p-10 md:p-12">
                <div className="max-w-xl">
                  <div className="mb-3 flex items-center gap-2 text-white/90">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm font-medium">Manhattan, Nueva York</span>
                  </div>

                  <h3 className="mb-3 text-2xl font-extrabold text-white sm:text-3xl md:text-4xl">
                    Penthouse de Lujo
                  </h3>

                  <p className="mb-4 text-sm text-white/80 sm:text-base">
                    Vista panorámica de 360° al skyline de NYC. Diseño contemporáneo con acabados premium.
                  </p>

                  <div className="mb-6 flex items-center gap-6 text-white/80">
                    <div className="flex items-center gap-1.5">
                      <Bed className="h-4 w-4" />
                      <span className="text-sm">5 Habitaciones</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Bath className="h-4 w-4" />
                      <span className="text-sm">4 Baños</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Maximize className="h-4 w-4" />
                      <span className="text-sm">380m²</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div>
                      <div className="text-4xl font-extrabold text-white">$850</div>
                      <div className="text-sm text-white/70">por noche</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute right-6 top-6 rounded-full bg-gradient-to-r from-blue-600 to-blue-500 px-4 py-2 text-xs font-bold text-white shadow-lg backdrop-blur-sm">
                Premium
              </div>
            </div>
          </div>

          {/* View All Properties CTA */}
          <div className="animate-fade-in-up animation-delay-600 mt-12 text-center sm:mt-16">
            <Button
              asChild
              size="lg"
              className="group bg-gradient-to-r from-primary via-blue-600 to-purple-600 shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-primary/30"
            >
              <Link href="/propiedades">
                Ver Todas las Propiedades
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 sm:py-20 md:py-24 lg:py-28">
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <div className="mb-12 text-center sm:mb-16">
            <h2 className="animate-fade-in-up text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl md:text-5xl">
              ¿Por Qué Elegir GYDI?
            </h2>
            <p className="animate-fade-in-up animation-delay-100 mt-3 text-base text-muted-foreground sm:mt-4 sm:text-lg md:text-xl">
              El complemento que potencia tu presencia en Airbnb y convierte tu red en ingresos reales
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3">
            {/* Feature 1 */}
            <div className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card p-6 transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1 sm:p-8">
              <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-primary/5 blur-2xl transition-all duration-500 group-hover:bg-primary/10" />
              <div className="relative">
                <div className="mb-4 inline-flex rounded-xl bg-primary/10 p-3 transition-all duration-300 group-hover:bg-primary/20 group-hover:scale-110 group-hover:rotate-6">
                  <DollarSign className="h-8 w-8 text-primary transition-transform duration-300 group-hover:scale-110 sm:h-10 sm:w-10" />
                </div>
                <h3 className="mb-2 text-xl font-bold text-foreground sm:text-2xl">Tu red vale dinero</h3>
                <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                  Comparte un link, alguien reserva, tú cobras. Gana hasta 10% de comisión sin inversión ni inventario.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card p-6 transition-all duration-300 hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/5 hover:-translate-y-1 sm:p-8">
              <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-blue-500/5 blur-2xl transition-all duration-500 group-hover:bg-blue-500/10" />
              <div className="relative">
                <div className="mb-4 inline-flex rounded-xl bg-blue-500/10 p-3 transition-all duration-300 group-hover:bg-blue-500/20 group-hover:scale-110 group-hover:rotate-6">
                  <Zap className="h-8 w-8 text-blue-600 transition-transform duration-300 group-hover:scale-110 sm:h-10 sm:w-10" />
                </div>
                <h3 className="mb-2 text-xl font-bold text-foreground sm:text-2xl">Pagos Rápidos</h3>
                <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                  Recibe tus comisiones cada 15 días directamente en tu cuenta.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card p-6 transition-all duration-300 hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/5 hover:-translate-y-1 sm:p-8">
              <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-purple-500/5 blur-2xl transition-all duration-500 group-hover:bg-purple-500/10" />
              <div className="relative">
                <div className="mb-4 inline-flex rounded-xl bg-purple-500/10 p-3 transition-all duration-300 group-hover:bg-purple-500/20 group-hover:scale-110 group-hover:rotate-6">
                  <TrendingUp className="h-8 w-8 text-purple-600 transition-transform duration-300 group-hover:scale-110 sm:h-10 sm:w-10" />
                </div>
                <h3 className="mb-2 text-xl font-bold text-foreground sm:text-2xl">Dashboard Completo</h3>
                <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                  Trackea clicks, conversiones y ganancias en tiempo real.
                </p>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card p-6 transition-all duration-300 hover:border-orange-500/50 hover:shadow-lg hover:shadow-orange-500/5 hover:-translate-y-1 sm:p-8">
              <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-orange-500/5 blur-2xl transition-all duration-500 group-hover:bg-orange-500/10" />
              <div className="relative">
                <div className="mb-4 inline-flex rounded-xl bg-orange-500/10 p-3 transition-all duration-300 group-hover:bg-orange-500/20 group-hover:scale-110 group-hover:rotate-6">
                  <Building2 className="h-8 w-8 text-orange-600 transition-transform duration-300 group-hover:scale-110 sm:h-10 sm:w-10" />
                </div>
                <h3 className="mb-2 text-xl font-bold text-foreground sm:text-2xl">Catálogo Curado</h3>
                <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                  Alojamientos vacacionales seleccionados. Propiedades en renta de calidad para referir con confianza.
                </p>
              </div>
            </div>

            {/* Feature 5 */}
            <div className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card p-6 transition-all duration-300 hover:border-green-500/50 hover:shadow-lg hover:shadow-green-500/5 hover:-translate-y-1 sm:p-8">
              <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-green-500/5 blur-2xl transition-all duration-500 group-hover:bg-green-500/10" />
              <div className="relative">
                <div className="mb-4 inline-flex rounded-xl bg-green-500/10 p-3 transition-all duration-300 group-hover:bg-green-500/20 group-hover:scale-110 group-hover:rotate-6">
                  <Users className="h-8 w-8 text-green-600 transition-transform duration-300 group-hover:scale-110 sm:h-10 sm:w-10" />
                </div>
                <h3 className="mb-2 text-xl font-bold text-foreground sm:text-2xl">Soporte Dedicado</h3>
                <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                  Equipo de soporte disponible 24/7 para ayudarte.
                </p>
              </div>
            </div>

            {/* Feature 6 */}
            <div className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card p-6 transition-all duration-300 hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-500/5 hover:-translate-y-1 sm:p-8">
              <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-indigo-500/5 blur-2xl transition-all duration-500 group-hover:bg-indigo-500/10" />
              <div className="relative">
                <div className="mb-4 inline-flex rounded-xl bg-indigo-500/10 p-3 transition-all duration-300 group-hover:bg-indigo-500/20 group-hover:scale-110 group-hover:rotate-6">
                  <Shield className="h-8 w-8 text-indigo-600 transition-transform duration-300 group-hover:scale-110 sm:h-10 sm:w-10" />
                </div>
                <h3 className="mb-2 text-xl font-bold text-foreground sm:text-2xl">100% Seguro</h3>
                <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                  Plataforma certificada con protección de datos garantizada.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Host Section */}
      <section className="border-t bg-gradient-to-b from-orange-50/40 to-white py-16 sm:py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
              {/* Left: Copy */}
              <div>
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-4 py-1.5 text-sm font-medium text-orange-700">
                  <Home className="h-4 w-4" />
                  <span>Para Anfitriones</span>
                </div>
                <h2 className="mb-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
                  Tienes propiedad en Airbnb.{' '}
                  <span className="text-orange-600">Multiplica tus reservas.</span>
                </h2>
                <p className="mb-8 text-lg text-muted-foreground">
                  Publica tu propiedad en GYDI y accede a una red de afiliados motivados a llenar
                  tu calendario. Solo pagas una comisión cuando hay una reserva confirmada — cero riesgo.
                </p>

                <div className="mb-8 space-y-5">
                  <div className="flex items-start gap-4">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-orange-100">
                      <Check className="h-4 w-4 text-orange-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">Sin exclusividad</p>
                      <p className="text-sm text-muted-foreground">
                        Sigue en Airbnb. GYDI es un canal adicional que te trae más reservas, no un reemplazo.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-orange-100">
                      <Check className="h-4 w-4 text-orange-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">Solo pagas por resultados</p>
                      <p className="text-sm text-muted-foreground">
                        La comisión se descuenta únicamente cuando hay reserva confirmada. Sin costos fijos ocultos.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-orange-100">
                      <Check className="h-4 w-4 text-orange-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">Afiliados motivados a referirte</p>
                      <p className="text-sm text-muted-foreground">
                        Cada afiliado gana cuando tú ganas. Un modelo donde todos tienen incentivo para que las reservas ocurran.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button asChild size="lg">
                    <Link href="/register">Publicar mi propiedad</Link>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <Link href="#precios">Ver comisiones por plan</Link>
                  </Button>
                </div>
              </div>

              {/* Right: Fee comparison */}
              <div className="space-y-4">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  Comisión de plataforma según tu plan
                </p>

                {/* FREE */}
                <div className="flex items-center justify-between rounded-2xl border border-border/50 bg-card p-5 shadow-sm transition-all hover:shadow-md">
                  <div>
                    <p className="font-bold text-foreground">Plan FREE</p>
                    <p className="text-sm text-muted-foreground">Gratis para empezar</p>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-extrabold text-orange-500">25%</p>
                    <p className="text-xs text-muted-foreground">comisión plataforma</p>
                  </div>
                </div>

                {/* PRO */}
                <div className="flex items-center justify-between rounded-2xl border-2 border-primary bg-primary/5 p-5 shadow-md">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-foreground">Plan PRO</p>
                      <span className="rounded-full bg-primary px-2 py-0.5 text-xs font-bold text-primary-foreground">Popular</span>
                    </div>
                    <p className="text-sm text-muted-foreground">$19/mes</p>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-extrabold text-orange-500">20%</p>
                    <p className="text-xs text-muted-foreground">comisión plataforma</p>
                  </div>
                </div>

                {/* ELITE */}
                <div className="flex items-center justify-between rounded-2xl border border-purple-200 bg-purple-50/50 p-5 shadow-sm transition-all hover:shadow-md">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-foreground">Plan ELITE</p>
                      <span className="rounded-full bg-purple-600 px-2 py-0.5 text-xs font-bold text-white">Mejor valor</span>
                    </div>
                    <p className="text-sm text-muted-foreground">$39/mes</p>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-extrabold text-orange-500">15%</p>
                    <p className="text-xs text-muted-foreground">comisión plataforma</p>
                  </div>
                </div>

                <p className="text-center text-xs text-muted-foreground">
                  * Solo se descuenta cuando hay una reserva confirmada vía afiliado de GYDI.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="precios" className="relative overflow-hidden border-t bg-gradient-to-b from-white via-gray-50/50 to-white py-16 sm:py-20 md:py-24 lg:py-28">
        {/* Decorative elements */}
        <div className="absolute left-0 top-1/4 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute right-0 bottom-1/4 h-96 w-96 rounded-full bg-blue-500/5 blur-3xl" />

        <div className="container relative mx-auto px-4">
          {/* Section Header */}
          <div className="mb-12 text-center sm:mb-16">
            <div className="animate-fade-in-down mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary backdrop-blur-sm">
              <Star className="h-4 w-4" />
              <span>Planes y Precios</span>
            </div>
            <h2 className="animate-fade-in-up text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl md:text-5xl">
              Elige cómo quieres crecer
            </h2>
            <p className="animate-fade-in-up animation-delay-100 mt-3 text-base text-muted-foreground sm:mt-4 sm:text-lg md:text-xl">
              Sin contratos. Sin sorpresas. Cambia o cancela cuando quieras.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid gap-6 sm:gap-8 md:grid-cols-3 lg:gap-8">
            {/* Free Plan */}
            <div className="animate-scale-in animation-delay-200 group relative overflow-hidden rounded-3xl border-2 border-border/50 bg-card p-8 transition-all duration-500 hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2">
              <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-primary/5 blur-2xl transition-all duration-500 group-hover:bg-primary/10" />

              <div className="relative">
                {/* Icon */}
                <div className="mb-6 inline-flex rounded-2xl bg-primary/10 p-4 transition-all duration-300 group-hover:scale-110 group-hover:bg-primary/20">
                  <Rocket className="h-8 w-8 text-primary" />
                </div>

                {/* Plan Name */}
                <h3 className="mb-2 text-2xl font-extrabold text-foreground">FREE</h3>
                <p className="mb-6 text-sm text-muted-foreground">Empieza sin riesgo, aprende cómo funciona</p>

                {/* Price */}
                <div className="mb-8">
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-extrabold text-foreground">$0</span>
                    <span className="text-muted-foreground">/mes</span>
                  </div>
                </div>

                {/* Dual Role Conditions */}
                <div className="mb-8 space-y-3">
                  {/* Como Afiliado */}
                  <div className="rounded-xl border border-green-200 bg-green-50 p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-green-600" />
                        <span className="text-xs font-bold uppercase tracking-wide text-green-700">Como Afiliado</span>
                      </div>
                      <span className="text-xl font-extrabold text-green-600">+2%</span>
                    </div>
                    <p className="mt-1 text-xs text-green-700">Ganas 2% por cada reserva que generas con tu link</p>
                  </div>
                  {/* Como Anfitrión */}
                  <div className="rounded-xl border border-orange-200 bg-orange-50 p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Home className="h-4 w-4 text-orange-600" />
                        <span className="text-xs font-bold uppercase tracking-wide text-orange-700">Como Anfitrión</span>
                      </div>
                      <span className="text-xl font-extrabold text-orange-600">-25%</span>
                    </div>
                    <p className="mt-1 text-xs text-orange-700">GYDI descuenta 25% de cada reserva vía afiliado</p>
                  </div>
                </div>

                {/* CTA Button */}
                <PlanSelectButton
                  planCode="FREE"
                  className="w-full transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/20"
                  variant="outline"
                >
                  Comenzar gratis
                </PlanSelectButton>
              </div>
            </div>

            {/* Pro Plan - Featured */}
            <div className="animate-scale-in animation-delay-300 group relative overflow-hidden rounded-3xl border-2 border-primary bg-gradient-to-b from-card to-primary/5 p-8 shadow-xl shadow-primary/20 transition-all duration-500 hover:border-primary hover:shadow-2xl hover:shadow-primary/30 hover:-translate-y-2">
              {/* Popular Badge */}
              <div className="absolute -right-12 top-8 rotate-45 bg-gradient-to-r from-primary to-blue-600 px-12 py-1 text-xs font-bold text-primary-foreground shadow-lg">
                Popular
              </div>

              <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-blue-500/10 blur-2xl transition-all duration-500 group-hover:bg-blue-500/20" />

              <div className="relative">
                {/* Icon */}
                <div className="mb-6 inline-flex rounded-2xl bg-gradient-to-br from-primary to-blue-600 p-4 shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl">
                  <Star className="h-8 w-8 text-primary-foreground" />
                </div>

                {/* Plan Name */}
                <h3 className="mb-2 text-2xl font-extrabold text-foreground">PRO</h3>
                <p className="mb-6 text-sm text-muted-foreground">Más comisión, más herramientas, más resultados</p>

                {/* Price */}
                <div className="mb-8">
                  <div className="flex items-baseline gap-2">
                    <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-5xl font-extrabold text-transparent">$15</span>
                    <span className="text-muted-foreground">/mes</span>
                  </div>
                </div>

                {/* Dual Role Conditions */}
                <div className="mb-8 space-y-3">
                  {/* Como Afiliado */}
                  <div className="rounded-xl border border-green-300 bg-green-50 p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-green-600" />
                        <span className="text-xs font-bold uppercase tracking-wide text-green-700">Como Afiliado</span>
                      </div>
                      <span className="text-xl font-extrabold text-green-600">+5%</span>
                    </div>
                    <p className="mt-1 text-xs text-green-700">Ganas 2.5x más que en FREE por la misma reserva</p>
                  </div>
                  {/* Como Anfitrión */}
                  <div className="rounded-xl border border-orange-300 bg-orange-50 p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Home className="h-4 w-4 text-orange-600" />
                        <span className="text-xs font-bold uppercase tracking-wide text-orange-700">Como Anfitrión</span>
                      </div>
                      <span className="text-xl font-extrabold text-orange-600">-20%</span>
                    </div>
                    <p className="mt-1 text-xs text-orange-700">Ahorras 5% vs FREE — recibes el 80% de cada reserva</p>
                  </div>
                </div>

                {/* CTA Button */}
                <PlanSelectButton
                  planCode="PRO"
                  className="w-full bg-gradient-to-r from-primary to-blue-600 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-primary/30"
                >
                  Pasar a PRO
                </PlanSelectButton>
              </div>
            </div>

            {/* Elite Plan */}
            <div className="animate-scale-in animation-delay-400 group relative overflow-hidden rounded-3xl border-2 border-purple-500/50 bg-gradient-to-b from-card to-purple-500/5 p-8 transition-all duration-500 hover:border-purple-500 hover:shadow-2xl hover:shadow-purple-500/20 hover:-translate-y-2">
              <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-purple-500/10 blur-2xl transition-all duration-500 group-hover:bg-purple-500/20" />

              <div className="relative">
                {/* Icon */}
                <div className="mb-6 inline-flex rounded-2xl bg-gradient-to-br from-purple-600 to-purple-500 p-4 shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl">
                  <Crown className="h-8 w-8 text-primary-foreground" />
                </div>

                {/* Plan Name */}
                <h3 className="mb-2 text-2xl font-extrabold text-foreground">ELITE</h3>
                <p className="mb-6 text-sm text-muted-foreground">El máximo retorno para quienes van en serio</p>

                {/* Price */}
                <div className="mb-8">
                  <div className="flex items-baseline gap-2">
                    <span className="bg-gradient-to-r from-purple-600 to-purple-500 bg-clip-text text-5xl font-extrabold text-transparent">$30</span>
                    <span className="text-muted-foreground">/mes</span>
                  </div>
                </div>

                {/* Dual Role Conditions */}
                <div className="mb-8 space-y-3">
                  {/* Como Afiliado */}
                  <div className="rounded-xl border border-green-300 bg-green-50 p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-green-600" />
                        <span className="text-xs font-bold uppercase tracking-wide text-green-700">Como Afiliado</span>
                      </div>
                      <span className="text-xl font-extrabold text-green-600">+10%</span>
                    </div>
                    <p className="mt-1 text-xs text-green-700">La tasa más alta — duplicas lo que ganas en PRO</p>
                  </div>
                  {/* Como Anfitrión */}
                  <div className="rounded-xl border border-orange-300 bg-orange-50 p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Home className="h-4 w-4 text-orange-600" />
                        <span className="text-xs font-bold uppercase tracking-wide text-orange-700">Como Anfitrión</span>
                      </div>
                      <span className="text-xl font-extrabold text-orange-600">-15%</span>
                    </div>
                    <p className="mt-1 text-xs text-orange-700">La mejor tarifa — recibes el 85% de cada reserva</p>
                  </div>
                </div>

                {/* CTA Button */}
                <PlanSelectButton
                  planCode="ELITE"
                  className="w-full bg-gradient-to-r from-purple-600 to-purple-500 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/30"
                >
                  Unirme a ELITE
                </PlanSelectButton>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden border-t bg-gradient-to-br from-primary via-primary/95 to-blue-600 py-16 text-primary-foreground sm:py-20 md:py-24 lg:py-28">
        {/* Background pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="animate-float absolute right-0 top-0 h-64 w-64 rounded-full bg-blue-400/20 blur-3xl" />
        <div className="animate-float absolute bottom-0 left-0 h-64 w-64 rounded-full bg-purple-400/20 blur-3xl animation-delay-300" />

        <div className="container relative mx-auto px-4 text-center">
          <h2 className="animate-fade-in-up text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
            Tu siguiente comisión está a un mensaje de distancia
          </h2>
          <p className="animate-fade-in-up animation-delay-100 mt-4 text-base opacity-95 sm:text-lg md:text-xl lg:mt-6">
            Únete a cientos de afiliados y anfitriones que ya están generando ingresos con GYDI
          </p>

          <div className="animate-fade-in-up animation-delay-200 mt-8 flex flex-col items-center justify-center gap-3 sm:mt-10 sm:flex-row sm:gap-4">
            <Button
              asChild
              size="lg"
              variant="secondary"
              className="w-full font-semibold shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl sm:w-auto sm:px-8"
            >
              <Link href="/register">Crear cuenta gratis</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="secondary"
              className="w-full border-2 border-primary-foreground/80 font-semibold text-primary-foreground transition-all duration-300 hover:scale-105 hover:border-primary-foreground hover:bg-primary-foreground/10 sm:w-auto sm:px-8"
            >
              <Link href="/propiedades">Explorar Propiedades</Link>
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="animate-fade-in-up animation-delay-300 mt-12 flex flex-wrap items-center justify-center gap-6 text-sm opacity-90 sm:mt-16 sm:gap-12 sm:text-base">
            <div className="group flex items-center gap-2 transition-all duration-300 hover:scale-110">
              <Shield className="h-5 w-5 transition-transform duration-300 group-hover:rotate-12" />
              <span>100% Seguro</span>
            </div>
            <div className="group flex items-center gap-2 transition-all duration-300 hover:scale-110">
              <Users className="h-5 w-5 transition-transform duration-300 group-hover:rotate-12" />
              <span>500+ Afiliados activos</span>
            </div>
            <div className="group flex items-center gap-2 transition-all duration-300 hover:scale-110">
              <DollarSign className="h-5 w-5 transition-transform duration-300 group-hover:rotate-12" />
              <span>Sin Costos Ocultos</span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
