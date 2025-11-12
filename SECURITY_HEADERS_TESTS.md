# Pruebas de Security Headers - GYDI Frontend (Next.js 15)

## Headers Implementados

### Resumen de Protecciones

| Header | Protege Contra | Configurado |
|--------|----------------|-------------|
| **Content-Security-Policy** | XSS, Data Injection | ✅ |
| **X-Frame-Options** | Clickjacking | ✅ |
| **X-Content-Type-Options** | MIME Sniffing | ✅ |
| **X-XSS-Protection** | XSS (Legacy) | ✅ |
| **Referrer-Policy** | Information Leakage | ✅ |
| **Strict-Transport-Security** | MITM, Downgrade Attacks | ✅ (Prod only) |
| **Permissions-Policy** | Unauthorized API Access | ✅ |

---

## Verificar Headers

### Método 1: Browser DevTools

1. **Abrir DevTools:**
   - Chrome/Edge: F12
   - Firefox: F12
   - Safari: Cmd+Option+I

2. **Network Tab:**
   - Navega a http://localhost:3000
   - Selecciona el documento principal
   - Click en "Headers" tab
   - Busca "Response Headers"

**Headers esperados:**

```
content-security-policy: default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https: blob:; font-src 'self'; connect-src 'self' http://localhost:8080; frame-ancestors 'none'; base-uri 'self'; form-action 'self'
x-frame-options: DENY
x-content-type-options: nosniff
x-xss-protection: 1; mode=block
referrer-policy: strict-origin-when-cross-origin
permissions-policy: camera=(), microphone=(), geolocation=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=()
```

En producción, también verás:
```
strict-transport-security: max-age=31536000; includeSubDomains; preload
```

---

### Método 2: curl

```bash
# Desarrollo
curl -I http://localhost:3000 2>&1 | grep -i "security\|frame\|content-type\|xss\|referrer\|permissions"

# Producción
curl -I https://gydi.com 2>&1 | grep -i "security\|frame\|content-type\|xss\|referrer\|permissions\|strict-transport"
```

**Output esperado:**
```
content-security-policy: default-src 'self'; script-src ...
x-frame-options: DENY
x-content-type-options: nosniff
x-xss-protection: 1; mode=block
referrer-policy: strict-origin-when-cross-origin
permissions-policy: camera=(), microphone=(), ...
```

---

### Método 3: Online Security Header Checker

**SecurityHeaders.com:**
1. Visita https://securityheaders.com
2. Ingresa tu URL: `https://gydi.com` (cuando esté en producción)
3. Click "Scan"

**Resultado esperado: A+ Rating**

**Mozilla Observatory:**
1. Visita https://observatory.mozilla.org
2. Ingresa tu URL
3. Click "Scan Me"

**Resultado esperado: A o A+ Rating**

---

## Pruebas de Seguridad

### Test 1: Content Security Policy (CSP)

**Objetivo:** Verificar que scripts externos estén bloqueados

**Prueba:**
1. Abre DevTools Console
2. Intenta ejecutar:
   ```javascript
   // Esto debería estar permitido (mismo origen)
   console.log('Test');

   // Esto debería estar bloqueado (script inline malicioso)
   eval('console.log("malicious code")');
   // Warning en consola pero se ejecuta por 'unsafe-eval'
   ```

**Resultado esperado:**
- Scripts de mismo origen: ✅ Permitido
- Scripts inline con eval: ⚠️ Permitido pero logueado (Next.js necesita eval en dev)
- Scripts externos sin autorización: ❌ Bloqueado

---

### Test 2: X-Frame-Options (Clickjacking Protection)

**Objetivo:** Verificar que la página no pueda ser embebida en iframe

**Prueba:**
Crea un archivo HTML:

```html
<!-- test-iframe.html -->
<!DOCTYPE html>
<html>
<head>
    <title>Iframe Test</title>
</head>
<body>
    <h1>Intentando cargar GYDI en iframe:</h1>
    <iframe src="http://localhost:3000" width="800" height="600"></iframe>
</body>
</html>
```

