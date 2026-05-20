'use client';

import { DataTableSearch } from '@/app/(admin)/user-management/_components/data-table-search';
import { CreateUserDialog } from '@/app/(admin)/user-management/_components/create-user-dialog';
import type { UserActionState } from '@/app/(admin)/user-management/users/action';
import type { Table } from '@tanstack/react-table';
import type { PermissionOption, RoleOption, RoleWithPermissions, UserWithRoles } from '@/app/(admin)/user-management/users/_types';

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
      <DataTableSearch
        table={table}
        columnKey="name"
        placeholder="Search a user ..."
      />
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
