"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { usePartnerRegister } from "@/hooks/usePartnerRegister";
import { uploadPartnerAvatar } from "@/services/partner/uploads";

export default function PartnerRegisterPage() {
  const router = useRouter();
  const registerMutation = usePartnerRegister();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [organizationName, setOrganizationName] = useState("");
  const [courseSpecialization, setCourseSpecialization] = useState("");
  const [pincode, setPincode] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!password || password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      let avatarUrl: string | undefined;
      if (avatarFile) {
        avatarUrl = await uploadPartnerAvatar(avatarFile);
      }

      await registerMutation.mutateAsync({
        firstName,
        lastName,
        email,
        phone,
        organizationName,
        courseSpecialization,
        pincode,
        password,
        avatar: avatarUrl,
      });
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Registration failed. Please try again.";
      setError(String(message));
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f3f6fb] px-4 py-8">
      <div className="w-full max-w-md space-y-6 rounded-3xl border border-slate-100 bg-white p-6 shadow-xl">
        <div className="space-y-1 text-center">
          <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-teal-500">
            Impact Club
          </p>
          <h1 className="text-lg font-semibold text-slate-900">Partner registration</h1>
          <p className="text-xs text-slate-500">
            Share your details to register as an Impact Club partner.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          {error && <p className="text-xs text-red-600">{error}</p>}
          {/* Profile photo */}
          <div className="flex items-center gap-3 rounded-xl bg-slate-50/80 p-3">
            <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-slate-100 text-xs font-semibold text-slate-600">
              {avatarPreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={avatarPreview}
                  alt="Profile preview"
                  className="h-full w-full object-cover"
                />
              ) : (
                <span>{firstName ? firstName[0]?.toUpperCase() : "P"}</span>
              )}
            </div>
            <div className="flex-1 space-y-1 text-left">
              <label className="text-xs font-medium text-slate-700">Profile photo</label>
              <input
                type="file"
                accept="image/*"
                className="w-full rounded-md border px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400"
                onChange={(e) => {
                  const file = e.target.files?.[0] ?? null;
                  setAvatarFile(file);
                  if (file) {
                    const previewUrl = URL.createObjectURL(file);
                    setAvatarPreview(previewUrl);
                  } else {
                    setAvatarPreview("");
                  }
                }}
              />
              <p className="text-[10px] text-slate-500">
                Choose a clear square image. This photo will be visible to admins in your profile.
              </p>
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-1 text-left">
              <label className="text-xs font-medium text-slate-700">First name</label>
              <input
                type="text"
                required
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 shadow-inner focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/60"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div className="space-y-1 text-left">
              <label className="text-xs font-medium text-slate-700">Last name</label>
              <input
                type="text"
                required
                className="w-full rounded-md border px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-1 text-left">
              <label className="text-xs font-medium text-slate-700">Password</label>
              <input
                type="password"
                required
                minLength={6}
                className="w-full rounded-md border px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="space-y-1 text-left">
              <label className="text-xs font-medium text-slate-700">Confirm password</label>
              <input
                type="password"
                required
                minLength={6}
                className="w-full rounded-md border px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-1 text-left">
              <label className="text-xs font-medium text-slate-700">Email</label>
              <input
                type="email"
                required
                className="w-full rounded-md border px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-1 text-left">
              <label className="text-xs font-medium text-slate-700">Phone</label>
              <input
                type="tel"
                required
                className="w-full rounded-md border px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1 text-left">
            <label className="text-xs font-medium text-slate-700">Organization name</label>
            <input
              type="text"
              required
              className="w-full rounded-md border px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400"
              value={organizationName}
              onChange={(e) => setOrganizationName(e.target.value)}
            />
          </div>

          <div className="space-y-1 text-left">
            <label className="text-xs font-medium text-slate-700">Course specialization</label>
            <input
              type="text"
              required
              className="w-full rounded-md border px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400"
              value={courseSpecialization}
              onChange={(e) => setCourseSpecialization(e.target.value)}
            />
          </div>

          <div className="space-y-1 text-left">
            <label className="text-xs font-medium text-slate-700">Pincode</label>
            <input
              type="text"
              required
              className="w-full rounded-md border px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400"
              value={pincode}
              onChange={(e) => setPincode(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={registerMutation.isPending}
            className="flex w-full items-center justify-center rounded-full bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
          >
            {registerMutation.isPending ? "Submitting..." : "Register as partner"}
          </button>
        </form>

        <p className="text-center text-[11px] text-slate-500">
          Already a partner?{" "}
          <Link href="/partner/login" className="font-medium text-slate-900 underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
