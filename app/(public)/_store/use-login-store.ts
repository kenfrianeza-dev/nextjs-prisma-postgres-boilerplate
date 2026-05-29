'use client';

import { create } from 'zustand';

/**
 * Zustand store for the Login page UI state.
 *
 * Centralises all UI flags so that sibling components
 * can communicate without prop-drilling.
 */

interface LoginStoreState {
  // Password visibility toggle
  isPasswordVisible: boolean;
  togglePasswordVisibility: () => void;

  // Loading state for OAuth buttons
  oauthProvider: string | null;
  setOauthProvider: (provider: string | null) => void;
}

export const useLoginStore = create<LoginStoreState>((set) => ({
  isPasswordVisible: false,
  togglePasswordVisibility: () =>
    set((state) => ({ isPasswordVisible: !state.isPasswordVisible })),

  oauthProvider: null,
  setOauthProvider: (provider) => set({ oauthProvider: provider }),
}));
