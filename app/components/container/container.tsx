import { MenuItems, SecondarySidebar } from "@/app/components/secondary-sidebar/secondary-sidebar"
import { SecondarySidebarTrigger } from "@/app/components/secondary-sidebar/secondary-sidebar-trigger"
import { cn } from "@/app/lib/utils"

export const Container = ({ children, menuItems, className }: { children: React.ReactNode, menuItems?: MenuItems[], className?: string }) => {
  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-4rem)] w-full overflow-hidden">

      {/* Sidebar Content, The sidebar is hidden on mobile and shown on desktop, if it exists. */}
      {menuItems && (
        <>
          {/* Mobile-View Secondary Sidebar */}
          <div className="md:hidden flex items-center p-2 border-b bg-background shrink-0">
            <SecondarySidebarTrigger>
              <SecondarySidebar menuItems={menuItems} className="border-none w-full" />
            </SecondarySidebarTrigger>
            <span className="text-sm">Settings</span>
          </div>

          {/* Desktop-View Secondary Sidebar */}
          <div className="hidden md:block">
            <SecondarySidebar menuItems={menuItems} />
          </div>
        </>
      )}

      {/* Main Content */}
      <div className={cn("flex-1 overflow-y-auto p-4", className)}>
        {children}
      </div>
    </div>
  )
}
