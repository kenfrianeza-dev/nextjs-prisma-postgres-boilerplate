import { cache } from "react";
import { verifySession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const getAuthContext = cache(async () => {
  const session = await verifySession();
  if (!session) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      firstName: true,
      lastName: true,
      email: true,
    },
  });

  return {
    user,
    permissions: session.permissions,
  };
});
