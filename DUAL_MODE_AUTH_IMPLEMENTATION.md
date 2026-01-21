# Dual-Mode Authentication Implementation

Complete guide for the dual-mode authentication system in GYDI 2.0 frontend.

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Environment Modes](#environment-modes)
4. [File Structure](#file-structure)
5. [Usage Examples](#usage-examples)
6. [API Reference](#api-reference)
7. [Security](#security)
8. [Troubleshooting](#troubleshooting)

---

## Overview

GYDI 2.0 implements a **dual-mode authentication system** that works differently in development vs production:

### Development Mode
- Backend returns tokens in response body (`{ token, refreshToken, user }`)
- Frontend stores tokens in `localStorage`
- Tokens sent via `Authorization: Bearer <token>` header
- Easier debugging and testing

### Production Mode
- Backend sets httpOnly cookies (`access_token`, `refresh_token`)
- Frontend sends cookies automatically via `withCredentials: true`
- Cookies are XSS-proof (cannot be accessed by JavaScript)
- More secure, follows best practices

**Key Feature:** The same code works in both environments without changes!

---

## Architecture

### Component Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     React Application                        │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              AuthProvider (Provider)                  │  │
│  │  • Verifies auth on mount                            │  │
│  │  • Fetches current user from backend                 │  │
│  │  • Updates Zustand store                             │  │
│  └───────────────────────────────────────────────────────┘  │
│                           │                                  │
│  ┌────────────────────────┼──────────────────────────────┐  │
│  │                        │                              │  │
│  ▼                        ▼                              ▼  │
│ ┌─────────────┐  ┌─────────────────┐  ┌────────────────┐  │
│ │  useLogin   │  │ useCurrentUser  │  │   useLogout    │  │
│ │  (Hook)     │  │    (Hook)       │  │    (Hook)      │  │
│ └─────────────┘  └─────────────────┘  └────────────────┘  │
│        │                  │                     │           │
│        └──────────────────┼─────────────────────┘           │
│                           │                                  │
│                           ▼                                  │
│              ┌────────────────────────┐                      │
│              │   authApi (API Client) │                      │
│              │  • login()             │                      │
│              │  • logout()            │                      │
│              │  • verify()            │                      │
│              │  • getCurrentUser()    │                      │
│              └────────────────────────┘                      │
│                           │                                  │
│                           ▼                                  │
│              ┌────────────────────────┐                      │
│              │  apiClient (Axios)     │                      │
│              │  • Request interceptor │                      │
│              │  • Response interceptor│                      │
│              └────────────────────────┘                      │
└───────────────────────────┼─────────────────────────────────┘
                            │
                            ▼
         ┌──────────────────────────────────────┐
         │  Backend (Spring Boot)               │
         │  • /api/v1/auth/login                │
         │  • /api/v1/auth/logout               │
         │  • /api/v1/auth/verify               │
         │  • /api/v1/auth/refresh              │
         └──────────────────────────────────────┘
```

### Data Flow

#### Login Flow

```
1. User submits login form
   ↓
2. useLogin hook calls authApi.login({ email, password })
   ↓
3. authApi sends POST /api/v1/auth/login
   ↓
4. Backend validates credentials
   ↓
   ┌─────────────────────────────────────────────────────────┐
   │  DEVELOPMENT                │  PRODUCTION               │
   ├─────────────────────────────┼───────────────────────────┤
   │ Returns JSON:               │ Sets httpOnly cookies:    │
   │ {                           │ - access_token (cookie)   │
   │   user: {...},              │ - refresh_token (cookie)  │
   │   token: "jwt...",          │                           │
   │   refreshToken: "jwt..."    │ Returns JSON:             │
   │ }                           │ {                         │
   │                             │   user: {...}             │
   │                             │ }                         │
   └─────────────────────────────┴───────────────────────────┘
   ↓
5. authApi stores tokens (if development)
   localStorage.setItem('access_token', token)
   localStorage.setItem('refresh_token', refreshToken)
   ↓
6. useLogin updates Zustand store with user data
   setUser(user)
   ↓
7. User is redirected to /dashboard
```

#### Protected Route Access Flow

```
1. User visits /dashboard
   ↓
2. Middleware runs (src/middleware.ts)
   ↓
3. Middleware calls backend /api/v1/auth/verify
   ↓
   ┌─────────────────────────────────────────────────────────┐
   │  DEVELOPMENT                │  PRODUCTION               │
   ├─────────────────────────────┼───────────────────────────┤
   │ Sends:                      │ Sends:                    │
   │ Authorization:              │ Cookies automatically     │
   │ Bearer <token>              │ (withCredentials: true)   │
   └─────────────────────────────┴───────────────────────────┘
   ↓
4. Backend validates token
   ↓
   ┌─────────────────────────────────────────────────────────┐
   │  Valid Token                │  Invalid/Expired Token    │
   ├─────────────────────────────┼───────────────────────────┤
   │ Returns:                    │ Returns:                  │
   │ { valid: true, user: {...} }│ 401 Unauthorized          │
   │                             │                           │
   │ → Allow access              │ → Redirect to /login      │
   └─────────────────────────────┴───────────────────────────┘
```

#### Token Refresh Flow

```
1. API call returns 401 Unauthorized
   ↓
2. Response interceptor catches error
   ↓
3. Interceptor calls /api/v1/auth/refresh
   ↓
   ┌─────────────────────────────────────────────────────────┐
   │  DEVELOPMENT                │  PRODUCTION               │
   ├─────────────────────────────┼───────────────────────────┤
   │ Sends:                      │ Sends:                    │
   │ {                           │ (empty body)              │
   │   refreshToken: "jwt..."    │                           │
   │ }                           │ Cookies sent              │
   │                             │ automatically             │
   ├─────────────────────────────┼───────────────────────────┤
   │ Backend returns:            │ Backend returns:          │
   │ {                           │ (empty response)          │
   │   token: "new_jwt...",      │                           │
   │   refreshToken: "new_jwt..."│ Sets new cookies          │
   │ }                           │ automatically             │
   │                             │                           │
   │ → Update localStorage       │ → Cookies updated by      │
   │                             │   backend                 │
   └─────────────────────────────┴───────────────────────────┘
   ↓
4. Retry original request with new token
```

---

## Environment Modes

### Development Mode

**Environment Variables** (`.env.development`):
```bash
NODE_ENV=development
NEXT_PUBLIC_API_URL=http://localhost:8080
```

**Behavior:**
- Backend returns tokens in response body
- Frontend stores in `localStorage`
- Tokens sent via `Authorization` header
- Easy to inspect tokens in DevTools
- Simple debugging

**Token Storage:**
```javascript
// After login
localStorage.setItem('access_token', 'eyJhbGc...');
localStorage.setItem('refresh_token', 'eyJhbGc...');

// On logout
localStorage.removeItem('access_token');
localStorage.removeItem('refresh_token');
```

**Request Headers:**
```http
Authorization: Bearer eyJhbGc...
Content-Type: application/json
```

### Production Mode

**Environment Variables** (`.env.production`):
```bash
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://api.gydi.com
```

**Behavior:**
- Backend sets httpOnly cookies
- Frontend sends cookies automatically
- Cookies cannot be accessed by JavaScript (XSS-proof)
- Secure flag enabled (HTTPS only)
- SameSite protection

**Cookie Configuration (Backend):**
```java
// Backend sets these cookies
Cookie accessToken = new Cookie("access_token", token);
accessToken.setHttpOnly(true);  // XSS protection
accessToken.setSecure(true);    // HTTPS only
accessToken.setPath("/");
accessToken.setMaxAge(86400);   // 24 hours
accessToken.setSameSite("Strict"); // CSRF protection
```

**Request Headers:**
```http
Cookie: access_token=eyJhbGc...; refresh_token=eyJhbGc...
Content-Type: application/json
```

---

## File Structure

```
GydiFront/
├── src/
│   ├── lib/
│   │   └── api/
│   │       └── client.ts              # Axios instance with interceptors
│   │
│   ├── store/
│   │   └── auth-store.ts              # Zustand auth state
│   │
│   ├── features/
│   │   └── auth/
│   │       ├── api/
│   │       │   └── auth.api.ts        # Auth API client
│   │       │
│   │       ├── hooks/
│   │       │   └── use-auth.ts        # TanStack Query hooks
│   │       │
│   │       ├── providers/
│   │       │   └── auth-provider.tsx  # Auth context provider
│   │       │
│   │       ├── schemas/
│   │       │   └── auth.schema.ts     # Zod validation schemas
│   │       │
│   │       ├── types/
│   │       │   ├── auth.types.ts      # TypeScript types
│   │       │   └── index.ts
│   │       │
│   │       └── examples/
│   │           ├── login-form-example.tsx
│   │           └── protected-route-example.tsx
│   │
│   └── middleware.ts                   # Route protection middleware
│
├── .env.development                    # Development config
├── .env.production                     # Production config
└── .env.local                          # Local overrides (gitignored)
```

---

## Usage Examples

### 1. Setup AuthProvider

Wrap your app with `AuthProvider` to enable authentication:

```typescript
// app/layout.tsx
import { AuthProvider } from '@/features/auth/providers/auth-provider';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
```

### 2. Login Form

```typescript
// app/(auth)/login/page.tsx
'use client';

import { useLogin } from '@/features/auth/hooks/use-auth';
import { loginSchema } from '@/features/auth/schemas/auth.schema';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

export default function LoginPage() {
  const form = useForm({
    resolver: zodResolver(loginSchema),
  });

  const { mutate: login, isPending } = useLogin();

  const onSubmit = (data) => {
    login(data);
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <input {...form.register('email')} />
      <input {...form.register('password')} type="password" />
      <button type="submit" disabled={isPending}>
        Login
      </button>
    </form>
  );
}
```

### 3. Protected Route (Method 1: Manual Check)

```typescript
// app/(dashboard)/dashboard/page.tsx
'use client';

import { useAuthStore } from '@/store/auth-store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardPage() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) return null;

  return <div>Hello {user?.name}</div>;
}
```

### 4. Protected Route (Method 2: HOC)

```typescript
// app/(dashboard)/profile/page.tsx
import { withAuth } from '@/features/auth/providers/auth-provider';

function ProfilePage() {
  return <div>Profile Page</div>;
}

export default withAuth(ProfilePage);
```

### 5. Role-Based Protection

```typescript
// app/admin/users/page.tsx
import { withRole } from '@/features/auth/providers/auth-provider';

function AdminUsersPage() {
  return <div>Admin Users</div>;
}

export default withRole('ADMIN')(AdminUsersPage);
```

### 6. Logout Button

```typescript
// components/layout/user-menu.tsx
'use client';

import { useLogout } from '@/features/auth/hooks/use-auth';

export function UserMenu() {
  const { mutate: logout } = useLogout();

  return (
    <button onClick={() => logout()}>
      Logout
    </button>
  );
}
```

### 7. Get Current User

```typescript
// Any component
'use client';

import { useAuthStore } from '@/store/auth-store';

export function UserProfile() {
  const user = useAuthStore((state) => state.user);

  return <div>{user?.name}</div>;
}
```

### 8. Conditional Rendering

```typescript
// Any component
'use client';

import { useAuthStore } from '@/store/auth-store';

export function Header() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <header>
      {isAuthenticated ? (
        <UserMenu />
      ) : (
        <a href="/login">Login</a>
      )}
    </header>
  );
}
```

---

## API Reference

### Auth API (`authApi`)

Located in: `src/features/auth/api/auth.api.ts`

#### `login(credentials: LoginRequest): Promise<AuthUser>`

Login user and get auth tokens.

**Parameters:**
- `credentials.email` (string): User email
- `credentials.password` (string): User password

**Returns:** `AuthUser` object

**Example:**
```typescript
const user = await authApi.login({
  email: 'user@example.com',
  password: 'password123'
});
```

#### `logout(): Promise<void>`

Logout user and clear tokens.

**Example:**
```typescript
await authApi.logout();
```

#### `verify(): Promise<VerifyResponse>`

Verify current session/token is valid.

**Returns:** `{ valid: boolean, user?: AuthUser }`

**Example:**
```typescript
const { valid, user } = await authApi.verify();
if (valid) {
  console.log('User is authenticated:', user);
}
```

#### `getCurrentUser(): Promise<AuthUser | null>`

Get current authenticated user.

**Returns:** `AuthUser` or `null` if not authenticated

**Example:**
```typescript
const user = await authApi.getCurrentUser();
```

#### `refresh(): Promise<void>`

Refresh access token using refresh token.

**Example:**
```typescript
await authApi.refresh();
```

---

### Auth Hooks

Located in: `src/features/auth/hooks/use-auth.ts`

#### `useLogin(options?): UseMutationResult`

TanStack Query mutation for login.

**Options:**
- `onSuccess?: (user: AuthUser) => void` - Success callback
- `onError?: (error: Error) => void` - Error callback

**Returns:**
- `mutate: (credentials: LoginRequest) => void` - Login function
- `isPending: boolean` - Loading state
- `isError: boolean` - Error state
- `error: Error | null` - Error object

**Example:**
```typescript
const { mutate: login, isPending } = useLogin({
  onSuccess: (user) => {
    console.log('Logged in:', user);
    router.push('/dashboard');
  },
  onError: (error) => {
    console.error('Login failed:', error);
  },
});

login({ email: 'user@example.com', password: 'password123' });
```

#### `useLogout(options?): UseMutationResult`

TanStack Query mutation for logout.

**Example:**
```typescript
const { mutate: logout } = useLogout();
logout();
```

#### `useCurrentUser(options?): UseQueryResult`

TanStack Query for fetching current user.

**Returns:**
- `data: AuthUser | null` - User data
- `isLoading: boolean` - Loading state
- `isError: boolean` - Error state

**Example:**
```typescript
const { data: user, isLoading } = useCurrentUser();
```

#### `useIsAuthenticated(): boolean`

Check if user is authenticated (from Zustand store).

**Example:**
```typescript
const isAuthenticated = useIsAuthenticated();
```

#### `useUser(): AuthUser | null`

Get current user from Zustand store (no API call).

**Example:**
```typescript
const user = useUser();
```

---

### Zustand Store (`useAuthStore`)

Located in: `src/store/auth-store.ts`

#### State

```typescript
interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
```

#### Actions

```typescript
setUser(user: AuthUser | null): void
setLoading(isLoading: boolean): void
logout(): void
updateUser(updates: Partial<AuthUser>): void
```

#### Selectors

```typescript
selectUser(state): AuthUser | null
selectIsAuthenticated(state): boolean
selectIsLoading(state): boolean
selectUserRole(state): UserRole | undefined
selectUserPlan(state): SubscriptionPlan | undefined
```

**Usage:**
```typescript
// Get full state
const { user, isAuthenticated, isLoading } = useAuthStore();

// Get specific value
const user = useAuthStore((state) => state.user);
const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

// Use selectors (better performance)
const user = useAuthStore(selectUser);
const role = useAuthStore(selectUserRole);

// Update user
const setUser = useAuthStore((state) => state.setUser);
setUser(newUser);

// Logout
const logout = useAuthStore((state) => state.logout);
logout();
```

---

## Security

### XSS Protection

**Development:**
- Tokens in localStorage (vulnerable to XSS)
- Acceptable for development only

**Production:**
- Tokens in httpOnly cookies (XSS-proof)
- JavaScript cannot access cookies
- Even if XSS attack occurs, tokens are safe

### CSRF Protection

**CSRF Token Flow:**
1. Backend sets `XSRF-TOKEN` cookie (readable by JS)
2. Frontend reads token from cookie
3. Frontend sends token in `X-XSRF-TOKEN` header
4. Backend validates token matches cookie

**Implementation:**
```typescript
// In apiClient interceptor
const csrfToken = getCsrfToken(); // Read from cookie
config.headers['X-XSRF-TOKEN'] = csrfToken; // Send in header
```

### Cookie Security Flags

Backend sets these flags on cookies:

```java
cookie.setHttpOnly(true);    // XSS protection
cookie.setSecure(true);      // HTTPS only
cookie.setSameSite("Strict"); // CSRF protection
cookie.setPath("/");         // Scope
cookie.setMaxAge(86400);     // 24 hours
```

### Token Refresh

Automatic refresh on 401:
1. API call returns 401 Unauthorized
2. Interceptor catches error
3. Calls `/api/v1/auth/refresh` with refresh token
4. Backend validates refresh token
5. Returns new access token
6. Retries original request with new token

If refresh fails:
- Clear all tokens
- Clear Zustand store
- Redirect to login

---

## Troubleshooting

### Problem: "Token not found" in development

**Cause:** localStorage not set after login

**Solution:**
1. Check Network tab - verify login response contains `token` and `refreshToken`
2. Check Console - look for errors in `authApi.login()`
3. Verify backend is running in development mode
4. Check `NODE_ENV=development` in `.env.development`

### Problem: "401 Unauthorized" on every request

**Cause:** Token not being sent to backend

**Development:**
- Check localStorage contains `access_token`
- Verify Authorization header in Network tab
- Check interceptor is adding Bearer token

**Production:**
- Check cookies in DevTools (should see `access_token` cookie)
- Verify `withCredentials: true` in axios config
- Check backend CORS allows credentials

### Problem: Infinite redirect loop

**Cause:** Middleware and auth state mismatch

**Solution:**
1. Check middleware public routes list
2. Verify `/login` is in public routes
3. Clear localStorage and cookies
4. Hard refresh browser (Cmd+Shift+R)

### Problem: "CSRF token validation failed"

**Cause:** CSRF token missing or invalid

**Solution:**
1. Check `XSRF-TOKEN` cookie exists
2. Verify `X-XSRF-TOKEN` header in request
3. Call `fetchCsrfToken()` before making requests
4. Check backend CSRF configuration

### Problem: User data not persisting after refresh

**Cause:** Zustand persist not working

**Solution:**
1. Check localStorage contains `auth-storage` key
2. Verify Zustand persist middleware is configured
3. Check browser doesn't block localStorage
4. Try clearing localStorage and re-login

### Problem: Token refresh not working

**Cause:** Refresh token expired or invalid

**Solution:**
1. Check refresh token expiration (usually 7 days)
2. Verify `/api/v1/auth/refresh` endpoint works
3. Check refresh token in localStorage (dev) or cookies (prod)
4. Check backend logs for refresh errors

---

## Best Practices

### 1. Always use hooks, not API directly

```typescript
// ✅ Good
const { mutate: login } = useLogin();

// ❌ Bad
import { authApi } from '@/features/auth/api/auth.api';
authApi.login({ email, password });
```

### 2. Use Zustand selectors for better performance

```typescript
// ✅ Good
const user = useAuthStore(selectUser);

// ❌ Bad (re-renders on any auth state change)
const { user } = useAuthStore();
```

### 3. Protect routes at multiple levels

```typescript
// 1. Middleware (src/middleware.ts) - Server-side check
// 2. AuthProvider (src/features/auth/providers/auth-provider.tsx) - App-level
// 3. Component-level (withAuth HOC or manual check) - Component-level
```

### 4. Handle errors gracefully

```typescript
const { mutate: login } = useLogin({
  onError: (error) => {
    // Show user-friendly message
    toast.error('Invalid credentials. Please try again.');

    // Log for debugging
    console.error('Login error:', error);
  },
});
```

### 5. Clear sensitive data on logout

```typescript
const handleLogout = () => {
  // 1. Call backend logout
  logout();

  // 2. Clear localStorage (development)
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');

  // 3. Clear Zustand store
  useAuthStore.getState().logout();

  // 4. Redirect
  router.push('/login');
};
```

---

## Testing

### Unit Tests

```typescript
// features/auth/hooks/use-auth.test.ts
import { renderHook, waitFor } from '@testing-library/react';
import { useLogin } from './use-auth';

describe('useLogin', () => {
  it('should login user successfully', async () => {
    const { result } = renderHook(() => useLogin());

    result.current.mutate({
      email: 'test@example.com',
      password: 'password123',
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
  });
});
```

### E2E Tests

```typescript
// tests/e2e/auth.spec.ts
import { test, expect } from '@playwright/test';

test('user can login', async ({ page }) => {
  await page.goto('/login');

  await page.fill('[name="email"]', 'user@example.com');
  await page.fill('[name="password"]', 'password123');
  await page.click('button[type="submit"]');

  await expect(page).toHaveURL('/dashboard');
});
```

---

## Migration from NextAuth

If migrating from NextAuth:

1. Remove NextAuth dependencies:
```bash
npm uninstall next-auth
```

2. Remove NextAuth configuration:
```bash
rm -rf src/lib/auth/auth-config.ts
rm -rf app/api/auth/[...nextauth]
```

3. Update imports:
```typescript
// Before (NextAuth)
import { useSession } from 'next-auth/react';
const { data: session } = useSession();

// After (Dual-mode)
import { useUser } from '@/features/auth/hooks/use-auth';
const user = useUser();
```

4. Update middleware:
```typescript
// Before (NextAuth)
export { auth as middleware } from '@/lib/auth/auth-config';

// After (Dual-mode)
export { middleware } from '@/middleware';
```

---

## Additional Resources

- **Backend API Documentation**: http://localhost:8080/swagger-ui.html
- **TanStack Query Docs**: https://tanstack.com/query/latest
- **Zustand Docs**: https://docs.pmnd.rs/zustand
- **React Hook Form**: https://react-hook-form.com
- **Zod Validation**: https://zod.dev

---

**Last Updated:** January 6, 2026
**Version:** 1.0
**Author:** Frontend-AI (Claude Code)
