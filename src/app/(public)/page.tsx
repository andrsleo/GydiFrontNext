'use client';

import Link from 'next/link';
import { useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Building2,
  TrendingUp,
  Users,
  Shield,
  Zap,
  DollarSign,
  Check,
  MapPin,
  Bed,
  Bath,
  Maximize,
  ArrowRight,
  Home,
  Star,
  Globe,
  Sparkles,
  ChevronDown,
  Video,
  Smartphone,
  Clapperboard,
  Film,
} from 'lucide-react';
import Image from 'next/image';
import { useTranslation } from '@/hooks/use-translation';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import {
  FadeIn,
  Stagger,
  StaggerItem,
  ParallaxLayer,
  RevealText,
  MagneticButton,
  CountUp,
  HorizontalScroll,
  HorizontalPanel,
  GYDI_SPRING,
} from '@/lib/motion';

export default function HomePage() {
  const { t } = useTranslation('landing');

  // ── Hero scroll-driven parallax ──────────────────────────
  const heroRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const videoBgScale  = useTransform(heroScroll, [0, 1], shouldReduceMotion ? [1, 1]       : [1, 1.08]);
  const heroContentY  = useTransform(heroScroll, [0, 1], shouldReduceMotion ? ['0%', '0%'] : ['0%', '22%']);
  const heroOpacity   = useTransform(heroScroll, [0, 0.7, 1], [1, 0.9, 0]);
  const card1Y        = useTransform(heroScroll, [0, 1], shouldReduceMotion ? [0, 0] : [0, -40]);
  const card2Y        = useTransform(heroScroll, [0, 1], shouldReduceMotion ? [0, 0] : [0, -70]);
  const card3Y        = useTransform(heroScroll, [0, 1], shouldReduceMotion ? [0, 0] : [0, -25]);

  // Pause video when hero leaves the viewport (performance)
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) { video.play().catch(() => {}); }
        else { video.pause(); }
      },
      { threshold: 0.1 }
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* ══════════════════════════════════════════════════
          HERO — Video background + 3D floating cards
      ══════════════════════════════════════════════════ */}
      <section
        ref={heroRef}
        data-testid="hero-section"
        className="relative h-screen overflow-hidden bg-gydi-ink"
      >
        {/* Video background — zooms slowly as section scrolls */}
        <motion.div
          className="absolute inset-0 origin-center"
          style={{ scale: videoBgScale }}
        >
          <video
            ref={videoRef}
            data-testid="hero-video"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            className="absolute inset-0 h-full w-full object-cover opacity-40"
          >
            <source src="/videos/hero-forest.mp4" type="video/mp4" />
          </video>
        </motion.div>

        {/* Gradient overlays */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-gydi-ink/40 via-transparent to-gydi-ink" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-gydi-ink/30 via-transparent to-gydi-ink/20" />

        {/* Ambient orbs */}
        <div className="pointer-events-none absolute inset-0">
          <ParallaxLayer speed={0.12} className="h-full w-full">
            <div className="absolute right-1/4 top-1/4 h-[440px] w-[440px] rounded-full bg-gydi-primary/18 blur-[130px]" />
            <div className="absolute bottom-1/3 left-1/4 h-80 w-80 rounded-full bg-gydi-teal/14 blur-[110px]" />
          </ParallaxLayer>
        </div>

        {/* Floating 3D glassmorphism cards — desktop only */}
        {/* Card 1: Properties stat */}
        <motion.div
          className="glass-dark hidden lg:flex absolute top-1/3 right-[8%] z-10 items-center gap-3 rounded-2xl border border-gydi-primary/30 px-5 py-3"
          style={{ y: card1Y, rotateY: -8, rotateX: 3 }}
        >
          <Building2 className="h-5 w-5 shrink-0 text-gydi-primary" />
          <div>
            <p className="text-lg font-display font-extrabold leading-none text-white">2,800+</p>
            <p className="mt-0.5 text-xs text-white/50">{t('hero.stat1Label')}</p>
          </div>
        </motion.div>

        {/* Card 2: Commission */}
        <motion.div
          className="glass-dark hidden lg:flex absolute top-1/2 left-[6%] z-10 items-center gap-3 rounded-2xl border border-gydi-gold/30 px-5 py-3"
          style={{ y: card2Y, rotateY: 10, rotateX: -4 }}
        >
          <DollarSign className="h-5 w-5 shrink-0 text-gydi-gold" />
          <div>
            <p className="text-lg font-display font-extrabold leading-none text-white">10%</p>
            <p className="mt-0.5 text-xs text-white/50">{t('hero.stat2Label')}</p>
          </div>
        </motion.div>

        {/* Card 3: Creator Stay */}
        <motion.div
          className="glass-dark hidden lg:flex absolute bottom-1/3 right-[15%] z-10 items-center gap-3 rounded-2xl border border-gydi-teal/30 px-5 py-3"
          style={{ y: card3Y, rotateY: -5, rotateX: 5 }}
        >
          <Video className="h-5 w-5 shrink-0 text-gydi-teal" />
          <div>
            <p className="text-sm font-bold leading-none text-white">{t('creators.creatorStayTitle')}</p>
            <p className="mt-0.5 text-xs text-white/50">{t('creators.creatorStaySubtitle')}</p>
          </div>
        </motion.div>

        {/* Content — scroll parallax + fade */}
        <motion.div
          className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center"
          style={{ y: heroContentY, opacity: heroOpacity }}
        >
          <FadeIn direction="down" delay={0}>
            <div className="glass mb-8 inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold text-gydi-primary">
              <Sparkles className="h-4 w-4" />
              <span>{t('hero.badge')}</span>
            </div>
          </FadeIn>

          <div className="mb-8 w-full max-w-6xl">
            <FadeIn delay={0.15}>
              <h1 className="text-fluid-hero font-display font-extrabold leading-[0.95] tracking-[-0.04em] text-white">
                {t('hero.heading1')}
              </h1>
            </FadeIn>
            <FadeIn delay={0.28}>
              <h1 className="text-fluid-hero font-display font-extrabold leading-[0.95] tracking-[-0.04em] text-gradient-animate">
                {t('hero.heading2')}
              </h1>
            </FadeIn>
          </div>

          <FadeIn delay={0.42} className="mb-10 max-w-2xl">
            <p className="text-base text-white/55 sm:text-lg md:text-xl">
              {t('hero.subtitle')}{' '}
              <span className="font-semibold text-white/85">{t('hero.subtitleCommission')}</span>
              {' '}{t('hero.subtitleEnd')}{' '}
              <span className="font-semibold text-gydi-teal">{t('hero.subtitlePower')}</span>
            </p>
          </FadeIn>

          <FadeIn
            delay={0.54}
            className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:gap-4"
          >
            <MagneticButton>
              <Button
                asChild
                size="lg"
                className="micro-glow bg-gradient-to-r from-[hsl(252,100%,64%)] to-[hsl(177,100%,42%)] text-base font-semibold shadow-xl shadow-gydi-primary/30 sm:px-10"
              >
                <Link href="/register">{t('hero.ctaStart')}</Link>
              </Button>
            </MagneticButton>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-white/20 text-base font-semibold text-white hover:border-white/40 hover:bg-white/8 sm:px-10"
            >
              <Link href="/propiedades">{t('hero.ctaProperties')}</Link>
            </Button>
          </FadeIn>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 flex flex-col items-center gap-2 text-white/35"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          style={{ opacity: heroOpacity }}
        >
          <span className="text-[10px] font-semibold uppercase tracking-[0.25em]">Scroll</span>
          <ChevronDown className="h-5 w-5" />
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════════════
          STATS RIBBON — Dark, compact
      ══════════════════════════════════════════════════ */}
      <section className="relative z-10 border-b border-white/8 bg-gydi-ink py-12 sm:py-16">
        <div className="container mx-auto px-4">
          <Stagger
            className="grid grid-cols-1 gap-10 sm:grid-cols-3 sm:gap-6"
            staggerDelay={0.12}
          >
            {[
              { to: 2800, suffix: '+', label: t('hero.stat1Label'), color: 'text-gydi-primary' },
              { to: 10,   suffix: '%', label: t('hero.stat2Label'), color: 'text-gydi-teal'    },
              { to: 47,   suffix: '',  label: t('hero.stat3Label'), color: 'text-gydi-gold'    },
            ].map(({ to, suffix, label, color }) => (
              <StaggerItem key={label}>
                <div className="text-center">
                  <p className={`text-6xl font-display font-extrabold ${color} sm:text-7xl`}>
                    <CountUp to={to} suffix={suffix} duration={2} />
                  </p>
                  <p className="mt-3 text-sm font-medium text-white/45 sm:text-base">{label}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          UGC CREATORS — Bento grid, Creator Stay featured
      ══════════════════════════════════════════════════ */}
      <section
        data-testid="creators-section"
        className="relative overflow-hidden bg-gydi-ink mesh-bg py-16 sm:py-20 md:py-24 lg:py-32"
      >
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-12 text-center sm:mb-16">
            <FadeIn direction="down">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-gydi-teal/20 bg-gydi-teal/10 px-4 py-1.5 text-sm font-semibold text-gydi-teal">
                <Sparkles className="h-4 w-4" />
                <span>{t('creators.badge')}</span>
              </div>
            </FadeIn>
            <FadeIn>
              <h2 className="mb-4 text-fluid-h2 font-display font-extrabold tracking-tight text-white">
                {t('creators.title')}
              </h2>
            </FadeIn>
            <FadeIn delay={0.1}>
              <p className="mx-auto max-w-2xl text-base text-white/55 sm:text-lg">
                {t('creators.subtitle')}
              </p>
            </FadeIn>
          </div>

          {/* Bento grid — Creator Stay large left, Affiliate + UGC Indie right */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:grid-rows-2 sm:gap-6 lg:gap-8">

            {/* Creator Stay — featured, spans 2 cols × 2 rows */}
            <FadeIn direction="left" className="md:col-span-2 md:row-span-2">
              <motion.div
                data-testid="creator-stay-card"
                className="group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-3xl border border-gydi-teal/30 bg-gradient-to-br from-gydi-teal/20 via-gydi-teal/5 to-transparent p-8 sm:p-10"
                style={{ transformPerspective: 1200 }}
                whileHover={{ scale: 1.02, rotateY: 1.5, rotateX: -0.8 }}
                transition={GYDI_SPRING}
              >
                {/* Popular badge */}
                <div className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-gydi-teal/30 bg-gydi-teal/15 px-3 py-1.5 text-xs font-semibold text-gydi-teal">
                  <Star className="h-3 w-3" />
                  <span>{t('creators.creatorStayBadge')}</span>
                </div>
                {/* Icon */}
                <div className="mb-5 inline-flex rounded-2xl bg-gydi-teal/20 p-4">
                  <Clapperboard className="h-8 w-8 text-gydi-teal" />
                </div>
                {/* Title + subtitle */}
                <h3 className="mb-2 font-display text-3xl font-extrabold text-white sm:text-4xl lg:text-5xl">
                  {t('creators.creatorStayTitle')}
                </h3>
                <p className="mb-5 text-base font-semibold text-gydi-teal">
                  {t('creators.creatorStaySubtitle')}
                </p>
                {/* Description */}
                <p className="mb-8 max-w-md text-base leading-relaxed text-white/55 sm:text-lg">
                  {t('creators.creatorStayDesc')}
                </p>
                {/* Deal mockup */}
                <div className="glass-dark mt-auto inline-flex flex-wrap items-center gap-3 rounded-2xl border border-gydi-teal/20 px-5 py-3 text-sm">
                  <Home className="h-4 w-4 text-white/60" />
                  <span className="font-semibold text-white">{t('creators.creatorStayDealNights')}</span>
                  <span className="text-white/30">×</span>
                  <Film className="h-4 w-4 text-white/60" />
                  <span className="font-semibold text-white">{t('creators.creatorStayDealContent')}</span>
                  <span className="text-white/30">=</span>
                  <Check className="h-4 w-4 text-gydi-teal" />
                  <span className="font-bold text-gydi-teal">Deal</span>
                </div>
              </motion.div>
            </FadeIn>

            {/* Affiliate card */}
            <FadeIn direction="right" delay={0.1} className="md:col-span-1 md:row-span-1">
              <motion.div
                data-testid="affiliate-card"
                className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-3xl border border-gydi-primary/30 bg-gradient-to-br from-gydi-primary/20 via-gydi-primary/5 to-transparent p-6 sm:p-8"
                whileHover={{ y: -6 }}
                transition={GYDI_SPRING}
              >
                <div className="mb-4 inline-flex rounded-2xl bg-gydi-primary/20 p-3">
                  <DollarSign className="h-7 w-7 text-gydi-primary" />
                </div>
                <h3 className="mb-2 font-display text-2xl font-extrabold text-white">
                  {t('creators.affiliateTitle')}
                </h3>
                <p className="mb-5 text-sm leading-relaxed text-white/55">
                  {t('creators.affiliateDesc')}
                </p>
                <div className="mt-auto">
                  <CountUp
                    to={10}
                    suffix="%"
                    duration={2}
                    className="text-3xl font-display font-extrabold text-gydi-primary"
                  />
                  <span className="ml-2 text-xs text-white/40">{t('affiliates.earningsLabel')}</span>
                </div>
              </motion.div>
            </FadeIn>

            {/* UGC Indie card */}
            <FadeIn direction="right" delay={0.2} className="md:col-span-1 md:row-span-1">
              <motion.div
                data-testid="ugc-indie-card"
                className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-3xl border border-gydi-gold/30 bg-gradient-to-br from-gydi-gold/20 via-gydi-gold/5 to-transparent p-6 sm:p-8"
                whileHover={{ y: -6 }}
                transition={GYDI_SPRING}
              >
                <div className="mb-4 inline-flex rounded-2xl bg-gydi-gold/20 p-3">
                  <Smartphone className="h-7 w-7 text-gydi-gold" />
                </div>
                <h3 className="mb-2 font-display text-2xl font-extrabold text-white">
                  {t('creators.ugcIndieTitle')}
                </h3>
                <p className="text-sm leading-relaxed text-white/55">
                  {t('creators.ugcIndieDesc')}
                </p>
              </motion.div>
            </FadeIn>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          HOW IT WORKS — Horizontal pinned scroll (300vh)
      ══════════════════════════════════════════════════ */}
      <HorizontalScroll panelCount={3}>

        {/* ── Panel 1 · Get your link ── */}
        <HorizontalPanel className="mesh-bg flex items-center">
          <div className="container mx-auto grid h-full w-full grid-cols-1 items-center gap-8 px-6 sm:px-12 lg:grid-cols-2 lg:gap-0 lg:px-20">
            <FadeIn direction="left" delay={0.1}>
              <div className="text-white">
                <span className="mb-2 block select-none font-display text-[6rem] font-extrabold leading-none text-white/8 sm:text-[9rem]">
                  01
                </span>
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-gydi-primary/35 bg-gydi-primary/12 px-4 py-1.5 text-sm font-semibold text-gydi-primary">
                  <Globe className="h-4 w-4" />
                  <span>{t('howItWorks.badge')}</span>
                </div>
                <h2 className="mt-1 font-display text-4xl font-extrabold leading-[1.02] tracking-tight text-white sm:text-5xl lg:text-6xl">
                  {t('howItWorks.step1Title')}
                </h2>
                <p className="mt-5 max-w-md text-base leading-relaxed text-white/55 sm:text-lg">
                  {t('howItWorks.step1Desc')}
                </p>
              </div>
            </FadeIn>

            <FadeIn direction="right" delay={0.22}>
              <div className="flex items-center justify-center">
                {/* Link card mockup */}
                <div className="glass-dark relative w-[260px] overflow-hidden rounded-[2rem] border border-white/12 sm:w-[300px]">
                  <div className="bg-gradient-to-b from-gydi-primary/25 to-transparent p-7">
                    <div className="mb-5 flex items-center gap-3">
                      <div className="clay-primary flex h-10 w-10 items-center justify-center rounded-2xl text-lg">🔗</div>
                      <div>
                        <div className="h-2.5 w-24 rounded-full bg-white/25" />
                        <div className="mt-1.5 h-2 w-16 rounded-full bg-white/15" />
                      </div>
                    </div>
                    <div className="rounded-xl border border-gydi-primary/30 bg-gydi-primary/15 p-3">
                      <div className="mb-2 h-2 w-3/4 rounded-full bg-white/30" />
                      <div className="flex items-center gap-2 rounded-lg bg-white/8 px-3 py-2">
                        <div className="h-2 w-2 rounded-full bg-gydi-teal" />
                        <div className="h-2 w-32 rounded-full bg-white/35" />
                      </div>
                    </div>
                    <div className="mt-4 flex items-center justify-between text-xs text-white/45">
                      <span>gydi.com/ref/</span>
                      <span className="font-bold text-gydi-primary">tu-link ↗</span>
                    </div>
                  </div>
                  <div className="border-t border-white/10 px-6 py-4">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-white/45">Clics hoy</span>
                      <span className="font-bold text-gydi-teal">+24 ↑</span>
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </HorizontalPanel>

        {/* ── Panel 2 · Share properties ── */}
        <HorizontalPanel className="flex items-center bg-[hsl(246,30%,8%)]">
          <div className="container mx-auto grid h-full w-full grid-cols-1 items-center gap-8 px-6 sm:px-12 lg:grid-cols-2 lg:gap-0 lg:px-20">
            <FadeIn direction="left" delay={0.1}>
              <div className="text-white">
                <span className="mb-2 block select-none font-display text-[6rem] font-extrabold leading-none text-white/8 sm:text-[9rem]">
                  02
                </span>
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-gydi-teal/35 bg-gydi-teal/12 px-4 py-1.5 text-sm font-semibold text-gydi-teal">
                  <Building2 className="h-4 w-4" />
                  <span>{t('howItWorks.step2Title')}</span>
                </div>
                <h2 className="mt-1 font-display text-4xl font-extrabold leading-[1.02] tracking-tight text-white sm:text-5xl lg:text-6xl">
                  {t('howItWorks.step2Title')}
                </h2>
                <p className="mt-5 max-w-md text-base leading-relaxed text-white/55 sm:text-lg">
                  {t('howItWorks.step2Desc')}
                </p>
              </div>
            </FadeIn>

            <FadeIn direction="right" delay={0.22}>
              <div className="flex items-center justify-center gap-5">
                {[
                  {
                    img: 'photo-1613490493576-7fde63acd811',
                    loc: 'Bali',
                    price: '$450',
                    offset: '',
                    color: 'border-gydi-primary/35',
                  },
                  {
                    img: 'photo-1512917774080-9991f1c4c750',
                    loc: 'Toscana',
                    price: '$280',
                    offset: 'translate-y-8',
                    color: 'border-gydi-teal/35',
                  },
                ].map((card, i) => (
                  <div
                    key={i}
                    className={`glass-dark relative w-40 overflow-hidden rounded-2xl border ${card.color} sm:w-48 ${card.offset}`}
                  >
                    <div className="relative aspect-[3/4]">
                      <Image
                        src={`https://images.unsplash.com/${card.img}?w=400&q=80`}
                        alt={card.loc}
                        fill
                        className="object-cover opacity-65"
                        sizes="192px"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                      <div className="absolute bottom-0 p-3">
                        <div className="mb-1 flex items-center gap-1 text-white/60 text-[10px]">
                          <MapPin className="h-2.5 w-2.5" />
                          <span>{card.loc}</span>
                        </div>
                        <div className="text-base font-display font-extrabold text-white">{card.price}</div>
                        <div className="mt-1.5 inline-block rounded-full bg-gydi-teal/25 px-2 py-0.5 text-[10px] font-bold text-gydi-teal">
                          +5% tuyo
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>
        </HorizontalPanel>

        {/* ── Panel 3 · Earn commissions ── */}
        <HorizontalPanel className="flex items-center bg-gydi-ink">
          <div className="container mx-auto grid h-full w-full grid-cols-1 items-center gap-8 px-6 sm:px-12 lg:grid-cols-2 lg:gap-0 lg:px-20">
            <FadeIn direction="left" delay={0.1}>
              <div className="text-white">
                <span className="mb-2 block select-none font-display text-[6rem] font-extrabold leading-none text-white/8 sm:text-[9rem]">
                  03
                </span>
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-gydi-gold/35 bg-gydi-gold/12 px-4 py-1.5 text-sm font-semibold text-gydi-gold">
                  <DollarSign className="h-4 w-4" />
                  <span>{t('howItWorks.step3Title')}</span>
                </div>
                <h2 className="mt-1 font-display text-4xl font-extrabold leading-[1.02] tracking-tight text-white sm:text-5xl lg:text-6xl">
                  {t('howItWorks.step3Title')}
                </h2>
                <p className="mt-5 max-w-md text-base leading-relaxed text-white/55 sm:text-lg">
                  {t('howItWorks.step3Desc')}
                </p>
                <MagneticButton className="mt-8 inline-block">
                  <Button
                    asChild
                    size="lg"
                    className="micro-glow bg-gradient-to-r from-[hsl(252,100%,64%)] to-[hsl(177,100%,42%)] font-semibold shadow-lg shadow-gydi-primary/30"
                  >
                    <Link href="/register">
                      {t('howItWorks.cta')}
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                </MagneticButton>
              </div>
            </FadeIn>

            <FadeIn direction="right" delay={0.22}>
              <div className="flex items-center justify-center">
                <div className="clay-card w-[280px] overflow-hidden rounded-3xl sm:w-[320px]">
                  <div className="bg-gradient-to-r from-gydi-gold to-amber-400 px-6 py-5">
                    <p className="text-sm font-semibold text-white/80">
                      {t('affiliates.earningsLabel')}
                    </p>
                    <div className="mt-1 flex items-baseline gap-1">
                      <span className="text-3xl font-display font-extrabold text-white">$</span>
                      <CountUp to={1240} duration={2.5} className="text-4xl font-display font-extrabold text-white" />
                    </div>
                  </div>
                  <div className="space-y-2.5 p-5">
                    {[
                      { booking: '$500/noche', earn: '+$25' },
                      { booking: '$800/noche', earn: '+$40' },
                      { booking: '$1,200/noche', earn: '+$60' },
                    ].map(({ booking, earn }) => (
                      <div
                        key={booking}
                        className="flex items-center justify-between rounded-xl bg-muted/60 px-4 py-3 text-sm"
                      >
                        <span className="text-muted-foreground">{booking}</span>
                        <span className="font-bold text-gydi-teal">{earn}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </HorizontalPanel>
      </HorizontalScroll>

      {/* ══════════════════════════════════════════════════
          PROPERTY SHOWCASE — Bento grid with 3-D hover
      ══════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden border-t py-16 sm:py-20 md:py-24 lg:py-32">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:64px_64px]" />

        <div className="container relative mx-auto px-4">
          {/* Header */}
          <div className="mb-16 text-center">
            <FadeIn direction="down">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-gydi-primary/20 bg-gydi-primary/5 px-4 py-1.5 text-sm font-semibold text-gydi-primary backdrop-blur-sm">
                <Building2 className="h-4 w-4" />
                <span>{t('properties.badge')}</span>
              </div>
            </FadeIn>
            <FadeIn>
              <h2 className="mb-4 text-fluid-h2 font-display font-extrabold tracking-tight text-foreground">
                {t('properties.title')}
              </h2>
            </FadeIn>
            <FadeIn delay={0.1}>
              <p className="mx-auto max-w-2xl text-base text-muted-foreground sm:text-lg">
                {t('properties.subtitle')}
              </p>
            </FadeIn>
          </div>

          {/* Bento grid — 3-D tilt + glass overlay */}
          <div className="grid gap-4 sm:gap-6 md:grid-cols-6 lg:gap-8">

            {/* Large Featured */}
            <FadeIn direction="left" className="col-span-6 md:col-span-4 md:row-span-2">
              <motion.div
                className="group relative h-full overflow-hidden rounded-3xl shadow-2xl"
                style={{ transformPerspective: 1200 }}
                whileHover={{ scale: 1.01, rotateY: 1.5, rotateX: -0.8 }}
                transition={GYDI_SPRING}
              >
                <div className="aspect-[4/3] md:aspect-[16/10]">
                  <Image
                    src="https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&q=80"
                    alt="Villa de Lujo en Bali"
                    width={1200}
                    height={750}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-8 md:p-10">
                  <div className="glass-dark rounded-2xl p-4 sm:p-6 translate-y-2 transition-transform duration-500 group-hover:translate-y-0">
                    <div className="mb-2 flex items-center gap-2 text-white/80">
                      <MapPin className="h-4 w-4" />
                      <span className="text-sm font-medium">Bali, Indonesia</span>
                    </div>
                    <h3 className="mb-2 font-heading text-2xl font-extrabold text-white sm:text-3xl">
                      {t('properties.villa')}
                    </h3>
                    <div className="mb-3 flex items-center gap-4 text-sm text-white/70">
                      <span className="flex items-center gap-1"><Bed className="h-3 w-3" /> 4 {t('properties.bedrooms')}</span>
                      <span className="flex items-center gap-1"><Bath className="h-3 w-3" /> 3 {t('properties.bathrooms')}</span>
                      <span className="flex items-center gap-1"><Maximize className="h-3 w-3" /> 250m²</span>
                    </div>
                    <div className="text-3xl font-display font-extrabold text-white">
                      $450
                      <span className="ml-2 text-sm font-sans font-normal text-white/60">
                        {t('properties.perNight')}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="absolute right-6 top-6 glass rounded-full px-4 py-2 text-xs font-bold text-gydi-primary shadow-lg">
                  ⭐ {t('properties.badgePopular')}
                </div>
              </motion.div>
            </FadeIn>

            {/* Top Right */}
            <FadeIn direction="right" delay={0.1} className="col-span-6 md:col-span-2">
              <motion.div
                className="group relative overflow-hidden rounded-3xl shadow-xl"
                style={{ transformPerspective: 1000 }}
                whileHover={{ scale: 1.02, rotateY: -2 }}
                transition={GYDI_SPRING}
              >
                <div className="aspect-[4/3]">
                  <Image
                    src="https://images.unsplash.com/photo-1602343168117-bb8ffe3e2e9f?w=800&q=80"
                    alt="Apartamento en Dubai"
                    width={800}
                    height={600}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                <div className="absolute inset-0 flex flex-col justify-end p-5">
                  <div className="glass-dark rounded-xl p-3 translate-y-2 transition-transform duration-500 group-hover:translate-y-0">
                    <div className="mb-1 flex items-center gap-1.5 text-xs text-white/70">
                      <MapPin className="h-3 w-3" /><span>Dubai, UAE</span>
                    </div>
                    <h3 className="mb-1 font-heading text-base font-extrabold text-white">{t('properties.apartment')}</h3>
                    <div className="text-xl font-display font-extrabold text-white">
                      $320<span className="ml-1 text-xs font-sans font-normal text-white/60">{t('properties.perNight')}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </FadeIn>

            {/* Bottom Right */}
            <FadeIn direction="right" delay={0.2} className="col-span-6 md:col-span-2">
              <motion.div
                className="group relative overflow-hidden rounded-3xl shadow-xl"
                style={{ transformPerspective: 1000 }}
                whileHover={{ scale: 1.02, rotateY: -2 }}
                transition={GYDI_SPRING}
              >
                <div className="aspect-[4/3]">
                  <Image
                    src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80"
                    alt="Casa en Toscana"
                    width={800}
                    height={600}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                <div className="absolute inset-0 flex flex-col justify-end p-5">
                  <div className="glass-dark rounded-xl p-3 translate-y-2 transition-transform duration-500 group-hover:translate-y-0">
                    <div className="mb-1 flex items-center gap-1.5 text-xs text-white/70">
                      <MapPin className="h-3 w-3" /><span>Toscana, Italia</span>
                    </div>
                    <h3 className="mb-1 font-heading text-base font-extrabold text-white">{t('properties.farmhouse')}</h3>
                    <div className="text-xl font-display font-extrabold text-white">
                      $280<span className="ml-1 text-xs font-sans font-normal text-white/60">{t('properties.perNight')}</span>
                    </div>
                  </div>
                </div>
                <div className="absolute right-4 top-4 glass rounded-full px-3 py-1 text-xs font-bold text-gydi-teal shadow-lg">
                  {t('properties.badgeNew')}
                </div>
              </motion.div>
            </FadeIn>

            {/* Bottom Wide */}
            <FadeIn delay={0.3} className="col-span-6">
              <motion.div
                className="group relative overflow-hidden rounded-3xl shadow-xl"
                style={{ transformPerspective: 1400 }}
                whileHover={{ scale: 1.005, rotateX: -0.6 }}
                transition={GYDI_SPRING}
              >
                <div className="aspect-[16/6] sm:aspect-[16/5]">
                  <Image
                    src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1400&q=80"
                    alt="Penthouse en Manhattan"
                    width={1400}
                    height={400}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
                <div className="absolute inset-0 flex items-center p-6 sm:p-10 md:p-12">
                  <div className="max-w-xl">
                    <div className="mb-3 flex items-center gap-2 text-sm text-white/80">
                      <MapPin className="h-4 w-4" /><span>Manhattan, Nueva York</span>
                    </div>
                    <h3 className="mb-2 font-heading text-2xl font-extrabold text-white sm:text-3xl md:text-4xl">
                      {t('properties.penthouse')}
                    </h3>
                    <p className="mb-4 text-sm text-white/70 sm:text-base">{t('properties.penthouseDesc')}</p>
                    <div className="mb-6 flex items-center gap-6 text-sm text-white/70">
                      <span className="flex items-center gap-1.5"><Bed className="h-4 w-4" /> 5 {t('properties.bedrooms')}</span>
                      <span className="flex items-center gap-1.5"><Bath className="h-4 w-4" /> 4 {t('properties.bathrooms')}</span>
                      <span className="flex items-center gap-1.5"><Maximize className="h-4 w-4" /> 380m²</span>
                    </div>
                    <div className="text-4xl font-display font-extrabold text-white">
                      $850
                      <span className="ml-2 text-sm font-sans font-normal text-white/60">{t('properties.perNight')}</span>
                    </div>
                  </div>
                </div>
                <div className="absolute right-6 top-6 rounded-full bg-gradient-to-r from-gydi-primary to-gydi-teal px-4 py-2 text-xs font-bold text-white shadow-lg backdrop-blur-sm">
                  {t('properties.badgePremium')}
                </div>
              </motion.div>
            </FadeIn>
          </div>

          {/* View All CTA */}
          <FadeIn delay={0.2} className="mt-12 text-center sm:mt-16">
            <MagneticButton className="inline-block">
              <Button
                asChild
                size="lg"
                className="micro-glow group bg-gradient-to-r from-[hsl(252,100%,64%)] via-[hsl(255,89%,72%)] to-[hsl(177,100%,42%)] shadow-xl hover:shadow-2xl hover:shadow-gydi-primary/30"
              >
                <Link href="/propiedades">
                  {t('properties.viewAll')}
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </MagneticButton>
          </FadeIn>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          FEATURES — Clay cards
      ══════════════════════════════════════════════════ */}
      <section className="bg-gradient-to-b from-background via-muted/20 to-background py-16 sm:py-20 md:py-24 lg:py-28">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center sm:mb-16">
            <div className="sd-fade-up mb-4 inline-flex items-center gap-2 rounded-full border border-gydi-teal/20 bg-gydi-teal/5 px-4 py-1.5 text-sm font-semibold text-gydi-teal">
              <Star className="h-4 w-4" />
              <span>{t('features.badge')}</span>
            </div>
            <h2 className="sd-fade-up sd-delay-1 text-fluid-h2 font-display font-extrabold tracking-tight text-foreground">
              {t('features.title')}
            </h2>
            <p className="sd-fade-up sd-delay-2 mx-auto mt-3 max-w-xl text-base text-muted-foreground sm:text-lg">
              {t('features.subtitle')}
            </p>
          </div>

          <Stagger className="grid gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3" staggerDelay={0.07}>
            {[
              { icon: DollarSign, colorClass: 'clay-primary', iconColor: 'text-gydi-primary', borderColor: 'hover:border-gydi-primary/30', title: t('features.f1Title'), desc: t('features.f1Desc') },
              { icon: Zap,        colorClass: 'clay-teal',    iconColor: 'text-gydi-teal',    borderColor: 'hover:border-gydi-teal/30',    title: t('features.f2Title'), desc: t('features.f2Desc') },
              { icon: TrendingUp, colorClass: 'clay-gold',    iconColor: 'text-gydi-gold',    borderColor: 'hover:border-gydi-gold/30',    title: t('features.f3Title'), desc: t('features.f3Desc') },
              { icon: Building2,  colorClass: 'clay-primary', iconColor: 'text-gydi-primary', borderColor: 'hover:border-gydi-primary/30', title: t('features.f4Title'), desc: t('features.f4Desc') },
              { icon: Users,      colorClass: 'clay-teal',    iconColor: 'text-gydi-teal',    borderColor: 'hover:border-gydi-teal/30',    title: t('features.f5Title'), desc: t('features.f5Desc') },
              { icon: Shield,     colorClass: 'clay-gold',    iconColor: 'text-gydi-gold',    borderColor: 'hover:border-gydi-gold/30',    title: t('features.f6Title'), desc: t('features.f6Desc') },
            ].map(({ icon: Icon, colorClass, iconColor, borderColor, title, desc }) => (
              <StaggerItem key={title}>
                <motion.div
                  className={`group relative overflow-hidden rounded-3xl border border-border/40 bg-card p-6 sm:p-8 micro-lift ${borderColor} transition-colors`}
                  whileHover={{ y: -6 }}
                  transition={GYDI_SPRING}
                >
                  <motion.div
                    className={`mb-5 inline-flex rounded-2xl ${colorClass} p-3.5 shadow-sm`}
                    whileHover={{ scale: 1.1, rotate: 8 }}
                    transition={GYDI_SPRING}
                  >
                    <Icon className={`h-7 w-7 ${iconColor} sm:h-8 sm:w-8`} />
                  </motion.div>
                  <h3 className="mb-2 text-xl font-bold text-foreground sm:text-2xl">{title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">{desc}</p>
                </motion.div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          AFFILIATES — Split layout
      ══════════════════════════════════════════════════ */}
      <section className="border-t py-16 sm:py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
              <FadeIn direction="left">
                <div>
                  <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-gydi-teal/20 bg-gydi-teal/5 px-4 py-1.5 text-sm font-semibold text-gydi-teal">
                    <TrendingUp className="h-4 w-4" />
                    <span>{t('affiliates.badge')}</span>
                  </div>
                  <h2 className="mb-4 font-heading text-3xl font-extrabold tracking-tight sm:text-4xl">
                    {t('affiliates.title')}{' '}
                    <span className="text-gydi-teal">{t('affiliates.titleHighlight')}</span>
                  </h2>
                  <p className="mb-8 text-lg text-muted-foreground">{t('affiliates.desc')}</p>

                  <div className="mb-8 space-y-4">
                    {[
                      { title: t('affiliates.check1Title'), desc: t('affiliates.check1Desc') },
                      { title: t('affiliates.check2Title'), desc: t('affiliates.check2Desc') },
                      { title: t('affiliates.check3Title'), desc: t('affiliates.check3Desc') },
                    ].map(({ title, desc }) => (
                      <motion.div
                        key={title}
                        className="micro-border-flow flex items-start gap-4 rounded-2xl border border-gydi-teal/10 bg-gydi-teal/5 p-4 transition-colors hover:border-gydi-teal/30"
                        whileHover={{ x: 4 }}
                        transition={GYDI_SPRING}
                      >
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gydi-teal/15 shadow-sm">
                          <Check className="h-4 w-4 text-gydi-teal" />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">{title}</p>
                          <p className="text-sm text-muted-foreground">{desc}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <MagneticButton className="inline-block">
                    <Button
                      asChild
                      size="lg"
                      className="micro-glow bg-gradient-to-r from-gydi-teal/80 to-[hsl(177,100%,35%)] text-white shadow-lg shadow-gydi-teal/25"
                    >
                      <Link href="/register">{t('affiliates.cta')}</Link>
                    </Button>
                  </MagneticButton>
                </div>
              </FadeIn>

              <FadeIn direction="right" delay={0.15}>
                <div className="space-y-4">
                  <div className="clay-card overflow-hidden rounded-3xl shadow-xl">
                    <div className="bg-gradient-to-r from-gydi-teal to-[hsl(177,100%,35%)] px-6 py-5">
                      <p className="text-sm font-semibold text-white/80">{t('affiliates.earningsLabel')}</p>
                      <p className="mt-1 text-3xl font-display font-extrabold text-white">4-10% comisión</p>
                    </div>
                    <div className="space-y-3 p-5">
                      {[
                        { booking: t('affiliates.booking500'),  earn: t('affiliates.youEarn500')  },
                        { booking: t('affiliates.booking1000'), earn: t('affiliates.youEarn1000') },
                        { booking: t('affiliates.booking10x'),  earn: t('affiliates.youEarn10x')  },
                      ].map(({ booking, earn }) => (
                        <motion.div
                          key={booking}
                          className="flex items-center justify-between rounded-xl bg-gydi-teal/8 px-4 py-3 text-sm"
                          whileHover={{ x: 4, backgroundColor: 'rgba(0, 212, 200, 0.15)' }}
                          transition={GYDI_SPRING}
                        >
                          <span className="text-foreground/70">{booking}</span>
                          <span className="font-bold text-gydi-teal">{earn}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                  <div className="glass flex items-start gap-2 rounded-2xl p-4 text-xs text-foreground/70">
                    <span>💡</span>
                    <span>{t('affiliates.tip')}</span>
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          HOSTS — Split layout
      ══════════════════════════════════════════════════ */}
      <section className="border-t py-16 sm:py-20 md:py-24 lg:py-28">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <FadeIn direction="left">
              <div className="flex flex-col gap-6">
                <div className="inline-flex w-fit items-center gap-2 rounded-full bg-gydi-gold/10 px-4 py-2 text-sm font-semibold text-gydi-gold">
                  <Home className="h-4 w-4" />
                  {t('hosts.badge')}
                </div>
                <h2 className="font-heading text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl">
                  {t('hosts.title')}{' '}
                  <span className="text-gradient-gold">{t('hosts.titleHighlight')}</span>
                </h2>
                <p className="text-base text-muted-foreground sm:text-lg">{t('hosts.desc')}</p>
                <ul className="flex flex-col gap-3">
                  {[
                    { icon: '🤝', title: t('hosts.item1Title'), desc: t('hosts.item1Desc') },
                    { icon: '💰', title: t('hosts.item2Title'), desc: t('hosts.item2Desc') },
                    { icon: '🚀', title: t('hosts.item3Title'), desc: t('hosts.item3Desc') },
                  ].map((item) => (
                    <motion.li
                      key={item.title}
                      className="flex items-start gap-3 rounded-2xl border border-gydi-gold/10 bg-gydi-gold/5 p-4 micro-lift"
                      whileHover={{ x: 4, borderColor: 'rgba(245, 166, 35, 0.3)' }}
                      transition={GYDI_SPRING}
                    >
                      <span className="text-xl">{item.icon}</span>
                      <div>
                        <p className="font-semibold text-foreground">{item.title}</p>
                        <p className="text-sm text-muted-foreground">{item.desc}</p>
                      </div>
                    </motion.li>
                  ))}
                </ul>
                <MagneticButton className="w-fit">
                  <a
                    href="/register"
                    className="micro-glow inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-gydi-gold to-amber-400 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-gydi-gold/25 transition-shadow hover:shadow-xl hover:shadow-gydi-gold/30"
                  >
                    {t('hosts.cta')}
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </MagneticButton>
              </div>
            </FadeIn>

            <FadeIn direction="right" delay={0.15}>
              <div className="clay-card overflow-hidden rounded-3xl shadow-xl shadow-gydi-gold/10">
                <div className="bg-gradient-to-r from-gydi-gold to-amber-400 px-6 py-5">
                  <p className="text-sm font-semibold text-white/80">{t('hosts.exampleTitle')}</p>
                  <p className="mt-1 text-2xl font-display font-extrabold text-white">{t('hosts.exampleQuestion')}</p>
                </div>
                <div className="px-6 py-5">
                  <div className="flex h-10 overflow-hidden rounded-full">
                    <motion.div
                      className="flex items-center justify-center bg-gradient-to-r from-emerald-400 to-green-500 text-xs font-bold text-white"
                      initial={{ width: '0%' }}
                      whileInView={{ width: '85%' }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.3 }}
                    >
                      85%
                    </motion.div>
                    <div
                      className="flex items-center justify-center bg-gydi-gold/20 text-xs font-semibold text-gydi-gold"
                      style={{ width: '15%' }}
                    >
                      15%
                    </div>
                  </div>
                  <div className="mt-3 flex justify-between text-xs text-muted-foreground">
                    <span className="font-medium text-emerald-600">{t('hosts.youReceive')}: $425</span>
                    <span className="font-medium text-gydi-gold">{t('hosts.platformFee')}: $75</span>
                  </div>
                </div>
                <div className="space-y-3 border-t border-gydi-gold/10 px-6 pb-6 pt-4">
                  <div className="flex items-center justify-between rounded-xl bg-emerald-50 px-4 py-3 dark:bg-emerald-900/10">
                    <span className="text-sm font-medium text-emerald-700">{t('hosts.youReceive')}</span>
                    <span className="text-lg font-extrabold text-emerald-600">$425 <span className="text-sm font-normal">(85%)</span></span>
                  </div>
                  <div className="flex items-center justify-between rounded-xl bg-gydi-gold/5 px-4 py-3">
                    <span className="text-sm font-medium text-gydi-gold">{t('hosts.platformFee')}</span>
                    <span className="text-base font-bold text-gydi-gold">$75 <span className="text-sm font-normal">(15%)</span></span>
                  </div>
                </div>
                <div className="glass flex items-start gap-2 rounded-b-3xl border-t border-gydi-gold/10 px-6 py-4 text-xs text-foreground/70">
                  <span>💡</span>
                  <span>{t('hosts.tip')}</span>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          CTA FINAL — Dark mesh, parallax orbs
      ══════════════════════════════════════════════════ */}
      <section className="mesh-bg relative overflow-hidden bg-gydi-ink py-20 text-white sm:py-28 md:py-36">
        {/* Parallax orbs — outer div handles absolute position, ParallaxLayer handles relative */}
        <div className="pointer-events-none absolute inset-0">
          <ParallaxLayer speed={0.1} className="h-full w-full">
            <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-gydi-primary/25 blur-[100px]" />
            <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-gydi-teal/20 blur-[100px]" />
            <div className="absolute left-1/2 top-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gydi-gold/10 blur-[80px]" />
          </ParallaxLayer>
        </div>

        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff06_1px,transparent_1px),linear-gradient(to_bottom,#ffffff06_1px,transparent_1px)] bg-[size:24px_24px]" />

        <div className="container relative mx-auto px-4 text-center">
          <RevealText
            as="h2"
            className="text-fluid-hero font-display font-extrabold tracking-tight text-white"
          >
            {t('cta.title')}
          </RevealText>

          <FadeIn delay={0.2}>
            <p className="mt-4 text-base text-white/70 sm:text-lg md:text-xl lg:mt-6">
              {t('cta.subtitle')}
            </p>
          </FadeIn>

          <FadeIn
            delay={0.3}
            className="mt-8 flex flex-col items-center justify-center gap-3 sm:mt-10 sm:flex-row sm:gap-4"
          >
            <MagneticButton>
              <Button
                asChild
                size="lg"
                className="micro-glow w-full bg-gradient-to-r from-[hsl(252,100%,64%)] to-[hsl(177,100%,42%)] font-semibold shadow-xl shadow-gydi-primary/30 hover:shadow-gydi-primary/50 sm:w-auto sm:px-8"
              >
                <Link href="/register">{t('cta.createAccount')}</Link>
              </Button>
            </MagneticButton>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="micro-lift w-full border-white/20 font-semibold text-white hover:border-white/40 hover:bg-white/10 sm:w-auto sm:px-8"
            >
              <Link href="/propiedades">{t('cta.exploreProperties')}</Link>
            </Button>
          </FadeIn>

          <FadeIn delay={0.4}>
            <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-white/50 sm:mt-16 sm:gap-12 sm:text-base">
              {[
                { icon: Shield,     label: t('cta.secure')          },
                { icon: Users,      label: t('cta.activeAffiliates') },
                { icon: DollarSign, label: t('cta.noHiddenFees')     },
              ].map(({ icon: Icon, label }) => (
                <motion.div
                  key={label}
                  className="flex items-center gap-2"
                  whileHover={{ scale: 1.05, color: '#ffffff' }}
                  transition={GYDI_SPRING}
                >
                  <Icon className="h-5 w-5" />
                  <span>{label}</span>
                </motion.div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}