import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("admin_token")?.value;
  
  if (!token) {
    return redirectToLogin(req);
  }

  try {
    const decoded = jwt.verify(token, process.env.ADMIN_SECRET!) as jwt.JwtPayload;
    
    // Check if token is expired (additional safety check)
    if (decoded.exp && decoded.exp < Math.floor(Date.now() / 1000)) {
      return redirectToLoginWithClearCookie(req);
    }
    
    // Check if token is valid admin role
    if (decoded.role !== "admin") {
      return redirectToLoginWithClearCookie(req);
    }
    
    return NextResponse.next();
  } catch {
    // Token is invalid, expired, or malformed
    return redirectToLoginWithClearCookie(req);
  }
}

function redirectToLogin(req: NextRequest) {
  return NextResponse.redirect(new URL("/login", req.url));
}

function redirectToLoginWithClearCookie(req: NextRequest) {
  const response = NextResponse.redirect(new URL("/login", req.url));
  
  // Clear the invalid/expired cookie
  response.cookies.set("admin_token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 0,
    expires: new Date(0),
  });
  
  return response;
}

// Protect all /admin routes
export const config = {
  matcher: ["/admin/:path*"],
};
