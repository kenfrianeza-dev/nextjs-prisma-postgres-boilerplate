'use client';

import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { Button } from '@/app/_components/ui/button';
import { Badge } from '@/app/_components/ui/badge';
import { Avatar, AvatarFallback } from '@/app/_components/ui/avatar';
import { UserActionsCell } from '@/app/(admin)/user-management/users/_components/user-actions-cell';
import type { UserWithRoles } from '@/app/(admin)/user-management/users/_types';

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
      accessorFn: (row) => {
        const parts = [row.firstName, row.middleName, row.lastName, row.suffixName].filter(Boolean);
        return parts.join(' ');
      },
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="-ml-4 hover:bg-transparent"
        >
          Name
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
        const user = row.original;
        const initials = `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
        const fullName = [user.firstName, user.middleName, user.lastName, user.suffixName].filter(Boolean).join(' ');
        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9">
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-medium text-foreground">
                {fullName}
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
      accessorKey: 'phoneNumber',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="-ml-4 hover:bg-transparent"
        >
          Phone
          {column.getIsSorted() === 'desc' ? (
            <ArrowDown className="ml-2 h-3 w-3" />
          ) : column.getIsSorted() === 'asc' ? (
            <ArrowUp className="ml-2 h-3 w-3" />
          ) : (
            <ArrowUpDown className="ml-2 h-3 w-3" />
          )}
        </Button>
      ),
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">{row.getValue('phoneNumber')}</span>
      ),
    },
    {
      accessorKey: 'roles',
      sortingFn: (rowA, rowB) => {
        const getRolesStr = (roles: UserWithRoles['roles']) => {
          if (!roles || roles.length === 0) return '';
          const uniqueRoles = roles.filter(
            (ur, index, self) =>
              self.findIndex((item) => item.role.id === ur.role.id) === index
          );
          return uniqueRoles.map((ur) => ur.role.name).sort().join(', ');
        };

        const aStr = getRolesStr(rowA.original.roles);
        const bStr = getRolesStr(rowB.original.roles);

        return aStr.localeCompare(bStr);
      },
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="-ml-4 hover:bg-transparent"
        >
          Role
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
        const userRoles = row.original.roles;
        // Filter out duplicate roles by id (e.g. if multiple assignments exist with different scopes)
        const uniqueRoles = userRoles.filter(
          (ur, index, self) =>
            self.findIndex((item) => item.role.id === ur.role.id) === index
        );

        return (
          <div className="flex flex-wrap gap-1">
            {uniqueRoles.length > 0 ? (
              uniqueRoles.map((ur) => (
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
        const isActive = row.getValue('isActive') as boolean;
        return (
          <Badge
            variant={isActive ? 'active' : 'inactive'}
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
