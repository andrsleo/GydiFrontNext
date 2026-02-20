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
          headline: 'Recibes 2% por cada reserva que refieres',
          explanation:
            'Cuando alguien reserva usando tu link, GYDI te paga el 2% del valor de la reserva. Tú no inviertes nada — solo compartes.',
          example: 'En una reserva de $500, ganas $10.',
        },
        host: {
          headline: 'Se descuenta 25% de reservas generadas por afiliados',
          explanation:
            'Por cada reserva que un afiliado te consiga a través de GYDI, la plataforma retiene el 25%. Recibes el 75% restante. Si no hay reserva, no hay descuento.',
          example: 'En una reserva de $500, recibes $375.',
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
          headline: 'Recibes 5% por cada reserva que refieres',
          explanation:
            'Ganas 2.5 veces más que en el plan FREE. Cada link que compartes tiene mayor rendimiento y puedes ver el detalle de cada comisión en tu dashboard avanzado.',
          example: 'En una reserva de $500, ganas $25.',
        },
        host: {
          headline: 'Se descuenta solo 20% de reservas generadas por afiliados',
          explanation:
            'Reduces la comisión de plataforma de 25% a 20%, ahorrando 5 puntos en cada reserva. Recibes el 80% del monto total. Mejor margen, misma red de afiliados.',
          example: 'En una reserva de $500, recibes $400 (vs $375 en FREE).',
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
          headline: 'Recibes 10% por cada reserva que refieres',
          explanation:
            'La comisión más alta disponible en la plataforma. Duplicas lo que ganarías con PRO. Ideal para influencers, creadores de contenido y personas con una red de viajeros frecuentes.',
          example: 'En una reserva de $500, ganas $50.',
        },
        host: {
          headline: 'Se descuenta solo 15% de reservas generadas por afiliados',
          explanation:
            'La tarifa más baja de la plataforma. Ahorras 10 puntos vs el plan FREE, lo que significa mayor ingreso neto por cada reserva. Con más propiedades, el ahorro escala considerablemente.',
          example: 'En una reserva de $500, recibes $425 (vs $375 en FREE).',
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
