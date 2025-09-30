import NextAuth, { DefaultSession } from "next-auth";
import { JWT } from "@auth/core/jwt";

declare module "next-auth" {
  interface User {
    id: string;
    avatar: number;
    name: string;
    email: string;
  }
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      avatar: number;
    };
  }
}
declare module "@auth/core/jwt" {
  interface JWT {
    id: string;
    avatar: number;
    name: string;
    email: string;
  }
}
