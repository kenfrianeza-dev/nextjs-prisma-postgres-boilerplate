'use client';

import { useEffect } from 'react';
import { Settings } from 'lucide-react';
import { Container } from '@/app/_components/container';
import { SystemSettingsPolicy } from '@/domain/system/system-settings.policy';
import { useSettingsStore } from '@/app/(admin)/system-settings/_store/use-settings-store';
import { useSettingsActions } from '@/app/(admin)/system-settings/_hooks/use-settings-actions';
import { ICON_MAP } from '@/app/(admin)/system-settings/_components/settings-icon-map';
import { SettingsList } from '@/app/(admin)/system-settings/_components/settings-list';
import { SettingsEmptyState } from '@/app/(admin)/system-settings/_components/settings-empty-state';
import type { MenuItems } from '@/app/_components/secondary-sidebar/_types';
import type { SettingsClientProps } from '@/app/(admin)/system-settings/_types';

/**
 * Client-side orchestrator for the System Settings page.
 *
 * Responsibilities:
 *  1. Wire the Zustand store, server-action hook, and sidebar together.
 *  2. Compose the child components (sidebar → list / empty-state).
 *
 * All rendering, types, and action logic live in their own
 * dedicated files under _components/, _hooks/, _store/, and _types/.
 */
export default function SettingsClient({ permissions, categories }: SettingsClientProps) {
  // ── Sidebar menu items ────────────────────────────────────
  const menuItems: MenuItems[] = categories.map((cat) => ({
    title: cat.name,
    description: cat.description || undefined,
    icon: ICON_MAP[cat.icon as string] || Settings,
    slug: cat.slug,
    permission: `read:system-settings.${cat.slug}`,
  }));

  // ── Zustand store ─────────────────────────────────────────
  const { activeTab, setActiveTab } = useSettingsStore();

  // Initialise the active tab to the first category on mount
  useEffect(() => {
    if (!activeTab && menuItems.length > 0) {
      setActiveTab(menuItems[0].title);
    }
  }, [activeTab, menuItems, setActiveTab]);

  // ── Derived state ─────────────────────────────────────────
  const activeCategory = categories.find((cat) => cat.name === activeTab);
  const canUpdate = activeCategory
    ? SystemSettingsPolicy.canUpdateByCategory(permissions, activeCategory.slug)
    : false;

  // ── Server action hook ────────────────────────────────────
  const { handleSave } = useSettingsActions();

  // ── Compose ───────────────────────────────────────────────
  return (
    <Container
      menuItems={menuItems}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      permissions={permissions}
    >
      <div className="max-w-full h-full space-y-4">
        {activeCategory ? (
          <SettingsList
            category={activeCategory}
            canUpdate={canUpdate}
            onSave={handleSave}
          />
        ) : (
          <SettingsEmptyState />
        )}
      </div>
    </Container>
  );
}
