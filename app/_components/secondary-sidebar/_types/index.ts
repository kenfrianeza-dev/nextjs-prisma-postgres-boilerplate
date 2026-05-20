import { LucideIcon } from "lucide-react";

export type MenuItems = {
  title: string;
  description?: string;
  icon: LucideIcon;
  slug?: string;
  permission?: string;
}