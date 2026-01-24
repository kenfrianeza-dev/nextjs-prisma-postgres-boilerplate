import { Container } from "@/app/components/container";

function DashboardPage() {
  return (
    <Container>
      <div className="flex flex-1 flex-col gap-4">
        <div className="grid auto-rows-min gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 sm:border sm:p-4 sm:rounded-md">
          <div className="bg-muted/50 aspect-video rounded-xl animate-pulse" />
          <div className="bg-muted/50 aspect-video rounded-xl animate-pulse" />
          <div className="bg-muted/50 aspect-video rounded-xl animate-pulse" />
          <div className="bg-muted/50 aspect-video rounded-xl animate-pulse" />
        </div>
      </div>
    </Container>
  );
}

export default DashboardPage;
