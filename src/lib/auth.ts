// export const runtime = "nodejs"; // ⚡ important!

import NextAuth, { NextAuthConfig } from "next-auth";
import { FindTrainerByEmail } from "./actions";
import Credentials from "next-auth/providers/credentials";
import bcryptjs from "bcryptjs";
import prisma from "./prisma";
const config = {
  pages: {
    signIn: "/auth/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  providers: [
    Credentials({
      async authorize(credentials) {
        const { email, password } = credentials;
        console.log("Authorizing with email:", email);

        const existingTrainer = await prisma.trainer.findFirst({
          where: { email: email as string },
          include: { lineup: false },
        });

        if (!existingTrainer) {
          console.log("No trainer found with that email");
          return null;
        }

        const passwordMatch = await bcryptjs.compare(
          password as string,
          existingTrainer.hashedPassword
        );

        if (!passwordMatch) {
          console.log("Incorrect password");
          return null;
        }
        console.log("Login successful for:", existingTrainer.id);

        return {
          id: existingTrainer.id,
          name: existingTrainer.name,
          email: existingTrainer.email,
          avatar: existingTrainer.avatar,
        };
      },
    }),
  ],
  callbacks: {
    authorized: ({ auth, request }) => {
      // runs on every request
      const isLoggedIn = !!auth?.user;
      const isTryingToAccessApp = request.nextUrl.pathname.includes("/account");
      if (isLoggedIn) {
        console.log(" logged in");
      }
      if (isTryingToAccessApp && !isLoggedIn) {
        console.log("permission denied");
        return Response.redirect(new URL("/", request.nextUrl));
      }
      if (isLoggedIn && isTryingToAccessApp) {
        console.log("permission granted");
        return true;
      }
      if (isLoggedIn && !isTryingToAccessApp) {
        console.log("redirecting to /account");
        return Response.redirect(new URL("/account", request.nextUrl));
      }
      if (!isLoggedIn && !isTryingToAccessApp) {
        const pathname = request.nextUrl.pathname;
        const validPage =
          pathname === "/" ||
          pathname.includes("/login") ||
          pathname.includes("/sign-up");
        if (!validPage) {
          console.log("badpage");
          return Response.redirect(new URL("/", request.nextUrl));
        } else {
          console.log("allowed");
          return true;
        }
      }
    },
    jwt: ({ token, user }) => {
      if (user) {
        token.id = user.id;
        token.avatar = user.avatar;
        token.name = user.name;
        token.email = user.email;
      }
      return token;
    },
    session: ({ session, token }) => {
      session.user.id = token.id;
      session.user.name = token.name;
      session.user.email = token.email;
      session.user.avatar = token.avatar;
      return session;
    },
  },
} satisfies NextAuthConfig;

export const { auth, signIn, signOut } = NextAuth(config);
