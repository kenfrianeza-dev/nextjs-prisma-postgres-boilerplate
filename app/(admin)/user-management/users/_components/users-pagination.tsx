'use client';

import { Button } from '@/app/_components/ui/button';
import type { Table } from '@tanstack/react-table';
import type { UserWithRoles } from '@/app/(admin)/user-management/users/_types';

interface UsersPaginationProps {
  table: Table<UserWithRoles>;
}

/**
 * Pagination footer showing row count + prev/next controls.
 */
export function UsersPagination({ table }: UsersPaginationProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="text-sm text-muted-foreground">
        Showing {table.getFilteredRowModel().rows.length} users
      </div>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <div className="text-sm font-medium">
          Page {table.getState().pagination.pageIndex + 1} of{' '}
          {table.getPageCount()}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
