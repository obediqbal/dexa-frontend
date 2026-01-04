import client from './client';
import { LoginCredentials, LoginResponse } from '../types';

export const authApi = {
    login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
        const response = await client.post<LoginResponse>('/auth/login', credentials);
        return response.data;
    },

    logout: async (): Promise<void> => {
        localStorage.removeItem('user');
    },
};
