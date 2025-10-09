import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  const body = await req.json();
  const { name, dob, aadhaar, pan, phone } = body;

  // Validate all details
  const valid =
    name === process.env.ADMIN_NAME &&
    dob === process.env.ADMIN_DOB &&
    aadhaar === process.env.ADMIN_AADHAAR &&
    pan === process.env.ADMIN_PAN &&
    phone === process.env.ADMIN_PHONE;

  if (!valid) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  // Create signed JWT with current timestamp for better tracking
  const token = jwt.sign(
    { 
      role: "admin",
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours from now
    }, 
    process.env.ADMIN_SECRET!
  );

  const res = NextResponse.json({ success: true });
  res.cookies.set("admin_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict", // Prevents CSRF attacks
    path: "/",
    maxAge: 60 * 60 * 24, // 1 day in seconds
    // Remove expires to make it a session cookie that clears on browser close
  });

  return res;
}

// Add logout endpoint
export async function DELETE(req: Request) {
  const res = NextResponse.json({ success: true, message: "Logged out successfully" });
  
  // Clear the admin token cookie
  res.cookies.set("admin_token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 0, // Expire immediately
    expires: new Date(0), // Set to past date
  });

  return res;
}
