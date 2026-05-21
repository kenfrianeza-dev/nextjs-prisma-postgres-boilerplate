import "server-only";
import { createHash } from "crypto";
import { EncryptJWT, jwtDecrypt } from "jose";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

// ─── Key Setup ───────────────────────────────────────────────────────────────
// JWE A256GCM requires a 256-bit (32-byte) key.
// The env vars are base64-encoded 32-byte keys.
const SECRET_KEY = process.env.JWT_SECRET || "default_secret_key_change_me";
const REFRESH_SECRET_KEY =
  process.env.JWT_REFRESH_SECRET || "default_refresh_secret_key_change_me";

function deriveKey(secret: string): Uint8Array {
  // If it looks like a base64 key (32 bytes = 44 chars in base64), decode it.
  try {
    const decoded = Uint8Array.from(atob(secret), (c) => c.charCodeAt(0));
    if (decoded.length === 32) return decoded;
  } catch {
    // Not valid base64, fall through to hash derivation
  }

  // Securely hash the secret to establish a uniform 32-byte key space.
  // SHA-256 guarantees uniform distribution without modulo bias.
  return createHash("sha256").update(secret).digest();
}

const encodedKey = deriveKey(SECRET_KEY);
const encodedRefreshKey = deriveKey(REFRESH_SECRET_KEY);

// ─── Token Hashing ──────────────────────────────────────────────────────────
// JWE strings are massive payloads. Storing and querying them raw degrades
// index performance. We hash the token to a fixed-length hex string for all
// database operations on the sessionToken column.
function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

// ─── Cookie Chunking ─────────────────────────────────────────────────────────
// Browsers enforce a ~4KB limit per cookie. When the encrypted token (which
// includes the permissions array) exceeds this, we split it across numbered
// chunk cookies and store the count in a sentinel cookie.
const CHUNK_SIZE = 3800; // Leave headroom for cookie name + attributes

async function setChunkedCookie(
  name: string,
  value: string,
  options: {
    httpOnly: boolean;
    secure: boolean;
    expires: Date;
    sameSite: "lax" | "strict" | "none";
    path: string;
  }
) {
  const cookieStore = await cookies();

  // Clean up any previous chunks before writing
  await deleteChunkedCookie(name);

  if (value.length <= CHUNK_SIZE) {
    cookieStore.set(name, value, options);
    return;
  }

  const totalChunks = Math.ceil(value.length / CHUNK_SIZE);
  for (let i = 0; i < totalChunks; i++) {
    const chunk = value.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE);
    cookieStore.set(`${name}.${i}`, chunk, options);
  }
  cookieStore.set(`${name}.count`, totalChunks.toString(), options);
}

async function getChunkedCookie(name: string): Promise<string | undefined> {
  const cookieStore = await cookies();
  const chunkCountStr = cookieStore.get(`${name}.count`)?.value;

  // No chunk sentinel → try reading as a single cookie
  if (!chunkCountStr) {
    return cookieStore.get(name)?.value;
  }

  const chunkCount = parseInt(chunkCountStr, 10);
  let value = "";
  for (let i = 0; i < chunkCount; i++) {
    const chunk = cookieStore.get(`${name}.${i}`)?.value;
    if (!chunk) return undefined; // Corrupted – a chunk is missing
    value += chunk;
  }
  return value;
}

async function deleteChunkedCookie(name: string) {
  const cookieStore = await cookies();
  const chunkCountStr = cookieStore.get(`${name}.count`)?.value;

  if (chunkCountStr) {
    const chunkCount = parseInt(chunkCountStr, 10);
    for (let i = 0; i < chunkCount; i++) {
      cookieStore.delete(`${name}.${i}`);
    }
    cookieStore.delete(`${name}.count`);
  }

  // Also delete the non-chunked cookie if it exists
  cookieStore.delete(name);
}

// ─── Types ───────────────────────────────────────────────────────────────────
type SessionPayload = {
  userId: string;
  permissions: string[];
  expiresAt: Date;
};

// ─── Permissions ─────────────────────────────────────────────────────────────
export async function getUserPermissions(userId: string): Promise<string[]> {
  const permissions = await prisma.permission.findMany({
    where: {
      OR: [
        { roles: { some: { role: { users: { some: { userId } } } } } },
        { users: { some: { userId } } },
      ],
    },
    select: { action: true, resource: true },
  });

  const formattedPermissions = permissions.map((p) => `${p.action}:${p.resource}`);

  // Deduplicate
  return Array.from(new Set(formattedPermissions));
}

// ─── JWE Encrypt / Decrypt ──────────────────────────────────────────────────
// Uses AES-256-GCM direct key encryption. The entire payload is encrypted,
// not just signed — an interceptor cannot read userId or permissions.
export async function encrypt(payload: SessionPayload) {
  return new EncryptJWT(payload as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: "dir", enc: "A256GCM" })
    .setIssuedAt()
    .setExpirationTime("15m")
    .encrypt(encodedKey);
}

