import api from './api';
import { Order } from '../types';

export const orderService = {
  createOrder: async (orderData: Partial<Order>) => {
    const response = await api.post('/orders', orderData);
    return response.data;
  },

  getOrders: async () => {
    const response = await api.get('/orders');
    return response.data;
  },

  getOrderById: async (id: string) => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  updateOrderStatus: async (id: string, status: string) => {
    const response = await api.put(`/orders/${id}/status`, { status });
    return response.data;
  },

  cancelOrder: async (id: string) => {
    const response = await api.put(`/orders/${id}/cancel`);
    return response.data;
  }
};