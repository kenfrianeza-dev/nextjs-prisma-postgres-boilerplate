'use server';

import { verifySession } from "@/lib/auth";
import { UserManagementService } from "@/domain/user-management/user-management.service";
import { revalidatePath } from "next/cache";
import { z } from 'zod';

const UserSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.email('Invalid email address'),
  roleIds: z.array(z.string()).min(1, 'At least one role must be assigned'),
  isActive: z.boolean().optional(),
});

export type UserActionState = {
  errors?: {
    firstName?: string[];
    lastName?: string[];
    email?: string[];
    roleIds?: string[];
    isActive?: string[];
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
    lastName: formData.get('lastName') as string,
    roleIds: formData.getAll('roles') as string[],
  };

  const validation = UserSchema.safeParse(rawData);
  
  if (!validation.success) {
    return {
      errors: validation.error.flatten().fieldErrors,
      message: "Please input valid data.",
      success: false,
    };
  }

  try {
    await UserManagementService.createUser(session.permissions, validation.data);
    revalidatePath('/user-management/users');
    return { message: "User created successfully", success: true };
  } catch (error) {
    return { 
      message: error instanceof Error ? error.message : "Failed to create user", 
      success: false 
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
    lastName: formData.get('lastName') as string,
    isActive: formData.get('isActive') === 'on',
    roleIds: formData.getAll('roles') as string[],
  };

  const validation = UserSchema.safeParse(rawData);
  
  if (!validation.success) {
    return {
      errors: validation.error.flatten().fieldErrors,
      message: "Please input valid data.",
      success: false,
    };
  }

  try {
    await UserManagementService.updateUser(session.permissions, id, validation.data);
    revalidatePath('/user-management/users');
    return { message: "User updated successfully", success: true };
  } catch (error) {
    return { 
      message: error instanceof Error ? error.message : "Failed to update user", 
      success: false 
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
