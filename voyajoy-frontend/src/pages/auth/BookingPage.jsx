import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import destinationService from '../../services/destinationService';
import bookingService from '../../services/bookingService';
import ErrorHandler from '../../services/ErrorHandler';

const BookingPage = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const { user, token } = useContext(AuthContext);

  const [destination, setDestination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [bookingData, setBookingData] = useState({
    travelDate: '',
    totalTravelers: 1,
    specialRequest: '',
  });

  useEffect(() => {
    // Redirect if not logged in
    if (!user || !token) {
      alert('Please login to make a booking');
      navigate('/login');
      return;
    }

    // Check if user is CUSTOMER
    if (user.role !== 'CUSTOMER') {
      alert('Only customers can make bookings');
      navigate('/');
      return;
    }

    fetchDestination();
  }, [bookingId, user, token, navigate]);

  const fetchDestination = async () => {
    try {
      setLoading(true);
      const response = await destinationService.getDestinationById(bookingId);
      setDestination(response.data);
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBookingData({
      ...bookingData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate travel date
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDate = new Date(bookingData.travelDate);

    if (selectedDate < today) {
      alert('Travel date cannot be in the past');
      return;
    }

    // Validate travelers
    if (bookingData.totalTravelers < 1) {
      alert('At least 1 traveler is required');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const response = await bookingService.createBooking(
        user.userId,
        destination.destinatonId,
        bookingData
      );

      alert('Booking created successfully! Proceeding to payment...');
      
      // Navigate to payment page
      navigate(`/payment/${response.data.bookingId}`);
      
    } catch (err) {
      setError(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-b from-purple-50 to-pink-50">
        <div className="text-center">
          <div className="inline-block w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!destination) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-linear-to-b from-purple-50 to-pink-50 p-4">
        <ErrorHandler error={error} onClose={() => navigate('/destinations')} />
        <button
          onClick={() => navigate('/destinations')}
          className="mt-4 bg-linear-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-xl hover:from-purple-700 hover:to-pink-700 shadow-lg"
        >
          Back to Destinations
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-purple-50 via-pink-50 to-purple-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <button
          onClick={() => navigate(`/destinations/${bookingId}`)}
          className="text-purple-600 hover:text-pink-600 font-semibold mb-6 flex items-center gap-2 transition hover:gap-3"
        >
          ← Back to Destination Details
        </button>

        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold bg-linear-to-r from-purple-700 via-pink-600 to-pink-500 bg-clip-text text-transparent mb-2">
            Complete Your Booking ✨
          </h1>
          <p className="text-gray-600 text-lg">Fill in your travel details below</p>
        </div>

        <ErrorHandler error={error} onClose={() => setError(null)} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-2">
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl border-2 border-pink-100">
              <h2 className="text-2xl font-bold mb-6 bg-linear-to-r from-purple-700 to-pink-600 bg-clip-text text-transparent">
                📝 Booking Details
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Travel Date */}
                <div>
                  <label className=" text-gray-700 font-semibold mb-2 flex items-center gap-2">
                    <span className="text-xl">📅</span>
                    Travel Date *
                  </label>
                  <input
                    type="date"
                    name="travelDate"
                    value={bookingData.travelDate}
                    onChange={handleChange}
                    required
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                  />
                </div>

                {/* Number of Travelers */}
                <div>
                  <label className=" text-gray-700 font-semibold mb-2 flex items-center gap-2">
                    <span className="text-xl">👥</span>
                    Number of Travelers *
                  </label>
                  <input
                    type="number"
                    name="totalTravelers"
                    value={bookingData.totalTravelers}
                    onChange={handleChange}
                    required
                    min="1"
                    max="50"
                    className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                  />
                  <p className="text-sm text-gray-500 mt-2">Maximum 50 travelers per booking</p>
                </div>

                {/* Special Requests */}
                <div>
                  <label className=" text-gray-700 font-semibold mb-2 flex items-center gap-2">
                    <span className="text-xl">💬</span>
                    Special Requests (Optional)
                  </label>
                  <textarea
                    name="specialRequest"
                    value={bookingData.specialRequest}
                    onChange={handleChange}
                    rows="4"
                    placeholder="Any dietary requirements, accessibility needs, or other special requests..."
                    className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition resize-none"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-linear-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl font-bold text-lg hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 transition shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none"
                >
                  {submitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Creating Booking...
                    </span>
                  ) : (
                    '💳 Proceed to Payment →'
                  )}
                </button>
              </form>
            </div>

            {/* Info Cards */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-linear-to-br from-purple-50 to-pink-50 p-4 rounded-2xl border-2 border-pink-200 text-center">
                <p className="text-3xl mb-2">🔒</p>
                <p className="text-sm font-semibold text-gray-700">Secure Payment</p>
              </div>
              <div className="bg-linear-to-br from-purple-50 to-pink-50 p-4 rounded-2xl border-2 border-pink-200 text-center">
                <p className="text-3xl mb-2">✅</p>
                <p className="text-sm font-semibold text-gray-700">Instant Confirmation</p>
              </div>
              <div className="bg-linear-to-br from-purple-50 to-pink-50 p-4 rounded-2xl border-2 border-pink-200 text-center">
                <p className="text-3xl mb-2">🤝</p>
                <p className="text-sm font-semibold text-gray-700">24/7 Support</p>
              </div>
            </div>
          </div>

          {/* Booking Summary - Sticky on Desktop */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-2xl shadow-xl sticky top-20 border-2 border-pink-100">
              <h3 className="text-xl font-bold mb-4 bg-linear-to-r from-purple-700 to-pink-600 bg-clip-text text-transparent">
                📋 Booking Summary
              </h3>

              {/* Destination Info */}
              <div className="mb-4">
                <div className="relative overflow-hidden rounded-xl mb-3 group">
                  <img
                    src={destination.image}
                    alt={destination.destinationName}
                    className="w-full h-40 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-purple-900/60 to-transparent"></div>
                </div>
                <h4 className="font-bold text-lg text-gray-800">
                  {destination.destinationName}
                </h4>
                <p className="text-gray-600 text-sm flex items-center gap-1">
                  📍 {destination.location}
                </p>
              </div>

              <div className="border-t-2 border-pink-100 pt-4 space-y-3">
                {/* Package Price */}
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium">Package Price</span>
                  <span className="font-bold text-gray-800">
                    ₹{destination.totalBudget}
                  </span>
                </div>

                {/* Travelers */}
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium">Travelers</span>
                  <span className="font-bold text-purple-600">
                    {bookingData.totalTravelers}
                  </span>
                </div>

                {/* Total Package Price */}
                <div className="flex justify-between items-center pt-2 border-t-2 border-pink-100">
                  <span className="text-gray-700 font-semibold">Total Package Price</span>
                  <span className="text-2xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    ₹{(destination.totalBudget * bookingData.totalTravelers).toFixed(2)}
                  </span>
                </div>

                {/* Travel Date */}
                {bookingData.travelDate && (
                  <div className="flex justify-between items-center bg-purple-50 p-3 rounded-xl">
                    <span className="text-gray-600 font-medium">Travel Date</span>
                    <span className="font-semibold text-purple-700">
                      {new Date(bookingData.travelDate).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                )}

                {/* Advance Payment */}
                <div className="border-t-2 pt-4 mt-4 bg-linear-to-br from-green-50 to-emerald-50 p-4 rounded-xl border-2 border-green-200">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-700 font-semibold">Advance Payment</span>
                    <span className="text-2xl font-bold text-green-600">
                      ₹{(destination.advancePayment * bookingData.totalTravelers).toFixed(2)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">
                    ₹{destination.advancePayment} × {bookingData.totalTravelers} traveler(s)
                  </p>
                  <p className="text-xs text-green-700 font-semibold">
                    💰 Remaining ₹{((destination.totalBudget - destination.advancePayment) * bookingData.totalTravelers).toFixed(2)} payable at destination
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;