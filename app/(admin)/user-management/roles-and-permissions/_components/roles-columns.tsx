'use client';

import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, ArrowUp, ArrowDown, Shield } from 'lucide-react';
import { Button } from '@/app/_components/ui/button';
import { RolePermissionsList } from '@/app/(admin)/user-management/_components/role-permissions-list';
import { RoleActionsCell } from '@/app/(admin)/user-management/roles-and-permissions/_components/role-actions-cell';
import type { RoleWithPermissions } from '@/app/(admin)/user-management/roles-and-permissions/_types';

/**
 * Build column definitions for the roles table.
 *
 * Accepts permission flags so the actions column can conditionally
 * render edit / delete menu items.
 */
export function getRolesColumns(canUpdate: boolean, canDelete: boolean): ColumnDef<RoleWithPermissions>[] {
  return [
    {
      accessorKey: 'name',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="-ml-4 hover:bg-transparent"
        >
          Role Name
          {column.getIsSorted() === 'desc' ? (
            <ArrowDown className="ml-2 h-3 w-3" />
          ) : column.getIsSorted() === 'asc' ? (
            <ArrowUp className="ml-2 h-3 w-3" />
          ) : (
            <ArrowUpDown className="ml-2 h-3 w-3" />
          )}
        </Button>
      ),
      cell: ({ row }) => {
        const role = row.original;
        return (
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <div className="flex flex-col">
              <span className="font-medium text-foreground">{role.name}</span>
              <span className="text-xs text-muted-foreground truncate max-w-[200px]">
                {role.description || 'No description'}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'permissions',
      header: 'Permissions',
      cell: ({ row }) => (
        <RolePermissionsList permissions={row.original.permissions} />
      ),
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => (
        <RoleActionsCell
          role={row.original}
          canUpdate={canUpdate}
          canDelete={canDelete}
        />
      ),
    },
  ];
}
