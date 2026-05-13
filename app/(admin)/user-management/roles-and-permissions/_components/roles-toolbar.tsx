'use client';

import { Input } from '@/app/components/ui/input';
import { CreateRoleDialog } from '@/app/(admin)/user-management/(components)/create-role-dialog';
import type { RoleActionState } from '../action';
import type { Permission } from '../_types';
import type { Table } from '@tanstack/react-table';
import type { RoleWithPermissions } from '../_types';

interface RolesToolbarProps {
  table: Table<RoleWithPermissions>;
  canCreate: boolean;
  isCreateOpen: boolean;
  onCreateOpenChange: (open: boolean) => void;
  createAction: (payload: FormData) => void;
  createState: RoleActionState;
  isCreatePending: boolean;
  allPermissions: Permission[];
}

/**
 * Toolbar row above the table — search input + create button.
 */
export function RolesToolbar({
  table,
  canCreate,
  isCreateOpen,
  onCreateOpenChange,
  createAction,
  createState,
  isCreatePending,
  allPermissions,
}: RolesToolbarProps) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
      <Input
        placeholder="🔍 Search a role ..."
        value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
        onChange={(event) =>
          table.getColumn('name')?.setFilterValue(event.target.value)
        }
        className="w-full sm:w-auto"
      />
      {canCreate && (
        <CreateRoleDialog
          isOpen={isCreateOpen}
          onOpenChange={onCreateOpenChange}
          createAction={createAction}
          createState={createState}
          isCreatePending={isCreatePending}
          allPermissions={allPermissions}
        />
      )}
    </div>
  );
}
