import { apiClient } from './client';

export const getHospitals = () => apiClient('/hospitals');
export const getHospital = (id) => apiClient(`/hospitals/${id}`);
export const createHospital = (data) => apiClient('/hospitals', { method: 'POST', body: JSON.stringify(data) });
export const updateBeds = (id, params) => apiClient(`/hospitals/${id}/beds?${new URLSearchParams(params)}`, { method: 'PATCH' });
export const deleteHospital = (id) => apiClient(`/hospitals/${id}`, { method: 'DELETE' });

export const allotBed = (hospitalId, patientId, category) => apiClient(`/hospitals/${hospitalId}/beds/allot?patientId=${patientId}&category=${category}`, { method: 'POST' });
export const dischargeBed = (hospitalId, allotmentId) => apiClient(`/hospitals/${hospitalId}/beds/discharge/${allotmentId}`, { method: 'POST' });
export const getBedInventory = (hospitalId) => apiClient(`/hospitals/${hospitalId}/beds/inventory`);
export const setBedInventory = (hospitalId, category, totalCount, availableCount) => apiClient(`/hospitals/${hospitalId}/beds/inventory?category=${category}&totalCount=${totalCount}&availableCount=${availableCount}`, { method: 'POST' });
