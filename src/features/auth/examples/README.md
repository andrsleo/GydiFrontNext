# Authentication Examples

This directory contains complete, production-ready examples of authentication patterns in GYDI 2.0.

## Files

### 1. `login-form-example.tsx`

Complete login form implementation with:
- React Hook Form + Zod validation
- TanStack Query mutation (useLogin)
- Error handling and loading states
- Success/error toasts
- Automatic redirect to dashboard

**Usage:**
```typescript
// In app/(auth)/login/page.tsx
import { LoginFormExample } from '@/features/auth/examples/login-form-example';

export default function LoginPage() {
  return (
    <div className="container mx-auto max-w-md py-10">
      <h1 className="mb-6 text-3xl font-bold">Iniciar Sesión</h1>
      <LoginFormExample />
    </div>
  );
}
```

### 2. `protected-route-example.tsx`

Multiple patterns for protecting routes:

#### Pattern 1: Manual Auth Check
```typescript
import { ProtectedDashboard } from '@/features/auth/examples/protected-route-example';

export default function DashboardPage() {
  return <ProtectedDashboard />;
}
```

#### Pattern 2: HOC (Higher-Order Component)
```typescript
import { ProfilePageExample } from '@/features/auth/examples/protected-route-example';

export default ProfilePageExample; // Already wrapped with withAuth
```

#### Pattern 3: Role-Based Protection
```typescript
import { AdminUsersPageExample } from '@/features/auth/examples/protected-route-example';

export default AdminUsersPageExample; // Only ADMIN can access
```

#### Pattern 4: Conditional Rendering
```typescript
import { ConditionalContent } from '@/features/auth/examples/protected-route-example';

export default function HomePage() {
  return (
    <div>
      <h1>GYDI Platform</h1>
      <ConditionalContent /> {/* Shows different content based on auth */}
    </div>
  );
}
```

#### Pattern 5: Logout Button
```typescript
import { LogoutButton } from '@/features/auth/examples/protected-route-example';

function Header() {
  return (
    <header>
      <nav>
        <LogoutButton />
      </nav>
    </header>
  );
}
```

## Quick Start

### 1. Setup AuthProvider

Wrap your app with `AuthProvider` in the root layout:

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

### 2. Use Examples

Copy and adapt the examples to your needs. All examples work in both development and production without changes.

## Environment Configuration

### Development (`.env.development`)
```bash
NODE_ENV=development
NEXT_PUBLIC_API_URL=http://localhost:8080
```

**Behavior:**
- Tokens stored in localStorage
- Sent via Authorization header
- Easy debugging

### Production (`.env.production`)
```bash
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://api.gydi.com
```

**Behavior:**
- Tokens stored in httpOnly cookies
- Sent automatically via withCredentials
- XSS-proof and secure

## Common Patterns

### Check if user is authenticated
```typescript
import { useAuthStore } from '@/store/auth-store';

const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
```

### Get current user
```typescript
import { useAuthStore } from '@/store/auth-store';

const user = useAuthStore((state) => state.user);
```

### Login
```typescript
import { useLogin } from '@/features/auth/hooks/use-auth';

const { mutate: login, isPending } = useLogin();
login({ email: 'user@example.com', password: 'password123' });
```

### Logout
```typescript
import { useLogout } from '@/features/auth/hooks/use-auth';

const { mutate: logout } = useLogout();
logout();
```

### Protect a page
```typescript
import { withAuth } from '@/features/auth/providers/auth-provider';

function MyProtectedPage() {
  return <div>Protected Content</div>;
}

export default withAuth(MyProtectedPage);
```

### Protect by role
```typescript
import { withRole } from '@/features/auth/providers/auth-provider';

function AdminPage() {
  return <div>Admin Only</div>;
}

export default withRole('ADMIN')(AdminPage);
```

## Documentation

For complete documentation, see:
- **Main Guide**: `GydiFront/DUAL_MODE_AUTH_IMPLEMENTATION.md`
- **Project CLAUDE.md**: `GydiFront/CLAUDE.md`
- **Architecture**: `GydiFront/ARCHITECTURE.md`

## Support

If you encounter issues:

1. Check the troubleshooting section in `DUAL_MODE_AUTH_IMPLEMENTATION.md`
2. Verify environment variables are set correctly
3. Check browser DevTools Network tab for API calls
4. Check browser Console for errors
5. Verify backend is running and accessible

---

**Last Updated:** January 6, 2026
**Examples Version:** 1.0
