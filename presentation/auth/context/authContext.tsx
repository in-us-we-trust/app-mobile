import { createContext, useState, ReactNode } from 'react';

interface User {
    id: string;
    email: string;
    name: string;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string) => Promise<void>;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const login = async (email: string, password: string) => {
        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        setUser({ id: '1', email, name: 'Usuario' });
        setIsLoading(false);
    };

    const register = async (name: string, email: string, password: string) => {
        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        setUser({ id: '1', email, name });
        setIsLoading(false);
    };

    const logout = () => setUser(null);

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
}