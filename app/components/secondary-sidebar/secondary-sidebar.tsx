import { LucideIcon } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { cn } from "@/app/lib/utils";
import { PermissionEngine } from "@/domain/shared/permission.engine";

export type MenuItems = {
  title: string;
  description?: string;
  icon: LucideIcon;
  slug?: string;
  permission?: string;
}

export const SecondarySidebar = ({
  menuItems,
  className,
  activeTab,
  onTabChange,
  permissions = []
}: {
  menuItems?: MenuItems[],
  className?: string,
  activeTab?: string,
  onTabChange?: (tab: string) => void,
  permissions?: string[]
}) => {
  return (
    <aside className={cn("w-64 border-r dark:bg-background h-full flex flex-col shrink-0", className)}>
      <nav className="flex-1 overflow-y-auto">
        <div>
          {menuItems
            ?.filter((item: MenuItems) => PermissionEngine.has(permissions, item.permission))
            ?.map((item: MenuItems) => (
              <Button
                key={item?.title}
                variant={activeTab === item?.title ? "secondary" : "ghost"}
                className={cn(
                  "w-full h-20 flex justify-start items-center gap-4 rounded-none px-4.5 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                  activeTab === item?.title && "bg-secondary"
                )}
                onClick={() => onTabChange?.(item?.title)}
              >
                <item.icon className="h-4 w-4" />
                <div className="flex flex-col items-start justify-start">
                  {item?.title}
                  {item?.description && <span className="text-xs text-muted-foreground text-wrap text-start">{item?.description}</span>}
                </div>
              </Button>
            ))}
        </div>
      </nav>
    </aside>
  );
};