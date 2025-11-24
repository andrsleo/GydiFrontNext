# 🧪 Testing Guide: "Recordarme" Security Fix

**Feature:** Remember Me (Email-Only)
**Security Level:** HIGH
**Status:** READY FOR TESTING

---

## 🎯 Testing Objectives

Verify that the "Recordarme" feature:
1. **Does NOT store passwords** in localStorage
2. **Stores ONLY email** when checkbox is checked
3. **Pre-fills email** on subsequent visits
4. **Cleans up** previously stored passwords
5. **Maintains session** via secure httpOnly cookies

---

## 🧪 Test Cases

### Test Case 1: Password NOT Stored

**Objective:** Verify passwords are NOT stored in localStorage

**Steps:**
1. Navigate to `http://localhost:3000/login`
2. Enter credentials:
   - Email: `admin@demo.com`
   - Password: `123456`
3. Check "Recordarme" checkbox
4. Click "Iniciar Sesión"
5. Open Chrome DevTools (F12)
6. Navigate to: **Application > Local Storage > http://localhost:3000**

**Expected Result:**
```javascript
// ✅ SHOULD EXIST
localStorage.getItem('rememberedEmail')  // "admin@demo.com"
localStorage.getItem('rememberMe')       // "true"

// ❌ SHOULD NOT EXIST
localStorage.getItem('rememberedPassword')  // null
```

**Status:** [ ] PASS [ ] FAIL

---

### Test Case 2: Email Pre-fill on Return Visit

**Objective:** Verify email is pre-filled when user returns

**Steps:**
1. Complete Test Case 1 (login with "Recordarme")
2. Navigate to Dashboard (should be logged in)
3. Click "Cerrar Sesión" (Logout)
4. You should be redirected to `/login`
5. Observe the login form

**Expected Result:**
- ✅ Email field is pre-filled with `admin@demo.com`
- ✅ Password field is EMPTY
- ✅ "Recordarme" checkbox is CHECKED

**Status:** [ ] PASS [ ] FAIL

---

### Test Case 3: Session Persistence (Refresh Tokens)

**Objective:** Verify session persists via httpOnly cookies (NOT localStorage)

**Steps:**
1. Login with "Recordarme" checked
2. Navigate to `/dashboard`
3. Verify you see dashboard content
4. **Close the browser completely** (not just the tab)
5. Reopen browser
6. Navigate to `http://localhost:3000/dashboard`

**Expected Result:**
- ✅ Dashboard loads WITHOUT requiring login
- ✅ User remains authenticated
- ✅ Session persisted via cookies (NOT localStorage)

**Status:** [ ] PASS [ ] FAIL

---

### Test Case 4: Cleanup of Old Passwords

**Objective:** Verify automatic cleanup of previously stored passwords

**Steps:**
1. Open Chrome DevTools Console
2. Manually add old password (simulate old version):
   ```javascript
   localStorage.setItem('rememberedPassword', 'old-insecure-password');
   ```
3. Verify it exists:
   ```javascript
   localStorage.getItem('rememberedPassword')  // "old-insecure-password"
   ```
4. Refresh the `/login` page (F5)
5. Check localStorage again:
   ```javascript
   localStorage.getItem('rememberedPassword')  // Should be null
   ```

**Expected Result:**
- ✅ Password is automatically removed on page load
- ✅ Only email and rememberMe flag remain

**Status:** [ ] PASS [ ] FAIL

---

### Test Case 5: Unchecking "Recordarme"

**Objective:** Verify clearing stored data when checkbox is unchecked

**Steps:**
1. If not already logged in, login with "Recordarme" CHECKED
2. Logout
3. Return to `/login` (email should be pre-filled)
4. **UNCHECK** "Recordarme" checkbox
5. Click "Iniciar Sesión"
6. After successful login, check localStorage

**Expected Result:**
```javascript
localStorage.getItem('rememberedEmail')  // null
localStorage.getItem('rememberMe')       // null
```

**Status:** [ ] PASS [ ] FAIL

---

### Test Case 6: httpOnly Cookie Verification

**Objective:** Verify session cookies are secure (httpOnly)

**Steps:**
1. Login successfully
2. Open Chrome DevTools
3. Navigate to: **Application > Cookies > http://localhost:3000**
4. Find cookie: `gydi.session-token`
5. Inspect cookie properties

**Expected Result:**
- ✅ Name: `gydi.session-token`
- ✅ HttpOnly: `true` (✓)
- ✅ Secure: `false` (in dev), `true` (in production)
- ✅ SameSite: `Lax`

**JavaScript Access Test:**
```javascript
// In DevTools Console, try to read the cookie:
document.cookie  // Should NOT contain session-token (httpOnly prevents access)
```

**Status:** [ ] PASS [ ] FAIL

---

### Test Case 7: XSS Attack Simulation

**Objective:** Verify credentials are NOT exposed to JavaScript

