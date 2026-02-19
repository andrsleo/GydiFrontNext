export const PLANS_COPY = {
  section: {
    title: 'Elige cómo quieres crecer',
    subtitle: 'Sin contratos. Sin sorpresas. Cambia o cancela cuando quieras.',
  },

  plans: {
    free: {
      displayName: 'Explorador',
      tagline: 'Empieza gratis, aprende cómo funciona',
      description:
        'Para quienes quieren probar el modelo de referidos sin arriesgar nada. Perfecto para dar los primeros pasos.',
      target: 'Nuevos afiliados y anfitriones explorando la plataforma',
      commission: {
        affiliate: '2% por reserva referida',
        host: '25% de comisión de plataforma',
      },
      benefits: [
        'Genera links de referido ilimitados',
        'Acceso al catálogo completo de propiedades',
        'Dashboard de estadísticas básico',
        'Soporte por email',
      ],
      cta: 'Comenzar gratis',
      badge: null as null,
    },

    pro: {
      displayName: 'Conector',
      tagline: 'Más comisión, más herramientas, más resultados',
      description:
        'Para afiliados y anfitriones que ya vieron el potencial y quieren escalar sus ingresos con herramientas profesionales.',
      target: 'Afiliados activos y anfitriones con 1-5 propiedades',
      commission: {
        affiliate: '5% por reserva referida',
        host: '20% de comisión de plataforma',
      },
      benefits: [
        'Todo lo del plan Explorador',
        'Comisiones 2.5x mayores que el plan gratuito',
        'Analytics avanzado con gráficas de tendencia',
        'QR codes personalizados para materiales físicos',
        'Soporte prioritario en menos de 24h',
      ],
      cta: 'Activar plan Conector',
      badge: 'Más popular' as string | null,
    },

    elite: {
      displayName: 'Embajador',
      tagline: 'El máximo retorno para quienes van en serio',
      description:
        'Para profesionales de referidos y anfitriones con portafolio grande. Comisiones elite y acceso completo a todas las funcionalidades.',
      target: 'Influencers, agentes, anfitriones con más de 5 propiedades',
      commission: {
        affiliate: '10% por reserva referida',
        host: '15% de comisión de plataforma',
      },
      benefits: [
        'Todo lo del plan Conector',
        'Comisiones elite del 10% (las más altas del mercado)',
        'Reportes exportables (CSV, Excel, PDF)',
        'Manager dedicado de cuenta',
        'Acceso anticipado a nuevas funcionalidades',
      ],
      cta: 'Convertirme en Embajador',
      badge: 'Mayor ROI' as string | null,
    },
  },
} as const;
