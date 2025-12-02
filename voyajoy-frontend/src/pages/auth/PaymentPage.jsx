import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import bookingService from '../../services/bookingService';
import paymentService from '../../services/paymentService';
import ErrorHandler from '../../services/ErrorHandler';

const PaymentPage = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const { user, token } = useContext(AuthContext);

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState(''); // Track payment method

  useEffect(() => {
    if (!user || !token) {
      alert('Please login to continue');
      navigate('/login');
      return;
    }

    loadRazorpayScript();
    fetchBooking();
  }, [bookingId, user, token, navigate]);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const fetchBooking = async () => {
    try {
      setLoading(true);
      const response = await bookingService.getBookingById(bookingId);
      setBooking(response.data);
      
      if (response.data.advancePaid) {
        alert('Payment already completed for this booking');
        navigate(`/customer/bookings`);
        return;
      }
      
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    try {
      setProcessing(true);
      setError(null);

      
      const orderResponse = await paymentService.createOrder({
        bookingId: booking.bookingId,
        amount: booking.advancePayment, 
      });

      const { orderId, amount, currency, razorpayKeyId } = orderResponse.data;

      // Step 2: Configure Razorpay Options
      const options = {
        key: razorpayKeyId,
        amount: amount * 100,
        currency: currency,
        name: 'VoyaJoy',
        description: `Booking for ${booking.destinationname}`,
        order_id: orderId,
        handler: async function (response) {
          
          await verifyPayment(
            response.razorpay_order_id,
            response.razorpay_payment_id,
            response.razorpay_signature,
            selectedMethod || 'RAZORPAY' // Use selected method
          );
        },
        prefill: {
          name: user.username,
          email: user.email,
          contact: user.phoneNumber,
        },
        notes: {
          booking_id: booking.bookingId,
          user_id: user.userId,
        },
        theme: {
          color: '#2563eb',
        },
        modal: {
          ondismiss: function() {
            setProcessing(false);
            setSelectedMethod('');
            alert('Payment cancelled');
          }
        }
      };

      // Step 4: Open Razorpay Checkout
      const razorpay = new window.Razorpay(options);
      razorpay.open();

    } catch (err) {
      console.error('Payment error:', err);
      setError(err);
      setProcessing(false);
    }
  };

  const verifyPayment = async (orderId, paymentId, signature, method) => {
    try {
      // ✅ Simple: Just send method to backend
      const response = await paymentService.verifyPayment({
        razorpayOrderId: orderId,
        razorpayPaymentId: paymentId,
        razorpaySignature: signature,
        bookingId: booking.bookingId,
        paymentMethod: method, // Send selected method
      });

      alert('Payment successful! Your booking is confirmed.');
      navigate(`/booking-confirmation/${booking.bookingId}`);
      
    } catch (err) {
      console.error('Verification error:', err);
      alert('Payment verification failed. Please contact support.');
      setError(err);
    } finally {
      setProcessing(false);
      setSelectedMethod('');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600">Loading payment details...</p>
      </div>
    );
  }

  if (!booking) {
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
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Complete Payment</h1>

        <ErrorHandler error={error} onClose={() => setError(null)} />

        {/* Booking Summary Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Booking Summary</h2>

          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Destination</span>
              <span className="font-semibold">{booking.destinationname}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">Travel Date</span>
              <span className="font-semibold">
                {new Date(booking.travelDate).toLocaleDateString()}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">Travelers</span>
              <span className="font-semibold">{booking.totalTravelers}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">Booking Status</span>
              <span className="font-semibold text-orange-600">
                {booking.bookingStatus}
              </span>
            </div>

            {booking.specialRequest && (
              <div className="pt-3 border-t">
                <p className="text-gray-600 text-sm mb-1">Special Requests:</p>
                <p className="text-gray-800">{booking.specialRequest}</p>
              </div>
            )}
          </div>
        </div>

        {/* Payment Details Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Payment Details</h2>

          <div className="space-y-4">
            <div className="flex justify-between text-lg">
              <span className="text-gray-600">Total Package Price</span>
              <span className="font-semibold">₹{booking.totalAmount}</span>
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold text-lg">Advance Payment</p>
                  <p className="text-sm text-gray-600">
                    Pay now to confirm booking
                  </p>
                </div>
                <span className="text-2xl font-bold text-blue-600">
                  ₹{booking.advancePayment}
                </span>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-gray-700">
                <strong>Note:</strong> The remaining amount of{' '}
                <strong>
                  ₹{(booking.totalAmount - booking.advancePayment).toFixed(2)}
                </strong>{' '}
                will be collected at the destination.
              </p>
            </div>
          </div>
        </div>

        {/* Payment Methods Selection - NEW */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="font-semibold mb-4">Select Payment Method</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button
              onClick={() => setSelectedMethod('CARD')}
              className={`p-4 border-2 rounded-lg text-center transition ${
                selectedMethod === 'CARD' 
                  ? 'border-blue-600 bg-blue-50' 
                  : 'border-gray-200 hover:border-blue-300'
              }`}
            >
              <p className="text-2xl mb-2">💳</p>
              <p className="text-sm font-semibold">Card</p>
              <p className="text-xs text-gray-500">Credit/Debit</p>
            </button>

            <button
              onClick={() => setSelectedMethod('UPI')}
              className={`p-4 border-2 rounded-lg text-center transition ${
                selectedMethod === 'UPI' 
                  ? 'border-green-600 bg-green-50' 
                  : 'border-gray-200 hover:border-green-300'
              }`}
            >
              <p className="text-2xl mb-2">📱</p>
              <p className="text-sm font-semibold text-green-600">UPI</p>
              <p className="text-xs text-green-600">FREE!</p>
            </button>

            <button
              onClick={() => setSelectedMethod('NET_BANKING')}
              className={`p-4 border-2 rounded-lg text-center transition ${
                selectedMethod === 'NET_BANKING' 
                  ? 'border-blue-600 bg-blue-50' 
                  : 'border-gray-200 hover:border-blue-300'
              }`}
            >
              <p className="text-2xl mb-2">🏦</p>
              <p className="text-sm font-semibold">Net Banking</p>
              <p className="text-xs text-gray-500">All banks</p>
            </button>

            <button
              onClick={() => setSelectedMethod('WALLET')}
              className={`p-4 border-2 rounded-lg text-center transition ${
                selectedMethod === 'WALLET' 
                  ? 'border-blue-600 bg-blue-50' 
                  : 'border-gray-200 hover:border-blue-300'
              }`}
            >
              <p className="text-2xl mb-2">👛</p>
              <p className="text-sm font-semibold">Wallet</p>
              <p className="text-xs text-gray-500">Paytm, etc</p>
            </button>
          </div>

          {selectedMethod && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                ✓ Selected: <strong>{selectedMethod.replace('_', ' ')}</strong>
              </p>
            </div>
          )}
        </div>

        {/* Pay Button */}
        <button
          onClick={handlePayment}
          disabled={processing || !selectedMethod}
          className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 disabled:opacity-50 transition"
        >
          {processing 
            ? 'Processing...' 
            : selectedMethod 
              ? `Pay ₹${booking.advancePayment} via ${selectedMethod.replace('_', ' ')}` 
              : 'Select Payment Method Above'
          }
        </button>

        {/* Security Info */}
        <div className="mt-6 text-center text-sm text-gray-600">
          <p>🔒 Secure payment powered by Razorpay</p>
          <p className="mt-2">Your payment information is encrypted and secure</p>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;