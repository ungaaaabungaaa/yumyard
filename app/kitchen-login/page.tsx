"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function KitchenLoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    number: "",
    pin: "",
  });
  const [error, setError] = useState("");

  // Helper function to format name (max 50 characters)
  const formatName = (value: string) => {
    return value.slice(0, 50);
  };

  // Helper function to format number (numbers only, max 15 digits)
  const formatNumber = (value: string) => {
    return value.replace(/\D/g, '').slice(0, 15);
  };

  // Helper function to format pin (numbers only, max 6 digits)
  const formatPin = (value: string) => {
    return value.replace(/\D/g, '').slice(0, 6);
  };

  // Validation functions
  const isValidName = (name: string) => {
    return name.trim().length > 0 && name.length <= 50;
  };

  const isValidNumber = (number: string) => {
    return /^\d{1,15}$/.test(number) && number.length >= 1;
  };

  const isValidPin = (pin: string) => {
    return /^\d{1,6}$/.test(pin) && pin.length >= 1;
  };

  // Helper function to validate individual fields
  const isValidField = (key: string, value: string) => {
    switch (key) {
      case 'name':
        return isValidName(value);
      case 'number':
        return isValidNumber(value);
      case 'pin':
        return isValidPin(value);
      default:
        return true;
    }
  };

  // Helper function to get validation error messages
  const getValidationMessage = (key: string) => {
    switch (key) {
      case 'name':
        return 'Name must be 1-50 characters long';
      case 'number':
        return 'Number must be 1-15 digits';
      case 'pin':
        return 'PIN must be 1-6 digits';
      default:
        return '';
    }
  };

  // Check if all form fields are filled and valid
  const isFormComplete = isValidName(form.name) && isValidNumber(form.number) && isValidPin(form.pin);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const res = await fetch("/api/kitchen-auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        router.push("/kitchen");
      } else {
        setError("Invalid credentials");
      }
    } catch {
      setError("Login failed. Please try again.");
    }
  };

  // Handle input changes with formatting
  const handleInputChange = (key: string, value: string) => {
    let formattedValue = value;
    
    switch (key) {
      case 'name':
        formattedValue = formatName(value);
        break;
      case 'number':
        formattedValue = formatNumber(value);
        break;
      case 'pin':
        formattedValue = formatPin(value);
        break;
    }
    
    setForm({ ...form, [key]: formattedValue });
  };

  const formFields = [
    { key: "name", placeholder: "Chef Name", maxLength: 50, type: "text" },
    { key: "number", placeholder: "Chef Number", maxLength: 15, type: "tel" },
    { key: "pin", placeholder: "PIN Code", maxLength: 6, type: "password" },
  ];

  return (
    <div className="flex flex-col items-center w-full">
      
      <form onSubmit={handleSubmit} className="py-2 w-full space-y-4">
        {formFields.map((field) => (
          <div key={field.key} className="relative">
            <input
              type={field.type}
              placeholder={field.placeholder}
              value={form[field.key as keyof typeof form]}
              onChange={(e) => handleInputChange(field.key, e.target.value)}
              maxLength={field.maxLength}
              className="w-full py-6 px-6 border-2 rounded-3xl text-2xl font-normal text-typography-heading placeholder-typography-light-grey focus:outline-none focus:ring-2 focus:border-transparent"
              required
            />
            {form[field.key as keyof typeof form] && !isValidField(field.key, form[field.key as keyof typeof form]) && (
              <p className="text-red-500 text-sm mt-1">
                {getValidationMessage(field.key)}
              </p>
            )}
          </div>
        ))}
        
        <button 
          type="submit" 
          onClick={handleSubmit}
          disabled={!isFormComplete}
          className={`w-full py-6 px-8 rounded-2xl text-lg font-bold transition-colors duration-200 my-4 ${
            isFormComplete 
              ? 'bg-background-primary text-typography-white ' 
              : 'bg-background-disabled  text-typography-disabled  cursor-not-allowed'
          }`}
        >
          Login to Kitchen
        </button>
        {error && <p className="text-red-500 mb-2 text-center">{error}</p>}
      </form>
    </div>
  );
}
