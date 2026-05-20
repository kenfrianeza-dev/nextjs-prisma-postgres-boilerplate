'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/app/_components/ui/card';
import { useDashboardStore } from '@/app/(admin)/dashboard/_store/use-dashboard-store';
import { DollarSign, Users, CreditCard, Activity } from 'lucide-react';
import { cn } from '@/app/utils';

const icons = [
  <DollarSign key="1" className="h-4 w-4 text-emerald-500" />,
  <Users key="2" className="h-4 w-4 text-blue-500" />,
  <CreditCard key="3" className="h-4 w-4 text-amber-500" />,
  <Activity key="4" className="h-4 w-4 text-rose-500" />
];

export function DashboardStats() {
  const { data, isLoading } = useDashboardStore();

  const getBorderColor = (i: number) => {
    switch (i) {
      case 0: return 'border-t-emerald-500';
      case 1: return 'border-t-blue-500';
      case 2: return 'border-t-amber-500';
      case 3: return 'border-t-rose-500';
      default: return 'border-t-transparent';
    }
  }
  
  if (isLoading || !data) {
    return (
      <div className="grid auto-rows-min gap-4 sm:grid-cols-2 md:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-muted/50 rounded-xl animate-pulse" style={{ height: '135px' }} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid auto-rows-min gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {data.stats.map((stat, i) => (
        <Card 
          key={i} 
          className={cn("border-t-4 hover:bg-accent/25 transition", getBorderColor(i))}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {stat.title}
            </CardTitle>
            {icons[i % icons.length]}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            {stat.description && (
              <p className="text-xs text-muted-foreground mt-1">
                {stat.trend === 'up' && <span className="text-emerald-500 mr-1">↑</span>}
                {stat.trend === 'down' && <span className="text-rose-500 mr-1">↓</span>}
                {stat.trendValue && <span className="font-medium mr-1">{stat.trendValue}</span>}
                {stat.description}
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
