'use client';

import { Input } from '@/app/components/ui/input';
import { CreateUserDialog } from '@/app/(admin)/user-management/(components)/create-user-dialog';
import type { UserActionState } from '../action';
import type { RoleOption, PermissionOption, RoleWithPermissions } from '../_types';
import type { Table } from '@tanstack/react-table';
import type { UserWithRoles } from '../_types';

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
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
      <Input
        placeholder="🔍 Search a user ..."
        value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
        onChange={(event) =>
          table.getColumn('name')?.setFilterValue(event.target.value)
        }
        className="w-full sm:w-auto"
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
