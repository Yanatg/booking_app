"use client";
import { signOut, useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function Home() {
  const { data: session } = useSession();
  console.log(session);

  const handleLogout = () => {
    signOut();
  }

  if (!session) {
    redirect("/");
  }

  return (
    <div>
      <h1>Home</h1>
      <div className="w-[100px] h-[100px] bg-red-500" onClick={handleLogout}>logout</div>
    </div>
  );
}
