import NextAuth, { type DefaultSession } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { loginSchema } from '@/features/auth/schemas/auth.schema';
import type { UserRole, SubscriptionPlan, UserCapabilities } from '@/types/user';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';





// Extend the built-in session type
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: UserRole;
      activePlan: SubscriptionPlan;
      capabilities: UserCapabilities;
      accountVerified: boolean;
    } & DefaultSession['user'];
    accessToken: string;
    error?: string;
  }

  interface User {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    activePlan: SubscriptionPlan;
    capabilities: UserCapabilities;
    accountVerified: boolean;
    accessToken: string;
    refreshToken: string;
  }
}

// Extend JWT token type
interface ExtendedJWT {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  activePlan: SubscriptionPlan;
  capabilities: UserCapabilities;
  accountVerified: boolean;
  accessToken: string;
  refreshToken: string;
  accessTokenExpires: number;
  error?: string;
}

/**
 * Refresh access token using refresh token
 */
async function refreshAccessToken(token: ExtendedJWT): Promise<ExtendedJWT> {
  try {
    const response = await axios.post(`${API_URL}/api/v1/auth/refresh`, {
      refreshToken: token.refreshToken,
    });

    const data = response.data;

    return {
      ...token,
      accessToken: data.token,
      refreshToken: data.refreshToken ?? token.refreshToken,
      accessTokenExpires: Date.now() + 24 * 60 * 60 * 1000, // 24h
      error: undefined,
    };
  } catch (error) {
    console.error('Error refreshing access token:', error);
    return {
      ...token,
      error: 'RefreshAccessTokenError',
    };
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          // Validar credentials con Zod
          const validatedFields = loginSchema.safeParse(credentials);

          if (!validatedFields.success) {
            return null;
          }

          const { email, password } = validatedFields.data;

          // Llamar al backend - cookies se setean automáticamente
          const response = await axios.post(`${API_URL}/api/v1/auth/login`, {
            email,
            password,
          }, {
            withCredentials: true,
          });

          const data = response.data;

          if (response.status === 200 && data) {
            return {
              id: data.user.id.toString(),
              email: data.user.email,
              name: data.user.name,
              role: data.user.roleNames?.[0] || 'USER',
              activePlan: 'FREE', // Backend devuelve esto en user claims
              capabilities: {
                canPublish: true,
                canRefer: true,
                canRent: true,
              },
              accountVerified: false,
              accessToken: data.token,
              refreshToken: data.refreshToken,
            };
          }

          return null;
        } catch (error: any) {
          // Handle expected errors (invalid credentials)
          if (axios.isAxiosError(error) && error.response?.status === 401) {
            return null;
          }

          // Log unexpected errors
          console.error('Auth error:', error instanceof Error ? error.message : error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      const extToken = token as unknown as ExtendedJWT;

      // Initial login
      if (user) {
        extToken.id = user.id;
        extToken.email = user.email;
        extToken.name = user.name;
        extToken.role = user.role;
        extToken.activePlan = user.activePlan;
        extToken.capabilities = user.capabilities;
        extToken.accountVerified = user.accountVerified;
        extToken.accessToken = user.accessToken;
        extToken.refreshToken = user.refreshToken;
        extToken.accessTokenExpires = Date.now() + 24 * 60 * 60 * 1000; // 24h
        return extToken;
      }

      // Token still valid
      if (Date.now() < extToken.accessTokenExpires) {
        return extToken;
      }

      // Token expired, refresh it
      return refreshAccessToken(extToken);
    },

    async session({ session, token }) {
      const extToken = token as unknown as ExtendedJWT;
      session.user.id = extToken.id;
      session.user.email = extToken.email || '';
      session.user.name = extToken.name || '';
      session.user.role = extToken.role;
      session.user.activePlan = extToken.activePlan;
      session.user.capabilities = extToken.capabilities;
      session.user.accountVerified = extToken.accountVerified;

      // SECURITY: Only expose accessToken in development
      // In production, backend uses httpOnly cookies (XSS-proof)
      const isDevelopment = process.env.NODE_ENV === 'development';
      if (isDevelopment) {
        session.accessToken = extToken.accessToken;
      }
      // In production: session.accessToken is undefined (secure)

      session.error = extToken.error;
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 7 * 24 * 60 * 60, // 7 días (reducido de 30)
    updateAge: 24 * 60 * 60, // Actualizar cada 24h
  },
  cookies: {
    sessionToken: {
      name: 'gydi.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },
  logger: {
    error(code, ...message) {
      if (code instanceof Error && code.name === 'CredentialsSignin') {
        return;
      }
      if (typeof code === 'string' && code === 'CredentialsSignin') {
        return;
      }
      console.error(code, ...message);
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});
