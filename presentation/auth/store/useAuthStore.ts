import { create } from 'zustand';

interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (firstName: string, lastName: string, email: string, password: string) => Promise<void>;
    logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    login: async (email: string, password: string) => {
        set({ isLoading: true });
        await new Promise(resolve => setTimeout(resolve, 1000));
        set({ user: { id: '1', email, firstName: 'Usuario', lastName: '' }, isAuthenticated: true, isLoading: false });
    },
    register: async (firstName: string, lastName: string, email: string, password: string) => {
        set({ isLoading: true });
        await new Promise(resolve => setTimeout(resolve, 1000));
        set({ user: { id: '1', email, firstName, lastName }, isAuthenticated: true, isLoading: false });
    },
    logout: () => set({ user: null, isAuthenticated: false }),
}));
