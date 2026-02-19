export const REFERRALS_COPY = {
  section: {
    title: 'Tres pasos para tu primer ingreso',
    subtitle:
      'No necesitas experiencia en ventas. Solo tener contactos y ganas de ganar.',
  },

  steps: [
    {
      number: '01',
      title: 'Genera tu link único',
      description:
        'Con un click obtienes tu URL personal de referido. Cada link rastrea automáticamente las visitas y reservas que generas, sin que tengas que hacer nada técnico.',
      icon: 'link',
    },
    {
      number: '02',
      title: 'Comparte con quien confía en ti',
      description:
        'Manda el link por WhatsApp, Instagram, email o imprímelo en un QR para tu negocio físico. Tu recomendación personal tiene más peso que cualquier anuncio.',
      icon: 'share',
    },
    {
      number: '03',
      title: 'Cobra cuando ellos reservan',
      description:
        'Cada vez que alguien hace una reserva usando tu link, la comisión se registra automáticamente en tu dashboard y se acredita a tu cuenta.',
      icon: 'wallet',
    },
  ],

  share: {
    motivational:
      'Tu siguiente comisión está a un mensaje de distancia. Comparte ahora.',
    button_primary: 'Copiar mi link',
    button_whatsapp: 'Compartir por WhatsApp',
    button_qr: 'Generar código QR',
    copy_confirmation: 'Link copiado al portapapeles',
    share_message_template:
      'Encontré este alojamiento increíble en GYDI. Úsalo con mi link: {REFERRAL_URL}',
  },

  empty_state: {
    title: 'Tu primer referido está a un click',
    description:
      'Genera tu link personalizado y comparte la propiedad perfecta con alguien de tu red. La primera comisión siempre es la más emocionante.',
    cta: 'Generar mi primer link',
  },
} as const;
