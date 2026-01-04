import client from './client';
import { StaffAttendance, StaffAttendanceQuery, PaginatedResponse } from '../types/staff';

export const staffAttendanceApi = {
    getAllStaffAttendance: async (params: StaffAttendanceQuery) => {
        const response = await client.get<PaginatedResponse<StaffAttendance>>('/admin/staff-attendance', { params });
        return response.data;
    },
};
