"use client"

import { Container, ContainerHeader } from '@/app/components/container';
import { MenuItems } from '@/app/components/secondary-sidebar/secondary-sidebar';
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
  LucideIcon
} from 'lucide-react';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Label } from '@/app/components/ui/label';
import { Input } from '@/app/components/ui/input';
import { Button } from '@/app/components/ui/button';
import { saveSetting } from '@/server/actions/settings.actions';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { toast } from "sonner";
import { Spinner } from '@/app/components/ui/spinner';
import { SystemSettingsPolicy } from '@/domain/system/system-settings.policy';


const ICON_MAP: Record<string, LucideIcon> = {
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

type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  settings: Setting[];
};

type Setting = {
  id: string;
  key: string;
  value: string | null;
  type: string;
  description: string | null;
  metadata: any;
};

export default function SettingsClient({
  permissions,
  categories
}: {
  permissions: string[];
  categories: Category[];
}) {
  const menuItems: MenuItems[] = categories.map(cat => ({
    title: cat.name,
    description: cat.description || undefined,
    icon: ICON_MAP[cat.icon as string] || Settings,
    slug: cat.slug,
    permission: `read:system-settings.${cat.slug}`
  }));

  const [activeTab, setActiveTab] = useState(menuItems[0]?.title || "");
  const [isSaving, setIsSaving] = useState<string | null>(null);

  const activeCategory = categories.find(cat => cat.name === activeTab);
  const canUpdateActiveCategory = activeCategory 
    ? SystemSettingsPolicy.canUpdateByCategory(permissions, activeCategory.slug)
    : false;

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const key = formData.get("key") as string;

    setIsSaving(key);
    const result = await saveSetting(formData);
    setIsSaving(null);
    toast.success("Setting saved successfully.", { duration: 1500, position: 'top-right' });

    if (!result.success) {
      toast.error("Failed to save setting.", { duration: 1500, position: 'top-right' });
    }
  };



  return (
    <Container
      menuItems={menuItems}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      permissions={permissions}
    >
      <div className="max-w-full h-full space-y-4">
        {activeCategory ? (
          <>
            <ContainerHeader title={activeCategory.name} description={activeCategory.description || ""} />
            <div className="grid gap-4">
              {activeCategory.settings.map((setting) => {
                return (
                <Card key={setting.id} className='shadow-none'>
                  <CardHeader>
                    <CardTitle className="text-base">{setting.description || setting.key}</CardTitle>
                    <CardDescription className="font-mono text-xs">{setting.key}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSave} className="flex items-end gap-4">
                      <input type="hidden" name="key" value={setting.key} />
                      <div className="flex justify-start items-start flex-1 gap-4">
                        <Label htmlFor={setting.key} className="sr-only">Value</Label>
                        {setting.type === "boolean" ? (
                          <div className='flex flex-col items-start gap-2 w-1/2'>
                            <Select
                              name="value"
                              defaultValue={setting.value || "false"}
                              disabled={!canUpdateActiveCategory || isSaving === setting.key}
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
                            {!canUpdateActiveCategory && (
                              <p className="text-muted-foreground text-xs">You do not have permission to update this setting.</p>
                            )}
                          </div>
                        ) : (
                          <div className='flex flex-col items-start gap-2 w-full'>
                            <Input
                              id={setting.key}
                              name="value"
                              defaultValue={setting.value || ""}
                              placeholder={`Enter ${setting.description?.toLowerCase() || 'value'}`}
                              type={setting.type === "number" ? "number" : "text"}
                              disabled={!canUpdateActiveCategory || isSaving === setting.key}
                            />
                            {!canUpdateActiveCategory && (
                              <p className="text-muted-foreground text-xs">You do not have permission to update this setting.</p>
                            )}
                          </div>
                        )}
                      </div>
                      <Button className='w-1/4 lg:w-1/8 mb-auto' type="submit" disabled={!canUpdateActiveCategory || isSaving === setting.key}>
                        {isSaving === setting.key ? <Spinner /> : "Save"}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              )})}
            </div>
          </>
        ) : (
          <div className="flex h-full w-full items-center justify-center rounded-lg border border-dashed">
            <p className="text-muted-foreground text-center text-sm">Select a category from the sidebar</p>
          </div>
        )}
      </div>
    </Container>
  );
}
