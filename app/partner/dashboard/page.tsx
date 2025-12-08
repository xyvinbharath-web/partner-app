"use client";

import Link from "next/link";
import { usePartnerAuthSession } from "@/hooks/usePartnerAuth";
import { usePartnerEarnings } from "@/hooks/usePartnerEarnings";
import { usePartnerEvents } from "@/hooks/usePartnerEvents";
import { usePartnerNotifications } from "@/hooks/usePartnerNotifications";

export default function PartnerDashboardPage() {
  const { data: me } = usePartnerAuthSession();
  const { data: earnings } = usePartnerEarnings();
  const { data: eventsData } = usePartnerEvents({ page: 1, limit: 5 });
  const { data: notificationsData } = usePartnerNotifications({ read: "all", page: 1, limit: 20 });

  const totalEvents = eventsData?.records.length ?? 0;
  const upcomingEvents = eventsData?.records.filter((e) => new Date(e.startsAt) > new Date()).length ?? 0;
  const unreadNotifications = notificationsData?.records.filter((n) => !n.readAt).length ?? 0;

  return (
    <div className="space-y-4">
      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
        <div>
          <h1 className="text-lg font-semibold text-slate-900">Dashboard</h1>
          <p className="text-sm text-slate-500">
            Welcome{me?.name ? `, ${me.name}` : ""}. Here&apos;s what&apos;s happening with your
            partner account.
          </p>
        </div>
      </div>

      {me && (
        <div className="rounded-xl border bg-white p-4 md:p-5">
          <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Your account
          </div>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-700">
            <span>Name: {me.name}</span>
            {me.email && <span>Email: {me.email}</span>}
            {me.phone && <span>Phone: {me.phone}</span>}
            <span>Role: {me.role}</span>
            <span>Status: {me.status}</span>
          </div>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-4">
        <SummaryCard
          label="Total earnings"
          value={
            earnings
              ? `₹${earnings.totalEarnings.toLocaleString()}`
              : "—"
          }
        />
        <SummaryCard
          label="Available balance"
          value={
            earnings
              ? `₹${earnings.availableBalance.toLocaleString()}`
              : "—"
          }
        />
        <SummaryCard
          label="Upcoming events"
          value={upcomingEvents}
          href="/partner/events"
        />
        <SummaryCard
          label="Unread notifications"
          value={unreadNotifications}
          href="/partner/notifications"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <DashboardCard
          title="Manage events"
          description="Create new events, edit details, and track bookings."
          href="/partner/events"
        />
        <DashboardCard
          title="View earnings"
          description="See your revenue, balance, and payout history."
          href="/partner/earnings"
        />
        <DashboardCard
          title="Profile & settings"
          description="Update your contact info and change your password."
          href="/partner/profile"
        />
        <DashboardCard
          title="Notifications"
          description="Review recent alerts and important updates."
          href="/partner/notifications"
        />
      </div>
    </div>
  );
}

interface SummaryCardProps {
  label: string;
  value: string | number;
  href?: string;
}

function SummaryCard({ label, value, href }: SummaryCardProps) {
  const content = (
    <div className="rounded-xl border bg-white p-4 text-sm shadow-sm">
      <div className="text-xs text-slate-500">{label}</div>
      <div className="mt-2 text-lg font-semibold text-slate-900">{value}</div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block transition hover:-translate-y-0.5 hover:shadow-md">
        {content}
      </Link>
    );
  }

  return content;
}

interface DashboardCardProps {
  title: string;
  description: string;
  href: string;
}

function DashboardCard({ title, description, href }: DashboardCardProps) {
  return (
    <Link
      href={href}
      className="block rounded-xl border bg-white p-4 text-left text-sm shadow-sm transition hover:border-slate-300 hover:bg-slate-50 hover:shadow-md"
    >
      <div className="text-sm font-semibold text-slate-900">{title}</div>
      <p className="mt-1 text-xs text-slate-500">{description}</p>
    </Link>
  );
}
