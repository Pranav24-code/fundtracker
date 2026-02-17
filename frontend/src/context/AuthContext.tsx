'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getMeThunk, logoutThunk } from '@/redux/slices/authSlice';
import type { RootState, AppDispatch } from '@/redux/store';

interface AuthContextType {
  user: any;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAdmin: boolean;
  isContractor: boolean;
  isCitizen: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  isAdmin: false,
  isContractor: false,
  isCitizen: false,
  logout: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const dispatch = useDispatch<AppDispatch>();
  const { user, token } = useSelector((state: RootState) => state.auth);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = localStorage.getItem('petms_token');
      if (storedToken) {
        try {
          await dispatch(getMeThunk()).unwrap();
        } catch {
          // Token invalid
        }
      }
      setIsLoading(false);
    };
    checkAuth();
  }, [dispatch]);

  const logout = () => {
    dispatch(logoutThunk());
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        isAdmin: user?.role === 'admin',
        isContractor: user?.role === 'contractor',
        isCitizen: user?.role === 'citizen',
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
