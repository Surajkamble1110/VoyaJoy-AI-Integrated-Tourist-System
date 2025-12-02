import api from "./api";

const bookingService = {
  
  // Create booking
  createBooking: (userId, destinationId, bookingData) => {
    return api.post(`/booking/create/${userId}/${destinationId}`, bookingData);
  },

  // Get my bookings
  getMyBookings: (userId) => {
    return api.get(`/booking/my-bookings/${userId}`);
  },

  // Get booking by ID
  getBookingById: (bookingId) => {
    return api.get(`/booking/get-by-id/${bookingId}`);
  },

  // Cancel booking
  cancelBooking: (bookingId) => {
    return api.delete(`/booking/delete/${bookingId}`);
  },

  // Manager: Get all bookings
  getAllBookings: () => {
    return api.get('/manager/booking/get-all');
  },

  // Manager: Get bookings by status
  getBookingsByStatus: (status) => {
    return api.get(`/manager/booking/get-by-status/${status}`);
  },

  // Manager: Update booking status
  updateBookingStatus: (bookingId, status) => {
    return api.patch(`/manager/booking/update-status/${bookingId}/${status}`);
  },
};

export default bookingService;