import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import bookingService from '../../services/bookingService';
import paymentService from '../../services/paymentService';
import ErrorHandler from '../../services/ErrorHandler';

const CustomerDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview'); // overview | bookings | payments

  useEffect(() => {
    if (!user || user.role !== 'CUSTOMER') {
      alert('Access denied. Customer login required.');
      navigate('/login');
      return;
    }
    
    fetchDashboardData();
  }, [user, navigate]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [bookingsRes, paymentsRes] = await Promise.all([
        bookingService.getMyBookings(user.userId),
        paymentService.getMyPayments(user.userId)
      ]);
      
      setBookings(bookingsRes.data);
      setPayments(paymentsRes.data);
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;

    try {
      await bookingService.cancelBooking(bookingId);
      alert('Booking cancelled successfully');
      fetchDashboardData();
    } catch (err) {
      alert('Failed to cancel booking');
      setError(err);
    }
  };

  const getStatusColor = (status) => {
    switch (status.toUpperCase()) {
      case 'CONFIRMED': return 'bg-green-100 text-green-800';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-b from-purple-50 to-pink-50">
        <div className="text-center">
          <div className="inline-block w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Calculate statistics
  const totalBookings = bookings.length;
  const confirmedBookings = bookings.filter(b => b.bookingStatus === 'CONFIRMED').length;
  const pendingBookings = bookings.filter(b => b.bookingStatus === 'PENDING').length;
  const totalSpent = payments
    .filter(p => p.paymentStatus === 'SUCCESS')
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="min-h-screen bg-linear-to-b from-purple-50 via-pink-50 to-purple-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header with Gradient */}
        <div className="mb-8 bg-linear-to-r from-purple-600 via-pink-500 to-pink-600 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
          {/* Animated Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl animate-pulse"></div>
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-4xl">👋</span>
              <h1 className="text-3xl md:text-4xl font-bold">
                Welcome, {user.username}!
              </h1>
            </div>
            <p className="text-pink-100 text-lg">Manage your bookings and track your travels</p>
          </div>
        </div>

        <ErrorHandler error={error} onClose={() => setError(null)} />

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 border-2 border-pink-100">
            <div className="flex items-center justify-between mb-3">
              <p className="text-gray-600 text-sm font-semibold">Total Bookings</p>
              <span className="text-4xl">🎫</span>
            </div>
            <p className="text-4xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {totalBookings}
            </p>
            <p className="text-xs text-gray-500 mt-2">All time bookings</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 border-2 border-pink-100">
            <div className="flex items-center justify-between mb-3">
              <p className="text-gray-600 text-sm font-semibold">Confirmed</p>
              <span className="text-4xl">✅</span>
            </div>
            <p className="text-4xl font-bold text-green-600">{confirmedBookings}</p>
            <p className="text-xs text-gray-500 mt-2">Ready to travel</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 border-2 border-pink-100">
            <div className="flex items-center justify-between mb-3">
              <p className="text-gray-600 text-sm font-semibold">Pending</p>
              <span className="text-4xl">⏳</span>
            </div>
            <p className="text-4xl font-bold text-yellow-600">{pendingBookings}</p>
            <p className="text-xs text-gray-500 mt-2">Awaiting payment</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 border-2 border-pink-100">
            <div className="flex items-center justify-between mb-3">
              <p className="text-gray-600 text-sm font-semibold">Total Spent</p>
              <span className="text-4xl">💰</span>
            </div>
            <p className="text-4xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              ₹{totalSpent.toFixed(0)}
            </p>
            <p className="text-xs text-gray-500 mt-2">Advance payments</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-xl mb-6 overflow-hidden border-2 border-pink-100">
          <div className="border-b-2 border-pink-100">
            <div className="flex overflow-x-auto">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-6 py-4 font-semibold transition whitespace-nowrap ${
                  activeTab === 'overview'
                    ? 'border-b-4 border-purple-600 text-purple-600 bg-purple-50'
                    : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
                }`}
              >
                📊 Overview
              </button>
              <button
                onClick={() => setActiveTab('bookings')}
                className={`px-6 py-4 font-semibold transition whitespace-nowrap ${
                  activeTab === 'bookings'
                    ? 'border-b-4 border-purple-600 text-purple-600 bg-purple-50'
                    : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
                }`}
              >
                🎫 My Bookings ({bookings.length})
              </button>
              <button
                onClick={() => setActiveTab('payments')}
                className={`px-6 py-4 font-semibold transition whitespace-nowrap ${
                  activeTab === 'payments'
                    ? 'border-b-4 border-purple-600 text-purple-600 bg-purple-50'
                    : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
                }`}
              >
                💳 Payment History ({payments.length})
              </button>
            </div>
          </div>

          <div className="p-4 md:p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold mb-4 bg-linear-to-r from-purple-700 via-pink-600 to-pink-500 bg-clip-text text-transparent">
                    ✨ Recent Bookings
                  </h3>
                  {bookings.length === 0 ? (
                    <div className="text-center py-12 bg-linear-to-br from-purple-50 via-pink-50 to-purple-50 rounded-2xl border-2 border-dashed border-pink-300">
                      <div className="text-6xl mb-4 animate-bounce">🌍</div>
                      <p className="text-gray-700 mb-4 text-lg font-semibold">No bookings yet</p>
                      <p className="text-gray-600 mb-6">Start your travel journey today!</p>
                      <button
                        onClick={() => navigate('/destinations')}
                        className="bg-linear-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-full hover:from-purple-700 hover:to-pink-700 transition font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
                      >
                        🔍 Explore Destinations
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {bookings.slice(0, 3).map((booking) => (
                        <div key={booking.bookingId} className="border-2 border-pink-100 rounded-2xl p-5 hover:shadow-xl transition bg-white transform hover:scale-105">
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3 gap-3">
                            <div className="flex-1">
                              <div className="flex flex-wrap items-center gap-2 mb-1">
                                <h4 className="font-bold text-lg text-gray-800">{booking.destinationname}</h4>
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(booking.bookingStatus)}`}>
                                  {booking.bookingStatus}
                                </span>
                              </div>
                              <p className="text-gray-600 text-sm">
                                📅 Travel Date: {new Date(booking.travelDate).toLocaleDateString('en-IN', {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric'
                                })}
                              </p>
                            </div>
                          </div>
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center pt-3 border-t-2 border-pink-100 gap-4">
                            <div className="grid grid-cols-3 gap-4 flex-1">
                              <div>
                                <p className="text-xs text-gray-500">Travelers</p>
                                <p className="font-semibold text-gray-800">👥 {booking.totalTravelers}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">Total Amount</p>
                                <p className="font-semibold text-gray-800">₹{booking.totalAmount.toFixed(2)}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">Advance Paid</p>
                                <p className="font-semibold text-green-600">
                                  {booking.advancePaid ? `✓ ₹${booking.advancePayment.toFixed(2)}` : '✗ Not Paid'}
                                </p>
                              </div>
                            </div>
                            <button
                              onClick={() => navigate(`/booking-confirmation/${booking.bookingId}`)}
                              className="bg-linear-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-xl hover:from-purple-700 hover:to-pink-700 font-semibold text-sm transition shadow-md hover:shadow-lg transform hover:scale-105 whitespace-nowrap"
                            >
                              View Details →
                            </button>
                          </div>
                        </div>
                      ))}
                      
                      {bookings.length > 3 && (
                        <button
                          onClick={() => setActiveTab('bookings')}
                          className="w-full py-3 text-purple-600 hover:bg-purple-50 rounded-xl transition font-semibold border-2 border-purple-200 hover:border-purple-300"
                        >
                          View All Bookings ({bookings.length}) →
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Quick Actions */}
                <div className="bg-linear-to-br from-purple-50 via-pink-50 to-purple-50 rounded-2xl p-6 border-2 border-pink-200">
                  <h3 className="font-bold text-xl mb-4 bg-linear-to-r from-purple-700 to-pink-600 bg-clip-text text-transparent">
                    🚀 Quick Actions
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button
                      onClick={() => navigate('/destinations')}
                      className="bg-white p-5 rounded-2xl hover:shadow-xl transition text-left border-2 border-pink-100 transform hover:scale-105"
                    >
                      <p className="text-3xl mb-2">🌍</p>
                      <p className="font-bold text-gray-800 text-lg">Explore Destinations</p>
                      <p className="text-sm text-gray-600">Find your next adventure</p>
                    </button>
                    
                    <button
                      onClick={() => setActiveTab('bookings')}
                      className="bg-white p-5 rounded-2xl hover:shadow-xl transition text-left border-2 border-pink-100 transform hover:scale-105"
                    >
                      <p className="text-3xl mb-2">📋</p>
                      <p className="font-bold text-gray-800 text-lg">Manage Bookings</p>
                      <p className="text-sm text-gray-600">View and update your trips</p>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Bookings Tab */}
            {activeTab === 'bookings' && (
              <div className="space-y-4">
                {bookings.length === 0 ? (
                  <div className="text-center py-12 bg-linear-to-br from-purple-50 via-pink-50 to-purple-50 rounded-2xl border-2 border-dashed border-pink-300">
                    <div className="text-6xl mb-4 animate-bounce">🎫</div>
                    <p className="text-gray-700 mb-4 text-lg font-semibold">No bookings found</p>
                    <p className="text-gray-600 mb-6">Start planning your dream vacation!</p>
                    <button
                      onClick={() => navigate('/destinations')}
                      className="bg-linear-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-full hover:from-purple-700 hover:to-pink-700 transition font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      Book Your First Trip
                    </button>
                  </div>
                ) : (
                  bookings.map((booking) => {
                    const perPersonPrice = booking.totalAmount / booking.totalTravelers;
                    const remainingAmount = booking.totalAmount - booking.advancePayment;
                    
                    return (
                      <div key={booking.bookingId} className="border-2 border-pink-100 rounded-2xl p-6 hover:shadow-xl transition bg-white">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 gap-3">
                          <div>
                            <p className="text-sm text-gray-600 mb-1">Booking ID: #{booking.bookingId}</p>
                            <h4 className="font-bold text-xl text-gray-800">{booking.destinationname}</h4>
                          </div>
                          <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(booking.bookingStatus)} whitespace-nowrap`}>
                            {booking.bookingStatus}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-gray-600 mb-1">📅 Travel Date</p>
                            <p className="font-semibold text-gray-800">
                              {new Date(booking.travelDate).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric'
                              })}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600 mb-1">👥 Travelers</p>
                            <p className="font-semibold text-gray-800">{booking.totalTravelers} Person(s)</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600 mb-1">💰 Total Amount</p>
                            <p className="font-semibold text-gray-800">₹{booking.totalAmount.toFixed(2)}</p>
                            <p className="text-xs text-gray-500">₹{perPersonPrice.toFixed(2)} per person</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600 mb-1">✓ Advance Paid</p>
                            <p className="font-semibold text-green-600">
                              {booking.advancePaid ? `₹${booking.advancePayment.toFixed(2)}` : '✗ Not Paid'}
                            </p>
                            {booking.advancePaid && (
                              <p className="text-xs text-orange-600">Remaining: ₹{remainingAmount.toFixed(2)}</p>
                            )}
                          </div>
                        </div>

                        {booking.specialRequest && (
                          <div className="bg-linear-to-r from-purple-50 to-pink-50 p-4 rounded-xl mb-4 border border-pink-200">
                            <p className="text-sm text-gray-600 mb-1 font-semibold">📝 Special Requests:</p>
                            <p className="text-sm text-gray-800">{booking.specialRequest}</p>
                          </div>
                        )}

                        <div className="flex flex-wrap gap-3 pt-4 border-t-2 border-pink-100">
                          <button
                            onClick={() => navigate(`/booking-confirmation/${booking.bookingId}`)}
                            className="bg-linear-to-r from-purple-600 to-pink-600 text-white px-5 py-2 rounded-xl hover:from-purple-700 hover:to-pink-700 transition font-semibold shadow-md hover:shadow-lg transform hover:scale-105"
                          >
                            📄 View Details
                          </button>
                          
                          {booking.bookingStatus === 'PENDING' && (
                            <>
                              {!booking.advancePaid && (
                                <button
                                  onClick={() => navigate(`/payment/${booking.bookingId}`)}
                                  className="bg-green-600 text-white px-5 py-2 rounded-xl hover:bg-green-700 transition font-semibold shadow-md hover:shadow-lg transform hover:scale-105"
                                >
                                  💳 Complete Payment
                                </button>
                              )}
                              <button
                                onClick={() => handleCancelBooking(booking.bookingId)}
                                className="bg-red-600 text-white px-5 py-2 rounded-xl hover:bg-red-700 transition font-semibold shadow-md hover:shadow-lg transform hover:scale-105"
                              >
                                ❌ Cancel Booking
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {/* Payments Tab */}
            {activeTab === 'payments' && (
              <div className="space-y-4">
                {payments.length === 0 ? (
                  <div className="text-center py-12 bg-linear-to-br from-purple-50 to-pink-50 rounded-2xl border-2 border-dashed border-pink-300">
                    <div className="text-6xl mb-4 animate-bounce">💳</div>
                    <p className="text-gray-700 text-lg font-semibold">No payment history</p>
                    <p className="text-gray-600 mt-2">Your payments will appear here</p>
                  </div>
                ) : (
                  <>
                    {/* Payment Summary Card */}
                    <div className="bg-linear-to-br from-green-50 to-emerald-50 p-6 rounded-2xl border-2 border-green-200 mb-6 shadow-lg">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                        <div>
                          <p className="text-sm text-gray-600 mb-1 font-semibold">Total Payments Made</p>
                          <p className="text-4xl font-bold text-green-700">₹{totalSpent.toFixed(2)}</p>
                          <p className="text-sm text-gray-600 mt-2">
                            {payments.filter(p => p.paymentStatus === 'SUCCESS').length} successful transaction(s)
                          </p>
                        </div>
                        <div className="text-6xl">💰</div>
                      </div>
                    </div>

                    {/* Payment Cards for Mobile, Table for Desktop */}
                    <div className="block lg:hidden space-y-4">
                      {payments.map((payment) => (
                        <div key={payment.paymentId} className="bg-white border-2 border-pink-100 rounded-2xl p-5 hover:shadow-xl transition">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Payment ID</p>
                              <p className="text-sm font-mono text-gray-700">#{payment.paymentId}</p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              payment.paymentStatus === 'SUCCESS' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {payment.paymentStatus === 'SUCCESS' ? '✓ ' : '✗ '}{payment.paymentStatus}
                            </span>
                          </div>
                          
                          <h4 className="font-bold text-lg text-gray-800 mb-3">{payment.destinationName}</h4>
                          
                          <div className="grid grid-cols-2 gap-3 mb-3">
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Amount</p>
                              <p className="font-bold text-gray-800">₹{payment.amount.toFixed(2)}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Method</p>
                              <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs font-semibold inline-block">
                                {payment.paymentMethod}
                              </span>
                            </div>
                          </div>
                          
                          <div className="pt-3 border-t border-pink-100">
                            <p className="text-xs text-gray-500">Date</p>
                            <p className="text-sm text-gray-700">
                              {new Date(payment.createdAt).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric'
                              })}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Payment Table for Desktop */}
                    <div className="hidden lg:block overflow-x-auto bg-white rounded-2xl border-2 border-pink-100 shadow-lg">
                      <table className="w-full">
                        <thead className="bg-linear-to-r from-purple-50 to-pink-50 border-b-2 border-pink-200">
                          <tr>
                            <th className="px-4 py-4 text-left text-sm font-bold text-purple-700">Payment ID</th>
                            <th className="px-4 py-4 text-left text-sm font-bold text-purple-700">Destination</th>
                            <th className="px-4 py-4 text-left text-sm font-bold text-purple-700">Amount</th>
                            <th className="px-4 py-4 text-left text-sm font-bold text-purple-700">Method</th>
                            <th className="px-4 py-4 text-left text-sm font-bold text-purple-700">Status</th>
                            <th className="px-4 py-4 text-left text-sm font-bold text-purple-700">Date</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-pink-100">
                          {payments.map((payment) => (
                            <tr key={payment.paymentId} className="hover:bg-purple-50 transition">
                              <td className="px-4 py-4 text-sm font-mono text-gray-600">#{payment.paymentId}</td>
                              <td className="px-4 py-4 text-sm font-semibold text-gray-800">{payment.destinationName}</td>
                              <td className="px-4 py-4 text-sm font-bold text-gray-800">₹{payment.amount.toFixed(2)}</td>
                              <td className="px-4 py-4 text-sm text-gray-600">
                                <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-semibold">
                                  {payment.paymentMethod}
                                </span>
                              </td>
                              <td className="px-4 py-4 text-sm">
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                  payment.paymentStatus === 'SUCCESS' 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-red-100 text-red-800'
                                }`}>
                                  {payment.paymentStatus === 'SUCCESS' ? '✓ ' : '✗ '}{payment.paymentStatus}
                                </span>
                              </td>
                              <td className="px-4 py-4 text-sm text-gray-600">
                                {new Date(payment.createdAt).toLocaleDateString('en-IN', {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric'
                                })}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;