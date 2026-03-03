'use client';

import Link from 'next/link';
import { FileText, AlertTriangle, DollarSign, Shield, Users, Building2 } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';

export default function TermsPage() {
  const { t } = useTranslation('terms');
  const lastUpdated = t('lastUpdated');

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50/50 to-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b bg-gradient-to-br from-primary/5 via-blue-500/5 to-purple-500/5 py-16 sm:py-20">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:64px_64px]" />

        <div className="container relative mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary backdrop-blur-sm">
              <FileText className="h-4 w-4" />
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
            <a href="#aceptacion" className="text-primary hover:underline">{t('quickLinks.acceptance')}</a>
            <span className="text-muted-foreground">•</span>
            <a href="#servicios" className="text-primary hover:underline">{t('quickLinks.services')}</a>
            <span className="text-muted-foreground">•</span>
            <a href="#cuentas" className="text-primary hover:underline">{t('quickLinks.accounts')}</a>
            <span className="text-muted-foreground">•</span>
            <a href="#comisiones" className="text-primary hover:underline">{t('quickLinks.commissions')}</a>
            <span className="text-muted-foreground">•</span>
            <a href="#prohibiciones" className="text-primary hover:underline">{t('quickLinks.prohibitions')}</a>
            <span className="text-muted-foreground">•</span>
            <a href="#responsabilidad" className="text-primary hover:underline">{t('quickLinks.liability')}</a>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            {/* Important Notice */}
            <div className="mb-12 rounded-2xl border-2 border-yellow-500/50 bg-yellow-50 p-6">
              <div className="flex items-start gap-4">
                <AlertTriangle className="mt-1 h-6 w-6 flex-shrink-0 text-yellow-600" />
                <div>
                  <h3 className="mb-2 text-xl font-bold text-yellow-900">{t('notice.title')}</h3>
                  <p className="leading-relaxed text-yellow-800">
                    {t('notice.text')}
                  </p>
                </div>
              </div>
            </div>

            {/* 1. Acceptance */}
            <div id="aceptacion" className="mb-12">
              <h2 className="mb-6 text-3xl">{t('s1.title')}</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  {t('s1.p1')}{' '}
                  <Link href="/privacy" className="text-primary hover:underline">{t('s1.p1Privacy')}</Link>{' '}
                  {t('s1.p1And')}{' '}
                  <Link href="/cookies" className="text-primary hover:underline">{t('s1.p1Cookies')}</Link>{t('s1.p1End')}
                </p>

                <p>{t('s1.p2')}</p>

                <p className="font-semibold text-foreground">
                  {t('s1.p3')}
                </p>
              </div>
            </div>

            {/* 2. Services */}
            <div id="servicios" className="mb-12">
              <div className="mb-6 flex items-center gap-3">
                <div className="rounded-xl bg-primary/10 p-3">
                  <Building2 className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-3xl">{t('s2.title')}</h2>
              </div>

              <div className="space-y-6">
                <p className="text-muted-foreground">{t('s2.intro')}</p>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6">
                    <h4 className="mb-3 font-semibold text-primary">{t('s2.hostTitle')}</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <span className="mt-1 text-primary">•</span>
                        <span>{t('s2.hostItem1')}</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="mt-1 text-primary">•</span>
                        <span>{t('s2.hostItem2')}</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="mt-1 text-primary">•</span>
                        <span>{t('s2.hostItem3')}</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="mt-1 text-primary">•</span>
                        <span>{t('s2.hostItem4')}</span>
                      </li>
                    </ul>
                  </div>

                  <div className="rounded-2xl border border-purple-500/20 bg-purple-500/5 p-6">
                    <h4 className="mb-3 font-semibold text-purple-600">{t('s2.affiliateTitle')}</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <span className="mt-1 text-purple-600">•</span>
                        <span>{t('s2.affiliateItem1')}</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="mt-1 text-purple-600">•</span>
                        <span>{t('s2.affiliateItem2')}</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="mt-1 text-purple-600">•</span>
                        <span>{t('s2.affiliateItem3')}</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="mt-1 text-purple-600">•</span>
                        <span>{t('s2.affiliateItem4')}</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="rounded-xl bg-blue-50 p-4 text-sm text-blue-900">
                  <strong>{t('s2.availability')}</strong> {t('s2.availabilityText')}
                </div>
              </div>
            </div>

            {/* 3. User Accounts */}
            <div id="cuentas" className="mb-12">
              <div className="mb-6 flex items-center gap-3">
                <div className="rounded-xl bg-blue-500/10 p-3">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <h2 className="text-3xl">{t('s3.title')}</h2>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="mb-3 font-semibold">{t('s3.s31Title')}</h4>
                  <ul className="ml-6 space-y-2 text-muted-foreground">
                    <li className="list-disc">{t('s3.reg1')}</li>
                    <li className="list-disc">{t('s3.reg2')}</li>
                    <li className="list-disc">{t('s3.reg3')}</li>
                    <li className="list-disc">{t('s3.reg4')}</li>
                  </ul>
                </div>

                <div>
                  <h4 className="mb-3 font-semibold">{t('s3.s32Title')}</h4>
                  <p className="mb-3 text-muted-foreground">{t('s3.verifyIntro')}</p>
                  <ul className="ml-6 space-y-2 text-muted-foreground">
                    <li className="list-disc">{t('s3.verify1')}</li>
                    <li className="list-disc">{t('s3.verify2')}</li>
                    <li className="list-disc">{t('s3.verify3')}</li>
                    <li className="list-disc">{t('s3.verify4')}</li>
                  </ul>
                </div>

                <div>
                  <h4 className="mb-3 font-semibold">{t('s3.s33Title')}</h4>
                  <p className="mb-3 text-muted-foreground">{t('s3.suspendIntro')}</p>
                  <ul className="ml-6 space-y-2 text-muted-foreground">
                    <li className="list-disc">{t('s3.suspend1')}</li>
                    <li className="list-disc">{t('s3.suspend2')}</li>
                    <li className="list-disc">{t('s3.suspend3')}</li>
                    <li className="list-disc">{t('s3.suspend4')}</li>
                    <li className="list-disc">{t('s3.suspend5')}</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 4. Commissions */}
            <div id="comisiones" className="mb-12">
              <div className="mb-6 flex items-center gap-3">
                <div className="rounded-xl bg-purple-500/10 p-3">
                  <DollarSign className="h-6 w-6 text-purple-600" />
                </div>
                <h2 className="text-3xl">{t('s4.title')}</h2>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="mb-3 font-semibold">{t('s4.s41Title')}</h4>

                  {/* Desktop Table */}
                  <div className="mb-4 hidden overflow-hidden rounded-xl border sm:block">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="border-b px-4 py-3 text-left text-sm font-semibold">{t('s4.thPlan')}</th>
                          <th className="border-b px-4 py-3 text-left text-sm font-semibold">{t('s4.thPrice')}</th>
                          <th className="border-b px-4 py-3 text-left text-sm font-semibold">{t('s4.thCommission')}</th>
                          <th className="border-b px-4 py-3 text-left text-sm font-semibold">{t('s4.thLimit')}</th>
                        </tr>
                      </thead>
                      <tbody className="text-sm">
                        <tr>
                          <td className="border-b px-4 py-3 font-medium">{t('s4.freePlan')}</td>
                          <td className="border-b px-4 py-3">{t('s4.freePrice')}</td>
                          <td className="border-b px-4 py-3 text-primary">{t('s4.freeCommission')}</td>
                          <td className="border-b px-4 py-3">{t('s4.freeLimit')}</td>
                        </tr>
                        <tr>
                          <td className="border-b px-4 py-3 font-medium">{t('s4.proPlan')}</td>
                          <td className="border-b px-4 py-3">{t('s4.proPrice')}</td>
                          <td className="border-b px-4 py-3 text-primary">{t('s4.proCommission')}</td>
                          <td className="border-b px-4 py-3">{t('s4.proLimit')}</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 font-medium">{t('s4.elitePlan')}</td>
                          <td className="px-4 py-3">{t('s4.elitePrice')}</td>
                          <td className="px-4 py-3 text-primary">{t('s4.eliteCommission')}</td>
                          <td className="px-4 py-3">{t('s4.eliteLimit')}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile Cards */}
                  <div className="mb-4 space-y-4 sm:hidden">
                    <div className="rounded-xl border bg-card p-4">
                      <div className="mb-3 flex items-center justify-between">
                        <span className="text-lg font-bold">{t('s4.freePlan')}</span>
                        <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-semibold">{t('s4.freePrice')}{t('s4.perMonth')}</span>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">{t('s4.thCommission')}:</span>
                          <span className="font-semibold text-primary">{t('s4.freeCommission')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">{t('s4.thLimit')}:</span>
                          <span className="font-medium">{t('s4.freeLimit')}</span>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-xl border-2 border-primary bg-card p-4">
                      <div className="mb-3 flex items-center justify-between">
                        <span className="text-lg font-bold">{t('s4.proPlan')}</span>
                        <span className="rounded-full bg-primary px-3 py-1 text-sm font-semibold text-primary-foreground">{t('s4.proPrice')}{t('s4.perMonth')}</span>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">{t('s4.thCommission')}:</span>
                          <span className="font-semibold text-primary">{t('s4.proCommission')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">{t('s4.thLimit')}:</span>
                          <span className="font-medium">{t('s4.proLimit')}</span>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-xl border bg-card p-4">
                      <div className="mb-3 flex items-center justify-between">
                        <span className="text-lg font-bold">{t('s4.elitePlan')}</span>
                        <span className="rounded-full bg-purple-100 px-3 py-1 text-sm font-semibold text-purple-700">{t('s4.elitePrice')}{t('s4.perMonth')}</span>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">{t('s4.thCommission')}:</span>
                          <span className="font-semibold text-primary">{t('s4.eliteCommission')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">{t('s4.thLimit')}:</span>
                          <span className="font-medium">{t('s4.eliteLimit')}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <ul className="ml-6 space-y-2 text-muted-foreground">
                    <li className="list-disc">
                      {t('s4.calc1')} <strong className="text-foreground">{t('s4.calc1Bold')}</strong>
                    </li>
                    <li className="list-disc">{t('s4.calc2')}</li>
                    <li className="list-disc">{t('s4.calc3')}</li>
                  </ul>
                </div>

                <div>
                  <h4 className="mb-3 font-semibold">{t('s4.s42Title')}</h4>
                  <ul className="ml-6 space-y-2 text-muted-foreground">
                    <li className="list-disc">
                      <strong className="text-foreground">{t('s4.minPayout')}</strong> {t('s4.minPayoutValue')}
                    </li>
                    <li className="list-disc">
                      <strong className="text-foreground">{t('s4.payFreq')}</strong>
                      <ul className="ml-6 mt-2 space-y-1">
                        <li className="list-circle">{t('s4.payFreeFreq')}</li>
                        <li className="list-circle">{t('s4.payProFreq')}</li>
                        <li className="list-circle">{t('s4.payEliteFreq')}</li>
                      </ul>
                    </li>
                    <li className="list-disc">
                      <strong className="text-foreground">{t('s4.payMethods')}</strong> {t('s4.payMethodsValue')}
                    </li>
                    <li className="list-disc">
                      <strong className="text-foreground">{t('s4.payTime')}</strong> {t('s4.payTimeValue')}
                    </li>
                    <li className="list-disc">
                      <strong className="text-foreground">{t('s4.payFees')}</strong> {t('s4.payFeesValue')}
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="mb-3 font-semibold">{t('s4.s43Title')}</h4>
                  <p className="mb-3 text-muted-foreground">{t('s4.holdIntro')}</p>
                  <ul className="ml-6 space-y-2 text-muted-foreground">
                    <li className="list-disc">{t('s4.hold1')}</li>
                    <li className="list-disc">{t('s4.hold2')}</li>
                    <li className="list-disc">{t('s4.hold3')}</li>
                    <li className="list-disc">{t('s4.hold4')}</li>
                  </ul>
                </div>

                <div>
                  <h4 className="mb-3 font-semibold">{t('s4.s44Title')}</h4>
                  <ul className="ml-6 space-y-2 text-muted-foreground">
                    <li className="list-disc">
                      {t('s4.refund1')} <strong className="text-foreground">{t('s4.refund1Bold')}</strong>
                    </li>
                    <li className="list-disc">{t('s4.refund2')}</li>
                    <li className="list-disc">{t('s4.refund3')}</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 5. Prohibited Conduct */}
            <div id="prohibiciones" className="mb-12">
              <div className="mb-6 flex items-center gap-3">
                <div className="rounded-xl bg-red-500/10 p-3">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <h2 className="text-3xl">{t('s5.title')}</h2>
              </div>

              <div className="space-y-6">
                <div className="rounded-xl border-2 border-red-200 bg-red-50 p-6">
                  <h4 className="mb-3 font-semibold text-red-900">{t('s5.prohibited')}</h4>
                  <ul className="ml-6 space-y-2 text-sm text-red-800">
                    <li className="list-disc">{t('s5.p1')}</li>
                    <li className="list-disc">{t('s5.p2')}</li>
                    <li className="list-disc">{t('s5.p3')}</li>
                    <li className="list-disc">{t('s5.p4')}</li>
                    <li className="list-disc">{t('s5.p5')}</li>
                    <li className="list-disc">{t('s5.p6')}</li>
                    <li className="list-disc">{t('s5.p7')}</li>
                    <li className="list-disc">{t('s5.p8')}</li>
                    <li className="list-disc">{t('s5.p9')}</li>
                    <li className="list-disc">{t('s5.p10')}</li>
                  </ul>
                </div>

                <p className="text-sm text-muted-foreground">
                  {t('s5.consequence')} <strong className="text-foreground">
                  {t('s5.consequenceBold')}</strong>{t('s5.consequenceEnd')}
                </p>
              </div>
            </div>

            {/* 6. Intellectual Property */}
            <div className="mb-12">
              <h2 className="mb-6 text-3xl">{t('s6.title')}</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>{t('s6.p1')}</p>
                <p>{t('s6.p2')}</p>
                <ul className="ml-6 space-y-2">
                  <li className="list-disc">{t('s6.ip1')}</li>
                  <li className="list-disc">{t('s6.ip2')}</li>
                  <li className="list-disc">{t('s6.ip3')}</li>
                </ul>
                <p className="font-semibold text-foreground">{t('s6.p3')}</p>
              </div>
            </div>

            {/* 7. Limitation of Liability */}
            <div id="responsabilidad" className="mb-12">
              <div className="mb-6 flex items-center gap-3">
                <div className="rounded-xl bg-orange-500/10 p-3">
                  <Shield className="h-6 w-6 text-orange-600" />
                </div>
                <h2 className="text-3xl">{t('s7.title')}</h2>
              </div>

              <div className="space-y-6">
                <div className="rounded-xl border-2 border-orange-200 bg-orange-50 p-6">
                  <h4 className="mb-3 font-semibold text-orange-900">{t('s7.disclaimerTitle')}</h4>
                  <p className="text-sm text-orange-800">{t('s7.disclaimer')}</p>
                </div>

                <div>
                  <h4 className="mb-3 font-semibold">{t('s7.damagesTitle')}</h4>
                  <p className="mb-3 text-muted-foreground">{t('s7.damagesIntro')}</p>
                  <ul className="ml-6 space-y-2 text-muted-foreground">
                    <li className="list-disc">{t('s7.d1')}</li>
                    <li className="list-disc">{t('s7.d2')}</li>
                    <li className="list-disc">{t('s7.d3')}</li>
                    <li className="list-disc">{t('s7.d4')}</li>
                    <li className="list-disc">{t('s7.d5')}</li>
                  </ul>
                </div>

                <div className="rounded-xl bg-gray-100 p-4 text-sm text-gray-800">
                  <strong>{t('s7.maxLiability')}</strong> {t('s7.maxLiabilityText')}
                </div>

                <div>
                  <h4 className="mb-3 font-semibold">{t('s7.indemnityTitle')}</h4>
                  <p className="text-muted-foreground">{t('s7.indemnityText')}</p>
                </div>
              </div>
            </div>

            {/* 8. Dispute Resolution */}
            <div className="mb-12">
              <h2 className="mb-6 text-3xl">{t('s8.title')}</h2>
              <div className="space-y-4 text-muted-foreground">
                <div>
                  <h4 className="mb-3 font-semibold">{t('s8.s81Title')}</h4>
                  <p>{t('s8.s81Text')}</p>
                </div>

                <div>
                  <h4 className="mb-3 font-semibold">{t('s8.s82Title')}</h4>
                  <p className="mb-3">{t('s8.s82Intro')}</p>
                  <ul className="ml-6 space-y-2">
                    <li className="list-disc">{t('s8.arb1')}</li>
                    <li className="list-disc">{t('s8.arb2')}</li>
                  </ul>
                </div>

                <div>
                  <h4 className="mb-3 font-semibold">{t('s8.s83Title')}</h4>
                  <p className="font-semibold text-foreground">{t('s8.s83Text')}</p>
                </div>
              </div>
            </div>

            {/* 9. Modifications */}
            <div className="mb-12">
              <h2 className="mb-6 text-3xl">{t('s9.title')}</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>{t('s9.intro')}</p>
                <ul className="ml-6 space-y-2">
                  <li className="list-disc">{t('s9.n1')}</li>
                  <li className="list-disc">{t('s9.n2')}</li>
                  <li className="list-disc">{t('s9.n3')}</li>
                </ul>
                <p>{t('s9.continued')}</p>
              </div>
            </div>

            {/* 10. General Provisions */}
            <div className="mb-12">
              <h2 className="mb-6 text-3xl">{t('s10.title')}</h2>
              <div className="space-y-4 text-muted-foreground">
                <ul className="ml-6 space-y-3">
                  <li className="list-disc">
                    <strong className="text-foreground">{t('s10.g1')}</strong> {t('s10.g1Text')}
                  </li>
                  <li className="list-disc">
                    <strong className="text-foreground">{t('s10.g2')}</strong> {t('s10.g2Text')}
                  </li>
                  <li className="list-disc">
                    <strong className="text-foreground">{t('s10.g3')}</strong> {t('s10.g3Text')}
                  </li>
                  <li className="list-disc">
                    <strong className="text-foreground">{t('s10.g4')}</strong> {t('s10.g4Text')}
                  </li>
                  <li className="list-disc">
                    <strong className="text-foreground">{t('s10.g5')}</strong> {t('s10.g5Text')}
                  </li>
                </ul>
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
                    <a href="mailto:legal@gydi.com" className="text-primary hover:underline">legal@gydi.com</a>
                  </p>
                  <p>
                    <strong className="text-foreground">{t('contact.address')}</strong> {t('contact.addressValue')}
                  </p>
                  <p>
                    <strong className="text-foreground">{t('contact.phone')}</strong> +1 (234) 567-890
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
