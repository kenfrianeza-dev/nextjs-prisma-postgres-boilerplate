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
  ChevronDown,
  Copy,
  Edit,
  MoreHorizontal,
  Plus,
  Trash,
} from 'lucide-react';

import { Button } from '@/app/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/app/components/ui/dialog';
import { Label } from '@/app/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/app/components/ui/avatar';
import { createUserAction, deleteUserAction, updateUserAction, type UserActionState } from './action';
import { toast } from 'sonner';
import { Spinner } from '@/app/components/ui/spinner';

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
};

interface UsersClientProps {
  users: UserWithRoles[];
  roles: { id: string; name: string }[];
  permissions: string[];
}

const initialState: UserActionState = {
  message: null,
  success: false,
};

export function UsersClient({ users, roles, permissions }: UsersClientProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserWithRoles | null>(null);

  const canCreate = permissions.includes('create:users') || permissions.includes('manage:users') || permissions.includes('*:*');
  const canUpdate = permissions.includes('update:users') || permissions.includes('manage:users') || permissions.includes('*:*');
  const canDelete = permissions.includes('delete:users') || permissions.includes('manage:users') || permissions.includes('*:*');

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
              <span className="font-medium">{user.firstName} {user.lastName}</span>
              <span className="text-sm text-muted-foreground">{user.email}</span>
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
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    initialState: {
      pagination: {
        pageSize: 10,
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
      <div className="flex items-center justify-between gap-4">
        <Input
          placeholder="Filter by name ..."
          value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('name')?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        {canCreate && (
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Create User
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <form action={createAction}>
                <DialogHeader>
                  <DialogTitle>Create User</DialogTitle>
                  <DialogDescription>
                    Fill in the details to create a new user.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4 items-start">
                    <div className="grid gap-2">
                      <Label htmlFor="firstName" className={createState.errors?.firstName ? 'text-destructive' : ''}>First Name</Label>
                      <Input id="firstName" name="firstName" className={createState.errors?.firstName ? 'border-destructive' : ''} required />
                      {createState.errors?.firstName && <p className="text-xs text-destructive">{createState.errors.firstName[0]}</p>}
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="lastName" className={createState.errors?.lastName ? 'text-destructive' : ''}>Last Name</Label>
                      <Input id="lastName" name="lastName" className={createState.errors?.lastName ? 'border-destructive' : ''} required />
                      {createState.errors?.lastName && <p className="text-xs text-destructive">{createState.errors.lastName[0]}</p>}
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email" className={createState.errors?.email ? 'text-destructive' : ''}>Email</Label>
                    <Input id="email" name="email" type="email" placeholder="email@example.com" className={createState.errors?.email ? 'border-destructive' : ''} required />
                    {createState.errors?.email && <p className="text-xs text-destructive">{createState.errors.email[0]}</p>}
                  </div>
                  <div className="grid gap-2">
                    <Label className={createState.errors?.roleIds ? 'text-destructive' : ''}>Assign Roles</Label>
                    <div className={`grid grid-cols-2 gap-2 p-2 border rounded-md ${createState.errors?.roleIds ? 'border-destructive' : ''}`}>
                      {roles.map((role) => (
                        <div key={role.id} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={`role-${role.id}`}
                            name="roles"
                            value={role.id}
                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                          />
                          <Label htmlFor={`role-${role.id}`} className="font-normal">{role.name}</Label>
                        </div>
                      ))}
                    </div>
                    {createState.errors?.roleIds && <p className="text-xs text-destructive">{createState.errors.roleIds[0]}</p>}
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
                  <Button type="submit" disabled={isCreatePending}>
                    {isCreatePending ? <Spinner className="h-4 w-4" /> : 'Create User'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>
      
      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
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

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <form action={editAction}>
            <DialogHeader>
              <DialogTitle>Edit User</DialogTitle>
              <DialogDescription>
                Update user details and access roles.
              </DialogDescription>
            </DialogHeader>
            {currentUser && (
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4 items-start">
                  <div className="grid gap-2">
                    <Label htmlFor="edit-firstName" className={editState.errors?.firstName ? 'text-destructive' : ''}>First Name</Label>
                    <Input id="edit-firstName" name="firstName" defaultValue={currentUser.firstName} className={editState.errors?.firstName ? 'border-destructive' : ''} required />
                    {editState.errors?.firstName && <p className="text-xs text-destructive">{editState.errors.firstName[0]}</p>}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-lastName" className={editState.errors?.lastName ? 'text-destructive' : ''}>Last Name</Label>
                    <Input id="edit-lastName" name="lastName" defaultValue={currentUser.lastName} className={editState.errors?.lastName ? 'border-destructive' : ''} required />
                    {editState.errors?.lastName && <p className="text-xs text-destructive">{editState.errors.lastName[0]}</p>}
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-email" className={editState.errors?.email ? 'text-destructive' : ''}>Email</Label>
                  <Input id="edit-email" name="email" type="email" defaultValue={currentUser.email} className={editState.errors?.email ? 'border-destructive' : ''} required />
                  {editState.errors?.email && <p className="text-xs text-destructive">{editState.errors.email[0]}</p>}
                </div>
                <div className="flex items-center space-x-2 p-2 border rounded-md">
                  <input
                    type="checkbox"
                    id="edit-isActive"
                    name="isActive"
                    defaultChecked={currentUser.isActive}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <Label htmlFor="edit-isActive">User is active</Label>
                </div>
                <div className="grid gap-2">
                  <Label className={editState.errors?.roleIds ? 'text-destructive' : ''}>Assign Roles</Label>
                  <div className={`grid grid-cols-2 gap-2 p-2 border rounded-md ${editState.errors?.roleIds ? 'border-destructive' : ''}`}>
                    {roles.map((role) => (
                      <div key={role.id} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`edit-role-${role.id}`}
                          name="roles"
                          value={role.id}
                          defaultChecked={currentUser.roles.some(ur => ur.role.id === role.id)}
                          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <Label htmlFor={`edit-role-${role.id}`} className="font-normal">{role.name}</Label>
                      </div>
                    ))}
                  </div>
                  {editState.errors?.roleIds && <p className="text-xs text-destructive">{editState.errors.roleIds[0]}</p>}
                </div>
              </div>
            )}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={isEditPending}>
                {isEditPending ? <Spinner className="h-4 w-4" /> : 'Update User'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this user? This action cannot be undone and will permanently remove the user from the system.
            </DialogDescription>
          </DialogHeader>
          {currentUser && (
            <div className="flex items-center gap-3 p-4 border rounded-lg bg-muted/50">
              <Avatar className="h-10 w-10">
                <AvatarFallback>{currentUser.firstName[0]}{currentUser.lastName[0]}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="font-semibold text-foreground">{currentUser.firstName} {currentUser.lastName}</span>
                <span className="text-sm text-muted-foreground">{currentUser.email}</span>
              </div>
            </div>
          )}
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isDeletePending}>
              {isDeletePending ? <Spinner className="h-4 w-4" /> : 'Permanently Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
