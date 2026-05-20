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
import { EditUserDialog } from '@/app/(admin)/user-management/_components/edit-user-dialog';
import { DeleteUserDialog } from '@/app/(admin)/user-management/_components/delete-user-dialog';
import { useUsersStore } from '@/app/(admin)/user-management/users/_store/use-users-store';
import { useUserActions } from '@/app/(admin)/user-management/users/_hooks/use-user-actions';
import { getUserColumns } from '@/app/(admin)/user-management/users/_components/users-columns';
import { UsersToolbar } from '@/app/(admin)/user-management/users/_components/users-toolbar';
import { UsersTable } from '@/app/(admin)/user-management/users/_components/users-table';
import { UsersPagination } from '@/app/(admin)/user-management/users/_components/users-pagination';
import type { UsersClientProps } from '@/app/(admin)/user-management/users/_types';

/**
 * Client-side orchestrator for the Users page.
 *
 * Responsibilities:
 *  1. Wire the Zustand store, server-action hook, and TanStack table together.
 *  2. Compose the child components (toolbar → table → pagination → dialogs).
 *
 * All rendering, column definitions, and row-level actions live in their own
 * dedicated component files.
 */
export function UsersClient({
  users,
  roles,
  permissions,
  allPermissions,
  rolesWithPermissions,
}: UsersClientProps) {
  // ── Permission checks ─────────────────────────────────────
  const canCreate = UserManagementPolicy.createUser(permissions);
  const canUpdate = UserManagementPolicy.updateUser(permissions);
  const canDelete = UserManagementPolicy.deleteUser(permissions);

  // ── Zustand store ─────────────────────────────────────────
  const {
    isCreateOpen,
    isEditOpen,
    isDeleteOpen,
    currentUser,
    openCreate,
    closeCreate,
    closeEdit,
    closeDelete,
  } = useUsersStore();

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
  } = useUserActions();

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
    () => getUserColumns(canUpdate, canDelete),
    [canUpdate, canDelete],
  );

  const table = useReactTable({
    data: users,
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
    initialState: {
      pagination: {
        pageSize: 20,
      },
    },
  });

  // ── Compose ───────────────────────────────────────────────
  return (
    <div className="w-full space-y-4">
      <UsersToolbar
        table={table}
        canCreate={canCreate}
        isCreateOpen={isCreateOpen}
        onCreateOpenChange={(open) => (open ? openCreate() : closeCreate())}
        createAction={createAction}
        createState={createState}
        isCreatePending={isCreatePending}
        roles={roles}
        allPermissions={allPermissions}
        rolesWithPermissions={rolesWithPermissions}
      />

      <UsersTable table={table} columnCount={columns.length} />

      <UsersPagination table={table} />

      <EditUserDialog
        key={currentUser?.id ?? 'no-user'}
        isOpen={isEditOpen}
        onOpenChange={(open) => { if (!open) closeEdit(); }}
        editAction={editAction}
        editState={editState}
        isEditPending={isEditPending}
        currentUser={currentUser}
        roles={roles}
        allPermissions={allPermissions}
        rolesWithPermissions={rolesWithPermissions}
      />

      <DeleteUserDialog
        isOpen={isDeleteOpen}
        onOpenChange={(open) => { if (!open) closeDelete(); }}
        onDelete={handleDelete}
        isDeletePending={isDeletePending}
        currentUser={currentUser}
      />
    </div>
  );
}
