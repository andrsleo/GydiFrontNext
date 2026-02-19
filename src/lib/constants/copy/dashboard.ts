export const DASHBOARD_COPY = {
  welcome: {
    affiliate: {
      title: 'Bienvenido a GYDI, {firstName}',
      subtitle:
        'Tu dashboard de comisiones está listo. Genera tu primer link y empieza a ganar desde hoy.',
      cta: 'Generar mi link',
      motivational:
        'Los afiliados activos en GYDI ganan en promedio $240 al mes. Tu historia empieza ahora.',
    },

    host: {
      title: 'Tu propiedad merece más reservas, {firstName}',
      subtitle:
        'Lista tu alojamiento y activa una red de afiliados que lo promocionan activamente para ti.',
      cta: 'Listar mi propiedad',
      motivational:
        'Las propiedades en GYDI reciben en promedio 3x más visibilidad que en plataformas tradicionales.',
    },

    returning: {
      title: 'Hola de nuevo, {firstName}',
      subtitle: 'Aquí está un resumen de tu actividad reciente',
    },
  },

  empty_states: {
    no_referrals: {
      title: 'Aún no tienes referidos',
      description:
        'Comparte tu primer link y regresa a ver cómo van los números. Puede que ya haya alguien viendo esa propiedad.',
      cta: 'Ver propiedades para referir',
      hint: 'Tip: Las propiedades con fotos profesionales convierten 40% mejor.',
    },

    no_properties: {
      title: 'Tu portafolio está esperando',
      description:
        'Agrega tu primera propiedad y empieza a recibir visitas de una red de afiliados motivados en hacer reservas.',
      cta: 'Agregar propiedad',
      hint: 'Tip: Las propiedades con descripción completa y 5+ fotos se refieren 3x más.',
    },

    no_earnings: {
      title: 'Tus ganancias empiezan aquí',
      description:
        'Aún no hay comisiones registradas. Comparte tu link de referido con alguien que esté planeando un viaje y mira cómo cambia esto.',
      cta: 'Ir a mis referidos',
    },

    no_bookings_host: {
      title: 'La primera reserva está en camino',
      description:
        'Los afiliados están viendo tu propiedad. Asegúrate de tener disponibilidad actualizada y buenas fotos para maximizar conversiones.',
      cta: 'Editar mi propiedad',
    },
  },

  success_messages: {
    referral_created:
      'Link generado. Ahora comparte: cada visita es una comisión potencial.',
    property_listed:
      'Propiedad publicada. Ya está visible para toda la red de afiliados.',
    commission_earned: 'Nueva comisión registrada. Sigue así, {firstName}.',
    plan_upgraded: 'Plan actualizado. Tus nuevas comisiones ya están activas.',
  },

  quick_actions: {
    generate_link: {
      title: 'Generar Link de Referido',
      description: 'Crea un enlace único para compartir propiedades',
    },
    view_stats: {
      title: 'Ver Estadísticas',
      description: 'Analiza tu rendimiento y conversiones',
    },
    request_payout: {
      title: 'Solicitar Pago',
      description: 'Retira tus comisiones acumuladas',
    },
  },

  stats: {
    labels: {
      total_clicks: 'Clicks totales',
      total_referrals: 'Referidos activos',
      total_earned: 'Comisiones del Mes',
      conversion_rate: 'Tasa de conversión',
      pending_payout: 'Por cobrar',
      bookings_received: 'Reservas recibidas',
    },
    period_label: 'Rendimiento de los Últimos 30 Días',
  },
} as const;
