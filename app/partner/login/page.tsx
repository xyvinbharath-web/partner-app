"use client";

import { useState } from "react";
import { usePartnerLogin } from "@/hooks/usePartnerAuth";
import Link from "next/link";

export default function PartnerLoginPage() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { login, loggingIn } = usePartnerLogin();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!phone || !password) return;
    setError(null);
    try {
      await login({ phone, password });
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Invalid phone number or password. Please try again.";
      setError(String(message));
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f3f6fb] px-4 py-8">
      <div className="w-full max-w-md space-y-6 rounded-3xl border border-slate-100 bg-white p-6 shadow-xl">
        <div className="space-y-2 text-center">
          <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-teal-500">
            Impact Club
          </p>
          <h1 className="text-lg font-semibold text-slate-900">Partner login</h1>
          <p className="text-xs text-slate-500">
            Sign in with your registered partner details to access the Partner Portal.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4 text-sm">
          {error && <p className="text-xs text-red-600">{error}</p>}
          <div className="space-y-1 text-left">
            <label className="text-xs font-medium text-slate-700">Phone</label>
            <input
              className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 placeholder:text-slate-400 shadow-inner outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/60"
              placeholder="+91..."
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div className="space-y-1 text-left">
            <label className="text-xs font-medium text-slate-700">Password</label>
            <input
              type="password"
              className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 placeholder:text-slate-400 shadow-inner outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/60"
              placeholder="Your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="mt-2 flex w-full items-center justify-center rounded-full bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
            disabled={!phone || !password || loggingIn}
          >
            {loggingIn ? "Logging in..." : "Log in"}
          </button>
        </form>

        <div className="pt-2 text-center text-[11px] text-slate-500">
          <Link href="/partner/forgot-password" className="font-medium text-slate-900 underline">
            Forgot password?
          </Link>
        </div>

        <p className="pt-1 text-center text-[11px] text-slate-500">
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
