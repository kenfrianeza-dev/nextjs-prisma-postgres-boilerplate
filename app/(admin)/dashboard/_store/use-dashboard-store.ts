import { create } from 'zustand';
import type { DashboardData } from '@/app/(admin)/dashboard/_types';

interface DashboardStore {
  data: DashboardData | null;
  isLoading: boolean;
  setData: (data: DashboardData) => void;
  setLoading: (isLoading: boolean) => void;
}

export const useDashboardStore = create<DashboardStore>((set) => ({
  data: null,
  isLoading: true,
  setData: (data) => set({ data, isLoading: false }),
  setLoading: (isLoading) => set({ isLoading }),
}));
