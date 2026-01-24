import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

const SECRET_KEY = process.env.JWT_SECRET || "default_secret_key_change_me";
const REFRESH_SECRET_KEY =
  process.env.JWT_REFRESH_SECRET || "default_refresh_secret_key_change_me";
const encodedKey = new TextEncoder().encode(SECRET_KEY);
const encodedRefreshKey = new TextEncoder().encode(REFRESH_SECRET_KEY);

type SessionPayload = {
  userId: string;
  permissions: string[];
  expiresAt: Date;
};

async function getUserPermissions(userId: string): Promise<string[]> {
  const permissions = await prisma.permission.findMany({
    where: {
      roles: {
        some: {
          role: {
            users: {
              some: { userId },
            },
          },
        },
      },
    },
    select: {
      action: true,
      resource: true,
    },
  });

  return permissions.map((p) => `${p.action}:${p.resource}`);
}

export async function encrypt(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("15m") // Access token short lived
    .sign(encodedKey);
}

export async function encryptRefresh(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d") // Refresh token long lived
    .sign(encodedRefreshKey);
}

export async function decrypt(session: string | undefined = "") {
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ["HS256"],
    });
    return payload;
  } catch (error) {
    return null;
  }
}

export async function decryptRefresh(session: string | undefined = "") {
  try {
    const { payload } = await jwtVerify(session, encodedRefreshKey, {
      algorithms: ["HS256"],
    });
    return payload;
  } catch (error) {
    return null;
  }
}

export async function createSession(userId: string) {
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
  const refreshExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  // 🔑 Load permissions ONCE
  const permissions = await getUserPermissions(userId);

  const accessToken = await encrypt({
    userId,
    permissions,
    expiresAt,
  });

  const refreshToken = await encryptRefresh({
    userId,
    permissions,
    expiresAt: refreshExpiresAt,
  });

  await prisma.session.create({
    data: {
      userId,
      sessionToken: refreshToken,
      expires: refreshExpiresAt,
    },
  });

  const cookieStore = await cookies();

  cookieStore.set("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  });

  cookieStore.set("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: refreshExpiresAt,
    sameSite: "lax",
    path: "/",
  });
}

export async function verifySession() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  const session = await decrypt(accessToken);

  if (!session?.userId) return null;

  return {
    isAuth: true,
    userId: session.userId as string,
    permissions: session.permissions as string[],
  };
}

export async function deleteSession() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refreshToken")?.value;

  if (refreshToken) {
    // Ideally delete from DB too
    await prisma.session.deleteMany({
      where: { sessionToken: refreshToken },
    });
  }

  cookieStore.delete("accessToken");
  cookieStore.delete("refreshToken");
}

export async function getUserRoles(userId: string) {
  const userRoles = await prisma.userRole.findMany({
    where: { userId },
    include: { role: true },
  });
  return userRoles.map((ur) => ur.role.name);
}
