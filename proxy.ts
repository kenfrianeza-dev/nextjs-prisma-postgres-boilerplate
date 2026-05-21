import { NextRequest, NextResponse } from "next/server";
import { decrypt, rotateSession } from "@/lib/auth";

const protectedRoutes = ["/dashboard", "/admin"];
const authRoutes = ["/signup"];

// ─── Cookie Chunking Helpers (proxy-compatible) ─────────────────────────────
// The proxy runs in the Edge/Node middleware context where we read cookies from
// the NextRequest and write them to the NextResponse. These helpers mirror the
// chunking logic in lib/auth.ts but operate on request/response objects instead
// of the `cookies()` API.
const CHUNK_SIZE = 3800;

function getChunkedCookieFromRequest(
  req: NextRequest,
  name: string
): string | undefined {
  const chunkCountStr = req.cookies.get(`${name}.count`)?.value;

  if (!chunkCountStr) {
    return req.cookies.get(name)?.value;
  }

  const chunkCount = parseInt(chunkCountStr, 10);
  let value = "";
  for (let i = 0; i < chunkCount; i++) {
    const chunk = req.cookies.get(`${name}.${i}`)?.value;
    if (!chunk) return undefined;
    value += chunk;
  }
  return value;
}

function setChunkedCookieOnResponse(
  res: NextResponse,
  name: string,
  value: string,
  options: {
    httpOnly: boolean;
    secure: boolean;
    expires: Date;
    sameSite: "lax" | "strict" | "none";
    path: string;
  },
  req?: NextRequest,
) {
  // Clean up any previous chunks using the request for targeted deletion
  deleteChunkedCookieOnResponse(res, name, req);

  if (value.length <= CHUNK_SIZE) {
    res.cookies.set(name, value, options);
    return;
  }

  const totalChunks = Math.ceil(value.length / CHUNK_SIZE);
  for (let i = 0; i < totalChunks; i++) {
    const chunk = value.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE);
    res.cookies.set(`${name}.${i}`, chunk, options);
  }
  res.cookies.set(`${name}.count`, totalChunks.toString(), options);
}

/**
 * Targeted cookie chunk cleanup.
 *
 * When a NextRequest is available, we read the client's actual `${name}.count`
 * cookie to determine exactly how many chunk cookies exist and delete only
 * those — avoiding a blind loop that emits unnecessary Set-Cookie headers.
 */
function deleteChunkedCookieOnResponse(
  res: NextResponse,
  name: string,
  req?: NextRequest,
) {
  if (req) {
    // Targeted cleanup using the client's actual chunk count
    const chunkCountStr = req.cookies.get(`${name}.count`)?.value;
    if (chunkCountStr) {
      const chunkCount = parseInt(chunkCountStr, 10);
      for (let i = 0; i < chunkCount; i++) {
        res.cookies.delete(`${name}.${i}`);
      }
      res.cookies.delete(`${name}.count`);
    }
  } else {
    // Fallback: blind cleanup when we don't have the request context
    for (let i = 0; i < 10; i++) {
      res.cookies.delete(`${name}.${i}`);
    }
    res.cookies.delete(`${name}.count`);
  }

  res.cookies.delete(name);
}

// ─── Proxy Handler ──────────────────────────────────────────────────────────
export default async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  let accessToken = getChunkedCookieFromRequest(req, "accessToken");
  const refreshToken = getChunkedCookieFromRequest(req, "refreshToken");

  let session = await decrypt(accessToken);
  let response = NextResponse.next();

  // 🔁 Refresh Token Rotation — if the access token expired, attempt to
  // rotate the refresh token. This consumes the old refresh token in the
  // database and issues a brand-new pair of tokens.
  if (!session && refreshToken) {
    const rotated = await rotateSession(refreshToken);

    if (rotated) {
      const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax" as const,
        path: "/",
      };

      // 1. Write headers to response for browser storage
      setChunkedCookieOnResponse(response, "accessToken", rotated.accessToken, {
        ...cookieOptions,
        expires: rotated.accessExpiresAt,
      }, req);

      setChunkedCookieOnResponse(response, "refreshToken", rotated.refreshToken, {
        ...cookieOptions,
        expires: rotated.refreshExpiresAt,
      }, req);

      // 2. Inject into the active request cookie state so upstream Server
      //    Components and API handlers see the rotated tokens during this
      //    render cycle (prevents 401 desync on layout renders).
      req.cookies.set("accessToken", rotated.accessToken);
      req.cookies.set("refreshToken", rotated.refreshToken);

      // 3. Decrypt the new access token and continue down the route guard
      //    pipeline instead of short-circuiting — prevents the security
      //    bypass where any expired token could skip auth checks.
      session = await decrypt(rotated.accessToken);
    }
  }

  // 🔒 Guard Checks (fully evaluated following any token rotation events)
  if (isProtectedRoute && !session?.userId) {
    const loginUrl = new URL("/", req.nextUrl);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 🔁 Prevent logged-in users from visiting login/signup
  if (isAuthRoute && session?.userId) {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
  }

  // Redirect logged-in users away from home
  if (pathname === "/" && session?.userId) {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)" ],
};
