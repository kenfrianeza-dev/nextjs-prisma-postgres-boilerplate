import { LucideIcon } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { cn } from "@/app/lib/utils";

export type MenuItems = {
  title: string;
  description?: string;
  icon: LucideIcon;
}

export const SecondarySidebar = ({ menuItems, className }: { menuItems?: MenuItems[], className?: string }) => {
  return (
    <aside className={cn("w-64 border-r dark:bg-background h-full flex flex-col shrink-0", className)}>
      <nav className="flex-1 overflow-y-auto">
        <div className="space-y-1">
          {menuItems?.map((item) => (
            <Button
              key={item?.title}
              variant="ghost"
              className="w-full h-16 flex justify-start items-center gap-4 rounded-none px-4.5 text-sm font-medium transition-colors hover:bg-accent/50 hover:text-accent-foreground"
            >
              <item.icon className="h-4 w-4" />
              <div className="flex flex-col items-start justify-start">
                {item?.title}
                {item?.description && <span className="text-xs text-muted-foreground">{item?.description}</span>}
              </div>
            </Button>
          ))}
        </div>
      </nav>
    </aside>
  );
};