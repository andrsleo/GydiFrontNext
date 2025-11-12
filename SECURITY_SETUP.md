# Configuración de Seguridad - GYDI Frontend (Next.js)

## Variables de Entorno Críticas

### Para Desarrollo Local

1. **Copia el archivo de ejemplo:**
   ```bash
   cd GydiFront
   cp .env.example .env.local
   ```

2. **Genera un NEXTAUTH_SECRET seguro:**

   **Opción 1: OpenSSL (Recomendado)**
   ```bash
   openssl rand -base64 32
   # Output: mZ3J8kR2vN9xL4pQ7sT1wY6uE5fH8gD0aK2cV4bN7mX=
   ```

   **Opción 2: Node.js**
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
   ```

   **Opción 3: NextAuth CLI**
   ```bash
   npx auth secret
   # Genera automáticamente y actualiza .env.local
   ```

3. **Edita `.env.local` con el secreto generado:**
   ```bash
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=mZ3J8kR2vN9xL4pQ7sT1wY6uE5fH8gD0aK2cV4bN7mX=
   NEXT_PUBLIC_API_URL=http://localhost:8080
   ```

4. **Verifica que funcione:**
   ```bash
   npm run dev
   # Navega a http://localhost:3000/login
   # Intenta hacer login
   ```

---

## Para Producción

### Opción 1: Variables de Entorno en Vercel (Recomendado)

1. **En Vercel Dashboard:**
   ```
   Project Settings → Environment Variables
   ```

2. **Agrega las variables:**
   ```
   Variable: NEXTAUTH_SECRET
   Value: [tu-secreto-generado-con-openssl]
   Environment: Production, Preview, Development
   ```

3. **Otras variables críticas:**
   ```
   NEXTAUTH_URL=https://gydi.com
   NEXT_PUBLIC_API_URL=https://api.gydi.com
   STRIPE_SECRET_KEY=[desde Stripe dashboard]
   ```

4. **Redeploy:**
   ```bash
   git push origin main
   # Vercel auto-redeploys con las nuevas variables
   ```

### Opción 2: Variables de Entorno en Docker

```dockerfile
# Dockerfile
FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .

# Build arguments (secrets no expuestos en la imagen)
ARG NEXTAUTH_SECRET
ARG NEXT_PUBLIC_API_URL

# Build time
ENV NEXTAUTH_SECRET=$NEXTAUTH_SECRET
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

RUN npm run build

# Production image
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
CMD ["node", "server.js"]
```

```bash
# Build con secretos
docker build \
  --build-arg NEXTAUTH_SECRET=$(openssl rand -base64 32) \
  --build-arg NEXT_PUBLIC_API_URL=https://api.gydi.com \
  -t gydi-frontend:latest .

# Run
docker run -p 3000:3000 gydi-frontend:latest
```

### Opción 3: Variables de Entorno en AWS (EC2, ECS, Lambda)

#### EC2/VPS:
```bash
# En el servidor
export NEXTAUTH_SECRET="tu-secreto-generado"
export NEXT_PUBLIC_API_URL="https://api.gydi.com"

# O en /etc/environment
echo 'NEXTAUTH_SECRET="..."' | sudo tee -a /etc/environment
```

#### ECS Task Definition:
```json
{
  "containerDefinitions": [
    {
      "name": "gydi-frontend",
      "image": "gydi-frontend:latest",
      "secrets": [
        {
          "name": "NEXTAUTH_SECRET",
          "valueFrom": "arn:aws:secretsmanager:us-east-1:ACCOUNT:secret:gydi/nextauth-secret"
        }
      ],
      "environment": [
        {
          "name": "NEXT_PUBLIC_API_URL",
          "value": "https://api.gydi.com"
        }
      ]
    }
  ]
}
```

#### AWS Secrets Manager:
```bash
# Crear secreto
aws secretsmanager create-secret \
  --name gydi/nextauth-secret \
  --secret-string "$(openssl rand -base64 32)" \
  --region us-east-1

