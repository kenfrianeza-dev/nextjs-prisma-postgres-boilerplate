'use client';

import { Button } from '@/app/_components/ui/button';
import type { Table } from '@tanstack/react-table';
import type { RoleWithPermissions } from '@/app/(admin)/user-management/roles-and-permissions/_types';

interface RolesPaginationProps {
  table: Table<RoleWithPermissions>;
}

/**
 * Pagination footer showing row count + prev/next controls.
 */
export function RolesPagination({ table }: RolesPaginationProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="text-sm text-muted-foreground">
        Showing {table.getFilteredRowModel().rows.length} roles
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
