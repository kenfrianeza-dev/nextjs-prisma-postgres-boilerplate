import { prisma } from "@/lib/prisma";

export const SystemSettingsRepo = {
  /**
   * Get all categories with their associated settings, ordered.
   */
  async getAllCategoriesWithSettings() {
    return prisma.systemSettingCategory.findMany({
      include: {
        settings: {
          orderBy: [
            { order: 'asc' },
            { key: 'asc' },
          ],
        },
      },
      orderBy: {
        order: 'asc',
      },
    });
  },

  /**
   * Get a single setting by its key.
   */
  async getSettingByKey(key: string) {
    return prisma.systemSetting.findUnique({
      where: { key },
      include: { category: true },
    });
  },

  /**
   * Fetch multiple settings by their keys and return a key→value map.
   * Useful for lightweight lookups (e.g. branding data for the sidebar).
   */
  async getSettingsByKeys(keys: string[]): Promise<Record<string, string | null>> {
    const settings = await prisma.systemSetting.findMany({
      where: { key: { in: keys } },
      select: { key: true, value: true },
    });
    return Object.fromEntries(settings.map((s) => [s.key, s.value]));
  },

  /**
   * Update a setting's value.
   */
  async updateSetting(key: string, value: string) {
    return prisma.systemSetting.update({
      where: { key },
      data: { value },
    });
  },

  /**
   * Create or update multiple settings at once (useful for bulk saves).
   */
  async upsertSettings(settings: { key: string; value: string }[]) {
    return prisma.$transaction(
      settings.map((s) =>
        prisma.systemSetting.update({
          where: { key: s.key },
          data: { value: s.value },
        })
      )
    );
  },
};

