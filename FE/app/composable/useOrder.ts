import { useApi } from './useApi';
import type {
  AdminOrderStatus,
  CheckoutPayload,
  CheckoutResponse,
  OrderResponse,
  OrdersResponse,
  UserOrderStatus,
} from '../types/api';

export function useOrder() {
  const api = useApi();

  const checkout = async (payload: CheckoutPayload) => {
    return api.create<CheckoutResponse, CheckoutPayload>('/orders/checkout', payload);
  };

  const listMyOrders = async (status?: UserOrderStatus) => {
    if (!status) {
      return api.get<OrdersResponse>('/orders/my');
    }

    return api.list<OrdersResponse>('/orders/my', { status });
  };

  const listAdminOrders = async (status?: AdminOrderStatus) => {
    if (!status) {
      return api.get<OrdersResponse>('/orders/admin');
    }

    return api.list<OrdersResponse>('/orders/admin', { status });
  };

  const acceptOrder = async (orderId: string) => {
    return api.patch<OrderResponse, Record<string, never>>(`/orders/${orderId}/accept`, {});
  };

  const completeOrder = async (orderId: string) => {
    return api.patch<OrderResponse, Record<string, never>>(`/orders/${orderId}/complete`, {});
  };

  const hideMyCompletedOrder = async (orderId: string) => {
    return api.patch<{ message: string }, Record<string, never>>(`/orders/${orderId}/hide`, {});
  };

  const deleteCompletedOrderByAdmin = async (orderId: string) => {
    return api.remove<{ message: string }>(`/orders/${orderId}`);
  };

  const confirmDirectPayment = async (orderId: string) => {
    return api.patch<OrderResponse, Record<string, never>>(
      `/orders/${orderId}/confirm-direct-payment`,
      {},
    );
  };

  return {
    checkout,
    listMyOrders,
    listAdminOrders,
    acceptOrder,
    completeOrder,
    hideMyCompletedOrder,
    deleteCompletedOrderByAdmin,
    confirmDirectPayment,
  };
}
