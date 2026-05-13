import {
  Palette,
  Settings,
  Building2,
  Globe,
  ShieldCheck,
  Cpu,
  ToggleLeft,
  Receipt,
  Code2,
  type LucideIcon,
} from 'lucide-react';

/**
 * Maps icon name strings (stored in the DB) to Lucide icon components.
 * Used to render the correct icon in the sidebar menu items.
 */
export const ICON_MAP: Record<string, LucideIcon> = {
  Building2,
  Globe,
  ShieldCheck,
  Palette,
  Cpu,
  ToggleLeft,
  Receipt,
  Code2,
  Settings,
};
