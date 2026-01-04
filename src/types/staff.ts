export interface Staff {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone?: string;
    department?: string;
    position?: string;
    hireDate?: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export type UploadStatus = 'PENDING' | 'COMPLETED' | 'FAILED';

export interface Attendance {
    id: string;
    staffId: string;
    clockIn: string;
    clockOut: string | null;
    clockInPhotoUrl: string | null;
    clockInUploadStatus: UploadStatus;
    clockOutPhotoUrl: string | null;
    clockOutUploadStatus: UploadStatus | null;
    notes: string | null;
    createdAt: string;
}

export interface PaginatedResponse<T> {
    data: T[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

export interface AttendanceHistoryQuery {
    page?: number;
    limit?: number;
    startDate?: string;
    endDate?: string;
}
