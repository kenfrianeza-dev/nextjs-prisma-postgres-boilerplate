'use client';

import { useEffect } from 'react';
import { DashboardStats } from '@/app/(admin)/dashboard/_components/dashboard-stats';
import { DashboardChart } from '@/app/(admin)/dashboard/_components/dashboard-chart';
import { useDashboardStore } from '@/app/(admin)/dashboard/_store/use-dashboard-store';
import type { DashboardData } from '@/app/(admin)/dashboard/_types';

interface DashboardClientProps {
  initialData: DashboardData;
}

export function DashboardClient({ initialData }: DashboardClientProps) {
  const { setData } = useDashboardStore();

  useEffect(() => {
    setData(initialData);
  }, [initialData, setData]);

  return (
    <div className="flex flex-1 flex-col gap-4">
      <DashboardStats />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4 lg:col-span-7">
          <DashboardChart />
        </div>
      </div>
    </div>
  );
}
