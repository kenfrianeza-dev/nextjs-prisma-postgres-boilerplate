'use client';

import { Plus } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/app/components/ui/dialog';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Spinner } from '@/app/components/ui/spinner';
import { RolePermissionsForm } from './role-permissions-form';
import type { RoleActionState } from '../roles-and-permissions/action';

type Permission = {
  id: string;
  action: string;
  resource: string;
  module: string | null;
  description: string | null;
};

interface CreateRoleDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  createAction: (payload: FormData) => void;
  createState: RoleActionState;
  isCreatePending: boolean;
  allPermissions: Permission[];
}

export function CreateRoleDialog({
  isOpen,
  onOpenChange,
  createAction,
  createState,
  isCreatePending,
  allPermissions,
}: CreateRoleDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" /> Create Role
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] gap-0 p-0">
        <form action={createAction} key={isOpen ? 'create-role-' + (createState.data ? JSON.stringify(createState.data) : 'initial') : 'initial'}>
          <DialogHeader className="p-4 pb-2">
            <DialogTitle>Create Role</DialogTitle>
            <DialogDescription>
              Define a new role and assign permissions.
            </DialogDescription>
          </DialogHeader>
          <div className="p-4 pt-2 space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="name" className={createState.errors?.name ? 'text-destructive' : ''}>
                Role Name <span className="text-red-500 ml-0.5">*</span>
              </Label>
              <Input
                id="name"
                name="name"
                placeholder="e.g. Editor"
                defaultValue={createState.data?.name}
                className={createState.errors?.name ? 'border-destructive' : ''}
                required
              />
              {createState.errors?.name && <p className="text-xs text-destructive">{createState.errors.name[0]}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                name="description"
                placeholder="Optional description"
                defaultValue={createState.data?.description ?? ''}
              />
            </div>
            <RolePermissionsForm
              allPermissions={allPermissions}
              selectedPermissionIds={createState.data?.permissionIds}
              idPrefix="create"
            />
          </div>
          <DialogFooter className="p-4 pt-0 space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isCreatePending}>
              {isCreatePending ? <Spinner className="h-4 w-4" /> : 'Create Role'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
