import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import ErrorHandler from '../../services/ErrorHandler';

const API_BASE_URL = "https://profound-gratitude-production-042f.up.railway.app/voyajoy/api";

const ManagerDashboard = () => {
  const { user, token } = useContext(AuthContext);
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDestinations: 0,
    totalBookings: 0,
    pendingBookings: 0,
    totalRevenue: 0
  });

  const [bookings, setBookings] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview'); // overview | bookings | customers

  useEffect(() => {
    if (!user || user.role !== 'MANAGER') {
      alert('Access denied. Manager login required.');
      navigate('/login');
      return;
    }

    fetchDashboardData();
  }, [user, navigate]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      // Fetch all data using existing backend APIs
      const [
        usersCountRes,
        destinationsCountRes,
        bookingsCountRes,
        pendingCountRes,
        revenueRes,
        allBookingsRes,
        customersRes
      ] = await Promise.all([
        axios.get(`${API_BASE_URL}/manager/user-count`, config),
        axios.get(`${API_BASE_URL}/manager/destination/count`, config),
        axios.get(`${API_BASE_URL}/manager/booking/count`, config),
        axios.get(`${API_BASE_URL}/manager/booking/pending-count`, config),
        axios.get(`${API_BASE_URL}/payment/revenue/total`, config),
        axios.get(`${API_BASE_URL}/manager/booking/get-all`, config),
        axios.get(`${API_BASE_URL}/manager/customers`, config)
      ]);

      setStats({
        totalUsers: usersCountRes.data['Toatal users'],
        totalDestinations: destinationsCountRes.data['Total count: '],
        totalBookings: bookingsCountRes.data['Total Bookings '],
        pendingBookings: pendingCountRes.data['Total Pending Bookings '],
        totalRevenue: revenueRes.data
      });

      setBookings(allBookingsRes.data);
      setCustomers(customersRes.data);
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId, newStatus) => {
    try {
      await axios.patch(
        `${API_BASE_URL}/manager/booking/update-status/${bookingId}/${newStatus}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      alert(`Booking status updated to ${newStatus}`);
      fetchDashboardData();
    } catch (err) {
      alert('Failed to update booking status');
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
          <p className="text-gray-600">Loading manager dashboard...</p>
        </div>
      </div>
    );
  }

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
              <span className="text-4xl">📊</span>
              <h1 className="text-3xl md:text-4xl font-bold">
                Manager Dashboard
              </h1>
            </div>
            <p className="text-pink-100 text-lg">Manage bookings, customers, and track revenue</p>
          </div>
        </div>

        <ErrorHandler error={error} onClose={() => setError(null)} />

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 border-2 border-pink-100">
            <div className="flex items-center justify-between mb-3">
              <p className="text-gray-600 text-sm font-semibold">Total Users</p>
              <span className="text-4xl">👥</span>
            </div>
            <p className="text-4xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {stats.totalUsers}
            </p>
            <p className="text-xs text-gray-500 mt-2">Registered users</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 border-2 border-pink-100">
            <div className="flex items-center justify-between mb-3">
              <p className="text-gray-600 text-sm font-semibold">Destinations</p>
              <span className="text-4xl">🌍</span>
            </div>
            <p className="text-4xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {stats.totalDestinations}
            </p>
            <p className="text-xs text-gray-500 mt-2">Available packages</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 border-2 border-pink-100">
            <div className="flex items-center justify-between mb-3">
              <p className="text-gray-600 text-sm font-semibold">Total Bookings</p>
              <span className="text-4xl">🎫</span>
            </div>
            <p className="text-4xl font-bold text-purple-600">{stats.totalBookings}</p>
            <p className="text-xs text-gray-500 mt-2">All time bookings</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 border-2 border-pink-100">
            <div className="flex items-center justify-between mb-3">
              <p className="text-gray-600 text-sm font-semibold">Pending</p>
              <span className="text-4xl">⏳</span>
            </div>
            <p className="text-4xl font-bold text-yellow-600">{stats.pendingBookings}</p>
            <p className="text-xs text-gray-500 mt-2">Needs attention</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 border-2 border-pink-100">
            <div className="flex items-center justify-between mb-3">
              <p className="text-gray-600 text-sm font-semibold">Total Revenue</p>
              <span className="text-4xl">💰</span>
            </div>
            <p className="text-4xl font-bold text-green-600">₹{stats.totalRevenue.toFixed(0)}</p>
            <p className="text-xs text-gray-500 mt-2">Total earnings</p>
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
                🎫 All Bookings ({bookings.length})
              </button>
              <button
                onClick={() => setActiveTab('customers')}
                className={`px-6 py-4 font-semibold transition whitespace-nowrap ${
                  activeTab === 'customers'
                    ? 'border-b-4 border-purple-600 text-purple-600 bg-purple-50'
                    : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
                }`}
              >
                👥 Customers ({customers.length})
              </button>
            </div>
          </div>

          <div className="p-4 md:p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold mb-4 bg-linear-to-r from-purple-700 via-pink-600 to-pink-500 bg-clip-text text-transparent">
                    ✨ Recent Activity
                  </h3>
                  
                  {/* Quick Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-linear-to-br from-purple-50 to-pink-50 p-5 rounded-2xl border-2 border-pink-200 shadow-md hover:shadow-lg transition">
                      <p className="text-sm text-gray-600 mb-1 font-semibold">Confirmed Today</p>
                      <p className="text-3xl font-bold text-purple-600">
                        {bookings.filter(b => 
                          b.bookingStatus === 'CONFIRMED' && 
                          new Date(b.createdAt).toDateString() === new Date().toDateString()
                        ).length}
                      </p>
                    </div>
                    
                    <div className="bg-linear-to-br from-yellow-50 to-orange-50 p-5 rounded-2xl border-2 border-yellow-200 shadow-md hover:shadow-lg transition">
                      <p className="text-sm text-gray-600 mb-1 font-semibold">Needs Action</p>
                      <p className="text-3xl font-bold text-yellow-600">
                        {bookings.filter(b => b.bookingStatus === 'PENDING').length}
                      </p>
                    </div>
                    
                    <div className="bg-linear-to-br from-green-50 to-emerald-50 p-5 rounded-2xl border-2 border-green-200 shadow-md hover:shadow-lg transition">
                      <p className="text-sm text-gray-600 mb-1 font-semibold">Revenue This Month</p>
                      <p className="text-3xl font-bold text-green-600">
                        ₹{stats.totalRevenue.toFixed(0)}
                      </p>
                    </div>
                  </div>

                  {/* Recent Bookings */}
                  <h4 className="font-bold text-xl mb-3 bg-linear-to-r from-purple-700 to-pink-600 bg-clip-text text-transparent">
                    📋 Latest Bookings
                  </h4>
                  <div className="space-y-3">
                    {bookings.slice(0, 5).map((booking) => (
                      <div key={booking.bookingId} className="border-2 border-pink-100 rounded-2xl p-5 hover:shadow-xl transition bg-white transform hover:scale-105">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                          <div className="flex-1">
                            <p className="font-bold text-lg text-gray-800">
                              {booking.username} - {booking.destinationname}
                            </p>
                            <p className="text-sm text-gray-600">
                              📅 Travel: {new Date(booking.travelDate).toLocaleDateString()} | 💰 ₹{booking.totalAmount}
                            </p>
                          </div>
                          <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(booking.bookingStatus)} whitespace-nowrap`}>
                            {booking.bookingStatus}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Bookings Tab */}
            {activeTab === 'bookings' && (
              <div>
                {/* Mobile Card View */}
                <div className="block lg:hidden space-y-4">
                  {bookings.map((booking) => (
                    <div key={booking.bookingId} className="bg-white border-2 border-pink-100 rounded-2xl p-5 hover:shadow-xl transition">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Booking ID</p>
                          <p className="text-sm font-mono text-gray-700">#{booking.bookingId}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(booking.bookingStatus)}`}>
                          {booking.bookingStatus}
                        </span>
                      </div>
                      
                      <h4 className="font-bold text-lg text-gray-800 mb-2">{booking.username}</h4>
                      <p className="text-gray-600 mb-3">{booking.destinationname}</p>
                      
                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Travel Date</p>
                          <p className="text-sm font-semibold text-gray-800">
                            {new Date(booking.travelDate).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Amount</p>
                          <p className="text-sm font-bold text-gray-800">₹{booking.totalAmount}</p>
                        </div>
                      </div>
                      
                      {booking.bookingStatus === 'PENDING' && (
                        <select
                          onChange={(e) => updateBookingStatus(booking.bookingId, e.target.value)}
                          className="w-full px-4 py-2 border-2 border-purple-300 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none font-semibold"
                          defaultValue=""
                        >
                          <option value="" disabled>Update Status</option>
                          <option value="CONFIRMED">✓ Confirm Booking</option>
                          <option value="CANCELLED">✗ Cancel Booking</option>
                        </select>
                      )}
                    </div>
                  ))}
                </div>

                {/* Desktop Table View */}
                <div className="hidden lg:block overflow-x-auto bg-white rounded-2xl border-2 border-pink-100 shadow-lg">
                  <table className="w-full">
                    <thead className="bg-linear-to-r from-purple-50 to-pink-50 border-b-2 border-pink-200">
                      <tr>
                        <th className="px-4 py-4 text-left text-sm font-bold text-purple-700">Booking ID</th>
                        <th className="px-4 py-4 text-left text-sm font-bold text-purple-700">Customer</th>
                        <th className="px-4 py-4 text-left text-sm font-bold text-purple-700">Destination</th>
                        <th className="px-4 py-4 text-left text-sm font-bold text-purple-700">Travel Date</th>
                        <th className="px-4 py-4 text-left text-sm font-bold text-purple-700">Amount</th>
                        <th className="px-4 py-4 text-left text-sm font-bold text-purple-700">Status</th>
                        <th className="px-4 py-4 text-left text-sm font-bold text-purple-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-pink-100">
                      {bookings.map((booking) => (
                        <tr key={booking.bookingId} className="hover:bg-purple-50 transition">
                          <td className="px-4 py-4 text-sm font-mono text-gray-600">#{booking.bookingId}</td>
                          <td className="px-4 py-4 text-sm font-semibold text-gray-800">{booking.username}</td>
                          <td className="px-4 py-4 text-sm text-gray-800">{booking.destinationname}</td>
                          <td className="px-4 py-4 text-sm text-gray-600">
                            {new Date(booking.travelDate).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-4 text-sm font-bold text-gray-800">₹{booking.totalAmount}</td>
                          <td className="px-4 py-4 text-sm">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(booking.bookingStatus)}`}>
                              {booking.bookingStatus}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-sm">
                            {booking.bookingStatus === 'PENDING' && (
                              <select
                                onChange={(e) => updateBookingStatus(booking.bookingId, e.target.value)}
                                className="px-3 py-2 border-2 border-purple-300 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none font-semibold"
                                defaultValue=""
                              >
                                <option value="" disabled>Update</option>
                                <option value="CONFIRMED">Confirm</option>
                                <option value="CANCELLED">Cancel</option>
                              </select>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Customers Tab */}
            {activeTab === 'customers' && (
              <div>
                {/* Mobile Card View */}
                <div className="block lg:hidden space-y-4">
                  {customers.map((customer) => {
                    const customerBookings = bookings.filter(b => b.userId === customer.userId).length;
                    return (
                      <div key={customer.userId} className="bg-white border-2 border-pink-100 rounded-2xl p-5 hover:shadow-xl transition">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <p className="text-xs text-gray-500 mb-1">User ID</p>
                            <p className="text-sm font-mono text-gray-700">#{customer.userId}</p>
                          </div>
                          <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-semibold">
                            {customerBookings} booking(s)
                          </span>
                        </div>
                        
                        <h4 className="font-bold text-lg text-gray-800 mb-2">{customer.username}</h4>
                        
                        <div className="space-y-2">
                          <div>
                            <p className="text-xs text-gray-500">Email</p>
                            <p className="text-sm text-gray-700">{customer.email}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Phone</p>
                            <p className="text-sm text-gray-700">{customer.phoneNumber}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Desktop Table View */}
                <div className="hidden lg:block overflow-x-auto bg-white rounded-2xl border-2 border-pink-100 shadow-lg">
                  <table className="w-full">
                    <thead className="bg-linear-to-r from-purple-50 to-pink-50 border-b-2 border-pink-200">
                      <tr>
                        <th className="px-4 py-4 text-left text-sm font-bold text-purple-700">User ID</th>
                        <th className="px-4 py-4 text-left text-sm font-bold text-purple-700">Username</th>
                        <th className="px-4 py-4 text-left text-sm font-bold text-purple-700">Email</th>
                        <th className="px-4 py-4 text-left text-sm font-bold text-purple-700">Phone</th>
                        <th className="px-4 py-4 text-left text-sm font-bold text-purple-700">Bookings</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-pink-100">
                      {customers.map((customer) => {
                        const customerBookings = bookings.filter(b => b.userId === customer.userId).length;
                        return (
                          <tr key={customer.userId} className="hover:bg-purple-50 transition">
                            <td className="px-4 py-4 text-sm font-mono text-gray-600">#{customer.userId}</td>
                            <td className="px-4 py-4 text-sm font-semibold text-gray-800">{customer.username}</td>
                            <td className="px-4 py-4 text-sm text-gray-700">{customer.email}</td>
                            <td className="px-4 py-4 text-sm text-gray-700">{customer.phoneNumber}</td>
                            <td className="px-4 py-4 text-sm">
                              <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-semibold">
                                {customerBookings} booking(s)
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <button
            onClick={() => navigate('/manager/destinations')}
            className="bg-linear-to-r from-purple-600 to-pink-600 text-white p-6 rounded-2xl hover:from-purple-700 hover:to-pink-700 transition shadow-xl hover:shadow-2xl transform hover:scale-105"
          >
            <p className="text-4xl mb-3">🌍</p>
            <p className="font-bold text-lg">Manage Destinations</p>
            <p className="text-sm text-pink-100 mt-1">Add or edit packages</p>
          </button>
          
          <button
            onClick={() => navigate('/manager/payments')}
            className="bg-linear-to-r from-green-500 to-emerald-600 text-white p-6 rounded-2xl hover:from-green-600 hover:to-emerald-700 transition shadow-xl hover:shadow-2xl transform hover:scale-105"
          >
            <p className="text-4xl mb-3">💳</p>
            <p className="font-bold text-lg">View All Payments</p>
            <p className="text-sm text-green-100 mt-1">Track transactions</p>
          </button>
          
          <button
            onClick={() => navigate('/manager/reports')}
            className="bg-linear-to-r from-pink-500 to-rose-600 text-white p-6 rounded-2xl hover:from-pink-600 hover:to-rose-700 transition shadow-xl hover:shadow-2xl transform hover:scale-105"
          >
            <p className="text-4xl mb-3">📊</p>
            <p className="font-bold text-lg">Generate Reports</p>
            <p className="text-sm text-pink-100 mt-1">Analytics & insights</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;