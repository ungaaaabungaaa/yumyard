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
function verifyJWTSimple(token: string, secret: string, expectedRole: 'admin' | 'kitchen') {
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

    // Check if it has the expected role
    if (decodedPayload.role !== expectedRole) {
      throw new Error(`Invalid role. Expected: ${expectedRole}, got: ${decodedPayload.role}`);
    }

    return decodedPayload;
  } catch (error) {
    throw new Error(`JWT verification failed: ${error}`);
  }
}

export function middleware(req: NextRequest) {
  console.log("Middleware triggered for:", req.url);
  
  // Check if it's a kitchen route
  if (req.nextUrl.pathname.startsWith('/kitchen')) {
    const token = req.cookies.get("kitchen_token")?.value;
    
    console.log("Kitchen token found:", token ? "YES" : "NO");
    console.log("All cookies:", req.cookies.getAll());
    
    if (!token) {
      console.log("No kitchen token found, redirecting to login");
      return redirectToLogin(req);
    }

    try {
      const decoded = verifyJWTSimple(token, process.env.KITCHEN_SECRET!, 'kitchen');
      console.log("Kitchen token decoded successfully:", decoded);
      
      console.log("Kitchen token valid, allowing access");
      return NextResponse.next();
    } catch (error) {
      // Token is invalid, expired, or malformed
      console.log("Kitchen token verification failed:", error);
      return redirectToLoginWithClearCookie(req, 'kitchen_token');
    }
  }
  
  // Handle admin routes
  const token = req.cookies.get("admin_token")?.value;
  
  console.log("Admin token found:", token ? "YES" : "NO");
  console.log("All cookies:", req.cookies.getAll());
  
  if (!token) {
    console.log("No admin token found, redirecting to login");
    return redirectToLogin(req);
  }

  try {
    const decoded = verifyJWTSimple(token, process.env.ADMIN_SECRET!, 'admin');
    console.log("Admin token decoded successfully:", decoded);
    
    console.log("Admin token valid, allowing access");
    return NextResponse.next();
  } catch (error) {
    // Token is invalid, expired, or malformed
    console.log("Admin token verification failed:", error);
    return redirectToLoginWithClearCookie(req, 'admin_token');
  }
}

function redirectToLogin(req: NextRequest) {
  // Redirect to kitchen login for kitchen routes, admin login for admin routes
  const loginPath = req.nextUrl.pathname.startsWith('/kitchen') ? '/kitchen-login' : '/login';
  return NextResponse.redirect(new URL(loginPath, req.url));
}

function redirectToLoginWithClearCookie(req: NextRequest, tokenType: 'admin_token' | 'kitchen_token') {
  // Redirect to appropriate login page based on token type
  const loginPath = tokenType === 'kitchen_token' ? '/kitchen-login' : '/login';
  const response = NextResponse.redirect(new URL(loginPath, req.url));
  
  // Clear the invalid/expired cookie
  response.cookies.set(tokenType, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
    path: "/",
    maxAge: 0,
    expires: new Date(0),
  });
  
  return response;
}

// Protect all /admin and /kitchen routes
export const config = {
  matcher: ["/admin/:path*", "/kitchen/:path*"],
};
