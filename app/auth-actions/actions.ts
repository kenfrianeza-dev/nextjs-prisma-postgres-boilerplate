"use server";

import { deleteSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { LoginFormSchema, FormState } from "@/lib/definitions";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/password";
import { createSession } from "@/lib/auth";

export async function login(state: FormState, formData: FormData) {
  const messageErrors: Record<string, string> = {
    invalid: "Invalid email or password.",
  };

  const validatedFields = LoginFormSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { email, password } = validatedFields.data;
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return {
      message: messageErrors['invalid'],
    };
  }

  const passwordsMatch = await verifyPassword(password, user.passwordHash);

  if (!passwordsMatch) {
    return {
      message: messageErrors['invalid'],
    };
  }

  await createSession(user.id);

  redirect("/dashboard");
}

export async function logout() {
  await deleteSession();
  redirect("/");
}
