import type { ReactNode } from 'react';

export interface ColumnDef<T> {
  id: string;
  header: string | ReactNode;
  accessorKey?: keyof T;
  accessorFn?: (row: T) => unknown;
  cell?: (props: { row: T; value: unknown }) => ReactNode;
  enableSorting?: boolean;
  enableFiltering?: boolean;
  filterType?: 'text' | 'select' | 'date' | 'dateRange' | 'boolean';
  filterOptions?: { label: string; value: string }[];
  minWidth?: number;
  maxWidth?: number;
  className?: string;
  headerClassName?: string;
  hidden?: boolean;
}

export interface SortingState {
  id: string;
  desc: boolean;
}

export interface FilterState {
  id: string;
  value: unknown;
}

export interface PaginationState {
  pageIndex: number;
  pageSize: number;
}

export interface TableState {
  sorting: SortingState[];
  filters: FilterState[];
  pagination: PaginationState;
  globalFilter: string;
}

export interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  isLoading?: boolean;
  error?: string | null;
  totalElements?: number;
  totalPages?: number;
  pageSize?: number;
  currentPage?: number;
  hasNextPage?: boolean;
  hasPreviousPage?: boolean;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  onSortChange?: (sort: SortingState[]) => void;
  onFilterChange?: (filters: FilterState[]) => void;
  onGlobalFilterChange?: (value: string) => void;
  onRefresh?: () => void;
  onCreate?: ReactNode;
  onRowClick?: (row: T) => void;
  rowKey: keyof T | ((row: T) => string);
  emptyMessage?: string;
  emptyIcon?: ReactNode;
  searchPlaceholder?: string;
  showSearch?: boolean;
  showPagination?: boolean;
  showPageSizeSelector?: boolean;
  pageSizeOptions?: number[];
  actions?: (row: T) => ReactNode;
  bulkActions?: ReactNode;
  selectedRows?: T[];
  onSelectedRowsChange?: (rows: T[]) => void;
  enableRowSelection?: boolean;
  stickyHeader?: boolean;
  className?: string;
}

export function buildQueryParams(state: Partial<TableState>): Record<string, string> {
  const params: Record<string, string> = {};

  if (state.sorting && state.sorting.length > 0) {
    params.sort = state.sorting
      .map((s) => `${s.id},${s.desc ? 'desc' : 'asc'}`)
      .join(';');
  }

  if (state.filters) {
    state.filters.forEach((f) => {
      if (f.value !== undefined && f.value !== null && f.value !== '') {
        params[f.id] = String(f.value);
      }
    });
  }

  if (state.pagination) {
    params.page = String(state.pagination.pageIndex);
    params.size = String(state.pagination.pageSize);
  }

  if (state.globalFilter) {
    params.search = state.globalFilter;
  }

  return params;
}

export function parseQueryParams(
  searchParams: URLSearchParams
): Partial<TableState> {
  const state: Partial<TableState> = {};

  const sort = searchParams.get('sort');
  if (sort) {
    state.sorting = sort.split(';').map((s) => {
      const [id, dir] = s.split(',');
      return { id, desc: dir === 'desc' };
    });
  }

  const page = searchParams.get('page');
  const size = searchParams.get('size');
  if (page || size) {
    state.pagination = {
      pageIndex: page ? parseInt(page, 10) : 0,
      pageSize: size ? parseInt(size, 10) : 10,
    };
  }

  const search = searchParams.get('search');
  if (search) {
    state.globalFilter = search;
  }

  return state;
}