# Obtener secreto (en código Node.js si es necesario)
const { SecretsManagerClient, GetSecretValueCommand } = require("@aws-sdk/client-secrets-manager");

const client = new SecretsManagerClient({ region: "us-east-1" });
const response = await client.send(
  new GetSecretValueCommand({ SecretId: "gydi/nextauth-secret" })
);
const secret = response.SecretString;
```

---

## Verificación de Seguridad

### Checklist Pre-Production

- [ ] `NEXTAUTH_SECRET` generado con al menos 32 caracteres aleatorios
- [ ] `NEXTAUTH_SECRET` diferente entre desarrollo, staging y producción
- [ ] `.env.local` NO está en el repositorio git
- [ ] Variables públicas (`NEXT_PUBLIC_*`) no contienen secretos
- [ ] `NEXTAUTH_URL` configurado con HTTPS en producción
- [ ] Cookies configuradas como `httpOnly` y `secure` en producción
- [ ] Security headers configurados en `next.config.ts`
- [ ] CSP (Content Security Policy) habilitado
- [ ] Rate limiting configurado para endpoints de autenticación

### Verificar que el secreto está configurado:

```bash
# Desarrollo
echo $NEXTAUTH_SECRET
# Debe mostrar tu secreto local

# Producción (Vercel)
vercel env ls
# Debe listar NEXTAUTH_SECRET como "Encrypted"
```

### Probar autenticación:

```bash
# Login exitoso
curl -X POST http://localhost:3000/api/auth/callback/credentials \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Debe devolver Set-Cookie con token firmado
```

---

## Rotación de Secretos

### ¿Cuándo rotar NEXTAUTH_SECRET?

- ✅ Cada 90 días (recomendado)
- ✅ Si hay sospecha de brecha de seguridad
- ✅ Si un desarrollador con acceso deja el equipo
- ✅ Después de una auditoría de seguridad
- ✅ Si el secreto se commitea accidentalmente a git

### Cómo rotar sin tiempo de inactividad:

#### Paso 1: Generar nuevo secreto
```bash
NEW_SECRET=$(openssl rand -base64 32)
echo $NEW_SECRET
```

#### Paso 2: Actualizar en producción

**Vercel:**
```bash
# Agregar como variable adicional temporalmente
vercel env add NEXTAUTH_SECRET_NEW
[paste new secret]

# Actualizar código para verificar ambos
# O simplemente reemplazar NEXTAUTH_SECRET y redeploy
vercel env rm NEXTAUTH_SECRET
vercel env add NEXTAUTH_SECRET
[paste new secret]
```

#### Paso 3: Invalidar sesiones antiguas

NextAuth con JWT no tiene un store centralizado de sesiones, por lo que:
- Las sesiones con el secreto antiguo dejarán de funcionar inmediatamente
- Los usuarios tendrán que volver a hacer login
- Comunica esto a los usuarios con anticipación

**Opción alternativa (transición gradual):**
```typescript
// lib/auth/auth-config.ts
import { NextAuthConfig } from 'next-auth';

export const authConfig: NextAuthConfig = {
  // ... other config
  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    async jwt({ token, user }) {
      // Puedes agregar lógica aquí para soportar múltiples secretos
      // durante la transición
      return token;
    },
  },
};
```

---

## Variables Públicas vs Privadas

### Variables PÚBLICAS (expuestas al navegador):
Prefijo: `NEXT_PUBLIC_*`

```bash
# ✅ Seguro exponer
NEXT_PUBLIC_API_URL=https://api.gydi.com
NEXT_PUBLIC_APP_NAME=GYDI
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxx

# ❌ NUNCA exponer
# NEXT_PUBLIC_STRIPE_SECRET_KEY=sk_live_xxx  # PELIGRO!
# NEXT_PUBLIC_DATABASE_URL=postgres://...     # PELIGRO!
```

### Variables PRIVADAS (solo servidor):
Sin prefijo `NEXT_PUBLIC_*`

```bash
# ✅ Seguro - solo disponible en servidor
NEXTAUTH_SECRET=...
STRIPE_SECRET_KEY=sk_live_...
DATABASE_URL=postgres://...
RESEND_API_KEY=re_...
```

**Regla de oro:** Si la variable contiene una credencial, contraseña, o secreto, **NUNCA** uses el prefijo `NEXT_PUBLIC_`.

---

## Problemas Comunes

### Error: `NEXTAUTH_SECRET` no está definido

**Solución:**
```bash
# Verifica que existe
cat .env.local | grep NEXTAUTH_SECRET