export async function encryptRefresh(payload: SessionPayload) {
  return new EncryptJWT(payload as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: "dir", enc: "A256GCM" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .encrypt(encodedRefreshKey);
}

export async function decrypt(session: string | undefined = "") {
  try {
    const { payload } = await jwtDecrypt(session!, encodedKey, {
      contentEncryptionAlgorithms: ["A256GCM"],
    });
    return payload;
  } catch {
    return null;
  }
}

export async function decryptRefresh(session: string | undefined = "") {
  try {
    const { payload } = await jwtDecrypt(session!, encodedRefreshKey, {
      contentEncryptionAlgorithms: ["A256GCM"],
    });
    return payload;
  } catch {
    return null;
  }
}

// ─── Session Management ──────────────────────────────────────────────────────
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

  // Store a SHA-256 hash of the token instead of the raw JWE string
  const tokenHash = hashToken(refreshToken);

  await prisma.session.create({
    data: {
      userId,
      sessionToken: tokenHash,
      expires: refreshExpiresAt,
    },
  });

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
  };

  await setChunkedCookie("accessToken", accessToken, {
    ...cookieOptions,
    expires: expiresAt,
  });

  await setChunkedCookie("refreshToken", refreshToken, {
    ...cookieOptions,
    expires: refreshExpiresAt,
  });
}

export async function verifySession() {
  const accessToken = await getChunkedCookie("accessToken");

  const session = await decrypt(accessToken);

  if (!session?.userId) return null;

  return {
    isAuth: true,
    userId: session.userId as string,
    permissions: session.permissions as string[],
  };
}

/**
 * Refresh Token Rotation (RTR)
 *
 * When the access token expires and the client presents a valid refresh token,
 * this function:
 *  1. Validates the refresh token (JWE decryption + expiry check)
 *  2. Verifies the token hash still exists in the database (not already revoked)
 *  3. Deletes the old refresh token hash from the database
 *  4. Issues a brand-new refresh token and stores its hash in the database
 *  5. Issues a new short-lived access token
 *
 * If a previously-revoked refresh token is presented (replay attack), all
 * sessions for the user are terminated as a safety measure.
 *
 * Returns the new access token string (for proxy to set via response cookie),
 * or null if rotation failed.
 */
export async function rotateSession(oldRefreshToken: string): Promise<{
  accessToken: string;
  refreshToken: string;
  accessExpiresAt: Date;
  refreshExpiresAt: Date;
  userId: string;
} | null> {
  const refreshPayload = await decryptRefresh(oldRefreshToken);

  // Token could not be decrypted or is expired
  if (!refreshPayload?.userId) return null;
  if (refreshPayload.exp && Date.now() >= refreshPayload.exp * 1000) return null;

  const userId = refreshPayload.userId as string;

  // Hash the old token and look it up in the database
  const oldTokenHash = hashToken(oldRefreshToken);

  const existingSession = await prisma.session.findUnique({
    where: { sessionToken: oldTokenHash },
  });

  if (!existingSession) {
    // 🚨 Replay attack detected — this token was already consumed.
    // Revoke ALL sessions for the user as a precaution.
    await prisma.session.deleteMany({ where: { userId } });
    return null;
  }

  // Delete the old refresh token hash (consume it)
  await prisma.session.delete({
    where: { id: existingSession.id },
  });

  // Issue new tokens with fresh permissions
  const accessExpiresAt = new Date(Date.now() + 15 * 60 * 1000);
  const refreshExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const freshPermissions = await getUserPermissions(userId);

  const newAccessToken = await encrypt({
    userId,
    permissions: freshPermissions,
    expiresAt: accessExpiresAt,
  });

  const newRefreshToken = await encryptRefresh({
    userId,
    permissions: freshPermissions,
    expiresAt: refreshExpiresAt,
  });

  // Store the new refresh token hash in the database
  const newTokenHash = hashToken(newRefreshToken);

  await prisma.session.create({
    data: {
      userId,
      sessionToken: newTokenHash,
      expires: refreshExpiresAt,
    },
  });

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
    accessExpiresAt,
    refreshExpiresAt,
    userId,
  };
}

export async function deleteSession() {
  const refreshToken = await getChunkedCookie("refreshToken");

  if (refreshToken) {
    // Hash the cookie value and revoke the matching database entry
    const tokenHash = hashToken(refreshToken);
    await prisma.session.deleteMany({
      where: { sessionToken: tokenHash },
    });
  }

  await deleteChunkedCookie("accessToken");
  await deleteChunkedCookie("refreshToken");
}

export async function getUserRoles(userId: string) {
  const userRoles = await prisma.userRole.findMany({
    where: { userId },
    include: { role: true },
  });
  return userRoles.map((ur) => ur.role.name);
}
