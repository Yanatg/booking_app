"use client";
import { useEffect, useState } from "react";

interface Booking {
  id: string;
  accommodation_id: string;
  start_date: string;
  end_date: string;
  status: string;
  accommodations: {
    name: string;
    location: string;
    price_per_night: number;
    image: string;
  };
}

// Helper function to format dates
const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

// Helper function to calculate total payment
const calculateTotalPayment = (startDate: string, endDate: string, pricePerNight: number) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const numberOfDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  return numberOfDays * pricePerNight;
};

export default function BookingList() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  // Fetch bookings for the logged-in user
  const fetchBookings = async () => {
    try {
      const userId = localStorage.getItem("user_id");
      if (!userId) {
        console.error("User ID not found in localStorage");
        return;
      }

      const response = await fetch(`/api/bookings?user_id=${userId}`);
      const data = await response.json();

      if (response.ok) {
        setBookings(data.data);
        console.log(data.data);
      } else {
        console.error("Failed to fetch bookings:", data.error);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Your Bookings</h1>
      <div className="grid grid-cols-1 gap-4">
        {bookings.map((booking) => {
          const totalPayment = calculateTotalPayment(
            booking.start_date,
            booking.end_date,
            booking.accommodations.price_per_night
          );
          
          return (
            <div key={booking.id} className="p-4 border rounded shadow">
              <p>Accommodation: {booking.accommodations.name}</p>
              <p>Location: {booking.accommodations.location}</p>
              <p>
                Booking Dates: {formatDate(booking.start_date)} to{" "}
                {formatDate(booking.end_date)}
              </p>
              <p>Price per Night: ${booking.accommodations.price_per_night}</p>
              <p className="font-semibold text-lg">
                Total Payment: ${totalPayment}
              </p>
              <p>Status: {booking.status}</p>
              {booking.status !== "Paid" && (
                <button
                  className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  onClick={() => setSelectedBooking(booking)}
                >
                  Pay
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Payment Confirmation Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-xl font-bold mb-4">Confirm Payment</h2>
            <p>Accommodation: {selectedBooking.accommodations.name}</p>
            <p>Price per Night: ${selectedBooking.accommodations.price_per_night}</p>
            <p className="font-semibold">
              Total Amount: $
              {calculateTotalPayment(
                selectedBooking.start_date,
                selectedBooking.end_date,
                selectedBooking.accommodations.price_per_night
              )}
            </p>
            <div className="mt-4 flex justify-end">
              <button
                className="px-4 py-2 bg-gray-300 rounded mr-2 hover:bg-gray-400"
                onClick={() => setSelectedBooking(null)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                onClick={() => {
                  // Handle payment logic here
                  setSelectedBooking(null);
                }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}