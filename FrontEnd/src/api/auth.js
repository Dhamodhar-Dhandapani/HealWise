const BASE_URL = '/api/auth';

export const login = async (credentials) => {
    const res = await fetch(`${BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
    });
    if (!res.ok) throw new Error('Login failed. Please check credentials.');
    // Handle empty or text responses if token is not JSON
    const text = await res.text();
    try {
        return JSON.parse(text);
    } catch {
        return text; // Return text (likely string token) if fallback fails
    }
};

export const register = async (userData) => {
    const res = await fetch(`${BASE_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
    });
    if (!res.ok) throw new Error('Registration failed');
    const text = await res.text();
    try { return JSON.parse(text); } catch { return text; }
};

export const getCurrentUser = async (token) => {
    const res = await fetch(`${BASE_URL}/me`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    if (!res.ok) throw new Error('Failed to fetch user');
    return res.json();
};
