'use client';

import { ContainerHeader } from '@/app/components/container';
import { SettingCard } from './setting-card';
import type { Category } from '../_types';

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
          <SettingCard
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
