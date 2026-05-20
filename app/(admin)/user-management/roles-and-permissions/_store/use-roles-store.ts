'use client';

import { create } from 'zustand';
import type { RoleWithPermissions } from '@/app/(admin)/user-management/roles-and-permissions/_types';

/**
 * Zustand store for the Roles & Permissions page UI state.
 *
 * Centralises all dialog open/close flags and the currently-selected role
 * so that sibling components (toolbar, table rows, dialogs) can communicate
 * without prop-drilling through the orchestrator.
 */

interface RolesStoreState {
  // Dialog visibility
  isCreateOpen: boolean;
  isEditOpen: boolean;
  isDeleteOpen: boolean;

  // Currently targeted role (for edit / delete)
  currentRole: RoleWithPermissions | null;

  // Actions
  openCreate: () => void;
  closeCreate: () => void;
  openEdit: (role: RoleWithPermissions) => void;
  closeEdit: () => void;
  openDelete: (role: RoleWithPermissions) => void;
  closeDelete: () => void;
  setCurrentRole: (role: RoleWithPermissions | null) => void;
}

export const useRolesStore = create<RolesStoreState>((set) => ({
  isCreateOpen: false,
  isEditOpen: false,
  isDeleteOpen: false,
  currentRole: null,

  openCreate: () => set({ isCreateOpen: true }),
  closeCreate: () => set({ isCreateOpen: false }),

  openEdit: (role) => set({ currentRole: role, isEditOpen: true }),
  closeEdit: () => set({ isEditOpen: false }),

  openDelete: (role) => set({ currentRole: role, isDeleteOpen: true }),
  closeDelete: () => set({ isDeleteOpen: false }),

  setCurrentRole: (role) => set({ currentRole: role }),
}));
