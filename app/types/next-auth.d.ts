// types/next-auth.d.ts
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string; // Add the user ID
      username: string; // Add the username
      email: string; // Add the email
      // Add any other properties you need
    };
  }
  // Add any other types you need
  interface Profile {
    id: string;
    name: string;
    email: string;
    image: string;
  }
}
