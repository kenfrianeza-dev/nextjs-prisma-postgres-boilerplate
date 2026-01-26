"use server";

import { SystemSettingsService } from "@/domain/system/system-settings.service";
import { verifySession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function saveSetting(formData: FormData) {
  const session = await verifySession();
  if (!session) {
    throw new Error("You must be logged in to save settings.");
  }

  const key = formData.get("key") as string;
  const value = formData.get("value") as string;

  if (!key) {
    throw new Error("Setting key is required.");
  }

  try {
    await SystemSettingsService.updateSetting(session.permissions, key, value);
    revalidatePath("/(admin)/system-settings", "page");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function saveSettingsBulk(settings: { key: string; value: string }[]) {
  const session = await verifySession();
  if (!session) {
    throw new Error("You must be logged in to save settings.");
  }

  try {
    await SystemSettingsService.updateSettings(session.permissions, settings);
    revalidatePath("/(admin)/system-settings", "page");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
