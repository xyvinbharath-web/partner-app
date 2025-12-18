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
    <div className="space-y-5">
      {/* Welcome hero */}
      <section className="overflow-hidden rounded-3xl bg-white px-5 py-5 shadow-sm md:px-8 md:py-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-teal-500">
              Welcome back
            </p>
            <h1 className="mt-1 text-xl font-semibold tracking-tight text-slate-900 md:text-2xl">
              {me?.name ? me.name : "Partner"}, here&apos;s your teaching overview
            </h1>
            <p className="mt-2 max-w-xl text-xs text-slate-500 md:text-sm">
              See how your classes, events, and earnings are performing today. Use this
              snapshot to plan your next sessions.
            </p>
          </div>
          {me && (
            <div className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3 text-xs text-slate-600">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-[11px] font-semibold text-white">
                {me.name?.[0]?.toUpperCase() || "P"}
              </div>
              <div>
                <div className="text-[12px] font-semibold text-slate-900">{me.name}</div>
                <div className="text-[11px] text-slate-500 capitalize">{me.role}</div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Stat pills */}
      <section className="grid gap-3 md:grid-cols-4">
        <StatPill
          label="Total earnings"
          value={earnings ? `₹${earnings.totalEarnings.toLocaleString()}` : "—"}
          helper="All time"
          tone="teal"
        />
        <StatPill
          label="Available balance"
          value={earnings ? `₹${earnings.availableBalance.toLocaleString()}` : "—"}
          helper="Ready to withdraw"
          tone="amber"
        />
        <StatPill
          label="Upcoming events"
          value={upcomingEvents}
          helper="Next 30 days"
          href="/partner/events"
        />
        <StatPill
          label="Unread notifications"
          value={unreadNotifications}
          helper="Since last login"
          href="/partner/notifications"
        />
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="md:col-span-2 space-y-4">
          <div className="rounded-3xl bg-white p-4 shadow-sm md:p-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-slate-900">Learning time overview</h2>
                <p className="mt-1 text-[11px] text-slate-500">
                  High-level view of how your students engage with your sessions.
                </p>
              </div>
              <span className="rounded-full bg-slate-50 px-3 py-1 text-[11px] text-slate-600">
                Last 30 days
              </span>
            </div>
            {/* Placeholder bar chart skeleton */}
            <div className="mt-4 h-32 rounded-2xl bg-slate-50 px-3 py-3 text-[10px] text-slate-400">
              <div className="flex h-full items-end gap-1">
                {Array.from({ length: 24 }).map((_, idx) => (
                  <div
                    // eslint-disable-next-line react/no-array-index-key
                    key={idx}
                    className="flex-1 rounded-full bg-slate-200"
                    style={{ height: `${20 + ((idx * 7) % 60)}%` }}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-100 bg-white/95 p-4 shadow-md md:p-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="inline-flex items-center rounded-full bg-slate-50 px-3 py-1 text-[11px] font-medium uppercase tracking-wide text-slate-500">
                  Quick actions
                </div>
                <p className="mt-2 text-[11px] text-slate-500">
                  Manage the things you use the most in just a few clicks.
                </p>
              </div>
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              <DashboardCard
                title="Create event"
                description="Plan a new session for your students."
                href="/partner/events"
              />
              <DashboardCard
                title="View earnings"
                description="Check this month&apos;s revenue and payouts."
                href="/partner/earnings"
              />
              <DashboardCard
                title="Update profile"
                description="Keep your name, photo and bio up to date."
                href="/partner/profile"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-3xl bg-white p-4 shadow-sm md:p-5">
            <h2 className="text-sm font-semibold text-slate-900">Recent activity</h2>
            <p className="mt-1 text-[11px] text-slate-500">
              A quick feed of what has changed recently in your workspace.
            </p>
            <ul className="mt-3 space-y-2 text-[12px] text-slate-700">
              {eventsData && eventsData.records.length > 0 ? (
                eventsData.records.slice(0, 3).map((ev) => (
                  <li key={ev._id} className="rounded-xl bg-slate-50 px-3 py-2">
                    <div className="text-[12px] font-medium text-slate-900 line-clamp-1">
                      {ev.title}
                    </div>
                    <div className="mt-0.5 text-[11px] text-slate-500">
                      {new Date(ev.startsAt).toLocaleString()}
                    </div>
                  </li>
                ))
              ) : (
                <li className="rounded-xl bg-slate-50 px-3 py-3 text-[11px] text-slate-500">
                  No events yet. Create your first event to see it here.
                </li>
              )}
            </ul>
          </div>

          <div className="rounded-3xl bg-white p-4 shadow-sm md:p-5">
            <h2 className="text-sm font-semibold text-slate-900">Notifications</h2>
            <p className="mt-1 text-[11px] text-slate-500">What&apos;s new since you last visited.</p>
            <ul className="mt-3 space-y-2 text-[12px] text-slate-700">
              {notificationsData && notificationsData.records.length > 0 ? (
                notificationsData.records.slice(0, 3).map((n) => (
                  <li key={n._id} className="rounded-xl bg-slate-50 px-3 py-2">
                    <div className="text-[12px] font-medium text-slate-900 line-clamp-2">
                      {n.title || n.type}
                    </div>
                    <div className="mt-0.5 text-[11px] text-slate-500">
                      {new Date(n.createdAt).toLocaleString()}
                    </div>
                  </li>
                ))
              ) : (
                <li className="rounded-xl bg-slate-50 px-3 py-3 text-[11px] text-slate-500">
                  You&apos;re all caught up.
                </li>
              )}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}

interface StatPillProps {
  label: string;
  value: string | number;
  helper?: string;
  href?: string;
  tone?: "default" | "teal" | "amber";
}

function StatPill({ label, value, helper, href, tone = "default" }: StatPillProps) {
  const base =
    "rounded-3xl border bg-white px-4 py-3 text-left text-xs shadow-sm md:px-5 md:py-4";
  const toneClass =
    tone === "teal"
      ? "border-teal-100 bg-teal-50/60"
      : tone === "amber"
      ? "border-amber-100 bg-amber-50/60"
      : "border-slate-100";

  const content = (
    <div className={`${base} ${toneClass}`}>
      <div className="text-[11px] font-medium text-slate-500">{label}</div>
      <div className="mt-1 text-lg font-semibold text-slate-900">{value}</div>
      {helper && <div className="mt-0.5 text-[10px] text-slate-400">{helper}</div>}
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
      className="group flex flex-col justify-between rounded-2xl border border-slate-100 bg-slate-50/80 p-4 text-left text-sm shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:bg-white hover:shadow-md"
    >
      <div>
        <div className="text-sm font-semibold text-slate-900">{title}</div>
        <p className="mt-1 text-xs text-slate-500">{description}</p>
      </div>
      <span className="mt-3 inline-flex items-center text-[11px] font-medium text-slate-700 group-hover:text-slate-900">
        Open
        <span className="ml-1 text-[13px]">→</span>
      </span>
    </Link>
  );
}
