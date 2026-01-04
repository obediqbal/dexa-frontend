import client from './client';
import { Staff, StaffQuery, PaginatedResponse, RegisterStaffRequest, RegisterStaffResponse } from '../types/staff';

export const staffApi = {
    getMyProfile: async (): Promise<Staff> => {
        const response = await client.get<Staff>('/staff/me');
        return response.data;
    },

    getAllStaff: async (params: StaffQuery) => {
        const response = await client.get<PaginatedResponse<Staff>>('/admin/staff', { params });
        return response.data;
    },

    registerStaff: async (data: RegisterStaffRequest) => {
        const response = await client.post<RegisterStaffResponse>('/admin/staff/register', data);
        return response.data;
    },
};
