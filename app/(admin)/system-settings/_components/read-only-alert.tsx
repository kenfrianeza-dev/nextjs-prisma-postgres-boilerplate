'use client';

import { AlertTriangleIcon } from 'lucide-react';
import { Alert, AlertDescription } from '@/app/_components/ui';

/**
 * Small inline alert shown when the user lacks update permissions
 * for the current settings category.
 */
export function ReadOnlyAlert() {
  return (
    <Alert variant="warning" className="text-xs w-fit bg-amber-50/10 dark:bg-transparent">
      <AlertTriangleIcon />
      <AlertDescription>
        Read-only. You don&apos;t have permission to update this.
      </AlertDescription>
    </Alert>
  );
}
