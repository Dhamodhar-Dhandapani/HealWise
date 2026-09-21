import { apiClient } from './client';

export const getOrders = () => apiClient('/medicines/orders');
export const getOrder = (id) => apiClient(`/medicines/orders/${id}`);
export const getByPatient = (patientId) => apiClient(`/medicines/orders/patient/${patientId}`);
export const createOrder = (data) => apiClient('/medicines/orders', { method: 'POST', body: JSON.stringify(data) });
export const updateStatus = (id, status) => apiClient(`/medicines/orders/${id}/status?status=${status}`, { method: 'PATCH' });
