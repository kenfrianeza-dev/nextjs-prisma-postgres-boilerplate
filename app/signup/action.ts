"use server";

import { z } from "zod";
import { SignupFormSchema, FormState } from "@/lib/definitions";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/password";
import { createSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function signup(state: FormState, formData: FormData) {
  const validatedFields = SignupFormSchema.safeParse({
    firstName: formData.get("firstName"),
    middleName: formData.get("middleName") || undefined,
    lastName: formData.get("lastName"),
    suffixName: formData.get("suffixName") || undefined,
    email: formData.get("email"),
    phoneNumber: formData.get("phoneNumber"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { firstName, middleName, lastName, suffixName, email, phoneNumber, password } = validatedFields.data;

  // Check if user exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return {
      message: "User already exists.",
    };
  }

  const hashedPassword = await hashPassword(password);

  try {
    const user = await prisma.user.create({
      data: {
        firstName,
        middleName: middleName ?? null,
        lastName,
        suffixName: suffixName ?? null,
        email,
        phoneNumber,
        passwordHash: hashedPassword,
      },
    });

    await createSession(user.id);
  } catch (error) {
    return {
      message: "Database Error: Failed to Create User.",
    };
  }

  redirect("/dashboard");
}
