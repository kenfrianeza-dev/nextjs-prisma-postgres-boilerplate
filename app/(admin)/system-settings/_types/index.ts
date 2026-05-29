/**
 * Shared types for the System Settings module.
 * Centralised here to follow the DRY principle — every component,
 * store, hook, and config imports from this single source.
 */

import type { LucideIcon } from 'lucide-react';

// ─── Domain Models ───────────────────────────────────────────

export type Setting = {
  id: string;
  key: string;
  value: string | null;
  type: string;
  description: string | null;
  isSensitive: boolean;
  metadata: any;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  settings: Setting[];
};

// ─── Component Props ─────────────────────────────────────────

export interface SettingsClientProps {
  permissions: string[];
  categories: Category[];
}
