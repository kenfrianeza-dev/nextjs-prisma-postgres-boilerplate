import { NextRequest, NextResponse } from "next/server";
import { decrypt, decryptRefresh, encrypt } from "@/lib/auth";
import { cookies } from "next/headers";

const protectedRoutes = ["/dashboard", "/admin"];
const authRoutes = ["/signup"];

export default async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  let session = await decrypt(accessToken);

  console.log("Session of currently logged in user:");
  console.log(session);

  // 🔁 Try refresh token if access token expired
  if (!session && refreshToken) {
    const refreshPayload = await decryptRefresh(refreshToken);

    if (refreshPayload?.exp && Date.now() < refreshPayload.exp * 1000) {
      const newExpiresAt = new Date(Date.now() + 15 * 60 * 1000);
      const newAccessToken = await encrypt({
        userId: refreshPayload.userId as string,
        expiresAt: newExpiresAt,
        permissions: refreshPayload.permissions as string[],
      });

      const response = NextResponse.next();
      response.cookies.set("accessToken", newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        expires: newExpiresAt,
        sameSite: "lax",
        path: "/",
      });

      return response;
    }
  }

  // 🔒 Block private routes
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

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
