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

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background-secondary ">
      <form onSubmit={handleSubmit} className="p-6 rounded-lg shadow-lg bg-background-layer-3-background max-w-md w-full">
        <h1 className="text-2xl font-bold mb-4">Admin Login</h1>
        {["name", "dob", "aadhaar", "pan", "phone"].map((key) => (
          <input
            key={key}
            type="text"
            placeholder={key.toUpperCase()}
            value={form[key as keyof typeof form]}
            onChange={(e) => setForm({ ...form, [key]: e.target.value })}
            className="border p-2 rounded w-full mb-2"
            required
          />
        ))}
        {error && <p className="text-red-500 mb-2">{error}</p>}
        <button type="submit" className="bg-black text-white w-full p-2 rounded">
          Login
        </button>
      </form>
    </div>
  );
}
