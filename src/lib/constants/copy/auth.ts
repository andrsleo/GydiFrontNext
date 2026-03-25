export const AUTH_COPY = {
  login: {
    title: 'Bienvenido de vuelta',
    subtitle: 'Tus comisiones te están esperando.',
    submit: 'Entrar a mi cuenta',
    forgot_password: 'Olvidé mi contraseña',
    no_account: '¿Aún no tienes cuenta?',
    no_account_cta: 'Regístrate gratis',
    oauth: {
      google: 'Continuar con Google',
      divider: 'o ingresa con tu email',
    },
  },

  register: {
    title: 'Empieza a ganar hoy',
    subtitle:
      'Crea tu cuenta gratis y genera tu primer link de referido en menos de 2 minutos.',
    submit: 'Crear mi cuenta gratis',
    already_account: '¿Ya tienes cuenta?',
    already_account_cta: 'Inicia sesión',
    terms:
      'Al registrarte aceptas nuestros Términos de Servicio y Política de Privacidad.',
    oauth: {
      google: 'Registrarse con Google',
      divider: 'o regístrate con tu email',
    },
    role_selector: {
      label: 'Quiero unirme como...',
      affiliate: 'referido (ganar comisiones)',
      host: 'Anfitrión (listar propiedades)',
      both: 'Las dos cosas',
    },
  },

  fields: {
    placeholders: {
      first_name: 'Tu nombre',
      last_name: 'Tu apellido',
      full_name: 'Nombre completo',
      email: 'tu@email.com',
      password: 'Mínimo 8 caracteres',
      password_confirm: 'Repite tu contraseña',
      phone: '+52 55 0000 0000',
    },
    labels: {
      first_name: 'Nombre',
      last_name: 'Apellido',
      email: 'Correo electrónico',
      password: 'Contraseña',
      password_confirm: 'Confirmar contraseña',
      remember_me: 'Mantenerme conectado',
    },
  },

  errors: {
    invalid_credentials:
      'El email o la contraseña no son correctos. Inténtalo de nuevo.',
    email_not_found:
      'No encontramos una cuenta con ese email. ¿Quieres registrarte?',
    email_already_exists:
      'Ya existe una cuenta con ese email. Inicia sesión o recupera tu contraseña.',
    password_too_short: 'La contraseña debe tener al menos 8 caracteres.',
    passwords_dont_match: 'Las contraseñas no coinciden.',
    invalid_email: 'Ingresa un email válido.',
    required_field: 'Este campo es obligatorio.',
    server_error:
      'Algo salió mal de nuestro lado. Intenta de nuevo en unos momentos.',
    session_expired: 'Tu sesión expiró. Ingresa de nuevo para continuar.',
    too_many_attempts:
      'Demasiados intentos fallidos. Espera 15 minutos antes de intentar de nuevo.',
  },

  password_reset: {
    title: 'Recupera tu acceso',
    subtitle:
      'Ingresa tu email y te enviamos un link para crear una nueva contraseña.',
    submit: 'Enviar link de recuperación',
    success_title: 'Revisa tu bandeja de entrada',
    success_message:
      'Te enviamos un link a {email}. Si no lo ves, revisa tu carpeta de spam.',
    back_to_login: 'Volver al inicio de sesión',
  },
} as const;
