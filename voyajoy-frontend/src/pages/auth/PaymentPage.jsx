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
          color: '#9333ea', // Purple theme
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
      <div className="min-h-screen flex items-center justify-center bg-linear-to-b from-purple-50 to-pink-50">
        <div className="text-center">
          <div className="inline-block w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">Loading payment details...</p>
        </div>
      </div>
    );
  }

  if (!booking) {
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
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold bg-linear-to-r from-purple-700 via-pink-600 to-pink-500 bg-clip-text text-transparent mb-2">
            Complete Payment 💳
          </h1>
          <p className="text-gray-600 text-lg">Secure payment gateway powered by Razorpay</p>
        </div>

        <ErrorHandler error={error} onClose={() => setError(null)} />

        {/* Booking Summary Card */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6 border-2 border-pink-100">
          <h2 className="text-2xl font-bold mb-4 bg-linear-to-r from-purple-700 to-pink-600 bg-clip-text text-transparent">
            📋 Booking Summary
          </h2>

          <div className="space-y-3">
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-600 font-medium">Destination</span>
              <span className="font-bold text-gray-800">{booking.destinationname}</span>
            </div>

            <div className="flex justify-between items-center py-2">
              <span className="text-gray-600 font-medium">Travel Date</span>
              <span className="font-semibold text-gray-800">
                {new Date(booking.travelDate).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric'
                })}
              </span>
            </div>

            <div className="flex justify-between items-center py-2">
              <span className="text-gray-600 font-medium">Travelers</span>
              <span className="font-semibold text-purple-600">{booking.totalTravelers}</span>
            </div>

            <div className="flex justify-between items-center py-2">
              <span className="text-gray-600 font-medium">Booking Status</span>
              <span className="font-semibold text-orange-600 bg-orange-100 px-3 py-1 rounded-full text-sm">
                {booking.bookingStatus}
              </span>
            </div>

            {booking.specialRequest && (
              <div className="pt-3 border-t-2 border-pink-100 mt-3">
                <p className="text-gray-600 text-sm font-semibold mb-1">Special Requests:</p>
                <p className="text-gray-800 bg-purple-50 p-3 rounded-xl">{booking.specialRequest}</p>
              </div>
            )}
          </div>
        </div>

        {/* Payment Details Card */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6 border-2 border-pink-100">
          <h2 className="text-2xl font-bold mb-4 bg-linear-to-r from-purple-700 to-pink-600 bg-clip-text text-transparent">
            💰 Payment Details
          </h2>

          <div className="space-y-4">
            <div className="flex justify-between items-center text-lg py-2">
              <span className="text-gray-600 font-medium">Total Package Price</span>
              <span className="font-bold text-gray-800">₹{booking.totalAmount}</span>
            </div>

            <div className="border-t-2 border-pink-100 pt-4">
              <div className="flex justify-between items-center mb-3">
                <div>
                  <p className="font-bold text-xl text-gray-800">Advance Payment</p>
                  <p className="text-sm text-gray-600">
                    Pay now to confirm booking
                  </p>
                </div>
                <span className="text-3xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  ₹{booking.advancePayment}
                </span>
              </div>
            </div>

            <div className="bg-linear-to-br from-green-50 to-emerald-50 p-5 rounded-2xl border-2 border-green-200">
              <div className="flex items-start gap-3">
                <span className="text-2xl">💡</span>
                <div>
                  <p className="text-sm text-gray-700 font-semibold mb-1">Payment Information</p>
                  <p className="text-sm text-gray-700">
                    The remaining amount of{' '}
                    <strong className="text-green-700">
                      ₹{(booking.totalAmount - booking.advancePayment).toFixed(2)}
                    </strong>{' '}
                    will be collected at the destination.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Methods Selection */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6 border-2 border-pink-100">
          <h3 className="text-xl font-bold mb-4 bg-linear-to-r from-purple-700 to-pink-600 bg-clip-text text-transparent">
            🎯 Select Payment Method
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            <button
              onClick={() => setSelectedMethod('CARD')}
              className={`p-4 md:p-5 border-2 rounded-2xl text-center transition transform hover:scale-105 ${
                selectedMethod === 'CARD' 
                  ? 'border-purple-600 bg-purple-50 shadow-lg' 
                  : 'border-pink-200 hover:border-purple-300'
              }`}
            >
              <p className="text-3xl md:text-4xl mb-2">💳</p>
              <p className="text-sm md:text-base font-bold text-gray-800">Card</p>
              <p className="text-xs text-gray-500">Credit/Debit</p>
            </button>

            <button
              onClick={() => setSelectedMethod('UPI')}
              className={`p-4 md:p-5 border-2 rounded-2xl text-center transition transform hover:scale-105 ${
                selectedMethod === 'UPI' 
                  ? 'border-green-600 bg-green-50 shadow-lg' 
                  : 'border-pink-200 hover:border-green-300'
              }`}
            >
              <p className="text-3xl md:text-4xl mb-2">📱</p>
              <p className="text-sm md:text-base font-bold text-green-700">UPI</p>
              <p className="text-xs text-green-600 font-semibold">FREE!</p>
            </button>

            <button
              onClick={() => setSelectedMethod('NET_BANKING')}
              className={`p-4 md:p-5 border-2 rounded-2xl text-center transition transform hover:scale-105 ${
                selectedMethod === 'NET_BANKING' 
                  ? 'border-purple-600 bg-purple-50 shadow-lg' 
                  : 'border-pink-200 hover:border-purple-300'
              }`}
            >
              <p className="text-3xl md:text-4xl mb-2">🏦</p>
              <p className="text-sm md:text-base font-bold text-gray-800">Net Banking</p>
              <p className="text-xs text-gray-500">All banks</p>
            </button>

            <button
              onClick={() => setSelectedMethod('WALLET')}
              className={`p-4 md:p-5 border-2 rounded-2xl text-center transition transform hover:scale-105 ${
                selectedMethod === 'WALLET' 
                  ? 'border-purple-600 bg-purple-50 shadow-lg' 
                  : 'border-pink-200 hover:border-purple-300'
              }`}
            >
              <p className="text-3xl md:text-4xl mb-2">👛</p>
              <p className="text-sm md:text-base font-bold text-gray-800">Wallet</p>
              <p className="text-xs text-gray-500">Paytm, etc</p>
            </button>
          </div>

          {selectedMethod && (
            <div className="mt-4 p-4 bg-linear-to-r from-purple-50 to-pink-50 border-2 border-purple-300 rounded-xl animate-pulse">
              <p className="text-sm md:text-base text-purple-800 font-semibold text-center">
                ✓ Selected: <strong>{selectedMethod.replace('_', ' ')}</strong>
              </p>
            </div>
          )}
        </div>

        {/* Pay Button */}
        <button
          onClick={handlePayment}
          disabled={processing || !selectedMethod}
          className="w-full bg-linear-to-r from-purple-600 to-pink-600 text-white py-5 rounded-2xl font-bold text-lg md:text-xl hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-xl hover:shadow-2xl transform hover:scale-105 disabled:transform-none mb-6"
        >
          {processing ? (
            <span className="flex items-center justify-center gap-3">
              <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
              Processing Payment...
            </span>
          ) : selectedMethod ? (
            `💳 Pay ₹${booking.advancePayment} via ${selectedMethod.replace('_', ' ')}` 
          ) : (
            '👆 Select Payment Method Above'
          )}
        </button>

        {/* Security Info */}
        <div className="bg-linear-to-br from-purple-50 to-pink-50 p-6 rounded-2xl text-center border-2 border-pink-200">
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="text-3xl">🔒</span>
            <p className="font-bold text-lg text-gray-800">Secure Payment</p>
          </div>
          <p className="text-gray-600 mb-2">Powered by Razorpay</p>
          <p className="text-sm text-gray-500">Your payment information is encrypted and secure</p>
          
          <div className="grid grid-cols-3 gap-3 mt-4">
            <div className="bg-white p-3 rounded-xl">
              <p className="text-2xl mb-1">🛡️</p>
              <p className="text-xs font-semibold text-gray-700">SSL Encrypted</p>
            </div>
            <div className="bg-white p-3 rounded-xl">
              <p className="text-2xl mb-1">✓</p>
              <p className="text-xs font-semibold text-gray-700">PCI Compliant</p>
            </div>
            <div className="bg-white p-3 rounded-xl">
              <p className="text-2xl mb-1">🌍</p>
              <p className="text-xs font-semibold text-gray-700">Trusted Globally</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;