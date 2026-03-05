/**
 * Copies para la sección de Planes y Precios.
 *
 * Roles:
 * - AFILIADO: Refiere propiedades en renta y RECIBE una comisión por cada reserva confirmada.
 * - ANFITRIÓN: Publica su propiedad en renta y se le DESCUENTA un porcentaje de cada reserva
 *              generada a través de la red de afiliados de GYDI.
 */
export const PLANS_COPY = {
  section: {
    title: 'Elige cómo quieres crecer',
    subtitle: 'Sin contratos. Sin sorpresas. Cambia o cancela cuando quieras.',
    role_explainer: {
      affiliate: {
        label: 'Como Afiliado',
        description:
          'Refieres propiedades en renta y la plataforma te paga una comisión por cada reserva que generas con tu link.',
      },
      host: {
        label: 'Como Anfitrión',
        description:
          'Publicas tu propiedad en GYDI y solo pagas una comisión a la plataforma cuando se genera una reserva a través de un afiliado. Sin reserva, sin costo.',
      },
    },
  },

  plans: {
    FREE: {
      name: 'FREE',
      tagline: 'Empieza sin riesgo y descubre cómo funciona',
      description:
        'Para quienes quieren probar la plataforma sin comprometer nada. Acceso completo al modelo de referidos sin costo.',
      target: 'Nuevos afiliados y anfitriones que quieren explorar la plataforma',
      price: {
        amount: 0,
        label: 'Gratis para siempre',
        cta: 'Empezar gratis',
      },
      roles: {
        affiliate: {
          headline: 'Gana 4% en cada reserva que refieres',
          explanation:
            'Cuando alguien reserva usando tu link, GYDI te paga el 4% del valor de la reserva. Publica al menos una propiedad en la plataforma y tu tasa sube automáticamente al 6%. Tú no inviertes nada — solo compartes.',
          example: 'En una reserva de $500, ganas $20 (o $30 si tienes una propiedad publicada).',
        },
        host: {
          headline: 'Se descuenta 15% de reservas generadas por afiliados',
          explanation:
            'Por cada reserva que un afiliado te consiga a través de GYDI, la plataforma retiene el 15%. Recibes el 85% restante. Si no hay reserva, no hay descuento.',
          example: 'En una reserva de $500, recibes $425.',
        },
      },
      benefits: [
        'Links de referido ilimitados',
        'Acceso al catálogo completo de propiedades en renta',
        'Dashboard básico de estadísticas',
        'Soporte por email',
      ],
      badge: null as null,
    },

    PRO: {
      name: 'PRO',
      tagline: 'Más comisión, más herramientas, más resultados',
      description:
        'Para afiliados y anfitriones que ya vieron el potencial y quieren escalar sus ingresos con mejores tasas y herramientas profesionales.',
      target: 'Afiliados activos y anfitriones con 1 o más propiedades en renta',
      price: {
        amount: 19,
        label: '$19 / mes',
        cta: 'Pasar a PRO',
      },
      roles: {
        affiliate: {
          headline: 'Gana 4-6% con herramientas avanzadas para escalar tus comisiones',
          explanation:
            'La misma tasa de comisión (4% base, 6% con propiedad publicada) con herramientas profesionales para maximizar conversiones. Analytics avanzado, QR codes personalizados y soporte prioritario para que cada link trabaje más por ti.',
          example: 'En una reserva de $500, ganas $20-$30. Con analytics, optimizas cuáles links convierten mejor.',
        },
        host: {
          headline: 'Se descuenta 15% de reservas generadas por afiliados',
          explanation:
            'La misma tarifa competitiva del 15% con acceso a herramientas avanzadas para analizar el rendimiento de tus anuncios, optimizar precios y conectar con los afiliados más activos de la red.',
          example: 'En una reserva de $500, recibes $425. Con analytics avanzado, identifica qué afiliados generan más reservas.',
        },
      },
      benefits: [
        'Todo lo incluido en el plan FREE',
        'Analytics avanzado: clicks, conversiones y tendencias',
        'QR codes personalizados para compartir en físico o digital',
        'Soporte prioritario con respuesta en menos de 24h',
      ],
      badge: 'Más popular' as string | null,
    },

    ELITE: {
      name: 'ELITE',
      tagline: 'El máximo retorno para quienes van en serio',
      description:
        'Para afiliados de alto volumen y anfitriones con múltiples propiedades. Las comisiones más altas y las tarifas más bajas de la plataforma.',
      target: 'Afiliados con gran red de contactos y anfitriones con portafolio de propiedades en renta',
      price: {
        amount: 39,
        label: '$39 / mes',
        cta: 'Unirme a ELITE',
      },
      roles: {
        affiliate: {
          headline: 'Gana 4-6% con manager dedicado y perfil de alta visibilidad',
          explanation:
            'La misma tasa de comisión (4% base, 6% con propiedad publicada) con el máximo nivel de soporte y exposición. Manager dedicado, perfil destacado en la plataforma y acceso anticipado a nuevas propiedades para multiplicar tus oportunidades de ingreso.',
          example: 'En una reserva de $500, ganas $20-$30. Tu perfil destacado atrae más viajeros a tus links, multiplicando el volumen de reservas.',
        },
        host: {
          headline: 'Se descuenta 15% de reservas generadas por afiliados',
          explanation:
            'La tarifa estándar del 15% con el máximo nivel de servicio. Manager dedicado, perfil destacado en la red GYDI y acceso anticipado a las mejores propiedades para que tu anuncio reciba la mayor atención de los afiliados más activos.',
          example: 'En una reserva de $500, recibes $425. Con manager dedicado y visibilidad premium, tu propiedad genera más reservas mes a mes.',
        },
      },
      benefits: [
        'Todo lo incluido en el plan PRO',
        'Reportes exportables en CSV, Excel y PDF',
        'Manager dedicado de cuenta',
        'Acceso anticipado a nuevas propiedades y funcionalidades',
        'Perfil destacado para atraer más afiliados',
      ],
      badge: 'Mejor valor' as string | null,
    },
  },
} as const;
