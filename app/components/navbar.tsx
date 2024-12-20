"use client";
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const userId = localStorage.getItem('user_id');
    if (userId) {
      setIsLoggedIn(true);
      console.log('User is logged in');
    }
  }, []);

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link
              href="/accommodation"
              className="text-gray-800 text-lg font-semibold hover:text-blue-500"
            >
              Accommodations
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {isLoggedIn && (
              <>
                <Link 
                  href="/booking" 
                  className="text-gray-600 hover:text-blue-500"
                >
                  My Bookings
                </Link>
                <button
                  onClick={() => {
                    localStorage.removeItem('user_id');
                    setIsLoggedIn(false);
                    window.location.href = '/';
                  }}
                  className="text-gray-600 hover:text-blue-500"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}