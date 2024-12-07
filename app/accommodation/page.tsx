"use client";
import { sign } from "crypto";
import { signOut, useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import Card from "@/app/components/card";
import { get } from "http";
import { useEffect, useState } from "react";

interface Accommodation {
  id: number;
  name: string;
  location: string;
  price_per_night: number;
}

export default function Home() {
  const [accommodations, setAccommodations] = useState<Accommodation[]>([]);
  const { data: session } = useSession();
  console.log(session);

  async function logout() {
    await signOut({ callbackUrl: "/" });
  }

  const getAccommodations = async () => {
    const response = await fetch("/api/accommodation");
    const data = await response.json();
    console.log(data);
    setAccommodations(data.data);
  }

  useEffect(() => {
    getAccommodations();
  }, []);
  
    
  return (
    <div className="p-24 grid grid-cols-3 justify-items-center gap-4">
      {accommodations.map((accommodation) => (
        <Card key={accommodation.id} name={accommodation.name} location={accommodation.location} price={accommodation.price_per_night} />
      ))}
    </div>
  );
}
