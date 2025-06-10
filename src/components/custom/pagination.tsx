import type { FC } from "react";

import {
  Button,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
} from "lucide-react";

export const Pagination: FC<{
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
}> = ({ pagination, setPagination }) => {
  return (
    <div className="flex items-center justify-between">
      <div className="hidden flex-1 text-sm text-muted-foreground lg:flex">
        Showing {pagination.from} to {pagination.to} of {pagination.total}{" "}
        results
      </div>
      <div className="flex w-full items-center gap-8 lg:w-fit">
        <div className="hidden items-center gap-2 lg:flex">
          <Label htmlFor="rows-per-page" className="text-sm font-medium">
            Rows per page
          </Label>
          <Select
            value={pagination.pageSize.toString()}
            onValueChange={(value) =>
              setPagination({
                currentPage: 1,
                pageSize: parseInt(value),
              })
            }
          >
            <SelectTrigger className="w-20 cursor-pointer" id="rows-per-page">
              <SelectValue placeholder={pagination.pageSize.toString()} />
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
        <div className="flex w-fit items-center justify-center text-sm font-medium">
          Page {pagination.currentPage} of {pagination.endPage}
        </div>
        <div className="ml-auto flex items-center gap-2 lg:ml-0">
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() =>
              setPagination({ currentPage: 1, pageSize: pagination.pageSize })
            }
            disabled={pagination.currentPage <= 1}
          >
            <span className="sr-only">Go to first page</span>
            <ChevronsLeftIcon />
          </Button>
          <Button
            variant="outline"
            className="size-8"
            size="icon"
            onClick={() =>
              setPagination({
                currentPage: pagination.currentPage - 1,
                pageSize: pagination.pageSize,
              })
            }
            disabled={
              pagination.currentPage <= 1 ||
              pagination.currentPage > pagination.endPage
            }
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeftIcon />
          </Button>
          <Button
            variant="outline"
            className="size-8"
            size="icon"
            onClick={() =>
              setPagination({
                currentPage: pagination.currentPage + 1,
                pageSize: pagination.pageSize,
              })
            }
            disabled={
              pagination.currentPage >= pagination.endPage ||
              pagination.currentPage < 1
            }
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRightIcon />
          </Button>
          <Button
            variant="outline"
            className="hidden size-8 lg:flex"
            size="icon"
            onClick={() =>
              setPagination({
                currentPage: pagination.endPage,
                pageSize: pagination.pageSize,
              })
            }
            disabled={
              pagination.currentPage >= pagination.endPage ||
              pagination.currentPage < 1
            }
          >
            <span className="sr-only">Go to last page</span>
            <ChevronsRightIcon />
          </Button>
        </div>
      </div>
    </div>
  );
};
