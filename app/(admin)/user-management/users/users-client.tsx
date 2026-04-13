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
import { Badge } from '@/app/components/ui/badge';
import { Avatar, AvatarFallback } from '@/app/components/ui/avatar';
import { createUserAction, deleteUserAction, updateUserAction, type UserActionState } from './action';
import { toast } from 'sonner';
import { UserManagementPolicy } from '@/domain/user-management/user-management.policy';
import { ScrollArea } from '@/app/components/ui/scroll-area';
import { CreateUserDialog } from '@/app/(admin)/user-management/(components)/create-user-dialog';
import { EditUserDialog } from '@/app/(admin)/user-management/(components)/edit-user-dialog';
import { DeleteUserDialog } from '@/app/(admin)/user-management/(components)/delete-user-dialog';

type UserWithRoles = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  roles: {
    role: {
      id: string;
      name: string;
    };
  }[];
  permissions: {
    id: string;
    userId: string;
    permissionId: string;
    permission: {
      id: string;
      action: string;
      resource: string;
      module: string | null;
      description: string | null;
    };
  }[];
};

interface UsersClientProps {
  users: UserWithRoles[];
  roles: { id: string; name: string }[];
  permissions: string[];
  allPermissions: { id: string; action: string; resource: string; module: string | null; description: string | null }[];
}

const initialState: UserActionState = {
  message: null,
  success: false,
};

export function UsersClient({ users, roles, permissions, allPermissions }: UsersClientProps) {
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
  const [currentUser, setCurrentUser] = useState<UserWithRoles | null>(null);

  const canCreate = UserManagementPolicy.createUser(permissions);
  const canUpdate = UserManagementPolicy.updateUser(permissions);
  const canDelete = UserManagementPolicy.deleteUser(permissions);

  console.log("permissions ng kupal:");
  console.log(permissions);

  // useActionState for Creating User
  const [createState, createAction, isCreatePending] = useActionState(
    createUserAction,
    initialState
  );

  // useActionState for Updating User
  const updateUserActionWithId = useMemo(() => {
    if (!currentUser) return async (prevState: UserActionState, formData: FormData) => prevState;
    return updateUserAction.bind(null, currentUser.id);
  }, [currentUser]);

  const [editState, editAction, isEditPending] = useActionState(
    updateUserActionWithId,
    initialState
  );

  // Handle Success Notifications and Modal Closing
  useEffect(() => {
    if (createState.success) {
      toast.success(createState.message || 'User created successfully');
      setIsCreateOpen(false);
    } else if (createState.message && !createState.success) {
      toast.error(createState.message);
    }
  }, [createState]);

  useEffect(() => {
    if (editState.success) {
      toast.success(editState.message || 'User updated successfully');
      setIsEditOpen(false);
    } else if (editState.message && !editState.success) {
      toast.error(editState.message);
    }
  }, [editState]);

  const columns: ColumnDef<UserWithRoles>[] = [
    {
      id: 'name',
      accessorFn: (row) => `${row.firstName} ${row.lastName}`,
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="-ml-4 hover:bg-transparent"
          >
            Name
            <ArrowUpDown className="ml-2 h-3 w-3" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const user = row.original;
        const initials = `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9">
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-medium text-foreground">{user.firstName} {user.lastName}</span>
              <span className="text-xs text-muted-foreground truncate max-w-[200px]">{user.email}</span>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'roles',
      header: 'Roles',
      cell: ({ row }) => {
        const userRoles = row.original.roles;
        return (
          <div className="flex flex-wrap gap-1">
            {userRoles.length > 0 ? (
              userRoles.map((ur) => (
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
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="-ml-4 hover:bg-transparent"
          >
            Status
            <ArrowUpDown className="ml-2 h-3 w-3" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const isActive = row.getValue('isActive') as boolean;
        return (
          <Badge variant={isActive ? 'default' : 'outline'} className={isActive ? '' : 'text-muted-foreground'}>
            {isActive ? 'Active' : 'Inactive'}
          </Badge>
        );
      },
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        const user = row.original;

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
                    navigator.clipboard.writeText(user.id);
                    toast.success('User ID copied to clipboard');
                  }}
                >
                  <Copy className="mr-2 h-4 w-4" /> Copy user ID
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {canUpdate && (
                  <DropdownMenuItem onClick={() => {
                    setCurrentUser(user);
                    setIsEditOpen(true);
                  }}>
                    <Edit className="mr-2 h-4 w-4" /> Edit User
                  </DropdownMenuItem>
                )}
                {canDelete && (
                  <DropdownMenuItem
                    className="text-red-500 focus:text-red-400 font-medium"
                    onClick={() => {
                      setCurrentUser(user);
                      setIsDeleteOpen(true);
                    }}
                  >
                    <Trash className="mr-2 h-4 w-4 text-red-500 focus:text-red-400" /> Delete User
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

  const [isDeletePending, setIsDeletePending] = useState(false);
  const handleDelete = async () => {
    if (!currentUser) return;
    setIsDeletePending(true);
    try {
      const result = await deleteUserAction(currentUser.id);
      if (result.success) {
        toast.success(result.message || 'User deleted successfully');
        setIsDeleteOpen(false);
      } else {
        toast.error(result.message || 'Failed to delete user');
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
          placeholder="Search user ..."
          value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('name')?.setFilterValue(event.target.value)
          }
          className="w-full sm:w-auto"
        />
        {canCreate && (
          <CreateUserDialog
            isOpen={isCreateOpen}
            onOpenChange={setIsCreateOpen}
            createAction={createAction}
            createState={createState}
            isCreatePending={isCreatePending}
            roles={roles}
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
                  <TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground">
                    No users found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing {table.getFilteredRowModel().rows.length} users
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

      <EditUserDialog
        isOpen={isEditOpen}
        onOpenChange={setIsEditOpen}
        editAction={editAction}
        editState={editState}
        isEditPending={isEditPending}
        currentUser={currentUser}
        roles={roles}
        allPermissions={allPermissions}
      />

      <DeleteUserDialog
        isOpen={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        onDelete={handleDelete}
        isDeletePending={isDeletePending}
        currentUser={currentUser}
      />
    </div>
  );
}
