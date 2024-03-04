import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

import bcrypt from "bcrypt";
import database from "@/libs/database";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      id: "login",
      name: "Existing Account",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, request) {
        const existingUser = await database.user.findFirst({
          where: {
            email: credentials.email,
            identityProvider: "CREDENTIALS",
          },
        });
        if (
          !existingUser ||
          !(await bcrypt.compare(credentials.password, existingUser.password))
        ) {
          return null;
        }
        return existingUser;
      },
    }),
    CredentialsProvider({
      id: "signup",
      name: "New Account",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, request) {
        const existingUser = await database.user.findFirst({
          select: {
            email: true,
          },
          where: {
            email: credentials.email,
            identityProvider: "CREDENTIALS",
          },
        });
        if (existingUser) {
          return null;
        }

        const hashedPassword = await bcrypt.hash(credentials.password, 10);
        const newUser = await database.user.create({
          data: {
            identityProvider: "CREDENTIALS",
            email: credentials.email,
            password: hashedPassword,
          },
        });
        return newUser;
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile, credentials }) {
      if (!credentials) {
        const identityProviderMap = {
          google: "GOOGLE",
        };
        if (!(account.provider in identityProviderMap)) {
          return false;
        }
        const existingUser = await database.user.findFirst({
          select: {
            id: true,
          },
          where: {
            email: profile.email,
            identityProvider: identityProviderMap[account.provider],
          },
        });
        if (existingUser) {
          user.id = existingUser.id;
        } else {
          const newUser = await database.user.create({
            data: {
              identityProvider: identityProviderMap[account.provider],
              email: profile.email,
              isVerified: true,
            },
          });
          user.id = newUser.id;
        }
      }
      return true;
    },
    async jwt({ token, user, account, profile, isNewUser }) {
      if (user) {
        token.id = user.id;
      }

      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.id;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
});

export { handler as GET, handler as POST };
