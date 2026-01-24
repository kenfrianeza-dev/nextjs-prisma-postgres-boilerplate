import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { AppSidebar } from "@/app/components/navigation";
import { DynamicBreadcrumbs } from "@/app/components/header";
import { getAuthContext } from "@/lib/auth-context";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/app/components/ui/sidebar";
import { Separator } from "@/app/components/ui/separator";

const AdminLayout = async ({ children }: { children: React.ReactNode }) => {
  const auth = await getAuthContext();
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  // console.log(" --- Auth Context --- ");
  // console.log(auth);

  if (!auth || !auth.user) {
    redirect('/');
  }

  const { user, permissions } = auth;

  const sidebarUser = {
    name: `${user.firstName} ${user.lastName}`,
    email: user.email,
    avatar: "", // Placeholder or default avatar
  }

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar user={sidebarUser} permissions={permissions} />
      <main className="w-full">
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 px-4 border-b border-b-accent">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="-ml-1" />
              {/* <Separator
                orientation="vertical"
                className="mr-2 h-4"
              /> */}
              <DynamicBreadcrumbs />
            </div>
          </header>
        </SidebarInset>
        {children}
      </main>
    </SidebarProvider>
  );
};

export default AdminLayout;