Abre `test-iframe.html` en el navegador.

**Resultado esperado:**
- ❌ El iframe NO carga
- 🔴 Error en consola:
  ```
  Refused to display 'http://localhost:3000/' in a frame because it set 'X-Frame-Options' to 'deny'.
  ```

---

### Test 3: X-Content-Type-Options (MIME Sniffing Protection)

**Objetivo:** Verificar que el navegador respete el Content-Type declarado

**Prueba:**
1. Sube un archivo `.txt` al servidor
2. Intenta cargarlo como script:
   ```html
   <script src="/uploads/malicious.txt"></script>
   ```

**Resultado esperado:**
- ❌ El navegador NO ejecuta el archivo como JavaScript
- 🔴 Error en consola:
  ```
  Refused to execute script from '...' because its MIME type ('text/plain') is not executable, and strict MIME type checking is enabled.
  ```

---

### Test 4: Strict-Transport-Security (HSTS)

**Objetivo:** Verificar que el navegador siempre use HTTPS (solo producción)

**Prueba (en producción):**
1. Intenta acceder vía HTTP:
   ```bash
   curl -I http://gydi.com
   ```

**Resultado esperado:**
- 🔄 Redirect automático a HTTPS (301)
- ✅ Header HSTS presente en respuesta HTTPS:
  ```
  strict-transport-security: max-age=31536000; includeSubDomains; preload
  ```

**Efecto:**
- Primera visita: HTTP → HTTPS redirect
- Siguientes visitas: Navegador automáticamente usa HTTPS (sin redirect)

---

### Test 5: Permissions-Policy

**Objetivo:** Verificar que APIs del navegador estén deshabilitadas

**Prueba:**

```javascript
// En DevTools Console

// 1. Intentar acceder a cámara (debería fallar)
navigator.mediaDevices.getUserMedia({ video: true })
  .then(() => console.log('✗ Camera allowed'))
  .catch(() => console.log('✓ Camera blocked'));

// 2. Intentar acceder a micrófono (debería fallar)
navigator.mediaDevices.getUserMedia({ audio: true })
  .then(() => console.log('✗ Microphone allowed'))
  .catch(() => console.log('✓ Microphone blocked'));

// 3. Intentar acceder a geolocalización (debería fallar)
navigator.geolocation.getCurrentPosition(
  () => console.log('✗ Geolocation allowed'),
  () => console.log('✓ Geolocation blocked')
);
```

**Resultado esperado:**
```
✓ Camera blocked
✓ Microphone blocked
✓ Geolocation blocked
```

---

## Verificación Automatizada

### Script de verificación

```bash
#!/bin/bash
# security-headers-check.sh

URL="${1:-http://localhost:3000}"

echo "=== Security Headers Check ==="
echo "URL: $URL"
echo ""

HEADERS=(
  "content-security-policy"
  "x-frame-options"
  "x-content-type-options"
  "x-xss-protection"
  "referrer-policy"
  "permissions-policy"
)

for header in "${HEADERS[@]}"; do
  VALUE=$(curl -s -I "$URL" | grep -i "^$header:" | cut -d ' ' -f2-)

  if [ -z "$VALUE" ]; then
    echo "❌ $header: NOT FOUND"
  else
    echo "✅ $header: $VALUE"
  fi
done

# Check HSTS (only in production)
if [[ "$URL" == https://* ]]; then
  HSTS=$(curl -s -I "$URL" | grep -i "^strict-transport-security:" | cut -d ' ' -f2-)

  if [ -z "$HSTS" ]; then
    echo "⚠️  strict-transport-security: NOT FOUND (Should be present in production)"
  else
    echo "✅ strict-transport-security: $HSTS"
  fi
fi

echo ""
echo "=== Check Complete ==="
```

**Uso:**
```bash
chmod +x security-headers-check.sh

# Desarrollo
./security-headers-check.sh http://localhost:3000

# Producción
./security-headers-check.sh https://gydi.com
```

---

## Troubleshooting

### Problema: CSP bloqueando recursos legítimos

