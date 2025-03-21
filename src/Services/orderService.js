import { get, post, put, remove } from "../app/apiManager";

const OrderService = {
  // Save an order to the database
  saveOrder: async (orderData) => {
    try {
      const response = await post('/order/saveOrder', orderData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Get order by ID
  getOrderById: async (orderId) => {
    try {
      const response = await get(`/order/${orderId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Get all orders for the current user
  getUserOrders: async (page = 1, limit = 10) => {
    try {
      const response = await get('/order/user-orders', {
        params: {
          page,
          limit
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Cancel an order
  cancelOrder: async (orderId) => {
    try {
      const response = await put(`/order/${orderId}/cancel`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Track an order
  trackOrder: async (orderId) => {
    try {
      const response = await get(`/order/${orderId}/track`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Update shipping address for an order
  updateShippingAddress: async (orderId, addressData) => {
    try {
      const response = await put(`/order/${orderId}/shipping-address`, addressData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Get order status history
  getOrderStatusHistory: async (orderId) => {
    try {
      const response = await get(`/order/${orderId}/status-history`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default OrderService;