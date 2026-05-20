'use client';

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/_components/ui/card';
import { useDashboardStore } from '@/app/(admin)/dashboard/_store/use-dashboard-store';

const COLORS = [
  '#011A8C',
  '#344D8C'
];

export function DashboardChart() {
  const { data, isLoading } = useDashboardStore();

  if (isLoading || !data) {
    return (
      <section className='grid grid-cols-4 gap-4'>
        <Card className="col-span-4 lg:col-span-2 border-none">
          <div className="h-[465px] w-full bg-muted/50 animate-pulse rounded-md" />
        </Card>
        <Card className="col-span-4 lg:col-span-2 border-none">
          <div className="h-[465px] w-full bg-muted/50 animate-pulse rounded-md" />
        </Card>
      </section>
    );
  }

  return (
    <section className='grid grid-cols-4 gap-4'>
      <Card className="col-span-4 lg:col-span-2">
        <CardHeader>
          <CardTitle>Overview</CardTitle>
          <CardDescription>Monthly statistics overview</CardDescription>
        </CardHeader>
        <CardContent className="flex pl-2">
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={data.chartData}>
              <XAxis
                dataKey="name"
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}`}
              />
              <Tooltip
                cursor={{ fill: 'hsl(var(--muted))' }}
                contentStyle={{
                  borderRadius: '8px',
                  border: '1px solid hsl(var(--border))',
                  backgroundColor: 'hsl(var(--background))',
                  color: 'hsl(var(--foreground))'
                }}
                itemStyle={{ color: 'hsl(var(--foreground))' }}
                labelStyle={{ color: 'hsl(var(--foreground))', marginBottom: '4px' }}
              />
              <Bar
                dataKey="total"
                radius={[4, 4, 0, 0]}
              >
                {data.chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card className="col-span-4 lg:col-span-2">
        <CardHeader>
          <CardTitle>Sales</CardTitle>
          <CardDescription>Monthly sales overview</CardDescription>
        </CardHeader>
        <CardContent className="flex pl-2">
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={data.chartData}>
              <XAxis
                dataKey="name"
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}`}
              />
              <Tooltip
                cursor={{ fill: 'hsl(var(--muted))' }}
                contentStyle={{
                  borderRadius: '8px',
                  border: '1px solid hsl(var(--border))',
                  backgroundColor: 'hsl(var(--background))',
                  color: 'hsl(var(--foreground))'
                }}
                itemStyle={{ color: 'hsl(var(--foreground))' }}
                labelStyle={{ color: 'hsl(var(--foreground))', marginBottom: '4px' }}
              />
              <Bar
                dataKey="total"
                radius={[4, 4, 0, 0]}
              >
                {data.chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </section>
  );
}
