'use client';

import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/app/_components/ui/input';
import { Label } from '@/app/_components/ui/label';
import { ScrollArea } from '@/app/_components/ui/scroll-area';
import { truncateString } from '@/app/utils';

interface Role {
  id: string;
  name: string;
}

interface UserRolesFormProps {
  roles: Role[];
  selectedRoleIds: string[];
  errors?: string[];
  idPrefix: string;
  onRoleChange: (selectedRoleIds: string[]) => void;
}

export function UserRolesForm({ roles, selectedRoleIds, errors, idPrefix, onRoleChange }: UserRolesFormProps) {
  const [search, setSearch] = useState('');

  const handleToggle = (roleId: string, checked: boolean) => {
    const next = checked
      ? [...selectedRoleIds, roleId]
      : selectedRoleIds.filter((id) => id !== roleId);
    onRoleChange(next);
  };

  const filteredRoles = useMemo(() => {
    return roles.filter((role) =>
      role.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [roles, search]);

  return (
    <div className="grid gap-2">
      <div className="flex items-center justify-between">
        <Label className={errors ? 'text-destructive' : ''}>
          Assign Roles <span className="text-red-500 ml-0.5">*</span>
        </Label>
        <div className="relative w-48">
          <Search className="absolute left-2 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Search roles..."
            className="pl-8 h-8 text-xs"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
      {filteredRoles.length > 0 ? <ScrollArea className="h-[100px] border rounded-md p-2">
        <div className={`grid grid-cols-2 gap-4 p-2 ${errors ? 'border-destructive' : ''}`}>
          {filteredRoles.map((role) => (
            <div key={role.id} className="flex items-center space-x-2">
              <input
                type="checkbox"
                id={`${idPrefix}-role-${role.id}`}
                name="roles"
                value={role.id}
                checked={selectedRoleIds.includes(role.id)}
                onChange={(e) => handleToggle(role.id, e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <Label htmlFor={`${idPrefix}-role-${role.id}`} className="font-normal">
                {role.name}
              </Label>
            </div>
          ))}

        </div>
      </ScrollArea> : <div className="w-full flex flex-col items-center justify-center h-[100px] text-muted-foreground border rounded-md p-2">
        <Search className="h-8 w-8 mb-2 opacity-20" />
        <p className="text-sm">No roles found matching &quot;{truncateString(search, 32)}&quot;</p>
      </div>}

      {errors && <p className="text-xs text-destructive">{errors[0]}</p>}
    </div>
  );
}
