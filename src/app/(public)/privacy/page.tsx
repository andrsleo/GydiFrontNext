import Link from 'next/link';
import { Shield, Lock, Eye, Database, UserCheck, FileText } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Política de Privacidad',
  description: 'Política de privacidad de GYDI. Conoce cómo recopilamos, usamos y protegemos tu información personal.',
};

export default function PrivacyPage() {
  const lastUpdated = 'Octubre 2025';

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50/50 to-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b bg-gradient-to-br from-primary/5 via-blue-500/5 to-purple-500/5 py-16 sm:py-20">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:64px_64px]" />

        <div className="container relative mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary backdrop-blur-sm">
              <Shield className="h-4 w-4" />
              <span>Última actualización: {lastUpdated}</span>
            </div>

            <h1 className="mb-6">
              Política de{' '}
              <span className="bg-gradient-to-r from-primary via-blue-600 to-purple-600 bg-clip-text text-transparent">
                Privacidad
              </span>
            </h1>

            <p className="text-lg text-muted-foreground">
              En GYDI, tu privacidad es nuestra prioridad. Esta política describe cómo recopilamos,
              usamos y protegemos tu información personal.
            </p>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="border-b bg-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
            <span className="font-semibold text-foreground">Ir a:</span>
            <a href="#info-recopilada" className="text-primary hover:underline">Información Recopilada</a>
            <span className="text-muted-foreground">•</span>
            <a href="#uso-datos" className="text-primary hover:underline">Uso de Datos</a>
            <span className="text-muted-foreground">•</span>
            <a href="#compartir" className="text-primary hover:underline">Compartir Datos</a>
            <span className="text-muted-foreground">•</span>
            <a href="#seguridad" className="text-primary hover:underline">Seguridad</a>
            <span className="text-muted-foreground">•</span>
            <a href="#derechos" className="text-primary hover:underline">Tus Derechos</a>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            {/* Introduction */}
            <div className="mb-12 rounded-2xl border-l-4 border-primary bg-primary/5 p-6">
              <h3 className="mb-3 text-xl font-bold">Compromiso con tu Privacidad</h3>
              <p className="leading-relaxed text-muted-foreground">
                GYDI ("nosotros", "nuestro") se compromete a proteger la privacidad de todos los usuarios
                ("tú", "tu") de nuestra plataforma de venta de propiedades inmobiliarias y referidos vacacionales.
                Esta política cumple con el Reglamento General de Protección de Datos (GDPR), la Ley de Privacidad
                del Consumidor de California (CCPA) y otras leyes aplicables de protección de datos.
              </p>
            </div>

            {/* 1. Información que Recopilamos */}
            <div id="info-recopilada" className="mb-12">
              <div className="mb-6 flex items-center gap-3">
                <div className="rounded-xl bg-primary/10 p-3">
                  <Database className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-3xl">1. Información que Recopilamos</h2>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="mb-3 font-semibold">1.1 Información que nos Proporcionas</h4>
                  <ul className="ml-6 space-y-2 text-muted-foreground">
                    <li className="list-disc">
                      <strong className="text-foreground">Datos de cuenta:</strong> Nombre, email, contraseña, número de teléfono
                    </li>
                    <li className="list-disc">
                      <strong className="text-foreground">Información de perfil:</strong> Foto, biografía, preferencias
                    </li>
                    <li className="list-disc">
                      <strong className="text-foreground">Datos de pago:</strong> Información bancaria para procesamiento de comisiones
                      (procesada por proveedores certificados PCI-DSS)
                    </li>
                    <li className="list-disc">
                      <strong className="text-foreground">Documentación:</strong> Identificación oficial (para verificación de afiliados)
                    </li>
                    <li className="list-disc">
                      <strong className="text-foreground">Comunicaciones:</strong> Mensajes de soporte, correos, feedback
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="mb-3 font-semibold">1.2 Información Recopilada Automáticamente</h4>
                  <ul className="ml-6 space-y-2 text-muted-foreground">
                    <li className="list-disc">
                      <strong className="text-foreground">Datos de uso:</strong> Páginas visitadas, clics, tiempo en el sitio
                    </li>
                    <li className="list-disc">
                      <strong className="text-foreground">Información del dispositivo:</strong> Dirección IP, tipo de navegador, sistema operativo
                    </li>
                    <li className="list-disc">
                      <strong className="text-foreground">Cookies y tecnologías similares:</strong> Ver nuestra{' '}
                      <Link href="/cookies" className="text-primary hover:underline">Política de Cookies</Link>
                    </li>
                    <li className="list-disc">
                      <strong className="text-foreground">Datos de referidos:</strong> Fuentes de tráfico, enlaces de afiliados
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="mb-3 font-semibold">1.3 Información de Terceros</h4>
                  <ul className="ml-6 space-y-2 text-muted-foreground">
                    <li className="list-disc">
                      Datos de redes sociales (si conectas tu cuenta)
                    </li>
                    <li className="list-disc">
                      Información de proveedores de pago (Stripe, PayPal)
                    </li>
                    <li className="list-disc">
                      Servicios de analytics (Google Analytics, Mixpanel)
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 2. Cómo Usamos tu Información */}
            <div id="uso-datos" className="mb-12">
              <div className="mb-6 flex items-center gap-3">
                <div className="rounded-xl bg-blue-500/10 p-3">
                  <Eye className="h-6 w-6 text-blue-600" />
                </div>
                <h2 className="text-3xl">2. Cómo Usamos tu Información</h2>
              </div>

              <div className="space-y-4">
                <p className="text-muted-foreground">Utilizamos tus datos para:</p>
                <ul className="ml-6 space-y-2 text-muted-foreground">
                  <li className="list-disc">
                    <strong className="text-foreground">Proveer servicios:</strong> Gestionar tu cuenta, procesar transacciones,
                    calcular y pagar comisiones
                  </li>
                  <li className="list-disc">
                    <strong className="text-foreground">Comunicación:</strong> Enviarte confirmaciones, actualizaciones,
                    notificaciones de seguridad
                  </li>
                  <li className="list-disc">
                    <strong className="text-foreground">Marketing:</strong> Enviar ofertas y promociones (solo con tu consentimiento,
                    puedes darte de baja en cualquier momento)
                  </li>
                  <li className="list-disc">
                    <strong className="text-foreground">Mejora del servicio:</strong> Analizar uso, desarrollar nuevas funcionalidades
                  </li>
                  <li className="list-disc">
                    <strong className="text-foreground">Seguridad:</strong> Detectar fraude, proteger contra actividades maliciosas
                  </li>
                  <li className="list-disc">
                    <strong className="text-foreground">Cumplimiento legal:</strong> Cumplir con obligaciones regulatorias,
                    resolver disputas
                  </li>
                </ul>
              </div>

              <div className="mt-6 rounded-xl bg-blue-50 p-4 text-sm text-blue-900">
                <strong>Base legal (GDPR):</strong> Procesamos datos basados en consentimiento, ejecución de contrato,
                interés legítimo y obligaciones legales.
              </div>
            </div>

            {/* 3. Compartir Información */}
            <div id="compartir" className="mb-12">
              <div className="mb-6 flex items-center gap-3">
                <div className="rounded-xl bg-purple-500/10 p-3">
                  <UserCheck className="h-6 w-6 text-purple-600" />
                </div>
                <h2 className="text-3xl">3. Compartir tu Información</h2>
              </div>

              <div className="space-y-4">
                <p className="text-muted-foreground">
                  <strong className="text-foreground">No vendemos tus datos personales.</strong> Compartimos información solo con:
                </p>

                <ul className="ml-6 space-y-3 text-muted-foreground">
                  <li className="list-disc">
                    <strong className="text-foreground">Proveedores de servicios:</strong> Procesadores de pago (Stripe, PayPal),
                    hosting (AWS, Vercel), email (SendGrid), analytics (Google Analytics)
                  </li>
                  <li className="list-disc">
                    <strong className="text-foreground">Propietarios/Anunciantes:</strong> Si reservas una propiedad,
                    compartimos información de contacto necesaria
                  </li>
                  <li className="list-disc">
                    <strong className="text-foreground">Afiliados upstream:</strong> Si te registraste mediante un referido,
                    compartimos estadísticas agregadas (no datos personales)
                  </li>
                  <li className="list-disc">
                    <strong className="text-foreground">Autoridades:</strong> Cuando sea requerido por ley o para proteger
                    derechos legales
                  </li>
                  <li className="list-disc">
                    <strong className="text-foreground">Fusiones/Adquisiciones:</strong> En caso de venta o transferencia
                    de negocio (con notificación previa)
                  </li>
                </ul>
              </div>
            </div>

            {/* 4. Seguridad de Datos */}
            <div id="seguridad" className="mb-12">
              <div className="mb-6 flex items-center gap-3">
                <div className="rounded-xl bg-orange-500/10 p-3">
                  <Lock className="h-6 w-6 text-orange-600" />
                </div>
                <h2 className="text-3xl">4. Seguridad de tus Datos</h2>
              </div>

              <div className="space-y-4">
                <p className="text-muted-foreground">Implementamos medidas de seguridad robustas:</p>
                <ul className="ml-6 space-y-2 text-muted-foreground">
                  <li className="list-disc">
                    <strong className="text-foreground">Encriptación:</strong> SSL/TLS para datos en tránsito,
                    AES-256 para datos en reposo
                  </li>
                  <li className="list-disc">
                    <strong className="text-foreground">Autenticación:</strong> Contraseñas hasheadas con bcrypt,
                    autenticación de dos factores (2FA) disponible
                  </li>
                  <li className="list-disc">
                    <strong className="text-foreground">Control de acceso:</strong> Principio de menor privilegio,
                    revisiones de acceso trimestrales
                  </li>
                  <li className="list-disc">
                    <strong className="text-foreground">Monitoreo:</strong> Detección de intrusiones 24/7,
                    auditorías de seguridad regulares
                  </li>
                  <li className="list-disc">
                    <strong className="text-foreground">Backups:</strong> Copias de seguridad diarias encriptadas
                  </li>
                </ul>

                <div className="rounded-xl bg-yellow-50 p-4 text-sm text-yellow-900">
                  <strong>Importante:</strong> Ningún sistema es 100% seguro. Si sospechas de actividad no autorizada
                  en tu cuenta, contáctanos inmediatamente en{' '}
                  <a href="mailto:security@gydi.com" className="font-semibold underline">security@gydi.com</a>.
                </div>
              </div>
            </div>

            {/* 5. Tus Derechos */}
            <div id="derechos" className="mb-12">
              <div className="mb-6 flex items-center gap-3">
                <div className="rounded-xl bg-green-500/10 p-3">
                  <FileText className="h-6 w-6 text-green-600" />
                </div>
                <h2 className="text-3xl">5. Tus Derechos de Privacidad</h2>
              </div>

              <div className="space-y-6">
                <p className="text-muted-foreground">Tienes los siguientes derechos sobre tus datos personales:</p>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-xl border border-border/50 bg-card p-4">
                    <h4 className="mb-2 font-semibold">✓ Acceso</h4>
                    <p className="text-sm text-muted-foreground">
                      Solicitar una copia de todos los datos que tenemos sobre ti
                    </p>
                  </div>

                  <div className="rounded-xl border border-border/50 bg-card p-4">
                    <h4 className="mb-2 font-semibold">✓ Rectificación</h4>
                    <p className="text-sm text-muted-foreground">
                      Corregir datos inexactos o incompletos
                    </p>
                  </div>

                  <div className="rounded-xl border border-border/50 bg-card p-4">
                    <h4 className="mb-2 font-semibold">✓ Eliminación</h4>
                    <p className="text-sm text-muted-foreground">
                      Solicitar la eliminación de tus datos ("derecho al olvido")
                    </p>
                  </div>

                  <div className="rounded-xl border border-border/50 bg-card p-4">
                    <h4 className="mb-2 font-semibold">✓ Portabilidad</h4>
                    <p className="text-sm text-muted-foreground">
                      Obtener tus datos en formato estructurado y portátil
                    </p>
                  </div>

                  <div className="rounded-xl border border-border/50 bg-card p-4">
                    <h4 className="mb-2 font-semibold">✓ Restricción</h4>
                    <p className="text-sm text-muted-foreground">
                      Limitar cómo procesamos tus datos
                    </p>
                  </div>

                  <div className="rounded-xl border border-border/50 bg-card p-4">
                    <h4 className="mb-2 font-semibold">✓ Oposición</h4>
                    <p className="text-sm text-muted-foreground">
                      Oponerte al procesamiento basado en interés legítimo
                    </p>
                  </div>

                  <div className="rounded-xl border border-border/50 bg-card p-4">
                    <h4 className="mb-2 font-semibold">✓ Revocación</h4>
                    <p className="text-sm text-muted-foreground">
                      Retirar consentimiento en cualquier momento
                    </p>
                  </div>

                  <div className="rounded-xl border border-border/50 bg-card p-4">
                    <h4 className="mb-2 font-semibold">✓ Queja</h4>
                    <p className="text-sm text-muted-foreground">
                      Presentar queja ante autoridad de protección de datos
                    </p>
                  </div>
                </div>

                <div className="rounded-xl bg-primary/5 p-6">
                  <h4 className="mb-3 font-semibold">Cómo Ejercer tus Derechos</h4>
                  <p className="mb-3 text-sm text-muted-foreground">
                    Para ejercer cualquiera de estos derechos:
                  </p>
                  <ul className="ml-6 space-y-1 text-sm text-muted-foreground">
                    <li className="list-disc">Envía un email a{' '}
                      <a href="mailto:privacy@gydi.com" className="font-semibold text-primary">privacy@gydi.com</a>
                    </li>
                    <li className="list-disc">Accede a Configuración → Privacidad en tu cuenta</li>
                    <li className="list-disc">Tiempo de respuesta: 30 días máximo</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 6. Retención de Datos */}
            <div className="mb-12">
              <h2 className="mb-4 text-3xl">6. Retención de Datos</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Conservamos tus datos personales durante el tiempo necesario para cumplir con los propósitos
                  descritos en esta política:
                </p>
                <ul className="ml-6 space-y-2">
                  <li className="list-disc">
                    <strong className="text-foreground">Datos de cuenta:</strong> Mientras tu cuenta esté activa
                    + 2 años después de cierre
                  </li>
                  <li className="list-disc">
                    <strong className="text-foreground">Transacciones financieras:</strong> 7 años (requisito legal)
                  </li>
                  <li className="list-disc">
                    <strong className="text-foreground">Datos de marketing:</strong> Hasta que retires consentimiento
                  </li>
                  <li className="list-disc">
                    <strong className="text-foreground">Logs de seguridad:</strong> 1 año
                  </li>
                </ul>
              </div>
            </div>

            {/* 7. Privacidad de Menores */}
            <div className="mb-12">
              <h2 className="mb-4 text-3xl">7. Privacidad de Menores</h2>
              <div className="rounded-xl bg-red-50 p-6 text-red-900">
                <p className="font-semibold">
                  GYDI no está dirigido a menores de 18 años. No recopilamos intencionalmente información
                  de menores. Si eres padre/tutor y crees que tu hijo nos ha proporcionado datos, contáctanos
                  para eliminarlos inmediatamente.
                </p>
              </div>
            </div>

            {/* 8. Transferencias Internacionales */}
            <div className="mb-12">
              <h2 className="mb-4 text-3xl">8. Transferencias Internacionales</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Tus datos pueden ser transferidos y procesados en países fuera de tu jurisdicción,
                  incluyendo Estados Unidos. Implementamos salvaguardas apropiadas:
                </p>
                <ul className="ml-6 space-y-2">
                  <li className="list-disc">Cláusulas contractuales estándar (SCC) aprobadas por la UE</li>
                  <li className="list-disc">Certificaciones de adecuación</li>
                  <li className="list-disc">Proveedores certificados Privacy Shield (cuando aplique)</li>
                </ul>
              </div>
            </div>

            {/* 9. Cookies */}
            <div className="mb-12">
              <h2 className="mb-4 text-3xl">9. Cookies y Tecnologías de Rastreo</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Usamos cookies y tecnologías similares. Para información detallada, consulta nuestra{' '}
                  <Link href="/cookies" className="font-semibold text-primary hover:underline">
                    Política de Cookies
                  </Link>.
                </p>
              </div>
            </div>

            {/* 10. Cambios a esta Política */}
            <div className="mb-12">
              <h2 className="mb-4 text-3xl">10. Cambios a esta Política</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Podemos actualizar esta política ocasionalmente. Los cambios significativos se notificarán por:
                </p>
                <ul className="ml-6 space-y-2">
                  <li className="list-disc">Email a tu cuenta registrada</li>
                  <li className="list-disc">Aviso prominente en el sitio web</li>
                  <li className="list-disc">Actualización de la fecha "Última actualización"</li>
                </ul>
                <p>
                  El uso continuado de GYDI después de cambios constituye aceptación de la política actualizada.
                </p>
              </div>
            </div>

            {/* Contact */}
            <div className="rounded-3xl border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-blue-500/5 p-8">
              <h2 className="mb-4 text-3xl">Contacto</h2>
              <div className="space-y-3 text-muted-foreground">
                <p>
                  Para preguntas sobre privacidad o ejercer tus derechos:
                </p>
                <div className="space-y-1">
                  <p><strong className="text-foreground">Email:</strong>{' '}
                    <a href="mailto:privacy@gydi.com" className="text-primary hover:underline">privacy@gydi.com</a>
                  </p>
                  <p><strong className="text-foreground">Dirección:</strong> 123 Business Avenue, Miami, FL 33101, USA</p>
                  <p><strong className="text-foreground">DPO (Data Protection Officer):</strong>{' '}
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
