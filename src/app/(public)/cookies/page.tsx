'use client';

import Link from 'next/link';
import { Cookie, Settings, Eye, BarChart, Shield, Info } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';

export default function CookiesPage() {
  const { t } = useTranslation('cookies');
  const lastUpdated = t('lastUpdated');

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50/50 to-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b bg-gradient-to-br from-primary/5 via-blue-500/5 to-purple-500/5 py-16 sm:py-20">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:64px_64px]" />

        <div className="container relative mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary backdrop-blur-sm">
              <Cookie className="h-4 w-4" />
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

      {/* Quick Access */}
      <section className="border-b bg-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
            <span className="font-semibold text-foreground">{t('quickLinks.goTo')}</span>
            <a href="#que-son" className="text-primary hover:underline">{t('quickLinks.whatAre')}</a>
            <span className="text-muted-foreground">•</span>
            <a href="#tipos" className="text-primary hover:underline">{t('quickLinks.types')}</a>
            <span className="text-muted-foreground">•</span>
            <a href="#usamos" className="text-primary hover:underline">{t('quickLinks.weUse')}</a>
            <span className="text-muted-foreground">•</span>
            <a href="#gestionar" className="text-primary hover:underline">{t('quickLinks.manage')}</a>
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

            {/* 1. ¿Qué son las Cookies? */}
            <div id="que-son" className="mb-12">
              <div className="mb-6 flex items-center gap-3">
                <div className="rounded-xl bg-primary/10 p-3">
                  <Info className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-3xl">{t('s1.title')}</h2>
              </div>

              <div className="space-y-4 text-muted-foreground">
                <p>{t('s1.p1')}</p>

                <div className="rounded-xl bg-blue-50 p-6">
                  <h4 className="mb-3 font-semibold text-blue-900">{t('s1.techTitle')}</h4>
                  <p className="text-sm text-blue-800">
                    {t('s1.techText')}
                  </p>
                </div>
              </div>
            </div>

            {/* 2. Tipos de Cookies */}
            <div id="tipos" className="mb-12">
              <h2 className="mb-6 text-3xl">{t('s2.title')}</h2>

              <div className="space-y-6">
                <div className="rounded-2xl border border-border/50 bg-card p-6">
                  <h4 className="mb-3 flex items-center gap-2 font-semibold text-primary">
                    <Shield className="h-5 w-5" />
                    {t('s2.durationTitle')}
                  </h4>
                  <div className="space-y-3 text-sm">
                    <div>
                      <strong className="text-foreground">{t('s2.sessionTitle')}</strong>
                      <p className="text-muted-foreground">{t('s2.sessionText')}</p>
                    </div>
                    <div>
                      <strong className="text-foreground">{t('s2.persistentTitle')}</strong>
                      <p className="text-muted-foreground">{t('s2.persistentText')}</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-border/50 bg-card p-6">
                  <h4 className="mb-3 flex items-center gap-2 font-semibold text-blue-600">
                    <Settings className="h-5 w-5" />
                    {t('s2.originTitle')}
                  </h4>
                  <div className="space-y-3 text-sm">
                    <div>
                      <strong className="text-foreground">{t('s2.firstPartyTitle')}</strong>
                      <p className="text-muted-foreground">{t('s2.firstPartyText')}</p>
                    </div>
                    <div>
                      <strong className="text-foreground">{t('s2.thirdPartyTitle')}</strong>
                      <p className="text-muted-foreground">{t('s2.thirdPartyText')}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Cookies que Usamos */}
            <div id="usamos" className="mb-12">
              <h2 className="mb-6 text-3xl">{t('s3.title')}</h2>

              <div className="space-y-6">
                {/* Strictly Necessary */}
                <div className="overflow-hidden rounded-2xl border-2 border-red-200">
                  <div className="bg-red-50 p-4">
                    <div className="flex items-center gap-3">
                      <Shield className="h-6 w-6 text-red-600" />
                      <div>
                        <h4 className="font-semibold text-red-900">{t('s3.necessaryTitle')}</h4>
                        <p className="text-sm text-red-700">{t('s3.necessaryBadge')}</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="mb-4 text-sm text-muted-foreground">{t('s3.necessaryDesc')}</p>
                    {/* Desktop Table */}
                    <div className="hidden overflow-x-auto sm:block">
                      <table className="w-full text-sm">
                        <thead className="border-b bg-gray-50">
                          <tr>
                            <th className="p-3 text-left font-semibold">{t('s3.thCookie')}</th>
                            <th className="p-3 text-left font-semibold">{t('s3.thPurpose')}</th>
                            <th className="p-3 text-left font-semibold">{t('s3.thDuration')}</th>
                          </tr>
                        </thead>
                        <tbody className="text-muted-foreground">
                          <tr className="border-b">
                            <td className="p-3 font-mono">session_id</td>
                            <td className="p-3">{t('s3.session_id_purpose')}</td>
                            <td className="p-3">{t('s3.session_id_duration')}</td>
                          </tr>
                          <tr className="border-b">
                            <td className="p-3 font-mono">csrf_token</td>
                            <td className="p-3">{t('s3.csrf_token_purpose')}</td>
                            <td className="p-3">{t('s3.csrf_token_duration')}</td>
                          </tr>
                          <tr className="border-b">
                            <td className="p-3 font-mono">cookie_consent</td>
                            <td className="p-3">{t('s3.cookie_consent_purpose')}</td>
                            <td className="p-3">{t('s3.cookie_consent_duration')}</td>
                          </tr>
                          <tr>
                            <td className="p-3 font-mono">load_balancer</td>
                            <td className="p-3">{t('s3.load_balancer_purpose')}</td>
                            <td className="p-3">{t('s3.load_balancer_duration')}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    {/* Mobile List */}
                    <div className="space-y-3 sm:hidden">
                      <div className="rounded-lg border bg-card p-3">
                        <div className="mb-1 font-mono text-sm font-semibold">session_id</div>
                        <div className="text-xs text-muted-foreground">{t('s3.session_id_purpose')}</div>
                        <div className="mt-1 text-xs font-medium text-primary">{t('s3.durationLabel')} {t('s3.session_id_duration')}</div>
                      </div>
                      <div className="rounded-lg border bg-card p-3">
                        <div className="mb-1 font-mono text-sm font-semibold">csrf_token</div>
                        <div className="text-xs text-muted-foreground">{t('s3.csrf_token_purpose')}</div>
                        <div className="mt-1 text-xs font-medium text-primary">{t('s3.durationLabel')} {t('s3.csrf_token_duration')}</div>
                      </div>
                      <div className="rounded-lg border bg-card p-3">
                        <div className="mb-1 font-mono text-sm font-semibold">cookie_consent</div>
                        <div className="text-xs text-muted-foreground">{t('s3.cookie_consent_purpose')}</div>
                        <div className="mt-1 text-xs font-medium text-primary">{t('s3.durationLabel')} {t('s3.cookie_consent_duration')}</div>
                      </div>
                      <div className="rounded-lg border bg-card p-3">
                        <div className="mb-1 font-mono text-sm font-semibold">load_balancer</div>
                        <div className="text-xs text-muted-foreground">{t('s3.load_balancer_purpose')}</div>
                        <div className="mt-1 text-xs font-medium text-primary">{t('s3.durationLabel')} {t('s3.load_balancer_duration')}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Functional */}
                <div className="overflow-hidden rounded-2xl border-2 border-blue-200">
                  <div className="bg-blue-50 p-4">
                    <div className="flex items-center gap-3">
                      <Settings className="h-6 w-6 text-blue-600" />
                      <div>
                        <h4 className="font-semibold text-blue-900">{t('s3.functionalTitle')}</h4>
                        <p className="text-sm text-blue-700">{t('s3.functionalBadge')}</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="mb-4 text-sm text-muted-foreground">{t('s3.functionalDesc')}</p>
                    {/* Desktop Table */}
                    <div className="hidden overflow-x-auto sm:block">
                      <table className="w-full text-sm">
                        <thead className="border-b bg-gray-50">
                          <tr>
                            <th className="p-3 text-left font-semibold">{t('s3.thCookie')}</th>
                            <th className="p-3 text-left font-semibold">{t('s3.thPurpose')}</th>
                            <th className="p-3 text-left font-semibold">{t('s3.thDuration')}</th>
                          </tr>
                        </thead>
                        <tbody className="text-muted-foreground">
                          <tr className="border-b">
                            <td className="p-3 font-mono">language_pref</td>
                            <td className="p-3">{t('s3.language_pref_purpose')}</td>
                            <td className="p-3">{t('s3.language_pref_duration')}</td>
                          </tr>
                          <tr className="border-b">
                            <td className="p-3 font-mono">currency_pref</td>
                            <td className="p-3">{t('s3.currency_pref_purpose')}</td>
                            <td className="p-3">{t('s3.currency_pref_duration')}</td>
                          </tr>
                          <tr className="border-b">
                            <td className="p-3 font-mono">theme_mode</td>
                            <td className="p-3">{t('s3.theme_mode_purpose')}</td>
                            <td className="p-3">{t('s3.theme_mode_duration')}</td>
                          </tr>
                          <tr>
                            <td className="p-3 font-mono">referral_id</td>
                            <td className="p-3">{t('s3.referral_id_purpose')}</td>
                            <td className="p-3">{t('s3.referral_id_duration')}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    {/* Mobile List */}
                    <div className="space-y-3 sm:hidden">
                      <div className="rounded-lg border bg-card p-3">
                        <div className="mb-1 font-mono text-sm font-semibold">language_pref</div>
                        <div className="text-xs text-muted-foreground">{t('s3.language_pref_purpose')}</div>
                        <div className="mt-1 text-xs font-medium text-blue-600">{t('s3.durationLabel')} {t('s3.language_pref_duration')}</div>
                      </div>
                      <div className="rounded-lg border bg-card p-3">
                        <div className="mb-1 font-mono text-sm font-semibold">currency_pref</div>
                        <div className="text-xs text-muted-foreground">{t('s3.currency_pref_purpose')}</div>
                        <div className="mt-1 text-xs font-medium text-blue-600">{t('s3.durationLabel')} {t('s3.currency_pref_duration')}</div>
                      </div>
                      <div className="rounded-lg border bg-card p-3">
                        <div className="mb-1 font-mono text-sm font-semibold">theme_mode</div>
                        <div className="text-xs text-muted-foreground">{t('s3.theme_mode_purpose')}</div>
                        <div className="mt-1 text-xs font-medium text-blue-600">{t('s3.durationLabel')} {t('s3.theme_mode_duration')}</div>
                      </div>
                      <div className="rounded-lg border bg-card p-3">
                        <div className="mb-1 font-mono text-sm font-semibold">referral_id</div>
                        <div className="text-xs text-muted-foreground">{t('s3.referral_id_purpose')}</div>
                        <div className="mt-1 text-xs font-medium text-blue-600">{t('s3.durationLabel')} {t('s3.referral_id_duration')}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Analytics */}
                <div className="overflow-hidden rounded-2xl border-2 border-purple-200">
                  <div className="bg-purple-50 p-4">
                    <div className="flex items-center gap-3">
                      <BarChart className="h-6 w-6 text-purple-600" />
                      <div>
                        <h4 className="font-semibold text-purple-900">{t('s3.analyticsTitle')}</h4>
                        <p className="text-sm text-purple-700">{t('s3.analyticsBadge')}</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="mb-4 text-sm text-muted-foreground">{t('s3.analyticsDesc')}</p>
                    {/* Desktop Table */}
                    <div className="hidden overflow-x-auto md:block">
                      <table className="w-full text-sm">
                        <thead className="border-b bg-gray-50">
                          <tr>
                            <th className="p-3 text-left font-semibold">{t('s3.thProvider')}</th>
                            <th className="p-3 text-left font-semibold">{t('s3.thCookie')}</th>
                            <th className="p-3 text-left font-semibold">{t('s3.thPurpose')}</th>
                            <th className="p-3 text-left font-semibold">{t('s3.thMore')}</th>
                          </tr>
                        </thead>
                        <tbody className="text-muted-foreground">
                          <tr className="border-b">
                            <td className="p-3 font-semibold">Google Analytics</td>
                            <td className="p-3 font-mono text-xs">_ga, _gid, _gat</td>
                            <td className="p-3">{t('s3.ga_purpose')}</td>
                            <td className="p-3">
                              <a href="https://policies.google.com/privacy" target="_blank" rel="noopener" className="text-primary hover:underline">
                                {t('s3.policyLink')}
                              </a>
                            </td>
                          </tr>
                          <tr className="border-b">
                            <td className="p-3 font-semibold">Mixpanel</td>
                            <td className="p-3 font-mono text-xs">mp_*</td>
                            <td className="p-3">{t('s3.mixpanel_purpose')}</td>
                            <td className="p-3">
                              <a href="https://mixpanel.com/legal/privacy-policy" target="_blank" rel="noopener" className="text-primary hover:underline">
                                {t('s3.policyLink')}
                              </a>
                            </td>
                          </tr>
                          <tr>
                            <td className="p-3 font-semibold">Hotjar</td>
                            <td className="p-3 font-mono text-xs">_hjid, _hjSession*</td>
                            <td className="p-3">{t('s3.hotjar_purpose')}</td>
                            <td className="p-3">
                              <a href="https://www.hotjar.com/legal/policies/privacy" target="_blank" rel="noopener" className="text-primary hover:underline">
                                {t('s3.policyLink')}
                              </a>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    {/* Mobile Cards */}
                    <div className="space-y-4 md:hidden">
                      <div className="rounded-lg border bg-card p-4">
                        <div className="mb-2 flex items-center justify-between">
                          <span className="font-bold text-foreground">Google Analytics</span>
                          <a href="https://policies.google.com/privacy" target="_blank" rel="noopener" className="text-xs text-primary hover:underline">
                            {t('s3.policyLinkArrow')}
                          </a>
                        </div>
                        <div className="mb-2 rounded bg-gray-100 px-2 py-1">
                          <code className="text-xs">_ga, _gid, _gat</code>
                        </div>
                        <p className="text-xs text-muted-foreground">{t('s3.ga_purpose')}</p>
                      </div>

                      <div className="rounded-lg border bg-card p-4">
                        <div className="mb-2 flex items-center justify-between">
                          <span className="font-bold text-foreground">Mixpanel</span>
                          <a href="https://mixpanel.com/legal/privacy-policy" target="_blank" rel="noopener" className="text-xs text-primary hover:underline">
                            {t('s3.policyLinkArrow')}
                          </a>
                        </div>
                        <div className="mb-2 rounded bg-gray-100 px-2 py-1">
                          <code className="text-xs">mp_*</code>
                        </div>
                        <p className="text-xs text-muted-foreground">{t('s3.mixpanel_purpose')}</p>
                      </div>

                      <div className="rounded-lg border bg-card p-4">
                        <div className="mb-2 flex items-center justify-between">
                          <span className="font-bold text-foreground">Hotjar</span>
                          <a href="https://www.hotjar.com/legal/policies/privacy" target="_blank" rel="noopener" className="text-xs text-primary hover:underline">
                            {t('s3.policyLinkArrow')}
                          </a>
                        </div>
                        <div className="mb-2 rounded bg-gray-100 px-2 py-1">
                          <code className="text-xs">_hjid, _hjSession*</code>
                        </div>
                        <p className="text-xs text-muted-foreground">{t('s3.hotjar_purpose')}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Marketing */}
                <div className="overflow-hidden rounded-2xl border-2 border-orange-200">
                  <div className="bg-orange-50 p-4">
                    <div className="flex items-center gap-3">
                      <Eye className="h-6 w-6 text-orange-600" />
                      <div>
                        <h4 className="font-semibold text-orange-900">{t('s3.marketingTitle')}</h4>
                        <p className="text-sm text-orange-700">{t('s3.marketingBadge')}</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="mb-4 text-sm text-muted-foreground">{t('s3.marketingDesc')}</p>
                    {/* Desktop Table */}
                    <div className="hidden overflow-x-auto md:block">
                      <table className="w-full text-sm">
                        <thead className="border-b bg-gray-50">
                          <tr>
                            <th className="p-3 text-left font-semibold">{t('s3.thProvider')}</th>
                            <th className="p-3 text-left font-semibold">{t('s3.thCookie')}</th>
                            <th className="p-3 text-left font-semibold">{t('s3.thPurpose')}</th>
                            <th className="p-3 text-left font-semibold">{t('s3.thMore')}</th>
                          </tr>
                        </thead>
                        <tbody className="text-muted-foreground">
                          <tr className="border-b">
                            <td className="p-3 font-semibold">Facebook Pixel</td>
                            <td className="p-3 font-mono text-xs">_fbp, fr</td>
                            <td className="p-3">{t('s3.fb_purpose')}</td>
                            <td className="p-3">
                              <a href="https://www.facebook.com/privacy/policy" target="_blank" rel="noopener" className="text-primary hover:underline">
                                {t('s3.policyLink')}
                              </a>
                            </td>
                          </tr>
                          <tr className="border-b">
                            <td className="p-3 font-semibold">Google Ads</td>
                            <td className="p-3 font-mono text-xs">_gcl_*, IDE</td>
                            <td className="p-3">{t('s3.google_ads_purpose')}</td>
                            <td className="p-3">
                              <a href="https://policies.google.com/privacy" target="_blank" rel="noopener" className="text-primary hover:underline">
                                {t('s3.policyLink')}
                              </a>
                            </td>
                          </tr>
                          <tr>
                            <td className="p-3 font-semibold">LinkedIn Insight</td>
                            <td className="p-3 font-mono text-xs">li_*, bcookie</td>
                            <td className="p-3">{t('s3.linkedin_purpose')}</td>
                            <td className="p-3">
                              <a href="https://www.linkedin.com/legal/privacy-policy" target="_blank" rel="noopener" className="text-primary hover:underline">
                                {t('s3.policyLink')}
                              </a>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    {/* Mobile Cards */}
                    <div className="space-y-4 md:hidden">
                      <div className="rounded-lg border bg-card p-4">
                        <div className="mb-2 flex items-center justify-between">
                          <span className="font-bold text-foreground">Facebook Pixel</span>
                          <a href="https://www.facebook.com/privacy/policy" target="_blank" rel="noopener" className="text-xs text-primary hover:underline">
                            {t('s3.policyLinkArrow')}
                          </a>
                        </div>
                        <div className="mb-2 rounded bg-gray-100 px-2 py-1">
                          <code className="text-xs">_fbp, fr</code>
                        </div>
                        <p className="text-xs text-muted-foreground">{t('s3.fb_purpose')}</p>
                      </div>

                      <div className="rounded-lg border bg-card p-4">
                        <div className="mb-2 flex items-center justify-between">
                          <span className="font-bold text-foreground">Google Ads</span>
                          <a href="https://policies.google.com/privacy" target="_blank" rel="noopener" className="text-xs text-primary hover:underline">
                            {t('s3.policyLinkArrow')}
                          </a>
                        </div>
                        <div className="mb-2 rounded bg-gray-100 px-2 py-1">
                          <code className="text-xs">_gcl_*, IDE</code>
                        </div>
                        <p className="text-xs text-muted-foreground">{t('s3.google_ads_purpose')}</p>
                      </div>

                      <div className="rounded-lg border bg-card p-4">
                        <div className="mb-2 flex items-center justify-between">
                          <span className="font-bold text-foreground">LinkedIn Insight</span>
                          <a href="https://www.linkedin.com/legal/privacy-policy" target="_blank" rel="noopener" className="text-xs text-primary hover:underline">
                            {t('s3.policyLinkArrow')}
                          </a>
                        </div>
                        <div className="mb-2 rounded bg-gray-100 px-2 py-1">
                          <code className="text-xs">li_*, bcookie</code>
                        </div>
                        <p className="text-xs text-muted-foreground">{t('s3.linkedin_purpose')}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 4. Gestionar Cookies */}
            <div id="gestionar" className="mb-12">
              <div className="mb-6 flex items-center gap-3">
                <div className="rounded-xl bg-green-500/10 p-3">
                  <Settings className="h-6 w-6 text-green-600" />
                </div>
                <h2 className="text-3xl">{t('s4.title')}</h2>
              </div>

              <div className="space-y-6">
                <div className="rounded-2xl bg-gradient-to-br from-green-50 to-blue-50 p-6">
                  <h4 className="mb-4 font-semibold">{t('s4.optionsTitle')}</h4>
                  <div className="space-y-4 text-sm">
                    <div className="flex items-start gap-3">
                      <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-green-600 text-xs font-bold text-white">
                        1
                      </div>
                      <div>
                        <strong className="text-foreground">{t('s4.step1Title')}</strong>
                        <p className="text-muted-foreground">{t('s4.step1Text')}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                        2
                      </div>
                      <div>
                        <strong className="text-foreground">{t('s4.step2Title')}</strong>
                        <p className="mb-2 text-muted-foreground">{t('s4.step2Text')}</p>
                        <ul className="ml-4 space-y-1 text-muted-foreground">
                          <li className="list-disc">
                            <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener" className="text-primary hover:underline">
                              {t('s4.chrome')}
                            </a>
                          </li>
                          <li className="list-disc">
                            <a href="https://support.mozilla.org/es/kb/habilitar-y-deshabilitar-cookies-sitios-web-rastrear-preferencias" target="_blank" rel="noopener" className="text-primary hover:underline">
                              {t('s4.firefox')}
                            </a>
                          </li>
                          <li className="list-disc">
                            <a href="https://support.apple.com/es-es/guide/safari/sfri11471/mac" target="_blank" rel="noopener" className="text-primary hover:underline">
                              {t('s4.safari')}
                            </a>
                          </li>
                          <li className="list-disc">
                            <a href="https://support.microsoft.com/es-es/microsoft-edge/eliminar-las-cookies-en-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener" className="text-primary hover:underline">
                              {t('s4.edge')}
                            </a>
                          </li>
                        </ul>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-purple-600 text-xs font-bold text-white">
                        3
                      </div>
                      <div>
                        <strong className="text-foreground">{t('s4.step3Title')}</strong>
                        <p className="mb-2 text-muted-foreground">{t('s4.step3Text')}</p>
                        <ul className="ml-4 space-y-1 text-muted-foreground">
                          <li className="list-disc">
                            <a href="https://optout.aboutads.info" target="_blank" rel="noopener" className="text-primary hover:underline">
                              {t('s4.daa')}
                            </a>
                          </li>
                          <li className="list-disc">
                            <a href="https://www.youronlinechoices.com" target="_blank" rel="noopener" className="text-primary hover:underline">
                              {t('s4.yourChoices')}
                            </a>
                          </li>
                          <li className="list-disc">
                            <a href="https://adssettings.google.com" target="_blank" rel="noopener" className="text-primary hover:underline">
                              {t('s4.googleAds')}
                            </a>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border-2 border-yellow-200 bg-yellow-50 p-6">
                  <h4 className="mb-3 font-semibold text-yellow-900">{t('s4.warningTitle')}</h4>
                  <p className="text-sm text-yellow-800">{t('s4.warningText')}</p>
                  <ul className="ml-6 mt-2 space-y-1 text-sm text-yellow-800">
                    <li className="list-disc">{t('s4.w1')}</li>
                    <li className="list-disc">{t('s4.w2')}</li>
                    <li className="list-disc">{t('s4.w3')}</li>
                    <li className="list-disc">{t('s4.w4')}</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 5. Do Not Track */}
            <div className="mb-12">
              <h2 className="mb-6 text-3xl">{t('s5.title')}</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>{t('s5.text')}</p>
              </div>
            </div>

            {/* 6. Cookies de referidos */}
            <div className="mb-12">
              <h2 className="mb-6 text-3xl">{t('s6.title')}</h2>
              <div className="space-y-4 text-muted-foreground">
                <p className="font-semibold text-foreground">{t('s6.highlight')}</p>
                <p>
                  {t('s6.p1Pre')}
                  <code className="rounded bg-gray-100 px-1 py-0.5 text-xs">referral_id</code>
                  {t('s6.p1Post')}
                </p>
                <div className="rounded-xl bg-purple-50 p-4">
                  <strong className="text-purple-900">{t('s6.importantTitle')}</strong>
                  <p className="mt-2 text-sm text-purple-800">{t('s6.importantText')}</p>
                </div>
              </div>
            </div>

            {/* 7. Cambios a esta Política */}
            <div className="mb-12">
              <h2 className="mb-6 text-3xl">{t('s7.title')}</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>{t('s7.intro')}</p>
                <ul className="ml-6 space-y-2">
                  <li className="list-disc">{t('s7.n1')}</li>
                  <li className="list-disc">{t('s7.n2')}</li>
                  <li className="list-disc">{t('s7.n3')}</li>
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
                    <a href="mailto:privacy@gydi.com" className="text-primary hover:underline">privacy@gydi.com</a>
                  </p>
                  <p>
                    <strong className="text-foreground">{t('contact.settingsLabel')}</strong>{' '}
                    {t('contact.settingsText')}{' '}
                    <Link href="/dashboard/configuracion" className="text-primary hover:underline">{t('contact.settingsLink')}</Link>
                  </p>
                </div>

                <div className="mt-6 rounded-xl bg-primary/10 p-4">
                  <p className="text-sm text-foreground">
                    {t('contact.tipPre')}{' '}
                    <Link href="/contact" className="text-primary hover:underline">{t('contact.tipContact')}</Link>{' '}
                    {t('contact.tipMid')}{' '}
                    <Link href="/privacy" className="text-primary hover:underline">{t('contact.tipPrivacy')}</Link>
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
