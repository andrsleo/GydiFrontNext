import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Building2, TrendingUp, Users, Shield, Zap, DollarSign, Check, Star, Crown, Rocket, MapPin, Bed, Bath, Maximize, ArrowRight } from 'lucide-react';
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
            <span className="text-base animate-pulse-glow">🎉</span>
            <span>Únete a más de 500 afiliados activos</span>
          </div>

          {/* Heading */}
          <h1 className="animate-fade-in-up animation-delay-100 mb-6 max-w-5xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl sm:leading-tight md:text-6xl md:leading-tight lg:text-7xl lg:leading-tight">
            La Plataforma Integral para{' '}
            <span className="animate-gradient bg-gradient-to-r from-primary via-blue-600 to-purple-600 bg-clip-text text-transparent">
              Propiedades Rentables
            </span>
          </h1>

          {/* Subtitle */}
          <p className="animate-fade-in-up animation-delay-200 mb-10 max-w-2xl text-base text-muted-foreground sm:text-lg md:text-xl lg:max-w-3xl">
            <span className="font-semibold text-primary">Vende propiedades inmobiliarias</span> o{' '}
            <span className="font-semibold text-blue-600">refiere propiedades vacacionales</span> y gana hasta{' '}
            <span className="font-semibold text-purple-600">10% de comisión</span>. Dos modelos de negocio, una sola plataforma.
          </p>

          {/* CTA Buttons */}
          <div className="animate-fade-in-up animation-delay-300 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:gap-4">
            <Button asChild size="lg" className="text-base font-semibold shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30 sm:px-8">
              <Link href="/register">
                Empezar Ahora Gratis
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
              <p className="relative mt-2 text-sm font-medium text-muted-foreground sm:text-base">Comisión Promedio</p>
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
              Cómo Funciona
            </h2>
            <p className="animate-fade-in-up animation-delay-100 mt-3 text-base text-muted-foreground sm:mt-4 sm:text-lg md:text-xl">
              En 3 simples pasos empieza a vender o referir propiedades
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
                <h3 className="mb-3 text-xl font-bold text-foreground transition-colors duration-300 group-hover:text-primary sm:text-2xl">Regístrate Gratis</h3>
                <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                  Crea tu cuenta en menos de 2 minutos. Elige entre venta o referidos. Sin costos ocultos.
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
                <h3 className="mb-3 text-xl font-bold text-foreground transition-colors duration-300 group-hover:text-blue-600 sm:text-2xl">Publica o Comparte</h3>
                <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                  Publica propiedades en venta o genera enlaces de referidos para propiedades vacacionales.
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
                <h3 className="mb-3 text-xl font-bold text-foreground transition-colors duration-300 group-hover:text-purple-600 sm:text-2xl">Gana Dinero</h3>
                <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                  Recibe comisiones por ventas inmobiliarias o hasta 10% por reservas vacacionales. Pagos seguros.
                </p>
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <div className="animate-fade-in-up animation-delay-500 mt-12 text-center sm:mt-16">
            <Button asChild size="lg" className="shadow-lg shadow-primary/25 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-primary/30">
              <Link href="/register">Empezar Ahora</Link>
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
              Propiedades para Vender y Referir
            </h2>
            <p className="animate-fade-in-up animation-delay-100 mx-auto max-w-2xl text-base text-muted-foreground sm:text-lg md:text-xl">
              Propiedades inmobiliarias en venta y propiedades vacacionales premium para generar comisiones
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

                    <Button
                      asChild
                      className="group/btn opacity-0 shadow-xl transition-all duration-500 group-hover:opacity-100"
                      size="lg"
                    >
                      <Link href="/propiedades/1">
                        Ver Más
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                      </Link>
                    </Button>
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

                    <Button
                      asChild
                      size="sm"
                      variant="secondary"
                      className="opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                    >
                      <Link href="/propiedades/2">
                        Ver
                      </Link>
                    </Button>
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

                    <Button
                      asChild
                      size="sm"
                      variant="secondary"
                      className="opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                    >
                      <Link href="/propiedades/3">
                        Ver
                      </Link>
                    </Button>
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

                    <Button
                      asChild
                      className="group/btn bg-white text-primary shadow-xl transition-all duration-500 hover:bg-white/90"
                      size="lg"
                    >
                      <Link href="/propiedades/4">
                        Explorar
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                      </Link>
                    </Button>
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
              La plataforma integral para vender propiedades y generar comisiones por referidos
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
                <h3 className="mb-2 text-xl font-bold text-foreground sm:text-2xl">Doble Oportunidad</h3>
                <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                  Vende propiedades inmobiliarias o gana hasta 10% por reserva vacacional. Tú decides.
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
                <h3 className="mb-2 text-xl font-bold text-foreground sm:text-2xl">Amplio Catálogo</h3>
                <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                  Propiedades en venta y destinos vacacionales. Catálogo en constante crecimiento.
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
              Elige el Plan Perfecto para Ti
            </h2>
            <p className="animate-fade-in-up animation-delay-100 mt-3 text-base text-muted-foreground sm:mt-4 sm:text-lg md:text-xl">
              Sin compromisos. Cancela cuando quieras.
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
                <h3 className="mb-2 text-2xl font-extrabold text-foreground">Free</h3>
                <p className="mb-6 text-sm text-muted-foreground">Perfecto para comenzar a vender o referir</p>

                {/* Price */}
                <div className="mb-8">
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-extrabold text-foreground">$0</span>
                    <span className="text-muted-foreground">/mes</span>
                  </div>
                </div>

                {/* Commission Badge */}
                <div className="mb-8 rounded-xl bg-gradient-to-br from-primary/10 to-blue-500/10 p-4">
                  <div className="text-center">
                    <div className="text-3xl font-extrabold text-primary">2%</div>
                    <div className="text-sm font-medium text-muted-foreground">Comisión por Referido</div>
                  </div>
                </div>

                {/* Features */}
                <ul className="mb-8 space-y-3">
                  <li className="flex items-center gap-3 text-sm">
                    <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10">
                      <Check className="h-3 w-3 text-primary" />
                    </div>
                    <span className="text-foreground">Hasta 10 referidos/mes</span>
                  </li>
                  <li className="flex items-center gap-3 text-sm">
                    <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10">
                      <Check className="h-3 w-3 text-primary" />
                    </div>
                    <span className="text-foreground">Dashboard básico</span>
                  </li>
                  <li className="flex items-center gap-3 text-sm">
                    <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10">
                      <Check className="h-3 w-3 text-primary" />
                    </div>
                    <span className="text-foreground">Pagos mensuales</span>
                  </li>
                  <li className="flex items-center gap-3 text-sm">
                    <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10">
                      <Check className="h-3 w-3 text-primary" />
                    </div>
                    <span className="text-foreground">Soporte por email</span>
                  </li>
                </ul>

                {/* CTA Button */}
                <Button asChild className="w-full transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/20" variant="outline">
                  <Link href="/register">Empezar Gratis</Link>
                </Button>
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
                <h3 className="mb-2 text-2xl font-extrabold text-foreground">Pro</h3>
                <p className="mb-6 text-sm text-muted-foreground">Para vendedores y afiliados activos</p>

                {/* Price */}
                <div className="mb-8">
                  <div className="flex items-baseline gap-2">
                    <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-5xl font-extrabold text-transparent">$15</span>
                    <span className="text-muted-foreground">/mes</span>
                  </div>
                </div>

                {/* Commission Badge */}
                <div className="mb-8 rounded-xl bg-gradient-to-br from-primary via-blue-600 to-blue-500 p-4 shadow-lg">
                  <div className="text-center">
                    <div className="text-3xl font-extrabold text-primary-foreground">5%</div>
                    <div className="text-sm font-medium text-primary-foreground/90">Comisión por Referido</div>
                  </div>
                </div>

                {/* Features */}
                <ul className="mb-8 space-y-3">
                  <li className="flex items-center gap-3 text-sm">
                    <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary">
                      <Check className="h-3 w-3 text-primary-foreground" />
                    </div>
                    <span className="font-medium text-foreground">Hasta 100 referidos/mes</span>
                  </li>
                  <li className="flex items-center gap-3 text-sm">
                    <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary">
                      <Check className="h-3 w-3 text-primary-foreground" />
                    </div>
                    <span className="font-medium text-foreground">Dashboard avanzado</span>
                  </li>
                  <li className="flex items-center gap-3 text-sm">
                    <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary">
                      <Check className="h-3 w-3 text-primary-foreground" />
                    </div>
                    <span className="font-medium text-foreground">Pagos quincenales</span>
                  </li>
                  <li className="flex items-center gap-3 text-sm">
                    <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary">
                      <Check className="h-3 w-3 text-primary-foreground" />
                    </div>
                    <span className="font-medium text-foreground">Soporte prioritario</span>
                  </li>
                  <li className="flex items-center gap-3 text-sm">
                    <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary">
                      <Check className="h-3 w-3 text-primary-foreground" />
                    </div>
                    <span className="font-medium text-foreground">Analytics en tiempo real</span>
                  </li>
                </ul>

                {/* CTA Button */}
                <Button asChild className="w-full bg-gradient-to-r from-primary to-blue-600 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-primary/30">
                  <Link href="/register">Comenzar Pro</Link>
                </Button>
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
                <h3 className="mb-2 text-2xl font-extrabold text-foreground">Elite</h3>
                <p className="mb-6 text-sm text-muted-foreground">Para profesionales inmobiliarios y afiliados de alto volumen</p>

                {/* Price */}
                <div className="mb-8">
                  <div className="flex items-baseline gap-2">
                    <span className="bg-gradient-to-r from-purple-600 to-purple-500 bg-clip-text text-5xl font-extrabold text-transparent">$30</span>
                    <span className="text-muted-foreground">/mes</span>
                  </div>
                </div>

                {/* Commission Badge */}
                <div className="mb-8 rounded-xl bg-gradient-to-br from-purple-600 to-purple-500 p-4 shadow-lg">
                  <div className="text-center">
                    <div className="text-3xl font-extrabold text-primary-foreground">10%</div>
                    <div className="text-sm font-medium text-primary-foreground/90">Comisión por Referido</div>
                  </div>
                </div>

                {/* Features */}
                <ul className="mb-8 space-y-3">
                  <li className="flex items-center gap-3 text-sm">
                    <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-purple-600">
                      <Check className="h-3 w-3 text-primary-foreground" />
                    </div>
                    <span className="font-medium text-foreground">Referidos ilimitados</span>
                  </li>
                  <li className="flex items-center gap-3 text-sm">
                    <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-purple-600">
                      <Check className="h-3 w-3 text-primary-foreground" />
                    </div>
                    <span className="font-medium text-foreground">Dashboard completo + API</span>
                  </li>
                  <li className="flex items-center gap-3 text-sm">
                    <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-purple-600">
                      <Check className="h-3 w-3 text-primary-foreground" />
                    </div>
                    <span className="font-medium text-foreground">Pagos semanales</span>
                  </li>
                  <li className="flex items-center gap-3 text-sm">
                    <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-purple-600">
                      <Check className="h-3 w-3 text-primary-foreground" />
                    </div>
                    <span className="font-medium text-foreground">Soporte 24/7 dedicado</span>
                  </li>
                  <li className="flex items-center gap-3 text-sm">
                    <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-purple-600">
                      <Check className="h-3 w-3 text-primary-foreground" />
                    </div>
                    <span className="font-medium text-foreground">Manager de cuenta personal</span>
                  </li>
                  <li className="flex items-center gap-3 text-sm">
                    <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-purple-600">
                      <Check className="h-3 w-3 text-primary-foreground" />
                    </div>
                    <span className="font-medium text-foreground">Acceso prioritario a nuevas propiedades</span>
                  </li>
                </ul>

                {/* CTA Button */}
                <Button asChild className="w-full bg-gradient-to-r from-purple-600 to-purple-500 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/30">
                  <Link href="/register">Comenzar Elite</Link>
                </Button>
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
            Empieza a Ganar Hoy Mismo
          </h2>
          <p className="animate-fade-in-up animation-delay-100 mt-4 text-base opacity-95 sm:text-lg md:text-xl lg:mt-6">
            Únete a cientos de vendedores y afiliados que ya están generando ingresos con GYDI
          </p>

          <div className="animate-fade-in-up animation-delay-200 mt-8 flex flex-col items-center justify-center gap-3 sm:mt-10 sm:flex-row sm:gap-4">
            <Button
              asChild
              size="lg"
              variant="secondary"
              className="w-full font-semibold shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl sm:w-auto sm:px-8"
            >
              <Link href="/register">Crear Cuenta Gratis</Link>
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
              <span>500+ Afiliados</span>
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
