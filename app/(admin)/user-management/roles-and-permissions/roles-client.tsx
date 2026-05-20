'use client';

import { useState, useMemo } from 'react';
import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { UserManagementPolicy } from '@/domain/user-management/user-management.policy';
import { EditRoleDialog } from '@/app/(admin)/user-management/_components/edit-role-dialog';
import { DeleteRoleDialog } from '@/app/(admin)/user-management/_components/delete-role-dialog';
import { useRolesStore } from '@/app/(admin)/user-management/roles-and-permissions/_store/use-roles-store';
import { useRoleActions } from '@/app/(admin)/user-management/roles-and-permissions/_hooks/use-role-actions';
import { getRolesColumns } from '@/app/(admin)/user-management/roles-and-permissions/_components/roles-columns';
import { RolesToolbar } from '@/app/(admin)/user-management/roles-and-permissions/_components/roles-toolbar';
import { RolesTable } from '@/app/(admin)/user-management/roles-and-permissions/_components/roles-table';
import { RolesPagination } from '@/app/(admin)/user-management/roles-and-permissions/_components/roles-pagination';
import type { RolesClientProps } from '@/app/(admin)/user-management/roles-and-permissions/_types';

/**
 * Client-side orchestrator for the Roles & Permissions page.
 *
 * Responsibilities:
 *  1. Wire the Zustand store, server-action hook, and TanStack table together.
 *  2. Compose the child components (toolbar → table → pagination → dialogs).
 *
 * All rendering, column definitions, and row-level actions live in their own
 * dedicated component files.
 */
export function RolesClient({
  roles,
  allPermissions,
  userPermissions,
}: RolesClientProps) {
  // ── Permission checks ─────────────────────────────────────
  const canCreate = UserManagementPolicy.createRole(userPermissions);
  const canUpdate = UserManagementPolicy.updateRole(userPermissions);
  const canDelete = UserManagementPolicy.deleteRole(userPermissions);

  // ── Zustand store ─────────────────────────────────────────
  const {
    isCreateOpen,
    isEditOpen,
    isDeleteOpen,
    currentRole,
    openCreate,
    closeCreate,
    closeEdit,
    closeDelete,
  } = useRolesStore();

  // ── Server actions ────────────────────────────────────────
  const {
    createState,
    createAction,
    isCreatePending,
    editState,
    editAction,
    isEditPending,
    handleDelete,
    isDeletePending,
  } = useRoleActions();

  // ── TanStack table ────────────────────────────────────────
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 20,
  });

  const columns = useMemo(
    () => getRolesColumns(canUpdate, canDelete),
    [canUpdate, canDelete],
  );

  const table = useReactTable({
    data: roles,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
  });

  // ── Compose ───────────────────────────────────────────────
  return (
    <div className="w-full space-y-4">
      <RolesToolbar
        table={table}
        canCreate={canCreate}
        isCreateOpen={isCreateOpen}
        onCreateOpenChange={(open) => (open ? openCreate() : closeCreate())}
        createAction={createAction}
        createState={createState}
        isCreatePending={isCreatePending}
        allPermissions={allPermissions}
      />

      <RolesTable table={table} columnCount={columns.length} />

      <RolesPagination table={table} />

      <EditRoleDialog
        isOpen={isEditOpen}
        onOpenChange={(open) => { if (!open) closeEdit(); }}
        editAction={editAction}
        editState={editState}
        isEditPending={isEditPending}
        currentRole={currentRole}
        allPermissions={allPermissions}
      />

      <DeleteRoleDialog
        isOpen={isDeleteOpen}
        onOpenChange={(open) => { if (!open) closeDelete(); }}
        onDelete={handleDelete}
        isDeletePending={isDeletePending}
        currentRole={currentRole}
      />
    </div>
  );
}
