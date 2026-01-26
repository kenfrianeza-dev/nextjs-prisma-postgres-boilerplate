"use client"

import { Container } from '@/app/components/container';
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
  }));

  const [activeTab, setActiveTab] = useState(menuItems[0]?.title || "");
  const [isSaving, setIsSaving] = useState<string | null>(null);

  const activeCategory = categories.find(cat => cat.name === activeTab);
  
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
    >
      <div className="max-w-4xl space-y-6">
        {activeCategory ? (
          <>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{activeCategory.name}</h1>
              <p className="text-muted-foreground mt-2">{activeCategory.description}</p>
            </div>

            <div className="grid gap-4">
              {activeCategory.settings.map((setting) => (
                <Card key={setting.id} className='shadow-none'>
                  <CardHeader>
                    <CardTitle className="text-base">{setting.description || setting.key}</CardTitle>
                    <CardDescription className="font-mono text-xs">{setting.key}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSave} className="flex items-end gap-4">
                      <input type="hidden" name="key" value={setting.key} />
                      <div className="grid flex-1 gap-4">
                        <Label htmlFor={setting.key} className="sr-only">Value</Label>
                        {setting.type === "boolean" ? (
                          <Select
                            name="value"
                            defaultValue={setting.value || "false"}
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
                        ) : (
                          <Input
                            id={setting.key}
                            name="value"
                            defaultValue={setting.value || ""}
                            placeholder={`Enter ${setting.description?.toLowerCase() || 'value'}`}
                            type={setting.type === "number" ? "number" : "text"}
                            disabled={isSaving === setting.key}
                          />
                        )}
                      </div>
                      <Button className='w-1/8' type="submit" disabled={isSaving === setting.key}>
                        {isSaving === setting.key ? <Spinner /> : "Save"}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        ) : (
          <div className="flex h-[400px] items-center justify-center rounded-lg border border-dashed">
            <p className="text-muted-foreground">Select a category from the sidebar</p>
          </div>
        )}
      </div>
    </Container>
  );
}
