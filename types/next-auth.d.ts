import type { DefaultSession, DefaultUser } from 'next-auth';
import type { JWT as DefaultJWT } from 'next-auth/jwt';

// Auth.js のデフォルト型に isAdmin を追加し、
// session.user.isAdmin と JWT.isAdmin を型安全に扱えるようにする
declare module 'next-auth' {
  interface User extends DefaultUser {
    isAdmin: boolean;
  }

  interface Session {
    user: {
      isAdmin: boolean;
    } & DefaultSession['user'];
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    isAdmin: boolean;
  }
}
