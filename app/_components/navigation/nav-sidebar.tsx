"use client"

import * as React from "react"
import { User } from "lucide-react"
import { NavMain, NavUser, TeamSwitcher } from "@/app/_components/navigation"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarRail,
} from "@/app/_components/ui/sidebar"
import { NAVIGATIONS } from "@/app/config/navigation-constants"

const navigations = NAVIGATIONS;

import { SIDEBAR_CONFIG } from "@/app/config/navigation-config"
import { mapSidebarToNavItems } from "@/app/config/navigation-utils"

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
  const items = React.useMemo(
    () => mapSidebarToNavItems(SIDEBAR_CONFIG, permissions),
    [permissions]
  );

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="flex items-center justify-center p-2">
        <TeamSwitcher teams={navigations.teams} />
        {/* <SidebarGroupLabel>Platform</SidebarGroupLabel> */}
      </SidebarHeader>
      {/* <SidebarHeader className="flex items-center justify-center px-4 pt-4"> */}
        {/* <SidebarGroupLabel className="text-lg font-bold">HRIS</SidebarGroupLabel> */}
        {/* <p className="text-xs -mt-2 mb-2 text-muted-foreground text-center">Human Resource Information System</p> */}
      {/* </SidebarHeader> */}
      <SidebarContent>
        <NavMain items={items} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

export default AppSidebar;
