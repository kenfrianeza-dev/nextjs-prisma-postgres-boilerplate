export function hasPermission(permissions: string[], required?: string) {
  if (!required) return true;
  return permissions.includes(required) || permissions.includes("*:*");
}
