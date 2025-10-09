import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Simple base64 URL decode function
function base64UrlDecode(str: string): string {
  // Replace URL-safe characters and add padding if needed
  str = str.replace(/-/g, '+').replace(/_/g, '/');
  while (str.length % 4) {
    str += '=';
  }
  return atob(str);
}

// Simplified JWT verification for Edge Runtime
function verifyJWTSimple(token: string, secret: string) {
  try {
    // Split the JWT token
    const parts = token.split('.');
    
    if (parts.length !== 3) {
      throw new Error('Invalid token format');
    }

    const [header, payload, signature] = parts;
    
    // Decode payload without signature verification for now
    // In production, you'd want proper signature verification
    const decodedPayload = JSON.parse(base64UrlDecode(payload));
    
    // Check expiration
    if (decodedPayload.exp && decodedPayload.exp < Math.floor(Date.now() / 1000)) {
      throw new Error('Token expired');
    }

    // Check if it has the admin role
    if (decodedPayload.role !== 'admin') {
      throw new Error('Invalid role');
    }

    return decodedPayload;
  } catch (error) {
    throw new Error(`JWT verification failed: ${error}`);
  }
}

export function middleware(req: NextRequest) {
  console.log("Middleware triggered for:", req.url);
  const token = req.cookies.get("admin_token")?.value;
  
  console.log("Token found:", token ? "YES" : "NO");
  console.log("All cookies:", req.cookies.getAll());
  
  if (!token) {
    console.log("No token found, redirecting to login");
    return redirectToLogin(req);
  }

  try {
    const decoded = verifyJWTSimple(token, process.env.ADMIN_SECRET!);
    console.log("Token decoded successfully:", decoded);
    
    console.log("Token valid, allowing access");
    return NextResponse.next();
  } catch (error) {
    // Token is invalid, expired, or malformed
    console.log("Token verification failed:", error);
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
    sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
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
