export const ERROR_PAGES_COPY = {
  not_found: {
    code: '404',
    title: 'Esto no debería estar aquí',
    description:
      'La página que buscas se mudó, fue borrada, o nunca existió. Lo sentimos, no fue nuestro mejor momento.',
    cta_primary: 'Ir al inicio',
    cta_secondary: 'Ver propiedades',
    hint: 'Si crees que esto es un error de nuestra parte, cuéntanos.',
    report_link: 'Reportar problema',
  },

  server_error: {
    code: '500',
    title: 'Algo salió mal de nuestro lado',
    description:
      'Nuestros servidores tuvieron un momento difícil. Ya estamos trabajando en ello. Intenta de nuevo en unos minutos.',
    cta_primary: 'Intentar de nuevo',
    cta_secondary: 'Ir al inicio',
  },

  unauthorized: {
    code: '401',
    title: 'Necesitas iniciar sesión',
    description:
      'Esta sección es solo para usuarios registrados. Inicia sesión o crea tu cuenta gratis para continuar.',
    cta_primary: 'Iniciar sesión',
    cta_secondary: 'Crear cuenta gratis',
  },

  forbidden: {
    code: '403',
    title: 'No tienes acceso a esta sección',
    description:
      'Esta página requiere permisos especiales. Si crees que deberías tener acceso, contacta a nuestro equipo.',
    cta_primary: 'Ir a mi Dashboard',
    cta_secondary: 'Contactar soporte',
  },
} as const;
