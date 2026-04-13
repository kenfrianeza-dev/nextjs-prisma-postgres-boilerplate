import { PermissionEngine } from "@/domain/shared/permission.engine";

export function hasPermission(permissions: string[], required?: string | string[]) {
  if (!required) return true;
  
  if (Array.isArray(required)) {
    return PermissionEngine.hasAny(permissions, required);
  }
  
  return PermissionEngine.has(permissions, required);
}

