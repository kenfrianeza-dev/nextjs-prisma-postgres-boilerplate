import { Container, ContainerHeader } from "@/app/components/container";
import { DashboardClient } from "./_components/dashboard-client";
import type { DashboardData } from "./_types";

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
    { name: "Jan", total: Math.floor(Math.random() * 5000) + 1000 },
    { name: "Feb", total: Math.floor(Math.random() * 5000) + 1000 },
    { name: "Mar", total: Math.floor(Math.random() * 5000) + 1000 },
    { name: "Apr", total: Math.floor(Math.random() * 5000) + 1000 },
    { name: "May", total: Math.floor(Math.random() * 5000) + 1000 },
    { name: "Jun", total: Math.floor(Math.random() * 5000) + 1000 },
    { name: "Jul", total: Math.floor(Math.random() * 5000) + 1000 },
    { name: "Aug", total: Math.floor(Math.random() * 5000) + 1000 },
    { name: "Sep", total: Math.floor(Math.random() * 5000) + 1000 },
    { name: "Oct", total: Math.floor(Math.random() * 5000) + 1000 },
    { name: "Nov", total: Math.floor(Math.random() * 5000) + 1000 },
    { name: "Dec", total: Math.floor(Math.random() * 5000) + 1000 },
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
