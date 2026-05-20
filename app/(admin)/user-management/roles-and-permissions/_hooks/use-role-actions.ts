'use client';

import { useEffect, useMemo, useCallback, useState, useActionState } from 'react';
import { toast } from 'sonner';
import {
  createRoleAction,
  deleteRoleAction,
  updateRoleAction,
} from '@/app/(admin)/user-management/roles-and-permissions/action';
import type { RoleActionState } from '@/app/(admin)/user-management/roles-and-permissions/_types';
import { useRolesStore } from '@/app/(admin)/user-management/roles-and-permissions/_store/use-roles-store';

const initialState: RoleActionState = {
  message: null,
  success: false,
};

/**
 * Custom hook that encapsulates all server-action wiring for role CRUD.
 *
 * Returns action dispatchers and pending flags that components can consume
 * without knowing the underlying useActionState plumbing.
 */
export function useRoleActions() {
  const { currentRole, closeCreate, closeEdit, closeDelete } = useRolesStore();

  // ── Create ────────────────────────────────────────────────
  const [createState, createAction, isCreatePending] = useActionState(
    createRoleAction,
    initialState,
  );

  // ── Update (bound to the currently selected role) ─────────
  const updateRoleActionWithId = useMemo(() => {
    if (!currentRole)
      return async (prevState: RoleActionState, formData: FormData) => prevState;
    return updateRoleAction.bind(null, currentRole.id);
  }, [currentRole]);

  const [editState, editAction, isEditPending] = useActionState(
    updateRoleActionWithId,
    initialState,
  );

  // ── Delete ────────────────────────────────────────────────
  const [isDeletePending, setIsDeletePending] = useState(false);

  const handleDelete = useCallback(async () => {
    if (!currentRole) return;
    setIsDeletePending(true);
    try {
      const result = await deleteRoleAction(currentRole.id);
      if (result.success) {
        toast.success(result.message || 'Role deleted successfully');
        closeDelete();
      } else {
        toast.error(result.message || 'Failed to delete role');
      }
    } catch {
      toast.error('An unexpected error occurred');
    } finally {
      setIsDeletePending(false);
    }
  }, [currentRole, closeDelete]);

  // ── Side-effect toasts ────────────────────────────────────
  useEffect(() => {
    if (createState.success) {
      toast.success(createState.message || 'Role created successfully');
      closeCreate();
    } else if (createState.message && !createState.success) {
      toast.error(createState.message);
    }
  }, [createState, closeCreate]);

  useEffect(() => {
    if (editState.success) {
      toast.success(editState.message || 'Role updated successfully');
      closeEdit();
    } else if (editState.message && !editState.success) {
      toast.error(editState.message);
    }
  }, [editState, closeEdit]);

  return {
    // Create
    createState,
    createAction,
    isCreatePending,
    // Edit
    editState,
    editAction,
    isEditPending,
    // Delete
    handleDelete,
    isDeletePending,
  };
}
