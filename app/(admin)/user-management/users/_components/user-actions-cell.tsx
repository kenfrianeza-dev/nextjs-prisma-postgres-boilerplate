'use client';

import { Copy, Edit, MoreHorizontal, Trash } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { useUsersStore } from '../_store/use-users-store';
import type { UserWithRoles } from '../_types';

interface UserActionsCellProps {
  user: UserWithRoles;
  canUpdate: boolean;
  canDelete: boolean;
}

/**
 * Per-row actions dropdown extracted into its own component.
 *
 * Reads the Zustand store actions directly — no callback props needed.
 */
export function UserActionsCell({ user, canUpdate, canDelete }: UserActionsCellProps) {
  const { openEdit, openDelete } = useUsersStore();

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
            <DropdownMenuItem onClick={() => openEdit(user)}>
              <Edit className="mr-2 h-4 w-4" /> Edit User
            </DropdownMenuItem>
          )}
          {canDelete && (
            <DropdownMenuItem
              className="text-red-500 focus:text-red-400 font-medium"
              onClick={() => openDelete(user)}
            >
              <Trash className="mr-2 h-4 w-4 text-red-500 focus:text-red-400" /> Delete User
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
