'use client';

import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Avatar, AvatarFallback } from '@/app/components/ui/avatar';
import { UserActionsCell } from './user-actions-cell';
import type { UserWithRoles } from '../_types';

/**
 * Build column definitions for the users table.
 *
 * Accepts permission flags so the actions column can conditionally
 * render edit / delete menu items.
 */
export function getUserColumns(canUpdate: boolean, canDelete: boolean): ColumnDef<UserWithRoles>[] {
  return [
    {
      id: 'name',
      accessorFn: (row) => `${row.firstName} ${row.lastName}`,
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="-ml-4 hover:bg-transparent"
        >
          Name
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      ),
      cell: ({ row }) => {
        const user = row.original;
        const initials = `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9">
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-medium text-foreground">
                {user.firstName} {user.lastName}
              </span>
              <span className="text-xs text-muted-foreground truncate max-w-[200px]">
                {user.email}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'roles',
      header: 'Roles',
      cell: ({ row }) => {
        const userRoles = row.original.roles;
        return (
          <div className="flex flex-wrap gap-1">
            {userRoles.length > 0 ? (
              userRoles.map((ur) => (
                <Badge key={ur.role.id} variant="secondary" className="font-normal">
                  {ur.role.name}
                </Badge>
              ))
            ) : (
              <span className="text-sm text-muted-foreground italic">No roles</span>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: 'isActive',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="-ml-4 hover:bg-transparent"
        >
          Status
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      ),
      cell: ({ row }) => {
        const isActive = row.getValue('isActive') as boolean;
        return (
          <Badge
            variant={isActive ? 'default' : 'outline'}
            className={isActive ? '' : 'text-muted-foreground'}
          >
            {isActive ? 'Active' : 'Inactive'}
          </Badge>
        );
      },
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => (
        <UserActionsCell
          user={row.original}
          canUpdate={canUpdate}
          canDelete={canDelete}
        />
      ),
    },
  ];
}
