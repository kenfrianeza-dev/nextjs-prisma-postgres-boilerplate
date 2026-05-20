'use client';

import { create } from 'zustand';
import type { UserWithRoles } from '@/app/(admin)/user-management/users/_types';

/**
 * Zustand store for the Users page UI state.
 *
 * Centralises all dialog open/close flags and the currently-selected user
 * so that sibling components (toolbar, table rows, dialogs) can communicate
 * without prop-drilling through the orchestrator.
 */

interface UsersStoreState {
  // Dialog visibility
  isCreateOpen: boolean;
  isEditOpen: boolean;
  isDeleteOpen: boolean;

  // Currently targeted user (for edit / delete)
  currentUser: UserWithRoles | null;

  // Actions
  openCreate: () => void;
  closeCreate: () => void;
  openEdit: (user: UserWithRoles) => void;
  closeEdit: () => void;
  openDelete: (user: UserWithRoles) => void;
  closeDelete: () => void;
  setCurrentUser: (user: UserWithRoles | null) => void;
}

export const useUsersStore = create<UsersStoreState>((set) => ({
  isCreateOpen: false,
  isEditOpen: false,
  isDeleteOpen: false,
  currentUser: null,

  openCreate: () => set({ isCreateOpen: true }),
  closeCreate: () => set({ isCreateOpen: false }),

  openEdit: (user) => set({ currentUser: user, isEditOpen: true }),
  closeEdit: () => set({ isEditOpen: false }),

  openDelete: (user) => set({ currentUser: user, isDeleteOpen: true }),
  closeDelete: () => set({ isDeleteOpen: false }),

  setCurrentUser: (user) => set({ currentUser: user }),
}));
