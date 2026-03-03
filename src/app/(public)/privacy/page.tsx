'use client';

import Link from 'next/link';
import { Shield, Lock, Eye, Database, UserCheck, FileText } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';

export default function PrivacyPage() {
  const { t } = useTranslation('privacy');
  const lastUpdated = t('lastUpdated');

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50/50 to-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b bg-gradient-to-br from-primary/5 via-blue-500/5 to-purple-500/5 py-16 sm:py-20">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:64px_64px]" />

        <div className="container relative mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary backdrop-blur-sm">
              <Shield className="h-4 w-4" />
              <span>{t('hero.badge')} {lastUpdated}</span>
            </div>

            <h1 className="mb-6">
              {t('hero.title1')}{' '}
              <span className="bg-gradient-to-r from-primary via-blue-600 to-purple-600 bg-clip-text text-transparent">
                {t('hero.titleHighlight')}
              </span>
            </h1>

            <p className="text-lg text-muted-foreground">
              {t('hero.subtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="border-b bg-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
            <span className="font-semibold text-foreground">{t('quickLinks.goTo')}</span>
            <a href="#info-recopilada" className="text-primary hover:underline">{t('quickLinks.infoCollected')}</a>
            <span className="text-muted-foreground">•</span>
            <a href="#uso-datos" className="text-primary hover:underline">{t('quickLinks.dataUsage')}</a>
            <span className="text-muted-foreground">•</span>
            <a href="#compartir" className="text-primary hover:underline">{t('quickLinks.sharing')}</a>
            <span className="text-muted-foreground">•</span>
            <a href="#seguridad" className="text-primary hover:underline">{t('quickLinks.security')}</a>
            <span className="text-muted-foreground">•</span>
            <a href="#derechos" className="text-primary hover:underline">{t('quickLinks.rights')}</a>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            {/* Introduction */}
            <div className="mb-12 rounded-2xl border-l-4 border-primary bg-primary/5 p-6">
              <h3 className="mb-3 text-xl font-bold">{t('intro.title')}</h3>
              <p className="leading-relaxed text-muted-foreground">
                {t('intro.text')}
              </p>
            </div>

            {/* 1. Information We Collect */}
            <div id="info-recopilada" className="mb-12">
              <div className="mb-6 flex items-center gap-3">
                <div className="rounded-xl bg-primary/10 p-3">
                  <Database className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-3xl">{t('s1.title')}</h2>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="mb-3 font-semibold">{t('s1.s11Title')}</h4>
                  <ul className="ml-6 space-y-2 text-muted-foreground">
                    <li className="list-disc">
                      <strong className="text-foreground">{t('s1.account')}</strong> {t('s1.accountText')}
                    </li>
                    <li className="list-disc">
                      <strong className="text-foreground">{t('s1.profile')}</strong> {t('s1.profileText')}
                    </li>
                    <li className="list-disc">
                      <strong className="text-foreground">{t('s1.payment')}</strong> {t('s1.paymentText')}
                    </li>
                    <li className="list-disc">
                      <strong className="text-foreground">{t('s1.docs')}</strong> {t('s1.docsText')}
                    </li>
                    <li className="list-disc">
                      <strong className="text-foreground">{t('s1.communications')}</strong> {t('s1.communicationsText')}
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="mb-3 font-semibold">{t('s1.s12Title')}</h4>
                  <ul className="ml-6 space-y-2 text-muted-foreground">
                    <li className="list-disc">
                      <strong className="text-foreground">{t('s1.usage')}</strong> {t('s1.usageText')}
                    </li>
                    <li className="list-disc">
                      <strong className="text-foreground">{t('s1.device')}</strong> {t('s1.deviceText')}
                    </li>
                    <li className="list-disc">
                      <strong className="text-foreground">{t('s1.cookies')}</strong>{' '}
                      {t('s1.cookiesPre')}{' '}
                      <Link href="/cookies" className="text-primary hover:underline">{t('s1.cookiesLink')}</Link>
                    </li>
                    <li className="list-disc">
                      <strong className="text-foreground">{t('s1.referral')}</strong> {t('s1.referralText')}
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="mb-3 font-semibold">{t('s1.s13Title')}</h4>
                  <ul className="ml-6 space-y-2 text-muted-foreground">
                    <li className="list-disc">{t('s1.social')}</li>
                    <li className="list-disc">{t('s1.paymentProviders')}</li>
                    <li className="list-disc">{t('s1.analytics')}</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 2. How We Use Your Information */}
            <div id="uso-datos" className="mb-12">
              <div className="mb-6 flex items-center gap-3">
                <div className="rounded-xl bg-blue-500/10 p-3">
                  <Eye className="h-6 w-6 text-blue-600" />
                </div>
                <h2 className="text-3xl">{t('s2.title')}</h2>
              </div>

              <div className="space-y-4">
                <p className="text-muted-foreground">{t('s2.intro')}</p>
                <ul className="ml-6 space-y-2 text-muted-foreground">
                  <li className="list-disc">
                    <strong className="text-foreground">{t('s2.services')}</strong> {t('s2.servicesText')}
                  </li>
                  <li className="list-disc">
                    <strong className="text-foreground">{t('s2.communication')}</strong> {t('s2.communicationText')}
                  </li>
                  <li className="list-disc">
                    <strong className="text-foreground">{t('s2.marketing')}</strong> {t('s2.marketingText')}
                  </li>
                  <li className="list-disc">
                    <strong className="text-foreground">{t('s2.improvement')}</strong> {t('s2.improvementText')}
                  </li>
                  <li className="list-disc">
                    <strong className="text-foreground">{t('s2.security')}</strong> {t('s2.securityText')}
                  </li>
                  <li className="list-disc">
                    <strong className="text-foreground">{t('s2.legal')}</strong> {t('s2.legalText')}
                  </li>
                </ul>
              </div>

              <div className="mt-6 rounded-xl bg-blue-50 p-4 text-sm text-blue-900">
                {t('s2.gdpr')}
              </div>
            </div>

            {/* 3. Sharing Information */}
            <div id="compartir" className="mb-12">
              <div className="mb-6 flex items-center gap-3">
                <div className="rounded-xl bg-purple-500/10 p-3">
                  <UserCheck className="h-6 w-6 text-purple-600" />
                </div>
                <h2 className="text-3xl">{t('s3.title')}</h2>
              </div>

              <div className="space-y-4">
                <p className="text-muted-foreground">
                  <strong className="text-foreground">{t('s3.intro')}</strong> {t('s3.introEnd')}
                </p>

                <ul className="ml-6 space-y-3 text-muted-foreground">
                  <li className="list-disc">
                    <strong className="text-foreground">{t('s3.providers')}</strong> {t('s3.providersText')}
                  </li>
                  <li className="list-disc">
                    <strong className="text-foreground">{t('s3.owners')}</strong> {t('s3.ownersText')}
                  </li>
                  <li className="list-disc">
                    <strong className="text-foreground">{t('s3.affiliates')}</strong> {t('s3.affiliatesText')}
                  </li>
                  <li className="list-disc">
                    <strong className="text-foreground">{t('s3.authorities')}</strong> {t('s3.authoritiesText')}
                  </li>
                  <li className="list-disc">
                    <strong className="text-foreground">{t('s3.mergers')}</strong> {t('s3.mergersText')}
                  </li>
                </ul>
              </div>
            </div>

            {/* 4. Data Security */}
            <div id="seguridad" className="mb-12">
              <div className="mb-6 flex items-center gap-3">
                <div className="rounded-xl bg-orange-500/10 p-3">
                  <Lock className="h-6 w-6 text-orange-600" />
                </div>
                <h2 className="text-3xl">{t('s4.title')}</h2>
              </div>

              <div className="space-y-4">
                <p className="text-muted-foreground">{t('s4.intro')}</p>
                <ul className="ml-6 space-y-2 text-muted-foreground">
                  <li className="list-disc">
                    <strong className="text-foreground">{t('s4.encryption')}</strong> {t('s4.encryptionText')}
                  </li>
                  <li className="list-disc">
                    <strong className="text-foreground">{t('s4.auth')}</strong> {t('s4.authText')}
                  </li>
                  <li className="list-disc">
                    <strong className="text-foreground">{t('s4.access')}</strong> {t('s4.accessText')}
                  </li>
                  <li className="list-disc">
                    <strong className="text-foreground">{t('s4.monitoring')}</strong> {t('s4.monitoringText')}
                  </li>
                  <li className="list-disc">
                    <strong className="text-foreground">{t('s4.backups')}</strong> {t('s4.backupsText')}
                  </li>
                </ul>

                <div className="rounded-xl bg-yellow-50 p-4 text-sm text-yellow-900">
                  {t('s4.warning')}{' '}
                  <a href="mailto:security@gydi.com" className="font-semibold underline">security@gydi.com</a>.
                </div>
              </div>
            </div>

            {/* 5. Privacy Rights */}
            <div id="derechos" className="mb-12">
              <div className="mb-6 flex items-center gap-3">
                <div className="rounded-xl bg-green-500/10 p-3">
                  <FileText className="h-6 w-6 text-green-600" />
                </div>
                <h2 className="text-3xl">{t('s5.title')}</h2>
              </div>

              <div className="space-y-6">
                <p className="text-muted-foreground">{t('s5.intro')}</p>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-xl border border-border/50 bg-card p-4">
                    <h4 className="mb-2 font-semibold">{t('s5.access')}</h4>
                    <p className="text-sm text-muted-foreground">{t('s5.accessText')}</p>
                  </div>

                  <div className="rounded-xl border border-border/50 bg-card p-4">
                    <h4 className="mb-2 font-semibold">{t('s5.rectification')}</h4>
                    <p className="text-sm text-muted-foreground">{t('s5.rectificationText')}</p>
                  </div>

                  <div className="rounded-xl border border-border/50 bg-card p-4">
                    <h4 className="mb-2 font-semibold">{t('s5.deletion')}</h4>
                    <p className="text-sm text-muted-foreground">{t('s5.deletionText')}</p>
                  </div>

                  <div className="rounded-xl border border-border/50 bg-card p-4">
                    <h4 className="mb-2 font-semibold">{t('s5.portability')}</h4>
                    <p className="text-sm text-muted-foreground">{t('s5.portabilityText')}</p>
                  </div>

                  <div className="rounded-xl border border-border/50 bg-card p-4">
                    <h4 className="mb-2 font-semibold">{t('s5.restriction')}</h4>
                    <p className="text-sm text-muted-foreground">{t('s5.restrictionText')}</p>
                  </div>

                  <div className="rounded-xl border border-border/50 bg-card p-4">
                    <h4 className="mb-2 font-semibold">{t('s5.objection')}</h4>
                    <p className="text-sm text-muted-foreground">{t('s5.objectionText')}</p>
                  </div>

                  <div className="rounded-xl border border-border/50 bg-card p-4">
                    <h4 className="mb-2 font-semibold">{t('s5.revocation')}</h4>
                    <p className="text-sm text-muted-foreground">{t('s5.revocationText')}</p>
                  </div>

                  <div className="rounded-xl border border-border/50 bg-card p-4">
                    <h4 className="mb-2 font-semibold">{t('s5.complaint')}</h4>
                    <p className="text-sm text-muted-foreground">{t('s5.complaintText')}</p>
                  </div>
                </div>

                <div className="rounded-xl bg-primary/5 p-6">
                  <h4 className="mb-3 font-semibold">{t('s5.exerciseTitle')}</h4>
                  <p className="mb-3 text-sm text-muted-foreground">{t('s5.exerciseIntro')}</p>
                  <ul className="ml-6 space-y-1 text-sm text-muted-foreground">
                    <li className="list-disc">
                      {t('s5.exerciseEmail')}{' '}
                      <a href="mailto:privacy@gydi.com" className="font-semibold text-primary">privacy@gydi.com</a>
                    </li>
                    <li className="list-disc">{t('s5.exerciseSettings')}</li>
                    <li className="list-disc">{t('s5.exerciseTime')}</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 6. Data Retention */}
            <div className="mb-12">
              <h2 className="mb-4 text-3xl">{t('s6.title')}</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>{t('s6.intro')}</p>
                <ul className="ml-6 space-y-2">
                  <li className="list-disc">
                    <strong className="text-foreground">{t('s6.account')}</strong> {t('s6.accountText')}
                  </li>
                  <li className="list-disc">
                    <strong className="text-foreground">{t('s6.financial')}</strong> {t('s6.financialText')}
                  </li>
                  <li className="list-disc">
                    <strong className="text-foreground">{t('s6.marketing')}</strong> {t('s6.marketingText')}
                  </li>
                  <li className="list-disc">
                    <strong className="text-foreground">{t('s6.logs')}</strong> {t('s6.logsText')}
                  </li>
                </ul>
              </div>
            </div>

            {/* 7. Children's Privacy */}
            <div className="mb-12">
              <h2 className="mb-4 text-3xl">{t('s7.title')}</h2>
              <div className="rounded-xl bg-red-50 p-6 text-red-900">
                <p className="font-semibold">{t('s7.text')}</p>
              </div>
            </div>

            {/* 8. International Transfers */}
            <div className="mb-12">
              <h2 className="mb-4 text-3xl">{t('s8.title')}</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>{t('s8.intro')}</p>
                <ul className="ml-6 space-y-2">
                  <li className="list-disc">{t('s8.scc')}</li>
                  <li className="list-disc">{t('s8.adequacy')}</li>
                  <li className="list-disc">{t('s8.privacyShield')}</li>
                </ul>
              </div>
            </div>

            {/* 9. Cookies */}
            <div className="mb-12">
              <h2 className="mb-4 text-3xl">{t('s9.title')}</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  {t('s9.text')}{' '}
                  <Link href="/cookies" className="font-semibold text-primary hover:underline">
                    {t('s9.link')}
                  </Link>.
                </p>
              </div>
            </div>

            {/* 10. Changes */}
            <div className="mb-12">
              <h2 className="mb-4 text-3xl">{t('s10.title')}</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>{t('s10.intro')}</p>
                <ul className="ml-6 space-y-2">
                  <li className="list-disc">{t('s10.email')}</li>
                  <li className="list-disc">{t('s10.notice')}</li>
                  <li className="list-disc">{t('s10.date')}</li>
                </ul>
                <p>{t('s10.continued')}</p>
              </div>
            </div>

            {/* Contact */}
            <div className="rounded-3xl border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-blue-500/5 p-8">
              <h2 className="mb-4 text-3xl">{t('contact.title')}</h2>
              <div className="space-y-3 text-muted-foreground">
                <p>{t('contact.intro')}</p>
                <div className="space-y-1">
                  <p>
                    <strong className="text-foreground">{t('contact.email')}</strong>{' '}
                    <a href="mailto:privacy@gydi.com" className="text-primary hover:underline">privacy@gydi.com</a>
                  </p>
                  <p>
                    <strong className="text-foreground">{t('contact.address')}</strong> {t('contact.addressValue')}
                  </p>
                  <p>
                    <strong className="text-foreground">{t('contact.dpo')}</strong>{' '}
                    <a href="mailto:dpo@gydi.com" className="text-primary hover:underline">dpo@gydi.com</a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
