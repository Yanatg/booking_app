import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import { Profile, User, Account } from "next-auth"; // Import necessary types
import { authConfig } from "@/app/lib/auth";
import { v4 as uuidv4 } from "uuid";

const prisma = new PrismaClient();

const handler = NextAuth({
  //   adapter: PrismaAdapter(prisma),
  ...authConfig,
  callbacks: {
    async session({ session, user }: { session: any; user: any }) {
      console.log("session", session);
      console.log("user", user);
      const newUserId = uuidv4();
      session.user.id = newUserId;
      // Check if the user already exists in the database
      const existingUser = await prisma.users.findUnique({
        where: { email: session.user.email },
      });
      console.log("existingUser", existingUser);
      // If the user does not exist, create a new user
      if (!existingUser) {
        await prisma.users.create({
          data: {
            id: newUserId, // Assuming user.id is available and unique
            username: session.user.name, // Use profile name as username
            email: session.user.email,
          },
        })
      }
      return session;
    },
  },
});

export { handler as GET, handler as POST };
