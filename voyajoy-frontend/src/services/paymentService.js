import api from './api';

const paymentService = {
  
  // Create Razorpay Order
  createOrder: (orderData) => {
    return api.post('/payment/create-order', orderData);
  },

  // Verify Payment
  verifyPayment: (verificationData) => {
    return api.post('/payment/verify', verificationData);
  },

  // Get payment by ID
  getPaymentById: (paymentId) => {
    return api.get(`/payment/get-by-id/${paymentId}`);
  },

  // Get my payments
  getMyPayments: (userId) => {
    return api.get(`/payment/my-payments/${userId}`);
  },

  // Get payments by booking
  getPaymentsByBooking: (bookingId) => {
    return api.get(`/payment/booking/${bookingId}`);
  },

  // Manager: Get all payments
  getAllPayments: () => {
    return api.get('/payment/all');
  },

  // Manager: Get payments by status
  getPaymentsByStatus: (status) => {
    return api.get(`/payment/status/${status}`);
  },

  // Manager: Get total revenue
  getTotalRevenue: () => {
    return api.get('/payment/revenue/total');
  },
};

export default paymentService;