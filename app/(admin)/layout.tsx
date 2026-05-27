import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { AppSidebar } from "@/app/_components/navigation";
import { DynamicBreadcrumbs } from "@/app/_components/header";
import { getAuthContext } from "@/lib/auth-context";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/app/_components/ui/sidebar";
import { SystemSettingsRepo } from "@/domain/system/system-settings.repo";

const AdminLayout = async ({ children }: { children: React.ReactNode }) => {
  const auth = await getAuthContext();
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  if (!auth || !auth.user) {
    redirect('/');
  }

  const { user, permissions } = auth;

  const sidebarUser = {
    name: `${user.firstName} ${user.lastName}`,
    email: user.email,
    avatar: "", // Placeholder or default avatar
  }

  // Fetch only the two branding keys needed for the sidebar header
  const brandSettings = await SystemSettingsRepo.getSettingsByKeys([
    "app_name",
    "app_name_short",
  ]);

  return (
    <SidebarProvider defaultOpen={defaultOpen} className="h-svh overflow-hidden">
      <AppSidebar
        user={sidebarUser}
        permissions={permissions}
        appName={brandSettings["app_name"] ?? undefined}
        appNameShort={brandSettings["app_name_short"] ?? undefined}
      />
      <SidebarInset className="overflow-hidden">
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 px-4 border-b border-b-accent">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <DynamicBreadcrumbs />
          </div>
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
};

export default AdminLayout;