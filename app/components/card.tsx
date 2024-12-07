interface CardProps {
  name?: string;
  location?: string;
  price?: number;
  image?: string;
}

export default function Card({ name, location, price, image }: CardProps) {
  return (
    <div className="w-[400px]">
      <div className="w-[400px] h-[250px] bg-red-500 rounded-[24px] mb-4">
        <img src={image} alt="accommodation" className="w-full h-full object-cover rounded-[24px]" />
      </div>
      <div className="text-4xl">{name}</div>
      <div className="text-2xl">{location}</div>
      <div className="flex justify-between mt-[8px] items-center">
        <div className="text-2xl">{price}</div>
        <div className="w-[150px] h-[50px] bg-black rounded-[12px] text-[24px] text-white flex items-center justify-center">Book now</div>
      </div>
    </div>
  );
}
