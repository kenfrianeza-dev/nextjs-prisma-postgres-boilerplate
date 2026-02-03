'use client';

import { useState, useEffect, useMemo } from 'react';
import { useActionState } from 'react';
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import {
  ArrowUpDown,
  Copy,
  Edit,
  MoreHorizontal,
  Trash,
  Shield,
} from 'lucide-react';

import { Button } from '@/app/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu';
import { Input } from '@/app/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/app/components/ui/table';
import { createRoleAction, deleteRoleAction, updateRoleAction, type RoleActionState } from './action';
import { toast } from 'sonner';
import { ScrollArea } from '@/app/components/ui/scroll-area';
import { UserManagementPolicy } from '@/domain/user-management/user-management.policy';
import { RolePermissionsList } from '@/app/(admin)/user-management/(components)/role-permissions-list';
import { CreateRoleDialog } from '@/app/(admin)/user-management/(components)/create-role-dialog';
import { EditRoleDialog } from '@/app/(admin)/user-management/(components)/edit-role-dialog';
import { DeleteRoleDialog } from '@/app/(admin)/user-management/(components)/delete-role-dialog';

type Permission = {
  id: string;
  action: string;
  resource: string;
  module: string | null;
  description: string | null;
};

type RoleWithPermissions = {
  id: string;
  name: string;
  description: string | null;
  permissions: {
    permission: Permission;
  }[];
};

interface RolesClientProps {
  roles: RoleWithPermissions[];
  allPermissions: Permission[];
  userPermissions: string[];
}

const initialState: RoleActionState = {
  message: null,
  success: false,
};

export function RolesClient({ roles, allPermissions, userPermissions }: RolesClientProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 20,
  });

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [currentRole, setCurrentRole] = useState<RoleWithPermissions | null>(null);

  const canCreate = UserManagementPolicy.createRole(userPermissions);
  const canUpdate = UserManagementPolicy.updateRole(userPermissions);
  const canDelete = UserManagementPolicy.deleteRole(userPermissions);

  // useActionState for Creating Role
  const [createState, createAction, isCreatePending] = useActionState(
    createRoleAction,
    initialState
  );

  // useActionState for Updating Role
  const updateRoleActionWithId = useMemo(() => {
    if (!currentRole) return async (prevState: RoleActionState, formData: FormData) => prevState;
    return updateRoleAction.bind(null, currentRole.id);
  }, [currentRole]);

  const [editState, editAction, isEditPending] = useActionState(
    updateRoleActionWithId,
    initialState
  );

  // Handle Success Notifications and Modal Closing
  useEffect(() => {
    if (createState.success) {
      toast.success(createState.message || 'Role created successfully');
      setIsCreateOpen(false);
    } else if (createState.message && !createState.success) {
      toast.error(createState.message);
    }
  }, [createState]);

  useEffect(() => {
    if (editState.success) {
      toast.success(editState.message || 'Role updated successfully');
      setIsEditOpen(false);
    } else if (editState.message && !editState.success) {
      toast.error(editState.message);
    }
  }, [editState]);

  const columns: ColumnDef<RoleWithPermissions>[] = [
    {
      accessorKey: 'name',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="-ml-4 hover:bg-transparent"
          >
            Role Name
            <ArrowUpDown className="ml-2 h-3 w-3" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const role = row.original;
        return (
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <div className="flex flex-col">
              <span className="font-medium text-foreground">{role.name}</span>
              <span className="text-xs text-muted-foreground truncate max-w-[200px]">{role.description || 'No description'}</span>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'permissions',
      header: 'Permissions',
      cell: ({ row }) => {
        return <RolePermissionsList permissions={row.original.permissions} />;
      },
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        const role = row.original;

        return (
          <div className="text-right">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem
                  onClick={() => {
                    navigator.clipboard.writeText(role.id);
                    toast.success('Role ID copied to clipboard');
                  }}
                >
                  <Copy className="mr-2 h-4 w-4" /> Copy role ID
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {canUpdate && (
                  <DropdownMenuItem onClick={() => {
                    setCurrentRole(role);
                    setIsEditOpen(true);
                  }}>
                    <Edit className="mr-2 h-4 w-4" /> Edit Role
                  </DropdownMenuItem>
                )}
                {canDelete && (
                  <DropdownMenuItem
                    className="text-red-500 focus:text-red-400 font-medium"
                    onClick={() => {
                      setCurrentRole(role);
                      setIsDeleteOpen(true);
                    }}
                  >
                    <Trash className="mr-2 h-4 w-4 text-red-500 focus:text-red-400" /> Delete Role
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];

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

  const [isDeletePending, setIsDeletePending] = useState(false);
  const handleDelete = async () => {
    if (!currentRole) return;
    setIsDeletePending(true);
    try {
      const result = await deleteRoleAction(currentRole.id);
      if (result.success) {
        toast.success(result.message || 'Role deleted successfully');
        setIsDeleteOpen(false);
      } else {
        toast.error(result.message || 'Failed to delete role');
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    } finally {
      setIsDeletePending(false);
    }
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <Input
          placeholder="Search role ..."
          value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('name')?.setFilterValue(event.target.value)
          }
          className="w-full sm:w-auto"
        />
        {canCreate && (
          <CreateRoleDialog
            isOpen={isCreateOpen}
            onOpenChange={setIsCreateOpen}
            createAction={createAction}
            createState={createState}
            isCreatePending={isCreatePending}
            allPermissions={allPermissions}
          />
        )}
      </div>

      <div className="rounded-md border bg-card overflow-hidden h-[600px]">
        <ScrollArea className="h-[600px] rounded-md border">
          <Table>
            <TableHeader className="bg-muted/50 sticky top-0 z-10 shadow-sm">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="hover:bg-transparent">
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="py-3">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-[555px] text-center text-muted-foreground">
                    No roles found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing {table.getFilteredRowModel().rows.length} roles
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <div className="text-sm font-medium">
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>

      <EditRoleDialog
        isOpen={isEditOpen}
        onOpenChange={setIsEditOpen}
        editAction={editAction}
        editState={editState}
        isEditPending={isEditPending}
        currentRole={currentRole}
        allPermissions={allPermissions}
      />

      <DeleteRoleDialog
        isOpen={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        onDelete={handleDelete}
        isDeletePending={isDeletePending}
        currentRole={currentRole}
      />
    </div>
  );
}
