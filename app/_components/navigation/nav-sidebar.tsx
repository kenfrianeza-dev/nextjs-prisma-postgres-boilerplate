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
import { NAVIGATIONS } from "@/app/config/navigation/navigation-constants"
import { SIDEBAR_CONFIG } from "@/app/config/navigation/navigation-config"
import { getAuthorizedSidebar } from "@/app/config/navigation/navigation-utils"

function AppSidebar({
  user,
  permissions,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  user?: {
    name?: string
    email?: string
    avatar?: string
  }
  permissions?: string[]
}) {
  const categories = React.useMemo(
    () => getAuthorizedSidebar(SIDEBAR_CONFIG, permissions),
    [permissions]
  );

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="flex items-center justify-center p-2">
        <TeamSwitcher teams={NAVIGATIONS.teams} />
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
