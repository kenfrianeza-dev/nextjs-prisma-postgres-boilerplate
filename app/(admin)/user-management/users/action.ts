'use server';

import { revalidatePath } from "next/cache";
import { z } from 'zod';
import { verifySession } from "@/lib/auth";
import { UserManagementService } from "@/domain/user-management/user-management.service";

const UserSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  middleName: z.string().optional(),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  suffixName: z.string().optional(),
  email: z.email('Invalid email address'),
  phoneNumber: z.string().min(11, 'Phone number must be at least 11 characters'),
  roleIds: z.array(z.string()).min(1, 'At least one role must be assigned'),
  permissionIds: z.array(z.string()).optional(),
  isActive: z.boolean().optional(),
});

export type UserActionState = {
  errors?: {
    firstName?: string[];
    middleName?: string[];
    lastName?: string[];
    suffixName?: string[];
    email?: string[];
    phoneNumber?: string[];
    roleIds?: string[];
    permissionIds?: string[];
    isActive?: string[];
  };
  data?: {
    firstName?: string;
    middleName?: string;
    lastName?: string;
    suffixName?: string;
    email?: string;
    phoneNumber?: string;
    roleIds?: string[];
    permissionIds?: string[];
    isActive?: boolean;
  };
  message?: string | null;
  success?: boolean;
};

export async function createUserAction(prevState: UserActionState, formData: FormData): Promise<UserActionState> {
  const session = await verifySession();
  if (!session) {
    return { message: "Unauthorized", success: false };
  }

  const rawData = {
    email: formData.get('email') as string,
    firstName: formData.get('firstName') as string,
    middleName: (formData.get('middleName') as string) || undefined,
    lastName: formData.get('lastName') as string,
    suffixName: (formData.get('suffixName') as string) || undefined,
    phoneNumber: formData.get('phoneNumber') as string,
    roleIds: formData.getAll('roles') as string[],
    permissionIds: formData.getAll('permissions') as string[],
  };

  const validation = UserSchema.safeParse(rawData);
  
  if (!validation.success) {
    return {
      errors: validation.error.flatten().fieldErrors,
      message: "Please input valid data.",
      success: false,
      data: rawData,
    };
  }

  try {
    await UserManagementService.createUser(session.permissions, validation.data);
    revalidatePath('/user-management/users');
    return { message: "User created successfully", success: true };
  } catch (error: any) {
    if (error.code === 'P2002') {
      return { 
        message: "A user with this email already exists.", 
        success: false,
        errors: {
          email: ["Email already in use"]
        },
        data: rawData,
      };
    }
    return { 
      message: error instanceof Error ? error.message : "Failed to create user", 
      success: false,
      data: rawData,
    };
  }
}

export async function updateUserAction(id: string, prevState: UserActionState, formData: FormData): Promise<UserActionState> {
  const session = await verifySession();
  if (!session) {
    return { message: "Unauthorized", success: false };
  }

  const rawData = {
    email: formData.get('email') as string,
    firstName: formData.get('firstName') as string,
    middleName: (formData.get('middleName') as string) || undefined,
    lastName: formData.get('lastName') as string,
    suffixName: (formData.get('suffixName') as string) || undefined,
    phoneNumber: formData.get('phoneNumber') as string,
    isActive: formData.get('isActive') === 'on',
    roleIds: formData.getAll('roles') as string[],
    permissionIds: formData.getAll('permissions') as string[],
  };

  const validation = UserSchema.safeParse(rawData);
  
  if (!validation.success) {
    return {
      errors: validation.error.flatten().fieldErrors,
      message: "Please input valid data.",
      success: false,
      data: rawData,
    };
  }

  try {
    await UserManagementService.updateUser(session.permissions, id, validation.data);
    revalidatePath('/user-management/users');
    return { message: "User updated successfully", success: true };
  } catch (error: any) {
    if (error.code === 'P2002') {
      return { 
        message: "A user with this email already exists.", 
        success: false,
        errors: {
          email: ["Email already in use"]
        },
        data: rawData,
      };
    }
    return { 
      message: error instanceof Error ? error.message : "Failed to update user", 
      success: false,
      data: rawData,
    };
  }
}

export async function deleteUserAction(id: string): Promise<UserActionState> {
  const session = await verifySession();
  if (!session) {
    return { message: "Unauthorized", success: false };
  }

  try {
    await UserManagementService.deleteUser(session.permissions, id);
    revalidatePath('/user-management/users');
    return { message: "User deleted successfully", success: true };
  } catch (error) {
    return { 
      message: error instanceof Error ? error.message : "Failed to delete user", 
      success: false 
    };
  }
}
