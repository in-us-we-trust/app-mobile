import { create } from 'zustand';
import { jwtDecode } from 'jwt-decode';
import { loginAction, registerAction } from '@/core/auth/actions/auth-actions';
import { setAuthToken } from '@/core/api/http-client';
import { SecureStorageAdapter } from '@/helpers/adapters/secure-storage.adapter';

const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
}

interface JWTPayload {
    user: {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
    };
    iat: number;
    exp: number;
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    initializeAuth: () => Promise<void>;
    login: (email: string, password: string) => Promise<void>;
    register: (firstName: string, lastName: string, email: string, password: string) => Promise<void>;
    logout: () => void;
}

const decodeUser = (token: string): User => {
    const payload = jwtDecode<JWTPayload>(token);
    return {
        id: payload.user.id,
        email: payload.user.email,
        firstName: payload.user.firstName,
        lastName: payload.user.lastName,
    };
};

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    initializeAuth: async () => {
        try {
            const storedAccessToken = await SecureStorageAdapter.getItem(ACCESS_TOKEN_KEY);

            if (storedAccessToken) {
                setAuthToken(storedAccessToken);
                const user = decodeUser(storedAccessToken);
                set({ user, isAuthenticated: true, isLoading: false });
                return;
            }

            setAuthToken(null);
            set({ user: null, isAuthenticated: false, isLoading: false });
        } catch (error) {
            setAuthToken(null);
            set({ user: null, isAuthenticated: false, isLoading: false });
        }
    },
    login: async (email: string, password: string) => {
        set({ isLoading: true });
        try {
            const loginResult = await loginAction({ email, password });

            if (!loginResult.accessToken) {
                throw new Error('No se recibió access token en la respuesta de login');
            }

            setAuthToken(loginResult.accessToken);
            const user = decodeUser(loginResult.accessToken);

            await Promise.all([
                SecureStorageAdapter.setItem(ACCESS_TOKEN_KEY, loginResult.accessToken),
                SecureStorageAdapter.setItem(REFRESH_TOKEN_KEY, loginResult.refreshToken),
            ]);

            set({ user, isAuthenticated: true, isLoading: false });
        } catch (error) {
            setAuthToken(null);
            set({ isLoading: false });
            throw error;
        }
    },
    register: async (firstName: string, lastName: string, email: string, password: string) => {
        set({ isLoading: true });
        try {
            const registeredUser = await registerAction({ firstName, lastName, email, password });

            set({
                user: {
                    id: registeredUser.id,
                    email: registeredUser.email,
                    firstName: registeredUser.firstName,
                    lastName: registeredUser.lastName,
                },
                isAuthenticated: true,
                isLoading: false,
            });
        } catch (error) {
            set({ isLoading: false });
            throw error;
        }
    },
    logout: () => {
        setAuthToken(null);
        void Promise.all([
            SecureStorageAdapter.deleteItem(ACCESS_TOKEN_KEY),
            SecureStorageAdapter.deleteItem(REFRESH_TOKEN_KEY),
        ]);
        set({ user: null, isAuthenticated: false });
    },
}));