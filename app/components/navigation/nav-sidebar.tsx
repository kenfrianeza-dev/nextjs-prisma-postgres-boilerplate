"use client"

import * as React from "react"

import { NavMain, NavUser, TeamSwitcher } from "@/app/components/navigation"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/app/components/ui/sidebar"
import { NAVIGATIONS } from "@/app/config/navigation-constants"

const navigations = NAVIGATIONS;

import { MODULES } from "@/app/config/modules-constants"
import { mapModulesToNavItems } from "@/app/config/navigation-utils"

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
  const items = React.useMemo(() =>
    mapModulesToNavItems(MODULES, permissions),
    [permissions]
  );

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={navigations.teams} />
      </SidebarHeader>
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
