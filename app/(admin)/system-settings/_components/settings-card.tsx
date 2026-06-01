'use client';

import { useState, useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react';
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
import { Tooltip, TooltipContent, TooltipTrigger } from '@/app/_components/ui/tooltip';
import { useSettingsStore } from '@/app/(admin)/system-settings/_store/use-settings-store';
import type { Setting } from '@/app/(admin)/system-settings/_types';

interface SettingsCardProps {
  setting: Setting;
  canUpdate: boolean;
  onSave: (e: React.FormEvent<HTMLFormElement>) => void;
}

/**
 * A single setting card.
 *
 * Renders the appropriate input control based on `setting.type`
 * (boolean → Switch, number/string → Input), with save button
 * and read-only permission alert when applicable.
 *
 * When `setting.isSensitive` is true, the input renders as a password
 * field with a show/hide toggle button (same pattern as the login
 * password input).
 *
 * Reads `savingKey` directly from the Zustand store.
 */
export function SettingsCard({ setting, canUpdate, onSave }: SettingsCardProps) {
  const savingKey = useSettingsStore((s) => s.savingKey);
  const isSaving = savingKey === setting.key;
  const [mounted, setMounted] = useState<boolean>(false);
  const [isRevealed, setIsRevealed] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [currentValue, setCurrentValue] = useState<string>(setting.value || '');
  const hasChanges = currentValue !== (setting.value || '');

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    setCurrentValue(setting.value || '');
    setIsEditing(false);
    setIsRevealed(false);
  }, [setting.value]);

  const handleCancel = () => {
    setCurrentValue(setting.value || '');
    setIsEditing(false);
    setIsRevealed(false);
  };

  return (
    <Card className="shadow-none rounded-md border border-l-4 border-l-secondary border-t-secondary border-r-secondary border-b-secondary bg-secondary/10 hover:bg-secondary/25 transition-colors">
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
                  <Tooltip open={canUpdate && !isEditing ? undefined : false}>
                    <TooltipTrigger asChild>
                      <span className="inline-flex">
                        <Switch
                          id={setting.key}
                          checked={currentValue === 'true'}
                          onCheckedChange={(checked) => {
                            setCurrentValue(checked ? 'true' : 'false');
                          }}
                          disabled={!canUpdate || isSaving || !isEditing}
                        />
                      </span>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      Click <kbd className="font-semibold">Edit</kbd> to enable edit mode and get access to this setting
                    </TooltipContent>
                  </Tooltip>
                  <input 
                    type="hidden" 
                    name="value" 
                    value={currentValue === 'true' ? 'true' : 'false'}
                    readOnly
                  />
                  {!canUpdate && <ReadOnlyAlert />}
                </div>
              ) : (
                <div className="flex flex-col items-start gap-2 w-full">
                  <div className="relative w-full">
                    <Tooltip open={canUpdate && !isEditing ? undefined : false}>
                      <TooltipTrigger asChild>
                        <span>
                          <Input
                            id={setting.key}
                            name="value"
                            value={currentValue}
                            onChange={(e) => setCurrentValue(e.target.value)}
                            placeholder={`Enter ${setting.description?.toLowerCase() || 'value'}`}
                            type={
                              setting.isSensitive && !isRevealed
                                ? 'password'
                                : setting.type === 'number'
                                  ? 'number'
                                  : 'text'
                            }
                            disabled={!canUpdate || isSaving || !isEditing}
                            className={setting.isSensitive ? 'pr-10' : ''}
                          />
                        </span>
                      </TooltipTrigger>
                      <TooltipContent side="left">
                        Click <kbd className="font-semibold">Edit</kbd> to enable edit mode and get access to this setting
                      </TooltipContent>
                    </Tooltip>
                    {setting.isSensitive && (
                      <button
                        type="button"
                        onClick={() => setIsRevealed((prev) => !prev)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-muted-foreground transition-colors cursor-pointer"
                        tabIndex={-1}
                        aria-label={isRevealed ? 'Hide value' : 'Show value'}
                      >
                        {isRevealed ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    )}
                  </div>
                  {!canUpdate && <ReadOnlyAlert />}
                </div>
              )}
            </div>
            {!isEditing ? (
              <Button
                className="w-1/4 lg:w-1/8 mb-auto"
                type="button"
                onClick={() => setIsEditing(true)}
                disabled={!canUpdate || isSaving}
              >
                Edit
              </Button>
            ) : (
              <div className="flex gap-2 mb-auto">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isSaving}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={!canUpdate || isSaving || !hasChanges}
                >
                  {isSaving ? <Spinner /> : 'Save'}
                </Button>
              </div>
            )}
          </form>
        )}
      </CardContent>
    </Card>
  );
}
