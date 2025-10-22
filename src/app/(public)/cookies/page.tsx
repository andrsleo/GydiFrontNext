import Link from 'next/link';
import { Cookie, Settings, Eye, BarChart, Shield, Info } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Política de Cookies',
  description: 'Política de cookies de GYDI. Aprende qué cookies usamos, por qué las usamos y cómo puedes gestionarlas.',
};

export default function CookiesPage() {
  const lastUpdated = 'Octubre 2025';

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50/50 to-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b bg-gradient-to-br from-primary/5 via-blue-500/5 to-purple-500/5 py-16 sm:py-20">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:64px_64px]" />

        <div className="container relative mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary backdrop-blur-sm">
              <Cookie className="h-4 w-4" />
              <span>Última actualización: {lastUpdated}</span>
            </div>

            <h1 className="mb-6">
              Política de{' '}
              <span className="bg-gradient-to-r from-primary via-blue-600 to-purple-600 bg-clip-text text-transparent">
                Cookies
              </span>
            </h1>

            <p className="text-lg text-muted-foreground">
              Esta política explica cómo GYDI utiliza cookies y tecnologías similares para mejorar tu experiencia
              en nuestra plataforma.
            </p>
          </div>
        </div>
      </section>

      {/* Quick Access */}
      <section className="border-b bg-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
            <span className="font-semibold text-foreground">Ir a:</span>
            <a href="#que-son" className="text-primary hover:underline">¿Qué son las Cookies?</a>
            <span className="text-muted-foreground">•</span>
            <a href="#tipos" className="text-primary hover:underline">Tipos de Cookies</a>
            <span className="text-muted-foreground">•</span>
            <a href="#usamos" className="text-primary hover:underline">Cookies que Usamos</a>
            <span className="text-muted-foreground">•</span>
            <a href="#gestionar" className="text-primary hover:underline">Gestionar Cookies</a>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            {/* Introduction */}
            <div className="mb-12 rounded-2xl border-l-4 border-primary bg-primary/5 p-6">
              <h3 className="mb-3 text-xl font-bold">¿Por qué usamos Cookies?</h3>
              <p className="leading-relaxed text-muted-foreground">
                Las cookies nos ayudan a proporcionar, proteger y mejorar GYDI. Nos permiten recordar tus preferencias,
                entender cómo usas nuestra plataforma, personalizar tu experiencia y rastrear referidos de afiliados
                para garantizar pagos justos.
              </p>
            </div>

            {/* 1. ¿Qué son las Cookies? */}
            <div id="que-son" className="mb-12">
              <div className="mb-6 flex items-center gap-3">
                <div className="rounded-xl bg-primary/10 p-3">
                  <Info className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-3xl">1. ¿Qué son las Cookies?</h2>
              </div>

              <div className="space-y-4 text-muted-foreground">
                <p>
                  Las cookies son pequeños archivos de texto que se almacenan en tu dispositivo (computadora, tablet,
                  smartphone) cuando visitas un sitio web. Permiten que el sitio web "recuerde" tus acciones y
                  preferencias durante un período de tiempo.
                </p>

                <div className="rounded-xl bg-blue-50 p-6">
                  <h4 className="mb-3 font-semibold text-blue-900">Tecnologías Similares</h4>
                  <p className="text-sm text-blue-800">
                    Además de cookies, usamos tecnologías similares como <strong>web beacons</strong> (píxeles de seguimiento),
                    <strong> localStorage</strong>, <strong>sessionStorage</strong> y <strong>SDKs móviles</strong>.
                    Esta política se aplica a todas estas tecnologías.
                  </p>
                </div>
              </div>
            </div>

            {/* 2. Tipos de Cookies */}
            <div id="tipos" className="mb-12">
              <h2 className="mb-6 text-3xl">2. Tipos de Cookies</h2>

              <div className="space-y-6">
                <div className="rounded-2xl border border-border/50 bg-card p-6">
                  <h4 className="mb-3 flex items-center gap-2 font-semibold text-primary">
                    <Shield className="h-5 w-5" />
                    Por Duración
                  </h4>
                  <div className="space-y-3 text-sm">
                    <div>
                      <strong className="text-foreground">Cookies de Sesión:</strong>
                      <p className="text-muted-foreground">
                        Temporales. Se eliminan cuando cierras tu navegador. Esenciales para navegar por el sitio.
                      </p>
                    </div>
                    <div>
                      <strong className="text-foreground">Cookies Persistentes:</strong>
                      <p className="text-muted-foreground">
                        Permanecen en tu dispositivo por un período específico (días, meses, años) o hasta que las elimines manualmente.
                        Usadas para recordar preferencias y rastrear referidos.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-border/50 bg-card p-6">
                  <h4 className="mb-3 flex items-center gap-2 font-semibold text-blue-600">
                    <Settings className="h-5 w-5" />
                    Por Procedencia
                  </h4>
                  <div className="space-y-3 text-sm">
                    <div>
                      <strong className="text-foreground">Cookies Propias (First-Party):</strong>
                      <p className="text-muted-foreground">
                        Establecidas directamente por GYDI. Controlamos completamente cómo se usan estos datos.
                      </p>
                    </div>
                    <div>
                      <strong className="text-foreground">Cookies de Terceros (Third-Party):</strong>
                      <p className="text-muted-foreground">
                        Establecidas por servicios externos (Google Analytics, Stripe, etc.). Consulta sus políticas
                        de privacidad para más información.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Cookies que Usamos */}
            <div id="usamos" className="mb-12">
              <h2 className="mb-6 text-3xl">3. Cookies que Usamos</h2>

              <div className="space-y-6">
                {/* Strictly Necessary */}
                <div className="overflow-hidden rounded-2xl border-2 border-red-200">
                  <div className="bg-red-50 p-4">
                    <div className="flex items-center gap-3">
                      <Shield className="h-6 w-6 text-red-600" />
                      <div>
                        <h4 className="font-semibold text-red-900">Cookies Estrictamente Necesarias</h4>
                        <p className="text-sm text-red-700">Requeridas • No se pueden desactivar</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="mb-4 text-sm text-muted-foreground">
                      Esenciales para el funcionamiento básico del sitio. Sin estas cookies, la plataforma no puede funcionar correctamente.
                    </p>
                    {/* Desktop Table */}
                    <div className="hidden overflow-x-auto sm:block">
                      <table className="w-full text-sm">
                        <thead className="border-b bg-gray-50">
                          <tr>
                            <th className="p-3 text-left font-semibold">Cookie</th>
                            <th className="p-3 text-left font-semibold">Propósito</th>
                            <th className="p-3 text-left font-semibold">Duración</th>
                          </tr>
                        </thead>
                        <tbody className="text-muted-foreground">
                          <tr className="border-b">
                            <td className="p-3 font-mono">session_id</td>
                            <td className="p-3">Mantener tu sesión activa</td>
                            <td className="p-3">Sesión</td>
                          </tr>
                          <tr className="border-b">
                            <td className="p-3 font-mono">csrf_token</td>
                            <td className="p-3">Protección contra ataques CSRF</td>
                            <td className="p-3">Sesión</td>
                          </tr>
                          <tr className="border-b">
                            <td className="p-3 font-mono">cookie_consent</td>
                            <td className="p-3">Recordar tus preferencias de cookies</td>
                            <td className="p-3">1 año</td>
                          </tr>
                          <tr>
                            <td className="p-3 font-mono">load_balancer</td>
                            <td className="p-3">Distribuir tráfico entre servidores</td>
                            <td className="p-3">Sesión</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    {/* Mobile List */}
                    <div className="space-y-3 sm:hidden">
                      <div className="rounded-lg border bg-card p-3">
                        <div className="mb-1 font-mono text-sm font-semibold">session_id</div>
                        <div className="text-xs text-muted-foreground">Mantener tu sesión activa</div>
                        <div className="mt-1 text-xs font-medium text-primary">Duración: Sesión</div>
                      </div>
                      <div className="rounded-lg border bg-card p-3">
                        <div className="mb-1 font-mono text-sm font-semibold">csrf_token</div>
                        <div className="text-xs text-muted-foreground">Protección contra ataques CSRF</div>
                        <div className="mt-1 text-xs font-medium text-primary">Duración: Sesión</div>
                      </div>
                      <div className="rounded-lg border bg-card p-3">
                        <div className="mb-1 font-mono text-sm font-semibold">cookie_consent</div>
                        <div className="text-xs text-muted-foreground">Recordar tus preferencias de cookies</div>
                        <div className="mt-1 text-xs font-medium text-primary">Duración: 1 año</div>
                      </div>
                      <div className="rounded-lg border bg-card p-3">
                        <div className="mb-1 font-mono text-sm font-semibold">load_balancer</div>
                        <div className="text-xs text-muted-foreground">Distribuir tráfico entre servidores</div>
                        <div className="mt-1 text-xs font-medium text-primary">Duración: Sesión</div>
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
                        <h4 className="font-semibold text-blue-900">Cookies Funcionales</h4>
                        <p className="text-sm text-blue-700">Mejoran la experiencia • Opcionales</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="mb-4 text-sm text-muted-foreground">
                      Permiten recordar tus elecciones (idioma, moneda, preferencias) para proporcionar una experiencia personalizada.
                    </p>
                    {/* Desktop Table */}
                    <div className="hidden overflow-x-auto sm:block">
                      <table className="w-full text-sm">
                        <thead className="border-b bg-gray-50">
                          <tr>
                            <th className="p-3 text-left font-semibold">Cookie</th>
                            <th className="p-3 text-left font-semibold">Propósito</th>
                            <th className="p-3 text-left font-semibold">Duración</th>
                          </tr>
                        </thead>
                        <tbody className="text-muted-foreground">
                          <tr className="border-b">
                            <td className="p-3 font-mono">language_pref</td>
                            <td className="p-3">Recordar tu idioma preferido</td>
                            <td className="p-3">1 año</td>
                          </tr>
                          <tr className="border-b">
                            <td className="p-3 font-mono">currency_pref</td>
                            <td className="p-3">Recordar tu moneda preferida</td>
                            <td className="p-3">1 año</td>
                          </tr>
                          <tr className="border-b">
                            <td className="p-3 font-mono">theme_mode</td>
                            <td className="p-3">Modo claro/oscuro</td>
                            <td className="p-3">1 año</td>
                          </tr>
                          <tr>
                            <td className="p-3 font-mono">referral_id</td>
                            <td className="p-3">Rastrear enlace de afiliado que te trajo</td>
                            <td className="p-3">30 días</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    {/* Mobile List */}
                    <div className="space-y-3 sm:hidden">
                      <div className="rounded-lg border bg-card p-3">
                        <div className="mb-1 font-mono text-sm font-semibold">language_pref</div>
                        <div className="text-xs text-muted-foreground">Recordar tu idioma preferido</div>
                        <div className="mt-1 text-xs font-medium text-blue-600">Duración: 1 año</div>
                      </div>
                      <div className="rounded-lg border bg-card p-3">
                        <div className="mb-1 font-mono text-sm font-semibold">currency_pref</div>
                        <div className="text-xs text-muted-foreground">Recordar tu moneda preferida</div>
                        <div className="mt-1 text-xs font-medium text-blue-600">Duración: 1 año</div>
                      </div>
                      <div className="rounded-lg border bg-card p-3">
                        <div className="mb-1 font-mono text-sm font-semibold">theme_mode</div>
                        <div className="text-xs text-muted-foreground">Modo claro/oscuro</div>
                        <div className="mt-1 text-xs font-medium text-blue-600">Duración: 1 año</div>
                      </div>
                      <div className="rounded-lg border bg-card p-3">
                        <div className="mb-1 font-mono text-sm font-semibold">referral_id</div>
                        <div className="text-xs text-muted-foreground">Rastrear enlace de afiliado que te trajo</div>
                        <div className="mt-1 text-xs font-medium text-blue-600">Duración: 30 días</div>
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
                        <h4 className="font-semibold text-purple-900">Cookies de Analíticas</h4>
                        <p className="text-sm text-purple-700">Ayudan a mejorar • Opcionales</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="mb-4 text-sm text-muted-foreground">
                      Nos ayudan a entender cómo los visitantes usan GYDI, qué páginas son más populares y cómo mejorar el sitio.
                    </p>
                    {/* Desktop Table */}
                    <div className="hidden overflow-x-auto md:block">
                      <table className="w-full text-sm">
                        <thead className="border-b bg-gray-50">
                          <tr>
                            <th className="p-3 text-left font-semibold">Proveedor</th>
                            <th className="p-3 text-left font-semibold">Cookies</th>
                            <th className="p-3 text-left font-semibold">Propósito</th>
                            <th className="p-3 text-left font-semibold">Más info</th>
                          </tr>
                        </thead>
                        <tbody className="text-muted-foreground">
                          <tr className="border-b">
                            <td className="p-3 font-semibold">Google Analytics</td>
                            <td className="p-3 font-mono text-xs">_ga, _gid, _gat</td>
                            <td className="p-3">Analizar tráfico y uso del sitio</td>
                            <td className="p-3">
                              <a href="https://policies.google.com/privacy" target="_blank" rel="noopener" className="text-primary hover:underline">
                                Política
                              </a>
                            </td>
                          </tr>
                          <tr className="border-b">
                            <td className="p-3 font-semibold">Mixpanel</td>
                            <td className="p-3 font-mono text-xs">mp_*</td>
                            <td className="p-3">Analytics de producto y comportamiento</td>
                            <td className="p-3">
                              <a href="https://mixpanel.com/legal/privacy-policy" target="_blank" rel="noopener" className="text-primary hover:underline">
                                Política
                              </a>
                            </td>
                          </tr>
                          <tr>
                            <td className="p-3 font-semibold">Hotjar</td>
                            <td className="p-3 font-mono text-xs">_hjid, _hjSession*</td>
                            <td className="p-3">Mapas de calor y grabaciones de sesión</td>
                            <td className="p-3">
                              <a href="https://www.hotjar.com/legal/policies/privacy" target="_blank" rel="noopener" className="text-primary hover:underline">
                                Política
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
                            Política →
                          </a>
                        </div>
                        <div className="mb-2 rounded bg-gray-100 px-2 py-1">
                          <code className="text-xs">_ga, _gid, _gat</code>
                        </div>
                        <p className="text-xs text-muted-foreground">Analizar tráfico y uso del sitio</p>
                      </div>

                      <div className="rounded-lg border bg-card p-4">
                        <div className="mb-2 flex items-center justify-between">
                          <span className="font-bold text-foreground">Mixpanel</span>
                          <a href="https://mixpanel.com/legal/privacy-policy" target="_blank" rel="noopener" className="text-xs text-primary hover:underline">
                            Política →
                          </a>
                        </div>
                        <div className="mb-2 rounded bg-gray-100 px-2 py-1">
                          <code className="text-xs">mp_*</code>
                        </div>
                        <p className="text-xs text-muted-foreground">Analytics de producto y comportamiento</p>
                      </div>

                      <div className="rounded-lg border bg-card p-4">
                        <div className="mb-2 flex items-center justify-between">
                          <span className="font-bold text-foreground">Hotjar</span>
                          <a href="https://www.hotjar.com/legal/policies/privacy" target="_blank" rel="noopener" className="text-xs text-primary hover:underline">
                            Política →
                          </a>
                        </div>
                        <div className="mb-2 rounded bg-gray-100 px-2 py-1">
                          <code className="text-xs">_hjid, _hjSession*</code>
                        </div>
                        <p className="text-xs text-muted-foreground">Mapas de calor y grabaciones de sesión</p>
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
                        <h4 className="font-semibold text-orange-900">Cookies de Marketing</h4>
                        <p className="text-sm text-orange-700">Publicidad personalizada • Opcionales</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="mb-4 text-sm text-muted-foreground">
                      Usadas para mostrar anuncios relevantes y medir la efectividad de campañas publicitarias.
                    </p>
                    {/* Desktop Table */}
                    <div className="hidden overflow-x-auto md:block">
                      <table className="w-full text-sm">
                        <thead className="border-b bg-gray-50">
                          <tr>
                            <th className="p-3 text-left font-semibold">Proveedor</th>
                            <th className="p-3 text-left font-semibold">Cookies</th>
                            <th className="p-3 text-left font-semibold">Propósito</th>
                            <th className="p-3 text-left font-semibold">Más info</th>
                          </tr>
                        </thead>
                        <tbody className="text-muted-foreground">
                          <tr className="border-b">
                            <td className="p-3 font-semibold">Facebook Pixel</td>
                            <td className="p-3 font-mono text-xs">_fbp, fr</td>
                            <td className="p-3">Remarketing y conversión en Facebook</td>
                            <td className="p-3">
                              <a href="https://www.facebook.com/privacy/policy" target="_blank" rel="noopener" className="text-primary hover:underline">
                                Política
                              </a>
                            </td>
                          </tr>
                          <tr className="border-b">
                            <td className="p-3 font-semibold">Google Ads</td>
                            <td className="p-3 font-mono text-xs">_gcl_*, IDE</td>
                            <td className="p-3">Seguimiento de conversiones y remarketing</td>
                            <td className="p-3">
                              <a href="https://policies.google.com/privacy" target="_blank" rel="noopener" className="text-primary hover:underline">
                                Política
                              </a>
                            </td>
                          </tr>
                          <tr>
                            <td className="p-3 font-semibold">LinkedIn Insight</td>
                            <td className="p-3 font-mono text-xs">li_*, bcookie</td>
                            <td className="p-3">Analytics y publicidad en LinkedIn</td>
                            <td className="p-3">
                              <a href="https://www.linkedin.com/legal/privacy-policy" target="_blank" rel="noopener" className="text-primary hover:underline">
                                Política
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
                            Política →
                          </a>
                        </div>
                        <div className="mb-2 rounded bg-gray-100 px-2 py-1">
                          <code className="text-xs">_fbp, fr</code>
                        </div>
                        <p className="text-xs text-muted-foreground">Remarketing y conversión en Facebook</p>
                      </div>

                      <div className="rounded-lg border bg-card p-4">
                        <div className="mb-2 flex items-center justify-between">
                          <span className="font-bold text-foreground">Google Ads</span>
                          <a href="https://policies.google.com/privacy" target="_blank" rel="noopener" className="text-xs text-primary hover:underline">
                            Política →
                          </a>
                        </div>
                        <div className="mb-2 rounded bg-gray-100 px-2 py-1">
                          <code className="text-xs">_gcl_*, IDE</code>
                        </div>
                        <p className="text-xs text-muted-foreground">Seguimiento de conversiones y remarketing</p>
                      </div>

                      <div className="rounded-lg border bg-card p-4">
                        <div className="mb-2 flex items-center justify-between">
                          <span className="font-bold text-foreground">LinkedIn Insight</span>
                          <a href="https://www.linkedin.com/legal/privacy-policy" target="_blank" rel="noopener" className="text-xs text-primary hover:underline">
                            Política →
                          </a>
                        </div>
                        <div className="mb-2 rounded bg-gray-100 px-2 py-1">
                          <code className="text-xs">li_*, bcookie</code>
                        </div>
                        <p className="text-xs text-muted-foreground">Analytics y publicidad en LinkedIn</p>
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
                <h2 className="text-3xl">4. Cómo Gestionar Cookies</h2>
              </div>

              <div className="space-y-6">
                <div className="rounded-2xl bg-gradient-to-br from-green-50 to-blue-50 p-6">
                  <h4 className="mb-4 font-semibold">Opciones de Gestión</h4>
                  <div className="space-y-4 text-sm">
                    <div className="flex items-start gap-3">
                      <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-green-600 text-xs font-bold text-white">
                        1
                      </div>
                      <div>
                        <strong className="text-foreground">Centro de Preferencias de Cookies (en nuestro sitio)</strong>
                        <p className="text-muted-foreground">
                          Usa el banner de cookies al visitar el sitio o accede a Configuración → Privacidad en tu cuenta.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                        2
                      </div>
                      <div>
                        <strong className="text-foreground">Configuración del Navegador</strong>
                        <p className="mb-2 text-muted-foreground">
                          Todos los navegadores te permiten gestionar cookies:
                        </p>
                        <ul className="ml-4 space-y-1 text-muted-foreground">
                          <li className="list-disc">
                            <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener" className="text-primary hover:underline">
                              Google Chrome
                            </a>
                          </li>
                          <li className="list-disc">
                            <a href="https://support.mozilla.org/es/kb/habilitar-y-deshabilitar-cookies-sitios-web-rastrear-preferencias" target="_blank" rel="noopener" className="text-primary hover:underline">
                              Mozilla Firefox
                            </a>
                          </li>
                          <li className="list-disc">
                            <a href="https://support.apple.com/es-es/guide/safari/sfri11471/mac" target="_blank" rel="noopener" className="text-primary hover:underline">
                              Safari
                            </a>
                          </li>
                          <li className="list-disc">
                            <a href="https://support.microsoft.com/es-es/microsoft-edge/eliminar-las-cookies-en-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener" className="text-primary hover:underline">
                              Microsoft Edge
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
                        <strong className="text-foreground">Opt-out de Publicidad</strong>
                        <p className="mb-2 text-muted-foreground">
                          Rechaza publicidad personalizada:
                        </p>
                        <ul className="ml-4 space-y-1 text-muted-foreground">
                          <li className="list-disc">
                            <a href="https://optout.aboutads.info" target="_blank" rel="noopener" className="text-primary hover:underline">
                              Digital Advertising Alliance (DAA)
                            </a>
                          </li>
                          <li className="list-disc">
                            <a href="https://www.youronlinechoices.com" target="_blank" rel="noopener" className="text-primary hover:underline">
                              Your Online Choices (Europa)
                            </a>
                          </li>
                          <li className="list-disc">
                            <a href="https://adssettings.google.com" target="_blank" rel="noopener" className="text-primary hover:underline">
                              Google Ad Settings
                            </a>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border-2 border-yellow-200 bg-yellow-50 p-6">
                  <h4 className="mb-3 font-semibold text-yellow-900">⚠️ Consecuencias de Desactivar Cookies</h4>
                  <p className="text-sm text-yellow-800">
                    Si bloqueas o eliminas cookies, algunas funciones de GYDI pueden no funcionar correctamente:
                  </p>
                  <ul className="ml-6 mt-2 space-y-1 text-sm text-yellow-800">
                    <li className="list-disc">No podrás mantener sesión iniciada</li>
                    <li className="list-disc">Tus preferencias (idioma, moneda) no se guardarán</li>
                    <li className="list-disc">Los referidos de afiliados pueden no rastrearse correctamente</li>
                    <li className="list-disc">La experiencia de usuario será menos personalizada</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 5. Do Not Track */}
            <div className="mb-12">
              <h2 className="mb-6 text-3xl">5. Do Not Track (DNT)</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Algunos navegadores ofrecen una señal "Do Not Track" (DNT). Actualmente, no hay estándar industrial
                  sobre cómo responder a DNT. GYDI no responde a señales DNT, pero puedes gestionar cookies mediante
                  las opciones descritas arriba.
                </p>
              </div>
            </div>

            {/* 6. Cookies de Afiliados */}
            <div className="mb-12">
              <h2 className="mb-6 text-3xl">6. Cookies de Afiliados</h2>
              <div className="space-y-4 text-muted-foreground">
                <p className="font-semibold text-foreground">
                  Las cookies de rastreo de afiliados son esenciales para nuestro modelo de negocio.
                </p>
                <p>
                  Cuando haces clic en un enlace de afiliado, establecemos una cookie (<code className="rounded bg-gray-100 px-1 py-0.5 text-xs">referral_id</code>)
                  que dura 30 días. Si realizas una compra o reserva dentro de ese período, el afiliado recibe su comisión.
                </p>
                <div className="rounded-xl bg-purple-50 p-4">
                  <strong className="text-purple-900">Importante para Afiliados:</strong>
                  <p className="mt-2 text-sm text-purple-800">
                    Si tus referidos bloquean cookies, es posible que no se rastreen correctamente y pierdas comisiones.
                    Recomendamos incluir un aviso en tus promociones informando que las cookies son necesarias para
                    rastrear referidos.
                  </p>
                </div>
              </div>
            </div>

            {/* 7. Cambios a esta Política */}
            <div className="mb-12">
              <h2 className="mb-6 text-3xl">7. Cambios a esta Política</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Podemos actualizar esta política ocasionalmente para reflejar cambios en nuestras prácticas de cookies
                  o requisitos legales. Te notificaremos sobre cambios significativos mediante:
                </p>
                <ul className="ml-6 space-y-2">
                  <li className="list-disc">Actualización de la fecha "Última actualización"</li>
                  <li className="list-disc">Banner de cookies actualizado en tu próxima visita</li>
                  <li className="list-disc">Email (para cambios importantes)</li>
                </ul>
              </div>
            </div>

            {/* Contact */}
            <div className="rounded-3xl border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-blue-500/5 p-8">
              <h2 className="mb-4 text-3xl">Contacto</h2>
              <div className="space-y-3 text-muted-foreground">
                <p>
                  Para preguntas sobre cookies o esta política:
                </p>
                <div className="space-y-1">
                  <p><strong className="text-foreground">Email:</strong>{' '}
                    <a href="mailto:privacy@gydi.com" className="text-primary hover:underline">privacy@gydi.com</a>
                  </p>
                  <p><strong className="text-foreground">Configuración de Cookies:</strong> Accede desde tu{' '}
                    <Link href="/dashboard/configuracion" className="text-primary hover:underline">Panel de Control</Link>
                  </p>
                </div>

                <div className="mt-6 rounded-xl bg-primary/10 p-4">
                  <p className="text-sm text-foreground">
                    💡 <strong>Consejo:</strong> Si tienes dudas sobre cómo las cookies afectan tus ganancias como afiliado,
                    consulta nuestra{' '}
                    <Link href="/contact" className="text-primary hover:underline">página de contacto</Link> o nuestra{' '}
                    <Link href="/privacy" className="text-primary hover:underline">Política de Privacidad</Link>.
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
