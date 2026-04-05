import React, { useState } from 'react';
import { PhoneCall, AlertTriangle } from 'lucide-react';

const AmbulanceButton = () => {
  const [bookingStatus, setBookingStatus] = useState('idle'); // idle, booking, confirmed

  const handleBooking = () => {
    // Check geolocation and book
    if (navigator.geolocation) {
      setBookingStatus('booking');
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Simulate API call using location
          setTimeout(() => {
            setBookingStatus('confirmed');
            setTimeout(() => setBookingStatus('idle'), 5000);
          }, 1500);
        },
        (error) => {
          alert('Location needed to auto-book ambulance. Please call emergency services directly.');
          setBookingStatus('idle');
        }
      );
    } else {
      alert('Geolocation not supported. Call emergency directly.');
    }
  };

  return (
    <div className="flex items-center gap-2">
      {bookingStatus === 'confirmed' ? (
        <span className="text-danger font-bold flex items-center gap-2 animate-fade-in text-sm">
          <AlertTriangle size={16} /> Ambulance Dispatched
        </span>
      ) : (
        <button 
          onClick={handleBooking} 
          disabled={bookingStatus === 'booking'}
          className="btn btn-danger animate-pulse-danger text-sm"
          title="One-click emergency ambulance booking"
        >
          <PhoneCall size={16} />
          {bookingStatus === 'booking' ? 'Locating...' : 'Emergency SOS'}
        </button>
      )}
    </div>
  );
};

export default AmbulanceButton;
