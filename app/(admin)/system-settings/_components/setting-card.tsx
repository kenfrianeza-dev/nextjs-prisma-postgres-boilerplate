'use client';

import { useRef, useState, useEffect } from 'react';
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
import { Switch } from '@/app/_components/ui/switch';
import { Spinner } from '@/app/_components/ui/spinner';
import { Skeleton } from '@/app/_components/ui/skeleton';
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
  const hiddenInputRef = useRef<HTMLInputElement>(null);
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  return (
    <Card className="shadow-none rounded-md border border-l-4 border-l-primary/50 border-t-primary/25 border-r-primary/25 border-b-primary/25 bg-secondary/10 hover:bg-secondary/25 transition-colors">
      <CardHeader>
        <CardTitle className="text-base">
          {setting.description || setting.key}
        </CardTitle>
        <CardDescription className="font-mono text-xs">
          {setting.key}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!mounted ? (
          <div className="flex items-end gap-4">
            <div className="flex-1">
              {setting.type === 'boolean' ? (
                <Skeleton className="h-[1.15rem] w-8 rounded-full" />
              ) : (
                <Skeleton className="h-9 w-full rounded-md" />
              )}
            </div>
            <Skeleton className="h-9 w-1/4 lg:w-1/8 rounded-md" />
          </div>
        ) : (
          <form onSubmit={onSave} className="flex items-end gap-4">
            <input type="hidden" name="key" value={setting.key} />
            <div className="flex justify-start items-start flex-1 gap-4">
              <Label htmlFor={setting.key} className="sr-only">
                Value
              </Label>

              {setting.type === 'boolean' ? (
                <div className="flex flex-col items-start gap-2 w-full py-2">
                  <Switch
                    id={setting.key}
                    defaultChecked={setting.value === 'true'}
                    onCheckedChange={(checked) => {
                      if (hiddenInputRef.current) {
                        hiddenInputRef.current.value = checked ? 'true' : 'false';
                      }
                    }}
                    disabled={!canUpdate || isSaving}
                  />
                  <input 
                    ref={hiddenInputRef}
                    type="hidden" 
                    name="value" 
                    defaultValue={setting.value === 'true' ? 'true' : 'false'} 
                  />
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
        )}
      </CardContent>
    </Card>
  );
}
