"use client";

import { ReactNode, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  GraduationCap,
  CalendarRange,
  CreditCard,
  Bell,
  User,
  MessageSquare,
  Menu,
  X,
} from "lucide-react";
import { usePartnerAuthGuard } from "@/hooks/usePartnerAuth";

const navItems = [
  { href: "/partner/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/partner/courses", label: "Courses", icon: GraduationCap },
  { href: "/partner/events", label: "Events", icon: CalendarRange },
  { href: "/partner/earnings", label: "Earnings", icon: CreditCard },
  { href: "/partner/messages", label: "Messages", icon: MessageSquare },
  { href: "/partner/notifications", label: "Notifications", icon: Bell },
  { href: "/partner/profile", label: "Profile", icon: User },
];

export default function PartnerLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const authRoutes = [
    "/partner/login",
    "/partner/register",
    "/partner/forgot-password",
    "/partner/register/otp",
    "/partner/rejected",
  ];

  const isAuthRoute = authRoutes.includes(pathname ?? "");

  // Always call auth guard hook so hook order is stable between renders.
  // The guard itself knows how to handle auth vs non-auth routes.
  usePartnerAuthGuard();

  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  if (isAuthRoute) {
    // Standalone auth layout without dashboard chrome
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f3f6fb] px-4">
        {children}
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#f3f6fb] text-slate-900">
      {/* Desktop sidebar */}
      <aside className="relative hidden w-64 flex-col bg-transparent md:flex">
        <div className="pointer-events-none absolute inset-y-4 left-3 right-0 rounded-3xl bg-white/80 shadow-[0_18px_40px_rgba(15,23,42,0.08)]" />
        <div className="relative z-10 flex h-full flex-col rounded-3xl bg-white/90 pb-6 pt-5">
          <div className="flex items-center gap-3 px-5 pb-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-teal-500 text-sm font-bold text-white">
              IC
            </div>
            <div>
              <div className="text-sm font-semibold tracking-tight">Impact Club</div>
              <div className="text-xs text-slate-400">Partner Portal</div>
            </div>
          </div>
          <nav className="mt-2 flex-1 space-y-1 px-2 text-[13px]">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = pathname?.startsWith(item.href);
              return (
                <Link key={item.href} href={item.href}>
                  <div
                    className={`flex items-center gap-2 rounded-full px-3 py-2 transition-colors ${
                      active
                        ? "bg-teal-500 text-white shadow-sm"
                        : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </div>
                </Link>
              );
            })}
          </nav>
          <div className="mt-4 border-t px-5 pt-4 text-xs text-slate-400">
            <div className="font-medium text-slate-500">Settings</div>
            <div className="mt-2 space-y-1">
              <button
                type="button"
                className="block w-full text-left text-[12px] text-slate-500 hover:text-slate-900"
              >
                Preferences
              </button>
              <button
                type="button"
                className="block w-full text-left text-[12px] text-slate-500 hover:text-slate-900"
              >
                Support
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex min-h-screen flex-1 flex-col">
        <header className="px-4 pt-4 md:px-8 md:pt-6">
          <div className="flex items-center justify-between rounded-3xl bg-gradient-to-r from-teal-500 via-sky-500 to-slate-900 px-4 py-3 shadow-lg md:px-6">
            <div className="flex items-center gap-3">
              {/* Mobile menu button */}
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-full border border-white/30 bg-white/10 p-1 text-white shadow-sm md:hidden"
                onClick={() => setMobileNavOpen((open) => !open)}
              >
                {mobileNavOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </button>
              <div>
                <h1 className="text-sm font-semibold text-white md:text-base">Partner workspace</h1>
                <p className="hidden text-[11px] text-teal-50/90 md:block">
                  Overview of your classes, events, and earnings.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 md:gap-4">
              <Link
                href="/partner/notifications"
                className="relative inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white shadow-sm ring-1 ring-white/30 backdrop-blur-sm"
              >
                <Bell className="h-4 w-4" />
                <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-400 text-[10px] font-semibold text-slate-900">
                  3
                </span>
              </Link>
              <Link href="/partner/profile">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-xs font-semibold text-slate-900 shadow-sm ring-1 ring-white/40">
                  PT
                </div>
              </Link>
            </div>
          </div>
        </header>
        <main className="flex-1 px-4 pb-6 pt-1 md:px-8 md:pb-8 md:pt-2">{children}</main>
      </div>

      {/* Mobile sidebar overlay */}
      {mobileNavOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          <div className="flex w-64 flex-col bg-white text-slate-900 shadow-xl">
            <div className="flex h-14 items-center justify-between gap-3 border-b border-slate-200 px-4">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-2xl bg-teal-500 text-xs font-bold text-white">
                  IC
                </div>
                <div>
                  <div className="text-sm font-semibold">Impact Club</div>
                  <div className="text-[11px] text-slate-400">Partner Portal</div>
                </div>
              </div>
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-slate-50 p-1 text-slate-600"
                onClick={() => setMobileNavOpen(false)}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <nav className="flex-1 space-y-1 p-3 text-sm">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = pathname?.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileNavOpen(false)}
                  >
                    <div
                      className={`flex items-center gap-2 rounded-full px-3 py-2 transition-colors ${
                        active
                          ? "bg-teal-500 text-white"
                          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </div>
                  </Link>
                );
              })}
            </nav>
          </div>
          <button
            type="button"
            className="flex-1 bg-black/40"
            onClick={() => setMobileNavOpen(false)}
          />
        </div>
      )}
    </div>
  );
}
