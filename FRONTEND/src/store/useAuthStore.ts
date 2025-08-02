import { create } from 'zustand';

export type UserRole = 'user' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface AuthState {
  user: User | null;
  isLoggedIn: boolean;
  login: (userData: User) => void;
  logout: () => void;
  isAdmin: () => boolean;
  hasRole: (role: UserRole) => boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoggedIn: false,

  login: (userData) =>
    set(() => ({
      user: userData,
      isLoggedIn: true,
    })),

  logout: () =>
    set(() => ({
      user: null,
      isLoggedIn: false,
    })),

  isAdmin: () => {
    const { user } = get();
    return user?.role === 'admin';
  },

  hasRole: (role: UserRole) => {
    const { user } = get();
    return user?.role === role;
  },
}));
