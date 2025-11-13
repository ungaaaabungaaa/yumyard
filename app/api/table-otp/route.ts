import { NextResponse } from "next/server";

/**
 * POST /api/table-otp
 * Send OTP to a phone number using 2Factor API
 * 
 * Request body:
 * {
 *   "phoneNumber": "+919999999999" // Phone number in international format
 *   "otpTemplateName": "OTP Template" // Optional template name (defaults to "OTP Template")
 * }
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { phoneNumber, otpTemplateName } = body;

    // Validate phone number
    if (!phoneNumber) {
      return NextResponse.json(
        { error: "Phone number is required" },
        { status: 400 }
      );
    }

    // Validate phone number format (should start with +)
    if (!phoneNumber.startsWith("+")) {
      return NextResponse.json(
        { error: "Phone number must be in international format (e.g., +919999999999)" },
        { status: 400 }
      );
    }

    // Get API key from environment variables
    const apiKey = process.env.TWO_FACTOR_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "2Factor API key is not configured" },
        { status: 500 }
      );
    }

    // Generate a 4-6 digit OTP
    const otpValue = Math.floor(1000 + Math.random() * 9000).toString(); // 4-digit OTP

    // Build the 2Factor API URL
    // Use provided template name or default to "OTP Template"
    const templateName = otpTemplateName || "OTP Template";
    const apiUrl = `https://2factor.in/API/V1/${apiKey}/SMS/${phoneNumber}/${otpValue}/${templateName}`;

    // Call 2Factor API
    const response = await fetch(apiUrl, {
      method: "GET",
    });

    const data = await response.json();

    // Check if the API call was successful
    if (!response.ok || data.Status !== "Success") {
      return NextResponse.json(
        { error: data.Details || "Failed to send OTP" },
        { status: response.status || 500 }
      );
    }

    // Return success response
    // Note: In production, you might want to store the OTP in a database/cache
    // for verification, but for now we're returning it (you may want to remove this)
    return NextResponse.json({
      success: true,
      message: "OTP sent successfully",
      sessionId: data.Details, // 2Factor returns a session ID
      // otpValue: otpValue // Remove this in production - only for testing
    });
  } catch (error) {
    console.error("Error sending OTP:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

