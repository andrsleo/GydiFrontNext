# Quick Start - Dual-Mode Authentication

**Get started with authentication in 5 minutes!**

---

## 1. Verify Files (All Created ✅)

```bash
# Core files (already existed, verified compatible)
✅ src/lib/api/client.ts              # Axios with interceptors
✅ src/store/auth-store.ts            # Zustand auth state
✅ src/features/auth/api/auth.api.ts  # Auth API client
✅ src/features/auth/hooks/use-auth.ts # TanStack Query hooks
✅ src/middleware.ts                   # Route protection

# New files created
✅ src/features/auth/providers/auth-provider.tsx
✅ src/features/auth/examples/login-form-example.tsx
✅ src/features/auth/examples/protected-route-example.tsx
✅ src/features/auth/examples/README.md

# Configuration
✅ .env.development (updated)
✅ .env.production (updated)
✅ .env.local (exists)

# Documentation
✅ DUAL_MODE_AUTH_IMPLEMENTATION.md (complete guide)
✅ AUTH_IMPLEMENTATION_SUMMARY.md (summary)
✅ QUICK_START_AUTH.md (this file)
```

---

## 2. Setup (3 Steps)

### Step 1: Add AuthProvider to Root Layout

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

### Step 2: Update Login Page

```typescript
// app/(auth)/login/page.tsx
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

### Step 3: Protect Dashboard Routes

```typescript
// app/(dashboard)/dashboard/page.tsx
import { withAuth } from '@/features/auth/providers/auth-provider';

function DashboardPage() {
  const user = useAuthStore((state) => state.user);

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome, {user?.name}!</p>
    </div>
  );
}

export default withAuth(DashboardPage);
```

---

## 3. Test (Development Mode)

### Terminal 1: Start Backend
```bash
cd GydiMicroservices
./mvnw spring-boot:run
```

### Terminal 2: Start Frontend
```bash
cd GydiFront
npm run dev
```

### Browser: Test Flow
1. Open http://localhost:3000/login
2. Enter credentials
3. Check DevTools > Application > Local Storage
   - Should see `access_token` and `refresh_token`
4. Navigate to http://localhost:3000/dashboard
   - Should see dashboard (protected route)
5. Click logout
   - Should redirect to login
   - Local storage cleared

---

## 4. Common Use Cases

### Get Current User
```typescript
'use client';
import { useAuthStore } from '@/store/auth-store';

export function UserProfile() {
  const user = useAuthStore((state) => state.user);
  return <div>{user?.name}</div>;
}
```

### Check if Authenticated
```typescript
'use client';
import { useAuthStore } from '@/store/auth-store';

export function Header() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <header>
      {isAuthenticated ? <UserMenu /> : <LoginButton />}
    </header>
  );
}
```

### Login Hook
```typescript
'use client';
import { useLogin } from '@/features/auth/hooks/use-auth';

export function LoginButton() {
  const { mutate: login, isPending } = useLogin();

  const handleLogin = () => {
    login({ email: 'user@example.com', password: 'password123' });
  };

  return (
    <button onClick={handleLogin} disabled={isPending}>
      {isPending ? 'Logging in...' : 'Login'}
    </button>
  );
}
```

### Logout Hook
```typescript
'use client';
import { useLogout } from '@/features/auth/hooks/use-auth';

export function LogoutButton() {
  const { mutate: logout } = useLogout();

  return (
    <button onClick={() => logout()}>
      Logout
    </button>
  );
}
```

### Protect Route (HOC)
```typescript
import { withAuth } from '@/features/auth/providers/auth-provider';

function MyProtectedPage() {
  return <div>Protected Content</div>;
}

export default withAuth(MyProtectedPage);
```

### Protect by Role
```typescript
import { withRole } from '@/features/auth/providers/auth-provider';

function AdminPage() {
  return <div>Admin Only</div>;
}

export default withRole('ADMIN')(AdminPage);
```

---

## 5. Environment Configuration

### Development (Current)
File: `.env.development`
```bash
NODE_ENV=development
NEXT_PUBLIC_API_URL=http://localhost:8080
```

**Behavior:**
- Tokens in localStorage
- Authorization header
- Easy debugging

### Production (When Deploying)
File: `.env.production` or Vercel Environment Variables
```bash
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://api.gydi.com
```

**Behavior:**
- Tokens in httpOnly cookies
- Automatic sending
- XSS-proof

---

## 6. Examples

See complete examples in:
- `src/features/auth/examples/login-form-example.tsx`
- `src/features/auth/examples/protected-route-example.tsx`
- `src/features/auth/examples/README.md`

---

## 7. Documentation

### Quick Reference
📄 This file: `QUICK_START_AUTH.md`

### Complete Guide (6,500+ words)
📄 `DUAL_MODE_AUTH_IMPLEMENTATION.md`
- Architecture diagrams
- Data flow
- API reference
- Security
- Troubleshooting

### Summary
📄 `AUTH_IMPLEMENTATION_SUMMARY.md`
- File listing
- Next steps
- Testing checklist

### Examples
📄 `src/features/auth/examples/README.md`

---

## 8. Troubleshooting

### Problem: "Token not found"
**Solution:** Check localStorage in DevTools > Application > Local Storage

### Problem: "401 Unauthorized"
**Solution:**
1. Verify backend is running
2. Check NEXT_PUBLIC_API_URL in .env.development
3. Check Network tab for Authorization header

### Problem: "Page not found" after login
**Solution:** Check routes exist in app directory

### Problem: Infinite redirect
**Solution:**
1. Check middleware public routes include `/login`
2. Clear localStorage and cookies
3. Hard refresh (Cmd+Shift+R)

### More Help
See "Troubleshooting" section in `DUAL_MODE_AUTH_IMPLEMENTATION.md`

---

## 9. Next Steps

### Now (Integration)
- [x] Files created ✅
- [ ] Add AuthProvider to layout
- [ ] Update login page
- [ ] Protect dashboard routes
- [ ] Test in development

### Soon (Testing)
- [ ] Unit tests
- [ ] E2E tests
- [ ] Manual testing checklist

### Later (Production)
- [ ] Configure production backend URL
- [ ] Verify HTTPS setup
- [ ] Test cookie-based auth
- [ ] Deploy to production

---

## 10. Quick Commands

```bash
# Start development
cd GydiFront
npm run dev

# Type check
npm run type-check

# Build
npm run build

# Test
npm test
npm run test:e2e
```

---

## Support

**Questions?** See `DUAL_MODE_AUTH_IMPLEMENTATION.md`

**Issues?** Check the Troubleshooting section

**Need examples?** See `src/features/auth/examples/`

---

**Status:** ✅ Ready to use

**Next action:** Follow Step 2 (Setup) above to integrate into your app.

---

**Last Updated:** January 6, 2026
**Version:** 1.0
