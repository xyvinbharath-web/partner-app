"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { usePartnerRegisterOtp } from "@/hooks/usePartnerRegisterOtp";

export function PartnerRegisterOtpClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialPhone = searchParams.get("phone");

  const [phone, setPhone] = useState(initialPhone ?? "");
  const [code, setCode] = useState("");

  const { sendOtp, sendingOtp, verifyOtp, verifyingOtp } = usePartnerRegisterOtp(initialPhone);

  useEffect(() => {
    if (!initialPhone) {
      router.replace("/partner/register");
    }
  }, [initialPhone, router]);

  async function handleResend() {
    if (!phone) return;
    await sendOtp();
  }

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    if (!phone || !code) return;
    await verifyOtp({ phone, code });
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md rounded-2xl border bg-white p-6 shadow-sm">
        <div className="space-y-1 pb-4">
          <h1 className="text-lg font-semibold text-slate-900">Verify your phone</h1>
          <p className="text-xs text-slate-500">
            We’ve sent a one-time password (OTP) to your phone. Enter it below to complete registration.
          </p>
        </div>

        <form onSubmit={handleVerify} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-700">Phone</label>
            <input
              className="h-9 w-full rounded-md border px-2 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-slate-900/10"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-700">OTP code</label>
            <input
              className="h-9 w-full rounded-md border px-2 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-slate-900/10"
              placeholder="6-digit code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-between gap-2 pt-2 text-xs">
            <button
              type="button"
              onClick={handleResend}
              disabled={sendingOtp}
              className="text-slate-600 hover:text-slate-900"
            >
              {sendingOtp ? "Resending..." : "Resend OTP"}
            </button>

            <button
              type="submit"
              disabled={!phone || !code || verifyingOtp}
              className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {verifyingOtp ? "Verifying..." : "Verify & Continue"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
