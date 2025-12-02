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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (!destination) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <ErrorHandler error={error} onClose={() => navigate('/destinations')} />
        <button
          onClick={() => navigate('/destinations')}
          className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        >
          Back to Destinations
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <button
          onClick={() => navigate(`/destinations/${id}`)}
          className="text-blue-600 hover:underline mb-6"
        >
          ← Back to Destination Details
        </button>

        <h1 className="text-3xl font-bold mb-8">Complete Your Booking</h1>

        <ErrorHandler error={error} onClose={() => setError(null)} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold mb-6">Booking Details</h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Travel Date */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Travel Date *
                  </label>
                  <input
                    type="date"
                    name="travelDate"
                    value={bookingData.travelDate}
                    onChange={handleChange}
                    required
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Number of Travelers */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
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
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Special Requests */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Special Requests (Optional)
                  </label>
                  <textarea
                    name="specialRequest"
                    value={bookingData.specialRequest}
                    onChange={handleChange}
                    rows="4"
                    placeholder="Any dietary requirements, accessibility needs, or other special requests..."
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition"
                >
                  {submitting ? 'Creating Booking...' : 'Proceed to Payment'}
                </button>
              </form>
            </div>
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-md sticky top-20">
              <h3 className="text-xl font-semibold mb-4">Booking Summary</h3>

              {/* Destination Info */}
              <div className="mb-4">
                <img
                  src={destination.image}
                  alt={destination.destinationName}
                  className="w-full h-32 object-cover rounded-lg mb-3"
                />
                <h4 className="font-semibold text-lg">
                  {destination.destinationName}
                </h4>
                <p className="text-gray-600 text-sm">
                  📍 {destination.location}
                </p>
              </div>

              <div className="border-t pt-4 space-y-3">
                {/* Package Price */}
                <div className="flex justify-between">
                  <span className="text-gray-600">Package Price</span>
                  <span className="font-semibold">
                    ₹{destination.totalBudget}
                  </span>
                </div>

                {/* Travelers */}
                <div className="flex justify-between">
                  <span className="text-gray-600">Travelers</span>
                  <span className="font-semibold">
                    {bookingData.totalTravelers}
                  </span>
                </div>

                {/* Travel Date */}
                {bookingData.travelDate && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Travel Date</span>
                    <span className="font-semibold">
                      {new Date(bookingData.travelDate).toLocaleDateString()}
                    </span>
                  </div>
                )}

                {/* Advance Payment */}
                <div className="border-t pt-3 mt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Advance Payment</span>
                    <span className="text-xl font-bold text-blue-600">
                      ₹{destination.advancePayment}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Pay advance now, remaining amount at destination
                  </p>
                </div>
              </div>

              {/* Info */}
              <div className="mt-6 text-sm text-gray-600 space-y-1">
                <p>✓ Secure payment gateway</p>
                <p>✓ Instant confirmation</p>
                <p>✓ 24/7 customer support</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;