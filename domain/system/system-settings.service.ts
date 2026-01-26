import { SystemSettingsRepo } from "./system-settings.repo";
import { SystemSettingsPolicy } from "./system-settings.policy";
import { AppError } from "@/lib/errors";

export const SystemSettingsService = {
  /**
   * Get all settings categorized, filtered by user permissions.
   */
  async getCategorizedSettings(userPermissions: string[]) {
    if (!SystemSettingsPolicy.canView(userPermissions)) {
      throw AppError.forbidden("You do not have permission to view system settings.");
    }

    const categories = await SystemSettingsRepo.getAllCategoriesWithSettings();
    
    // Filter categories based on specific read permissions if necessary
    return categories.filter(category => SystemSettingsPolicy.canViewCategory(userPermissions, category.slug));
  },

  /**
   * Update a specific setting.
   */
  async updateSetting(userPermissions: string[], key: string, value: string) {
    if (!SystemSettingsPolicy.canUpdate(userPermissions)) {
      throw AppError.forbidden("You do not have permission to update system settings.");
    }

    const setting = await SystemSettingsRepo.getSettingByKey(key);
    if (!setting) {
      throw AppError.notFound(`Setting with key "${key}" not found.`);
    }

    // Validation based on type
    this.validateSettingValue(setting.type, value, key);

    return SystemSettingsRepo.updateSetting(key, value);
  },

  /**
   * Bulk update settings.
   */
  async updateSettings(userPermissions: string[], settings: { key: string; value: string }[]) {
    if (!SystemSettingsPolicy.canUpdate(userPermissions)) {
      throw AppError.forbidden("You do not have permission to update system settings.");
    }

    // Validate all settings before proceeding
    for (const item of settings) {
      const setting = await SystemSettingsRepo.getSettingByKey(item.key);
      if (setting) {
        this.validateSettingValue(setting.type, item.value, item.key);
      }
    }

    return SystemSettingsRepo.upsertSettings(settings);
  },

  /**
   * Internal validation logic.
   */
  validateSettingValue(type: string, value: string, key: string) {
    switch (type) {
      case "number":
        if (isNaN(Number(value))) {
          throw AppError.badRequest(`Invalid value for "${key}": expected a number.`);
        }
        break;
      case "boolean":
        if (value !== "true" && value !== "false") {
          throw AppError.badRequest(`Invalid value for "${key}": expected "true" or "false".`);
        }
        break;
      case "json":
        try {
          JSON.parse(value);
        } catch (e) {
          throw AppError.badRequest(`Invalid value for "${key}": expected valid JSON.`);
        }
        break;
      // "string" type needs no specific validation here but could have length checks
    }
  }
};
