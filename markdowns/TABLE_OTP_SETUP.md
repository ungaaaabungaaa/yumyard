# Table OTP Authentication Setup

This document explains how to set up and use the table OTP authentication system using the 2Factor API.

## Prerequisites

1. **2Factor API Key**: You need to obtain an API key from [2Factor.in](https://2factor.in)
2. **Environment Variable**: Add your API key to your `.env.local` file

## Environment Setup

Add the following to your `.env.local` file:

```env
TWO_FACTOR_API_KEY=XXXX-XXXX-XXXX-XXXX-XXXX
```

Replace `XXXX-XXXX-XXXX-XXXX-XXXX` with your actual 2Factor API key.

## API Endpoints

### 1. Send OTP

**Endpoint:** `POST /api/table-otp`

**Description:** Sends an OTP to the specified phone number.

**Request Body:**
```json
{
  "phoneNumber": "+919999999999",
  "otpTemplateName": "OTP1" // Optional
}
```

**Request Parameters:**
- `phoneNumber` (required): Phone number in international format (must start with `+`)
- `otpTemplateName` (optional): Name of the OTP template to use

**Success Response (200):**
```json
{
  "success": true,
  "message": "OTP sent successfully",
  "sessionId": "session-id-from-2factor"
}
```

**Error Responses:**

- `400 Bad Request`: Missing or invalid phone number format
```json
{
  "error": "Phone number must be in international format (e.g., +919999999999)"
}
```

- `500 Internal Server Error`: API key not configured or 2Factor API error
```json
{
  "error": "2Factor API key is not configured"
}
```

**Example Usage:**

```typescript
const response = await fetch('/api/table-otp', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    phoneNumber: '+919999999999',
    otpTemplateName: 'OTP1' // Optional
  }),
});

const data = await response.json();
```

---

### 2. Verify OTP

**Endpoint:** `POST /api/table-verify-otp`

**Description:** Verifies the OTP entered by the user.

**Request Body:**
```json
{
  "phoneNumber": "+919999999999",
  "otp": "1234"
}
```

**Request Parameters:**
- `phoneNumber` (required): Phone number (with or without `+` prefix)
- `otp` (required): 4-6 digit OTP value entered by the user

**Success Response (200):**
```json
{
  "success": true,
  "message": "OTP verified successfully",
  "details": "verification-details"
}
```

**Error Responses:**

- `400 Bad Request`: Missing or invalid parameters
```json
{
  "error": "OTP must be 4-6 digits"
}
```

- `401 Unauthorized`: Invalid OTP
```json
{
  "success": false,
  "error": "Invalid OTP"
}
```

- `500 Internal Server Error`: API key not configured or server error
```json
{
  "error": "Internal server error"
}
```

**Example Usage:**

```typescript
const response = await fetch('/api/table-verify-otp', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    phoneNumber: '+919999999999',
    otp: '1234'
  }),
});

const data = await response.json();

if (data.success) {
  // OTP verified successfully
  console.log('OTP verified!');
} else {
  // Invalid OTP
  console.error(data.error);
}
```

---

## Complete Flow Example

Here's a complete example of how to implement the OTP flow in your frontend:

```typescript
// Step 1: Send OTP
async function sendOTP(phoneNumber: string) {
  try {
    const response = await fetch('/api/table-otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phoneNumber: phoneNumber,
      }),
    });

    const data = await response.json();
    
    if (data.success) {
      console.log('OTP sent successfully');
      return true;
    } else {
      console.error('Failed to send OTP:', data.error);
      return false;
    }
  } catch (error) {
    console.error('Error sending OTP:', error);
    return false;
  }
}

// Step 2: Verify OTP
async function verifyOTP(phoneNumber: string, otp: string) {
  try {
    const response = await fetch('/api/table-verify-otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phoneNumber: phoneNumber,
        otp: otp,
      }),
    });

    const data = await response.json();
    
    if (data.success) {
      console.log('OTP verified successfully');
      return true;
    } else {
      console.error('Invalid OTP:', data.error);
      return false;
    }
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return false;
  }
}

// Usage
const phoneNumber = '+919999999999';

// Send OTP
await sendOTP(phoneNumber);

// User enters OTP, then verify
const userEnteredOTP = '1234'; // Get from user input
await verifyOTP(phoneNumber, userEnteredOTP);
```

---

## Notes

1. **Phone Number Format:**
   - For sending OTP: Must include `+` prefix (e.g., `+919999999999`)
   - For verifying OTP: Can include or exclude `+` prefix (the API will handle it)

2. **OTP Generation:**
   - The OTP is automatically generated as a 4-digit number
   - The OTP is sent via 2Factor API
   - In production, you may want to store the OTP in a database/cache for additional validation

3. **Security:**
   - Never expose your 2Factor API key in client-side code
   - Always use environment variables for sensitive data
   - Consider implementing rate limiting to prevent abuse

4. **Error Handling:**
   - Always handle errors appropriately in your frontend
   - Display user-friendly error messages
   - Implement retry logic for network failures

---

## 2Factor API Documentation

For more details about the 2Factor API, visit:
- [2Factor.in Documentation](https://2factor.in/API/V1/)

---

## Troubleshooting

**Issue:** "2Factor API key is not configured"
- **Solution:** Make sure you've added `TWO_FACTOR_API_KEY` to your `.env.local` file and restarted your development server.

**Issue:** "Failed to send OTP"
- **Solution:** 
  - Verify your API key is correct
  - Check your 2Factor account balance
  - Ensure the phone number is in the correct format

**Issue:** "Invalid OTP"
- **Solution:**
  - Make sure the OTP hasn't expired (OTPs typically expire after a few minutes)
  - Verify the phone number matches the one used to send the OTP
  - Ensure the OTP value is entered correctly

