'use client';

import { Input } from '@/app/components/ui/input';
import { CreateUserDialog } from '@/app/(admin)/user-management/(components)/create-user-dialog';
import type { UserActionState } from '../action';
import type { RoleOption, PermissionOption, RoleWithPermissions } from '../_types';
import type { Table } from '@tanstack/react-table';
import type { UserWithRoles } from '../_types';
import { Search } from 'lucide-react';

interface UsersToolbarProps {
  table: Table<UserWithRoles>;
  canCreate: boolean;
  isCreateOpen: boolean;
  onCreateOpenChange: (open: boolean) => void;
  createAction: (payload: FormData) => void;
  createState: UserActionState;
  isCreatePending: boolean;
  roles: RoleOption[];
  allPermissions: PermissionOption[];
  rolesWithPermissions: RoleWithPermissions[];
}

/**
 * Toolbar row above the table — search input + create button.
 */
export function UsersToolbar({
  table,
  canCreate,
  isCreateOpen,
  onCreateOpenChange,
  createAction,
  createState,
  isCreatePending,
  roles,
  allPermissions,
  rolesWithPermissions,
}: UsersToolbarProps) {
  return (
    <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="relative w-full sm:w-md">
        <Search className="absolute left-2 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
        <Input
          placeholder="Search a user ..."
          value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('name')?.setFilterValue(event.target.value)
          }
          className="w-full pl-8 h-8 text-xs"
        />
      </div>
      {canCreate && (
        <CreateUserDialog
          isOpen={isCreateOpen}
          onOpenChange={onCreateOpenChange}
          createAction={createAction}
          createState={createState}
          isCreatePending={isCreatePending}
          roles={roles}
          allPermissions={allPermissions}
          rolesWithPermissions={rolesWithPermissions}
        />
      )}
    </div>
  );
}
