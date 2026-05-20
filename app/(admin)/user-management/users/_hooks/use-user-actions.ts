'use client';

import { useEffect, useMemo, useCallback, useActionState } from 'react';
import { toast } from 'sonner';
import {
  createUserAction,
  deleteUserAction,
  updateUserAction,
  type UserActionState,
} from '@/app/(admin)/user-management/users/action';
import { useUsersStore } from '@/app/(admin)/user-management/users/_store/use-users-store';

const initialState: UserActionState = {
  message: null,
  success: false,
};

/**
 * Custom hook that encapsulates all server-action wiring for user CRUD.
 *
 * Returns action dispatchers and pending flags that components can consume
 * without knowing the underlying useActionState plumbing.
 */
export function useUserActions() {
  const { currentUser, closeCreate, closeEdit, closeDelete } = useUsersStore();

  // ── Create ────────────────────────────────────────────────
  const [createState, createAction, isCreatePending] = useActionState(
    createUserAction,
    initialState,
  );

  // ── Update (bound to the currently selected user) ─────────
  const updateUserActionWithId = useMemo(() => {
    if (!currentUser)
      return async (prevState: UserActionState, formData: FormData) => prevState;
    return updateUserAction.bind(null, currentUser.id);
  }, [currentUser]);

  const [editState, editAction, isEditPending] = useActionState(
    updateUserActionWithId,
    initialState,
  );

  // ── Delete ────────────────────────────────────────────────
  const [isDeletePending, setIsDeletePending] = useDeletePending();

  const handleDelete = useCallback(async () => {
    if (!currentUser) return;
    setIsDeletePending(true);
    try {
      const result = await deleteUserAction(currentUser.id);
      if (result.success) {
        toast.success(result.message || 'User deleted successfully');
        closeDelete();
      } else {
        toast.error(result.message || 'Failed to delete user');
      }
    } catch {
      toast.error('An unexpected error occurred');
    } finally {
      setIsDeletePending(false);
    }
  }, [currentUser, closeDelete, setIsDeletePending]);

  // ── Side-effect toasts ────────────────────────────────────
  useEffect(() => {
    if (createState.success) {
      toast.success(createState.message || 'User created successfully');
      closeCreate();
    } else if (createState.message && !createState.success) {
      toast.error(createState.message);
    }
  }, [createState, closeCreate]);

  useEffect(() => {
    if (editState.success) {
      toast.success(editState.message || 'User updated successfully');
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

// ── tiny helper to avoid importing useState in the main hook ──
import { useState } from 'react';

function useDeletePending() {
  return useState(false);
}
