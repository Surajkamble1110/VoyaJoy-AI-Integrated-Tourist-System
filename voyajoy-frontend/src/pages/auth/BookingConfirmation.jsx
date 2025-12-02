import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import bookingService from '../../services/bookingService';
import ErrorHandler from '../../services/ErrorHandler';

const BookingConfirmation = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBooking();
  }, [bookingId]);

  const fetchBooking = async () => {
    try {
      setLoading(true);
      const response = await bookingService.getBookingById(bookingId);
      setBooking(response.data);
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600">Loading confirmation...</p>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <ErrorHandler error={error} onClose={() => navigate('/')} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        {/* Success Icon */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
            <svg
              className="w-12 h-12 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Booking Confirmed!
          </h1>
          <p className="text-gray-600">
            Your payment was successful and booking is confirmed
          </p>
        </div>

        {/* Booking Details Card */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <div className="flex justify-between items-start mb-6 pb-6 border-b">
            <div>
              <p className="text-sm text-gray-600 mb-1">Booking ID</p>
              <p className="text-xl font-bold text-gray-800">
                #{booking.bookingId}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600 mb-1">Status</p>
              <span className="inline-block px-4 py-1 bg-green-100 text-green-800 rounded-full font-semibold">
                {booking.bookingStatus}
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Destination</p>
              <p className="text-lg font-semibold">{booking.destinationname}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Travel Date</p>
                <p className="font-semibold">
                  {new Date(booking.travelDate).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-1">Travelers</p>
                <p className="font-semibold">{booking.totalTravelers} Person(s)</p>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-600 mb-1">Booked By</p>
              <p className="font-semibold">{booking.username}</p>
            </div>

            <div>
              <p className="text-sm text-gray-600 mb-1">Booking Date</p>
              <p className="font-semibold">
                {new Date(booking.bookingDate).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>

            {booking.specialRequest && (
              <div>
                <p className="text-sm text-gray-600 mb-1">Special Requests</p>
                <p className="text-gray-800">{booking.specialRequest}</p>
              </div>
            )}

            <div className="pt-4 border-t">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Amount Paid</span>
                <span className="text-2xl font-bold text-green-600">
                  ₹{booking.advancePayment}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                ✓ Advance payment completed
              </p>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-blue-50 rounded-lg p-6 mb-6">
          <h3 className="font-semibold text-lg mb-3">What's Next?</h3>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start">
              <span className="mr-2">📧</span>
              <span>You will receive a confirmation email shortly</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">📱</span>
              <span>Our team will contact you 24-48 hours before travel date</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">💰</span>
              <span>
                Remaining amount to be paid at destination: ₹
                {(booking.totalAmount * booking.totalTravelers - booking.totalAmount).toFixed(2)}
              </span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">🎫</span>
              <span>Download your booking voucher from My Bookings</span>
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => navigate('/customer/bookings')}
            className="bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            View My Bookings
          </button>
          <button
            onClick={() => navigate('/destinations')}
            className="bg-white text-blue-600 border-2 border-blue-600 py-3 rounded-lg font-semibold hover:bg-blue-50 transition"
          >
            Explore More Destinations
          </button>
        </div>

        {/* Support Info */}
        <div className="mt-8 text-center text-gray-600">
          <p className="mb-2">Need help? Contact our support team</p>
          <p className="font-semibold">📞 +91-1800-XXX-XXXX</p>
          <p className="font-semibold">📧 support@voyajoy.com</p>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;