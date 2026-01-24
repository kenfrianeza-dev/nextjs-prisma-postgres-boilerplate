"use client"

import { Container } from '@/app/components/container';
import { MenuItems } from '@/app/components/secondary-sidebar/secondary-sidebar';
import { Palette, Settings } from 'lucide-react';
import { General, Appearance } from "@/app/(admin)/system-settings/tabs";
import { useState } from 'react';

const ALL_MENU_ITEMS: MenuItems[] = [
  { 
    title: "General", 
    description: "Manage your account settings", 
    icon: Settings,
    permission: "read:system-settings.general"
  },
  { 
    title: "Appearance", 
    description: "Customize your theme", 
    icon: Palette,
    permission: "read:system-settings.appearance"
  },
];

export default function SettingsClient({ permissions }: { permissions: string[] }) {
  const filteredMenuItems = ALL_MENU_ITEMS.filter(item => 
    !item.permission || permissions.includes(item.permission) || permissions.includes("*:*")
  );

  const [activeTab, setActiveTab] = useState(filteredMenuItems[0]?.title || "General");

  const renderContent = () => {
    switch (activeTab) {
      case "General":
        return permissions.includes("read:system-settings.general") || permissions.includes("*:*") ? <General /> : null;
      case "Appearance":
        return permissions.includes("read:system-settings.appearance") || permissions.includes("*:*") ? <Appearance /> : null;
      default:
        return null;
    }
  }

  return (
    <Container 
      menuItems={filteredMenuItems} 
      activeTab={activeTab} 
      onTabChange={setActiveTab}
    >
      {renderContent()}
    </Container>
  );
}
