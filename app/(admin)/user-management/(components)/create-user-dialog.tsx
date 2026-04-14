'use client';

import { useState } from 'react';
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
import { ScrollArea } from '@/app/components/ui/scroll-area';
import { RolePermissionsForm } from './role-permissions-form';
import { UserRolesForm } from './user-roles-form';
import type { UserActionState } from '../users/action';

type RoleWithPermissions = {
  id: string;
  name: string;
  permissions: {
    permission: {
      id: string;
    };
  }[];
};

interface CreateUserDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  createAction: (payload: FormData) => void;
  createState: UserActionState;
  isCreatePending: boolean;
  roles: { id: string; name: string }[];
  allPermissions: { id: string; action: string; resource: string; module: string | null; description: string | null }[];
  rolesWithPermissions: RoleWithPermissions[];
}

export function CreateUserDialog({
  isOpen,
  onOpenChange,
  createAction,
  createState,
  isCreatePending,
  roles,
  allPermissions,
  rolesWithPermissions,
}: CreateUserDialogProps) {
  const [selectedRoleIds, setSelectedRoleIds] = useState<string[]>(createState.data?.roleIds ?? []);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" /> Create User
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <form action={createAction} key={isOpen ? 'create-form-' + (createState.data ? JSON.stringify(createState.data) : 'initial') : 'initial'}>
          <DialogHeader>
            <DialogTitle>Create User</DialogTitle>
            <DialogDescription>
              Fill in the details to create a new user.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4 items-start">
              <div className="grid gap-2">
                <Label htmlFor="firstName" className={createState.errors?.firstName ? 'text-destructive' : ''}>First Name <span className="text-red-500 ml-0.5">*</span></Label>
                <Input id="firstName" name="firstName" defaultValue={createState.errors?.firstName ? '' : createState.data?.firstName} className={createState.errors?.firstName ? 'border-destructive' : ''} required />
                {createState.errors?.firstName && <p className="text-xs text-destructive">{createState.errors.firstName[0]}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="lastName" className={createState.errors?.lastName ? 'text-destructive' : ''}>Last Name <span className="text-red-500 ml-0.5">*</span></Label>
                <Input id="lastName" name="lastName" defaultValue={createState.errors?.lastName ? '' : createState.data?.lastName} className={createState.errors?.lastName ? 'border-destructive' : ''} required />
                {createState.errors?.lastName && <p className="text-xs text-destructive">{createState.errors.lastName[0]}</p>}
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email" className={createState.errors?.email ? 'text-destructive' : ''}>Email <span className="text-red-500 ml-0.5">*</span></Label>
              <Input id="email" name="email" type="email" placeholder="email@example.com" defaultValue={createState.errors?.email ? '' : createState.data?.email} className={createState.errors?.email ? 'border-destructive' : ''} required />
              {createState.errors?.email && <p className="text-xs text-destructive">{createState.errors.email[0]}</p>}
            </div>
            <UserRolesForm
              roles={roles}
              selectedRoleIds={selectedRoleIds}
              errors={createState.errors?.roleIds}
              idPrefix="create-user"
              onRoleChange={setSelectedRoleIds}
            />
            <RolePermissionsForm 
              allPermissions={allPermissions} 
              selectedPermissionIds={createState.data?.permissionIds}
              idPrefix="create-user"
              rolesWithPermissions={rolesWithPermissions}
              selectedRoleIds={selectedRoleIds}
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={isCreatePending}>
              {isCreatePending ? <Spinner className="h-4 w-4" /> : 'Create User'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
