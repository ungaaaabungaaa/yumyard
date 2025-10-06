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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      router.push("/admin/dashboard");
    } else {
      setError("Invalid credentials");
    }
  };

  const formFields = [
    { key: "name", placeholder: "FULL NAME" },
    { key: "dob", placeholder: "DOB: DD | MM | YYYY" },
    { key: "aadhaar", placeholder: "AADHAAR NO." },
    { key: "pan", placeholder: "PAN NO." },
    { key: "phone", placeholder: "PHONE: 10 DIGITS" },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black">
      
      <form onSubmit={handleSubmit} className="py-8 px-4 rounded-2xl bg-white border-none max-w-md w-full">
      <h1 className="text-4xl font-bold mt-4 mb-8 text-black">Admin Login</h1>
        {formFields.map((field) => (
          <input
            key={field.key}
            type="text"
            placeholder={field.placeholder}
            value={form[field.key as keyof typeof form]}
            onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
            className="border py-4 px-8 rounded-2xl w-full mb-2"
            required
          />
        ))}
        {error && <p className="text-red-500 mb-2">{error}</p>}
        <button type="submit" className="bg-black text-white w-full py-4 px-8 my-4 rounded-4xl">
          Login
        </button>
      </form>
    </div>
  );
}
