'use client';

/**
 * Placeholder shown when no sidebar category is selected.
 */
export function SettingsEmptyState() {
  return (
    <div className="flex h-full w-full items-center justify-center rounded-lg border border-dashed">
      <p className="text-muted-foreground text-center text-sm">
        Select a category from the sidebar
      </p>
    </div>
  );
}
