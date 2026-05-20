'use client';

import { DataTableSearch } from '@/app/(admin)/user-management/_components/data-table-search';
import { CreateRoleDialog } from '@/app/(admin)/user-management/_components/create-role-dialog';
import type { Table } from '@tanstack/react-table';
import type { Permission, RoleActionState, RoleWithPermissions } from '@/app/(admin)/user-management/roles-and-permissions/_types';

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
    <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4">
      <DataTableSearch
        table={table}
        columnKey="name"
        placeholder="Search a role ..."
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
