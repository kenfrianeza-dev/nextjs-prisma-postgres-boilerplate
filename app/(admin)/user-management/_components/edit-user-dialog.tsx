'use client';

import { useState } from 'react';
import { Button } from '@/app/_components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/app/_components/ui/dialog';
import { Input } from '@/app/_components/ui/input';
import { Label } from '@/app/_components/ui/label';
import { Spinner } from '@/app/_components/ui/spinner';
import { RolePermissionsForm } from '@/app/(admin)/user-management/_components/role-permissions-form';
import { UserRolesForm } from '@/app/(admin)/user-management/_components/user-roles-form';
import type { UserActionState } from '@/app/(admin)/user-management/users/action';
import type { UserWithRoles, RoleWithPermissions } from '@/app/(admin)/user-management/users/_types';

interface EditUserDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editAction: (payload: FormData) => void;
  editState: UserActionState;
  isEditPending: boolean;
  currentUser: UserWithRoles | null;
  roles: { id: string; name: string }[];
  allPermissions: { id: string; action: string; resource: string; module: string | null; description: string | null }[];
  rolesWithPermissions: RoleWithPermissions[];
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
  rolesWithPermissions,
}: EditUserDialogProps) {
  const defaultRoleIds = editState.data?.roleIds ?? currentUser?.roles.map(ur => ur.role.id) ?? [];
  const [selectedRoleIds, setSelectedRoleIds] = useState<string[]>(defaultRoleIds);

  // Reset selectedRoleIds when dialog opens with a different user
  const handleOpenChange = (open: boolean) => {
    if (open && currentUser) {
      setSelectedRoleIds(currentUser.roles.map(ur => ur.role.id));
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] md:max-h-[85vh] flex flex-col overflow-hidden">
        <form action={editAction} key={isOpen ? 'edit-form-' + (editState.data ? JSON.stringify(editState.data) : (currentUser?.id ?? 'initial')) : 'initial'} className="flex flex-col min-h-0 flex-1 overflow-hidden">
          <DialogHeader className="shrink-0 pb-4 border-b border-accent">
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user details and access roles.
            </DialogDescription>
          </DialogHeader>
          {currentUser && (
            <div className="grid gap-4 py-4 overflow-y-auto px-1 flex-1">

              <div className="grid grid-cols-2 gap-4 items-start">
                <div className="grid gap-2">
                  <Label htmlFor="edit-firstName" className={editState.errors?.firstName ? 'text-destructive' : ''}>First Name <span className="text-red-500 ml-0.5">*</span></Label>
                  <Input id="edit-firstName" name="firstName" defaultValue={editState.errors?.firstName ? '' : (editState.data?.firstName ?? currentUser.firstName)} className={editState.errors?.firstName ? 'border-destructive' : ''} required />
                  {editState.errors?.firstName && <p className="text-xs text-destructive">{editState.errors.firstName[0]}</p>}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-middleName" className={editState.errors?.middleName ? 'text-destructive' : ''}>Middle Name</Label>
                  <Input id="edit-middleName" name="middleName" defaultValue={editState.data?.middleName ?? currentUser.middleName ?? ''} className={editState.errors?.middleName ? 'border-destructive' : ''} />
                  {editState.errors?.middleName && <p className="text-xs text-destructive">{editState.errors.middleName[0]}</p>}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 items-start">
                <div className="grid gap-2">
                  <Label htmlFor="edit-lastName" className={editState.errors?.lastName ? 'text-destructive' : ''}>Last Name <span className="text-red-500 ml-0.5">*</span></Label>
                  <Input id="edit-lastName" name="lastName" defaultValue={editState.errors?.lastName ? '' : (editState.data?.lastName ?? currentUser.lastName)} className={editState.errors?.lastName ? 'border-destructive' : ''} required />
                  {editState.errors?.lastName && <p className="text-xs text-destructive">{editState.errors.lastName[0]}</p>}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-suffixName" className={editState.errors?.suffixName ? 'text-destructive' : ''}>Suffix</Label>
                  <Input id="edit-suffixName" name="suffixName" placeholder="e.g. Jr., Sr., III" defaultValue={editState.data?.suffixName ?? currentUser.suffixName ?? ''} className={editState.errors?.suffixName ? 'border-destructive' : ''} />
                  {editState.errors?.suffixName && <p className="text-xs text-destructive">{editState.errors.suffixName[0]}</p>}
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-email" className={editState.errors?.email ? 'text-destructive' : ''}>Email <span className="text-red-500 ml-0.5">*</span></Label>
                <Input id="edit-email" name="email" type="email" defaultValue={editState.errors?.email ? '' : (editState.data?.email ?? currentUser.email)} className={editState.errors?.email ? 'border-destructive' : ''} required />
                {editState.errors?.email && <p className="text-xs text-destructive">{editState.errors.email[0]}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-phoneNumber" className={editState.errors?.phoneNumber ? 'text-destructive' : ''}>Phone Number <span className="text-red-500 ml-0.5">*</span></Label>
                <Input id="edit-phoneNumber" name="phoneNumber" type="tel" placeholder="+1-555-0123" defaultValue={editState.errors?.phoneNumber ? '' : (editState.data?.phoneNumber ?? currentUser.phoneNumber)} className={editState.errors?.phoneNumber ? 'border-destructive' : ''} required />
                {editState.errors?.phoneNumber && <p className="text-xs text-destructive">{editState.errors.phoneNumber[0]}</p>}
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
                selectedRoleIds={selectedRoleIds}
                errors={editState.errors?.roleIds}
                idPrefix="edit-user"
                onRoleChange={setSelectedRoleIds}
              />

              <RolePermissionsForm
                allPermissions={allPermissions}
                selectedPermissionIds={editState.data?.permissionIds ?? currentUser.permissions.map(p => p.permissionId)}
                idPrefix="edit-user"
                rolesWithPermissions={rolesWithPermissions}
                selectedRoleIds={selectedRoleIds}
              />
            </div>
          )}
          <DialogFooter className="shrink-0 border-t border-t-accent pt-4">
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
