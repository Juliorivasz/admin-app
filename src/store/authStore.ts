import { create } from 'zustand';
import api from '../api/axios';

export type UserRole = 'ADMIN' | 'STOCK' | 'PEDIDOS' | 'CLIENT';

interface User {
  id: number;
  name: string;
  lastname: string;
  email: string;
  roles: UserRole[];
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  checkAuth: () => Promise<void>;
  login: (data: any) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  
  checkAuth: async () => {
    try {
      const response = await api.get('/auth/me');
      set({ user: response as any, isAuthenticated: true });
    } catch (error) {
      set({ user: null, isAuthenticated: false });
    } finally {
      set({ isLoading: false });
    }
  },

  login: async (data: any) => {
    const response = await api.post('/auth/login', data);
    set({ user: response as any, isAuthenticated: true });
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } finally {
      set({ user: null, isAuthenticated: false });
      window.location.href = '/login';
    }
  },
}));
