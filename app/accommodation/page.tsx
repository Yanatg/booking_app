"use client";
import { signOut, useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import Card from "@/app/components/card";
import { get } from "http";
import { useEffect, useState } from "react";

interface Accommodation {
  id: string;
  name: string;
  location: string;
  price_per_night: number;
  image: string;
  userId: string;
}

export default function Home() {
  const [accommodations, setAccommodations] = useState<Accommodation[]>([]);
  const { data: session } = useSession();
  
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
        <Card accommodation_id={accommodation.id} key={accommodation.id} name={accommodation.name} location={accommodation.location} price={accommodation.price_per_night} image={accommodation.image}/>
      ))}
    </div>
  );
}
