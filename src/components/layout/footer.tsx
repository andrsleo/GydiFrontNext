import Link from 'next/link';
import { Facebook, Twitter, Instagram, Linkedin, Sparkles } from 'lucide-react';

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-border/40 bg-gradient-to-br from-gray-50 via-background to-primary/5">
      {/* Animated gradient line */}
      <div className="absolute inset-x-0 top-0 h-0.5 animate-gradient bg-gradient-to-r from-primary via-blue-500 to-purple-500 bg-[length:200%_100%]" />

      {/* Decorative blurs */}
      <div className="absolute right-0 top-1/4 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute left-0 bottom-1/4 h-64 w-64 rounded-full bg-blue-500/5 blur-3xl" />

      <div className="container relative mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Company */}
          <div className="group">
            <div className="mb-4 flex items-center gap-2">
              <h3 className="bg-gradient-to-r from-primary via-blue-600 to-purple-600 bg-clip-text text-lg font-extrabold text-transparent">
                GYDI
              </h3>
              <Sparkles className="h-4 w-4 text-primary opacity-0 transition-all duration-300 group-hover:animate-pulse-glow group-hover:opacity-100" />
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              El complemento de Airbnb que convierte tu red en comisiones reales por reservas vacacionales.
            </p>
            <div className="mt-4 flex space-x-3">
              <Link
                href="#"
                className="group/icon relative overflow-hidden rounded-lg bg-primary/5 p-2 transition-all duration-300 hover:scale-110 hover:bg-primary/10 hover:shadow-lg hover:shadow-primary/20"
              >
                <Facebook className="h-5 w-5 text-primary transition-transform duration-300 group-hover/icon:rotate-12" />
              </Link>
              <Link
                href="#"
                className="group/icon relative overflow-hidden rounded-lg bg-blue-500/5 p-2 transition-all duration-300 hover:scale-110 hover:bg-blue-500/10 hover:shadow-lg hover:shadow-blue-500/20"
              >
                <Twitter className="h-5 w-5 text-blue-600 transition-transform duration-300 group-hover/icon:rotate-12" />
              </Link>
              <Link
                href="#"
                className="group/icon relative overflow-hidden rounded-lg bg-purple-500/5 p-2 transition-all duration-300 hover:scale-110 hover:bg-purple-500/10 hover:shadow-lg hover:shadow-purple-500/20"
              >
                <Instagram className="h-5 w-5 text-purple-600 transition-transform duration-300 group-hover/icon:rotate-12" />
              </Link>
              <Link
                href="#"
                className="group/icon relative overflow-hidden rounded-lg bg-indigo-500/5 p-2 transition-all duration-300 hover:scale-110 hover:bg-indigo-500/10 hover:shadow-lg hover:shadow-indigo-500/20"
              >
                <Linkedin className="h-5 w-5 text-indigo-600 transition-transform duration-300 group-hover/icon:rotate-12" />
              </Link>
            </div>
          </div>

          {/* Product */}
          <div className="group/section">
            <h3 className="mb-4 text-sm font-bold text-foreground transition-colors group-hover/section:text-primary">
              Producto
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  href="/propiedades"
                  className="group/link relative inline-block text-muted-foreground transition-all duration-300 hover:translate-x-1 hover:text-primary"
                >
                  <span className="relative">
                    Propiedades
                    <span className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-gradient-to-r from-primary to-blue-500 transition-transform duration-300 group-hover/link:scale-x-100" />
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  href="/#precios"
                  className="group/link relative inline-block text-muted-foreground transition-all duration-300 hover:translate-x-1 hover:text-primary"
                >
                  <span className="relative">
                    Precios
                    <span className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-gradient-to-r from-primary to-blue-500 transition-transform duration-300 group-hover/link:scale-x-100" />
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  href="/#como-funciona"
                  className="group/link relative inline-block text-muted-foreground transition-all duration-300 hover:translate-x-1 hover:text-primary"
                >
                  <span className="relative">
                    Cómo Funciona
                    <span className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-gradient-to-r from-primary to-blue-500 transition-transform duration-300 group-hover/link:scale-x-100" />
                  </span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="group/section">
            <h3 className="mb-4 text-sm font-bold text-foreground transition-colors group-hover/section:text-blue-600">
              Empresa
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  href="/about"
                  className="group/link relative inline-block text-muted-foreground transition-all duration-300 hover:translate-x-1 hover:text-blue-600"
                >
                  <span className="relative">
                    Sobre Nosotros
                    <span className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-gradient-to-r from-blue-500 to-purple-500 transition-transform duration-300 group-hover/link:scale-x-100" />
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="group/link relative inline-block text-muted-foreground transition-all duration-300 hover:translate-x-1 hover:text-blue-600"
                >
                  <span className="relative">
                    Contacto
                    <span className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-gradient-to-r from-blue-500 to-purple-500 transition-transform duration-300 group-hover/link:scale-x-100" />
                  </span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="group/section">
            <h3 className="mb-4 text-sm font-bold text-foreground transition-colors group-hover/section:text-purple-600">
              Legal
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  href="/privacy"
                  className="group/link relative inline-block text-muted-foreground transition-all duration-300 hover:translate-x-1 hover:text-purple-600"
                >
                  <span className="relative">
                    Privacidad
                    <span className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-gradient-to-r from-purple-500 to-primary transition-transform duration-300 group-hover/link:scale-x-100" />
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="group/link relative inline-block text-muted-foreground transition-all duration-300 hover:translate-x-1 hover:text-purple-600"
                >
                  <span className="relative">
                    Términos y Condiciones
                    <span className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-gradient-to-r from-purple-500 to-primary transition-transform duration-300 group-hover/link:scale-x-100" />
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  href="/cookies"
                  className="group/link relative inline-block text-muted-foreground transition-all duration-300 hover:translate-x-1 hover:text-purple-600"
                >
                  <span className="relative">
                    Política de Cookies
                    <span className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-gradient-to-r from-purple-500 to-primary transition-transform duration-300 group-hover/link:scale-x-100" />
                  </span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-border/40 pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()}{' '}
            <span className="bg-gradient-to-r from-primary via-blue-600 to-purple-600 bg-clip-text font-semibold text-transparent">
              GYDI
            </span>
            . Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
