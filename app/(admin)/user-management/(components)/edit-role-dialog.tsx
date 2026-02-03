'use client';

import { Button } from '@/app/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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

type RoleWithPermissions = {
  id: string;
  name: string;
  description: string | null;
  permissions: {
    permission: Permission;
  }[];
};

interface EditRoleDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editAction: (payload: FormData) => void;
  editState: RoleActionState;
  isEditPending: boolean;
  currentRole: RoleWithPermissions | null;
  allPermissions: Permission[];
}

export function EditRoleDialog({
  isOpen,
  onOpenChange,
  editAction,
  editState,
  isEditPending,
  currentRole,
  allPermissions,
}: EditRoleDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] gap-0 p-0">
        <form
          action={editAction}
          key={isOpen ? 'edit-role-' + (editState.data ? JSON.stringify(editState.data) : (currentRole?.id ?? 'initial')) : 'initial'}
        >
          <DialogHeader className="p-4 pb-2">
            <DialogTitle>Edit Role</DialogTitle>
            <DialogDescription>Update role details and permissions.</DialogDescription>
          </DialogHeader>
          {currentRole && (
            <div className="p-4 pt-2 space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name" className={editState.errors?.name ? 'text-destructive' : ''}>
                  Role Name <span className="text-red-500 ml-0.5">*</span>
                </Label>
                <Input
                  id="edit-name"
                  name="name"
                  defaultValue={editState.data?.name ?? currentRole.name}
                  className={editState.errors?.name ? 'border-destructive' : ''}
                  required
                />
                {editState.errors?.name && <p className="text-xs text-destructive">{editState.errors.name[0]}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-description">Description</Label>
                <Input
                  id="edit-description"
                  name="description"
                  defaultValue={editState.data?.description ?? currentRole.description ?? ''}
                />
              </div>
              <RolePermissionsForm
                allPermissions={allPermissions}
                selectedPermissionIds={
                  editState.data?.permissionIds ?? currentRole.permissions.map((rp) => rp.permission.id)
                }
                idPrefix="edit"
              />
            </div>
          )}
          <DialogFooter className="p-4 pt-0 sm:space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isEditPending}>
              {isEditPending ? <Spinner className="h-4 w-4" /> : 'Update Role'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
