import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (userData: Partial<User> & { password: string }) => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('aquasense_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      // Mock authentication - in production, this would call your API
      const mockUser: User = {
        id: '1',
        email,
        name: email === 'official@aquasense.com' ? 'John Official' : 
              email === 'analyst@aquasense.com' ? 'Jane Analyst' : 'Citizen User',
        role: email === 'official@aquasense.com' ? 'official' : 
              email === 'analyst@aquasense.com' ? 'analyst' : 'citizen',
        created_at: new Date().toISOString(),
      };
      
      setUser(mockUser);
      localStorage.setItem('aquasense_user', JSON.stringify(mockUser));
    } catch (error) {
      throw new Error('Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('aquasense_user');
  };

  const register = async (userData: Partial<User> & { password: string }) => {
    setLoading(true);
    try {
      const newUser: User = {
        id: Date.now().toString(),
        email: userData.email!,
        name: userData.name!,
        role: userData.role || 'citizen',
        phone: userData.phone,
        organization: userData.organization,
        created_at: new Date().toISOString(),
      };
      
      setUser(newUser);
      localStorage.setItem('aquasense_user', JSON.stringify(newUser));
    } catch (error) {
      throw new Error('Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, loading }}>
      {children}
    </AuthContext.Provider>
  );
}