"use client"

import * as React from "react"
import { NavMain, NavUser, TeamSwitcher } from "@/app/_components/navigation"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/app/_components/ui/sidebar"
import { SIDEBAR_CONFIG } from "@/app/config/navigation/navigation-config"
import { getAuthorizedSidebar } from "@/app/config/navigation/navigation-utils"

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user?: {
    name?: string
    email?: string
    avatar?: string
  }
  permissions?: string[]
  appName?: string
  appNameShort?: string
}

function AppSidebar({
  user,
  permissions,
  appName,
  appNameShort,
  ...props
}: AppSidebarProps) {
  const categories = React.useMemo(
    () => getAuthorizedSidebar(SIDEBAR_CONFIG, permissions),
    [permissions]
  );

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="flex items-center justify-center p-2">
        <TeamSwitcher appName={appName} appNameShort={appNameShort} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain categories={categories} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

export default AppSidebar;

