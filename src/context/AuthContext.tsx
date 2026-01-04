import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { User, LoginCredentials } from '../types';
import { authApi } from '../api';

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isAdmin: boolean;
    isLoading: boolean;
    login: (credentials: LoginCredentials) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch {
                localStorage.removeItem('user');
            }
        }
        setIsLoading(false);
    }, []);

    const login = useCallback(async (credentials: LoginCredentials) => {
        const response = await authApi.login(credentials);
        setUser(response.user);
        localStorage.setItem('user', JSON.stringify(response.user));
    }, []);

    const logout = useCallback(() => {
        authApi.logout();
        setUser(null);
    }, []);

    const value: AuthContextType = {
        user,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'ADMIN',
        isLoading,
        login,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
