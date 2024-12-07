import Image from 'next/image'

interface CardProps {
  name?: string;
  location?: string;
  price?: number;
  image?: string;
}

export default function AccommodationCard({ name, location, price, image }: CardProps) {
  const handleBookNow = () => {
    console.log(`Booking ${name}`);
    // Add your booking logic here
  };

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-lg w-full max-w-sm mx-auto">
      <div className="relative h-64 w-full bg-gray-200">
        {image ? (
          <Image
            src={image}
            alt={name || 'Accommodation'}
            layout="fill"
            objectFit="cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <span className="text-gray-400">No image available</span>
          </div>
        )}
      </div>
      <div className="p-4">
        <h2 className="text-2xl font-semibold mb-2">{name || 'Unnamed Accommodation'}</h2>
        <p className="text-gray-600 text-lg mb-4">{location || 'Location not specified'}</p>
        <p className="text-xl font-bold">${price || 0} / night</p>
      </div>
      <div className="p-4">
        <div 
          className="w-full bg-black text-white text-lg py-3 px-4 rounded-lg cursor-pointer text-center"
          onClick={handleBookNow}
        >
          Book now
        </div>
      </div>
    </div>
  )
}

