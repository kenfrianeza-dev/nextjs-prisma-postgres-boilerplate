"use client"

import { useState } from "react"
import { cn } from "@/app/utils"
import { SecondarySidebar } from "@/app/_components/secondary-sidebar/secondary-sidebar";
import { SecondarySidebarTrigger } from "@/app/_components/secondary-sidebar/secondary-sidebar-trigger";
import type { MenuItems } from "@/app/_components/secondary-sidebar/_types";
import type { ContainerVariant } from "@/app/_components/container/_types";

export const Container = ({
  children,
  menuItems,
  className,
  activeTab,
  onTabChange,
  permissions,
  variant = "default"
}: {
  children: React.ReactNode,
  menuItems?: MenuItems[],
  className?: string,
  activeTab?: string,
  onTabChange?: (tab: string) => void,
  permissions?: string[],
  variant?: ContainerVariant
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleTabChange = (tab: string) => {
    onTabChange?.(tab);
    setIsMobileMenuOpen(false);
  };

  const getContainerVariant = (variant: ContainerVariant) => {
    switch (variant) {
      case "background":
        return "rounded-md m-2 bg-white dark:bg-slate-950";
      case "default":
        return "";
      default:
        return "";
    }
  };

  return (
    // <div className="flex flex-col md:flex-row flex-1 w-full overflow-hidden">
    <div className={cn(`flex flex-col md:flex-row flex-1 w-full overflow-hidden ${getContainerVariant(variant)}`)}>

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
                permissions={permissions}
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
              permissions={permissions}
            />
          </div>
        </>
      )}

      {/* Main Content */}
      {/* <div className={cn("flex-1 overflow-y-auto p-4", className)}> */}
      <div className={cn(`flex-1 overflow-y-auto p-4 ${getContainerVariant(variant)}`, className)}>
        {children}
      </div>
    </div>
  )
}
