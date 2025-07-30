import type { ClinicToken } from "@/types/appointments";
import type {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
} from "@tanstack/react-table";

import { Pagination } from "@/components/custom";
import {
  Button,
  Calendar,
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui";
import { cn } from "@/utils";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { format } from "date-fns";
import { ArrowUpDown, CalendarIcon } from "lucide-react";
import { useState } from "react";

interface ClinicTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  search: string;
  typeFilter: string;
  clinicDateFilter: Date | undefined;
  setClinicDateFilter: (date: Date | undefined) => void;
  setTypeFilter: (type: string) => void;
  setSearch: (search: string) => void;
  setOpen: (open: boolean) => void;
  setShowDetails: (show: boolean) => void;
  setSelectedClinicToken: (clinicToken: ClinicToken) => void;
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

export function ClinicTable<TData, TValue>({
  columns,
  data,
  search,
  setOpen,
  typeFilter,
  setTypeFilter,
  setSearch,
  setSelectedClinicToken,
  setShowDetails,
  clinicDateFilter,
  setClinicDateFilter,
  setPagination,
  pagination,
  children,
}: ClinicTableProps<TData, TValue>) {
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
      setSelectedClinicToken,
      setShowDetails,
    },
  });

  return (
    <div className="w-full">
      <div className="mb-5 flex flex-col items-center justify-center gap-3 sm:flex-row sm:justify-between">
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:max-w-xl">
          <Input
            placeholder="Filter clinic dates..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="flex-1 !ring-0"
          />
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full sm:w-32">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">All Types</SelectItem>
              <SelectItem value="self">Self</SelectItem>
              <SelectItem value="internal">Internal</SelectItem>
            </SelectContent>
          </Select>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full sm:w-48 pl-3 text-left font-normal",
                  !clinicDateFilter && "text-muted-foreground",
                )}
              >
                {clinicDateFilter ? (
                  format(clinicDateFilter, "PPP")
                ) : (
                  <span>Pick a date</span>
                )}
                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                startMonth={clinicDateFilter || new Date()}
                selected={clinicDateFilter}
                onSelect={(date) => {
                  setClinicDateFilter(date);
                }}
                captionLayout="dropdown"
              />

              {/* clear button */}
              <div className="p-2">
                <Button
                  variant="outline"
                  className="mt-2 w-full"
                  onClick={() => setClinicDateFilter(undefined)}
                >
                  Clear Date
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>

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
