"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  RefreshCw,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Filter,
  X,
  FileX2,
} from "lucide-react";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Loader } from "@/components/ui/loader";

import type { DataTableProps, ColumnDef, SortingState } from "./types";

export function DataTable<T>({
  data,
  columns,
  isLoading = false,
  error = null,
  totalElements = 0,
  totalPages = 1,
  pageSize: initialPageSize = 10,
  currentPage: initialPage = 0,
  hasNextPage = false,
  hasPreviousPage = false,
  onPageChange,
  onPageSizeChange,
  onSortChange,
  onFilterChange,
  onRefresh,
  onCreate,
  onRowClick,
  rowKey,
  emptyMessage = "Không có dữ liệu",
  emptyIcon,
  searchPlaceholder = "Tìm kiếm...",
  showPagination = true,
  showPageSizeSelector = true,
  pageSizeOptions = [10, 20, 50, 100],
  actions,
  bulkActions,
  selectedRows = [],
  onSelectedRowsChange,
  enableRowSelection = false,
  stickyHeader = false,
  className,
  syncWithUrl = true,
}: DataTableProps<T> & { syncWithUrl?: boolean }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [sorting, setSorting] = useState<SortingState[]>(() => {
    if (!syncWithUrl) return [];
    const sort = searchParams.get("sort");
    if (sort) {
      const [id, dir] = sort.split(",");
      return [{ id, desc: dir === "desc" }];
    }
    return [];
  });

  const [columnFilters, setColumnFilters] = useState<Record<string, string>>(() => {
    if (!syncWithUrl) return {};
    const filters: Record<string, string> = {};
    columns.forEach((col) => {
      if (col.enableFiltering !== false) {
        const value = searchParams.get(col.id);
        if (value) filters[col.id] = value;
      }
    });
    return filters;
  });

  const pageSize = syncWithUrl
    ? parseInt(searchParams.get("size") || String(initialPageSize), 10)
    : initialPageSize;

  const currentPage = syncWithUrl
    ? parseInt(searchParams.get("page") || String(initialPage), 10)
    : initialPage;

  const visibleColumns = useMemo(
    () => columns.filter((col) => !col.hidden),
    [columns]
  );

  const getRowKey = useCallback(
    (row: T): string => {
      if (typeof rowKey === "function") {
        return rowKey(row);
      }
      return String(row[rowKey]);
    },
    [rowKey]
  );

  const getCellValue = useCallback((row: T, column: ColumnDef<T>): unknown => {
    if (column.accessorFn) {
      return column.accessorFn(row);
    }
    if (column.accessorKey) {
      return row[column.accessorKey];
    }
    return null;
  }, []);

  const updateUrl = useCallback(
    (updates: Record<string, string | null>) => {
      if (!syncWithUrl) return;
      
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === "" || value === "all") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      });
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams, syncWithUrl]
  );

  const handleSort = useCallback(
    (columnId: string) => {
      const existing = sorting.find((s) => s.id === columnId);
      let newSorting: SortingState[];

      if (!existing) {
        newSorting = [{ id: columnId, desc: false }];
      } else if (!existing.desc) {
        newSorting = [{ id: columnId, desc: true }];
      } else {
        newSorting = [];
      }

      setSorting(newSorting);
      
      if (newSorting.length > 0) {
        updateUrl({ sort: `${newSorting[0].id},${newSorting[0].desc ? "desc" : "asc"}` });
      } else {
        updateUrl({ sort: null });
      }
      
      onSortChange?.(newSorting);
    },
    [sorting, onSortChange, updateUrl]
  );

  const handleColumnFilter = useCallback(
    (columnId: string, value: string) => {
      const newFilters = { ...columnFilters };
      if (value === "" || value === "all") {
        delete newFilters[columnId];
      } else {
        newFilters[columnId] = value;
      }
      setColumnFilters(newFilters);
      updateUrl({ [columnId]: value || null, page: "0" });
      onFilterChange?.(
        Object.entries(newFilters).map(([id, val]) => ({ id, value: val }))
      );
    },
    [columnFilters, onFilterChange, updateUrl]
  );

  const clearFilters = useCallback(() => {
    setColumnFilters({});
    const updates: Record<string, null> = { page: null };
    columns.forEach((col) => {
      updates[col.id] = null;
    });
    updateUrl(updates);
    onFilterChange?.([]);
  }, [columns, onFilterChange, updateUrl]);

  const handlePageChange = useCallback(
    (page: number) => {
      updateUrl({ page: String(page) });
      onPageChange?.(page);
    },
    [onPageChange, updateUrl]
  );

  const handlePageSizeChange = useCallback(
    (size: number) => {
      updateUrl({ size: String(size), page: "0" });
      onPageSizeChange?.(size);
    },
    [onPageSizeChange, updateUrl]
  );

  const isRowSelected = useCallback(
    (row: T) => selectedRows.some((r) => getRowKey(r) === getRowKey(row)),
    [selectedRows, getRowKey]
  );

  const toggleRowSelection = useCallback(
    (row: T) => {
      const key = getRowKey(row);
      const isSelected = selectedRows.some((r) => getRowKey(r) === key);
      const newSelected = isSelected
        ? selectedRows.filter((r) => getRowKey(r) !== key)
        : [...selectedRows, row];
      onSelectedRowsChange?.(newSelected);
    },
    [selectedRows, getRowKey, onSelectedRowsChange]
  );

  const toggleAllRows = useCallback(() => {
    if (selectedRows.length === data.length) {
      onSelectedRowsChange?.([]);
    } else {
      onSelectedRowsChange?.(data);
    }
  }, [selectedRows, data, onSelectedRowsChange]);

  const getSortIcon = (columnId: string) => {
    const sort = sorting.find((s) => s.id === columnId);
    if (!sort) return <ArrowUpDown className="size-4 opacity-50" />;
    return sort.desc ? (
      <ArrowDown className="size-4" />
    ) : (
      <ArrowUp className="size-4" />
    );
  };

  const hasActiveFilters = Object.keys(columnFilters).length > 0;
  const activeFilterCount = Object.keys(columnFilters).length;

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 shrink-0">
          {onCreate}
          {onRefresh && (
            <Button
              variant="outline"
              size="icon"
              onClick={onRefresh}
              disabled={isLoading}
            >
              <RefreshCw className={cn("size-4", isLoading && "animate-spin")} />
            </Button>
          )}
          {bulkActions && selectedRows.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Đã chọn {selectedRows.length}
              </span>
              {bulkActions}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 overflow-x-auto">
          {hasActiveFilters && (
            <Button variant="outline" size="sm" onClick={clearFilters} className="shrink-0">
              <X className="mr-1 size-4" />
              Xóa bộ lọc ({activeFilterCount})
            </Button>
          )}
        </div>
      </div>

      <div className="rounded-md border overflow-hidden">
        <div className={cn("overflow-auto", stickyHeader && "max-h-[600px]")}>
          <Table className="[&_th]:border-r [&_th:last-child]:border-r-0 [&_td]:border-r [&_td:last-child]:border-r-0">
            <TableHeader className={cn(stickyHeader && "sticky top-0 bg-background z-10")}>
              <TableRow>
                {enableRowSelection && (
                  <TableHead className="w-12">
                    <Checkbox
                      checked={
                        data.length > 0 && selectedRows.length === data.length
                      }
                      onCheckedChange={toggleAllRows}
                    />
                  </TableHead>
                )}
                {visibleColumns.map((column) => (
                  <TableHead
                    key={column.id}
                    className={cn(column.headerClassName)}
                    style={{
                      minWidth: column.minWidth,
                      maxWidth: column.maxWidth,
                    }}
                  >
                    <div className="flex items-center gap-1">
                      <div
                        className={cn(
                          "flex items-center gap-1 flex-1",
                          column.enableSorting !== false && "cursor-pointer select-none"
                        )}
                        onClick={() =>
                          column.enableSorting !== false && handleSort(column.id)
                        }
                      >
                        <span>{column.header}</span>
                        {column.enableSorting !== false && getSortIcon(column.id)}
                      </div>

                      {column.enableFiltering !== false && (
                        <ColumnFilter
                          column={column}
                          value={columnFilters[column.id] || ""}
                          onChange={(value) => handleColumnFilter(column.id, value)}
                        />
                      )}
                    </div>
                  </TableHead>
                ))}
                {actions && <TableHead className="w-12 text-right">Hành động</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={
                      visibleColumns.length +
                      (enableRowSelection ? 1 : 0) +
                      (actions ? 1 : 0)
                    }
                    className="h-48"
                  >
                    <Loader text="Đang tải..." />
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell
                    colSpan={
                      visibleColumns.length +
                      (enableRowSelection ? 1 : 0) +
                      (actions ? 1 : 0)
                    }
                    className="h-48"
                  >
                    <div className="flex flex-col items-center justify-center gap-2 text-destructive">
                      <p>{error}</p>
                      {onRefresh && (
                        <Button variant="outline" size="sm" onClick={onRefresh}>
                          Thử lại
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ) : data.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={
                      visibleColumns.length +
                      (enableRowSelection ? 1 : 0) +
                      (actions ? 1 : 0)
                    }
                    className="h-48"
                  >
                    <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                      {emptyIcon || <FileX2 className="size-12" />}
                      <p>{emptyMessage}</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                data.map((row) => (
                  <TableRow
                    key={getRowKey(row)}
                    className={cn(
                      "group",
                      onRowClick && "cursor-pointer hover:bg-muted/50",
                      isRowSelected(row) && "bg-primary/5"
                    )}
                    onClick={() => onRowClick?.(row)}
                  >
                    {enableRowSelection && (
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <Checkbox
                          checked={isRowSelected(row)}
                          onCheckedChange={() => toggleRowSelection(row)}
                        />
                      </TableCell>
                    )}
                    {visibleColumns.map((column) => {
                      const value = getCellValue(row, column);
                      return (
                        <TableCell
                          key={column.id}
                          className={column.className}
                          style={{
                            minWidth: column.minWidth,
                            maxWidth: column.maxWidth,
                          }}
                        >
                          {column.cell
                            ? column.cell({ row, value })
                            : String(value ?? "")}
                        </TableCell>
                      );
                    })}
                    {actions && (
                      <TableCell
                        className="text-right"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {actions(row)}
                      </TableCell>
                    )}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {showPagination && (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {totalElements > 0 && (
              <span>
                Hiển thị {data.length} / {totalElements} kết quả
              </span>
            )}
          </div>

          <div className="flex items-center gap-4">
            {showPageSizeSelector && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Hiển thị</span>
                <Select
                  value={String(pageSize)}
                  onValueChange={(value) => handlePageSizeChange(Number(value))}
                >
                  <SelectTrigger className="w-[70px] h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {pageSizeOptions.map((size) => (
                      <SelectItem key={size} value={String(size)}>
                        {size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                className="size-8"
                onClick={() => handlePageChange(0)}
                disabled={currentPage === 0 || isLoading}
              >
                <ChevronsLeft className="size-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="size-8"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={!hasPreviousPage || isLoading}
              >
                <ChevronLeft className="size-4" />
              </Button>

              <span className="px-2 text-sm">
                Trang {currentPage + 1} / {Math.max(1, totalPages)}
              </span>

              <Button
                variant="outline"
                size="icon"
                className="size-8"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={!hasNextPage || isLoading}
              >
                <ChevronRight className="size-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="size-8"
                onClick={() => handlePageChange(totalPages - 1)}
                disabled={currentPage >= totalPages - 1 || isLoading}
              >
                <ChevronsRight className="size-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface ColumnFilterProps<T> {
  column: ColumnDef<T>;
  value: string;
  onChange: (value: string) => void;
}

function ColumnFilter<T>({ column, value, onChange }: ColumnFilterProps<T>) {
  const [localValue, setLocalValue] = useState(value);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleApply = () => {
    onChange(localValue);
    setOpen(false);
  };

  const handleClear = () => {
    setLocalValue("");
    onChange("");
    setOpen(false);
  };

  const hasFilter = value !== "";

  if (column.filterType === "select" && column.filterOptions) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className={cn("size-6", hasFilter && "text-primary")}
          >
            <Filter className="size-3" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-52 p-3" align="start">
          <div className="space-y-3">
            <p className="text-sm font-medium">{column.header}</p>
            <Select value={localValue || "all"} onValueChange={setLocalValue}>
              <SelectTrigger className="h-8">
                <SelectValue placeholder="Chọn..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                {column.filterOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={handleClear}
              >
                Xóa
              </Button>
              <Button size="sm" className="flex-1" onClick={handleApply}>
                Áp dụng
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn("size-6", hasFilter && "text-primary")}
        >
          <Filter className="size-3" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-52 p-3" align="start">
        <div className="space-y-3">
          <p className="text-sm font-medium">{column.header}</p>
          <Input
            placeholder="Nhập để lọc..."
            value={localValue}
            onChange={(e) => setLocalValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleApply();
            }}
            className="h-8"
          />
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={handleClear}
            >
              Xóa
            </Button>
            <Button size="sm" className="flex-1" onClick={handleApply}>
              Áp dụng
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
