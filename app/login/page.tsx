"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    dob: "",
    aadhaar: "",
    pan: "",
    phone: "",
  });
  const [error, setError] = useState("");

  // Helper function to format DOB with dashes
  const formatDOB = (value: string) => {
    // Remove all non-numeric characters
    const numbers = value.replace(/\D/g, '');
    
    // Add dashes at appropriate positions
    if (numbers.length <= 2) {
      return numbers;
    } else if (numbers.length <= 4) {
      return `${numbers.slice(0, 2)}-${numbers.slice(2)}`;
    } else {
      return `${numbers.slice(0, 2)}-${numbers.slice(2, 4)}-${numbers.slice(4, 8)}`;
    }
  };

  // Helper function to format PAN (uppercase alphanumeric)
  const formatPAN = (value: string) => {
    return value.replace(/[^A-Za-z0-9]/g, '').toUpperCase().slice(0, 10);
  };

  // Helper function to format Aadhaar (numbers only)
  const formatAadhaar = (value: string) => {
    return value.replace(/\D/g, '').slice(0, 12);
  };

  // Helper function to format phone (numbers only)
  const formatPhone = (value: string) => {
    return value.replace(/\D/g, '').slice(0, 10);
  };

  // Helper function to format name (max 50 characters)
  const formatName = (value: string) => {
    return value.slice(0, 50);
  };

  // Validation functions
  const isValidDOB = (dob: string) => {
    const regex = /^\d{2}-\d{2}-\d{4}$/;
    return regex.test(dob) && dob.length === 10;
  };

  const isValidAadhaar = (aadhaar: string) => {
    return /^\d{12}$/.test(aadhaar);
  };

  const isValidPAN = (pan: string) => {
    return /^[A-Z0-9]{10}$/.test(pan);
  };

  const isValidPhone = (phone: string) => {
    return /^\d{10}$/.test(phone);
  };

  const isValidName = (name: string) => {
    return name.trim().length > 0 && name.length <= 50;
  };

  // Helper function to validate individual fields
  const isValidField = (key: string, value: string) => {
    switch (key) {
      case 'name':
        return isValidName(value);
      case 'dob':
        return isValidDOB(value);
      case 'aadhaar':
        return isValidAadhaar(value);
      case 'pan':
        return isValidPAN(value);
      case 'phone':
        return isValidPhone(value);
      default:
        return true;
    }
  };

  // Helper function to get validation error messages
  const getValidationMessage = (key: string) => {
    switch (key) {
      case 'name':
        return 'Name must be 1-50 characters long';
      case 'dob':
        return 'Date must be in DD-MM-YYYY format';
      case 'aadhaar':
        return 'Aadhaar must be exactly 12 digits';
      case 'pan':
        return 'PAN must be exactly 10 alphanumeric characters';
      case 'phone':
        return 'Phone must be exactly 10 digits';
      default:
        return '';
    }
  };

  // Check if all form fields are filled and valid
  const isFormComplete = isValidName(form.name) && isValidDOB(form.dob) && isValidAadhaar(form.aadhaar) && isValidPAN(form.pan) && isValidPhone(form.phone);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Format the form data with +91 prefix for phone
    const formData = {
      ...form,
      phone: `+91${form.phone}`
    };
    
    
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });


      if (res.ok) {
        router.push("/admin");
      } else {
        const errorData = await res.json();
        setError("Invalid credentials");
      }
    } catch (error) {
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
      case 'dob':
        formattedValue = formatDOB(value);
        break;
      case 'aadhaar':
        formattedValue = formatAadhaar(value);
        break;
      case 'pan':
        formattedValue = formatPAN(value);
        break;
      case 'phone':
        formattedValue = formatPhone(value);
        break;
    }
    
    setForm({ ...form, [key]: formattedValue });
  };

  const formFields = [
    { key: "name", placeholder: "Admin Name", maxLength: 50 },
    { key: "dob", placeholder: "Date of Birth", maxLength: 10 },
    { key: "aadhaar", placeholder: "Aadhaar Number", maxLength: 12 },
    { key: "pan", placeholder: "Pan Number", maxLength: 10 },
  ];

  return (
    <div className="flex flex-col items-center w-full">
        <form onSubmit={handleSubmit} className="py-2 w-full space-y-4">
          {formFields.map((field) => (
            <div key={field.key} className="relative">
              <input
                type={field.key === 'dob' ? 'text' : field.key === 'aadhaar' || field.key === 'phone' ? 'tel' : 'text'}
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
          
          {/* Phone number input */}
          <div className="relative">
            <input
              type="tel"
              placeholder="Phone Number"
              value={form.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              maxLength={10}
              className="w-full py-6 px-6 border-2 rounded-3xl text-2xl font-normal text-typography-heading placeholder-typography-light-grey focus:outline-none focus:ring-2 focus:border-transparent"
              required
            />
            {form.phone && !isValidPhone(form.phone) && (
              <p className="text-red-500 text-sm mt-1">
                Phone must be exactly 10 digits
              </p>
            )}
          </div>
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
          Login
        </button>
          {error && <p className="text-red-500 mb-2">{error}</p>}
        </form>
      
    </div>
  );
}