**Steps:**
1. Login with "Recordarme" checked
2. Open Chrome DevTools Console
3. Execute malicious script (simulating XSS attack):
   ```javascript
   // Attacker's script trying to steal credentials
   const stolenEmail = localStorage.getItem('rememberedEmail');
   const stolenPassword = localStorage.getItem('rememberedPassword');

   console.log('Stolen Email:', stolenEmail);
   console.log('Stolen Password:', stolenPassword);
   ```

**Expected Result:**
```
Stolen Email: "admin@demo.com"  // ⚠️ Exposed (but not a secret)
Stolen Password: null           // ✅ PROTECTED (not stored)
```

**Interpretation:**
- ✅ Password is NOT exposed (mitigates critical vulnerability)
- ⚠️ Email is exposed (acceptable - email is not a secret)

**Status:** [ ] PASS [ ] FAIL

---

### Test Case 8: Session Expiration

**Objective:** Verify session expires after 7 days

**Steps:**
1. Login with "Recordarme" checked
2. Note current time
3. **Manually advance system time 7 days forward**
   - Mac: System Preferences > Date & Time > Uncheck "Set date and time automatically" > Set date 7 days ahead
   - Or wait 7 days (not practical)
4. Refresh any protected page (e.g., `/dashboard`)

**Expected Result:**
- ✅ User is logged out (session expired)
- ✅ Redirected to `/login`
- ✅ Email is still pre-filled (remembered)
- ✅ Must enter password again

**Status:** [ ] PASS [ ] FAIL

---

## 🔍 Security Checklist

After completing all test cases, verify:

- [ ] Password is NEVER stored in localStorage
- [ ] Password is NEVER visible in DevTools
- [ ] Email is stored in localStorage (acceptable)
- [ ] Email is pre-filled on return visits
- [ ] Session persists via httpOnly cookies
- [ ] httpOnly cookies are NOT accessible via JavaScript
- [ ] Old passwords are automatically cleaned up
- [ ] Unchecking "Recordarme" removes stored data
- [ ] Session expires after 7 days
- [ ] XSS attack cannot steal passwords

---

## 🐛 Bug Reporting

If any test case fails, report with:

**Bug Template:**
```
Test Case: [Name]
Status: FAIL
Environment: [Browser, OS]
Steps to Reproduce:
1. [Step 1]
2. [Step 2]
3. ...

Expected Result:
[What should happen]

Actual Result:
[What actually happened]

Screenshots:
[Attach DevTools screenshots]
```

---

## 📊 Test Results Summary

| Test Case | Status | Notes |
|-----------|--------|-------|
| 1. Password NOT Stored | [ ] | |
| 2. Email Pre-fill | [ ] | |
| 3. Session Persistence | [ ] | |
| 4. Cleanup Old Passwords | [ ] | |
| 5. Uncheck "Recordarme" | [ ] | |
| 6. httpOnly Cookies | [ ] | |
| 7. XSS Attack Simulation | [ ] | |
| 8. Session Expiration | [ ] | |

**Overall Status:** [ ] ALL PASS [ ] SOME FAIL

---

## 🚀 Deployment Checklist

Before deploying to production:

- [ ] All test cases pass
- [ ] Code review completed
- [ ] Security team approval (if applicable)
- [ ] Staging environment tested
- [ ] Production environment variables configured:
  - [ ] `NEXTAUTH_SECRET` is strong (>= 32 chars)
  - [ ] `NODE_ENV=production` (enables secure cookies)
- [ ] User documentation updated
- [ ] Rollback plan prepared

---

## 📚 Additional Testing Tools

### Browser Compatibility
Test in multiple browsers:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

### Automated Testing (Future)
Consider adding Playwright E2E tests:

```typescript
// tests/e2e/remember-me.spec.ts
import { test, expect } from '@playwright/test';

test('should NOT store password in localStorage', async ({ page }) => {
  await page.goto('/login');

  await page.fill('[name="email"]', 'admin@demo.com');
  await page.fill('[name="password"]', '123456');
  await page.check('[name="remember-me"]');
  await page.click('button[type="submit"]');

  // Verify localStorage
  const rememberedPassword = await page.evaluate(() => {
    return localStorage.getItem('rememberedPassword');
  });

  expect(rememberedPassword).toBeNull();
});
```

---

## 🎓 Testing Best Practices

1. **Test in Private/Incognito Mode**
   - Ensures clean localStorage state
   - No interference from previous sessions

2. **Clear Browser Data Between Tests**
   - Chrome: Settings > Privacy > Clear browsing data
   - Or use Incognito mode

3. **Use DevTools Network Tab**
   - Monitor API calls during login
   - Verify JWT tokens in response headers

4. **Document Edge Cases**
   - What if localStorage is disabled?
   - What if cookies are blocked?
   - What if user has multiple tabs open?

---

**Testing Completed By:** __________________
**Date:** __________________
**Sign-Off:** __________________

---

**Related Documents:**
- [SECURITY_REMEMBER_ME.md](./SECURITY_REMEMBER_ME.md) - Full security report
- [src/app/(auth)/login/page.tsx](./src/app/(auth)/login/page.tsx) - Implementation
- [src/lib/auth/auth.config.ts](./src/lib/auth/auth.config.ts) - NextAuth configuration
