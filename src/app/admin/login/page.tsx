// src/app/admin/login/page.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/apis/http";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Valid email required"),
  password: z.string().min(6, "Minimum 6 characters"),
});

export default function AdminLogin() {
  const [email, setEmail] = useState("admin@demo.com");
  const [password, setPassword] = useState("admin123");
  const [err, setErr] = useState<string | null>(null);
  const router = useRouter();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErr(null);

    const check = loginSchema.safeParse({ email, password });
    if (!check.success) {
      setErr("Fix the highlighted fields");
      return;
    }

    try {
      const res = await api<{ token: string; role: string; expiresIn: string }>(
        "/auth/login",
        {
          method: "POST",
          body: JSON.stringify(check.data),
        }
      );

      localStorage.setItem("token", res.token);
      router.push("/admin/courses");
    } catch (e: unknown) {
      if (e instanceof Error) {
        setErr(e.message);
      } else if (typeof e === "object" && e && "message" in e) {
        setErr(String((e as { message?: unknown }).message) || "Login failed");
      } else {
        setErr("Login failed");
      }
    }
  }

  return (
    <div className="min-h-screen grid place-items-center p-6">
      <form onSubmit={onSubmit} className="w-full max-w-sm space-y-3 border rounded-xl p-6">
        <h1 className="text-2xl font-semibold">Admin Login</h1>
        {err && <p className="text-red-500 text-sm">{err}</p>}

        <input
          type="email"
          className="w-full border rounded px-3 py-2"
          value={email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
          placeholder="Email"
        />

        <input
          type="password"
          className="w-full border rounded px-3 py-2"
          value={password}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
          placeholder="Password"
        />

        <button className="w-full rounded px-3 py-2 bg-black text-white">
          Sign in
        </button>
      </form>
    </div>
  );
}
