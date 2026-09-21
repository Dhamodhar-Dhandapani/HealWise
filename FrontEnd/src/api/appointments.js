import { apiClient } from './client';

export const getAppointments = () => apiClient('/appointments');
export const getAppointment = (id) => apiClient(`/appointments/${id}`);
export const getByPatient = (patientId) => apiClient(`/appointments/patient/${patientId}`);
export const getByDoctor = (doctorId) => apiClient(`/appointments/doctor/${doctorId}`);
export const createAppointment = (data) => apiClient('/appointments', { method: 'POST', body: JSON.stringify(data) });
export const cancelAppointment = (id) => apiClient(`/appointments/${id}/cancel`, { method: 'PATCH' });
