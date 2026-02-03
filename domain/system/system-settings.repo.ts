import { prisma } from "@/lib/prisma";

export const SystemSettingsRepo = {
  /**
   * Get all categories with their associated settings, ordered.
   */
  async getAllCategoriesWithSettings() {
    return prisma.systemSettingCategory.findMany({
      include: {
        settings: {
          orderBy: {
            order: 'desc'
          },
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
