'use client';

import { useState, useMemo } from 'react';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { ScrollArea } from '@/app/components/ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/app/components/ui/collapsible';
import { Search, ChevronDown, AlertTriangle, Shield } from 'lucide-react';
import { truncateString, cn } from '@/app/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/app/components/ui/tooltip';

type Permission = {
  id: string;
  action: string;
  resource: string;
  module: string | null;
  description: string | null;
};

type RoleWithPermissions = {
  id: string;
  name: string;
  permissions: {
    permission: {
      id: string;
    };
  }[];
};

interface RolePermissionsFormProps {
  allPermissions: Permission[];
  selectedPermissionIds?: string[];
  idPrefix: string;
  rolesWithPermissions?: RoleWithPermissions[];
  selectedRoleIds?: string[];
}

export function RolePermissionsForm({
  allPermissions,
  selectedPermissionIds = [],
  idPrefix,
  rolesWithPermissions = [],
  selectedRoleIds = [],
}: RolePermissionsFormProps) {
  const [permissionSearch, setPermissionSearch] = useState('');
  const [openModules, setOpenModules] = useState<Record<string, boolean>>({});
  const [selectedIds, setSelectedIds] = useState<string[]>(selectedPermissionIds);

  /**
   * Build a map of permissionId → role names[] that grant it,
   * based on which roles the admin has currently checked.
   */
  const roleInheritedMap = useMemo(() => {
    const map: Record<string, string[]> = {};
    for (const role of rolesWithPermissions) {
      if (!selectedRoleIds.includes(role.id)) continue;
      for (const rp of role.permissions) {
        if (!map[rp.permission.id]) map[rp.permission.id] = [];
        map[rp.permission.id].push(role.name);
      }
    }
    return map;
  }, [rolesWithPermissions, selectedRoleIds]);

  const handleTogglePermission = (id: string, checked: boolean) => {
    setSelectedIds((prev) => {
      if (checked) {
        return [...prev, id];
      } else {
        return prev.filter((i) => i !== id);
      }
    });
  };

  const toggleModule = (module: string) => {
    setOpenModules((prev) => ({
      ...prev,
      [module]: !prev[module],
    }));
  };

  const groupedPermissions = useMemo(() => {
    const groups: Record<string, Record<string, Permission[]>> = {};
    const searchLower = permissionSearch.toLowerCase();

    allPermissions.forEach((p) => {
      const moduleName = p.module || 'Other';
      const actionMatch = p.action.toLowerCase().includes(searchLower);
      const resourceMatch = p.resource.toLowerCase().includes(searchLower);
      const descriptionMatch = p.description?.toLowerCase().includes(searchLower) ?? false;
      const moduleMatch = moduleName.toLowerCase().includes(searchLower);

      if (actionMatch || resourceMatch || descriptionMatch || moduleMatch) {
        if (!groups[moduleName]) groups[moduleName] = {};
        if (!groups[moduleName][p.resource]) groups[moduleName][p.resource] = [];
        groups[moduleName][p.resource].push(p);
      }
    });
    return groups;
  }, [allPermissions, permissionSearch]);

  // Determine if a module should be open:
  // 1. If it's explicitly toggled open
  // 2. If there's an active search (show all matching)
  // 3. If it contains selected or inherited permissions (useful for edit mode)
  const isModuleOpen = (module: string, permsInModule: Permission[]) => {
    if (permissionSearch.length > 0) return true;
    if (openModules[module]) return true;
    
    // Check if any permission in this module is selected or inherited
    const hasSelected = permsInModule.some(p => selectedIds.includes(p.id) || roleInheritedMap[p.id]);
    if (hasSelected && openModules[module] === undefined) return true;

    return false;
  };

  return (
    <div className="grid gap-2">
      <div className="flex items-center justify-between">
        <Label>Direct Permissions</Label>
        <div className="relative w-48">
          <Search className="absolute left-2 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Search permissions..."
            className="pl-8 h-8 text-xs"
            value={permissionSearch}
            onChange={(e) => setPermissionSearch(e.target.value)}
          />
        </div>
      </div>
      <p className="text-[11px] text-muted-foreground -mt-1">
        Permissions marked with <Shield className="inline h-3 w-3 text-blue-500 mx-0.5" /> are already granted by assigned roles.
      </p>
      <ScrollArea className="h-[300px] border rounded-md p-4">
        {Object.keys(groupedPermissions).length > 0 ? (
          Object.entries(groupedPermissions).map(([module, resources]) => {
            const allPermsInModule = Object.values(resources).flat();
            const isOpen = isModuleOpen(module, allPermsInModule);

            return (
              <Collapsible
                key={module}
                open={isOpen}
                onOpenChange={() => toggleModule(module)}
                className="mb-2 last:mb-0"
              >
                <CollapsibleTrigger asChild>
                  <button
                    type="button"
                    className="flex items-center justify-between w-full text-xs font-bold text-primary uppercase tracking-wider bg-primary/5 p-2 rounded hover:bg-primary/10 transition-colors cursor-pointer"
                  >
                    <span>{module}</span>
                    <ChevronDown className={cn("h-4 w-4 transition-transform duration-200", isOpen && "rotate-180")} />
                  </button>
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-2">
                  <div className="space-y-4 pl-1 border-primary/10 ml-1">
                    {Object.entries(resources).map(([resource, perms]) => (
                      <div key={resource}>
                        <h4 className="text-xs font-semibold mb-2 text-muted-foreground">
                          {resource === "*" ? "all-resources" : resource.replace("*", "").replace(":", " ")}
                        </h4>
                        <div className="grid grid-cols-2 gap-2">
                          {perms.map((p) => {
                            const id = `${idPrefix}-perm-${p.id}`;
                            const inheritedFromRoles = roleInheritedMap[p.id];
                            const isInherited = !!inheritedFromRoles;
                            const isDirectlySelected = selectedIds.includes(p.id);

                            return (
                            <div key={p.id} className={cn("group flex items-center w-fit space-x-2", isInherited && "opacity-80")}>
                              <input
                                type="checkbox"
                                id={id}
                                checked={isInherited || isDirectlySelected}
                                disabled={isInherited}
                                onChange={(e) => handleTogglePermission(p.id, e.target.checked)}
                                className={cn(
                                  "h-4 w-4 rounded border-gray-300 text-primary/85 group-hover:text-primary focus:ring-primary transition-colors",
                                  isInherited ? "cursor-not-allowed opacity-60" : "cursor-pointer"
                                )}
                              />
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Label
                                      htmlFor={id}
                                      className={cn(
                                        "font-normal text-[11px] text-primary/85 group-hover:text-primary transition-colors flex items-center gap-1.5",
                                        isInherited ? "cursor-not-allowed" : "cursor-pointer"
                                      )}
                                    >
                                      {p.action}
                                      {isInherited && (
                                        <Shield className="h-3 w-3 text-blue-500 fill-blue-50" />
                                      )}
                                      {(p.resource === '*' || p.resource === "system-settings") && !isInherited && (
                                        <AlertTriangle className="h-3 w-3 text-amber-500 dark:text-amber-600 fill-amber-50" />
                                      )}
                                    </Label>
                                  </TooltipTrigger>
                                  <TooltipContent side="top" className="max-w-xs">
                                    <div className="space-y-1">
                                      <p className="font-semibold">{p.description || "No description provided."}</p>
                                      {isInherited && (
                                        <p className="text-[10px] border-t border-white/10 pt-1 mt-1">
                                          <span className="font-bold text-blue-500">Inherited from:</span>{' '}
                                          {inheritedFromRoles.join(', ')}
                                        </p>
                                      )}
                                      {(p.resource === '*' || p.resource === "system-settings") && !isInherited && (
                                        <p className="text-[10px] border-t border-white/10 pt-1 mt-1">
                                          <span className="font-bold underline text-amber-500 dark:text-amber-600">Warning:</span> This is a broad permission that may bypass more granular sub-category restrictions.
                                        </p>
                                      )}
                                    </div>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                            )})}
                        </div>
                      </div>
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center h-[250px] py-8 text-muted-foreground">
            <Search className="h-8 w-8 mb-2 opacity-20" />
            <p className="text-sm">No permissions found matching &quot;{truncateString(permissionSearch, 32)}&quot;</p>
          </div>
        )}
      </ScrollArea>
      {/* Only emit direct permissions as hidden inputs (not role-inherited ones) */}
      {selectedIds
        .filter((id) => !roleInheritedMap[id])
        .map((id) => (
          <input key={id} type="hidden" name="permissions" value={id} />
        ))}
    </div>
  );
}
