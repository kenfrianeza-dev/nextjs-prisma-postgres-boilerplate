"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, type LucideIcon } from "lucide-react"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/app/_components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/app/_components/ui/sidebar"
import { NavUICategory } from "@/app/config/navigation/navigation-utils";

// ---------------------------------------------------------------------------
// Types (mirrored from NavUICategory for prop clarity)
// ---------------------------------------------------------------------------

interface NavSubItem {
  title: string;
  url: string;
}

interface NavItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  isActive?: boolean;
  items?: NavSubItem[];
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function NavMain({
  categories,
}: {
  categories: NavUICategory[];
}) {
  const pathname = usePathname();
  const { isMobile, setOpenMobile, open, setOpen } = useSidebar();

  const isActive = (url: string) => pathname === url;

  const isChildActive = (items?: NavSubItem[]) =>
    items?.some((sub) => pathname === sub.url) ?? false;

  const closeSidebarOnMobile = () => {
    if (isMobile) setOpenMobile(false);
  };

  return (
    <>
      {categories.map((category) => (
        <SidebarGroup key={category.label}>
          <SidebarGroupLabel>{category.label}</SidebarGroupLabel>
          <SidebarMenu>
            {category.items.map((item: NavItem) =>
              item.items && item.items.length > 0 ? (
                <Collapsible
                  key={item.title}
                  asChild
                  defaultOpen={item.isActive || isChildActive(item.items)}
                  className="group/collapsible"
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton
                        tooltip={item.title}
                        className="cursor-pointer"
                        onClick={() => {
                          if (!open) setOpen(true);
                        }}
                      >
                        {item.icon && <item.icon />}
                        <span>{item.title}</span>
                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items.map((sub) => (
                          <SidebarMenuSubItem key={sub.title}>
                            <SidebarMenuSubButton
                              asChild
                              isActive={isActive(sub.url)}
                            >
                              <Link href={sub.url} onClick={closeSidebarOnMobile}>
                                <span>{sub.title}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              ) : (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    isActive={isActive(item.url)}
                  >
                    <Link href={item.url} onClick={closeSidebarOnMobile}>
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            )}
          </SidebarMenu>
        </SidebarGroup>
      ))}
    </>
  )
}
