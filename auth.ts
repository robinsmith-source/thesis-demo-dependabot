import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth, { type NextAuthConfig, type DefaultSession } from "next-auth";
import Discord from "next-auth/providers/discord";
import { db } from "~/server/db";

declare module "@auth/core" {
  interface Session extends DefaultSession {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}

export const {
  handlers: { GET, POST },
  auth,
} = NextAuth({
  session: {
    strategy: "jwt",
  },
  providers: [Discord],
  adapter: PrismaAdapter(db),
  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signout",
  },
  callbacks: {
    authorized(params) {
      return !!params.auth?.user;
    },
    jwt: async (data) => {
      return data.token;
    },
    session: async ({ session, user, token }) => {
      // @ts-expect-error
      session.user.id = token.sub;
      return session;
    },
  },
  // @ts-expect-error
}) satisfies NextAuthConfig;
