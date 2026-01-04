import client from './client';
import { Attendance, PaginatedResponse, AttendanceHistoryQuery } from '../types';

export const attendanceApi = {
    getTodayAttendance: async (): Promise<Attendance | null> => {
        // Get user's timezone (e.g., 'Asia/Jakarta', 'America/New_York')
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const response = await client.get<Attendance | null>(`/attendance/today?timezone=${encodeURIComponent(timezone)}`);
        return response.data;
    },

    getAttendanceHistory: async (query: AttendanceHistoryQuery): Promise<PaginatedResponse<Attendance>> => {
        const params = new URLSearchParams();
        if (query.page) params.append('page', query.page.toString());
        if (query.limit) params.append('limit', query.limit.toString());
        if (query.startDate) params.append('startDate', query.startDate);
        if (query.endDate) params.append('endDate', query.endDate);

        const response = await client.get<PaginatedResponse<Attendance>>(`/attendance/history?${params.toString()}`);
        return response.data;
    },

    clockIn: async (photo: File, notes?: string): Promise<Attendance> => {
        const formData = new FormData();
        formData.append('photo', photo);
        if (notes) formData.append('notes', notes);

        const response = await client.post<Attendance>('/attendance/clock-in', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    },

    clockOut: async (photo: File, notes?: string): Promise<Attendance> => {
        const formData = new FormData();
        formData.append('photo', photo);
        if (notes) formData.append('notes', notes);

        const response = await client.post<Attendance>('/attendance/clock-out', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    },
};
