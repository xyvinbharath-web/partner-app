"use client";

import { useState, useEffect } from "react";
import {
  usePartnerProfile,
  useUpdatePartnerPassword,
  useUpdatePartnerProfile,
} from "@/hooks/usePartnerProfile";
import { usePartnerLogin } from "@/hooks/usePartnerAuth";
import { uploadPartnerAvatar } from "@/services/partner/uploads";

export default function PartnerProfilePage() {
  const { data: profile, isLoading } = usePartnerProfile();
  const updateProfile = useUpdatePartnerProfile();
  const updatePassword = useUpdatePartnerPassword();
  const { logout, loggingOut } = usePartnerLogin();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [avatar, setAvatar] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [editingProfile, setEditingProfile] = useState(false);

  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [inAppNotifications, setInAppNotifications] = useState(true);

  useEffect(() => {
    if (profile) {
      setName(profile.name ?? "");
      setEmail(profile.email ?? "");
      setPhone(profile.phone ?? "");
      setAvatar(profile.avatar ?? "");
    }
  }, [profile]);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile.mutateAsync({ name, email, phone, avatar });
    setEditingProfile(false);
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) return;
    await updatePassword.mutateAsync({ currentPassword, newPassword });
    setCurrentPassword("");
    setNewPassword("");
  };

  const handleAvatarFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await uploadPartnerAvatar(file);
    setAvatar(url);
    await updateProfile.mutateAsync({ avatar: url });
  };

  return (
    <div className="mx-auto max-w-5xl space-y-5 pb-10">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Profile & settings</h1>
          <p className="text-sm text-slate-500">Manage your personal details, security, and notifications.</p>
        </div>
      </div>

      {isLoading && <div className="text-sm text-slate-500">Loading profile...</div>}

      <div className="grid gap-4 md:grid-cols-[minmax(0,2.1fr)_minmax(0,1.2fr)]">
        <div className="space-y-4 rounded-3xl border border-slate-100 bg-white/95 p-4 shadow-md md:p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-semibold text-black">Partner details</h2>
              <p className="text-xs text-slate-500">
                View and update your public profile information.
              </p>
            </div>
            {!editingProfile && (
              <button
                type="button"
                className="inline-flex items-center rounded-full border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-800 shadow-sm hover:bg-slate-50"
                onClick={() => setEditingProfile(true)}
              >
                Edit profile
              </button>
            )}
          </div>

          <div className="mt-3 flex items-center gap-4 border-b border-slate-100 pb-4">
            <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-slate-200 text-xs font-semibold text-slate-700 shadow-sm">
              {avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={avatar} alt={profile?.name || "Avatar"} className="h-full w-full object-cover" />
              ) : (
                (profile?.name || "").slice(0, 2).toUpperCase() || "PT"
              )}
            </div>
            <div className="space-y-1">
              <div className="text-sm font-semibold text-slate-900">Display picture</div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span>Update your profile image shown across the portal.</span>
                <label className="inline-flex cursor-pointer items-center rounded-full border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-800 shadow-sm hover:bg-slate-50">
                  <span>Change photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarFileChange}
                  />
                </label>
              </div>
            </div>
          </div>

          {!editingProfile && (
            <div className="mt-2 grid gap-3 text-sm md:grid-cols-2">
              <div className="space-y-1">
                <div className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                  Name
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900">
                  {profile?.name || "—"}
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                  Email
                </div>
                <div className="rounded-md border bg-slate-50 px-3 py-2 text-slate-900">
                  {profile?.email || "—"}
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                  Phone
                </div>
                <div className="rounded-md border bg-slate-50 px-3 py-2 text-slate-900">
                  {profile?.phone || "—"}
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                  Avatar URL
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 break-all">
                  {profile?.avatar || "—"}
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                  Role
                </div>
                <div className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-medium capitalize text-slate-800">
                  {profile?.role || "partner"}
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                  Status
                </div>
                <div className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-medium capitalize text-slate-800">
                  {profile?.status || "active"}
                </div>
              </div>
              <div className="space-y-1 md:col-span-2">
                <div className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                  Joined
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800">
                  {profile?.createdAt
                    ? new Date(profile.createdAt).toLocaleString()
                    : "—"}
                </div>
              </div>
            </div>
          )}

          {editingProfile && (
            <form onSubmit={handleProfileSubmit} className="mt-3 space-y-3 text-sm">
              <div className="space-y-1">
                <label className="text-sm font-medium text-black">Name</label>
                <input
                  type="text"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 shadow-inner focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/60"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-black">Email</label>
                <input
                  type="email"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 shadow-inner focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/60"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-black">Phone</label>
                <input
                  type="tel"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 shadow-inner focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/60"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-black">Avatar URL</label>
                <input
                  type="url"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 shadow-inner focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/60"
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                />
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  className="inline-flex items-center rounded-full border border-slate-300 bg-white px-4 py-2 text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-50"
                  onClick={() => {
                    if (profile) {
                      setName(profile.name ?? "");
                      setEmail(profile.email ?? "");
                      setPhone(profile.phone ?? "");
                      setAvatar(profile.avatar ?? "");
                    }
                    setEditingProfile(false);
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updateProfile.isPending}
                  className="inline-flex items-center rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-slate-800 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {updateProfile.isPending ? "Saving..." : "Save changes"}
                </button>
              </div>
            </form>
          )}
        </div>
        <div className="space-y-4">
          <form
            onSubmit={handlePasswordSubmit}
            className="space-y-4 rounded-3xl border border-slate-100 bg-white/95 p-4 shadow-md md:p-6"
          >
            <h2 className="text-sm font-semibold text-black">Update password</h2>

            <div className="space-y-1">
              <label className="text-sm font-medium text-black">Current password</label>
              <input
                type="password"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 shadow-inner focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/60"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-black">New password</label>
              <input
                type="password"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 shadow-inner focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/60"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={updatePassword.isPending}
                className="inline-flex items-center rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
              >
                {updatePassword.isPending ? "Updating..." : "Update password"}
              </button>
            </div>
          </form>

          <div className="space-y-4 rounded-3xl border border-slate-100 bg-white/95 p-4 shadow-md md:p-6">
            <h2 className="text-sm font-semibold text-black">Notification settings</h2>
            <p className="text-xs text-slate-500">
              Choose how you want to receive updates about your courses, events, and earnings.
            </p>
            <div className="space-y-3 text-sm">
              <label className="flex items-center justify-between gap-3">
                <span className="text-slate-800">Email notifications</span>
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-slate-300 text-slate-900"
                  checked={emailNotifications}
                  onChange={(e) => setEmailNotifications(e.target.checked)}
                />
              </label>
              <label className="flex items-center justify-between gap-3">
                <span className="text-slate-800">SMS notifications</span>
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-slate-300 text-slate-900"
                  checked={smsNotifications}
                  onChange={(e) => setSmsNotifications(e.target.checked)}
                />
              </label>
              <label className="flex items-center justify-between gap-3">
                <span className="text-slate-800">In-app notifications</span>
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-slate-300 text-slate-900"
                  checked={inAppNotifications}
                  onChange={(e) => setInAppNotifications(e.target.checked)}
                />
              </label>
            </div>
          </div>

          <div className="space-y-3 rounded-3xl border border-rose-50 bg-rose-50/80 p-4 text-sm text-rose-900 shadow-md md:p-6">
            <h2 className="text-sm font-semibold text-rose-900">Sign out</h2>
            <p className="text-xs text-rose-700/90">
              Log out of your partner workspace on this device. You can sign back in anytime with your phone and password.
            </p>
            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={() => logout()}
                disabled={loggingOut}
                className="inline-flex items-center rounded-full bg-rose-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-rose-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loggingOut ? "Signing out..." : "Log out"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
