'use server';

import { verifySession } from "@/lib/auth";
import { UserManagementService } from "@/domain/user-management/user-management.service";
import { revalidatePath } from "next/cache";
import { z } from 'zod';

const RoleSchema = z.object({
  name: z.string().min(2, 'Role name must be at least 2 characters'),
  description: z.string().optional(),
  permissionIds: z.array(z.string()).optional(),
});

export type RoleActionState = {
  errors?: {
    name?: string[];
    description?: string[];
    permissionIds?: string[];
  };
  data?: {
    name?: string;
    description?: string;
    permissionIds?: string[];
  };
  message?: string | null;
  success?: boolean;
};

export async function createRoleAction(prevState: RoleActionState, formData: FormData): Promise<RoleActionState> {
  const session = await verifySession();
  if (!session) {
    return { message: "Unauthorized", success: false };
  }

  const rawData = {
    name: formData.get('name') as string,
    description: formData.get('description') as string,
    permissionIds: formData.getAll('permissions') as string[],
  };

  const validation = RoleSchema.safeParse(rawData);
  
  if (!validation.success) {
    return {
      errors: validation.error.flatten().fieldErrors,
      message: "Please input valid data.",
      success: false,
      data: rawData,
    };
  }

  try {
    await UserManagementService.createRole(session.permissions, validation.data);
    revalidatePath('/user-management/roles');
    return { message: "Role created successfully", success: true };
  } catch (error: any) {
    if (error.code === 'P2002') {
      return { 
        message: "A role with this name already exists.", 
        success: false,
        errors: {
          name: ["Role name already in use"]
        },
        data: rawData,
      };
    }
    return { 
      message: error instanceof Error ? error.message : "Failed to create role", 
      success: false,
      data: rawData,
    };
  }
}

export async function updateRoleAction(id: string, prevState: RoleActionState, formData: FormData): Promise<RoleActionState> {
  const session = await verifySession();
  if (!session) {
    return { message: "Unauthorized", success: false };
  }

  const rawData = {
    name: formData.get('name') as string,
    description: formData.get('description') as string,
    permissionIds: formData.getAll('permissions') as string[],
  };

  const validation = RoleSchema.safeParse(rawData);
  
  if (!validation.success) {
    return {
      errors: validation.error.flatten().fieldErrors,
      message: "Please input valid data.",
      success: false,
      data: rawData,
    };
  }

  try {
    await UserManagementService.updateRole(session.permissions, id, validation.data);
    revalidatePath('/user-management/roles');
    return { message: "Role updated successfully", success: true };
  } catch (error: any) {
    if (error.code === 'P2002') {
      return { 
        message: "A role with this name already exists.", 
        success: false,
        errors: {
          name: ["Role name already in use"]
        },
        data: rawData,
      };
    }
    return { 
      message: error instanceof Error ? error.message : "Failed to update role", 
      success: false,
      data: rawData,
    };
  }
}

export async function deleteRoleAction(id: string): Promise<RoleActionState> {
  const session = await verifySession();
  if (!session) {
    return { message: "Unauthorized", success: false };
  }

  try {
    await UserManagementService.deleteRole(session.permissions, id);
    revalidatePath('/user-management/roles');
    return { message: "Role deleted successfully", success: true };
  } catch (error) {
    return { 
      message: error instanceof Error ? error.message : "Failed to delete role", 
      success: false 
    };
  }
}
