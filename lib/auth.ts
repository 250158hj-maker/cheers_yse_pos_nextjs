import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { db } from './db';

export const { auth, handlers, signIn, signOut } = NextAuth({
  // CredentialsProvider は DB セッション戦略をサポートしないため JWT 必須
  session: { strategy: 'jwt' },

  providers: [
    Credentials({
      credentials: {
        loginId: { label: 'ログインID', type: 'text' },
        password: { label: 'パスワード', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.loginId || !credentials?.password) {
          return null;
        }

        const user = await db.user.findUnique({
          where: { loginId: credentials.loginId as string },
        });
        if (!user) {
          return null;
        }

        const ok = await bcrypt.compare(
          credentials.password as string,
          user.password,
        );
        if (!ok) {
          return null;
        }

        // NextAuth の User 型は id を string 型で要求するため変換する
        return {
          id: String(user.id),
          name: user.name,
          isAdmin: user.isAdmin,
        };
      },
    }),
  ],

  callbacks: {
    // proxy.ts のロール判定で DB を毎回叩かないよう、isAdmin を JWT に載せる
    async jwt({ token, user }) {
      if (user) {
        token.isAdmin = user.isAdmin;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.isAdmin = token.isAdmin;
      }
      return session;
    },
  },

  pages: {
    // SCR-01 ログイン画面はルート (`/`) なので、Auth.js デフォルトの /api/auth/signin は使わない
    signIn: '/',
  },
});
