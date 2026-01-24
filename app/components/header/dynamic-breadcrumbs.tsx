"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/app/components/ui/breadcrumb"
import { Home } from "lucide-react"
import { MODULES } from "@/app/config/modules-constants"
import { formatLabel } from "@/app/lib/utils"

export function DynamicBreadcrumbs() {
  const pathname = usePathname()
  
  // Split pathname into segments and filter out empty strings
  const segments = pathname.split("/").filter((segment) => segment !== "")

  // Helper to check if a route segment should be clickable
  const isRouteClickable = (segment: string) => {
    // Find matching module or child
    const module = Object.values(MODULES).find(
      (m: any) => m.blob === segment
    ) as any

    if (module) {
      // If it has children but no permission of its own, it's likely a container/grouping segment
      if (module.children && module.children.length > 0 && !module.permission) {
        return false
      }
    }
    
    return true
  }

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
