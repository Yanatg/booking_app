import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import { Profile, User, Account } from "next-auth"; // Import necessary types
import { authConfig } from "@/app/lib/auth";
import { v4 as uuidv4 } from "uuid";

const prisma = new PrismaClient();

const handler = NextAuth({
  ...authConfig,
  callbacks: {
    async session({ session, user }: { session: any; user: any }) {
      console.log("session", session);
      console.log("user", user);

      // Check if the user already exists in the database
      const existingUser = await prisma.users.findUnique({
        where: { email: session.user.email },
      });
      console.log("existingUser", existingUser);

      if (existingUser) {
        // If the user exists, use the existing user ID
        session.user.id = existingUser.id;
      } else {
        // If the user does not exist, create a new user
        const newUserId = uuidv4();
        session.user.id = newUserId;
        await prisma.users.create({
          data: {
            id: newUserId,
            username: session.user.name,
            email: session.user.email,
          },
        });
      }

      return session;
    },
  },
});

export { handler as GET, handler as POST };