import Link from 'next/link';
import { FileText, AlertTriangle, DollarSign, Shield, Users, Building2 } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Términos y Condiciones',
  description: 'Términos y condiciones de uso de la plataforma GYDI. Lee las reglas y responsabilidades para anfitriones y afiliados de propiedades en renta.',
};

export default function TermsPage() {
  const lastUpdated = 'Octubre 2025';

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50/50 to-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b bg-gradient-to-br from-primary/5 via-blue-500/5 to-purple-500/5 py-16 sm:py-20">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:64px_64px]" />

        <div className="container relative mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary backdrop-blur-sm">
              <FileText className="h-4 w-4" />
              <span>Última actualización: {lastUpdated}</span>
            </div>

            <h1 className="mb-6">
              Términos y{' '}
              <span className="bg-gradient-to-r from-primary via-blue-600 to-purple-600 bg-clip-text text-transparent">
                Condiciones
              </span>
            </h1>

            <p className="text-lg text-muted-foreground">
              Al usar GYDI, aceptas los siguientes términos. Por favor, léelos cuidadosamente antes de crear una cuenta.
            </p>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="border-b bg-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
            <span className="font-semibold text-foreground">Ir a:</span>
            <a href="#aceptacion" className="text-primary hover:underline">Aceptación</a>
            <span className="text-muted-foreground">•</span>
            <a href="#servicios" className="text-primary hover:underline">Servicios</a>
            <span className="text-muted-foreground">•</span>
            <a href="#cuentas" className="text-primary hover:underline">Cuentas</a>
            <span className="text-muted-foreground">•</span>
            <a href="#comisiones" className="text-primary hover:underline">Comisiones</a>
            <span className="text-muted-foreground">•</span>
            <a href="#prohibiciones" className="text-primary hover:underline">Prohibiciones</a>
            <span className="text-muted-foreground">•</span>
            <a href="#responsabilidad" className="text-primary hover:underline">Responsabilidad</a>
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
                  <h3 className="mb-2 text-xl font-bold text-yellow-900">Aviso Importante</h3>
                  <p className="leading-relaxed text-yellow-800">
                    Estos términos constituyen un acuerdo legal vinculante entre tú y GYDI. Al crear una cuenta
                    o usar nuestros servicios, confirmas que has leído, entendido y aceptado estos términos en su totalidad.
                    Si no estás de acuerdo, no uses nuestra plataforma.
                  </p>
                </div>
              </div>
            </div>

            {/* 1. Aceptación de Términos */}
            <div id="aceptacion" className="mb-12">
              <h2 className="mb-6 text-3xl">1. Aceptación de Términos</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Al acceder o usar GYDI ("la Plataforma", "el Servicio"), aceptas estar legalmente vinculado por
                  estos Términos y Condiciones ("Términos"), nuestra{' '}
                  <Link href="/privacy" className="text-primary hover:underline">Política de Privacidad</Link> y nuestra{' '}
                  <Link href="/cookies" className="text-primary hover:underline">Política de Cookies</Link>.
                </p>

                <p>
                  GYDI es operado por GYDI Inc. ("nosotros", "nuestro"), una empresa registrada bajo las leyes
                  de los Estados Unidos. Estos términos se rigen por las leyes del Estado de Florida, EE.UU.
                </p>

                <p className="font-semibold text-foreground">
                  Debes tener al menos 18 años de edad para usar esta plataforma.
                </p>
              </div>
            </div>

            {/* 2. Descripción de Servicios */}
            <div id="servicios" className="mb-12">
              <div className="mb-6 flex items-center gap-3">
                <div className="rounded-xl bg-primary/10 p-3">
                  <Building2 className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-3xl">2. Descripción de Servicios</h2>
              </div>

              <div className="space-y-6">
                <p className="text-muted-foreground">
                  GYDI es una plataforma de referidos para propiedades en renta con dos roles principales:
                </p>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6">
                    <h4 className="mb-3 font-semibold text-primary">Rol Anfitrión: Publica tu propiedad en renta</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <span className="mt-1 text-primary">•</span>
                        <span>Publicas tu propiedad en renta en la plataforma</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="mt-1 text-primary">•</span>
                        <span>Los afiliados la refieren y consiguen reservas para ti</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="mt-1 text-primary">•</span>
                        <span>Por cada reserva generada por un afiliado, la plataforma retiene entre 15% y 25% según tu plan</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="mt-1 text-primary">•</span>
                        <span>Solo pagas si hay reserva confirmada — sin reserva, sin costo</span>
                      </li>
                    </ul>
                  </div>

                  <div className="rounded-2xl border border-purple-500/20 bg-purple-500/5 p-6">
                    <h4 className="mb-3 font-semibold text-purple-600">Rol Afiliado: Refiere propiedades y gana</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <span className="mt-1 text-purple-600">•</span>
                        <span>Generates un link único para cada propiedad en renta</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="mt-1 text-purple-600">•</span>
                        <span>Compartes el link con tu red de contactos y viajeros</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="mt-1 text-purple-600">•</span>
                        <span>Recibes entre 2% y 10% de comisión por cada reserva confirmada, según tu plan</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="mt-1 text-purple-600">•</span>
                        <span>Dashboard de estadísticas: clicks, conversiones y ganancias en tiempo real</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="rounded-xl bg-blue-50 p-4 text-sm text-blue-900">
                  <strong>Disponibilidad del Servicio:</strong> Nos esforzamos por mantener la plataforma disponible 24/7,
                  pero no garantizamos acceso ininterrumpido. Podemos realizar mantenimiento, actualizaciones o
                  suspender servicios temporalmente sin previo aviso.
                </div>
              </div>
            </div>

            {/* 3. Cuentas de Usuario */}
            <div id="cuentas" className="mb-12">
              <div className="mb-6 flex items-center gap-3">
                <div className="rounded-xl bg-blue-500/10 p-3">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <h2 className="text-3xl">3. Cuentas de Usuario</h2>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="mb-3 font-semibold">3.1 Registro</h4>
                  <ul className="ml-6 space-y-2 text-muted-foreground">
                    <li className="list-disc">
                      Debes proporcionar información veraz, precisa y completa durante el registro
                    </li>
                    <li className="list-disc">
                      Eres responsable de mantener la confidencialidad de tu contraseña
                    </li>
                    <li className="list-disc">
                      Solo puedes crear una cuenta por persona (no se permiten cuentas múltiples)
                    </li>
                    <li className="list-disc">
                      Debes notificarnos inmediatamente sobre cualquier uso no autorizado de tu cuenta
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="mb-3 font-semibold">3.2 Verificación de Identidad</h4>
                  <p className="mb-3 text-muted-foreground">
                    Para ciertos servicios (especialmente afiliados y anfitriones), podemos requerir:
                  </p>
                  <ul className="ml-6 space-y-2 text-muted-foreground">
                    <li className="list-disc">Identificación oficial con foto (pasaporte, licencia de conducir)</li>
                    <li className="list-disc">Comprobante de domicilio</li>
                    <li className="list-disc">Información fiscal (W-9, W-8BEN, etc.)</li>
                    <li className="list-disc">Verificación de cuenta bancaria</li>
                  </ul>
                </div>

                <div>
                  <h4 className="mb-3 font-semibold">3.3 Suspensión y Terminación</h4>
                  <p className="mb-3 text-muted-foreground">
                    Nos reservamos el derecho de suspender o terminar tu cuenta si:
                  </p>
                  <ul className="ml-6 space-y-2 text-muted-foreground">
                    <li className="list-disc">Violas estos términos o políticas</li>
                    <li className="list-disc">Participas en actividades fraudulentas o ilegales</li>
                    <li className="list-disc">Proporcionas información falsa o engañosa</li>
                    <li className="list-disc">Tu cuenta permanece inactiva por más de 12 meses</li>
                    <li className="list-disc">Lo consideramos necesario para proteger la plataforma o usuarios</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 4. Comisiones y Pagos */}
            <div id="comisiones" className="mb-12">
              <div className="mb-6 flex items-center gap-3">
                <div className="rounded-xl bg-purple-500/10 p-3">
                  <DollarSign className="h-6 w-6 text-purple-600" />
                </div>
                <h2 className="text-3xl">4. Comisiones y Pagos</h2>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="mb-3 font-semibold">4.1 Estructura de Comisiones</h4>

                  {/* Desktop Table */}
                  <div className="mb-4 hidden overflow-hidden rounded-xl border sm:block">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="border-b px-4 py-3 text-left text-sm font-semibold">Plan</th>
                          <th className="border-b px-4 py-3 text-left text-sm font-semibold">Precio Mensual</th>
                          <th className="border-b px-4 py-3 text-left text-sm font-semibold">Comisión</th>
                          <th className="border-b px-4 py-3 text-left text-sm font-semibold">Límite</th>
                        </tr>
                      </thead>
                      <tbody className="text-sm">
                        <tr>
                          <td className="border-b px-4 py-3 font-medium">Free</td>
                          <td className="border-b px-4 py-3">$0</td>
                          <td className="border-b px-4 py-3 text-primary">2%</td>
                          <td className="border-b px-4 py-3">10 referidos/mes</td>
                        </tr>
                        <tr>
                          <td className="border-b px-4 py-3 font-medium">Pro</td>
                          <td className="border-b px-4 py-3">$15</td>
                          <td className="border-b px-4 py-3 text-primary">5%</td>
                          <td className="border-b px-4 py-3">100 referidos/mes</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 font-medium">Elite</td>
                          <td className="px-4 py-3">$30</td>
                          <td className="px-4 py-3 text-primary">10%</td>
                          <td className="px-4 py-3">Ilimitado</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile Cards */}
                  <div className="mb-4 space-y-4 sm:hidden">
                    {/* Free Plan */}
                    <div className="rounded-xl border bg-card p-4">
                      <div className="mb-3 flex items-center justify-between">
                        <span className="text-lg font-bold">Free</span>
                        <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-semibold">$0/mes</span>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Comisión:</span>
                          <span className="font-semibold text-primary">2%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Límite:</span>
                          <span className="font-medium">10 referidos/mes</span>
                        </div>
                      </div>
                    </div>

                    {/* Pro Plan */}
                    <div className="rounded-xl border-2 border-primary bg-card p-4">
                      <div className="mb-3 flex items-center justify-between">
                        <span className="text-lg font-bold">Pro</span>
                        <span className="rounded-full bg-primary px-3 py-1 text-sm font-semibold text-primary-foreground">$15/mes</span>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Comisión:</span>
                          <span className="font-semibold text-primary">5%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Límite:</span>
                          <span className="font-medium">100 referidos/mes</span>
                        </div>
                      </div>
                    </div>

                    {/* Elite Plan */}
                    <div className="rounded-xl border bg-card p-4">
                      <div className="mb-3 flex items-center justify-between">
                        <span className="text-lg font-bold">Elite</span>
                        <span className="rounded-full bg-purple-100 px-3 py-1 text-sm font-semibold text-purple-700">$30/mes</span>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Comisión:</span>
                          <span className="font-semibold text-primary">10%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Límite:</span>
                          <span className="font-medium">Ilimitado</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <ul className="ml-6 space-y-2 text-muted-foreground">
                    <li className="list-disc">
                      Las comisiones se calculan sobre el <strong className="text-foreground">valor total de la reserva/venta</strong>
                    </li>
                    <li className="list-disc">
                      Los cambios de plan se aplican en el siguiente ciclo de facturación
                    </li>
                    <li className="list-disc">
                      Nos reservamos el derecho de modificar tasas con 30 días de aviso previo
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="mb-3 font-semibold">4.2 Procesamiento de Pagos</h4>
                  <ul className="ml-6 space-y-2 text-muted-foreground">
                    <li className="list-disc">
                      <strong className="text-foreground">Umbral mínimo de pago:</strong> $50 USD
                    </li>
                    <li className="list-disc">
                      <strong className="text-foreground">Frecuencia de pago:</strong>
                      <ul className="ml-6 mt-2 space-y-1">
                        <li className="list-circle">Free: Mensual (último día del mes)</li>
                        <li className="list-circle">Pro: Quincenal (días 15 y 30)</li>
                        <li className="list-circle">Elite: Semanal (todos los lunes)</li>
                      </ul>
                    </li>
                    <li className="list-disc">
                      <strong className="text-foreground">Métodos de pago:</strong> Transferencia bancaria, PayPal, Stripe
                    </li>
                    <li className="list-disc">
                      <strong className="text-foreground">Tiempo de procesamiento:</strong> 3-5 días hábiles
                    </li>
                    <li className="list-disc">
                      <strong className="text-foreground">Comisiones de procesamiento:</strong> A cargo de GYDI (sin costo adicional para ti)
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="mb-3 font-semibold">4.3 Retenciones y Disputas</h4>
                  <p className="mb-3 text-muted-foreground">
                    Podemos retener pagos temporalmente si:
                  </p>
                  <ul className="ml-6 space-y-2 text-muted-foreground">
                    <li className="list-disc">Hay disputas de clientes relacionadas con tu referido</li>
                    <li className="list-disc">Sospechamos actividad fraudulenta</li>
                    <li className="list-disc">Falta completar verificación de identidad</li>
                    <li className="list-disc">Hay una investigación en curso</li>
                  </ul>
                </div>

                <div>
                  <h4 className="mb-3 font-semibold">4.4 Reembolsos y Cancelaciones</h4>
                  <ul className="ml-6 space-y-2 text-muted-foreground">
                    <li className="list-disc">
                      Las suscripciones pagadas (Pro, Elite) <strong className="text-foreground">no son reembolsables</strong>
                    </li>
                    <li className="list-disc">
                      Puedes cancelar en cualquier momento; el servicio continuará hasta el final del período pagado
                    </li>
                    <li className="list-disc">
                      Si una reserva referida es cancelada, la comisión correspondiente será revertida
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 5. Prohibiciones y Conducta */}
            <div id="prohibiciones" className="mb-12">
              <div className="mb-6 flex items-center gap-3">
                <div className="rounded-xl bg-red-500/10 p-3">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <h2 className="text-3xl">5. Conductas Prohibidas</h2>
              </div>

              <div className="space-y-6">
                <div className="rounded-xl border-2 border-red-200 bg-red-50 p-6">
                  <h4 className="mb-3 font-semibold text-red-900">Está estrictamente prohibido:</h4>
                  <ul className="ml-6 space-y-2 text-sm text-red-800">
                    <li className="list-disc">
                      <strong>Fraude:</strong> Click fraud, referidos falsos, manipulación de estadísticas
                    </li>
                    <li className="list-disc">
                      <strong>Spam:</strong> Envío masivo de emails no solicitados, marketing agresivo
                    </li>
                    <li className="list-disc">
                      <strong>Suplantación:</strong> Hacerse pasar por otra persona u organización
                    </li>
                    <li className="list-disc">
                      <strong>Contenido ilegal:</strong> Publicar propiedades inexistentes, estafas, contenido ofensivo
                    </li>
                    <li className="list-disc">
                      <strong>Manipulación del sistema:</strong> Uso de bots, scripts automatizados, explotación de vulnerabilidades
                    </li>
                    <li className="list-disc">
                      <strong>Cookie stuffing:</strong> Forzar cookies de referidos sin consentimiento del usuario
                    </li>
                    <li className="list-disc">
                      <strong>Bidding en marca:</strong> Pujar por palabras clave de marca "GYDI" en ads sin autorización
                    </li>
                    <li className="list-disc">
                      <strong>Auto-referidos:</strong> Registrarse o realizar transacciones usando tu propio enlace de afiliado
                    </li>
                    <li className="list-disc">
                      <strong>Competencia desleal:</strong> Desprestigiar competidores, comparaciones falsas
                    </li>
                    <li className="list-disc">
                      <strong>Violación de privacidad:</strong> Recopilar datos de usuarios sin consentimiento
                    </li>
                  </ul>
                </div>

                <p className="text-sm text-muted-foreground">
                  La violación de cualquiera de estas prohibiciones resultará en <strong className="text-foreground">
                  suspensión inmediata de cuenta, pérdida de comisiones pendientes y posible acción legal</strong>.
                </p>
              </div>
            </div>

            {/* 6. Propiedad Intelectual */}
            <div className="mb-12">
              <h2 className="mb-6 text-3xl">6. Propiedad Intelectual</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Todo el contenido de GYDI (logos, diseños, textos, código, imágenes) es propiedad de GYDI Inc.
                  o sus licenciantes, protegido por derechos de autor, marcas registradas y otras leyes de
                  propiedad intelectual.
                </p>

                <p>
                  Como afiliado, te otorgamos una licencia limitada, no exclusiva, revocable para:
                </p>

                <ul className="ml-6 space-y-2">
                  <li className="list-disc">Usar nuestros materiales de marketing aprobados</li>
                  <li className="list-disc">Mostrar nuestro logo según nuestras guías de marca</li>
                  <li className="list-disc">Enlazar a nuestra plataforma usando tu enlace de afiliado</li>
                </ul>

                <p className="font-semibold text-foreground">
                  No puedes modificar, reproducir, distribuir o crear obras derivadas sin autorización escrita.
                </p>
              </div>
            </div>

            {/* 7. Limitación de Responsabilidad */}
            <div id="responsabilidad" className="mb-12">
              <div className="mb-6 flex items-center gap-3">
                <div className="rounded-xl bg-orange-500/10 p-3">
                  <Shield className="h-6 w-6 text-orange-600" />
                </div>
                <h2 className="text-3xl">7. Limitación de Responsabilidad</h2>
              </div>

              <div className="space-y-6">
                <div className="rounded-xl border-2 border-orange-200 bg-orange-50 p-6">
                  <h4 className="mb-3 font-semibold text-orange-900">Exención de Garantías</h4>
                  <p className="text-sm text-orange-800">
                    LA PLATAFORMA SE PROPORCIONA "TAL CUAL" Y "SEGÚN DISPONIBILIDAD" SIN GARANTÍAS DE NINGÚN TIPO,
                    YA SEAN EXPRESAS O IMPLÍCITAS. NO GARANTIZAMOS QUE EL SERVICIO SEA ININTERRUMPIDO, LIBRE DE ERRORES
                    O SEGURO. NO GARANTIZAMOS LA EXACTITUD DE LAS LISTADOS DE PROPIEDADES NI LA CALIDAD DE LOS REFERIDOS.
                  </p>
                </div>

                <div>
                  <h4 className="mb-3 font-semibold">Limitación de Daños</h4>
                  <p className="mb-3 text-muted-foreground">
                    EN LA MÁXIMA MEDIDA PERMITIDA POR LA LEY, GYDI NO SERÁ RESPONSABLE POR:
                  </p>
                  <ul className="ml-6 space-y-2 text-muted-foreground">
                    <li className="list-disc">Daños indirectos, incidentales, especiales, consecuenciales o punitivos</li>
                    <li className="list-disc">Pérdida de ganancias, ingresos, datos o uso</li>
                    <li className="list-disc">Interrupciones del servicio o errores técnicos</li>
                    <li className="list-disc">Acciones u omisiones de terceros (propietarios, huéspedes, otros afiliados)</li>
                    <li className="list-disc">Contenido o conducta de usuarios</li>
                  </ul>
                </div>

                <div className="rounded-xl bg-gray-100 p-4 text-sm text-gray-800">
                  <strong>Responsabilidad máxima:</strong> En cualquier caso, nuestra responsabilidad total no excederá
                  el mayor de (a) $100 USD o (b) las comisiones que hayas ganado en los últimos 3 meses.
                </div>

                <div>
                  <h4 className="mb-3 font-semibold">Indemnización</h4>
                  <p className="text-muted-foreground">
                    Aceptas indemnizar y mantener indemne a GYDI de cualquier reclamo, daño, pérdida, responsabilidad
                    y gasto (incluyendo honorarios legales) que surjan de: (a) tu uso de la plataforma, (b) tu violación
                    de estos términos, (c) tu violación de derechos de terceros, o (d) tus actividades de afiliado/venta.
                  </p>
                </div>
              </div>
            </div>

            {/* 8. Resolución de Disputas */}
            <div className="mb-12">
              <h2 className="mb-6 text-3xl">8. Resolución de Disputas</h2>
              <div className="space-y-4 text-muted-foreground">
                <div>
                  <h4 className="mb-3 font-semibold">8.1 Ley Aplicable</h4>
                  <p>
                    Estos términos se rigen e interpretan de acuerdo con las leyes del Estado de Florida, EE.UU.,
                    sin consideración a conflictos de principios legales.
                  </p>
                </div>

                <div>
                  <h4 className="mb-3 font-semibold">8.2 Arbitraje</h4>
                  <p className="mb-3">
                    Cualquier disputa relacionada con estos términos se resolverá mediante arbitraje vinculante
                    bajo las reglas de la American Arbitration Association (AAA), excepto que:
                  </p>
                  <ul className="ml-6 space-y-2">
                    <li className="list-disc">Puedes presentar reclamos en tribunal de reclamos menores si calificas</li>
                    <li className="list-disc">Podemos buscar medidas cautelares en tribunales para proteger propiedad intelectual</li>
                  </ul>
                </div>

                <div>
                  <h4 className="mb-3 font-semibold">8.3 Renuncia a Acciones Colectivas</h4>
                  <p className="font-semibold text-foreground">
                    Aceptas resolver disputas solo de manera individual. Renuncias al derecho de participar en
                    demandas colectivas, acciones de clase o arbitrajes colectivos.
                  </p>
                </div>
              </div>
            </div>

            {/* 9. Modificaciones */}
            <div className="mb-12">
              <h2 className="mb-6 text-3xl">9. Modificaciones de Términos</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Nos reservamos el derecho de modificar estos términos en cualquier momento. Los cambios significativos
                  se notificarán mediante:
                </p>
                <ul className="ml-6 space-y-2">
                  <li className="list-disc">Email a tu cuenta registrada (30 días antes de la entrada en vigor)</li>
                  <li className="list-disc">Aviso en la plataforma</li>
                  <li className="list-disc">Actualización de la fecha "Última actualización"</li>
                </ul>
                <p>
                  El uso continuado después de modificaciones constituye aceptación. Si no estás de acuerdo,
                  debes cerrar tu cuenta antes de que entren en vigor.
                </p>
              </div>
            </div>

            {/* 10. Disposiciones Generales */}
            <div className="mb-12">
              <h2 className="mb-6 text-3xl">10. Disposiciones Generales</h2>
              <div className="space-y-4 text-muted-foreground">
                <ul className="ml-6 space-y-3">
                  <li className="list-disc">
                    <strong className="text-foreground">Totalidad del acuerdo:</strong> Estos términos constituyen
                    el acuerdo completo entre tú y GYDI
                  </li>
                  <li className="list-disc">
                    <strong className="text-foreground">Divisibilidad:</strong> Si alguna disposición es inválida,
                    las demás permanecen vigentes
                  </li>
                  <li className="list-disc">
                    <strong className="text-foreground">No renuncia:</strong> Nuestra falta de ejercicio de un derecho
                    no constituye renuncia
                  </li>
                  <li className="list-disc">
                    <strong className="text-foreground">Cesión:</strong> No puedes transferir estos términos;
                    podemos ceder sin restricción
                  </li>
                  <li className="list-disc">
                    <strong className="text-foreground">Supervivencia:</strong> Las disposiciones que por naturaleza
                    deben sobrevivir la terminación (propiedad intelectual, limitación de responsabilidad, etc.)
                    permanecerán vigentes
                  </li>
                </ul>
              </div>
            </div>

            {/* Contact */}
            <div className="rounded-3xl border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-blue-500/5 p-8">
              <h2 className="mb-4 text-3xl">Contacto Legal</h2>
              <div className="space-y-3 text-muted-foreground">
                <p>
                  Para preguntas sobre estos términos:
                </p>
                <div className="space-y-1">
                  <p><strong className="text-foreground">Email:</strong>{' '}
                    <a href="mailto:legal@gydi.com" className="text-primary hover:underline">legal@gydi.com</a>
                  </p>
                  <p><strong className="text-foreground">Dirección Legal:</strong> GYDI Inc., 123 Business Avenue, Miami, FL 33101, USA</p>
                  <p><strong className="text-foreground">Teléfono:</strong> +1 (234) 567-890</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
