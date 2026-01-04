import {
    useReactTable,
    getCoreRowModel,
    flexRender,
    ColumnDef,
    SortingState,
    ColumnFiltersState,
} from '@tanstack/react-table';
import { ChevronUpIcon, ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import './DataTable.css';

interface DataTableProps<T> {
    data: T[];
    columns: ColumnDef<T, any>[];
    pageCount: number;
    pagination: {
        pageIndex: number;
        pageSize: number;
    };
    sorting: SortingState;
    columnFilters?: ColumnFiltersState;
    onPaginationChange: (pagination: { pageIndex: number; pageSize: number }) => void;
    onSortingChange: (sorting: SortingState) => void;
    onColumnFiltersChange?: (filters: ColumnFiltersState) => void;
    isLoading: boolean;
}

export function DataTable<T>({
    data,
    columns,
    pageCount,
    pagination,
    sorting,
    columnFilters,
    onPaginationChange,
    onSortingChange,
    onColumnFiltersChange,
    isLoading,
}: DataTableProps<T>) {
    const table = useReactTable({
        data,
        columns,
        pageCount,
        state: {
            pagination,
            sorting,
            columnFilters: columnFilters || [],
        },
        onPaginationChange: (updater) => {
            if (typeof updater === 'function') {
                onPaginationChange(updater(pagination));
            } else {
                onPaginationChange(updater);
            }
        },
        onSortingChange: (updater) => {
            if (typeof updater === 'function') {
                onSortingChange(updater(sorting));
            } else {
                onSortingChange(updater);
            }
        },
        onColumnFiltersChange: (updater) => {
            if (onColumnFiltersChange) {
                if (typeof updater === 'function') {
                    onColumnFiltersChange(updater(columnFilters || []));
                } else {
                    onColumnFiltersChange(updater);
                }
            }
        },
        getCoreRowModel: getCoreRowModel(),
        manualPagination: true,
        manualSorting: true,
        manualFiltering: true,
    });

    return (
        <div className="table-container">
            <div className="table-wrapper">
                <table className="data-table">
                    <thead>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <th
                                        key={header.id}
                                        colSpan={header.colSpan}
                                    >
                                        <div
                                            className={`th-content ${header.column.getCanSort() ? 'sortable' : ''}`}
                                            onClick={header.column.getToggleSortingHandler()}
                                        >
                                            {flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                            {{
                                                asc: <ChevronUpIcon className="sort-icon" />,
                                                desc: <ChevronDownIcon className="sort-icon" />,
                                            }[header.column.getIsSorted() as string] ?? null}
                                        </div>
                                        {header.column.getCanFilter() ? (
                                            <div className="th-filter">
                                                <input
                                                    type="text"
                                                    value={(header.column.getFilterValue() ?? '') as string}
                                                    onChange={e => header.column.setFilterValue(e.target.value)}
                                                    placeholder={`Search...`}
                                                    className="filter-input"
                                                    onClick={e => e.stopPropagation()}
                                                />
                                            </div>
                                        ) : null}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr>
                                <td colSpan={columns.length} className="loading-cell">
                                    <div className="spinner"></div>
                                </td>
                            </tr>
                        ) : data.length === 0 ? (
                            <tr>
                                <td colSpan={columns.length} className="empty-cell">
                                    No data found
                                </td>
                            </tr>
                        ) : (
                            table.getRowModel().rows.map((row) => (
                                <tr key={row.id}>
                                    {row.getVisibleCells().map((cell) => (
                                        <td key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <div className="table-pagination">
                <div className="pagination-info">
                    Page {table.getState().pagination.pageIndex + 1} of {Math.max(1, pageCount)}
                </div>
                <div className="pagination-controls">
                    <button
                        className="page-btn"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        <ChevronLeftIcon />
                    </button>
                    <button
                        className="page-btn"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        <ChevronRightIcon />
                    </button>
                </div>
            </div>
        </div>
    );
}
