/**
 * Shared types for the Dashboard module.
 */

export interface DashboardStat {
  title: string;
  value: string;
  description?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
}

export interface ChartDataPoint {
  name: string;
  total: number;
}

export interface DashboardData {
  stats: DashboardStat[];
  chartData: ChartDataPoint[];
}
