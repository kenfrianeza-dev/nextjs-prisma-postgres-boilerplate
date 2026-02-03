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
import { ScrollArea } from '@/app/components/ui/scroll-area';
import type { UserActionState } from '../users/action';

interface CreateUserDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  createAction: (payload: FormData) => void;
  createState: UserActionState;
  isCreatePending: boolean;
  roles: { id: string; name: string }[];
}

export function CreateUserDialog({
  isOpen,
  onOpenChange,
  createAction,
  createState,
  isCreatePending,
  roles,
}: CreateUserDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" /> Create User
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
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
            <div className="grid gap-2">
              <Label className={createState.errors?.roleIds ? 'text-destructive' : ''}>Assign Roles <span className="text-red-500 ml-0.5">*</span></Label>
              <ScrollArea className="h-[300px] border rounded-md p-2">
                <div className={`grid grid-cols-2 gap-2 p-2 ${createState.errors?.roleIds ? 'border-destructive' : ''}`}>
                  {roles.map((role) => (
                    <div key={role.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`role-${role.id}`}
                        name="roles"
                        value={role.id}
                        defaultChecked={createState.errors?.roleIds ? false : createState.data?.roleIds?.includes(role.id)}
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <Label htmlFor={`role-${role.id}`} className="font-normal">{role.name}</Label>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              {createState.errors?.roleIds && <p className="text-xs text-destructive">{createState.errors.roleIds[0]}</p>}
            </div>
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
