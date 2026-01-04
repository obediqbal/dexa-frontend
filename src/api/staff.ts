import client from './client';
import { Staff } from '../types';

export const staffApi = {
    getMyProfile: async (): Promise<Staff> => {
        const response = await client.get<Staff>('/staff/me');
        return response.data;
    },
};
