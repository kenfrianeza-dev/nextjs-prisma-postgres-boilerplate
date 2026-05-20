import { Container, ContainerHeader } from "@/app/_components/container";
import { DashboardClient } from "@/app/(admin)/dashboard/_components/dashboard-client";
import type { DashboardData } from "@/app/(admin)/dashboard/_types";

// Dummy data for the dashboard
const dummyDashboardData: DashboardData = {
  stats: [
    {
      title: "Total Revenue",
      value: "$45,231.89",
      description: "from last month",
      trend: "up",
      trendValue: "+20.1%",
    },
    {
      title: "Subscriptions",
      value: "+2350",
      description: "from last month",
      trend: "up",
      trendValue: "+180.1%",
    },
    {
      title: "Sales",
      value: "+12,234",
      description: "from last month",
      trend: "up",
      trendValue: "+19%",
    },
    {
      title: "Active Now",
      value: "+573",
      description: "since last hour",
      trend: "up",
      trendValue: "+201",
    },
  ],
  chartData: [
    { name: "Jan", total: 4000 },
    { name: "Feb", total: 3000 },
    { name: "Mar", total: 2000 },
    { name: "Apr", total: 2780 },
    { name: "May", total: 1890 },
    { name: "Jun", total: 2390 },
    { name: "Jul", total: 3490 },
    { name: "Aug", total: 4200 },
    { name: "Sep", total: 3800 },
    { name: "Oct", total: 4100 },
    { name: "Nov", total: 4900 },
    { name: "Dec", total: 5200 },
  ],
};

function DashboardPage() {
  return (
    <Container className="space-y-4">
      <ContainerHeader title="Dashboard" description="Overview of your system metrics." />
      <DashboardClient initialData={dummyDashboardData} />
    </Container>
  );
}

export default DashboardPage;
