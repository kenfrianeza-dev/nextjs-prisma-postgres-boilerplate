'use client';

import { create } from 'zustand';

/**
 * Zustand store for the System Settings page UI state.
 *
 * Centralises the active sidebar tab and the per-key saving indicator
 * so that sibling components (sidebar, setting cards) can communicate
 * without prop-drilling through the orchestrator.
 */

interface SettingsStoreState {
  // Sidebar navigation
  activeTab: string;
  setActiveTab: (tab: string) => void;

  // Per-key saving indicator (which setting key is currently being saved)
  savingKey: string | null;
  setSavingKey: (key: string | null) => void;
}

export const useSettingsStore = create<SettingsStoreState>((set) => ({
  activeTab: '',
  setActiveTab: (tab) => set({ activeTab: tab }),

  savingKey: null,
  setSavingKey: (key) => set({ savingKey: key }),
}));
