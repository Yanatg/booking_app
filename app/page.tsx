"use client";
import { GoogleSignInButton } from "@/app/components/authButtons";

import { getServerSession } from "next-auth";
import { authConfig } from "@/app/lib/auth";
import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";


export default function Home() {
  const { data: session } = useSession();
  if (session) {
    redirect("/accommodation");
  }

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-center">
        <div className="flex flex-col items-center gap-4">
          <h1 className="text-4xl font-bold text-center">
            Welcome to Accommodation booking app!
          </h1>
        </div>
        <GoogleSignInButton />
      </main>
    </div>
  );
}