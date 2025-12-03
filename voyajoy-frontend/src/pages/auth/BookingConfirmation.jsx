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

  // ✅ CALCULATE PRICING
  const perPersonPrice = booking.totalAmount / booking.totalTravelers;
  const perPersonAdvance = booking.advancePayment / booking.totalTravelers;
  const remainingAmount = booking.totalAmount - booking.advancePayment;

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
            Booking Confirmed! 🎉
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

            {/* ✅ UPDATED PAYMENT BREAKDOWN */}
            <div className="pt-4 border-t space-y-3">
              <h3 className="font-semibold text-lg text-gray-800 mb-3">
                💰 Payment Breakdown
              </h3>

              {/* Per Person Cost */}
              <div className="bg-gray-50 p-3 rounded-lg space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Package Price (per person)</span>
                  <span className="font-semibold">₹{perPersonPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Number of Travelers</span>
                  <span className="font-semibold">× {booking.totalTravelers}</span>
                </div>
              </div>

              {/* Total Package Price */}
              <div className="flex justify-between pt-2 border-t">
                <span className="text-gray-700 font-semibold">Total Package Price</span>
                <span className="font-bold text-lg">₹{booking.totalAmount.toFixed(2)}</span>
              </div>

              {/* Advance Paid */}
              <div className="flex justify-between bg-green-50 p-3 rounded-lg">
                <div>
                  <p className="text-gray-700 font-semibold">Advance Paid ✓</p>
                  <p className="text-xs text-gray-600">
                    ₹{perPersonAdvance.toFixed(2)} × {booking.totalTravelers} travelers
                  </p>
                </div>
                <span className="font-bold text-xl text-green-600">
                  ₹{booking.advancePayment.toFixed(2)}
                </span>
              </div>

              {/* Remaining Amount */}
              <div className="flex justify-between items-center bg-orange-50 p-4 rounded-lg border-2 border-orange-200">
                <div>
                  <p className="text-gray-700 font-semibold">Remaining Amount</p>
                  <p className="text-xs text-gray-600">To be paid at destination</p>
                </div>
                <span className="text-2xl font-bold text-orange-600">
                  ₹{remainingAmount.toFixed(2)}
                </span>
              </div>

              {/* Detailed Calculation */}
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <p className="text-xs font-semibold text-blue-900 mb-2">
                  📊 Detailed Calculation:
                </p>
                <div className="text-xs text-gray-700 space-y-1">
                  <p>
                    • Total: ₹{perPersonPrice.toFixed(2)} × {booking.totalTravelers} = 
                    <strong> ₹{booking.totalAmount.toFixed(2)}</strong>
                  </p>
                  <p>
                    • Advance: ₹{perPersonAdvance.toFixed(2)} × {booking.totalTravelers} = 
                    <strong> ₹{booking.advancePayment.toFixed(2)}</strong>
                  </p>
                  <p className="pt-1 border-t border-blue-200 mt-2">
                    • <strong>Pay at destination: ₹{remainingAmount.toFixed(2)}</strong>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-blue-50 rounded-lg p-6 mb-6 border border-blue-200">
          <h3 className="font-semibold text-lg mb-3 text-blue-900">
            📋 What's Next?
          </h3>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start">
              <span className="mr-3 text-xl">📧</span>
              <span>You will receive a confirmation email shortly</span>
            </li>
            <li className="flex items-start">
              <span className="mr-3 text-xl">📱</span>
              <span>Our team will contact you 24-48 hours before travel date</span>
            </li>
            <li className="flex items-start">
              <span className="mr-3 text-xl">💰</span>
              <div>
                <p className="font-semibold">Remaining Payment at Destination:</p>
                <p className="text-sm">
                  Please pay <strong>₹{remainingAmount.toFixed(2)}</strong> when you arrive
                </p>
              </div>
            </li>
            <li className="flex items-start">
              <span className="mr-3 text-xl">🎫</span>
              <span>View and download your booking voucher from My Bookings</span>
            </li>
            <li className="flex items-start">
              <span className="mr-3 text-xl">🏖️</span>
              <span>Pack your bags and get ready for an amazing trip!</span>
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <button
            onClick={() => navigate('/customer/bookings')}
            className="bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition shadow-md"
          >
            📋 View My Bookings
          </button>
          <button
            onClick={() => navigate('/destinations')}
            className="bg-white text-blue-600 border-2 border-blue-600 py-3 rounded-lg font-semibold hover:bg-blue-50 transition shadow-md"
          >
            🌍 Explore More Destinations
          </button>
        </div>

        {/* Support Info */}
        <div className="mt-8 text-center bg-white p-6 rounded-lg shadow-md">
          <p className="text-gray-600 mb-3">Need help? Contact our support team</p>
          <div className="space-y-2">
            <p className="font-semibold text-gray-800">📞 +91-1800-XXX-XXXX</p>
            <p className="font-semibold text-gray-800">📧 support@voyajoy.com</p>
            <p className="text-sm text-gray-600 mt-3">
              Available 24/7 for your assistance
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;