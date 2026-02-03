'use client';

import { Shield } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/app/components/ui/dialog';
import { Spinner } from '@/app/components/ui/spinner';

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

interface DeleteRoleDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onDelete: () => void;
  isDeletePending: boolean;
  currentRole: RoleWithPermissions | null;
}

export function DeleteRoleDialog({
  isOpen,
  onOpenChange,
  onDelete,
  isDeletePending,
  currentRole,
}: DeleteRoleDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Role</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this role? This might affect users assigned to this role.
          </DialogDescription>
        </DialogHeader>
        {currentRole && (
          <div className="flex items-center gap-3 p-4 border rounded-lg bg-muted/50">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-foreground">{currentRole.name}</span>
              <span className="text-sm text-muted-foreground">{currentRole.permissions.length} permissions assigned</span>
            </div>
          </div>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onDelete} disabled={isDeletePending}>
            {isDeletePending ? <Spinner className="h-4 w-4" /> : 'Delete Role'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
