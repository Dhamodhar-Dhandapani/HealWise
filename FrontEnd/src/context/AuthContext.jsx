import { createContext, useContext, useState, useEffect } from 'react';
import * as authApi from '../api/auth';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    // Re-fetch user on mount or token change
    useEffect(() => {
        if (token) {
            authApi.getCurrentUser(token)
                .then(userData => {
                    setUser(userData);
                })
                .catch(err => {
                    console.error('Session expired', err);
                    logout();
                })
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, [token]);

    const login = async (credentials) => {
        const data = await authApi.login(credentials);
        const newToken = typeof data === 'string' ? data : data.token;
        if (newToken) {
            setToken(newToken);
            localStorage.setItem('token', newToken);
            // Set user data immediately from the login response
            if (typeof data === 'object' && data.email) {
                setUser({
                    id: data.id,
                    email: data.email,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    role: data.role,
                });
            }
        }
    };

    const register = async (userData) => {
        return await authApi.register(userData);
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
