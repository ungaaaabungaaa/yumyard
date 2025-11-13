"use client";

import { useState } from "react";

export default function TestOTPTablesPage() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Format phone number to only allow 10 digits
  const formatPhoneNumber = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 10);
    return digits;
  };

  // Validate phone number (exactly 10 digits)
  const isValidPhoneNumber = (phone: string) => {
    return /^\d{10}$/.test(phone);
  };

  // Validate OTP (4-6 digits)
  const isValidOTP = (otpValue: string) => {
    return /^\d{4,6}$/.test(otpValue);
  };

  // Handle send OTP
  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!isValidPhoneNumber(phoneNumber)) {
      setMessage({ type: "error", text: "Please enter a valid 10-digit phone number" });
      return;
    }

    setIsLoading(true);
    try {
      // Format phone number with +91 prefix for Indian numbers
      const formattedPhone = `+91${phoneNumber}`;

      const response = await fetch("/api/table-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phoneNumber: formattedPhone,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: "success", text: "OTP sent successfully!" });
        setIsOtpSent(true);
        setOtp(""); // Clear OTP field
      } else {
        setMessage({ type: "error", text: data.error || "Failed to send OTP" });
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      setMessage({ type: "error", text: "An error occurred. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle verify OTP
  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!isValidOTP(otp)) {
      setMessage({ type: "error", text: "Please enter a valid 4-6 digit OTP" });
      return;
    }

    setIsLoading(true);
    try {
      // Format phone number with +91 prefix
      const formattedPhone = `+91${phoneNumber}`;

      const response = await fetch("/api/table-verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phoneNumber: formattedPhone,
          otp: otp,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: "success", text: "OTP verified successfully! ✅" });
        // Reset form after successful verification
        setTimeout(() => {
          setPhoneNumber("");
          setOtp("");
          setIsOtpSent(false);
          setMessage(null);
        }, 2000);
      } else {
        setMessage({ type: "error", text: data.error || "Invalid OTP" });
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      setMessage({ type: "error", text: "An error occurred. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle reset
  const handleReset = () => {
    setPhoneNumber("");
    setOtp("");
    setIsOtpSent(false);
    setMessage(null);
  };

  return (
    <div className="flex flex-col items-center w-full min-h-screen py-8 px-4">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-typography-heading mb-2 text-center">
          Test OTP Tables
        </h1>
        <p className="text-typography-secondary mb-8 text-center">
          Test the table OTP authentication system
        </p>

        {/* Phone Number Form */}
        {!isOtpSent ? (
          <form onSubmit={handleSendOTP} className="w-full space-y-4">
            <div className="relative">
              <label htmlFor="phone" className="block text-sm font-medium text-typography-heading mb-2">
                Phone Number (10 digits)
              </label>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-medium text-typography-heading">+91</span>
                <input
                  id="phone"
                  type="tel"
                  placeholder="Enter 10-digit phone number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(formatPhoneNumber(e.target.value))}
                  maxLength={10}
                  className="flex-1 py-6 px-6 border-2 rounded-3xl text-2xl font-normal text-typography-heading placeholder-typography-light-grey focus:outline-none focus:ring-2 focus:border-transparent"
                  required
                />
              </div>
              {phoneNumber && !isValidPhoneNumber(phoneNumber) && (
                <p className="text-red-500 text-sm mt-1">
                  Phone number must be exactly 10 digits
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={!isValidPhoneNumber(phoneNumber) || isLoading}
              className={`w-full py-6 px-8 rounded-2xl text-lg font-bold transition-colors duration-200 ${
                isValidPhoneNumber(phoneNumber) && !isLoading
                  ? "bg-background-primary text-white hover:opacity-90"
                  : "bg-background-disabled text-typography-disabled cursor-not-allowed"
              }`}
            >
              {isLoading ? "Sending..." : "Send OTP"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOTP} className="w-full space-y-4">
            <div className="relative">
              <label htmlFor="phone-display" className="block text-sm font-medium text-typography-heading mb-2">
                Phone Number
              </label>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-medium text-typography-heading">+91</span>
                <input
                  id="phone-display"
                  type="tel"
                  value={phoneNumber}
                  disabled
                  className="flex-1 py-6 px-6 border-2 rounded-3xl text-2xl font-normal text-typography-disabled bg-background-element-background cursor-not-allowed"
                />
              </div>
            </div>

            <div className="relative">
              <label htmlFor="otp" className="block text-sm font-medium text-typography-heading mb-2">
                Enter OTP
              </label>
              <input
                id="otp"
                type="text"
                placeholder="Enter 4-6 digit OTP"
                value={otp}
                onChange={(e) => {
                  const digits = e.target.value.replace(/\D/g, "").slice(0, 6);
                  setOtp(digits);
                }}
                maxLength={6}
                className="w-full py-6 px-6 border-2 rounded-3xl text-2xl font-normal text-typography-heading placeholder-typography-light-grey focus:outline-none focus:ring-2 focus:border-transparent text-center tracking-widest"
                required
                autoFocus
              />
              {otp && !isValidOTP(otp) && (
                <p className="text-red-500 text-sm mt-1">
                  OTP must be 4-6 digits
                </p>
              )}
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleReset}
                disabled={isLoading}
                className="flex-1 py-6 px-8 rounded-2xl text-lg font-bold transition-colors duration-200 bg-background-secondary text-typography-heading hover:opacity-90 disabled:opacity-50"
              >
                Change Number
              </button>
              <button
                type="submit"
                disabled={!isValidOTP(otp) || isLoading}
                className={`flex-1 py-6 px-8 rounded-2xl text-lg font-bold transition-colors duration-200 ${
                  isValidOTP(otp) && !isLoading
                    ? "bg-background-primary text-white hover:opacity-90"
                    : "bg-background-disabled text-typography-disabled cursor-not-allowed"
                }`}
              >
                {isLoading ? "Verifying..." : "Verify OTP"}
              </button>
            </div>
          </form>
        )}

        {/* Message Display */}
        {message && (
          <div
            className={`mt-4 p-4 rounded-2xl ${
              message.type === "success"
                ? "bg-green-100 text-green-800 border border-green-300"
                : "bg-red-100 text-red-800 border border-red-300"
            }`}
          >
            <p className="text-center font-medium">{message.text}</p>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-8 p-4 rounded-2xl bg-background-element-background">
          <h3 className="text-lg font-semibold text-typography-heading mb-2">
            Instructions:
          </h3>
          <ul className="text-sm text-typography-secondary space-y-1 list-disc list-inside">
            <li>Enter a 10-digit Indian phone number</li>
            <li>Click "Send OTP" to receive an OTP via SMS</li>
            <li>Enter the OTP you receive</li>
            <li>Click "Verify OTP" to verify</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

