'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/app/_components/ui/card';
import { Label } from '@/app/_components/ui/label';
import { Input } from '@/app/_components/ui/input';
import { Button } from '@/app/_components/ui/button';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/app/_components/ui/select';
import { Spinner } from '@/app/_components/ui/spinner';
import { ReadOnlyAlert } from '@/app/(admin)/system-settings/_components/read-only-alert';
import { useSettingsStore } from '@/app/(admin)/system-settings/_store/use-settings-store';
import type { Setting } from '@/app/(admin)/system-settings/_types';

interface SettingCardProps {
  setting: Setting;
  canUpdate: boolean;
  onSave: (e: React.FormEvent<HTMLFormElement>) => void;
}

/**
 * A single setting card.
 *
 * Renders the appropriate input control based on `setting.type`
 * (boolean → Select, number/string → Input), with save button
 * and read-only permission alert when applicable.
 *
 * Reads `savingKey` directly from the Zustand store.
 */
export function SettingCard({ setting, canUpdate, onSave }: SettingCardProps) {
  const savingKey = useSettingsStore((s) => s.savingKey);
  const isSaving = savingKey === setting.key;

  return (
    <Card className="shadow-none rounded-md border border-l-4 border-t border-b border-r bg-secondary/10 hover:bg-secondary/25 transition-colors">
      <CardHeader>
        <CardTitle className="text-base">
          {setting.description || setting.key}
        </CardTitle>
        <CardDescription className="font-mono text-xs">
          {setting.key}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSave} className="flex items-end gap-4">
          <input type="hidden" name="key" value={setting.key} />
          <div className="flex justify-start items-start flex-1 gap-4">
            <Label htmlFor={setting.key} className="sr-only">
              Value
            </Label>

            {setting.type === 'boolean' ? (
              <div className="flex flex-col items-start gap-2 w-full">
                <Select
                  name="value"
                  defaultValue={setting.value || 'false'}
                  disabled={!canUpdate || isSaving}
                >
                  <SelectTrigger id={setting.key}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>True or False?</SelectLabel>
                      <SelectItem value="true">True</SelectItem>
                      <SelectItem value="false">False</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {!canUpdate && <ReadOnlyAlert />}
              </div>
            ) : (
              <div className="flex flex-col items-start gap-2 w-full">
                <Input
                  id={setting.key}
                  name="value"
                  defaultValue={setting.value || ''}
                  placeholder={`Enter ${setting.description?.toLowerCase() || 'value'}`}
                  type={setting.type === 'number' ? 'number' : 'text'}
                  disabled={!canUpdate || isSaving}
                />
                {!canUpdate && <ReadOnlyAlert />}
              </div>
            )}
          </div>
          <Button
            className="w-1/4 lg:w-1/8 mb-auto"
            type="submit"
            disabled={!canUpdate || isSaving}
          >
            {isSaving ? <Spinner /> : 'Save'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
