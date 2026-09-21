import { apiClient } from './client';

export const getPatients = () => apiClient('/patient');
export const getPatient = (id) => apiClient(`/patient/${id}`);
export const createPatient = (data) => apiClient('/patient', { method: 'POST', body: JSON.stringify(data) });
export const updatePatient = (id, data) => apiClient(`/patient/${id}`, { method: 'PATCH', body: JSON.stringify(data) });
export const deletePatient = (id) => apiClient(`/patient/${id}`, { method: 'DELETE' });
