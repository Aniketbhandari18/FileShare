import { NextRequest, NextResponse } from "next/server";
import { decodeJwtToken } from "./lib/decodeJwtToken";

const protectedRoutes = ["/dashboard"];
const publicRoutes = ["/sign-up", "/sign-in"];

export async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;

  const accessToken = req.cookies.get("accessToken")?.value;
  const refreshToken = req.cookies.get("refreshToken")?.value;

  //decode tokens
  const decodedAccessToken = decodeJwtToken(
    accessToken,
    process.env.ACCESS_TOKEN_SECRET!
  );
  const decodedRefreshToken = decodeJwtToken(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET!
  );

  const isProtectedRoute = protectedRoutes.some((p) => path.startsWith(p));
  const isPublicRoute = publicRoutes.includes(path);

  const isAuthenticated = Boolean(
    decodedAccessToken?.userId || decodedRefreshToken?.userId
  );

  if (isProtectedRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  if (isPublicRoute && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
