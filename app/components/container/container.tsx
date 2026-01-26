"use client"

import { MenuItems, SecondarySidebar } from "@/app/components/secondary-sidebar/secondary-sidebar"
import { SecondarySidebarTrigger } from "@/app/components/secondary-sidebar/secondary-sidebar-trigger"
import { cn } from "@/app/lib/utils"
import { useState } from "react"

export const Container = ({
  children,
  menuItems,
  className,
  activeTab,
  onTabChange
}: {
  children: React.ReactNode,
  menuItems?: MenuItems[],
  className?: string,
  activeTab?: string,
  onTabChange?: (tab: string) => void
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleTabChange = (tab: string) => {
    onTabChange?.(tab);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="flex flex-col md:flex-row flex-1 w-full overflow-hidden">

      {/* Sidebar Content, The sidebar is hidden on mobile and shown on desktop, if it exists. */}
      {menuItems && (
        <>
          {/* Mobile-View Secondary Sidebar */}
          <div className="md:hidden flex items-center p-2 border-b bg-background shrink-0">
            <SecondarySidebarTrigger open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SecondarySidebar
                menuItems={menuItems}
                className="border-none w-full"
                activeTab={activeTab}
                onTabChange={handleTabChange}
              />
            </SecondarySidebarTrigger>
            <span className="text-sm">Settings</span>
          </div>

          {/* Desktop-View Secondary Sidebar */}
          <div className="hidden md:block">
            <SecondarySidebar
              menuItems={menuItems}
              activeTab={activeTab}
              onTabChange={onTabChange}
            />
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
