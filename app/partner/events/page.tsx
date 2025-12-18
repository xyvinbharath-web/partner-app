"use client";

import Link from "next/link";
import { usePartnerEvents } from "@/hooks/usePartnerEvents";
import { useState } from "react";

export default function PartnerEventsPage() {
  const { data, isLoading, isError, query, setQuery } = usePartnerEvents();
  const [search, setSearch] = useState(query.q ?? "");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setQuery((prev) => ({ ...prev, q: search, page: 1 }));
  };

  return (
    <div className="mx-auto max-w-5xl space-y-5 pb-10">
      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Events</h1>
          <p className="text-sm text-slate-500">
            Manage your upcoming events, bookings, and performance.
          </p>
        </div>
        <Link
          href="/partner/events/create"
          className="inline-flex items-center justify-center rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 hover:shadow-md transition-all"
        >
          Create event
        </Link>
      </div>

      <form onSubmit={handleSearch} className="flex flex-col gap-2 md:flex-row md:items-center">
        <input
          type="text"
          className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 shadow-inner focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/60"
          placeholder="Search events by title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/60"
          value={query.status ?? ""}
          onChange={(e) =>
            setQuery((prev) => ({ ...prev, status: e.target.value as any, page: 1 }))
          }
        >
          <option value="">All statuses</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="completed">Completed</option>
          <option value="canceled">Canceled</option>
        </select>
        <button
          type="submit"
          className="inline-flex items-center justify-center rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 hover:shadow-md transition-all"
        >
          Filter
        </button>
      </form>

      {isLoading && <div className="text-sm text-slate-500">Loading events...</div>}
      {isError && (
        <div className="text-sm text-rose-500">Failed to load events. Please try again.</div>
      )}

      {!isLoading && data && data.records.length === 0 && (
        <div className="rounded-3xl border border-slate-100 bg-white/90 p-6 text-center text-sm text-slate-500 shadow-lg/40 backdrop-blur-sm">
          No events found. Create your first event to get started.
        </div>
      )}

      {/* Desktop table */}
      {!isLoading && data && data.records.length > 0 && (
        <div className="hidden overflow-hidden rounded-3xl border border-slate-100 bg-white/95 shadow-xl md:block">
          <table className="min-w-full border-separate border-spacing-0 text-sm">
            <thead>
              <tr className="bg-slate-50 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                <th className="px-4 py-2 text-left md:px-5">Title</th>
                <th className="px-4 py-2 text-left md:px-5">Start</th>
                <th className="px-4 py-2 text-left md:px-5">Status</th>
                <th className="px-4 py-2 text-right md:px-5">Bookings</th>
                <th className="px-4 py-2 text-right md:px-5">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.records.map((event) => (
                <tr key={event._id} className="text-[13px] text-slate-700 hover:bg-slate-50/80">
                  <td className="max-w-xs px-4 py-3.5 align-top md:px-5">
                    <div className="truncate text-[13px] font-semibold text-slate-900">{event.title}</div>
                  </td>
                  <td className="px-4 py-3.5 align-top text-[13px] text-slate-600 md:px-5">
                    {new Date(event.startsAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-3.5 align-top md:px-5">
                    <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] capitalize text-slate-700">
                      {event.status}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 align-top text-right text-[13px] text-slate-700 md:px-5">
                    <span className="inline-flex rounded-full bg-slate-50 px-2.5 py-0.5 text-[11px] font-medium text-slate-700">
                      {event.bookedCount ?? 0}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 align-top text-right md:px-5">
                    <Link
                      href={`/partner/events/${event._id}`}
                      className="inline-flex items-center rounded-full border border-slate-300 bg-white px-3 py-1 text-[11px] font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Mobile cards */}
      {!isLoading && data && data.records.length > 0 && (
        <div className="space-y-3 md:hidden">
          {data.records.map((event) => (
            <Link key={event._id} href={`/partner/events/${event._id}`}>
              <div className="rounded-3xl border border-slate-100 bg-white/95 p-4 shadow-md">
                <div className="flex items-center justify-between gap-2">
                  <h2 className="text-sm font-semibold text-slate-900">{event.title}</h2>
                  <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-0.5 text-xs capitalize text-slate-700">
                    {event.status}
                  </span>
                </div>
                <div className="mt-2 text-xs text-slate-500">
                  {new Date(event.startsAt).toLocaleString()}
                </div>
                <div className="mt-2 text-xs text-slate-500">
                  Bookings: {event.bookedCount ?? 0}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
