
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import apiService from '../services/apiService';
import { showToast } from '../components/Toast';

export interface AuthContextType {
  user: User | null;
  isLoadingAuth: boolean;
  basicAuthHeader: string | null;
  login: (usernameInput: string, passwordInput: string) => Promise<boolean>;
  signup: (usernameInput: string, passwordInput: string) => Promise<boolean>;
  logout: () => void;
  deleteAccount: () => Promise<boolean>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState<boolean>(true);
  const [basicAuthHeader, setBasicAuthHeader] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('authUser');
    const storedAuthHeader = localStorage.getItem('authHeader');
    if (storedUser && storedAuthHeader) {
      try {
        setUser(JSON.parse(storedUser));
        setBasicAuthHeader(storedAuthHeader);
      } catch (error) {
        console.error("Failed to parse stored user data", error);
        localStorage.removeItem('authUser');
        localStorage.removeItem('authHeader');
      }
    }
    setIsLoadingAuth(false);
  }, []);

  const login = async (usernameInput: string, passwordInput: string): Promise<boolean> => {
    setIsLoadingAuth(true);
    try {
      const authHeader = `Basic ${btoa(`${usernameInput}:${passwordInput}`)}`;
      const response = await apiService.login(authHeader);
      if (response.success && response.user) {
        const userData: User = { username: response.user.username, is_admin: response.user.is_admin };
        setUser(userData);
        setBasicAuthHeader(authHeader);
        localStorage.setItem('authUser', JSON.stringify(userData));
        localStorage.setItem('authHeader', authHeader);
        showToast('success', `Welcome back, ${userData.username}!`);
        return true;
      } else {
        showToast('error', 'Login failed. Please check your credentials.');
        return false;
      }
    } catch (error: any) {
      console.error('Login error:', error);
      const errorMsg = error.response?.data?.detail || 'Login failed. An unexpected error occurred.';
      showToast('error', typeof errorMsg === 'string' ? errorMsg : 'Login failed.');
      return false;
    } finally {
      setIsLoadingAuth(false);
    }
  };

  const signup = async (usernameInput: string, passwordInput: string): Promise<boolean> => {
    setIsLoadingAuth(true);
    try {
      const response = await apiService.signup(usernameInput, passwordInput);
      if (response.success) {
        showToast('success', `User ${response.username} registered successfully! Please log in.`);
        return true;
      } else {
         // This path might not be hit if API throws HTTP error for failure
        showToast('error', 'Signup failed. Please try again.');
        return false;
      }
    } catch (error: any) {
      console.error('Signup error:', error);
      const errorMsg = error.response?.data?.detail || 'Signup failed. An unexpected error occurred.';
      showToast('error', typeof errorMsg === 'string' ? errorMsg : 'Signup failed.');
      return false;
    } finally {
      setIsLoadingAuth(false);
    }
  };

  const logout = () => {
    setUser(null);
    setBasicAuthHeader(null);
    localStorage.removeItem('authUser');
    localStorage.removeItem('authHeader');
    showToast('info', 'You have been logged out.');
  };

  const deleteAccount = async (): Promise<boolean> => {
    if (!basicAuthHeader) {
      showToast('error', 'You are not logged in.');
      return false;
    }
    setIsLoadingAuth(true);
    try {
      await apiService.deleteMyAccount(basicAuthHeader);
      showToast('success', 'Your account has been deleted.');
      logout(); // Clear session after deletion
      return true;
    } catch (error: any) {
      console.error('Delete account error:', error);
      const errorMsg = error.response?.data?.detail || 'Failed to delete account.';
      showToast('error', typeof errorMsg === 'string' ? errorMsg : 'Failed to delete account.');
      return false;
    } finally {
      setIsLoadingAuth(false);
    }
  };


  return (
    <AuthContext.Provider value={{ user, isLoadingAuth, basicAuthHeader, login, signup, logout, deleteAccount }}>
      {children}
    </AuthContext.Provider>
  );
};
    