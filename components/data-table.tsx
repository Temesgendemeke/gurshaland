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
} from "lucide-react";
import { Checkbox } from "./ui/checkbox";
import { useRouter } from "next/navigation";
import TableSkeleton from "./skeleton/TableSkeleton";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  onDeleteSelected?: (rows: TData[]) => void;
  loading: Boolean;
}

export function DataTable<TData, TValue>({
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
  const [isMobile, setIsMobile] = React.useState(false);

  // Responsive breakpoint detection
  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const table = useReactTable({
    data,
    columns: [
      // Responsive selection column
      {
        id: "select",
        size: isMobile ? 40 : 60,
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

  const LINK_ICON_COLUMN_ID = "title";
  const selectedRows = table.getSelectedRowModel().rows.map((r) => r.original);
  const handleDelete = () => {
    if (onDeleteSelected) onDeleteSelected(selectedRows as TData[]);
    setRowSelection({});
  };

  if (loading)
    return (
      <div className="mt-4">
        <TableSkeleton />
      </div>
    );

  return (
    <div className="space-y-4 max-w-full overflow-hidden">
      {/* Responsive Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 px-4 sm:px-0">
        {selectedRows.length > 0 && (
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDelete}
            className="gap-2 w-full sm:w-auto"
          >
            <Trash2 className="h-4 w-4" />
            <span className="hidden sm:inline">
              Delete ({selectedRows.length})
            </span>
            <span className="sm:hidden">Delete {selectedRows.length}</span>
          </Button>
        )}
        <div className="text-xs text-muted-foreground w-full sm:w-auto text-center sm:text-left">
          {table.getFilteredSelectedRowModel().rows.length > 0
            ? `${table.getFilteredSelectedRowModel().rows.length} of ${
                table.getFilteredRowModel().rows.length
              } row(s) selected.`
            : `${table.getFilteredRowModel().rows.length} total rows`}
        </div>
      </div>

      {/* Responsive Table Container */}
      <div className="rounded-xl border bg-card/50 backdrop-blur shadow-sm overflow-hidden">
        {/* Mobile Scroll Indicator */}
        {isMobile && (
          <div className="p-3 text-center text-xs text-muted-foreground bg-muted/20 border-b">
            <div className="flex items-center justify-center gap-2">
              <span>← Swipe to see more columns →</span>
            </div>
          </div>
        )}

        <div className="max-h-[600px] sm:max-h-[820px] max-w-[28.5rem] sm:max-w-[100%] overflow-y-auto overflow-x-auto">
          <div className="overflow-x-auto max-w-full w-full">
            <Table
              className={`w-full text-sm ${
                isMobile ? "min-w-[600px]" : "min-w-[800px]"
              }`}
            >
              <TableHeader className="sticky top-0 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/70 z-10">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow
                    key={headerGroup.id}
                    className="hover:bg-transparent"
                  >
                    {headerGroup.headers.map((header) => (
                      <TableHead
                        key={header.id}
                        className="truncate cursor-pointer align-middle font-medium bg-card/95 backdrop-blur-sm"
                        style={{
                          padding: isMobile ? "12px 8px" : "16px",
                          fontSize: isMobile ? "11px" : "14px",
                        }}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody className="bg-card/50">
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                      className="group transition-colors hover:bg-muted/40"
                      style={{
                        backgroundColor: row.getIsSelected()
                          ? "rgb(16 185 129 / 0.1)"
                          : "transparent",
                      }}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell
                          key={cell.id}
                          className="truncate align-middle"
                          style={{
                            padding: isMobile ? "12px 8px" : "16px",
                            fontSize: isMobile ? "11px" : "14px",
                          }}
                        >
                          <div
                            className={`flex items-center gap-1 cursor-pointer ${
                              (cell.column.id === "title" ||
                                cell.column.id === "username") &&
                              "font-medium sm:font-bold"
                            }`}
                          >
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                            {(cell.column.id === "title" ||
                              cell.column.id === "username") && (
                              <ArrowUpRight className="h-4 w-4 opacity-0 group-hover:opacity-70 transition" />
                            )}
                          </div>
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length + 1}
                      className="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
        <div className="flex items-center justify-end gap-4 px-5 py-3 border-t text-xs text-muted-foreground">
          Showing {table.getRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} rows
        </div>
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}

interface DataTablePaginationProps<TData> {
  table: TanstackTable<TData>;
}

function DataTablePagination<TData>({
  table,
}: DataTablePaginationProps<TData>) {
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-4 sm:px-2">
      <div className="flex-1 text-sm text-muted-foreground text-center sm:text-left">
        {table.getFilteredSelectedRowModel().rows.length} of{" "}
        {table.getFilteredRowModel().rows.length} row(s) selected.
      </div>
      <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 sm:space-x-6 lg:space-x-8 w-full sm:w-auto">
        <div className="flex items-center space-x-2 w-full sm:w-auto justify-center sm:justify-start">
          <p className="text-sm font-medium hidden sm:block">Rows per page</p>
          <p className="text-sm font-medium sm:hidden">Per page</p>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value));
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex w-full sm:w-[100px] items-center justify-center text-sm font-medium">
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </div>
        <div className="flex items-center space-x-2 w-full sm:w-auto justify-center sm:justify-start">
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to first page</span>
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to last page</span>
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
