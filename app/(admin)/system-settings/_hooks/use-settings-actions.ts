'use client';

import { useCallback } from 'react';
import { toast } from 'sonner';
import { saveSetting } from '@/app/(admin)/system-settings/action';
import { useSettingsStore } from '@/app/(admin)/system-settings/_store/use-settings-store';

/**
 * Custom hook that encapsulates the settings save action.
 *
 * Returns a form submit handler that:
 *  1. Sets the saving key in the Zustand store.
 *  2. Calls the server action.
 *  3. Shows a toast on success/failure.
 *  4. Clears the saving key.
 */
export function useSettingsActions() {
  const { setSavingKey } = useSettingsStore();

  const handleSave = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      const key = formData.get('key') as string;

      setSavingKey(key);
      const result = await saveSetting(formData);
      setSavingKey(null);

      if (result.success) {
        toast.success('Setting saved successfully.', {
          duration: 1500,
          position: 'top-right',
        });
      } else {
        toast.error('Failed to save setting.', {
          duration: 1500,
          position: 'top-right',
        });
      }
    },
    [setSavingKey],
  );

  return { handleSave };
}
