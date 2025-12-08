"use client";

import { useState } from "react";
import { usePartnerLogin } from "@/hooks/usePartnerAuth";
import Link from "next/link";

export default function PartnerLoginPage() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const { login, loggingIn } = usePartnerLogin();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!phone || !password) return;
    await login({ phone, password });
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md rounded-2xl border bg-white p-6 shadow-sm">
        <div className="space-y-1 pb-4">
          <h1 className="text-lg font-semibold text-slate-900">Partner login</h1>
          <p className="text-xs text-slate-500">
            Sign in with your registered partner details to access the Partner Portal.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-3">
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-700">Phone</label>
            <input
              className="h-9 w-full rounded-md border px-2 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-slate-900/10"
              placeholder="+91..."
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-700">Password</label>
            <input
              type="password"
              className="h-9 w-full rounded-md border px-2 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-slate-900/10"
              placeholder="Your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="mt-2 flex w-full items-center justify-center rounded-md bg-slate-900 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={!phone || !password || loggingIn}
          >
            {loggingIn ? "Logging in..." : "Log in"}
          </button>
        </form>

        <div className="pt-3 text-center text-[11px] text-slate-500">
          <Link href="/partner/forgot-password" className="text-slate-900 underline">
            Forgot password?
          </Link>
        </div>

        <p className="pt-2 text-center text-[11px] text-slate-500">
          Don&apos;t have a partner account?{" "}
          <Link
            href="/partner/register"
            className="font-medium text-slate-900 underline"
          >
            Register as partner
          </Link>
        </p>
      </div>
    </div>
  );
}
