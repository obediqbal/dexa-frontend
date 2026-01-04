import { useState, useEffect, useMemo } from 'react';
import { Navbar, DataTable } from '../components';
import { staffAttendanceApi } from '../api';
import { StaffAttendance as StaffAttendanceRecord, StaffAttendanceSortableField } from '../types/staff';
import { createColumnHelper, SortingState, ColumnFiltersState } from '@tanstack/react-table';
import debounce from 'lodash/debounce';
import './Pages.css';
import './StaffAttendance.css';

export function StaffAttendance() {
    const [attendanceData, setAttendanceData] = useState<StaffAttendanceRecord[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Query State
    const [pageIndex, setPageIndex] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [sorting, setSorting] = useState<SortingState>([{ id: 'clockIn', desc: true }]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

    // Date range filters (default to today)
    const [clockInStart, setClockInStart] = useState<string>(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return today.toISOString().split('T')[0];
    });
    const [clockInEnd, setClockInEnd] = useState<string>(() => {
        const today = new Date();
        today.setHours(23, 59, 59, 999);
        return today.toISOString().split('T')[0];
    });
    const [clockOutStart, setClockOutStart] = useState<string>('');
    const [clockOutEnd, setClockOutEnd] = useState<string>('');

    // Debounce the fetching
    const debouncedFetch = useMemo(
        () => debounce(async (
            page: number,
            size: number,
            sort: SortingState,
            filters: ColumnFiltersState,
            dateFilters: {
                clockInStart: string;
                clockInEnd: string;
                clockOutStart: string;
                clockOutEnd: string;
            }
        ) => {
            setIsLoading(true);
            try {
                // Build query params
                const queryParams: Record<string, any> = {
                    page: page + 1,
                    limit: size,
                    sortBy: sort[0]?.id as StaffAttendanceSortableField || 'clockIn',
                    sortOrder: sort[0]?.desc ? 'desc' : 'asc',
                };

                // Add column filters
                filters.forEach(filter => {
                    if (filter.value) {
                        queryParams[filter.id] = String(filter.value);
                    }
                });

                // Add date range filters - convert local dates to UTC
                if (dateFilters.clockInStart) {
                    const startDate = new Date(dateFilters.clockInStart + 'T00:00:00');
                    queryParams.clockInStart = startDate.toISOString();
                }
                if (dateFilters.clockInEnd) {
                    const endDate = new Date(dateFilters.clockInEnd + 'T23:59:59.999');
                    queryParams.clockInEnd = endDate.toISOString();
                }
                if (dateFilters.clockOutStart) {
                    const startDate = new Date(dateFilters.clockOutStart + 'T00:00:00');
                    queryParams.clockOutStart = startDate.toISOString();
                }
                if (dateFilters.clockOutEnd) {
                    const endDate = new Date(dateFilters.clockOutEnd + 'T23:59:59.999');
                    queryParams.clockOutEnd = endDate.toISOString();
                }

                const result = await staffAttendanceApi.getAllStaffAttendance(queryParams);
                setAttendanceData(result.data);
                setTotalPages(result.meta.totalPages);
            } catch (error) {
                console.error('Failed to fetch staff attendance:', error);
            } finally {
                setIsLoading(false);
            }
        }, 500),
        []
    );

    useEffect(() => {
        debouncedFetch(
            pageIndex,
            pageSize,
            sorting,
            columnFilters,
            { clockInStart, clockInEnd, clockOutStart, clockOutEnd }
        );
    }, [pageIndex, pageSize, sorting, columnFilters, clockInStart, clockInEnd, clockOutStart, clockOutEnd, debouncedFetch]);

    const columnHelper = createColumnHelper<StaffAttendanceRecord>();

    const columns = useMemo(() => [
        columnHelper.accessor('staff.firstName', {
            id: 'firstName',
            header: 'Nama Depan',
            cell: info => <span className="font-medium">{info.getValue()}</span>,
            enableColumnFilter: true,
        }),
        columnHelper.accessor('staff.lastName', {
            id: 'lastName',
            header: 'Nama Belakang',
            cell: info => <span className="font-medium">{info.getValue()}</span>,
            enableColumnFilter: true,
        }),
        columnHelper.accessor('staff.email', {
            id: 'email',
            header: 'Email',
            enableColumnFilter: true,
        }),
        columnHelper.accessor('staff.department', {
            id: 'department',
            header: 'Departemen',
            cell: info => info.getValue() || '-',
            enableColumnFilter: true,
        }),
        columnHelper.accessor('staff.position', {
            id: 'position',
            header: 'Posisi',
            cell: info => info.getValue() || '-',
            enableColumnFilter: true,
        }),
        columnHelper.accessor('clockIn', {
            header: 'Clock In',
            cell: info => new Date(info.getValue()).toLocaleString('id-ID'),
            enableColumnFilter: false,
        }),
        columnHelper.accessor('clockOut', {
            header: 'Clock Out',
            cell: info => {
                const value = info.getValue();
                return value ? new Date(value).toLocaleString('id-ID') : '-';
            },
            enableColumnFilter: false,
        }),
        columnHelper.accessor('staff.isActive', {
            id: 'isActive',
            header: 'Status',
            cell: info => (
                <span className={`status-badge ${info.getValue() ? 'active' : 'inactive'}`}>
                    {info.getValue() ? 'Active' : 'Inactive'}
                </span>
            ),
            enableColumnFilter: false,
        }),
    ], []);

    return (
        <div className="page-container">
            <Navbar activePage="attendance" />

            <main className="main-content">
                <div className="page-header">
                    <div>
                        <h1>Presensi Staf</h1>
                        <p>Lihat dan kelola semua catatan presensi staf</p>
                    </div>
                </div>

                <div className="date-filters-card">
                    <div className="date-filters-grid">
                        <div className="date-filter-group">
                            <label>Clock In - Mulai</label>
                            <input
                                type="date"
                                value={clockInStart}
                                onChange={(e) => setClockInStart(e.target.value)}
                                className="date-input"
                            />
                        </div>
                        <div className="date-filter-group">
                            <label>Clock In - Selesai</label>
                            <input
                                type="date"
                                value={clockInEnd}
                                onChange={(e) => setClockInEnd(e.target.value)}
                                className="date-input"
                            />
                        </div>
                        <div className="date-filter-group">
                            <label>Clock Out - Mulai</label>
                            <input
                                type="date"
                                value={clockOutStart}
                                onChange={(e) => setClockOutStart(e.target.value)}
                                className="date-input"
                            />
                        </div>
                        <div className="date-filter-group">
                            <label>Clock Out - Selesai</label>
                            <input
                                type="date"
                                value={clockOutEnd}
                                onChange={(e) => setClockOutEnd(e.target.value)}
                                className="date-input"
                            />
                        </div>
                    </div>
                </div>

                <DataTable
                    data={attendanceData}
                    columns={columns}
                    pageCount={totalPages}
                    pagination={{ pageIndex, pageSize }}
                    sorting={sorting}
                    columnFilters={columnFilters}
                    onPaginationChange={({ pageIndex, pageSize }) => {
                        setPageIndex(pageIndex);
                        setPageSize(pageSize);
                    }}
                    onSortingChange={setSorting}
                    onColumnFiltersChange={setColumnFilters}
                    isLoading={isLoading}
                />
            </main>
        </div>
    );
}
