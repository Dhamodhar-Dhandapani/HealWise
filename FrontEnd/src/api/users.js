import { apiClient } from './client';

export const getUsers = () => apiClient('/users');
export const getUser = (id) => apiClient(`/users/${id}`);
export const deleteUser = (id) => apiClient(`/users/${id}`, { method: 'DELETE' });
