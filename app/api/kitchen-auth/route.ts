import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  const body = await req.json();
  const { name, number, pin } = body;

  // Validate all details
  const valid =
    name === process.env.KITCHEN_NAME &&
    number === process.env.KITCHEN_NUMBER &&
    pin === process.env.KITCHEN_PIN;

  if (!valid) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  // Create signed JWT with current timestamp for better tracking
  const token = jwt.sign(
    { 
      role: "kitchen",
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60) // 7 days from now
    }, 
    process.env.KITCHEN_SECRET!
  );

  const res = NextResponse.json({ success: true });
  res.cookies.set("kitchen_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax", // Use lax in development
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days in seconds
  });

  return res;
}

// Add logout endpoint
export async function DELETE() {
  const res = NextResponse.json({ success: true, message: "Logged out successfully" });
  
  // Clear the kitchen token cookie
  res.cookies.set("kitchen_token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 0, // Expire immediately
    expires: new Date(0), // Set to past date
  });

  return res;
}
