"use client"

import * as React from "react"
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton, useSidebar } from "@/app/_components/ui/sidebar"

interface SidebarBrandProps {
  /** Full organization / app name (e.g. "ABC Corporation") */
  appName?: string
  /** Short abbreviation shown in the collapsed icon (e.g. "ABC") */
  appNameShort?: string
}

/**
 * SidebarBrand replaces the old TeamSwitcher.
 * Displays the organization logo (initials) and app name in the sidebar header.
 * Shows only the initials badge when the sidebar is collapsed.
 */
export default function SidebarBrand({
  appName = "My App",
  appNameShort,
}: SidebarBrandProps) {
  const { open } = useSidebar()

  // Derive initials: use appNameShort if provided, otherwise first 3 chars of appName
  const initials = appNameShort
    ? appNameShort.slice(0, 3).toUpperCase()
    : appName.slice(0, 3).toUpperCase()

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          className="cursor-default hover:bg-transparent active:bg-transparent"
          // Not interactive — disable the hover/active states
          asChild={false}
        >
          {/* Logo / initials badge */}
          <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold tracking-wide">
            {initials}
          </div>

          {/* App name — hidden when sidebar is collapsed */}
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">{appName}</span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
