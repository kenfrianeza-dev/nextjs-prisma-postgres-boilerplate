'use client';

import { Copy, Edit, MoreHorizontal, Trash } from 'lucide-react';
import { Button } from '@/app/_components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/app/_components/ui/dropdown-menu';
import { toast } from 'sonner';
import { useRolesStore } from '@/app/(admin)/user-management/roles-and-permissions/_store/use-roles-store';
import type { RoleWithPermissions } from '@/app/(admin)/user-management/roles-and-permissions/_types';

interface RoleActionsCellProps {
  role: RoleWithPermissions;
  canUpdate: boolean;
  canDelete: boolean;
}

/**
 * Per-row actions dropdown for the roles table.
 *
 * Reads the Zustand store actions directly — no callback props needed.
 */
export function RoleActionsCell({ role, canUpdate, canDelete }: RoleActionsCellProps) {
  const { openEdit, openDelete } = useRolesStore();

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
            <DropdownMenuItem onClick={() => openEdit(role)}>
              <Edit className="mr-2 h-4 w-4" /> Edit Role
            </DropdownMenuItem>
          )}
          {canDelete && (
            <DropdownMenuItem
              className="text-red-500 focus:text-red-400 font-medium"
              onClick={() => openDelete(role)}
            >
              <Trash className="mr-2 h-4 w-4 text-red-500 focus:text-red-400" /> Delete Role
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
