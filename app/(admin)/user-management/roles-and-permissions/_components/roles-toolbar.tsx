'use client';

import { Search } from 'lucide-react';
import { Input } from '@/app/_components/ui/input';
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
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="relative w-48">
        <Search className="absolute left-2 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
        <Input
          placeholder="Search a role ..."
          value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('name')?.setFilterValue(event.target.value)
          }
          className="w-full sm:w-auto pl-8 h-8 text-xs"
        />
      </div>
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
