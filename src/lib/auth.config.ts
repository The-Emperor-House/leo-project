import type { NextAuthConfig } from "next-auth";

export const authConfig: NextAuthConfig = {
  providers: [],
  callbacks: {
    jwt({ token, user }) {
      if (user) token.role = (user as { role?: string }).role;
      return token;
    },
    session({ session, token }) {
      if (session.user) (session.user as { role?: unknown }).role = token.role;
      return session;
    },
  },
  pages: { signIn: "/login" },
  session: { strategy: "jwt", maxAge: 8 * 60 * 60 },
};
