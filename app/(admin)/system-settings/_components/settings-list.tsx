'use client';

import { ContainerHeader } from '@/app/_components/container';
import { SettingsCard } from '@/app/(admin)/system-settings/_components/settings-card';
import type { Category } from '@/app/(admin)/system-settings/_types';

interface SettingsListProps {
  category: Category;
  canUpdate: boolean;
  onSave: (e: React.FormEvent<HTMLFormElement>) => void;
}

/**
 * Renders the header and grid of setting cards for the active category.
 */
export function SettingsList({ category, canUpdate, onSave }: SettingsListProps) {
  return (
    <>
      <ContainerHeader
        title={category.name}
        description={category.description || ''}
      />
      <div className="grid gap-4 pb-4">
        {category.settings.map((setting) => (
          <SettingsCard
            key={setting.id}
            setting={setting}
            canUpdate={canUpdate}
            onSave={onSave}
          />
        ))}
      </div>
    </>
  );
}
