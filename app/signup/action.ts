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
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { firstName, lastName, email, password } = validatedFields.data;

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
        lastName,
        email,
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
