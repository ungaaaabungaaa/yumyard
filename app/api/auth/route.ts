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

  // Create signed JWT
  const token = jwt.sign({ role: "admin" }, process.env.ADMIN_SECRET!, {
    expiresIn: "1d",
  });

  const res = NextResponse.json({ success: true });
  res.cookies.set("admin_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24, // 1 day
  });

  return res;
}
