import { useState, useEffect, useMemo } from 'react';
import { Navbar, DataTable, CreateStaffModal } from '../components';
import { staffApi } from '../api';
import { Staff, SortableField } from '../types/staff';
import { createColumnHelper, SortingState, ColumnFiltersState } from '@tanstack/react-table';
import { PlusIcon, PencilIcon } from '@heroicons/react/24/solid';
import debounce from 'lodash/debounce';
import './Pages.css';
import './StaffManagement.css';

export function StaffManagement() {
    const [staff, setStaff] = useState<Staff[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);

    // Query State
    const [pageIndex, setPageIndex] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [sorting, setSorting] = useState<SortingState>([{ id: 'createdAt', desc: true }]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

    // Debounce the fetching to avoid too many requests while typing
    const debouncedFetch = useMemo(
        () => debounce(async (page: number, size: number, sort: SortingState, filters: ColumnFiltersState) => {
            setIsLoading(true);
            try {
                // Prepare filters
                const filterBy: Record<string, string | boolean> = {};
                filters.forEach(filter => {
                    const val = filter.value;
                    if (val) {
                        // Handle boolean values for isActive
                        if (filter.id === 'isActive') {
                            if (String(val).toLowerCase() === 'true') filterBy[filter.id] = true;
                            else if (String(val).toLowerCase() === 'false') filterBy[filter.id] = false;
                            else filterBy[filter.id] = String(val);
                        } else {
                            filterBy[filter.id] = String(val);
                        }
                    }
                });

                const result = await staffApi.getAllStaff({
                    page: page + 1,
                    limit: size,
                    sortBy: sort[0]?.id as SortableField,
                    sortOrder: sort[0]?.desc ? 'desc' : 'asc',
                    filterBy: Object.keys(filterBy).length > 0 ? JSON.stringify(filterBy) : undefined,
                });
                setStaff(result.data);
                setTotalPages(result.meta.totalPages);
            } catch (error) {
                console.error('Failed to fetch staff:', error);
            } finally {
                setIsLoading(false);
            }
        }, 500),
        []
    );

    useEffect(() => {
        debouncedFetch(pageIndex, pageSize, sorting, columnFilters);
        // Cleanup debounce on unmount
        // return () => debouncedFetch.cancel();
    }, [pageIndex, pageSize, sorting, columnFilters, debouncedFetch]);

    const handleEditStaff = (staff: Staff) => {
        setSelectedStaff(staff);
        setIsModalOpen(true);
    };

    const columnHelper = createColumnHelper<Staff>();

    const columns = useMemo(() => [
        columnHelper.accessor('firstName', {
            id: 'firstName',
            header: 'Nama Depan',
            cell: info => <span className="font-medium">{info.getValue()}</span>,
            enableColumnFilter: true,
        }),
        columnHelper.accessor('lastName', {
            id: 'lastName',
            header: 'Nama Belakang',
            cell: info => <span className="font-medium">{info.getValue()}</span>,
            enableColumnFilter: true,
        }),
        columnHelper.accessor('email', {
            header: 'Email',
            enableColumnFilter: true,
        }),
        columnHelper.accessor('department', {
            header: 'Departemen',
            cell: info => info.getValue() || '-',
            enableColumnFilter: true,
        }),
        columnHelper.accessor('position', {
            header: 'Posisi',
            cell: info => info.getValue() || '-',
            enableColumnFilter: true,
        }),
        columnHelper.accessor('isActive', {
            header: 'Status',
            cell: info => (
                <span className={`status-badge ${info.getValue() ? 'active' : 'inactive'}`}>
                    {info.getValue() ? 'Active' : 'Inactive'}
                </span>
            ),
            enableColumnFilter: false,
        }),
        columnHelper.accessor('createdAt', {
            header: 'Tanggal Bergabung',
            cell: info => new Date(info.getValue()).toLocaleDateString(),
            enableColumnFilter: false,
        }),
        columnHelper.display({
            id: 'actions',
            header: '',
            cell: info => (
                <button
                    className="edit-btn"
                    onClick={() => handleEditStaff(info.row.original)}
                    title="Edit staff"
                >
                    <PencilIcon className="edit-icon" />
                </button>
            ),
        }),
    ], []);

    return (
        <div className="page-container">
            <Navbar activePage="staff" />

            <main className="main-content">
                <div className="page-header staff-header">
                    <div>
                        <h1>Manajemen Staf</h1>
                        <p>Admin dapat melihat daftar, melakukan penambahan, atau pengubahan terhadap data karyawan pada laman ini</p>
                    </div>
                </div>

                <div className="staff-actions">
                    <button className="add-staff-btn" onClick={() => setIsModalOpen(true)}>
                        <PlusIcon className="btn-icon" />
                        Tambah staf baru
                    </button>
                </div>

                <DataTable
                    data={staff}
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

            <CreateStaffModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedStaff(null);
                }}
                onSuccess={() => debouncedFetch(pageIndex, pageSize, sorting, columnFilters)}
                staff={selectedStaff}
            />
        </div>
    );
}
