import { PermissionEngine as P } from "@/domain/shared/permission.engine";

export const SystemSettingsPolicy = {
  viewSettings: (permissions: string[]) => P.hasAny(permissions, ["read:system-settings", "manage:system-settings"]),
  viewSettingsCategory: (permissions: string[], slug: string) => P.hasAny(permissions, ["read:system-settings", "manage:system-settings"]),

  updateSettings: (permissions: string[]) => P.manageOrAction(permissions, "system-settings", "update"),
  updateSettingsCategory: (permissions: string[], slug: string) => P.manageOrAction(permissions, `system-settings.${slug}`, "update"),
  canUpdateByCategory: (permissions: string[], slug: string) => SystemSettingsPolicy.updateSettings(permissions) || SystemSettingsPolicy.updateSettingsCategory(permissions, slug),
};

