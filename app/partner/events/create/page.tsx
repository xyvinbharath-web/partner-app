"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { usePartnerEventMutations } from "@/hooks/usePartnerEvents";
import { uploadEventBanner } from "@/services/partner/uploads";

export default function CreatePartnerEventPage() {
  const router = useRouter();
  const { createEvent, creating } = usePartnerEventMutations();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [eventStartsAt, setEventStartsAt] = useState("");
  const [eventEndsAt, setEventEndsAt] = useState("");
  const [bookingOpensAt, setBookingOpensAt] = useState("");
  const [bookingClosesAt, setBookingClosesAt] = useState("");
  const [capacity, setCapacity] = useState("");
  const [isFree, setIsFree] = useState(true);
  const [price, setPrice] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");
  const [bannerFile, setBannerFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let finalBannerUrl = bannerUrl || undefined;

    if (!finalBannerUrl && bannerFile) {
      finalBannerUrl = await uploadEventBanner(bannerFile);
    }

    await createEvent({
      title,
      description,
      // Core event dates
      startsAt: new Date(eventStartsAt).toISOString(),
      endsAt: eventEndsAt ? new Date(eventEndsAt).toISOString() : undefined,
      capacity: capacity ? Number(capacity) : undefined,
      // Booking window
      bookingOpensAt: bookingOpensAt ? new Date(bookingOpensAt).toISOString() : undefined,
      bookingClosesAt: bookingClosesAt ? new Date(bookingClosesAt).toISOString() : undefined,
      // Pricing
      isFree,
      price: !isFree && price ? Number(price) : undefined,
      // Banner image URL (optional)
      bannerUrl: finalBannerUrl,
    });
    router.push("/partner/events");
  };

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <div>
        <h1 className="text-lg font-semibold text-black">Create event</h1>
        <p className="text-sm text-slate-500">
          Set up a new event for your learners.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-xl border bg-white p-4 md:p-6"
      >
        <div className="space-y-1">
          <label className="text-sm font-medium text-black">Title</label>
          <input
            type="text"
            required
            className="w-full rounded-md border px-3 py-2 text-sm"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-black">Description</label>
          <textarea
            className="w-full rounded-md border px-3 py-2 text-sm"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1">
            <label className="text-sm font-medium text-black">Event starts at</label>
            <input
              type="datetime-local"
              required
              className="w-full rounded-md border px-3 py-2 text-sm"
              value={eventStartsAt}
              onChange={(e) => setEventStartsAt(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-black">Event ends at (optional)</label>
            <input
              type="datetime-local"
              className="w-full rounded-md border px-3 py-2 text-sm"
              value={eventEndsAt}
              onChange={(e) => setEventEndsAt(e.target.value)}
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1">
            <label className="text-sm font-medium text-black">Bookings open at</label>
            <input
              type="datetime-local"
              className="w-full rounded-md border px-3 py-2 text-sm"
              value={bookingOpensAt}
              onChange={(e) => setBookingOpensAt(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-black">Bookings close at</label>
            <input
              type="datetime-local"
              className="w-full rounded-md border px-3 py-2 text-sm"
              value={bookingClosesAt}
              onChange={(e) => setBookingClosesAt(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-black">Capacity (optional)</label>
          <input
            type="number"
            min={1}
            className="w-full rounded-md border px-3 py-2 text-sm"
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-black">Ticket pricing</label>
          <div className="flex items-center gap-3 text-sm">
            <label className="inline-flex items-center gap-2">
              <input
                type="radio"
                className="h-4 w-4"
                checked={isFree}
                onChange={() => setIsFree(true)}
              />
              <span className="text-black">Free entry</span>
            </label>
            <label className="inline-flex items-center gap-2">
              <input
                type="radio"
                className="h-4 w-4"
                checked={!isFree}
                onChange={() => setIsFree(false)}
              />
              <span className="text-black">Paid ticket</span>
            </label>
          </div>
          {!isFree && (
            <div className="space-y-1">
              <label className="text-sm font-medium text-black">Ticket price</label>
              <input
                type="number"
                min={0}
                className="w-full rounded-md border px-3 py-2 text-sm"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-black">Event banner</label>
          <input
            type="file"
            accept="image/*"
            className="block w-full text-sm text-slate-700"
            onChange={(e) => {
              const file = e.target.files?.[0] || null;
              setBannerFile(file);
            }}
          />
          <p className="text-xs text-slate-500">
            Upload an image to show as the banner for this event.
          </p>
        </div>

        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-md border px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={creating}
            className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {creating ? "Creating..." : "Create event"}
          </button>
        </div>
      </form>
    </div>
  );
}
