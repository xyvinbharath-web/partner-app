"use client";

import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { usePartnerEvent } from "@/hooks/usePartnerEvent";
import { usePartnerEventMutations } from "@/hooks/usePartnerEvents";

export default function PartnerEventDetailPage() {
  const params = useParams<{ id: string }>();
  const eventId = params?.id;
  const router = useRouter();

  const { data, isLoading } = usePartnerEvent(eventId);
  const { updateEvent, deleteEvent, approveBooking, rejectBooking, updating, deleting } =
    usePartnerEventMutations();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startsAt, setStartsAt] = useState("");
  const [endsAt, setEndsAt] = useState("");
  const [capacity, setCapacity] = useState("");

  useEffect(() => {
    if (data) {
      setTitle(data.title);
      setDescription(data.description ?? "");
      setStartsAt(data.startsAt ? data.startsAt.slice(0, 16) : "");
      setEndsAt(data.endsAt ? data.endsAt.slice(0, 16) : "");
      setCapacity(data.capacity ? String(data.capacity) : "");
    }
  }, [data]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventId) return;
    await updateEvent({
      id: eventId,
      payload: {
        title,
        description,
        startsAt: startsAt ? new Date(startsAt).toISOString() : data?.startsAt!,
        endsAt: endsAt ? new Date(endsAt).toISOString() : data?.endsAt,
        capacity: capacity ? Number(capacity) : undefined,
      },
    });
  };

  const handleDelete = async () => {
    if (!eventId) return;
    await deleteEvent(eventId);
    router.push("/partner/events");
  };

  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={() => router.back()}
        className="text-xs font-medium text-slate-600 hover:text-slate-900"
      >
        ← Back to events
      </button>

      {isLoading || !data ? (
        <div className="text-sm text-slate-500">Loading event...</div>
      ) : (
        <>
          <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
            <div>
              <h1 className="text-lg font-semibold">{data.title}</h1>
              <p className="text-sm text-slate-500">
                Manage this event, bookings, and performance.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-medium capitalize text-slate-700">
                {data.status}
              </span>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-medium text-rose-700 hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-4 rounded-xl border bg-white p-4 md:col-span-2 md:p-6">
              <h2 className="text-sm font-semibold text-slate-900">Event details</h2>
              <form className="space-y-4" onSubmit={handleSave}>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">Title</label>
                  <input
                    type="text"
                    className="w-full rounded-md border px-3 py-2 text-sm"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">Description</label>
                  <textarea
                    className="w-full rounded-md border px-3 py-2 text-sm"
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-slate-700">Starts at</label>
                    <input
                      type="datetime-local"
                      className="w-full rounded-md border px-3 py-2 text-sm"
                      value={startsAt}
                      onChange={(e) => setStartsAt(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-slate-700">Ends at</label>
                    <input
                      type="datetime-local"
                      className="w-full rounded-md border px-3 py-2 text-sm"
                      value={endsAt}
                      onChange={(e) => setEndsAt(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">Capacity</label>
                  <input
                    type="number"
                    min={1}
                    className="w-full rounded-md border px-3 py-2 text-sm"
                    value={capacity}
                    onChange={(e) => setCapacity(e.target.value)}
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={updating}
                    className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {updating ? "Saving..." : "Save changes"}
                  </button>
                </div>
              </form>
            </div>

            <div className="space-y-4 md:col-span-1">
              <div className="space-y-3 rounded-xl border bg-white p-4 md:p-6">
                <h2 className="text-sm font-semibold text-slate-900">Performance</h2>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="rounded-lg bg-slate-50 p-3">
                    <div className="text-slate-500">Views</div>
                    <div className="mt-1 text-lg font-semibold text-slate-900">
                      {data.views ?? 0}
                    </div>
                  </div>
                  <div className="rounded-lg bg-slate-50 p-3">
                    <div className="text-slate-500">Bookings</div>
                    <div className="mt-1 text-lg font-semibold text-slate-900">
                      {data.bookedCount ?? 0}
                    </div>
                  </div>
                  <div className="rounded-lg bg-slate-50 p-3">
                    <div className="text-slate-500">Revenue</div>
                    <div className="mt-1 text-lg font-semibold text-slate-900">
                      ₹{data.revenue?.toLocaleString() ?? "0"}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3 rounded-xl border bg-white p-4 md:p-6">
                <h2 className="text-sm font-semibold text-slate-900">Bookings</h2>
                <div className="space-y-2 text-xs">
                  {Array.isArray((data as any).bookings) && (data as any).bookings.length > 0 ? (
                    (data as any).bookings.map((booking: any) => (
                      <div
                        key={booking._id}
                        className="flex items-center justify-between gap-2 rounded-lg bg-slate-50 p-2"
                      >
                        <div className="space-y-0.5">
                          <div className="font-medium text-slate-900">
                            {typeof booking.user === "string"
                              ? booking.user
                              : booking.user?.name || booking.user?.email || booking.user?.phone}
                          </div>
                          <div className="text-[11px] text-slate-500">
                            {booking.createdAt
                              ? new Date(booking.createdAt).toLocaleString()
                              : ""}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="inline-flex rounded-full bg-slate-100 px-2 py-0.5 text-[11px] capitalize text-slate-700">
                            {booking.status}
                          </span>
                          {booking.status === "pending" && (
                            <>
                              <button
                                type="button"
                                className="rounded-md bg-emerald-600 px-2 py-1 text-[11px] font-medium text-white hover:bg-emerald-700"
                                onClick={() =>
                                  approveBooking({ eventId: eventId as string, bookingId: booking._id })
                                }
                              >
                                Approve
                              </button>
                              <button
                                type="button"
                                className="rounded-md bg-rose-600 px-2 py-1 text-[11px] font-medium text-white hover:bg-rose-700"
                                onClick={() =>
                                  rejectBooking({ eventId: eventId as string, bookingId: booking._id })
                                }
                              >
                                Reject
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-xs text-slate-500">No bookings yet.</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
