'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Building2, Users, Target, Award, TrendingUp, Globe, Shield, Heart } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';

export default function AboutPage() {
  const { t } = useTranslation('about');

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50/50 to-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b bg-gradient-to-br from-primary/5 via-blue-500/5 to-purple-500/5 py-16 sm:py-20 md:py-24">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:64px_64px]" />

        <div className="container relative mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <div className="animate-fade-in-down mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary backdrop-blur-sm">
              <Building2 className="h-4 w-4" />
              <span>{t('hero.badge')}</span>
            </div>

            <h1 className="animate-fade-in-up mb-6">
              {t('hero.title1')}{' '}
              <span className="bg-gradient-to-r from-primary via-blue-600 to-purple-600 bg-clip-text text-transparent">
                {t('hero.titleHighlight')}
              </span>
            </h1>

            <p className="animate-fade-in-up animation-delay-100 text-lg text-muted-foreground">
              {t('hero.subtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 sm:py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <div className="mb-12 text-center">
              <h2 className="mb-4">{t('story.title')}</h2>
              <div className="mx-auto h-1 w-24 rounded-full bg-gradient-to-r from-primary via-blue-600 to-purple-600" />
            </div>

            <div className="space-y-6 text-lg leading-relaxed text-muted-foreground">
              <p>
                {t('story.p1')} <span className="font-semibold text-foreground">{t('story.p1Bold')}</span>{' '}
                {t('story.p1End')}
              </p>

              <p>
                {t('story.p2Start')}{' '}
                <span className="font-semibold text-foreground">{t('story.p2Bold')}</span>
              </p>

              <p>
                {t('story.p3Start')} <span className="font-semibold text-primary">{t('story.p3Main')}</span>{' '}
                {t('story.p3Middle')}{' '}
                <span className="font-semibold text-blue-600">{t('story.p3Affiliates')}</span>{' '}
                {t('story.p3End1')}{' '}
                <span className="font-semibold text-purple-600">{t('story.p3Properties')}</span>
                {t('story.p3End2')}
              </p>

              <p>
                {t('story.p4Start')} <span className="font-semibold text-foreground">{t('story.p4Bold')}</span>{' '}
                {t('story.p4End')}
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
              <h3 className="mb-4">{t('mission.title')}</h3>
              <p className="leading-relaxed text-muted-foreground">
                {t('mission.text')}
              </p>
            </div>

            {/* Vision */}
            <div className="group rounded-3xl border border-border/50 bg-card p-8 transition-all duration-300 hover:border-blue-500/50 hover:shadow-xl hover:-translate-y-1">
              <div className="mb-6 inline-flex rounded-2xl bg-blue-500/10 p-4 transition-all duration-300 group-hover:scale-110">
                <Globe className="h-10 w-10 text-blue-600" />
              </div>
              <h3 className="mb-4">{t('vision.title')}</h3>
              <p className="leading-relaxed text-muted-foreground">
                {t('vision.text')}
              </p>
            </div>

            {/* Values */}
            <div className="group rounded-3xl border border-border/50 bg-card p-8 transition-all duration-300 hover:border-purple-500/50 hover:shadow-xl hover:-translate-y-1">
              <div className="mb-6 inline-flex rounded-2xl bg-purple-500/10 p-4 transition-all duration-300 group-hover:scale-110">
                <Heart className="h-10 w-10 text-purple-600" />
              </div>
              <h3 className="mb-4">{t('values.title')}</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-purple-600" />
                  <span>{t('values.v1')}</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-purple-600" />
                  <span>{t('values.v2')}</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-purple-600" />
                  <span>{t('values.v3')}</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-purple-600" />
                  <span>{t('values.v4')}</span>
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
            <h2 className="mb-4">{t('why.title')}</h2>
            <p className="text-lg text-muted-foreground">
              {t('why.subtitle')}
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {/* Feature 1 */}
            <div className="rounded-2xl border border-border/50 bg-card p-6 transition-all duration-300 hover:shadow-lg">
              <div className="mb-4 inline-flex rounded-xl bg-primary/10 p-3">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h4 className="mb-2">{t('why.f1Title')}</h4>
              <p className="text-sm text-muted-foreground">
                {t('why.f1Desc')}
              </p>
            </div>

            {/* Feature 2 */}
            <div className="rounded-2xl border border-border/50 bg-card p-6 transition-all duration-300 hover:shadow-lg">
              <div className="mb-4 inline-flex rounded-xl bg-blue-500/10 p-3">
                <TrendingUp className="h-8 w-8 text-blue-600" />
              </div>
              <h4 className="mb-2">{t('why.f2Title')}</h4>
              <p className="text-sm text-muted-foreground">
                {t('why.f2Desc')}
              </p>
            </div>

            {/* Feature 3 */}
            <div className="rounded-2xl border border-border/50 bg-card p-6 transition-all duration-300 hover:shadow-lg">
              <div className="mb-4 inline-flex rounded-xl bg-purple-500/10 p-3">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
              <h4 className="mb-2">{t('why.f3Title')}</h4>
              <p className="text-sm text-muted-foreground">
                {t('why.f3Desc')}
              </p>
            </div>

            {/* Feature 4 */}
            <div className="rounded-2xl border border-border/50 bg-card p-6 transition-all duration-300 hover:shadow-lg">
              <div className="mb-4 inline-flex rounded-xl bg-orange-500/10 p-3">
                <Award className="h-8 w-8 text-orange-600" />
              </div>
              <h4 className="mb-2">{t('why.f4Title')}</h4>
              <p className="text-sm text-muted-foreground">
                {t('why.f4Desc')}
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
              <div className="text-sm opacity-90">{t('stats.affiliates')}</div>
            </div>
            <div className="text-center">
              <div className="mb-2 text-5xl font-extrabold">1,200+</div>
              <div className="text-sm opacity-90">{t('stats.properties')}</div>
            </div>
            <div className="text-center">
              <div className="mb-2 text-5xl font-extrabold">$2M+</div>
              <div className="text-sm opacity-90">{t('stats.commissions')}</div>
            </div>
            <div className="text-center">
              <div className="mb-2 text-5xl font-extrabold">30+</div>
              <div className="text-sm opacity-90">{t('stats.countries')}</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4">
            {t('cta.title')}
          </h2>
          <p className="mb-8 text-lg text-muted-foreground">
            {t('cta.subtitle')}
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link href="/register">{t('cta.register')}</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
              <Link href="/contact">{t('cta.contact')}</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
