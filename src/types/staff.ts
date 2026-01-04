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

// Query types matching backend
export const SORTABLE_FIELDS = [
    'email',
    'firstName',
    'lastName',
    'phone',
    'department',
    'position',
    'hireDate',
    'isActive',
    'createdAt',
] as const;

export type SortableField = (typeof SORTABLE_FIELDS)[number];

export type FilterBy = Partial<Record<SortableField, string | boolean | null>>;

export interface StaffQuery {
    page?: number;
    limit?: number;
    ids?: string[];
    sortBy?: SortableField;
    sortOrder?: 'asc' | 'desc';
    filterBy?: string; // JSON string of FilterBy
}

export enum Role {
    STAFF = 'STAFF',
    ADMIN = 'ADMIN',
}

export interface RegisterStaffRequest {
    // Auth fields
    email: string;
    password?: string; // Optional in frontend if auto-generated, but required by backend DTO
    role?: Role;

    // Staff fields
    firstName: string;
    lastName: string;
    phone?: string;
    department?: string;
    position?: string;
    hireDate?: string;
    isActive?: boolean;
}

export interface RegisterStaffResponse {
    staff: {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
    };
    auth: {
        userId: string;
        accessToken: string;
    };
}
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

// Staff Attendance types
export interface StaffAttendance {
    // Attendance fields
    id: string;
    staffId: string;
    clockIn: string;
    clockOut: string | null;
    clockInPhotoUrl: string | null;
    clockOutPhotoUrl: string | null;
    notes: string | null;
    createdAt: string;
    updatedAt: string;

    // Embedded staff data
    staff: {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        phone?: string;
        department?: string;
        position?: string;
        isActive: boolean;
    };
}

export const STAFF_ATTENDANCE_SORTABLE_FIELDS = [
    'firstName',
    'lastName',
    'email',
    'department',
    'position',
    'clockIn',
    'clockOut',
    'createdAt',
] as const;

export type StaffAttendanceSortableField = (typeof STAFF_ATTENDANCE_SORTABLE_FIELDS)[number];

export interface StaffAttendanceQuery {
    page?: number;
    limit?: number;
    sortBy?: StaffAttendanceSortableField;
    sortOrder?: 'asc' | 'desc';

    // Staff filters
    staffIds?: string[];
    firstName?: string;
    lastName?: string;
    email?: string;
    department?: string;
    position?: string;
    isActive?: boolean;

    // Attendance date range filters
    clockInStart?: string;
    clockInEnd?: string;
    clockOutStart?: string;
    clockOutEnd?: string;
}
