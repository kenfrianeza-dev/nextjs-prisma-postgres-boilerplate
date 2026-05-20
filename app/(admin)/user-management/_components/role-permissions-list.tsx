'use client';

import { Badge } from '@/app/_components/ui/badge';
import type { Permission } from '@/app/(admin)/user-management/roles-and-permissions/_types';

interface RolePermissionsListProps {
  permissions: {
    permission: Permission;
  }[];
  maxDisplay?: number;
}

export function RolePermissionsList({ permissions, maxDisplay = 5 }: RolePermissionsListProps) {
  return (
    <div className="flex flex-wrap gap-1">
      {permissions.length > 0 ? (
        permissions.slice(0, maxDisplay).map((rp) => (
          <Badge key={rp.permission.id} variant="secondary" className="font-normal text-[10px] px-1.5 py-0">
            {rp.permission.action}:{rp.permission.resource}
          </Badge>
        ))
      ) : (
        <span className="text-xs text-muted-foreground italic">No permissions</span>
      )}
      {permissions.length > maxDisplay && (
        <Badge variant="outline" className="font-normal text-[10px] px-1.5 py-0">
          +{permissions.length - maxDisplay} more
        </Badge>
      )}
    </div>
  );
}