# Si no existe
echo 'NEXTAUTH_SECRET='$(openssl rand -base64 32) >> .env.local

# Reinicia el servidor
npm run dev
```

### Error: Invalid session signature

**Causa:** El secreto cambió pero hay cookies antiguas.

**Solución:**
1. Borra las cookies del navegador
2. Cierra sesión y vuelve a iniciar sesión
3. O borra cookies manualmente:
   ```javascript
   // En DevTools Console
   document.cookie.split(";").forEach(c => {
     document.cookie = c.trim().split("=")[0] + "=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/";
   });
   ```

### Las sesiones no persisten entre deploys

**Causa:** El secreto es diferente en cada deploy.

**Solución:**
- Configura `NEXTAUTH_SECRET` como variable de entorno persistente en Vercel/AWS
- NO lo generes dinámicamente en cada build

### Secreto se commiteo a git accidentalmente

**ACCIÓN INMEDIATA:**

1. **Rotar el secreto inmediatamente:**
   ```bash
   # Genera nuevo secreto
   openssl rand -base64 32

   # Actualiza en .env.local
   # Actualiza en producción (Vercel/AWS)
   ```

2. **Eliminar del historial de git:**
   ```bash
   # Usa BFG Repo-Cleaner
   brew install bfg
   bfg --replace-text passwords.txt .git
   git push --force
   ```

3. **Rotar TODAS las credenciales que estaban en ese archivo**

4. **Notificar al equipo de seguridad**

---

## Seguridad Adicional

### 1. Configurar cookies seguras

NextAuth debería configurar automáticamente en producción, pero verifica:

```typescript
// lib/auth/auth-config.ts
export const authConfig: NextAuthConfig = {
  cookies: {
    sessionToken: {
      name: `__Secure-next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: true, // Solo HTTPS en producción
      },
    },
  },
};
```

### 2. Configurar HTTPS obligatorio en producción

```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Forzar HTTPS en producción
  if (
    process.env.NODE_ENV === 'production' &&
    request.headers.get('x-forwarded-proto') !== 'https'
  ) {
    return NextResponse.redirect(
      `https://${request.headers.get('host')}${request.nextUrl.pathname}`,
      301
    );
  }

  return NextResponse.next();
}
```

### 3. Limitar intentos de login

Implementar rate limiting en el endpoint de autenticación:

```typescript
// app/api/auth/[...nextauth]/route.ts
import { rateLimit } from '@/lib/rate-limit';

const limiter = rateLimit({
  interval: 60 * 1000, // 1 minuto
  uniqueTokenPerInterval: 500,
});

export async function POST(request: Request) {
  try {
    await limiter.check(request, 5, 'LOGIN'); // 5 intentos por minuto
  } catch {
    return new Response('Too Many Requests', { status: 429 });
  }

  // Continuar con autenticación...
}
```

---

## Referencias

- [NextAuth.js Security Best Practices](https://next-auth.js.org/security/securing-your-application)
- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [Next.js Security Headers](https://nextjs.org/docs/app/api-reference/next-config-js/headers)
- [Vercel Environment Variables](https://vercel.com/docs/projects/environment-variables)

---

## Soporte

Si tienes problemas con la configuración de seguridad:
1. Revisa los logs de la aplicación: `npm run dev` o `vercel logs`
2. Verifica que las variables de entorno estén configuradas: `vercel env ls`
3. Consulta la documentación: `CLAUDE.md` y `ARCHITECTURE.md`
4. Contacta al equipo de DevOps/Seguridad

---

**Última actualización:** Noviembre 2025
**Versión:** 2.0
**Framework:** Next.js 15 + NextAuth.js v5
