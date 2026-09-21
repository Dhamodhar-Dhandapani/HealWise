import { apiClient } from './client';

export const getDoctors = () => apiClient('/doctors');
export const getDoctorsByHospital = (hospitalId) => apiClient(`/doctors/hospital/${hospitalId}`);
export const createDoctor = (data) => apiClient('/doctors', { method: 'POST', body: JSON.stringify(data) });
export const getAvailability = (id, date) => apiClient(`/doctors/${id}/availability?date=${date}`);
export const createSlots = (id, slots) => apiClient(`/doctors/${id}/slots`, { method: 'POST', body: JSON.stringify(slots) });
