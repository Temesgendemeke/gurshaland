"use client";

import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  Table as TanstackTable,
  PaginationState,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Trash2,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Inbox,
} from "lucide-react";
import { Checkbox } from "./ui/checkbox";
import TableSkeleton from "./skeleton/TableSkeleton";

interface DataTableRow {
  id?: string;
  slug?: string;
}

interface DataTableProps<TData extends DataTableRow, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  onDeleteSelected?: (rows: TData[]) => void;
  loading: boolean;
}

export function DataTable<TData extends DataTableRow, TValue>({
  columns,
  data,
  onDeleteSelected,
  loading,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns: [
      // Selection column
      {
        id: "select",
        size: 44,
        enableSorting: false,
        enableHiding: false,
        header: ({ table }) => (
          <Checkbox
            aria-label="Select all on page"
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(v) => table.toggleAllPageRowsSelected(!!v)}
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            aria-label="Select row"
            checked={row.getIsSelected()}
            onCheckedChange={(v) => row.toggleSelected(!!v)}
          />
        ),
      },
      // Spread the rest of the columns passed in as props
      ...columns,
    ],
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onPaginationChange: setPagination,

    state: { sorting, pagination, rowSelection },
    getRowId: (row: any, index) => row.id ?? index.toString(),
  });

  const selectedRows = table.getSelectedRowModel().rows.map((r) => r.original);
  const totalRows = table.getFilteredRowModel().rows.length;

  const handleDelete = (rows: TData[]) => {
    if (onDeleteSelected) onDeleteSelected(rows);
    setRowSelection({});
  };

  if (loading) return <TableSkeleton />;

  return (
    <div className="space-y-3">
      {selectedRows.length > 0 && (
        <div className="flex items-center justify-between gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDelete(selectedRows)}
            className="gap-2 border-error/30 bg-error/5 text-error hover:bg-error/10 hover:text-error"
          >
            <Trash2 className="h-4 w-4" />
            Delete selected ({selectedRows.length})
          </Button>
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-border/80 bg-card">
        <div className="max-w-full overflow-x-auto">
          <Table className="min-w-[44rem]">
            <TableHeader className="sticky top-0 z-10 border-b border-border/80 bg-card/95 backdrop-blur">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="hover:bg-transparent">
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} className="align-middle">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className="group"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className="truncate align-middle"
                      >
                        <div
                          className={`flex items-center gap-1 ${
                            (cell.column.id === "title" ||
                              cell.column.id === "username") &&
                            "font-medium"
                          }`}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                          {(cell.column.id === "title" ||
                            cell.column.id === "username") && (
                            <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-70" />
                          )}
                        </div>
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow className="hover:bg-transparent">
                  <TableCell
                    colSpan={columns.length + 1}
                    className="h-40 text-center"
                  >
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      <Inbox className="h-6 w-6 opacity-50" strokeWidth={1.5} />
                      <span className="text-sm">No results yet.</span>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <DataTablePagination
          table={table}
          totalRows={totalRows}
          selectedCount={selectedRows.length}
        />
      </div>
    </div>
  );
}

interface DataTablePaginationProps<TData> {
  table: TanstackTable<TData>;
  totalRows: number;
  selectedCount: number;
}

function DataTablePagination<TData>({
  table,
  totalRows,
  selectedCount,
}: DataTablePaginationProps<TData>) {
  const pageCount = table.getPageCount();

  if (pageCount === 0) return null;

  const { pageIndex, pageSize } = table.getState().pagination;
  const from = totalRows === 0 ? 0 : pageIndex * pageSize + 1;
  const to = Math.min(totalRows, (pageIndex + 1) * pageSize);

  return (
    <div className="flex flex-col gap-3 border-t border-border/80 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-xs tabular-nums text-muted-foreground">
        {selectedCount > 0 ? (
          <>
            {selectedCount} of {totalRows} selected
          </>
        ) : (
          <>
            {totalRows} {totalRows === 1 ? "result" : "results"}
          </>
        )}
      </p>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="hidden text-xs text-muted-foreground sm:inline">
            Rows
          </span>
          <Select
            value={`${pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value));
            }}
          >
            <SelectTrigger className="h-8 w-[4.375rem]">
              <SelectValue placeholder={pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 30, 40, 50].map((size) => (
                <SelectItem key={size} value={`${size}`}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <span className="text-xs tabular-nums text-muted-foreground">
          {from}–{to} of {totalRows}
        </span>

        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:inline-flex"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
            aria-label="Go to first page"
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            aria-label="Go to previous page"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            aria-label="Go to next page"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:inline-flex"
            onClick={() => table.setPageIndex(pageCount - 1)}
            disabled={!table.getCanNextPage()}
            aria-label="Go to last page"
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
