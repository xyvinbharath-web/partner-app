"use client";

import { useState } from "react";
import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import {
  partnerSendResetOtp,
  partnerVerifyResetOtp,
} from "@/services/partner/auth";

export default function PartnerForgotPasswordPage() {
  const [step, setStep] = useState<"request" | "verify">("request");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const sendOtpMutation = useMutation({
    mutationFn: (phoneValue: string) => partnerSendResetOtp(phoneValue),
    onSuccess: () => {
      setInfo("We have sent an OTP to your phone number (if it is registered).");
      setStep("verify");
    },
  });

  const verifyOtpMutation = useMutation({
    mutationFn: (vars: { phone: string; code: string; newPassword: string }) =>
      partnerVerifyResetOtp(vars),
    onSuccess: () => {
      setInfo("Password updated. You can now log in with your new password.");
    },
  });

  async function handleSendOtp(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setInfo(null);
    if (!phone) return;
    await sendOtpMutation.mutateAsync(phone);
  }

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setInfo(null);

    if (!code || !newPassword) {
      setError("Please enter OTP and new password.");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    await verifyOtpMutation.mutateAsync({ phone, code, newPassword });
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md rounded-2xl border bg-white p-6 shadow-sm">
        <div className="space-y-1 pb-4 text-center">
          <h1 className="text-lg font-semibold text-slate-900">Reset password</h1>
          <p className="text-xs text-slate-500">
            Enter your registered phone number to receive an OTP and set a new password.
          </p>
        </div>

        {error && <p className="mb-2 text-xs text-red-600">{error}</p>}
        {info && <p className="mb-2 text-xs text-emerald-600">{info}</p>}

        {step === "request" && (
          <form onSubmit={handleSendOtp} className="space-y-3 text-sm">
            <div className="space-y-1 text-left">
              <label className="text-xs font-medium text-slate-700">Phone</label>
              <input
                className="h-9 w-full rounded-md border px-2 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-slate-900/10"
                placeholder="+91..."
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="flex w-full items-center justify-center rounded-md bg-slate-900 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={!phone || sendOtpMutation.isPending}
            >
              {sendOtpMutation.isPending ? "Sending..." : "Send OTP"}
            </button>
          </form>
        )}

        {step === "verify" && (
          <form onSubmit={handleVerify} className="space-y-3 text-sm">
            <div className="space-y-1 text-left">
              <label className="text-xs font-medium text-slate-700">OTP code</label>
              <input
                className="h-9 w-full rounded-md border px-2 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-slate-900/10"
                placeholder="6-digit code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
              <button
                type="button"
                className="mt-1 text-[11px] font-medium text-slate-900 underline disabled:cursor-not-allowed disabled:opacity-60"
                disabled={!phone || sendOtpMutation.isPending}
                onClick={() => {
                  setError(null);
                  setInfo(null);
                  if (!phone) return;
                  sendOtpMutation.mutate(phone);
                }}
              >
                {sendOtpMutation.isPending ? "Resending OTP..." : "Resend OTP"}
              </button>
            </div>

            <div className="space-y-1 text-left">
              <label className="text-xs font-medium text-slate-700">New password</label>
              <input
                type="password"
                className="h-9 w-full rounded-md border px-2 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-slate-900/10"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>

            <div className="space-y-1 text-left">
              <label className="text-xs font-medium text-slate-700">Confirm new password</label>
              <input
                type="password"
                className="h-9 w-full rounded-md border px-2 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-slate-900/10"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="flex w-full items-center justify-center rounded-md bg-slate-900 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={verifyOtpMutation.isPending}
            >
              {verifyOtpMutation.isPending ? "Updating..." : "Update password"}
            </button>
          </form>
        )}

        <p className="pt-4 text-center text-[11px] text-slate-500">
          Remembered your password?{" "}
          <Link href="/partner/login" className="font-medium text-slate-900 underline">
            Back to login
          </Link>
        </p>
      </div>
    </div>
  );
}
