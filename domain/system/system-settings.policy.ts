import { PermissionEngine as P } from "@/domain/shared/permission.engine";

export const SystemSettingsPolicy = {
  viewSettings: (p: string[]) => P.has(p, "read:system-settings"),
  updateSettings: (p: string[]) => P.has(p, "update:system-settings"),
  viewSettingsCategory: (p: string[], slug: string) => P.has(p, `read:system-settings.${slug}`),
  updateSettingsCategory: (p: string[], slug: string) => P.has(p, `update:system-settings.${slug}`),
  canUpdateByCategory: (p: string[], slug: string) => 
    SystemSettingsPolicy.updateSettings(p) || SystemSettingsPolicy.updateSettingsCategory(p, slug),
};

