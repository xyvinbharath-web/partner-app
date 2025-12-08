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

  if (!isAuthRoute) {
    usePartnerAuthGuard();
  }
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  if (isAuthRoute) {
    // Standalone auth layout without dashboard chrome
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
        {children}
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-100">
      {/* Desktop sidebar */}
      <aside className="hidden w-64 flex-col bg-slate-950 text-slate-100 md:flex">
        <div className="flex h-16 items-center gap-3 border-b border-slate-800 px-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-800 text-sm font-bold">
            IC
          </div>
          <div>
            <div className="text-sm font-semibold">Impact Club</div>
            <div className="text-xs text-slate-400">Partner Portal</div>
          </div>
        </div>
        <nav className="flex-1 space-y-1 p-3 text-sm">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname?.startsWith(item.href);
            return (
              <Link key={item.href} href={item.href}>
                <div
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 transition-colors ${
                    active
                      ? "bg-slate-800 text-white"
                      : "text-slate-300 hover:bg-slate-900 hover:text-white"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </div>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex min-h-screen flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b bg-white px-4 md:px-6">
          <div className="flex items-center gap-3">
            {/* Mobile menu button */}
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md border bg-white p-1 text-slate-700 md:hidden"
              onClick={() => setMobileNavOpen((open) => !open)}
            >
              {mobileNavOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
            <div>
              <h1 className="text-sm font-semibold text-black md:text-lg">Partner Dashboard</h1>
              <p className="hidden text-xs text-slate-500 md:block">
                Manage your courses, events, and earnings.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 md:gap-4">
            <Link
              href="/partner/notifications"
              className="relative inline-flex h-8 w-8 items-center justify-center rounded-full border bg-slate-50 text-slate-600 md:h-9 md:w-9"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-semibold text-white">
                3
              </span>
            </Link>
            <Link href="/partner/profile">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-300 text-[10px] font-semibold md:h-9 md:w-9 md:text-xs">
                PT
              </div>
            </Link>
          </div>
        </header>
        <main className="flex-1 bg-slate-100 p-4 md:p-6">{children}</main>
      </div>

      {/* Mobile sidebar overlay */}
      {mobileNavOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          <div className="flex w-64 flex-col bg-slate-950 text-slate-100">
            <div className="flex h-16 items-center justify-between gap-3 border-b border-slate-800 px-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-800 text-sm font-bold">
                  IC
                </div>
                <div>
                  <div className="text-sm font-semibold">Impact Club</div>
                  <div className="text-xs text-slate-400">Partner Portal</div>
                </div>
              </div>
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-md border border-slate-700 bg-slate-900 p-1 text-slate-200"
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
                      className={`flex items-center gap-2 rounded-lg px-3 py-2 transition-colors ${
                        active
                          ? "bg-slate-800 text-white"
                          : "text-slate-300 hover:bg-slate-900 hover:text-white"
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
