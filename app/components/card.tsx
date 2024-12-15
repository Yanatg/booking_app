import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface CardProps {
  name?: string;
  location?: string;
  price?: number;
  image?: string;
  accommodation_id: string;
}

export default function AccommodationCard({ name, location, price, image, accommodation_id }: CardProps) {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [checkInDate, setCheckInDate] = useState<Date | null>(null);
  const [checkOutDate, setCheckOutDate] = useState<Date | null>(null);

  useEffect(() => {
    if (session?.user?.id) {
      localStorage.setItem('user_id', session.user.id);
    }
  }, [session]);

  const handleBookNow = async () => {
    if (!checkInDate || !checkOutDate) {
      setError('Please select check-in and check-out dates');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const userId = localStorage.getItem('user_id');
      const response = await fetch('/api/accommodation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId, // Use the user ID from localStorage
          accommodation_id,
          start_date: checkInDate.toISOString(),
          end_date: checkOutDate.toISOString(),
          status: 'pending', // Replace with actual status
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create booking');
      }

      const data = await response.json();
      console.log('Booking created:', data);
      setModalOpen(false);
    } catch (error) {
      console.error('Error creating booking:', error);
      setError('Failed to create booking');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-lg w-full max-w-sm mx-auto">
      <div className="relative h-64 w-full bg-gray-200">
        {image ? (
          <Image
            src={image}
            alt={name || 'Accommodation'}
            fill
            style={{ objectFit: 'cover' }}
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
          onClick={() => setModalOpen(true)}
        >
          {loading ? 'Booking...' : 'Book now'}
        </div>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-2xl font-semibold mb-4">Select Dates</h2>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Check-in Date</label>
              <DatePicker
                selected={checkInDate}
                onChange={(date) => setCheckInDate(date)}
                className="w-full border border-gray-300 p-2 rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Check-out Date</label>
              <DatePicker
                selected={checkOutDate}
                onChange={(date) => setCheckOutDate(date)}
                className="w-full border border-gray-300 p-2 rounded"
              />
            </div>
            <div className="flex justify-end">
              <button
                className="bg-gray-500 text-white py-2 px-4 rounded mr-2"
                onClick={() => setModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 text-white py-2 px-4 rounded"
                onClick={handleBookNow}
              >
                {loading ? 'Booking...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}