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
import { ScrollArea } from '@/app/components/ui/scroll-area';
import { RolePermissionsForm } from './role-permissions-form';
import { UserRolesForm } from './user-roles-form';
import type { UserActionState } from '../users/action';

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

interface EditUserDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editAction: (payload: FormData) => void;
  editState: UserActionState;
  isEditPending: boolean;
  currentUser: UserWithRoles | null;
  roles: { id: string; name: string }[];
  allPermissions: { id: string; action: string; resource: string; module: string | null; description: string | null }[];
}

export function EditUserDialog({
  isOpen,
  onOpenChange,
  editAction,
  editState,
  isEditPending,
  currentUser,
  roles,
  allPermissions,
}: EditUserDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <form action={editAction} key={isOpen ? 'edit-form-' + (editState.data ? JSON.stringify(editState.data) : (currentUser?.id ?? 'initial')) : 'initial'}>
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
                  <Label htmlFor="edit-firstName" className={editState.errors?.firstName ? 'text-destructive' : ''}>First Name <span className="text-red-500 ml-0.5">*</span></Label>
                  <Input id="edit-firstName" name="firstName" defaultValue={editState.errors?.firstName ? '' : (editState.data?.firstName ?? currentUser.firstName)} className={editState.errors?.firstName ? 'border-destructive' : ''} required />
                  {editState.errors?.firstName && <p className="text-xs text-destructive">{editState.errors.firstName[0]}</p>}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-lastName" className={editState.errors?.lastName ? 'text-destructive' : ''}>Last Name <span className="text-red-500 ml-0.5">*</span></Label>
                  <Input id="edit-lastName" name="lastName" defaultValue={editState.errors?.lastName ? '' : (editState.data?.lastName ?? currentUser.lastName)} className={editState.errors?.lastName ? 'border-destructive' : ''} required />
                  {editState.errors?.lastName && <p className="text-xs text-destructive">{editState.errors.lastName[0]}</p>}
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-email" className={editState.errors?.email ? 'text-destructive' : ''}>Email <span className="text-red-500 ml-0.5">*</span></Label>
                <Input id="edit-email" name="email" type="email" defaultValue={editState.errors?.email ? '' : (editState.data?.email ?? currentUser.email)} className={editState.errors?.email ? 'border-destructive' : ''} required />
                {editState.errors?.email && <p className="text-xs text-destructive">{editState.errors.email[0]}</p>}
              </div>
              <div className="flex items-center space-x-2 p-2 border rounded-md">
                <input
                  type="checkbox"
                  id="edit-isActive"
                  name="isActive"
                  defaultChecked={editState.errors?.isActive ? currentUser.isActive : (editState.data?.isActive ?? currentUser.isActive)}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <Label htmlFor="edit-isActive">User is active</Label>
              </div>
              <UserRolesForm
                roles={roles}
                selectedRoleIds={editState.data?.roleIds ?? currentUser.roles.map(ur => ur.role.id)}
                errors={editState.errors?.roleIds}
                idPrefix="edit-user"
              />

              <RolePermissionsForm
                allPermissions={allPermissions}
                selectedPermissionIds={editState.data?.permissionIds ?? currentUser.permissions.map(p => p.permissionId)}
                idPrefix="edit-user"
              />
            </div>
          )}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={isEditPending}>
              {isEditPending ? <Spinner className="h-4 w-4" /> : 'Update User'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
