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
import { Spinner } from '@/app/components/ui/spinner';
import { Avatar, AvatarFallback } from '@/app/components/ui/avatar';

type UserWithRoles = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
};

interface DeleteUserDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onDelete: () => void;
  isDeletePending: boolean;
  currentUser: UserWithRoles | null;
}

export function DeleteUserDialog({
  isOpen,
  onOpenChange,
  onDelete,
  isDeletePending,
  currentUser,
}: DeleteUserDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
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
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button variant="destructive" onClick={onDelete} disabled={isDeletePending}>
            {isDeletePending ? <Spinner className="h-4 w-4" /> : 'Permanently Delete'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
