import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '../utils/api';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    // Load stored auth on mount
    useEffect(() => {
        const storedToken = localStorage.getItem('petms_token');
        const storedUser = localStorage.getItem('petms_user');

        if (storedToken && storedUser) {
            setToken(storedToken);
            try {
                setUser(JSON.parse(storedUser));
            } catch {
                localStorage.removeItem('petms_user');
            }
        }
        setLoading(false);
    }, []);

    const login = useCallback(async (email, password, role) => {
        try {
            const response = await authAPI.login(email, password, role);
            if (response.success) {
                const { user: userData, token: authToken } = response.data;
                setUser(userData);
                setToken(authToken);
                localStorage.setItem('petms_token', authToken);
                localStorage.setItem('petms_user', JSON.stringify(userData));
                return { success: true, user: userData };
            }
            return { success: false, message: response.message || 'Login failed' };
        } catch (error) {
            return { success: false, message: error.message || 'Login failed. Please try again.' };
        }
    }, []);

    const logout = useCallback(() => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('petms_token');
        localStorage.removeItem('petms_user');
    }, []);

    const value = {
        user,
        token,
        loading,
        login,
        logout,
        isAuthenticated: !!token,
        isAdmin: user?.role === 'admin',
        isContractor: user?.role === 'contractor',
        isCitizen: user?.role === 'citizen',
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
