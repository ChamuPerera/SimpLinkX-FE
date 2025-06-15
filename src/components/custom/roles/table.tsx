import type { Role } from "@/services/roles";
import type {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
} from "@tanstack/react-table";

import { Pagination } from "@/components/custom";
import {
  Button,
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
  Input,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { useState } from "react";

interface RoleTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  search: string;
  setSearch: (search: string) => void;
  setOpen: (open: boolean) => void;
  setShowDetails: (show: boolean) => void;
  setSelectedRole: (role: Role) => void;
  setPagination: ({
    currentPage,
    pageSize,
  }: {
    currentPage: number;
    pageSize: number;
  }) => void;
  pagination: {
    currentPage: number;
    pageSize: number;
    from: number;
    to: number;
    total: number;
    endPage: number;
  };
  children?: React.ReactNode;
}

export function RoleTable<TData, TValue>({
  columns,
  data,
  search,
  setSearch,
  setOpen,
  setSelectedRole,
  setShowDetails,
  setPagination,
  pagination,
  children,
}: RoleTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
    meta: {
      setOpen,
      setSelectedRole,
      setShowDetails,
    },
  });

  return (
    <div className="w-full">
      <div className="mb-5 flex flex-col items-center justify-center gap-3 sm:flex-row sm:justify-between">
        <Input
          placeholder="Filter roles..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="w-full sm:max-w-sm !ring-0"
        />

        <div className="flex gap-2 w-full justify-between sm:w-fit">
          {children}
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="w-32 h-8">
              <Button variant="outline">
                Columns <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id.replace(/_/g, " ")}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="w-full overflow-hidden rounded-md border border-gray-200">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="bg-gray-100">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* pagination */}
      <div className="my-4 w-full">
        <Pagination
          setPagination={setPagination}
          pagination={{
            currentPage: pagination.currentPage,
            pageSize: pagination.pageSize,
            from: pagination?.from || 0,
            to: pagination?.to || 0,
            total: pagination?.total || 0,
            endPage: pagination?.endPage || 0,
          }}
        />
      </div>
    </div>
  );
}
