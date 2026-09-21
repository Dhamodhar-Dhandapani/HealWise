export const apiClient = async (endpoint, options = {}) => {
    const token = localStorage.getItem('token');
    const headers = {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers
    };

    const response = await fetch(`/api${endpoint}`, {
        ...options,
        headers
    });

    if (!response.ok) {
        let errorText = 'API Request Failed';
        try {
            const errPayload = await response.json();
            errorText = errPayload.message || errorText;
        } catch {
            errorText = await response.text();
        }
        throw new Error(errorText || 'API Request Failed');
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
        return response.json();
    }
    return response.text();
};
