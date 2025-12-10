import { apiClient } from './apiClient';
import { Order, CreateOrderRequest } from '../models/order';

export const orderService = {
  async createOrder(orderData: CreateOrderRequest): Promise<{ message: string; orderId: number; totalPrice: number }> {
    const response = await apiClient.post('/orders', orderData);
    return response.data;
  },

  async getUserOrders(userId: number): Promise<Order[]> {
    const response = await apiClient.get<Order[]>(`/orders/user/${userId}`);
    return response.data;
  },

  async getAllOrders(): Promise<Order[]> {
    const response = await apiClient.get<Order[]>('/orders');
    return response.data;
  },

  async updateOrderStatus(orderId: number, status: string, notes?: string): Promise<void> {
    const requestBody: { status: string; notes?: string } = { status };
    if (notes) {
      requestBody.notes = notes;
    }
    const response = await apiClient.put(`/orders/${orderId}/status`, requestBody);
    return response.data;
  },

  async deleteOrder(orderId: number): Promise<void> {
    const response = await apiClient.delete(`/orders/${orderId}`);
    return response.data;
  }
};