# Tipografía GYDI

Esta documentación describe la configuración tipográfica de la plataforma GYDI.

## Fuentes Principales

### Plus Jakarta Sans
**Uso:** Fuente principal para cuerpo de texto, navegación, botones y elementos UI.

**Características:**
- Moderna y profesional
- Excelente legibilidad en pantallas
- Geométrica con trazos suaves
- Optimizada para interfaces digitales

**Pesos disponibles:**
- 300 (Light)
- 400 (Regular)
- 500 (Medium)
- 600 (Semibold)
- 700 (Bold)
- 800 (Extrabold)

**Variable CSS:** `--font-sans`
**Clase Tailwind:** `font-sans` (aplicada por defecto)

### Outfit
**Uso:** Fuente para encabezados (h1-h6), títulos destacados y elementos hero.

**Características:**
- Geométrica y moderna
- Alta personalidad visual
- Perfecta para títulos grandes
- Excelente jerarquía visual

**Pesos disponibles:**
- 400 (Regular)
- 500 (Medium)
- 600 (Semibold)
- 700 (Bold)
- 800 (Extrabold)
- 900 (Black)

**Variable CSS:** `--font-heading`
**Clase Tailwind:** `font-heading`

## Configuración Técnica

### Layout (layout.tsx)
```typescript
import { Plus_Jakarta_Sans, Outfit } from 'next/font/google';

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['300', '400', '500', '600', '700', '800'],
  display: 'swap',
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-heading',
  weight: ['400', '500', '600', '700', '800', '900'],
  display: 'swap',
});
```

### Tailwind Config
```typescript
fontFamily: {
  sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
  heading: ['var(--font-heading)', 'system-ui', 'sans-serif'],
  mono: ['monospace'],
}
```

## Jerarquía Tipográfica

### Encabezados (automáticamente usan Outfit)

| Elemento | Tamaño Base | Tamaño SM | Tamaño MD | Peso |
|----------|-------------|-----------|-----------|------|
| h1 | 2.25rem (36px) | 3rem (48px) | 3.75rem (60px) | 800 (Extrabold) |
| h2 | 1.875rem (30px) | 2.25rem (36px) | 3rem (48px) | 800 (Extrabold) |
| h3 | 1.5rem (24px) | 1.875rem (30px) | - | 700 (Bold) |
| h4 | 1.25rem (20px) | 1.5rem (24px) | - | 700 (Bold) |
| h5 | 1.125rem (18px) | 1.25rem (20px) | - | 600 (Semibold) |
| h6 | 1rem (16px) | 1.125rem (18px) | - | 600 (Semibold) |

### Cuerpo de Texto (usa Plus Jakarta Sans)

| Elemento | Tamaño | Peso | Uso |
|----------|--------|------|-----|
| Párrafo grande | 1.125rem (18px) | 400 (Regular) | Hero, destacados |
| Párrafo normal | 1rem (16px) | 400 (Regular) | Contenido general |
| Párrafo pequeño | 0.875rem (14px) | 400 (Regular) | Descripciones, metadata |
| Texto pequeño | 0.75rem (12px) | 400 (Regular) | Etiquetas, footnotes |

## Optimizaciones Tipográficas

### Font Features (OpenType)

**Body (Plus Jakarta Sans):**
```css
font-feature-settings: 'cv02', 'cv03', 'cv04', 'cv11';
letter-spacing: -0.011em;
```

**Headings (Outfit):**
```css
font-feature-settings: 'ss01', 'ss02';
letter-spacing: -0.02em;
```

### Mejoras de Renderizado
- `display: 'swap'` - Evita FOIT (Flash of Invisible Text)
- `antialiased` - Suavizado de bordes en navegadores
- `leading-relaxed` - Interlineado cómodo para lectura

## Uso en Componentes

### Títulos con Outfit
```tsx
<h1 className="font-heading text-6xl font-extrabold">
  Título Principal
</h1>
```

### Texto destacado con Outfit
```tsx
<span className="font-heading text-2xl font-bold text-primary">
  Texto Destacado
</span>
```

### Cuerpo de texto (Plus Jakarta Sans por defecto)
```tsx
<p className="text-base text-muted-foreground">
  Contenido regular del cuerpo.
</p>
```

### Botones y UI
```tsx
<Button className="font-sans font-semibold">
  Acción
</Button>
```

## Ejemplos de Combinaciones

### Hero Section
```tsx
<h1 className="text-6xl font-extrabold"> {/* Outfit */}
  La Plataforma Integral
</h1>
<p className="text-xl text-muted-foreground"> {/* Plus Jakarta Sans */}
  Vende propiedades y gana comisiones
</p>
```

### Card Title + Description
```tsx
<h3 className="text-2xl font-bold mb-2"> {/* Outfit */}
  Título de la Tarjeta
</h3>
<p className="text-sm text-muted-foreground"> {/* Plus Jakarta Sans */}
  Descripción del contenido de la tarjeta.
</p>
```

### Stats Display
```tsx
<div className="font-heading text-5xl font-extrabold"> {/* Outfit */}
  $450
</div>
<div className="font-sans text-sm text-muted-foreground"> {/* Plus Jakarta Sans */}
  por noche
</div>
```

## Paleta de Colores con Tipografía

| Uso | Color | Fuente Recomendada |
|-----|-------|-------------------|
| Títulos principales | `text-foreground` | Outfit (extrabold) |
| Subtítulos | `text-muted-foreground` | Plus Jakarta Sans (medium) |
| Énfasis primario | `text-primary` | Outfit (bold) |
| Texto de acción | `text-blue-600` | Plus Jakarta Sans (semibold) |
| Texto de éxito | `text-purple-600` | Plus Jakarta Sans (bold) |
| Texto secundario | `text-muted-foreground` | Plus Jakarta Sans (regular) |

## Mejores Prácticas

### ✅ Hacer

1. **Usar Outfit para todos los encabezados** - Crea jerarquía visual clara
2. **Usar Plus Jakarta Sans para UI** - Consistencia en navegación y botones
3. **Aprovechar los pesos** - 400 para texto, 600-700 para énfasis, 800+ para impacto
4. **Respetar letter-spacing** - Las configuraciones están optimizadas para legibilidad
5. **Usar clases semánticas** - `font-heading` para títulos, `font-sans` para cuerpo

### ❌ Evitar

1. **No mezclar fuentes en títulos** - Mantener Outfit consistente
2. **No usar pesos extremos en cuerpo** - 300-500 para texto largo
3. **No reducir letter-spacing adicional** - Ya está optimizado
4. **No usar más de 3 pesos por componente** - Mantener simplicidad
5. **No agregar fuentes adicionales** - Sistema está completo

## Accesibilidad

### Contraste
- Mínimo 4.5:1 para texto normal (AA)
- Mínimo 3:1 para texto grande (>24px o >18px bold)

### Tamaños Mínimos
- Cuerpo de texto: 16px (1rem)
- Texto secundario: 14px (0.875rem)
- Nunca menos de 12px (0.75rem)

### Responsive
- Escalado automático con breakpoints sm/md/lg
- Reducción gradual en móviles
- Jerarquía visual mantenida en todos los tamaños

## Changelog

### v2.0 (Octubre 2025)
- ✨ **Implementación inicial**
- Migración de Inter a Plus Jakarta Sans + Outfit
- Configuración de font features para mejor rendering
- Establecimiento de jerarquía tipográfica completa
- Optimizaciones de performance con display: swap

---

**Última actualización:** Octubre 2025
**Mantenedor:** GYDI Team
**Fuentes:** Google Fonts (Plus Jakarta Sans, Outfit)
