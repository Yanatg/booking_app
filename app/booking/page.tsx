"use client";
import { useEffect, useState } from "react";

interface Booking {
  id: string;
  accommodation_id: string;
  start_date: string;
  end_date: string;
  status: string;
  payment: {
    id: string;
    amount: number;
    payment_date: string | null;
    status: string;
  };
  accommodation: {
    name: string;
    location: string;
    price_per_night: number;
    image: string;
  };
}

export default function BookingList() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  // Fetch bookings for the logged-in user
  const fetchBookings = async () => {
    try {
      // Get user_id from localStorage
      const userId = localStorage.getItem("user_id");

      if (!userId) {
        console.error("User ID not found in localStorage");
        return;
      }

      // Call the API with the user_id as a query parameter
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
    console.log("Bookings fetched");
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Your Bookings</h1>
      <div className="grid grid-cols-1 gap-4">
        {bookings.map((booking) => (
          <div key={booking.id} className="p-4 border rounded shadow">
            <p>Accommodation: {booking.accommodation_id}</p>
            <p>
              Booking Dates: {booking.start_date} to {booking.end_date}
            </p>
            <p>Status: {booking.status}</p>
            {booking.status !== "Paid" && (
              <button
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
                onClick={() => setSelectedBooking(booking)}
              >
                Pay
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Payment Confirmation Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-xl font-bold mb-4">Confirm Payment</h2>
            <p>Accommodation: {selectedBooking.accommodation_id}</p>
            <p>Amount: ${selectedBooking.payment.amount}</p>
            <div className="mt-4 flex justify-end">
              <button
                className="px-4 py-2 bg-gray-300 rounded mr-2"
                onClick={() => setSelectedBooking(null)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-green-500 text-white rounded"
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