import NextAuth, { type DefaultSession } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { loginSchema } from '@/features/auth/schemas/auth.schema';
import axios from 'axios';

// Extend the built-in session type
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: 'ADMIN' | 'AFFILIATE' | 'HOST';
    } & DefaultSession['user'];
    accessToken: string;
  }

  interface User {
    id: string;
    email: string;
    name: string;
    role: 'ADMIN' | 'AFFILIATE' | 'HOST';
    accessToken: string;
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

          // Llamar al backend para autenticar
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
            { email, password }
          );

          const user = response.data;

          if (response.status === 200 && user) {
            return {
              id: user.id,
              email: user.email,
              name: user.name,
              role: user.role,
              accessToken: user.accessToken,
            };
          }

          return null;
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.role = user.role;
        token.accessToken = user.accessToken;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.role = token.role as 'ADMIN' | 'AFFILIATE' | 'HOST';
        session.accessToken = token.accessToken as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 días
  },
  secret: process.env.NEXTAUTH_SECRET,
});
