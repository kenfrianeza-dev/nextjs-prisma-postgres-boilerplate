"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import { Home } from "lucide-react"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/app/_components/ui/breadcrumb"
import { SIDEBAR_CONFIG } from "@/app/config/navigation/navigation-config"
import { getAllNavItems } from "@/app/config/navigation/navigation-utils"
import { formatLabel } from "@/app/utils"

export function DynamicBreadcrumbs() {
  const pathname = usePathname()
  
  // Split pathname into segments and filter out empty strings
  const segments = pathname.split("/").filter((segment) => segment !== "")

  // Flatten all NavItems across all categories once for slug lookups
  const allNavItems = getAllNavItems(SIDEBAR_CONFIG);

  // Helper to check if a route segment should be clickable
  const isRouteClickable = (segment: string) => {
    const navItem = allNavItems.find((item) => item.slug === segment);

    if (navItem) {
      // If it has children but no permission of its own, it's a grouping/container segment
      if (navItem.children.length > 0 && !navItem.permission) {
        return false;
      }
    }

    return true;
  };

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem className="block">
          <BreadcrumbLink href="/dashboard" className="flex items-center gap-1">
            <Home className="h-3.5 w-3.5" />
          </BreadcrumbLink>
        </BreadcrumbItem>
        
        {segments.length > 0 && <BreadcrumbSeparator className="block" />}

        {segments.map((segment, index) => {
          const href = `/${segments.slice(0, index + 1).join("/")}`
          const isLast = index === segments.length - 1
          const label = formatLabel(segment)
          const isClickable = isRouteClickable(segment)

          return (
            <React.Fragment key={href}>
              <BreadcrumbItem>
                {isLast || !isClickable ? (
                  <BreadcrumbPage>{label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href={href}>{label}</BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator className="hidden md:block" />}
            </React.Fragment>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
