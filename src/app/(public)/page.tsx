'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Building2, TrendingUp, Users, Shield, Zap, DollarSign, Check, MapPin, Bed, Bath, Maximize, ArrowRight, Home } from 'lucide-react';
import Image from 'next/image';
import { useTranslation } from '@/hooks/use-translation';

export default function HomePage() {
  const { t } = useTranslation('landing');

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
            <span>{t('hero.badge')}</span>
          </div>

          {/* Heading */}
          <h1 className="animate-fade-in-up animation-delay-100 mb-6 max-w-5xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl sm:leading-tight md:text-6xl md:leading-tight lg:text-7xl lg:leading-tight">
            {t('hero.heading1')}{' '}
            <span className="animate-gradient bg-gradient-to-r from-primary via-blue-600 to-purple-600 bg-clip-text text-transparent">
              {t('hero.heading2')}
            </span>
          </h1>

          {/* Subtitle */}
          <p className="animate-fade-in-up animation-delay-200 mb-10 max-w-2xl text-base text-muted-foreground sm:text-lg md:text-xl lg:max-w-3xl">
            {t('hero.subtitle')}{' '}
            <span className="font-semibold text-purple-600">{t('hero.subtitleCommission')}</span>{' '}
            {t('hero.subtitleEnd')}{' '}
            <span className="font-semibold text-blue-600">{t('hero.subtitlePower')}</span>
          </p>

          {/* CTA Buttons */}
          <div className="animate-fade-in-up animation-delay-300 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:gap-4">
            <Button asChild size="lg" className="text-base font-semibold shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30 sm:px-8">
              <Link href="/register">
                {t('hero.ctaStart')}
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-base font-semibold sm:px-8">
              <Link href="/propiedades">{t('hero.ctaProperties')}</Link>
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="mt-16 grid w-full max-w-5xl grid-cols-1 gap-4 sm:mt-20 sm:grid-cols-3 sm:gap-6 lg:gap-8">
            <div className="animate-scale-in animation-delay-400 group relative overflow-hidden rounded-2xl border border-primary/10 bg-gradient-to-br from-card to-card/50 p-6 backdrop-blur-sm transition-all hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1 sm:p-8">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              <p className="relative text-4xl font-extrabold text-primary transition-transform group-hover:scale-110 sm:text-5xl lg:text-6xl">{t('hero.stat1Value')}</p>
              <p className="relative mt-2 text-sm font-medium text-muted-foreground sm:text-base">{t('hero.stat1Label')}</p>
            </div>
            <div className="animate-scale-in animation-delay-500 group relative overflow-hidden rounded-2xl border border-blue-500/10 bg-gradient-to-br from-card to-card/50 p-6 backdrop-blur-sm transition-all hover:border-blue-500/20 hover:shadow-lg hover:shadow-blue-500/5 hover:-translate-y-1 sm:p-8">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              <p className="relative text-4xl font-extrabold text-blue-600 transition-transform group-hover:scale-110 sm:text-5xl lg:text-6xl">{t('hero.stat2Value')}</p>
              <p className="relative mt-2 text-sm font-medium text-muted-foreground sm:text-base">{t('hero.stat2Label')}</p>
            </div>
            <div className="animate-scale-in animation-delay-600 group relative overflow-hidden rounded-2xl border border-purple-500/10 bg-gradient-to-br from-card to-card/50 p-6 backdrop-blur-sm transition-all hover:border-purple-500/20 hover:shadow-lg hover:shadow-purple-500/5 hover:-translate-y-1 sm:p-8">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              <p className="relative text-4xl font-extrabold text-purple-600 transition-transform group-hover:scale-110 sm:text-5xl lg:text-6xl">{t('hero.stat3Value')}</p>
              <p className="relative mt-2 text-sm font-medium text-muted-foreground sm:text-base">{t('hero.stat3Label')}</p>
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
              {t('howItWorks.title')}
            </h2>
            <p className="animate-fade-in-up animation-delay-100 mt-3 text-base text-muted-foreground sm:mt-4 sm:text-lg md:text-xl">
              {t('howItWorks.subtitle')}
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
                <h3 className="mb-3 text-xl font-bold text-foreground transition-colors duration-300 group-hover:text-primary sm:text-2xl">{t('howItWorks.step1Title')}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {t('howItWorks.step1Desc')}
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
                <h3 className="mb-3 text-xl font-bold text-foreground transition-colors duration-300 group-hover:text-blue-600 sm:text-2xl">{t('howItWorks.step2Title')}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {t('howItWorks.step2Desc')}
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
                <h3 className="mb-3 text-xl font-bold text-foreground transition-colors duration-300 group-hover:text-purple-600 sm:text-2xl">{t('howItWorks.step3Title')}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {t('howItWorks.step3Desc')}
                </p>
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <div className="animate-fade-in-up animation-delay-500 mt-12 text-center sm:mt-16">
            <Button asChild size="lg" className="shadow-lg shadow-primary/25 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-primary/30">
              <Link href="/register">{t('howItWorks.cta')}</Link>
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
              <span>{t('properties.badge')}</span>
            </div>
            <h2 className="animate-fade-in-up mb-4 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl md:text-5xl lg:text-6xl">
              {t('properties.title')}
            </h2>
            <p className="animate-fade-in-up animation-delay-100 mx-auto max-w-2xl text-base text-muted-foreground sm:text-lg md:text-xl">
              {t('properties.subtitle')}
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
                    {t('properties.villa')}
                  </h3>

                  <div className="mb-4 flex items-center gap-4 text-white/80">
                    <div className="flex items-center gap-1.5">
                      <Bed className="h-4 w-4" />
                      <span className="text-sm">4 {t('properties.bedrooms')}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Bath className="h-4 w-4" />
                      <span className="text-sm">3 {t('properties.bathrooms')}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Maximize className="h-4 w-4" />
                      <span className="text-sm">250m²</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-3xl font-extrabold text-white">$450</div>
                      <div className="text-sm text-white/70">{t('properties.perNight')}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Badge */}
              <div className="absolute right-6 top-6 rounded-full bg-gradient-to-r from-primary to-blue-600 px-4 py-2 text-xs font-bold text-primary-foreground shadow-lg backdrop-blur-sm">
                {t('properties.badgePopular')}
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
                    {t('properties.apartment')}
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
                      <div className="text-xs text-white/70">{t('properties.perNight')}</div>
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
                    {t('properties.farmhouse')}
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
                      <div className="text-xs text-white/70">{t('properties.perNight')}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute right-4 top-4 rounded-full bg-purple-600 px-3 py-1 text-xs font-bold text-white shadow-lg">
                {t('properties.badgeNew')}
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
                    {t('properties.penthouse')}
                  </h3>

                  <p className="mb-4 text-sm text-white/80 sm:text-base">
                    {t('properties.penthouseDesc')}
                  </p>

                  <div className="mb-6 flex items-center gap-6 text-white/80">
                    <div className="flex items-center gap-1.5">
                      <Bed className="h-4 w-4" />
                      <span className="text-sm">5 {t('properties.bedrooms')}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Bath className="h-4 w-4" />
                      <span className="text-sm">4 {t('properties.bathrooms')}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Maximize className="h-4 w-4" />
                      <span className="text-sm">380m²</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div>
                      <div className="text-4xl font-extrabold text-white">$850</div>
                      <div className="text-sm text-white/70">{t('properties.perNight')}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute right-6 top-6 rounded-full bg-gradient-to-r from-blue-600 to-blue-500 px-4 py-2 text-xs font-bold text-white shadow-lg backdrop-blur-sm">
                {t('properties.badgePremium')}
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
                {t('properties.viewAll')}
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
              {t('features.title')}
            </h2>
            <p className="animate-fade-in-up animation-delay-100 mt-3 text-base text-muted-foreground sm:mt-4 sm:text-lg md:text-xl">
              {t('features.subtitle')}
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
                <h3 className="mb-2 text-xl font-bold text-foreground sm:text-2xl">{t('features.f1Title')}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {t('features.f1Desc')}
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
                <h3 className="mb-2 text-xl font-bold text-foreground sm:text-2xl">{t('features.f2Title')}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {t('features.f2Desc')}
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
                <h3 className="mb-2 text-xl font-bold text-foreground sm:text-2xl">{t('features.f3Title')}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {t('features.f3Desc')}
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
                <h3 className="mb-2 text-xl font-bold text-foreground sm:text-2xl">{t('features.f4Title')}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {t('features.f4Desc')}
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
                <h3 className="mb-2 text-xl font-bold text-foreground sm:text-2xl">{t('features.f5Title')}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {t('features.f5Desc')}
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
                <h3 className="mb-2 text-xl font-bold text-foreground sm:text-2xl">{t('features.f6Title')}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {t('features.f6Desc')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Referidos Section */}
      <section className="border-t bg-gradient-to-b from-green-50/30 to-white py-16 sm:py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
              {/* Left: Copy */}
              <div>
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-4 py-1.5 text-sm font-medium text-green-700">
                  <TrendingUp className="h-4 w-4" />
                  <span>{t('affiliates.badge')}</span>
                </div>
                <h2 className="mb-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
                  {t('affiliates.title')}{' '}
                  <span className="text-green-600">{t('affiliates.titleHighlight')}</span>
                </h2>
                <p className="mb-8 text-lg text-muted-foreground">
                  {t('affiliates.desc')}
                </p>

                <div className="mb-8 space-y-5">
                  <div className="flex items-start gap-4">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green-100">
                      <Check className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{t('affiliates.check1Title')}</p>
                      <p className="text-sm text-muted-foreground">
                        {t('affiliates.check1Desc')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green-100">
                      <Check className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{t('affiliates.check2Title')}</p>
                      <p className="text-sm text-muted-foreground">
                        {t('affiliates.check2Desc')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green-100">
                      <Check className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{t('affiliates.check3Title')}</p>
                      <p className="text-sm text-muted-foreground">
                        {t('affiliates.check3Desc')}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button asChild size="lg">
                    <Link href="/register">{t('affiliates.cta')}</Link>
                  </Button>
                </div>
              </div>

              {/* Right: Earnings visualization */}
              <div className="space-y-4">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  {t('affiliates.earningsLabel')}
                </p>

                {/* 4-6% earnings card */}
                <div className="rounded-2xl border-2 border-green-200 bg-gradient-to-br from-green-50/60 to-white p-5 shadow-sm">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-foreground">{t('affiliates.planFree')}</p>
                      <p className="text-sm text-muted-foreground">{t('affiliates.planFreePrice')}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-extrabold text-green-600">4-6%</p>
                      <p className="text-xs font-medium text-green-700">{t('affiliates.perBooking')}</p>
                    </div>
                  </div>

                  {/* Earnings examples table */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between rounded-lg bg-green-100/60 px-3 py-2 text-sm">
                      <span className="text-green-800">{t('affiliates.booking500')}</span>
                      <span className="font-bold text-green-700">{t('affiliates.youEarn500')}</span>
                    </div>
                    <div className="flex items-center justify-between rounded-lg bg-green-100/60 px-3 py-2 text-sm">
                      <span className="text-green-800">{t('affiliates.booking1000')}</span>
                      <span className="font-bold text-green-700">{t('affiliates.youEarn1000')}</span>
                    </div>
                    <div className="flex items-center justify-between rounded-lg bg-green-100/60 px-3 py-2 text-sm">
                      <span className="text-green-800">{t('affiliates.booking10x')}</span>
                      <span className="font-bold text-green-700">{t('affiliates.youEarn10x')}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-2 rounded-xl border border-green-100 bg-green-50/70 p-3 text-xs text-green-800">
                  <span>💡</span>
                  <span>
                    {t('affiliates.tip')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Para Anfitriones Section */}
      <section className="border-t bg-gradient-to-b from-orange-50/30 to-white py-16 sm:py-20 md:py-24 lg:py-28">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Left: Content */}
            <div className="flex flex-col gap-6">
              {/* Badge */}
              <div className="inline-flex w-fit items-center gap-2 rounded-full bg-orange-100 px-4 py-2 text-sm font-semibold text-orange-700">
                <Home className="h-4 w-4" />
                {t('hosts.badge')}
              </div>

              <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl md:text-5xl">
                {t('hosts.title')}{' '}
                <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
                  {t('hosts.titleHighlight')}
                </span>
              </h2>

              <p className="text-base text-muted-foreground sm:text-lg">
                {t('hosts.desc')}
              </p>

              <ul className="flex flex-col gap-3">
                {[
                  { icon: '🤝', title: t('hosts.item1Title'), desc: t('hosts.item1Desc') },
                  { icon: '💰', title: t('hosts.item2Title'), desc: t('hosts.item2Desc') },
                  { icon: '🚀', title: t('hosts.item3Title'), desc: t('hosts.item3Desc') },
                ].map((item) => (
                  <li key={item.title} className="flex items-start gap-3 rounded-xl bg-orange-50/60 p-4">
                    <span className="text-xl">{item.icon}</span>
                    <div>
                      <p className="font-semibold text-foreground">{item.title}</p>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <a
                  href="/register"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-500/25 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-orange-500/30 sm:w-auto"
                >
                  {t('hosts.cta')}
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </div>

            {/* Right: Visual — fee split */}
            <div className="flex flex-col gap-6">
              <div className="overflow-hidden rounded-2xl border border-orange-100 bg-white shadow-xl shadow-orange-500/10">
                {/* Header */}
                <div className="bg-gradient-to-r from-orange-500 to-amber-500 px-6 py-4">
                  <p className="text-sm font-semibold text-white/90">{t('hosts.exampleTitle')}</p>
                  <p className="mt-1 text-2xl font-extrabold text-white">{t('hosts.exampleQuestion')}</p>
                </div>

                {/* Split bar */}
                <div className="px-6 py-5">
                  <div className="flex h-10 overflow-hidden rounded-full">
                    <div
                      className="flex items-center justify-center bg-gradient-to-r from-emerald-400 to-green-500 text-xs font-bold text-white"
                      style={{ width: '85%' }}
                    >
                      85%
                    </div>
                    <div
                      className="flex items-center justify-center bg-orange-200 text-xs font-semibold text-orange-700"
                      style={{ width: '15%' }}
                    >
                      15%
                    </div>
                  </div>
                  <div className="mt-3 flex justify-between text-xs text-muted-foreground">
                    <span className="font-medium text-emerald-600">{t('hosts.youReceive')}: $425</span>
                    <span className="font-medium text-orange-500">{t('hosts.platformFee')}: $75</span>
                  </div>
                </div>

                {/* Breakdown */}
                <div className="space-y-3 border-t border-orange-50 px-6 pb-6 pt-4">
                  <div className="flex items-center justify-between rounded-lg bg-emerald-50 px-4 py-3">
                    <span className="text-sm font-medium text-emerald-800">{t('hosts.youReceive')}</span>
                    <span className="text-lg font-extrabold text-emerald-700">$425 <span className="text-sm font-normal">(85%)</span></span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-orange-50 px-4 py-3">
                    <span className="text-sm font-medium text-orange-800">{t('hosts.platformFee')}</span>
                    <span className="text-base font-bold text-orange-600">$75 <span className="text-sm font-normal">(15%)</span></span>
                  </div>
                </div>

                {/* Callout */}
                <div className="flex items-start gap-2 border-t border-orange-50 bg-orange-50/60 px-6 py-4 text-xs text-orange-800">
                  <span>💡</span>
                  <span>
                    {t('hosts.tip')}
                  </span>
                </div>
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
            {t('cta.title')}
          </h2>
          <p className="animate-fade-in-up animation-delay-100 mt-4 text-base opacity-95 sm:text-lg md:text-xl lg:mt-6">
            {t('cta.subtitle')}
          </p>

          <div className="animate-fade-in-up animation-delay-200 mt-8 flex flex-col items-center justify-center gap-3 sm:mt-10 sm:flex-row sm:gap-4">
            <Button
              asChild
              size="lg"
              variant="secondary"
              className="w-full font-semibold shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl sm:w-auto sm:px-8"
            >
              <Link href="/register">{t('cta.createAccount')}</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="secondary"
              className="w-full border-2 border-primary-foreground/80 font-semibold text-primary-foreground transition-all duration-300 hover:scale-105 hover:border-primary-foreground hover:bg-primary-foreground/10 sm:w-auto sm:px-8"
            >
              <Link href="/propiedades">{t('cta.exploreProperties')}</Link>
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="animate-fade-in-up animation-delay-300 mt-12 flex flex-wrap items-center justify-center gap-6 text-sm opacity-90 sm:mt-16 sm:gap-12 sm:text-base">
            <div className="group flex items-center gap-2 transition-all duration-300 hover:scale-110">
              <Shield className="h-5 w-5 transition-transform duration-300 group-hover:rotate-12" />
              <span>{t('cta.secure')}</span>
            </div>
            <div className="group flex items-center gap-2 transition-all duration-300 hover:scale-110">
              <Users className="h-5 w-5 transition-transform duration-300 group-hover:rotate-12" />
              <span>{t('cta.activeAffiliates')}</span>
            </div>
            <div className="group flex items-center gap-2 transition-all duration-300 hover:scale-110">
              <DollarSign className="h-5 w-5 transition-transform duration-300 group-hover:rotate-12" />
              <span>{t('cta.noHiddenFees')}</span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
