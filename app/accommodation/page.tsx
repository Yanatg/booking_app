"use client";
import Card from "@/app/components/card";
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
