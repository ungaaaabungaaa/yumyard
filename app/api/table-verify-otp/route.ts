import { NextResponse } from "next/server";

/**
 * POST /api/table-verify-otp
 * Verify OTP using 2Factor API
 * 
 * Request body:
 * {
 *   "phoneNumber": "919999999999" // Phone number without + prefix (as per 2Factor API requirement)
 *   "otp": "1234" // OTP value entered by user
 * }
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { phoneNumber, otp } = body;

    // Validate phone number
    if (!phoneNumber) {
      return NextResponse.json(
        { error: "Phone number is required" },
        { status: 400 }
      );
    }

    // Validate OTP
    if (!otp) {
      return NextResponse.json(
        { error: "OTP is required" },
        { status: 400 }
      );
    }

    // Validate OTP format (should be 4-6 digits)
    if (!/^\d{4,6}$/.test(otp)) {
      return NextResponse.json(
        { error: "OTP must be 4-6 digits" },
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

    // Remove + prefix if present (2Factor API expects format: 91XXXXXXXXXX)
    const formattedPhoneNumber = phoneNumber.replace(/^\+/, "");

    // Build the 2Factor API URL for verification
    const apiUrl = `https://2factor.in/API/V1/${apiKey}/SMS/VERIFY3/${formattedPhoneNumber}/${otp}`;

    // Call 2Factor API
    const response = await fetch(apiUrl, {
      method: "GET",
    });

    const data = await response.json();

    // Check if the OTP verification was successful
    if (!response.ok || data.Status !== "Success") {
      return NextResponse.json(
        { 
          success: false,
          error: data.Details || "Invalid OTP" 
        },
        { status: response.status || 401 }
      );
    }

    // Return success response
    return NextResponse.json({
      success: true,
      message: "OTP verified successfully",
      details: data.Details,
    });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

