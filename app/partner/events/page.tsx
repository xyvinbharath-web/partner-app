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
    <div className="space-y-4">
      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
        <div>
          <h1 className="text-lg font-semibold">Events</h1>
          <p className="text-sm text-slate-500">
            Manage your upcoming events, bookings, and performance.
          </p>
        </div>
        <Link
          href="/partner/events/create"
          className="inline-flex items-center justify-center rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
        >
          Create event
        </Link>
      </div>

      <form onSubmit={handleSearch} className="flex flex-col gap-2 md:flex-row md:items-center">
        <input
          type="text"
          className="flex-1 rounded-md border px-3 py-2 text-sm"
          placeholder="Search events by title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="rounded-md border px-3 py-2 text-sm"
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
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
        >
          Filter
        </button>
      </form>

      {isLoading && <div className="text-sm text-slate-500">Loading events...</div>}
      {isError && (
        <div className="text-sm text-rose-500">Failed to load events. Please try again.</div>
      )}

      {!isLoading && data && data.records.length === 0 && (
        <div className="rounded-xl border bg-white p-6 text-center text-sm text-slate-500">
          No events found. Create your first event to get started.
        </div>
      )}

      {/* Desktop table */}
      {!isLoading && data && data.records.length > 0 && (
        <div className="hidden overflow-hidden rounded-xl border bg-white md:block">
          <table className="min-w-full divide-y text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-2 text-left font-medium text-slate-600">Title</th>
                <th className="px-4 py-2 text-left font-medium text-slate-600">Start</th>
                <th className="px-4 py-2 text-left font-medium text-slate-600">Status</th>
                <th className="px-4 py-2 text-right font-medium text-slate-600">Bookings</th>
                <th className="px-4 py-2 text-right font-medium text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {data.records.map((event) => (
                <tr key={event._id} className="hover:bg-slate-50">
                  <td className="px-4 py-2 text-sm font-medium text-slate-900">
                    {event.title}
                  </td>
                  <td className="px-4 py-2 text-sm text-slate-600">
                    {new Date(event.startsAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-2 text-sm">
                    <span className="inline-flex rounded-full bg-slate-100 px-2 py-0.5 text-xs capitalize text-slate-700">
                      {event.status}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-right text-sm text-slate-600">
                    {event.bookedCount ?? 0}
                  </td>
                  <td className="px-4 py-2 text-right text-sm">
                    <Link
                      href={`/partner/events/${event._id}`}
                      className="text-sm font-medium text-slate-900 hover:underline"
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
              <div className="rounded-xl border bg-white p-4">
                <div className="flex items-center justify-between gap-2">
                  <h2 className="text-sm font-semibold text-slate-900">{event.title}</h2>
                  <span className="inline-flex rounded-full bg-slate-100 px-2 py-0.5 text-xs capitalize text-slate-700">
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