**Síntoma:**
```
Refused to load the image 'https://example.com/image.jpg' because it violates the following Content Security Policy directive: "img-src 'self' data: https: blob:"
```

**Causa:** El dominio no está en la whitelist de CSP

**Solución:**
1. Abre `next.config.ts`
2. Agrega el dominio a la directiva correspondiente:
   ```typescript
   // Para imágenes
   "img-src 'self' data: https: blob: https://example.com",

   // Para scripts
   "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.example.com",

   // Para API calls
   `connect-src 'self' ${process.env.NEXT_PUBLIC_API_URL} https://api.example.com`,
   ```

---

### Problema: Iframe legítimo no carga

**Síntoma:**
```
Refused to display in a frame because it set 'X-Frame-Options' to 'deny'.
```

**Causa:** X-Frame-Options está configurado como DENY

**Solución:**

Si necesitas permitir iframes de dominios específicos:

```typescript
// next.config.ts
{
  key: 'X-Frame-Options',
  value: 'SAMEORIGIN',  // Permite iframes del mismo origen
}

// O usar CSP frame-ancestors en lugar de X-Frame-Options
"frame-ancestors 'self' https://trusted-domain.com",
```

---

### Problema: Next.js no aplica los headers

**Síntoma:** Headers no aparecen en DevTools

**Posibles causas:**
1. Next.js no reiniciado después de cambios en `next.config.ts`
2. Caché del navegador

**Solución:**
```bash
# 1. Limpiar caché de Next.js
rm -rf .next

# 2. Reinstalar dependencias si es necesario
npm install

# 3. Reiniciar dev server
npm run dev

# 4. Limpiar caché del navegador
# Chrome: Cmd+Shift+Delete (Mac) / Ctrl+Shift+Delete (Windows)
# Seleccionar "Cached images and files"
```

---

### Problema: HSTS no funciona

**Síntoma:** No hay redirect automático a HTTPS

**Causa:** HSTS solo funciona en producción (`NODE_ENV=production`)

**Solución:**
1. Verifica variable de entorno:
   ```bash
   echo $NODE_ENV
   # Should print: production
   ```

2. Build y start en modo producción:
   ```bash
   npm run build
   npm start
   ```

3. Accede vía HTTPS (no HTTP)

---

## Mejoras Futuras

### 1. CSP con Nonces (Más Seguro)

En lugar de `'unsafe-inline'` para scripts:

```typescript
// next.config.ts
export default {
  async headers() {
    const nonce = Buffer.from(crypto.randomUUID()).toString('base64');

    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: `script-src 'self' 'nonce-${nonce}'`,
          },
        ],
      },
    ];
  },
};
```

```tsx
// Usar nonce en scripts inline
<script nonce={nonce}>
  console.log('Allowed with nonce');
</script>
```

---

### 2. CSP Report-Only Mode (Testing)

Para testear CSP sin bloquear:

```typescript
{
  key: 'Content-Security-Policy-Report-Only',
  value: cspValue,
}
```

Los reportes de violaciones se loguean pero no se bloquea nada.

---

### 3. CSP Reporting Endpoint

Recibir reportes de violaciones:

```typescript
// Agregar a CSP
`report-uri https://your-domain.com/api/csp-report; report-to csp-endpoint`,
```

```typescript
// app/api/csp-report/route.ts
export async function POST(request: Request) {
  const report = await request.json();

  console.log('CSP Violation:', report);

  // Opcionalmente, enviar a servicio de monitoreo
  // await sendToSentry(report);

  return new Response('OK', { status: 200 });
}
```

---

## Referencias

- [OWASP Secure Headers Project](https://owasp.org/www-project-secure-headers/)
- [MDN - Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [MDN - X-Frame-Options](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options)
- [MDN - Strict-Transport-Security](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Strict-Transport-Security)
- [SecurityHeaders.com](https://securityheaders.com)
- [Mozilla Observatory](https://observatory.mozilla.org)

---

**Última actualización:** Noviembre 2025
**Versión:** 1.0
**Framework:** Next.js 15
